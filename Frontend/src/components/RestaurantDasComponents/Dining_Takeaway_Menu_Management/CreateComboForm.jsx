import { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Simulated shadcn/ui components
const Button = ({ children, onClick, variant, size, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      variant === "outline"
        ? "border border-gray-300"
        : variant === "destructive"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    } ${size === "sm" ? "text-sm" : ""} ${className}`}
  >
    {children}
  </button>
);

const Input = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
}) => (
  <input
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type={type}
    min={min}
    step={step}
    className="w-full px-3 py-2 border border-gray-300 rounded"
  />
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const CreateComboForm = ({ isOpen, onClose, onSave, fetchMenuTabs }) => {
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [comboName, setComboName] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [formData, setFormData] = useState({ category: "", subCategory: "" });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const { id } = useParams();

  // Fetch categories and items when the component mounts
  useEffect(() => {
    const fetchData = async () => {
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
        setAllItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors((prev) => ({
          ...prev,
          category: "Failed to load categories.",
        }));
        toast.error("Failed to load categories.");
      }
    };
    fetchData();
  }, [id]);

  // Fetch subcategories when category changes
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
                menuSection.sections?.map((section) => ({
                  subcategoryId: section.subcategoryId,
                  sectionName: section.sectionName,
                })) || []
            );
          setSubcategories([...new Set(sections)]);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setErrors((prev) => ({
            ...prev,
            subCategory: "Failed to load subcategories.",
          }));
          toast.error("Failed to load subcategories.");
        }
      } else {
        setSubcategories([]);
        setFormData((prev) => ({ ...prev, subCategory: "" }));
      }
    };
    fetchSubcategories();
  }, [formData.category, id]);

  // Handle input changes for category and subcategory
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subCategory: "" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Filter items based on selected category and subcategory
  const filteredItems = allItems.menuSections
    ?.filter((menuSection) =>
      formData.category ? menuSection.categoryId === formData.category : true
    )
    .map((menuSection) => ({
      ...menuSection,
      sections: menuSection.sections?.filter((section) =>
        formData.subCategory
          ? section.subcategoryId === formData.subCategory
          : true
      ),
    }));

  // Toggle item in selected items list
  const handleToggleItem = (item) => {
    setSelectedItems((prev) => {
      const isItemSelected = prev.some((i) => i.id === item.id);
      if (isItemSelected) {
        // Remove item if already selected
        return prev.filter((i) => i.id !== item.id);
      } else {
        // Add item with quantity 1 if not selected
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Adjust the quantity of a selected item
  const handleQuantityChange = (id, delta) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!comboName.trim()) newErrors.comboName = "Combo name is required";
    if (!comboPrice.trim() || isNaN(Number(comboPrice)))
      newErrors.comboPrice = "Valid combo price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory && subcategories.length > 0)
      newErrors.subCategory = "Subcategory is required";
    if (selectedItems.length === 0)
      newErrors.items = "Select at least one item for the combo";
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
      const comboData = {
        name: comboName,
        price: Number(comboPrice) || 0,
        categoryId: formData.category,
        subcategoryId: formData.subCategory,
        type: "Combo",
        taxes: "5% GST",
        description: "",
        dishDetails: {
          servingInfo: "",
          calorieCount: "",
          portionSize: "",
          preparationTime: "",
        },
        items: selectedItems.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          name: item.name || "Untitled Item",
          price: item.price || "N/A",
          type: item.type || "Veg",
          description: item.description || "",
        })),
      };

      const tabName =
        categories.find((cat) => cat.categoryId === formData.category)
          ?.tabName || formData.category;
      const sectionName =
        subcategories.find((sub) => sub.subcategoryId === formData.subCategory)
          ?.sectionName || formData.subCategory;

      const requestBody = {
        tabName,
        sectionName,
        item: [comboData],
      };

      const formDataToSend = new FormData();
      formDataToSend.append("tabName", requestBody.tabName);
      formDataToSend.append("sectionName", requestBody.sectionName);
      formDataToSend.append("item", JSON.stringify(requestBody.item));

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
      toast.success("Combo created successfully");

      onSave({
        ...response.data?.item,
        tabId: formData.category,
        sectionId: formData.subCategory,
      });

      fetchMenuTabs();
      // Reset form state
      setComboName("");
      setComboPrice("");
      setFormData({ category: "", subCategory: "" });
      setSelectedItems([]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed mt-14 inset-0 bg-opacity-50 items-center justify-center p-4 overflow-auto bg-white shadow-md border-l border-gray-200 overflow-y-auto ml-[38%]">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Combo Items
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="comboName">Combo Name</Label>
          <Input
            id="comboName"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            placeholder="Enter combo name"
            required
          />
          {errors.comboName && (
            <p className="text-red-500 text-sm mt-1">{errors.comboName}</p>
          )}
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="comboPrice">Combo Price</Label>
          <Input
            id="comboPrice"
            value={comboPrice}
            onChange={(e) => setComboPrice(e.target.value)}
            placeholder="Enter combo price"
            type="number"
            min="0"
            step="0.01"
            required
          />
          {errors.comboPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.comboPrice}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Category</Label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
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
            <Label>Subcategory</Label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              disabled={!formData.category || subcategories.length === 0}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <option key={sub.subcategoryId} value={sub.subcategoryId}>
                    {sub.sectionName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No subcategories available
                </option>
              )}
            </select>
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>
            )}
          </div>
        </div>

        <div className="w-full max-h-[500px] overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Item</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Variations</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {filteredItems?.length > 0 ? (
                filteredItems.map((menuSection, menuIndex) =>
                  menuSection.sections?.map((section, sectionIndex) =>
                    section.items?.map((item, itemIndex) => {
                      const isSelected = selectedItems.some(
                        (i) => i.id === item.id
                      );
                      return (
                        <tr
                          key={
                            item.id ||
                            `${menuIndex}-${sectionIndex}-${itemIndex}`
                          }
                          className="border"
                        >
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">
                            {menuSection.tabName || "N/A"}
                          </td>
                          <td className="border p-2">
                            {section.sectionName || "N/A"}
                          </td>
                          <td className="border p-2">
                            {item.description || "N/A"}
                          </td>
                          <td className="border p-2">
                            {item.variations?.length > 0
                              ? item.variations.map((v, i) => (
                                  <div key={i}>
                                    {v.name} - {v.price}
                                  </div>
                                ))
                              : "No Variations"}
                          </td>
                          <td className="border p-2">
                            <Button
                              variant={isSelected ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => handleToggleItem(item)}
                            >
                              {isSelected ? "Remove" : "Add"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )
                )
              ) : (
                <tr>
                  <td colSpan={6} className="border p-2 text-center">
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold mb-2">Selected Combo Items</h3>
        {selectedItems.length > 0 ? (
          <div className="overflow-x-auto max-h-60 overflow-y-auto mb-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id} className="border">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="border p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleToggleItem(item)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mb-4 text-gray-600">No items selected</p>
        )}

        {errors.items && (
          <p className="text-red-500 text-sm mb-4">{errors.items}</p>
        )}
        {errors.submit && (
          <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Combo</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComboForm;
