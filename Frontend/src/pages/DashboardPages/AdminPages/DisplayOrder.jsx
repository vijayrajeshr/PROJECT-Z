// import React, { useEffect, useState } from "react";
// import { FaCheck, FaPhoneAlt } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import { FiAlertCircle } from "react-icons/fi";
// import Modal from "./OrderModel";
// import Axios from "axios";
// export const DisplayOrder = ({ heading, order }) => {
//   const [orderStatus, setOrderStatus] = useState(order);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     setOrderStatus(order);
//   }, [heading, order]);

//   const handleAlertClick = (order) => {
//     setSelectedOrder(order);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//   };

//   const handleConform = (id) => {
//     setOrderStatus((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, status: "confirmed" } : item
//       )
//     );
//     let newStatus="accepted"
//     // Axios.post(`http://localhost:3000/api/bookings/${id}`,{status:newStatus})
//     //       .then((response)=>{
//     //         console.log(response.data);
//     //         setUpdate(true);
//     //       })
//     //       .catch((error)=>{
//     //         console.log(error);
//     //       })
//   };

//   const handleCancel = (id) => {
//     setOrderStatus((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, status: "cancelled" } : item
//       )
//     );
//     let newStatus="canceled"
//     // Axios.post(`http://localhost:3000/api/bookings/${id}`,{status:newStatus})
//     //       .then((response)=>{
//     //         console.log(response.data);
//     //       })
//     //       .catch((error)=>{
//     //         console.log(error);
//     //       })
//   };

//   return (
//     <div className="p-2">
//       {/* Heading */}
//       <h1 className="font-bold text-4xl uppercase text-gray-800 mb-6">
//         {heading}
//       </h1>

//       {/* Orders Container */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {orderStatus.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105"
//           >
//             {/* Order Header */}
//             <div className="bg-gray-100 p-4 border-b border-gray-200 relative">
//               <div className="flex justify-between items-center">
//                 <h2 className="font-semibold text-lg text-gray-700">
//                   Order ID: {item.id?item.id:item?._id?.slice(-3,-1)}
//                 </h2>
//                 <div className="text-right text-sm text-gray-500">
//                   <button
//                     className="relative -top-2 right-2 p-1 text-gray-500 hover:text-gray-800 transition"
//                     title="More Info"
//                     onClick={() => handleAlertClick(item)}
//                   >
//                     <FiAlertCircle className="w-4 h-4" />
//                   </button>
//                   <h2>{item.time}</h2>
//                   <h2>{item.date?item.date:item.timeSlot}</h2>
//                 </div>
//               </div>
//             </div>

//             {/* Order Details */}
//             <div className="p-4 space-y-2">
//               <div className="flex justify-between">
//                 <h2 className="text-gray-600">{item.subcategory ?item.subcategory : `Meal Type : ${item.meal}`}</h2>
//                 <div>
//                   <h2 className="text-gray-600">
//                     {item.item && <p>{item.item} x {item.quantity}</p>}
                    
//                   </h2>
//                 </div>
//               </div>
//               <h2 className="text-gray-700 font-medium">{item.Name?item.Name:item?.username}</h2>
//               <h2 className="text-gray-600 text-sm">
//                 {item.pickuptime?"Pick-up Time":"Email : "}:{" "}
//                 <span className="text-gray-800">{item.pickuptime?item.pickuptime:item.email}</span>
//               </h2>
//               <h2 className="text-gray-600 text-sm">
//               {item.category?"Category":"Mobile Number"}  : <span className="text-gray-800">{item.category?item.category:item?.mobileNumber}</span>
//               </h2>
//               <h2 className="text-gray-600 text-sm">
//               {item.subcategory?"Subcategory":"Offer"}  :{" "}
//                 <span className="text-gray-800">{item.subcategory ?item.subcategory:item?.offerId?.name}</span>
//               </h2>
//               <div className="flex justify-between items-center">
//                 <h2 className="font-semibold text-gray-800">
//                 {item.price?"Price":"DiscountValue"}: ${item.price?item.price:item.offerId?.discountValue}
//                 </h2>
//                 <h2 className="text-gray-600">{item.payment}</h2>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-around items-center p-1">
//               {/* Confirm Order */}
//               <button
//                 className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
//                 title="Confirm Order"
//                 onClick={() => handleConform(item._id)}
//               >
//                 <FaCheck className="h-5 w-5" />
//               </button>
//               {/* Cancel Order */}
//               <button
//                 className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
//                 title="Cancel Order"
//                 onClick={() => handleCancel(item._id)}
//               >
//                 <IoMdClose className="h-5 w-5" />
//               </button>
//               {/* Call Icon */}
//               <button
//                 className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
//                 title="Call"
//               >
//                 <FaPhoneAlt className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Status */}
//             <div className="bg-gray-50 p-4 border-t border-gray-200">
//               <h2 className="font-medium text-gray-700">
//                 Status:{" "}
//                 <span
//                   className={`${
//                     item.status === "pending"
//                       ? "text-yellow-500"
//                       : item.status === "confirmed"
//                       ? "text-green-500"
//                       : "text-red-500"
//                   } font-bold`}
//                 >
//                   {item.status}
//                 </span>
//               </h2>
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

import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayOrder = ({ heading }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [tiffin, takeaway, dining] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/orders/tiffin`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/orders/menu`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/bookings`, { withCredentials: true })
        ]);
        const allOrders = [
          ...(tiffin.data.orders || []),
          ...(takeaway.data.orders || []),
          ...(dining.data || [])
        ];
        setOrders(allOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">{heading}</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-blue-50 text-blue-700">
            <tr>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, idx) => (
              <tr key={order?._id || idx} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 text-xs font-mono text-gray-600">{order._id || "N/A"}</td>
                <td className="py-2 px-4">
                  <div className="font-medium">
                    {order?.userId?.username || order?.username || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order?.userId?.email || order?.email || "N/A"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <div key={i}>
                        {item?.name || item?.productId?.name || "Unnamed item"} × {item?.quantity || 1}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 italic">No items</div>
                  )}
                </td>
                <td className="py-2 px-4 font-semibold text-green-600">
                  ₹{(((order?.totalPrice ?? 0) - (order?.discount ?? 0)).toFixed(2))}
                </td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize inline-block ${
                    order.status === "pending" ? "bg-yellow-200 text-yellow-800"
                    : order.status === "accepted" ? "bg-green-200 text-green-800"
                    : order.status === "rejected" ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800"
                  }`}>
                    {order.status || "N/A"}
                  </span>
                </td>
                <td className="py-2 px-4 text-xs text-gray-600">
                  {new Date(order?.orderTime || order?.createdAt || Date.now()).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="w-24 h-9 bg-blue-500 text-white rounded-xl disabled:opacity-50 hover:bg-blue-600"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-24 h-9 bg-blue-500 text-white rounded-xl disabled:opacity-50 hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisplayOrder;