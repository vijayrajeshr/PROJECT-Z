// import React, { useState, useEffect } from "react";
// import { SlCalender } from "react-icons/sl";
// import { BsPeople } from "react-icons/bs";
// import { MdNoMeals } from "react-icons/md";
// import { FaArrowLeft } from "react-icons/fa";
// import styles from "./BookaTableComponent.module.css";
// import BookingDetails from "../../../../../pages/BookingDetails/BookingDetails";
// import { useParams } from "react-router-dom";

// const BookaTableComponent = () => {
//   const [showBookingDetails, setShowBookingDetails] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [selectedGuests, setSelectedGuests] = useState("1 guest");
//   const [selectedMeal, setSelectedMeal] = useState("Lunch");
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [selectedOffers, setSelectedOffers] = useState([]);
//   const [operatingHours, setOperatingHours] = useState(null);
//   const [availableOffers, setAvailableOffers] = useState([]);
//   const [currentSlots, setCurrentSlots] = useState([]);
//   const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
//   const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedMeridiem, setSelectedMeridiem] = useState("");
//   const [error, setError] = useState(null);
//   const { id } = useParams();
//   const guests = ["1 guest", "2 guests", "3 guests", "4 guests"];
//   const meals = ["Lunch", "Dinner", "Snacks"];

//   // Fetch operating hours and offers
//   useEffect(() => {
//     const fetchOperatingHours = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/api/operating-hours/formatted-with-offers-only/${id}`,
//           { credentials: "include" }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch operating hours and offers");
//         }

//         const data = await response.json(); // ✅ Await here
//         console.log(data, "getting the re");

//         // ✅ Use `data`, not `response.data`
//         setOperatingHours(data.hours?.opening_hours || []);
//         setAvailableOffers(data.availableOffers || []);
//       } catch (error) {
//         console.error("Error fetching operating hours:", error);
//         setError("Unable to load booking details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOperatingHours();
//   }, [id, selectedDate]);

//   // Update slots and offers when date or availableOffers change
//   useEffect(() => {
//     if (!availableOffers || !selectedDate) return;

//     const dateObj = new Date(selectedDate);

//     const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

//     // Find the offer data for the selected day
//     const dayOffers = availableOffers.find((offer) => offer.day === dayName);

//     if (dayOffers && dayOffers.timeSlots) {
//       const isToday = dateObj.toDateString() === new Date().toDateString();

//       const slots = dayOffers.timeSlots
//         .filter((slotData) => {
//           if (!isToday) return true;
//           const slotTime = parseTime(slotData.slot); // custom function
//           return slotTime > new Date();
//         })
//         .map((slotData) => {
//           const validOffers = slotData.offers.filter((offer) => {
//             const offerStart = new Date(offer.startDate);
//             const offerEnd = new Date(offer.endDate);
//             return dateObj >= offerStart && dateObj <= offerEnd;
//           });

//           return {
//             slot: slotData.slot,
//             offers: validOffers.map((offer) => ({
//               _id: offer.id,
//               name: offer.name,
//               code: offer.code,
//               offerType: offer.offerType,
//               discountValue: offer.discountValue,
//               applicability: offer.applicability,
//               startDate: offer.startDate,
//               endDate: offer.endDate,
//             })),
//             offerCount: validOffers.length,
//           };
//         })
//         .filter((slot) => slot.offers.length > 0); // only keep slots with active offers

//       setCurrentSlots(slots);
//     } else {
//       setCurrentSlots([]);
//     }

//     setSelectedSlot(null);
//     setSelectedOffers([]);
//     setSelectedOffer(null);
//   }, [selectedDate, availableOffers]);

//   // Parse time (e.g., "5:00 PM" to Date object)
//   const parseTime = (timeStr) => {
//     const [time, period] = timeStr.split(" ");
//     const [hours, minutes] = time.split(":").map(Number);
//     let hour = hours;
//     if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
//     if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
//     const date = new Date();
//     date.setHours(hour, minutes, 0, 0);
//     return date;
//   };

//   // Handle slot selection
//   const handleSlotSelect = (slot, offers) => {
//     // Combine slot with selectedMeridiem if slot doesn't already include AM/PM
//     const formattedSlot =
//       slot.includes("AM") || slot.includes("PM")
//         ? slot
//         : `${slot} ${selectedMeridiem || "AM"}`; // Default to AM if no meridiem selected
//     console.log(formattedSlot, "getting slot with offers");
//     setSelectedSlot(formattedSlot);
//     setSelectedOffers(offers || []);
//     setSelectedOffer(null); // Reset selected offer until user chooses one
//   };

