import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios'

import CreateOfferForm from "./CreateOfferForm";
import OffersList from "./OffersList";
import { useOffers } from "../../../../context/OffersContext";

function Offers() {
  const {offers, handleAddOffer, handleRemoveOffer, handleEditOffer} = useOffers()

  return (
    <motion.div
      className="bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage Offers
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
          {/* Left Column: Create Offer Form */}
          <div className="flex-1 bg-white shadow-sm rounded py-6 px-4 h-fit">
            <CreateOfferForm onSave={handleAddOffer} />
          </div>

          {/* Right Column: Offers List */}
          <div className="flex-1 bg-white shadow-sm rounded p-4">
            <OffersList
              offers={offers}
              handleDeleteOffer={handleRemoveOffer}
              onEditOffer={handleEditOffer}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Offers;
