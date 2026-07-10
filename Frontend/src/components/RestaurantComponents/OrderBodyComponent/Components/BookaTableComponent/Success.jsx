import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessPopup = ({ goBack, setOrder }) => {
  const handleOk = () => {
    setOrder(false);
    goBack();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
    
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg text-center w-80"
      >
        <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
        <h2 className="text-xl font-semibold mt-3">Booking Successful!</h2>
        <p className="text-gray-600 mt-2">
          Your Booking has been placed successfully.
        </p>
        <button
          onClick={() => handleOk()}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          OK
        </button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPopup;
