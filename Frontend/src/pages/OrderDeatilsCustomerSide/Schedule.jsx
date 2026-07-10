// // import React, { useState } from "react";

// // export const Schedule = ({ onClose, onSave }) => {
// //   const [selectedDay, setSelectedDay] = useState("Monday");
// //   const [selectedTime, setSelectedTime] = useState("");

// //   const timeSlots = [
// //     {
// //       day: "Monday",
// //       slots: [
// //         "2:00 AM - 2:30 AM", "3:00 AM - 3:30 AM", "4:00 AM - 4:30 AM",
// //         "5:00 AM - 5:30 AM", "6:00 AM - 6:30 AM", "7:00 AM - 7:30 AM",
// //         "8:00 AM - 8:30 AM", "9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM",
// //         "11:00 AM - 11:30 AM", "12:00 PM - 12:30 PM", "1:00 PM - 1:30 PM",
// //         "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM", "4:00 PM - 4:30 PM"
// //       ],
// //     },
// //     {
// //       day: "Tuesday",
// //       slots: [
// //         "1:00 AM - 1:30 AM", "2:00 AM - 2:30 AM", "3:00 AM - 3:30 AM",
// //         "4:00 AM - 4:30 AM", "5:00 AM - 5:30 AM", "6:00 AM - 6:30 AM",
// //         "7:00 AM - 7:30 AM", "8:00 AM - 8:30 AM", "9:00 AM - 9:30 AM",
// //         "10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM", "12:00 PM - 12:30 PM",
// //         "1:00 PM - 1:30 PM", "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM"
// //       ],
// //     },
// //     {
// //       day: "Wednesday",
// //       slots: [
// //         "5:00 AM - 5:30 AM", "6:00 AM - 6:30 AM", "7:00 AM - 7:30 AM",
// //         "8:00 AM - 8:30 AM", "9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM",
// //         "11:00 AM - 11:30 AM", "12:00 PM - 12:30 PM", "1:00 PM - 1:30 PM",
// //         "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM", "4:00 PM - 4:30 PM",
// //         "5:00 PM - 5:30 PM", "6:00 PM - 6:30 PM", "7:00 PM - 7:30 PM"
// //       ],
// //     },
// //     {
// //       day: "Thursday",
// //       slots: [
// //         "7:00 AM - 7:30 AM", "8:00 AM - 8:30 AM", "9:00 AM - 9:30 AM",
// //         "10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM", "12:00 PM - 12:30 PM",
// //         "1:00 PM - 1:30 PM", "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM",
// //         "4:00 PM - 4:30 PM", "5:00 PM - 5:30 PM", "6:00 PM - 6:30 PM",
// //         "7:00 PM - 7:30 PM", "8:00 PM - 8:30 PM", "9:00 PM - 9:30 PM"
// //       ],
// //     },
// //     {
// //       day: "Friday",
// //       slots: [
// //         "9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM",
// //         "12:00 PM - 12:30 PM", "1:00 PM - 1:30 PM", "2:00 PM - 2:30 PM",
// //         "3:00 PM - 3:30 PM", "4:00 PM - 4:30 PM", "5:00 PM - 5:30 PM",
// //         "6:00 PM - 6:30 PM", "7:00 PM - 7:30 PM", "8:00 PM - 8:30 PM",
// //         "9:00 PM - 9:30 PM", "10:00 PM - 10:30 PM", "11:00 PM - 11:30 PM"
// //       ],
// //     },
// //     {
// //       day: "Saturday",
// //       slots: [
// //         "11:00 AM - 11:30 AM", "12:00 PM - 12:30 PM", "1:00 PM - 1:30 PM",
// //         "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM", "4:00 PM - 4:30 PM",
// //         "5:00 PM - 5:30 PM", "6:00 PM - 6:30 PM", "7:00 PM - 7:30 PM",
// //         "8:00 PM - 8:30 PM", "9:00 PM - 9:30 PM", "10:00 PM - 10:30 PM",
// //         "11:00 PM - 11:30 PM", "12:00 AM - 12:30 AM", "1:00 AM - 1:30 AM"
// //       ],
// //     },
// //     {
// //       day: "Sunday",
// //       slots: [
// //         "1:00 PM - 1:30 PM", "2:00 PM - 2:30 PM", "3:00 PM - 3:30 PM",
// //         "4:00 PM - 4:30 PM", "5:00 PM - 5:30 PM", "6:00 PM - 6:30 PM",
// //         "7:00 PM - 7:30 PM", "8:00 PM - 8:30 PM", "9:00 PM - 9:30 PM",
// //         "10:00 PM - 10:30 PM", "11:00 PM - 11:30 PM", "12:00 AM - 12:30 AM",
// //         "1:00 AM - 1:30 AM", "2:00 AM - 2:30 AM", "3:00 AM - 3:30 AM"
// //       ],
// //     },
// //   ];

// //   const handleDayClick = (day) => {
// //     setSelectedDay(day);
// //     setSelectedTime("");
// //   };

// //   const handleTimeSelect = (time) => {
// //     setSelectedTime(time);
// //   };

