import React, { useState, useEffect } from 'react';

const Dates = ({ isEditMode, details, onChange }) => {
  // Convert UTC to Local Time for Display
  const formatToLocalTime = (utcDate) => {
    if (!utcDate) return '';
    const localDate = new Date(utcDate);
    // Format the date as "YYYY-MM-DDTHH:mm" for datetime-local input
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().slice(0, 16);
  };

  // State for start and end dates
  const [startDate, setStartDate] = useState(details?.startDate ? formatToLocalTime(details?.startDate) : '');
  const [endDate, setEndDate] = useState(details?.endDate ? formatToLocalTime(details?.endDate) : '');

  useEffect(() => {
    setStartDate(details?.startDate ? formatToLocalTime(details?.startDate) : '');
    setEndDate(details?.endDate ? formatToLocalTime(details?.endDate) : '');
  }, [details]);

  const handleStartDate = (e) => {
    const newDate = e.target.value;
    setStartDate(newDate);
    if (onChange) {
      // Convert local time back to UTC for the backend
      const utcDate = new Date(newDate).toISOString();
      onChange('startDate', utcDate);
    }
  };

  const handleEndDate = (e) => {
    const newDate = e.target.value;
    setEndDate(newDate);
    if (onChange) {
      // Convert local time back to UTC for the backend
      const utcDate = new Date(newDate).toISOString();
      onChange('endDate', utcDate);
    }
  };

  return (
    <div className="mb-8 mt-4">
      <div className="grid grid-cols-2 gap-16">
        {/* Start Date */}
        <div >
          <label className="block font-semibold text-gray-800 text-sm">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            className="w-full border px-3 py-2 rounded-md"
            onChange={handleStartDate}
            disabled={!isEditMode}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-semibold text-gray-800 text-sm">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            className="w-full border px-3 py-2 rounded-md "
            onChange={handleEndDate}
            min={startDate} // Ensure end date is after start date
            disabled={!isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Dates;