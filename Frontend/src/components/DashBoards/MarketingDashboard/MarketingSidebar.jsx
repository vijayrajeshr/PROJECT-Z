import React, { useState } from "react";
import { NavLink ,useNavigate} from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineGift,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { MdCampaign, MdHotelClass } from "react-icons/md";
import { IoShareSocial } from "react-icons/io5";


import { outletData } from "../../../data/dummy"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const navigate=useNavigate();
  // Main container: dark gray background, white text, smooth width transitions
  const sidebarClasses = `
    ${expanded ? "w-64" : "w-20"}
    flex flex-col
    border-r border-gray-800
    bg-gray-900
    text-white
    transition-all duration-300 ease-in-out overflow-hidden
  `;

  // Top bar behind the “zomato” text: red accent
  const topBarClasses = `
    w-full py-4 px-4
    bg-red-600
    flex flex-col items-start
  `;

  // “Restaurant dashboard” line fade/slide
  const restaurantDashClasses = `
    transition-all duration-300 ease-in-out overflow-hidden
    ${expanded ? "max-h-10 mt-1 opacity-100" : "max-h-0 mt-0 opacity-0"}
  `;

  // Bottom outlet info: slide/fade in/out
  const bottomInfoClasses = `
    border-t border-gray-800 text-sm leading-tight
    transition-all duration-300 ease-in-out overflow-hidden
    ${expanded ? "max-h-32 p-4 opacity-100" : "max-h-0 p-0 opacity-0"}
  `;

  // Nav items helper: icons + label fade
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
      {/* Top bar with brand + toggle, using bg-red-600 */}
      <div className={topBarClasses}>
        <div className="flex items-center justify-between w-full">
          <div className="font-bold text-2xl" onClick={()=>navigate("/")}>{expanded ? "zomato" : "z"}</div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-white focus:outline-none ml-2"
          >
            {expanded ? "<" : ">"}
          </button>
        </div>
        <div className={restaurantDashClasses}>
          <div className="text-sm font-medium">Marketing dashboard</div>
        </div>
      </div>

      {/* Navigation links (dark theme) */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>{navItem("/dashboard/marketing/home", HiOutlineHome, "Dashboard")}</li>
          <li>{navItem("/dashboard/marketing/campaign-management", MdCampaign, "Campaign Management")}</li>
          <li>{navItem("/dashboard/marketing/collection-management", MdHotelClass, "Collection Management")}</li>
          <li>{navItem("/dashboard/marketing/email-templates", IoShareSocial, "Email Templates")}</li>
          <li>{navItem("/dashboard/marketing/RestaurantOffers", HiOutlineGift, "Restaurant Offers")}</li>

          {/* <li>
            {navItem("/dashboard/marketing/profile-management", HiOutlineCog, "Profile Management")}
          </li> */}
          <li>{navItem("/dashboard/marketing/help", HiOutlineQuestionMarkCircle, "Help")}</li>
          {/* <li>{navItem("/dashboard/marketing/support", HiOutlineQuestionMarkCircle, "Support")}</li> */}
        </ul>
      </nav>

      {/* Bottom outlet info (slide/fade) */}
      <div className={bottomInfoClasses}>
        <div className="font-semibold">{outletData.name || "Loading..."}</div>
        <div>{outletData.resId ? `RES ID : ${outletData.resId}` : ""}</div>
        <div>{outletData.address}</div>
      </div>
    </div>
  );
}
