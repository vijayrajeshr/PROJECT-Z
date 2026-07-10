// import React from "react";
import {
  FiXCircle,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlinePayment, MdLocationOn } from "react-icons/md";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/solid";

const capitalize = (str) =>
  typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const OrderPopup = ({ order, onClose }) => {
  if (!order) return null;

  const {
    _id,
    items = [],
    subtotal = 0,
    deliveryFee = 0,
    gstCharges = 0,
    platformFee = 0,
    discount = 0,
    totalPrice = 0,
    createdAt,
    deliverTime,
    subStatus = [],
    timeline = [],
    status,
    cancellationReason,
    cancelledAt,
  } = order;

  // Build a chronological timeline array
  const orderTimeline = subStatus.length
    ? [...subStatus].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [...timeline].sort((a, b) => new Date(a.time || a.date) - new Date(b.time || b.date));

  const restaurant = items[0]?.sourceEntityId?.restaurantInfo || {};
  const scheduledTime = deliverTime || createdAt;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          <FiXCircle />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          <IoFastFoodOutline className="text-emerald-600" />
          Order Details <span className="text-emerald-600">#{_id?.slice(-6) || "N/A"}</span>
        </h2>

        <hr className="mb-4" />

        {/* Restaurant & Timing */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div>
            <p className="font-medium">Restaurant:</p>
            <p>{restaurant.name || "N/A"}</p>
            <p className="text-xs text-gray-600 flex items-start gap-1">
              <MdLocationOn className="mt-[2px]" />
              {restaurant.address || "No address"}
            </p>
          </div>
          <div>
            <p className="font-medium">Order Type:</p>
            <p>{capitalize(order.type) || "Takeaway"}</p>
          </div>
          <div>
            <p className="font-medium flex items-center gap-2">
              <FiCalendar /> Order Placed:
            </p>
            <p>{new Date(createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium flex items-center gap-2">
              <FiClock /> Scheduled Time:
            </p>
            <p>{new Date(scheduledTime).toLocaleString()}</p>
          </div>
        </div>

        <hr className="mb-4" />

        {/* Items List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded mb-2"
              >
                <div>
                  <p className="font-medium">{item.name || "Unnamed item"}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                  {item.foodType && (
                    <p className="text-xs text-gray-500">Type: {item.foodType}</p>
                  )}
                </div>
                <p className="text-green-600 font-semibold">
                  ₹{(item.price ?? 0).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No items in this order</p>
          )}
        </div>

        <hr className="mb-4" />

        {/* Payment Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MdOutlinePayment className="text-emerald-600" /> Payment Summary
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>+ ₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST:</span>
              <span>+ ₹{gstCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee:</span>
              <span>+ ₹{platformFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Total Paid:</span>
              <span className="text-emerald-600 font-bold">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        {orderTimeline.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Order Timeline</h3>
            <ol className="relative border-l border-gray-200 ml-4">
              {orderTimeline.map((entry, idx) => {
                const ts = entry.date || entry.time;
                const isFinal = idx === orderTimeline.length - 1;
                const st = (entry.status || "").toLowerCase();
                const done = st === "delivered" || st === "completed";
                return (
                  <li key={idx} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
                      {done
                        ? <CheckIcon className="w-4 h-4 text-green-500" />
                        : <ClockIcon className="w-4 h-4 text-yellow-500" />}
                    </span>
                    <h4 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                      {capitalize(entry.status)}
                      {isFinal && <span className="bg-blue-100 text-blue-800 text-xs font-medium ml-3 px-2.5 py-0.5 rounded">Latest</span>}
                    </h4>
                    <time className="block mb-2 text-xs text-gray-500">
                      {formatDate(ts)} at {formatTime(ts)}
                    </time>

                    {/* Show cancel reason if this was cancellation */}
                    {status === "user_cancel" && isFinal && cancellationReason && (
                      <div className="pl-4 border-l-2 border-red-400 italic text-sm text-gray-600">
                        <p>Reason: {cancellationReason}</p>
                        <time className="text-xs text-gray-400">On {formatDate(cancelledAt)}</time>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPopup;