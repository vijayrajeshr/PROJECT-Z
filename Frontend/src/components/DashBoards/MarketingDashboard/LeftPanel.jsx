
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { MdOutlineFiberManualRecord } from "react-icons/md";
 import { useResource } from "../../../context/Banner_CollectionContext";
import CreateCampaignModal from "./CreateCampaignModal";

const LeftPanel = () => {
  const { resources = [], selectedResource, setSelectedResource, handleCreate } = useResource();

  const [openCategories, setOpenCategories] = useState({});
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isCreatingForCategory, setIsCreatingForCategory] = useState("Home");

  // Group banners by pageCategory
  console.log(resources);
  const bannersByCategory = resources.reduce((acc, banner) => {
    const category = banner.pageCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(banner);
    return acc;
  }, {});

  // The categories are directly from the Mongoose schema.
  const categories = ["Home", "Events", "Promotions", "Other"];

  // Open the first category on initial load.
  useEffect(() => {
    if (categories.length > 0) {
      setOpenCategories((prev) => ({
        ...prev,
        [categories[0]]: true,
      }));
    }
  }, []);

  const handleBannerClick = (banner) => {
    setSelectedResource(banner);
  };

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Upcoming":
        return "text-yellow-500";
      case "Inactive":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-2/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between overflow-y-auto rounded-lg shadow-xl">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Banner Campaigns
        </h2>
        {categories.map((catgName) => (
          <div key={catgName} className="mb-4">
            <div
              onClick={() => toggleCategory(catgName)}
              className="flex justify-between items-center cursor-pointer p-4 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="font-semibold text-lg text-gray-700">{catgName}</h3>
              <div className="flex items-center gap-4">
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the category from toggling
                    setIsPopUpOpen(true);
                    setIsCreatingForCategory(catgName);
                  }}
                  title={`Add New Banner to ${catgName}`}
                >
                  <FiPlus size={24} />
                </button>
                <FiChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    openCategories[catgName] ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                openCategories[catgName]
                  ? "max-h-96 opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              {bannersByCategory[catgName]?.length > 0 ? (
                bannersByCategory[catgName].map((banner) => (
                  <div
                    key={banner._id}
                    onClick={() => handleBannerClick(banner)}
                    className={`flex justify-between items-center py-3 px-4 ml-4 mt-2 hover:bg-gray-200 cursor-pointer rounded-xl transition-all duration-200 shadow-sm ${
                      banner._id === selectedResource?._id ? "bg-gray-200 border-l-4 border-blue-500" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MdOutlineFiberManualRecord
                        className={`${getStatusColor(banner.status)} text-xl`}
                      />
                      <span className="text-gray-800 font-medium">{banner.title}</span>
                    </div>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${getStatusColor(banner.status)} bg-opacity-10`}
                    >
                      {banner.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic py-3 px-4 ml-4 mt-2">
                  No banners in this category.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isPopUpOpen && (
        <CreateCampaignModal
          onClose={() => setIsPopUpOpen(false)}
          onCreate={(newBanner) => {
            handleCreate(newBanner);
            setIsPopUpOpen(false);
          }}
          isDefaultCategory={isCreatingForCategory === "Home"}
          pageCategory={isCreatingForCategory}
        />
      )}
    </div>
  );
};

export default LeftPanel;