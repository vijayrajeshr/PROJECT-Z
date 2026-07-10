import { useState, useEffect } from "react";
import {restaurantsDummy} from "../../../../data/restaurants";

const RestaurantsList = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedType, setSelectedType] = useState('Restaurants');
  const restaurants = restaurantsDummy;

  // Update parent component with selected restaurants
  useEffect(() => {
    onSelect(Array.isArray(selectedRestaurants) ? selectedRestaurants : []);
  }, [selectedRestaurants]);

  // Handle checkbox toggle
  const handleCheckboxChange = (restaurant) => {
    setSelectedRestaurants(prev => {
      const isSelected = prev.some(r => r.id === restaurant.id);
      return isSelected
        ? prev.filter(r => r.id !== restaurant.id)
        : [...prev, restaurant];
    });
  };

  // Filter restaurants based on search term and type
  const filteredRestaurants = restaurants
    .filter(restaurant =>
      restaurant.type === selectedType &&
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-[30%] h-full flex flex-col">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedType('Restaurants')}
          className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${selectedType === 'Restaurants' ? 'border-red-600' : 'border-transparent'
            }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setSelectedType('Tiffin Services')}
          className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${selectedType === 'Tiffin Services' ? 'border-red-600' : 'border-transparent'
            }`}
        >
          Tiffin Services
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <select name="location" className="p-2 rounded w-fit">
          <option value="All">All</option>
          <option value="Delhi">Delhi</option>
          <option value="New Delhi">New Delhi</option>
        </select>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="space-y-1 bg-gray-100 rounded-sm overflow-y-auto flex-1">
          {filteredRestaurants.map((restaurant, index) => (
            <label htmlFor={restaurant.id} 
              key={restaurant.id}
              className={`cursor-pointer border-b w-full p-2 flex justify-between items-center hover:shadow-sm ${selectedRestaurants.some(r => r.id === restaurant.id) ? "bg-gray-200" : ""
                }`}
            >
              <div className="text-lg text-gray-900">
                <span className="text-base mr-2">{index + 1}. </span>
                {restaurant.name}
              </div>
              <input
                id={restaurant.id}
                type="checkbox"
                checked={selectedRestaurants.some(r => r.id === restaurant.id)}
                onChange={() => handleCheckboxChange(restaurant)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
            </label>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No Restaurants found.</div>
      )}
    </div>
  );
};

export default RestaurantsList;