// import React, { useState, useEffect } from "react";
// import Axios from "axios";
// import { DisplayOrder } from "./DisplayOrder";
// import Bookings from "./Bookings";
// import { TiffinDisplayOrder } from "./TiffinOrderDisplay";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import TakeawayOrders from "./TakeAwayPage";
// import { useAdmin } from "../../../context/AdminDashboardContext";
// const OrderManagement = ({ orders = [] }) => {
//   const [currentTab, setCurrentTab] = useState("order");
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [takeAway, setTakeAway] = useState([]);
//   const { orderType, latestOrder } = useAdmin();
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         if (currentTab === "dining") {
//           const response = await Axios.get(
//             `${import.meta.env.VITE_SERVER_URL}/api/bookings`,
//             { withCredentials: true }
//           );
//           setFilteredOrders(response.data || []);
//         } else if (currentTab === "tiffin") {
//           const response = await Axios.get(
//             `${import.meta.env.VITE_SERVER_URL}/api/orders/tiffin`,
//             { withCredentials: true }
//           );

//           setFilteredOrders(response.data.orders);
//         } else if (currentTab === "takeaway") {
//           const response = await Axios.get(
//             `${import.meta.env.VITE_SERVER_URL}/api/orders/menu`,
//             { withCredentials: true }
//           );
//           setTakeAway(response.data.orders);
//         } else {
//           setFilteredOrders(
//             orders.filter((item) => item.typeOfOrder === currentTab)
//           );
//         }
//       } catch (error) {
//         console.error(`Error fetching ${currentTab} orders:`, error);
//         alert(`An error occurred while fetching ${currentTab} orders.`);
//         setFilteredOrders([]);
//         setTakeAway([]);
//       }
//     };

//     fetchOrders();
//   }, [currentTab, orders]);
//   useEffect(() => {
//     if (latestOrder) {
//     }
//   }, [orderType, latestOrder]);
//   const updateOrderStatus = (orderId, newStatus, orderType) => {
//     Axios.put(
//       `${import.meta.env.VITE_SERVER_URL}/api/order/${orderId}`,
//       { status: newStatus },
//       { withCredentials: true }
//     )
//       .then(() => {
//         if (orderType === "takeaway") {
//           setTakeAway((prev) =>
//             prev.map((order) =>
//               order._id === orderId ? { ...order, status: newStatus } : order
//             )
//           );
//         } else if (orderType === "tiffin") {
//           setFilteredOrders((prev) =>
//             prev.map((order) =>
//               order._id === orderId ? { ...order, status: newStatus } : order
//             )
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error updating order status:", error);
//         alert("Failed to update order status. Please try again.");
//       });
//   };

//   const onAction = (orderId, actionType, orderType) => {
//     let newStatus;
//     if (actionType === "accept") {
//       newStatus = "accepted";
//     } else {
//       newStatus = "rejected";
//     }

//     Axios.put(
//       `${import.meta.env.VITE_SERVER_URL}/api/order/${orderId}`,
//       { status: newStatus },
//       { withCredentials: true }
//     )
//       .then(() => {
//         if (orderType === "takeaway") {
//           setTakeAway((prev) =>
//             prev.map((order) =>
//               order._id === orderId ? { ...order, status: newStatus } : order
//             )
//           );
//         } else if (orderType === "tiffin") {
//           setFilteredOrders((prev) =>
//             prev.map((order) =>
//               order._id === orderId ? { ...order, status: newStatus } : order
//             )
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error performing order action:", error);
//         alert("Failed to perform action. Please try again.");
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold text-blue-500">
//               Order Management
//             </h1>

//             <nav className="hidden md:flex space-x-4">
//               {["order", "takeaway", "tiffin", "dining"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setCurrentTab(tab)}
//                   className={`px-4 py-2 rounded-md transition-colors ${
//                     currentTab === tab
//                       ? "bg-blue-500 text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </nav>

//             <div className="md:hidden relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md"
//               >
//                 <span>
//                   {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
//                 </span>
//                 {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
//                   {["order", "takeaway", "tiffin", "dining"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => {
//                         setCurrentTab(tab);
//                         setIsDropdownOpen(false);
//                       }}
//                       className={`block w-full text-left px-4 py-2 ${
//                         currentTab === tab
//                           ? "bg-blue-500 text-white"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {currentTab === "dining" && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <Bookings heading="Dining" order={filteredOrders} />
//           </div>
//         )}

//         {currentTab === "tiffin" && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <TiffinDisplayOrder
//               heading="Tiffin"
//               orders={filteredOrders}
//               onUpdateStatus={(orderId, newStatus) =>
//                 updateOrderStatus(orderId, newStatus, "tiffin")
//               }
//               onAction={(orderId, actionType) =>
//                 onAction(orderId, actionType, "tiffin")
//               }
//             />
//           </div>
//         )}

//         {currentTab === "takeaway" && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             {takeAway.length > 0 ? (
//               <TakeawayOrders
//                 heading="TakeAway"
//                 orders={takeAway}
//                 onUpdateStatus={(orderId, newStatus) =>
//                   updateOrderStatus(orderId, newStatus, "takeaway")
//                 }
//                 onAction={(orderId, actionType) =>
//                   onAction(orderId, actionType, "takeaway")
//                 }
//               />
//             ) : (
//               <p>No takeaway orders available</p>
//             )}
//           </div>
//         )}

//         {currentTab !== "dining" &&
//           currentTab !== "tiffin" &&
//           currentTab !== "takeaway" && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <DisplayOrder heading={currentTab} order={filteredOrders} />
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;

import React, { useState, useEffect } from "react";
import Axios from "axios";
import DisplayOrder from "./DisplayOrder";
import Bookings from "./Bookings";
import { TiffinDisplayOrder } from "./TiffinOrderDisplay";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import TakeawayOrders from "./TakeAwayPage";
import {useAdmin} from "../../../context/AdminDashboardContext"


const OrderManagement = ({ orders = [] }) => {
  const [currentTab, setCurrentTab] = useState("order");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [takeAway, setTakeAway] = useState([]);
  const {orderType,latestOrder}=useAdmin();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (currentTab === "dining") {
          const response = await Axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/bookings`,
            { withCredentials: true }
          );
          setFilteredOrders(response.data || []);
        } else if (currentTab === "tiffin") {
          const response = await Axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/orders/tiffin`,
            { withCredentials: true }
          );

          setFilteredOrders(response.data.orders);
        } else if (currentTab === "takeaway") {
          const response = await Axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/orders/menu`,
            { withCredentials: true }
          );
          setTakeAway(response.data.orders);
        } else {
          setFilteredOrders(orders.filter((item) => item.typeOfOrder === currentTab));
        }
      } catch (error) {
        console.error(`Error fetching ${currentTab} orders:, error`);
        alert(`An error occurred while fetching ${currentTab} orders.`);
        setFilteredOrders([]);
        setTakeAway([]);
      }
    };

    fetchOrders();
  }, [currentTab, orders]);
  useEffect(()=>{

      if(latestOrder){
        
      }
  },[orderType,latestOrder])
  const updateOrderStatus = (orderId, newStatus, orderType) => {
    Axios.put(
      `${import.meta.env.VITE_SERVER_URL}/api/order/${orderId}`,
      { status: newStatus },
      { withCredentials: true }
    )
      .then(() => {
        if (orderType === "takeaway") {
          setTakeAway((prev) =>
            prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
          );
        } else if (orderType === "tiffin") {
          setFilteredOrders((prev) =>
            prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
          );
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        alert("Failed to update order status. Please try again.");
      });
  };

  const onAction = (orderId, actionType, orderType) => {
    let newStatus;
    if (actionType === "accept") {
      newStatus = "accepted";
    } else {
      newStatus = "rejected";
    }

    Axios.put(
      `${import.meta.env.VITE_SERVER_URL}/api/order/${orderId}`,
      { status: newStatus },
      { withCredentials: true }
    )
      .then(() => {
        if (orderType === "takeaway") {
          setTakeAway((prev) =>
            prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
          );
        } else if (orderType === "tiffin") {
          setFilteredOrders((prev) =>
            prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
          );
        }
      })
      .catch((error) => {
        console.error("Error performing order action:", error);
        alert("Failed to perform action. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-500">Order Management</h1>

            <nav className="hidden md:flex space-x-4">
              {["order", "takeaway", "tiffin", "dining"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentTab === tab
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <div className="md:hidden relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                <span>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</span>
                {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  {["order", "takeaway", "tiffin", "dining"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setCurrentTab(tab);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 ${
                        currentTab === tab
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "dining" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bookings heading="Dining" order={filteredOrders} />
          </div>
        )}

        {currentTab === "tiffin" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <TiffinDisplayOrder
              heading="Tiffin"
              orders={filteredOrders}
              onUpdateStatus={(orderId, newStatus) => updateOrderStatus(orderId, newStatus, "tiffin")}
              onAction={(orderId, actionType) => onAction(orderId, actionType, "tiffin")}
            />
          </div>
        )}

        {currentTab === "takeaway" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {takeAway.length > 0 ? (
              <TakeawayOrders
                heading="TakeAway"
                orders={takeAway}
                onUpdateStatus={(orderId, newStatus) => updateOrderStatus(orderId, newStatus, "takeaway")}
                onAction={(orderId, actionType) => onAction(orderId, actionType, "takeaway")}
              />
            ) : (
              <p>No takeaway orders available</p>
            )}
          </div>
        )}

        {currentTab !== "dining" && currentTab !== "tiffin" && currentTab !== "takeaway" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <DisplayOrder heading={currentTab} order={filteredOrders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;