// OffersList.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function OffersList({
  offers = [],
  onRemoveOffer,
  onEditOffer,
  mealTypes = [],
  mealPlans = []
}) {
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    scope: "Tiffin-wide",
    type: "flat",
    mealTypes: [],
    mealPlans: [],
    startDate: "",
    endDate: ""
  });

  // Determine offer status based on current date vs. start and end dates.
  const getOfferStatus = (offer) => {
    const today = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    if (today < start) return "Upcoming";
    if (today > end) return "Expired";
    return "Active";
  };
  // Filter offers based on status and offer scope.
  const filteredOffers = offers.filter((offer) => {
    const status = getOfferStatus(offer);
    const statusMatch = statusFilter === "All" || status === statusFilter;
    const typeMatch = typeFilter === "All" || offer.scope === typeFilter;
    return statusMatch && typeMatch;
  });

  // When clicking edit, pre-populate the formData with the offer's current data.
  const handleEditClick = (offer) => {
    setEditingOfferId(offer._id);
    setFormData({
      name: offer.name || "",
      code: offer.code || "",
      discount: offer.discount || "",
      scope: offer.scope || "Tiffin-wide",
      type: offer.type || "flat",
      active:offer.active,
      // For MealType-specific, we keep an array of meal type IDs.
      mealTypes: offer.scope === "MealType-specific" && offer.mealTypes
        ? offer.mealTypes.map((mt) => mt.mealTypeId)
        : [],
      // For MealPlan-Specific, assume offer.mealPlans is already an array of strings.
      mealPlans: offer.scope === "MealPlan-Specific" && offer.mealPlans
        ? [...offer.mealPlans]
        : [],
      // For date inputs, extract the YYYY-MM-DD portion from the ISO string.
      startDate: offer.startDate ? offer.startDate.slice(0, 10) : "",
      endDate: offer.endDate ? offer.endDate.slice(0, 10) : ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value, key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handleSave = (offerId) => {
    // Prepare updated offer data
    const updatedOffer = {
      ...formData,
      discount: Number(formData.discount),
      // Convert date fields to ISO strings. (Assuming a local date input, we add time 00:00:00.)
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    // For MealType-specific offers, transform the array of IDs into objects with mealTypeId and label.
    if (updatedOffer.scope === "MealType-specific") {
      updatedOffer.mealTypes = mealTypes
        .filter((meal) => formData.mealTypes.includes(meal.mealTypeId))
        .map((meal) => ({
          mealTypeId: meal.mealTypeId,
          label: meal.label,
        }));
    } else {
      updatedOffer.mealTypes = [];
    }
    // For MealPlan-Specific, we assume the array of selected plan IDs (strings) is correct.
    if (updatedOffer.scope !== "MealPlan-Specific") {
      updatedOffer.mealPlans = [];
    }

    onEditOffer(offerId, updatedOffer);
    setEditingOfferId(null);
  };

  const handleCancelEdit = () => {
    setEditingOfferId(null);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Current Offers</h2>
        <div className="flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1 rounded mr-2 border border-gray-400 text-xs"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1 rounded border border-gray-400 text-xs"
          >
            <option value="All">All</option>
            <option value="Tiffin-wide">Tiffin-wide</option>
            <option value="MealType-specific">MealType-specific</option>
            <option value="MealPlan-Specific">MealPlan-Specific</option>
          </select>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        offers.length === 0 ? (
          <p className="text-gray-500">No offers created yet.</p>
        ) : (
          <p className="text-gray-500">No offers match the current filters.</p>
        )
      ) : (
        <div className="overflow-auto">
          <ul className="space-y-3 pr-2">
            <AnimatePresence>
              {filteredOffers.map((offer) => {
                const status = getOfferStatus(offer);
                const isEditing = editingOfferId === offer._id;
                return (
                  <motion.li
                    key={offer._id}
                    className="relative rounded p-4 flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Offer Name and Status */}
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded focus:outline-none focus:border-blue-400 w-full text-sm"
                            placeholder="Offer Name"
                          />
                          <span
                            className={`text-xs font-medium ${status === "Expired"
                              ? "text-red-500"
                              : status === "Upcoming"
                                ? "text-yellow-500"
                                : "text-green-500"
                              }`}
                          >
                            ({status})
                          </span>
                        </div>

                        {/* Code, Discount and Scope */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Code
                            </label>
                            <input
                              type="text"
                              name="code"
                              value={formData.code}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400"
                              placeholder="Offer Code"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 text-sm">Discount Type</label>
                            <select
                              className="border w-full px-3 py-1.5 rounded"
                              value={formData.type}
                              name="type"
                              onChange={handleChange}
                            >
                              <option value="flat">flat</option>
                              <option value="percentage">percentage</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Discount
                            </label>
                            <input
                              type="text"
                              name="discount"
                              value={formData.discount}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400"
                            />
                          </div>
                          <div className="">
                            <label className="block text-xs font-semibold text-gray-600">
                              Offer Type
                            </label>
                            <select
                              name="scope"
                              value={formData.scope}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400 text-sm bg-transparent"
                            >
                              <option value="Tiffin-wide">Tiffin-wide</option>
                              <option value="MealType-specific">MealType-specific</option>
                              <option value="MealPlan-Specific">MealPlan-Specific</option>
                            </select>
                          </div>
                        </div>

                        {/* Conditional Meal Type or Meal Plan Selection */}
                        {formData.scope === "MealType-specific" && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Select Meal Type
                            </label>
                            <div className="max-h-32 overflow-auto border p-2 rounded">
                              <label className="block mb-2">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      mealTypes:
                                        prev.mealTypes.length === mealTypes.length
                                          ? []
                                          : mealTypes.map((m) => m.mealTypeId),
                                    }))
                                  }
                                  checked={formData.mealTypes.length === mealTypes.length}
                                />
                                <span className="ml-2">Select All</span>
                              </label>
                              <div className="grid grid-cols-2">
                                {mealTypes.map((meal) => (
                                  <div
                                    className="flex gap-2 items-center"
                                    key={meal.mealTypeId}
                                  >
                                    <input
                                      type="checkbox"
                                      value={meal.mealTypeId}
                                      checked={formData.mealTypes.includes(meal.mealTypeId)}
                                      onChange={() =>
                                        handleCheckboxChange(meal.mealTypeId, "mealTypes")
                                      }
                                    />
                                    <span className="text-sm">{meal.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {formData.scope === "MealPlan-Specific" && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Select Meal Plan
                            </label>
                            <div className="overflow-auto border p-2 rounded">
                              <label className="block mb-2">
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      mealPlans:
                                        prev.mealPlans.length === mealPlans.length
                                          ? []
                                          : mealPlans.map((m) => m._id),
                                    }))
                                  }
                                  checked={formData.mealPlans.length === mealPlans.length}
                                />
                                <span className="ml-2">Select All</span>
                              </label>
                              <div className="grid grid-cols-2">
                                {mealPlans.map((plan) => (
                                  <div
                                    className="flex gap-2 items-center"
                                    key={plan._id}
                                  >
                                    <input
                                      type="checkbox"
                                      value={plan._id}
                                      checked={formData.mealPlans.includes(plan._id)}
                                      onChange={() =>
                                        handleCheckboxChange(plan._id, "mealPlans")
                                      }
                                    />
                                    <span className="text-sm">{plan.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Start and End Dates */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Start Date
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              End Date
                            </label>
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400 text-sm"
                            />
                          </div>
                        </div>

                        {/* Save / Cancel buttons */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-gren-700"
                            onClick={() => handleSave(offer._id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display offer details (non-edit mode)
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{offer.name}</p>
                            <span className={`text-xs font-medium ${status === "Expired"
                              ? "text-red-500"
                              : status === "Upcoming"
                                ? "text-yellow-500"
                                : "text-green-500"
                              }`}>
                              ({status})
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <FiEdit
                              className="text-blue-600 cursor-pointer hover:text-blue-800"
                              onClick={() => handleEditClick(offer)}
                            />
                            <FiTrash2
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => onRemoveOffer(offer?._id)}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>Discount Type: <span className="font-semibold text-gray-600">{offer.type}</span></p>
                          <p>Discount: <span className="font-semibold text-gray-600">{offer.discount}</span></p>
                          <p>Code: <span className="font-semibold text-gray-600">{offer.code}</span></p>
                          <p>Type: <span className="font-semibold text-gray-600">{offer.scope}</span></p>
                          <div className="flex gap-8">
                            <p>Start Date: <span className="font-semibold text-gray-600">{offer.startDate.slice(0, 10)}</span></p>
                            <p>End Date: <span className="font-semibold text-gray-600">{offer.endDate.slice(0, 10)}</span></p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OffersList;
