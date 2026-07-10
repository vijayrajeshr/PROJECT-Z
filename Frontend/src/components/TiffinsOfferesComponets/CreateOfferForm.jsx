import React, { useState } from "react";
import Dates from "./Dates";

function CreateOfferForm({ onSave, mealTypes = [], mealPlans = [] }) {
  const [offerData, setOfferData] = useState({
    name: "",
    code: "",
    discount: "",
    scope: "Tiffin-wide",
    type: "flat",
    mealTypes: [],
    mealPlans: [],
    startDate: "",
    endDate: "",
  });

  // console.log("offerData:", offerData);

  const handleSave = () => {
    const transformedOffer = {
      ...offerData,
      discount: Number(offerData.discount),
      type: offerData.type,
      mealTypes:
        offerData.scope === "MealType-specific"
          ? mealTypes
            .filter((meal) => offerData.mealTypes.includes(meal.mealTypeId))
            .map((meal) => ({
              mealTypeId: meal.mealTypeId,
              label: meal.label,
            }))
          : [],
      mealPlans: offerData.scope === "MealPlan-Specific" ? offerData.mealPlans : [],
    };

    onSave(transformedOffer);

    setOfferData({
      name: "",
      code: "",
      discount: "",
      scope: "Tiffin-wide",
      type: "flat",
      mealTypes: [],
      mealPlans: [],
      startDate: "",
      endDate: "",
    });
  };

  const handleChange = (field, value) => {
    setOfferData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value, key) => {
    setOfferData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  return (
    <div className="border p-4 rounded shadow-md h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Create a New Offer</h2>
      <div className="space-y-3">
        <div>
          <label className="block font-semibold text-gray-700 text-sm">Offer Name</label>
          <input
            className="border w-full px-3 py-1.5 rounded"
            value={offerData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., 20% Off"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 text-sm">Discount Type</label>
          <select
            className="border w-full px-3 py-1.5 rounded"
            value={offerData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="flat">flat</option>
            <option value="percentage">percentage</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 text-sm">Discount</label>
          <input
            className="border w-full px-3 py-1.5 rounded"
            type="number"
            value={offerData.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            placeholder="e.g., 20"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 text-sm">Code</label>
          <input
            className="border w-full px-3 py-1.5 rounded"
            value={offerData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            placeholder="e.g., SUPER123"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 text-sm">Offer Type</label>
          <select
            className="border w-full px-3 py-1.5 rounded"
            value={offerData.scope}
            onChange={(e) => handleChange("scope", e.target.value)}
          >
            <option value="Tiffin-wide">Tiffin-wide</option>
            <option value="MealType-specific">MealType-specific</option>
            <option value="MealPlan-Specific">MealPlan-Specific</option>
          </select>
        </div>

        {/* Meal Type Selection */}
        {offerData.scope === "MealType-specific" && (
          <div>
            <label className="block font-semibold text-gray-700">Select Meal Type</label>
            <div className="max-h-32 overflow-auto border p-2 rounded">
              <label className="block mb-2">
                <input
                  type="checkbox"
                  onChange={() =>
                    setOfferData((prev) => ({
                      ...prev,
                      mealTypes:
                        prev.mealTypes.length === mealTypes.length
                          ? []
                          : mealTypes.map((m) => m.mealTypeId),
                    }))
                  }
                  checked={offerData.mealTypes.length === mealTypes.length}
                />
                <span className="ml-2">Select All</span>
              </label>
              <div className="grid grid-cols-2">
                {mealTypes.map((meal) => (
                  <div className="flex gap-2 items-center" key={meal.mealTypeId}>
                    <input
                      type="checkbox"
                      value={meal.mealTypeId}
                      checked={offerData.mealTypes.includes(meal.mealTypeId)}
                      onChange={() => handleCheckboxChange(meal.mealTypeId, "mealTypes")}
                    />
                    <h3>{meal.label}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Meal Plan Selection */}
        {offerData.scope === "MealPlan-Specific" && (
          <div>
            <label className="block font-semibold text-gray-700">Select Meal Plan</label>
            <div className="overflow-auto border p-2 rounded">
              <label className="block mb-2">
                <input
                  type="checkbox"
                  onChange={() =>
                    setOfferData((prev) => ({
                      ...prev,
                      mealPlans:
                        prev.mealPlans.length === mealPlans.length
                          ? []
                          : mealPlans.map((m) => m._id),
                    }))
                  }
                  checked={offerData.mealPlans.length === mealPlans.length}
                />
                <span className="ml-2">Select All</span>
              </label>
              <div className="grid grid-cols-2">
                {mealPlans.map((plan) => (
                  <div className="flex gap-2 items-center" key={plan._id}>
                    <input
                      type="checkbox"
                      value={plan._id}
                      checked={offerData.mealPlans.includes(plan._id)}
                      onChange={() => handleCheckboxChange(plan._id, "mealPlans")}
                    />
                    <h3>{plan.label}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Dates offerData={offerData} setOfferData={setOfferData} />

        <button
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleSave}
        >
          Save Offer
        </button>
      </div>
    </div>
  );
}

export default CreateOfferForm;
