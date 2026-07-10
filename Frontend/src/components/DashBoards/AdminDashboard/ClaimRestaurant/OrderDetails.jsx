// import React from "react";
// import { FiPhone, FiMapPin, FiCalendar, FiFileText } from "react-icons/fi";
// import { FaCheckCircle, FaTimesCircle, FaClock, FaUndo } from "react-icons/fa";
// import { FcAcceptDatabase} from "react-icons/fc";
// import { IoMdClose } from "react-icons/io";
// import { MdOutlineWatchLater } from "react-icons/md";
// export default function OrderDetails({ order, onStatusChange }) {
//     if (!order) return <div className="text-gray-500">Select an order to view details.</div>;

//     return (
//         <div className="bg-white shadow-md rounded-md p-4 w-full">
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">Restaurant Details</h2>
//                 <span className="text-sm px-2 py-1 border rounded text-gray-700">{order.id}</span>
//             </div>

//             <div className="mb-2">
//                 <h3 className="text-lg font-bold">{order.restaurantname}</h3>
//                 <div className="flex items-center text-sm text-gray-500">
//                     <FiPhone className="mr-2" />
//                     {order.phone}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                     <FiMapPin className="mr-2" />
//                     {order.restaurantaddress}
//                 </div>
//             </div>

//             <hr className="my-4" />

//             <div className="grid grid-cols-2 gap-4 text-sm mb-4">
//                 <div>
//                     <h4 className="font-semibold">Date of Request</h4>
//                     <p className="text-gray-500 flex items-center">
//                         <FiCalendar className="mr-2" />
//                         {order.dateofrequest}
//                     </p>
//                 </div>
//                 <div>
//                     <h4 className="font-semibold">Date of Claim Submission</h4>
//                     <p className="text-gray-500 flex items-center">
//                         <FiCalendar className="mr-2" />
//                         {order.dateofclaimsubmission}
//                     </p>
//                 </div>
//                 <div>
//                     <h4 className="font-semibold">Status</h4>
//                     <p className={`text-white px-2 py-1 rounded ${getStatusColor(order.status)}`}>
//                         {order.status}
//                     </p>
//                 </div>
//                 <div>
//                     <h4 className="font-semibold">Time</h4>
//                     <p className="text-gray-500">{order.time}</p>
//                 </div>
//             </div>

//             <hr className="my-4" />

//             <div className="mb-4">
//                 <h4 className="text-sm font-semibold mb-2">Restaurant Documents</h4>
//                 <div className="flex items-center gap-2 border border-gray-300 p-3 rounded">
//                     <FiFileText className="text-gray-600" size={20} />
//                     <span className="text-gray-500">No documents uploaded yet</span>
//                 </div>
//             </div>

//             <hr className="my-4" />

//             {/* Admin Actions */}
//             <div className="flex justify-around gap-1 mt-1">
//                 <button
//                     className="flex items-center gap-1 text-black  px-4 py-2 bg-white"
//                     onClick={() => onStatusChange(order.id, "Approved")}
//                 >
//                     <FcAcceptDatabase className="h-6 w-6" />

//                 </button>

//                 <button
//                     className="flex items-center gap-2  bg-white text-black px-4 py-2 "
//                     onClick={() => onStatusChange(order.id, "Rejected")}
//                 >
//                     <IoMdClose className="h-6 w-6" />

//                 </button>

//                 <button
//                     className="flex items-center gap-2 bg-white text-black px-4 py-2 "
//                     onClick={() => onStatusChange(order.id, "Later")}
//                 >
//                     <MdOutlineWatchLater className="h-6 w-6" />

//                 </button>

//                 <button
//                     className="flex items-center gap-2 bg-white text-black px-4 py-2 "
//                     onClick={() => onStatusChange(order.id, "Revoked")}
//                 >
//                     <FaUndo className="h-4 w-4" />

//                 </button>
//             </div>
//         </div>
//     );
// }

// // Helper function to determine status colors
// const getStatusColor = (status) => {
//     switch (status) {
//         case "Claimed":
//             return "bg-yellow-500";
//         case "Pending":
//             return "bg-blue-500";
//         case "Unclaimed":
//             return "bg-red-500";
//         default:
//             return "bg-gray-400";
//     }
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUndo } from "react-icons/fa";
import { FcAcceptDatabase } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { MdOutlineWatchLater } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function OrderDetails({ order, onStatusChange }) {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order && order.id) {
      fetchDocuments(order.id);
    }
  }, [order]);

  const fetchDocuments = async (restaurantId) => {
  try {
    setLoading(true);
    setError(null);
    setDocuments(null); // Reset documents state at the beginning

    const response = await axios.get(
      `${API_BASE_URL}/api/documents/${restaurantId}`
    );

    if (response.data.success) {
      setDocuments(response.data.documents);
      console.log("Documents fetched:", response.data.documents);
    }
  } catch (err) {
    // Log the error regardless
    console.error("Error fetching documents:", err);

    // Check *IF* the status is 404
    if (err.response?.status === 404) {
      // This is an expected "Not Found" state, not a failure.
      console.log("No documents have been uploaded for this restaurant yet.");
      // We don't set an error, we just leave documents as null or empty.
      setDocuments(null); // or setDocuments([]) depending on your preference
    } else {
      // This is a real, unexpected error (e.g., 500, network error)
      setError("Failed to load documents. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};
  // Helper function to format document names for display
  const formatDocumentName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  // Function to view a document
  const viewDocument = (documentPath) => {
    if (!documentPath) return;

    // Direct path to the document - using just the file path
    // The server should be configured to serve files from the uploads directory
    let documentUrl = `${API_BASE_URL}/${documentPath}`;

    console.log("Opening document at:", documentUrl);
    window.open(documentUrl, "_blank");
  };

  // Function to download a document
  const downloadDocument = (documentPath, documentName) => {
    if (!documentPath) return;

    // Use the same URL construction for downloading
    let documentUrl = `${API_BASE_URL}/${documentPath}`;

    // Create an anchor element to trigger download
    const a = document.createElement("a");
    a.href = documentUrl;
    a.download = documentName || documentPath.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  console.log(order, "getting the order data ");

  if (!order)
    return (
      <div className="text-gray-500">Select an order to view details.</div>
    );

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Restaurant Details</h2>
        <span className="text-sm px-2 py-1 border rounded text-gray-700">
          {order.id}
        </span>
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-bold">{order.restaurantname}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <FiPhone className="mr-2" />
          {order.phone}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FiMapPin className="mr-2" />
          {order.restaurantaddress}
        </div>
      </div>

      <hr className="my-4" />

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <h4 className="font-semibold">Date of Request</h4>
          <p className="text-gray-500 flex items-center">
            <FiCalendar className="mr-2" />
            {order.dateofrequest}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Date of Claim Submission</h4>
          <p className="text-gray-500 flex items-center">
            <FiCalendar className="mr-2" />
            {order.dateofclaimsubmission}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Status</h4>
          <p
            className={`text-white px-2 py-1 rounded ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Time</h4>
          <p className="text-gray-500">{order.time}</p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Restaurant Documents</h4>

        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin inline-block h-6 w-6 border-t-2 border-gray-500 rounded-full"></div>
            <p className="mt-2 text-gray-500">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : !documents ? (
          <div className="flex items-center gap-2 border border-gray-300 p-3 rounded">
            <FiFileText className="text-gray-600" size={20} />
            <span className="text-gray-500">No documents uploaded yet</span>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(documents).map(([key, value]) => {
              // Skip non-document fields
              if (
                key === "_id" ||
                key === "restaurantId" ||
                key === "isVerified" ||
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "__v" ||
                !value
              ) {
                return null;
              }

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-blue-500" />
                    <span>{formatDocumentName(key)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                      onClick={() => viewDocument(value)}
                      title="View document"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                      onClick={() =>
                        downloadDocument(value, formatDocumentName(key))
                      }
                      title="Download document"
                    >
                      <FiDownload size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Admin Actions */}
      <div className="flex justify-around gap-2 mt-4">
        <button
          className="flex flex-col items-center justify-center gap-1 text-green-600 hover:bg-green-50 px-4 py-2 rounded transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStatusChange(order.id, "Approved", order.ownerEmail);
          }}
          title="Approve"
        >
          <FcAcceptDatabase className="h-6 w-6" />
          <span className="text-xs font-medium">Approve</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 text-red-600 hover:bg-red-50 px-4 py-2 rounded transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStatusChange(order.id, "Rejected");
          }}
          title="Reject"
        >
          <IoMdClose className="h-6 w-6" />
          <span className="text-xs font-medium">Reject</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStatusChange(order.id, "Later");
          }}
          title="Review Later"
        >
          <MdOutlineWatchLater className="h-6 w-6" />
          <span className="text-xs font-medium">Later</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStatusChange(order.id, "Revoked");
          }}
          title="Revoke"
        >
          <FaUndo className="h-5 w-5" />
          <span className="text-xs font-medium">Revoke</span>
        </button>
      </div>
    </div>
  );
}

// Helper function to determine status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Claimed":
      return "bg-yellow-500";
    case "Pending":
      return "bg-blue-500";
    case "Unclaimed":
      return "bg-red-500";
    case "Approved":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-600";
    case "Later":
      return "bg-yellow-600";
    case "Revoked":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};
