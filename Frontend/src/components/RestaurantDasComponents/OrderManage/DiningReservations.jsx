import React, { forwardRef } from "react";
import {
  FaClock,
  FaUser,
  FaPhone,
  FaCheck,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const DiningReservations = forwardRef(
  ({ reservations = [], onUpdateStatus, stats = {} }, ref) => {
    const getStatusStyle = (status) => {
      switch (status?.toLowerCase()) {
        case "accepted":
          return "bg-green-100 text-green-800";
        case "completed":
          return "bg-green-200 text-green-900";
        case "rejected":
          return "bg-red-100 text-red-800";
        case "pending":
        default:
          return "bg-yellow-100 text-yellow-800";
      }
    };

    return (
      <div className="p-2">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white rounded-lg p-6 shadow-md text-center"
            >
              <div className="text-gray-500 text-sm capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="text-3xl font-bold mt-1 text-gray-800">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div
          ref={ref}
          className="bg-white rounded-lg shadow-md overflow-x-auto overflow-y-auto max-h-[80vh]"
        >
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {[
                  "Name",
                  "Guests",
                  "Time Slot",
                  "Restaurant Name",
                  "Offers",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-center py-4 px-6 font-semibold text-gray-700 text-sm md:text-base"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr
                  key={reservation._id || index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6 text-center text-gray-800">
                    {reservation.username || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <div className="flex items-center justify-center">
                      <FaUser className="w-4 h-4 mr-2 text-gray-500" />
                      {reservation.guests || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center">
                        {reservation.date &&
                          new Date(reservation.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        <FaClock className="w-4 h-4 ml-1 mr-1 text-gray-500" />
                        {reservation.timeSlot || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <div className="flex items-center justify-center">
                      {reservation.firm
                        ? reservation.firm.restaurantInfo?.name
                        : "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {reservation.offerId?.name || "No Offer"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        reservation.status
                      )}`}
                    >
                      {reservation.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center space-x-2">
                      {reservation.status === "pending" && (
                        <>
                          <button
                            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300"
                            onClick={() =>
                              onUpdateStatus(
                                reservation._id,
                                "accepted",
                                "dining"
                              )
                            }
                            title="Accept"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-300"
                            onClick={() =>
                              onUpdateStatus(
                                reservation._id,
                                "rejected",
                                "dining"
                              )
                            }
                            title="Reject"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {reservation.status !== "user_cancel" && (
                        <a
                          href={`tel:${reservation.mobileNumber}`}
                          className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition duration-300"
                          title="Contact"
                        >
                          <FaPhone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && (
            <div className="p-4 text-center text-gray-500 italic">
              No reservations found.
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default DiningReservations;
