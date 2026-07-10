import React, { useState } from "react";
import SettingsInfo from "./SettingsInfo";
import TermsPopup from "./TermsPopup";
import Privacy from "./Privacy";
import PersonalizationManager from "./Persolization";
// import AddressDeliveryPreferences from "./AddressDeliveryPreferences"
// import PaymentsAndSubscriptions from "./PaymentsAndSubscriptions"

const WebsiteManager = () => {
  const [currentTab, setCurrentTab] = useState("settings");

  // Define tabs based on the sections
  const tabs = [
    { id: 'settings', label: 'Settings' },
    { id: 'terms', label: 'Terms and Conditions' },
    { id: 'privacy', label: 'Privacy & Security' },
    { id: 'personalization', label: 'Personalization' },
    // Uncomment if needed
    // { id: 'address', label: 'Delivery Preferences' },
    // { id: 'payment', label: 'Payments & Subscription' },
  ];

  // Function to get the current tab label for the header
  const getCurrentTabLabel = () => {
    const active = tabs.find(tab => tab.id === currentTab);
    return active ? active.label : "Website Management";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Removed Sidebar */}

      {/* Main Content Area - Takes full width now */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white p-4 border-b border-gray-200 shadow-sm">
           {/* Using a dynamic header title based on the tab, or a general one */}
          <h1 className="text-xl font-semibold text-gray-800">
              {/* Display the label of the current tab in the header */} 
              {/* {getCurrentTabLabel()} - Or keep a static title like "Website Management" */}
              Website Management 
          </h1>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out ${
                            currentTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        {/* Tab Content Area */}
        <main className="p-4 md:p-6">
          {/* Conditionally render content based on currentTab */}
          {currentTab === "settings" && <SettingsInfo />}
          {currentTab === "terms" && <TermsPopup />}
          {currentTab === "privacy" && <Privacy />}
          {currentTab === "personalization" && <PersonalizationManager />}
          {/* Uncomment if needed */}
          {/* {currentTab === "address" && <AddressDeliveryPreferences />} */}
          {/* {currentTab === "payment" && <PaymentsAndSubscriptions />} */}
        </main>
      </div>
    </div>
  );
};

export default WebsiteManager;
