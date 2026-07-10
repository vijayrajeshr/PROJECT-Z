import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import axios from "axios";

const EditOutletModal = ({ outlet, onClose, onEdit }) => {
  const [editedOutlet, setEditedOutlet] = useState({
    ...outlet,
    restaurantInfo: outlet.restaurantInfo || {},
    ownerName: outlet.ownerName || "",
    ownerPhone: outlet.restaurantInfo.phoneNo || "",
  });
  console.log(outlet, "log outlet");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow only numeric input for contactInfo
    if (name === "contactInfo") {
      if (/^\d*$/.test(value)) {
        // Only digits allowed
        setEditedOutlet((prev) => ({ ...prev, ownerPhone: value }));
      }
      return;
    }

    if (name === "name") {
      setEditedOutlet((prev) => ({
        ...prev,
        restaurantInfo: { ...prev.restaurantInfo, name: value },
      }));
    } else if (name === "address") {
      setEditedOutlet((prev) => ({
        ...prev,
        restaurantInfo: { ...prev.restaurantInfo, address: value },
      }));
    } else if (name === "type") {
      const features =
        value === "Both"
          ? ["Dine In", "Takeaway"]
          : value === "Dine In"
          ? ["Dine In"]
          : value === "Takeaway"
          ? ["Takeaway"]
          : [];
      setEditedOutlet((prev) => ({ ...prev, features }));
    } else if (name === "status") {
      setEditedOutlet((prev) => ({ ...prev, outletStatus: value }));
    } else if (name === "manager") {
      setEditedOutlet((prev) => ({ ...prev, ownerName: value }));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !editedOutlet.restaurantInfo.name ||
      !editedOutlet.features.length ||
      !editedOutlet.outletStatus
    ) {
      setError("Please fill in all required fields (Name, Type, Status)");
      return;
    }

    // Validate phone number (must be 10 or 11 digits)
    if (
      editedOutlet.ownerPhone &&
      !/^\d{10,11}$/.test(editedOutlet.ownerPhone)
    ) {
      setError("Enter a valid phone number.");
      return;
    }

    const requestBody = {
      restaurantInfo: {
        name: editedOutlet.restaurantInfo.name,
        address: editedOutlet.restaurantInfo.address || "",
      },
      features: editedOutlet.features,
      outletStatus: editedOutlet.outletStatus,
      manager: editedOutlet.ownerName || "",
      contactInfo: editedOutlet.ownerPhone || "",
    };

    try {
      setError("");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/claim-rest/editOutlet/${
          editedOutlet._id
        }`,
        requestBody
      );
      onEdit(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update outlet");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Outlet Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={editedOutlet.restaurantInfo.name || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={
                editedOutlet.features?.includes("Takeaway") &&
                editedOutlet.features?.includes("Dine In")
                  ? "Both"
                  : editedOutlet.features?.includes("Takeaway")
                  ? "Takeaway"
                  : editedOutlet.features?.includes("Dine In")
                  ? "Dine In"
                  : ""
              }
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Outlet Type</option>
              <option value="Dine In">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={editedOutlet.outletStatus}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Outlet Status</option>
              <option value="Open">Open</option>
              <option value="Close">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={editedOutlet.restaurantInfo.address || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manager
            </label>
            <input
              type="text"
              name="manager"
              value={editedOutlet.ownerName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Info (phoneNo)
            </label>
            <input
              type="text"
              name="contactInfo"
              value={editedOutlet.ownerPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              maxLength={11} // Restrict input to 10 characters
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
          >
            <FaSave /> <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOutletModal;
