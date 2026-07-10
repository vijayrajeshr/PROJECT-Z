import React, { useState, useEffect } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { FaSave } from "react-icons/fa";
import { OperatingHoursSection } from "./OperatingHoursSection";
import { ClosureDaysSection } from "./ClosureDaysSection";
import { AdditionalSettingsSection } from "./AdditionalSettingsSection";
import TiffinDetails from "./TiffinDetails";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function RestaurantSettings() {
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
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dashboarduserId } = useAuth();
  const { id } = useParams();
  const [additionalSettings, setAdditionalSettings] = useState({
    catering: false,
    houseParty: false,
    specialEvents: false,
    freeDelivery: "",
    deliveryDetails: "",
    deliveryCity: "",
    specialMealDay: "",
  });

  const [firmFormData, setFirmFormData] = useState({
    email: "",
    phoneNo: "",
    name: "",
    category: [],
    address: "",
  });

  useEffect(() => {
    let isMounted = true;

    const getFirm = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        const data = response.data;
        if (!data || !data.restaurantInfo) {
          throw new Error("No firm data received from API");
        }
        if (data.restaurantStatus !== "Approved") {
          setError("No approved firms found");
          toast.error("No approved firms found");
          setIsLoading(false);
          return;
        } else {
          // Flatten category if it's a double array
          const flattenedCategory = Array.isArray(data.restaurantInfo.category)
            ? data.restaurantInfo.category.flat()
            : [];
          const newFirmFormData = {
            email: data.ownerEmail || "",
            phoneNo: data.ownerPhoneNo || "",
            name: data.restaurantInfo.name || "",
            category: flattenedCategory,
            address: data.restaurantInfo.address || "",
          };

          setFirmFormData(newFirmFormData);
          // Update timings
          const newTimings = data.operatingTimes || {
            Monday: { open: "", close: "" },
            Tuesday: { open: "", close: "" },
            Wednesday: { open: "", close: "" },
            Thursday: { open: "", close: "" },
            Friday: { open: "", close: "" },
            Saturday: { open: "", close: "" },
            Sunday: { open: "", close: "" },
          };
          setTimings(newTimings);
          // Update closure dates
          const parsedClosureDates = data.serviceClouserDay
            ? data.serviceClouserDay.map((dateStr) => new Date(dateStr))
            : [];
          setClosureDates(parsedClosureDates);

          // Update additional settings
          const newAdditionalSettings = {
            catering: Boolean(data.additionalSettings?.catering),
            houseParty: Boolean(data.additionalSettings?.houseParty),
            specialEvents: Boolean(data.additionalSettings?.specialEvents),
            freeDelivery: data.additionalSettings?.freeDelivery || "",
            deliveryDetails: data.additionalSettings?.deliveryDetails || "",
            deliveryCity: data.additionalSettings?.deliveryCity || "",
            specialMealDay: data.additionalSettings?.specialMealDay || "",
          };
          setAdditionalSettings(newAdditionalSettings);
        }
      } catch (error) {
        console.error("Error fetching firm details:", error);
        if (isMounted) {
          setError(
            error.response?.data?.message || "Error fetching firm details"
          );
          toast.error(
            error.response?.data?.message || "Error fetching firm details"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getFirm();

    return () => {
      isMounted = false;
    };
  }, [id, dashboarduserId]);

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

  const handleFirmDetailsChange = (newFirmFormData) => {
    // Flatten category if it's a double array
    const flattenedCategory = Array.isArray(newFirmFormData.category)
      ? newFirmFormData.category.flat()
      : [];
    setFirmFormData({
      ...newFirmFormData,
      category: flattenedCategory,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const phoneNumber =
        firmFormData.phoneNo.fullNumber || firmFormData.fullNumber;
      const countryCode =
        firmFormData.phoneNo.countryCode || firmFormData.countryCode;

      if (!isValidPhoneNumber(phoneNumber)) {
        toast.error(
          "Please enter a valid phone number with country code (e.g., +91...)"
        );
        return;
      }

      const endpoint = `${
        import.meta.env.VITE_SERVER_URL
      }/api/update-restaurant-details/${id}`;

      // Flatten category for API submission
      const flattenedCategory = Array.isArray(firmFormData.category)
        ? firmFormData.category.flat()
        : [];

      const response = await axios.put(
        endpoint,
        {
          email: firmFormData.email,
          phoneNo: firmFormData.phoneNo.number || firmFormData.phoneNo,
          countryCode,
          fullNumber: phoneNumber,
          name: firmFormData.name,
          category: flattenedCategory,
          address: firmFormData.address,
          serviceClouserDay: closureDates,
          operatingTimes: timings,
          additionalSettings: additionalSettings,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Firm details updated successfully!");
    } catch (error) {
      console.error(
        "Error saving firm details:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Error saving firm details");
      toast.error(error.response?.data?.message || "Error saving firm details");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-gray-50">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-3">
        <TiffinDetails
          restaurantData={firmFormData}
          error={error}
          ontiffinFormDataChange={handleFirmDetailsChange}
          isEditMode={isEditing}
        />
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
            <span>Update Details</span>
          </button>
        </div>
      </form>
    </div>
  );
}