//   // Handle manual time input change
//   const handleTimeInputChange = (e) => {
//     const time = e.target.value;
//     // Combine the entered time with the selected meridiem
//     const formattedSlot = time ? `${time} ${selectedMeridiem || "AM"}` : "";
//     setSelectedSlot(formattedSlot);
//   };

//   // Handle offer selection
//   const handleOfferSelect = (offer) => {
//     setSelectedOffer(offer);
//   };

//   // Handle guest and meal changes
//   const handleGuestChange = (value) => {
//     setSelectedGuests(value);
//     setIsGuestDropdownOpen(false);
//   };

//   const handleMealChange = (meal) => {
//     setSelectedMeal(meal);
//     setIsMealDropdownOpen(false);
//   };
//   console.log(currentSlots, "currentslot data");

//   return (
//     <div className={styles.container}>
//       {showBookingDetails ? (
//         <div>
//           <button
//             className={styles.backButton}
//             onClick={() => setShowBookingDetails(false)}
//           >
//             <FaArrowLeft className={styles.icon} /> Back to Booking
//           </button>
//           <BookingDetails
//             selectedDate={new Date(selectedDate).toLocaleDateString("en-US", {
//               weekday: "short",
//               month: "short",
//               day: "numeric",
//             })}
//             selectedGuests={selectedGuests}
//             selectedSlot={selectedSlot}
//             selectedMeal={selectedMeal}
//             selectedOffer={selectedOffer}
//             goBack={() => setShowBookingDetails(false)}
//           />
//         </div>
//       ) : (
//         <>
//           <h2 className={styles.heading}>Select Your Booking Details</h2>

//           {error && <div className={styles.errorMessage}>{error}</div>}
//           {loading && <div className={styles.loadingMessage}>Loading...</div>}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//             {/* Date Picker */}
//             <div className="flex items-center border border-black p-2 rounded-md bg-white hover:bg-gray-200">
//               <SlCalender className="text-black mr-2" />
//               <input
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="w-full bg-transparent outline-none text-black rounded-none border-none"
//                 disabled={loading}
//               />
//             </div>

//             {/* Guest Selector */}
//             <div className="relative">
//               <button
//                 className="flex items-center justify-between w-full border border-black p-2 rounded-md bg-white hover:bg-gray-200"
//                 onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
//                 disabled={loading}
//               >
//                 <BsPeople className="text-black mr-2" />
//                 <span>{selectedGuests}</span>
//                 <span className="ml-auto">▼</span>
//               </button>
//               {isGuestDropdownOpen && (
//                 <div className="absolute mt-2 w-full bg-white border border-black rounded-md z-10">
//                   {guests.map((guest, index) => (
//                     <div
//                       key={index}
//                       className="p-2 hover:bg-gray-300 cursor-pointer text-black"
//                       onClick={() => handleGuestChange(guest)}
//                     >
//                       {guest}
//                     </div>
//                   ))}
//                   <input
//                     type="number"
//                     min="1"
//                     placeholder="Custom Guests"
//                     className="w-full border-t border-black p-2 outline-none bg-white text-black rounded-none"
//                     onChange={(e) =>
//                       handleGuestChange(`${e.target.value} guests`)
//                     }
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Meal Selector */}
//             <div className="relative">
//               <button
//                 className="flex items-center justify-between w-full border border-black p-2 rounded-md bg-white hover:bg-gray-200"
//                 onClick={() => setIsMealDropdownOpen(!isMealDropdownOpen)}
//                 disabled={loading}
//               >
//                 <MdNoMeals className="text-black mr-2" />
//                 <span>{selectedMeal}</span>
//                 <span className="ml-auto">▼</span>
//               </button>
//               {isMealDropdownOpen && (
//                 <div className="absolute mt-2 w-full bg-white border border-black rounded-md z-10">
//                   {meals.map((meal, index) => (
//                     <div
//                       key={index}
//                       className="p-2 hover:bg-gray-300 cursor-pointer text-black"
//                       onClick={() => handleMealChange(meal)}
//                     >
//                       {meal}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <h3 className={styles.subheading}>Available Time Slots</h3>

