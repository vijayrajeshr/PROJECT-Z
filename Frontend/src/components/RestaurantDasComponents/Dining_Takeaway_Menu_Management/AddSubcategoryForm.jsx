import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiChevronDown, FiX, FiRefreshCw } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubcategory = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const token = localStorage.getItem("token");
  const { id } = useParams();

  // Fetch all top-level categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/firm/restaurants/dashboard/menu-sections-items/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const menuSections = response.data.menuSections || [];
      setCategories(menuSections);
      // Reset selected category and subcategories if they no longer exist in the fetched data
      if (selectedCategory) {
        const selectedExists = menuSections.find(
          (cat) =>
            cat.tabName === selectedCategory && cat.categoryId === categoryId
        );
        if (!selectedExists) {
          setSelectedCategory(null);
          setSelectedSubcategories([]);
          setCategoryId(null);
          toast.info(
            "Selected category was removed or updated. Please select again."
          );
        }
      }
    } catch (err) {
      toast.error("Failed to load categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger, id]);

  const handleCategorySelect = (category, sections, categoryId) => {
    setCategoryId(categoryId);
    setSelectedCategory(category);
    setSelectedSubcategories(sections || []);
    setIsDropdownOpen(false);
  };

  const handleOpenForm = () => {
    if (!selectedCategory) {
      toast.error("Please select a parent category first");
      return;
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSubcategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subcategoryName) {
      toast.error("Subcategory name is required");
      return;
    }
    setFormLoading(true);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/firm/restaurants/addSubcategory/${id}`,
        {
          subcategoryName: subcategoryName,
          categoryId: categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      handleCloseForm();
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Subcategory created successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create subcategory"
      );
      console.error("Error creating subcategory:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const refreshCategories = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow relative">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Category and Subcategory Management
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          title="Close"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Categories dropdown */}
      <div className="mb-6 relative">
        <label
          htmlFor="categorySelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Parent Category
        </label>

        <div className="relative">
          <button
            type="button"
            id="categorySelect"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            <span>
              {selectedCategory ? selectedCategory : "Select a category"}
            </span>
            <FiChevronDown size={18} />
          </button>

          <button
            onClick={refreshCategories}
            className="absolute right-12 top-2 text-gray-500 hover:text-gray-700"
            title="Refresh categories"
            disabled={loading}
          >
            <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">Loading...</div>
              ) : categories.length > 0 ? (
                <ul>
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleCategorySelect(
                          category.tabName,
                          category.sections,
                          category.categoryId
                        )
                      }
                    >
                      {category.tabName}
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {category.sections.length} subcategories
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No categories available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add subcategory button */}
      <div className="mb-4">
        <button
          onClick={handleOpenForm}
          disabled={!selectedCategory || loading}
          className={`flex items-center justify-center px-4 py-2 rounded-md w-full ${
            selectedCategory && !loading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FiPlus size={18} className="mr-2" />
          Add Subcategory
        </button>
      </div>

      {/* Subcategory form modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Subcategory to "{selectedCategory}"
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="subcategoryName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcategory Name
                </label>
                <input
                  type="text"
                  id="subcategoryName"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={formLoading}
                >
                  {formLoading ? "Creating..." : "Create Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Current category and subcategories display */}
      {selectedSubcategories && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">
            Category: {selectedCategory}
          </h3>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Subcategories
            </h4>
            {selectedSubcategories && selectedSubcategories.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                {selectedSubcategories.map((sub) => (
                  <li key={sub._id} className="text-sm text-gray-600">
                    {sub.sectionName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No subcategories yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSubcategory;
