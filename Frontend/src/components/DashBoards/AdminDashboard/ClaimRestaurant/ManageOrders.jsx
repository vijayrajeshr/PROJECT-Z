// import React, { useState, useEffect } from "react";
// import OrderDetails from "./OrderDetails";
// import { MdDone } from "react-icons/md";
// import { MdOutlineCancel } from "react-icons/md";

// const ManageOrders = () => {
//   const initialRecentActivity = [
//     {
//       id: "#1423",
//       restaurantname: "Pizza Hut",
//       claimername: "Alice Johnson",
//       phone: "+1 (555) 111-2222",
//       restaurantaddress: "456 Elm St, Springfield, SP 54321",
//       status: "Claimed",
//       time: "5 mins ago",
//       dateofrequest: "2025-01-02",
//       dateofclaimsubmission: "2025-01-02",
//     },
//     {
//       id: "#1425",
//       restaurantname: "Taco Bell",
//       claimername: "Fiona Gallagher",
//       phone: "+1 (555) 111-3333",
//       restaurantaddress: "159 Spruce St, Coast City, CO 11223",
//       status: "Claimed",
//       time: "15 mins ago",
//       dateofrequest: "2025-06-25",
//       dateofclaimsubmission: "2025-06-27",
//     },
//     {
//       id: "#1426",
//       restaurantname: "Starbucks",
//       claimername: "Greg House",
//       phone: "+1 (555) 222-4444",
//       restaurantaddress: "753 Maple St, Riverdale, RV 33445",
//       status: "UnClaimed",
//       time: "5 hours ago",
//       dateofrequest: "2025-07-07",
//       dateofclaimsubmission: "2025-07-10",
//     },
//     {
//       id: "#1427",
//       restaurantname: "McDonald's",
//       claimername: "Hank Schrader",
//       phone: "+1 (555) 666-7777",
//       restaurantaddress: "852 Redwood St, Hill Valley, HV 55667",
//       status: "Claimed",
//       time: "10 mins ago",
//       dateofrequest: "2025-08-14",
//       dateofclaimsubmission: "2025-08-16",
//     },
//     {
//       id: "#1422",
//       restaurantname: "Burger King",
//       claimername: "Bob Smith",
//       phone: "+1 (555) 333-4444",
//       restaurantaddress: "789 Oak St, Metropolis, MP 98765",
//       status: "UnClaimed",
//       time: "20 mins ago",
//       dateofrequest: "2025-02-10",
//       dateofclaimsubmission: "2025-02-12",
//     },
//     {
//       id: "#1421",
//       restaurantname: "KFC",
//       claimername: "Charlie Brown",
//       phone: "+1 (555) 555-6666",
//       restaurantaddress: "321 Pine St, Gotham, GT 67890",
//       status: "Revoked",
//       time: "1 hour ago",
//       dateofrequest: "2025-03-15",
//       dateofclaimsubmission: "2025-03-20",
//     },
//     {
//       id: "#1420",
//       restaurantname: "Subway",
//       claimername: "Diana Prince",
//       phone: "+1 (555) 777-8888",
//       restaurantaddress: "654 Cedar St, Star City, SC 13579",
//       status: "Pending",
//       time: "30 mins ago",
//       dateofrequest: "2025-04-05",
//       dateofclaimsubmission: "2025-04-08",
//     },
//   ];

//   const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(initialRecentActivity[0]);

//   useEffect(() => {
//     const filteredActivity = initialRecentActivity.filter(
//       (order) => !statusFilter || order.status === statusFilter
//     );
//     setRecentActivity(filteredActivity);
//   }, [statusFilter]);

//   const statusChange = (orderId, newStatus) => {
//     const updatedOrders = recentActivity.map((order) =>
//       order.id === orderId ? { ...order, status: newStatus } : order
//     );
//     setRecentActivity(updatedOrders);

//     if (selectedOrder.id === orderId) {
//       setSelectedOrder({ ...selectedOrder, status: newStatus });
//     }
//   };

