import React, { useEffect, useState, useCallback } from "react";
import axios from "axios"; // Keep axios import if axiosApi doesn't handle all cases
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useContextData } from "../../../context/OutletContext"; // Adjust path if needed

// --- Helper Function for Debounce ---
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- Main Component ---
const HistoryLogs = () => {
  const { axiosApi } = useContextData();

  // --- State Definitions ---
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedLog, setExpandedLog] = useState(null);

  // Filter/Sort States
  const [selectedEntity, setSelectedEntity] = useState(""); // Use empty string for 'All'
  const [selectedAction, setSelectedAction] = useState(""); // Use empty string for 'All'
  const [selectedRole, setSelectedRole] = useState(""); // State for Role filter
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', 'desc' for responseTime
  const [archived, setArchived] = useState(false); // Boolean state for archived toggle
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Static lists for dropdowns
  const actions = ["CREATE", "UPDATE", "DELETE", "READ"]; // Add READ if applicable
  const entities = [
    "User",
    "Order",
    "Review",
    "Tiffin",
    "Firm",
    "MenuItem",
    "Offer",
    "Campaign",
    "Banner",
    "Taxes&Charges",
    "Event", // Add all relevant entities
  ];
  const roles = [
    "user",
    "admin",
    "moderator",
    "kitchenOwner",
    "restaurantOwner",
    "eventCreator",
    "marketingPerson",
  ]; // Example roles

  // --- API Interaction Functions ---

  // Debounce search input
  const debouncedSetSearchQuery = useCallback(
    debounce(setDebouncedSearchQuery, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);

  // Generic fetch function
  const fetchLogs = useCallback(
    async (endpoint, params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosApi.get(endpoint, {
          params, // Pass query parameters
          withCredentials: true,
        });
        if (res.data.response && Array.isArray(res.data.logs)) {
          setHistoryLogs(res.data.logs);
        } else {
          // Handle cases where response is true but logs might be missing/empty
          setHistoryLogs([]);
          console.warn(
            "API response successful but logs format might be unexpected:",
            res.data
          );
          // setError("Received invalid data format."); // Or just show empty table
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch logs."
        );
        setHistoryLogs([]); // Clear logs on error
      } finally {
        setLoading(false);
      }
    },
    [axiosApi]
  );

  // --- Effects for triggering fetches based on state changes ---

  // Initial load and clear filters
  useEffect(() => {
    fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`);
  }, [fetchLogs]); // fetchLogs dependency is stable due to useCallback

  // Fetch based on combined Entity/Action filters
  useEffect(() => {
    let endpoint = `${import.meta.env.VITE_SERVER_URL}/logs`;
    let params = {};
    if (selectedAction.length === 0) {
      fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`); // Fetch all logs
      return;
    }

    if (selectedEntity && selectedAction) {
      endpoint = `${import.meta.env.VITE_SERVER_URL}/logs/entity-action`;
      params = { entity: selectedEntity, action: selectedAction };
    } else if (selectedEntity) {
      endpoint = `${import.meta.env.VITE_SERVER_URL}/logs/entity`;
      params = { word: selectedEntity }; // Assuming backend uses 'word'
    } else if (selectedAction) {
      endpoint = `${import.meta.env.VITE_SERVER_URL}/logs/action`;
      params = { word: selectedAction }; // Assuming backend uses 'word'
    }

    // Only fetch if a filter is selected or if cleared back to all logs
    if (selectedEntity || selectedAction) {
      fetchLogs(endpoint, params);
    } else {
      // Optional: If you want clearing entity/action to refetch all logs
      // fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`);
    }
  }, [selectedEntity, selectedAction, fetchLogs]);

  // Fetch based on Role filter
  useEffect(() => {
    if (selectedRole.length === 0) {
      fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`); // Fetch all logs
      return;
    }
    if (selectedRole) {
      fetchLogs(
        `${import.meta.env.VITE_SERVER_URL}/logs/user-role?role=${selectedRole}`
      );
    }
  }, [selectedRole, fetchLogs]);

  // Fetch based on Date Range
  useEffect(() => {
    if (startDate && endDate) {
      // Format dates consistently (e.g., ISO string) if needed by backend
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs/date-range`, {
        start: formattedStartDate,
        end: formattedEndDate,
      });
    }
  }, [startDate, endDate, fetchLogs]);

  // Fetch based on Archive status
  useEffect(() => {
    // Fetch only when the button is explicitly clicked (handled in onClick)
    // This effect could be removed if fetch is only triggered by button
  }, [archived, fetchLogs]);

  // Fetch based on Sort Order
  useEffect(() => {
    if (sortOrder) {
      fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs/response-time`, {
        order: sortOrder,
      });
    }
  }, [sortOrder, fetchLogs]); // Debounce is handled internally if needed via state update delay

  // Fetch based on Search Query (debounced)
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs/search`, {
        query: debouncedSearchQuery,
      });
    } else if (!debouncedSearchQuery && historyLogs.length > 0) {
      // Optional: Fetch all logs when search is cleared
      // fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`);
    }
  }, [debouncedSearchQuery, fetchLogs]);

  // --- Event Handlers ---

  const toggleDetails = (id) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    // Fetch is triggered by useEffect watching sortOrder
  };

  const handleArchivedToggle = () => {
    const nextArchived = !archived;
    setArchived(nextArchived);
    // Fetch based on the new state
    const endpoint = nextArchived
      ? `${import.meta.env.VITE_SERVER_URL}/logs/archived`
      : `${import.meta.env.VITE_SERVER_URL}/logs`;
    fetchLogs(endpoint);
  };

  const handleClearFilters = () => {
    setSelectedEntity("");
    setSelectedAction("");
    setSelectedRole("");
    setDateRange([null, null]);
    setSortOrder(null);
    setArchived(false);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    fetchLogs(`${import.meta.env.VITE_SERVER_URL}/logs`); // Fetch all logs
  };

  // --- Helper to format Timestamp ---
  const formatTimestamp = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (e) {
      return isoString; // Fallback to original string if parsing fails
    }
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
          History Logs
        </h2>

        {/* --- Filter Bar --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6 p-4 border rounded-md bg-gray-50">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by User Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-md pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Date Range Picker */}
          <div className="border p-2 rounded-md flex items-center bg-white">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              className="w-full outline-none border-none text-sm"
              placeholderText="Select date range"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          {/* Entity Filter */}
          <select
            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
          >
            <option value="">All Entities</option>
            {entities.map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                {/* Capitalize */}
              </option>
            ))}
          </select>

          {/* Archived Toggle - Simple Button Example */}
          <button
            onClick={handleArchivedToggle}
            className={`w-full p-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 ${archived
              ? "bg-blue-100 text-blue-700 border-blue-300 focus:ring-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500"
              }`}
          >
            {archived ? "Showing Archived" : "Show Archived"}
          </button>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="w-full p-2 border rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 col-span-1 sm:col-span-2 md:col-span-1" // Adjust spanning as needed
          >
            Clear Filters
          </button>
        </div>

        {/* --- Logs Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  User
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Entity
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Action
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Timestamp
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Method
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Description
                </th>
                {/* Add sorting for Response Time if needed */}
                <th
                  className="border p-2 text-left font-semibold text-gray-600 cursor-pointer hover:bg-gray-200"
                  onClick={toggleSortOrder}
                >
                  Resp. Time (ms)
                  {sortOrder === "asc" ? (
                    <FaSortUp className="inline ml-1" />
                  ) : sortOrder === "desc" ? (
                    <FaSortDown className="inline ml-1" />
                  ) : (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th className="border p-2 text-left font-semibold text-gray-600">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 border">
                    Loading logs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-4 border text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : historyLogs.length > 0 ? (
                historyLogs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className="border hover:bg-gray-50 transition-colors duration-150">
                      <td className="border p-2 align-top">
                        {log.performedBy?.email || "N/A"}
                      </td>
                      <td className="border p-2 align-top">{log.entity}</td>
                      <td className="border p-2 align-top">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${log.action === "CREATE"
                            ? "bg-green-100 text-green-800"
                            : log.action === "UPDATE"
                              ? "bg-blue-100 text-blue-800"
                              : log.action === "DELETE"
                                ? "bg-red-100 text-red-800"
                                : log.action === "READ"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="border p-2 align-top whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="border p-2 align-top">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-semibold ${log.method === "GET"
                            ? "bg-blue-100 text-blue-700"
                            : log.method === "POST"
                              ? "bg-green-100 text-green-700"
                              : log.method === "PUT" || log.method === "PATCH"
                                ? "bg-yellow-100 text-yellow-700"
                                : log.method === "DELETE"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td
                        className="border p-2 align-top max-w-xs truncate"
                        title={log.description}
                      >
                        {log.description}
                      </td>
                      <td className="border p-2 align-top">
                        {log.responseTime}
                      </td>
                      <td className="border p-2 align-top text-center">
                        <button
                          onClick={() => toggleDetails(log._id)}
                          className="text-blue-600 hover:text-blue-800 text-lg"
                          title={
                            expandedLog === log._id
                              ? "Hide Details"
                              : "Show Details"
                          }
                        >
                          {expandedLog === log._id ? "-" : "+"}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log._id && (
                      <tr className="border bg-indigo-50">
                        <td colSpan="8" className="p-3 text-sm text-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <p>
                              <strong>Full Description:</strong>{" "}
                              {log.description}
                            </p>
                            <p>
                              <strong>Entity ID(s):</strong>{" "}
                              {log.entityId?.join(", ") || "N/A"}
                            </p>
                            <p>
                              <strong>IP Address:</strong>{" "}
                              {log.ipAddress || "N/A"}
                            </p>
                            <p>
                              <strong>Route:</strong> {log.originalUrl || "N/A"}
                            </p>
                            <p>
                              <strong>Response Time:</strong> {log.responseTime}{" "}
                              ms
                            </p>
                            <p>
                              <strong>User Agent / Extra Details:</strong>{" "}
                              {/* Add other relevant details here */}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4 border">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryLogs;
