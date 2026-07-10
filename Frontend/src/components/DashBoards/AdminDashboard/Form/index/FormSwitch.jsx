import React, { useState } from "react";
import AddRestaurant from "../AddRestaurant";
// import TiffinRegistrationForm from "../Tiffin/TiffinRegistrationForm";
import Upload from "../Upload";
// import AddTiffinForm from "../Tiffin/AddTiffinForm";
import AddTiffin from "../Tiffin/AddTiffin";

const FormSwitch = () => {
  const [comp, setComp] = useState(<AddRestaurant />);
  const [title, setTitle] = useState("Register Restaurant Service");
  const [activeTabId, setActiveTabId] = useState("restaurant"); // State for active tab ID
  // const bagdeStyle = `bg-white p-2 py-1 rounded-lg font-semibold border-[.5px] border-black focus:outline-none`; // Removed old style

  const handleTabSwicth = (option) => {
    setActiveTabId(option); // Set active tab ID
    switch (option) {
      case "restaurant":
        setComp(<AddRestaurant />);
        setTitle("Register Restaurant Service");
        break;
      case "tiffin":
        setComp(<AddTiffin />);
        setTitle("Register Tiffin Service");
        break;
      case "excel-upload":
        setComp(<Upload />);
        setTitle("Restaurant List Upload"); // Corrected title
        break;
      default:
        setComp(<AddRestaurant />);
        setTitle("Register Restaurant Service");
    }
  };

  // Define tabs
  const tabs = [
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'tiffin', label: 'Tiffin' },
    { id: 'excel-upload', label: 'Excel Upload' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6"> {/* Slightly wider max-width */} 
      {/* Title remains above tabs */}
      <div className="mb-4">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800">{title}</h1>
      </div>

      {/* Tab Navigation Bar */}
      <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-4 md:space-x-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => handleTabSwicth(tab.id)}
                      className={`whitespace-nowrap py-3 px-3 md:px-4 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out ${
                          activeTabId === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                      {tab.label}
                  </button>
              ))}
          </nav>
      </div>

      {/* Component Display Area */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm"> {/* Changed shadow */}
        {comp && <div>{comp}</div>}
      </div>
    </div>
  );
};

export default FormSwitch;
