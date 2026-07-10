// import React from "react";
// import { XCircleIcon as CloseCircleOutlineIcon } from "@heroicons/react/24/outline";
// import { InformationCircleIcon as InfoCircleIcon } from "@heroicons/react/24/outline";
// import { TruckIcon } from "@heroicons/react/24/outline";
// import { ClockIcon } from "@heroicons/react/24/outline";

// const OrderPopup = ({ order, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl overflow-y-auto h-[500px] relative">
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
//         >
//           <CloseCircleOutlineIcon className="w-8 h-8" /> {/* 32px */}
//         </button>
//         <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
//           <InfoCircleIcon className="mr-2 text-teal-600 w-6 h-6" /> {/* 24px */}
//           Order Details{" "}
//           <span className="text-teal-600 ml-2">#{order._id?.slice(-6)}</span>
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
//           <div className="flex">
//             <p className="font-semibold text-gray-600 flex items-center">
//               <ClockIcon className="mr-2 text-yellow-500 w-6 h-6" />{" "}
//               {/* 18px */}
//               Order Time:
//             </p>
//             <p className="ml-5">
//               {new Date(order.orderTime).toLocaleString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//           <div className="flex">
//             <p className="font-semibold text-gray-600 flex items-center">
//               <ClockIcon className="mr-2 text-green-500 w-6 h-6" /> {/* 18px */}
//               Status:
//             </p>
//             <p className="ml-5">{order.status}</p>
//           </div>
//           <div className="flex ">
//             <p className="font-semibold text-gray-600 flex items-center">
//               <ClockIcon className="mr-2 text-green-500 w-6 h-6" /> {/* 18px */}
//               Scheduled Takeaway Time:
//             </p>
//             <p className="ml-5">
//               {new Date(order.deliverTime).toLocaleString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//         </div>

//         <div className="mb-6 border-t pt-4">
//           <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Items:</h4>
//           <div className="space-y-2">
//             {order.items.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
//               >
//                 <div className="flex-grow">
//                   <p className="font-medium text-gray-800">
//                     <strong>Product Name:</strong> {item.name}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     <strong>Description:</strong> {item.description}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     <strong>Quantity:</strong> {item.quantity}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     <strong>Food Type:</strong> {item.foodType}
//                   </p>
//                 </div>
//                 <span className="font-semibold text-teal-700">
//                   <strong>Price:</strong> ${item.price}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="border-t pt-4">
//           <h4 className="font-bold text-gray-800 mb-3 text-lg">
//             Payment Summary:
//           </h4>
//           <div className="space-y-2">
//             <div className="flex justify-between text-base text-gray-700">
//               <span>Subtotal:</span>
//               <span>${order.subtotal}</span>
//             </div>
//             {order.deliveryFee > 0 && (
//               <div className="flex justify-between text-base text-gray-700">
//                 <span>Delivery Fee:</span>
//                 <span>${order.deliveryFee}</span>
//               </div>
//             )}
//             {order.gstCharges > 0 && (
//               <div className="flex justify-between text-base text-gray-700">
//                 <span>GST Charges:</span>
//                 <span>${order.gstCharges}</span>
//               </div>
//             )}
//             {order.platformFee > 0 && (
//               <div className="flex justify-between text-base text-gray-700">
//                 <span>Platform Fee:</span>
//                 <span>${order.platformFee}</span>
//               </div>
//             )}
//             {order.discount > 0 && (
//               <div className="flex justify-between text-base text-red-600 font-medium">
//                 <span>Discount:</span>
//                 <span>- ${order.discount}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-extrabold text-xl text-gray-900 mt-4 border-t pt-3">
//               <span>Total Price:</span>
//               <span className="text-teal-600">${order.totalPrice}</span>
//             </div>
//           </div>
//         </div>

//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderPopup;

import React from "react";
import { XCircleIcon as CloseCircleOutlineIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon as InfoCircleIcon } from "@heroicons/react/24/outline";
import { TruckIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";

const OrderPopup = ({ order, onClose }) => {
  console.log(order, "order");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.02]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Close"
        >
          <CloseCircleOutlineIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-teal-100 pb-2 flex items-center">
          <InfoCircleIcon className="mr-2 text-teal-600 w-6 h-6" />
          Order Summary
          <span className="text-teal-600 ml-2 font-semibold">
            #{order._id?.slice(-6)}
          </span>
        </h2>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 mb-6">
          <div className="space-y-1">
            <p className="font-semibold text-gray-600 flex items-center text-sm">
              <ClockIcon className="mr-1.5 text-yellow-500 w-4 h-4" />
              Ordered On:
            </p>
            <p className="ml-6 text-xs">
              {new Date(order.orderTime).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-600 flex items-center text-sm">
              <ClockIcon className="mr-1.5 text-green-500 w-4 h-4" />
              Status:
            </p>
            <p className="ml-6 text-xs">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-600 flex items-center text-sm">
              <TruckIcon className="mr-1.5 text-blue-500 w-4 h-4" />
              Pickup Time:
            </p>
            <p className="ml-6 text-xs">
              {new Date(order.deliverTime).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 border-t pt-4">
          <h4 className="font-bold text-gray-800 text-lg mb-3">
            Items Ordered
          </h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                  <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                    <p>Qty: {item.quantity}</p>
                    <p>Type: {item.foodType}</p>
                  </div>
                </div>
                <span className="font-semibold text-teal-700 text-sm">
                  ${item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-800 text-lg mb-3">
            Payment Details
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal:</span>
              <span>${order.subtotal}</span>
            </div>
            {/* {order.deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Fee:</span>
                <span>+${order.deliveryFee}</span>
              </div>
            )} */}
            {order.overallOtherTaxes > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>OtherTaxes:</span>
                <span>+${order.overallOtherTaxes}</span>
              </div>
            )}
            {order.gstCharges > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>GST:</span>
                <span>+${order.gstCharges}</span>
              </div>
            )}
            {order.platformFee > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Platform Fee:</span>
                <span>+${order.platformFee}</span>
              </div>
            )}
            {Array.isArray(order.totalOtherCharges) &&
              order.totalOtherCharges.length > 0 &&
              order.totalOtherCharges.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{item.name}:</span>
                  <span>+${item.value}</span>
                </div>
              ))}

            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-red-600 font-medium">
                <span>Discount</span>
                <span>-${order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-gray-900 mt-3 border-t pt-2">
              <span>Total</span>
              <span className="text-teal-600">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
