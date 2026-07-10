import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CategoryModal from "./CategoryModal";

function CategoryList({ onSave }) {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/firm/restaurants/dashboard/menu-sections-items/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const menuSections = res.data.menuSections || [];
      // Map menuSections to match current categories format
      const formattedCategories = menuSections.map((section) => ({
        _id: section.categoryId || section.id || null,
        categoryName: section.tabName || "Default Category",
      }));
      setCategories(formattedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSaveCategory = async (name) => {
    try {
      const categoryData = {
        name,
        type: "Category", // Optional: to indicate this is a category
        description: "", // Default empty description
      };

      const requestBody = {
        tabName: name,
        sectionName: "", // No section for category creation
        item: [], // No items for category creation
      };

      const formDataToSend = new FormData();
      formDataToSend.append("tabName", requestBody.tabName);
      formDataToSend.append("sectionName", requestBody.sectionName);
      formDataToSend.append("item", JSON.stringify(requestBody.item));
      const response = await axios.post(
        `${serverUrl}/firm/restaurants/addnewItem/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      // Format the new category to match the categories state
      const newCategory = {
        _id: response.data.categoryId || response.data._id || null,
        categoryName: name,
      };

      // Update local state optimistically
      setCategories((prev) => [...prev, newCategory]);

      // Call onSave to notify parent (e.g., DineInMenu)
      if (onSave) {
        onSave(newCategory, false); // isCombo: false, as this is a category
      }

      // Refresh categories from backend
      await fetchCategories();

      setModalOpen(false);
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categories</h1>
      <ul className="mb-4">
        {categories.map((cat) => (
          <li key={cat._id} className="py-1">
            {cat.categoryName}
          </li>
        ))}
      </ul>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Add Category
      </button>

      <CategoryModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onSave={handleSaveCategory}
      />
    </div>
  );
}

export default CategoryList;
