import React, { useState, useRef, useEffect } from "react";
import DiningReservations from "./DiningReservations";
import TakeawayOrders from "./TakeawayOrders";
import OrderHistory from "./OrderHistory";
import Axios from "axios";
import { useParams } from "react-router-dom";

const OrderManag = () => {
  const [activeTab, setActiveTab] = useState("dining");
  const { id } = useParams();
  const [orderHistory, setOrderHistory] = useState({
    dining: [],
    takeaway: [],
  });
  const [dining, setDining] = useState([]);
  const [takeaway, setTakeAway] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    dining: { totalReservations: 0, pendingReservations: 0, totalGuests: 0 },
    takeaway: { totalOrders: 0, pendingOrders: 0, totalItems: 0 },
  });
  const [diningCursor, setDiningCursor] = useState(null);
  const [takeawayCursor, setTakeawayCursor] = useState(null);
  const [historyCursor, setHistoryCursor] = useState({
    dining: null,
    takeaway: null,
  });
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchBookingsData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/history/dining-booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            cursor: diningCursor,
            limit: 10,
          },
        }
      );
      const { data, nextCursor, stats: diningStats } = response.data;
      setDining((prev) => (diningCursor ? [...prev, ...data] : data));
      setDiningCursor(nextCursor);
      setStats((prev) => ({ ...prev, dining: diningStats }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch dining data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTakeawayOrders = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/history/ordertakeaway/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            cursor: takeawayCursor,
            limit: 10,
          },
        }
      );
      const { data, nextCursor, stats: takeawayStats } = response.data;
      setTakeAway((prev) => (takeawayCursor ? [...prev, ...data] : data));
      setTakeawayCursor(nextCursor);
      setStats((prev) => ({ ...prev, takeaway: takeawayStats }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch takeaway orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiningHistory = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/history/dining-booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            cursor: historyCursor.dining,
            limit: 10,
          },
        }
      );
      const {
        data: diningData,
        nextCursor: diningNextCursor,
        stats: diningStats,
      } = response.data;
      setOrderHistory((prev) => ({
        ...prev,
        dining: historyCursor.dining
          ? [...prev.dining, ...diningData]
          : diningData,
      }));
      setHistoryCursor((prev) => ({
        ...prev,
        dining: diningNextCursor,
      }));
      setStats((prev) => ({ ...prev, dining: diningStats }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch dining history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTakeawayHistory = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await Axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/history/ordertakeaway/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            cursor: historyCursor.takeaway,
            limit: 10,
          },
        }
      );
      const {
        data: takeawayData,
        nextCursor: takeawayNextCursor,
        stats: takeawayStats,
      } = response.data;
      setOrderHistory((prev) => ({
        ...prev,
        takeaway: historyCursor.takeaway
          ? [...prev.takeaway, ...takeawayData]
          : takeawayData,
      }));
      setHistoryCursor((prev) => ({
        ...prev,
        takeaway: takeawayNextCursor,
      }));
      setStats((prev) => ({ ...prev, takeaway: takeawayStats }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch takeaway history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dining") {
      fetchBookingsData();
    } else if (activeTab === "takeaway") {
      fetchTakeawayOrders();
    } else if (activeTab === "history") {
      // Fetch both dining and takeaway history when the history tab is active
      fetchDiningHistory();
      fetchTakeawayHistory();
    }
  }, [activeTab, update, id]);

  const updateOrderStatus = (orderId, newStatus, type) => {
    if (type === "dining") {
      setDining((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setOrderHistory((prev) => ({
        ...prev,
        dining: prev.dining.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
      Axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      )
        .then(() => setUpdate((prev) => !prev))
        .catch((error) => console.error(error));
    } else if (type === "takeaway") {
      setTakeAway((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setOrderHistory((prev) => ({
        ...prev,
        takeaway: prev.takeaway.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
      Axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/res/order/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      )
        .then(() => setUpdate((prev) => !prev))
        .catch((error) => console.error(error));
    }
  };

  const onAction = (orderId, action) => {
    const newStatus = action === "pending" ? "pending" : "rejected";
    setTakeAway((orders) =>
      orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setOrderHistory((prev) => ({
      ...prev,
      takeaway: prev.takeaway.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ),
    }));
    Axios.put(
      `${import.meta.env.VITE_SERVER_URL}/api/res/order/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    )
      .then(() => setUpdate((prev) => !prev))
      .catch((error) => console.error(error));
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const div = scrollRef.current;
      if (
        div &&
        div.scrollTop + div.clientHeight >= div.scrollHeight - 100 &&
        !loading
      ) {
        if (activeTab === "dining") {
          fetchBookingsData();
        } else if (activeTab === "takeaway") {
          fetchTakeawayOrders();
        } else if (activeTab === "history") {
          fetchDiningHistory();
          fetchTakeawayHistory();
        }
      }
    };

    const div = scrollRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeTab, diningCursor, takeawayCursor, historyCursor, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <div className="flex gap-4">
              {["dining", "takeaway", "history"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "dining" && (
          <DiningReservations
            ref={scrollRef}
            stats={stats.dining}
            reservations={dining}
            onUpdateStatus={updateOrderStatus}
          />
        )}
        {activeTab === "takeaway" && (
          <TakeawayOrders
            ref={scrollRef}
            stats={stats.takeaway}
            orders={takeaway}
            onUpdateStatus={updateOrderStatus}
            onAction={onAction}
          />
        )}
        {activeTab === "history" && (
          <OrderHistory
            orderHistoryTakeaway={orderHistory.takeaway}
            orderHistoryDining={orderHistory.dining}
            stats={stats}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManag;
