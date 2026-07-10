// import React, { useState, useEffect } from "react";
// import { FaCheck, FaPhoneAlt } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import Axios from "axios";
// import { FiAlertCircle } from "react-icons/fi";
// import Modal from "./OrderModel";
// const Bookings = ({ heading, order }) => {
//   const [orderStatus, setOrderStatus] = useState(order);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//     console.log(order)
//   useEffect(() => {
//     setOrderStatus(order);
//   }, [order]);

//   const handleAlertClick = (order) => {
//     setSelectedOrder(order);
//   };
//   const handleConfirm = (id) => {
//     setOrderStatus((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, status: "confirmed" } : item
//       )
//     );
//     Axios.post(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`, { status: "accepted" })
//       .then((res) => console.log(res.data))
//       .catch((err) => console.log(err));
//   };
//   const closeModal = () => {
//     setSelectedOrder(null);
//   };

//   const handleCancel = (id) => {
//     setOrderStatus((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, status: "cancelled" } : item
//       )
//     );
//     Axios.post(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`, { status: "canceled" })
//       .then((res) => console.log(res.data))
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="p-2">
//       <h1 className="text-4xl font-bold mb-6 text-gray-800 uppercase">{heading}</h1>
//       <div className="grid grid-cols-3 gap-2">
//         {orderStatus?.map((item,index) => (
//           <div
//             key={index}
//             className="w-auto bg-white shadow rounded-lg border p-2 hover:shadow-lg transition-all"
//           >
//             {/* Restaurant Name */}
//               <div className="bg-gray-100 p-2 border-b border-gray-200 relative">
//                           <div className="flex justify-between items-center">
//                             <h2 className="font-semibold text-lg text-gray-700 flex">
//                               Order ID: {item?._id?.slice(-3,-1)}
//                             </h2>
//                             <div className="text-right text-sm text-gray-500">
//                               <button
//                                 className="relative -top-2 right-2 p-1 text-gray-500 hover:text-gray-800 transition"
//                                 title="More Info"
//                                 onClick={() => handleAlertClick(item)}
//                               >
//                                 <FiAlertCircle className="w-4 h-4" />
//                               </button>
//                               <h2>{item.time}</h2>
//                               <h2>{item.date?item.date:item.timeSlot}</h2>
//                             </div>
//                           </div>
//                         </div>
//             <h2 className="text-xl font-bold text-blue-600 mb-3">
//               {item.firm?.restaurantInfo?.name || "Unknown Restaurant"}
//             </h2>

//             <p className="text-gray-600 text-sm mb-1">Username: {item.username}</p>
//             <p className="text-gray-600 text-sm mb-1">Email: {item.email}</p>
//             <p className="text-gray-600 text-sm mb-1">Mobile: {item.mobileNumber}</p>
//             <p className="text-gray-600 text-sm mb-1">Guests: {item.guests}</p>
//             <p className="text-gray-600 text-sm mb-1">Meal: {item.meal}</p>
//             <p className="text-gray-600 text-sm mb-1">Time: {item.timeSlot}</p>
//             <p className="text-gray-600 text-sm mb-1">Date: {new Date(item.date).toLocaleDateString()}</p>
//             <p className="text-gray-600 text-sm mb-1">
//               Offer: {item.offerId?.name} - ${item.offerId?.discountValue}
//             </p>
//             <p className="font-bold text-sm mt-2">
//               Status:{" "}
//               <span
//                 className={`${
//                   item.status === "pending"
//                     ? "text-yellow-500"
//                     : item.status === "confirmed"
//                     ? "text-green-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {item.status}
//               </span>
//             </p>

//             {/* Action buttons */}
//             <div className="flex justify-around mt-4">
//               <button
//                 className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
//                 onClick={() => handleConfirm(item._id)}
//                 title="Confirm"
//               >
//                 <FaCheck />
//               </button>
//               <button
//                 className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
//                 onClick={() => handleCancel(item._id)}
//                 title="Cancel"
//               >
//                 <IoMdClose />
//               </button>
//               <button
//                 className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
//                 title="Call"
//               >
//                 <FaPhoneAlt />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <Modal
//         isOpen={!!selectedOrder}
//         onClose={closeModal}
//         order={selectedOrder}
//       />
//     </div>
//   );
// };

// export default Bookings;

import React, { useState, useEffect } from "react";
import { FaCheck, FaPhoneAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Axios from "axios";
import { FiAlertCircle } from "react-icons/fi";
import Modal from "./OrderModel";

const Bookings = ({ heading, order }) => {
  const [orderStatus, setOrderStatus] = useState(order);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrderStatus(order);
  }, [order]);

  const handleAlertClick = (order) => {
    setSelectedOrder(order);
  };

  const handleConfirm = (id) => {
    setOrderStatus((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: "confirmed" } : item
      )
    );
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`, {
      status: "accepted",
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const handleCancel = (id) => {
    setOrderStatus((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: "cancelled" } : item
      )
    );
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`, {
      status: "canceled",
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 uppercase">
        {heading}
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {orderStatus?.map((item, index) => (
          <div
            key={index}
            className="w-auto bg-white shadow rounded-lg border p-2 hover:shadow-lg transition-all"
          >
            <div className="bg-gray-100 p-2 border-b border-gray-200 relative">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-700 flex">
                  Order ID: {item?._id?.slice(-3, -1)}
                </h2>
                <div className="text-right text-sm text-gray-500">
                  <button
                    className="relative -top-2 right-2 p-1 text-gray-500 hover:text-gray-800 transition"
                    title="More Info"
                    onClick={() => handleAlertClick(item)}
                  >
                    <FiAlertCircle className="w-4 h-4" />
                  </button>
                  <h2>{item.time}</h2>
                  <h2>{item.date ? item.date : item.timeSlot}</h2>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-blue-600 mb-3">
              {item.firm?.restaurantInfo?.name || "Unknown Restaurant"}
            </h2>

            <p className="text-gray-600 text-sm mb-1">Username: {item.username}</p>
            <p className="text-gray-600 text-sm mb-1">Email: {item.email}</p>
            {/* <p className="text-gray-600 text-sm mb-1">
              Mobile: {item.mobileNumber || item.phone || "N/A"}
            </p> */}
            <p className="text-gray-600 text-sm mb-1">Guests: {item.guests}</p>
            <p className="text-gray-600 text-sm mb-1">Meal: {item.meal}</p>
            <p className="text-gray-600 text-sm mb-1">Time: {item.timeSlot}</p>
            <p className="text-gray-600 text-sm mb-1">
              Date: {new Date(item.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              Offer: {item.offerId?.name || "N/A"} - $
              {item.offerId?.discountValue || 0}
            </p>
            <p className="font-bold text-sm mt-2">
              Status:{" "}
              <span
                className={`${
                  item.status === "pending"
                    ? "text-yellow-500"
                    : item.status === "confirmed"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.status}
              </span>
            </p>

            <div className="flex justify-around mt-4">
              <button
                className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                onClick={() => handleConfirm(item._id)}
                title="Confirm"
              >
                <FaCheck />
              </button>
              <button
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                onClick={() => handleCancel(item._id)}
                title="Cancel"
              >
                <IoMdClose />
              </button>
              <a
                href={`tel:${item.mobileNumber || item.phone || ""}`}
                className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                title="Call"
              >
                <FaPhoneAlt />
              </a>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
    </div>
  );
};

export default Bookings;