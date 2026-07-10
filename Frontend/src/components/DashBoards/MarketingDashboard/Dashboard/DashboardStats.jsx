import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, PiggyBank, BadgePercent, TrendingUp, Handshake, BarChart2, Gift, Send, RefreshCw, Smile, Wallet, Percent, Activity } from 'lucide-react';
import UserRegistrationsByChannel from './UserRegistrationsByChannel';

// This is a React application for the marketing dashboard UI that fetches data
// from the provided backend API.
// It assumes a live server is running and accessible at the specified endpoint.

// Helper function to format dates for the chart axes
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// A reusable component for the metric cards
const StatCard = ({ title, value, icon, trend, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg text-white transform transition-transform hover:scale-105 duration-300 ${color}`}>
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <span className="text-3xl font-bold mt-1 flex items-center">
          {value}
          {trend === 'up' && <TrendingUp className="ml-2 text-green-300 h-5 w-5" />}
          {trend === 'down' && <TrendingUp className="ml-2 rotate-180 text-red-300 h-5 w-5" />}
        </span>
      </div>
      {icon}
    </div>
  </div>
);

// Component for the chart header
const ChartHeader = ({ title, description }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h1 className="text-lg font-bold text-gray-700 flex items-center gap-2">
        <BarChart2 className="text-blue-500 h-5 w-5" />
        {title}
      </h1>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// Component for the timeframe tab buttons
const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${isActive ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ordersTimeframe, setOrdersTimeframe] = useState("Today");
  const [ordersData, setOrdersData] = useState([]);
  const ordersTimeTabs = ["Today", "This Week", "This Month"];

  // Mock offers data to populate the select dropdown for the Orders Analytics chart.
  // In a real application, you would fetch this from another API endpoint.
  const offers = [
    { id: 'offer1', name: "Holiday Discount" },
    { id: 'offer2', name: "New User Special" },
    { id: 'offer3', name: "Weekend Combo" },
  ];

  // Function to generate dynamic orders data for the chart, which is not coming from the backend endpoint
  const generateOrdersData = (timeframe) => {
    const categories = ["Starters", "Main Course", "Combos", "Desserts"];
    const multiplier = {
      "Today": 1,
      "This Week": 7,
      "This Month": 30
    }[timeframe];

    return categories.map(category => ({
      category,
      count: Math.floor(Math.random() * 500 * multiplier) + 100
    }));
  };

  useEffect(() => {
    setOrdersData(generateOrdersData(ordersTimeframe));
  }, [ordersTimeframe]);


  const [selectedOutlet, setSelectedOutlet] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // The endpoint from your provided Node.js code
        const response = await fetch(`/api/dashboard-data?outletId=${selectedOutlet}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError("Failed to load dashboard data. Please check if your server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedOutlet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
        <div className="text-2xl font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500">
        <div className="text-2xl font-semibold">{error}</div>
      </div>
    );
  }

  // Define chart styles
  const chartStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fill: '#4b5563',
  };

  const dashboardStats = [
    { title: "Total Banners", value: data.totalBanners, icon: <LayoutDashboard size={32} />, trend: null, color: "bg-blue-600" },
    { title: "Total Clicks", value: data.totalBannerClicks, icon: <Handshake size={32} />, trend: 'up', color: "bg-purple-600" },
    { title: "Total Offers", value: data.totalRestaurantOffers + data.totalTiffinOffers, icon: <BadgePercent size={32} />, trend: null, color: "bg-green-600" },
    { title: "Total Users", value: data.totalUsers, icon: <Users size={32} />, trend: 'up', color: "bg-indigo-600" },
    { title: "New Users Today", value: data.totalUsersToday, icon: <Users size={32} />, trend: 'up', color: "bg-teal-600" },
    { title: "Conversion Rate", value: `${data.conversionRate}%`, icon: <BarChart2 size={32} />, trend: 'up', color: "bg-orange-600" },
    { title: "GMV (Total Sales)", value: `₹${(data.gmv || 0).toLocaleString()}`, icon: <PiggyBank size={32} />, trend: 'up', color: "bg-rose-600" },
    { title: "Net Revenue", value: `₹${(data.netRevenue || 0).toLocaleString()}`, icon: <Wallet size={32} />, trend: 'up', color: "bg-green-700" },
    { title: "Commission Est.", value: `₹${(data.commission || 0).toLocaleString()}`, icon: <Percent size={32} />, trend: 'up', color: "bg-purple-700" },
    { title: "AOV", value: `₹${(data.aov || 0).toLocaleString()}`, icon: <Activity size={32} />, trend: null, color: "bg-orange-500" },
    { title: "Time to First Order", value: `${data.timeToFirstOrder || 0} hrs`, icon: <TrendingUp size={32} />, trend: null, color: "bg-cyan-600" },
    { title: "First Order Rate", value: `${data.firstOrderRate || 0}%`, icon: <BadgePercent size={32} />, trend: 'up', color: "bg-emerald-600" },
    { title: "Pending Orders", value: data.pendingOrdersCount || 0, icon: <LayoutDashboard size={32} />, trend: null, color: "bg-amber-600" },
    { title: "Repeat Order Rate", value: `${data.repeatOrderRate || 0}%`, icon: <TrendingUp size={32} />, trend: 'up', color: "bg-fuchsia-600" },
    { title: "MAU (30 Days)", value: data.mau || 0, icon: <Users size={32} />, trend: 'up', color: "bg-lime-600" },
    { title: "Referral Orders", value: data.referralOrders || 0, icon: <Gift size={32} />, trend: 'up', color: "bg-pink-600" },
    { title: "Invites Sent", value: data.invitesSent || 0, icon: <Send size={32} />, trend: 'up', color: "bg-sky-600" },
    { title: "Invite Conversion", value: `${data.inviteConversionRate || 0}%`, icon: <RefreshCw size={32} />, trend: 'up', color: "bg-violet-600" },
    { title: "NPS Score", value: data.npsScore || 0, icon: <Smile size={32} />, trend: 'up', color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800  font-sans">
      <div className="container mx-auto max-w-7xl">

        {/* Header with Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Marketing Dashboard</h1>
          <div className="flex items-center gap-4">
            <label htmlFor="outletFilter" className="font-semibold text-gray-700">Filter Outlet:</label>
            <select
              id="outletFilter"
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Outlets</option>
              {data.outlets && data.outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>{outlet.name} ({outlet.type})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Orders Analytics Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-[1.01] duration-300">
            <ChartHeader
              title="Orders Analytics"
              description="Orders Overview during Active Offers"
            />
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {ordersTimeTabs.map((tab) => (
                  <TabButton
                    key={tab}
                    label={tab}
                    isActive={ordersTimeframe === tab}
                    onClick={() => setOrdersTimeframe(tab)}
                  />
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="offer" className="text-base font-bold text-gray-700">Offer:</label>
                <select id="offer" className="p-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="All">All</option>
                  {offers.map((offer, offerIndex) => (
                    <option key={offerIndex} value={offer.name}>{offer.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" style={chartStyles} />
                <YAxis style={chartStyles} />
                <Tooltip />
                <Bar dataKey="count" fill="#009999" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* This Week's Revenue */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-[1.01] duration-300">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Revenue This Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.weeklyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatDate} style={chartStyles} />
                <YAxis style={chartStyles} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* This Month's Revenue */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-[1.01] duration-300">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Revenue This Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatDate} style={chartStyles} />
                <YAxis style={chartStyles} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* This Week's New Users */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-[1.01] duration-300">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-700">New Users This Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.weeklyUserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tickFormatter={formatDate} style={chartStyles} />
                <YAxis style={chartStyles} />
                <Tooltip />
                <Bar dataKey="users" fill="#facc15" name="New Users" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <UserRegistrationsByChannel />
        </div>
      </div>
    </div>
  );
};

export default App;
