
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// // import { MdDone, MdOutlineCancel } from "react-icons/md"; // Cannot resolve react-icons
// import io from "socket.io-client";
// import axios from "axios";
// import { useDas } from "../../../../context/TiffinDashboardContext.jsx";
// // Placeholder for react-toastify
// const toast = {
//   success: (msg) => console.log("Success:", msg),
//   error: (msg) => console.error("Error:", msg),
//   info: (msg) => console.info("Info:", msg),
// };


// // Define the backend server URL (replace with your actual VITE_SERVER_URL in a real project)
// const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

// // --- Utility Functions for Date and Status Mapping (Replacing Moment.js) ---

// // Custom date formatter for "DD/MM/YY"
// const formatDateShort = (dateString) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "Invalid Date";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//   });
// };

// // Custom date formatter for detailed local time
// const formatDateTimeLocal = (dateString) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "Invalid Date";
//   return date.toLocaleString("en-GB", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   }).replace(",", "");
// };

// // Custom function for isSame day check
// const isSameDay = (date1, date2) => {
//   if (!date1 || !date2) return false;
//   const d1 = new Date(date1);
//   const d2 = new Date(date2);
//   d1.setHours(0, 0, 0, 0); // Normalize to start of day
//   d2.setHours(0, 0, 0, 0); // Normalize to start of day
//   return d1.getTime() === d2.getTime();
// };

// // Custom function for isAfter day check
// const isAfterDay = (date1, date2) => {
//     if (!date1 || !date2) return false;
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     d1.setHours(0, 0, 0, 0);
//     d2.setHours(0, 0, 0, 0);
//     return d1.getTime() > d2.getTime();
// };

// // Custom function for isSameOrAfter day check
// const isSameOrAfterDay = (date1, date2) => {
//     if (!date1 || !date2) return false;
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     d1.setHours(0, 0, 0, 0);
//     d2.setHours(0, 0, 0, 0);
//     return d1.getTime() >= d2.getTime();
// };

// // Custom function for getMaxDate
// const getMaxDate = (date1, date2) => {
//     if (!date1 || !date2) return date1 || date2;
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     return d1.getTime() > d2.getTime() ? d1 : d2;
// };

// // Custom function for adding days
// const addDays = (dateString, days) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null;
//     date.setDate(date.getDate() + days);
//     return date;
// };

// // Function to map backend status to display status
// const getDisplayStatus = (backendStatus) => {
//   switch (backendStatus) {
//     case "pending":
//     case "notaccept": // From schema default
//       return "New Order";
//     case "accept":
//     case "preparing":
//       return "Processing";
//     case "rejected":
//       return "Rejected";
//     case "ready": // From schema, implying plan completed
//       return "Plan Completed";
//     default:
//       return backendStatus;
//   }
// };

// // Function to map display status to backend status
// const getBackendStatus = (displayStatus) => {
//   switch (displayStatus) {
//     case "New Order":
//       return "pending";
//     case "Processing":
//       return "accept";
//     case "Rejected":
//       return "rejected";
//     case "Plan Completed":
//       return "ready";
//     default:
//       return displayStatus.toLowerCase();
//   }
// };

// // --- ProgressBar Component (Inline) ---
// const ProgressBar = ({ order }) => {
//   if (!order || !order.flexiblePlan) return null;

//   const totalDays = order.flexiblePlan.type === "normal"
//     ? parseInt(order.flexiblePlan.plan, 10)
//     : order.flexiblePlan.type === "date-range"
//     ? Math.max(0, (new Date(order.flexiblePlan.endDate).getTime() - new Date(order.flexiblePlan.startDate).getTime()) / (1000 * 60 * 60 * 24))
//     : order.flexiblePlan.type === "flexi-dates"
//     ? order.flexiblePlan.flexiDates?.length || 0
//     : 0;

//   // Assuming 'subStatus' tracks delivered days
//   const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0; // Changed to 'statue'
//   const progress = totalDays > 0 ? (deliveredDays / totalDays) * 100 : 0;

//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
//       <div
//         className="bg-blue-600 h-2.5 rounded-full"
//         style={{ width: `${progress}%` }}
//       ></div>
//       <div className="text-right text-xs mt-1 text-gray-500">
//         {deliveredDays} / {totalDays} days completed ({progress.toFixed(0)}%)
//       </div>
//     </div>
//   );
// };

// // --- BillingDetails Component (Inline) ---
// const BillingDetails = ({ order }) => {
//     if (!order) return <p className="text-sm text-gray-500">No billing details available.</p>;

//     return (
//         <div className="text-sm text-gray-700 space-y-1 py-2">
//             <div className="flex justify-between">
//                 <span>Subtotal:</span>
//                 <span>${(order.subtotal || 0).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//                 <span>Delivery Fee:</span>
//                 <span>${(order.deliveryFee || 0).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//                 <span>Platform Fee:</span>
//                 <span>${(order.platformFee || 0).toFixed(2)}</span>
//             </div>
//             {order.discount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                     <span>Discount:</span>
//                     <span>-${(order.discount || 0).toFixed(2)}</span>
//                 </div>
//             )}
//             {order.gstCharges > 0 && (
//                 <div className="flex justify-between">
//                     <span>GST:</span>
//                     <span>${(order.gstCharges || 0).toFixed(2)}</span>
//                 </div>
//             )}
//             <hr className="my-2 border-gray-300" />
//             <div className="flex justify-between font-bold text-base">
//                 <span>Total:</span>
//                 <span>${(order.totalPrice || 0).toFixed(2)}</span>
//             </div>
//         </div>
//     );
// };

// // --- OrderDetails Component (Inline) ---
// // const OrderDetails = ({ order, onStatusChange, getDisplayStatus }) => {
// //   console.log(order);
// //     const [ShowDeliveryDetails, setShowDeliveryDetails] = useState(false);
// //     const [ShowBillingDetails, setShowBillingDetails] = useState(false);
// //     const [remainingDays, setRemainingDays] = useState(null);

// //     const toggleDeliveryDetails = () => {
// //         setShowDeliveryDetails(!ShowDeliveryDetails);
// //         if (ShowBillingDetails) setShowBillingDetails(false);
// //     };

// //     const toggleBilingDetails = () => {
// //         setShowBillingDetails(!ShowBillingDetails);
// //         if (ShowDeliveryDetails) setShowDeliveryDetails(false);
// //     };

// //     const today = new Date();

// //     // Ensure effectiveFlexiblePlan is always declared
// //     const effectiveFlexiblePlan = useMemo(() => {
// //         if (!order) return null;

// //         let plan = order.flexiblePlan;
// //         if (!plan && order.items && order.items.length > 0) {
// //             const item = order.items[0];
// //             if (item.selectedPlan?.name === "date-range") {
// //                 plan = { type: "date-range", startDate: item.startDate, endDate: item.endDate };
// //             } else if (item.selectedPlan?.name === "flexi-dates" && Array.isArray(item.flexiDates)) {
// //                 plan = { type: "flexi-dates", flexiDates: item.flexiDates };
// //             } else if (!isNaN(parseInt(item.selectedPlan?.name, 10))) {
// //                  plan = { type: "normal", plan: item.selectedPlan?.name, startDate: item.startDate };
// //             }
// //         }
// //         return plan;
// //     }, [order]);


// //     useEffect(() => {
// //         if (!order || !effectiveFlexiblePlan) {
// //             setRemainingDays(null);
// //             return;
// //         }

// //         if (effectiveFlexiblePlan.type === "normal") {
// //             const startDate = new Date(effectiveFlexiblePlan.startDate || order.startDate);
// //             const referenceDate = getMaxDate(today, startDate);
// //             const endDate = addDays(startDate.toISOString(), parseInt(effectiveFlexiblePlan.plan, 10));

// //             if (isAfterDay(referenceDate, endDate)) {
// //                 setRemainingDays(0);
// //             } else {
// //                 const diffTime = Math.abs(endDate.getTime() - referenceDate.getTime());
// //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //                 setRemainingDays(diffDays);
// //             }
// //         } else if (effectiveFlexiblePlan.type === "date-range") {
// //             const startDate = new Date(effectiveFlexiblePlan.startDate);
// //             const referenceDate = getMaxDate(today, startDate);
// //             const endDate = new Date(effectiveFlexiblePlan.endDate);

// //             if (isAfterDay(referenceDate, endDate)) {
// //                 setRemainingDays(0);
// //             } else {
// //                 const diffTime = Math.abs(endDate.getTime() - referenceDate.getTime());
// //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //                 setRemainingDays(diffDays);
// //             }
// //         } else if (effectiveFlexiblePlan.type === "flexi-dates") {
// //             if (!Array.isArray(effectiveFlexiblePlan.flexiDates) || effectiveFlexiblePlan.flexiDates.length === 0) {
// //                 console.log("No flexiDates found for this order.");
// //                 setRemainingDays(0);
// //                 return;
// //             }
// //             const startDate = new Date(order.startDate || effectiveFlexiblePlan.flexiDates[0]); // Fallback to first flexi date if order.startDate missing
// //             const referenceDate = getMaxDate(today, startDate);

// //             const remainingDeliveries = effectiveFlexiblePlan.flexiDates.filter(date => isSameOrAfterDay(new Date(date), referenceDate)).length;
            
// //             const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0;
// //             setRemainingDays(remainingDeliveries);
// //         } else {
// //              setRemainingDays(null);
// //         }
// //     }, [order, effectiveFlexiblePlan, today]);

// //     const handleStatusChange = (event) => {
// //         const newStatus = event.target.value;
// //         if (onStatusChange) {
// //             onStatusChange(order._id, newStatus);
// //         }
// //     };

// //     if (!order) return <div className="text-gray-500 p-4">Select an order to view details.</div>;
// //     return (
// //         <div className="bg-white shadow-md rounded-md px-2 w-full overflow-hidden max-h-screen overflow-y-auto">
// //             {!ShowDeliveryDetails && !ShowBillingDetails &&
// //                 <div className="py-2">
// //                     <div className="flex items-center justify-between">
// //                         <h2 className="text-lg font-semibold">Order Details</h2>
// //                         <div className="flex justify-between gap-4 items-center">
// //                             <div className="py-2 flex items-center gap-2">
// //                                 <select
// //                                     value={getDisplayStatus(order.status)}
// //                                     onChange={handleStatusChange}
// //                                     className={`px-2 py-1 rounded-md text-sm font-medium
// //                                         ${getDisplayStatus(order.status) === "New Order" ? "bg-yellow-100 text-yellow-800" : ""}
// //                                         ${getDisplayStatus(order.status) === "Processing" ? "bg-blue-100 text-blue-800" : ""}
// //                                         ${getDisplayStatus(order.status) === "Rejected" ? "bg-red-100 text-red-800" : ""}
// //                                         ${getDisplayStatus(order.status) === "Plan Completed" ? "bg-green-100 text-green-800" : ""}
// //                                     `}
// //                                 >
// //                                     <option value="New Order">New Order</option>
// //                                     <option value="Processing">Processing</option>
// //                                     <option value="Rejected">Rejected</option>
// //                                     <option value="Plan Completed">Plan Completed</option>
// //                                 </select>
// //                             </div>
// //                         </div>
// //                     </div>
// //                     <div className="flex items-center space-x-4 mb-4">
// //                         <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
// //                             <img
// //                                 src={order.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
// //                                 alt={order.userId?.username || "Customer"}
// //                                 className="w-full h-full object-cover"
// //                             />
// //                         </div>
// //                         <div>
// //                             <h3 className="text-sm font-medium">{order.userId?.username || "Unknown Customer"}</h3>
// //                             <div className="flex items-center text-sm text-gray-500">
// //                                 {/* Using placeholder icon for FiPhone */}
// //                                 <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
// //                                 </svg>
// //                                 {order?.phone ? `(${order?.phone.countryCode}) ${order?.phone.number}` : "N/A"}
// //                             </div>
// //                             <div className="flex items-center text-sm text-gray-500">
// //                                 {/* Using placeholder icon for FiMapPin */}
// //                                 <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
// //                                 </svg>
// //                                 {order?.address || "N/A"}
// //                             </div>
// //                             <div className="flex items-center text-sm text-gray-500 gap-2">
// //                                 <span>Id:</span>
// //                                 <span className="break-all">{order._id}</span>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <hr className="my-2" />

// //                     <div className="mb-1">
// //                         <h4 className="text-sm font-semibold mb-1">Special Instructions</h4>
// //                         <p className="text-sm text-gray-500">{order.specialInstructions || "None"}</p>
// //                     </div>

// //                     <hr className="my-2" />

// //                     <div className="grid grid-cols-3 gap-4 text-sm mb-4">
// //                         <div>
// //                             <h4 className="font-semibold">Meal Type</h4>
// //                             <p className="text-gray-500">{order.items?.[0]?.mealType?.name || "N/A"}</p>
// //                         </div>
// //                         <div>
// //                             <h4 className="font-semibold">Quantity</h4>
// //                             <p className="text-gray-500">{order.items?.[0]?.quantity || "N/A"}</p>
// //                         </div>
// //                         <div className="flex flex-col gap-1">
// //                             <span className="text-sm font-semibold">Placed Time</span>
// //                             <span className="text-sm text-gray-500">
// //                                 {formatDateTimeLocal(order.orderTime) || "N/A"}
// //                             </span>
// //                         </div>
// //                         <div className="flex flex-col gap-1">
// //                             <span className="text-sm font-semibold">Time Selected DeliveryTime:</span>
// //                             <span className="text-sm text-gray-500">
// //                                 {formatDateTimeLocal(order.deliverTime) || "N/A"}
// //                             </span>
// //                         </div>
// //                     </div>

// //                     <hr className="my-2" />
// //                     <div className="flex justify-between items-center w-full">
// //                         <div className="w-full">
// //                             <h4 className="text-sm font-semibold mb-1">Plan</h4>
// //                             {
// //                                 effectiveFlexiblePlan && effectiveFlexiblePlan.type === "date-range" ? (
// //                                     <div className="flex items-center text-sm text-gray-500">
// //                                         {/* Using placeholder icon for FiCalendar */}
// //                                         <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                                         </svg>
// //                                         {formatDateShort(effectiveFlexiblePlan.startDate)}{" "}
// //                                         -{" "}
// //                                         {formatDateShort(effectiveFlexiblePlan.endDate)}
// //                                     </div>
// //                                 ) : effectiveFlexiblePlan && effectiveFlexiblePlan.type === "normal" ? (
// //                                     <span className="text-sm text-gray-500">
// //                                         {effectiveFlexiblePlan.plan} Days
// //                                         {effectiveFlexiblePlan.startDate && ` (Start Date: ${formatDateShort(effectiveFlexiblePlan.startDate)})`}
// //                                     </span>
// //                                 ) : effectiveFlexiblePlan && Array.isArray(effectiveFlexiblePlan.flexiDates) && effectiveFlexiblePlan.flexiDates.length > 0 ? (
// //                                     <div className="flex flex-wrap gap-1">
// //                                         {effectiveFlexiblePlan.flexiDates.map((date, index) => (
// //                                             <span
// //                                                 key={index}
// //                                                 className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
// //                                             >
// //                                                 {formatDateShort(date)}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 ) : (
// //                                     <p className="text-sm text-gray-500">No plan available</p>
// //                                 )
// //                             }
// //                         </div>
// //                     </div>
// //                     <div className="">
// //                         <div className="flex justify-between gap-4 items-center mt-3">
// //                             <h4 className="text-sm font-semibold mb-2">Order Progress</h4>
// //                         </div>
// //                         <div>
// //                             <ProgressBar order={order} />
// //                         </div>
// //                     </div>
// //                 </div>
// //             }
// //             {!ShowDeliveryDetails && !ShowBillingDetails &&
// //                 <div className={`flex justify-between items-center my-2 mt-3 mb-3`}>
// //                     <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm flex items-center">Show Billing Details</button>
// //                     {remainingDays !== null && (
// //                         <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm flex items-center">
// //                             {remainingDays === 0 && "Plan Completed"}
// //                         </button>
// //                     )}
// //                 </div>
// //             }
// //             {ShowDeliveryDetails && !ShowBillingDetails &&
// //                 < div >
// //                     <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
// //                         <h2 className="text-lg font-semibold">Delivery Details</h2>
// //                         <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm">Show Order Details</button>
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-2 pb-2">
// //                         {Array.isArray(order.subStatus) && order.subStatus.length > 0 ? (
// //                             order.subStatus.map((statusEntry) => (
// //                                 <div key={statusEntry._id || statusEntry.date} className="flex items-center gap-2">
// //                                     <span className="text-sm">
// //                                         {formatDateShort(statusEntry.date)}:
// //                                     </span>
// //                                     <span className={`text-xs ${statusEntry.statue === "Not Delivered" || statusEntry.statue === "pending" ? "text-red-500" : "text-green-500"}`}>
// //                                         {statusEntry.statue}
// //                                     </span>
// //                                 </div>
// //                             ))
// //                         ) : (
// //                             <p className="text-sm text-gray-500">No delivery details available.</p>
// //                         )}
// //                     </div>
// //                 </div>
// //             }
// //             {!ShowDeliveryDetails && ShowBillingDetails &&
// //                 <div>
// //                     <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
// //                         <h2 className="text-lg font-semibold">Billing Details</h2>
// //                         <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm">Show Order Details</button>
// //                     </div>
// //                     <BillingDetails order={order} />
// //                 </div>
// //             }
// //         </div >
// //     );
// // };
// const OrderDetails = ({ order, onStatusChange, getDisplayStatus }) => {
//     console.log(order);
//     const [ShowDeliveryDetails, setShowDeliveryDetails] = useState(false);
//     const [ShowBillingDetails, setShowBillingDetails] = useState(false);
//     const [remainingDays, setRemainingDays] = useState(null);

