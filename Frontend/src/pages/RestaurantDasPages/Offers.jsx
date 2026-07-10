// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import Axios from "axios";
// import dummy from "../../data/RestaurentDasData/dummy";
// import { initialOffers } from "../../data/offersData";
// import CreateOfferForm from "../../components/RestaurantDasComponents/Offers/CreateOfferForm";
// import OffersList from "../../components/RestaurantDasComponents/Offers/OffersList";
// import { useParams } from "react-router-dom";

// const daysOfWeek = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// function Offers() {
//   const { deliveryCategories, dineInCategories } = dummy;
//   const [offers, setOffers] = useState(initialOffers);
//   const [activeTab, setActiveTab] = useState("createOffer");
//   const [selectedDay, setSelectedDay] = useState("Monday");
//   const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
//   const [selectedOffer, setSelectedOffer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pendingOffers, setPendingOffers] = useState([]);

//   const { id } = useParams();
//   const token = localStorage.getItem("token");

//   // Initialize timings state
//   const [timings, setTimings] = useState(
//     daysOfWeek.reduce(
//       (acc, day) => ({
//         ...acc,
//         [day]: {
//           openTime: "09:00",
//           closeTime: "22:00",
//           offers: {},
//         },
//       }),
//       {}
//     )
//   );

//   // Fetch offers and operating hours
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         setLoading(true);
//         const response = await Axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/api/offers/current-offers/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         setOffers(response.data);
//       } catch (error) {
//         console.error("Error fetching offers:", error);
//       }
//     };

//     const fetchPendingOffers = async () => {
//       try {
//         const response = await Axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/api/offers/pendding-offers/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         setPendingOffers(response.data);
//       } catch (error) {
//         console.error("Error fetching pending offers:", error);
//       }
//     };

//     const fetchOperatingHours = async () => {
//       try {
//         const response = await Axios.get(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/api/operating-hours/gethours/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         console.log("Operating Hours Response:", response.data);
//         const data = response?.data?.time_slots || {};
//         setTimings((prevTimings) => {
//           const newTimings = daysOfWeek.reduce(
//             (acc, day) => ({
//               ...acc,
//               [day]: {
//                 openTime: "09:00",
//                 closeTime: "22:00",
//                 offers: prevTimings[day]?.offers || {},
//               },
//             }),
//             {}
//           );

//           for (const [dbDay, range] of Object.entries(data)) {
//             const day = normalizeDayName(dbDay);
//             if (daysOfWeek.includes(day)) {
//               const [open, close] = range.split("-");
//               newTimings[day] = {
//                 openTime: convertTo24Hr(open?.trim()) || "09:00",
//                 closeTime: convertTo24Hr(close?.trim()) || "22:00",
//                 offers:
//                   response?.data?.offers?.[dbDay] ||
//                   prevTimings[day]?.offers ||
//                   {},
//               };
//             }
//           }

//           return newTimings;
//         });
//       } catch (error) {
//         console.error("Error fetching operating hours:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOffers();
//     fetchPendingOffers();
//     fetchOperatingHours();
//   }, [id, activeTab]);

//   // Item map for categories and items
//   const allDeliveryItems = deliveryCategories.flatMap((cat) =>
//     cat.subcategories.flatMap((sub) => sub.items)
//   );
//   const allDineInItems = dineInCategories.flatMap((cat) =>
//     cat.subcategories.flatMap((sub) => sub.items)
//   );
//   const allItems = [...allDeliveryItems, ...allDineInItems];

//   const itemMap = {};
//   allItems.forEach((itm) => {
//     itemMap[itm.id] = itm.name;
//   });

//   const uniqueCategories = [
//     ...new Set([...deliveryCategories, ...dineInCategories].map((c) => c.name)),
//   ];
//   const uniqueSubCategories = [
//     ...new Set(
//       [...deliveryCategories, ...dineInCategories].flatMap((cat) =>
//         cat.subcategories.map((sub) => sub.name)
//       )
//     ),
//   ];

//   // Helper functions
//   const normalizeDayName = (dbDay) => {
//     return (
//       daysOfWeek.find((day) =>
//         dbDay.toLowerCase().startsWith(day.toLowerCase())
//       ) || dbDay
//     );
//   };

//   const convertTo24Hr = (time12h) => {
//     if (!time12h) return "00:00";
//     const [time, modifier] = time12h.trim().split(/(AM|PM)/i);
//     let [hours, minutes] = time.trim().split(":");
//     hours = parseInt(hours, 10);
//     minutes = parseInt(minutes || "00", 10);

//     if (/PM/i.test(modifier) && hours !== 12) hours += 12;
//     if (/AM/i.test(modifier) && hours === 12) hours = 0;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   const generateTimeSlots = (openTime, closeTime) => {
//     const slots = [];
//     let current = new Date(`2000-01-01T${openTime}:00`);
//     let end = new Date(`2000-01-01T${closeTime}:00`);