//           {currentSlots.length > 0 ? (
//             <div className={styles.slotsGrid}>
//               {currentSlots.map((slotData, index) => (
//                 <button
//                   key={index}
//                   className={`${styles.slotButton} ${
//                     selectedSlot === slotData.slot ? styles.selectedSlot : ""
//                   }`}
//                   onClick={() =>
//                     handleSlotSelect(slotData.slot, slotData.offers)
//                   }
//                   disabled={loading}
//                 >
//                   <p>{slotData.slot}</p>
//                   {slotData.offerCount > 0 && (
//                     <p className="text-sm font-semibold text-blue-500">
//                       {slotData.offerCount} offer
//                       {slotData.offerCount > 1 ? "s" : ""}
//                     </p>
//                   )}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className={styles.noSlotsMessage}>
//               No available time slots for this date
//             </div>
//           )}

//           <div className="flex justify-center items-center gap-2 mt-3">
//             {/* Time Input */}
//             <input
//               type="text"
//               className={`${styles.slotButton} w-64 h-12 text-black border p-2 cursor-auto`}
//               placeholder="Enter a Time Slot Eg: 12:00"
//               value={selectedSlot ? selectedSlot.split(" ")[0] : ""}
//               onChange={handleTimeInputChange}
//               disabled={loading}
//             />

//             {/* AM/PM Selector */}
//             <select
//               className="h-12 border border-gray-300 rounded-md px-3 text-black bg-white cursor-pointer"
//               value={selectedMeridiem}
//               onChange={(e) => {
//                 setSelectedMeridiem(e.target.value);
//                 // Update selectedSlot with new meridiem if a time is already selected
//                 if (selectedSlot) {
//                   const timePart = selectedSlot.split(" ")[0];
//                   setSelectedSlot(`${timePart} ${e.target.value}`);
//                 }
//               }}
//               disabled={loading}
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <h3 className="text-xl font-semibold text-gray-800 whitespace-nowrap">
//                 Choose an offer
//               </h3>
//               <div className="flex-grow border-t border-gray-300" />
//               <div className="rotate-180 text-gray-600">▾</div>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               {selectedOffers.map((offer, index) => {
//                 const isSelected =
//                   selectedOffer && selectedOffer._id === offer._id;

//                 // Dynamic icon color
//                 const iconGradient =
//                   offer.discountValue > 0
//                     ? "from-blue-600 to-blue-400"
//                     : "from-purple-600 to-purple-400";

//                 return (
//                   <div
//                     key={index}
//                     onClick={() => handleOfferSelect(offer)}
//                     className={`relative w-60 cursor-pointer rounded-xl bg-white shadow-md border p-4 transition ${
//                       isSelected
//                         ? "border-red-500"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {/* Top-left % icon */}
//                     <div className="absolute top-2 left-2">
//                       <div
//                         className={`w-7 h-7 bg-gradient-to-tr ${iconGradient} text-white text-sm font-bold rounded-md flex items-center justify-center`}
//                       >
//                         %
//                       </div>
//                     </div>

//                     {/* Top-right check circle */}
//                     <div className="absolute top-2 right-2">
//                       <div
//                         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                           isSelected
//                             ? "bg-red-500 border-red-500 text-white"
//                             : "border-gray-400 text-transparent"
//                         }`}
//                       >
//                         ✓
//                       </div>
//                     </div>

//                     {/* Offer Content */}
//                     <div className="mt-6 space-y-1">
//                       <p className="text-xs font-medium text-gray-500 uppercase">
//                         {offer.discountValue > 0 ? "FLAT" : "NO OFFER"}
//                       </p>
//                       <p className="text-base font-bold text-gray-900">
//                         {offer.discountValue > 0
//                           ? `${offer.discountValue}% OFF`
//                           : "Regular table reservation"}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             className={`${styles.proceedButton} ${
//               selectedSlot && (selectedOffers.length === 0 || selectedOffer)
//                 ? styles.proceedEnabled
//                 : styles.proceedDisabled
//             }`}
//             disabled={
//               !(
//                 selectedSlot &&
//                 (selectedOffers.length === 0 || selectedOffer)
//               ) || loading
//             }
//             onClick={() => setShowBookingDetails(true)}
//           >
//             Proceed to Cart
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default BookaTableComponent;

import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { BsPeople } from "react-icons/bs";
import { MdNoMeals } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./BookaTableComponent.module.css";
import BookingDetails from "../../../../../pages/BookingDetails/BookingDetails";
import { useParams } from "react-router-dom";

