import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useContextData } from "../../../context/OutletContext";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Added react-toastify import
import "react-toastify/dist/ReactToastify.css"; // Added Toastify CSS import

const predefinedRanges = [
  {
    name: "Local Delivery",
    ranges: [
      { minDistance: 0, maxDistance: 3, charge: 40 },
      { minDistance: 3, maxDistance: 5, charge: 60 },
      { minDistance: 5, maxDistance: 7, charge: 80 },
    ],
  },
  {
    name: "Extended Area",
    ranges: [
      { minDistance: 0, maxDistance: 5, charge: 50 },
      { minDistance: 5, maxDistance: 10, charge: 90 },
      { minDistance: 10, maxDistance: 15, charge: 120 },
    ],
  },
];

function DeliveryChargesManager() {
  const [deliveryRanges, setDeliveryRanges] = useState([]);
  const [newRange, setNewRange] = useState({
    minDistance: 0,
    maxDistance: 0,
    charge: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { axiosApi } = useContextData();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // Fetch existing delivery ranges
  useEffect(() => {
    const fetchDeliveryRanges = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/charges/delivery-ranges/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setDeliveryRanges(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryRanges();
  }, []);

  const handleAddRange = async () => {
    try {
      setLoading(true);
      const payload = {
        minDistance: Number(newRange.minDistance),
        maxDistance: Number(newRange.maxDistance),
        charge: Number(newRange.charge),
      };

      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/delivery-ranges/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response: handle add", response.data);

      setDeliveryRanges(response.data);
      setNewRange({ minDistance: 0, maxDistance: 0, charge: 0 });
      toast.success("Delivery range added successfully"); // Added toast notification
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to add delivery range"
      ); // Added toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRange = async () => {
    try {
      setLoading(true);

      const response = await axiosApi.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/charges/delivery-ranges/${editingId}`,
        {
          minDistance: newRange.minDistance,
          maxDistance: newRange.maxDistance,
          charge: newRange.charge,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDeliveryRanges(
        deliveryRanges.map((range) =>
          range._id === editingId ? response.data : range
        )
      );
      setNewRange({ minDistance: 0, maxDistance: 0, charge: 0 });
      setIsEditing(false);
      setEditingId(null);
      toast.success("Delivery range updated successfully"); // Added toast notification
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message); // Added toast notification
      } else {
        toast.error("Failed to update delivery range"); // Added toast notification
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRange = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this delivery range?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      await axiosApi.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/delivery-ranges/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDeliveryRanges(deliveryRanges.filter((range) => range._id !== id));
      toast.success("Delivery range deleted successfully"); // Added toast notification
    } catch (err) {
      toast.error("Failed to delete delivery range"); // Added toast notification
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRange = (range) => {
    setNewRange({
      minDistance: range.minDistance,
      maxDistance: range.maxDistance,
      charge: range.charge,
    });
    setIsEditing(true);
    setEditingId(range._id);
    toast.info(
      `Editing delivery range: ${range.minDistance}-${range.maxDistance} km`
    ); // Added toast notification
  };

  const handleApplyPredefinedRange = async (ranges) => {
    const confirmed = window.confirm(
      "This will replace your current delivery ranges. Continue?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/delivery-ranges/bulk`,
        {
          ranges: ranges.map((range) => ({ ...range, isActive: true })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDeliveryRanges(response.data);
      toast.success("Predefined ranges applied successfully"); // Added toast notification
    } catch (err) {
      toast.error("Failed to apply predefined ranges"); // Added toast notification
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRangeStatus = async (id, currentStatus) => {
    const confirmed = window.confirm(
      "Are you sure you want to change the applicable status for this range?"
    );
    if (!confirmed) return;

    try {
      const response = await axiosApi.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/delivery-ranges/${id}`,
        { isActive: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDeliveryRanges(
        deliveryRanges.map((range) =>
          range._id === id ? response.data : range
        )
      );
      toast.success(
        `Delivery range ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`
      ); // Added toast notification
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message); // Added toast notification
      } else {
        toast.error("Failed to update range status"); // Added toast notification
      }
      console.error(err);
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
      <div className="bg-white rounded-lg shadow p-2">
        {/* Predefined Templates Section */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-2">Quick Start Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedRanges.map((template, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{template.name}</h4>
                <ul className="text-sm text-gray-600 mb-3">
                  {template.ranges.map((range, idx) => (
                    <li key={idx}>
                      {range.minDistance}-{range.maxDistance}km: ${range.charge}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleApplyPredefinedRange(template.ranges)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Range Form */}
        <div className="bg-white rounded-lg">
          <div className="bg-gray- лично-gray-50 rounded-lg p-4 mb-2">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Delivery Range" : "Add New Delivery Range"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Distance (km)
                </label>
                <input
                  type="number"
                  value={newRange.minDistance}
                  onChange={(e) =>
                    setNewRange({
                      ...newRange,
                      minDistance: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Distance (km)
                </label>
                <input
                  type="number"
                  value={newRange.maxDistance}
                  onChange={(e) =>
                    setNewRange({
                      ...newRange,
                      maxDistance: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  value={newRange.charge}
                  onChange={(e) =>
                    setNewRange({
                      ...newRange,
                      charge: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            </div>
            <button
              onClick={isEditing ? handleUpdateRange : handleAddRange}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isEditing
                ? "Update Range"
                : "Add Range"}
            </button>
          </div>
        </div>

        {/* Current Ranges Table */}
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">
                    Distance Range
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Delivery Fee
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Applicable
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryRanges.length > 0 ? (
                  deliveryRanges.map((range) => (
                    <tr key={range._id} className="border-t">
                      <td className="px-4 py-2">
                        {range.minDistance} - {range.maxDistance} km
                      </td>
                      <td className="px-4 py-2">${range.charge}</td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={range.isActive}
                          onChange={() =>
                            toggleRangeStatus(range._id, range.isActive)
                          }
                          className="h-4 w-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEditRange(range)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRange(range._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-4 text-center text-gray-500 italic"
                    >
                      No delivery ranges found. Add a new range or use a
                      template.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeliveryChargesManager;
