import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { FaSearch, FaUtensils, FaMapMarkerAlt, FaPhoneAlt, FaListUl, FaInfoCircle, FaClipboardList, FaStar, FaTags } from "react-icons/fa"; // Adjusted icons
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

// Component to display Tiffin data
export const TiffinPage = () => {
  // === State ===
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tiffins, setTiffins] = useState([]);
  const [selectedTiffin, setSelectedTiffin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  // Removed filterWord, sortWord, nextCursor, hasMore, observer

  // === Data Fetching (Reverted to /api/tiffin) ===
  useEffect(() => {
    const getTiffin = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin`, // Using tiffin endpoint
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        // Adjust based on actual API response structure for tiffins
        const tiffinData = Array.isArray(response.data.tiffins)
                             ? response.data.tiffins
                             : Array.isArray(response.data)
                             ? response.data
                             : [];
        setTiffins(tiffinData);

        // Set the first tiffin as selected if available
        if (tiffinData.length > 0) {
          setSelectedTiffin(tiffinData[0]);
        }

      } catch (err) {
        console.error("Tiffin fetch error:", err);
        const errorMsg =
          err.response
            ? `Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`
            : err.request
            ? "Network Error: Could not reach server. Check connection/CORS."
            : `Error: ${err.message}`;
        setError(errorMsg);
        setTiffins([]);
      } finally {
        setLoading(false);
      }
    };
    getTiffin();
  }, []); // Runs only once on mount

  // === Event Handlers ===
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const selectTiffin = (tiffin) => {
    setSelectedTiffin(tiffin);
  };

  // === Filtering / Derived State ===
  const filteredTiffins = (() => {
    const q = String(searchQuery || "").toLowerCase();
    if (!q) return tiffins;
    return tiffins.filter((tiffin) => {
      const kitchen = String(tiffin?.kitchenName || "").toLowerCase();

      // deliveryCity can be a string, array or other type. Normalize safely.
      let city = "";
      if (typeof tiffin?.deliveryCity === "string") {
        city = tiffin.deliveryCity.toLowerCase();
      } else if (Array.isArray(tiffin?.deliveryCity)) {
        city = String(tiffin.deliveryCity[0] || "").toLowerCase();
      } else {
        city = String(tiffin?.deliveryCity || "").toLowerCase();
      }

      return kitchen.includes(q) || city.includes(q);
    });
  })();

  // === Styles ===
  const TiffinListingSideBar = `
    ${isSidebarOpen ? "w-[25%] min-w-[320px]" : "w-0"}
    h-screen flex-shrink-0
    border-r border-gray-200
    sticky top-0
    bg-gray-50
    overflow-hidden
    flex flex-col
    transition-all duration-300 ease-in-out
    shadow-sm
  `;

  // === Helper Functions (Optional: Could add more specific formatters if needed) ===
  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return `$${price.toFixed(2)}`;
  }

  // === Render ===
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={TiffinListingSideBar}>
        {/* Header */} 
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-white flex-shrink-0">
          <AnimatePresence>
        {isSidebarOpen && (
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-gray-700 truncate"
              >
                Tiffin Services
              </motion.h2>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {/* Using standard arrows */} 
            {isSidebarOpen ? <IoMdArrowBack size={18} /> : <IoMdArrowForward size={18} />}
              </button>
        </div>

        {/* Content */} 
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-grow overflow-hidden"
            >
              {/* Search */} 
              <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400" size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="w-full text-left flex items-center justify-between p-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span>Filters</span>
                  <span>{isFilterDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {isFilterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 overflow-hidden"
                  >
                    {/* Render your filter options here */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="filter1"
                        className="mr-2"
                        // Add your filter logic here
                      />
                      <label htmlFor="filter1">Filter Option 1</label>
                    </div>
                    {/* Add more filter options as needed */}
                  </motion.div>
                )}
              </div>

              {/* Loading State */} 
              {loading && (
                <div className="flex items-center justify-center py-8 flex-grow">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Error State */} 
              {error && (
                <div className="px-4 py-3 m-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center flex-shrink-0">
                  {error}
                </div>
              )}

              {/* Tiffin List */} 
              {!loading && !error && (
                 <ul className="overflow-y-auto flex-grow p-2 space-y-1">
                   {filteredTiffins.length > 0 ? (
                     filteredTiffins.map((tiffin, index) => (
                       <motion.li
                         key={tiffin._id || index} // Use _id if available
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.2, delay: index * 0.02 }}
                         className="rounded-md transition-colors"
                       >
                         <button
                           onClick={() => selectTiffin(tiffin)}
                           className={`w-full px-3 py-2.5 text-left flex items-center justify-between group border rounded-md transition-colors ${
                             selectedTiffin?._id === tiffin._id
                               ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                               : 'border-gray-200 hover:bg-gray-100'
                           }`}
                         >
                           <span className="text-sm text-gray-800 font-medium truncate">
                             {index + 1}. {tiffin.kitchenName || "Unnamed Tiffin"}
                           </span>
                           {/* Optional: Show rating or city */} 
                           {tiffin.ratings && 
                              <span className="text-xs text-yellow-600 flex items-center"><FaStar className="mr-1"/> {tiffin.ratings}</span>
                           }
                         </button>
                       </motion.li>
                     ))
                   ) : (
                     <li className="text-center text-gray-500 text-sm py-6">
                       {searchQuery ? "No tiffins match search." : "No tiffin services found."}
                     </li>
                   )}
                   {/* Removed infinite scroll indicators */} 
                 </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
              </div>

      {/* Main Content Area (Replicates DisplayOrder.jsx card structure) */}
      <div className="flex-grow p-6 overflow-y-auto">
        {selectedTiffin ? (
          <motion.div
            key={selectedTiffin._id} // Animate when selection changes
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 max-w-5xl mx-auto"
          >
            {/* Card Header */} 
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
               <h2 className="font-semibold text-lg text-gray-800 flex items-center">
                  <FaUtensils className="mr-2 text-indigo-500"/> {selectedTiffin.kitchenName || "Tiffin Details"}
               </h2>
               <div className="text-right text-sm text-gray-500 space-x-3">
                  {selectedTiffin.ratings && 
                     <span className="inline-flex items-center"><FaStar className="mr-1 text-yellow-500"/> {selectedTiffin.ratings}</span>
                  }
                  <span className="text-xs">ID: {selectedTiffin._id}</span>
               </div>
             </div>

            {/* Card Body */} 
            <div className="p-6 space-y-6">
               {/* Basic Info Section */} 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 border-gray-200">
                   {/* Left: Contact & Location */} 
                   <div className="space-y-2">
                       <h3 className="text-sm font-medium text-gray-500 flex items-center mb-1"><FaInfoCircle className="mr-1.5"/> Details</h3>
                       {selectedTiffin.ownerPhoneNo?.fullNumber && (
                           <p className="text-sm text-gray-700 flex items-center">
                               <FaPhoneAlt size={12} className="mr-2 text-gray-400"/> 
                               {selectedTiffin.ownerPhoneNo.fullNumber}
                           </p>
                       )}
                       {selectedTiffin.deliveryCity && (
                           <p className="text-sm text-gray-700 flex items-start">
                               <FaMapMarkerAlt size={12} className="mr-2 mt-1 text-gray-400 flex-shrink-0"/> 
                               <span className="leading-relaxed">Delivers to: {selectedTiffin.deliveryCity}</span>
                           </p>
                       )}
                       {selectedTiffin.category?.length > 0 && (
                           <p className="text-sm text-gray-700 flex items-center">
                               <FaTags size={12} className="mr-2 text-gray-400"/> 
                               Categories: {selectedTiffin.category.join(", ")}
                           </p>
                       )}
                   </div>
                   {/* Right: Instructions (if short) or Placeholder */} 
                   <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 flex items-center mb-1"><FaClipboardList className="mr-1.5"/> Key Instructions</h3>
                      {selectedTiffin.instructions?.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 max-h-24 overflow-y-auto pr-2">
                           {selectedTiffin.instructions.slice(0, 3).map((inst) => ( // Show first few
                              <li key={inst._id}>{inst.details}</li>
                           ))}
                           {selectedTiffin.instructions.length > 3 && <li>...</li>} 
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 italic">No specific instructions provided.</p>
                      )}
                   </div>
               </div>

                {/* Menu Section */} 
                <div>
                   <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center"><FaListUl className="mr-2"/> Menu & Pricing</h3>
                   {selectedTiffin.menu?.mealTypes?.length > 0 ? (
                     <div className="space-y-4">
                       {selectedTiffin.menu.mealTypes.map((mealType) => (
                         <div key={mealType._id || mealType.mealTypeId} className="p-3 border rounded-md bg-gray-50">
                            <h4 className="font-medium text-sm text-gray-800 mb-2">{mealType.label}</h4>
                            {mealType.description && <p className="text-xs text-gray-500 mb-2">{mealType.description}</p>} 
                            {mealType.prices && selectedTiffin.menu.plans && (
                               <div className="text-xs grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                  {selectedTiffin.menu.plans.map(plan => {
                                      const price = mealType.prices[plan._id]; // Use plan._id as key
                                      return price !== undefined ? (
                                         <div key={plan._id} className="flex justify-between">
                                            <span className="text-gray-600">{plan.label} Day{plan.label !== '1' ? 's' : ''}:</span> 
                                            <span className="font-medium text-gray-900">{formatPrice(price)}</span>
                                         </div>
                                      ) : null;
                                  })}
                               </div>
                            )}
                  </div>
              ))}
                     </div>
                   ) : (
                     <p className="text-sm text-gray-500 italic">Menu details not available.</p>
                   )}
                 </div>
            </div>

            {/* Card Footer (Optional) */} 
            {/* <div className="bg-gray-50 p-4 border-t border-gray-200 text-right">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                  Action Button
                </button>
            </div> */} 

          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a tiffin service from the list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