//     const toggleDeliveryDetails = () => {
//         setShowDeliveryDetails(!ShowDeliveryDetails);
//         if (ShowBillingDetails) setShowBillingDetails(false);
//     };

//     const toggleBilingDetails = () => {
//         setShowBillingDetails(!ShowBillingDetails);
//         if (ShowDeliveryDetails) setShowDeliveryDetails(false);
//     };

//     const today = new Date();

//     // effectiveFlexiblePlan might need to be adjusted if you expect multiple flexible plans
//     // for multiple tiffin items. For now, it derives from the first item if order.flexiblePlan is null.
//     const effectiveFlexiblePlan = useMemo(() => {
//         if (!order) return null;

//         let plan = order.flexiblePlan; // Check if order itself has a top-level flexiblePlan
//         if (!plan && order.items && order.items.length > 0) {
//             // If not, try to derive from the first tiffin item (if any)
//             const firstTiffinItem = order.items.find(item => item.itemType === 'tiffin');
//             if (firstTiffinItem) {
//                 if (firstTiffinItem.selectedPlan?.name === "date-range") {
//                     plan = { type: "date-range", startDate: firstTiffinItem.startDate, endDate: firstTiffinItem.endDate };
//                 } else if (firstTiffinItem.selectedPlan?.name === "flexi-dates" && Array.isArray(firstTiffinItem.flexiDates)) {
//                     plan = { type: "flexi-dates", flexiDates: firstTiffinItem.flexiDates };
//                 } else if (!isNaN(parseInt(firstTiffinItem.selectedPlan?.name, 10))) {
//                     plan = { type: "normal", plan: firstTiffinItem.selectedPlan?.name, startDate: firstTiffinItem.startDate };
//                 }
//             }
//         }
//         return plan;
//     }, [order]);


//     useEffect(() => {
//         if (!order || !effectiveFlexiblePlan) {
//             setRemainingDays(null);
//             return;
//         }

//         if (effectiveFlexiblePlan.type === "normal") {
//             const startDate = new Date(effectiveFlexiblePlan.startDate || order.startDate);
//             const referenceDate = getMaxDate(today, startDate);
//             const endDate = addDays(startDate.toISOString(), parseInt(effectiveFlexiblePlan.plan, 10));

//             if (isAfterDay(referenceDate, endDate)) {
//                 setRemainingDays(0);
//             } else {
//                 const diffTime = Math.abs(endDate.getTime() - referenceDate.getTime());
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                 setRemainingDays(diffDays);
//             }
//         } else if (effectiveFlexiblePlan.type === "date-range") {
//             const startDate = new Date(effectiveFlexiblePlan.startDate);
//             const referenceDate = getMaxDate(today, startDate);
//             const endDate = new Date(effectiveFlexiblePlan.endDate);

//             if (isAfterDay(referenceDate, endDate)) {
//                 setRemainingDays(0);
//             } else {
//                 const diffTime = Math.abs(endDate.getTime() - referenceDate.getTime());
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                 setRemainingDays(diffDays);
//             }
//         } else if (effectiveFlexiblePlan.type === "flexi-dates") {
//             if (!Array.isArray(effectiveFlexiblePlan.flexiDates) || effectiveFlexiblePlan.flexiDates.length === 0) {
//                 console.log("No flexiDates found for this order.");
//                 setRemainingDays(0);
//                 return;
//             }
//             // Filter future flexiDates relative to today or order.startDate, whichever is later
//             const referenceDate = getMaxDate(today, new Date(order.startDate || effectiveFlexiblePlan.flexiDates[0]));

//             const remainingDeliveries = effectiveFlexiblePlan.flexiDates.filter(date => {
//                 // Ensure date is a valid Date object before comparing
//                 const flexiDate = new Date(date);
//                 return !isNaN(flexiDate.getTime()) && isSameOrAfterDay(flexiDate, referenceDate);
//             }).length;

//             // Note: `deliveredDays` calculation isn't directly used for `remainingDays` state,
//             // but `remainingDeliveries` is.
//             // const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0;
//             setRemainingDays(remainingDeliveries);
//         } else {
//             setRemainingDays(null);
//         }
//     }, [order, effectiveFlexiblePlan, today]);

//     const handleStatusChange = (event) => {
//         const newStatus = event.target.value;
//         if (onStatusChange) {
//             onStatusChange(order._id, newStatus);
//         }
//     };

//     if (!order) return <div className="text-gray-500 p-4">Select an order to view details.</div>;

//     return (
//         <div className="bg-white shadow-md rounded-md px-2 w-full overflow-hidden max-h-screen overflow-y-auto">
//             {!ShowDeliveryDetails && !ShowBillingDetails && (
//                 <div className="py-2">
//                     <div className="flex items-center justify-between">
//                         <h2 className="text-lg font-semibold">Order Details</h2>
//                         <div className="flex justify-between gap-4 items-center">
//                             <div className="py-2 flex items-center gap-2">
//                                 <select
//                                     value={getDisplayStatus(order.status)}
//                                     onChange={handleStatusChange}
//                                     className={`px-2 py-1 rounded-md text-sm font-medium
//                                         ${getDisplayStatus(order.status) === "New Order" ? "bg-yellow-100 text-yellow-800" : ""}
//                                         ${getDisplayStatus(order.status) === "Processing" ? "bg-blue-100 text-blue-800" : ""}
//                                         ${getDisplayStatus(order.status) === "Rejected" ? "bg-red-100 text-red-800" : ""}
//                                         ${getDisplayStatus(order.status) === "Plan Completed" ? "bg-green-100 text-green-800" : ""}
//                                     `}
//                                 >
//                                     <option value="New Order">New Order</option>
//                                     <option value="Processing">Processing</option>
//                                     <option value="Rejected">Rejected</option>
//                                     <option value="Plan Completed">Plan Completed</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex items-center space-x-4 mb-4">
//                         <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
//                             <img
//                                 src={order.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
//                                 alt={order.userId?.username || "Customer"}
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                         <div>
//                             <h3 className="text-sm font-medium">{order.userId?.username || "Unknown Customer"}</h3>
//                             <div className="flex items-center text-sm text-gray-500">
//                                 {/* Using placeholder icon for FiPhone */}
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                 </svg>
//                                 {order?.phone ? `(${order?.phone.countryCode}) ${order?.phone.number}` : "N/A"}
//                             </div>
//                             <div className="flex items-center text-sm text-gray-500">
//                                 {/* Using placeholder icon for FiMapPin */}
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                                 {order?.address || "N/A"}
//                             </div>
//                             <div className="flex items-center text-sm text-gray-500 gap-2">
//                                 <span>Id:</span>
//                                 <span className="break-all">{order._id}</span>
//                             </div>
//                         </div>
//                     </div>

//                     <hr className="my-2" />

//                     <div className="mb-1">
//                         <h4 className="text-sm font-semibold mb-1">Special Instructions</h4>
//                         <p className="text-sm text-gray-500">{order.specialInstructions || "None"}</p>
//                     </div>
//                     {order?.cancellationReason && (

//                       <div className="mb-1">
//                         <h4 className="text-sm font-semibold mb-1">User cancellationReason :</h4>
//                         <p className="text-sm text-gray-500">{order.cancellationReason}</p>
//                         <h4 className="text-sm font-semibold mb-1">CancelAt :</h4>
//                         <p className="text-sm text-gray-500">{formatDateShort(order.cancelledAt)}</p>
//                     </div>
//                     )}
//                     <hr className="my-2" />

//                     {/* Loop through order.items to display details for each item */}
//                     {order.items && order.items.length > 0 ? (
//                         order.items.map((item, index) => (
//                             <div key={item._id || index} className="mb-4 p-2 border border-gray-200 rounded-md">
//                                 <h4 className="font-semibold text-base mb-1">Item {index + 1}: {item.name || "N/A"}</h4>
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
//                                     <div>
//                                         <h5 className="font-semibold">Meal Type</h5>
//                                         <p className="text-gray-500">{item.mealType?.name || "N/A"}</p>
//                                     </div>
//                                     <div>
//                                         <h5 className="font-semibold">Quantity</h5>
//                                         <p className="text-gray-500">{item.quantity || "N/A"}</p>
//                                     </div>
//                                     <div className="flex flex-col gap-1">
//                                         <span className="font-semibold">Plan Type</span>
//                                         {/* Render plan specific to this item if it has one, otherwise default to "N/A" */}
//                                         {item.selectedPlan?.name === "date-range" && item.startDate && item.endDate ? (
//                                             <span className="text-gray-500">
//                                                 {formatDateShort(item.startDate)} - {formatDateShort(item.endDate)}
//                                             </span>
//                                         ) : item.selectedPlan?.name === "flexi-dates" && Array.isArray(item.flexiDates) && item.flexiDates.length > 0 ? (
//                                             <div className="flex flex-wrap gap-1">
//                                                 {item.flexiDates.map((date, dateIndex) => (
//                                                     <span
//                                                         key={dateIndex}
//                                                         className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
//                                                     >
//                                                         {formatDateShort(date)}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         ) : !isNaN(parseInt(item.selectedPlan?.name, 10)) ? (
//                                             <span className="text-gray-500">
//                                                 {item.selectedPlan.name} Days {item.startDate && ` (Start: ${formatDateShort(item.startDate)})`}
//                                             </span>
//                                         ) : (
//                                             <p className="text-gray-500">Standard</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-sm text-gray-500">No items found for this order.</p>
//                     )}


//                     <hr className="my-2" />

//                     <div className="grid grid-cols-2 gap-4 text-sm mb-4">
//                         <div className="flex flex-col gap-1">
//                             <span className="text-sm font-semibold">Placed Time</span>
//                             <span className="text-sm text-gray-500">
//                                 {formatDateTimeLocal(order.orderTime) || "N/A"}
//                             </span>
//                         </div>
//                         <div className="flex flex-col gap-1">
//                             <span className="text-sm font-semibold">Time Selected DeliveryTime:</span>
//                             <span className="text-sm text-gray-500">
//                                 {(order.deliverTime) || "N/A"}
//                             </span>
//                         </div>
//                     </div>


