import React from "react";

const ItemDescriptionComponent = ({ isEditMode, description, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-600 text-sm mb-1">Item Description</label>
    {isEditMode ? (
      <textarea
        value={description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
        rows={4}
        placeholder="Enter item description"
      />
    ) : (
      <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-700">
        {description || "No description provided"}
      </div>
    )}
  </div>
);

export default ItemDescriptionComponent;
