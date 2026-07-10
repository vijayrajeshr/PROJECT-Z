import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import axios from 'axios';

const RevenueDashboard = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    revenueByType: { tiffinRevenue: 0, firmRevenue: 0 },
    dailyRevenue: [],
    monthlyRevenue: [],
  });

  useEffect(() => {
    const fetchAllRevenue = async () => {
      try {
        const [summaryRes, typeRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/revenue/summary`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/revenue/type`)
        ]);

        setSummary({
          totalRevenue: summaryRes.data.totalRevenue || 0,
          revenueByType: typeRes.data.data,
          dailyRevenue: summaryRes.data.dailyRevenue || [],
          monthlyRevenue: summaryRes.data.monthlyRevenue || [],
        });
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    };

    fetchAllRevenue();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md space-y-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700">Revenue Dashboard</h1>

      {/* Total Revenue */}
      <div className="text-center">
        <p className="text-xl font-semibold text-green-600">
          Total Revenue: ₹{summary.totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* Revenue by Type */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-green-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Tiffin Revenue</h3>
          <p className="text-green-600 font-bold text-xl">
            ₹{summary.revenueByType.tiffinRevenue?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Takeaway Revenue</h3>
          <p className="text-blue-600 font-bold text-xl">
            ₹{summary.revenueByType.firmRevenue?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      {/* Daily Revenue Line Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summary.dailyRevenue.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString()
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalAmount" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={summary.monthlyRevenue.map(item => ({
              ...item,
              label: `${item.month}/${item.year}`
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalAmount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueDashboard;
