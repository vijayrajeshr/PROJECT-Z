import React, { useState } from "react";
import { FaStar, FaInfoCircle } from "react-icons/fa";
import { useResource } from "../../../context/Banner_CollectionContext";
// Dummy data for available restaurants
const allRestaurants = [
    { _id: '1', name: 'Tasty Burger', cuisine: 'American', location: "Toronto", ratings: '4.5' },
    { _id: '2', name: 'Sushi Master', cuisine: 'Japanese', location: "Toronto", ratings: '3.0' },
    { _id: '3', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '1.0' },
    { _id: '4', name: 'Curryy Palace', cuisine: 'Indian', location: "Toronto", ratings: '3.0' },
    { _id: '5', name: 'Tasty Burger', cuisine: 'American', location: "Toronto", ratings: '4.5' },
    { _id: '6', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '4.5' },
    { _id: '7', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '2.0' },
    { _id: '8', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '4.0' },
    { _id: '9', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '3.5' },
    { _id: '10', name: 'Pizza Heaven', cuisine: 'Italian', location: "Toronto", ratings: '4.5' },

];

const Restaurants = ({ isEditMode }) => {
    // State for search term, temporary (unsent) selections, and final saved selections.
    const [searchTerm, setSearchTerm] = useState("");
    const [temporarySelected, setTemporarySelected] = useState([]); // Not yet sent
    const [finalSelected, setFinalSelected] = useState([]); // Array of { restaurantId, status }
    const [filter, setFilter] = useState("All Restaurants");
    const [requestDate, setRequestDate] = useState('')

    // Toggle checkbox only if the restaurant is not already sent.
    const handleCheckboxChange = (restaurant) => {
        // If not in edit mode and restaurant is already sent, do nothing.
        if (!isEditMode && finalSelected.some(s => s.restaurantId === restaurant._id)) {
            return;
        }

        // In edit mode, if restaurant is already sent, allow unselecting it (remove from finalSelected)
        if (isEditMode && finalSelected.some(s => s.restaurantId === restaurant._id)) {
            setFinalSelected(finalSelected.filter(s => s.restaurantId !== restaurant._id));
            return;
        }

        // Otherwise, toggle temporary selection.
        const alreadyTemp = temporarySelected.some(r => r._id === restaurant._id);
        if (alreadyTemp) {
            setTemporarySelected(temporarySelected.filter(r => r._id !== restaurant._id));
        } else {
            setTemporarySelected([...temporarySelected, restaurant]);
        }
    };

    // When clicking "Send Request", add all temporary selections to finalSelected
    // with a default "Pending" status and clear temporary selections.
    const handleSendRequest = () => {
        if (!requestDate) {
            return alert('Select expiry date of the request')
        }
        const newSelections = temporarySelected.map(r => ({
            restaurantId: r._id,
            status: "Pending"
        }));
        const updatedFinal = [...finalSelected];

        newSelections.forEach(newItem => {
            if (!updatedFinal.some(item => item.restaurantId === newItem.restaurantId)) {
                updatedFinal.push(newItem);
            }
        });

        setFinalSelected(updatedFinal);
        setTemporarySelected([]);
    };

    // Filtering logic: 
    // "All Restaurants": show every restaurant.
    // "Accepted", "Pending", "Denied": show only restaurants with that status in finalSelected.
    // "Request Unsent": show only restaurants that have not been sent.
    const filteredRestaurants = allRestaurants.filter(restaurant => {
        // Filter by search term:
        if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        const finalEntry = finalSelected.find(s => s.restaurantId === restaurant._id);
        if (filter === "All Restaurants") return true;
        if (filter === "Request Unsent") return !finalEntry;
        if (["Accepted", "Pending", "Denied"].includes(filter)) {
            return finalEntry && finalEntry.status === filter;
        }
        return true;
    });

    const handleDateTime = (e) => {
        setRequestDate(e.target.value)
    }

    // Retrieve status text (if any) for a given restaurant.
    const getStatusText = (restaurantId) => {
        const entry = finalSelected.find(s => s.restaurantId === restaurantId);
        return entry ? entry.status : null;
    };

    // Return a CSS class based on status for colorful text.
    const getStatusColorClass = (status) => {
        switch (status) {
            case "Accepted":
                return "text-green-500";
            case "Pending":
                return "text-yellow-500";
            case "Denied":
                return "text-red-500";
            default:
                return "";
        }
    };
    const getRatingColor = (rating) => {
        if (rating <= 1) return "bg-red-700";
        if (rating <= 3.5) return "bg-yellow-600";
        return "bg-green-700";
    };

    return (
        <div className="h-full">
            

            {/* Header & Search */}
            <h3 className="text-lg text-gray-800 font-semibold mb-2">Available Restaurants</h3>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search restaurant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                <div className="bg-gray-100 font-medium p-2 rounded w-fit flex items-center gap-1">
                    <FaStar size={14} color="green" />
                    4.0+
                </div>
                <select name="location" className="p-2 rounded w-fit">
                    <option value="All">All Cities</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Totonto">Totonto</option>
                    <option value="Delhi">Delhi</option>
                    <option value="New Delhi">New Delhi</option>
                </select>

                {/* Filter Dropdown */}
                <div className="">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 rounded"
                    >
                        <option value="All Restaurants">All Restaurants</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Pending">Pending</option>
                        <option value="Denied">Denied</option>
                        <option value="Request Unsent">Request Unsent</option>
                    </select>
                </div>
            </div>



            {/* Restaurants List */}
            <div className="space-y-1 px-1 bg-gray-100 rounded h-96 overflow-auto">
                {filteredRestaurants.map((restaurant, index) => {
                    const isFinalSelected = finalSelected.some(s => s.restaurantId === restaurant._id);
                    const isTempSelected = temporarySelected.some(r => r._id === restaurant._id);
                    const isChecked = isFinalSelected || isTempSelected;
                    const statusText = getStatusText(restaurant._id);

                    return (
                        <div key={restaurant._id}>
                            <label
                                htmlFor={restaurant._id}
                                className="cursor-pointer border-b w-full p-2 flex items-center justify-between hover:shadow-sm"
                            >
                                <div className="flex items-center gap-4 w-[40%] justify-between">
                                    <span className="text-lg text-gray-900 whitespace-nowrap">
                                        <span className="text-base mr-2">{index + 1}.</span> {restaurant.name}
                                    </span>

                                    <div className="flex items-center gap-3 ml-3">
                                        {/* <div
                                            className={`w-12 p-1 text-white rounded flex justify-between items-center gap-1 ${getRatingColor(
                                                restaurant.ratings
                                            )}`}
                                        >
                                            <span className="text-sm">{restaurant.ratings}</span>
                                            <FaStar size={12} />
                                        </div> */}

                                        <div className="bg-green-700 w-12 p-1 text-white rounded flex justify-between items-center gap-1">
                                            <span className="text-sm">{restaurant.ratings}</span>
                                            <FaStar size={12} />
                                        </div>


                                        <div className="relative">
                                            <FaInfoCircle
                                                size={16}
                                                className="text-gray-600 cursor-pointer peer"
                                            />
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden peer-hover:block bg-white text-xs rounded w-48 px-2 py-2 shadow-2xl pointer-events-none">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-semibold">Location:</span> {restaurant.location}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-semibold">Cuisine:</span> {restaurant.cuisine}
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="w-fit text-xs bg-purple-300 p-1 rounded-md">Dine In</p>
                                                        <p className="w-fit text-xs bg-green-300 p-1 rounded-md">Delivery</p>
                                                        <p className="w-fit text-xs bg-red-300 p-1 rounded-md">Tiffin services</p>
                                                    </div>
                                                    <div className="flex gap-2 flex-col justify-between h-full">
                                                        {Array.from({ length: 3 }).map((_, index) => (
                                                            <div
                                                                key={index}
                                                                className="h-full bg-green-700 p-1 text-white rounded flex gap-1 items-center"
                                                            >
                                                                <span className="text-xs">4.5</span>
                                                                <FaStar size={10} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Display status text if restaurant is already sent */}
                                    {statusText && (
                                        <span className={`${getStatusColorClass(statusText)} text-base`}>
                                            {statusText}
                                        </span>
                                    )}

                                    <input
                                        id={restaurant._id}
                                        type="checkbox"
                                        // When not in edit mode, disable updating a restaurant already sent.
                                        disabled={!isEditMode && isFinalSelected}
                                        checked={isChecked}
                                        onChange={() => handleCheckboxChange(restaurant)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />

                                </div>
                            </label>
                        </div>
                    );
                })}
            </div>

            <div className="flex mt-4 gap-4">
                {/* Send Request Button */}
                <button
                    onClick={handleSendRequest}
                    disabled={temporarySelected.length === 0}
                    className={`w-fit py-2 px-4 rounded ${temporarySelected.length === 0
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                >
                    Send Request
                </button>

                {temporarySelected.length !== 0 &&
                    <div className="bg-gray-100 text-base py-2 px-4 rounded">
                        <span className="text-base font-medium mr-3">Request's Expiry date: </span>
                        <input type="datetime-local" name="" id="" value={requestDate} className="bg-transparent" onChange={handleDateTime} />
                    </div>
                }
            </div>
        </div>
    );
};

export default Restaurants;



