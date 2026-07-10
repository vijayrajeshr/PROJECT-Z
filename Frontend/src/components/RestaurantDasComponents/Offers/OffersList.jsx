import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";

function OffersList({ onRemoveOffer, onEditOffer, offers, title }) {
  const token = localStorage.getItem("token");
  const [offers1, setOffers] = useState(offers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    validUntil: "",
  });

  // Fetch all offers from backend
  useEffect(() => {
    if (offers && offers.length > 0) {
      setOffers(offers);
      setLoading(false);
    } else {
      setOffers([]);
      setLoading(false); // still update loading to false if empty
    }
  }, [offers]);

  const isExpired = (offer) => {
    return offer.endDate && new Date() > new Date(offer.endDate);
  };

  const handleEditClick = (offer) => {
    setEditingOfferId(offer._id);
    setFormData({
      name: offer.name,
      code: offer.code,
      discount: offer.discountValue?.toString()
        ? offer.discountValue?.toString()
        : offer.bundlePrice?.toString() || "",
      validUntil: offer.endDate
        ? new Date(offer.endDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (offerId) => {
    onEditOffer(offerId, {
      name: formData.name,
      code: formData.code,
      discountValue: parseFloat(
        formData.discount ? formData.discount : formData.bundlePrice
      ),
      endDate: formData.validUntil,
    });
    setEditingOfferId(null);
  };

  const handleCancelEdit = () => {
    setEditingOfferId(null);
  };

  const getTargetDescription = (offer) => {
    if (offer.scope === "category" && offer.category) {
      return `Applied to category: ${offer.category || "Unknown"}`;
    }
    if (offer.scope === "subcategory" && offer.subcategory) {
      return `Applied to subcategory: ${offer.subcategory || "Unknown"}`;
    }
    if (offer.scope === "item" && offer.items) {
      return `Applied to items: ${offer?.itemName || "None"}`;
    }
    return "";
  };

  const getScopeBadgeClass = (scope) => {
    switch (scope) {
      case "item":
        return "bg-blue-100 text-blue-800";
      case "subcategory":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error)
    return <div className="mt-8 text-center text-red-600">{error}</div>;
  const getOfferLabel = (offer) => {
    if (offer.offerType === "percentage") return `${offer.discountValue}%`;
    if (offer.offerType === "fixed") return `$${offer.discountValue}`;
    if (offer.offerType === "bundle") return `$${offer.discountValue}`;
    return "";
  };
  return (
    <div className="mt-8 ">
      <h2 className="text-xl font-bold mb-2 text-gray-800 overflow-y-auto">
        {title}
      </h2>

      {offers1.length === 0 ? (
        <p className="text-gray-500 italic">No offers created yet.</p>
      ) : (
        <div className="overflow-auto">
          <ul className="space-y-3 pr-2">
            <AnimatePresence>
              {offers1.map((offer, index) => {
                const expired = isExpired(offer);
                const scopeBg = getScopeBadgeClass(offer.scope);
                const targetDescription = getTargetDescription(offer);
                const isEditing = editingOfferId === offer._id;

                return (
                  <motion.li
                    key={offer._id || index}
                    className="relative rounded p-4 flex flex-col border  border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded focus:outline-none focus:border-blue-400 w-full text-sm"
                            placeholder="Offer Name"
                          />
                          {expired && (
                            <span className="text-xs text-red-500 font-medium">
                              (Expired)
                            </span>
                          )}
                        </div>

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
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Discount
                            </label>
                            <input
                              type="number"
                              name="discount"
                              value={
                                formData.discount
                                  ? formData.discount
                                  : formData.bundlePrice
                              }
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400"
                              placeholder="Percentage or amount"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <span
                            className={`px-2 py-0.5 font-semibold rounded ${scopeBg}`}
                          >
                            {offer.scope}
                          </span>
                          <span className="text-gray-500">
                            {targetDescription}
                          </span>
                        </div>

                        <div className="mt-2">
                          <label className="block text-xs font-semibold text-gray-600">
                            Expires On
                          </label>
                          <input
                            type="date"
                            name="validUntil"
                            value={formData.validUntil}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded w-full focus:outline-none focus:border-blue-400 text-sm"
                          />
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
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
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-base">
                              {offer.name}
                            </p>
                            {expired && (
                              <span className="text-xs text-red-500 font-medium">
                                (Expired)
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <PencilIcon
                              className="h-5 w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                              onClick={() => handleEditClick(offer)}
                            />
                            <TrashIcon
                              className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => onRemoveOffer(offer._id)}
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-700 space-y-1">
                          <p>
                            Code: <strong>{offer.code}</strong>
                          </p>
                          <p>
                            Discount: <strong>{getOfferLabel(offer)}</strong>
                          </p>

                          {offer.applicability && (
                            <p>
                              Applicable:{" "}
                              <strong>
                                {offer.applicability === "both"
                                  ? "Online & In-store"
                                  : offer.applicability === "online"
                                  ? "Online Only"
                                  : "In-store Only"}
                              </strong>
                            </p>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            {offer.scope && (
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded ${scopeBg}`}
                              >
                                {offer.scope}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {targetDescription}
                            </span>
                            {offer.startDate && (
                              <span className="text-xs text-gray-400">
                                Valid from {formatDate(offer.startDate)}
                              </span>
                            )}
                            {offer.endDate && (
                              <span className="text-xs text-gray-400">
                                Expires on {formatDate(offer.endDate)}
                              </span>
                            )}
                            {offer.suggestion && (
                              <span className="text-xs text-black">
                                Suggestion from Admin : {offer.suggestion}
                              </span>
                            )}
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

OffersList.propTypes = {
  onRemoveOffer: PropTypes.func.isRequired,
  onEditOffer: PropTypes.func.isRequired,
};

export default OffersList;