//     if (end <= current) {
//       end.setDate(end.getDate() + 1);
//     }

//     while (current < end) {
//       slots.push(
//         current.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//       );
//       current.setMinutes(current.getMinutes() + 30);
//     }
//     return slots;
//   };

//   // Compute timeSlots based on selectedDay and timings
//   const timeSlots = useMemo(() => {
//     return generateTimeSlots(
//       timings[selectedDay].openTime,
//       timings[selectedDay].closeTime
//     );
//   }, [selectedDay, timings]);

//   // Handlers
//   const handleAddOffer = (newOffer) => {
//     setOffers((prev) => [...prev, newOffer]);
//     const url = `${
//       import.meta.env.VITE_SERVER_URL
//     }/api/operating-hours/day/${selectedDay}/offers`;
//     Axios.post(
//       url,
//       { timeSlots: selectedTimeSlots, offerId: selectedOffer },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       }
//     )
//       .then((response) => {
//         response;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const handleAddOfferTimeSlot = () => {
//     const url = `${
//       import.meta.env.VITE_SERVER_URL
//     }/api/operating-hours/day/${selectedDay}/offers`;
//     Axios.post(
//       url,
//       {
//         timeSlots: selectedTimeSlots,
//         offerId: selectedOffer,
//         day: selectedDay,
//         firmId: id,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       }
//     )
//       .then((response) => {
//         response;
//         toast.success("Offer time slots added successfully!");
//         setSelectedTimeSlots([]);
//         setSelectedOffer("");
//       })
//       .catch((error) => {
//         console.log(error);
//         toast.error("Failed to add offer time slots.");
//       });
//   };

//   const handleRemoveOffer = async (offerId) => {
//     if (window.confirm("Are you sure you want to delete this offer?")) {
//       try {
//         await Axios.put(
//           `${import.meta.env.VITE_SERVER_URL}/api/offers/delete/${offerId}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         setOffers((prev) => prev.filter((off) => off._id !== offerId));
//         setPendingOffers((prev) => prev.filter((off) => off._id !== offerId));
//         toast.success("Offer deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting offer:", error);
//         toast.error("Failed to delete offer.");
//       }
//     }
//   };

//   const handleEditOffer = async (offerId, updatedFields) => {
//     try {
//       const response = await Axios.put(
//         `${import.meta.env.VITE_SERVER_URL}/api/offers/${offerId}`,
//         updatedFields,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       const updatedOffer = response.data;
//       setOffers((prev) =>
//         prev.map((off) => (off._id === offerId ? updatedOffer : off))
//       );
//       setPendingOffers((prev) =>
//         prev.map((off) => (off._id === offerId ? updatedOffer : off))
//       );
//       toast.success("Offer updated successfully!");
//     } catch (error) {
//       console.error("Error updating offer:", error);
//       toast.error("Failed to update offer.");
//     }
//   };

//   const handleTimeSlotToggle = (slot) => {
//     setSelectedTimeSlots((prev) =>
//       prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
//     );
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gray-100"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="p-2 max-w-6xl mx-auto">
//         <motion.h1
//           className="text-3xl font-bold text-gray-800 mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           Manage Offers
//         </motion.h1>

