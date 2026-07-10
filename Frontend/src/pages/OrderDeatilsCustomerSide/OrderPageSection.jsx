import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartCotent"; // Assuming this path is correct
import { useOffers } from "../../context/OffersContext"; // Assuming this path is correct
import { useContextData } from "../../context/OutletContext"; // Assuming this path is correct
import OrderSuccess from "./OrderSuccess";
import { Schedule } from "./Schedule"; // Assuming this modal also needs a modern style
import { toast } from "react-toastify"; // Toast notifications remain, their style is external

const OrderPageSection = () => {
  const navigate = useNavigate();
  const location1 = useLocation();
  const offerIdFromUrl = location1.search
    ? location1.search.substring(1)
    : null;
  console.log(offerIdFromUrl);
  const { axiosApi } = useContextData();
  const { cart, fetchCart, address } = useCart();



  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Schedule modal
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(null); // For restaurant orders
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [restaurantOffers, setRestaurantOffers] = useState([]);
  const [tiffinOffers, setTiffinOffers] = useState([]);
  const [applicableTiffinOffers, setApplicableTiffinOffers] = useState([]); // Filtered tiffin offers
  const [coordinates, setCoordinates] = useState(null);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [pickupAddress, setPickupAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedTiffinTimeSlot, setSelectedTiffinTimeSlot] = useState(null); // Added for tiffin orders
  const [isCartOpen, setIsCartOpen] = useState(true); // State to toggle cart summary visibility

  const offersContext = useOffers();
  const marketingOffers = offersContext?.offers || [];
  console.log(marketingOffers, offersContext.offers);
  const cartItemType = cart?.items?.[0]?.itemType?.toLowerCase();
  const cartItemId = cart?.items?.[0]?.sourceEntityId;

  // Default map center (fallback while real coordinates load)
  const defaultMapCenter = [20.5937, 78.9629];
  const overallOtherTaxes =
    typeof cart?.overallOtherTaxes === "number" ? cart.overallOtherTaxes : 0;
  const allOtherChargesDetails = Array.isArray(cart?.allOtherChargesDetails)
    ? cart.allOtherChargesDetails
    : [];
  const taxDetails = Array.isArray(cart?.taxDetails) ? cart.taxDetails : [];
  const allOther = cart?.allOtherChargesDetails;
  useEffect(() => {
    // Use backend coordinates if available
    if (
      cart?.lat != null && cart?.lng != null &&
      !isNaN(cart.lat) && !isNaN(cart.lng)
    ) {
      setCoordinates({ lat: parseFloat(cart.lat), lng: parseFloat(cart.lng) });
      return;
    }
    // Otherwise, geocode the address using OpenCage (same as OverviewAboutCard)
    const addressToGeocode = cartItemType === "tiffin" ? pickupAddress : address;
    if (addressToGeocode?.trim()) {
      const openCageApiKey = "2fe6302d9d304ad5bf5520116c8f75ad";
      const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(addressToGeocode)}&key=${openCageApiKey}`;
      fetch(geocodeUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            setCoordinates({ lat, lng });
          } else {
            setCoordinates(null);
          }
        })
        .catch((error) => {
          setCoordinates(null);
        });
    }
  }, [cart?.lat, cart?.lng, address, pickupAddress, cartItemType]);

  const fetchCoordinates = async (addressToGeocode) => {
    try {
      console.log(`[Geocode] Fetching coordinates for address: "${addressToGeocode}"`);
      console.log(`[Geocode] Using base URL: ${axiosApi.defaults.baseURL}`);
      console.log(`[Geocode] Full URL would be: ${axiosApi.defaults.baseURL}/api/geocode`);

      // Call backend geocoding proxy to avoid browser CORS/rate-limit issues
      const response = await axiosApi.get("/api/geocode", {
        params: { address: addressToGeocode, limit: 1 },
      });
      console.log("[Geocode] Full response object:", response);
      console.log("[Geocode] response.data:", response.data);
      console.log("[Geocode] response.status:", response.status);

      // Check if response has data
      if (!response.data) {
        console.warn("[Geocode] Response.data is empty or null!");
        setCoordinates(null);
        return;
      }

      const { lat, lng } = response.data;
      console.log("[Geocode] Extracted lat:", lat, "lng:", lng);
      console.log("[Geocode] Lat type:", typeof lat, "Lng type:", typeof lng);

      if (lat != null && lng != null && lat !== undefined && lng !== undefined) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        console.log(`[Geocode] Parsed coordinates: ${latNum}, ${lngNum}`);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
          console.log(`[Geocode] Success! Setting coordinates: lat=${latNum}, lng=${lngNum}`);
          setCoordinates({ lat: latNum, lng: lngNum });
          return;
        } else {
          console.warn("[Geocode] Parsed values are NaN:", latNum, lngNum);
        }
      } else {
        console.warn("[Geocode] lat or lng is null/undefined:", { lat, lng });
      }

      // If backend geocoding failed, clear coordinates
      console.warn("[Geocode] No valid coordinates in response");
      setCoordinates(null);
    } catch (error) {
      console.error("[Geocode] Error fetching coordinates:", error.message);
      console.error("[Geocode] Full error object:", error);
      if (error.response) {
        console.error("[Geocode] Response status:", error.response.status);
        console.error("[Geocode] Response data:", error.response.data);
        console.error("[Geocode] Response headers:", error.response.headers);
      }
      if (error.request) {
        console.error("[Geocode] Request was made but no response received");
      }
      setCoordinates(null);
    }
  };

  const isCouponExpired = (endDate) => {
    if (!endDate) return true;
    const now = new Date();
    const couponEnd = new Date(endDate);
    return now > couponEnd;
  };

  const extractNumber = (str) => {
    if (typeof str === "number") return str;
    return parseFloat(String(str)?.replace(/[^0-9.-]/g, "") || 0);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCart();
    };
    loadData();
  }, [fetchCart]);

  const productIds = cart.items.map((item) => item.productId).join(",");
  const subcategoryIds = cart.items.map((item) => item.subcategoryId).join(",");
  const categoryId = cart.items.map((item) => item.categoryId).join(",");

  // Fetch conditional offers (restaurant or tiffin specific)
  const fetchConditionalOffers = useCallback(async () => {
    try {
      if (cartItemType === "tiffin") {
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin/offers/${cartItemId}`,
          { withCredentials: true }
        );
        const fetchedOffers = response.data;

        setTiffinOffers(fetchedOffers);
        setRestaurantOffers([]);

        let filteredTiffinOffers = [];

        if (
          cart &&
          cart.items &&
          cart.items.length > 0 &&
          cart.items[0].itemType === "tiffin"
        ) {
          const firstTiffinItem = cart.items[0];
          const currentMealTypeId = firstTiffinItem.mealType?.id;
          const currentSelectedPlanId = firstTiffinItem.selectedPlan?.id;

          filteredTiffinOffers = fetchedOffers.filter((offer) => {
            if (!offer.active) {
              return false;
            }

            const now = new Date();
            const startDate = new Date(offer.startDate);
            const endDate = new Date(offer.endDate);

            endDate.setHours(23, 59, 59, 999);

            if (now < startDate || now > endDate) {
              return false;
            }

            if (offer.scope === "Tiffin-wide") {
              return true;
            } else if (offer.scope === "MealType-specific") {
              const isMealTypeMatch = cart?.items?.some((cartItem) => {
                const currentMealTypeId = cartItem.mealType?.id;
                console.log(currentMealTypeId);
                return (
                  currentMealTypeId &&
                  offer.mealTypes.some(
                    (mealTypeOffer) =>
                      mealTypeOffer.mealTypeId?.toString() === currentMealTypeId
                  )
                );
              });
              return isMealTypeMatch;
            } else if (offer.scope === "MealPlan-Specific") {
              const isPlainTypeMatch = cart?.items?.some((cartItem) => {
                const currentMealTypeId = cartItem.selectedPlan?.id;
                console.log(currentMealTypeId);
                return (
                  currentMealTypeId &&
                  offer.mealPlans.some(
                    (mealTypeOffer) =>
                      mealTypeOffer?.toString() === currentMealTypeId
                  )
                );
              });
              return isPlainTypeMatch;
            }
          });
        }
        setApplicableTiffinOffers(filteredTiffinOffers);
      } else if (cartItemType === "firm" || cartItemType === "restaurantmenu" || !cartItemType) {
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL
          }/api/offers/takeaway/cart/apply-offers?firmId=${cartItemId}&productIds=${productIds}&categoryId=${categoryId}&subcategoryIds=${subcategoryIds}`,
          { withCredentials: true }
        );
        console.log(response.data, "offers");
        setRestaurantOffers(response.data);
        setTiffinOffers([]);
        setApplicableTiffinOffers([]);
      }
    } catch (error) {
      console.error("Error fetching conditional offers:", error);
      setRestaurantOffers([]);
      setTiffinOffers([]);
      setApplicableTiffinOffers([]);
    }
  }, [axiosApi, cartItemType, cartItemId, cart]);

  //   const fetchConditionalOffers = useCallback(async () => {
  //         try {
  //             if (cartItemType === "tiffin") {
  //                 const response = await axiosApi.get(
  //                     `${VITE_SERVER_URL}/api/tiffin/offers/${cartItemId}`,
  //                     { withCredentials: true }
  //                 );
  //                 const fetchedOffers = response.data;

  //                 setTiffinOffers(fetchedOffers);
  //                 setRestaurantOffers([]);

  //                 let filteredTiffinOffers = [];

  //                 if (
  //                     cart &&
  //                     cart.items &&
  //                     cart.items.length > 0
  //                 ) {
  //                     // Filter tiffin items from the cart
  //                     const tiffinCartItems = cart.items.filter(item => item.itemType === "tiffin");

  //                     filteredTiffinOffers = fetchedOffers.filter((offer) => {
  //                         // 1. Check if offer is active
  //                         if (!offer.active) {
  //                             return false;
  //                         }

  //                         // 2. Check offer date range
  //                         const now = new Date();
  //                         const startDate = new Date(offer.startDate);
  //                         const endDate = new Date(offer.endDate);
  //                         endDate.setHours(23, 59, 59, 999); // Ensure end of day

  //                         if (now < startDate || now > endDate) {
  //                             return false;
  //                         }

  //                         // 3. Check offer scope against all relevant cart items
  //                         if (offer.scope === "Tiffin-wide") {
  //                             // Tiffin-wide offers apply if there's any tiffin item in the cart
  //                             return tiffinCartItems.length > 0;
  //                         } else if (offer.scope === "MealType-specific") {
  //                             // For MealType-specific offers, check if ANY tiffin item in the cart
  //                             // matches one of the offer's specified meal types
  //                             const isMealTypeMatch = tiffinCartItems.some(cartItem => {
  //                                 const currentMealTypeId = cartItem.mealType?.id;
  //                                 return currentMealTypeId && offer.mealTypes.some(
  //                                     (mealTypeOffer) => mealTypeOffer.mealTypeId === currentMealTypeId
  //                                 );
  //                             });
  //                             return isMealTypeMatch;
  //                         }
  //                         else if (offer.scope === "MealPlan-Specific") {
  //     const isMealPlanMatch = tiffinCartItems.some(cartItem => {
  //         const currentSelectedPlanId = cartItem.mealType?.id;
  //         return currentSelectedPlanId && offer.mealTypes.map((item) => { // Issue is here
  //             if (item?.mealTypeId?.toString() === currentSelectedPlanId) {
  //                 return true;
  //             }
  //             return false;
  //         });
  //     });
  //     return isMealPlanMatch;
  // }
  //                         return false; // If scope is not recognized or no match
  //                     });
  //                 }
  //                 setApplicableTiffinOffers(filteredTiffinOffers);

  //             } else if (cartItemType === "firm" || !cartItemType) {
  //                 // This branch handles restaurant/firm offers.
  //                 // productIds and subcategoryIds should be aggregated from all firm items in the cart.
  //                 const response = await axiosApi.get(
  //                     `${VITE_SERVER_URL}/api/offers/takeaway/cart/apply-offers?firmId=${cartItemId}&productIds=${productIds}&subcategoryIds=${subcategoryIds}`,
  //                     { withCredentials: true }
  //                 );
  //                 setRestaurantOffers(response.data);
  //                 setTiffinOffers([]);
  //                 setApplicableTiffinOffers([]);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching conditional offers:", error);
  //             setRestaurantOffers([]);
  //             setTiffinOffers([]);
  //             setApplicableTiffinOffers([]);
  //         }
  //     }, [axiosApi, cartItemType, cartItemId, cart, productIds, subcategoryIds]); // Added productIds, subcategoryIds to dependencies

  useEffect(() => {
    if (cartItemType) {
      fetchConditionalOffers();
    }
  }, [cartItemType, fetchConditionalOffers]);
  const validateMobileNumber = (numberToValidate) => {
    // Accept number as argument
    const number = numberToValidate.trim();
    const mobileRegex = /^\+?\d{7,15}$/;

    if (number === '') {
      setMessage('');
      setMessage('');
      return;
    }
    if (mobileRegex.test(number)) {
      if (number.length === 10) {
        setMessage('Mobile number is valid!', 'success');
      } else {
        setMessage('Mobile number must be exactly 10 digits long.', 'error');
      }
    } else {
      setMessage('Invalid mobile number format. Please use a format like +1234567890.', 'error');
    }
  };
  const parseDiscountValue = (discountString) => {
    if (!discountString) return 0;
    const sanitizedValue = discountString.replace(/[^0-9.]/g, "");
    const parsedValue = parseFloat(sanitizedValue);
    // Ensure the parsed value is a number and not NaN
    return isNaN(parsedValue) ? 0 : parsedValue;
  };
  const allOffers = [
    ...(cartItemType === "tiffin"
      ? applicableTiffinOffers
      : restaurantOffers
    ).map((offer) => {
      const offerDiscountValue = offer.discount || offer.discountValue || 0;
      const offerType = offer.type || offer.offerType || "fixed";

      return {
        ...offer,
        source: cartItemType === "tiffin" ? "tiffin" : "restaurant",
        name: offer.name || "Special Offer",
        code:
          offer.code ||
          (offer.name
            ? offer.name.replace(/\s+/g, "").slice(0, 8).toUpperCase()
            : "OFFER"),
        discount:
          offerType === "percentage"
            ? `${offerDiscountValue}%`
            : `$${offerDiscountValue?.toFixed(2) || "0.00"}`,
        offerType: offerType,
        discountValue: offerDiscountValue,
        endDate: offer.endDate
          ? new Date(offer.endDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
    }),
    // ...marketingOffers.map((offer) => ({
    //   ...offer,
    //   source: "marketing",
    //   name: offer.name || "Marketing Promotion",
    //   code:
    //     offer.code ||
    //     (offer.name
    //       ? offer.name.replace(/\s+/g, "").slice(0, 8).toUpperCase()
    //       : "DEAL"),
    //   discount: offer.discount || "",
    //   offerType: (offer.discount || "").includes("%") ? "percentage" : "fixed",
    //   discountValue: parseFloat(
    //     (offer.discount || "0").replace(/[^0-9.]/g, "")
    //   ),
    //   endDate: offer.endDate
    //     ? new Date(offer.endDate)
    //     : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    // })),
    ...marketingOffers
      // First, filter based on offer type and status.
      .filter(offer => {
        // Only consider offers that are currently 'Active'.
        if (offer.status !== 'Active') {
          return false;
        }

        // Filter based on category (Restaurant, Tiffin, User)
        // "User" offers are assumed to apply generally or we can restrict them.
        // Assuming "User" applies to all for now.
        if (offer.category === "User") {
          return true;
        }

        if (cartItemType === "tiffin" && offer.category === "Tiffin") {
          return true;
        }

        if ((cartItemType === "firm" || cartItemType === "restaurant" || cartItemType === "restaurantmenu") && offer.category === "Restaurant") {
          return true;
        }
        return false;
      })
      // Now, map the filtered offers and create the final offer object.
      .map((offer) => {
        // Determine offer type (lowercase for consistency with logic below)
        const isPercentage = offer.type === "Percentage";
        const type = isPercentage ? "percentage" : "fixed";

        // Use offerValue number directly
        const val = parseFloat(offer.offerValue || 0);

        return {
          ...offer,
          source: "marketing",
          name: offer.name || "Marketing Promotion",
          code: offer.code || (offer.name ? offer.name.replace(/\s+/g, "").slice(0, 8).toUpperCase() : "DEAL"),
          // offerType is now based on the type field from backend
          offerType: type,
          discount: isPercentage ? `${val}%` : `$${val.toFixed(2)}`,
          discountValue: val,
          endDate: offer.endDate ? new Date(offer.endDate) : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        };
      }),
  ].filter(
    (offer) => offer.discountValue > 0 && !isCouponExpired(offer.endDate)
  );

  useEffect(() => {
    if (offerIdFromUrl && allOffers.length > 0) {
      const offerMatch = allOffers.find(
        (offer) => offer?._id === offerIdFromUrl
      );
      if (offerMatch) {
        setAppliedOffer(offerMatch);
      }
    }
  }, [offerIdFromUrl, allOffers]);

  // const subtotal = cart?.subtotal || 0;
  let discount = 0;
  let subtotal = 0;

  if (cart?.items) {

    subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  console.log(subtotal);
  if (appliedOffer) {
    if (appliedOffer.scope === "MealType-specific") {
      cart?.items?.forEach((cartItem) => {
        const currentMealTypeId = cartItem.mealType?.id;
        console.log(cartItem);
        appliedOffer.mealTypes?.forEach((offerMealType) => {
          console.log(appliedOffer);
          if (offerMealType?.mealTypeId?.toString() === currentMealTypeId) {
            if (appliedOffer.offerType === "percentage") {
              console.log(
                cartItem.price,
                cartItem.quantity,
                appliedOffer.discountValue
              );
              discount =
                (cartItem.price *
                  cartItem.quantity *
                  appliedOffer.discountValue) /
                100;
            } else {
              discount = Math.min(
                cartItem.price * cartItem.quantity,
                appliedOffer.discountValue
              );
            }
            console.log(discount);
          }
        });
      });
    } else if (appliedOffer.scope === "MealPlan-Specific") {
      cart?.items?.forEach((cartItem) => {
        const currentMealPlanId = cartItem.selectedPlan?.id;
        appliedOffer.mealPlans?.forEach((offerMealPlan) => {
          if (offerMealPlan?.toString() === currentMealPlanId) {
            if (appliedOffer.offerType === "percentage") {
              discount =
                (cartItem.price *
                  cartItem.quantity *
                  appliedOffer.discountValue) /
                100;
            } else {
              discount = Math.min(
                cartItem.price * cartItem.quantity,
                appliedOffer.discountValue
              );
              console.log(discount);
            }
          }
        });
      });
    } else {
      if (appliedOffer.offerType === "percentage") {
        discount = (subtotal * appliedOffer.discountValue) / 100;
        console.log(discount);
      } else {
        discount = appliedOffer.discountValue;
      }
    }

    discount = Math.min(discount, subtotal);
  }

  console.log("Calculated Discount:", discount);
  const deliveryFee = cart?.deliveryFee || 0;
  const platformFee = cart?.overallPlatformFee || 0;

  const aggregatedOtherTaxesForDisplay = taxDetails.flatMap((td) =>
    td.appliedTaxes.filter((tax) => tax.name?.toLowerCase() !== "gst")
  );
  const OtherTaxesForDisplay = allOtherChargesDetails?.filter((tax) => tax.name?.toLowerCase() !== "platformfee");
  const combinedAllOtherChargesAndTaxes = [
    ...aggregatedOtherTaxesForDisplay.map((tax) => ({
      name: tax.name,
      amount: tax.amount,
      type: "tax",
    })),
    ...OtherTaxesForDisplay.map(tax => ({
      name: tax.name,
      amount: tax.value,
      type: 'othertax'
    }))
  ];
  const sumOfIndividualOtherCharges = allOtherChargesDetails.reduce(
    (sum, charge) => {
      if (charge.type === "percentage") {
        return sum + (subtotal * charge.value) / 100;
      } else if (charge.type === "flat") {
        return sum + charge.value;
      } else {
        return sum; // Skip unknown types
      }
    },
    0
  );

  // Using the more granular calculation for final payable amount
  const gstAmount = taxDetails.reduce((sum, tax) => sum + (tax.gstAmount || 0), 0);

  const finalPayableAmount =
    subtotal -
    discount +
    deliveryFee +
    platformFee +
    overallOtherTaxes +
    cart.overallOtherCharges +
    (cart?.taxDetails?.[0]?.gstAmount || 0);

  const handleScheduleClick = () => {
    const currentTime = new Date();
    // In India, we are currently at IST (GMT+5:30).
    // Adding 30 minutes to current time for standard pickup.
    // Ensure this is handled on the backend for accurate time zone conversions if needed.
    const newTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    setSelectedScheduleTime(newTime.toISOString());
    toast.info(
      `Pickup time set to approximately ${newTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`
    );
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validateMobileNumber(value);
  };
  // Promo Code Modal Component
  const PromoCodeModal = ({ onClose, onApply, offers }) => {
    const [manualCode, setManualCode] = useState("");
    const [filteredOffers, setFilteredOffers] = useState([]);

    useEffect(() => {
      const validOffers = offers.filter(
        (offer) => !isCouponExpired(offer.endDate)
      );
      setFilteredOffers(validOffers);
    }, [offers]);
    const handleManualCodeApply = () => {
      if (!manualCode.trim()) {
        alert("Please enter a promo code.");
        return;
      }

      const matchedOffer = offers.find(
        (offer) =>
          offer.code && offer.code.toLowerCase() === manualCode.toLowerCase()
      );

      if (matchedOffer) {
        if (isCouponExpired(matchedOffer.endDate)) {
          alert("This coupon has expired.");
        } else {
          onApply(matchedOffer);
          alert(`Promo code '${matchedOffer.code}' applied!`);
          onClose();
        }
      } else {
        alert("Invalid promo code or no matching offer found.");
      }
    };
    const formatPromoDate = (date) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    };

    //ApplyOffer
    const handleApplyOffer = async (offer) => {
      if (!offer?.code?.trim()) return;

      if (cartItemType === "Firm") {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/offers/validate-offer`,
            {
              code: offer?.code,
              cart, // must contain _id, categoryId, subcategoryId
            },
            { withCredentials: true }
          );

          const { valid } = res.data;

          if (valid) {
            const offerdata = {
              _id: res.data._id,
              name: res.data.name,
              offerType: res.data.offerType,
              discountValue: res.data.discountValue,
              code: res.data.code,
            };
            onApply(offerdata);
            alert(`Promo code '${code}' applied!`);
            onClose();
          } else {
            alert("Invalid promo code or no matching offer found.");
          }
        } catch (err) {
          console.error("Error validating offer:", err);
        }
      } else {
        onApply(offer);
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-sans">
        <div className="bg-white text-gray-800 rounded-lg w-[450px] shadow-lg h-[600px] flex flex-col">
          <div className="p-5 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5">Promotions</h2>

            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                className="border border-gray-300 p-2 flex-1 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter promo code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <button
                className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={() => handleManualCodeApply}
              >
                Apply
              </button>
            </div>

            <div className="space-y-3">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => (
                  <div
                    key={`${offer._id || offer.code}-${offer.source}`}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                  >
                    <h4 className="font-normal text-lg">{offer.name}</h4>
                    <p className="text-sm">
                      Code: <span className="font-semibold">{offer.code}</span>
                    </p>
                    <p className="text-sm">
                      Discount:{" "}
                      <span className="font-semibold">
                        {offer.offerType === "percentage"
                          ? `${offer.discountValue}%`
                          : `$${offer.discountValue > 0
                            ? offer.discountValue.toFixed(2)
                            : "0.00"
                          }`}
                      </span>
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">
                        Valid until: {formatPromoDate(offer.endDate)}
                      </p>
                      <button
                        onClick={() => handleApplyOffer(offer)}
                        className="px-6 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No available promotions.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end p-4 bg-gray-100 rounded-b-lg border-t">
            <button
              className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  console.log(cart.overallOtherTaxes, "cart");
  const handlePlaceOrder = async () => {
    const orderTimestamp = new Date(Date.now() + 5000).toISOString();

    let deliveryTimeToSend = null;
    let pickupAddressToSend = null;

    if (cartItemType === "tiffin") {
      // Use selectedTiffinTimeSlot from state
      const selectedTiffinDeliveryTimeSlot = selectedTiffinTimeSlot;

      if (!selectedTiffinDeliveryTimeSlot) {
        alert("Tiffin delivery time slot not found. Please select a slot.");
        return;
      }
      if (!phoneNumber.trim()) {
        alert("Please enter your phone number for tiffin order.");
        return;
      }
      if (!pickupAddress.trim()) {
        alert("Please enter a pickup address for tiffin order.");
        return;
      }

      if (cartItemType === "tiffin") {
        const initalPlan = cart?.items[0]?.selectedPlan?.id;
        cart?.items.map((item) => {
          if (item?.selectedPlan?.id !== initalPlan) {
            alert("Please Make shure that all plains should be same.");
            return;
          }
        });
      }
      // const [startTimeStr] = selectedTiffinDeliveryTimeSlot.split(" - ");
      // const today = new Date();
      // today.setHours(0, 0, 0, 0); // Reset to beginning of today to combine with parsed time
      // let hours, minutes;
      // const timeParts = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      // if (timeParts) {
      //     hours = parseInt(timeParts[1], 10);
      //     minutes = parseInt(timeParts[2], 10);
      //     const ampm = timeParts[3]?.toLowerCase();
      //     if (ampm === "pm" && hours < 12) {
      //         hours += 12; // Convert 1-11 PM to 13-23
      //     } else if (ampm === "am" && hours === 12) {
      //         hours = 0; // 12 AM is midnight (00:00)
      //     }
      // } else {
      //     console.error("Could not parse time from slot string:", startTimeStr);
      //     toast.error("Error: Invalid time slot format.");
      //     return;
      // }
      // const selectedTiffinDeliveryDateTime = new Date(
      //     today.getFullYear(),
      //     today.getMonth(),
      //     today.getDate(),
      //     hours,
      //     minutes,
      //     0, // seconds
      //     0 // milliseconds
      // );

      // // Ensure the calculated delivery time is in the future relative to now.
      // // If the selected slot's time for today is already past, shift it to tomorrow.
      // if (selectedTiffinDeliveryDateTime < new Date()) {
      //     selectedTiffinDeliveryDateTime.setDate(
      //         selectedTiffinDeliveryDateTime.getDate() + 1
      //     );
      // }
      deliveryTimeToSend = selectedTiffinDeliveryTimeSlot;
      pickupAddressToSend = pickupAddress;
    } else {
      // For 'firm' or restaurant orders
      if (!selectedScheduleTime) {
        alert(
          "Please select a pickup time for your order (Standard or Schedule)."
        );
        return;
      }
      deliveryTimeToSend = selectedScheduleTime;
      pickupAddressToSend = address;
    }
    try {
      const orderPayload = {
        items: cart.items,
        restaurantName: cart.items[0]?.sourceEntityId,
        offerId: appliedOffer?._id,
        deliveryFee: cart.deliveryFee,
        subtotal: cart.subtotal,
        platformFee: platformFee,
        gstCharges: cart.taxDetails?.[0]?.gstAmount || 0,
        // Using aggregatedOtherTaxesForDisplay for consistency with the display logic
        totalOtherCharges: cart.allOtherChargesDetails,
        overallOtherTaxes: cart.overallOtherTaxes,
        overallOtherCharges: cart.overallOtherCharges,
        totalPrice: finalPayableAmount, // Use the calculated finalPayableAmount
        discount: discount,
        orderTime: orderTimestamp,
        deliveryTime: deliveryTimeToSend,
        pickupAddress: pickupAddressToSend,
        sourceEntityDetails: {
          name: cart?.taxDetails?.[0]?.name,
          address: cart?.taxDetails?.[0]?.address,
          city: cart?.taxDetails?.[0]?.country,
          image: cart?.taxDetails?.[0]?.image,
          itemType: cart?.taxDetails?.[0]?.itemType,
        },
      };

      if (cartItemType === "tiffin") {
        orderPayload.phone = {
          countryCode: countryCode,
          number: phoneNumber,
        };
        orderPayload.specialInstructions = specialInstructions;
      }

      console.log("Sending order payload:", orderPayload); // Log the payload for debugging

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/create`,
        orderPayload,
        { withCredentials: true }
      );

      setIsVisible(true); // Assuming this triggers OrderSuccess modal
      fetchCart(); // Refresh cart after successful order
    } catch (error) {
      console.error(
        "Error placing the order:",
        error.response?.data?.message || error.message,
        error.response
      );
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const isPlaceOrderDisabled =
    !cart ||
    cart.items?.length === 0 ||
    (cartItemType === "tiffin" &&
      (!selectedTiffinTimeSlot ||
        !phoneNumber.trim() ||
        !pickupAddress.trim())) ||
    (cartItemType !== "tiffin" && !selectedScheduleTime);

  // if (!cart || !cart.items || cart.items.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
  //       <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
  //         <p className="text-2xl font-bold text-gray-800 mb-4">
  //           Your cart is empty.
  //         </p>
  //         <p className="text-gray-600 mb-6">
  //           Looks like you haven't added anything yet. Let's get some delicious
  //           food!
  //         </p>
  //         <button
  //           onClick={() => navigate("/user/ll/take-away")}
  //           className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
  //         >
  //           Go to Restaurants
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-2 m-2 bg-slate-100 min-h-screen font-sans">
      {/* Header section */}
      <div className="bg-white shadow-md w-full flex justify-start items-center px-4 py-2 rounded-sm">
        <h1
          className="text-lg font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ZOMATO
        </h1>
      </div>
      {/* Main content area */}
      <div className="my-6 mx-auto max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Left column: Pickup Details & Map */}
        <div className="w-full lg:w-3/5 bg-white shadow-md px-4 py-4 rounded-xl">
          <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <h1 className="text-lg font-semibold">Pickup Details</h1>
            {/* <div className="flex gap-2">
              <button className="py-1 px-3 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition duration-200">
                Delivery
              </button>
              <button className="py-1 px-3 border border-blue-500 bg-blue-500 text-white rounded-full shadow-md">
                Pickup
              </button>
            </div> */}
          </div>

          {/* Interactive Map Section (react-leaflet) */}
          <div className="mt-4 bg-gray-100 rounded-md p-2 text-sm shadow-inner">
            {/* Ensure Leaflet default icons are configured (works around bundler issues) */}
            {typeof window !== "undefined" && (() => {
              try {
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                });
              } catch (err) { }
              return null;
            })()}

            {!isVisible && (
              <MapContainer
                center={coordinates ? [coordinates.lat, coordinates.lng] : defaultMapCenter}
                zoom={coordinates ? 15 : 6}
                style={{ height: "200px", width: "100%" }}
                scrollWheelZoom={false}
                key={coordinates ? `${coordinates.lat}-${coordinates.lng}` : 'default-map'}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {coordinates && (
                  <Marker position={[coordinates.lat, coordinates.lng]}>
                    <Popup>
                      {cartItemType === "tiffin" ? pickupAddress || "Pickup location" : address || "Restaurant"}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            )}
          </div>

          {/* Conditional rendering for Tiffin vs. Restaurant details */}
          {cartItemType === "tiffin" ? (
            <div className="mt-6 space-y-4">
              <h1 className="text-lg font-bold text-gray-800 mb-3">
                Your Contact Information
              </h1>
              <div>
                <label
                  htmlFor="countryCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country Code
                </label>
                <select
                  id="countryCode"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">India (+91)</option>
                  <option value="+1">USA (+1)</option>
                  <option value="+44">UK (+44)</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Enter Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange} // Call the new handler
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <p>{message}</p>
              </div>
              <div>
                <label
                  htmlFor="pickupAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pickup Address
                </label>
                <textarea
                  id="pickupAddress"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                  rows="3"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter your full pickup address"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="specialInstructions"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Special Instructions (for tiffin)
                </label>
                <textarea
                  id="specialInstructions"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                  rows="2"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., allergies, dietary preferences, delivery notes"
                ></textarea>
              </div>

              {/* Tiffin selected delivery time slot display */}
              <div className="mt-5">
                {cart?.items?.[0]?.selectedDeliveryTimeSlot ? (
                  <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-md flex items-center shadow-sm">
                    <span className="text-xl mr-3">⏰</span>
                    <p className="font-semibold text-base">
                      Delivery Time: {cart.items[0].selectedDeliveryTimeSlot}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4 text-sm bg-gray-100 rounded-md border border-gray-200">
                    Delivery time not found for tiffin.
                  </p>
                )}
                {/* Manual selection for tiffin time slot */}
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    Select Delivery Time Slot
                  </h3>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={selectedTiffinTimeSlot || ""}
                    onChange={(e) => setSelectedTiffinTimeSlot(e.target.value)}
                  >
                    <option value="">Select a time slot</option>
                    {/* These options would typically come from cart.items[0].availableTimeSlots or similar */}
                    {cart?.items?.map((slot, index) => (
                      <option
                        key={index}
                        value={slot?.selectedDeliveryTimeSlot}
                      >
                        {slot?.selectedDeliveryTimeSlot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4 bg-gray-100 rounded-md shadow-sm p-4 flex items-center gap-4">
                <div className="text-2xl text-blue-600">🏠</div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">
                    {cart?.taxDetails?.[0]?.name || "Restaurant Name"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {cart?.taxDetails?.[0]?.address || "Restaurant Address"}
                  </p>
                </div>
              </div>

              {/* Restaurant pickup time selection */}
              <div className="mt-6">
                <h1 className="text-lg font-bold text-gray-800 mb-3">
                  Pickup Time
                </h1>
                <div className="space-y-3">
                  <button
                    className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-md text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    onClick={handleScheduleClick}
                  >
                    <span className="font-semibold">Standard</span> (Approx. 30
                    Mins)
                  </button>
                  <button
                    className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-md text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {selectedScheduleTime
                      ? `Scheduled: ${new Date(
                        selectedScheduleTime
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`
                      : "Schedule for later"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right column: Order Summary & Place Order */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          {/* Entity Details and Place Order Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-5">
              <img
                src={
                  cart?.taxDetails?.[0]?.image ||
                  "https://placehold.co/80x80/E0E0E0/424242?text=Entity"
                }
                alt="Entity"
                className="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-200"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {cart?.taxDetails?.[0]?.name || "Entity Name"}
                </h2>
                <p className="text-sm text-gray-600 mt-1 leading-snug">
                  {cart?.taxDetails?.[0]?.address || "N/A"}
                  <br />
                  {cart?.taxDetails?.[0]?.country || "N/A"}
                </p>
              </div>
            </div>
            <button
              className="bg-blue-600 text-white font-semibold w-full py-3 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg"
              onClick={handlePlaceOrder}
              disabled={isPlaceOrderDisabled}
            >
              Place Order
            </button>
          </div>

          {/* Cart Summary Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <h3 className="text-xl font-bold text-gray-800">
                Cart summary ({cart?.items?.length}{" "}
                {cart?.items?.length === 1 ? "item" : "items"})
              </h3>
              {isCartOpen ? (
                <span className="text-gray-600 text-xl">▲</span>
              ) : (
                <span className="text-gray-600 text-xl">▼</span>
              )}
            </div>
            {isCartOpen && (
              <>
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {cart?.items?.map((item, index) => (
                    <div
                      key={item?.productId?._id || item?._id || index}
                      className="flex gap-4 items-center justify-between pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={
                          item?.img ||
                          item.productId?.image ||
                          "https://placehold.co/60x60/F0F0F0/616161?text=Item"
                        }
                        alt={item?.name || item.productId?.name || "Item"}
                        className="w-16 h-16 rounded-md object-cover shadow-sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-800">
                          {item?.name || item.productId?.name || "Unnamed Item"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity || 1}
                        </p>
                        {cartItemType === "tiffin" &&
                          item.selectedDeliveryTimeSlot && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              Delivery: {item.selectedDeliveryTimeSlot}
                            </p>
                          )}
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        $
                        {(
                          extractNumber(item?.price) * (item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="font-bold text-lg text-gray-800 flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Promotion Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Promotion</h3>
            {!appliedOffer ? (
              <button
                className="w-full border border-blue-600 text-blue-600 font-semibold px-4 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 text-base"
                onClick={() => setIsPromoOpen(true)}
              >
                Add promo code
              </button>
            ) : (
              <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-md flex items-center shadow-sm">
                <span className="text-2xl mr-3">🎉</span>
                <span className="font-semibold flex-1 text-base">
                  You saved ${discount.toFixed(2)} with '
                  {appliedOffer.code || appliedOffer.name}'
                </span>
                <button
                  onClick={() => {
                    setAppliedOffer(null);
                    toast.info("Promo code removed.");
                  }}
                  className="text-gray-500 text-xl p-1 rounded-full hover:bg-blue-200 transition duration-200"
                  aria-label="Remove promotion"
                >
                  &times;
                </button>
              </div>
            )}
            {appliedOffer && (
              <button
                className="text-blue-600 underline text-sm mt-3 inline-block hover:text-blue-800 transition duration-200 focus:outline-none"
                onClick={() => setIsPromoOpen(true)}
              >
                View all coupons
              </button>
            )}
          </div>

          {/* Payment Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Payment Details
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedOffer && (
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>
                    Discount ({appliedOffer.code || appliedOffer.name})
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Platform Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>

              {/* Render individual other charges */}
              {/* {aggregatedOtherTaxesForDisplay.length > 0 &&
                aggregatedOtherTaxesForDisplay.map((tax, index) => (
                  <div
                    key={`tax-agg-${index}`}
                    className="flex justify-between text-gray-700"
                  >
                    <span>{tax.name}</span>
                    <span>${tax.amount?.toFixed(2)}</span>
                  </div>
                ))} */}
              {cart.overallOtherCharges > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Other Charges</span>
                  <span>${cart.overallOtherCharges.toFixed(2)}</span>
                </div>
              )}
              {/* Displaying taxes from cart.taxDetails - adjusted to use gstAmount and existing logic */}
              {/* {cart?.taxDetails?.map((tax, index) => (
                <div
                  key={`tax-detail-${index}`}
                  className="flex justify-between text-gray-700 text-sm"
                >
                  <span>
                    {tax.appliedTaxes[0]?.name} (
                    {cart.avgFirmSubcategoryTax === "0.00%"
                      ? "5%" // Assuming 5% as a default if avgFirmSubcategoryTax is "0.00%"
                      : cart.avgFirmSubcategoryTax}
                    )
                  </span>
                  <span>${tax.gstAmount?.toFixed(2)}</span>
                </div>
              ))} */}

              {cart?.taxDetails?.[0]?.appliedTaxes?.map((tax, index) => (
                <div
                  key={`tax-detail-${index}`}
                  className="flex justify-between text-gray-700 text-sm"
                >
                  <span>
                    {tax?.name} (
                    {tax.rate === "0.00%"
                      ? "5%" // Assuming 5% as a default if tax.rate is "0.00%"
                      : tax.rate + "%"}
                    )
                  </span>
                  <span>${tax.amount?.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between font-bold text-xl text-gray-900">
                <span>Total Payable Amount</span>
                <span>${finalPayableAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals rendered conditionally */}
      {isPromoOpen && (
        <PromoCodeModal
          onClose={() => setIsPromoOpen(false)}
          onApply={(offer) => {
            setAppliedOffer(offer);
            setIsPromoOpen(false);
          }}
          offers={allOffers}
        />
      )}
      {isModalOpen && (
        <Schedule // Ensure Schedule modal also adheres to the new UI style
          onClose={() => setIsModalOpen(false)}
          onSave={(time) => {
            setSelectedScheduleTime(time);
            setIsModalOpen(false);
          }}
        />
      )}
      {isVisible && (
        <OrderSuccess setIsVisible={setIsVisible} orderId="your-order-id" />
      )}{" "}
      {/* Adjusted OrderSuccess prop */}
    </div>
  );
};

export default OrderPageSection;
