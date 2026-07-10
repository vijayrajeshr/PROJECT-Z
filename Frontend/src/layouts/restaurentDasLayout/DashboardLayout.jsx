// // ------------------------
// // src/layouts/DashboardLayout.jsx
// // ------------------------
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../../components/RestaurantDasComponents/Sidebar";
// import TopNav from "../../components/RestaurantDasComponents/TopNav";
// // import Sidebar from "../components/Sidebar";
// // import TopNav from "../components/TopNav";

// export default function DashboardLayout({
//   expanded,
//   setExpanded,
//   selectedOutlet,
// }) {
//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
//       <Sidebar
//         expanded={expanded}
//         setExpanded={setExpanded}
//         selectedOutlet={selectedOutlet}
//       />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <TopNav />
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/RestaurantDasComponents/Sidebar";
import TopNav from "../../components/RestaurantDasComponents/TopNav";
import { SearchProvider } from "../../context/SearchContext";

export default function DashboardLayout({
  expanded,
  setExpanded,
  selectedOutlet,
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <SearchProvider>
        <Sidebar
          expanded={expanded}
          setExpanded={setExpanded}
          selectedOutlet={selectedOutlet}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </SearchProvider>
    </div>
  );
}
