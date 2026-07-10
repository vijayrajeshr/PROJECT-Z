import React, { useState } from "react";
import { forwardRef } from "react";
import { FaCheck, FaTimes, FaPhone } from "react-icons/fa";
import OrderPopup from "./OrderPopup";

const TakeawayOrders = forwardRef(
  ({ orders = [], onUpdateStatus, stats = {}, onAction }, ref) => {
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
        default:
          return "bg-yellow-100 text-yellow-800";
      }
    };

    const handleClose = () => {
      setSelectedOrder(null);
    };
    console.log(orders, "getting orders");
    const filteredOrders =
      filter === "all"
        ? orders
        : orders.filter((order) => order.status.toLowerCase() === filter);

    const statusOptions = ["pending", "preparing", "ready", "rejected"];

    return (
      <div className="p-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-gray-600">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div className="text-3xl font-bold mt-1">
                {key.includes("Revenue") ? `$${value}` : value}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 flex space-x-4">
          {["all", "pending", "notaccept", "rejected", "ready"].map(
            (status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded ${
                  filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
        <div
          ref={ref}
          className="bg-white rounded-lg shadow-sm overflow-y-scroll overflow-x-auto h-[80vh]"
        >
          <table className="w-full min-w-[768px] ">
            <thead>
              <tr className="border-b">
                {[
                  "Customer",
                  "Item",
                  "Status",
                  "Time",
                  "Total Price",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left py-4 px-6 font-medium text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 px-6">
                    <div className="font-medium space-y-1">
                      {order?.userId?.email}
                      <br />
                      {order?.userId?.username}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">
                        {order?.items[index]?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order?.items[index]?.firm?.restaurantInfo?.name}
                      </div>
                      {order?.items?.length > 0 && (
                        <button
                          className="text-blue-500 underline mt-1 text-sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Show More
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        order?.status
                      )}`}
                    >
                      {order?.status === "accept" ? "Pending" : order?.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(order?.orderTime).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6">
                    ${(order?.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    {order?.status === "notaccept" ||
                    order?.status === "Rejected" ? (
                      <>
                        <button
                          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300"
                          onClick={() => onAction(order?._id, "pending")}
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-300"
                          onClick={() => onAction(order?._id, "reject")}
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                        <a
                          href={`tel:`}
                          className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
                          title="Contact"
                        >
                          <FaPhone className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      order.status !== "user_cancel" && (
                        <select
                          value={order?.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              order?._id,
                              e.target.value,
                              "takeaway"
                            )
                          }
                          className="bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-4 text-center text-gray-500 italic">
              No order found.
            </div>
          )}
        </div>
        {/* Popup for "Show More" */}
        {selectedOrder && (
          <OrderPopup order={selectedOrder} onClose={handleClose} />
        )}
      </div>
    );
  }
);
export default TakeawayOrders;
