import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const OutletFilterModal = ({ currentFilters, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    type: currentFilters.type || "",
    status: currentFilters.status || "",
  });

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({ type: "", status: "" });
    onApplyFilters({ type: "", status: "" });
  };

  return (
    <div className="fixed mt-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Outlets</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Types</option>
              <option value="Dine In">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Close">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutletFilterModal;
