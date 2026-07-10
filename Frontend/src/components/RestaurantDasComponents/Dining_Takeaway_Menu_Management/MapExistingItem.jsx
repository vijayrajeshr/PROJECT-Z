import { useEffect, useState, useRef } from "react";
import { FiLink, FiSearch, FiCheck, FiX, FiPlusCircle } from "react-icons/fi";
import { X } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const MapExistingItem = ({
  isOpen,
  onClose,
  onSave,
  serviceType = "Dine-in",
  dropdownOptions = {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const searchRef = useRef(null);

  // State variables
  const [isMapped, setIsMapped] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // [{ id, serviceTypes: ["Dine-in", "Takeaway"] }, ...]
  const [menudata, setMenuData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentServiceType, setCurrentServiceType] = useState(serviceType);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Determine initial service type based on route
  useEffect(() => {
    if (!serviceType) {
      if (location.pathname.includes("dine-in")) {
        setCurrentServiceType("Dine-in");
      } else if (
        location.pathname.includes("delivery") ||
        location.pathname.includes("takeaway")
      ) {
        setCurrentServiceType("Takeaway");
      } else {
        setCurrentServiceType("Uncategorized");
      }
    }
  }, [location, serviceType]);

  // Fetch menu data
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const url =
          currentServiceType === "Uncategorized"
            ? `${
                import.meta.env.VITE_SERVER_URL
              }/firm/restaurants/dashboard/menu-sections-items/${id}`
            : `${
                import.meta.env.VITE_SERVER_URL
              }/firm/restaurants/dashboard/menu-sections-items/${id}?serviceType=${currentServiceType}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const menuSections = response.data?.menuSections || [];
        // Normalize serviceType to ensure it's always an array
        const normalizedMenuSections = menuSections.map((menu) => ({
          ...menu,
          sections: menu.sections.map((section) => ({
            ...section,
            items: section.items
              .filter(
                (item) =>
                  currentServiceType === "Uncategorized" ||
                  item.serviceType.includes(currentServiceType)
              )
              .map((item) => ({
                ...item,
                serviceType: Array.isArray(item.serviceType)
                  ? item.serviceType
                  : item.serviceType
                  ? [item.serviceType]
                  : [],
              })),
          })),
        }));
        setMenuData(normalizedMenuSections);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError("Failed to fetch menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, [id, currentServiceType]);

  // Filter items based on search term and currentServiceType
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems([]);
      return;
    }

    const filtered = menudata.flatMap((menu) =>
      menu.sections.flatMap((section) =>
        section.items
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (currentServiceType !== "Uncategorized" ||
                !item.category ||
                item.category === "" ||
                item.category === "Uncategorized")
          )
          .map((item) => ({
            ...item,
            sectionName: section.sectionName,
            tabName: menu.tabName,
          }))
      )
    );

    setFilteredItems(filtered);
  }, [searchTerm, menudata, currentServiceType]);

  // Handle clicks outside search dropdown
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchTerm("");
      setFilteredItems([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle service type for an item
  const handleServiceTypeToggle = (itemId, serviceType) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        const newServiceTypes = existing.serviceTypes.includes(serviceType)
          ? existing.serviceTypes.filter((st) => st !== serviceType)
          : [...existing.serviceTypes, serviceType];
        if (newServiceTypes.length === 0) {
          return prev.filter((i) => i.id !== itemId);
        }
        return prev.map((i) =>
          i.id === itemId ? { ...i, serviceTypes: newServiceTypes } : i
        );
      }
      return [...prev, { id: itemId, serviceTypes: [serviceType] }];
    });
  };

  // Cycle through view tabs: Dine-in -> Takeaway -> Uncategorized
  const toggleServiceType = () => {
    const views = ["Dine-in", "Takeaway", "Uncategorized"];
    const currentIndex = views.indexOf(currentServiceType);
    const nextIndex = (currentIndex + 1) % views.length;
    setCurrentServiceType(views[nextIndex]);
    setSearchTerm("");
    setFilteredItems([]);
  };

  // Update service types and close the panel
  const closePopup = async () => {
    if (selectedItems.length === 0) {
      setError("Please select at least one item to map.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare payloads for updated items
      const payloads = selectedItems.map((selected) => {
        const item = menudata
          .flatMap((menu) => menu.sections.flatMap((section) => section.items))
          .find((i) => i.id === selected.id);
        return {
          tabName: item.tabName,
          sectionName: item.sectionName,
          item: [
            {
              id: item.id,
              name: item.name,
              price: item.price || "N/A",
              type: item.type || "Veg",
              description: item.description || "",
              serviceType: [
                ...(Array.isArray(item.serviceType) ? item.serviceType : []),
                ...selected.serviceTypes,
              ].filter((type, index, self) => self.indexOf(type) === index),
              dishDetails: item.dishDetails || {
                servingInfo: "",
                calorieCount: "",
                portionSize: "",
                preparationTime: "",
              },
              category: item.category || "Uncategorized",
            },
          ],
        };
      });

      // Send updates to backend
      for (const payload of payloads) {
        const formData = new FormData();
        formData.append("tabName", payload.tabName);
        formData.append("sectionName", payload.sectionName);
        formData.append("item", JSON.stringify(payload.item));
        const response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/firm/restaurants/addnewItem/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        // Notify parent component
        if (onSave) {
          const item = menudata
            .flatMap((menu) =>
              menu.sections.flatMap((section) => section.items)
            )
            .find((i) => i.id === payload.item[0].id);
          onSave(
            {
              ...item,
              _id: response.data.item?.id || item.id,
              serviceType: payload.item[0].serviceType,
              categoryId: menudata.find((m) => m.tabName === item.tabName)
                ?.categoryId,
              subcategoryId: menudata
                .find((m) => m.tabName === item.tabName)
                ?.sections.find((s) => s.sectionName === item.sectionName)
                ?.subcategoryId,
              category: item.category || "Uncategorized",
              subcategory: item.sectionName,
              pricing: item.price || "N/A",
            },
            false
          );
        }
      }

      // Update menudata optimistically
      setMenuData((prev) =>
        prev.map((menu) => ({
          ...menu,
          sections: menu.sections.map((section) => ({
            ...section,
            items: section.items.map((item) => {
              const selected = selectedItems.find((s) => s.id === item.id);
              if (selected) {
                return {
                  ...item,
                  serviceType: [
                    ...(Array.isArray(item.serviceType)
                      ? item.serviceType
                      : []),
                    ...selected.serviceTypes,
                  ].filter((type, index, self) => self.indexOf(type) === index),
                  category: item.category || "Uncategorized",
                };
              }
              return item;
            }),
          })),
        }))
      );

      setIsMapped(true);
    } catch (error) {
      console.error("Error updating items:", error);
      setError("Failed to update items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 mt-16 w-3/5 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-10">
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading items...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="fixed w-3/5 inset-y-0 right-0 mt-16 bg-white shadow-lg border-l border-gray-200 overflow-hidden z-10">
      {/* Header */}
      <div className="sticky top-0 bg-white p-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Map Existing Items
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Close panel"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search and filter controls */}
        <div
          className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          ref={searchRef}
        >
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search items, categories, item name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            {/* Search Results Dropdown */}
            {filteredItems.length > 0 && searchTerm && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg max-h-64 overflow-y-auto z-20">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer ${
                      selectedItems.some((i) => i.id === item.id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() =>
                      handleServiceTypeToggle(item.id, currentServiceType)
                    }
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.sectionName} - {item.tabName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {item.category || "Uncategorized"}
                        </span>
                        {Array.isArray(item.serviceType) &&
                          item.serviceType.map((type, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                      </div>
                    </div>
                    <p className="text-blue-500 font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              Current View:
            </span>
            <button
              onClick={toggleServiceType}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all font-medium flex items-center gap-2"
            >
              {currentServiceType} Items
              <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">
                Switch to{" "}
                {currentServiceType === "Dine-in"
                  ? "Takeaway"
                  : currentServiceType === "Takeaway"
                  ? "Uncategorized"
                  : "Dine-in"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4 mx-4">
          {error}
        </div>
      )}

      {/* Items list */}
      <div
        className="p-4 overflow-y-auto"
        style={{ height: "calc(100vh - 250px)" }}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500">
            {filteredItems.length > 0
              ? `${filteredItems.length} item(s) found`
              : `${
                  menudata.flatMap((menu) =>
                    menu.sections.flatMap((s) =>
                      s.items.filter(
                        (item) =>
                          currentServiceType !== "Uncategorized" ||
                          !item.category ||
                          item.category === "" ||
                          item.category === "Uncategorized"
                      )
                    )
                  ).length
                } item(s) found`}{" "}
            • {selectedItems.length} selected
          </p>
        </div>

        <div className="space-y-3">
          {menudata.length > 0 ? (
            menudata.map((menu) =>
              menu.sections.map((section) =>
                section.items
                  .filter(
                    (item) =>
                      currentServiceType !== "Uncategorized" ||
                      !item.category ||
                      item.category === "" ||
                      item.category === "Uncategorized"
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 border ${
                        selectedItems.some((i) => i.id === item.id)
                          ? "border-blue-300 bg-blue-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800 text-lg">
                            {item.name}
                          </h3>
                          {item.type && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                item.type === "Veg"
                                  ? "bg-green-100 text-green-600"
                                  : item.type === "Non-Veg"
                                  ? "bg-red-100 text-red-600"
                                  : item.type === "Egg"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description || "No description available"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {section.sectionName}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {menu.tabName}
                          </span>
                          {currentServiceType !== "Uncategorized" && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {item.category || "Uncategorized"}
                            </span>
                          )}
                          {Array.isArray(item.serviceType) &&
                            item.serviceType.map((type, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                              >
                                {type}
                              </span>
                            ))}
                        </div>
                        {currentServiceType === "Uncategorized" && (
                          <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  selectedItems
                                    .find((i) => i.id === item.id)
                                    ?.serviceTypes.includes("Dine-in") || false
                                }
                                onChange={() =>
                                  handleServiceTypeToggle(item.id, "Dine-in")
                                }
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-600">
                                Dine-in
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  selectedItems
                                    .find((i) => i.id === item.id)
                                    ?.serviceTypes.includes("Takeaway") || false
                                }
                                onChange={() =>
                                  handleServiceTypeToggle(item.id, "Takeaway")
                                }
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-600">
                                Takeaway
                              </span>
                            </label>
                          </div>
                        )}
                      </div>

                      {currentServiceType !== "Uncategorized" && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleServiceTypeToggle(
                                item.id,
                                currentServiceType === "Dine-in"
                                  ? "Takeaway"
                                  : "Dine-in"
                              )
                            }
                            className={`flex items-center justify-center p-2 rounded-md transition-all ${
                              selectedItems
                                .find((i) => i.id === item.id)
                                ?.serviceTypes.includes(
                                  currentServiceType === "Dine-in"
                                    ? "Takeaway"
                                    : "Dine-in"
                                )
                                ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            title={
                              selectedItems
                                .find((i) => i.id === item.id)
                                ?.serviceTypes.includes(
                                  currentServiceType === "Dine-in"
                                    ? "Takeaway"
                                    : "Dine-in"
                                )
                                ? "Remove from both services"
                                : "Add to both Dine-in & Takeaway"
                            }
                          >
                            <FiPlusCircle size={18} />
                            <span className="text-xs ml-1">Both</span>
                          </button>
                          <div
                            onClick={() =>
                              handleServiceTypeToggle(
                                item.id,
                                currentServiceType
                              )
                            }
                            className={`flex-shrink-0 w-6 h-6 rounded-full border cursor-pointer ${
                              selectedItems
                                .find((i) => i.id === item.id)
                                ?.serviceTypes.includes(currentServiceType)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            {selectedItems
                              .find((i) => i.id === item.id)
                              ?.serviceTypes.includes(currentServiceType) && (
                              <FiCheck className="text-white" size={14} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              )
            )
          ) : (
            <div className="flex flex-col justify-center items-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <FiSearch size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-600 text-center">
                No items found for{" "}
                <span className="font-medium">{currentServiceType}</span>{" "}
                service.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try changing your search or switching service type
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">{selectedItems.length}</span> items
              selected
            </p>
          </div>
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={closePopup}
              disabled={selectedItems.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md transition-all font-medium ${
                selectedItems.length > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiLink size={18} />
              <span>Map Selected Items</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {isMapped && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                <FiCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Items Mapped Successfully!
              </h3>
              <p className="text-gray-600 mt-1">
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""} added to your menu
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto mt-4 mb-6">
              <div className="space-y-2">
                {selectedItems.map((selected) => {
                  const item = menudata
                    .flatMap((menu) =>
                      menu.sections.flatMap((section) => section.items)
                    )
                    .find((i) => i.id === selected.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center px-3 py-2 bg-gray-50 rounded border border-gray-100"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-xs text-blue-500">
                          {selected.serviceTypes.join(" & ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label="Close panel"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapExistingItem;
