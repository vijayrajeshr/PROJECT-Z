import React, { useState, useEffect } from "react";
import { BellRing, ChevronRight } from "lucide-react";
import moment from "moment";
import axios from "axios";

const TodayOrdersSummary = () => {
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = moment().local().startOf("day");
  const token = localStorage.getItem('token');

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setLoading(false);
        setError("Authentication token not found. Please log in.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/tiffin/email`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = Array.isArray(response.data.orders) ? response.data.orders : [];
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders summary. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [token]);

  const isTodayInRange = (itemStartDate, itemEndDate) =>
    today.isBetween(
      moment(itemStartDate).local().startOf('day'),
      moment(itemEndDate).local().endOf('day'),
      null,
      "[]"
    );

  const getFilteredOrdersByStatus = (status) =>
    orders.filter((order) => {
      if (!order || order.status !== status) {
        return false;
      }
      return order.items.some(item => {
        if (item.itemType === "tiffin" && item.startDate && item.endDate) {
          return isTodayInRange(item.startDate, item.endDate);
        }
        return false;
      });
    });

  const processingOrders = getFilteredOrdersByStatus("accept");
  const pendingOrders = getFilteredOrdersByStatus("notaccept");

  const mealTypeCounts = (ordersList) => {
    const counts = {};
    ordersList.forEach(order => {
      order.items.forEach(item => {
        if (item.itemType === "tiffin" && item.mealType && item.startDate && item.endDate) {
          if (isTodayInRange(item.startDate, item.endDate)) {
            // Use item.mealType.name as the key
            const mealTypeName = item.mealType.name;
            const quantity = item.quantity || 0;
            counts[mealTypeName] = (counts[mealTypeName] || 0) + quantity;
          }
        }
      });
    });
    return counts;
  };

  const processingMealCounts = mealTypeCounts(processingOrders);
  const pendingMealCounts = mealTypeCounts(pendingOrders);

  if (loading) {
    return (
      <div className="md:w-1/2 w-full max-h-[50vh] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-base text-gray-600">Loading summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-h-[50vh] flex items-center justify-center bg-red-50 rounded-xl border border-red-200 p-4">
        <p className="text-base text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-h-[85vh] overflow-y-auto p-4 bg-white rounded-xl border border-gray-200 flex flex-col">
      <div className="flex flex-row items-center justify-between pb-4 border-b border-gray-200 mb-4">
        <div className="text-2xl font-semibold text-gray-800">
          Today's Orders Summary
        </div>
        {pendingOrders.length > 0 && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors duration-200"
            onClick={() => setShowPendingOrders(!showPendingOrders)}
          >
            <BellRing className="w-4 h-4" />
            <span>{pendingOrders.length} Pending</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showPendingOrders ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      <div className="flex-grow space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Meals to Prepare & Deliver Today ({processingOrders.length} Orders)
          </h3>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3">
            {Object.entries(processingMealCounts).length > 0 ? (
              Object.entries(processingMealCounts).map(([mealTypeName, count]) => (
                <div
                  key={mealTypeName} // Now using the string name as the key
                  className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <span className="text-lg font-bold text-indigo-700">{count}</span>
                  <span className="text-sm text-gray-600">{mealTypeName}</span> {/* Displaying the meal type name directly */}
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-4">No accepted orders for today.</p>
            )}
          </div>
        </div>

        {showPendingOrders && pendingOrders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-3">
              Not Accepted Orders for Today ({pendingOrders.length} total)
            </h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3">
              {Object.entries(pendingMealCounts).length > 0 ? (
                Object.entries(pendingMealCounts).map(([mealTypeName, count]) => (
                  <div
                    key={mealTypeName} // Now using the string name as the key
                    className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-lg font-bold text-yellow-700">{count}</span>
                    <span className="text-sm text-gray-600">{mealTypeName}</span> {/* Displaying the meal type name directly */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-4">No pending orders for today.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayOrdersSummary;
