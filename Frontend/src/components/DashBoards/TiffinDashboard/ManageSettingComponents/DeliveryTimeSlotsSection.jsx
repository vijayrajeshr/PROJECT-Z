import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export function DeliveryTimeSlotsSection({ deliveryTimeSlots, setDeliveryTimeSlots }) {
  const handleAddSlot = () => {
    setDeliveryTimeSlots([...deliveryTimeSlots, ""]);
  };

  const handleSlotChange = (index, value) => {
    const updatedSlots = [...deliveryTimeSlots];
    updatedSlots[index] = value;
    setDeliveryTimeSlots(updatedSlots);
  };

  const handleRemoveSlot = (index) => {
    // Removes a slot
    const updatedSlots = deliveryTimeSlots.filter((_, i) => i !== index);
    setDeliveryTimeSlots(updatedSlots);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Time Slots</h2>
      <div className="space-y-4">
        {/* Map through existing slots to display them as editable inputs */}
        {deliveryTimeSlots.map((slot, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="text"
              value={slot} // Value is bound to the current slot string
              onChange={(e) => handleSlotChange(index, e.target.value)} // Changes update the specific slot
              placeholder="e.g., Lunch (9.00 AM - 2.00 PM)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => handleRemoveSlot(index)}
              className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
              title="Remove slot"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSlot} // Adds a new empty slot
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          <FaPlus />
          <span>Add Slot</span>
        </button>
      </div>
    </div>
  );
}