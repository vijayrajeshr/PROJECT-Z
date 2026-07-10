import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryComponent = ({ isEditMode, data, onChange, currentCategory }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const token = localStorage.getItem("token");
  const { id } = useParams();

  // Fetch menu sections and derive categories and subcategories
  const fetchMenuData = useCallback(async () => {
    try {
      if (!token) {
        return "Unauthorized Access.";
      }
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/firm/restaurants/menu-sections-items/${id}`,
        { withCredentials: true }
      );
      const menuSections = response.data.menuSections || [];

      // Set categories
      setCategories(menuSections);

      // Set subcategories based on currentCategory or data.categoryId (for edit mode)
      const selectedCategoryId = isEditMode ? data.categoryId : currentCategory;
      if (selectedCategoryId) {
        const sections = menuSections
          .filter(
            (menuSection) => menuSection.categoryId === selectedCategoryId
          )
          .flatMap(
            (menuSection) =>
              menuSection.sections?.map((section) => ({
                name: section.sectionName,
                id: section.subcategoryId,
              })) || []
          );

        // Remove duplicates based on ID
        const uniqueSections = Array.from(
          new Map(sections.map((item) => [item.id, item])).values()
        );
        setSubcategories(uniqueSections);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setCategories([]);
      setSubcategories([]);
    }
  }, [id, currentCategory, data.categoryId, isEditMode]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Handle category change to update subcategories
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    onChange("categoryId", newCategoryId);
    onChange("subcategoryId", ""); // Reset subcategory when category changes
    onChange(
      "category",
      categories.find((cat) => cat.categoryId === newCategoryId)?.tabName || ""
    );
    onChange("subcategory", ""); // Reset subcategory name
    // Fetch subcategories for the new category
    const sections = categories
      .filter((menuSection) => menuSection.categoryId === newCategoryId)
      .flatMap(
        (menuSection) =>
          menuSection.sections?.map((section) => ({
            name: section.sectionName,
            id: section.subcategoryId,
          })) || []
      );
    const uniqueSections = Array.from(
      new Map(sections.map((item) => [item.id, item])).values()
    );
    setSubcategories(uniqueSections);
  };

  const handleSubcategoryChange = (e) => {
    const newSubcategoryId = e.target.value;
    onChange("subcategoryId", newSubcategoryId);
    onChange(
      "subcategory",
      subCategories.find((sub) => sub.id === newSubcategoryId)?.name || ""
    );
  };

  return (
    <div className="flex w-full gap-16">
      {/* Category */}
      <div className="mb-4">
        <label className="block text-gray-600 text-sm mb-1">Category</label>
        {isEditMode ? (
          <select
            value={data.categoryId || ""}
            onChange={handleCategoryChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select a category</option>
            {categories?.map((item) => (
              <option key={item.categoryId} value={item.categoryId}>
                {item.tabName}
              </option>
            ))}
          </select>
        ) : (
          <div className="bg-gray-100 px-3 py-2 rounded-md">
            {data.category || "N/A"}
          </div>
        )}
      </div>

      {/* Sub-Category */}
      <div className="mb-4">
        <label className="block text-gray-600 text-sm mb-1">Sub-category</label>
        {isEditMode ? (
          <select
            value={data.subcategoryId || ""}
            onChange={handleSubcategoryChange}
            className="w-full border px-3 py-2 rounded-md"
            disabled={!data.categoryId} // Disable if no category is selected
          >
            <option value="">Select a subcategory</option>
            {subCategories?.map((item, index) => (
              <option key={`${item.id}-${index}`} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="bg-gray-100 px-3 py-2 rounded-md">
            {data.subcategory || "N/A"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryComponent;
