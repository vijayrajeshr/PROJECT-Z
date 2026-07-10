import React, { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import moment from "moment";

const AutoRejectedOrdersAlert = ({ onOrderSelect, socket }) => {
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isAlertopen, setisAlertopen] = useState(true);

  useEffect(() => {
    fetchRejectedOrders();

    if (socket) {
      socket.on("ordersRestored", (updatedOrders) => {
        setRejectedOrders((prev) =>
          prev.filter(
            (order) => !updatedOrders.find((uo) => uo._id === order._id)
          )
        );
        setSelectedOrders([]);
      });
    }

    return () => {
      if (socket) {
        socket.off("ordersRestored");
      }
    };
  }, [socket]);

  const fetchRejectedOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/auto-rejected-orders`,
        { withCredentials: true }
      );
      setRejectedOrders(response.data);
    } catch (error) {
      console.error("Error fetching auto-rejected orders:", error);
    }
  };

  const handleRestoreOrders = async () => {
    if (selectedOrders.length === 0) return;

    setIsRestoring(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/restore-rejected-orders`,
        {
          orderIds: selectedOrders,
        },
        { withCredentials: true }
      );

      // Close dropdown after successful restoration
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error restoring orders:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  const closeAlert = () => {
    setIsDropdownOpen(false);
    setisAlertopen(!isAlertopen);
  };

  const handleRestoreAll = async () => {
    setSelectedOrders(rejectedOrders.map((order) => order._id));
    await handleRestoreOrders();
  };

  if (rejectedOrders.length === 0) return null;

  return (
    <div className={`relative ${isAlertopen ? "mb-4" : "mb-0"}`}>
      {isAlertopen && (
        <div className="flex justify-between items-center">
          <div className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors flex items-center gap-2 px-1">
            <FiAlertTriangle className="h-3 w-3  text-red-600" />

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-red-800 flex justify-between items-center text-xs gap-2"
            >
              <span>
                {rejectedOrders.length} orders were auto-rejected after
                exceeding the 2-day limit
              </span>
            </div>
            <MdOutlineCancel
              onClick={closeAlert}
              size={14}
              className="text-red-600 cursor-pointer"
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreAll();
              }}
              className="px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LuRefreshCw className="h-3 w-3" />
              Restore All
            </button>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="max-h-64 overflow-y-auto">
            {rejectedOrders.map((order) => {
              const isSelected = selectedOrders.includes(order._id);
              const startDate =
                order.flexiblePlan.type === "flexi-dates"
                  ? order.flexiblePlan.flexiDates[0]
                  : order.startDate;

              return (
                <div
                  key={order._id}
                  className="p-3 hover:bg-red-50 border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedOrders((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== order._id)
                              : [...prev, order._id]
                          );
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          onOrderSelect(order);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-600">
                          Start Date: {moment(startDate).format("DD MMM YYYY")}{" "}
                          • Plan: {order.flexiblePlan.type} • Total:{" "}
                          {order.total}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrders([order._id]);
                        handleRestoreOrders();
                      }}
                      disabled={isRestoring}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedOrders.length > 0 && (
            <div className="p-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={handleRestoreOrders}
                disabled={isRestoring}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
              >
                <LuRefreshCw className="h-4 w-4" />
                Restore Selected ({selectedOrders.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoRejectedOrdersAlert;