//   return (
//     <div className="flex gap-2">
//       <div className="bg-white rounded shadow p-2 w-[60%]">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-lg font-semibold">REQUESTS</h2>
//           <select
//             className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option className="text-green-500" value="Claimed">
//               Claimed
//             </option>
//             <option className="text-red-800" value="UnClaimed">
//               UnClaimed
//             </option>
//             <option className="text-green-800" value="Pending">
//               Pending
//             </option>
//             <option className="text-red-800" value="Revoked">
//               Revoked
//             </option>
//           </select>
//         </div>

//         <div className="overflow-x-auto ">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-black border-b">
//                 <th className="py-2 px-2 text-left">Restaurant ID</th>
//                 <th className="py-2 px-2 text-left">Restaurant Name</th>
//                 <th className="py-2 px-2 text-left">Claimer Name</th>
//                 <th className="py-2 px-2 text-left">Time</th>
//                 <th className="py-2 px-2 text-left">Status</th>
//                 <th className="py-2 px-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentActivity.map((order) => (
//                 <tr
//                   key={order.id}
//                   className={`cursor-pointer border-b last:border-0
//                                         ${
//                                           selectedOrder.id === order.id
//                                             ? "bg-gray-100"
//                                             : ""
//                                         }`}
//                   onClick={() => setSelectedOrder(order)}
//                 >
//                   <td className="py-2 px-2">{order.id}</td>
//                   <td className="py-2 px-2">{order.restaurantname}</td>
//                   <td className="py-2 px-2">{order.claimername}</td>
//                   <td className="py-2 px-2">{order.time}</td>
//                   <td className="py-2 px-2">
//                     <span
//                       className={`text-xs font-semibold px-2 py-1 rounded ${
//                         order.status === "Claimed"
//                           ? "bg-green-100 text-green-800"
//                           : order.status === "UnClaimed"
//                           ? "bg-red-100 text-red-800"
//                           : order.status === "Pending"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="py-2 flex items-center gap-2">
//                     {order.status === "Claimed" && (
//                       <>
//                         <span
//                           className="text-green-500 cursor-pointer"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             statusChange(order.id, "Pending");
//                           }}
//                         >
//                           <MdDone size={20} />
//                         </span>
//                         <span
//                           className="text-red-500 cursor-pointer"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             statusChange(order.id, "Revoked");
//                           }}
//                         >
//                           <MdOutlineCancel size={20} />
//                         </span>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="w-[40%]">
//         <OrderDetails order={selectedOrder} onStatusChange={statusChange} />
//       </div>
//     </div>
//   );
// };

