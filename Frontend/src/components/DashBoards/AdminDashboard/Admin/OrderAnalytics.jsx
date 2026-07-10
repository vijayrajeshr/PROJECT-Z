import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUtensils, FaBoxOpen, FaChair } from "react-icons/fa";

const TIME_RANGES = ["Day", "Week", "Month"];

const TYPES = [
  { name: "Tiffin", icon: <FaUtensils size={24} className="text-indigo-600" /> },
  { name: "Takeaway", icon: <FaBoxOpen size={24} className="text-green-600" /> },
  { name: "DineIn", icon: <FaChair size={24} className="text-yellow-500" /> },
];

const OrderAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [selectedRange, setSelectedRange] = useState("Day");
  const [selectedType, setSelectedType] = useState("Tiffin");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/order-summary`);
        const data = res.data || {};

        const parsed = {
          Day: { Tiffin: 0, Takeaway: 0, DineIn: 0, ...(data.Day || {}) },
          Week: { Tiffin: 0, Takeaway: 0, DineIn: 0, ...(data.Week || {}) },
          Month: { Tiffin: 0, Takeaway: 0, DineIn: 0, ...(data.Month || {}) },
        };

        setAnalytics(parsed);
      } catch (err) {
        console.error("Failed to fetch order summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const chartData = useMemo(() => {
    const rangeData = analytics?.[selectedRange] || {};
    const total = TYPES.reduce((sum, { name }) => sum + (rangeData[name] || 0), 0);

    return TYPES.map(({ name }) => {
      const count = rangeData[name] || 0;
      const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
      return {
        name,
        orders: count,
        percent,
      };
    });
  }, [analytics, selectedRange]);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-6">Order Analytics</h2>


      <div className="flex gap-4 mb-6">
        {TIME_RANGES.map((label) => (
          <button
            key={label}
            onClick={() => setSelectedRange(label)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              selectedRange === label
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {TYPES.map(({ name, icon }) => {
          const data = chartData.find((d) => d.name === name);
          return (
            <div
              key={name}
              onClick={() => setSelectedType(name)}
              className={`cursor-pointer rounded-2xl p-5 flex items-center gap-4 shadow-md border-2 transition-all ${
                selectedType === name
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-transparent bg-white hover:bg-gray-50"
              }`}
            >
              <div className="p-3 rounded-full bg-gray-100">{icon}</div>
              <div>
                <h3 className="text-md font-semibold text-gray-700">{name}</h3>
                <p className="text-xl font-bold text-indigo-600">{data?.orders ?? 0}</p>
                <p className="text-sm text-gray-500">{data?.percent}% of total</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Orders – {selectedRange}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderAnalytics;
