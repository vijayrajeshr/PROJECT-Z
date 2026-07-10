import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineGift,
  HiOutlineCog,
  HiOutlineInformationCircle,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineBell,
  HiViewList,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdOutlineDining } from "react-icons/md";
import { dummyData } from "../../../data/dummy";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Popup from "../../../utils/Popup";
import { IoRestaurantSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { LuPartyPopper } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { GoShieldLock } from "react-icons/go";
import { PiSealPercentFill } from "react-icons/pi";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // State for user management dropdown
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false); // State for admin dashboard dropdown
  const navigate = useNavigate(); // Initialize the navigate function

  // Adjusted sidebar container classes
  const sidebarClasses = `
    flex flex-col border-r border-gray-800 bg-gray-900 text-white transition-all duration-300 ease-in-out overflow-hidden
  w-16 sm:w-20 md:w-48 lg:w-64
  min-w-[64px] md:min-w-[192px]
  `;

  // Top bar behind the “zomato” text: red accent
  const topBarClasses = `
    w-full py-4 px-4
    bg-red-600
    flex flex-col items-start
  `;

  // Adjusted restaurant dashboard line classes
  const restaurantDashClasses = `
    transition-all duration-300 ease-in-out overflow-hidden
    ${expanded ? "max-h-10 mt-1 opacity-100" : "max-h-0 mt-0 opacity-0"}
  `;

  // Adjusted bottom outlet info: slide/fade in/out
  const bottomInfoClasses = `
    border-t border-gray-800 text-sm leading-tight
    transition-all duration-300 ease-in-out overflow-hidden
    ${expanded ? "max-h-32 p-4 opacity-100" : "max-h-0 p-0 opacity-0"}
  `;

  // const { outletInfo } = dummyData;
  const handleHover = (text) => {
    setHovered(text);
  };

  // Nav items helper: icons + label fade
  function navItem(to, Icon, label, external = false) {
    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md text-gray-200 hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <Icon size={20} className="flex-shrink-0" />
            <span
              className={`whitespace-normal break-words
    transition-opacity duration-300 ease-in-out
    ${expanded ? "opacity-100 block" : "opacity-0 hidden"}
    overflow-hidden truncate`}
            >
              {label}
            </span>
          </div>
        </a>
      );
    }
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block rounded-md
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
              whitespace-normal break-words
    transition-opacity duration-300 ease-in-out
    ${expanded ? "opacity-100 block" : "opacity-0 hidden"}
    overflow-hidden
            `}
          >
            {label}
          </span>
        </div>
      </NavLink>
    );
  }

  const handleUserManagementClick = () => {
    setUserDropdownOpen(!userDropdownOpen); // Toggle dropdown
    navigate("/usermanagement"); // Navigate to /usermanagement page
  };

  const handleAdminDashboardClick = () => {
    setAdminDropdownOpen(!adminDropdownOpen); // Toggle dropdown for Admin Dashboard
  };

  const Tab = ({ text, to, icon }) => {
    return (
      <>
        <li
          onMouseOver={() => handleHover(text)}
          onMouseOut={() => handleHover("")}
          className="relative"
        >
          {navItem(to, icon, text)}
          {!expanded && <Popup hovered={hovered} text={text} />}
        </li>
      </>
    );
  };

  return (
    <div className={sidebarClasses}>
      {/* Top bar with brand + toggle, using bg-red-600 */}
      <div className={topBarClasses}>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-white focus:outline-none  transition-all self-end duration-200 ${expanded ? "self-end" : "self-start"
            }`}
        >
          {expanded ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
        <div className="flex items-center justify-between w-full">
          <div className="font-bold text-2xl">
            <Link to={"/"}>{expanded ? "zomato" : "z"}</Link>
          </div>
        </div>
        <div
          className="text-sm font-medium mt-1 flex items-center gap-2 px-3 py-2 cursor-pointer"
          onClick={handleAdminDashboardClick}
        >
          <div
            className={`whitespace-nowrap
              transition-all duration-300 ease-in-out
              ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}
              overflow-hidden`}
          >
            Admin Dashboard
          </div>
          <span
            className={`transition-transform duration-300 ${adminDropdownOpen ? "rotate-90" : ""
              }`}
          >
            {expanded ? <IoMdArrowDropdown className="w-5 h-5" /> : ""}
          </span>
        </div>
      </div>
      {/* Dropdown Icon */}
      {adminDropdownOpen && (
        <div className="h-full bg-gray-900 border border-gray-700 rounded-md   mt-1">
          <ul className="ml-0 space-y-1 p-2 ">
            <li className="p-2 m-1 flex gap-4 cursor-pointer" onClick={handleAdminDashboardClick}> <IoMdArrowRoundBack className="text-white h-5 w-5" />Back To Home</li>
            <li>
              {navItem(
                "https://super-piroshki-0e56df.netlify.app/",
                HiOutlineUserGroup,
                "Marketing Dashboard",
                true
              )}
            </li>
            <li>
              {navItem(
                "https://stellar-lolly-15c5c4.netlify.app/",
                HiOutlineUserGroup,
                "Event Dashboard",
                true
              )}
            </li>
            <li>
              {navItem(
                "https://deft-entremet-2b5784.netlify.app/",
                HiOutlineTruck,
                "Moderator Dashboard",
                true
              )}
            </li>
            <li>
              {navItem(
                "/dashboard/restaurants/home/1", // Updated to correct route
                MdOutlineRestaurantMenu,
                "Restaurant Dashboard",
                true
              )}
            </li>
          </ul>
        </div>
      )}



      {/* Navigation links (dark theme) */}
      {!adminDropdownOpen &&
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <Tab
              text="Dashboard"
              to="/dashboard/admins/home"
              icon={HiOutlineHome}
            />
            <Tab
              text="Restaurants"
              to="/dashboard/admins/action-center"
              icon={MdOutlineRestaurantMenu}
            />
            <Tab
              text="Tiffins"
              to="/dashboard/admins/tiffins"
              icon={MdOutlineRestaurantMenu}
            />

            {/* User Management Dropdown */}

            <Tab
              text="Upload"
              to={"/dashboard/admins/register"}
              icon={FiUpload}
            />
            <Tab
              text="Access Control"
              to="/dashboard/admins/control"
              icon={GoShieldLock}
            />

            <Tab
              text="Order Management"
              to="/dashboard/admins/orders"
              icon={HiOutlineTruck}
            />
            <Tab
              text="Event Management"
              to="/dashboard/admins/event"
              icon={HiOutlineInformationCircle}
            />
            <Tab text="Support" to="/dashboard/admins/help" icon={HiOutlineGift} />
            <Tab
              text="Faq's"
              to="/dashboard/admins/faqs"
              icon={HiOutlineQuestionMarkCircle}
            />
            <Tab
              text="Offers"
              to="/dashboard/admins/offers"
              icon={HiOutlineGift}
            />
           {/*<Tab
              text="Taxes and Charges"
              to="/dashboard/admins/taxes"
              icon={HiOutlineGift}
            />*/}
            <Tab
              text="Claim Restaurant"
              to="/dashboard/admins/claim-restaurant"
              icon={HiOutlineInformationCircle}
            />
            <Tab
              text="Collection Management"
              to="/dashboard/admins/collection-management"
              icon={HiOutlineInformationCircle}
            />
            <Tab
              text="Settings"
              to="/dashboard/admins/settings"
              icon={HiOutlineCog}
            />
            <Tab
              text="History Logs"
              to="/dashboard/admins/historylogs"
              icon={HiOutlineQuestionMarkCircle}
            />
          </ul>
        </nav>}

      {/* Bottom outlet info (slide/fade) */}
    </div>
  );
}