// export default ManageOrders;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import OrderDetails from "./OrderDetails";
import { MdDone } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ManageOrders = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tiffins, setTiffins] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Helper function to format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";

    const diff = Date.now() - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes} mins ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return `${Math.floor(minutes / (24 * 60))} days ago`;
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toISOString().split("T")[0];
  };

  // // Fetching tiffins from the backend
  // const fetchTiffins = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     setApiError(null);

  //     const response = await axios.get(`${API_BASE_URL}/firm/get/tiffins`);

  //     // Transform the tiffin data similar to the restaurant data transformation
  //     const transformedData = response.data.tiffins.map((tiffin) => ({
  //       id: tiffin._id,
  //       name: tiffin.name || "Unnamed Tiffin",
  //       description: tiffin.description || "No Description",
  //       price: tiffin.price || "N/A",
  //       restaurant: tiffin.restaurant?.name || "Unknown Restaurant",
  //       restaurantId: tiffin.restaurant?._id || null,
  //       status: tiffin.status || "Active",
  //       createdAt: formatDate(tiffin.createdAt),
  //       updatedAt: formatDate(tiffin.updatedAt),
  //       type: "tiffin", //Adding type identifier (mh)
  //     }));

  //     setTiffins(transformedData);
  //     setRecentActivity((prevActivity) => {
  //       //Filter out old tiffins to avoid duplicates
  //       const filteredActivity = prevActivity.filter(
  //         (item) => !item.type || item.type !== "tiffin"
  //       );

  //       //Add new tiffins
  //       return [...filteredActivity, ...transformedData];
  //     });

  //     console.log("Tiffins loaded : ", transformedData.length);

  //     // Set the first tiffin as selected by default if none is selected
  //     // if (transformedData.length > 0 && !selectedOrder) {
  //     //   setSelectedOrder(transformedData[0]);
  //     // }
  //   } catch (error) {
  //     console.error("Error fetching tiffins data from the backend:", error);
  //     setApiError(`Failed to fetch tiffins: ${error.message}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []); // Add relevant dependencies here

  // // useEffect(() => {
  // //   fetchTiffins();
  // // }, [fetchTiffins]);

  // // Fetch restaurants from the backend
  // const fetchRestaurants = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     setApiError(null);

  //     const response = await axios.get(
  //       `${API_BASE_URL}/firm/get/newRestaurant`
  //     );

  //     // Transform the restaurant data
  //     const transformedData = response.data.restaurants.map((restaurant) => ({
  //       id: restaurant._id,
  //       restaurantname: restaurant.restaurantInfo?.name || "Unnamed Restaurant",
  //       claimername: restaurant.ownerName || "No Claimer",
  //       phone: restaurant.restaurantInfo?.phoneNo || "N/A",
  //       restaurantaddress:
  //         restaurant.restaurantInfo?.address || "Address Not Available",
  //       status: restaurant.restaurantStatus || "Pending", // Use the stored status
  //       time: formatTime(restaurant.createdAt),
  //       dateofrequest: formatDate(restaurant.createdAt),
  //       dateofclaimsubmission: formatDate(restaurant.updatedAt),
  //     }));

  //     setRestaurants(transformedData);

  //     //Update combined state
  //     setRecentActivity((prevActivity) => {
  //       const filteredActivity = prevActivity.filter(
  //         (item) => !item.type || item.type !== "restaurant"
  //       );
  //       //Add new Restaurants
  //       return [...filteredActivity, ...transformedData];
  //     });

  //     console.log("Restaurants loaded : ", transformedData.length);

  //     // Set the first restaurant as selected by default
  //     // if (transformedData.length > 0 && !selectedOrder) {
  //     //   setSelectedOrder(transformedData[0]);
  //     // }
  //   } catch (err) {
  //     console.error("Error fetching restaurants:", err);
  //     setError(`Failed to fetch restaurants: ${err.message}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // // useEffect(() => {
  // //   fetchRestaurants();
  // // }, [fetchRestaurants]);

  // useEffect(() => {
  //   //Fetching both data sources
  //   const fetchAllData = async () => {
  //     await Promise.all([fetchTiffins(), fetchRestaurants()]);

  //     setRecentActivity((prevActivity) => {
  //       if (prevActivity.length > 0 && !selectedOrder) {
  //         setSelectedOrder[prevActivity[0]];
  //       }
  //       return prevActivity;
  //     });
  //   };

  //   fetchAllData();
  // }, [fetchTiffins, fetchRestaurants]);

  // Fetching tiffins from the backend
  // const fetchTiffins = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     setApiError(null);

  //     const response = await axios.get(`${API_BASE_URL}/firm/get/tiffins`);
  //     console.log("Tiffin response received:", response.data);

  //     // Transform the tiffin data
  //     // const transformedData = response.data.tiffins.map((tiffin) => ({
  //     //   id: tiffin._id,
  //     //   name: tiffin.kitchenName || "Unnamed Tiffin",
  //     //   description: tiffin.description || "No Description",
  //     //   price: tiffin.price || "N/A",
  //     //   restaurant: tiffin.restaurant?.name || "Unknown Restaurant",
  //     //   restaurantId: tiffin.restaurant?._id || null,
  //     //   status: tiffin.status || "Active",
  //     //   createdAt: formatDate(tiffin.createdAt),
  //     //   updatedAt: formatDate(tiffin.updatedAt),
  //     //   type: "tiffin", // Add type identifier
  //     // }));
  //     const transformedData = response.data.tiffins.map((tiffin) => ({
  //       id: tiffin._id,
  //       restaurantname: tiffin.kitchenName || "Unnamed Tiffin", // Using kitchenName instead of name
  //       claimername: tiffin.ownerMail || "No Email",
  //       phone: tiffin.ownerPhoneNo?.fullNumber || "N/A",
  //       category: Array.isArray(tiffin.category)
  //         ? tiffin.category.join(", ")
  //         : "N/A",
  //       deliveryCity: tiffin.deliveryCity || "Unknown Location",
  //       ratings: tiffin.ratings || 0,
  //       status: tiffin.status || "Active",
  //       time: formatTime(tiffin.createdAt),
  //       createdAt: formatDate(tiffin.createdAt || new Date()),
  //       updatedAt: formatDate(
  //         tiffin.updatedAt || tiffin.createdAt || new Date()
  //       ),
  //       type: "tiffin", // Add type identifier
  //     }));

  //     console.log("Transformed tiffins:", transformedData.length);

  //     return transformedData;
  //   } catch (error) {
  //     console.error("Error fetching tiffins data from the backend:", error);
  //     setApiError(`Failed to fetch tiffins: ${error.message}`);
  //     return [];
  //   }
  // }, []);

  // Fetching tiffins from the backend - minimal changes
  const fetchTiffins = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await axios.get(`${API_BASE_URL}/firm/get/tiffins`);
      console.log("Tiffin response received:", response.data);

      // Transform the tiffin data to match restaurant data structure exactly
      const transformedData = response.data.tiffins.map((tiffin) => {
        // Calculate formatted times
        const createdDate = tiffin.createdAt
          ? new Date(tiffin.createdAt)
          : new Date();
        const updatedDate = tiffin.updatedAt
          ? new Date(tiffin.updatedAt)
          : createdDate;

        return {
          id: tiffin._id,
          restaurantname: tiffin.kitchenName || "Unnamed Tiffin",
          claimername: tiffin.ownerMail || "No Email",
          phone: tiffin.ownerPhoneNo?.fullNumber || "N/A",
          restaurantaddress:
            tiffin.deliveryCity || tiffin.address || "Unknown Location",
          // Use status field if it exists, otherwise "Active" as default for tiffins
          status: tiffin.status || "Active",
          time: formatTime(createdDate),
          dateofrequest: formatDate(createdDate),
          dateofclaimsubmission: formatDate(updatedDate),
          // Add registrationStatus for consistency with restaurants
          registrationStatus: tiffin.registrationStatus || "complete",
          termsAccepted: tiffin.termsAccepted || true,
          type: "tiffin", // Add type identifier
        };
      });

      console.log("Transformed tiffins:", transformedData);

      return transformedData;
    } catch (error) {
      console.error("Error fetching tiffins data from the backend:", error);
      setApiError(`Failed to fetch tiffins: ${error.message}`);
      return [];
    }
  }, []);

  // Fetch restaurants from the backend
  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await axios.get(
        `${API_BASE_URL}/firm/get/newRestaurant`
      );
      console.log("Restaurant response received:", response.data);

      // Transform the restaurant data
      const transformedData = response.data.restaurants.map((restaurant) => ({
        id: restaurant._id,
        ownerEmail: restaurant.ownerEmail,
        restaurantname: restaurant.restaurantInfo?.name || "Unnamed Restaurant",
        claimername: restaurant.ownerName || "No Claimer",
        phone: restaurant.restaurantInfo?.phoneNo || "N/A",
        restaurantaddress:
          restaurant.restaurantInfo?.address || "Address Not Available",
        status: restaurant.restaurantStatus || "Pending",
        time: formatTime(restaurant.createdAt),
        dateofrequest: formatDate(restaurant.createdAt),
        dateofclaimsubmission: formatDate(restaurant.updatedAt),
        type: "restaurant", // Add type identifier
      }));

      console.log("Transformed restaurants:", transformedData.length);

      return transformedData;
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setApiError(`Failed to fetch restaurants: ${err.message}`);
      return [];
    }
  }, []);

  // Single useEffect to fetch both data types exactly once
  useEffect(() => {
    // Only fetch if we haven't already
    if (!dataFetched) {
      const fetchAllData = async () => {
        setIsLoading(true);
        setApiError(null);

        try {
          // Fetch data in parallel
          const [tiffinData, restaurantData] = await Promise.all([
            fetchTiffins(),
            fetchRestaurants(),
          ]);

          console.log(
            `Got ${tiffinData.length} tiffins and ${restaurantData} restaurants`
          );

          // Combine the data while ensuring no duplicates (by ID)
          const combinedData = [...tiffinData, ...restaurantData];
          const uniqueData = Array.from(
            new Map(combinedData.map((item) => [item.id, item])).values()
          );

          console.log(`Combined data: ${uniqueData.length} unique items`);

          // Update state with combined data
          setRecentActivity(uniqueData);

          // Set the first item as selected by default if none is selected
          if (uniqueData.length > 0 && !selectedOrder) {
            setSelectedOrder(uniqueData[0]);
          }

          // Mark data as fetched so we don't fetch again
          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [fetchTiffins, fetchRestaurants, dataFetched, selectedOrder]);

  // // Status change handler with API call
  // const statusChange = async (orderId, newStatus) => {
  //   try {
  //     setApiError(null);

  //     // Validate status - including all supported statuses
  //     const validStatuses = [
  //       "Pending",
  //       "Claimed",
  //       "Unclaimed",
  //       "Revoked",
  //       "Approved",
  //       "Rejected",
  //       "Later",
  //     ];

  //     if (!validStatuses.includes(newStatus)) {
  //       console.error(`Invalid status: ${newStatus}`);
  //       setApiError(
  //         `Status "${newStatus}" is not supported. Valid statuses are: ${validStatuses.join(
  //           ", "
  //         )}`
  //       );
  //       return;
  //     }

  //     console.log(`Changing status for ${orderId} to ${newStatus}`);

  //     // Optimistically update the UI first
  //     const updatedOrders = recentActivity.map((order) =>
  //       order.id === orderId ? { ...order, status: newStatus } : order
  //     );
  //     setRecentActivity(updatedOrders);

  //     if (selectedOrder?.id === orderId) {
  //       setSelectedOrder({ ...selectedOrder, status: newStatus });
  //     }

  //     // Make API call to update status
  //     try {
  //       const response = await axios.post(
  //         `${API_BASE_URL}/firm/update-restaurant-status`,
  //         {
  //           restaurantId: orderId,
  //           status: newStatus, // Send 'status' as expected by the backend
  //         }
  //       );

  //       console.log("Status update response:", response.data);
  //     } catch (apiError) {
  //       // Log the detailed error information
  //       console.error("API Error:", apiError);
  //       console.error("API Error Response:", apiError.response?.data);

  //       // Check if we have detailed error information from the server
  //       const errorMessage =
  //         apiError.response?.data?.message || apiError.message;
  //       setApiError(`Failed to update status: ${errorMessage}`);
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error updating restaurant status:", error);
  //     setApiError(`An unexpected error occurred: ${error.message}`);
  //   }
  // };

  // Status change handler with API call - minimal changes to support both types
  const statusChange = async (itemId, newStatus, ownerEmail) => {
  // Find the item *before* any state changes to get its original status
  const item = recentActivity.find((item) => item.id === itemId);

  try {
    setApiError(null);

    // Validate status - including all supported statuses
    const validStatuses = [
      "Pending",
      "Claimed",
      "Unclaimed",
      "Revoked",
      "Approved",
      "Rejected",
      "Later",
      "Active",
    ];

    if (!validStatuses.includes(newStatus)) {
      console.error(`Invalid status: ${newStatus}`);
      setApiError(
        `Status "${newStatus}" is not supported. Valid statuses are: ${validStatuses.join(
          ", "
        )}`
      );
      return;
    }

    if (!item) {
      console.error(`Item with ID ${itemId} not found`);
      setApiError(`Item with ID ${itemId} not found`);
      return;
    }

    console.log(
      `Changing status for ${itemId} (${
        item.type || "restaurant"
      }) to ${newStatus}`
    );

    // Optimistically update the UI first
    const updatedOrders = recentActivity.map((order) =>
      order.id === itemId ? { ...order, status: newStatus } : order
    );
    setRecentActivity(updatedOrders);

    if (selectedOrder?.id === itemId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    // Make API call to update status
    try {
      // Determine if this is a tiffin or restaurant
      const isTiffin = item.type === "tiffin";

      // Use the appropriate endpoint and payload format
      const endpoint = isTiffin
        ? `${API_BASE_URL}/firm/update-tiffin-status`
        : `${API_BASE_URL}/firm/update-restaurant-status`;

      const payload = isTiffin
        ? { tiffinId: itemId, status: newStatus }
        : { restaurantId: itemId, status: newStatus, ownerEmail };

      console.log(`Sending update to ${endpoint}:`, payload);

      const response = await axios.post(endpoint, payload);

      console.log("Status update response:", response.data);
    } catch (apiError) {
      // Log the detailed error information
      console.error("API Error:", apiError);
      console.error("API Error Response:", apiError.response?.data);

      // --- UPDATED ERROR HANDLING ---
      let displayError;
      if (apiError.response?.status === 404) {
        // Specifically handle the 404 error
        const endpoint = apiError.config.url.replace(API_BASE_URL, "");
        displayError = `Update Failed: The API route (${endpoint}) was not found on the server (404). This is a backend configuration issue.`;
        console.error(
          `Backend 404 Error: The route ${apiError.config.method.toUpperCase()} ${endpoint} does not exist on the server.`
        );
        return;
      }

      // Find the item to determine its type
      const item = recentActivity.find((item) => item.id === itemId);
      if (!item) {
        console.error(`Item with ID ${itemId} not found`);
        setApiError(`Item with ID ${itemId} not found`);
        return;
      }

      console.log(
        `Changing status for ${itemId} (${
          item.type || "restaurant"
        }) to ${newStatus}`
      );

      // Optimistically update the UI first
      const updatedOrders = recentActivity.map((order) =>
        order.id === itemId ? { ...order, status: newStatus } : order
      );
      setRecentActivity(updatedOrders);

      if (selectedOrder?.id === itemId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      // Make API call to update status
      try {
        // Determine if this is a tiffin or restaurant
        const isTiffin = item.type === "tiffin";

        // Use the appropriate endpoint and payload format
        const endpoint = isTiffin
          ? `${API_BASE_URL}/firm/update-tiffin-status`//problem 2
          : `${API_BASE_URL}/firm/update-restaurant-status`;

        const payload = isTiffin
          ? { tiffinId: itemId, status: newStatus }
          : { restaurantId: itemId, status: newStatus, ownerEmail };

        console.log(`Sending update to ${endpoint}:`, payload);

        const response = await axios.post(endpoint, payload);

        console.log("Status update response:", response.data);
      } catch (apiError) {
        // Log the detailed error information
        console.error("API Error:", apiError);
        console.error("API Error Response:", apiError.response?.data);

        // Check if we have detailed error information from the server
        const errorMessage =
          apiError.response?.data?.message || apiError.message;
        displayError = `Failed to update status: ${errorMessage}`;
      }
      setApiError(displayError);
      // --- END OF UPDATE ---

      // Revert the optimistic UI update on error
      // Use the 'item.status' from the item we found at the very top
      const revertedItems = recentActivity.map((order) =>
        order.id === itemId ? { ...order, status: item.status } : order
      );
      setRecentActivity(revertedItems);

      // Also revert selectedOrder if it was the one being updated
      if (selectedOrder?.id === itemId) {
        setSelectedOrder({ ...selectedOrder, status: item.status });
      }
    }
  } catch (error) {
    console.error("Unexpected error updating status:", error);
    setApiError(`An unexpected error occurred: ${error.message}`);
  }
};

  // Filter restaurants based on status
  const filteredActivity = statusFilter
    ? recentActivity.filter((order) => order.status === statusFilter)
    : recentActivity;

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-8 h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading restaurants...</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 p-2 md:p-4">
          <div className="bg-white rounded-lg shadow p-3 md:p-4 w-full md:w-3/5 lg:w-2/3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-lg font-semibold">REQUESTS</h2>
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer w-full sm:w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option className="text-green-500" value="Claimed">
                  Claimed
                </option>
                <option className="text-red-800" value="UnClaimed">
                  UnClaimed
                </option>
                <option className="text-blue-800" value="Pending">
                  Pending
                </option>
                <option className="text-gray-800" value="Revoked">
                  Revoked
                </option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-black border-b bg-gray-50">
                    <th className="py-2 px-2 text-left font-medium">
                      Restaurant ID
                    </th>
                    <th className="py-2 px-2 text-left font-medium">
                      Restaurant Name
                    </th>
                    <th className="py-2 px-2 text-left font-medium">
                      Claimer Name
                    </th>
                    <th className="py-2 px-2 text-left font-medium hidden sm:table-cell">
                      Time
                    </th>
                    <th className="py-2 px-2 text-left font-medium">Status</th>
                    <th className="py-2 px-2 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((order) => (
                      <tr
                        key={order.id}
                        className={`cursor-pointer border-b last:border-0 hover:bg-gray-50
                                        ${
                                          selectedOrder.id === order.id
                                            ? "bg-gray-100"
                                            : ""
                                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-2 px-2 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {order.restaurantname}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {order.claimername}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap hidden sm:table-cell">
                          {order.time}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              order.status === "Claimed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "UnClaimed"
                                ? "bg-red-100 text-red-800"
                                : order.status === "Pending"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            {order.status === "Pending" && (
                              <>
                                <button
                                  className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    statusChange(order.id, "Claimed");
                                  }}
                                  title="Approve Claim"
                                >
                                  <MdDone size={18} />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    statusChange(order.id, "Revoked");
                                  }}
                                  title="Reject Claim"
                                >
                                  <MdOutlineCancel size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        No requests found for the selected status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-2/5 lg:w-1/3">
            {selectedOrder ? (
              <OrderDetails
                order={selectedOrder}
                onStatusChange={statusChange}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                Select a request to see details.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <FiAlertTriangle className="inline-block mr-2" size={24} />
        {error}
        <p className="text-sm text-gray-600 mt-2">
          Please check the API endpoint and ensure the backend is running
          correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="bg-white rounded shadow p-4 w-[60%]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">RESTAURANTS</h2>
          <select
            className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Claimed">Claimed</option>
            <option value="Unclaimed">Unclaimed</option>
            <option value="Revoked">Revoked</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Later">Later</option>
          </select>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 flex items-center">
            <FiAlertTriangle className="mr-2" />
            {apiError}
          </div>
        )}

        {filteredActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No restaurants found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-black border-b">
                  <th className="py-2 px-2 text-left">Restaurant ID</th>
                  <th className="py-2 px-2 text-left">Restaurant Name</th>
                  <th className="py-2 px-2 text-left">Claimer Name</th>
                  <th className="py-2 px-2 text-left">Time</th>
                  <th className="py-2 px-2 text-left">Status</th>
                  <th className="py-2 px-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.map((order) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer border-b last:border-0 hover:bg-gray-50
                      ${selectedOrder?.id === order.id ? "bg-gray-100" : ""}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td
                      className="py-2 px-2 max-w-[100px] truncate"
                      title={order.id}
                    >
                      {order.id}
                    </td>
                    <td className="py-2 px-2">{order.restaurantname}</td>
                    <td className="py-2 px-2">{order.claimername}</td>
                    <td className="py-2 px-2">{order.time}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          order.status === "Pending"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Claimed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Unclaimed"
                            ? "bg-red-100 text-red-800"
                            : order.status === "Approved"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "Rejected"
                            ? "bg-red-200 text-red-900"
                            : order.status === "Later"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Revoked"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {order.status === "Pending" && (
                          <>
                            <button
                              className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Claimed");//problem 1
                              }}
                              title="Claim"
                            >
                              <MdDone size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Unclaimed");
                              }}
                              title="Unclaim"
                            >
                              <MdOutlineCancel size={20} />
                            </button>
                          </>
                        )}
                        {order.status === "Claimed" && (
                          <>
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Pending");
                              }}
                              title="Mark as Pending"
                            >
                              <MdDone size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Revoked");
                              }}
                              title="Revoke"
                            >
                              <MdOutlineCancel size={20} />
                            </button>
                          </>
                        )}
                        {order.status === "Approved" && (
                          <>
                            <button
                              className="text-yellow-500 hover:text-yellow-700 p-1 rounded-full hover:bg-yellow-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Claimed");
                              }}
                              title="Change to Claimed"
                            >
                              <MdDone size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                statusChange(order.id, "Unclaimed");
                              }}
                              title="Unclaim"
                            >
                              <MdOutlineCancel size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="w-[40%]">
        {selectedOrder && (
          <OrderDetails order={selectedOrder} onStatusChange={statusChange} />
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
