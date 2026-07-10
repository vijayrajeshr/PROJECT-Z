// src/components/RightPanel/PagesComponent.jsx
import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";

const availablePages = [
  "Homepage",
  "Order-online",
  "Dining-out",
  "Night-life",
  "Tiffin-services",
];

const PagesComponent = ({ isEditMode, selectedPages, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const allPages = availablePages?.filter(page => page.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCheckboxChange = (page) => {
    if (selectedPages.includes(page)) {
      onChange(selectedPages.filter((p) => p !== page));
    } else {
      onChange([...selectedPages, page]);
    }
  };

  return (
    <div className="">
      <h3 className="font-semibold text-gray-800 text-sm mb-2">Select Pages</h3>
      <input className="rounded border outline-none px-1 mb-3" placeholder="Search city..." type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <div className="max-h-64 overflow-y-auto pr-12">
        <div className="space-y-2">
          {allPages.map((page) => (
            <label key={page} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPages.includes(page)}
                disabled={!isEditMode}
                onChange={() => handleCheckboxChange(page)}
                className="w-4 h-4"
              />
              <span>{page}</span>
              {page === "Homepage" && <div className="group">
                <CiCircleInfo className="w-5 h-5 text-red-500 cursor-pointer" />
                <div className="z-50 absolute left-12 top-16 hidden group-hover:block bg-gray-900 text-white text-xs rounded w-48 px-2 py-2">
                  Banner resolution: <span className="text-red-400">1400x380</span>
                </div>
              </div>}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesComponent;
