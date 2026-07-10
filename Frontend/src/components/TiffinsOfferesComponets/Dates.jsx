// import React, { useEffect, useState } from 'react';

// const Dates = ({ offerData, setOfferData }) => {
//   // Convert UTC to Local Time for Display
//   const formatDateForInput = (date) => {
//     if (!date) return '';
//     return new Date(date).toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"
//   };

//   // Convert Local Time back to UTC before saving
//   const handleDateChange = (field, value) => {
//     const utcDate = new Date(value).toISOString(); // Convert to UTC
//     setOfferData((prev) => ({ ...prev, [field]: utcDate }));
//   };

//   return (
//     <div className="mb-4 mt-4">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Start Date */}
//         <div>
//           <label className="block font-semibold text-gray-700 text-sm">Start Date</label>
//           <input
//             type="datetime-local"
//             value={formatDateForInput(offerData.startDate)}
//             className="w-full border px-3 py-2 rounded-md bg-gray-100 text-sm"
//             onChange={(e) => handleDateChange('startDate', e.target.value)}
//           />
//         </div>

//         {/* End Date */}
//         <div>
//           <label className="block font-semibold text-gray-700 text-sm">End Date</label>
//           <input
//             type="datetime-local"
//             value={formatDateForInput(offerData.endDate)}
//             className="w-full border px-3 py-2 rounded-md bg-gray-100 text-sm"
//             onChange={(e) => handleDateChange('endDate', e.target.value)}
//             min={formatDateForInput(offerData.startDate)} // Ensure end date is after start date
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dates;

import React from "react";

const Dates = ({ offerData, setOfferData }) => {
  // Format a given date (string or Date) for the input field.
  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  };

  // When the user changes a date, convert the local datetime to an ISO string.
  const handleDateChange = (field, value) => {
    const utcDate = new Date(value).toISOString();
    setOfferData((prev) => ({ ...prev, [field]: utcDate }));
  };

  return (
    <div className="mb-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block font-semibold text-gray-700 text-sm">Start Date</label>
          <input
            type="datetime-local"
            value={formatDateForInput(offerData.startDate)}
            className="w-full border px-3 py-2 rounded-md bg-gray-100 text-sm"
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block font-semibold text-gray-700 text-sm">End Date</label>
          <input
            type="datetime-local"
            value={formatDateForInput(offerData.endDate)}
            className="w-full border px-3 py-2 rounded-md bg-gray-100 text-sm"
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            min={formatDateForInput(offerData.startDate)} // Ensure end date is after start date
          />
        </div>
      </div>
    </div>
  );
};

export default Dates;
