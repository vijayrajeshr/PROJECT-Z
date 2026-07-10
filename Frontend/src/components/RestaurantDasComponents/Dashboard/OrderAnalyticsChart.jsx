

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OrderAnalyticsChart({
  timePeriod,
  onTimePeriodChange,
  data,
}) {
  const getTabStyle = (tab) => {
    return tab === timePeriod
      ? "px-3 py-1 bg-white rounded-md shadow-sm text-indigo-600 font-medium"
      : "px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-md";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Order Analytics</h2>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            className={getTabStyle("daily")}
            onClick={() => onTimePeriodChange("daily")}
          >
            Daily
          </button>
          <button
            className={getTabStyle("weekly")}
            onClick={() => onTimePeriodChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={getTabStyle("monthly")}
            onClick={() => onTimePeriodChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={getTabStyle("yearly")}
            onClick={() => onTimePeriodChange("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data[timePeriod]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              name="Total Orders"
              stroke="#4F46E5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}