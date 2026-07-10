import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Search, Store, X } from "lucide-react";

import Header from "./Header";
import { detectLocation } from "../../components/HomeComponents/PopularPlaces/CurrentLocation/detectLocation";
import RestaurantsCard from "./RestaurantsCard";

const RestaurantListSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [city, setCity] = useState("");

  const [cordinate, setCordinate] = useState({
    lat: "43.6534627",
    lon: "-79.4276471",
  });

  useEffect(() => {
    detectLocation((locationData) => {
      if (locationData) {
        setCity(locationData.address);
        setCordinate({
          lat: "43.6534627",
          lon: "-79.4276471",
          address: locationData.address?.split(",")[0]?.trim() || "Unknown",
        });
      } else {
        setError("Failed to detect location.");
      }
    });
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/restaurant`,
          { withCredentials: true }
        );
        if (Array.isArray(response.data)) {
          setRestaurants(response.data);
          setFilteredRestaurants(response.data);
          setCuisines([...new Set(response.data.map((r) => r.cuisine))]);
        } else {
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const results = restaurants.filter((restaurant) => {
        const searchQueryLower = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQueryLower ||
          restaurant.name.toLowerCase().includes(searchQueryLower) ||
          restaurant.address.toLowerCase().includes(searchQueryLower);
        const matchesCuisine =
          !selectedCuisine || restaurant.cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
      });
      setFilteredRestaurants(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCuisine, restaurants]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("");
    setFilteredRestaurants(restaurants);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Discover and Claim Your Restaurant
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Search through our curated list of restaurants and manage your
            listing today.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                placeholder="Search by name or location..."
                className="w-full pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 hover:bg-white text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Cuisine Filter */}
            <select
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white text-sm sm:text-base"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>

            {/* Clear Button */}
            {(searchQuery || selectedCuisine) && (
              <button
                onClick={clearFilters}
                className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 transition-colors self-center"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-5xl mx-auto">
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg text-center">
              <Search className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Try adjusting your search terms or cuisine filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((item) => (
                <RestaurantsCard
                  key={item._id}
                  distance={item.distance}
                  status={item.restaurantStatus}
                  restaurantId={item._id}
                  dingingStyle={
                    item.restaurantInfo?.additionalInfo?.diningStyle
                  }
                  opening_hours={item.opening_hours}
                  priceRange={item.restaurantInfo?.priceRange}
                  cuisines={item.restaurantInfo?.cuisines}
                  address={item.restaurantInfo?.address}
                  promoted={item.promoted || false}
                  time={item.time || "N/A"}
                  offB={item.offB || false}
                  proExtraB={item.proExtraB || false}
                  off={item.off || "No offer"}
                  proExtra={item.proExtra || "N/A"}
                  name={item.restaurantInfo?.name || "N/A"}
                  rating={item.restaurantInfo?.ratings?.overall || "N/A"}
                  imgSrc={item.image_urls?.[1] || "N/A"}
                  link2={`/${
                    city?.split(",")[0].trim()
                      ? city?.split(",")[0].trim().replace(/\//g, "")
                      : `${cordinate.address || "Toronto"}`
                  }/${item._id}/${item.restaurantInfo.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/overview`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListSection;