import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TakeawayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/takeaway-order`);
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders || orders.length === 0) return <p>No takeaway orders found.</p>;


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Takeaway Orders</h2>
      {orders.map((order, index) => (
        <div key={order._id} className="bg-white shadow rounded-lg p-4 mb-4 border">
          <h3 className="text-lg font-semibold">Order #{index + 1}</h3>
          <p><strong>User:</strong> {order.userId?.username} ({order.userId?.email})</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          
          <div className="mt-2">
            <strong>Items:</strong>
            <ul className="list-disc list-inside">
              {order.items.map((item, i) => (
                <li key={i}>
                  <div className="flex items-center gap-2">
                    <img src={item.img || item.productId?.img} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                      <p>From: {item.sourceEntityId?.restaurantInfo?.name || item.sourceEntityId?.kitchenName}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TakeawayOrders;
