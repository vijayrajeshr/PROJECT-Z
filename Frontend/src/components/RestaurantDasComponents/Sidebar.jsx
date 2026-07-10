import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineGift,
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { FiPackage } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineDining, MdWarning } from "react-icons/md";

import { useUser } from "../../context/userContent";
import { useParams } from "react-router-dom";
export default function Sidebar({ selectedOutlet }) {
  const [expanded, setExpanded] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const { user } = useUser();

  let { id } = useParams();
  if (selectedOutlet) {
    id = selectedOutlet?._id;
  }

  const navigate = useNavigate();

  useEffect(() => {
    setRestaurant(selectedOutlet);
  }, [selectedOutlet]);

  useEffect(() => {
    const fetchRestaurantByOwnerName = async () => {
      if (!user?.email || !id) return;

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/claim-rest/restaurants/single-firm/${user.email}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        // ✅ parse response
        const data = await response.json();
        console.log(data, "getting the data");

        if (!response.ok) {
          throw new Error(data.message || "Restaurant not found");
        }

        if (data.data?.restaurantStatus === "Approved") {
          setRestaurant(data.data);
          setError("");
        } else {
          setRestaurant(null);
          setError("Restaurant not approved yet");
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error.message);
        setRestaurant(null);
        setError("Restaurant not found");
      }
    };

    fetchRestaurantByOwnerName();
  }, [id, user?.email]); // <- include user.email here

  const sidebarClasses = `
    ${expanded ? "w-64" : "w-20"}
    flex flex-col
    border-r border-gray-800
    bg-gray-900
    text-white
    transition-all duration-300 ease-in-out overflow-hidden
  `;

  const topBarClasses = `
    w-full py-4 px-4
    bg-red-600
    flex flex-col items-start
  `;

  const restaurantDashClasses = `
    transition-all duration-300 ease-in-out overflow-hidden
    ${expanded ? "max-h-10 mt-1 opacity-100" : "max-h-0 mt-0 opacity-0"}
  `;

  function navItem(to, Icon, label) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `
            block rounded-md
            ${isActive ? "bg-gray-700 font-semibold" : "font-medium"}
            hover:bg-gray-700
            text-gray-200
            transition-colors duration-200
          `
        }
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <Icon size={20} className="flex-shrink-0" />
          <span
            className={`
              whitespace-nowrap
              transition-all duration-300 ease-in-out
              ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}
              overflow-hidden
            `}
          >
            {label}
          </span>
        </div>
      </NavLink>
    );
  }

  return (
    <div className={sidebarClasses}>
      <div className={topBarClasses}>
        <div className="flex items-center justify-between w-full">
          <div className="font-bold text-2xl">{expanded ? "WYF" : "z"}</div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-white focus:outline-none ml-2"
          >
            {expanded ? "<" : ">"}
          </button>
        </div>
        <div className={restaurantDashClasses}>
          <div className="text-sm font-medium">Restaurant dashboard</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>
            {navItem(
              `/dashboard/restaurants/home/${id}`,
              HiOutlineHome,
              "Dashboard"
            )}
          </li>
          <li>
            {navItem(`/delivery-menu/${id}`, HiOutlineTruck, "Takeaway Menu")}
          </li>
          <li>
            {navItem(`/dine-in-menu/${id}`, MdOutlineDining, "Dine-In Menu")}
          </li>
          <li>
            {navItem(
              `/taxes-charges/${id}`,
              HiOutlineCurrencyDollar,
              "Taxes & Charges"
            )}
          </li>
          <li>
            {navItem(`/restaurant-offers/${id}`, HiOutlineGift, "Offers")}
          </li>
          {/* <li>
            {navItem(`/OperatingHours/${id}`, IoMdTime, "Operating Hours")}
          </li> */}
          <li>{navItem(`/OrderManag/${id}`, FiPackage, "Order Management")}</li>
          <li>
            {navItem(
              `/Restaurant-Reviews/${id}`,
              AiFillStar,
              "Restaurant Reviews"
            )}
          </li>
          <li>
            {navItem(
              `/outlet-info/${id}`,
              HiOutlineInformationCircle,
              "Outlet Info"
            )}
          </li>
          <li>
            {navItem(`/support/${id}`, HiOutlineQuestionMarkCircle, "Support")}
          </li>
          <li>{navItem(`/help/${id}`, HiOutlineQuestionMarkCircle, "Help")}</li>
        </ul>
      </nav>

      <div className="p-4 bg-gray-800">
        {restaurant ? (
          <div>
            <div className="font-semibold">
              {restaurant.restaurantInfo.name}
            </div>
            <div>
              {restaurant?.registrationNumber
                ? `RES ID : ${restaurant?.registrationNumber}`
                : `RES ID : ${restaurant._id}`}
            </div>
            <div>{restaurant.restaurantInfo.address}</div>
          </div>
        ) : (
          <div className="text-red-500 flex items-center gap-2">
            <MdWarning size={20} /> {error || "Loading..."}
          </div>
        )}
        <button
          className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          onClick={() => navigate(`/outlet-settings/${id}`)}
          disabled={!restaurant}
        >
          Outlet Management
        </button>
      </div>
    </div>
  );
}