//                     <hr className="my-2" />
//                     <div className="flex justify-between items-center w-full">
//                         <div className="w-full">
//                             <h4 className="text-sm font-semibold mb-1">Overall Plan Progress</h4>
//                             {
//                                 effectiveFlexiblePlan && effectiveFlexiblePlan.type === "date-range" ? (
//                                     <div className="flex items-center text-sm text-gray-500">
//                                         {/* Using placeholder icon for FiCalendar */}
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                         </svg>
//                                         {formatDateShort(effectiveFlexiblePlan.startDate)}{" "}
//                                         -{" "}
//                                         {formatDateShort(effectiveFlexiblePlan.endDate)}
//                                     </div>
//                                 ) : effectiveFlexiblePlan && effectiveFlexiblePlan.type === "normal" ? (
//                                     <span className="text-sm text-gray-500">
//                                         {effectiveFlexiblePlan.plan} Days
//                                         {effectiveFlexiblePlan.startDate && ` (Start Date: ${formatDateShort(effectiveFlexiblePlan.startDate)})`}
//                                     </span>
//                                 ) : effectiveFlexiblePlan && Array.isArray(effectiveFlexiblePlan.flexiDates) && effectiveFlexiblePlan.flexiDates.length > 0 ? (
//                                     <div className="flex flex-wrap gap-1">
//                                         {effectiveFlexiblePlan.flexiDates.map((date, index) => (
//                                             <span
//                                                 key={index}
//                                                 className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
//                                             >
//                                                 {formatDateShort(date)}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-sm text-gray-500">No plan available</p>
//                                 )
//                             }
//                         </div>
//                     </div>
//                     <div className="">
//                         <div className="flex justify-between gap-4 items-center mt-3">
//                             <h4 className="text-sm font-semibold mb-2">Overall Order Progress</h4>
//                         </div>
//                         <div>
//                             <ProgressBar order={order} />
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {!ShowDeliveryDetails && !ShowBillingDetails &&
//                 <div className={`flex justify-between items-center my-2 mt-3 mb-3`}>
//                     <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm flex items-center">Show Billing Details</button>
//                     {remainingDays !== null && (
//                         <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm flex items-center">
//                             {remainingDays === 0 ? "Plan Completed" : `Remaining Days/Deliveries: ${remainingDays}`}
//                         </button>
//                     )}
//                 </div>
//             }
//             {ShowDeliveryDetails && !ShowBillingDetails &&
//                 < div >
//                     <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
//                         <h2 className="text-lg font-semibold">Delivery Details</h2>
//                         <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm">Show Order Details</button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 pb-2">
//                         {Array.isArray(order.subStatus) && order.subStatus.length > 0 ? (
//                             order.subStatus.map((statusEntry) => (
//                                 <div key={statusEntry._id || statusEntry.date} className="flex items-center gap-2">
//                                     <span className="text-sm">
//                                         {formatDateShort(statusEntry.date)}:
//                                     </span>
//                                     <span className={`text-xs ${statusEntry.statue === "Not Delivered" || statusEntry.statue === "pending" ? "text-red-500" : "text-green-500"}`}>
//                                         {statusEntry.statue}
//                                     </span>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-sm text-gray-500">No delivery details available.</p>
//                         )}
//                     </div>
//                 </div>
//             }
//             {!ShowDeliveryDetails && ShowBillingDetails &&
//                 <div>
//                     <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
//                         <h2 className="text-lg font-semibold">Billing Details</h2>
//                         <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm">Show Order Details</button>
//                     </div>
//                     <BillingDetails order={order} />
//                 </div>
//             }
//         </div >
//     );
// };


// // --- Main ManageOrders Component ---
// const ManageOrders = () => {
//   const [originalOrders, setOriginalOrders] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [mealPlanFilter, setMealPlanFilter] = useState("");
//   const [mealTypeFilter, setmealTypeFilter] = useState("");
//   const [timeFilter, setTimeFilter] = useState("");
//   const [filters, setFilters] = useState({
//     customer: "",
//     total: "",
//   });
//   const [totalRange, setTotalRange] = useState("");
//   const [showReasonBox, setshowReasonBox] = useState(true);
//   const [reason, setReason] = useState("");
//   const [sortOrderByDistance, setSortOrderByDistance] = useState("");
//   const [distanceRange, setDistanceRange] = useState("");
//   const [bulkActionOrders, setBulkActionOrders] = useState([]);
//   const [bulkActionType, setBulkActionType] = useState("");
//   const [PendingrejectedOrders, setPendingrejectedOrders] = useState(null);

//   const initialSatteOfGuide =
//     JSON.parse(localStorage.getItem("GuideState")) ?? true;
//   const [closeGuide, setcloseGuide] = useState(initialSatteOfGuide);

//   const { latestNewOrder, setLatestNewOrder, loadingProfile } = useDas();

//   useEffect(() => {
//     localStorage.setItem("GuideState", JSON.stringify(closeGuide));
//   }, [closeGuide]);

//   const token = localStorage.getItem("token");
//   const socket = useMemo(() => io(SERVER_URL), []);


//   const fetchTiffinOrders = useCallback(async () => {
//     try {
//       if (!token) {
//         toast.error("Authentication token not found. Please log in.");
//         // Do NOT set mock data if no token; leave empty
//         setOriginalOrders([]);
//         setRecentActivity([]);
//         setSelectedOrder(null);
//         return;
//       }

//       const response = await axios.get(
//         `${SERVER_URL}/api/orders/tiffin/email`,
//         { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//       );
//       console.log(response.data.orders);
//       const fetchedOrders = response.data.orders.map(order => ({
//         ...order,
//         // Frontend expects phone/address at top level, map from userId if populated
//         phone: order.userId?.phone || order.phone,
//         address: order.userId?.address || order.address,
//         // Avatar is purely frontend-generated, keep existing or generate if userId.username exists.
//         avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
//         // Distance is also currently mock/frontend. Keep existing or default.
//         distance: order.distance || 'N/A',
//         // Derive flexiblePlan structure from items[0] for consistent frontend use
//         flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
//                       order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
//                       !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
//       }));


//       if (fetchedOrders.length > 0) {
//         setSelectedOrder(fetchedOrders[0]);
//       }
//       setOriginalOrders(fetchedOrders);
//       setRecentActivity(fetchedOrders);
//       toast.success("Tiffin orders loaded!");
//     } catch (err) {
//       console.error("Error fetching tiffin orders:", err);
//       toast.error(`Failed to fetch orders: ${err.response?.data?.message || err.message}.`);
//       // Do NOT fall back to mock data on error; keep empty
//       setOriginalOrders([]);
//       setRecentActivity([]);
//       setSelectedOrder(null);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (!loadingProfile) { // Fetch orders once profile is loaded (or if not loading)
//       fetchTiffinOrders();
//     }
//   }, [loadingProfile, fetchTiffinOrders]);

//   useEffect(() => {
//     if (latestNewOrder) {
//       // Re-process the new order to ensure consistency with other fetched orders
//       const processedNewOrder = {
//         ...latestNewOrder,
//         phone: latestNewOrder.userId?.phone || latestNewOrder.phone,
//         address: latestNewOrder.userId?.address || latestNewOrder.address,
//         avatar: latestNewOrder.avatar || (latestNewOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${latestNewOrder.userId.username}` : undefined),
//         distance: latestNewOrder.distance || 'N/A',
//         flexiblePlan: latestNewOrder.flexiblePlan || (latestNewOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: latestNewOrder.items[0].startDate, endDate: latestNewOrder.items[0].endDate } :
//                       latestNewOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: latestNewOrder.items[0].flexiDates } :
//                       !isNaN(parseInt(latestNewOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: latestNewOrder.items[0].selectedPlan?.name, startDate: latestNewOrder.items[0].startDate } : undefined)
//       };

//       setOriginalOrders((prevOrders) => [processedNewOrder, ...prevOrders]);
//       setRecentActivity((prevOrders) => [processedNewOrder, ...prevOrders]);
//       setSelectedOrder(processedNewOrder);
//       setLatestNewOrder(null);
//       toast.info("A new order has arrived!");
//     }
//   }, [latestNewOrder, setLatestNewOrder]);


//   const statusChange = async (orderId, newStatusDisplay) => {
//     if (newStatusDisplay === "Rejected") {
//       setshowReasonBox(false);
//       setPendingrejectedOrders(orderId);
//       return;
//     }
//     updateOrderStatus(orderId, getBackendStatus(newStatusDisplay));
//   };

//   const handleSend = async () => {
//     if (reason.trim()) {
//       setshowReasonBox(true);
//       const orderId = PendingrejectedOrders;
//       setPendingrejectedOrders(null);

//       if (orderId) {
//         updateOrderStatus(orderId, "rejected", reason);
//       }
//       setReason("");
//     } else {
//       console.warn("Please provide a reason for rejection.");
//       toast.error("Please provide a reason for rejection.");
//     }
//   };

//   const updateOrderStatus = async (orderId, newBackendStatus, rejectionReason = "") => {
//     const originalSelectedOrder = selectedOrder; // Save original selected order
//     // Optimistic UI update
//     const updatedOrders = recentActivity.map((order) =>
//       order._id === orderId ? { ...order, status: newBackendStatus, rejectionReason: rejectionReason } : order
//     );
//     setRecentActivity(updatedOrders);
//     setOriginalOrders(updatedOrders);

//     if (selectedOrder?._id === orderId) {
//       setSelectedOrder({ ...selectedOrder, status: newBackendStatus, rejectionReason: rejectionReason });
//     }

//     try {
//       const payload = { status: newBackendStatus };
//       if (newBackendStatus === "rejected" && rejectionReason) {
//         payload.rejectionReason = rejectionReason;
//       }
//       console.log(payload);
//       const response = await axios.put(
//         `${SERVER_URL}/api/order/${orderId}`, // Updated URL to match backend route
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       // Backend should return the full updated order with populated userId for consistency
//       const backendUpdatedOrder = response.data.order;
//       // Re-map the returned order to include necessary frontend-derived fields
//       const processedUpdatedOrder = {
//         ...backendUpdatedOrder,
//         phone: backendUpdatedOrder.userId?.phone || backendUpdatedOrder.phone,
//         address: backendUpdatedOrder.userId?.address || backendUpdatedOrder.address,
//         avatar: backendUpdatedOrder.avatar || (backendUpdatedOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${backendUpdatedOrder.userId.username}` : undefined),
//         distance: backendUpdatedOrder.distance || 'N/A', // Assuming distance remains mock or is calculated by backend
//         flexiblePlan: backendUpdatedOrder.flexiblePlan || (backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: backendUpdatedOrder.items[0].startDate, endDate: backendUpdatedOrder.items[0].endDate } :
//                       backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: backendUpdatedOrder.items[0].flexiDates } :
//                       !isNaN(parseInt(backendUpdatedOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: backendUpdatedOrder.items[0].selectedPlan?.name, startDate: backendUpdatedOrder.items[0].startDate } : undefined)
//       };

//       setRecentActivity(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
//       setOriginalOrders(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
//       if (selectedOrder?._id === orderId) {
//         setSelectedOrder(processedUpdatedOrder);
//       }

//       toast.success(`Order ${orderId} status updated to ${getDisplayStatus(newBackendStatus)}!`);
//     } catch (err) {
//       console.error("Error updating order status:", err);
//       toast.error("Failed to update order status.");
//       // Revert state on error for robust error handling
//       setRecentActivity(originalOrders);
//       setOriginalOrders(originalOrders);
//       if (originalSelectedOrder?._id === orderId) {
//         setSelectedOrder(originalSelectedOrder); // Revert selected order
//       }
//     }
//   };

//   const triggerBulkAction = (action) => {
//     if (action === "All Reject") {
//       setshowReasonBox(false);
//     } else {
//         setshowReasonBox(true);
//     }

//     let applicableOrders = [];
//     if (action === "All Accept" || action === "All Reject") {
//       applicableOrders = originalOrders.filter(
//         (order) => order.status === "pending" || order.status === "notaccept"
//       );
//     } else if (action === "Delivered All") {
//       const today = new Date();
//       applicableOrders = originalOrders.filter(
//         (order) =>
//           (order.status === "accept" || order.status === "preparing") &&
//           order.subStatus?.some(
//             (day) =>
//               isSameDay(day.date, today) && (day.statue === "pending" || day.statue === "Not Delivered") // Changed to 'statue'
//           )
//       );
//     }

//     if (applicableOrders.length === 0) {
//       console.warn("No orders available for this action.");
//       toast.info("No orders available for this action.");
//       setBulkActionOrders([]);
//       setBulkActionType("");
//       return;
//     }

//     setBulkActionOrders(
//       applicableOrders.map((order) => ({ ...order, selected: true }))
//     );
//     setBulkActionType(action);
//   };

//   const applyBulkAction = async () => {
//     const selectedOrders = bulkActionOrders.filter((order) => order.selected);

//     if (selectedOrders.length === 0) {
//       console.warn("No orders selected for this action.");
//       toast.error("No orders selected for this action.");
//       return;
//     }

//     const orderIds = selectedOrders.map((order) => order._id);
//     let newBackendStatus;
//     if (bulkActionType === "All Accept") {
//       newBackendStatus = "accept";
//     } else if (bulkActionType === "All Reject") {
//       if (!reason.trim()) {
//         console.warn("Please provide a reason for bulk rejection.");
//         toast.error("Please provide a reason for bulk rejection.");
//         return;
//       }
//       newBackendStatus = "rejected";
//     } else if (bulkActionType === "Delivered All") {
//       newBackendStatus = "delivered_today_bulk"; // This is an internal action type
//     }

//     try {
//       const payload = {
//         action: bulkActionType,
//         orderIds,
//         // For bulk reject, include reason
//         ...(bulkActionType === "All Reject" && reason.trim() && { rejectionReason: reason.trim() })
//       };

//       // *** THIS AXIOS CALL IS STILL MOCKED ***
//       // You need to implement the /api/orders/bulk-action backend route
//       console.log(`MOCKED API Call: POST ${SERVER_URL}/api/orders/bulk-action with payload:`, payload);
//       // await axios.post(
//       //   `${SERVER_URL}/api/orders/bulk-action`,
//       //   payload,
//       //   {
//       //     headers: { Authorization: `Bearer ${token}` },
//       //     withCredentials: true,
//       //   }
//       // );


//       if (bulkActionType === "Delivered All") {
//         const today = new Date();
//         setRecentActivity((prevOrders) =>
//           prevOrders.map((order) => {
//             if (orderIds.includes(order._id) && (order.status === "accept" || order.status === "preparing")) {
//               const updatedSubStatus = order.subStatus ? [...order.subStatus] : [];
//               const todaySubStatusIndex = updatedSubStatus.findIndex(
//                 (entry) => isSameDay(entry.date, today)
//               );

//               if (todaySubStatusIndex !== -1) {
//                 updatedSubStatus[todaySubStatusIndex].statue = "delivered"; // Changed to 'statue'
//               } else {
//                 updatedSubStatus.push({
//                   date: today.toISOString(),
//                   statue: "delivered", // Changed to 'statue'
//                 });
//               }
//               return { ...order, subStatus: updatedSubStatus };
//             }
//             return order;
//           })
//         );
//       } else { // For All Accept/All Reject
//         setRecentActivity((prevOrders) =>
//           prevOrders.map((order) =>
//             orderIds.includes(order._id)
//               ? { ...order, status: newBackendStatus, rejectionReason: bulkActionType === "All Reject" ? reason.trim() : "" }
//               : order
//           )
//         );
//       }
//       setOriginalOrders(recentActivity); // Keep original in sync

//       setBulkActionOrders([]);
//       setBulkActionType("");
//       setReason("");
//       setshowReasonBox(true);
//       toast.success(`${bulkActionType} action applied successfully! (Mocked)`);
//     } catch (err) {
//       console.error("Error performing bulk action:", err);
//       toast.error("Failed to perform bulk action. (Mocked)");
//     }
//   };

//   const updateSubStatus = async (orderId, date, newSubStatus) => {
//     const originalSelectedOrder = selectedOrder;
//     try {
//       const payload = { date, statue: newSubStatus }; // Send 'statue' to match schema
//       const response = await axios.put(
//         `${SERVER_URL}/api/order/${orderId}`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       // Backend should return the full updated order with populated userId for consistency
//       const backendUpdatedOrder = response.data.order;
//       // Re-map the returned order to include necessary frontend-derived fields
//       const processedUpdatedOrder = {
//         ...backendUpdatedOrder,
//         phone: backendUpdatedOrder.userId?.phone || backendUpdatedOrder.phone,
//         address: backendUpdatedOrder.userId?.address || backendUpdatedOrder.address,
//         avatar: backendUpdatedOrder.avatar || (backendUpdatedOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${backendUpdatedOrder.userId.username}` : undefined),
//         distance: backendUpdatedOrder.distance || 'N/A', // Assuming distance remains mock or is calculated by backend
//         flexiblePlan: backendUpdatedOrder.flexiblePlan || (backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: backendUpdatedOrder.items[0].startDate, endDate: backendUpdatedOrder.items[0].endDate } :
//                       backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: backendUpdatedOrder.items[0].flexiDates } :
//                       !isNaN(parseInt(backendUpdatedOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: backendUpdatedOrder.items[0].selectedPlan?.name, startDate: backendUpdatedOrder.items[0].startDate } : undefined)
//       };

//       setRecentActivity(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
//       setOriginalOrders(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
//       if (selectedOrder?._id === orderId) {
//             setSelectedOrder(processedUpdatedOrder);
//       }

//       toast.success(`Daily status updated for order ${orderId} to ${newSubStatus}!`);
//     } catch (err) {
//       console.error("Error updating sub-status:", err);
//       toast.error("Failed to update daily status.");
//        // Revert state on error
//       setRecentActivity(originalOrders);
//       setOriginalOrders(originalOrders);
//       if (originalSelectedOrder?._id === orderId) {
//             setSelectedOrder(originalSelectedOrder);
//       }
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const updatedOrders = originalOrders.map((order) => {
//         // Find the latest end date among all items in the order
//         const latestEndDate = order.items?.reduce((maxDate, item) => {
//           const itemEndDate = new Date(item.endDate);
//           return itemEndDate.getTime() > maxDate.getTime() ? itemEndDate : maxDate;
//         }, new Date(0)); // Initialize with a very old date

//         if (
//           (order.status === "accept" || order.status === "preparing") && // Only for orders currently in 'processing' states
//           latestEndDate && latestEndDate.toString() !== "Invalid Date" &&
//           isAfterDay(new Date(), latestEndDate)
//         ) {
//           return { ...order, status: "ready" }; // Mark as 'ready' (Plan Completed)
//         }
//         return order;
//       });
//       if (JSON.stringify(updatedOrders) !== JSON.stringify(originalOrders)) {
//         setRecentActivity(updatedOrders);
//         setOriginalOrders(updatedOrders);
//       }
//     }, 24 * 60 * 60 * 1000); // Check once every 24 hours

//     return () => clearInterval(interval);
//   }, [originalOrders]);


//   useEffect(() => {
//     socket.on("subStatusUpdated", (order) => {
//       // Backend should send the full updated order object including populated userId, etc.
//       const processedOrder = {
//         ...order,
//         phone: order.userId?.phone || order.phone,
//         address: order.userId?.address || order.address,
//         avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
//         distance: order.distance || 'N/A',
//         flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
//                       order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
//                       !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
//       };

//       setRecentActivity((prevOrders) =>
//         prevOrders.map((o) =>
//           o._id === processedOrder._id
//             ? processedOrder
//             : o
//         )
//       );
//       setOriginalOrders((prevOrders) =>
//         prevOrders.map((o) =>
//           o._id === processedOrder._id
//             ? processedOrder
//             : o
//         )
//       );
//       if (selectedOrder?._id === processedOrder._id) {
//         setSelectedOrder(processedOrder);
//       }
//       toast.info(`Order ${processedOrder._id} daily status updated in real-time!`);
//     });

//     socket.on("bulkOrderStatusUpdated", ({ action, orders }) => {
//       const processedOrders = orders.map(order => ({
//         ...order,
//         phone: order.userId?.phone || order.phone,
//         address: order.userId?.address || order.address,
//         avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
//         distance: order.distance || 'N/A',
//         flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
//                       order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
//                       !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
//       }));

//       setRecentActivity((prevOrders) =>
//         prevOrders.map((order) => {
//           const updatedOrder = processedOrders.find((updated) => updated._id === order._id);
//           return updatedOrder ? updatedOrder : order;
//         })
//       );
//       setOriginalOrders((prevOrders) =>
//         prevOrders.map((order) => {
//           const updatedOrder = processedOrders.find((updated) => updated._id === order._id);
//           return updatedOrder ? updatedOrder : order;
//         })
//       );
//       if (selectedOrder && processedOrders.some(o => o._id === selectedOrder._id)) {
//           setSelectedOrder(processedOrders.find(o => o._id === selectedOrder._id));
//       }
//       toast.info(`Bulk order status updated in real-time for ${processedOrders.length} orders!`);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket, selectedOrder]);


//   const uniqueMealPlans = useMemo(() => {
//     return [
//       ...new Set(
//         (Array.isArray(originalOrders) ? originalOrders : [])
//           .flatMap((order) => {
//             let planType = null;
//             // First, try to get plan from flexiblePlan if it exists at the top level
//             if (order.flexiblePlan) {
//               if (order.flexiblePlan.type === "normal") {
//                 planType = `${order.flexiblePlan.plan} Days`;
//               } else if (order.flexiblePlan.type === "date-range") {
//                 planType = "Date Range Plan";
//               } else if (order.flexiblePlan.type === "flexi-dates") {
//                 planType = "Flexi Dates Plan";
//               }
//             }
//             // If not found in flexiblePlan, try to derive from items
//             else if (order.items && order.items.length > 0) {
//               const item = order.items[0];
//               if (item.selectedPlan?.name === "1") planType = "Trial Plan";
//               else if (item.selectedPlan?.name === "date-range") planType = "Date Range Plan";
//               else if (item.selectedPlan?.name === "flexi-dates") planType = "Flexi Dates Plan";
//               else if (item.selectedPlan ?.name&& !isNaN(parseInt(item.selectedPlan?.name, 10))) {
//                   planType = `${item.selectedPlan?.name} Days`;
//               }
//             }
//             return planType;
//           })
//           .filter(Boolean)
//       ), // Removed extra ')' and ',' here, and ensured proper closure for Set
//     ].sort();
//   }, [originalOrders]);


//   const applyFiltersAndSorting = useCallback(() => {
//     let filtered = Array.isArray(originalOrders) ? [...originalOrders] : [];

//     if (filters.customer) {
//       filtered = filtered.filter((order) =>
//         order.userId?.username?.toLowerCase().includes(filters.customer.toLowerCase())
//       );
//     }

//     if (filters.total) {
//       filtered = filtered.filter((order) => {
//         const orderTotal = order.totalPrice || 0;
//         const [min, max] = totalRange.split('-').map(Number);
//         if (totalRange.includes('>')) { // Handle ">1000" case
//             const greaterThan = Number(totalRange.replace('>', ''));
//             return orderTotal > greaterThan;
//         }
//         return orderTotal >= min && orderTotal <= max;
//       });
//     }

//     if (statusFilter) {
//       const backendStatusToCheck = getBackendStatus(statusFilter);
//       filtered = filtered.filter((order) => order.status === backendStatusToCheck);
//     }

//     if (mealTypeFilter) {
//       filtered = filtered.filter(
//         (order) => order.items?.[0]?.mealType?.name === mealTypeFilter
//       );
//     }

//     if (mealPlanFilter) {
//       filtered = filtered.filter((order) => {
//         let orderPlanType = null;
//         if (order.flexiblePlan) {
//           if (order.flexiblePlan.type === "normal") {
//             orderPlanType = `${order.flexiblePlan.plan} Days`;
//           } else if (order.flexiblePlan.type === "date-range") {
//             orderPlanType = "Date Range Plan";
//           } else if (order.flexiblePlan.type === "flexi-dates") {
//             orderPlanType = "Flexi Dates Plan";
//           }
//         } else if (order.items && order.items.length > 0) {
//             const item = order.items[0];
//             if (item.selectedPlan?.name === "1") orderPlanType = "Trial Plan";
//             else if (item.selectedPlan?.name === "date-range") orderPlanType = "Date Range Plan";
//             else if (item.selectedPlan?.name === "flexi-dates") orderPlanType = "Flexi Dates Plan";
//             else if (item.selectedPlan?.name && !isNaN(parseInt(item.selectedPlan?.name, 10))) {
//                 orderPlanType = `${item.selectedPlan?.name} Days`;
//             }
//         }
//         return orderPlanType === mealPlanFilter;
//       });
//     }

//     if (timeFilter) {
//       const currentDate = new Date();
//       filtered = filtered.filter((order) => {
//         const orderDate = new Date(order.orderTime);
//         switch (timeFilter) {
//           case "Today":
//             return isSameDay(orderDate, currentDate);
//           case "This Week":
//             // Simple week check (adjust for specific week definition if needed)
//             const oneWeekAgo = new Date(currentDate);
//             oneWeekAgo.setDate(currentDate.getDate() - 7);
//             return orderDate.getTime() >= oneWeekAgo.getTime() && orderDate.getTime() <= currentDate.getTime();
//           case "This Month":
//             return orderDate.getFullYear() === currentDate.getFullYear() && orderDate.getMonth() === currentDate.getMonth();
//           default:
//             return true;
//         }
//       });
//     }

//     if (sortOrderByDistance) {
//       filtered.sort((a, b) => {
//         const distanceA = parseFloat(a.distance?.replace(" KM", "").trim() || '0');
//         const distanceB = parseFloat(b.distance?.replace(" KM", "").trim() || '0');
//         return sortOrderByDistance === "asc"
//           ? distanceA - distanceB
//           : distanceB - distanceA;
//       });
//     }

//     if (distanceRange) {
//       filtered = filtered.filter((order) => {
//         const distance = parseFloat(order.distance?.replace(" KM", "").trim() || '0');
//         switch (distanceRange) {
//           case "0-2": return distance >= 0 && distance <= 2;
//           case "2-5": return distance > 2 && distance <= 5;
//           case "5-10": return distance > 5 && distance <= 10;
//           case "10-15": return distance > 10 && distance <= 15;
//           case ">15": return distance > 15;
//           default: return true;
//         }
//       });
//     }

//     setRecentActivity(filtered);
//   }, [
//     originalOrders,
//     filters.customer,
//     filters.total,
//     statusFilter,
//     mealTypeFilter,
//     mealPlanFilter,
//     timeFilter,
//     sortOrderByDistance,
//     distanceRange,
//     totalRange, // Added totalRange to dependencies
//   ]);

//   useEffect(() => {
//     applyFiltersAndSorting();
//   }, [applyFiltersAndSorting]);

//   const handleMealPlanFilterChange = (e) => {
//     setMealPlanFilter(e.target.value);
//   };

//   const handleMealTypeFilterChange = (e) => {
//     setmealTypeFilter(e.target.value);
//   };

//   const handleTimeFilterChange = (e) => {
//     setTimeFilter(e.target.value);
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSortByDistance = (order) => {
//     setSortOrderByDistance(order);
//   };

//   const handleDistanceRangeChange = (range) => {
//     setDistanceRange(range);
//   };

//   if (!recentActivity || recentActivity.length === 0)
//     return (
//       <div className="flex justify-center items-center text-xl min-h-screen">
//         There are no orders found.
//       </div>
//     );

//   return (
//     <div className="flex gap-2 max-h-screen overflow-y-auto font-sans"> {/* Added font-sans */}
//       {/* OrderWarningSystem and AutoRejectedOrdersAlert are commented out due to import issues */}
//       {/* <AutoRejectedOrdersAlert
//           onOrderSelect={setSelectedOrder}
//           socket={socket}
//         />
//         <OrderWarningSystem
//           orders={recentActivity}
//           onOrderSelect={(order) => {
//             setSelectedOrder(order);
//             const orderRow = document.querySelector(
//               `tr[data-order-id="${order._id}"]`
//             );
//             if (orderRow) {
//               orderRow.classList.add("bg-yellow-100");
//               orderRow.scrollIntoView({ behavior: "smooth", block: "center" });
//               setTimeout(() => {
//                 orderRow.classList.remove("bg-yellow-100");
//               }, 10000);
//             }
//           }}
//         /> */}
//       <div className="bg-white rounded-lg shadow p-4 w-[65%]"> {/* Adjusted padding and rounded corners */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">Orders</h2> {/* Increased font size */}
//           <div className="flex gap-3 items-center"> {/* Increased gap */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`relative inline-flex items-center h-5 rounded-full w-10 cursor-pointer transition-colors duration-200 ${
//                   closeGuide ? "bg-red-500" : "bg-gray-300"
//                 }`}
//                 onClick={() => setcloseGuide(!closeGuide)}
//               >
//                 <span
//                   className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-200 ${
//                     closeGuide ? "translate-x-6" : "translate-x-1"
//                   }`}
//                 ></span>
//               </div>
//               <label className="font-medium text-gray-700 text-sm"> {/* Increased font size */}
//                 {closeGuide ? "Hide Guides" : "Show Guide"}
//               </label>
//             </div>
//             <select
//               className="text-sm border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out" // Added more styling
//               value={mealPlanFilter}
//               onChange={handleMealPlanFilterChange}
//             >
//               <option value="">All Meal Plans</option>
//               {uniqueMealPlans.map((plan, index) => (
//                 <option key={index} value={plan}>
//                   {plan}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="text-sm border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out"
//               value={timeFilter}
//               onChange={handleTimeFilterChange}
//             >
//               <option value="">All Time</option>
//               <option value="Today">Today</option>
//               <option value="This Week">This Week</option>
//               <option value="This Month">This Month</option>
//             </select>

//             {bulkActionOrders.length > 0 && (
//               <button
//                 onClick={applyBulkAction}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm" // More prominent button
//               >
//                 Apply {bulkActionType === "All Accept" ? "Accept All" : bulkActionType === "All Reject" ? "Reject All" : "Deliver All"}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="overflow-x-auto rounded-lg border border-gray-200"> {/* Added border and rounded corners to table container */}
//           <table className="min-w-full text-sm divide-y divide-gray-200"> {/* Removed fixed width, added divide-y */}
//             <thead className="bg-gray-50">
//               <tr className="text-gray-600">
//                 <th className="py-3 px-3 text-left font-medium relative group w-1/6"> {/* Align left */}
//                   <span className="flex items-center">Meal Types
//                   {closeGuide && (
//                     <div className="absolute z-50 w-[18vw] mt-2 top-full left-0 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95"> {/* Adjusted position/width */}
//                       <p className="text-[10px]">
//                         Meal types (e.g., Basic, Deluxe) include items like 4
//                         roti, dal, with specific prices for each plan (Trial,
//                         Weekly, Monthly).
//                       </p>
//                     </div>
//                   )}
//                   </span>
//                 </th>
//                 <th className="py-3 px-3 text-left font-medium relative group w-32">
//                   <span className="flex items-center">Customer
//                   {closeGuide && (
//                     <div className="absolute z-50 w-[18vw] mt-2 top-full left-0 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
//                       <p className="text-[10px]">
//                         A customer is someone who orders and pays for tiffins
//                         (pre-prepared meals) from the tiffin service.
//                       </p>
//                     </div>
//                   )}
//                   </span>
//                 </th>
//                 <th className="py-3 px-3 text-left font-medium w-24">
//                   <div className="relative group">
//                     <select
//                       className="text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer w-full"
//                       value={totalRange}
//                       onChange={(e) => setTotalRange(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         Total
//                       </option>
//                       <option value="0-200" className="text-xs">
//                         0 - 200
//                       </option>
//                       <option value="200-500" className="text-xs">
//                         200 - 500
//                       </option>
//                       <option value="500-700" className="text-xs">
//                         500 - 700
//                       </option>
//                       <option value="700-1000" className="text-xs">
//                         700 - 1000
//                       </option>
//                       <option value="1000-2000" className="text-xs">
//                         1000 - 2000
//                       </option>
//                     </select>
//                     {closeGuide && (
//                       <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
//                         <p className="text-[10px]">
//                           "Total" is the final price a customer pays for their
//                           tiffin order, including all costs like tiffins,
//                           extras, delivery, taxes, and after discounts. It's the
//                           complete transaction cost.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-3 py-3 text-left font-medium w-1/6">
//                   <div className="relative group">
//                     Status
//                     {closeGuide && (
//                       <div className="absolute z-50 w-[18vw] mt-2 top-full -left-12 hidden group-hover:block text-left bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
//                         <p className="text-[10px]">
//                           New Order: Order placed, awaiting processing.{" "}
//                           <br></br>
//                           Processing: Order is being prepared or shipped.
//                           <br></br>
//                           Rejected: Order declined due to issues.<br></br>
//                           Plan Completed: Order successfully delivered.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-3 py-3 text-left font-medium w-20">
//                   <span className="relative group flex items-center">Actions
//                     {closeGuide && (
//                       <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden text-left group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
//                         <p className="text-[10px]">
//                           Accept: Approve a single order for processing.
//                           <br></br>
//                           Reject: Decline a single order.<br></br>
//                           Accept All: Approve all orders for the day.<br></br>
//                           Reject All: Decline all orders for the day.<br></br>
//                           Mark Delivered (All): Mark all orders of the day as
//                           delivered.
//                         </p>
//                       </div>
//                     )}
//                   </span>
//                 </th>
//                 <th className="px-3 py-3 text-left font-medium w-1/6">
//                   <div className="relative group flex items-center">
//                     Distance
//                     {closeGuide && (
//                       <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
//                         <p className="text-[10px]">
//                           Displays the distance between the user's location and
//                           the admin, helping in delivery estimation and
//                           logistics planning.
//                         </p>
//                       </div>
//                     )}
//                     <div className="flex flex-col ml-1">
//                         <button
//                           onClick={() => handleSortByDistance("asc")}
//                           className="text-gray-600 hover:text-gray-800 text-sm"
//                           aria-label="Sort Ascending"
//                         >
//                           ▲
//                         </button>
//                         <button
//                           onClick={() => handleSortByDistance("desc")}
//                           className="text-gray-600 hover:text-gray-800 text-sm"
//                           aria-label="Sort Descending"
//                         >
//                           ▼
//                         </button>
//                     </div>
//                   </div>
//                 </th>
//               </tr>
//               <tr className="bg-white border-b border-gray-200">
//                 <th className="py-2 px-3 text-left w-1/6">
//                   <select
//                     className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
//                     value={mealTypeFilter}
//                     onChange={handleMealTypeFilterChange}
//                   >
//                     <option className="text-xs" value="">
//                       All
//                     </option>
//                     {[
//                       ...new Set(
//                         (Array.isArray(originalOrders) ? originalOrders : [])
//                           .flatMap((order) =>
//                             order.items?.map(item => item.mealType?.name) || []
//                           )
//                           .filter(Boolean)
//                       ), // Corrected parentheses balance here
//                     ].map((mealType) => (
//                       <option key={mealType?.name} value={mealType?.name}>
//                         {mealType?.name}
//                       </option>
//                     ))}
//                   </select>
//                 </th>
//                 <th className="py-2 px-3 text-left w-1/6">
//                   <input
//                     placeholder="Filter Customer"
//                     value={filters.customer}
//                     onChange={(e) =>
//                       handleFilterChange("customer", e.target.value)
//                     }
//                     className="mt-1 text-xs border border-gray-400 rounded-sm py-1 px-1 w-full"
//                   />
//                 </th>
//                 <th className="py-2 px-3 text-left w-full">
//                   <input
//                     placeholder="Filter Total"
//                     value={filters.total}
//                     onChange={(e) =>
//                       handleFilterChange("total", e.target.value)
//                     }
//                     className="mt-1 text-xs border border-gray-400 rounded-sm py-1 px-2 w-full"
//                   />
//                 </th>
//                 <th className="py-2 px-3 text-left w-1/6">
//                   <select
//                     className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                   >
//                     <option value="" className="text-xs">
//                       All Status
//                     </option>
//                     <option
//                       className="text-yellow-800 text-xs"
//                       value="New Order"
//                     >
//                       New Order
//                     </option>
//                     <option
//                       className="text-blue-800 text-xs"
//                       value="Processing"
//                     >
//                       Processing
//                     </option>
//                     <option
//                       className="text-green-800 text-xs"
//                       value="Plan Completed"
//                     >
//                       Plan Completed
//                     </option>
//                     <option className="text-red-800 text-xs" value="Rejected">
//                       Rejected
//                     </option>
//                   </select>
//                 </th>
//                 <th className="py-2 px-3 text-left w-20">
//                   <select
//                     className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
//                     onChange={(e) => triggerBulkAction(e.target.value)}
//                     value={bulkActionType}
//                   >
//                     <option value="" className="text-xs">
//                       Actions
//                     </option>
//                     <option
//                       className="text-yellow-800 text-xs"
//                       value="All Accept"
//                     >
//                       Accept All
//                     </option>
//                     <option className="text-red-800 text-xs" value="All Reject">
//                       Reject All
//                     </option>
//                     <option
//                       className="text-green-800 text-xs"
//                       value="Delivered All"
//                     >
//                       Mark Delivered
//                     </option>
//                   </select>
//                 </th>
//                 <th className="py-2 px-3 text-left">
//                   <select
//                     className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
//                     value={distanceRange}
//                     onChange={(e) => handleDistanceRangeChange(e.target.value)}
//                   >
//                     <option value="" className="text-xs">
//                       All Ranges
//                     </option>
//                     <option value="0-2" className="text-xs">
//                       0-2 km
//                     </option>
//                     <option value="2-5" className="text-xs">
//                       2-5 km
//                     </option>
//                     <option value="5-10" className="text-xs">
//                       5-10 km
//                     </option>
//                     <option value="10-15" className="text-xs">
//                       10-15 km
//                     </option>
//                     <option value=">15" className="text-xs">
//                       Above 15 km
//                     </option>
//                   </select>
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentActivity.map((order) => (
//                 <tr
//                   key={order._id}
//                   data-order-id={order._id}
//                   className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
//                     selectedOrder?._id === order._id ? "bg-blue-50" : ""
//                   }`}
//                   onClick={() => setSelectedOrder(order)}
//                 >
//                   <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
//                     {order.items?.[0]?.mealType?.name || "N/A"}
//                   </td>
//                   <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
//                     {order.userId?.username || "Unknown Customer"}
//                   </td>
//                   <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
//                     ${(order.totalPrice || 0).toFixed(2)}
//                   </td>
//                   <td className="py-3 px-3 whitespace-nowrap text-left text-sm">
//                     <span
//                       className={`text-[11px] font-semibold px-2 py-1 rounded-full inline-block
//                         ${getDisplayStatus(order.status) === "New Order" ? "bg-yellow-100 text-yellow-800" : ""}
//                         ${getDisplayStatus(order.status) === "Plan Completed" ? "bg-green-100 text-green-800" : ""}
//                         ${getDisplayStatus(order.status) === "Processing" ? "bg-blue-100 text-blue-800" : ""}
//                         ${getDisplayStatus(order.status) === "Rejected" ? "bg-red-100 text-red-800" : ""}
//                         ${getDisplayStatus(order.status) === "notaccept" ? "bg-gray-100 text-gray-800" : ""}
//                         ${getDisplayStatus(order.status) === "user_cancel" ? "bg-red-600 text-white" : ""}
//                         ${!["New Order", "Processing", "Plan Completed", "Rejected", "notaccept"].includes(getDisplayStatus(order.status)) ? "bg-gray-100 text-gray-800" : ""}
//                       `}
//                     >
//                       {getDisplayStatus(order.status)}
//                     </span>
//                   </td>
//                   {bulkActionOrders.some((o) => o._id === order._id) ? (
//                     <td className="py-3 px-3 text-sm flex justify-center items-center h-full">
//                       <input
//                         type="checkbox"
//                         checked={
//                           bulkActionOrders.find((o) => o._id === order._id)
//                             ?.selected
//                         }
//                         onChange={(e) =>
//                           setBulkActionOrders((prev) =>
//                             prev.map((o) =>
//                               o._id === order._id
//                                 ? { ...o, selected: e.target.checked }
//                                 : o
//                             )
//                           )
//                         }
//                         className="form-checkbox h-4 w-4 text-blue-600 rounded"
//                       />
//                     </td>
//                   ) : (
//                     <td className="py-3 px-3 text-sm relative">
//                       <div className="flex items-center gap-2 justify-center ">
//                         {(order.status === "pending" || order.status === "notaccept") && (
//                           <>
//                             <button
//                               className="text-green-600 hover:text-green-800 transition-colors duration-150"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 statusChange(order._id, "Processing");
//                               }}
//                               aria-label="Accept Order"
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                 </svg>
//                             </button>
//                             <button
//                               className="text-red-600 hover:text-red-800 transition-colors duration-150"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 statusChange(order._id, "Rejected");
//                               }}
//                               aria-label="Reject Order"
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       {(order.status === "accept" || order.status === "preparing") && (
//                         <div className="flex justify-center items-center">
//                           {order.subStatus?.map((dayStatus) =>
//                             isSameDay(dayStatus.date, new Date()) ? (
//                               <div
//                                 key={dayStatus._id || dayStatus.date}
//                                 className="flex items-center gap-2"
//                               >
//                                 {(dayStatus.statue === "pending" || dayStatus.statue === "Not Delivered") && ( // Changed to 'statue'
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       updateSubStatus(
//                                         order._id,
//                                         dayStatus.date,
//                                         "delivered"
//                                       );
//                                     }}
//                                     className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition duration-150" // Styled button
//                                   >
//                                     Deliver
//                                   </button>
//                                 )}
//                                 {dayStatus.statue === "delivered" && ( // Changed to 'statue'
//                                   <span className="text-green-600 text-xs font-semibold">
//                                     Delivered
//                                   </span>
//                                 )}
//                               </div>
//                             ) : null
//                           )}
//                            {(order.status === "accept" || order.status === "preparing") &&
//                             !order.subStatus?.some(dayStatus => isSameDay(dayStatus.date, new Date())) && (
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     updateSubStatus(
//                                         order._id,
//                                         new Date().toISOString(),
//                                         "delivered"
//                                     );
//                                 }}
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition duration-150"
//                             >
//                                 Deliver Today
//                             </button>
//                            )}
//                         </div>
//                       )}
//                     </td>
//                   )}

//                   <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
//                     {order.distance || "N/A"}
//                   </td>
//                 </tr>
//               ))}
//               <div className="">
//                 {!showReasonBox && (
//                   <div className="z-20 rounded-lg shadow-xl absolute bg-white top-1/2 left-[62%] -translate-x-1/2 -translate-y-1/2 p-6 w-[25%] border border-gray-200"> {/* Centered and styled */}
//                     <h4 className="text-lg font-semibold mb-3 text-red-600">
//                       Reason for Rejection
//                     </h4>
//                     <textarea
//                       className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring focus:ring-red-200 focus:border-red-500 transition duration-150 ease-in-out"
//                       rows="3"
//                       placeholder="Enter reason here..."
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                     />
//                     <div className="flex justify-end gap-3 mt-4">
//                       <button
//                         className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-150 text-sm shadow-sm"
//                         onClick={() => setshowReasonBox(true)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm shadow-sm"
//                         onClick={handleSend}
//                       >
//                         Send
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="w-[35%]">
//         <OrderDetails order={selectedOrder} onStatusChange={statusChange} getDisplayStatus={getDisplayStatus} />
//       </div>
//     </div>
//   );
// };

// export default ManageOrders;

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { toast} from "react-toastify";
// import "react-toastify/dist/React-Toastify.css";
import axios from "axios"; // Assuming axios is installed and used

// --- Mock Utility Functions & Hooks (Replace with your actual implementations) ---

// Mock date utility functions
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const formatDateTimeLocal = (isoString) => {
  const date = parseDate(isoString);
  if (!date) return "N/A";
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDateShort = (isoString) => {
  const date = parseDate(isoString);
  if (!date) return "N/A";
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getMaxDate = (date1, date2) => {
  if (!date1 && !date2) return null;
  if (!date1) return date2;
  if (!date2) return date1;
  return date1.getTime() > date2.getTime() ? date1 : date2;
};

const addDays = (isoString, days) => {
  const date = parseDate(isoString);
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const isAfterDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() > d2.getTime();
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const isSameOrAfterDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() >= d2.getTime();
};

// Mock useDas hook (replace with your actual context/hook)
const DasContext = createContext(null);

const useDas = () => {
  const context = useContext(DasContext);
  if (!context) {
    // This is a mock, in a real app you'd throw an error or provide a default
    console.warn("useDas must be used within a DasProvider. Providing mock data.");
    return {
      latestNewOrder: null,
      setLatestNewOrder: () => {},
      loadingProfile: false,
    };
  }
  return context;
};

// Mock ProgressBar Component (replace with your actual component)
const ProgressBar = ({ order }) => {
  if (!order || !order.flexiblePlan) return null;

  const totalDays = order.flexiblePlan.type === "normal"
    ? parseInt(order.flexiblePlan.plan, 10)
    : order.flexiblePlan.type === "date-range"
    ? Math.max(0, (new Date(order.flexiblePlan.endDate).getTime() - new Date(order.flexiblePlan.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : order.flexiblePlan.type === "flexi-dates"
    ? order.flexiblePlan.flexiDates?.length || 0
    : 0;

  // Assuming 'subStatus' tracks delivered days
  const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0; // Changed to 'statue'
  const progress = totalDays > 0 ? (deliveredDays / totalDays) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="text-right text-xs mt-1 text-gray-500">
        {deliveredDays} / {totalDays} days completed ({progress.toFixed(0)}%)
      </div>
    </div>
  );
};

// --- BillingDetails Component (Inline) ---
// const BillingDetails = ({ order }) => {
//     if (!order) return <p className="text-sm text-gray-500">No billing details available.</p>;

//     return (
//         <div className="text-sm text-gray-700 space-y-1 py-2">
//             <div className="flex justify-between">
//                 <span>Subtotal:</span>
//                 <span>${(order.subtotal || 0).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//                 <span>Delivery Fee:</span>
//                 <span>${(order.deliveryFee || 0).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//                 <span>Platform Fee:</span>
//                 <span>${(order.platformFee || 0).toFixed(2)}</span>
//             </div>
//             {order.discount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                     <span>Discount:</span>
//                     <span>-${(order.discount || 0).toFixed(2)}</span>
//                 </div>
//             )}
//             {order.gstCharges > 0 && (
//                 <div className="flex justify-between">
//                     <span>GST:</span>
//                     <span>${(order.gstCharges || 0).toFixed(2)}</span>
//                 </div>
//             )}
//             <hr className="my-2 border-gray-300" />
//             <div className="flex justify-between font-bold text-base">
//                 <span>Total:</span>
//                 <span>${(order.totalPrice || 0).toFixed(2)}</span>
//             </div>
//         </div>
//     );
// };


// Mock BillingDetails Component (updated to reflect sample data structure)
const BillingDetails = ({ order }) => {
  if (!order) {
    return <p className="text-sm text-gray-500">No billing details available.</p>;
  }

  // Access fields directly from the order object as per provided sample
  const { subtotal, deliveryFee, platformFee, gstCharges, totalOtherCharges, totalPrice, discount,overallOtherCharges } = order;
  console.log(order);
  // These fields are not in the provided sample, so they will be N/A
  // const paymentMethod = "N/A"; // You would get this from your actual order object
  // const transactionId = "N/A"; // You would get this from your actual order object
  // const paymentStatus = "N/A"; // You would get this from your actual order object

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><strong>Subtotal:</strong> ₹{subtotal?.toFixed(2) || '0.00'}</p>
      <p><strong>Delivery Fee:</strong> ₹{deliveryFee?.toFixed(2) || '0.00'}</p>
      <p><strong>Platform Fee:</strong> ₹{platformFee?.toFixed(2) || '0.00'}</p>
      <p><strong>GST Charges:</strong> ₹{gstCharges?.toFixed(2) || '0.00'}</p>
      {totalOtherCharges && totalOtherCharges.length > 0 && (
        totalOtherCharges.map((charge, index) => (
          <p key={index}><strong>{charge.name}:</strong> ₹{charge.value?.toFixed(2) || '0.00'}</p>
        ))
      )}

      {/* <p><strong>Total Other Charges:</strong> ₹{overallOtherCharges?.toFixed(2) || '0.00'}</p> */}
      <p><strong>Discount:</strong> ₹{discount?.toFixed(2) || '0.00'}</p>
      <p className="font-bold text-base"><strong>Total Price:</strong> ₹{totalPrice?.toFixed(2) || '0.00'}</p>
      {/* <p><strong>Payment Method:</strong> {paymentMethod}</p>
      <p><strong>Transaction ID:</strong> {transactionId}</p>
      <p><strong>Payment Status:</strong> <span className={`font-semibold ${paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{paymentStatus}</span></p> */}
    </div>
  );
};

// --- Helper for status mapping ---
const getDisplayStatus = (status) => {
  switch (status) {
    case "pending":
    case "notaccept": // Treat 'notaccept' as 'New Order' for display
      return "New Order";
    case "accept":
    case "preparing": // Treat 'preparing' as 'Processing' for display
      return "Processing";
    case "rejected":
      return "Rejected";
    case "ready": // Assuming 'ready' means plan completed
    case "completed":
      return "Plan Completed";
    case "user_canceled":
      return "User Canceled";
    default:
      return status;
  }
};

const getBackendStatus = (displayStatus) => {
  switch (displayStatus) {
    case "New Order":
      return "pending"; // Or 'notaccept' if that's your strict initial state
    case "Processing":
      return "accept"; // Or 'preparing' if that's the next step
    case "Rejected":
      return "rejected";
    case "Plan Completed":
      return "completed"; // Or 'ready'
    case "User Canceled":
      return "user_canceled";
    default:
      return displayStatus;
  }
};

// --- OrderDetails Component (as provided by you, with minor formatting) ---
const OrderDetails = ({ order, onStatusChange, getDisplayStatus }) => {
  const [ShowDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [ShowBillingDetails, setShowBillingDetails] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);
  const [totalPlanDays, setTotalPlanDays] = useState(null); // New state for total days/deliveries

  const toggleDeliveryDetails = () => {
    setShowDeliveryDetails(!ShowDeliveryDetails);
    if (ShowBillingDetails) setShowBillingDetails(false);
  };

  const toggleBilingDetails = () => {
    setShowBillingDetails(!ShowBillingDetails);
    if (ShowDeliveryDetails) setShowDeliveryDetails(false);
  };

  const today = new Date();

  const effectiveFlexiblePlan = useMemo(() => {
    if (!order) return null;

    let plan = order.flexiblePlan;
    if (!plan && order.items && order.items.length > 0) {
      const firstTiffinItem = order.items.find((item) => item.itemType === "tiffin");
      if (firstTiffinItem) {
        if (firstTiffinItem.selectedPlan?.name === "date-range") {
          plan = {
            type: "date-range",
            startDate: firstTiffinItem.startDate,
            endDate: firstTiffinItem.endDate,
          };
        } else if (
          firstTiffinItem.selectedPlan?.name === "flexi-dates" &&
          Array.isArray(firstTiffinItem.flexiDates)
        ) {
          plan = { type: "flexi-dates", flexiDates: firstTiffinItem.flexiDates };
        } else if (!isNaN(parseInt(firstTiffinItem.selectedPlan?.name, 10))) {
          plan = {
            type: "normal",
            plan: firstTiffinItem.selectedPlan?.name,
            startDate: firstTiffinItem.startDate,
          };
        }
      }
    }
    return plan;
  }, [order]);

  useEffect(() => {
    if (!order || !effectiveFlexiblePlan) {
      setRemainingDays(null);
      setTotalPlanDays(null);
      return;
    }

    if (effectiveFlexiblePlan.type === "normal") {
      const planDuration = parseInt(effectiveFlexiblePlan.plan, 10);
      const startDate = parseDate(effectiveFlexiblePlan.startDate || order.startDate);
      
      if (!startDate) {
        setRemainingDays(null);
        setTotalPlanDays(null);
        return;
      }

      const endDate = addDays(startDate.toISOString(), planDuration);
      setTotalPlanDays(planDuration); // Set total days for normal plan

      if (isAfterDay(today, endDate)) { // Check if today is after the end date
        setRemainingDays(0);
      } else {
        const diffTime = Math.abs(endDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRemainingDays(diffDays);
      }
    } else if (effectiveFlexiblePlan.type === "date-range") {
      const startDate = parseDate(effectiveFlexiblePlan.startDate);
      const endDate = parseDate(effectiveFlexiblePlan.endDate);

      if (!startDate || !endDate) {
        setRemainingDays(null);
        setTotalPlanDays(null);
        return;
      }

      const totalDiffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const totalDays = Math.ceil(totalDiffTime / (1000 * 60 * 60 * 24));
      setTotalPlanDays(totalDays); // Set total days for date-range plan

      if (isAfterDay(today, endDate)) {
        setRemainingDays(0);
      } else {
        const diffTime = Math.abs(endDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRemainingDays(diffDays);
      }
    } else if (effectiveFlexiblePlan.type === "flexi-dates") {
      if (
        !Array.isArray(effectiveFlexiblePlan.flexiDates) ||
        effectiveFlexiblePlan.flexiDates.length === 0
      ) {
        setRemainingDays(0);
        setTotalPlanDays(0);
        return;
      }
      
      setTotalPlanDays(effectiveFlexiblePlan.flexiDates.length); // Total deliveries for flexi-dates

      const remainingDeliveries = effectiveFlexiblePlan.flexiDates.filter((date) => {
        const flexiDate = parseDate(date);
        return flexiDate && isSameOrAfterDay(flexiDate, today);
      }).length;

      setRemainingDays(remainingDeliveries);
    } else {
      setRemainingDays(null);
      setTotalPlanDays(null);
    }
  }, [order, effectiveFlexiblePlan, today]);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (onStatusChange) {
      onStatusChange(order._id, newStatus);
    }
  };

  if (!order)
    return <div className="text-gray-500 p-4">Select an order to view details.</div>;

  return (
    <div className="bg-white shadow-md rounded-md px-2 w-full overflow-hidden max-h-screen overflow-y-auto">
      {!ShowDeliveryDetails && !ShowBillingDetails && (
        <div className="py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <div className="flex justify-between gap-4 items-center">
              <div className="py-2 flex items-center gap-2">
                <select
                  value={getDisplayStatus(order.status)}
                  onChange={handleStatusChange}
                  className={`px-2 py-1 rounded-md text-sm font-medium
                                ${
                                  getDisplayStatus(order.status) === "New Order"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : ""
                                }
                                ${
                                  getDisplayStatus(order.status) === "Processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                                }
                                ${
                                  getDisplayStatus(order.status) === "Rejected"
                                    ? "bg-red-100 text-red-800"
                                    : ""
                                }
                                ${
                                  getDisplayStatus(order.status) === "Plan Completed"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                            `}
                >
                  <option value="New Order">New Order</option>
                  <option value="Processing">Processing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Plan Completed">Plan Completed</option>
                  <option value="User Canceled">User Canceled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={order.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                alt={order.userId?.username || "Customer"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium">
                {order.userId?.username || "Unknown Customer"}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {order?.phone ? `(${order?.phone.countryCode}) ${order?.phone.number}` : "N/A"}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {order?.address || "N/A"}
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <span>Id:</span>
                <span className="break-all">{order._id}</span>
              </div>
            </div>
          </div>

          <hr className="my-2" />

          <div className="mb-1">
            <h4 className="text-sm font-semibold mb-1">Special Instructions</h4>
            <p className="text-sm text-gray-500">{order.specialInstructions || "None"}</p>
          </div>
          {order?.cancellationReason && (
            <div className="mb-1">
              <h4 className="text-sm font-semibold mb-1">User cancellationReason :</h4>
              <p className="text-sm text-gray-500">{order.cancellationReason}</p>
              <h4 className="text-sm font-semibold mb-1">CancelAt :</h4>
              <p className="text-sm text-gray-500">{formatDateShort(order.cancelledAt)}</p>
            </div>
          )}
          <hr className="my-2" />

          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={item._id || index} className="mb-4 p-2 border border-gray-200 rounded-md">
                <h4 className="font-semibold text-base mb-1">
                  Item {index + 1}: {item.name || "N/A"}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <h5 className="font-semibold">Meal Type</h5>
                    <p className="text-gray-500">{item.mealType?.name || "N/A"}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold">Quantity</h5>
                    <p className="text-gray-500">{item.quantity || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Plan Type</span>
                    {item.selectedPlan?.name === "date-range" && item.startDate && item.endDate ? (
                      <span className="text-gray-500">
                        {formatDateShort(item.startDate)} - {formatDateShort(item.endDate)}
                      </span>
                    ) : item.selectedPlan?.name === "flexi-dates" &&
                      Array.isArray(item.flexiDates) &&
                      item.flexiDates.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.flexiDates.map((date, dateIndex) => (
                          <span
                            key={dateIndex}
                            className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {formatDateShort(date)}
                          </span>
                        ))}
                      </div>
                    ) : !isNaN(parseInt(item.selectedPlan?.name, 10)) ? (
                      <span className="text-gray-500">
                        {item.selectedPlan.name} Days{" "}
                        {item.startDate && ` (Start: ${formatDateShort(item.startDate)})`}
                      </span>
                    ) : (
                      <p className="text-gray-500">Standard</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No items found for this order.</p>
          )}

          <hr className="my-2" />

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Placed Time</span>
              <span className="text-sm text-gray-500">
                {formatDateTimeLocal(order.orderTime) || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Time Selected DeliveryTime:</span>
              <span className="text-sm text-gray-500">
                {order.deliverTime || "N/A"}
              </span>
            </div>
          </div>

          <hr className="my-2" />
          <div className="flex justify-between items-center w-full">
            <div className="w-full">
              <h4 className="text-sm font-semibold mb-1">Overall Plan Progress</h4>
              {effectiveFlexiblePlan && effectiveFlexiblePlan.type === "date-range" ? (
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDateShort(effectiveFlexiblePlan.startDate)} -{" "}
                  {formatDateShort(effectiveFlexiblePlan.endDate)}
                </div>
              ) : effectiveFlexiblePlan && effectiveFlexiblePlan.type === "normal" ? (
                <span className="text-sm text-gray-500">
                  {effectiveFlexiblePlan.plan} Days
                  {effectiveFlexiblePlan.startDate &&
                    ` (Start Date: ${formatDateShort(effectiveFlexiblePlan.startDate)})`}
                </span>
              ) : effectiveFlexiblePlan &&
                Array.isArray(effectiveFlexiblePlan.flexiDates) &&
                effectiveFlexiblePlan.flexiDates.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {effectiveFlexiblePlan.flexiDates.map((date, index) => (
                    <span
                      key={index}
                      className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {formatDateShort(date)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No plan available</p>
              )}
            </div>
          </div>
          <div className="">
            <div className="flex justify-between gap-4 items-center mt-3">
              <h4 className="text-sm font-semibold mb-2">Overall Order Progress</h4>
            </div>
            <div>
              <ProgressBar
                order={order} // Keeping for status, though not used in new ProgressBar logic
                
              />
            </div>
          </div>
        </div>
      )}
      {!ShowDeliveryDetails && !ShowBillingDetails && (
        <div className={`flex justify-between items-center my-2 mt-3 mb-3`}>
          <button
            onClick={toggleBilingDetails}
            className="text-blue-600 rounded-md text-sm flex items-center"
          >
            Show Billing Details
          </button>
          {remainingDays !== null && (
            <button
              onClick={toggleDeliveryDetails}
              className="text-blue-600 rounded-md text-sm flex items-center"
            >
              {remainingDays === 0 ? "Plan Completed" : `Remaining Days/Deliveries: ${remainingDays}`}
            </button>
          )}
        </div>
      )}
      {ShowDeliveryDetails && !ShowBillingDetails && (
        <div>
          <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
            <h2 className="text-lg font-semibold">Delivery Details</h2>
            <button
              onClick={toggleDeliveryDetails}
              className="text-blue-600 rounded-md text-sm"
            >
              Show Order Details
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-2">
            {Array.isArray(order.subStatus) && order.subStatus.length > 0 ? (
              order.subStatus.map((statusEntry) => (
                <div key={statusEntry._id || statusEntry.date} className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatDateShort(statusEntry.date)}:
                  </span>
                  <span
                    className={`text-xs ${
                      statusEntry.statue === "Not Delivered" || statusEntry.statue === "pending"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {statusEntry.statue}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No delivery details available.</p>
            )}
          </div>
        </div>
      )}
      {!ShowDeliveryDetails && ShowBillingDetails && (
        <div>
          <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
            <h2 className="text-lg font-semibold">Billing Details</h2>
            <button
              onClick={toggleBilingDetails}
              className="text-blue-600 rounded-md text-sm"
            >
              Show Order Details
            </button>
          </div>
          <BillingDetails order={order} />
        </div>
      )}
    </div>
  );
};

// --- Main ManageOrders Component ---
const ManageOrders = () => {
  const [originalOrders, setOriginalOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mealPlanFilter, setMealPlanFilter] = useState("");
  const [mealTypeFilter, setmealTypeFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [filters, setFilters] = useState({
    customer: "",
    total: "",
  });
  const [totalRange, setTotalRange] = useState("");
  const [showReasonBox, setshowReasonBox] = useState(true); // Changed default to true to hide initially
  const [reason, setReason] = useState("");
  const [sortOrderByDistance, setSortOrderByDistance] = useState("");
  const [distanceRange, setDistanceRange] = useState("");
  const [bulkActionOrders, setBulkActionOrders] = useState([]);
  const [bulkActionType, setBulkActionType] = useState("");
  const [PendingrejectedOrders, setPendingrejectedOrders] = useState(null);

  const initialSatteOfGuide =
    JSON.parse(localStorage.getItem("GuideState")) ?? true;
  const [closeGuide, setcloseGuide] = useState(initialSatteOfGuide);

  const { latestNewOrder, setLatestNewOrder, loadingProfile } = useDas();

  useEffect(() => {
    localStorage.setItem("GuideState", JSON.stringify(closeGuide));
  }, [closeGuide]);

  const token = localStorage.getItem("token"); // Replace with actual token retrieval or context
  const SERVER_URL =import.meta.env.VITE_SERVER_URL; // Replace with your actual server URL
  const socket = useMemo(() => io(SERVER_URL), [SERVER_URL]);


  const fetchTiffinOrders = useCallback(async () => {
    try {
      if (!token || token === "MOCK_TOKEN") { // Added check for mock token
        toast.error("Authentication token not found or is mock. Please log in.");
        setOriginalOrders([]);
        setRecentActivity([]);
        setSelectedOrder(null);
        return;
      }

      const response = await axios.get(
        `${SERVER_URL}/api/orders/tiffin/email`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      
      const fetchedOrders = response.data.orders.map(order => ({
        ...order,
        phone: order.userId?.phone || order.phone,
        address: order.userId?.address || order.address,
        avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
        distance: order.distance || 'N/A',
        flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
          order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
            !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
      }));


      if (fetchedOrders.length > 0) {
        setSelectedOrder(fetchedOrders[0]);
      }
      setOriginalOrders(fetchedOrders);
      setRecentActivity(fetchedOrders);
      toast.success("Tiffin orders loaded!");
    } catch (err) {
      console.error("Error fetching tiffin orders:", err);
      toast.error(`Failed to fetch orders: ${err.response?.data?.message || err.message}.`);
      setOriginalOrders([]);
      setRecentActivity([]);
      setSelectedOrder(null);
    }
  }, [token, SERVER_URL]);

  useEffect(() => {
    if (!loadingProfile) {
      fetchTiffinOrders();
    }
  }, [loadingProfile, fetchTiffinOrders]);

  useEffect(() => {
    if (latestNewOrder) {
      const processedNewOrder = {
        ...latestNewOrder,
        phone: latestNewOrder.userId?.phone || latestNewOrder.phone,
        address: latestNewOrder.userId?.address || latestNewOrder.address,
        avatar: latestNewOrder.avatar || (latestNewOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${latestNewOrder.userId.username}` : undefined),
        distance: latestNewOrder.distance || 'N/A',
        flexiblePlan: latestNewOrder.flexiblePlan || (latestNewOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: latestNewOrder.items[0].startDate, endDate: latestNewOrder.items[0].endDate } :
          latestNewOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: latestNewOrder.items[0].flexiDates } :
            !isNaN(parseInt(latestNewOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: latestNewOrder.items[0].selectedPlan?.name, startDate: latestNewOrder.items[0].startDate } : undefined)
      };

      setOriginalOrders((prevOrders) => [processedNewOrder, ...prevOrders]);
      setRecentActivity((prevOrders) => [processedNewOrder, ...prevOrders]);
      setSelectedOrder(processedNewOrder);
      setLatestNewOrder(null);
      toast.info("A new order has arrived!");
    }
  }, [latestNewOrder, setLatestNewOrder]);


  const updateOrderStatus = async (orderId, newBackendStatus, rejectionReason = "") => {
    const originalSelectedOrder = selectedOrder;
    // Optimistic UI update
    const updatedOrders = recentActivity.map((order) =>
      order._id === orderId ? { ...order, status: newBackendStatus, rejectionReason: rejectionReason } : order
    );
    setRecentActivity(updatedOrders);
    setOriginalOrders(updatedOrders);

    if (selectedOrder?._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newBackendStatus, rejectionReason: rejectionReason });
    }

    try {
      const payload = { status: newBackendStatus };
      if (newBackendStatus === "rejected" && rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }
      
      const response = await axios.put(
        `${SERVER_URL}/api/order/${orderId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      const backendUpdatedOrder = response.data.order;
      const processedUpdatedOrder = {
        ...backendUpdatedOrder,
        phone: backendUpdatedOrder.userId?.phone || backendUpdatedOrder.phone,
        address: backendUpdatedOrder.userId?.address || backendUpdatedOrder.address,
        avatar: backendUpdatedOrder.avatar || (backendUpdatedOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${backendUpdatedOrder.userId.username}` : undefined),
        distance: backendUpdatedOrder.distance || 'N/A',
        flexiblePlan: backendUpdatedOrder.flexiblePlan || (backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: backendUpdatedOrder.items[0].startDate, endDate: backendUpdatedOrder.items[0].endDate } :
          backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: backendUpdatedOrder.items[0].flexiDates } :
            !isNaN(parseInt(backendUpdatedOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: backendUpdatedOrder.items[0].selectedPlan?.name, startDate: backendUpdatedOrder.items[0].startDate } : undefined)
      };

      setRecentActivity(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
      setOriginalOrders(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(processedUpdatedOrder);
      }

      toast.success(`Order ${orderId} status updated to ${getDisplayStatus(newBackendStatus)}!`);
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status.");
      setRecentActivity(originalOrders);
      setOriginalOrders(originalOrders);
      if (originalSelectedOrder?._id === orderId) {
        setSelectedOrder(originalSelectedOrder);
      }
    }
  };

  const statusChange = async (orderId, newStatusDisplay) => {
    if (newStatusDisplay === "Rejected") {
      setshowReasonBox(false); // Show the reason box
      setPendingrejectedOrders(orderId); // Store the orderId for which rejection reason is needed
      return;
    }
    updateOrderStatus(orderId, getBackendStatus(newStatusDisplay));
  };

  const handleSend = async () => {
    if (reason.trim()) {
      setshowReasonBox(true); // Hide the reason box after sending
      const orderId = PendingrejectedOrders;
      setPendingrejectedOrders(null); // Clear the stored orderId

      if (orderId) {
        updateOrderStatus(orderId, "rejected", reason);
      }
      setReason("");
    } else {
      toast.error("Please provide a reason for rejection.");
    }
  };

  const triggerBulkAction = (action) => {
    if (action === "All Reject") {
      setshowReasonBox(false); // Show reason box for bulk reject
    } else {
      setshowReasonBox(true); // Hide for other bulk actions
    }

    let applicableOrders = [];
    if (action === "All Accept" || action === "All Reject") {
      applicableOrders = originalOrders.filter(
        (order) => order.status === "pending" || order.status === "notaccept"
      );
    } else if (action === "Delivered All") {
      const today = new Date();
      applicableOrders = originalOrders.filter(
        (order) =>
          (order.status === "accept" || order.status === "preparing") &&
          order.subStatus?.some(
            (day) =>
              isSameDay(day.date, today) && (day.statue === "pending" || day.statue === "Not Delivered")
          )
      );
    }

    if (applicableOrders.length === 0) {
      toast.info("No orders available for this action.");
      setBulkActionOrders([]);
      setBulkActionType("");
      return;
    }

    setBulkActionOrders(
      applicableOrders.map((order) => ({ ...order, selected: true }))
    );
    setBulkActionType(action);
  };

  const applyBulkAction = async () => {
    const selectedOrders = bulkActionOrders.filter((order) => order.selected);

    if (selectedOrders.length === 0) {
      toast.error("No orders selected for this action.");
      return;
    }

    const orderIds = selectedOrders.map((order) => order._id);
    let newBackendStatus;
    if (bulkActionType === "All Accept") {
      newBackendStatus = "accept";
    } else if (bulkActionType === "All Reject") {
      if (!reason.trim()) {
        toast.error("Please provide a reason for bulk rejection.");
        return;
      }
      newBackendStatus = "rejected";
    } else if (bulkActionType === "Delivered All") {
      // This is handled client-side for now, but a backend endpoint would be ideal
      newBackendStatus = "delivered_today_bulk"; // Internal flag
    }

    try {
      const payload = {
        action: bulkActionType,
        orderIds,
        ...(bulkActionType === "All Reject" && reason.trim() && { rejectionReason: reason.trim() })
      };

      // --- MOCKED AXIOS CALL FOR BULK ACTION ---
      console.log(`MOCKED API Call: POST ${SERVER_URL}/api/orders/bulk-action with payload:`, payload);
      // In a real application, you would uncomment and implement this:
      const response = await axios.post(
        `${SERVER_URL}/api/orders/bulk-action`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const result = response.data; // Assuming backend returns updated orders or a success message

      if (bulkActionType === "Delivered All") {
        const today = new Date();
        setRecentActivity((prevOrders) =>
          prevOrders.map((order) => {
            if (orderIds.includes(order._id) && (order.status === "accept" || order.status === "preparing")) {
              const updatedSubStatus = order.subStatus ? [...order.subStatus] : [];
              const todaySubStatusIndex = updatedSubStatus.findIndex(
                (entry) => isSameDay(entry.date, today)
              );

              if (todaySubStatusIndex !== -1) {
                updatedSubStatus[todaySubStatusIndex].statue = "delivered";
              } else {
                updatedSubStatus.push({
                  date: today.toISOString(),
                  statue: "delivered",
                });
              }
              return { ...order, subStatus: updatedSubStatus };
            }
            return order;
          })
        );
      } else { // For All Accept/All Reject
        setRecentActivity((prevOrders) =>
          prevOrders.map((order) =>
            orderIds.includes(order._id)
              ? { ...order, status: newBackendStatus, rejectionReason: bulkActionType === "All Reject" ? reason.trim() : "" }
              : order
          )
        );
      }
      setOriginalOrders(recentActivity); // Keep original in sync

      setBulkActionOrders([]);
      setBulkActionType("");
      setReason("");
      setshowReasonBox(true); // Hide reason box after successful bulk action
      toast.success(`${bulkActionType} action applied successfully! (Mocked)`);
    } catch (err) {
      console.error("Error performing bulk action:", err);
      toast.error("Failed to perform bulk action. (Mocked)");
    }
  };

  const updateSubStatus = async (orderId, date, newSubStatus) => {
    const originalSelectedOrder = selectedOrder;
    try {
      const payload = { date, statue: newSubStatus };
      const response = await axios.put(
        `${SERVER_URL}/api/order/${orderId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      const backendUpdatedOrder = response.data.order;
      const processedUpdatedOrder = {
        ...backendUpdatedOrder,
        phone: backendUpdatedOrder.userId?.phone || backendUpdatedOrder.phone,
        address: backendUpdatedOrder.userId?.address || backendUpdatedOrder.address,
        avatar: backendUpdatedOrder.avatar || (backendUpdatedOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${backendUpdatedOrder.userId.username}` : undefined),
        distance: backendUpdatedOrder.distance || 'N/A',
        flexiblePlan: backendUpdatedOrder.flexiblePlan || (backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: backendUpdatedOrder.items[0].startDate, endDate: backendUpdatedOrder.items[0].endDate } :
          backendUpdatedOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: backendUpdatedOrder.items[0].flexiDates } :
            !isNaN(parseInt(backendUpdatedOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: backendUpdatedOrder.items[0].selectedPlan?.name, startDate: backendUpdatedOrder.items[0].startDate } : undefined)
      };

      setRecentActivity(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
      setOriginalOrders(prev => prev.map(o => o._id === orderId ? processedUpdatedOrder : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(processedUpdatedOrder);
      }

      toast.success(`Daily status updated for order ${orderId} to ${newSubStatus}!`);
    } catch (err) {
      console.error("Error updating sub-status:", err);
      toast.error("Failed to update daily status.");
      setRecentActivity(originalOrders);
      setOriginalOrders(originalOrders);
      if (originalSelectedOrder?._id === orderId) {
        setSelectedOrder(originalSelectedOrder);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedOrders = originalOrders.map((order) => {
        const latestEndDate = order.items?.reduce((maxDate, item) => {
          const itemEndDate = parseDate(item.endDate);
          return itemEndDate && itemEndDate.getTime() > maxDate.getTime() ? itemEndDate : maxDate;
        }, new Date(0));

        if (
          (order.status === "accept" || order.status === "preparing") &&
          latestEndDate && latestEndDate.toString() !== "Invalid Date" &&
          isAfterDay(new Date(), latestEndDate)
        ) {
          return { ...order, status: "completed" }; // Change to 'completed' as per enum
        }
        return order;
      });
      if (JSON.stringify(updatedOrders) !== JSON.stringify(originalOrders)) {
        setRecentActivity(updatedOrders);
        setOriginalOrders(updatedOrders);
      }
    }, 24 * 60 * 60 * 1000); // Check once every 24 hours

    return () => clearInterval(interval);
  }, [originalOrders]);


  useEffect(() => {
    socket.on("newOrder", (newOrder) => {
      toast.info(`New Order received: ${newOrder._id}`);
      const processedNewOrder = {
        ...newOrder,
        phone: newOrder.userId?.phone || newOrder.phone,
        address: newOrder.userId?.address || newOrder.address,
        avatar: newOrder.avatar || (newOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${newOrder.userId.username}` : undefined),
        distance: newOrder.distance || 'N/A',
        flexiblePlan: newOrder.flexiblePlan || (newOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: newOrder.items[0].startDate, endDate: newOrder.items[0].endDate } :
          newOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: newOrder.items[0].flexiDates } :
            !isNaN(parseInt(newOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: newOrder.items[0].selectedPlan?.name, startDate: newOrder.items[0].startDate } : undefined)
      };
      setOriginalOrders((prevOrders) => [processedNewOrder, ...prevOrders]);
      setRecentActivity((prevOrders) => [processedNewOrder, ...prevOrders]);
      setLatestNewOrder(processedNewOrder);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      toast.info(`Order updated: ${updatedOrder._id}`);
      const processedOrder = {
        ...updatedOrder,
        phone: updatedOrder.userId?.phone || updatedOrder.phone,
        address: updatedOrder.userId?.address || updatedOrder.address,
        avatar: updatedOrder.avatar || (updatedOrder.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${updatedOrder.userId.username}` : undefined),
        distance: updatedOrder.distance || 'N/A',
        flexiblePlan: updatedOrder.flexiblePlan || (updatedOrder.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: updatedOrder.items[0].startDate, endDate: updatedOrder.items[0].endDate } :
          updatedOrder.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: updatedOrder.items[0].flexiDates } :
            !isNaN(parseInt(updatedOrder.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: updatedOrder.items[0].selectedPlan?.name, startDate: updatedOrder.items[0].startDate } : undefined)
      };

      setRecentActivity((prevOrders) =>
        prevOrders.map((o) =>
          o._id === processedOrder._id
            ? processedOrder
            : o
        )
      );
      setOriginalOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === processedOrder._id
            ? processedOrder
            : o
        )
      );
      if (selectedOrder?._id === processedOrder._id) {
        setSelectedOrder(processedOrder);
      }
    });

    socket.on("subStatusUpdated", (order) => {
      const processedOrder = {
        ...order,
        phone: order.userId?.phone || order.phone,
        address: order.userId?.address || order.address,
        avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
        distance: order.distance || 'N/A',
        flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
          order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
            !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
      };

      setRecentActivity((prevOrders) =>
        prevOrders.map((o) =>
          o._id === processedOrder._id
            ? processedOrder
            : o
        )
      );
      setOriginalOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === processedOrder._id
            ? processedOrder
            : o
        )
      );
      if (selectedOrder?._id === processedOrder._id) {
        setSelectedOrder(processedOrder);
      }
      toast.info(`Order ${processedOrder._id} daily status updated in real-time!`);
    });

    socket.on("bulkOrderStatusUpdated", ({ action, orders }) => {
      const processedOrders = orders.map(order => ({
        ...order,
        phone: order.userId?.phone || order.phone,
        address: order.userId?.address || order.address,
        avatar: order.avatar || (order.userId?.username ? `https://api.dicebear.com/7.x/initials/svg?seed=${order.userId.username}` : undefined),
        distance: order.distance || 'N/A',
        flexiblePlan: order.flexiblePlan || (order.items?.[0]?.selectedPlan?.name === "date-range" ? { type: "date-range", startDate: order.items[0].startDate, endDate: order.items[0].endDate } :
          order.items?.[0]?.selectedPlan?.name === "flexi-dates" ? { type: "flexi-dates", flexiDates: order.items[0].flexiDates } :
            !isNaN(parseInt(order.items?.[0]?.selectedPlan?.name, 10)) ? { type: "normal", plan: order.items[0].selectedPlan?.name, startDate: order.items[0].startDate } : undefined)
      }));

      setRecentActivity((prevOrders) =>
        prevOrders.map((order) => {
          const updatedOrder = processedOrders.find((updated) => updated._id === order._id);
          return updatedOrder ? updatedOrder : order;
        })
      );
      setOriginalOrders((prevOrders) =>
        prevOrders.map((order) => {
          const updatedOrder = processedOrders.find((updated) => updated._id === order._id);
          return updatedOrder ? updatedOrder : order;
        })
      );
      if (selectedOrder && processedOrders.some(o => o._id === selectedOrder._id)) {
        setSelectedOrder(processedOrders.find(o => o._id === selectedOrder._id));
      }
      toast.info(`Bulk order status updated in real-time for ${processedOrders.length} orders!`);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, selectedOrder, setLatestNewOrder]);


  const uniqueMealPlans = useMemo(() => {
    return [
      ...new Set(
        (Array.isArray(originalOrders) ? originalOrders : [])
          .flatMap((order) => {
            let planType = null;
            if (order.flexiblePlan) {
              if (order.flexiblePlan.type === "normal") {
                planType = `${order.flexiblePlan.plan} Days`;
              } else if (order.flexiblePlan.type === "date-range") {
                planType = "Date Range Plan";
              } else if (order.flexiblePlan.type === "flexi-dates") {
                planType = "Flexi Dates Plan";
              }
            }
            else if (order.items && order.items.length > 0) {
              const item = order.items[0];
              if (item.selectedPlan?.name === "1") planType = "Trial Plan";
              else if (item.selectedPlan?.name === "date-range") planType = "Date Range Plan";
              else if (item.selectedPlan?.name === "flexi-dates") planType = "Flexi Dates Plan";
              else if (item.selectedPlan?.name && !isNaN(parseInt(item.selectedPlan?.name, 10))) {
                planType = `${item.selectedPlan?.name} Days`;
              }
            }
            return planType;
          })
          .filter(Boolean)
      ),
    ].sort();
  }, [originalOrders]);


  const applyFiltersAndSorting = useCallback(() => {
    let filtered = Array.isArray(originalOrders) ? [...originalOrders] : [];

    if (filters.customer) {
      filtered = filtered.filter((order) =>
        order.userId?.username?.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    if (filters.total) {
      filtered = filtered.filter((order) => {
        const orderTotal = order.totalPrice || 0;
        const [min, max] = filters.total.split('-').map(Number); // Use filters.total for the range
        if (filters.total.includes('>')) {
          const greaterThan = Number(filters.total.replace('>', ''));
          return orderTotal > greaterThan;
        }
        return orderTotal >= min && orderTotal <= max;
      });
    }

    if (statusFilter) {
      const backendStatusToCheck = getBackendStatus(statusFilter);
      filtered = filtered.filter((order) => order.status === backendStatusToCheck);
    }

    if (mealTypeFilter) {
      filtered = filtered.filter(
        (order) => order.items?.[0]?.mealType?.name === mealTypeFilter
      );
    }

    if (mealPlanFilter) {
      filtered = filtered.filter((order) => {
        let orderPlanType = null;
        if (order.flexiblePlan) {
          if (order.flexiblePlan.type === "normal") {
            orderPlanType = `${order.flexiblePlan.plan} Days`;
          } else if (order.flexiblePlan.type === "date-range") {
            orderPlanType = "Date Range Plan";
          } else if (order.flexiblePlan.type === "flexi-dates") {
            orderPlanType = "Flexi Dates Plan";
          }
        } else if (order.items && order.items.length > 0) {
            const item = order.items[0];
            if (item.selectedPlan?.name === "1") orderPlanType = "Trial Plan";
            else if (item.selectedPlan?.name === "date-range") orderPlanType = "Date Range Plan";
            else if (item.selectedPlan?.name === "flexi-dates") orderPlanType = "Flexi Dates Plan";
            else if (item.selectedPlan?.name && !isNaN(parseInt(item.selectedPlan?.name, 10))) {
                orderPlanType = `${item.selectedPlan?.name} Days`;
            }
        }
        return orderPlanType === mealPlanFilter;
      });
    }

    if (timeFilter) {
      const currentDate = new Date();
      filtered = filtered.filter((order) => {
        const orderDate = parseDate(order.orderTime);
        if (!orderDate) return false; // Skip if date is invalid
        switch (timeFilter) {
          case "Today":
            return isSameDay(orderDate, currentDate);
          case "This Week":
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(currentDate.getDate() - 7);
            return orderDate.getTime() >= oneWeekAgo.getTime() && orderDate.getTime() <= currentDate.getTime();
          case "This Month":
            return orderDate.getFullYear() === currentDate.getFullYear() && orderDate.getMonth() === currentDate.getMonth();
          default:
            return true;
        }
      });
    }

    if (sortOrderByDistance) {
      filtered.sort((a, b) => {
        const distanceA = parseFloat(a.distance?.replace(" KM", "").trim() || '0');
        const distanceB = parseFloat(b.distance?.replace(" KM", "").trim() || '0');
        return sortOrderByDistance === "asc"
          ? distanceA - distanceB
          : distanceB - distanceA;
      });
    }

    if (distanceRange) {
      filtered = filtered.filter((order) => {
        const distance = parseFloat(order.distance?.replace(" KM", "").trim() || '0');
        switch (distanceRange) {
          case "0-2": return distance >= 0 && distance <= 2;
          case "2-5": return distance > 2 && distance <= 5;
          case "5-10": return distance > 5 && distance <= 10;
          case "10-15": return distance > 10 && distance <= 15;
          case ">15": return distance > 15;
          default: return true;
        }
      });
    }

    setRecentActivity(filtered);
  }, [
    originalOrders,
    filters.customer,
    filters.total,
    statusFilter,
    mealTypeFilter,
    mealPlanFilter,
    timeFilter,
    sortOrderByDistance,
    distanceRange,
  ]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  const handleMealPlanFilterChange = (e) => {
    setMealPlanFilter(e.target.value);
  };

  const handleMealTypeFilterChange = (e) => {
    setmealTypeFilter(e.target.value);
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortByDistance = (order) => {
    setSortOrderByDistance(order);
  };

  const handleDistanceRangeChange = (range) => {
    setDistanceRange(range);
  };

  if (!recentActivity || recentActivity.length === 0)
    return (
      <div className="flex justify-center items-center text-xl min-h-screen">
        There are no orders found.
      </div>
    );

  return (
    <DasContext.Provider value={{ latestNewOrder, setLatestNewOrder, loadingProfile }}>
      <div className="flex gap-2 max-h-screen overflow-y-auto font-sans">
        <div className="bg-white rounded-lg shadow p-4 w-[65%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`relative inline-flex items-center h-5 rounded-full w-10 cursor-pointer transition-colors duration-200 ${
                    closeGuide ? "bg-red-500" : "bg-gray-300"
                  }`}
                  onClick={() => setcloseGuide(!closeGuide)}
                >
                  <span
                    className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-200 ${
                      closeGuide ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></span>
                </div>
                <label className="font-medium text-gray-700 text-sm">
                  {closeGuide ? "Hide Guides" : "Show Guide"}
                </label>
              </div>
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out"
                value={mealPlanFilter}
                onChange={handleMealPlanFilterChange}
              >
                <option value="">All Meal Plans</option>
                {uniqueMealPlans.map((plan, index) => (
                  <option key={index} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>

              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-150 ease-in-out"
                value={timeFilter}
                onChange={handleTimeFilterChange}
              >
                <option value="">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              {bulkActionOrders.length > 0 && (
                <button
                  onClick={applyBulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm"
                >
                  Apply {bulkActionType === "All Accept" ? "Accept All" : bulkActionType === "All Reject" ? "Reject All" : "Deliver All"}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="py-3 px-3 text-left font-medium relative group w-1/6">
                    <span className="flex items-center">Meal Types
                    {closeGuide && (
                      <div className="absolute z-50 w-[18vw] mt-2 top-full left-0 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                        <p className="text-[10px]">
                          Meal types (e.g., Basic, Deluxe) include items like 4
                          roti, dal, with specific prices for each plan (Trial,
                          Weekly, Monthly).
                        </p>
                      </div>
                    )}
                    </span>
                  </th>
                  <th className="py-3 px-3 text-left font-medium relative group w-32">
                    <span className="flex items-center">Customer
                    {closeGuide && (
                      <div className="absolute z-50 w-[18vw] mt-2 top-full left-0 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                        <p className="text-[10px]">
                          A customer is someone who orders and pays for tiffins
                          (pre-prepared meals) from the tiffin service.
                        </p>
                      </div>
                    )}
                    </span>
                  </th>
                  <th className="py-3 px-3 text-left font-medium w-24">
                    <div className="relative group">
                      <select
                        className="text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer w-full"
                        value={filters.total} // Use filters.total here
                        onChange={(e) => handleFilterChange("total", e.target.value)} // Update filters.total
                      >
                        <option value="" className="text-xs">
                          Total
                        </option>
                        <option value="0-200" className="text-xs">
                          0 - 200
                        </option>
                        <option value="200-500" className="text-xs">
                          200 - 500
                        </option>
                        <option value="500-700" className="text-xs">
                          500 - 700
                        </option>
                        <option value="700-1000" className="text-xs">
                          700 - 1000
                        </option>
                        <option value="1000-2000" className="text-xs">
                          1000 - 2000
                        </option>
                        <option value=">2000" className="text-xs"> {/* Added an option for >2000 */}
                          Above 2000
                        </option>
                      </select>
                      {closeGuide && (
                        <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                          <p className="text-[10px]">
                            "Total" is the final price a customer pays for their
                            tiffin order, including all costs like tiffins,
                            extras, delivery, taxes, and after discounts. It's the
                            complete transaction cost.
                          </p>
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left font-medium w-1/6">
                    <div className="relative group">
                      Status
                      {closeGuide && (
                        <div className="absolute z-50 w-[18vw] mt-2 top-full -left-12 hidden group-hover:block text-left bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                          <p className="text-[10px]">
                            New Order: Order placed, awaiting processing.{" "}
                            <br></br>
                            Processing: Order is being prepared or shipped.
                            <br></br>
                            Rejected: Order declined due to issues.<br></br>
                            Plan Completed: Order successfully delivered.
                          </p>
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-3 text-left w-20">Action</th>
                  {/* <th className="px-3 py-3 text-left font-medium w-20">
                    <span className="relative group flex items-center">Actions
                      {closeGuide && (
                        <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden text-left group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                          <p className="text-[10px]">
                            Accept: Approve a single order for processing.
                            <br></br>
                            Reject: Decline a single order.<br></br>
                            Accept All: Approve all orders for the day.<br></br>
                            Reject All: Decline all orders for the day.<br></br>
                            Mark Delivered (All): Mark all orders of the day as
                            delivered.
                          </p>
                        </div>
                      )}
                    </span>
                  </th> */}
                  <th className="px-3 py-3 text-left font-medium w-1/6">
                    <div className="relative group flex items-center">
                      Distance
                      {closeGuide && (
                        <div className="absolute z-50 w-fit mt-2 top-full -left-12 hidden group-hover:block bg-gray-700 text-white text-xs rounded-md px-3 py-2 shadow-lg opacity-95">
                          <p className="text-[10px]">
                            Displays the distance between the user's location and
                            the admin, helping in delivery estimation and
                            logistics planning.
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col ml-1">
                          <button
                            onClick={() => handleSortByDistance("asc")}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            aria-label="Sort Ascending"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleSortByDistance("desc")}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            aria-label="Sort Descending"
                          >
                            ▼
                          </button>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-2 px-3 text-left w-1/6">
                    <select
                      className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
                      value={mealTypeFilter}
                      onChange={handleMealTypeFilterChange}
                    >
                      <option className="text-xs" value="">
                        All
                      </option>
                      {[
                        ...new Set(
                          (Array.isArray(originalOrders) ? originalOrders : [])
                            .flatMap((order) =>
                              order.items?.map(item => item.mealType?.name) || []
                            )
                            .filter(Boolean)
                        ),
                      ].map((mealType) => (
                        <option key={mealType} value={mealType}>
                          {mealType}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th className="py-2 px-3 text-left w-1/6">
                    <input
                      placeholder="Filter Customer"
                      value={filters.customer}
                      onChange={(e) =>
                        handleFilterChange("customer", e.target.value)
                      }
                      className="mt-1 text-xs border border-gray-400 rounded-sm py-1 px-1 w-full"
                    />
                  </th>
                  <th className="py-2 px-3 text-left w-full">
                    <input
                      placeholder="Filter Total"
                      value={filters.total} // This input will now be for direct value, not range selection
                      onChange={(e) =>
                        handleFilterChange("total", e.target.value)
                      }
                      className="mt-1 text-xs border border-gray-400 rounded-sm py-1 px-2 w-full"
                    />
                  </th>
                  <th className="py-2 px-3 text-left w-1/6">
                    <select
                      className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="" className="text-xs">
                        All Status
                      </option>
                      <option
                        className="text-yellow-800 text-xs"
                        value="New Order"
                      >
                        New Order
                      </option>
                      <option
                        className="text-blue-800 text-xs"
                        value="Processing"
                      >
                        Processing
                      </option>
                      <option
                        className="text-green-800 text-xs"
                        value="Plan Completed"
                      >
                        Plan Completed
                      </option>
                      <option className="text-red-800 text-xs" value="Rejected">
                        Rejected
                      </option>
                      <option className="text-red-600 text-xs" value="User Canceled">
                        User Canceled
                      </option>
                    </select>
                  </th>
                  {/* <th className="py-2 px-3 text-left w-20">
                    <select
                      className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
                      onChange={(e) => triggerBulkAction(e.target.value)}
                      value={bulkActionType}
                    >
                      <option value="" className="text-xs">
                        Actions
                      </option>
                      <option
                        className="text-yellow-800 text-xs"
                        value="All Accept"
                      >
                        Accept All
                      </option>
                      <option className="text-red-800 text-xs" value="All Reject">
                        Reject All
                      </option>
                      <option
                        className="text-green-800 text-xs"
                        value="Delivered All"
                      >
                        Mark Delivered
                      </option>
                    </select>
                  </th> */}
                  <th className="py-2 px-3 text-left w-20">Action</th>
                  <th className="py-2 px-3 text-left">
                    <select
                      className="text-xs border border-gray-300 rounded px-1 py-1 cursor-pointer w-full"
                      value={distanceRange}
                      onChange={(e) => handleDistanceRangeChange(e.target.value)}
                    >
                      <option value="" className="text-xs">
                        All Ranges
                      </option>
                      <option value="0-2" className="text-xs">
                        0-2 km
                      </option>
                      <option value="2-5" className="text-xs">
                        2-5 km
                      </option>
                      <option value="5-10" className="text-xs">
                        5-10 km
                      </option>
                      <option value="10-15" className="text-xs">
                        10-15 km
                      </option>
                      <option value=">15" className="text-xs">
                        Above 15 km
                      </option>
                    </select>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.map((order) => (
                  <tr
                    key={order._id}
                    data-order-id={order._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      selectedOrder?._id === order._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
                      {order.items?.[0]?.mealType?.name || "N/A"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
                      {order.userId?.username || "Unknown Customer"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-left text-sm">
                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full inline-block
                          ${getDisplayStatus(order.status) === "New Order" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${getDisplayStatus(order.status) === "Plan Completed" ? "bg-green-100 text-green-800" : ""}
                          ${getDisplayStatus(order.status) === "Processing" ? "bg-blue-100 text-blue-800" : ""}
                          ${getDisplayStatus(order.status) === "Rejected" ? "bg-red-100 text-red-800" : ""}
                          ${getDisplayStatus(order.status) === "User Canceled" ? "bg-red-600 text-white" : ""}
                          ${!["New Order", "Processing", "Plan Completed", "Rejected", "User Canceled"].includes(getDisplayStatus(order.status)) ? "bg-gray-100 text-gray-800" : ""}
                        `}
                      >
                        {getDisplayStatus(order.status)}
                      </span>
                    </td>
                    {bulkActionOrders.some((o) => o._id === order._id && o.selected) ? ( // Check for selected in bulk actions
                      <td className="py-3 px-3 text-sm flex justify-center items-center h-full">
                        <input
                          type="checkbox"
                          checked={
                            bulkActionOrders.find((o) => o._id === order._id)
                              ?.selected
                          }
                          onChange={(e) =>
                            setBulkActionOrders((prev) =>
                              prev.map((o) =>
                                o._id === order._id
                                  ? { ...o, selected: e.target.checked }
                                  : o
                              )
                            )
                          }
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                      </td>
                    ) : (
                      <td className="py-3 px-3 text-sm relative">
                        <div className="flex items-center gap-2 justify-center ">
                          {/* Show Accept/Reject only if order is pending or notaccept AND not user_cancel */}
                          {(order.status === "pending" || order.status === "notaccept") &&
                          order.status !== "user_canceled" && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-800 transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  statusChange(order._id, "Processing"); // Changed to 'Processing' for display
                                }}
                                aria-label="Accept Order"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  statusChange(order._id, "Rejected");
                                }}
                                aria-label="Reject Order"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>

                        {/* Show Delivery options only if order is accepted or preparing */}
                        {(order.status === "accept" || order.status === "preparing") && (
                          <div className="flex justify-center items-center mt-2">
                            {order.subStatus?.some(dayStatus => isSameDay(dayStatus.date, new Date())) ? (
                              order.subStatus.map((dayStatus) =>
                                isSameDay(dayStatus.date, new Date()) ? (
                                  <div
                                    key={dayStatus._id || dayStatus.date}
                                    className="flex items-center gap-2"
                                  >
                                    {(dayStatus.statue === "pending" || dayStatus.statue === "Not Delivered") && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateSubStatus(
                                            order._id,
                                            dayStatus.date,
                                            "delivered"
                                          );
                                        }}
                                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition duration-150"
                                      >
                                        Deliver
                                      </button>
                                    )}
                                    {dayStatus.statue === "delivered" && (
                                      <span className="text-green-600 text-xs font-semibold">
                                        Delivered
                                      </span>
                                    )}
                                  </div>
                                ) : null
                              )
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSubStatus(
                                    order._id,
                                    new Date().toISOString(),
                                    "delivered"
                                  );
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition duration-150"
                              >
                                Deliver Today
                              </button>
                            )}
                          </div>
                        )}

                        {/* No actions for Rejected or User Canceled orders */}
                        {(order.status === "rejected" || order.status === "user_canceled") && (
                          <span className="text-gray-500 text-xs">No actions available</span>
                        )}
                      </td>
                    )}

                    <td className="py-3 px-3 whitespace-nowrap text-gray-800 text-left text-sm">
                      {order.distance || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-[35%]">
          <OrderDetails order={selectedOrder} onStatusChange={statusChange} getDisplayStatus={getDisplayStatus} />
        </div>

        {/* Rejection Reason Modal */}
        {!showReasonBox && PendingrejectedOrders && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="z-20 rounded-lg shadow-xl bg-white p-6 w-[25%] border border-gray-200">
              <h4 className="text-lg font-semibold mb-3 text-red-600">
                Reason for Rejection
              </h4>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring focus:ring-red-200 focus:border-red-500 transition duration-150 ease-in-out"
                rows="3"
                placeholder="Enter reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-150 text-sm shadow-sm"
                  onClick={() => {
                    setshowReasonBox(true); // Hide modal
                    setPendingrejectedOrders(null); // Clear pending rejection
                    setReason(""); // Clear reason
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm shadow-sm"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
    </DasContext.Provider>
  );
};

export default ManageOrders;
