// import React, { useEffect, useState } from "react";
// import { FiAlertCircle } from "react-icons/fi";
// import Modal from "./TiffinModel"; // Assume this is your modal component

// // Capitalize helper
// const capitalize = (str) => {
//   if (typeof str !== "string") return "";
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// // Status color
// const getStatusStyle = (status) => {
//   const lowerStatus = status?.toLowerCase();
//   switch (lowerStatus) {
//     case "notaccept":
//       return "text-yellow-600 font-semibold";
//     case "pending":
//       return "text-blue-600 font-semibold";
//     case "preparing":
//       return "text-purple-600 font-semibold";
//     case "ready":
//       return "text-indigo-600 font-semibold";
//     case "rejected":
//       return "text-red-700 font-semibold";
//     case "accept":
//       return "text-green-600 font-semibold";
//     default:
//       return "text-gray-600 font-semibold";
//   }
// };

// const availableStatuses = [
//   "notaccept",
//   "pending",
//   "preparing",
//   "ready",
//   "rejected",
//   "accept",
// ];

// export const TiffinDisplayOrder = ({
//   heading,
//   orders = [],
//   onUpdateStatus,
//   onAction,
// }) => {
//   const [currentOrders, setCurrentOrders] = useState(orders);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Pagination state
//   const pageSize = 20;
//   const [page, setPage] = useState(1);
//   const totalPages = Math.ceil(currentOrders.length / pageSize);
//   const pagedOrders = currentOrders.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const goToPage = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     setPage(newPage);
//   };

//   useEffect(() => {
//     setCurrentOrders(orders);
//     setPage(1); // Reset to first page when data updates
//   }, [orders]);

//   const handleAlertClick = (order) => {
//     setSelectedOrder(order);
//   };

//   const closeModal = () => {
//     setSelectedOrder(null);
//   };

//   const updateOrderStatus = (id, newStatus) => {
//     setCurrentOrders((prev) =>
//       prev.map((orderItem) =>
//         orderItem._id === id ? { ...orderItem, status: newStatus } : orderItem
//       )
//     );

//     if (onUpdateStatus) {
//     const action = e.target.value;
//     const orderId = orderItem._id;

//     e.target.value = "";

//     const isStatusAction = availableStatuses.includes(action);

//     if (isStatusAction) {
//       updateOrderStatus(orderId, action);
//       if (onAction) onAction(orderId, action);
//     } else {
//       switch (action) {
//         case "call":
//           const phoneNumber =
//             orderItem.userId?.phone?.fullNumber ||
//             orderItem.userId?.mobileNumber;
//           if (phoneNumber) {
//             window.open(`tel:${phoneNumber}`);
//           } else {
//             alert("Phone number not available.");
//           }
//           if (onAction) onAction(orderId, "call");
//           break;
//         case "moreInfo":
//           handleAlertClick(orderItem);
//           if (onAction) onAction(orderId, "moreInfo");
//           break;
//         default:
//           console.warn(`Unhandled action: ${action}`);
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", {
//       year: "numeric",
//       month: "numeric",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//       timeZone: "Asia/Kolkata",
//     });
//   };

//   return (
//     <div className="p-2">
//       <div className="shadow-lg rounded-lg overflow-hidden">
//         <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
//           <table className="w-full table-fixed bg-white divide-y divide-gray-200">
//             <thead className="sticky top-0 bg-gray-100 z-10 text-xs text-gray-500 uppercase tracking-wider">
//               <tr>
//                 <th className="px-2 py-2 w-[10%] text-left">Order ID</th>
//                 <th className="px-2 py-2 w-[15%] text-left">Customer Name</th>
//                 <th className="px-2 py-2 w-[20%] text-left">Meal</th>
//                 <th className="px-2 py-2 w-[10%] text-left">Plan</th>
//                 <th className="px-2 py-2 w-[10%] text-left">Price</th>
//                 <th className="px-2 py-2 w-[10%] text-left">Status</th>
//                 <th className="px-2 py-2 w-[15%] text-left">Order Time</th>
//                 <th className="px-2 py-2 w-[10%] text-left">Actions</th>
//                 <th className="px-2 py-2 w-[5%] text-left">Details</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
//               {pagedOrders.length > 0 ? (
//                 pagedOrders.map((orderItem) => {
//                   const item = orderItem.items?.[0];
//                   if (!item) return null;

//                   return (
//                     <tr key={orderItem._id} className="hover:bg-gray-50">
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         {String(orderItem._id).slice(-6)}
//                       </td>
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         {orderItem.userId?.username || "N/A"}
//                       </td>
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         {item.name} ({item.mealType || "N/A"})
//                       </td>
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         {item.selectedPlan
//                           ? `${item.selectedPlan} Day(s)`
//                           : "N/A"}
//                       </td>
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         ₹
//                         {orderItem.totalPrice
//                           ? orderItem.totalPrice.toFixed(2)
//                           : "0.00"}
//                       </td>
//                       <td className={`px-2 py-2 ${getStatusStyle(orderItem.status)}`}>
//                         {orderItem.status
//                           ? capitalize(orderItem.status)
//                           : "N/A"}
//                       </td>
//                       <td className="px-2 py-2 break-words  whitespace-normal text-sm">
//                         {formatDate(orderItem.orderTime)}
//                       </td>
//                       <td className="px-2 py-2  whitespace-normal text-sm">
//                         <select
//                           onChange={(e) => handleActionChange(e, orderItem)}
//                           defaultValue=""
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
//                         >
//                           <option value="" disabled>
//                             Select Action
//                           </option>
//                           {availableStatuses.map((status) => (
//                             <option key={status} value={status}>
//                               Set Status: {capitalize(status)}
//                             </option>
//                           ))}
//                           <option value="call">Call Customer</option>
//                         </select>
//                       </td>
//                       <td className="px-2 py-2">
//                         <button
//                           onClick={() => handleAlertClick(orderItem)}
//                           title="More Info"
//                           className="p-1 rounded-full hover:bg-gray-200"
//                         >
//                           <FiAlertCircle className="h-5 w-5 text-gray-600" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="text-center py-4 text-gray-500">
//                     No orders to display.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination UI */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 py-3">
//             <button
//               onClick={() => goToPage(page - 1)}
//               disabled={page === 1}
//               className={`px-3 py-1 rounded-md border text-sm ${
//                 page === 1
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-100"
//               }`}
//             >
//               Prev
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(
//                 (p) =>
//                   p === 1 ||
//                   p === totalPages ||
//                   Math.abs(p - page) <= 2
//               )
//               .map((p, idx, arr) => (
//                 <React.Fragment key={p}>
//                   {idx > 0 && p - arr[idx - 1] > 1 && (
//                     <span className="px-1 text-gray-400">…</span>
//                   )}
//                   <button
//                     onClick={() => goToPage(p)}
//                     className={`px-3 py-1 rounded-md border text-sm ${
//                       p === page
//                         ? "bg-indigo-600 text-white"
//                         : "bg-white hover:bg-gray-100"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 </React.Fragment>
//               ))}

//             <button
//               onClick={() => goToPage(page + 1)}
//               disabled={page === totalPages}
//               className={`px-3 py-1 rounded-md border text-sm ${
//                 page === totalPages
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-100"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal for details */}
//       <Modal
//         isOpen={!!selectedOrder}
//         onClose={closeModal}
//         order={selectedOrder}
//       />
//     </div>
//   );
// };
// }

import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Modal from "./TiffinModel";

const capitalize = (str) => typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const getStatusStyle = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "notaccept": return "text-yellow-600 font-semibold";
    case "pending": return "text-blue-600 font-semibold";
    case "preparing": return "text-purple-600 font-semibold";
    case "ready": return "text-indigo-600 font-semibold";
    case "rejected": return "text-red-700 font-semibold";
    case "accept": return "text-green-600 font-semibold";
    default: return "text-gray-600 font-semibold";
  }
};

