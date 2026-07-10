// frontend/src/pages/Dashboard.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-60 bg-white p-4 shadow-md">
        <ul className="space-y-2">
          <li>
            <Link to="/categories" className="block p-2 hover:bg-gray-200">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/items" className="block p-2 hover:bg-gray-200">
              Items
            </Link>
          </li>
          <li>
            <Link to="/services" className="block p-2 hover:bg-gray-200">
              Services
            </Link>
          </li>
          <li>
            <Link to="/dashboard/restaurants/home/1" className="block p-2 hover:bg-gray-200">
              Restaurant Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
