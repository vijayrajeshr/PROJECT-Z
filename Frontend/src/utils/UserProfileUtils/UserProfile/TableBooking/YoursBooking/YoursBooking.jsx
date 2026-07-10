import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import {
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
  FaTag,
  FaTimesCircle,
  FaTruck,
  FaHeart,
  FaCalendarAlt, // Added CalendarAlt for consistency
  FaPhoneAlt, // Added PhoneAlt for consistency
  FaMapMarkerAlt, // Added MapMarkerAlt for consistency
} from "react-icons/fa";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-1000 flex items-center justify-center animate-fade-in-overlay">
      <div className="bg-white rounded-xl shadow-2xl p-0 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto animate-fade-in-content relative">
        {children}
      </div>
    </div>
  );
};

const UserProfileNoData = ({ hashId }) => (
  <div className="text-center py-10 text-gray-600 bg-white rounded-lg shadow-sm">
    <p className="text-xl font-semibold mb-3">No bookings found!</p>
    <p className="text-md">It looks like you haven't booked any tables yet.</p>
    <p className="text-md mt-1">Time to explore amazing restaurants!</p>
  </div>
);

const TableBookings = ({ hashId }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // New state for cancel modal
  const [cancelReason, setCancelReason] = useState(""); // New state for cancel reason
  const [cancellingBookingId, setCancellingBookingId] = useState(null); // New state for tracking cancellation
  const [message, setMessage] = useState(""); // For user feedback messages

  const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

  const observer = useRef();
  const lastBookingElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchBookings = useCallback(
    async (page) => {
      setIsLoading(true);
      setMessage(""); // Clear messages on new fetch
      try {
        const response = await Axios.get(
          `${SERVER_URL}/api/bookings/userId?page=${page}&limit=12`,
          {
            withCredentials: true,
          }
        );

        const {
          data: fetchedBookings,
          totalPages,
          currentPage: fetchedCurrentPage,
        } = response.data;
        if (page === 1) {
          setBookings(fetchedBookings);
        } else {
          setBookings((prevBookings) => [...prevBookings, ...fetchedBookings]);
        }

        setHasMore(fetchedCurrentPage < totalPages);
        setCurrentPage(fetchedCurrentPage);
      } catch (error) {
        console.error("Error fetching table bookings:", error);
        setMessage("Error fetching bookings. Please try again.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    },
    [SERVER_URL]
  );

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  const formatDate = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      return "N/A";
    }
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";

    if (timeStr.includes("T")) {
      return new Date(timeStr).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return timeStr;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
      case "canceled": // Existing 'canceled'
      case "user_cancel": // New status for user-initiated cancellation
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setIsCancelModalOpen(false); // Ensure cancel modal is closed too
    setCancelReason(""); // Clear reason
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelReason(""); // Clear reason
  };

  const handleCancelBookingSubmit = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      setMessage("Please provide a reason for cancellation.");
      return;
    }

    setMessage("");
    setCancellingBookingId(selectedBooking._id); // Set the ID of the booking being cancelled

    try {
      const response = await Axios.put(
        `${SERVER_URL}/api/bookings/cancel/${selectedBooking._id}`, // New backend endpoint
        { reason: cancelReason },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage(
          `Booking #${selectedBooking._id.slice(-6)} cancelled successfully.`
        );
        // Update the status of the cancelled booking in the local state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? {
                  ...booking,
                  status: "user_cancel", // Set status to 'user_cancel'
                  cancellationReason: cancelReason, // Store reason on the booking object
                  cancelledAt: new Date().toISOString(), // Store cancellation time
                  subStatus: [
                    // Add the new subStatus entry
                    ...(booking.subStatus || []),
                    {
                      date: new Date().toISOString(), // Use ISO string for consistency
                      statue: "user_cancel", // Use 'user_cancel' for subStatus entry
                      reason: cancelReason, // Optionally store the reason within the subStatus entry
                    },
                  ],
                }
              : booking
          )
        );
        closeModal(); // Close main booking details modal
      } else {
        setMessage(
          `Failed to cancel booking: ${
            response.data.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setMessage(
        `Error cancelling booking: ${
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred."
        }`
      );
    } finally {
      setCancellingBookingId(null); // Reset cancelling state
      closeCancelModal(); // Close the cancellation reason modal
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
        Your Table Bookings
      </h1>

      <>
        {initialLoad && isLoading ? (
          <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
            <FaClock className="mr-2 animate-spin" size={24} /> Fetching your
            bookings...
          </div>
        ) : bookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {bookings.map((booking, index) => {
                const isLastBooking = bookings.length === index + 1;
                const restaurantName =
                  booking.firm?.restaurantInfo?.name || "Unknown Restaurant";
                const restaurantImage =
                  booking?.firm?.image_urls?.[0] ||
                  "https://placehold.co/150x150/f0f9ff/00796b?text=Restaurant+Image";

                return (
                  <div
                    key={booking._id}
                    ref={isLastBooking ? lastBookingElementRef : null}
                    className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                        ${
                          selectedBooking && selectedBooking._id === booking._id
                            ? "ring-2 ring-teal-500"
                            : ""
                        }`}
                    onClick={() => openModal(booking)}
                  >
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="relative w-full mb-3">
                        <img
                          src={restaurantImage}
                          alt={restaurantName}
                          className="w-full h-40 object-cover rounded-lg shadow-inner"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/150x150/f0f9ff/00796b?text=Restaurant+Image";
                          }}
                        />
                        <span
                          className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status?.toLowerCase() === "accepted" ? (
                            <FaCheckCircle size={10} className="inline mr-1" />
                          ) : (
                            <FaClock size={10} className="inline mr-1" />
                          )}
                          {booking.status}
                        </span>
                        <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                          #{booking._id.slice(-6)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
                        {restaurantName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">
                        {booking.guests} Guests | {booking.meal} |{" "}
                        {formatDate(booking.ScheduleDate)} at{" "}
                        {formatTime(booking.timeSlot)}
                      </p>

                      <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-800">
                          {booking.timeSlot}
                        </span>
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-md">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isLoading && (
              <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                <FaClock className="mr-2 animate-spin" size={20} /> Loading more
                bookings...
              </div>
            )}
            {!hasMore && !isLoading && bookings.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                You've seen all your bookings.
              </div>
            )}
          </>
        ) : (
          <div className="py-10">
            <UserProfileNoData hashId={hashId} />
          </div>
        )}
      </>

      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        {selectedBooking && (
          <div className="p-6 bg-white rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
            >
              <FaTimesCircle size={32} />
            </button>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
              <FaInfoCircle className="mr-2 text-teal-600" size={24} /> Booking
              Details{" "}
              <span className="text-teal-600 ml-2">
                #{selectedBooking._id.slice(-6)}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaTruck className="mr-2 text-blue-500" size={18} />{" "}
                  Restaurant:
                </p>
                <p className="ml-5">
                  <b>Name : </b>
                  {selectedBooking.firm?.restaurantInfo?.name || "N/A"}
                </p>
                <p className="ml-5">
                  <b>Address : </b>
                  {selectedBooking.firm?.restaurantInfo?.address || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaTag className="mr-2 text-purple-500" size={18} /> Booking
                  Type:
                </p>
                <p className="ml-5">Table Booking</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaClock className="mr-2 text-yellow-500" size={18} /> Booking
                  Placed:
                </p>
                <p className="ml-5">
                  {formatDate(selectedBooking.orderDate)} at{" "}
                  {formatTime(selectedBooking.orderDate)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-500" size={18} />{" "}
                  Scheduled Booking Time:
                </p>
                <p className="ml-5">
                  {formatDate(selectedBooking.ScheduleDate)} at{" "}
                  {formatTime(selectedBooking.timeSlot)}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaInfoCircle className="mr-2 text-gray-500" size={18} />{" "}
                  Guests:
                </p>
                <p className="italic ml-5">{selectedBooking.guests}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 flex items-center">
                  <FaTag className="mr-2 text-gray-500" size={18} /> Meal:
                </p>
                <p className="italic ml-5">{selectedBooking.meal}</p>
              </div>
              {selectedBooking.phone && (
                <div className="col-span-full">
                  <p className="font-semibold text-gray-600 flex items-center">
                    <FaPhoneAlt className="mr-2 text-indigo-500" size={18} />{" "}
                    Contact Number:
                  </p>
                  <p className="ml-5">
                    {selectedBooking.phone?.countryCode}
                    {selectedBooking.phone?.number || "N/A"}
                  </p>
                </div>
              )}
              {selectedBooking.address && ( // Assuming address might be relevant for some bookings
                <div className="col-span-full">
                  <p className="font-semibold text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" size={18} />{" "}
                    Address:
                  </p>
                  <p className="ml-5">{selectedBooking.address}</p>
                </div>
              )}
            </div>

            {selectedBooking.subStatus &&
              selectedBooking.subStatus.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    Booking Timeline:
                  </h4>
                  <ol className="relative border-l border-gray-200 ml-4">
                    {selectedBooking.subStatus
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((statusEntry, idx) => (
                        <li key={idx} className="mb-4 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                            {statusEntry.statue === "accepted" ? (
                              <FaCheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <FaClock className="w-3 h-3 text-yellow-500" />
                            )}
                          </span>
                          <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                            {statusEntry.statue}
                            {idx === selectedBooking.subStatus.length - 1 && (
                              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                                Latest
                              </span>
                            )}
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                            On {formatDate(statusEntry.date)} at{" "}
                            {formatTime(statusEntry.date)}
                          </time>
                          {statusEntry.statue === "user_cancel" &&
                            statusEntry.reason && (
                              <p className="text-sm text-gray-600 mt-1 pl-2 border-l-2 border-red-400 italic">
                                Reason: {statusEntry.reason}
                              </p>
                            )}
                        </li>
                      ))}
                  </ol>
                </div>
              )}

            {/* Cancel Booking Button */}
            {selectedBooking.status?.toLowerCase() !== "accepted" && // Cannot cancel once accepted
              selectedBooking.status?.toLowerCase() !== "rejected" &&
              selectedBooking.status?.toLowerCase() !== "canceled" && // Existing 'canceled' status
              selectedBooking.status?.toLowerCase() !== "user_cancel" && ( // Already user-cancelled
                <div className="mt-6 border-t pt-4 text-center">
                  <button
                    onClick={openCancelModal}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
          </div>
        )}
      </CustomModal>

      {/* Cancellation Reason Modal */}
      <CustomModal isOpen={isCancelModalOpen} onClose={closeCancelModal}>
        <div className="p-6 bg-white rounded-lg relative">
          <button
            onClick={closeCancelModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
          >
            <FaTimesCircle size={32} />
          </button>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">
            Cancel Booking #{selectedBooking?._id.slice(-6)}
          </h2>
          <p className="text-gray-700 mb-4">
            Please provide a reason for cancelling this booking:
          </p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4 resize-y"
            rows="4"
            placeholder="e.g., Change of plans, no longer needed, wrong time selected, etc."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          ></textarea>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeCancelModal}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelBookingSubmit}
              disabled={
                !cancelReason.trim() ||
                cancellingBookingId === selectedBooking?._id
              }
              className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200
                ${
                  !cancelReason.trim() ||
                  cancellingBookingId === selectedBooking?._id
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              {cancellingBookingId === selectedBooking?._id
                ? "Cancelling..."
                : "Submit Cancellation"}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default TableBookings;
