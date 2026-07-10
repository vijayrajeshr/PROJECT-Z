// import React, { useState } from "react";
// import {
//   FiChevronDown,
//   FiLink,
//   FiFolderPlus,
//   FiFolder,
//   FiLayers,
// } from "react-icons/fi";
// import { MdOutlineFiberManualRecord } from "react-icons/md";
// import axios from "axios";
// import { toast } from "react-toastify";
// import AddItemForm from "./Dining_Takeaway_Menu_Management/AddItemForm";
// import PopUp from "./PopUp";
// import MapExistingItem from "./Dining_Takeaway_Menu_Management/MapExistingItem";
// import CreateComboForm from "./Dining_Takeaway_Menu_Management/CreateComboForm";
// import AddSubcategoryForm from "./Dining_Takeaway_Menu_Management/AddSubcategoryForm";
// import AddCategoryForm from "./Dining_Takeaway_Menu_Management/AddCategoryForm";

// const LeftPanel = ({
//   onProductSelect,
//   restaurantId,
//   menuTabs,
//   setMenuTabs,
//   fetchMenuTabs,
//   combos,
//   setCombos,
//   fetchCombos,
// }) => {
//   const [openCategories, setOpenCategories] = useState({});
//   const [isPopUpOpen, setIsPopUpOpen] = useState(false);
//   const [popUpTitle, setPopUpTitle] = useState("");
//   const [showAddItemForm, setShowAddItemForm] = useState(false);
//   const [showMapExistingItem, setShowMapExistingItem] = useState(false);
//   const [showCreateComboForm, setShowCreateComboForm] = useState(false);
//   const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);
//   const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const token = localStorage.getItem("token");
//   const toggleCategory = (categoryName) => {
//     setOpenCategories((prev) => ({
//       ...prev,
//       [categoryName]: !prev[categoryName],
//     }));
//   };

//   const handleActionClick = (action) => {
//     if (action === "Add Item") {
//       setShowAddItemForm(true);
//     } else if (action === "Map Existing Item") {
//       setShowMapExistingItem(true);
//     } else if (action === "Create Combo") {
//       setShowCreateComboForm(true);
//     } else if (action === "Add Subcategory") {
//       setShowAddSubcategoryForm(true);
//     } else if (action === "Add Category") {
//       setShowAddCategoryForm(true);
//     } else {
//       setPopUpTitle(action);
//       setIsPopUpOpen(true);
//     }
//   };

//   const handleSaveCategory = async (newCategory) => {
//     try {
//       const response = await axios.post(
//         `${
//           import.meta.env.VITE_SERVER_URL
//         }/firm/restaurants/menu/${restaurantId}/tabs?t=${Date.now()}`,
//         {
//           tabName: newCategory.name,
//           sections: [{ sectionName: "Default", items: [] }],
//         },
//         { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//       );
//       setMenuTabs((prev) => [
//         ...prev,
//         {
//           name: newCategory.name,
//           id: response.data.id,
//           sections: [
//             { name: "Default", description: "", items: [], itemCount: 0 },
//           ],
//         },
//       ]);
//       setOpenCategories((prev) => ({
//         ...prev,
//         [newCategory.name]: true,
//       }));
//       await fetchMenuTabs();
//       toast.success("Category added successfully");
//     } catch (error) {
//       console.error("Error saving category:", error);
//       toast.error(
//         "Failed to add category: " +
//           (error.response?.data?.message || error.message)
//       );
//     }
//     setShowAddCategoryForm(false);
//   };

//   const handleCloseAddItem = () => setShowAddItemForm(false);
//   const handleCloseMapExistingItem = () => setShowMapExistingItem(false);
//   const handleCloseCreateCombo = () => {
//     setShowCreateComboForm(false);
//     fetchCombos();
//   };
//   const handleCloseAddSubcategory = () => setShowAddSubcategoryForm(false);
//   const handleCloseAddCategory = () => setShowAddCategoryForm(false);
//   const closePopUp = () => {
//     setIsPopUpOpen(false);
//     setPopUpTitle("");
//   };

//   return (
//     <div className="bg-gray-50 w-full border-r border-gray-200 flex flex-col justify-between overflow-hidden custom-scrollbar">
//       <div className="flex-1 overflow-y-auto">
//         <nav className="">
//           <h2 className="text-xl font-semibold mb-6 text-gray-700 px-4 pt-4">
//             Menu Listing
//           </h2>
//         </nav>
//         {isLoading ? (
//           <p className="text-gray-500 px-4">Loading...</p>
//         ) : menuTabs.length > 0 ? (
//           menuTabs.map((tab, tabIndex) => (
//             <div
//               key={tab.id || `${tab.name}-${tabIndex}`}
//               className="mb-4 px-4"
//             >
//               <div
//                 onClick={() => toggleCategory(tab.name)}
//                 className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out"
//               >
//                 <h3 className="font-medium text-gray-700">{tab.name}</h3>
//                 <FiChevronDown
//                   className={`text-gray-500 transition-transform duration-300 ${
//                     openCategories[tab.name] ? "rotate-180" : ""
//                   }`}
//                 />
//               </div>
//               <div
//                 className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                   openCategories[tab.name] ? "opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 {tab.sections.length > 0 ? (
//                   tab.sections.map((section, sectionIndex) => (
//                     <div
//                       key={section.id || `${section.name}-${sectionIndex}`}
//                       className="mb-4 px-4"
//                     >
//                       <div
//                         onClick={() => toggleCategory(section.name)}
//                         className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out"
//                       >
//                         <h3 className="font-medium text-gray-700">
//                           {section.name} ({section.itemCount} items)
//                         </h3>
//                         <FiChevronDown
//                           className={`text-gray-500 transition-transform duration-300 ${
//                             openCategories[section.name] ? "rotate-180" : ""
//                           }`}
//                         />
//                       </div>
//                       <div
//                         className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                           openCategories[section.name]
//                             ? "opacity-100"
//                             : "max-h-0 opacity-0"
//                         }`}
//                       >
//                         {section.items.length > 0 ? (
//                           section.items.map((item) => (
//                             <div
//                               key={item._id}
//                               onClick={() => onProductSelect(item)}
//                               className="flex justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all duration-200 ease-in-out"
//                             >
//                               <div className="flex items-center gap-2">
//                                 <MdOutlineFiberManualRecord
//                                   className={
//                                     item.type === "Veg"
//                                       ? "text-green-500"
//                                       : item.type === "Non-Veg"
//                                       ? "text-red-500"
//                                       : item.type === "Egg"
//                                       ? "text-yellow-500"
//                                       : "text-gray-500"
//                                   }
//                                 />
//                                 <span>{item.name}</span>
//                               </div>
//                               <span className="text-sm">
//                                 {item.pricing === "N/A"
//                                   ? "N/A"
//                                   : `$${item.pricing}`}
//                               </span>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-gray-500 ml-4">
//                             No items available.
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 ml-4">No sections available.</p>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 px-4">No menu tabs available.</p>
//         )}
//       </div>

//       <div className="pt-4 border-t border-gray-200 px-4">
//         <div className="grid mb-28 grid-cols-2 gap-2">
//           <button
//             onClick={() => handleActionClick("Add Category")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <FiFolder className="text-blue-600" />
//             <span className="text-gray-700 text-sm font-medium">
//               Add Category
//             </span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Add Subcategory")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <FiFolderPlus className="text-purple-500" />
//             <span className="text-gray-700 text-sm font-medium">
//               Add Subcategory
//             </span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Add Item")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <FiFolderPlus className="text-black" />
//             <span className="text-gray-700 text-sm font-medium">Add Item</span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Map Existing Item")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <FiLink className="text-green-500" />
//             <span className="text-gray-700 text-sm font-medium">
//               Add Existing Item
//             </span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Create Combo")}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
//           >
//             <FiLayers className="text-yellow-500" />
//             <span className="text-gray-700 text-sm font-medium">
//               Create Combo
//             </span>
//           </button>
//         </div>
//       </div>

//       {showAddCategoryForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <AddCategoryForm
//             isOpen={showAddCategoryForm}
//             onClose={handleCloseAddCategory}
//             onSave={handleSaveCategory}
//           />
//         </div>
//       )}
//       {showAddItemForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <AddItemForm
//             isOpen={showAddItemForm}
//             onClose={handleCloseAddItem}
//             dropdownOptions={{ categories: menuTabs }}
//             restaurantId={restaurantId}
//             onSave={() => {
//               handleCloseAddItem();
//               fetchMenuTabs();
//             }}
//           />
//         </div>
//       )}
//       {showMapExistingItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <MapExistingItem
//             onClose={handleCloseMapExistingItem}
//             isOpen={showMapExistingItem}
//           />
//         </div>
//       )}
//       {showCreateComboForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <CreateComboForm
//             isOpen={showCreateComboForm}
//             onClose={handleCloseCreateCombo}
//             categories={menuTabs}
//             fetchMenuTabs={fetchMenuTabs()}
//             restaurantId={restaurantId}
//             onSave={() => {
//               handleCloseCreateCombo();
//             }}
//           />
//         </div>
//       )}
//       {showAddSubcategoryForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <AddSubcategoryForm
//             isOpen={showAddSubcategoryForm}
//             onClose={handleCloseAddSubcategory}
//             categories={menuTabs}
//             restaurantId={restaurantId}
//             onSave={() => {
//               handleCloseAddSubcategory();
//               fetchMenuTabs();
//             }}
//           />
//         </div>
//       )}
//       {isPopUpOpen && (
//         <PopUp isOpen={isPopUpOpen} onClose={closePopUp} title={popUpTitle}>
//           <p className="text-gray-600">
//             This feature will be implemented soon.
//           </p>
//         </PopUp>
//       )}
//     </div>
//   );
// };

// export default React.memo(LeftPanel);

// Change this line
//import React, { useState } from "react";
// To include useEffect
import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiLink,
  FiFolderPlus,
  FiFolder,
  FiLayers,
} from "react-icons/fi";
import { MdOutlineFiberManualRecord } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import AddItemForm from "./Dining_Takeaway_Menu_Management/AddItemForm";
import PopUp from "./PopUp";
import MapExistingItem from "./Dining_Takeaway_Menu_Management/MapExistingItem";
import CreateComboForm from "./Dining_Takeaway_Menu_Management/CreateComboForm";
import AddSubcategoryForm from "./Dining_Takeaway_Menu_Management/AddSubcategoryForm";
import AddCategoryForm from "./Dining_Takeaway_Menu_Management/AddCategoryForm";
import { useSearch } from "../../context/SearchContext";

