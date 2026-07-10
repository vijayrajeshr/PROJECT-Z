import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  CartesianGrid,
} from "recharts";
import { LineChart as LineChartIcon, Utensils, ChevronRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardAnalytics() {
  const [activeTab, setActiveTab] = useState("daily");
  const [activeTabForMealType, setactiveTabForMealType] = useState("Today");
  const [orderData, setOrderData] = useState([]);
  const [mealTypeData, setMealTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchOrderAnalytics = async (timeframe) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/tiffin/order-analytics?timeframe=${timeframe}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOrderData(response.data);
    } catch (error) {
      console.error("Error fetching order analytics:", error);
      setError("Failed to load order analytics.");
      setOrderData([]);
    }
  };

  const fetchMealTypeAnalytics = async (timeframe) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/tiffin/mealtype-analytics?timeframe=${timeframe}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // Map the data to ensure category is a string (the name) for recharts
      const formattedData = response.data.map(item => ({
        ...item,
        category: item.category.name || "Unknown", // Ensure category is the name string
      }));
      setMealTypeData(formattedData);
    } catch (error) {
      console.error("Error fetching meal type analytics:", error);
      setError("Failed to load meal type analytics.");
      setMealTypeData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!token) {
        setLoading(false);
        setError("Authentication token not found. Please log in.");
        return;
      }
      await Promise.all([
        fetchOrderAnalytics(activeTab),
        fetchMealTypeAnalytics(activeTabForMealType),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [activeTab, activeTabForMealType, token]);

  const tabs = ["daily", "weekly", "monthly"];
  const axisKey = { daily: "date", weekly: "week", monthly: "month" };
  const mealTypesTabs = ["Today", "This Week", "This Month"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-50 text-red-700 rounded-xl p-6 border border-red-200">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 font-sans bg-gray-100 min-h-screen">
      <div className="md:w-1/2 w-full bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <LineChartIcon className="text-indigo-600 w-7 h-7" />
              Order Analytics
            </h2>
            <div className="relative group">
              <Info size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200" />
              <div className="absolute w-60 mt-2 top-full left-1/2 -translate-x-1/2 p-2 hidden group-hover:flex justify-center bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10 border border-gray-700 opacity-95">
                Dynamic order trends for selected timeframe
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard/tiffins/orders")} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center text-sm font-medium">
            View All <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">Track orders and total purchase trends over time.</p>

        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-2 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-grow w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={orderData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey={axisKey[activeTab]}
                tick={{ fontSize: 11, fill: '#555' }}
                tickLine={false}
                axisLine={{ stroke: "#ccc" }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#4287f5' }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={false}
                label={{
                  value: "Orders",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4287f5",
                  fontSize: 13,
                  fontWeight: 'bold'
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#82ca9d' }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={false}
                label={{
                  value: "Total Purchase ($)",
                  angle: 90,
                  position: "insideRight",
                  fill: "#82ca9d",
                  fontSize: 13,
                  fontWeight: 'bold'
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3', stroke: '#999' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  fontSize: '13px',
                  padding: '10px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '15px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#4287f5"
                strokeWidth={3}
                name="Orders"
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7, stroke: '#4287f5', strokeWidth: 3, fill: '#fff' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalPurchase"
                stroke="#82ca9d"
                strokeWidth={3}
                name="Total Purchase"
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7, stroke: '#82ca9d', strokeWidth: 3, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="md:w-1/2 w-full bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Utensils className="text-orange-600 w-7 h-7" />
              Meal Type Analytics
            </h2>
            <div className="relative group">
              <Info size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200" />
              <div className="absolute w-60 mt-2 top-full left-1/2 -translate-x-1/2 p-2 hidden group-hover:flex justify-center bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10 border border-gray-700 opacity-95">
                Breakdown of orders by meal type for selected timeframe
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard/tiffins/tiffin")} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center text-sm font-medium">
            View All <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">Understand popular meal categories.</p>

        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          {mealTypesTabs.map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-2 ${
                activeTabForMealType === tab
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
              onClick={() => setactiveTabForMealType(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-grow h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mealTypeData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#555' }} axisLine={{ stroke: "#ccc" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#555' }} axisLine={{ stroke: "#ccc" }} tickLine={false} />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} Orders`,
                  `Meal Type: ${props.payload.category}`, // `props.payload.category` is already the string name
                ]}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  fontSize: '13px',
                  padding: '10px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Bar dataKey="count" fill="#FFA726" name="Number of Orders" barSize={40} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
