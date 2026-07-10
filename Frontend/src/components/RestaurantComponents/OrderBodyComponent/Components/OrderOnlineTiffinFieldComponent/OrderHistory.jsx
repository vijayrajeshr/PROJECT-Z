import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaRegClock } from "react-icons/fa6";
// import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order

  const userEmail = "gamiyash15@gmail.com";

  // useEffect(() => {
  //     const fetchOrders = async () => {
  //         try {
  //             const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/getOrdersforHistory/${userEmail}`);
  //             setOrders(Array.isArray(response.data) ? response.data : [response.data]);
  //         } catch (err) {
  //             setError('Error fetching orders');
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchOrders();
  // }, [userEmail]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/getOrdersforHistory/${userEmail}`,
          { withCredentials: true }
        );

        const mainOrders = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const sortedMainOrders = mainOrders.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        const sortedSubOrders = sortedMainOrders[0]?.orders?.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setOrders(sortedSubOrders || []);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

const formatDate = (dateStr) => {
    // Add a check for invalid date strings
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "new order":
        return "status-new";
      default:
        return "status-processing";
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId)); // Toggle state
  };

return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex  items-start">
      <div className="w-full   rounded-xl  p-6 sm:p-8 lg:p-10 my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-teal-700 mb-8 tracking-tight">
          Your Order History
        </h1>

        {loading && (
          <div className="text-center py-10 text-gray-600 text-lg">
            <p>Loading your orders...</p>
            <p className="text-sm mt-2">Hang tight, we're fetching your history!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-lg">
            <p>{error}</p>
            <p className="text-sm mt-1">Please refresh the page or try again later.</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl font-semibold mb-3">No orders found!</p>
            <p className="text-md">It looks like you haven't placed any orders yet.</p>
            <p className="text-md mt-1">Time to explore our delicious tiffin options!</p>
            {/* You could add a button to navigate to the menu here */}
            {/* <button className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300">
              Browse Tiffins
            </button> */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer
                ${expandedOrderId === order.id ? "ring-2 ring-teal-500 shadow-lg" : ""}`}
              onClick={() => toggleExpand(order.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Order #<span className="text-teal-600 font-bold">{order.id}</span>
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(order.status)}`}
                  >
                    {order.status?.toLowerCase() === "delivered" ? (
                      <FaCheck size={12} className="inline mr-1" />
                    ) : (
                      <FaRegClock size={12} className="inline mr-1" />
                    )}
                    {order.status}
                  </span>
                </div>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{order.mealType}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tiffin Provider:</span> {order.tiffinName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Provider Address:</span> {order.tiffinAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {order.quantity}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    Total: <span className="text-teal-600">${order?.total}</span>
                  </span>
                  <button className="text-teal-600 hover:text-teal-800 text-sm font-semibold">
                    {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="p-5 border-t border-gray-200 bg-gray-50 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="col-span-1">
                      <p className="font-semibold text-gray-600">Delivery Distance:</p>
                      <p>{order.distance || "N/A"}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="font-semibold text-gray-600">Delivery Address:</p>
                      <p>{order.address || "N/A"}</p>
                    </div>

                    {order.flexiblePlan && (
                      <>
                        <div className="col-span-1">
                          <p className="font-semibold text-gray-600">Plan Type:</p>
                          <p className="capitalize">{order.flexiblePlan.type}</p>
                        </div>
                        {order.flexiblePlan.type === "normal" && (
                          <div className="col-span-1">
                            <p className="font-semibold text-gray-600">Subscription Start:</p>
                            <p>{formatDate(order.startDate)}</p>
                          </div>
                        )}
                        {order.flexiblePlan.type === "date-range" && (
                          <div className="col-span-1">
                            <p className="font-semibold text-gray-600">Plan Period:</p>
                            <p>
                              {formatDate(order.flexiblePlan.startDate)} -{" "}
                              {formatDate(order.flexiblePlan.endDate)}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {order.flexiblePlan?.type === "flexi-dates" &&
                    order.flexiblePlan?.flexiDates && (
                      <div className="mt-4">
                        <p className="font-semibold text-gray-600 mb-2">Selected Delivery Dates:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.flexiblePlan.flexiDates.map((date, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap"
                            >
                              {formatDate(date)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {order.subStatus && order.subStatus.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-gray-700 mb-3">Daily Delivery Status:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                        {order.subStatus.map((statusEntry, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-gray-500">{formatDate(statusEntry.date)}:</span>
                            <span
                              className={`font-semibold capitalize
                                ${statusEntry.status === "Delivered" ? "text-green-600" : ""}
                                ${statusEntry.status === "Not Delivered" ? "text-red-600" : ""}
                              `}
                            >
                              {statusEntry.status || "Pending"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

