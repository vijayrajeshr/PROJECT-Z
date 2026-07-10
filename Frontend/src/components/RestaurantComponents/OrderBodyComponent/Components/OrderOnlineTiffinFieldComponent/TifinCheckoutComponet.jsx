import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import "./TiffinCheckoutPage.css";
import PhoneInput from "./Phone_With_CountryCode";
import { useCheckout } from "../../../../../context/CheckoutProvider";
import moment from "moment";
import axios from "axios";
import OfferPopup from "./Offer_Popup";
import NavigationBar from "../../../../Navbars/NavigationBar2/NavigationBar2";
import { useNavigate } from "react-router-dom";
import { detectLocation } from "../../../../HomeComponents/PopularPlaces/CurrentLocation/detectLocation";

const TiffinCheckoutPage = () => {
  const {
    selectedPlan,
    selecetedMealType,
    mealType,
    planType,
    startDate,
    endDate,
    quantity,
    totalPrice,
    selectedDates,
    Taxes,
    Charges,
    Offers,
    plan,
    TiffinName,
    Address,
    resetCheckoutData,
  } = useCheckout();
  console.log(Offers,Taxes)
  const navigate = useNavigate();

  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    mobile: {
      countryCode: "+1",
      number: "",
      fullNumber: "",
    },
    address: "",
    billing: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");

  const filterMealType = mealType.filter(
    (mealType) => selecetedMealType === mealType.mealTypeId
  );

  const filterMealPlan = plan.filter((plan) => selectedPlan === plan.label);
  const selectedPlan_Id = filterMealPlan.map((Plan) => Plan._id);

  const validateBillingDetails = () => {
    if (!cartItems || cartItems.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "No items in cart",
      }));
      return false;
    }

    const item = cartItems[0]; // Since we're working with a single item

    if (!item.name || item.name.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "Meal type not selected",
      }));
      return false;
    }

    if (!item.plan) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "Plan not selected",
      }));
      return false;
    }

    // Validate dates based on plan type
    if (item.planType === "normal" && !item.startDate) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "Start date not selected",
      }));
      return false;
    }

    if (item.planType === "date-range" && (!item.startDate || !item.endDate)) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "Both start and end dates are required",
      }));
      return false;
    }

    if (
      item.planType === "flexi-dates" &&
      (!item.selectedDates || item.selectedDates.length === 0)
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        billing: "No delivery dates selected",
      }));
      return false;
    }

    return true;
  };

  const validateUserDetails = () => {
    const errors = {};
    let isValid = true;

    // Name validation
    if (!userDetails.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (userDetails.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(userDetails.name.trim())) {
      errors.name = "Name should only contain letters and spaces";
      isValid = false;
    }

    // Address validation
    if (addressType === "specific" && !userDetails.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (
      addressType === "specific" &&
      userDetails.address.trim().length < 10
    ) {
      errors.address = "Please enter a complete address (min 10 characters)";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Clear validation error when user starts typing
  if (validationErrors[name]) {
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const handleApplyOffer = (offerCode) => {
    const offer = Offers.find((o) => o.code === offerCode);

    const pan = offer.mealPlans.map((Plan) => Plan);

    // console.log("Plan is:", pan);

    if (!offer) {
      alert("Invalid offer code");
      return;
    }

    if (!offer.active) {
      alert("This offer is no longer active");
      return;
    }

    const now = new Date();
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);

    if (now < startDate || now > endDate) {
      alert("This offer has expired");
      return;
    }

    // Validate offer scope
    if (
      offer.scope === "MealType-specific" &&
      offer.mealTypes.length > 0 &&
      !offer.mealTypes.find(
        (mealType) => mealType.mealTypeId === selecetedMealType
      )
    ) {
      alert("This offer is not valid for the selected meal type");
      return;
    }

    if (
      offer.scope === "MealPlan-Specific" &&
      offer.mealPlans.length > 0 &&
      !offer.mealPlans.includes(selectedPlan_Id[0])
    ) {
      alert("This offer is not valid for the selected plan");
      return;
    }

    // Calculate discount
    let discountAmount;
    if (offer.type === "percentage") {
      discountAmount = (subtotal * offer.discount) / 100;
    } else {
      discountAmount = offer.discount;
    }

    setActiveOffer(offer);
    setAppliedDiscount(discountAmount);
    setShowOfferPopup(false);
    alert(`Offer applied successfully! You saved ₹${discountAmount}`);
  };

  // console.log("Applied offer", activeOffer);
  // console.log("Apply discount", appliedDiscount);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB"); // 'en-GB' uses DD/MM/YYYY format
  };

  const getPlanDates = (planType, startDate, endDate, selectedDates) => {
    if (planType === "normal") {
      return { startDate: formatDate(startDate), endDate: null };
    } else if (planType === "date-range") {
      return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    } else if (planType === "flexi-dates") {
      return { selectedDates: selectedDates.map((date) => formatDate(date)) };
    }
    return {};
  };

  const planDates = getPlanDates(planType, startDate, endDate, selectedDates);

  const mealTypeName = filterMealType.map((meal) => meal.label);

  useEffect(() => {
    if (TiffinName && Address) {
      localStorage.setItem("Tiffin_Name", TiffinName);
      localStorage.setItem("Tiffin_Address", Address);
    }
  }, [TiffinName, Address]);

  const tiffin_Name = localStorage.getItem("Tiffin_Name");
  const tiffin_Address = localStorage.getItem("Tiffin_Address");

  const [cartItems, setCartItems] = useState(() => {
    const storedData = localStorage.getItem("CheckoutData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch (err) {
        console.error("Error parsing CheckoutData from localStorage:", err);
      }
    }

    return [
      {
        id: 1,
        name: mealTypeName,
        price: totalPrice,
        quantity: quantity,
        planType: planType,
        plan: selectedPlan,
        ...planDates,
      },
    ];
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    mobile: {
      countryCode: "+1",
      number: "",
      fullNumber: "",
    },
    address: "",
    specialInstructions: "",
    allergies: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (mealTypeName && selectedPlan && quantity > 0 && planDates) {
      setCartItems([
        {
          id: 1,
          name: mealTypeName,
          price: totalPrice,
          quantity: quantity,
          planType: planType,
          plan: selectedPlan,
          ...planDates,
        },
      ]);
    }
  }, [
    selectedPlan,
    selecetedMealType,
    totalPrice,
    quantity,
    planType,
    startDate,
    endDate,
    mealType,
    plan,
  ]);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("CheckoutData", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const [addressType, setAddressType] = useState("current");
  const [showOtherCharges, setShowOtherCharges] = useState(false);

  const handleQuantityChange = (id, change) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 40;

  const calculateOtherCharges = () => {
    let totalOtherCharges = 0;
    let breakdown = [];

    // Adding Charges
    Charges.forEach((charge) => {
      let chargeAmount =
        charge.type === "percentage"
          ? (calculateSubtotal() * parseFloat(charge.value)) / 100
          : parseFloat(charge.value);

      totalOtherCharges += chargeAmount;
      breakdown.push({ name: charge.name, amount: chargeAmount });
    });

    // Adding Taxes
    Taxes.forEach((tax) => {
      if (tax.isApplicable) {
        let taxAmount = (calculateSubtotal() * parseFloat(tax.rate)) / 100;
        totalOtherCharges += taxAmount;
        breakdown.push({ name: tax.name, amount: taxAmount });
      }
    });

    return { totalOtherCharges, breakdown };
  };

  const { totalOtherCharges, breakdown } = calculateOtherCharges();

  const subtotal = calculateSubtotal();

  const finalTotal =
    calculateSubtotal() - appliedDiscount + deliveryCharge + totalOtherCharges;
  const formattedFinalTotal = Math.round(finalTotal);

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleDetectLocation = () => {
    detectLocation((location) => {
      setCurrentLocation(location);
      setUserDetails((prev) => ({
        ...prev,
        address: location,
      }));
      if (!recentLocations.includes(location)) {
        setRecentLocations((prev) => [location, ...prev].slice(0, 5));
      }
    });
  };

  const handleAddressChange = (e) => {
    const updatedAddress = e.target.value;
    setUserDetails((prev) => ({
      ...prev,
      address: updatedAddress,
    }));
    validateAddress(updatedAddress);
  };

  const validateAddress = (address) => {
    setValidationErrors((prev) => ({
      ...prev,
      address:
        address.length < 10
          ? "Please enter a complete address (min 10 characters)"
          : "",
    }));
  };

  const initializeSubStatus = (order) => {
    const subStatus = [];
    const today = moment().startOf("day").local();
    // console.log("Today is:", today);

    if (order.flexiblePlan.type === "normal") {
      const startDate = moment(order.startDate).local();
      const endDate = moment(order.startDate)
        .local()
        .add(parseInt(order.flexiblePlan.plan, 10), "days");

      for (
        let date = startDate.clone();
        date.isBefore(endDate, "day");
        date.add(1, "day")
      ) {
        subStatus.push({
          date: date.toDate(),
          status: date.isSameOrBefore(today) ? "Not Delivered" : null,
        });
      }
    } else if (order.flexiblePlan.type === "date-range") {
      const startDate = moment(order.flexiblePlan.startDate).local();
      const endDate = moment(order.flexiblePlan.endDate).local();

      for (
        let date = startDate.clone();
        date.isBefore(endDate, "day");
        date.add(1, "day")
      ) {
        subStatus.push({
          date: date.toDate(),
          status: date.isSameOrBefore(today) ? "Not Delivered" : null,
        });
      }
    } else if (order.flexiblePlan.type === "flexi-dates") {
      order.flexiblePlan.flexiDates.forEach((date) => {
        const parsedDate = moment(date).local();
        subStatus.push({
          date: parsedDate.toDate(),
          status: parsedDate.isSameOrBefore(today) ? "Not Delivered" : null,
        });
      });
    }

    return subStatus;
  };

  const createCheckoutData = [
    {
      customer: userDetails.name,
      tiffinName: tiffin_Name,
      phone: {
        countryCode: userDetails.mobile.countryCode,
        number: userDetails.mobile.number,
        fullNumber: userDetails.mobile.countryCode + userDetails.mobile.number,
      },
      address: userDetails.address,
      tiffinAddress: tiffin_Address,
      email: "gamiyash15@gmail.com",
      total: `${formattedFinalTotal}`,
      appliedOffer: activeOffer,
      appliedDiscount: appliedDiscount,
      appliedCharges: Charges,
      appliedTaxes: Taxes,
      subTotal: subtotal,
      status: "New Order",
      time: new Date(),
      startDate:
        cartItems[0].planType === "flexi-dates"
          ? new Date(selectedDates[0])
          : new Date(startDate),
      specialInstructions: userDetails.specialInstructions,
      distance: "4 KM",
      mealType: cartItems[0].name.toString(),
      quantity: cartItems[0].quantity,
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      flexiblePlan: {
        type: cartItems[0].planType,
        ...(cartItems[0].planType === "normal" && {
          plan: cartItems[0].plan,
        }),
        ...(cartItems[0].planType === "date-range" && {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }),
        ...(cartItems[0].planType === "flexi-dates" && {
          flexiDates: selectedDates.map((date) => new Date(date)),
        }),
      },
      subStatus: [],
    },
  ];

  const updatedOrder = createCheckoutData.map((order) => {
    return {
      ...order,
      subStatus: initializeSubStatus(order),
    };
  });
  // console.log("updatedOrdesr:", updatedOrder);
  console.log("Active offer:", activeOffer);

  const submitOrder = async () => {
    if (isSubmitting) return;

    // Clear any existing validation messages
    setValidationErrors({});

    // Validate both user details and billing details
    const isUserDetailsValid = validateUserDetails();
    const isBillingValid = validateBillingDetails();

    if (!isUserDetailsValid || !isBillingValid) {
      // Find and scroll to the first error message
      setTimeout(() => {
        const firstError = document.querySelector(".error-message");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = updatedOrder;
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/saveOrders`,
        orderData,
        { withCredentials: true }
      );
      // console.log("SERVER RESPONSE:", response.data);
      alert("Your Order Placed Successfully");
      setCartItems([]);
      localStorage.removeItem("CheckoutData");
      localStorage.removeItem("Tiffin_Name");
      localStorage.removeItem("Tiffin_Address");
      resetCheckoutData();
      navigate("/History");
    } catch (error) {
      console.error(
        "Error submitting order:",
        error.response?.data || error.message
      );
      alert("There was an error in the order process");
    } finally {
      setIsSubmitting(false);
    }
  };
  // console.log("userDetails.mobile:", userDetails.mobile);
  // console.log("validationErrors:", validationErrors);
  // console.log("Checkout Data:", updatedOrder)

  return (
    <>
      <div className="bg-[#f8f8f8] w-full">
        <div>
          <NavigationBar />
        </div>
        <div>
          {showOfferPopup && (
            <OfferPopup
              offers={Offers}
              onClose={() => setShowOfferPopup(false)}
              applyOffer={handleApplyOffer}
              isOpen={showOfferPopup}
              mealTypes={mealType}
              planTypes={plan}
            />
          )}
        </div>
        <div className="w-[80vw] md:flex-row flex flex-col mx-auto mt-2 gap-5">
          <div className="md:w-1/2 w-full bg-white shadow-md rounded-md p-5">
            <h2>Delivery Details</h2>
            <div className="user-form">
              <div className="form-group mt-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className={`${
                    validationErrors.name ? "error-input" : "width-full"
                  } width-full`}
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <PhoneInput
                  value={userDetails.mobile}
                  onChange={handleInputChange}
                  errors={validationErrors.mobile}
                  required
                  className={`${
                    validationErrors.mobile ? "error-input" : "width-full"
                  } width-full`}
                />
              </div>
              <div className="input-container">
                <textarea
                  type="text"
                  className="custom-input width-full"
                  placeholder="Enter your address"
                  value={userDetails.address || currentLocation}
                  onChange={handleAddressChange}
                />
                {validationErrors.address && (
                  <span className="error-message">
                    {validationErrors.address}
                  </span>
                )}
              </div>
              <button
                className="location-btn"
                onClick={handleDetectLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? "Detecting..." : "Detect Current Location"}{" "}
                <FaMapMarkerAlt />
              </button>

              <textarea
                name="specialInstructions"
                placeholder="Special Instructions (optional)"
                value={userDetails.specialInstructions}
                onChange={handleInputChange}
              />
              <textarea
                name="allergies"
                placeholder="Any allergies? (optional)"
                value={userDetails.allergies}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="md:w-1/2 w-full bg-white shadow-md rounded-md p-5">
            <div className="flex items-center gap-2">
              <div>
                <img
                  width={45}
                  src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100,c_fill/2b4f62d606d1b2bfba9ba9e5386fabb7"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-start items-start mb-2">
                <div className="font-bold">{tiffin_Name}</div>
                <div>{tiffin_Address}</div>
              </div>
            </div>
            {/* <h2>Order Summary</h2> */}
            {validationErrors.billing && (
              <div className="billing-error-message">
                {validationErrors.billing}
              </div>
            )}

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id}>
                  <div className="cart-item">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                    <div className="quantityContainer">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="buttons decrementButton"
                      >
                        -
                      </button>
                      <span className="quantityDisplay">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="buttons incrementButton"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Plan Type & Dates Display */}
                  <div className="item-details">
                    <span className="item-name">
                      Plan: {item.plan}{" "}
                      {item.planType === "normal" ? "days plan" : ""}
                    </span>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      {item.planType === "normal" && (
                        <span className="item-price">
                          Start Date: {item.startDate}
                        </span>
                      )}
                      {item.planType === "date-range" && (
                        <>
                          <span className="item-price">
                            Start Date: {item.startDate}
                          </span>
                          <span className="item-price">
                            End Date: {item.endDate}
                          </span>
                        </>
                      )}
                      {item.planType === "flexi-dates" && (
                        <div className="item-price">
                          <span>Selected Dates:</span>
                          <ul
                            style={{
                              display: "flex",
                              alignContent: "center",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {item.selectedDates.map((date, index) => (
                              <li
                                key={index}
                                style={{
                                  backgroundColor: "#E0E0E0",
                                  padding: "4px",
                                  borderRadius: "5px",
                                  fontSize: "10px",
                                  justifyContent: "center",
                                }}
                              >
                                {date}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="billing-details">
              <h3>Bill Details</h3>
              <div className="bill-row">
                <span>Item Total</span>
                <span>${subtotal}</span>
              </div>
              {!activeOffer ? (
                <div className="bill-row discount">
                  <span onClick={() => setShowOfferPopup(!showOfferPopup)}>
                    Apply Discount
                  </span>
                </div>
              ) : (
                <div className="bill-row discount">
                  <span>
                    Discount Applied ({activeOffer.code})
                    <button
                      onClick={() => {
                        setActiveOffer(null);
                        setAppliedDiscount(0);
                      }}
                      className="ml-2 text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </span>
                  <span>-${appliedDiscount}</span>
                </div>
              )}
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>${deliveryCharge}</span>
              </div>
              <div className="other-charges">
                <div
                  className="bill-row"
                  onClick={() => setShowOtherCharges(!showOtherCharges)}
                >
                  <span>
                    Other Taxes & Charges{" "}
                    {showOtherCharges ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                  <span>${totalOtherCharges.toFixed(2)}</span>
                </div>
                {showOtherCharges && (
                  <div className="charges-breakdown">
                    {breakdown.map((item, index) => (
                      <div key={index} className="bill-row">
                        <span>{item.name}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bill-row total">
                <span>Total</span>
                <span>${formattedFinalTotal}</span>
              </div>
              <div>
                <div>
                  <button
                    onClick={submitOrder}
                    disabled={isSubmitting}
                    className={
                      isSubmitting ? "submit-button-disabled" : "submit-button"
                    }
                  >
                    {isSubmitting ? "Placing Order..." : "Submit Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TiffinCheckoutPage;
