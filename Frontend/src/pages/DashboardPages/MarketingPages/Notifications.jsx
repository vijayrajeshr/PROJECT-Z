

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextData } from "../../../context/OutletContext";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { axiosApi } = useContextData();
  const [activeCategory, setActiveCategory] = useState("Restaurants");
  const [showAll, setShowAll] = useState(true);
  const [readFilter, setReadFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const categories = [
    "Restaurant",
    "Customer",
    "Marketing",
    "Chat",
    "Tiffin",
    "dining",
    "Moderator",
  ];

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosApi.get(`${import.meta.env.VITE_SERVER_URL}/notify/admin`);
      const data = Array.isArray(response.data) ? response.data : response.data?.data;
      setNotifications(data || []);
      console.log(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const handleClear = async () => {
    try {
      await axiosApi.delete(`${import.meta.env.VITE_SERVER_URL}/notify/category/${activeCategory}`);
      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.metadata.category !== activeCategory
        )
      );
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      // await axiosApi.put(`http://localhost:3000/notify/${id}`, {
      await axiosApi.put(`${import.meta.env.VITE_SERVER_URL}/notify/${id}`, {
        metadata: { isViewed: true },
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                metadata: { ...notification.metadata, isViewed: true },
              }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosApi.delete(`${import.meta.env.VITE_SERVER_URL}/notify/${id}`);
      setNotifications((prev) => prev.filter((notification) => notification._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter(
        (notification) =>
          notification.metadata.category === activeCategory &&
          (readFilter === "All" ||
            (readFilter === "Read" && notification.metadata.isViewed) ||
            (readFilter === "Unread" && !notification.metadata.isViewed))
      )
    : [];

  const limitedNotifications = showAll
    ? filteredNotifications
    : filteredNotifications.slice(0, 2);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 px-4 py-2 rounded text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Read">Read</option>
            <option value="Unread">Unread</option>
          </select>
          <button
            className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
            onClick={handleClear}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex">
        {categories.map((category) => {
          const categoryCount = notifications.filter(
            (n) => n.metadata.category === category
          ).length;
          return (
            <div
              key={category}
              className={`relative cursor-pointer px-4 py-6 ${
                activeCategory === category
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => {
                setActiveCategory(category);
                setShowAll(false);
              }}
            >
              {categoryCount > 0 && (
                <span className="absolute top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {categoryCount}
                </span>
              )}
              
              {category}
            </div>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="mt-4">
        {limitedNotifications.length > 0 ? (
          <>
            {limitedNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border rounded mb-2 ${
                  notification.metadata.isViewed
                    ? "bg-gray-100"
                    : "bg-white border-blue-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    {notification.level}
                  </h2>
                  <p
                    className={`px-2 py-1 rounded text-sm cursor-pointer ${
                      notification.metadata.isViewed
                        ? "bg-gray-200 text-gray-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    {notification.metadata.isViewed ? "Read" : "Mark as Read"}
                  </p>
                </div>
                <p>{notification.message}</p>
                <span className="text-gray-500 text-sm">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
            {filteredNotifications.length > 2 && (
              <button
                className="mt-4 text-blue-500 underline"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No notifications for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
