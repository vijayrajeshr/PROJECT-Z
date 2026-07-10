import React from "react";
import { outletData } from "../../data/RestaurentDasData/dummy";
// import { outletData } from "../data/dummy"; // Update the path as necessary

export default function OutletInfo() {
  return (
    <div className="p-4 space-y-6 relative">
      <h1 className="text-2xl font-bold text-gray-700">Outlet Info</h1>

      <div className="bg-white rounded shadow p-4 space-y-3 relative group transition-all">
        {/* <div className="hover:shadow-lg transition-shadow p-2 rounded">
          <span className="text-gray-500 text-sm">Name:</span>
          <span className="ml-2 text-gray-700 font-medium">
            {outletData.name}
          </span>
        </div> */}
        {/* <div className="hover:shadow-lg transition-shadow p-2 rounded">
          <span className="text-gray-500 text-sm">RES ID:</span>
          <span className="ml-2 text-gray-700 font-medium">
            {outletData.resId}
          </span>
        </div> */}
        {/* <div className="hover:shadow-lg transition-shadow p-2 rounded">
          <span className="text-gray-500 text-sm">Address:</span>
          <span className="ml-2 text-gray-700 font-medium">
            {outletData.address}
          </span>
        </div> */}
      </div>
      
    </div>
  );
}