//         <div className="border-b mb-4 flex">
//           {["createOffer", "currentOffers", "setOffers", "PendingApproval"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-3 px-4 font-medium ${
//                   activeTab === tab
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {tab === "setOffers"
//                   ? "Set Offers"
//                   : tab === "currentOffers"
//                   ? "Current Offers"
//                   : tab === "PendingApproval"
//                   ? "Pending Approval"
//                   : "Create Offer"}
//               </button>
//             )
//           )}
//         </div>

//         <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
//           {activeTab === "createOffer" && (
//             <div className="flex-1 bg-white shadow-sm rounded p-4">
//               <CreateOfferForm
//                 onSave={handleAddOffer}
//                 categories={uniqueCategories}
//                 subCategories={uniqueSubCategories}
//                 items={allItems}
//               />
//             </div>
//           )}

//           {activeTab === "currentOffers" && (
//             <div className="flex-1 bg-white shadow-sm rounded p-4">
//               <ToastContainer autoClose={3000} />
//               <OffersList
//                 title={"Current Offers"}
//                 offers={offers}
//                 onRemoveOffer={handleRemoveOffer}
//                 onEditOffer={handleEditOffer}
//                 itemMap={itemMap}
//               />
//             </div>
//           )}
//           {activeTab === "PendingApproval" && (
//             <div className="flex-1 bg-white shadow-sm rounded p-4">
//               <ToastContainer autoClose={3000} />
//               <OffersList
//                 title={"Pending Offers"}
//                 offers={pendingOffers || []}
//                 onRemoveOffer={handleRemoveOffer}
//                 onEditOffer={handleEditOffer}
//                 itemMap={itemMap}
//               />
//             </div>
//           )}

//           {activeTab === "setOffers" && (
//             <div className="p-4 space-y-6 flex-1  shadow-sm rounded bg-white">
//               <ToastContainer autoClose={3000}></ToastContainer>
//               <h2 className="text-2xl font-semibold mb-4">Set Offers</h2>
//               {loading && <p>Loading...</p>}
//               <select
//                 value={selectedDay}
//                 onChange={(e) => setSelectedDay(e.target.value)}
//                 className="w-full border rounded p-2"
//               >
//                 {daysOfWeek.map((day) => (
//                   <option className="" key={day} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">
//                   Select Time Slots:
//                 </label>
//                 {timeSlots.length > 0 ? (
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-auto max-h-64">
//                     {timeSlots.map((slot) => (
//                       <label key={slot} className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedTimeSlots.includes(slot)}
//                           onChange={() => handleTimeSlotToggle(slot)}
//                           className="form-checkbox"
//                         />
//                         <span>{slot}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : (
//                   <p>No time slots available for this day.</p>
//                 )}
//               </div>
//               <select
//                 value={selectedOffer}
//                 onChange={(e) => setSelectedOffer(e.target.value)}
//                 className="w-full border rounded p-2"
//                 disabled={loading || offers.length === 0}
//               >
//                 <option value="">Select an offer</option>
//                 {offers
//                   .filter(
//                     (e) =>
//                       e.applicability === "dining" || e.applicability === "both"
//                   )
//                   .map((offer) => (
//                     <option key={offer._id} value={offer._id}>
//                       {offer.name || offer.description || `Offer ${offer._id}`}
//                     </option>
//                   ))}
//               </select>
//               <button
//                 onClick={handleAddOfferTimeSlot}
//                 disabled={
//                   loading || !selectedTimeSlots.length || !selectedOffer
//                 }
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
//               >
//                 Add Offer
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default Offers;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Axios from "axios";
import dummy from "../../data/RestaurentDasData/dummy";
import { initialOffers } from "../../data/offersData";
import CreateOfferForm from "../../components/RestaurantDasComponents/Offers/CreateOfferForm";
import OffersList from "../../components/RestaurantDasComponents/Offers/OffersList";
import { useParams } from "react-router-dom";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Offers() {
  const { deliveryCategories, dineInCategories } = dummy;
  const [offers, setOffers] = useState(initialOffers);
  const [activeTab, setActiveTab] = useState("createOffer");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingOffers, setPendingOffers] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // Initialize timings state with API data
  const [timings, setTimings] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          timeSlots: [],
          offers: {},
        },
      }),
      {}
    )
  );

  // Fetch offers and operating hours
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/offers/current-offers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    const fetchPendingOffers = async () => {
      try {
        const response = await Axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/offers/pendding-offers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPendingOffers(response.data);
      } catch (error) {
        console.error("Error fetching pending offers:", error);
      }
    };

    const fetchOperatingHours = async () => {
      try {
        const response = await Axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/operating-hours/gethours/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Operating Hours Response:", response.data);
        const data = response?.data?.data?.time_slots || {};
        setTimings((prevTimings) => {
          const newTimings = daysOfWeek.reduce(
            (acc, day) => ({
              ...acc,
              [day]: {
                timeSlots: [],
                offers: prevTimings[day]?.offers || {},
              },
            }),
            {}
          );

          for (const [dbDay, slots] of Object.entries(data)) {
            const day = normalizeDayName(dbDay);
            if (daysOfWeek.includes(day)) {
              newTimings[day] = {
                timeSlots: slots,
                offers: prevTimings[day]?.offers || {},
              };
            }
          }

          return newTimings;
        });
      } catch (error) {
        console.error("Error fetching operating hours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
    fetchPendingOffers();
    fetchOperatingHours();
  }, [id, activeTab]);

  // Item map for categories and items
  const allDeliveryItems = deliveryCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allDineInItems = dineInCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allItems = [...allDeliveryItems, ...allDineInItems];

  const itemMap = {};
  allItems.forEach((itm) => {
    itemMap[itm.id] = itm.name;
  });

  const uniqueCategories = [
    ...new Set([...deliveryCategories, ...dineInCategories].map((c) => c.name)),
  ];
  const uniqueSubCategories = [
    ...new Set(
      [...deliveryCategories, ...dineInCategories].flatMap((cat) =>
        cat.subcategories.map((sub) => sub.name)
      )
    ),
  ];

  // Helper functions
  const normalizeDayName = (dbDay) => {
    return (
      daysOfWeek.find((day) =>
        dbDay.toLowerCase().startsWith(day.toLowerCase())
      ) || dbDay
    );
  };

  // Compute timeSlots based on selectedDay and timings
  const timeSlots = useMemo(() => {
    return timings[selectedDay].timeSlots || [];
  }, [selectedDay, timings]);

  // Handlers
  const handleAddOffer = (newOffer) => {
    setOffers((prev) => [...prev, newOffer]);
    const url = `${
      import.meta.env.VITE_SERVER_URL
    }/api/operating-hours/day/${selectedDay}/offers`;
    Axios.post(
      url,
      { timeSlots: selectedTimeSlots, offerId: selectedOffer },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    )
      .then((response) => {
        response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddOfferTimeSlot = () => {
    const url = `${
      import.meta.env.VITE_SERVER_URL
    }/api/operating-hours/day/${selectedDay}/offers`;
    Axios.post(
      url,
      {
        timeSlots: selectedTimeSlots,
        offerId: selectedOffer,
        day: selectedDay,
        firmId: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    )
      .then((response) => {
        toast.success("Offer time slots added successfully!");
        setSelectedTimeSlots([]);
        setSelectedOffer("");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to add offer time slots.");
      });
  };

  const handleRemoveOffer = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await Axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/offers/delete/${offerId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setOffers((prev) => prev.filter((off) => off._id !== offerId));
        setPendingOffers((prev) => prev.filter((off) => off._id !== offerId));
        toast.success("Offer deleted successfully!");
      } catch (error) {
        console.error("Error deleting offer:", error);
        toast.error("Failed to delete offer.");
      }
    }
  };

  const handleEditOffer = async (offerId, updatedFields) => {
    try {
      const response = await Axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/offers/${offerId}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const updatedOffer = response.data;
      setOffers((prev) =>
        prev.map((off) => (off._id === offerId ? updatedOffer : off))
      );
      setPendingOffers((prev) =>
        prev.map((off) => (off._id === offerId ? updatedOffer : off))
      );
      toast.success("Offer updated successfully!");
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer.");
    }
  };

  const handleTimeSlotToggle = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-2 max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage Offers
        </motion.h1>

        <div className="border-b mb-4 flex">
          {["createOffer", "currentOffers", "setOffers", "PendingApproval"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {tab === "setOffers"
                  ? "Set Offers"
                  : tab === "currentOffers"
                  ? "Current Offers"
                  : tab === "PendingApproval"
                  ? "Pending Approval"
                  : "Create Offer"}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
          {activeTab === "createOffer" && (
            <div className="flex-1 bg-white shadow-sm rounded p-4">
              <CreateOfferForm
                onSave={handleAddOffer}
                categories={uniqueCategories}
                subCategories={uniqueSubCategories}
                items={allItems}
              />
            </div>
          )}

          {activeTab === "currentOffers" && (
            <div className="flex-1 bg-white shadow-sm rounded p-4">
              <ToastContainer autoClose={3000} />
              <OffersList
                title={"Current Offers"}
                offers={offers}
                onRemoveOffer={handleRemoveOffer}
                onEditOffer={handleEditOffer}
                itemMap={itemMap}
              />
            </div>
          )}
          {activeTab === "PendingApproval" && (
            <div className="flex-1 bg-white shadow-sm rounded p-4">
              <ToastContainer autoClose={3000} />
              <OffersList
                title={"Pending Offers"}
                offers={pendingOffers || []}
                onRemoveOffer={handleRemoveOffer}
                onEditOffer={handleEditOffer}
                itemMap={itemMap}
              />
            </div>
          )}

          {activeTab === "setOffers" && (
            <div className="p-4 space-y-6 flex-1 shadow-sm rounded bg-white">
              <ToastContainer autoClose={3000}></ToastContainer>
              <h2 className="text-2xl font-semibold mb-4">Set Offers</h2>
              {loading && <p>Loading...</p>}
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full border rounded p-2"
              >
                {daysOfWeek.map((day) => (
                  <option className="" key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Time Slots:
                </label>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-auto max-h-64">
                    {timeSlots.map((slot) => (
                      <label key={slot} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTimeSlots.includes(slot)}
                          onChange={() => handleTimeSlotToggle(slot)}
                          className="form-checkbox"
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>No time slots available for this day.</p>
                )}
              </div>
              <select
                value={selectedOffer}
                onChange={(e) => setSelectedOffer(e.target.value)}
                className="w-full border rounded p-2"
                disabled={loading || offers.length === 0}
              >
                <option value="">Select an offer</option>
                {offers
                  .filter(
                    (e) =>
                      e.applicability === "dining" || e.applicability === "both"
                  )
                  .map((offer) => (
                    <option key={offer._id} value={offer._id}>
                      {offer.name || offer.description || `Offer ${offer._id}`}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAddOfferTimeSlot}
                disabled={
                  loading || !selectedTimeSlots.length || !selectedOffer
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                Add Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Offers;
