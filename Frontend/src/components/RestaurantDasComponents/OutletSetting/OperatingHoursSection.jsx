"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ... your existing utility code (daysOfWeek, maps, convertTo24Hr, etc.)

export default function OperatingHoursSection() {
  // ... your existing state + logic

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
        Operating Hours and Offers
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Operating Hours */}
      <section className="space-y-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4 border-b pb-4"
          >
            <span className="font-medium text-center sm:text-left">{day}</span>

            {/* Time inputs */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <input
                type="time"
                value={timings[day].openTime}
                onChange={(e) =>
                  handleTimingChange(day, "openTime", e.target.value)
                }
                className="w-full border rounded p-2"
              />
              <span className="hidden sm:inline">to</span>
              <input
                type="time"
                value={timings[day].closeTime}
                onChange={(e) =>
                  handleTimingChange(day, "closeTime", e.target.value)
                }
                className="w-full border rounded p-2"
              />
            </div>

            {/* Save button */}
            <button
              onClick={() => saveTiming(day)}
              disabled={loading}
              className="bg-red-500 text-white w-full md:w-40 px-3 py-2 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
            >
              Save
            </button>
          </div>
        ))}
      </section>

      {/* Offers Section */}
      <section className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
          Set Offers
        </h3>

        <div className="space-y-4">
          <select
            value={selectedOfferDay}
            onChange={(e) => setSelectedOfferDay(e.target.value)}
            className="w-full border rounded p-2"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Time slots */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time Slots:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <label
                    key={slot}
                    className="flex items-center space-x-2 bg-gray-50 rounded p-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTimeSlots.includes(slot)}
                      onChange={() => handleTimeSlotToggle(slot)}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{slot}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No time slots available.</p>
              )}
            </div>
          </div>

          {/* Offer dropdown */}
          <select
            value={selectedOffer}
            onChange={(e) => setSelectedOffer(e.target.value)}
            className="w-full border rounded p-2"
            disabled={loading || !Object.keys(itemMap).length}
          >
            <option value="">Select an offer</option>
            {Object.values(itemMap)
              .filter(
                (e) =>
                  e.applicability === "dining" || e.applicability === "both"
              )
              .map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.name || offer.description || `Offer ${offer._id}`}
                </option>
              ))}
          </select>

          <button
            onClick={handleAddOffer}
            disabled={loading || !selectedOffer || !selectedTimeSlots.length}
            className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            Add Offer
          </button>
        </div>
      </section>

      {/* Current Offers */}
      <section className="border-t pt-8 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Current Offers
        </h3>

        {/* Day tabs */}
        <div className="flex flex-wrap justify-center md:justify-start border-b mb-6">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                selectedDay === day
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Offers list */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {currentOffers.length > 0 ? (
            currentOffers
              .filter(
                (offerDay) =>
                  (dayMap[offerDay.day] || offerDay.day) === selectedDay
              )
              .map((offerDay) => (
                <div key={offerDay._id} className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    {dayMap[offerDay.day] || offerDay.day}
                  </h4>
                  {offerDay.timeSlots?.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                      {offerDay.timeSlots.map((slot, idx) => (
                        <ul key={idx} className="list-disc pl-6 mb-3">
                          {slot.offers.map((offer) => (
                            <li
                              key={offer._id}
                              className="text-gray-600 py-1 hover:text-blue-600 transition-colors"
                            >
                              <span className="font-medium">
                                {offer?.name || `Offer ${offer._id}`}
                              </span>{" "}
                              at <span className="text-gray-500">{slot.slot}</span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No offers set for this day.
                    </p>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center italic">
              No offers available for {selectedDay}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

OperatingHoursSection.propTypes = {
  id: PropTypes.string,
  token: PropTypes.string,
};
