import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTiffinOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getOrders`);
        setOrders(res.data.orders); 
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Tiffin Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow-md bg-white">
              <h3 className="text-xl font-bold">{order.customer}</h3>

              
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone?.fullNumber || "N/A"}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Tiffin Name:</strong> {order.tiffinName}</p>
              <p><strong>Meal Type:</strong> {order.mealType}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Start Date:</strong> {new Date(order.startDate).toDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTiffinOrders;