const BookaTableComponent = () => {
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // e.g., "2025-07-23"
  );
  const [selectedGuests, setSelectedGuests] = useState("1 guest");
  const [selectedMeal, setSelectedMeal] = useState("Lunch");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [operatingHours, setOperatingHours] = useState(null);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMeridiem, setSelectedMeridiem] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const guests = ["1 guest", "2 guests", "3 guests", "4 guests"];
  const meals = ["Lunch", "Dinner", "Snacks"];

  // Fetch operating hours and offers
  useEffect(() => {
    const fetchOperatingHours = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/operating-hours/formatted-with-offers-only/${id}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch operating hours and offers");
        }

        const data = await response.json();
        console.log("Operating hours and offers:", data);

        setOperatingHours(data.hours?.opening_hours || []);
        setAvailableOffers(data.availableOffers || []);
      } catch (error) {
        console.error("Error fetching operating hours:", error);
        setError("Unable to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOperatingHours();
  }, [id]);

  // Update slots and offers when date or availableOffers change
  useEffect(() => {
    if (!availableOffers || !selectedDate) return;

    const dateObj = new Date(selectedDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    const dayOffers = availableOffers.find((offer) => offer.day === dayName);

    if (dayOffers && dayOffers.timeSlots) {
      const isToday = dateObj.toDateString() === new Date().toDateString();

      const slots = dayOffers.timeSlots
        .filter((slotData) => {
          if (!isToday) return true;
          const slotTime = parseTime(slotData.slot);
          return slotTime > new Date();
        })
        .map((slotData) => {
          const validOffers = slotData.offers.filter((offer) => {
            const offerStart = new Date(offer.startDate);
            const offerEnd = new Date(offer.endDate);
            return dateObj >= offerStart && dateObj <= offerEnd;
          });

          return {
            slot: slotData.slot,
            offers: validOffers.map((offer) => ({
              _id: offer.id,
              name: offer.name,
              code: offer.code,
              offerType: offer.offerType,
              discountValue: offer.discountValue,
              applicability: offer.applicability,
              startDate: offer.startDate,
              endDate: offer.endDate,
            })),
            offerCount: validOffers.length,
          };
        })
        .filter((slot) => slot.offers.length > 0);

      setCurrentSlots(slots);
    } else {
      setCurrentSlots([]);
    }

    setSelectedSlot(null);
    setSelectedOffers([]);
    setSelectedOffer(null);
  }, [selectedDate, availableOffers]);

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let hour = hours;
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    const date = new Date();
    date.setHours(hour, minutes, 0, 0);
    return date;
  };

  const handleSlotSelect = (slot, offers) => {
    const formattedSlot =
      slot.includes("AM") || slot.includes("PM")
        ? slot
        : `${slot} ${selectedMeridiem || "AM"}`;
    console.log("Selected slot with offers:", formattedSlot);
    setSelectedSlot(formattedSlot);
    setSelectedOffers(offers || []);
    setSelectedOffer(null);
  };

  const handleTimeInputChange = (e) => {
    const time = e.target.value;
    const formattedSlot = time ? `${time} ${selectedMeridiem || "AM"}` : "";
    setSelectedSlot(formattedSlot);
  };

  const handleOfferSelect = (offer) => {
    setSelectedOffer(offer);
  };

  const handleGuestChange = (value) => {
    setSelectedGuests(value);
    setIsGuestDropdownOpen(false);
  };

  const handleMealChange = (meal) => {
    setSelectedMeal(meal);
    setIsMealDropdownOpen(false);
  };

  return (
    <div className={styles.container}>
      {showBookingDetails ? (
        <div>
          <button
            className={styles.backButton}
            onClick={() => setShowBookingDetails(false)}
          >
            <FaArrowLeft className={styles.icon} /> Back to Booking
          </button>
          <BookingDetails
            selectedDate={selectedDate} // Pass YYYY-MM-DD string
            selectedGuests={selectedGuests}
            selectedSlot={selectedSlot}
            selectedMeal={selectedMeal}
            selectedOffer={selectedOffer}
            goBack={() => setShowBookingDetails(false)}
          />
        </div>
      ) : (
        <>
          <h2 className={styles.heading}>Select Your Booking Details</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {loading && <div className={styles.loadingMessage}>Loading...</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="flex items-center border border-black p-2 rounded-md bg-white hover:bg-gray-200">
              <SlCalender className="text-black mr-2" />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent outline-none text-black rounded-none border-none"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center justify-between w-full border border-black p-2 rounded-md bg-white hover:bg-gray-200"
                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                disabled={loading}
              >
                <BsPeople className="text-black mr-2" />
                <span>{selectedGuests}</span>
                <span className="ml-auto">▼</span>
              </button>
              {isGuestDropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border border-black rounded-md z-10">
                  {guests.map((guest, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-300 cursor-pointer text-black"
                      onClick={() => handleGuestChange(guest)}
                    >
                      {guest}
                    </div>
                  ))}
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom Guests"
                    className="w-full border-t border-black p-2 outline-none bg-white text-black rounded-none"
                    onChange={(e) =>
                      handleGuestChange(`${e.target.value} guests`)
                    }
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="flex items-center justify-between w-full border border-black p-2 rounded-md bg-white hover:bg-gray-200"
                onClick={() => setIsMealDropdownOpen(!isMealDropdownOpen)}
                disabled={loading}
              >
                <MdNoMeals className="text-black mr-2" />
                <span>{selectedMeal}</span>
                <span className="ml-auto">▼</span>
              </button>
              {isMealDropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border border-black rounded-md z-10">
                  {meals.map((meal, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-300 cursor-pointer text-black"
                      onClick={() => handleMealChange(meal)}
                    >
                      {meal}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3 className={styles.subheading}>Available Time Slots</h3>

          {currentSlots.length > 0 ? (
            <div className={styles.slotsGrid}>
              {currentSlots.map((slotData, index) => (
                <button
                  key={index}
                  className={`${styles.slotButton} ${
                    selectedSlot === slotData.slot ? styles.selectedSlot : ""
                  }`}
                  onClick={() =>
                    handleSlotSelect(slotData.slot, slotData.offers)
                  }
                  disabled={loading}
                >
                  <p>{slotData.slot}</p>
                  {slotData.offerCount > 0 && (
                    <p className="text-sm font-semibold text-blue-500">
                      {slotData.offerCount} offer
                      {slotData.offerCount > 1 ? "s" : ""}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.noSlotsMessage}>
              No available time slots for this date
            </div>
          )}

          <div className="flex justify-center items-center gap-2 mt-3">
            <input
              type="text"
              className={`${styles.slotButton} w-64 h-12 text-black border border-black p-2 cursor-auto`}
              placeholder="Enter a Time Slot Eg: 12:00"
              value={selectedSlot ? selectedSlot.split(" ")[0] : ""}
              onChange={handleTimeInputChange}
              disabled={loading}
            />

            <select
              className="h-12 border border-gray-300 rounded-md px-3  text-black border border-black  cursor-pointer"
              value={selectedMeridiem}
              onChange={(e) => {
                setSelectedMeridiem(e.target.value);
                if (selectedSlot) {
                  const timePart = selectedSlot.split(" ")[0];
                  setSelectedSlot(`${timePart} ${e.target.value}`);
                }
              }}
              disabled={loading}
            >
              <option value="AM" className=" text-black border border-black ">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800 whitespace-nowrap">
                Choose an offer
              </h3>
              <div className="flex-grow border-t border-gray-300" />
              <div className="rotate-180 text-gray-600">▾</div>
            </div>
            <div className="flex flex-wrap gap-4">
              {selectedOffers.map((offer, index) => {
                const isSelected =
                  selectedOffer && selectedOffer._id === offer._id;
                const iconGradient =
                  offer.discountValue > 0
                    ? "from-blue-600 to-blue-400"
                    : "from-purple-600 to-purple-400";

                return (
                  <div
                    key={index}
                    onClick={() => handleOfferSelect(offer)}
                    className={`relative w-60 cursor-pointer rounded-xl bg-white shadow-md border p-4 transition ${
                      isSelected
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="absolute top-2 left-2">
                      <div
                        className={`w-7 h-7 bg-gradient-to-tr ${iconGradient} text-white text-sm font-bold rounded-md flex items-center justify-center`}
                      >
                        %
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-gray-400 text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                    <div className="mt-6 space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {offer.discountValue > 0 ? "FLAT" : "NO OFFER"}
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        {offer.discountValue > 0
                          ? `${offer.discountValue}% OFF`
                          : "Regular table reservation"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            id="proceedToCart"
            className={`${styles.proceedButton} ${
              selectedSlot && (selectedOffers.length === 0 || selectedOffer)
                ? styles.proceedEnabled
                : styles.proceedDisabled
            }`}
            disabled={
              !(
                selectedSlot &&
                (selectedOffers.length === 0 || selectedOffer)
              ) || loading
            }
            onClick={() => setShowBookingDetails(true)}
          >
            Proceed to Cart
          </button>
        </>
      )}
    </div>
  );
};

export default BookaTableComponent;
