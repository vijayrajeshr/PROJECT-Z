// import React from "react";
// import { IoMdClose } from "react-icons/io";

// const Modal = ({ isOpen, onClose, order }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-96 p-6">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-800 transition"
//           >
//             <IoMdClose className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Order Details */}
//         <div className="space-y-2">
//           <h2>
//             <span className="font-semibold">Order ID:</span> {order.id || order._id}
//           </h2>
//           <h2>
//             <span className="font-semibold">Name:</span> {order.Name || order.username}
//           </h2>
//           <h2>
//             <span className="font-semibold">{order.category ?"Category : ": "Email : "}</span> {order.category || order.email}
//           </h2>
//           <h2>
//             <span className="font-semibold">{order.subcategory ?"subcategory : ": "Mobile :"}</span>{" "}
//             {order.subcategory || order.mobileNumber}
//           </h2>
//           <h2>
//             <span className="font-semibold">{order.item? " Item:": "Guest :"}</span> {order.item || order.guests}
//           </h2>
//           {order.pickuptime &&
//           <h2>
//             <span className="font-semibold">Pick-up Time:</span>{" "}
//             {order.pickuptime || "Not Specified"}
//           </h2>
//           }
//           <h2>
//             <span className="font-semibold">Status:</span>{" "}
//             <span
//               className={`${
//                 order.status === "pending"
//                   ? "text-yellow-500"
//                   : order.status === "confirmed"
//                   ? "text-green-500"
//                   : "text-red-500"
//               } font-bold`}
//             >
//               {order.status || "Unknown"}
//             </span>
//           </h2>
//           <h2>
//             <span className="font-semibold">Coupon Code:</span>{" "}
//             {order.couponCode ||order.offerId?.code}
//           </h2>
//           <h2>
//             <span className="font-semibold">Offers:</span>{" "}
//             {order?.offers ||order?.offerId?.name}
//           </h2>
//           <h2>
//             <span className="font-semibold">{order?.address ?"Address : " :"Discount : "}</span>{" "}
//             {order?.address || order?.offerId?.discountValue + "%"}
//           </h2>
//           <h2>
//             <span className="font-semibold">{ order.price?"Total Price:" : "Offer Type : "}</span>
//             { order?.price || order?.offerId?.offerType}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiUser, FiMail, FiCalendar, FiClock, FiTag, FiMapPin,
} from "react-icons/fi";
import { FaUtensils, FaUsers } from "react-icons/fa";

const formatDate = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return "N/A";
  const date = new Date(dateStr);
  return `${date.toLocaleDateString("en-GB")} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const CustomModal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
        {children}
      </div>
    </div>
  );
};

const OrderModel = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <CustomModal isOpen={isOpen}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <IoMdClose size={24} />
      </button>

      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Booking Details <span className="text-green-600 font-semibold">#{order._id?.slice(-6)}</span>
      </h2>

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FiTag className="text-blue-500" />
          <span className="font-semibold">Restaurant:</span>
          <span>{order?.firm?.restaurantInfo?.name || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiMapPin className="text-red-500" />
          <span className="font-semibold">Address:</span>
          <span>{order?.Raddress || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-green-500" />
          <span className="font-semibold">Booking Placed:</span>
          <span>{formatDate(order?.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiClock className="text-yellow-500" />
          <span className="font-semibold">Scheduled Booking Time:</span>
          <span>{formatDate(order?.date)}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaUsers className="text-indigo-500" />
          <span className="font-semibold">Guests:</span>
          <span>{order?.guests}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaUtensils className="text-pink-500" />
          <span className="font-semibold">Meal:</span>
          <span>{order?.meal}</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          onClick={() => alert("Cancel Booking Clicked")}
        >
          Cancel Booking
        </button>
      </div>
    </CustomModal>
  );
};

export default OrderModel;