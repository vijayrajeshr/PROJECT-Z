import React, { useState } from "react";
import { AlertCircle, Upload, X } from "lucide-react";
import axios from "axios";

const RestaurantClaimForm = ({ navigate, restaurant }) => {
  const [formData, setFormData] = useState({
    name: restaurant.restaurantInfo.name,
    address: restaurant.restaurantInfo.address,
    ownerName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    proofOfOwnership: null,
    foodServicesPermit: null,
    additionalDocuments: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState({
    proofOfOwnership: "",
    foodServicesPermit: "",
    additionalDocuments: "",
  });

  const validateForm = () => {
    const requiredFields = ["name", "address", "ownerName", "email", "phone"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(
          `Please complete the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field`
        );
        return false;
      }
    }

    if (!formData.proofOfOwnership || !formData.foodServicesPermit) {
      setError("Proof of ownership and food services permit are required");
      return false;
    }

    return true;
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

      if (file.size > maxSize) {
        setError(`${field} file must be less than 5MB`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: file }));
      setFileNames((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const removeFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setFileNames((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSubmit.append(key, value);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/restaurant-claims`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      navigate("/SuccessPage");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (field, label, type = "text", optional = false) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] || ""}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        required={!optional}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  const renderFileUploadField = (field, label, required = false) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative border-2 border-dashed border-gray-300 p-4 rounded-lg hover:border-indigo-500 transition duration-300">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(field, e.target.files?.[0])}
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center space-x-2">
          <Upload className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            {fileNames[field] ? (
              <span className="flex items-center">
                {fileNames[field]}
                <X
                  className="ml-2 h-4 w-4 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => removeFile(field)}
                />
              </span>
            ) : (
              "Click to upload or drag and drop"
            )}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto  px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className=" text-black p-6">
          <h2 className="text-3xl font-bold text-center">
            Restaurant Claim Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {renderInputField("name", "Restaurant Name")}
            {renderInputField("address", "Restaurant Address")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderInputField("ownerName", "Owner Name")}
            {renderInputField(
              "registrationNumber",
              "Employer Identification Number",
              "text",
              true
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderInputField("email", "Email", "email")}
            {renderInputField("phone", "Phone Number", "tel")}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderFileUploadField(
              "proofOfOwnership",
              "Business Licenses Document",
              true
            )}
            {renderFileUploadField(
              "foodServicesPermit",
              "Food Services Permit",
              true
            )}
          </div>

          {renderFileUploadField(
            "additionalDocuments",
            "Additional Documents",
            false
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-300"
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantClaimForm;
