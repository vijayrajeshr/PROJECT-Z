import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useContextData } from "../../../context/OutletContext";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

function ChargesManager() {
  const [charges, setCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    name: "",
    type: "flat",
    value: 0,
  });
  const [editingCharge_Id, setEditingCharge_Id] = useState(null);
  const [loading, setLoading] = useState(false);
  const { axiosApi } = useContextData();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // Fetch charges on component mount
  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/get-Charges/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCharges(response.data);
    } catch (error) {
      console.error("Error fetching charges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCharge = async () => {
    if (!newCharge.name || newCharge.value === 0) {
      toast.error("Please fill in all fields before adding a charge.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/add-Charges/${id}`,
        {
          name: newCharge.name,
          type: newCharge.type,
          value: parseFloat(newCharge.value),
          isApplicable: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setCharges([...charges, response.data]);
      setNewCharge({ name: "", type: "flat", value: 0 });
      toast.success("Charge added successfully");
    } catch (error) {
      console.error("Error adding charge:", error);
      toast.error("Failed to add charge. Please try again.");
    } finally {
      setLoading(false);
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
      toast.info("Editing charge: " + chargeToEdit.name);
    }
  };

  const handleUpdateCharge = async () => {
    if (!editingCharge_Id) return;

    setLoading(true);
    try {
      const response = await axiosApi.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/charges/update-Charges/${editingCharge_Id}`,
        {
          name: newCharge.name,
          type: newCharge.type,
          value: parseFloat(newCharge.value),
          isApplicable:
            charges.find((c) => c._id === editingCharge_Id)?.isApplicable ||
            true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCharges(
        charges.map((charge) =>
          charge._id === editingCharge_Id ? response.data : charge
        )
      );

      setEditingCharge_Id(null);
      setNewCharge({ name: "", type: "flat", value: 0 });
      toast.success("Charge updated successfully");
    } catch (error) {
      console.error("Error updating charge:", error);
      toast.error("Failed to update charge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharge = async (_id) => {
    const chargeToDelete = charges.find((charge) => charge._id === _id);

    if (chargeToDelete?.isDefault) {
      toast.error("Default charges cannot be deleted");
      return;
    }

    setLoading(true);
    try {
      await axiosApi.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/delete-Charges/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCharges(charges.filter((charge) => charge._id !== _id));
      toast.success("Charge deleted successfully");
    } catch (error) {
      console.error("Error deleting charge:", error);

      if (error.response?.status === 403) {
        toast.error("Default charges cannot be deleted");
      } else {
        toast.error("Failed to delete charge. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCharge = async (_id) => {
    const chargeToUpdate = charges.find((charge) => charge._id === _id);
    if (!chargeToUpdate) return;

    const updatedIsApplicable = !chargeToUpdate.isApplicable;

    // Optimistically update UI
    setCharges(
      charges.map((charge) =>
        charge._id === _id
          ? { ...charge, isApplicable: updatedIsApplicable }
          : charge
      )
    );

    try {
      await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/update-Charges/${_id}`,
        {
          name: chargeToUpdate.name,
          type: chargeToUpdate.type,
          value: chargeToUpdate.value,
          isApplicable: updatedIsApplicable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(
        `Charge ${
          updatedIsApplicable ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling charge:", error);

      // Revert the optimistic update if there's an error
      setCharges(
        charges.map((charge) =>
          charge._id === _id
            ? { ...charge, isApplicable: chargeToUpdate.isApplicable }
            : charge
        )
      );

      toast.error("Failed to update charge status. Please try again.");
    }
  };

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
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="flat">Flat</option>
                  <option value="percentage">Percentage</option>
                  <option value="item">Item</option>
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
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter charge value"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button
              className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              onClick={editingCharge_Id ? handleUpdateCharge : handleAddCharge}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : editingCharge_Id
                ? "Update Charge"
                : "Add Charge"}
            </button>
            {editingCharge_Id && (
              <button
                className="px-4 py-2 ml-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => {
                  setEditingCharge_Id(null);
                  setNewCharge({ name: "", type: "flat", value: 0 });
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>

          {loading && charges.length === 0 ? (
            <div className="text-center py-4">Loading charges...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Value</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {charges.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-gray-500 italic"
                    >
                      No charges found. Add your first charge above.
                    </td>
                  </tr>
                ) : (
                  charges.map((charge) => (
                    <tr key={charge._id} className="border-t border-gray-200">
                      <td className="px-4 py-2">
                        {charge.name}
                        {charge.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 capitalize">{charge.type}</td>
                      <td className="px-4 py-2">
                        {charge.type === "percentage"
                          ? `${charge.value}%`
                          : `$${charge.value}`}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={charge.isApplicable}
                            onChange={() => handleToggleCharge(charge._id)}
                            className="h-4 w-4 cursor-pointer"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm">
                            {charge.isApplicable ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className={`p-1 text-gray-600 hover:text-gray-900 mr-2 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleEditCharge(charge._id)}
                          disabled={loading}
                        >
                          <FiEdit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className={`p-1 text-gray-600 hover:text-gray-900 ${
                            loading || charge.isDefault
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleDeleteCharge(charge._id)}
                          disabled={loading || charge.isDefault}
                          title={
                            charge.isDefault
                              ? "Default charges cannot be deleted"
                              : "Delete charge"
                          }
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default ChargesManager;
