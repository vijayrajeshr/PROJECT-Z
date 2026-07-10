import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { OperatingHoursSection } from "./OperatingHoursSection";
import { ClosureDaysSection } from "./ClosureDaysSection";
import { AdditionalSettingsSection } from "./AdditionalSettingsSection";

import axios from "axios";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function TiffinSettings() {
  const token = localStorage.getItem("token");
  const [timings, setTimings] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { open: "", close: "" },
      }),
      {}
    )
  );
  const [useMonday, setUseMonday] = useState(false);
  const [closureDates, setClosureDates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalSettings, setAdditionalSettings] = useState({
    catering: false,
    houseParty: false,
    specialEvents: false,
    freeDelivery: "",
    deliveryDetails: "",
    deliveryCity: "",
    specialMealDay: "",
  });

  const [tiffinFormData, setTiffinFormData] = useState({
    email: "",
    phone: {
      countryCode: "+1",
      number: "",
      fullNumber: "",
    },
    tiffinName: "",
    category: "veg",
    address: "",
  });

  useEffect(() => {
    let isMounted = true;

    const getTiffin = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/tiffin/gamiyash15@gmail.com`,
          { withCredentials: true }
        );
        // console.log("Raw API response:", response);

        if (!isMounted) return;

        // Extract the nested data properly
        const data = response.data.data; // <-- Fix: Access nested data
        // console.log("Extracted tiffin data:", data);

        if (!data) {
          throw new Error("No data received from API");
        }

        // Convert closure dates from strings to Date objects
        const parsedClosureDates = data.serviceClouserDay
          ? data.serviceClouserDay.map((dateStr) => {
              // console.log("Converting date:", dateStr);
              return new Date(dateStr);
            })
          : [];

        // Update tiffin form data with the correct data
        const newTiffinFormData = {
          email: data.ownerMail || "",
          phone: data.ownerPhoneNo || "",
          tiffinName: data.kitchenName || "",
          category: Array.isArray(data.category) ? data.category[0] : "veg",
          address: data.address || "",
        };
        // console.log("Setting tiffin form data:", newTiffinFormData);
        setTiffinFormData(newTiffinFormData);

        // Update timings
        const newTimings =
          data.operatingTimes ||
          daysOfWeek.reduce(
            (acc, day) => ({
              ...acc,
              [day]: { open: "", close: "" },
            }),
            {}
          );
        // console.log("Setting timings:", newTimings);
        setTimings(newTimings);

        // Update closure dates
        setClosureDates(parsedClosureDates);

        // Update additional settings with the correct data
        const newAdditionalSettings = {
          catering: Boolean(data.catering),
          houseParty: Boolean(data.houseParty),
          specialEvents: Boolean(data.specialEvents),
          freeDelivery: data.freeDelivery || "",
          deliveryDetails: data.deliveryDetails || "",
          deliveryCity: data.deliveryCity || "",
          specialMealDay: data.specialMealDay || "",
        };
        // console.log("Setting additional settings:", newAdditionalSettings);
        setAdditionalSettings(newAdditionalSettings);

        setIsEditing(true);
      } catch (error) {
        console.error("Error fetching tiffin details:", error);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getTiffin();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTimingChange = (day, type, value) => {
    setTimings((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const applyMondayTiming = () => {
    if (useMonday) {
      const mondayTiming = timings["Monday"];
      setTimings(
        daysOfWeek.reduce(
          (acc, day) => ({
            ...acc,
            [day]: { ...mondayTiming },
          }),
          {}
        )
      );
    }
  };

  useEffect(() => {
    if (useMonday) {
      applyMondayTiming();
    }
  }, [useMonday]);

  const handleClosureDateAdd = (date) => {
    setClosureDates((prev) => [...prev, date]);
  };

  const handleAdditionalSettingChange = (setting, value) => {
    setAdditionalSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleTiffinDetailsChange = (newTiffinFormData) => {
    setTiffinFormData(newTiffinFormData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // if (error) {
  //   return <div className="text-red-500">Error: {error}</div>;
  // }

  return (
    <div className="container mx-auto bg-gray-50">
      <form className="space-y-3">
        <OperatingHoursSection
          timings={timings}
          handleTimingChange={handleTimingChange}
          useMonday={useMonday}
          setUseMonday={setUseMonday}
          applyMondayTiming={applyMondayTiming}
          daysOfWeek={daysOfWeek}
        />
        <ClosureDaysSection
          closureDates={closureDates}
          handleClosureDateAdd={handleClosureDateAdd}
          setClosureDates={setClosureDates}
        />
        <AdditionalSettingsSection
          additionalSettings={additionalSettings}
          handleAdditionalSettingChange={handleAdditionalSettingChange}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center space-x-2"
          >
            <FaSave />
            <span>{isEditing ? "Update Details" : "Save Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