// //   // When user clicks "Schedule", we call onSave with day, month, and time
// //   const handleScheduleClick = () => {
// //     if (selectedTime) {
// //       // Get the current month (or you can calculate a future date if needed)
// //       const currentMonthName = new Date().toLocaleString("default", {
// //         month: "long",
// //       });
// //       // Pass back a string like "Monday, March 2:00 AM - 2:30 AM"
// //       onSave(`${selectedDay}, ${currentMonthName} ${selectedTime}`);
// //     } else {
// //       alert("Please select a time slot before scheduling.");
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
// //       <div className="bg-white text-black rounded-lg w-96 p-6 shadow-lg">
// //         <h2 className="text-lg font-bold mb-4">Select a Day</h2>

// //         {/* Horizontal Scrollable Days */}
// //         <div className="flex gap-2 overflow-x-auto pb-2">
// //           {timeSlots.map((slot, index) => (
// //             <button
// //               key={index}
// //               className={`p-2 rounded-lg text-center whitespace-nowrap ${
// //                 selectedDay === slot.day
// //                   ? "bg-black text-white font-semibold"
// //                   : "bg-gray-200"
// //               }`}
// //               onClick={() => handleDayClick(slot.day)}
// //             >
// //               {slot.day}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Time Slots */}
// //         {selectedDay && (
// //           <div className="p-1 mt-4">
// //             <h3 className="text-md font-semibold mb-2">
// //               {selectedDay} - Select a Time
// //             </h3>
// //             <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
// //               {timeSlots
// //                 .find((slot) => slot.day === selectedDay)
// //                 .slots.map((time, index) => (
// //                   <label
// //                     key={index}
// //                     className="flex items-center gap-2 p-2 rounded-lg bg-white text-black border"
// //                   >
// //                     <input
// //                       type="radio"
// //                       name="time"
// //                       value={time}
// //                       checked={selectedTime === time}
// //                       onChange={() => handleTimeSelect(time)}
// //                     />
// //                     <span>{time}</span>
// //                   </label>
// //                 ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Buttons: Schedule and Cancel */}
// //         <div className="mt-6 flex justify-end gap-2">
// //           <button
// //             className="px-4 py-2 text-sm font-medium bg-gray-200 text-black rounded-lg hover:bg-gray-300"
// //             onClick={() => onClose(false)}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-700"
// //             onClick={handleScheduleClick}
// //           >
// //             Schedule
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// import React, { useState } from "react";

// export const Schedule = ({ onClose, onSave }) => {
//   const [selectedDay, setSelectedDay] = useState("Monday");
//   const [selectedTime, setSelectedTime] = useState("");

//   const generateTimeSlots = () => {
//     const days = [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ];
//     const startTimes = [
//       "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM",
//       "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
//       "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
//       "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
//     ];

//     const slots = [];
//     const today = new Date();
//     const startOfWeek = new Date(
//       today.setDate(today.getDate() - today.getDay() + 1)
//     );

//     days.forEach((day, index) => {
//       const dayDate = new Date(
//         startOfWeek.setDate(startOfWeek.getDate() + index)
//       );
//       const formattedDay = dayDate.toLocaleDateString("default", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       });

//       const daySlots = startTimes.map((startTime) => {
//         const [time, period] = startTime.split(" ");
//         let [hours, minutes] = time.split(":").map(Number);
//         if (period === "PM" && hours !== 12) hours += 12;
//         if (period === "AM" && hours === 12) hours = 0;

//         const slotDate = new Date(
//           dayDate.getFullYear(),
//           dayDate.getMonth(),
//           dayDate.getDate(),
//           hours,
//           minutes
//         );

//         return {
//           time: startTime,
//           date: slotDate.toISOString(),
//         };
//       });

//       slots.push({ day: formattedDay, slots: daySlots });
//     });

//     return slots;
//   };

//   const timeSlots = generateTimeSlots();

