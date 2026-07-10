import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

function CreateOfferForm({ onSave }) {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [itemname, setItemName] = useState("");
  const { id } = useParams();
  const [formState, setFormState] = useState({
    name: "",
    code: "",
    offerType: "percentage",
    percentage: "",
    fixedAmount: "",
    bundlePrice: "",
    scope: "item",
    category: "",
    subcategory: "",
    categoryId: "",
    subcategoryId: "",
    items: [],
    itemName: "",
    startDate: "",
    endDate: "",
    image: null,
    applicability: "both",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
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
        setCategories(response.data.menuSections || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [id]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!formState.categoryId) {
      setSubcategories([]);
      setItems([]);
      return;
    }

    const fetchSubcategories = async () => {
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
            (menuSection) => menuSection.categoryId === formState.categoryId
          )
          .flatMap(
            (menuSection) =>
              menuSection.sections?.map((section) => ({
                name: section.sectionName,
                id: section.subcategoryId,
              })) || []
          );
        setSubcategories(sections);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("Failed to load subcategories.");
      }
    };

    fetchSubcategories();
  }, [formState.categoryId, id]);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    const selectedOption = e.target.selectedOptions?.[0];

    if (!selectedOption) return;
    switch (name) {
      case "category": {
        const tabName = selectedOption.dataset.tabname;
        setFormState((prev) => ({
          ...prev,
          categoryId: value,
          category: tabName,
          subcategoryId: "",
          subcategory: "",
          itemId: "",
          itemName: "",
        }));
        break;
      }
      case "subcategory": {
        const subName = selectedOption.dataset.subname;
        setFormState((prev) => ({
          ...prev,
          subcategoryId: value,
          subcategory: subName,
        }));
        break;
      }
      default:
        setFormState((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };

  // Fetch items when category or subcategory changes
  useEffect(() => {
    if (!formState.categoryId && !formState.subcategoryId) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
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
        let availableItems = [];

        if (formState.subcategoryId) {
          for (const menuSection of menuSections) {
            const matchedSection = (menuSection.sections || []).find(
              (section) => section.subcategoryId === formState.subcategoryId
            );
            if (matchedSection) {
              availableItems = matchedSection.items || [];
              break;
            }
          }
        }

        setItems(availableItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items.");
      }
    };

    if (formState.categoryId) {
      fetchItems();
    }
  }, [formState.categoryId, formState.subcategoryId, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category" && value !== formState.category) {
      setFormState({
        ...formState,
        [name]: value,
        subcategory: "",
        items: [],
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }

    setError("");
    setSuccessMessage("");
  };

  const handleItemCheckbox = (itemId, itemName) => {
    setFormState((prev) => {
      const isChecked = prev.items.includes(itemId);
      return {
        ...prev,
        items: isChecked
          ? prev.items.filter((id) => id !== itemId)
          : [...prev.items, itemId],
      };
    });
    setItemName(itemName);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormState({ ...formState, image: imageUrl });
    }
  };

  const validateForm = () => {
    setError("");
    if (!formState.name.trim()) return "Offer name is required";
    if (!formState.code.trim()) return "Offer code is required";
    if (!formState.startDate || !formState.endDate)
      return "Start and end dates are required";
    if (new Date(formState.endDate) < new Date(formState.startDate))
      return "End date must be after start date";

    if (
      formState.offerType === "percentage" &&
      (!formState.percentage ||
        parseFloat(formState.percentage) <= 0 ||
        parseFloat(formState.percentage) > 100)
    ) {
      return "Please enter a valid percentage discount (1-100%)";
    }

    if (
      formState.offerType === "fixed" &&
      (!formState.fixedAmount || parseFloat(formState.fixedAmount) <= 0)
    ) {
      return "Please enter a valid fixed amount";
    }

    if (
      formState.offerType === "bundle" &&
      (!formState.bundlePrice || parseFloat(formState.bundlePrice) <= 0)
    ) {
      return "Please enter a valid bundle price";
    }

    if (formState.scope === "category" && !formState.categoryId) {
      return "Please select a category";
    }

    if (formState.scope === "subcategory" && !formState.subcategoryId) {
      return "Please select a subcategory";
    }

    if (
      (formState.scope === "item" || formState.offerType === "bundle") &&
      formState.items.length === 0
    ) {
      return "Please select at least one item";
    }

    return null;
  };

  const resetForm = () => {
    setFormState({
      name: "",
      code: "",
      offerType: "percentage",
      percentage: "",
      fixedAmount: "",
      bundlePrice: "",
      scope: "item",
      category: "",
      subcategory: "",
      categoryId: "",
      subcategoryId: "",
      items: [],
      itemName: "",
      startDate: "",
      endDate: "",
      image: null,
      applicability: "both",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    const offerData = {
      name: formState.name,
      code: formState.code,
      offerType: formState.offerType,
      scope: formState.scope,
      startDate: formState.startDate,
      endDate: formState.endDate,
      image: formState.image,
      itemName: formState.scope === "item" ? itemname : "",
      firm: id,
      applicability: formState.applicability,
      category: formState.category,
      subcategory: formState.subcategory ? formState.subcategory : null,
      categoryId: formState.categoryId,
      subcategoryId: formState.subcategoryId ? formState.subcategoryId : null,
    };

    if (formState.offerType === "percentage") {
      offerData.discountValue = parseFloat(formState.percentage);
    } else if (formState.offerType === "fixed") {
      offerData.discountValue = parseFloat(formState.fixedAmount);
    } else if (formState.offerType === "bundle") {
      offerData.bundlePrice = parseFloat(formState.bundlePrice);
    }

    if (formState.scope === "category") {
      offerData.categoryId = formState.categoryId;
    } else if (formState.scope === "subcategory") {
      offerData.subcategoryId = formState.subcategoryId;
    } else if (formState.scope === "item" || formState.offerType === "bundle") {
      offerData.items = formState.items;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/offers/restaurant/${id}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(offerData),
        }
      );

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setError("Server returned an invalid response. Please try again.");
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        setSuccessMessage("Offer created successfully!");
        if (typeof onSave === "function") {
          onSave(responseData);
        }
        setTimeout(() => {
          resetForm();
        }, 100);
      } else {
        console.error("Error response:", response.status, responseData);
        setError(
          responseData.message || `Failed to save offer (${response.status})`
        );
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      className="border p-4 rounded shadow-md bg-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Create a New Offer
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block font-semibold text-gray-700">
            Offer Name
          </label>
          <input
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="e.g., Summer Special"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Offer Code
          </label>
          <input
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            name="code"
            value={formState.code}
            onChange={handleChange}
            placeholder="e.g., SUMMER24"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Upload Offer Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            onChange={handleImageChange}
          />
          {formState.image && (
            <img
              src={formState.image}
              alt="Offer Preview"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Offer Type
          </label>
          <select
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            name="offerType"
            value={formState.offerType}
            onChange={handleChange}
            required
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed">Fixed Discount</option>
            {/* <option value="bundle">Bundled Offer</option> */}
          </select>
        </div>

        {formState.offerType === "percentage" && (
          <div>
            <label className="block font-semibold text-gray-700">
              Discount Percentage
            </label>
            <input
              type="number"
              className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
              name="percentage"
              value={formState.percentage}
              onChange={handleChange}
              placeholder="e.g., 20"
              min="0"
              max="100"
              required
            />
          </div>
        )}

        {formState.offerType === "fixed" && (
          <div>
            <label className="block font-semibold text-gray-700">
              Fixed Amount ($)
            </label>
            <input
              type="number"
              className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
              name="fixedAmount"
              value={formState.fixedAmount}
              onChange={handleChange}
              placeholder="e.g., 5"
              min="0"
              required
            />
          </div>
        )}

        {formState.offerType === "bundle" && (
          <div>
            <label className="block font-semibold text-gray-700">
              Bundle Price ($)
            </label>
            <input
              type="number"
              className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
              name="bundlePrice"
              value={formState.bundlePrice}
              onChange={handleChange}
              placeholder="e.g., 15"
              min="0"
              required
            />
          </div>
        )}

        {formState.offerType !== "bundle" && (
          <div>
            <label className="block font-semibold text-gray-700">Scope</label>
            <select
              className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
              name="scope"
              value={formState.scope}
              onChange={handleChange}
              required
            >
              <option value="item">Item</option>
              <option value="subcategory">Subcategory</option>
              <option value="category">Category</option>
            </select>
          </div>
        )}

        {(formState.scope === "category" ||
          formState.scope === "subcategory" ||
          formState.scope === "item" ||
          formState.offerType === "bundle") && (
          <div>
            <label className="block font-semibold text-gray-700">
              Select Category
            </label>
            {isLoadingCategories ? (
              <p className="text-blue-600 text-sm mt-1">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-yellow-600 text-sm mt-1">
                No categories available. Please add categories first.
              </p>
            ) : (
              <select
                className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
                name="category"
                onChange={handleChangeValue}
                required={
                  formState.scope === "category" ||
                  formState.scope === "subcategory" ||
                  formState.scope === "item" ||
                  formState.offerType === "bundle"
                }
              >
                <option value="">-- Select --</option>
                {categories.map((c) => (
                  <option
                    key={c.categoryId}
                    value={c.categoryId}
                    data-tabname={c.tabName}
                  >
                    {c.tabName}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {(formState.scope === "subcategory" ||
          formState.scope === "item" ||
          formState.offerType === "bundle") && (
          <div>
            <label className="block font-semibold text-gray-700">
              Select Subcategory
            </label>
            <select
              className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
              name="subcategory"
              value={formState.subcategoryId}
              onChange={handleChangeValue}
              required={formState.scope === "subcategory"}
              disabled={!formState.categoryId || subcategories.length === 0}
            >
              <option value="">-- Select --</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id} data-subname={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {formState.categoryId && subcategories.length === 0 && (
              <p className="text-yellow-600 text-sm mt-1">
                No subcategories found for this category
              </p>
            )}
          </div>
        )}

        {(formState.scope === "item" || formState.offerType === "bundle") && (
          <div>
            <label className="block font-semibold text-gray-700">
              {formState.offerType === "bundle"
                ? "Select Items for Bundle"
                : "Select Items"}
            </label>
            <div className="max-h-32 overflow-auto border p-2 rounded">
              {items.length > 0 ? (
                items.map((item) => (
                  <label key={item.id} className="block text-gray-600">
                    <input
                      type="checkbox"
                      checked={formState.items.includes(item.id)}
                      onChange={() => handleItemCheckbox(item.id, item.name)}
                      className="mr-2"
                    />
                    {item.name}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">
                  {formState.categoryId
                    ? "No items available for the selected category/subcategory."
                    : "Please select a category first."}
                </p>
              )}
            </div>
            {formState.items.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {formState.items.length} item(s) selected
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block font-semibold text-gray-700">
            Offer Start Date
          </label>
          <input
            type="date"
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            name="startDate"
            value={formState.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Offer End Date
          </label>
          <input
            type="date"
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            name="endDate"
            value={formState.endDate}
            onChange={handleChange}
            required
            min={formState.startDate}
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Offer Applicability
          </label>
          <div className="flex space-x-4">
            {["takeaway", "dining", "both"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="applicability"
                  value={option}
                  checked={formState.applicability === option}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={isLoading || isLoadingCategories || categories.length === 0}
        >
          {isLoading ? <span>Saving...</span> : <span>Save Offer</span>}
        </button>
      </div>
    </motion.form>
  );
}

export default CreateOfferForm;
