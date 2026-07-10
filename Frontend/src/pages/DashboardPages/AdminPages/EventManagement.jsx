import React, { useState } from "react";
import { FaEdit, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const initialEvents = [
  {
    id: 1,
    name: "Food Festival 2024",
    date: "2024-03-15",
    location: "New York City, NY",
    description: "A celebration of culinary delights with top chefs.",
    status: "approved",
  },
  {
    id: 2,
    name: "Wine Tasting Night",
    date: "2024-04-10",
    location: "San Francisco, CA",
    description: "Exclusive wine tasting with renowned sommeliers.",
    status: "pending",
  },
];

const EventManagement = () => {
  const [events, setEvents] = useState(initialEvents);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [notification, setNotification] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.location) {
      if (editingEvent) {
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id
              ? { ...newEvent, id: event.id, status: event.status }
              : event
          )
        );
        setNotification("Event updated successfully!");
      } else {
        setEvents([
          ...events,
          { id: events.length + 1, ...newEvent, status: "pending" },
        ]);
        setNotification("New event added for approval!");
      }
      setNewEvent({ name: "", date: "", location: "", description: "" });
      setEditingEvent(null);
      setIsFormOpen(false);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleEditEvent = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    setNewEvent(eventToEdit);
    setEditingEvent(eventToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    setNotification("Event deleted successfully!");
  };

  const handleApproveEvent = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "approved" } : event
      )
    );
    setNotification("Event approved successfully!");
  };

  const handleRejectEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    setNotification("Event rejected successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
            <span className="hidden md:inline">Add New Event</span>
            {isFormOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {notification}
        </div>
      )}

      {/* Add/Edit Event Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newEvent.location}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                {editingEvent ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Event List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{event.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900">{event.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      {event.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveEvent(event.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;