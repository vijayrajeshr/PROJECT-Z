// src/components/Offers/CreateOfferForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
// import Dates from "../RightPanel/Dates";

function CreateOfferForm({ onSave }) {
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [type, setType] = useState("Restaurant-wide")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSave = () => {
    const adjustToUTC = (dateString) => {
      if (!dateString) return "";
      // new Date(dateString) treats the string as local time.
      // toISOString() returns the UTC time.
      return new Date(dateString).toISOString();
    };

    const newOffer = {
      name,
      discount,
      type,
      startDate: adjustToUTC(startDate), // converts local -> UTC
      endDate: adjustToUTC(endDate)
    };
    onSave(newOffer);

    // Reset form
    setName("");
    setDiscount("");
    setType(""),
    setStartDate(""),
    setEndDate("")
  };

  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  };
  
  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  };
  

  return (
    <motion.div
      className="border p-4 rounded shadow-md h-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Create a New Offer
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block font-semibold text-gray-700">
            Offer Name
          </label>
          <input
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., 20% Off Starters"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Discount</label>
          <input
            className="border w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="e.g., 20%, $5, BOGO"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 ">Offer Type</label>
          <select
            className="border bg-gray-100 w-full px-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Restaurant-wide">Restaurant-wide</option>
            <option value="Dish-specific">Dish-specific</option>
            <option value="Menu-wide discounts">Menu-wide discounts</option>
            <option value="Tiffin Services">Tiffin Services</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block font-semibold text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            value={startDate ? startDate.slice(0, 16) : ""}
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
            onChange={handleStartDate}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-semibold text-gray-700">End Date</label>
          <input
            type="datetime-local"
            value={endDate ? endDate.slice(0, 16) : ""}
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
            onChange={handleEndDate}
            min={startDate} // Ensure end date is after start date
          />
        </div>
      </div>
 
        <button
          className="mt-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          Save Offer
        </button>
      </div>
    </motion.div>
  );
}

export default CreateOfferForm;
