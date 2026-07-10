// src/components/PopUp.jsx
import React from "react";
import { FiX } from "react-icons/fi";

const PopUp = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-md shadow-lg w-1/3 p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