const availableStatuses = [
  "notaccept", "pending", "preparing", "ready", "rejected", "accept"
];

export const TiffinDisplayOrder = ({ heading, orders = [], onUpdateStatus, onAction }) => {
  const [currentOrders, setCurrentOrders] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(currentOrders.length / pageSize);

  useEffect(() => {
    setCurrentOrders(orders);
    setPage(1);
  }, [orders]);

  const pagedOrders = currentOrders.slice((page - 1) * pageSize, page * pageSize);
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleAlertClick = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const updateOrderStatus = (id, newStatus) => {
    setCurrentOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
    onUpdateStatus?.(id, newStatus);
  };

  const handleActionChange = (e, order) => {
    const action = e.target.value;
    e.target.value = "";
    if (availableStatuses.includes(action)) {
      updateOrderStatus(order._id, action);
      onAction?.(order._id, action);
    } else if (action === "call") {
      const phone = order.phone?.number || order.userId?.phone?.fullNumber;
      if (phone) window.open(`tel:${phone}`);
      else alert("Phone number not available.");
      onAction?.(order._id, "call");
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleString("en-IN", {
      year: "numeric", month: "numeric", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="p-2">
      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full table-fixed bg-white divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gray-100 z-10 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-2 py-2 w-[10%] text-left">Order ID</th>
                <th className="px-2 py-2 w-[15%] text-left">Customer</th>
                <th className="px-2 py-2 w-[20%] text-left">Meal</th>
                <th className="px-2 py-2 w-[10%] text-left">Plan</th>
                <th className="px-2 py-2 w-[10%] text-left">Price</th>
                <th className="px-2 py-2 w-[10%] text-left">Status</th>
                <th className="px-2 py-2 w-[15%] text-left">Order Time</th>
                <th className="px-2 py-2 w-[10%] text-left">Actions</th>
                <th className="px-2 py-2 w-[5%] text-left">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
              {pagedOrders.length > 0 ? (
                pagedOrders.map((order) => {
                  const item = order.items?.[0];
                  if (!item) return null;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-2 py-2">{order._id.slice(-6)}</td>
                      <td className="px-2 py-2">{order.userId?.username || "N/A"}</td>
                      <td className="px-2 py-2">
                        {item.name} ({item.mealType?.name || "N/A"})
                      </td>
                      <td className="px-2 py-2">
                        {item.selectedPlan?.name
                          ?  (`${item.selectedPlan.name} Day(s)`)
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2">
                        ₹{Number(order.totalPrice).toFixed(2)}
                      </td>
                      <td className={`px-2 py-2 ${getStatusStyle(order.status)}`}>
                        {capitalize(order.status)}
                      </td>

                      <td className="px-2 py-2">{formatDate(order.orderTime)}</td>
                      <td className="px-2 py-2">
                        <select
                          onChange={(e) => handleActionChange(e, order)}
                          defaultValue=""
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="" disabled>Select Action</option>
                          {availableStatuses.map((s) => (
                            <option key={s} value={s}>Set Status: {capitalize(s)}</option>
                          ))}
                          <option value="call">Call Customer</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => handleAlertClick(order)}
                          className="p-1 rounded-full hover:bg-gray-200"
                          title="More Info"
                        >
                          <FiAlertCircle className="h-5 w-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-3">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 border rounded-md text-sm ${page === 1 ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}
            >Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && p - arr[i - 1] > 1 && <span className="px-1 text-gray-400">…</span>}
                  <button
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1 rounded-md border text-sm ${p === page ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-100"}`}
                  >{p}</button>
                </React.Fragment>
              ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${page === totalPages ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}
            >Next</button>
          </div>
        )}
      </div>

    
      <Modal
        isOpen={!!selectedOrder}
        onClose={closeModal}
        selectedOrder={selectedOrder} 
      />
    </div>
  );
};