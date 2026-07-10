import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useUser } from "../../context/userContent.jsx"; // Import the useUser hook

export default function TopNav({ currentPage }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(0);

  // Get user data and loading state from UserContext
  const { user, loadingUser } = useUser();
  console.log(user);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Fetch notifications only if user data is loaded and user exists
    if (!loadingUser && user) {
        Axios.get(`${import.meta.env.VITE_SERVER_URL}/notify/admin`)
        .then((response) => {
          console.log("Notifications data:", response.data.data);
          if (Array.isArray(response.data.data)) {
            setCount(response.data?.data.length);
          } else {
            setCount(0);
          }
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loadingUser, user]); // Re-run effect when loadingUser or user changes

  const showTopNav =
    location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/log-in";

  if (!showTopNav) {
    return null;
  }

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userProfileData"); // Add this line
  navigate("/log-in");
};

  // Render loading state for TopNav itself
  if (loadingUser) {
    return (
      <div className="flex items-center justify-between bg-white text-gray-700 shadow-sm px-4 py-2 h-14 md:h-16 sticky top-0 z-20">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-lg md:text-xl font-semibold truncate">
            {currentPage || "Dashboard"}
          </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          Loading user data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white text-gray-700 shadow-sm px-4 py-2 h-14 md:h-16 sticky top-0 z-20">
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-lg md:text-xl font-semibold truncate">
            {currentPage || "Dashboard"}
          </h1>
        </div>
      </div>

      {/* <div className="hidden md:flex items-center justify-center flex-grow max-w-md lg:max-w-lg mx-4">
        <div className="relative w-full">
          <HiOutlineSearch
            size={18}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-3 py-1.5 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div> */}

      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        <button className="md:hidden p-1 text-gray-500 hover:text-gray-700">
          <HiOutlineSearch size={22} />
        </button>

        <div ref={notificationRef} className="relative">
          <button
            className="p-1 text-gray-500 hover:text-gray-700 relative"
            onClick={() => navigate("/dashboard/tiffins/notifications")}
            aria-label="Notifications"
          >
            <HiOutlineBell size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <button
            className="p-1 text-gray-500 hover:text-gray-700"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-label="User menu"
            aria-expanded={showProfileDropdown}
          >
            <HiOutlineUserCircle size={22} />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 w-56 p-3 mt-2 bg-white text-gray-800 border border-gray-200 shadow-lg rounded-md z-30">
              <div className="flex flex-col items-center">
                <p className="font-semibold text-sm">
                  {user?.username || "Guest User"}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {user?.email || "N/A"}
                </p>
                {/* Conditionally display role-specific data if it's available in the user object */}
                {user?.role?.includes('kitchenOwner') && user?.kitchenDetails && (
                  <p className="text-xs text-gray-600">
                    Kitchen: {user.kitchenDetails.name}
                  </p>
                )}
                {user?.roles?.includes('restaurantOwner') && user?.restaurantDetails && (
                  <p className="text-xs text-gray-600">
                    Restaurant: {user.restaurantDetails.name}
                  </p>
                )}
                {/* Add more conditions for other roles' specific data as needed */}

                <button
                  className="w-full mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                  onClick={handleLogout}
                >
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
