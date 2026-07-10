import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import Axios from "axios";
import { useContextData } from "../../../context/OutletContext";
import { toast } from "react-toastify";
import TiffinOffers from "./TiffinOffers"
export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Flat");
  const [category, setCategory] = useState("Restaurant");
  const [offerValue, setOfferValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [suggestions, setSuggestions] = useState({});
  const [displayText, setDisplayText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const { axiosApi } = useContextData();
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [res1, res2] = await Promise.all([
          
          Axios.get(`${import.meta.env.VITE_SERVER_URL}/api/offers/admin/offer`), // restaurant
          Axios.get(`${import.meta.env.VITE_SERVER_URL}/offers/admin`),
           // marketing
        ]);
  
        const restaurantOffers = res1.data.map((offer) => ({
          ...offer,
          source: "restaurant",
        }));
  
        const marketingOffers = res2.data.map((offer) => ({
          ...offer,
          source: "marketing",
        }));
  
        setApprovals([...restaurantOffers, ...marketingOffers]);
      } catch (error) {
        alert("Error occurred while getting offers");
        console.error(error);
      }
    };
  
    fetchOffers();

    // Load offers from database
    const loadOffers = async () => {
      try {
        const response = await axiosApi.get(`${import.meta.env.VITE_SERVER_URL}/offers/admin`);
        if (response.data && Array.isArray(response.data)) {
          // Normalize offers - ensure all have 'id' field
          const normalizedOffers = response.data.map(offer => ({
            ...offer,
            id: offer._id || offer.id || Date.now()
          }));
          setOffers(normalizedOffers);
        }
      } catch (error) {
        console.error('Error loading offers from database:', error);
        // Fallback to localStorage if API fails
        const savedOffers = localStorage.getItem('offers');
        if (savedOffers) {
          try {
            setOffers(JSON.parse(savedOffers));
          } catch (error) {
            console.error('Error loading offers from localStorage:', error);
          }
        }
      }
    };
    
    loadOffers();
  }, []);

  // Save offers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers));
  }, [offers]);

  const addOrUpdateOffer = async () => {
    setError(""); // Clear previous errors

    if (!code.trim() || !desc.trim() || !offerValue || !category) {
      setError("All fields are required!");
      return;
    }

    if (desc.length > 200) {
      setError("Offer description cannot exceed 200 characters");
      return;
    }

    if (isNaN(offerValue) || offerValue < 0) {
      setError("Offer value must be a positive number!");
      return;
    }

    // Validate max limits based on type
    if (type === "Percentage" && offerValue > 100) {
      setError("Percentage discount cannot exceed 100%");
      return;
    }

    if (type === "Flat" && offerValue > 10000) {
      setError("Flat discount cannot exceed $10,000");
      return;
    }

    // Validate dates if provided
    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to midnight for accurate comparison
      const selectedStartDate = new Date(startDate);
      
      if (selectedStartDate < today) {
        setError("Start date cannot be in the past");
        return;
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end.getTime() === start.getTime()) {
        setError("End date cannot be the same as start date");
        return;
      }
      
      if (end < start) {
        setError("End date must be after start date");
        return;
      }
    }

    // Validate offer code is unique when adding new offer
    if (!isEditing) {
      const codeExists = offers.some(
        (offer) => offer.code && offer.code.toUpperCase() === code.toUpperCase()
      );
      
      if (codeExists) {
        setError("Offer code must be unique");
        return;
      }
    } else {
      // When editing, check if code is unique among other offers
      const codeExists = offers.some(
        (offer) => 
          offer.code && offer.code.toUpperCase() === code.toUpperCase() && 
          (offer.id || offer._id) !== editId
      );
      
      if (codeExists) {
        setError("Offer code must be unique");
        return;
      }
    }

    const offerData = {
      code: code.toUpperCase(),
      desc,
      type,
      category,
      offerValue: parseFloat(offerValue),
      startDate: startDate || null,
      endDate: endDate || null
    };

    setLoading(true);
    try {
      if (isEditing) {
        // Update offer in database
        await axiosApi.put(
          `${import.meta.env.VITE_SERVER_URL}/offers/${editId}`,
          offerData
        );
        
        setOffers(
          offers.map((offer) =>
            offer.id === editId ? { ...offer, ...offerData } : offer
          )
        );
        toast.success("Offer updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create new offer in database
        const response = await axiosApi.post(
          `${import.meta.env.VITE_SERVER_URL}/offers`,
          offerData
        );
        
        // response.data.offer contains the newly created offer from backend
        const newOffer = {
          ...response.data.offer,
          id: response.data.offer._id || response.data.offer.id || Date.now()
        };
        
        setOffers([...offers, newOffer]);
        toast.success("Offer created successfully!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to save offer";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }

    setCode("");
    setDesc("");
    setType("Flat");
    setCategory("Restaurant");
    setOfferValue("");
    setStartDate("");
    setEndDate("");
  };

  const deleteOffer = async (id) => {
    setLoading(true);
    try {
      await axiosApi.put(`${import.meta.env.VITE_SERVER_URL}/offers/delete/${id}`);
      setOffers(offers.filter((offer) => offer.id !== id));
      toast.success("Offer deleted successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete offer";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferStatus = (id) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer
      )
    );
  };

  const handleEdit = (offer) => {
    setCode(offer.code);
    setDesc(offer.desc);
    setType(offer.type || "Flat");
    setCategory(offer.category || "Restaurant");
    setOfferValue(offer.offerValue || "");
    setStartDate(offer.startDate ? offer.startDate.split('T')[0] : "");
    setEndDate(offer.endDate ? offer.endDate.split('T')[0] : "");
    setIsEditing(true);
    setEditId(offer.id);
  };

  // const approveOffer = (id, source) => {
  //   setApprovals((prev) => prev.filter((offer) => offer._id !== id));
  //   alert("Offer approved successfully!");
  //   console.log()
  //   const url =
  //     source === "restaurant"
  //       ? `${import.meta.env.VITE_SERVER_URL}/api/offers/admin/accept/${id}`
  //       : `${import.meta.env.VITE_SERVER_URL}/offers/admin/accept/${id}`;
  
  //   Axios.put(url, { status: true }).catch(() => {
  //     alert("Offer failed to approve!");
  //   });
  // };
  
  // const rejectOffer = (id, source) => {
  //   setApprovals((prev) => prev.filter((offer) => offer._id !== id));
  //   alert("Offer rejected successfully!");
  
  //   const url =
  //     source === "restaurant"
  //       ? `${import.meta.env.VITE_SERVER_URL}/api/offers/admin/accept/${id}`
  //       : `${import.meta.env.VITE_SERVER_URL}/offers/admin/accept/${id}`;
  
  //   Axios.put(url, { status: false }).catch(() => {
  //     alert("Offer failed to reject!");
  //   });
  // };
  
  // Create a pre-configured Axios instance

// Function to handle offer actions


const handleOfferAction = (id, source, status) => {
  console.log(source)
  setApprovals((prev) => prev.filter((offer) => offer._id !== id));
  alert(`Offer ${status ? "approved" : "rejected"} successfully!`);

  const endpoint = source === "restaurant" ? "/api/offers/admin/accept" : "/offers/admin/accept";
  const url = `${endpoint}/${id}`;
  axiosApi.put(url,{status}
  )
    .then(() => console.log(`Offer ${status ? "approved" : "rejected"}: ${id}`))
    .catch(() => alert(`Offer failed to ${status ? "approve" : "reject"}!`));
};


const handleSuggestionSubmits = (id, source, suggestion) => {
  if (!suggestion.trim()) {
    alert("Suggestion cannot be empty!");
    return;
  }

  const endpoint =
    source === "restaurant"
      ? `/api/offers/suggestion/${id}`
      : `/offers/suggestion/${id}`;

  axiosApi
    .put(endpoint, { suggestion })
    .then(() => {
      alert("Suggestion posted successfully!");
      setSuggestions((prev) => ({
        ...prev,
        [id]: "", // Clear the input for this specific offer
      }));
    })
    .catch((error) => {
      alert("Failed to post suggestion. Please try again.");
      console.error(error);
    });
};



const approveOffer = (id, source) => handleOfferAction(id, source, true);
const rejectOffer = (id, source) => handleOfferAction(id, source, false);


  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "current" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current Offers
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "approval" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("Restaurant")}
        >
          Restaurant Offers Approval
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "approval" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("Tiffin")}
        >
          Tiffin Offers Approval
        </button>
      </div>

      {activeTab === "current" && (
        <div className="space-y-6">
          {/* Current Offers Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                Current Offers
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500">
                    <th className="py-3 px-4 text-left">Code</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Value</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Start Date</th>
                    <th className="py-3 px-4 text-left">End Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offers.map((offer, i) => (
                    <React.Fragment key={offer.id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{offer.code}</td>
                        <td className="py-3 px-4">{offer.desc}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                            {offer.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-green-600">
                            {offer.offerValue}
                            {offer.type === "Percentage" ? "%" : "$"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                            {offer.category || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {offer.startDate ? (
                            <span className="text-gray-700">
                              {new Date(offer.startDate).toLocaleDateString('en-GB')}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {offer.endDate ? (
                            <span className="text-gray-700">
                              {new Date(offer.endDate).toLocaleDateString('en-GB')}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleOfferStatus(offer.id)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              offer.active
                                ? "text-white bg-green-500 animate-pulse"
                                : "text-gray-600 bg-gray-200"
                            }`}
                          >
                            {offer.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-4 text-lg">
                            <button
                              onClick={() => handleEdit(offer)}
                              className="text-gray-600 hover:text-yellow-700 transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteOffer(offer.id)}
                              className="text-gray-600 hover:text-red-700 transition"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                            <button
                              onClick={() =>
                                setSelectedOffer(selectedOffer === i ? null : i)
                              }
                              className="text-gray-600 hover:text-blue-700 transition"
                              title="View"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <Transition
                        show={selectedOffer === i}
                        enter="transition-all duration-300"
                        enterFrom="max-h-0 opacity-0"
                        enterTo="max-h-20 opacity-100"
                        leave="transition-all duration-300"
                        leaveFrom="max-h-20 opacity-100"
                        leaveTo="max-h-0 opacity-0"
                      >
                        <tr>
                          <td
                            colSpan={4}
                            className="py-3 px-4 bg-gray-50 text-sm text-gray-600"
                          >
                            <p>
                              Offer details: Usage limits, valid dates, or terms &
                              conditions can be displayed here.
                            </p>
                          </td>
                        </tr>
                      </Transition>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Edit Offer Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {isEditing ? "Edit Offer" : "Add New Offer"}
            </h2>
            
            {/* Error Message Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Offer Code
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., OFF100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Offer Description
                  <span className="text-xs text-gray-500 ml-2">
                    ({desc.length}/200 characters)
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g., 50% off on first order"
                  maxLength="200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Offer Type
                </label>
                <select
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Flat">Flat (Fixed Amount)</option>
                  <option value="Percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Tiffin">Tiffin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Offer Value {type === "Percentage" ? "(%)" : "($)"}
                  <span className="text-xs text-gray-500 ml-2">
                    {type === "Percentage" ? "Max: 100%" : "Max: $10,000"}
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                  placeholder={type === "Percentage" ? "e.g., 50 (max 100)" : "e.g., 100 (max 10000)"}
                  min="0"
                  max={type === "Percentage" ? "100" : "10000"}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={addOrUpdateOffer}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? "Update Offer" : "Add Offer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Restaurant" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Restaurant Offers Approval
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                  <th className="py-3 px-4 text-center">Suggestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvals?.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{offer.code || offer.name}</td>
                    <td className="py-3 px-4">
                    <div className="text-sm text-gray-700">
  {offer.description ? (
    <span>{offer.description}</span>
  ) : (
    <>
      <span>{offer.offerType}</span>
      {offer.discountValue && (
        <span className="ml-2 text-green-500">Discount:{offer.discountValue}$</span>
      )}
    </>
  )}
</div>

                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => approveOffer(offer._id,offer.source)}
                          className="text-green-600 hover:text-green-800 transition"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => rejectOffer(offer._id,offer.source)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
        {/* <div className="flex flex-col space-y-2">
          <input
            type="text"
            name="suggestion"
            placeholder="Enter your suggestions"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={()=>handleSuggestionSubmits(offer._id,offer.source)}
            className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
          {displayText && (
            <div className="mt-2 text-gray-700 bg-gray-100 p-2 rounded-md shadow">
              <strong>Suggestion:</strong> {displayText}
            </div>
          )}
        </div> */}
        <div className="flex items-center space-x-2">
        <input
  type="text"
  className="border rounded px-3 py-2 w-full"
  placeholder="Enter your suggestion"
  value={suggestions[offer._id] || ""} // Default to empty if no suggestion exists
  onChange={(e) =>
    setSuggestions((prev) => ({
      ...prev,
      [offer._id]: e.target.value, // Update suggestion for the specific offer
    }))
  }
/>
<button
  onClick={() =>
    handleSuggestionSubmits(offer._id, offer.source, suggestions[offer._id])
  }
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
  disabled={!suggestions[offer._id]?.trim()} // Disable if suggestion is empty
>
  Submit
</button>
</div>
        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==="Tiffin" && (
          <TiffinOffers/>
      )}
    </div>
  );
}
