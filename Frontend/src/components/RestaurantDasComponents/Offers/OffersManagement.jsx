import React, { useState } from "react";
import axios from "axios";
import OffersList from "./OffersList"; // Adjust the import path as needed

const OffersManagement = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");

  // Function to handle editing an offer
  const handleEditOffer = async (offerId, updatedData) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/offers/${offerId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // Refresh the page or show success message
      alert("Offer updated successfully!");
      setError(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer. Please try again.");
    }
  };

  // Function to handle removing an offer
  const handleRemoveOffer = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/offers/delete-offer/${offerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        // Refresh the page or show success message
        alert("Offer deleted successfully!");
        window.location.reload();
        setError(null);
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert("Failed to delete offer. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Offers Management
      </h1>

      {/* Pass the handler functions to the OffersList component */}
      <OffersList
        onEditOffer={handleEditOffer}
        onRemoveOffer={handleRemoveOffer}
      />
    </div>
  );
};

export default OffersManagement;
