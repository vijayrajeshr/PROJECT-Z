
import React, { useState, useEffect, useMemo } from "react";
// No need for socket.io-client or axios within OrderDetails itself,
// as data is passed via props.
// If you need to make API calls directly from OrderDetails,
// you would uncomment and use them here.
// import io from "socket.io-client";
// import axios from "axios";
// import { useDas } from "../../../../context/TiffinDashboardContext.jsx"; // If needed for context

// Mock toast for demonstration; replace with actual toast library if available
const toast = {
  success: (msg) => console.log("Success:", msg),
  error: (msg) => console.error("Error:", msg),
  info: (msg) => console.info("Info:", msg),
};

// SERVER_URL is not directly used in OrderDetails as it receives 'order' via props.
// const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

// Helper function to format date to DD/MM/YY
const formatDateShort = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

// Helper function to format date and time to DD/MM/YY HH:MM:SS
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(",", ""); // Removes comma if present
};

// Custom function for isSame day check (normalized to start of day)
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
};

// Custom function for isAfter day check (normalized to start of day)
const isAfterDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() > d2.getTime();
};

// Custom function for isSameOrAfter day check (normalized to start of day)
const isSameOrAfterDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() >= d2.getTime();
};

// Custom function for getMaxDate
const getMaxDate = (date1, date2) => {
  // Ensure we are working with Date objects
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  if (isNaN(d1.getTime()) && isNaN(d2.getTime())) return null; // Both invalid
  if (isNaN(d1.getTime())) return d2; // d1 is invalid, return d2
  if (isNaN(d2.getTime())) return d1; // d2 is invalid, return d1

  return d1.getTime() > d2.getTime() ? d1 : d2;
};

// Custom function for adding days
const addDays = (dateString, days) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date;
};

// Function to map backend status to display status
// This function is also passed as a prop from ManageOrders, so it's consistent.
const getDisplayStatus = (backendStatus) => {
  switch (backendStatus) {
    case "pending":
      return "New Order"; // Changed from "pending" to "New Order" for consistency
    case "notaccept":
      return "New Order";
    case "accept":
      return "Processing"; // Changed from "accept" to "Processing" for consistency
    case "preparing":
      return "Processing";
    case "rejected":
      return "Rejected";
    case "ready":
      return "Plan Completed";
    case "user_cancel": // Added for user-initiated cancellations
      return "Cancelled by User";
    default:
      return backendStatus;
  }
};

// Function to map display status to backend status (not strictly used in OrderDetails itself, but good to have)
const getBackendStatus = (displayStatus) => {
  switch (displayStatus) {
    case "New Order":
      return "pending"; // Maps back to 'pending' as 'notaccept' is also a 'New Order' state
    case "Processing":
      return "accept"; // Maps to 'accept' as 'preparing' is a sub-state of processing
    case "Rejected":
      return "rejected";
    case "Plan Completed":
      return "ready";
    case "Cancelled by User":
      return "user_cancel";
    default:
      return displayStatus.toLowerCase();
  }
};

