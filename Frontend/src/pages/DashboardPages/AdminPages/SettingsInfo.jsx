import axios from "axios";
import React, { useState, useEffect } from "react";
import { useContextData } from "../../../context/OutletContext";
function SettingsPage() {
  const { axiosApi } = useContextData();
  const [logo, setLogo] = useState("");
  const [status, setStatus] = useState("Online");
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24-hour");
  const [name, setName] = useState("Zomato");

  useEffect(() => {
    const fetchSettings = async () => {
      try {

        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/settings`
        );
        const data = response.data.settings;

        // Update state with fetched settings
        setLogo(data.logo || "");
        setName(data.websiteName || "Zomato");
        setStatus(data.status || "Online");
        setMaintenanceEnabled(data.maintenanceEnabled || false);
        setMaintenanceMessage(data.maintenanceMessage || "");
        setStartTime(data.startTime || "");
        setEndTime(data.endTime || "");
        setPreferredLanguage(data.preferredLanguage || "English");
        setTimeZone(data.timeZone || "");
        setDateFormat(data.dateFormat || "DD/MM/YYYY");
        setTimeFormat(data.timeFormat || "24-hour");
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleSimulateStatus = () => {
    if (status === "Online") {
      setStatus("Degraded");
    } else if (status === "Degraded") {
      setStatus("Offline");
    } else {
      setStatus("Online");
    }
  };

  const handleSaveMaintenance = () => {
    alert("Maintenance settings saved.");
    console.log("Maintenance Enabled:", maintenanceEnabled);
    console.log("Message:", maintenanceMessage);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
  };

  const handleSaveSettings = async () => {
    try {
      const formData = new FormData();
      if ((typeof logo === "object" && logo !== null) || logo) {
        formData.append("logo", logo);
      }
      formData.append("websiteName", name);
      formData.append("status", status);
      formData.append("maintenanceEnabled", maintenanceEnabled);
      formData.append("maintenanceMessage", maintenanceMessage);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("preferredLanguage", preferredLanguage);
      formData.append("timeZone", timeZone);
      formData.append("dateFormat", dateFormat);
      formData.append("timeFormat", timeFormat);
      console.log(formData);
      axiosApi
        .post(`${import.meta.env.VITE_SERVER_URL}/settings/settings`, formData)
        .then((response) => {
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      

      {/* Settings Content Area */}
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Website Logo Upload */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Website Logo</h2>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-2 cursor-pointer"
            onChange={handleLogoUpload}
          />
          {logo && (
            <img
              src={typeof logo === 'string' && logo.startsWith('data:image') ? logo : typeof logo === 'object' ? URL.createObjectURL(logo) : `data:image/png;base64,${logo}`}
              alt="Website Logo Preview"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded border p-1 object-cover"
            />
          )}
        </div>

        {/* Website Name */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Website Name</h2>
          <input
            type="text"
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter website name"
          />
        </div>

        {/* Website Status */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Website Status</h2>
          {/* <div className="flex items-center justify-between "> */}
          <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
            <p className="flex items-center space-x-2">
              <span
                className={`inline-block w-3 h-3 rounded-full animate-pulse ${
                  status === "Online"
                    ? "bg-green-500"
                    : status === "Degraded"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></span>
              <span className="capitalize font-medium text-gray-700">{status}</span>
            </p>
            <button
              onClick={handleSimulateStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition duration-150 ease-in-out self-start"
            >
              Simulate Status Change
            </button>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Maintenance Mode
          </h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance-toggle"
              checked={maintenanceEnabled}
              onChange={() => setMaintenanceEnabled(!maintenanceEnabled)}
              className="mr-2 form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="maintenance-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">Enable Maintenance Mode</label>
          </div>
          {maintenanceEnabled && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <div>
                <label htmlFor="maintenance-message" className="block text-sm font-medium mb-1 text-gray-700">
                  Maintenance Message:
                </label>
                <textarea
                  id="maintenance-message"
                  rows="3"
                  placeholder="Enter maintenance message (optional)"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium mb-1 text-gray-700">
                    Start Time:
                  </label>
                  <input
                    id="start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium mb-1 text-gray-700">
                    End Time:
                  </label>
                  <input
                    id="end-time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time & Language */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Localization Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="language-select" className="block text-sm font-medium mb-1 text-gray-700">
                Preferred Language:
              </label>
              <select
                id="language-select"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone-select" className="block text-sm font-medium mb-1 text-gray-700">Time Zone:</label>
              <select
                id="timezone-select"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">Select Time Zone</option>
                <option value="IST">IST (India Standard Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateformat-select" className="block text-sm font-medium mb-1 text-gray-700">Date Format:</label>
              <select
                id="dateformat-select"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeformat-select" className="block text-sm font-medium mb-1 text-gray-700">Time Format:</label>
              <select
                id="timeformat-select"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="12-hour">12-hour (e.g., 3:00 PM)</option>
                <option value="24-hour">24-hour (e.g., 15:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save All Settings Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-150 ease-in-out w-full sm:w-auto"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
