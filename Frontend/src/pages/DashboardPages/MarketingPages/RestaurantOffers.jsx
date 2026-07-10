// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import Offers from "../../../components/DashBoards/MarketingDashboard/RestaurantOffers/Offers";
import RestaurantsList from "../../../components/DashBoards/MarketingDashboard/RestaurantOffers/RestaurantsList";
import RestaurantMenu from "../../../components/DashBoards/MarketingDashboard/RestaurantOffers/RestaurantMenu";
import { motion } from "framer-motion";
import { useOffers } from "../../../context/OffersContext";

function RestaurantOffersMarketing() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const {offers} = useOffers()

  return (
    <div className="p-6 max-w-[1300px] mx-auto">
      <Offers />

      {/* <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6 mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Apply Offers
        </motion.h1>

      <div className="flex bg-white p-4 relative rounded shadow-sm h-[550px]">
        <RestaurantsList onSelect={setSelectedRestaurant} />
        <RestaurantMenu SelectedRestaurant={selectedRestaurant} offersList={offers} />
      </div> */}

    </div>
  )
}

export default RestaurantOffersMarketing;
