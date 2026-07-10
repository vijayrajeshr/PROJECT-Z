import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiInfo } from "react-icons/fi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useContextData } from "../../../context/OutletContext";
import { toast, ToastContainer } from "react-toastify"; // Added react-toastify import
import "react-toastify/dist/ReactToastify.css"; // Added Toastify CSS import

const TAX_TYPES = {
  GST: "gst",
  STATE: "state",
  MUNICIPAL: "municipal",
};

const APPLICABLE_FOR = {
  DINE_IN: "dineIn",
  DELIVERY: "delivery",
  TAKEAWAY: "takeaway",
  ALL: "all",
};

function TaxesManager() {
  const token = localStorage.getItem("token");
  const [taxes, setTaxes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newTax, setNewTax] = useState({
    name: "",
    rate: 0,
    type: TAX_TYPES.GST,
    applicableFor: [APPLICABLE_FOR.ALL],
    effectiveFrom: new Date().toISOString().split("T")[0],
    effectiveTo: "",
    exemptions: [],
    category: "",
    subCategory: "",
  });
  const [editingTaxId, setEditingTaxId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExemptions, setShowExemptions] = useState(false);
  const { axiosApi } = useContextData();
  const { id } = useParams();

  // Fetch taxes, categories, and subcategories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch taxes
        const taxesResponse = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/api/taxes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const taxesData = Array.isArray(taxesResponse.data)
          ? taxesResponse.data
          : taxesResponse.data.taxes || taxesResponse.data.data || [];
        setTaxes(Array.isArray(taxesData) ? taxesData : []);

        // Fetch categories
        const categoriesResponse = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/firm/restaurants/menu-sections-items/${id}`,
          { withCredentials: true }
        );
        setCategories(categoriesResponse.data.menuSections || []);
        setLoading(false);
      } catch (err) {
        toast.error(
          "Failed to load data: " + (err.response?.data?.message || err.message)
        ); // Replaced setError with toast.error
        setLoading(false);
        setTaxes([]);
        setCategories([]);
      }
    };

    fetchData();
  }, [axiosApi, id, token]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (newTax.category) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_SERVER_URL
            }/firm/restaurants/menu-sections-items/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          const sections = response.data.menuSections
            .filter((menuSection) => menuSection.categoryId === newTax.category)
            .flatMap(
              (menuSection) =>
                menuSection.sections?.map((section) => ({
                  name: section.sectionName,
                  id: section.subcategoryId,
                })) || []
            );
          setSubCategories(sections);
        } catch (error) {
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
      }
    };

    fetchSubcategories();
  }, [newTax.category, id, token]);

  const handleAddTax = async () => {
    if (!validateTaxInput()) return;

    try {
      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/api/taxes/createtax`,
        {
          name: newTax.name,
          rate: newTax.rate,
          type: newTax.type,
          applicableFor: newTax.applicableFor,
          effectiveFrom: newTax.effectiveFrom,
          effectiveTo: newTax.effectiveTo || null,
          exemptions: newTax.exemptions,
          firm: id,
          categoryId: newTax.category || null,
          subCategoryId: newTax.subCategory || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const newTaxData = response.data.taxes || response.data;
      setTaxes((prevTaxes) => [...prevTaxes, newTaxData]);
      resetForm();
      toast.success("Tax added successfully"); // Added toast notification
    } catch (err) {
      toast.error(
        "Failed to add tax: " + (err.response?.data?.message || err.message)
      ); // Replaced setError with toast.error
    }
  };

  const validateTaxInput = () => {
    if (!newTax.name || newTax.rate <= 0) {
      toast.error("Please enter a valid tax name and rate"); // Replaced setError with toast.error
      return false;
    }
    if (!newTax.effectiveFrom) {
      toast.error("Please enter an effective from date"); // Replaced setError with toast.error
      return false;
    }
    if (
      newTax.effectiveTo &&
      new Date(newTax.effectiveFrom) > new Date(newTax.effectiveTo)
    ) {
      toast.error("Effective from date must be before effective to date"); // Replaced setError with toast.error
      return false;
    }
    return true;
  };

  const handleEditTax = (_id) => {
    const taxToEdit = taxes.find((tax) => tax._id === _id);
    if (taxToEdit && !taxToEdit.isDefault) {
      setNewTax({
        name: taxToEdit.name,
        rate: taxToEdit.rate,
        type: taxToEdit.type,
        applicableFor: taxToEdit.applicableFor,
        effectiveFrom: taxToEdit.effectiveFrom.split("T")[0],
        effectiveTo: taxToEdit.effectiveTo
          ? taxToEdit.effectiveTo.split("T")[0]
          : "",
        exemptionsREY: taxToEdit.exemptions || [],
        category: taxToEdit.category || "",
        subCategory: taxToEdit.subCategory || "",
      });
      setEditingTaxId(_id);
      toast.info(`Editing tax: ${taxToEdit.name}`); // Added toast notification
    } else {
      toast.error("Default taxes cannot be edited"); // Replaced setError with toast.error
    }
  };

  const handleUpdateTax = async () => {
    if (!validateTaxInput()) return;

    try {
      if (!token) {
        toast.error("Authentication token not found."); // Replaced setError with toast.error
        return;
      }
      const response = await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/api/taxes/update/${editingTaxId}`,
        {
          name: newTax.name,
          rate: newTax.rate,
          type: newTax.type,
          applicableFor: newTax.applicableFor,
          effectiveFrom: newTax.effectiveFrom,
          effectiveTo: newTax.effectiveTo || null,
          exemptions: newTax.exemptions,
          category: newTax.category || null,
          subCategory: newTax.subCategory || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updatedTaxData = response.data.taxes || response.data;
      setTaxes(
        taxes.map((tax) => (tax._id === editingTaxId ? updatedTaxData : tax))
      );
      resetForm();
      toast.success("Tax updated successfully"); // Added toast notification
    } catch (err) {
      toast.error(
        "Failed to update tax: " + (err.response?.data?.message || err.message)
      ); // Replaced setError with toast.error
    }
  };

  const resetForm = () => {
    setNewTax({
      name: "",
      rate: 0,
      type: TAX_TYPES.GST,
      applicableFor: [APPLICABLE_FOR.ALL],
      effectiveFrom: new Date().toISOString().split("T")[0],
      effectiveTo: "",
      exemptions: [],
      category: "",
      subCategory: "",
    });
    setEditingTaxId(null);
  };

  const handleDeleteTax = async (_id) => {
    const taxToDelete = taxes.find((tax) => tax._id === _id);
    if (taxToDelete?.isDefault) {
      toast.error("Default taxes cannot be deleted"); // Replaced setError with toast.error
      return;
    }
    try {
      if (!token) {
        toast.error("Authentication token not found."); // Replaced setError with toast.error
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/taxes/delete/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setTaxes(taxes.filter((tax) => tax._id !== _id));
      toast.success("Tax deleted successfully"); // Added toast notification
    } catch (err) {
      toast.error(
        "Failed to delete tax: " + (err.response?.data?.message || err.message)
      ); // Replaced setError with toast.error
    }
  };

  const handleToggleTax = async (_id) => {
    try {
      if (!token) {
        toast.error("Authentication token not found."); // Replaced setError with toast.error
        return;
      }
      const response = await axiosApi.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/taxes/${_id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updatedTaxData = response.data.taxes || response.data;
      setTaxes(taxes.map((tax) => (tax._id === _id ? updatedTaxData : tax)));
      toast.success(
        `Tax ${
          updatedTaxData.isApplicable ? "activated" : "deactivated"
        } successfully`
      ); // Added toast notification
    } catch (err) {
      toast.error(
        "Failed to toggle tax: " + (err.response?.data?.message || err.message)
      ); // Replaced setError with toast.error
    }
  };

  const handleExemptionChange = (exemption) => {
    const updatedExemptions = newTax.exemptions.includes(exemption)
      ? newTax.exemptions.filter((e) => e !== exemption)
      : [...newTax.exemptions, exemption];
    setNewTax({ ...newTax, exemptions: updatedExemptions });
  };

  const handleCategoryChange = async (categoryId) => {
    setNewTax({
      ...newTax,
      category: categoryId,
      subCategory: "", // Reset subcategory when category changes
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingTaxId ? "Edit Tax" : "Add New Tax"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                  value={newTax.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.tabName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Subcategory</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                  value={newTax.subCategory}
                  onChange={(e) =>
                    setNewTax({ ...newTax, subCategory: e.target.value })
                  }
                  disabled={!newTax.category}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Tax Name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTax.name}
                  onChange={(e) =>
                    setNewTax({ ...newTax, name: e.target.value })
                  }
                  placeholder="Enter tax name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tax Rate (%)</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  type="number"
                  value={newTax.rate}
                  onChange={(e) =>
                    setNewTax({ ...newTax, rate: parseFloat(e.target.value) })
                  }
                  placeholder="Enter tax rate"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tax Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTax.type}
                  onChange={(e) =>
                    setNewTax({ ...newTax, type: e.target.value })
                  }
                >
                  <option value={TAX_TYPES.GST}>GST</option>
                  <option value={TAX_TYPES.STATE}>State Tax</option>
                  <option value={TAX_TYPES.MUNICIPAL}>Municipal Tax</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Applicable For</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTax.applicableFor[0]}
                  onChange={(e) =>
                    setNewTax({ ...newTax, applicableFor: [e.target.value] })
                  }
                >
                  <option value={APPLICABLE_FOR.ALL}>All Orders</option>
                  <option value={APPLICABLE_FOR.DINE_IN}>Dine In Only</option>
                  <option value={APPLICABLE_FOR.TAKEAWAY}>Takeaway Only</option>
                  <option value={APPLICABLE_FOR.DELIVERY}>Delivery Only</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Effective From</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTax.effectiveFrom}
                  onChange={(e) =>
                    setNewTax({ ...newTax, effectiveFrom: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Effective To (Optional)
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTax.effectiveTo}
                  onChange={(e) =>
                    setNewTax({ ...newTax, effectiveTo: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 flex items-center"
                onClick={() => setShowExemptions(!showExemptions)}
              >
                <FiInfo className="mr-1" />
                {showExemptions ? "Hide Exemptions" : "Show Exemptions"}
              </button>
              {showExemptions && (
                <div className="mt-2 space-y-2">
                  <label className="block font-medium">Tax Exemptions</label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={newTax.exemptions.includes("alcohol")}
                        onChange={() => handleExemptionChange("alcohol")}
                      />
                      <span className="ml-2">Alcohol</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={newTax.exemptions.includes("basicFood")}
                        onChange={() => handleExemptionChange("basicFood")}
                      />
                      <span className="ml-2">Basic Food Items</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-start space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={editingTaxId ? handleUpdateTax : handleAddTax}
              >
                {editingTaxId ? "Update Tax" : "Add Tax"}
              </button>
              {editingTaxId && (
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Rate (%)</th>
                <th className="px-4 py-2 text-left font-medium">
                  Applicable For
                </th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">
                  Effective Period
                </th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(taxes) && taxes.length > 0 ? (
                taxes.map((tax) => (
                  <tr key={tax._id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{tax.name}</td>
                    <td className="px-4 py-2 capitalize">{tax.type}</td>
                    <td className="px-4 py-2">{tax.rate}%</td>
                    <td className="px-4 py-2 capitalize">
                      {tax.applicableFor && tax.applicableFor.join
                        ? tax.applicableFor.join(", ").replace(/_/g, " ")
                        : tax.applicableFor}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={tax.isApplicable}
                        onChange={() => handleToggleTax(tax._id)}
                        className="h-4 w-4 cursor-pointer"
                        disabled={tax.isCompulsory}
                      />
                    </td>
                    <td className="px-4 py-2">
                      {tax.effectiveFrom
                        ? new Date(tax.effectiveFrom).toLocaleDateString()
                        : ""}
                      {tax.effectiveTo
                        ? ` to ${new Date(
                            tax.effectiveTo
                          ).toLocaleDateString()}`
                        : ""}
                    </td>
                    <td className="px-4 py-2 flex">
                      <button
                        className={`p-1 text-gray-600 hover:text-gray-900 mr-2 ${
                          tax.isDefault ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleEditTax(tax._id)}
                        disabled={tax.isDefault}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className={`p-1 text-red-600 hover:text-red-800 ${
                          tax.isDefault ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleDeleteTax(tax._id)}
                        disabled={tax.isDefault}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-4 text-center text-gray-500 italic"
                  >
                    No taxes found. Add your first tax using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TaxesManager;
