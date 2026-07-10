import React, { useState } from "react";
import Userchart from "./UserCharts"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import RevenueOverview from "./RevenueOverview";
import OrderAnalytics from "./OrderAnalytics";
import AdminUserTable from "./AdminUserTable";
import AdminDineinBookings from "./AdminDineinBookings";
import AdminTiffinOrders from "./AdminTiffinOrders";
import TakeawayOrders from "./TakeawayOrders";
// import UserManagement from "./UserManagement";

const AdminDashboardLayout = () => {
 
    

//   const topRestaurants = {
//     Tiffin: [
//       { restaurantName: "Daily Dabba", totalOrders: 110 },
//       { restaurantName: "Tiffin Express", totalOrders: 95 },
//       { restaurantName: "Healthy Meals", totalOrders: 90 },
//       { restaurantName: "Home Chef", totalOrders: 85 },
//       { restaurantName: "LunchBox Co.", totalOrders: 80 },
//     ],
//     Takeaway: [
//       { restaurantName: "Wrap & Roll", totalOrders: 145 },
//       { restaurantName: "Spice Kitchen", totalOrders: 140 },
//       { restaurantName: "Burger House", totalOrders: 130 },
//       { restaurantName: "Quick Bite", totalOrders: 120 },
//       { restaurantName: "Biryani Express", totalOrders: 115 },
//     ],
//     DineIn: [
//       { restaurantName: "Royal Feast", totalOrders: 170 },
//       { restaurantName: "Fine Dine", totalOrders: 160 },
//       { restaurantName: "Ocean View", totalOrders: 150 },
//       { restaurantName: "City Grill", totalOrders: 140 },
//       { restaurantName: "Heritage Kitchen", totalOrders: 135 },
//     ],
//   };

//   const timeRanges = ["Day", "Week", "Month"];
//   const types = ["Tiffin", "Takeaway", "DineIn"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <OrderAnalytics/>
      <Userchart />
      {/* <AdminUserTable/> */}
      {/* <TakeawayOrders/> */}
      {/* <AdminTiffinOrders/> */}
      {/* <AdminDineinBookings/> */}
      {/* <UserManagement/> */}

      {/* Time Range Buttons */}
      {/* <div className="flex gap-4 mb-4">
        {timeRanges.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-4 py-2 rounded ${
              selectedTime === time
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {time}
          </button>
        ))}
      </div> */}
      

      {/* Chart for Top 5 */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Top 5 Restaurants - {selectedType}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRestaurants[selectedType]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="restaurantName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalOrders" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer> */}
      {/* </div> */}
      <RevenueOverview/>
    </div>
  );
};

export default AdminDashboardLayout;
