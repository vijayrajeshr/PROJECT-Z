import React from "react";
import { Outlet, useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/DashBoards/AdminDashboard/AdminSidebar";
import TifffinSidebar from "../components/DashBoards/TiffinDashboard/TifffinSidebar";
import TopNav from "../components/DashBoards/TopNav";
import MarketingSidebar from "../components/DashBoards/MarketingDashboard/MarketingSidebar";

export default function DashboardLayout() {
  const location = useLocation();

  const pageTitles = {
    "/dashboard/admins/home": "Dashboard",
    "/dashboard/admins/orders": "Orders",
    "/dashboard/admins/notifications": "Notifications",
    "/dashboard/admins/support": "Support",
    "/dashboard/admins/help": "Support",
    "/dashboard/admins/faqs": "FAQs",
    "/dashboard/admins/historylogs": "History Logs",
    "/dashboard/admins/taxes-charges": "Taxes and Charges",
    "/dashboard/admins/user-management": "User Management",
    "/dashboard/admins/admin-dashboard": "Admin Dashboard",
    "/dashboard/admins/event-list": "Event List",
    "/dashboard/admins/event-management": "Event Management",
    "/dashboard/admins/moderator-dashboard": "Moderator Dashboard",
    "/dashboard/admins/collect-payment": "Collect Payment",
    "/dashboard/admins/order-management": "Order Management",
    "/dashboard/admins/collection-management": "Collection Management",
    "/dashboard/admins/offers": "Offers",
    "/dashboard/admins/restaurants": "Restaurants",
    "/dashboard/admins/manage-admins": "Manage Admins",
    "/dashboard/admins/manage-customers": "Manage Customers",
    "/dashboard/admins/manage-drivers": "Manage Drivers",
    "/dashboard/admins/usermanagement": "User Management",
    "/dashboard/admins/analytics": "Analytics",
    "/dashboard/admins/dine-in-menu": "Dine-In Menu",
    "/dashboard/admins/settings": "Settings",
    "/dashboard/admins/tiffins": "Tiffins",
    "/dashboard/admins/taxes": "Taxes and Charges",
    "/dashboard/admins/claim-restaurant": "Claim Restaurant",
    // New Routes from the Navigation List
    "/dashboard/tiffins/home": "Dashboard",
    "/dashboard/tiffins/orders": "Orders",
    "/dashboard/tiffins/tiffin": "Tiffin",
    "/dashboard/tiffins/taxes-charges": "Taxes & Charges",
    "/dashboard/tiffins/offers": "Offers",
    "/dashboard/tiffins/outlet-info": "Outlet Info",
    "/dashboard/tiffins/help": "Help",

    // marketing dashboard
    "/dashboard/marketing/home": "Dashboard",
    "/dashboard/marketing/campaign-management": "Campaign Management",
    "/dashboard/marketing/collection-management": "Collection Management",
    "/dashboard/marketing/email-templates": "Email Templates",
    "/dashboard/marketing/email-templates-edit": "Email Templates Edit",
    "/dashboard/marketing/RestaurantOffers": "Restaurant Offers",
    "/dashboard/marketing/profile-management": "Profile Management",
    "/dashboard/marketing/help": "Help",
  };
  // Default title is "Dashboard" if the path is not found in the object
  const currentPage = pageTitles[location.pathname] || "Dashboard";
  // Rename to Notifications

  // Function to determine which Sidebar to render
  const renderSidebar = () => {
    if (location.pathname.startsWith("/dashboard/admins")) {
      return <AdminSidebar />;
    } else if (location.pathname.startsWith("/dashboard/tiffin")) {
      return <TifffinSidebar />;
    } else if (location.pathname.startsWith("/dashboard/marketing")) {
      return <MarketingSidebar />;
    }
    return null;
  };
  const renderNavbar=()=>{
      if (location.pathname.startsWith("/dashboard/admins")) {
      return <AdminSidebar />;
    } else if (location.pathname.startsWith("/dashboard/tiffin")) {
      return <TifffinSidebar />;
    } else if (location.pathname.startsWith("/dashboard/marketing")) {
      return <MarketingSidebar />;
    }
    return null; 
  }
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      {renderSidebar()}

      <div className="flex flex-col flex-1 overflow-hidden">
        
        <TopNav currentPage={currentPage} />

        <main className="flex-1 overflow-y-auto p-4">
          {/* Nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