// --- ProgressBar Component ---
// This component should ideally be a separate file, but kept inline as per prompt.
const ProgressBar = ({ order }) => {
  if (!order || !order.flexiblePlan) {
    // If order has no top-level flexiblePlan, try to find one within items
    const firstTiffinItem = order?.items?.find(item => item.itemType === 'tiffin' && item.selectedPlan);
    if (!firstTiffinItem) return null; // No relevant plan found

    let planType = '';
    let planValue = 0;
    let startDate = null;
    let endDate = null;
    let flexiDates = [];

    if (firstTiffinItem.selectedPlan?.name === "date-range") {
      planType = "date-range";
      startDate = firstTiffinItem.startDate;
      endDate = firstTiffinItem.endDate;
    } else if (firstTiffinItem.selectedPlan?.name === "flexi-dates" && Array.isArray(firstTiffinItem.flexiDates)) {
      planType = "flexi-dates";
      flexiDates = firstTiffinItem.flexiDates;
    } else if (!isNaN(parseInt(firstTiffinItem.selectedPlan?.name, 10))) {
      planType = "normal";
      planValue = parseInt(firstTiffinItem.selectedPlan?.name, 10);
      startDate = firstTiffinItem.startDate;
    }

    let totalDays = 0;
    if (planType === "normal") {
      totalDays = planValue;
    } else if (planType === "date-range" && startDate && endDate) {
      totalDays = Math.max(0, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1); // +1 to include both start and end day
    } else if (planType === "flexi-dates") {
      totalDays = flexiDates.length;
    }

    const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0;
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
  }

  // Original logic if order has a top-level flexiblePlan
  const totalDays = order.flexiblePlan.type === "normal"
    ? parseInt(order.flexiblePlan.plan, 10)
    : order.flexiblePlan.type === "date-range"
    ? Math.max(0, (new Date(order.flexiblePlan.endDate).getTime() - new Date(order.flexiblePlan.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) // +1 to include both start and end day
    : order.flexiblePlan.type === "flexi-dates"
    ? order.flexiblePlan.flexiDates?.length || 0
    : 0;

  const deliveredDays = order.subStatus?.filter(s => s.statue === "delivered").length || 0;
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

// --- BillingDetails Component ---
// This component should ideally be a separate file, but kept inline as per prompt.
const BillingDetails = ({ order }) => {
  if (!order) return <p className="text-sm text-gray-500">No billing details available.</p>;

  return (
    <div className="text-sm text-gray-700 space-y-1 py-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${(order.subtotal || 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Fee:</span>
        <span>${(order.deliveryFee || 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Platform Fee:</span>
        <span>${(order.platformFee || 0).toFixed(2)}</span>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount:</span>
          <span>-${(order.discount || 0).toFixed(2)}</span>
        </div>
      )}
      {order.gstCharges > 0 && (
        <div className="flex justify-between">
          <span>GST:</span>
          <span>${(order.gstCharges || 0).toFixed(2)}</span>
        </div>
      )}
      <hr className="my-2 border-gray-300" />
      <div className="flex justify-between font-bold text-base">
        <span>Total:</span>
        <span>${(order.totalPrice || 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

// --- OrderDetails Main Component ---
const OrderDetails = ({ order, onStatusChange }) => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  const today = useMemo(() => new Date(), []); // Memoize today's date

  // Determines the effective flexible plan, prioritizing top-level order.flexiblePlan
  // or deriving from the first tiffin item if available.
  const effectiveFlexiblePlan = useMemo(() => {
    if (!order) return null;

    let plan = order.flexiblePlan;
    if (!plan && order.items && order.items.length > 0) {
      const firstTiffinItem = order.items.find(item => item.itemType === 'tiffin');
      if (firstTiffinItem && firstTiffinItem.selectedPlan) {
        if (firstTiffinItem.selectedPlan.name === "date-range") {
          plan = { type: "date-range", startDate: firstTiffinItem.startDate, endDate: firstTiffinItem.endDate };
        } else if (firstTiffinItem.selectedPlan.name === "flexi-dates" && Array.isArray(firstTiffinItem.flexiDates)) {
          plan = { type: "flexi-dates", flexiDates: firstTiffinItem.flexiDates };
        } else if (!isNaN(parseInt(firstTiffinItem.selectedPlan.name, 10))) {
          plan = { type: "normal", plan: firstTiffinItem.selectedPlan.name, startDate: firstTiffinItem.startDate };
        }
      }
    }
    return plan;
  }, [order]);

  useEffect(() => {
    if (!order || !effectiveFlexiblePlan) {
      setRemainingDays(null);
      return;
    }

    let calculatedRemainingDays = 0;
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0); // Normalize to start of today

    if (effectiveFlexiblePlan.type === "normal") {
      const planDuration = parseInt(effectiveFlexiblePlan.plan, 10);
      const startDate = new Date(effectiveFlexiblePlan.startDate || order.orderTime);
      startDate.setHours(0, 0, 0, 0);

      // Calculate delivered days based on subStatus
      const deliveredCount = order.subStatus?.filter(s => s.statue === "delivered").length || 0;

      // Remaining days in terms of plan duration
      calculatedRemainingDays = Math.max(0, planDuration - deliveredCount);

    } else if (effectiveFlexiblePlan.type === "date-range") {
      const startDate = new Date(effectiveFlexiblePlan.startDate);
      const endDate = new Date(effectiveFlexiblePlan.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const relevantDates = [];
      let tempDate = new Date(startDate);
      while (tempDate.getTime() <= endDate.getTime()) {
        relevantDates.push(new Date(tempDate));
        tempDate.setDate(tempDate.getDate() + 1);
      }

      const deliveredDates = new Set(order.subStatus?.filter(s => s.statue === "delivered").map(s => new Date(s.date).setHours(0,0,0,0)) || []);

      // Filter for future dates or today if not yet delivered
      const futureDates = relevantDates.filter(date => {
        const normalizedDate = date.setHours(0,0,0,0);
        return normalizedDate >= currentDay.getTime() && !deliveredDates.has(normalizedDate);
      });
      calculatedRemainingDays = futureDates.length;

    } else if (effectiveFlexiblePlan.type === "flexi-dates") {
      if (!Array.isArray(effectiveFlexiblePlan.flexiDates) || effectiveFlexiblePlan.flexiDates.length === 0) {
        console.log("No flexiDates found for this order.");
        setRemainingDays(0);
        return;
      }

      const deliveredDates = new Set(order.subStatus?.filter(s => s.statue === "delivered").map(s => new Date(s.date).setHours(0,0,0,0)) || []);

      const remainingDeliveries = effectiveFlexiblePlan.flexiDates.filter(dateString => {
        const flexiDate = new Date(dateString);
        flexiDate.setHours(0, 0, 0, 0);
        // Include dates that are today or in the future, AND not yet delivered
        return flexiDate.getTime() >= currentDay.getTime() && !deliveredDates.has(flexiDate.getTime());
      }).length;

      calculatedRemainingDays = remainingDeliveries;
    } else {
      calculatedRemainingDays = null; // No flexible plan, so no remaining days
    }
    setRemainingDays(calculatedRemainingDays);
  }, [order, effectiveFlexiblePlan, today]); // Re-run effect if order or plan changes

  // Toggles visibility of delivery details, hiding billing details if shown
  const toggleDeliveryDetails = () => {
    setShowDeliveryDetails((prev) => !prev);
    if (showBillingDetails) setShowBillingDetails(false);
  };

  // Toggles visibility of billing details, hiding delivery details if shown
  const toggleBilingDetails = () => {
    setShowBillingDetails((prev) => !prev);
    if (showDeliveryDetails) setShowDeliveryDetails(false);
  };

  // Handles status change from the dropdown, calls parent's onStatusChange prop
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (onStatusChange) {
      onStatusChange(order._id, getBackendStatus(newStatus)); // Convert display status back to backend status
    }
  };

  // Render nothing if no order is selected
  if (!order) return <div className="text-gray-500 p-4">Select an order to view details.</div>;

  return (
    <div className="bg-white shadow-md rounded-md px-2 w-full overflow-hidden max-h-screen overflow-y-auto">
      {/* Main Order Details View */}
      {!showDeliveryDetails && !showBillingDetails && (
        <div className="py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <div className="flex justify-between gap-4 items-center">
              <div className="py-2 flex items-center gap-2">
                <select
                  value={getDisplayStatus(order.status)}
                  onChange={handleStatusChange}
                  className={`px-2 py-1 rounded-md text-sm font-medium border border-gray-300
                    ${getDisplayStatus(order.status) === "New Order" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${getDisplayStatus(order.status) === "Processing" ? "bg-blue-100 text-blue-800" : ""}
                    ${getDisplayStatus(order.status) === "Rejected" ? "bg-red-100 text-red-800" : ""}
                    ${getDisplayStatus(order.status) === "Plan Completed" ? "bg-green-100 text-green-800" : ""}
                    ${getDisplayStatus(order.status) === "Cancelled by User" ? "bg-purple-100 text-purple-800" : ""}
                  `}
                >
                  <option value="New Order">New Order</option>
                  <option value="Processing">Processing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Plan Completed">Plan Completed</option>
                  <option value="Cancelled by User">Cancelled by User</option> {/* Added for user-cancelled */}
                </select>
              </div>
            </div>
          </div>
          {/* Customer and Order Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={order.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                alt={order.userId?.username || "Customer"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium">{order.userId?.username || "Unknown Customer"}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {order?.phone ? `(${order?.phone.countryCode}) ${order?.phone.number}` : "N/A"}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

          {/* Special Instructions */}
          <div className="mb-1">
            <h4 className="text-sm font-semibold mb-1">Special Instructions</h4>
            <p className="text-sm text-gray-500">{order.specialInstructions || "None"}</p>
          </div>

          {/* Cancellation Reason and Time (if applicable) */}
          {(order.status === "rejected" || order.status === "user_cancel") && order.cancellationReason && (
            <div className="mb-1 mt-2 p-2 bg-gray-50 rounded-md">
              <h4 className="text-sm font-semibold mb-1">Cancellation Details:</h4>
              <p className="text-sm text-gray-700">
                Reason: <span className="font-normal">{order.cancellationReason}</span>
              </p>
              {order.cancelledAt && (
                <p className="text-sm text-gray-700">
                  Cancelled At: <span className="font-normal">{formatDateTimeLocal(order.cancelledAt)}</span>
                </p>
              )}
            </div>
          )}

          <hr className="my-2" />

          {/* Loop through order.items to display details for each item */}
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={item._id || index} className="mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
                <h4 className="font-semibold text-base mb-1">Item {index + 1}: {item.name || "N/A"}</h4>
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
                        Date Range: {formatDateShort(item.startDate)} - {formatDateShort(item.endDate)}
                      </span>
                    ) : item.selectedPlan?.name === "flexi-dates" && Array.isArray(item.flexiDates) && item.flexiDates.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto"> {/* Added max-height and overflow */}
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
                        {item.selectedPlan.name} Days {item.startDate && ` (Start: ${formatDateShort(item.startDate)})`}
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

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Placed Time</span>
              <span className="text-sm text-gray-500">
                {formatDateTimeLocal(order.orderTime) || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Selected Delivery Time:</span>
              <span className="text-sm text-gray-500">
                {(order.deliverTime) || "N/A"}
              </span>
            </div>
          </div>

          <hr className="my-2" />

          {/* Overall Plan Progress */}
          <div className="">
            <div className="flex justify-between gap-4 items-center mt-3">
              <h4 className="text-sm font-semibold mb-2">Overall Plan Progress</h4>
            </div>
            <div>
              {
                effectiveFlexiblePlan && effectiveFlexiblePlan.type === "date-range" ? (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDateShort(effectiveFlexiblePlan.startDate)}{" "}
                    -{" "}
                    {formatDateShort(effectiveFlexiblePlan.endDate)}
                  </div>
                ) : effectiveFlexiblePlan && effectiveFlexiblePlan.type === "normal" ? (
                  <span className="text-sm text-gray-500 mb-2 block">
                    {effectiveFlexiblePlan.plan} Days
                    {effectiveFlexiblePlan.startDate && ` (Start Date: ${formatDateShort(effectiveFlexiblePlan.startDate)})`}
                  </span>
                ) : effectiveFlexiblePlan && Array.isArray(effectiveFlexiblePlan.flexiDates) && effectiveFlexiblePlan.flexiDates.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto mb-2">
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
                  <p className="text-sm text-gray-500 mb-2">No specific plan details available.</p>
                )
              }
              <ProgressBar order={order} />
            </div>
          </div>
        </div>
      )}

      {/* Buttons to toggle other views */}
      {!showDeliveryDetails && !showBillingDetails && (
        <div className={`flex justify-between items-center my-2 mt-3 mb-3 border-t pt-3 border-gray-200`}>
          <button onClick={toggleBilingDetails} className="text-blue-600 hover:text-blue-800 transition duration-150 rounded-md text-sm flex items-center">
            Show Billing Details
          </button>
          {remainingDays !== null && (
            <button onClick={toggleDeliveryDetails} className="text-blue-600 hover:text-blue-800 transition duration-150 rounded-md text-sm flex items-center">
              {remainingDays === 0 ? "Plan Completed" : `Remaining Days/Deliveries: ${remainingDays}`}
            </button>
          )}
        </div>
      )}

      {/* Delivery Details View */}
      {showDeliveryDetails && !showBillingDetails && (
        <div>
          <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
            <h2 className="text-lg font-semibold">Delivery Details</h2>
            <button onClick={toggleDeliveryDetails} className="text-blue-600 hover:text-blue-800 transition duration-150 rounded-md text-sm">
              Show Order Details
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2">
            {Array.isArray(order.subStatus) && order.subStatus.length > 0 ? (
              order.subStatus.map((statusEntry) => (
                <div key={statusEntry._id || statusEntry.date} className="flex items-center gap-2 p-1 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">
                    {formatDateShort(statusEntry.date)}:
                  </span>
                  <span className={`text-xs font-semibold
                    ${statusEntry.statue === "Not Delivered" || statusEntry.statue === "pending" ? "text-red-600" : "text-green-600"}
                  `}>
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

      {/* Billing Details View */}
      {!showDeliveryDetails && showBillingDetails && (
        <div>
          <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
            <h2 className="text-lg font-semibold">Billing Details</h2>
            <button onClick={toggleBilingDetails} className="text-blue-600 hover:text-blue-800 transition duration-150 rounded-md text-sm">
              Show Order Details
            </button>
          </div>
          <BillingDetails order={order} />
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
