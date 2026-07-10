import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import axios from "axios";

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

function DeliveryChargesManager({ email }) {
  const [deliveryRanges, setDeliveryRanges] = useState([]);
  const token=localStorage.getItem('token');
  const [newRange, setNewRange] = useState({
    minDistance: 0,
    maxDistance: 0,
    charge: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing delivery ranges
  useEffect(() => {
    const fetchDeliveryRanges = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges/email`,
          {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
        );
        setDeliveryRanges(response.data);
      } catch (err) {
        setError("Failed to fetch delivery ranges");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryRanges();
  }, [email]);

  const handleAddRange = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges`,
        {
          ...newRange,
          isActive: true,
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      console.log(response.data);
      setDeliveryRanges([...deliveryRanges, response.data]);
      setNewRange({ minDistance: 0, maxDistance: 0, charge: 0 });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
      // setError('Failed to add delivery range' );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRange = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges/${editingId}`,
        {
          ...newRange,
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setDeliveryRanges(
        deliveryRanges.map((range) =>
          range._id === editingId ? response.data : range
        )
      );
      setNewRange({ minDistance: 0, maxDistance: 0, charge: 0 });
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      // setError('Failed to update delivery range');
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
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
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges/${id}/email`,
      {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setDeliveryRanges(deliveryRanges.filter((range) => range._id !== id));
    } catch (err) {
      setError("Failed to delete delivery range");
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
  };

  const handleApplyPredefinedRange = async (ranges) => {
    const confirmed = window.confirm(
      "This will replace your current delivery ranges. Continue?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges/bulk`,
        {
          ranges: ranges.map((range) => ({ ...range, isActive: true })),
        },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setDeliveryRanges(response.data);
    } catch (err) {
      setError("Failed to apply predefined ranges");
    } finally {
      setLoading(false);
    }
  };

  const toggleRangeStatus = async (id, currentStatus) => {
    const confirmed = window.confirm(
      "Are you sure want to change Applicable status fot this range. Continue?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery-ranges/${id}/email`,
        { isActive: !currentStatus },
        {headers:{Authorization:`Bearer ${token}`},withCredentials:true}
      );
      setDeliveryRanges(
        deliveryRanges.map((range) =>
          range._id === id ? response.data : range
        )
      );
    } catch (err) {
      // setError('Failed to update range status');
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  return (
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
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-2">
            {error}
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-4 mb-2">
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
            {isEditing ? "Update Range" : "Add Range"}
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
                <th className="px-4 py-2 text-left font-medium">Applicable</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryRanges.map((range) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeliveryChargesManager;
