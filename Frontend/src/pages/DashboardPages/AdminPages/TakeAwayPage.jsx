

// // import React, { useState } from "react";
// // import { FaCheck, FaTimes, FaPhone } from "react-icons/fa";
// // import OrderPopup from "./OrderPopup";
// // const TakeawayOrders = ({ orders = [], onUpdateStatus, onAction }) => {
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [filter, setFilter] = useState("all");

// //   const getStatusStyle = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case "preparing":
// //         return "bg-gray-600 text-white";
// //       case "ready":
// //         return "bg-green-500 text-white";
// //       case "rejected":
// //         return "bg-red-500 text-white";
// //       case "pending":
// //       default:
// //         return "bg-yellow-100 text-yellow-800";
// //     }
// //   };

// //   const handleClose = () => {
// //     setSelectedOrder(null);
// //   };
// //   const filteredOrders =
// //   filter === "all"
// //     ? orders
// //     : orders.filter((order) => order.status.toLowerCase() === filter);
// //   const statusOptions = ["pending", "preparing", "ready", "rejected"];

// //   return (
// //     <div className="p-1">
// //       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //        {Object.entries(stats).map(([key, value]) => (
// //           <div key={key} className="bg-white rounded-lg p-6 shadow-sm">
// //             <div className="text-gray-600">{key.replace(/([A-Z])/g, " $1").trim()}</div>
// //             <div className="text-3xl font-bold mt-1">{value}</div>
// //           </div>
// //         ))}
// //       </div> */}
// //        <div className="mb-4 flex space-x-4">
// //         {["all", "pending", "notaccept", "rejected", "ready"].map((status) => (
// //           <button
// //             key={status}
// //             className={`px-4 py-2 rounded ${
// //               filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
// //             }`}
// //             onClick={() => setFilter(status)}
// //           >
// //             {status.charAt(0).toUpperCase() + status.slice(1)}
// //           </button>
// //         ))}
// //       </div>
// //       <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
// //         <table className="w-full min-w-[768px]">
// //           <thead>
// //             <tr className="border-b">
// //               {["Customer", "Item", "Status", "Time", "Total Price", "Action"].map(
// //                 (header) => (
// //                   <th key={header} className="text-left py-4 px-6 font-medium text-gray-600">
// //                     {header}
// //                   </th>
// //                 )
// //               )}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredOrders?.map((order) => (
// //               <tr key={order?._id} className="border-b">
// //                 <td className="py-4 px-6">
// //                   <div className="font-medium space-y-1">
// //                     {order.userId?.email}
// //                     <br />
// //                     {order.userId?.username}
// //                   </div>
// //                 </td>
// //                 <td className="py-4 px-6">
// //                   <div>
// //                     <div className="font-medium">{order.items[0]?.productId.name}</div>
// //                     <div className="text-sm text-gray-500">
// //                       {order.items[0]?.restaurantName?.restaurantInfo.name}
// //                     </div>
// //                     {order.items.length > 1 && (
// //                       <button
// //                         className="text-blue-500 underline mt-1 text-sm"
// //                         onClick={() => setSelectedOrder(order)}
// //                       >
// //                         Show More
// //                       </button>
// //                     )}
// //                   </div>
// //                 </td>
// //                 <td className="py-4 px-6">
// //                   <span
// //                     className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
// //                       order.status
// //                     )}`}
// //                   >
// //                     {order.status === "accept" ? "Pending" : order.status}
// //                   </span>
// //                 </td>
// //                 <td className="py-4 px-6">
// //                   {new Date(order.orderTime).toLocaleString("en-US", {
// //                     hour: "2-digit",
// //                     minute: "2-digit",
// //                     second: "2-digit",
// //                     month: "short",
// //                     day: "numeric",
// //                     year: "numeric",
// //                   })}
// //                 </td>
// //                 <td className="py-4 px-6">${(order.totalPrice - order.discount).toFixed(2)}</td>
// //                 <td className="py-4 px-6 flex space-x-2">
// //                   {order.status === "notaccept" || order.status === "Rejected" ? (
// //                     <>
// //                       <button
// //                         className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300"
// //                         onClick={() => onAction(order._id, "accept")}
// //                       >
// //                         <FaCheck className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-300"
// //                         onClick={() => onAction(order._id, "reject")}
// //                       >
// //                         <FaTimes className="w-4 h-4" />
// //                       </button>
// //                       <a
// //                         href={`tel:`}
// //                         className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
// //                         title="Contact"
// //                       >
// //                         <FaPhone className="w-4 h-4" />
// //                       </a>
// //                     </>
// //                   ) : (
// //                     <select
// //                       value={order.status}
// //                       onChange={(e) =>
// //                         onUpdateStatus(order._id, e.target.value, "takeaway")
// //                       }
// //                       className="bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     >
// //                       {statusOptions.map((status) => (
// //                         <option key={status} value={status}>
// //                           {status.charAt(0).toUpperCase() + status.slice(1)}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Popup for "Show More" */}
// //       {selectedOrder && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           {/* <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
// //             <button
// //               className="absolute top-2 right-2 text-gray-500 hover:text-black"
// //               onClick={() => setSelectedOrder(null)}
// //             >
// //               &times;
// //             </button>
// //             <h2 className="text-xl font-semibold mb-4">Order Details</h2>
// //             <ul>
// //               {selectedOrder.items.map((item) => (
// //                 <li key={item._id} className="mb-2">
// //                   <div className="font-medium">{item.productId.name}</div>
// //                   <div className="text-sm text-gray-500">
// //                     {item.restaurantName.restaurantInfo.name}
// //                   </div>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div> */}
// //            <OrderPopup order={selectedOrder} onClose={handleClose} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TakeawayOrders;

