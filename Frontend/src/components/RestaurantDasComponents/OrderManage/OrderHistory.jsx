import React, { useState, useEffect } from "react";
import { FaShoppingBag, FaUtensils, FaFilter, FaSearch } from "react-icons/fa";

const OrderHistory = ({
  orderHistoryTakeaway = [],
  orderHistoryDining = [],
}) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderMode, setOrderMode] = useState("all");

  // Determine orders based on selected mode
  const orders =
    orderMode === "dining"
      ? [...orderHistoryDining]
      : orderMode === "takeaway"
      ? [...orderHistoryTakeaway]
      : [...orderHistoryDining, ...orderHistoryTakeaway];

  // Filter orders based on status
  const filteredByStatus = orders.filter((order) => {
    if (filter === "all") return true;
    return order?.status?.toLowerCase() === filter.toLowerCase();
  });

  // Filter orders based on search query
  const filteredOrders = filteredByStatus.filter(
    (order) =>
      (order?.username || order?.userId?.username || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order?._id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics based on all orders
  const allOrders = [...orderHistoryDining, ...orderHistoryTakeaway];
  const stats = {
    totalOrders: allOrders.length,
    diningOrders: orderHistoryDining.length,
    takeawayOrders: orderHistoryTakeaway.length,
    totalRevenue: Number(
      allOrders
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
        .toFixed(2)
    ),
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "ready":
      case "accepted":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "rejected":
      case "notaccept":
        return "bg-red-100 text-red-800";
      case "pending":
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Define table headers, always including "Mode"
  const tableHeaders = [
    "Order ID",
    "Customer",
    "Mode",
    "Status",
    "Order Date",
    "Total",
  ];

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-gray-600">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
            <div className="text-3xl font-bold mt-1">
              {key === "totalRevenue" ? `$${value}` : value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Order Mode Buttons */}
          <div className="flex space-x-2">
            {["all", "dining", "takeaway"].map((mode) => (
              <button
                key={mode}
                onClick={() => setOrderMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  orderMode === mode
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mode === "dining" && <FaUtensils className="mr-2" />}
                {mode === "takeaway" && <FaShoppingBag className="mr-2" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <FaFilter className="mr-2 text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {/* <option value="pending">Pending</option> */}
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center flex-1 max-w-md relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overscroll-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full min-w-[768px] ">
          <thead>
            <tr className="border-b">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="text-left py-4 px-6 font-medium text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">
                    {order?._id || "N/A"}
                  </td>
                  <td className="py-4 px-6">
                    {order?.username || order?.userId?.username || "Unknown"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ["Lunch", "Dinner", "Snacks"].includes(order?.meal)
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {["Lunch", "Dinner", "Snacks"].includes(order?.meal)
                        ? "Dining"
                        : "Takeaway"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order?.status || "Unknown"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(
                      order?.date || order?.orderTime || Date.now()
                    ).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="py-4 px-6">
                    {order?.totalPrice ? `$${order.totalPrice}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="py-4 px-6 text-center text-gray-500 italic"
                >
                  No orders found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
