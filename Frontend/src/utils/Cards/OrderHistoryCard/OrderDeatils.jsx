import React from "react";

const OrderDetails = ({ order, onClose }) => {
  const {
    _id,
    userId,
    items,
    subtotal,
    deliveryFee,
    platformFee,
    gstCharges,
    totalPrice,
    discount,
    status,
    createdAt,
  } = order;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjusts for both date and time
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative h-[75%] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-red-500">Order Details</h2>
          <p className="text-sm text-gray-500">Order ID: {_id}</p>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Customer</h3>
          <p className="text-gray-600">{userId?.username}</p>
          <p className="text-gray-600">{userId?.email}</p>
        </div>

        {/* Restaurant Info */}
        {items?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Restaurant Information
            </h3>
            <p className="text-gray-600">
              {items[0]?.restaurantName.restaurantInfo.name}
            </p>
            <p className="text-gray-600">
              {items[0]?.restaurantName.restaurantInfo.address}
            </p>
          </div>
        )}

        {/* Ordered Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Ordered Items</h3>
          <ul className="divide-y divide-gray-200">
            {items?.map((item) => (
              <li key={item._id} className="py-2 flex justify-between">
                <div>
                  <p className="text-gray-800">
                    {item.quantity} x {item.productId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.productId.description}
                  </p>
                </div>
                <p className="text-gray-800 font-semibold">
                  ₹ {item.price * item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Delivery Fee</span>
              <span>₹ {deliveryFee}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Platform Fee</span>
              <span>₹ {platformFee}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>GST Charges</span>
              <span>₹ {gstCharges.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1 text-green-500">
                <span>Discount</span>
                <span>-₹ {discount}</span>
              </div>
            )}
            <div className="flex justify-between py-1 font-bold">
              <span>Total Price</span>
              <span>₹ {totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Ordered On: {formatDate(createdAt)}
          </p>
          <span
            className={`px-3 py-1 rounded-lg ${
              status === "Delivered"
                ? "bg-green-100 text-green-600"
                : status === "Preparing"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
