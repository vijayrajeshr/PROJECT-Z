import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../../../context/CartCotent";
import { useCheckout } from "../../../../../context/CheckoutProvider";
import CalendarComponent from "./CalenderComponet";
import styles from "./OrderOnlineFieldComponent.module.css";
import Offers from "./OffersRender";
import OrderInstructions from "./Instructions";

function TiffinServiceComponent({ setServiceType }) {
  const { id } = useParams();
  const { addItemToCart, cart } = useCart();
  const navigate = useNavigate();

  const [tiffinData, setTiffinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [MainImage, setMainImage] = useState(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const {
    plan,
    setPlan,
    selectedPlan,
    setselectedPlan,
    selecetedMealType,
    setselecetedMealType,
    mealType,
    setMealType,
    planType,
    setPlanType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    quantity,
    setQuantity,
    totalPrice,
    setTotalPrice,
    selectedDates,
    setSelectedDates,
    // Add these to useCheckoutProvider if you want them globally managed
    // Taxes,
    // setTaxes,
    // Charges,
    // setCharges,
    // Offers,
    // setOffers,
    // TiffinName,
    // setTiffinName,
    // setAddress,
    selectedDeliverySlot, // New state from useCheckout
    setSelectedDeliverySlot, // New setter from useCheckout
  } = useCheckout();

  // Local states for fetched data that aren't managed by CheckoutProvider
  const [localTaxes, setLocalTaxes] = useState([]);
  const [localCharges, setLocalCharges] = useState([]);
  const [localOffers, setLocalOffers] = useState([]);
  const [localTiffinName, setLocalTiffinName] = useState("");
  const [localAddress, setLocalAddress] = useState("");

  const showNotification = useCallback((message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationBar(true);
    setTimeout(() => {
      setShowNotificationBar(false);
      setNotificationMessage("");
    }, 3000);
  }, []);

  useEffect(() => {
    if (tiffinData && tiffinData._id) {
      const itemInCart = cart?.items?.find(
        (item) => item.productId === tiffinData._id
      );
      if (itemInCart) {
        setQuantity(itemInCart.quantity);
        // Also set selected delivery slot if item is already in cart
        if (itemInCart.deliverySlot) {
          setSelectedDeliverySlot(itemInCart.deliverySlot);
        }
      } else {
        setQuantity(1);
        setSelectedDeliverySlot(""); // Reset when no item in cart
      }
    }
  }, [tiffinData, cart, setQuantity, setSelectedDeliverySlot]);

  const handleAddToCart = async () => {
    if (!tiffinData) {
      showNotification("Error: Tiffin data not loaded.", "error");
      return;
    }

    if (quantity <= 0) {
      setValidationError("Quantity must be at least 1.");
      return;
    }

    if (
      planType === "flexi-dates" &&
      (!selectedDates || selectedDates.length === 0)
    ) {
      setValidationError(
        "Please select delivery dates for your flexible dates plan."
      );
      return;
    }

    if (!selectedDeliverySlot) {
      setValidationError("Please select a delivery time slot.");
      return;
    }

    if (!policyAccepted) {
      setValidationError("Please accept our terms and policies to continue.");
      return;
    }

    setValidationError("");

    let calculatedEndDate = null;
    let finalStartDate = startDate;

    if (tiffinData.itemType === "tiffin") {
      if (planType === "normal") {
        const selectedPlanObject = tiffinData.menu.plans.find(
          (p) => p.label === selectedPlan
        );
        if (
          selectedPlanObject &&
          typeof selectedPlanObject.duration === "number"
        ) {
          calculatedEndDate = new Date(startDate);
          calculatedEndDate.setDate(
            calculatedEndDate.getDate() + selectedPlanObject.duration
          );
        } else {
          showNotification(
            "Error: Tiffin plan duration not found for normal plan.",
            "error"
          );
          return;
        }
      } else if (planType === "date-range") {
        calculatedEndDate = endDate;
      } else if (planType === "flexi-dates") {
        if (selectedDates && selectedDates.length > 0) {
          const sortedDates = [...selectedDates].sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
          finalStartDate = new Date(sortedDates[0]);
          calculatedEndDate = new Date(sortedDates[sortedDates.length - 1]);
        } else {
          showNotification(
            "Error: No dates selected for flexible plan.",
            "error"
          );
          return;
        }
      }
    }

    const planSelectedObject = plan.find((item) => item.label === selectedPlan);
    const mealTypeSelectedObject = mealType.find(
      (mt) => mt.mealTypeId === selecetedMealType
    );

    if (!planSelectedObject || !mealTypeSelectedObject) {
      showNotification(
        "Error: Selected plan or meal type not found. Please re-select.",
        "error"
      );
      return;
    }

    const itemToAdd = {
      productId: tiffinData._id,
      name: tiffinData.kitchenName,
      description: tiffinData.description || "",
      img:
        MainImage ||
        tiffinData.images[0] ||
        "https://placehold.co/150x150/cccccc/333333?text=No+Image",
      quantity: quantity,
      price: totalPrice,
      foodType:
        tiffinData.category && tiffinData.category.includes("veg")
          ? "Vegetarian"
          : "Non-Vegetarian",
      itemType: "tiffin",
      productModelType: "Tiffin",
      sourceEntityId: tiffinData._id,
      sourceEntityName: "Tiffin",
      mealType: {
        id: mealTypeSelectedObject.mealTypeId,
        name: mealTypeSelectedObject.label,
      },
      selectedPlan: {
        id: planSelectedObject._id,
        name: planSelectedObject.label,
      },
      startDate: finalStartDate ? finalStartDate.toISOString() : null,
      endDate: calculatedEndDate ? calculatedEndDate.toISOString() : null,
      selectedDates:
        planType === "flexi-dates"
          ? selectedDates.map((date) => new Date(date).toISOString())
          : [],
      deliverySlot: selectedDeliverySlot, // Add selected delivery slot
    };

    try {
      addItemToCart(itemToAdd);
      showNotification(
        `${quantity} x ${tiffinData.kitchenName} added to cart.`
      );
    } catch (cartError) {
      console.error("Error adding to cart:", cartError);
      showNotification("Failed to add item to cart.", "error");
    }
  };

  const handleProceedToCheckout = () => {
    if (quantity <= 0) {
      setValidationError("Quantity must be at least 1.");
      return;
    }
    if (
      planType === "flexi-dates" &&
      (!selectedDates || selectedDates.length === 0)
    ) {
      setValidationError(
        "Please select delivery dates for your flexible dates plan."
      );
      return;
    }
    if (!selectedDeliverySlot) {
      setValidationError("Please select a delivery time slot.");
      return;
    }
    if (!policyAccepted) {
      setValidationError("Please accept our terms and policies to continue.");
      return;
    }

    setValidationError("");
    handleAddToCart(); // Ensure item is added to cart before navigating
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchTiffinData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error("Tiffin ID is required");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-tiffin/${id}`,
          { withCredentials: true }
        );

        if (!response.data.tiffin) {
          throw new Error("Tiffin data not found in response");
        }
        const fetchedTiffin = response.data.tiffin;
        setTiffinData(fetchedTiffin);
        setServiceType("tiffins");
        let allPlans = [...(fetchedTiffin.menu?.plans || [])];
        if (fetchedTiffin.menu?.isFlexibleDates) {
          if (!allPlans.some((p) => p.label === "Custom Date Range")) {
            allPlans.push({
              _id: "date-range",
              label: "Custom Date Range",
              duration: 0,
            });
          }
          if (!allPlans.some((p) => p.label === "Flexible Dates")) {
            allPlans.push({
              _id: "flexi-dates",
              label: "Flexible Dates",
              duration: 0,
            });
          }
        }
        setPlan(allPlans);

        const fetchedMealTypes = fetchedTiffin.menu?.mealTypes || [];
        setMealType(fetchedMealTypes);

        const initialSelectedPlanLabel = allPlans[0]?.label || "";
        setselectedPlan(initialSelectedPlanLabel);

        if (initialSelectedPlanLabel === "Custom Date Range") {
          setPlanType("date-range");
        } else if (initialSelectedPlanLabel === "Flexible Dates") {
          setPlanType("flexi-dates");
        } else {
          setPlanType("normal");
        }

        const initialSelectedMealTypeId = fetchedMealTypes[0]?.mealTypeId || "";
        setselecetedMealType(initialSelectedMealTypeId);

        if (
          fetchedTiffin.deliveryTimeSlots &&
          fetchedTiffin.deliveryTimeSlots.length > 0
        ) {
          setSelectedDeliverySlot(fetchedTiffin.deliveryTimeSlots[0]); // Set initial delivery slot
        } else {
          setSelectedDeliverySlot("");
        }

        if (fetchedTiffin.images?.length > 0) {
          setMainImage(fetchedTiffin.images[0]);
        } else {
          setMainImage(
            "https://tiffinstash.com/cdn/shop/files/TPVEG_7372805c-5752-44d3-8823-0da5442fb3be_1024x1024@2x.png?v=1735521866"
          );
        }

        setLocalTaxes(
          fetchedTiffin.tax?.filter((tax) => tax.isApplicable) || []
        );
        setLocalCharges(
          fetchedTiffin.charges?.filter((charge) => charge.isApplicable) || []
        );
        setLocalOffers(
          fetchedTiffin.offers?.filter((offer) => offer.active) || []
        );
        setLocalTiffinName(fetchedTiffin.kitchenName || "");
        setLocalAddress(fetchedTiffin.address || "");
      } catch (err) {
        console.error("Error fetching tiffin data:", err);
        setError(err.message || "Error fetching tiffin data");
      } finally {
        setLoading(false);
      }
    };
    fetchTiffinData();
  }, [
    id,
    setPlan,
    setMealType,
    setselectedPlan,
    setselecetedMealType,
    setPlanType,
    setMainImage,
    setSelectedDeliverySlot,
  ]);

  const handlePlanChange = useCallback(
    (e) => {
      const newPlanLabel = e.target.value;
      setselectedPlan(newPlanLabel);

      if (newPlanLabel === "Custom Date Range") {
        setPlanType("date-range");
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedDates([]);
      } else if (newPlanLabel === "Flexible Dates") {
        setPlanType("flexi-dates");
        setSelectedDates([]);
        setStartDate(new Date());
        setEndDate(null);
      } else {
        setPlanType("normal");
        setStartDate(new Date());
        setEndDate(null);
        setSelectedDates([]);
      }
    },
    [setselectedPlan, setPlanType, setStartDate, setEndDate, setSelectedDates]
  );

  useEffect(() => {
    if (!tiffinData || !tiffinData.menu) return;

    let currentAvailablePlans = [...tiffinData.menu.plans];
    let currentAvailableMealTypes = [...tiffinData.menu.mealTypes];

    if (planType === "normal" && selectedPlan) {
      const currentPlanObj = tiffinData.menu.plans.find(
        (p) => p.label === selectedPlan
      );
      if (currentPlanObj) {
        currentAvailableMealTypes = currentAvailableMealTypes.filter(
          (mealTypeItem) =>
            mealTypeItem.specificPlans.includes(currentPlanObj.label)
        );
      }
    }

    if (selecetedMealType) {
      const currentMealTypeObj = tiffinData.menu.mealTypes.find(
        (mt) => mt.mealTypeId === selecetedMealType
      );
      if (currentMealTypeObj) {
        const specificPlanLabels = currentMealTypeObj.specificPlans;
        currentAvailablePlans = currentAvailablePlans.filter((planItem) =>
          specificPlanLabels.includes(planItem.label)
        );
      }
    }

    if (tiffinData.menu.isFlexibleDates) {
      if (!currentAvailablePlans.some((p) => p.label === "Custom Date Range")) {
        currentAvailablePlans.push({
          _id: "date-range",
          label: "Custom Date Range",
          duration: 0,
        });
      }
      if (!currentAvailablePlans.some((p) => p.label === "Flexible Dates")) {
        currentAvailablePlans.push({
          _id: "flexi-dates",
          label: "Flexible Dates",
          duration: 0,
        });
      }
    }

    setPlan(currentAvailablePlans);
    setMealType(currentAvailableMealTypes);

    if (!currentAvailablePlans.some((p) => p.label === selectedPlan)) {
      const newDefaultPlan =
        currentAvailablePlans.length > 0 ? currentAvailablePlans[0].label : "";
      setselectedPlan(newDefaultPlan);
      if (newDefaultPlan === "Custom Date Range") {
        setPlanType("date-range");
      } else if (newDefaultPlan === "Flexible Dates") {
        setPlanType("flexi-dates");
      } else {
        setPlanType("normal");
      }
    }

    if (
      !currentAvailableMealTypes.some(
        (mt) => mt.mealTypeId === selecetedMealType
      )
    ) {
      setselecetedMealType(
        currentAvailableMealTypes.length > 0
          ? currentAvailableMealTypes[0].mealTypeId
          : ""
      );
    }
  }, [
    selectedPlan,
    selecetedMealType,
    tiffinData,
    planType,
    setPlan,
    setMealType,
    setselectedPlan,
    setselecetedMealType,
    setPlanType,
  ]);

  const calculateEndDate = useCallback(() => {
    if (!tiffinData || !tiffinData.menu || !tiffinData.menu.plans)
      return undefined;

    if (planType === "date-range") {
      return endDate;
    }

    if (planType === "flexi-dates") {
      if (selectedDates && selectedDates.length > 0) {
        const sortedDates = [...selectedDates].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        return new Date(sortedDates[sortedDates.length - 1]);
      }
      return undefined;
    }

    if (!startDate || !selectedPlan) return undefined;

    const planDurationObj = tiffinData.menu.plans.find(
      (p) => p.label === selectedPlan
    );
    if (!planDurationObj || typeof planDurationObj.duration !== "number")
      return undefined;

    const endDateCalc = new Date(startDate);
    endDateCalc.setDate(endDateCalc.getDate() + planDurationObj.duration);
    return endDateCalc;
  }, [startDate, endDate, selectedDates, planType, selectedPlan, tiffinData]);

  useEffect(() => {
    const calculatePrice = () => {
      if (!tiffinData || !selectedPlan || !selecetedMealType) {
        setTotalPrice(0);
        return;
      }

      const selectedMealTypeObj = tiffinData.menu.mealTypes.find(
        (meal) => meal.mealTypeId === selecetedMealType
      );

      if (!selectedMealTypeObj || !selectedMealTypeObj.prices) {
        setTotalPrice(0);
        return;
      }

      let basePrice = 0;

      if (planType === "normal") {
        const planPriceObj = tiffinData.menu.plans.find(
          (p) => p.label === selectedPlan
        );
        if (planPriceObj && selectedMealTypeObj.prices[planPriceObj._id]) {
          basePrice = selectedMealTypeObj.prices[planPriceObj._id];
        }
      } else if (planType === "date-range" && startDate && endDate) {
        const days =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        const oneDayPlan =
          tiffinData.menu.plans.find((p) => p.label === "1") ||
          tiffinData.menu.plans.reduce(
            (prev, curr) =>
              prev.duration && curr.duration && prev.duration < curr.duration
                ? prev
                : curr,
            { duration: Infinity }
          );

        if (
          days > 0 &&
          oneDayPlan &&
          selectedMealTypeObj.prices[oneDayPlan._id]
        ) {
          basePrice = selectedMealTypeObj.prices[oneDayPlan._id] * days;
        } else {
          basePrice = 0;
        }
      } else if (planType === "flexi-dates") {
        const days = selectedDates.length;
        const oneDayPlan =
          tiffinData.menu.plans.find((p) => p.label === "1") ||
          tiffinData.menu.plans.reduce(
            (prev, curr) =>
              prev.duration && curr.duration && prev.duration < curr.duration
                ? prev
                : curr,
            { duration: Infinity }
          );

        if (
          days > 0 &&
          oneDayPlan &&
          selectedMealTypeObj.prices[oneDayPlan._id]
        ) {
          basePrice = selectedMealTypeObj.prices[oneDayPlan._id] * days;
        } else {
          basePrice = 0;
        }
      }
      setTotalPrice(basePrice * quantity);
    };
    calculatePrice();
  }, [
    selectedPlan,
    selecetedMealType,
    quantity,
    tiffinData,
    endDate,
    selectedDates,
    startDate,
    planType,
    setTotalPrice,
  ]);

  const generateAdminNote = useCallback(() => {
    if (!tiffinData || !tiffinData.menu || !tiffinData.menu.instructions)
      return null;
    return (
      <div className={styles.flex2}>
        {tiffinData.menu.instructions.map((instruction, index) => (
          <div key={index}>
            <span className={styles.mealTypecolor}>
              <strong>
                {index + 1}. {instruction.title}:
              </strong>
            </span>
            <span style={{ fontSize: "12px" }}>{instruction.details}</span>
          </div>
        ))}
      </div>
    );
  }, [tiffinData]);

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className="flex flex-col h-full text-gray-700 p-6">
        <div className="">
          <p className="text-lg font-semibold mb-4">No tiffin data found</p>
          <h1
            onClick={() => navigate("/show-case?page=pro-and-pro-plus")}
            className="text-blue-500 font-bold text-xl underline cursor-pointer transition duration-300 ease-in-out hover:text-blue-700"
          >
            Click here to explore tiffins
          </h1>
        </div>
      </div>
    );
  }

  if (!tiffinData) return <div>No tiffin data found</div>;

  return (
    <div className={styles.container}>
      <Offers offers={localOffers} className="py-4" />
      {/* {showNotificationBar && (
        <div className={`${styles.notificationBar} ${styles[notificationType]}`}>
          {notificationMessage}
        </div>
      )} */}

      <div className={styles.header}>
        <div className={styles.imageflex}>
          <div className={styles.galaryimgflex}></div>
          {selectedImage && (
            <div
              className={styles.modal}
              onClick={() => setSelectedImage(null)}
            >
             
            </div>
          )}
        </div>

        <div className={styles.details}>
          <h2 className={styles.title}>{tiffinData.kitchenName}</h2>
          <div className={styles.totalPrice}>
            <span className={styles.redcolor}  style={{color:"#02757a"}}>${totalPrice.toFixed(2)}</span>
          </div>

          <div className={styles.groupDetails}>
            <div className={styles.selectGroup}>
              <label className={styles.label}>
                Select Plan <span className={styles.redcolor}  style={{color:"#02757a"}} >*</span>
              </label>
              <select
                value={selectedPlan}
                onChange={handlePlanChange}
                className={styles.select}
              >
                {plan.map((planOption) => (
                  <option key={planOption._id} value={planOption.label}>
                    {planOption.label}{" "}
                    {planOption.label !== "Custom Date Range" &&
                    planOption.label !== "Flexible Dates"
                      ? "Day Plan"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectGroup}>
              <label className={styles.label}>
                Meal Type <span className={styles.redcolor}  style={{color:"#02757a"}}>*</span>
              </label>
              <select
                value={selecetedMealType}
                onChange={(e) => setselecetedMealType(e.target.value)}
                className={styles.select}
              >
                {mealType.map((type) => (
                  <option key={type.mealTypeId} value={type.mealTypeId}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.dateGroup}>
            {(planType === "normal" || planType === "date-range") && (
              <div>
                <label className={styles.label}>
                  Start Date <span className={styles.redcolor}  style={{color:"#02757a"}}>*</span>
                </label>
                <input
                  type="date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className={styles.dateInput}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            )}

            {planType === "normal" && (
              <div>
                <label className={styles.label}>End Date:</label>
                <div className={styles.dateDisplay}>
                  {calculateEndDate()?.toLocaleDateString() || "Select a plan"}
                </div>
              </div>
            )}

            {planType === "date-range" && (
              <div>
                <label className={styles.label}>
                  End Date <span className={styles.redcolor}>*</span>
                </label>
                <input
                  type="date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className={styles.dateInput}
                  min={
                    startDate
                      ? startDate.toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            )}

            {planType === "flexi-dates" && (
              <>
                <div className={styles.flexiDates} >
                  <label className={styles.label} >
                    Select Delivery Dates{" "}
                    <span className={styles.redcolor} >*</span>
                  </label>
                  <CalendarComponent
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                  />
                </div>
                {selectedDates.length > 0 && (
                  <div>
                    <label className={styles.label}>Calculated End Date:</label>
                    <div className={styles.dateDisplay}>
                      {calculateEndDate()?.toLocaleDateString() || ""}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* New Delivery Slot Selector */}
          {tiffinData.deliveryTimeSlots &&
            tiffinData.deliveryTimeSlots.length > 0 && (
              <div className={styles.selectGroup}>
                <label className={styles.label}>
                  Delivery Time Slot <span className={styles.redcolor}  style={{color:"#02757a"}}>*</span>
                </label>
                <select
                  value={selectedDeliverySlot}
                  onChange={(e) => setSelectedDeliverySlot(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select a Slot</option>{" "}
                  {/* Added a default empty option */}
                  {Array.from(new Set(tiffinData.deliveryTimeSlots)).map(
                    (slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

          <div className={styles.mealDetails1}>
            <label className={styles.label}>Meal Details:</label>
            <div className={styles.dateDisplay}>
              {tiffinData.menu.mealTypes.find(
                (mt) => mt.mealTypeId === selecetedMealType
              )?.description || "Select a meal type to see details"}
            </div>
          </div>

          <div className={styles.policyContainer}>
            <label className={styles.policyLabel}>
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className={styles.policyCheckbox}
              />
              I accept the terms and policies
            </label>
          </div>
          <div className={styles.flex}>
            <div className={styles.quantityContainer}>
              <button  style={{ backgroundColor:"#02757a"}}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className={`${styles.buttons} ${styles.decrementButton}`}
              >
                -
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button  style={{ backgroundColor:"#02757a"}}
                onClick={() => setQuantity((prev) => prev + 1)}
                className={`${styles.buttons} ${styles.incrementButton}`}
              >
                +
              </button>
            </div>

            {validationError && (
              <div className={styles.errorMessage}>{validationError}</div>
            )}

            <button style={{ backgroundColor:"#02757a"}}
              onClick={handleAddToCart}
              className={`${styles.button} ${
                !policyAccepted ||
                (planType === "flexi-dates" && selectedDates.length === 0) ||
                !selectedDeliverySlot || // Disable if no slot is selected
                quantity <= 0
                  ? styles.buttonDisabled
                  : ""
              }`}
              disabled={
                !policyAccepted ||
                (planType === "flexi-dates" && selectedDates.length === 0) ||
                !selectedDeliverySlot || // Disable if no slot is selected
                quantity <= 0
              }
            >
              Add to Cart
            </button>
          </div>
          {/* <div style={{ marginTop: '10px' }}>
            <button
              onClick={handleProceedToCheckout}
              className={`${styles.button} ${
                !policyAccepted ||
                (planType === "flexi-dates" && selectedDates.length === 0) ||
                !selectedDeliverySlot || // Disable if no slot is selected
                quantity <= 0
                  ? styles.buttonDisabled
                  : ""
              }`}
              disabled={
                !policyAccepted ||
                (planType === "flexi-dates" && selectedDates.length === 0) ||
                !selectedDeliverySlot || // Disable if no slot is selected
                quantity <= 0
              }
            >
              Proceed to Checkout
            </button>
          </div> */}
        </div>
      </div>
      <OrderInstructions />
      <hr className={styles.sectionDivider} />

      <h2 className={styles.padding}>Our Menu</h2>
      <div className={styles.mealDetails}>
        {tiffinData.menu.mealTypes.map((mealTypeItem) => (
          <div key={mealTypeItem.mealTypeId} className={styles.flex2}>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <strong className={styles.mealTypecolor}>
                {mealTypeItem.label}:
              </strong>
              <span>
                (Applicable Plans ({mealTypeItem.specificPlans.join(", ")}) days
                plan)
              </span>
            </div>
            <p style={{ fontSize: "14px" }}>{mealTypeItem.description}</p>
          </div>
        ))}
      </div>

      <hr className={styles.sectionDivider} />

      <div style={{ marginTop: "20px" }}>
        <span>Please read Offer & Terms:</span>
        {generateAdminNote()}
      </div>
    </div>
  );
}

export default TiffinServiceComponent;