//   const handleDayClick = (day) => {
//     setSelectedDay(day);
//     setSelectedTime("");
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   const handleScheduleClick = () => {
//     if (selectedTime) {
//       onSave(selectedTime);
//     } else {
//       alert("Please select a time slot before scheduling.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white text-black rounded-lg w-96 p-6 shadow-lg">
//         <h2 className="text-lg font-bold mb-4">Select a Day</h2>

//         {/* Horizontal Scrollable Days */}
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {timeSlots.map((slot, index) => (
//             <button
//               key={index}
//               className={`p-2 rounded-lg text-center whitespace-nowrap ${
//                 selectedDay === slot.day
//                   ? "bg-black text-white font-semibold"
//                   : "bg-gray-200"
//               }`}
//               onClick={() => handleDayClick(slot.day)}
//             >
//               {slot.day}
//             </button>
//           ))}
//         </div>

//         {/* Time Slots */}
//         {selectedDay && (
//           <div className="p-1 mt-4">
//             <h3 className="text-md font-semibold mb-2">
//               {selectedDay} - Select a Time
//             </h3>
//             <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
//               {timeSlots
//                 .find((slot) => slot.day === selectedDay)
//                 ?.slots.map((time, index) => (
//                   <label
//                     key={index}
//                     className="flex items-center gap-2 p-2 rounded-lg bg-white text-black border"
//                   >
//                     <input
//                       type="radio"
//                       name="time"
//                       value={time.date}
//                       checked={selectedTime === time.date}
//                       onChange={() => handleTimeSelect(time.date)}
//                     />
//                     <span>{time.time}</span>
//                   </label>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Buttons: Schedule and Cancel */}
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             className="px-4 py-2 text-sm font-medium bg-gray-200 text-black rounded-lg hover:bg-gray-300"
//             onClick={() => onClose(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-700"
//             onClick={handleScheduleClick}
//           >
//             Schedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";

export const Schedule = ({ onClose, onSave }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlotsForDay, setTimeSlotsForDay] = useState([]);

  useEffect(() => {
    const generateDaysAndInitialSlots = () => {
      const now = new Date();
      const nextTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const daysMap = {};
      const interval = 30 * 60 * 1000;

      let currentTime = new Date(now);
      currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30);

      while (currentTime < nextTwoWeeks) {
        const day = new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(currentTime);

        const time = new Intl.DateTimeFormat("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(currentTime);

        if (!daysMap[day]) {
          daysMap[day] = [];
        }
        daysMap[day].push({ label: time, value: currentTime.toISOString() });

        currentTime.setTime(currentTime.getTime() + interval);
      }

      setAvailableDays(Object.keys(daysMap).sort((a, b) => new Date(a) - new Date(b)));
      // Set initial slots for the first available day
      const firstDay = Object.keys(daysMap).sort((a, b) => new Date(a) - new Date(b))[0];
      if (firstDay) {
        setTimeSlotsForDay(daysMap[firstDay]);
        setSelectedDay(firstDay);
      }
    };

    generateDaysAndInitialSlots();
  }, []);

  useEffect(() => {
    const generateTimeSlotsForSelectedDay = () => {
      if (!selectedDay) {
        setTimeSlotsForDay([]);
        setSelectedTime("");
        return;
      }

      const now = new Date();
      const targetDayStart = new Date(selectedDay);
      targetDayStart.setHours(0, 0, 0, 0);
      const targetDayEnd = new Date(selectedDay);
      targetDayEnd.setHours(23, 59, 59, 999);
      const nextDay = new Date(targetDayStart);
      nextDay.setDate(nextDay.getDate() + 1);

      const slots = [];
      const interval = 30 * 60 * 1000;
      let currentTime = new Date(now);

      // If the selected day is today, start from the next available slot
      if (targetDayStart.toDateString() === now.toDateString()) {
        currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30);
      } else {
        currentTime = new Date(targetDayStart);
        currentTime.setHours(0, Math.ceil(currentTime.getMinutes() / 30) * 30 % 60, 0, 0);
        if (currentTime.getHours() < 0) currentTime.setHours(0, 0, 0, 0);
      }

      while (currentTime < nextDay) {
        const formattedTime = new Intl.DateTimeFormat("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(currentTime);
        slots.push({ label: formattedTime, value: currentTime.toISOString() });
        currentTime.setTime(currentTime.getTime() + interval);
        if (targetDayStart.toDateString() !== now.toDateString() && currentTime.getHours() >= 24) break;
        if (targetDayStart.toDateString() === now.toDateString() && currentTime >= nextDay) break;
      }

      setTimeSlotsForDay(slots);
      setSelectedTime(""); // Reset selected time when day changes
    };

    generateTimeSlotsForSelectedDay();
  }, [selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleTimeSelect = (value) => {
    setSelectedTime(value);
  };

  const handleScheduleClick = () => {
    if (selectedTime) {
      onSave(selectedTime);
    } else {
      alert("Please select a time slot before scheduling.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Schedule Pickup</h2>

        {/* Horizontal Scrollable Days */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {availableDays.map((day) => (
            <button
              key={day}
              className={`p-2 rounded-lg text-center whitespace-nowrap ${
                selectedDay === day ? "bg-black text-white font-semibold" : "bg-gray-200"
              }`}
              onClick={() => handleDayClick(day)}
            >
              {new Date(day).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
            </button>
          ))}
          {availableDays.length === 0 && (
            <p className="text-sm text-gray-500">No days available for scheduling.</p>
          )}
        </div>

        {/* Time Slots for the selected day */}
        {selectedDay && (
          <div className="p-1 mt-2">
            <h3 className="text-md font-semibold mb-2">{new Date(selectedDay).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} - Select Time</h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {timeSlotsForDay.map((slot) => (
                <label
                  key={slot.value}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white text-black border"
                >
                  <input
                    type="radio"
                    name="time"
                    value={slot.value}
                    checked={selectedTime === slot.value}
                    onChange={() => handleTimeSelect(slot.value)}
                  />
                  <span>{slot.label}</span>
                </label>
              ))}
              {timeSlotsForDay.length === 0 && (
                <p className="text-sm text-gray-500">No time slots available for this day.</p>
              )}
            </div>
          </div>
        )}

        {/* Buttons: Schedule and Cancel */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium bg-gray-200 text-black rounded-lg hover:bg-gray-300"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-700"
            onClick={handleScheduleClick}
            disabled={!selectedTime}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};