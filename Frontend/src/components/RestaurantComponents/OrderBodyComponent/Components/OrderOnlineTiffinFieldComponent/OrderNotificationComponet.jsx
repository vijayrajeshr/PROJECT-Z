import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaTimes, FaChevronRight } from "react-icons/fa";
import "./OrderNotificationBar.css";

const OrderNotificationBar = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const userEmail = "gamiyash15@gmail.com"; // Replace with actual user email or get from context

  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/getOrdersforHistory/${userEmail}`,
          { withCredentials: true }
        );
        const orders = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const pendingOrders = orders.filter(
          (order) => order?.status?.toLowerCase() === "new order"
        );
        setNewOrders(pendingOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    // Initial fetch
    fetchNewOrders();

    // Set up polling every 3 minutes
    const interval = setInterval(fetchNewOrders, 300000);

    return () => clearInterval(interval);
  }, [userEmail]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleClick = () => {
    navigate("/History");
  };

  if (!isVisible || newOrders.length === 0) return null;

  return (
    <div className="order-notification-bar" onClick={handleClick}>
      <div className="notification-content">
        <div className="icon-container">
          <FaBox className="order-icon" />
          {newOrders.length > 1 && (
            <span className="order-count">{newOrders.length}</span>
          )}
        </div>
        <div className="notification-text">
          <span className="primary-text">
            {newOrders.length === 1
              ? "Your order is being processed"
              : `${newOrders.length} orders are being processed`}
          </span>
          <span className="secondary-text">Click to view details</span>
        </div>
        <div className="action-buttons">
          <FaChevronRight className="chevron-icon" />
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationBar;
