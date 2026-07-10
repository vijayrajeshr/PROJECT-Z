import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ShowcaseCard from "../../../utils/Cards/ShowcaseCard/ShowcaseCard";
import CallingBarHoppersImg from "/images/collection1.avif";
import { useContextData } from "../../../context/OutletContext";

// Cache for storing restaurant data
const cacheMap = new Map();
const CACHE_KEY = "callingAllBars";
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

const CallingAllBars = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosApi } = useContextData();
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [cordinate, setCordinate] = useState({
    lat: "43.6534627",
    lon: "-79.4276471",
  });

  // const [cordinate, setCordinate] = useState({
  //   lat: null,
  //   lon: null,
  // });

  useEffect(() => {
    const getCity = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/location`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setCordinate({
          // lat: locationData.latitude,
          // lon: locationData.longitude,
          lat: "43.6534627",
          lon: "-79.4276471",
        });
        console.log(data, "this is my city name");
      } catch (error) {
        console.error("Error fetching city:", error);
      } finally {
        setLoading(false);
      }
    };
    getCity();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Check cache first
        const baseParams = {
          cursor: 0,
          lat: cordinate.lat,
          lon: cordinate.lon,
          // lat: "43.6534627",
          // lon: "-79.4276471",
          radius: 10000,
          // limit: `${fetchCount}`,
        };
        const cachedData = cacheMap.get(CACHE_KEY);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          setRestaurants(cachedData.data);
          setLoading(false);
          return;
        }

        // Fetch bars and pubs
        const response = await axiosApi.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/firm/getnearbyrest?Alcohol=true&cursor=${baseParams.cursor}&lat=${
            baseParams.lat
          }&lon=${baseParams.lon}&radius=${baseParams.radius}&limit=18`
        );

        if (response.data.success) {
          const data = response.data.data;
          console.log(data, "distance");
          // Update cache
          cacheMap.set(CACHE_KEY, {
            data,
            timestamp: Date.now(),
          });

          if (isMounted.current) {
            setRestaurants(data);
          }
        } else {
          if (isMounted.current) {
            setRestaurants([]);
          }
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        if (isMounted.current) {
          setRestaurants([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    // Start fetching immediately
    setLoading(true);
    fetchRestaurants();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Header with Background Image */}
      <div className="relative h-96 w-full">
        <img
          src={CallingBarHoppersImg}
          alt="Calling all Bars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
          <div className="flex justify-between items-end">
            <div className="text-white">
              <h6 className="text-sm uppercase mb-2">ZOMATO COLLECTIONS</h6>
              <h1 className="text-4xl font-bold mb-2">Calling all Bars</h1>
              <p className="text-lg mb-2">
                The finest bars and pubs for every occasion
              </p>
              <span className="block">{restaurants.length} Places</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumbs */}
      <div className="bg-white py-4 px-8 border-b">
        <div className="max-w-7xl mx-auto flex items-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/collections" className="text-gray-500 hover:text-gray-700">
            Collections
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Calling all Bars</span>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display placeholder cards instead of just a loading message
          [...Array(18)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          ))
        ) : restaurants.length > 0 ? (
          restaurants.map((item) => (
            <ShowcaseCard
              key={item._id}
              distance={item.distance}
              name={item.restaurantInfo?.name || "N/A"}
              rating={item.restaurantInfo?.ratings?.overall || "N/A"}
              additionalDetails={
                item.restaurantInfo?.additionalInfo?.additionalDetails
              }
              address={item.restaurantInfo?.address}
              promoted={item.promoted || false}
              time={item.time || "N/A"}
              offB={item.offB || false}
              proExtraB={item.proExtraB || false}
              off={item.off || "No offer"}
              proExtra={item.proExtra || "N/A"}
              imgSrc={item.image_urls?.[1] || "N/A"}
              link2={`/hyderabad/${item._id}/${item.restaurantInfo.name}/overview`}
              priceRange={item.restaurantInfo?.priceRange}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            No restaurants found for this collection.
          </div>
        )}
      </div>
    </div>
  );
};

export default CallingAllBars;
