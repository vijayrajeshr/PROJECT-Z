import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "./../../../Project Images/image.png"; // Ensure this path is correct
import { MdOutlineAccessTime } from "react-icons/md";
import { Loader2 } from "lucide-react";
// star icon is imported but not used in the provided JSX. Keeping the import for now.
import star from "/icons/star.png";
import { useLocation } from "../../context/locationContext.jsx";

const SearchBar = () => {
  // const [locationError, setLocationError] = useState("");
  // --- UI State ---
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Location State ---
  // --- Get Global Location from Context ---
  const {
    currentLocation,
    isLocationLoading,
    recentLocations,
    updateLocation,
    detectLocation,
  } = useLocation();

  // --- Local State for Typing ---
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // --- Search Query State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    restaurants: [],
    foodItem: null,
    similarto: [],
    tiffins: [],
  });

  // --- Refs for Click-Outside ---
  const searchBarRef = useRef(null)
  const navigate = useNavigate();
  const locationDropdownRef = useRef(null);
  const searchResultsRef = useRef(null);


  useEffect(() => {
    if (currentLocation) {
      setLocationInput(currentLocation.address);
    }
  }, [currentLocation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationDropdown, showSearchResults]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim() || !currentLocation?.latitude) {
        setSearchResults({ restaurants: [], foodItem: null, similarto: [], tiffins: [] });
        setShowSearchResults(false);
        return;
      }
      setLoading(true);
      setError(null);
      setShowSearchResults(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/search?query=${encodeURIComponent(
            debouncedQuery
          )}&lat=${currentLocation.latitude}&lon=${currentLocation.longitude}`
        );
        if (!response.ok) throw new Error("Search failed. Please try again.");
        const data = await response.json();
        setSearchResults({
          restaurants: data.restaurants || [],
          foodItem: data.foodItem || null,
          similarto: data.recommendedRestaurants || [],
          tiffins: data.tiffins || [],
        });
      } catch (err) {
        setError(err.message);
        setSearchResults({
          restaurants: [],
          foodItem: null,
          similarto: [],
          tiffins: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, currentLocation]);

  useEffect(() => {
    if (!locationInput || locationInput === currentLocation?.address) {
      setLocationSuggestions([]);
      return;
    }


    const fetchSuggestions = async () => {
      // This now calls YOUR backend server, not Google's.
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/google-places-autocomplete?input=${encodeURIComponent(locationInput)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // The rest of the logic remains the same!
        if (data.status === 'OK') {
          setLocationSuggestions(data.predictions);
        } else {
          console.error("API Error from your server:", data.status, data.error_message);
          setLocationSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching location suggestions from your server:", error);
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms delay to prevent API calls on every keystroke

    return () => clearTimeout(handler);
  }, [locationInput, currentLocation?.address]);


  // --- ADD THIS function: Gets coordinates when a user selects a suggestion ---
  const handleSuggestionSelect = async (suggestion) => {
    setLocationInput(suggestion.description);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    // setIsLocationLoading(true);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/google-place-details?place_id=${suggestion.place_id}`;
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${
    //   suggestion.place_id
    // }&fields=geometry,formatted_address&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        const newLocation = {
          address: data.result.formatted_address,
          latitude: lat,
          longitude: lng,
        };
        console.log('%c[SEARCHBAR] Step 2: About to call setLocation with:', 'color: blue; font-weight: bold;', newLocation);
        // handleLocationSelect(newLocation); // This reuses your existing function
        handleLocationSelect(newLocation);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      // setIsLocationLoading(false);
    }
  };

  const handleDetectLocation = () => {
    detectLocation(); // This now calls the context's detectLocation
    setShowLocationDropdown(false);
  };


  const handleLocationSelect = (location) => {
    updateLocation(location); // This now calls the context's update function
    setShowLocationDropdown(false);
  };

  const handleResultClick = (item, type) => {
    let route = "/";
    let itemId = null;

    if (type === "food") {
      route = `/show-case?dish=${item.food_item
        .trim()
        .replace(/\s+/g, " ")}&page=order-online`;
      navigate(route, {
        state: { selectedItem: { name: item.food_item, type: "food" } },
      });
    } else if (type === "tiffin" && item.id) {
      route = `/hyderabad/${item.id}/${item.tiffin_name}/overview`;
      itemId = item.id;
    } else if (type === "similarto" && item.id) {
      route = `/hyderabad/${item.id}/${item.restaurant_name}/overview`;
      itemId = item.id;
    } else if (type === "restaurant" && item.id) {
      route = `/hyderabad/${item.id}/${item.restaurant_name}/overview`;
      itemId = item.id;
    } else if (item.id) {
      route = `/hyderabad/${item.id}/${item.restaurant_name}/overview`;
      itemId = item.id;
    }

    if (itemId || type === "food") {
      if (itemId) {
        localStorage.setItem("id", itemId);
      }
      navigate(route, { state: { selectedItem: { ...item, type } } });
      setShowSearchResults(false);
      setSearchQuery("");
    } else {
      setError("Could not navigate to the selected item.");
    }
  };

  const handleSearchFocus = () => {
    setShowLocationDropdown(false);
    if (debouncedQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  return (
    <div
      className="relative w-full  order-3 nav-break:order-none z-50 " // `w-full` and `z-50` are kept for positioning
      ref={searchBarRef}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-0"> {/* This div controls the main width */}
        <div className="flex flex-grow min-w-0 items-center border border-gray-300 rounded-lg shadow-md bg-white py-3 px-4 sm:px-6 overflow-hidden">
          {/* Location Section */}
          <div className="flex items-center flex-shrink-0 pr-3 border-r border-gray-300">
            <div className="flex items-center justify-center text-primary-green-500 text-xl mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
              >
                <title>location-fill</title>
                <path d="M10.2 0.42c-4.5 0-8.2 3.7-8.2 8.3 0 6.2 7.5 11.3 7.8 11.6 0.2 0.1 0.3 0.1 0.4 0.1s0.3 0 0.4-0.1c0.3-0.2 7.8-5.3 7.8-11.6 0.1-4.6-3.6-8.3-8.2-8.3zM10.2 11.42c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.7 0 3 1.3 3 3s-1.3 3-3 3z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder={
                isLocationLoading
                  ? "Detecting location..."
                  : currentLocation?.address || "Enter your location"
              }
              value={locationInput}
              className="flex-grow text-gray-800 placeholder-gray-400 outline-none bg-transparent text-base sm:text-lg min-w-0"
              onChange={(e) => setLocationInput(e.target.value)}
              onFocus={() => {
                setShowLocationDropdown(true);
                setShowSearchResults(false);
              }}
            />
            {/* {locationError && (
  <p className="absolute top-full text-sm text-red-600 mt-2">{locationError}</p>
)} */}
            <button
              className="ml-2 flex items-center p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              aria-label="Toggle location dropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                width="12"
                height="12"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
                className={`text-gray-500 transition-transform duration-200 ${showLocationDropdown ? "rotate-180" : ""
                  }`}
              >
                <title>
                  {showLocationDropdown ? "up-triangle" : "down-triangle"}
                </title>
                <path
                  d={
                    showLocationDropdown
                      ? "M0 14.58L10 4.58l10 10H0z"
                      : "M20 5.42l-10 10-10-10h20z"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Search Section */}
          <div className="flex items-center flex-1 pl-3 min-w-0">
            <div className="flex items-center justify-center text-gray-500 text-lg mr-2 flex-shrink-0">
              <svg
                fill="currentColor"
                width="24"
                height="18"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
              >
                <path d="M19.78 19.12l-3.88-3.9c1.28-1.6 2.080-3.6 2.080-5.8 0-5-3.98-9-8.98-9s-9 4-9 9c0 5 4 9 9 9 2.2 0 4.2-0.8 5.8-2.1l3.88 3.9c0.1 0.1 0.3 0.2 0.5 0.2s0.4-0.1 0.5-0.2c0.4-0.3 0.4-0.8 0.1-1.1zM1.5 9.42c0-4.1 3.4-7.5 7.5-7.5s7.48 3.4 7.48 7.5-3.38 7.5-7.48 7.5c-4.1 0-7.5-3.4-7.5-7.5z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or dish"
              className="w-full text-sm sm:text-base placeholder:truncate placeholder:whitespace-nowrap text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
          </div>
        </div>

        {showLocationDropdown && (
          <div
            ref={locationDropdownRef}
            className="absolute top-full left-0 right-0 w-full bg-white rounded-lg shadow-lg mt-2 border border-gray-200 z-50 overflow-y-auto max-h-80"
          >
            {/* Show suggestions if user is typing and suggestions exist */}
            {locationSuggestions.length > 0 ? (
              locationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {/* You can add an icon here if you want */}
                  <div>
                    <p className="font-medium text-gray-800">
                      {suggestion.structured_formatting.main_text}
                    </p>
                    <p className="text-sm text-gray-500">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              /* Otherwise, show the default options */
              <>
                <div
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleDetectLocation(false)}
                >
                  {/* Your SVG for current location */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    className="flex items-center justify-center text-primary-green-500 text-lg mr-3"
                  >
                    <path d="M13.58 10c0 1.977-1.603 3.58-3.58 3.58s-3.58-1.603-3.58-3.58c0-1.977 1.603-3.58 3.58-3.58v0c1.977 0 3.58 1.603 3.58 3.58v0zM20 9.52v0.96c0 0.265-0.215 0.48-0.48 0.48v0h-1.72c-0.447 3.584-3.256 6.393-6.802 6.836l-0.038 0.004v1.72c0 0.265-0.215 0.48-0.48 0.48v0h-0.96c-0.265 0-0.48-0.215-0.48-0.48v0-1.72c-3.575-0.455-6.375-3.262-6.816-6.802l-0.004-0.038h-1.74c-0.265 0-0.48-0.215-0.48-0.48v0-0.96c0-0.265 0.215-0.48 0.48-0.48v0h1.74c0.445-3.578 3.245-6.385 6.781-6.836l0.039-0.004v-1.72c0-0.265 0.215-0.48 0.48-0.48v0h0.96c0.265 0 0.48 0.215 0.48 0.48v0 1.72c3.584 0.447 6.393 3.256 6.836 6.802l0.004 0.038h1.72c0.265 0 0.48 0.215 0.48 0.48v0zM15.96 10c0-3.292-2.668-5.96-5.96-5.96s-5.96 2.668-5.96 5.96c0 3.292 2.668 5.96 5.96 5.96v0c3.292 0 5.96-2.668 5.96-5.96v0z"></path>
                  </svg>
                  <span>
                    Detect current location
                    <div className="text-gray-500 text-sm">Using GPS</div>
                  </span>
                </div>

                <div className="px-3 py-2 text-sm text-gray-500 font-semibold border-t border-gray-200">
                  Recent Locations
                </div>
                {recentLocations.length > 0 ? (
                  recentLocations.map((location, index) => (
                    <div
                      key={location.address || index}
                      className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MdOutlineAccessTime className="text-gray-500 mr-3 text-lg" />
                      <span className="text-gray-800 text-base">{location.address}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-center text-base">
                    No recent locations found.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div
            ref={searchResultsRef}
            className="absolute top-full left-0 right-0 w-full bg-white rounded-lg shadow-lg mt-2 px-4 border border-gray-200 z-50 overflow-y-auto max-h-64"
          >
            {loading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 size={24} className="animate-spin text-gray-500" aria-label="Loading search results" />
              </div>
            )}
            {!loading && error && <div className="p-4 text-red-500 text-center text-base">{error}</div>}
            {!loading &&
              !error &&
              searchResults.restaurants.length === 0 &&
              searchResults.tiffins.length === 0 &&
              !searchResults.foodItem &&
              debouncedQuery.trim() && (
                <div className="p-4 text-gray-500 text-center text-base">
                  No results found for "{debouncedQuery}"
                </div>
              )}
            {!loading && !error && (
              <>
                {searchResults.foodItem && (
                  <>
                    <div
                      key={`food-${searchResults.foodItem.food_item}`}
                      className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        handleResultClick(searchResults.foodItem, "food")
                      }
                    >
                      <img
                        src={defaultImage}
                        alt={searchResults.foodItem.food_item}
                        className="h-12 w-12 object-cover rounded-md mr-3"
                      />
                      <div className="flex-grow">
                        <h4 className="text-lg font-medium text-gray-800">
                          {searchResults.foodItem.food_item}
                        </h4>
                        <p className="text-sm text-gray-500">Dish</p>
                      </div>
                    </div>
                  </>
                )}

                {searchResults.tiffins.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500 font-semibold border-t border-gray-200">Tiffin Services</div>
                    {searchResults.tiffins.slice(0, 3).map((result) => {
                      const itemKey =
                        result.id || `${result.type}-${result.tiffin_name}`;
                      return (
                        <div
                          key={itemKey}
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleResultClick(result, "tiffin")}
                        >
                          <img
                            src={result.image_url || defaultImage}
                            alt={result.tiffin_name}
                            className="h-12 w-12 object-cover rounded-md mr-3"
                          />
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-gray-800">
                              {result.tiffin_name}
                            </h4>
                            <p className="text-sm text-gray-500">{result.type}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {searchResults.restaurants.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500 font-semibold border-t border-gray-200">Restaurants</div>
                    {searchResults.restaurants.map((result) => {
                      const itemKey =
                        result.id || `${result.type}-${result.restaurant_name}`;
                      return (
                        <div
                          key={itemKey}
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleResultClick(result, "restaurant")}
                        >
                          <img
                            src={result.image_url || defaultImage}
                            alt={result.restaurant_name}
                            className="h-12 w-12 object-cover rounded-md mr-3"
                          />
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-gray-800">
                              {result.restaurant_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {result.address?.slice(0, 35) + (result.address?.length > 35 ? "..." : "") || "No address"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {searchResults.similarto.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500 font-semibold border-t border-gray-200">
                      Similar to "{searchQuery}"
                    </div>
                    {searchResults.similarto.slice(0, 3).map((result) => {
                      const itemKey =
                        result.id || `${result.type}-${result.restaurant_name}`;
                      return (
                        <div
                          key={itemKey}
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleResultClick(result, "similarto")}
                        >
                          <img
                            src={result.image_url || defaultImage}
                            alt={result.restaurant_name}
                            className="h-12 w-12 object-cover rounded-md mr-3"
                          />
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-gray-800">
                              {result.restaurant_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {result.address?.slice(0, 35) + (result.address?.length > 35 ? "..." : "") || "No address"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;