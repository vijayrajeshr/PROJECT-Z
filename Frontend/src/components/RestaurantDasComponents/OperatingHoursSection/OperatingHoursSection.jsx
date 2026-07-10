import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const operatingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const API_URL = `${import.meta.env.VITE_SERVER_URL}`;

export const OperatingHoursSection = () => {
  const [timings, setTimings] = useState(
    operatingDays.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { openTime: "09:00", closeTime: "22:00" },
      }),
      {}
    )
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("operatingHours");
  const { id } = useParams();

  useEffect(() => {
    fetchOperatingHours();
  }, []);

  const normalizeDayName = (dbDay) => {
    return operatingDays.find((day) => dbDay.startsWith(day)) || dbDay;
  };

  const fetchOperatingHours = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/operating-hours/gethours/${id}`
      );

      const data = response?.data?.opening_hours || {};

      const newTimings = { ...timings };

      for (const [dbDay, range] of Object.entries(data)) {
        const day = normalizeDayName(dbDay);
        const [open, close] = range.split("-");

        newTimings[day] = {
          openTime: convertTo24Hr(open?.trim()),
          closeTime: convertTo24Hr(close?.trim()),
        };
      }

      setTimings(newTimings);
    } catch (error) {
      console.error("Error fetching opening hours:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertTo24Hr = (time12h) => {
    if (!time12h) return "00:00";
    const [time, modifier] = time12h.trim().split(/(AM|PM)/);
    let [hours, minutes] = time.trim().split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes || "00", 10); // handle cases like "5PM"

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const convertTo12Hr = (time24h) => {
    const [hour, minute] = time24h.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const h = ((hour + 11) % 12) + 1;
    return `${h}:${minute.toString().padStart(2, "0")}${suffix}`;
  };

  const handleTimingChange = (day, type, value) => {
    setTimings((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const saveTiming = async (day) => {
    try {
      setLoading(true);
      const { openTime, closeTime } = timings[day];
      const open12 = convertTo12Hr(openTime);
      const close12 = convertTo12Hr(closeTime);

      await axios.put(
        `${API_URL}/api/operating-hours/${id}`,
        {
          day,
          time: `${open12.replace(/:\d{2}/g, "")}-${close12.replace(
            /:\d{2}/g,
            ""
          )}`,
        },
        { withCredentials: true }
      );

      alert(`Opening hours for ${day} updated successfully.`);
    } catch (error) {
      console.error("Error updating opening hours:", error);
      alert("Failed to update opening hours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Buttons */}
      <div className="border-b mb-4 flex">
        {["operatingHours"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {tab === "operatingHours" && "Operating Hours"}
          </button>
        ))}
      </div>

      {/* Operating Hours Section */}
      {activeTab === "operatingHours" && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Operating Hours</h2>
          {operatingDays.map((day) => (
            <div
              key={day}
              className="grid grid-cols-4 max-w-3xl items-center gap-4"
            >
              <span className="font-medium">{day}</span>
              <div className="flex items-center space-x-2 col-span-2">
                <input
                  type="time"
                  value={timings[day]?.openTime || "09:00"}
                  onChange={(e) =>
                    handleTimingChange(day, "openTime", e.target.value)
                  }
                  className="w-full border rounded p-2"
                />
                <span>to</span>
                <input
                  type="time"
                  value={timings[day]?.closeTime || "22:00"}
                  onChange={(e) =>
                    handleTimingChange(day, "closeTime", e.target.value)
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <button
                onClick={() => saveTiming(day)}
                disabled={loading}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                Update Timing
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
