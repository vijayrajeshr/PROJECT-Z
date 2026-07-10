import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import DeliveryChargesManager from "./DeliveryCharges";

// const initialTaxes = [
//   { name: "GST", rate: 5, isApplicable: true },
//   { name: "Service Tax", rate: 2.5, isApplicable: false },
//   { name: "Local Municipal Tax", rate: 1, isApplicable: false },
// ];

// const predefinedCharges = [
//   {
//     _id: "1",
//     name: "Service Fee",
//     type: "percentage",
//     value: 5,
//     isApplicable: true,
//   },
//   {
//     _id: "2",
//     name: "Packaging Fee",
//     type: "flat",
//     value: 10,
//     isApplicable: true,
//   },
//   {
//     _id: "3",
//     name: "Delivery Fee",
//     type: "flat",
//     value: 20,
//     isApplicable: false,
//   },
//   {
//     _id: "4",
//     name: "Convenience Fee",
//     type: "percentage",
//     value: 2,
//     isApplicable: false,
//   },
//   {
//     _id: "5",
//     name: "Handling Charges",
//     type: "flat",
//     value: 15,
//     isApplicable: true,
//   },
// ];

function TaxesAndChargesManager({ email }) {
  const token=localStorage.getItem('token');
  const [taxes, setTaxes] = useState([]);
  const [newTax, setNewTax] = useState({ name: "", rate: 0 });
  const [editingTax_Id, setEditingTax_Id] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charges State
  const [charges, setCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    name: "",
    type: "flat",
    value: 0,
  });
  const [editingCharge_Id, setEditingCharge_Id] = useState(null);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [errorCharges, setErrorCharges] = useState(null);

  const initialTab = localStorage.getItem("selectedTab") || "taxes";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("selectedTab", activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-taxes/email`,
            {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
        );
        setTaxes(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch taxes");
        console.error("Error fetching taxes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const handleAddTax = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/add-taxes`,
        {
          name: newTax.name,
          rate: newTax.rate,
          isApplicable: true,
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );

      setTaxes([...taxes, response.data]);
      setNewTax({ name: "", rate: 0 });
      setEditingTax_Id(null);
    } catch (err) {
      setError("Failed to add tax");
      console.error("Error adding tax:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTax = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to update the tax?"
    );
    if (!isConfirmed) return;

    if (editingTax_Id) {
      try {
        setLoading(true);
        const response = await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/update-taxes/${editingTax_Id}/email`,
          {
            name: newTax.name,
            rate: newTax.rate,
            isApplicable: true,
          },
          {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
        );

        setTaxes(
          taxes.map((tax) => (tax._id === editingTax_Id ? response.data : tax))
        );
        setEditingTax_Id(null);
        setNewTax({ name: "", rate: 0 });
      } catch (err) {
        setError("Failed to update tax");
        console.error("Error updating tax:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTax = (_id) => {
    const taxToEdit = taxes.find((tax) => tax._id === _id);
    if (taxToEdit && !taxToEdit.isDefault) {
      setNewTax({ name: taxToEdit.name, rate: taxToEdit.rate });
      setEditingTax_Id(_id);
    }
    if (taxToEdit.isDefault) {
      setError("Default taxes cannot be edited");
      return;
    }
  };

  const handleDeleteTax = async (_id) => {
    try {
      const taxToDelete = taxes.find((tax) => tax._id === _id);
      if (taxToDelete.isDefault) {
        setError("Default taxes cannot be deleted");
        return;
      }
      const isConfirmed = window.confirm(
        "Are you sure you want to delete the tax?"
      );
      if (!isConfirmed) return;
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/delete-taxes/${_id}/email`,
      {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setTaxes(taxes.filter((tax) => tax._id !== _id));
    } catch (err) {
      setError("Failed to delete tax");
      console.error("Error deleting tax:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTax = async (_id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to update the tax applicable status?"
      );
      if (!isConfirmed) return;
      const taxToUpdate = taxes.find((tax) => tax._id === _id);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/update-taxes/${_id}/email`,
        {
          ...taxToUpdate,
          isApplicable: !taxToUpdate.isApplicable,
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );

      setTaxes(taxes.map((tax) => (tax._id === _id ? response.data : tax)));
    } catch (err) {
      setError("Failed to toggle tax status");
      console.error("Error toggling tax:", err);
    }
  };

  // Fetch charges on component mount
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        setLoadingCharges(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-charges/email`,
          {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
        );
        setCharges(response.data);
      } catch (err) {
        setErrorCharges("Failed to fetch chares");
        console.error("Error fetching charges:", err);
      } finally {
        setLoadingCharges(false);
      }
    };
    fetchCharges();
  }, []);

  const handleAddCharge = async () => {
    try {
      setLoadingCharges(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/add-charges`,
        {
          name: newCharge.name,
          value: newCharge.value,
          type: newCharge.type,
          isApplicable: true,
        },
      {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setCharges([...charges, response.data]);
      setNewCharge({ name: "", type: "flat", value: 0 });
      setEditingCharge_Id(null);
    } catch (error) {
      setErrorCharges("Failed to add charge");
      console.log("Error adding Charge:", error);
    } finally {
      setLoadingCharges(false);
    }
  };

  const handleEditCharge = (_id) => {
    const chargeToEdit = charges.find((charge) => charge._id === _id);
    if (chargeToEdit) {
      setNewCharge({
        name: chargeToEdit.name,
        type: chargeToEdit.type,
        value: chargeToEdit.value,
      });
      setEditingCharge_Id(_id);
    }
  };

  const handleUpdateCharge = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to update the charge?"
    );
    if (!isConfirmed) return;
    if (editingCharge_Id) {
      try {
        setLoadingCharges(true);
        const response = await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/update-charges/${editingCharge_Id}/email`,
          {
            name: newCharge.name,
            value: newCharge.value,
            type: newCharge.type,
            isApplicable: true,
          },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
        );
        setCharges(
          charges.map((charge) =>
            charge._id === editingCharge_Id ? response.data : charge
          )
        );
        setEditingCharge_Id(null);
        setNewCharge({ name: "", type: "flat", value: 0 });
      } catch (err) {
        setErrorCharges("Failed to update charge");
        console.log("Error updating charge:", err);
      } finally {
        setLoadingCharges(false);
      }
    }
  };

  const handleDeleteCharge = async (_id) => {
    try {
      const chargeToDelete = charges.find((charge) => charge._id === _id);
      if (chargeToDelete.isDefault) {
        setErrorCharges("Default charges cannot be deleted");
        return;
      }
      const isConfirmed = window.confirm(
        "Are you sure you want to delete the charge?"
      );
      if (!isConfirmed) return;

      setLoadingCharges(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/delete-charges/${_id}/email`,
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setCharges(charges.filter((charge) => charge._id !== _id));
    } catch (err) {
      setErrorCharges("Failed to delete charge");
      console.error("Error deleting charge:", err);
    } finally {
      setLoadingCharges(false);
    }
  };

  const handleToggleCharge = async (_id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to update the charge applicable status?"
      );
      if (!isConfirmed) return;
      const chargeToUpdate = charges.find((charge) => charge._id === _id);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/update-charges/${_id}/email`,
        {
          ...chargeToUpdate,
          isApplicable: !chargeToUpdate.isApplicable,
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      // console.log("UpdateTax:", response.data);

      setCharges(
        charges.map((charge) => (charge._id === _id ? response.data : charge))
      );
    } catch (err) {
      setErrorCharges("Failed to toggle charge status");
      console.error("Error toggling charge:", err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-2 rounded-lg mb-2">
        <button
          className={`p-3 text-base font-medium rounded-md ${
            activeTab === "taxes"
              ? "bg-red-500 font-semibold text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("taxes")}
        >
          Taxes
        </button>
        <button
          className={`p-3 text-base font-medium rounded-md ${
            activeTab === "deliveryCharges"
              ? "bg-red-500 font-semibold text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("deliveryCharges")}
        >
          Delivery Charges
        </button>
        <button
          className={`p-3 text-base font-medium rounded-md  ${
            activeTab === "otherCharges"
              ? "bg-red-500 font-semibold text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("otherCharges")}
        >
          Other Charges
        </button>
      </div>

      {activeTab === "deliveryCharges" && (
        <div className="bg-white rounded-lg shadow">
          <DeliveryChargesManager email={email} />
        </div>
      )}

      {activeTab === "otherCharges" && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-2">
            {errorCharges && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {errorCharges}
              </div>
            )}
            <div className="bg-gray-50 p-2 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCharge_Id ? "Edit Charge" : "Add New Charge"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium">Charge Name</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newCharge.name}
                    onChange={(e) =>
                      setNewCharge({ ...newCharge, name: e.target.value })
                    }
                    placeholder="Enter charge name"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Charge Type</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                    value={newCharge.type}
                    onChange={(e) =>
                      setNewCharge({ ...newCharge, type: e.target.value })
                    }
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Charge Value</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    type="number"
                    value={newCharge.value}
                    onChange={(e) =>
                      setNewCharge({
                        ...newCharge,
                        value: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Enter charge value"
                    required
                  />
                </div>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={
                  editingCharge_Id ? handleUpdateCharge : handleAddCharge
                }
              >
                {editingCharge_Id ? "Update Charge" : "Add Charge"}
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Value</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Applicable
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((charge) => (
                  <tr key={charge._id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{charge.name}</td>
                    <td className="px-4 py-2">{charge.type}</td>
                    <td className="px-4 py-2">
                      {charge.type === "percentage"
                        ? `${charge.value}%`
                        : `₹${charge.value}`}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={charge.isApplicable}
                        onChange={() => handleToggleCharge(charge._id)}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="p-1 text-gray-600 hover:text-gray-900 mr-2"
                        onClick={() => handleEditCharge(charge._id)}
                      >
                        <FiEdit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-gray-900"
                        onClick={() => handleDeleteCharge(charge._id)}
                      >
                        <FiTrash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "taxes" && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-2">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="bg-gray-50 p-2 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingTax_Id ? "Edit Tax" : "Add New Tax"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={editingTax_Id ? handleUpdateTax : handleAddTax}
                disabled={loading}
              >
                {editingTax_Id ? "Update Tax" : "Add Tax"}
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Rate (%)</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Applicable
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(taxes) &&
                  taxes.map((tax) => (
                    <tr key={tax._id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{tax.name}</td>
                      <td className="px-4 py-2">{tax.rate}%</td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={tax.isApplicable}
                          onChange={() => handleToggleTax(tax._id)}
                          className="h-4 w-4 cursor-pointer"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <>
                          <button
                            className="p-1 text-gray-600 hover:text-gray-900 mr-2"
                            onClick={() => handleEditTax(tax._id)}
                            disabled={loading}
                          >
                            <FiEdit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-gray-900"
                            onClick={() => handleDeleteTax(tax._id)}
                            disabled={loading}
                          >
                            <FiTrash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaxesAndChargesManager;
