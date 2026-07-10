import React, { useEffect, useState } from "react";

const types = [
  "Restaurant Discount",
  "Dishes Discount"
];

const TypesComponent = ({ isEditMode, data, onChange }) => {
  const [type, setType] = useState(data.type || "Restaurant Discount");

  useEffect(() => {
    setType(data.type || "Restaurant Discount");
  }, [data]);

  const handleTypeChange = (e) => {
    const newValue = e.target.value;
    setType(newValue);
    if (onChange) {
      onChange("type", newValue);
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-gray-600 text-sm mb-1">Type</label>
      {isEditMode ? (
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          {types.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select>
      ) : (
        <div className="bg-gray-100 px-3 py-2 rounded-md">
          {data.type || "N/A"}
        </div>
      )}
    </div>
  );
};

export default TypesComponent