// import React from "react";
// import { SlCalender } from "react-icons/sl";
// import { BsPeople } from "react-icons/bs";
// import { MdLocationOn } from "react-icons/md";
// import { FaTag } from "react-icons/fa";
// import styles from "./BookingDetails.module.css";

// const BookingDetails = ({ selectedDate, selectedGuests, selectedMeal, selectedSlot, selectedOffer, goBack }) => {
//   const handleConfirm = () => {
//     alert("🎉 Booking Confirmed! See you at Max Night Club. ✅");
//     goBack(); // Close modal after confirmation
//   };

//   return (
//     <div className={styles.bookingDetailsContainer}>
//       {/* Title */}
//       <h2 className={styles.sectionTitle}>Review booking details</h2>

//       {/* Booking Details Card */}
//       <div className={styles.bookingCard}>
//         <div className={styles.detailRow}>
//           <SlCalender className={styles.icon} />
//           <span>{selectedDate} at {selectedSlot}</span>
//         </div>

//         <div className={styles.detailRow}>
//           <BsPeople className={styles.icon} />
//           <span>{selectedGuests} Guests</span>
//         </div>

//         <div className={styles.detailRow}>
//           <MdLocationOn className={styles.icon} />
//           <span>Max Night Club</span>
//           <p className={styles.subText}>Kharadi, Pune</p>
//         </div>

//         {selectedOffer && (
//           <div className={`${styles.detailRow} ${styles.offerRow}`}>
//             <FaTag className={styles.iconOffer} />
//             <span className={styles.offerText}>{selectedOffer}</span>
//             <p className={styles.subText}>Pay bill between 9:30 PM - 3:30 AM</p>
//           </div>
//         )}
//       </div>

//       {/* Booking Summary */}
//       <h2 className={styles.sectionTitle}>Booking summary</h2>
//       <div className={styles.bookingSummary}>
//         <p className={styles.summaryRow}>
//           <span>Cover charge</span>
//           <span>₹25</span>
//         </p>
//         <p className={styles.summaryNote}>This amount will be adjusted in your final bill</p>
//         <p className={styles.summaryRow}>
//           <span>Sub total</span>
//           <span>₹25</span>
//         </p>
//         <hr className={styles.divider} />
//         <p className={`${styles.summaryRow} ${styles.totalRow}`}>
//           <strong>To be paid</strong>
//           <strong>₹25</strong>
//         </p>
//       </div>

//       {/* Confirm Button */}
//       <button className={styles.confirmButton} onClick={handleConfirm}>Confirm</button>
//     </div>
//   );
// };

// export default BookingDetails;
// http://localhost:4040/api/operating-hours

// import React from "react";
// import styles from "./BookingDetails.module.css";

// const BookingDetails = ({
//   selectedDate,
//   selectedGuests,
//   selectedSlot,
//   selectedMeal,
//   selectedOffer,
//   goBack,
// }) => {
//   const getBookingDate = () => {
//     const today = new Date();
//     if (selectedDate === "Today") return today;
//     if (selectedDate === "Tomorrow") {
//       const tomorrow = new Date(today);
//       tomorrow.setDate(today.getDate() + 1);
//       return tomorrow;
//     }
//     if (selectedDate === "Day after tomorrow") {
//       const dayAfter = new Date(today);
//       dayAfter.setDate(today.getDate() + 2);
//       return dayAfter;
//     }
//     return today;
//   };

//   const handleConfirmBooking = async () => {
//     try {
//       const bookingData = {
//         date: getBookingDate(),
//         timeSlot: selectedSlot,
//         guests: parseInt(selectedGuests.split(" ")[0]),
//         meal: selectedMeal,
//         offerId: selectedOffer ? selectedOffer.id : null,
//       };

//       const response = await fetch("http://localhost:4040/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (response.ok) {
//         alert("Booking successful!");
//         goBack(); // Return to booking form
//       } else {
//         const errorData = await response.json();
//         alert(`Booking failed: ${errorData.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       alert("An error occurred while booking.");
//     }
//   };

//   return (
//     <div className={styles.detailsContainer}>
//       <h2 className={styles.detailsHeading}>Booking Details</h2>

//       <div className={styles.detailItem}>
//         <span className={styles.detailLabel}>Date:</span>
//         <span className={styles.detailValue}>{selectedDate}</span>
//       </div>

//       <div className={styles.detailItem}>
//         <span className={styles.detailLabel}>Time Slot:</span>
//         <span className={styles.detailValue}>{selectedSlot}</span>
//       </div>

//       <div className={styles.detailItem}>
//         <span className={styles.detailLabel}>Guests:</span>
//         <span className={styles.detailValue}>{selectedGuests}</span>
//       </div>

//       <div className={styles.detailItem}>
//         <span className={styles.detailLabel}>Meal:</span>
//         <span className={styles.detailValue}>{selectedMeal}</span>
//       </div>

//       <div className={styles.detailItem}>
//         <span className={styles.detailLabel}>Offer:</span>
//         <span className={styles.detailValue}>
//           {selectedOffer ? selectedOffer.name : "No Offer"}
//         </span>
//       </div>

//       {selectedOffer && (
//         <div className={styles.offerDetails}>
//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>Discount:</span>
//             <span className={styles.detailValue}>
//               {selectedOffer.discountValue}% off
//             </span>
//           </div>

//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>Offer Type:</span>
//             <span className={styles.detailValue}>
//               {selectedOffer.offerType}
//             </span>
//           </div>

//           <div className={styles.detailItem}>
//             <span className={styles.detailLabel}>Code:</span>
//             <span className={styles.detailValue}>{selectedOffer.code}</span>
//           </div>
//         </div>
//       )}

//       <div className={styles.buttonGroup}>
//         <button className={styles.confirmButton} onClick={handleConfirmBooking}>
//           Confirm Booking
//         </button>

//         <button className={styles.backButton} onClick={goBack}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookingDetails;
import React, { useState } from "react";
import Axios from "axios";
import { isValidPhoneNumber } from "libphonenumber-js";

import { useParams } from "react-router-dom";
import Success from "../../components/RestaurantComponents/OrderBodyComponent/Components/BookaTableComponent/Success";
const BookingDetails = ({
  selectedDate,
  selectedGuests,
  selectedSlot,
  selectedMeal,
  selectedOffer,
  goBack,
}) => {
  const { id } = useParams();
  const [username, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const getBookingDate = () => {
    const today = new Date();
    if (selectedDate === "Today") return today;
    if (selectedDate === "Tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    }
    if (selectedDate === "Day after tomorrow") {
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);
      return dayAfter;
    }
    return today;
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
          scheduleDate: selectedDate,  // changed key
        timeSlot: selectedSlot,
        guests: parseInt(selectedGuests.split(" ")[0]),
        meal: selectedMeal,
        offerId: selectedOffer ? selectedOffer._id : null,
        username,
        email,
        mobileNumber,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/create?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
          credentials: "include",
        }
      );

      if (response.ok) {
        setOrder(true);
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while booking.");
    }
  };
  // const handleMobileChange = (e) => {
  //   const value = e.target.value;

  //   if (!/^\d*$/.test(value)) {
  //     setMobileError("Only numeric values are allowed");
  //   } else if (value.length > 10) {
  //     setMobileError("Mobile number cannot exceed 10 digits");
  //   } else {
  //     setMobileError("");
  //   }

  //   setMobileNumber(value);
  // };
  const handleMobileChange = (e) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);

      // Validate only when 10+ digits entered (for example, in India)
      if (value.length >= 10) {
        const fullNumber = "+91" + value; // add country code
        const isValid = isValidPhoneNumber(fullNumber);

        if (isValid) {
          setMobileError("");
        } else {
          setMobileError("Invalid mobile number");
        }
      } else {
        setMobileError("Mobile number must be 10 digits");
      }
    } else {
      setMobileError("Only digits are allowed");
    }
  };

  // Email validation on input
  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmail(value);
    setEmailError(
      value && !emailRegex.test(value) ? "Invalid email format" : ""
    );
  };

  return (
    <div className=" bg-white text-black">
      {/* Booking Details Section */}
      <div className="flex flex-row gap-6 p-6">
        <div className="flex-1  p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

          <div className="mb-4">
            <span className="font-semibold">Date: </span>
            {selectedDate}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Time Slot: </span>
            {selectedSlot}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Guests: </span>
            {selectedGuests}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Meal: </span>
            {selectedMeal}
          </div>

          <div className="mb-4">
            <span className="font-semibold">Offer: </span>
            {selectedOffer ? selectedOffer.name : "No Offer"}
          </div>

          {selectedOffer && (
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="mb-2">
                <span className="font-semibold">Discount: </span>
                {selectedOffer.discountValue}% off
              </div>
              {/* <div className="mb-2">
                <span className="font-semibold">Offer Type: </span>
                {selectedOffer.offerType}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Code: </span>
                {selectedOffer.code}
              </div> */}
            </div>
          )}
        </div>

        {/* User Information Section */}
        <div className="flex-1 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>

          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2" htmlFor="mobile">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
              />
              {mobileError && (
                <p className="text-red-500 text-sm">{mobileError}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block font-semibold mb-2" htmlFor="email">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email ID"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Buttons Section */}
     <div className="flex justify-end gap-4 mt-4">
  <button
  className="bg-[var(--btn-bg)] text-[var(--btn-text)] px-6 py-2 rounded-md w-[200px] mx-auto block font-bold text-lg hover:bg-[var(--btn-hover)] active:bg-[var(--btn-active)] transition-colors"
  onClick={handleConfirmBooking}
>
  Confirm Booking
</button>
  {/* <button
    className="bg-[var(--btn-bg)] text-[var(--btn-text)] px-6 py-2 w-full rounded-md hover:bg-[var(--btn-hover)] active:bg-[var(--btn-active)] transition-colors"
    onClick={goBack}
  >
    Back
  </button> */}
</div>

      {order && <Success goBack={goBack} setOrder={setOrder} />}
    </div>
  );
};

export default BookingDetails;
