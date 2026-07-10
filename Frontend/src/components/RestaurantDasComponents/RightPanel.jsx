import React, { useState, useEffect } from "react";
import HeaderComponent from "./RightPanel/HeaderComponent";
import CategoryComponent from "./RightPanel/CategoryComponent";
import FoodTypeComponent from "./RightPanel/FoodTypeComponent";
import ServiceTypeComponent from "./RightPanel/ServiceTypeComponent";
import PricingComponent from "./RightPanel/PricingComponent";
import DishDetailsComponent from "./RightPanel/DishDetailsComponent";
import ImagesComponent from "./RightPanel/ImagesComponent";
import ItemDescriptionComponent from "./RightPanel/ItemDescriptionComponent";
import ActionButtonsComponent from "./RightPanel/ActionButtonsComponent";
import axios from "axios";
import { useParams } from "react-router-dom";

const RightPanel = ({ selectedProduct, onDelete, onDuplicate, onSave }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const token = localStorage.getItem("token");
  const [data, setData] = useState(selectedProduct || {});
  const [currentCategory, setCurrentCategory] = useState(
    selectedProduct?.categoryId || ""
  );
  const { id } = useParams();
  useEffect(() => {
    if (selectedProduct) {
      setData({ ...selectedProduct });
      setCurrentCategory(selectedProduct.categoryId || "");
    }
  }, [selectedProduct]);

  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (field, value) => {
    if (field === "categoryId") {
      setCurrentCategory(value);
      setData((prev) => ({
        ...prev,
        categoryId: value,
        subcategoryId: "", // Reset subcategory when category changes
        category: prev.category, // Preserve category name if needed
        subcategory: "", // Reset subcategory name
      }));
    } else if (field === "subcategoryId") {
      setData((prev) => ({
        ...prev,
        subcategoryId: value,
        subcategory: prev.subcategory, // Preserve subcategory name if needed
      }));
    }
  };

  const handleDishDetailsChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      dishDetails: {
        ...prev.dishDetails,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const sanitizedItem = {
        _id: data._id || null,
        name: data.name || "Untitled",
        pricing: data.pricing || "5",
        description: data.description || "No description provided",
        type: data.type || "Veg",
        serviceType: data.serviceType || [],
        dishDetails: {
          servingInfo: data.dishDetails?.servingInfo || "1",
          calorieCount: data.dishDetails?.calorieCount || "250",
          portionSize: data.dishDetails?.portionSize || "Small",
          allergyDetails: data.dishDetails?.allergyDetails || "N/A",
        },
        category: data.category,
        subcategory: data.subcategory,
        images: data.images?.filter((img) => img) || [],
        video: data.video || "",
        categoryId: data.originalCategoryId || data.categoryId, // Use the original categoryId
        subcategoryId: data.originalSubcategoryId || data.subcategoryId, // Use the original subcategoryId
      };

      if (!sanitizedItem._id) {
        alert("Item ID is missing!");
        return;
      }
      if (!sanitizedItem.categoryId || !sanitizedItem.subcategoryId) {
        alert("Please select a valid category and subcategory!");
        return;
      }

      const formData = new FormData();
      formData.append("sanitizedItem", JSON.stringify([sanitizedItem]));
      // Use correct tabId and section KastId from data
      formData.append("tabId", data.tabId || sanitizedItem.categoryId); // Ensure data.tabId is correct
      formData.append(
        "sectionId",
        data.sectionId || sanitizedItem.subcategoryId
      ); // Ensure data.sectionId is correct

      if (sanitizedItem.images) {
        sanitizedItem.images.forEach((image, index) => {
          if (image && image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      if (sanitizedItem.video && sanitizedItem.video instanceof File) {
        formData.append("video", sanitizedItem.video);
      }

      await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/firm/restaurants/updateMenuItems/${id}/${data._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setIsEditMode(false);
      onSave(sanitizedItem, false);
      alert("Menu item updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert(
        "Failed to save menu item: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCancel = () => {
    setData({ ...selectedProduct });
    setCurrentCategory(selectedProduct?.categoryId || "");
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!data?._id || !id) return;

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/firm/restaurants/deleteItem`,
        {
          params: {
            restaurantId: id,
            itemId: data._id,
            categoryId: data.categoryId,
            subcategoryId: data.subcategoryId,
          },

          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      onDelete(data._id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong while deleting the item.");
    }
  };

  const handleDuplicate = () => {
    const duplicatedItem = {
      ...data,
      _id: Date.now().toString(),
      name: `${data.name} (Copy)`,
    };
    onDuplicate(duplicatedItem);
    setData(duplicatedItem);
    setCurrentCategory(duplicatedItem.categoryId || "");
    setIsEditMode(true);
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
    <div className="w-full p-4 bg-white shadow-md border-l border-gray-200 overflow-y-auto">
      <HeaderComponent
        title={data.name || "Untitled"}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
      <div className="flex w-full gap-9">
        <CategoryComponent
          isEditMode={isEditMode}
          data={data}
          currentCategory={currentCategory}
          onChange={handleCategoryChange}
        />
        <PricingComponent
          isEditMode={isEditMode}
          pricing={data.pricing}
          taxes={data.taxes}
          charges={data.charges}
          onChange={handleFieldChange}
        />
      </div>
      <FoodTypeComponent
        isEditMode={isEditMode}
        selectedType={data.type}
        onTypeChange={(type) => handleFieldChange("type", type)}
      />
      <ServiceTypeComponent serviceTypes={data.serviceType || []} />
      <DishDetailsComponent
        isEditMode={isEditMode}
        details={data.dishDetails || {}}
        onChange={handleDishDetailsChange}
      />
      <ItemDescriptionComponent
        isEditMode={isEditMode}
        description={data.description}
        onChange={handleFieldChange}
      />
      <ImagesComponent
        isEditMode={isEditMode}
        images={data.images || [null, null, null]}
        video={data.video || null}
        onImageChange={(index, file) => {
          setData((prev) => {
            const updatedImages = [...(prev.images || [null, null, null])];
            updatedImages[index] = file;
            return { ...prev, images: updatedImages };
          });
        }}
        onVideoChange={(file) => {
          setData((prev) => ({
            ...prev,
            video: file,
          }));
        }}
      />
      {isEditMode && (
        <ActionButtonsComponent onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default RightPanel;
