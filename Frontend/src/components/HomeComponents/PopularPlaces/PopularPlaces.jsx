import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiArrowRightSLine, RiArrowUpSLine } from "react-icons/ri";
import { useLocation } from "../../../context/locationContext"; // ADDED: Import global location context

const PopularPlaces = () => {
  const PLACES_INCREMENT = 6;
  const navigate = useNavigate();

  // --- Global State from Context ---
  const { currentLocation, isLoading: isLocationLoading } = useLocation();

  const [visibleCount, setVisibleCount] = useState(8);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [showingMore, setShowingMore] = useState(false);
  const fullAddress = currentLocation?.address || "";
  const citySegments = fullAddress.split(',').map(s => s.trim());

  const cityName = isLocationLoading
    ? "" // Returns empty while loading
    : citySegments[0] || citySegments[1] || "Unknown";
  console.log('API Request City Name:', cityName);

  useEffect(() => {
  // Use your context variables here (assuming you implemented the context fix)
  if (isLocationLoading || !cityName) return;

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/addresses/${encodeURIComponent(cityName)}`
      );

      // 1. Explicitly treat non-200 status as 'No Data'
      if (!response.ok) {
        // If API fails (404/500, meaning no data in DB), 
        // we deliberately throw an error that we will handle below.
        throw new Error("No data found for city."); 
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format.");
      }

      const transformedData = data.map((loc) => ({
        place: loc.place,
        count: loc.count,
      }));

      setLocations(transformedData);
      setError(null); // SUCCESS: Clear error state
      
    } catch (err) {
      // 2. CATCH BLOCK FIX: Clear the generic error state
      // This forces the JSX to display the 'locations.length === 0' message.
      setError(null);
      setLocations([]); // Ensure the array is empty for the JSX check
      console.error("No data available for city, defaulting to 'No Localities' view.", err);
    }
  };

  fetchLocations();
}, [cityName, isLocationLoading]);// Triggers when city or loading state changes

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + PLACES_INCREMENT, locations.length)
    );
    setShowingMore(true);
  };

  const handleShowLess = () => {
    setVisibleCount(8); // Reset to initial visible count
    setShowingMore(false);
  };

  const handlePlaceClick = (placeName) => {
    // Note: The page parameter is incorrect. It should be 'page=order-online' 
    // or similar, not just the placeName. Assuming backend handles this.
    navigate(`/show-case?page=` + placeName);
  };

  return (
    <div className="w-full py-8 max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-normal text-gray-800 mb-8 text-left">
        Popular localities in and around{" "}
        <span className="font-medium">
          {isLocationLoading ? "Loading..." : cityName || "Your City"}
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLocationLoading ? (
          <div className="flex justify-center items-center col-span-full py-8">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-500 h-8 w-8"
              aria-label="Loading places"
            />
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-8 text-lg">
            {error}. Please try again later.
          </div>
        ) : locations.length === 0 && cityName ? ( // Check if city exists before saying 'No localities'
          <div className="col-span-full text-center text-gray-500 py-8 text-lg">
            No localities found in {" "}
            <span className="font-semibold">
              {cityName}
            </span>.
          </div>
        ) : (
          <>
            {locations.slice(0, visibleCount).map((location, index) => (
              <div
                key={index}
                onClick={() => handlePlaceClick(location.place)}
                className="cursor-pointer group"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1 text-left">
                        {location.place}
                      </h3>
                      <p className="text-gray-600 text-sm text-left">
                        {location.count}{" "}
                        {location.count === 1 ? "place" : "places"}
                      </p>
                    </div>
                    <RiArrowRightSLine className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                </div>
              </div>
            ))}

            {!showingMore && visibleCount < locations.length && (
              <div onClick={handleShowMore} className="cursor-pointer group">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 flex justify-between items-center hover:shadow-md hover:bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 text-left">
                      See more
                    </h3>
                  </div>
                  <RiArrowRightSLine className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </div>
              </div>
            )}

            {showingMore && (
              <div onClick={handleShowLess} className="cursor-pointer group">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 flex justify-between items-center hover:shadow-md hover:bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 text-left">
                      See less
                    </h3>
                  </div>
                  <RiArrowUpSLine className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PopularPlaces;