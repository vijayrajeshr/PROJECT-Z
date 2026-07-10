import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUpload, FiCamera, FiCheck, FiArrowLeft } from "react-icons/fi";
import CustomSelect from "./utils/CustomSelect";

const URL = import.meta.env.VITE_SERVER_URL;

const AddRestaurantForm = ({ nextStep, prevStep, setID, ID }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const listedCuisines = [
    "south-indian",
    "north-indian",
    "chinese",
    "indian",
    "mexican",
    "american-classics",
    "italian",
    "japanese",
    "thai",
    "korean",
    "mediterranean",
    "seafood",
    "global-fusion",
  ];

  const listedFeatures = [
    "dance",
    "music",
    "live-music",
    "dj",
    "bar",
    "hookah",
    "rooftop",
    "outdoor-seating",
    "buffet",
    "wifi",
  ];

 const handleImageChange = (e) => {
  if (typeof window === "undefined") return; // ✅ prevent SSR error

  const file = e.target.files[0];
  if (file) {
    const imageUrl = window.URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  }
};


const onSubmit = async (data) => {
  setIsLoading(true);
  setProgress(0);

  const formData = new FormData();

  // Append all text fields
  formData.append("firmName", data.firmName || "");
  formData.append("ownerName", data.ownerName || "");
  formData.append("ownerEmail", data.email || "");
  formData.append("phoneNo", phoneNumber || "");
  formData.append("ownerPhone", phoneNumber || "");
  formData.append("location", data.location || "");
  formData.append("area", data.area || "");
  formData.append("city", data.city || "");
  formData.append("shopNo", data.shopNo || "");
  formData.append("floorLevel", data.floorLevel || "");
  formData.append("landmark", data.landmark || "");
  formData.append("category", data.category || "veg");
  formData.append("services", data.services || "delivery");
  formData.append("termsAccepted", "true");
  formData.append("longitude", "-79.4276471");
  formData.append("latitude", "43.6534627");

  // Append arrays properly
  if (cuisines.length > 0) {
    cuisines.forEach((cuisine) => {
      formData.append("cuisines", cuisine);
    });
  } else {
    formData.append("cuisines", "indian");
  }

  if (features.length > 0) {
    features.forEach((feature) => {
      formData.append("features", feature);
    });
  }

  // Append image file if exists
  if (data.image && data.image[0]) {
    formData.append("image", data.image[0]);
  }

  // Debug: Log FormData contents
  console.log("=== FORM DATA CONTENTS ===");
  for (let [key, value] of formData.entries()) {
    console.log(key + ":", value);
  }

  try {
    const res = await axios.post(`${URL}/firm/addRestaurant`, formData, {
      withCredentials: true,
      headers: { 
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      },
    });

    console.log("✅ Restaurant added successfully:", res.data);
    
    if (res.data.restaurant && res.data.restaurant.id) {
      setID(res.data.restaurant.id);
      nextStep();
    }
    
    reset();
    setIsLoading(false);
    setProgress(0);
    
  } catch (err) {
    console.error("❌ Error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    
    setIsLoading(false);
    setProgress(0);
    
    // Show specific error message
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.details || 
                        "Failed to add restaurant";
    alert(`Error: ${errorMessage}`);
  }
};

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-3 sm:px-6">
  {/* Header Section */}
  <div className="max-w-2xl mx-auto mb-6">
    <button
      onClick={prevStep}
      className="flex items-center text-blue-600 font-medium mb-3 hover:text-blue-700 transition-colors"
    >
      <FiArrowLeft className="mr-2" /> Back
    </button>
    <h1 className="text-3xl font-bold text-gray-900">Add New Restaurant</h1>
    <p className="text-gray-600 mt-1">
      Submit your restaurant details and our team will get it listed soon.
    </p>
  </div>

  {/* Form Card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
  >
    {progress > 0 && (
      <div className="w-full h-1.5 bg-gray-200 overflow-hidden">
        <div
          className="h-1.5 bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
      {/* Basic Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Restaurant Name */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Restaurant Name *
            </label>
            <input
              type="text"
              {...register("firmName", { required: true })}
              placeholder="Enter restaurant name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.firmName && (
              <p className="text-xs text-red-500 mt-1">
                Restaurant name is required
              </p>
            )}
          </div>

          {/* Owner Name */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Owner's Name *
            </label>
            <input
              type="text"
              {...register("ownerName", { required: true })}
              placeholder="Enter owner's name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.ownerName && (
              <p className="text-xs text-red-500 mt-1">
                Owner's name is required
              </p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              placeholder="Enter email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.type === "pattern"
                  ? "Please enter a valid email"
                  : "Email is required"}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Phone Number *
            </label>
            <div className="border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="Enter phone number"
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
          Location Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Restaurant Location *
            </label>
            <input
              type="text"
              {...register("location", { required: true })}
              placeholder="Search for area or street name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">Location is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Area / Sector *
            </label>
            <input
              type="text"
              {...register("area", { required: true })}
              placeholder="Enter area or sector"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.area && (
              <p className="text-xs text-red-500 mt-1">Area is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              City *
            </label>
            <input
              type="text"
              {...register("city", { required: true })}
              placeholder="Enter city name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">City is required</p>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
          Restaurant Details
        </h2>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Restaurant Image *
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                />
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow">
                  <FiCamera size={16} />
                </div>
              </div>
            ) : (
              <>
                <FiUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-600 font-medium text-sm text-center">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-xs mt-1 text-center">
                  PNG, JPG up to 2MB
                </p>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              {...register("image", { required: true })}
              onChange={handleImageChange}
            />
          </label>
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">Please upload an image</p>
          )}
        </div>

        {/* Ratings & Popularity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Ratings
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("ratings", { min: 0, max: 5 })}
              placeholder="Rate from 0 to 5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Popularity
            </label>
            <input
              type="number"
              min="0"
              max="10"
              {...register("popularity", { min: 0, max: 10 })}
              placeholder="Rate from 0 to 10"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Categories & Services */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-5">
          Categories & Services
        </h2>

        <div className="space-y-6">
          {/* Food Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Food Category
            </label>
            <div className="flex flex-wrap gap-4">
              {["veg", "non-veg", "both"].map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={category}
                    {...register("category")}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Payment Options
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "creditCard",
                "debitCard",
                "onlinePayment",
                "bankTransfer",
              ].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("paymentOption")}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="whitespace-nowrap">
                    {option.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Services Offered
            </label>
            <div className="flex flex-wrap gap-4">
              {["nightLife", "dineOut", "delivery", "tiffin"].map((service) => (
                <label key={service} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={service}
                    {...register("services")}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="whitespace-nowrap">
                    {service.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Options */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Dietary Options
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "halal",
                "gluten-free",
                "vegan",
                "nut-free",
                "dairy-free",
              ].map((diet) => (
                <label key={diet} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={diet}
                    {...register("dietary")}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize whitespace-nowrap">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomSelect
              listedCuisines={listedCuisines}
              cuisines={cuisines}
              setCuisines={setCuisines}
              headingText="Cuisines"
            />
            <CustomSelect
              listedCuisines={listedFeatures}
              cuisines={features}
              setCuisines={setFeatures}
              headingText="Additional Features"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-gray-200">
        {ID && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Previous
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : ID ? (
            "Update"
          ) : (
            "Submit"
          )}
        </button>

        {ID && (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Next
          </button>
        )}
      </div>
    </form>
  </motion.div>

  {/* Footer */}
  <footer className="max-w-2xl mx-auto mt-10 py-6 px-4 text-center text-sm text-gray-500 border-t border-gray-200">
    <p>© 2025 Zomato. All rights reserved.</p>
    <div className="mt-3 flex flex-wrap justify-center gap-6">
      <a href="#" className="hover:text-blue-600 transition">Who We Are</a>
      <a href="#" className="hover:text-blue-600 transition">Work With Us</a>
      <a href="#" className="hover:text-blue-600 transition">Partner With Us</a>
      <a href="#" className="hover:text-blue-600 transition">Apps For You</a>
    </div>
  </footer>
</div>

  );
};

export default AddRestaurantForm;