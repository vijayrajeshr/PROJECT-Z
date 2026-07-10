import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import dummy from "../../data/dummy";
import { initialOffers } from "../../data/offersData";
import { filterCategoriesByOffers } from "../../utils/FilterMenu";

import CreateOfferForm from "./CreateOfferForm";
import OffersList from "./OfferList";
import { dummyData } from "../../data/TiffinDummyData";
import { useContextData } from "../../context/OutletContext";
import {toast} from "react-toastify"
function Offers() {
  const { deliveryCategories, dineInCategories } = dummy;
  const [offers, setOffers] = useState([]);
  const [melaType, setmelaType] = useState([]);
  const [mealPlan, setmealPlan] = useState([]);
  const { axiosApi } = useContextData();
  const token=localStorage.getItem('token');
  useEffect(() => {
    const mapMenu = async () => {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/menu/email`,{headers:{Authorization:`Bearer ${token}`}}
      );
      setmealPlan(response.data.plans);
      setmelaType(response.data.mealTypes);
    };
    mapMenu();
  }, []);

  useEffect(() => {
    const getOffers = async () => {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/mail/offers`,{headers:{Authorization:`Bearer ${token}`}}
      );
      setOffers(response.data);
    };
    getOffers();
  }, []);

  const BASE_URL = `${
    import.meta.env.VITE_SERVER_URL
  }/api/mail/offers`;

  const createOffer = async (offerData) => {
    const response = await axiosApi.post(BASE_URL, offerData,{headers:{Authorization:`Bearer ${token}`}});
    // return response.data;
      toast.success("OFFER is created admin need to accept !");
    // setOffers((prev) => [...prev, offerData]);
  };

  const updateOffer = async (offerId, offerData) => {
    console.log(offerData);
    const response = await axiosApi.put(
      `${BASE_URL}/${offerId}`,
      offerData,
      {headers:{Authorization:`Bearer ${token}`}}
    );
    // return response.data;
    setOffers((prev) =>
      prev.map((off) => (off._id === offerId ? { ...off, ...offerData } : off))
    );
  };

  const deleteOffer = async (offerId) => {
    console.log(offerId);
    const confirmed = window.confirm(
      "Are you sure want to delte this offer. Continue?"
    );
    if (!confirmed) return;
    const response = await axiosApi.delete(`${BASE_URL}/${offerId}`,{headers:{Authorization:`Bearer ${token}`}});
    // return response.data;
    setOffers((prev) => prev.filter((off) => off._id !== offerId));
  };

  const updateOfferStatus = async () => {
    try {
      await axiosApi.patch(`${BASE_URL}/update-status`,{headers:{Authorization:`Bearer ${token}`}});
      // console.log("Offer status updated");
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  updateOfferStatus();
  setInterval(updateOfferStatus, 23 * 60 * 60 * 1000);

  return (
    <motion.div
      className="bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="">
        <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
          {/* Left Column: Create Offer Form */}
          <div className="flex-1 bg-white shadow-sm rounded  ">
            <CreateOfferForm
              onSave={createOffer}
              mealTypes={melaType}
              mealPlans={mealPlan}
            />
          </div>

          {/* Right Column: Offers List */}
          <div className="flex-1 bg-white shadow-sm rounded p-4">
            <OffersList
              offers={offers}
              onRemoveOffer={deleteOffer}
              onEditOffer={updateOffer}
              mealTypes={melaType}
              mealPlans={mealPlan}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Offers;
