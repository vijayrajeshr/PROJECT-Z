import { useState } from "react";
import { FaCircle } from "react-icons/fa"; // React Icons for radio buttons
import { FaSave } from "react-icons/fa";
import axios from "axios";
import PhoneInput from "./PhoneNumberWithCountryCode";

export default function TiffinDetails({
  tiffinFormData,
  ontiffinFormDataChange,
  error,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    ontiffinFormDataChange({
      ...tiffinFormData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value) => {
    ontiffinFormDataChange({
      ...tiffinFormData,
      category: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Tiffin Details
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <div className="w-full md:w-1/2">
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 text-sm mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={tiffinFormData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="w-full py-2 px-3 border rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <PhoneInput
          value={tiffinFormData.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="w-full md:w-1/2">
          <label
            htmlFor="tiffinName"
            className="block font-medium text-gray-700 text-sm mb-1"
          >
            Tiffin Name
          </label>
          <input
            type="text"
            id="tiffinName"
            name="tiffinName"
            value={tiffinFormData.tiffinName}
            onChange={handleInputChange}
            placeholder="Enter your tiffin name"
            required
            className="w-full py-2 px-3 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label
            htmlFor="address"
            className="block font-medium text-gray-700 text-sm mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={tiffinFormData.address}
            onChange={handleInputChange}
            placeholder="Enter your full address"
            required
            className="w-full py-2 px-3 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm mb-1">
          Category
        </label>
        <div className="flex space-x-4">
          {["veg", "non-veg", "both"].map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleCategoryChange(option)}
            >
              <FaCircle
                className={
                  tiffinFormData.category === option
                    ? "text-blue-600"
                    : "text-gray-400"
                }
              />
              <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
          <FaSave className="inline mr-2" />
          Save
        </button>
      </div>
    </div>
  );
}
