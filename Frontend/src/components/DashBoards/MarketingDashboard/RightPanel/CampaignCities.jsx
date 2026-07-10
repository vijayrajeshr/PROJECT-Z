// src/components/RightPanel/CampaignCities.jsx
import React, { useState } from "react";

const availableCities = [
  "Mexico",
  "Los Angeles",
  "Toronto",
  "Montreal",
  "Phoenix",
  "Phoenix2",
  "Phoenix3",
  "Phoenix4",
  "Phoenix5",
];

const CampaignCities = ({ isEditMode, selectedCities, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const allCities = availableCities?.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCheckboxChange = (city) => {
    if (selectedCities.includes(city)) {
      onChange(selectedCities.filter((p) => p !== city));
    } else {
      onChange([...selectedCities, city]);
    }
  };

  return (
    <div className="">
      <h3 className="font-semibold text-gray-800 text-sm mb-2">Select Cities</h3>
      <input className="rounded border outline-none px-1 mb-3" placeholder="Search city..." type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <div className="max-h-64 overflow-y-auto pr-12">
        <div className="space-y-2">
          {allCities.map((city) => (
            <label key={city} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                disabled={!isEditMode}
                onChange={() => handleCheckboxChange(city)}
                className="w-4 h-4"
              />
              <span>{city}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

  );
};

export default CampaignCities;
