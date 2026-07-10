
import React, { useState, useEffect, useContext, createContext } from "react";
import { FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import { MdOutlineFiberManualRecord } from "react-icons/md";
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { LuCalendarDays } from "react-icons/lu";
const CreateCampaignModal = ({ onClose, onCreate, isDefaultCategory, pageCategory }) => {
  const [newBanner, setNewBanner] = useState({
    title: "",
    pageCategory: pageCategory,
    isDefault: isDefaultCategory,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, } = e.target;
    setNewBanner((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = () => {
    if (newBanner.title) {
      console.log(newBanner);
      onCreate(newBanner);
    } else {
      console.error("Title is required to create a banner.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Banner
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newBanner.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                required
              />
            </div>
            
            <div>
              <label htmlFor="pageCategory" className="block text-sm font-medium text-gray-700">
                Page Category
              </label>
              <select
                id="pageCategory"
                name="pageCategory"
                value={newBanner.pageCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
              >
                <option value="Home">Home</option>
                <option value="Events">Events</option>
                <option value="Promotions">Promotions</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                checked={newBanner.isDefault}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={!isDefaultCategory}
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                Is this a default banner?
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
            >
              Add Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateCampaignModal;