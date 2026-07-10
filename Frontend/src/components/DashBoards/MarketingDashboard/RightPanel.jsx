// src/components/RightPanel.jsx
import React, { useState, useEffect } from "react";
import HeaderComponent from "./RightPanel/HeaderComponent";
import Dates from "./RightPanel/Dates";
import ImagesComponent from "./RightPanel/ImagesComponent";
import ActionButtonsComponent from "./RightPanel/ActionButtonsComponent";
import PagesComponent from "./RightPanel/PagesComponent";
import CampaignCities from "./RightPanel/CampaignCities";
import { OffersProvider } from "../../../context/OffersContext";
import { useResource } from "../../../context/Banner_CollectionContext"
import CollectionType from "./CollectionManagement/CollectionType";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RightPanel = () => {
  const { selectedResource, handleUpdate, handleDelete } = useResource()

  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState(selectedResource || {});
  const [selectedPages, setSelectedPages] = useState(selectedResource?.pages || []);
  const [selectedCities, setSelectedCities] = useState(selectedResource?.cities || []);

  const [selectedRestaurants, setSelectedRestaurants] = useState(selectedResource?.restaurants || []);
  useEffect(() => {

    if (selectedResource) {
      setData({ ...selectedResource });

      setSelectedPages(selectedResource.pages || [])
      setSelectedRestaurants(selectedResource?.restaurants || [])
      setSelectedCities(selectedResource.cities || []);
    }
  }, [selectedResource]);

  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
  };

  const handleSave = () => {
    const updatedFields = { ...data }
    console.log(selectedRestaurants)
    if (selectedResource.pages !== undefined) {
      updatedFields.pages = selectedPages
    }
    if (selectedResource.restaurants !== undefined) {
      console.log('selectedRestaurants type:', typeof selectedRestaurants, selectedRestaurants);

      updatedFields.restaurants = selectedRestaurants
    }
    if (selectedResource.cities !== undefined) {
      updatedFields.cities = selectedCities
    }

    handleUpdate(data._id, updatedFields);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setData({ ...selectedResource });
    setSelectedPages(selectedResource.pages || [])
    setSelectedRestaurants(selectedRestaurants.restaurants || [])
    setSelectedCities(selectedResource.cities || [])
    setIsEditMode(false);
  };

  const handleDeleteItem = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDelete(data._id);
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-2/3 p-6 bg-white shadow-md border-l border-gray-200">
        <p className="text-gray-500">
          No item selected. Please select an item from the left panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-3/5 p-6 bg-white shadow-md border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <ToastContainer />
      <HeaderComponent
        data={data}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
        onCancel={handleCancel}
        onDelete={handleDeleteItem}
        onChange={handleFieldChange}
      />

      {!selectedResource.pages && (
        <CollectionType isEditMode={isEditMode} selectedResource={selectedResource} selectedRestaurants={selectedRestaurants} onChange={setSelectedRestaurants} />
      )}

      {/* Images */}
      <OffersProvider>
        <ImagesComponent
          type="Web"
          isEditMode={isEditMode}
          image={data.photoWeb} // Separate state key for Web image
          onImageChange={(file) => {
            setData((prev) => ({
              ...prev,
              photoWeb: file, // Store Web image separately
            }));
          }}
          onChange={handleFieldChange}
        />

        <ImagesComponent
          type="App"
          isEditMode={isEditMode}
          image={data.photoApp} // Separate state key for App image
          onImageChange={(file) => {
            setData((prev) => ({
              ...prev,
              photoApp: file, // Store App image separately
            }));
          }}
        />
      </OffersProvider>

      {/* Dates */}
      <Dates
        isEditMode={isEditMode}
        details={data}
        onChange={handleFieldChange}
      />

      {selectedResource.pages ? (

        <div className="flex relative justify-between mb-6">
          {/* Pages Selection */}
          <div className="">
            <PagesComponent
              isEditMode={isEditMode}
              selectedPages={selectedPages}
              onChange={setSelectedPages}
            />
          </div>

          <div className="">
            <CampaignCities
              isEditMode={isEditMode}
              selectedCities={selectedCities}
              onChange={setSelectedCities}
            />
          </div>
        </div>
      ) : (
        <div className="w-fit">
          <CampaignCities
            isEditMode={isEditMode}
            selectedCities={selectedCities}
            onChange={setSelectedCities}
          />
        </div>
      )}


      {/* Save/Cancel */}
      {isEditMode && (
        <ActionButtonsComponent onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default RightPanel;
