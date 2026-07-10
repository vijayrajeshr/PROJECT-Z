import { useState, useEffect } from "react";
import axios from "axios";

const DashboardStats = () => {
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [aov, setAOV] = useState(null);
  const [totalUsers, settotalUsers] = useState(null);
  const [viewTypes, setViewTypes] = useState({
    orders: "today",
    revenue: "today",
    users: "today",
    aov: "today",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const summaryRes = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin/order-summary`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        const aovRes = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin/average-order-value`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        const totalUsersRes = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin/user-summary`,
          {
            withCredentials: true,
          }
        );

        setData(summaryRes.data);
        console.log(summaryRes.data,aovRes.data,totalUsersRes.data)
        setAOV(aovRes.data);
        settotalUsers(totalUsersRes.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Added token to dependency array to re-fetch if token changes

  if (loading)
    return (
      <p className="flex justify-center items-center text-xl">Loading...</p>
    );

  if (error)
    return (
      <p className="flex justify-center items-xl text-red-500">
        Error: {error}
      </p>
    );

  if (!data || !aov || !totalUsers) {
    return (
      <p className="flex justify-center items-center text-xl">
        No data available.
      </p>
    );
  }

  const toggleView = (key) => {
    setViewTypes((prev) => ({
      ...prev,
      [key]:
        prev[key] === "today"
          ? "thisWeek"
          : prev[key] === "thisWeek"
          ? "thisMonth"
          : prev[key] === "thisMonth"
          ? "allTime"
          : "today",
    }));
  };

  const statsData = [
    {
      key: "orders",
      text: "text-sm",
      label: `Orders (${viewTypes?.orders})`,
      value: data[viewTypes?.orders]?.orders,
      bg: "bg-pink-600",
    },
    {
      key: "revenue",
      text: "text-sm",
      label: `Revenue (${viewTypes?.revenue})`,
      value: `$${data[viewTypes?.revenue]?.revenue.toFixed(2)}`,
      bg: "bg-blue-600",
    },
    {
      key: "users",
      text: "text-sm",
      label: "Total Users",
      value: `${totalUsers?.totalUsers}`,
      bg: "bg-green-600",
    },
    {
      key: "aov",
      text: "text-xs",
      label: `Average Order Value (${viewTypes?.aov})`,
      value: `$${aov[`${viewTypes?.aov}AOV`]?.toFixed(2)}`,
      bg: "bg-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 font-sans">
      {statsData.map((stat) => (
        <div
          key={stat.key}
          className={`flex items-center justify-between p-4 rounded-xl shadow-lg text-white ${stat.bg} transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex flex-col">
            <span className={`${stat.text} font-medium opacity-90 mb-1`}>
              {stat.label}
            </span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          {stat.key !== 'users' && (
            <button
              onClick={() => toggleView(stat.key)}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200"
              aria-label={`Toggle view for ${stat.label}`}
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5l-7 7 7 7M5 12h14"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
