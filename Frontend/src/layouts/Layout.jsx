// frontend/src/layouts/Layout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import TifffinSidebar from "../components/Sidebars/TifffinSidebar";
import TopNav from "../components/TopNav";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [currentPage, setCurrentPage] = useState(""); // State to manage the current page title
  const location = useLocation(); // Get current route

  const pageTitles = {
    "/dashboard/admins/home": "Dashboard",
    "/dashboard/admins/orders": "Orders",
    "/dashboard/admins/notifications": "Notifications",
    "/dashboard/admins/support": "Support",
    "/dashboard/admins/support": "Help",
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
    }
    return null; // No sidebar for routes that don't require one
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Conditionally render TopNav */}
        {/* <TopNav /> */}
        <TopNav title={currentPage} /> {/* Display current page title */}
        {/* Outlet for nested routes */}
        <div className="p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

// {modalOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white p-4 rounded shadow-md max-w-lg w-full">
//       <h3 className="text-lg font-bold mb-2">Details</h3>
//       <p><strong>Why:</strong> {selectedDetails.why}</p>
//       <p><strong>When:</strong> {selectedDetails.when}</p>
//       <p><strong>Who:</strong> {selectedDetails.who}</p>
//       <p><strong>Address:</strong> {selectedDetails.address}</p>
//       <p><strong>Email:</strong> {selectedDetails.email}</p>
//       <p><strong>Phone:</strong> {selectedDetails.phone}</p>
//       <p><strong>Description:</strong> {selectedDetails.description}</p>
//       <p><strong>Last Update:</strong> {selectedDetails.lastUpdate}</p>
//       <p><strong>Status:</strong> {selectedDetails.status}</p>
//       <div className="mt-2 text-right">
//         <button
//           onClick={() => setModalOpen(false)}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}
