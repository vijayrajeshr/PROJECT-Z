import React, { useState, useRef } from "react";
import { outletData } from "../../../data/dummy"; // Update the path as necessary
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineUserCircle,
} from "react-icons/hi";
import {Link} from "react-router-dom"
export default function TopNav() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotificationsDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-gray-100 text-gray-600 shadow px-6 py-4 z-10">
      <div className="relative w-1/3">
        <HiOutlineSearch size={20} className="absolute top-2 left-2" />
        <input
          type="text"
          placeholder="Search here"
          className="pl-10 pr-3 py-2 w-full rounded border border-gray-300 focus:outline-none focus:border-blue-300"
        />
      </div>

      <div className="flex items-center gap-4">
        <div ref={notificationRef} className="relative">
          <Link to="/dashboard/marketing/notification">
          <HiOutlineBell
            size={24}
            className="cursor-pointer hover:text-blue-500"
            
          />
          </Link>
          
          
        </div>

        <div ref={profileRef} className="relative">
          <HiOutlineUserCircle
            size={24}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="absolute right-0 w-64 p-3 mt-2 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-lg">
              <div className="flex flex-col items-center space-x-3 mb-3">
                <img
                  src={outletData.image || "path/to/default-profile-image.jpg"} // Assume image URL in outletInfo
                  alt="Profile"
                  className="w-20 h-20 rounded-full mb-2"
                />
                <div>
                  <p className="font-semibold">{outletData.name}</p>
                  <p className="text-sm">
                    Contact Number: {outletData.contact}
                  </p>{" "}
                  {/* Assuming contact field */}
                  <p className="text-sm">
                    Opening Hours: {outletData.openingHours}
                  </p>{" "}
                  {/* Assuming openingHours field */}
                </div>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
