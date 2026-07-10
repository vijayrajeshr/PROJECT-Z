import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddItemForm = ({
  isOpen,
  onClose,
  dropdownOptions,
  restaurantId,
  onSave,
}) => {
  if (!isOpen) return null;

  const initialFormState = {
    name: "",
    type: "",
    category: "",
    subCategory: "",
    serviceType: [],
    pricing: "",
    taxes: "5% GST",
    description: "",
    dishDetails: {
      servingInfo: "",
      calorieCount: "",
      portionSize: "",
      preparationTime: "",
    },
  };

  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryid, setCategoryId] = useState(null);
  const [subcategoryid, setSubcategoryId] = useState(null);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
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
        setCategoryId(null);
        setCategories(menuSections);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrors((prev) => ({
          ...prev,
          category: "Failed to load categories.",
        }));
      }
    };
    fetchCategories();
  }, [id]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.category) {
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
          const sections = menuSections
            .filter(
              (menuSection) => menuSection.categoryId === formData.category
            )
            .flatMap(
              (menuSection) =>
                menuSection.sections?.map((section) => section.sectionName) ||
                []
            );
          setSubcategoryId("");
          setSubcategories([...new Set(sections)]);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setErrors((prev) => ({
            ...prev,
            subCategory: "Failed to load subcategories.",
          }));
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [formData.category]);

  useEffect(() => {}, [subcategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "category" ? { subCategory: "" } : {}),
      }));
    }
    // Clear error for the changed field
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleServiceTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(type)
        ? prev.serviceType.filter((t) => t !== type)
        : [...prev.serviceType, type],
    }));
    setErrors((prev) => ({ ...prev, serviceType: null }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory)
      newErrors.subCategory = "Subcategory is required";
    if (!formData.pricing) newErrors.pricing = "Price is required";
    if (formData.serviceType.length === 0)
      newErrors.serviceType = "Select at least one service type";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        type: formData.type,
        price: formData.pricing || "0",
        taxes: formData.taxes,
        categoryId: formData.category, // Use single ObjectId
        subcategoryId: formData.subCategory,
        serviceType: formData.serviceType,
        description: formData.description,
        dishDetails: {
          servingInfo: formData.dishDetails.servingInfo,
          calorieCount: formData.dishDetails.calorieCount,
          portionSize: formData.dishDetails.portionSize,
          preparationTime: formData.dishDetails.preparationTime,
        },
      };

      const requestBody = {
        tabName: formData.category,
        sectionName: formData.subCategory,
        item: [itemData],
      };

      const formDataToSend = new FormData();
      formDataToSend.append("tabName", requestBody.tabName);
      formDataToSend.append("sectionName", requestBody.sectionName);
      formDataToSend.append("item", JSON.stringify(requestBody.item));
      images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/firm/restaurants/addnewItem/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Menu item created successfully");

      onSave({
        ...response.data?.item,
        tabId: formData.category,
        sectionId: formData.subCategory,
      });

      setFormData(initialFormState);
      setImages([]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit form. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    }
  };
  return (
    <div className="mt-20 w-3/4 bg-white shadow-md border-l border-gray-200 overflow-y-auto ml-[38%]">
      <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Item name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Type</option>
                  {["Veg", "Non-Veg", "Egg"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.tabName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  disabled={!formData.category || subcategories.length === 0}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <option key={sub.subcategoryId} value={sub.subcategoryId}>
                        {sub}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No subcategories available
                    </option>
                  )}
                </select>
                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subCategory}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="pricing"
                  value={formData.pricing}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter price"
                />
                {errors.pricing && (
                  <p className="text-red-500 text-sm mt-1">{errors.pricing}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Types
              </label>
              <div className="flex gap-4">
                {["Dine-in", "Takeaway"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.serviceType.includes(type)}
                      onChange={() => handleServiceTypeChange(type)}
                      className="rounded border-gray-300 text-blue-600 mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.serviceType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Item description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serving Info
                </label>
                <input
                  type="text"
                  name="dishDetails.servingInfo"
                  value={formData.dishDetails.servingInfo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="e.g., 2 Persons"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calorie Count
                </label>
                <input
                  type="text"
                  name="dishDetails.calorieCount"
                  value={formData.dishDetails.calorieCount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="e.g., 250 kcal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Portion Size
                </label>
                <select
                  name="dishDetails.portionSize"
                  value={formData.dishDetails.portionSize}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Portion Size</option>
                  {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preparation Time
                </label>
                <input
                  type="text"
                  name="dishDetails.preparationTime"
                  value={formData.dishDetails.preparationTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="e.g., 15 mins"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <label
                htmlFor="file-upload"
                className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md cursor-pointer hover:border-gray-500"
              >
                <Upload size={32} className="text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload or drag & drop
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