const LeftPanel = ({
  onProductSelect,
  restaurantId,
  menuTabs,
  setMenuTabs,
  fetchMenuTabs,
  combos,
  setCombos,
  fetchCombos,
}) => {
  const [openCategories, setOpenCategories] = useState({});
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("");
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showMapExistingItem, setShowMapExistingItem] = useState(false);
  const [showCreateComboForm, setShowCreateComboForm] = useState(false);
  const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleActionClick = (action) => {
    if (action === "Add Item") {
      setShowAddItemForm(true);
    } else if (action === "Map Existing Item") {
      setShowMapExistingItem(true);
    } else if (action === "Create Combo") {
      setShowCreateComboForm(true);
    } else if (action === "Add Subcategory") {
      setShowAddSubcategoryForm(true);
    } else if (action === "Add Category") {
      setShowAddCategoryForm(true);
    } else {
      setPopUpTitle(action);
      setIsPopUpOpen(true);
    }
  };

  const handleSaveCategory = async (newCategory) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/firm/restaurants/menu/${restaurantId}/tabs?t=${Date.now()}`,
        {
          tabName: newCategory.name,
          sections: [{ sectionName: "Default", items: [] }],
        },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setMenuTabs((prev) => [
        ...prev,
        {
          name: newCategory.name,
          id: response.data.id,
          sections: [
            { name: "Default", description: "", items: [], itemCount: 0 },
          ],
        },
      ]);
      setOpenCategories((prev) => ({
        ...prev,
        [newCategory.name]: true,
      }));
      await fetchMenuTabs();
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        "Failed to add category: " +
          (error.response?.data?.message || error.message)
      );
    }
    setShowAddCategoryForm(false);
  };

  const handleCloseAddItem = () => setShowAddItemForm(false);
  const handleCloseMapExistingItem = () => setShowMapExistingItem(false);
  const handleCloseCreateCombo = () => {
    setShowCreateComboForm(false);
    fetchCombos();
  };
  const handleCloseAddSubcategory = () => setShowAddSubcategoryForm(false);
  const handleCloseAddCategory = () => setShowAddCategoryForm(false);
  const closePopUp = () => {
    setIsPopUpOpen(false);
    setPopUpTitle("");
  };
  // Change this line
  //const { searchQuery, filterMenuItems } = useSearch();
  // To include searchLevel
  const { searchQuery, filterMenuItems, searchLevel } = useSearch();

  // Filter menu tabs based on search query
  const filteredMenuTabs = filterMenuItems(menuTabs);
  const displayMenuTabs = searchQuery.trim() ? filteredMenuTabs : menuTabs;

  // Auto-expand categories based on search level
  useEffect(() => {
    if (searchQuery.trim() && displayMenuTabs.length > 0) {
      // Create a new openCategories state based on search results
      const newOpenCategories = {};

      // Always open the tabs that match the search
      displayMenuTabs.forEach((tab) => {
        newOpenCategories[tab.name] = true;

        // If we're searching at section or item level, open matching sections too
        if (searchLevel === "section" || searchLevel === "item") {
          tab.sections.forEach((section) => {
            newOpenCategories[section.name] = true;
          });
        }
      });

      setOpenCategories((prev) => ({
        ...prev,
        ...newOpenCategories,
      }));
    }
  }, [searchQuery, displayMenuTabs, searchLevel]);

  return (
    <div className="bg-gray-50 w-full border-r border-gray-200 flex flex-col justify-between overflow-hidden custom-scrollbar">
      <div className="flex-1 overflow-y-auto">
        <nav className="">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 px-4 pt-4">
            Menu Listing
            {searchLevel && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                {searchLevel === "tab"
                  ? "(Filtering by category)"
                  : searchLevel === "section"
                  ? "(Filtering by subcategory)"
                  : "(Filtering by item)"}
              </span>
            )}
          </h2>
        </nav>
        {isLoading ? (
          <p className="text-gray-500 px-4">Loading...</p>
        ) : displayMenuTabs.length > 0 ? (
          displayMenuTabs.map((tab, tabIndex) => (
            <div
              key={tab.id || `${tab.name}-${tabIndex}`}
              className="mb-4 px-4"
            >
              <div
                onClick={() => toggleCategory(tab.name)}
                className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out"
              >
                <h3 className="font-medium text-gray-700">{tab.name}</h3>
                <FiChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    openCategories[tab.name] ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openCategories[tab.name] ? "opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {tab.sections.length > 0 ? (
                  tab.sections.map((section, sectionIndex) => (
                    <div
                      key={section.id || `${section.name}-${sectionIndex}`}
                      className="mb-4 px-4"
                    >
                      <div
                        onClick={() => toggleCategory(section.name)}
                        className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out"
                      >
                        <h3 className="font-medium text-gray-700">
                          {section.name} ({section.itemCount} items)
                        </h3>
                        <FiChevronDown
                          className={`text-gray-500 transition-transform duration-300 ${
                            openCategories[section.name] ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openCategories[section.name]
                            ? "opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {section.items.length > 0 ? (
                          section.items.map((item) => (
                            <div
                              key={item._id}
                              onClick={() => onProductSelect(item)}
                              className="flex justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center gap-2">
                                <MdOutlineFiberManualRecord
                                  className={
                                    item.type === "Veg"
                                      ? "text-green-500"
                                      : item.type === "Non-Veg"
                                      ? "text-red-500"
                                      : item.type === "Egg"
                                      ? "text-yellow-500"
                                      : "text-gray-500"
                                  }
                                />
                                <span>{item.name}</span>
                              </div>
                              <span className="text-sm">
                                {item.pricing === "N/A"
                                  ? "N/A"
                                  : `$${item.pricing}`}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 ml-4">
                            No items available.
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 ml-4">No sections available.</p>
                )}
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <p className="text-gray-500 px-4">No matching items found</p>
        ) : (
          <p className="text-gray-500 px-4">No menu items available</p>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-200 px-4">
        <div className="grid mb-28 grid-cols-2 gap-2">
          <button
            onClick={() => handleActionClick("Add Category")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
          >
            <FiFolder className="text-blue-600" />
            <span className="text-gray-700 text-sm font-medium">
              Add Category
            </span>
          </button>
          <button
            onClick={() => handleActionClick("Add Subcategory")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
          >
            <FiFolderPlus className="text-purple-500" />
            <span className="text-gray-700 text-sm font-medium">
              Add Subcategory
            </span>
          </button>
          <button
            onClick={() => handleActionClick("Add Item")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
          >
            <FiFolderPlus className="text-black" />
            <span className="text-gray-700 text-sm font-medium">Add Item</span>
          </button>
          <button
            onClick={() => handleActionClick("Map Existing Item")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
          >
            <FiLink className="text-green-500" />
            <span className="text-gray-700 text-sm font-medium">
              Add Existing Item
            </span>
          </button>
          <button
            onClick={() => handleActionClick("Create Combo")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
          >
            <FiLayers className="text-yellow-500" />
            <span className="text-gray-700 text-sm font-medium">
              Create Combo
            </span>
          </button>
        </div>
      </div>

      {showAddCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddCategoryForm
            isOpen={showAddCategoryForm}
            onClose={handleCloseAddCategory}
            onSave={handleSaveCategory}
          />
        </div>
      )}
      {showAddItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddItemForm
            isOpen={showAddItemForm}
            onClose={handleCloseAddItem}
            dropdownOptions={{ categories: menuTabs }}
            restaurantId={restaurantId}
            onSave={() => {
              handleCloseAddItem();
              fetchMenuTabs();
            }}
          />
        </div>
      )}
      {showMapExistingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MapExistingItem
            onClose={handleCloseMapExistingItem}
            isOpen={showMapExistingItem}
          />
        </div>
      )}
      {showCreateComboForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateComboForm
            isOpen={showCreateComboForm}
            onClose={handleCloseCreateCombo}
            categories={menuTabs}
            fetchMenuTabs={fetchMenuTabs()}
            restaurantId={restaurantId}
            onSave={() => {
              handleCloseCreateCombo();
            }}
          />
        </div>
      )}
      {showAddSubcategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddSubcategoryForm
            isOpen={showAddSubcategoryForm}
            onClose={handleCloseAddSubcategory}
            categories={menuTabs}
            restaurantId={restaurantId}
            onSave={() => {
              handleCloseAddSubcategory();
              fetchMenuTabs();
            }}
          />
        </div>
      )}
      {isPopUpOpen && (
        <PopUp isOpen={isPopUpOpen} onClose={closePopUp} title={popUpTitle}>
          <p className="text-gray-600">
            This feature will be implemented soon.
          </p>
        </PopUp>
      )}
    </div>
  );
};

export default React.memo(LeftPanel);
