import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { Users, PieChart as PieIcon, Activity } from "lucide-react"; // lucide-react icons

const COLORS = ["#4f46e5", "#10b981", "#eab308", "#ef4444", "#8b5cf6"];

const fillMissingMonths = (data, startMonth, endMonth) => {
  const result = [];
  const map = new Map(data.map(({ _id, count }) => [_id, count]));
  const start = new Date(`${startMonth}-01`);
  const end = new Date(`${endMonth}-01`);
  const cur = new Date(start);
  while (cur <= end) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
    result.push({
      month: cur.toLocaleString("default", { month: "short" }),
      users: map.get(key) || 0,
    });
    cur.setMonth(cur.getMonth() + 1);
  }
  return result;
};

const isoToWeekday = iso => new Date(iso).toLocaleDateString("en-GB", { weekday: "short" });

const UserCharts = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [userVendorData, setUserVendorData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const monthRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/user-count`, {
          params: { groupBy: "monthly", start: `${year}-01-01`, end: `${year}-12-31` },
        });
        setMonthlyData(fillMissingMonths(monthRes.data, `${year}-01`, `${year}-12`));

        const dayRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/user-count/daily`, {
          params: { days: 7 },
        });
        setDailyData(dayRes.data.map(({ date, count }) => ({
          day: isoToWeekday(date),
          users: count,
        })));

        const uvRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/user-vendor-summary`);
        setUserVendorData(uvRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };
    fetchStats();
  }, [year]);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-5 rounded-2xl shadow col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-indigo-600" />
            <h2 className="text-xl font-semibold">Monthly User Growth – {year}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-yellow-500" />
            <h2 className="text-xl font-semibold">Users vs Vendors</h2>
          </div>
          <ResponsiveContainer width="115%" height={300}>
            <PieChart>
              <Pie
                data={userVendorData}
                cx="50%" cy="50%" outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {userVendorData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={30} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

  
      <div className="bg-white p-5 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-green-500" />
          <h2 className="text-xl font-semibold">Daily New Users (Last 7 Days)</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserCharts;