// import React, { useState } from "react";
// import { FaCheck, FaTimes, FaPhone } from "react-icons/fa";
// import OrderPopup from "./OrderPopup";

// const TakeawayOrders = ({ orders = [], onUpdateStatus, onAction }) => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filter, setFilter] = useState("all");

//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case "preparing":
//         return "bg-gray-600 text-white";
//       case "ready":
//         return "bg-green-500 text-white";
//       case "rejected":
//         return "bg-red-500 text-white";
//       case "pending":
//       case "notaccept": // Added notaccept here to apply specific styling if desired, otherwise it falls to default.
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   const handleClose = () => {
//     setSelectedOrder(null);
//   };

//   const filteredOrders =
//     filter === "all"
//       ? orders
//       : orders.filter((order) => {
//           // Special handling for 'notaccept' filter button
//           if (filter === "notaccept") {
//             return order.status.toLowerCase() === "notaccept";
//           }
//           return order.status.toLowerCase() === filter;
//         });

//   const statusOptions = ["pending", "preparing", "ready", "rejected"];

//   return (
//     <div className="p-1">
//       <div className="mb-4 flex space-x-4">
//         {["all", "pending", "notaccept", "rejected", "ready"].map((status) => (
//           <button
//             key={status}
//             className={`px-4 py-2 rounded ${
//               filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setFilter(status)}
//           >
//             {status.charAt(0).toUpperCase() + status.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full min-w-[768px]">
//           <thead>
//             <tr className="border-b">
//               {["Customer", "Item", "Status", "Time", "Total Price", "Action"].map(
//                 (header) => (
//                   <th key={header} className="text-left py-4 px-6 font-medium text-gray-600">
//                     {header}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders?.map((order) => (
//               <tr key={order?._id} className="border-b">
//                 <td className="py-4 px-6">
//                   <div className="font-medium space-y-1">
//                     {order.userId?.email}
//                     <br />
//                     {order.userId?.username}
//                   </div>
//                 </td>
//                 <td className="py-4 px-6">
//                   <div>
//                     {/* Adjusted to use item.name directly */}
//                     <div className="font-medium">{order.items[0]?.name}</div>
//                     <div className="text-sm text-gray-500">
//                       {/* Adjusted to use sourceEntityId.restaurantInfo.name */}
//                       {order.items[0]?.sourceEntityId?.restaurantInfo.name}
//                     </div>
//                     {order.items.length > 1 && (
//                       <button
//                         className="text-blue-500 underline mt-1 text-sm"
//                         onClick={() => setSelectedOrder(order)}
//                       >
//                         Show More
//                       </button>
//                     )}
//                   </div>
//                 </td>
//                 <td className="py-4 px-6">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
//                       order.status
//                     )}`}
//                   >
//                     {/* The status 'accept' in your component is displayed as 'Pending'.
//                         Your data shows 'notaccept'. Adjusting this display logic if needed. */}
//                     {order.status === "accept" ? "Pending" : order.status}
//                   </span>
//                 </td>
//                 <td className="py-4 px-6">
//                   {new Date(order.orderTime).toLocaleString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     month: "short",
//                     day: "numeric",
//                     year: "numeric",
//                   })}
//                 </td>
//                 <td className="py-4 px-6">${(order.totalPrice - order.discount).toFixed(2)}</td>
//                 <td className="py-4 px-6 flex space-x-2">
//                   {order.status === "notaccept" || order.status === "Rejected" ? (
//                     <>
//                       <button
//                         className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300"
//                         onClick={() => onAction(order._id, "accept")}
//                       >
//                         <FaCheck className="w-4 h-4" />
//                       </button>
//                       <button
//                         className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-300"
//                         onClick={() => onAction(order._id, "reject")}
//                       >
//                         <FaTimes className="w-4 h-4" />
//                       </button>
//                       {/* Assuming userId.phone exists for the contact.
//                           You need to ensure order.userId?.phone is available in your data for this to work. */}
//                       <a
//                         href={`tel:${order.userId?.phone || ''}`}
//                         className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
//                         title="Contact"
//                       >
//                         <FaPhone className="w-4 h-4" />
//                       </a>
//                     </>
//                   ) : (
//                     <select
//                       value={order.status}
//                       onChange={(e) =>
//                         onUpdateStatus(order._id, e.target.value, "takeaway")
//                       }
//                       className="bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <OrderPopup order={selectedOrder} onClose={handleClose} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TakeawayOrders;
import React, { useState } from "react";
import { FaCheck, FaTimes, FaPhone } from "react-icons/fa";
import OrderPopup from "./OrderPopup";

const TakeawayOrders = ({ orders = [], onUpdateStatus, onAction }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "preparing":
        return "bg-gray-600 text-white";
      case "ready":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
      case "notaccept":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) =>
          filter === "notaccept"
            ? order.status.toLowerCase() === "notaccept"
            : order.status.toLowerCase() === filter
        );

  const statusOptions = ["pending", "preparing", "ready", "rejected"];

  return (
    <div className="p-1">
      <div className="mb-4 flex space-x-4">
        {["all", "pending", "notaccept", "rejected", "ready"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[768px]">
          <thead>
            <tr className="border-b">
              {["Customer", "Item", "Status", "Time", "Total Price", "Action", "Details"].map(
                (header) => (
                  <th
                    key={header}
                    className="text-left py-4 px-6 font-medium text-gray-600"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order) => (
              <tr key={order?._id} className="border-b">
                <td className="py-4 px-6">
                  <div className="font-medium space-y-1">
                    {order.userId?.email}
                    <br />
                    {order.userId?.username}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium">{order.items[0]?.name}</div>
                    <div className="text-sm text-gray-500">
                      {order.items[0]?.sourceEntityId?.restaurantInfo?.name || "N/A"}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status === "accept" ? "Pending" : order.status}
                  </span>
                </td>

                <td className="py-4 px-6">
                  {new Date(order.orderTime).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                <td className="py-4 px-6">
                  ₹{(order.totalPrice - order.discount).toFixed(2)}
                </td>

                <td className="py-4 px-6 flex space-x-2">
                  {order.status === "notaccept" || order.status === "Rejected" ? (
                    <>
                      <button
                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => onAction(order._id, "accept")}
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => onAction(order._id, "reject")}
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                      <a
                        href={`tel:${order.userId?.phone || ""}`}
                        className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                        title="Contact"
                      >
                        <FaPhone className="w-4 h-4" />
                      </a>
                    </>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateStatus(order._id, e.target.value, "takeaway")
                      }
                      className="bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                <td className="py-4 px-6">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-500 underline text-sm hover:text-blue-700"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OrderPopup order={selectedOrder} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default TakeawayOrders;