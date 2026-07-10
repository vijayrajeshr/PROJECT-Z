import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ShowcaseCard from "../../../../utils/Cards/ShowcaseCard/ShowcaseCard";
import { useContextData } from "../../../../context/OutletContext";
//import CollectionCard from "../../../../utils/Cards/CollectionCard/CollectionCard";
// Import all collection images
import TopTrendingImg from "/public/images/collection1.jpg";
import CandleLitImg from "/public/images/collection2.jpg";
import NewlyOpenedImg from "/public/images/collection3.avif";
import BestRooftopImg from "/public/images/collection4.avif";
import BestInstaImg from "/public/images/collection5.avif";
import RegionalFlavoursImg from "/public/images/collection6.webp";
import BestBuffetImg from "/public/images/collection7.avif";
import AsianRestaurantsImg from "/public/images/collection8.jpg";
import BestPubsImg from "/public/images/collection9.avif";
import HyderabadBiryaniImg from "/public/images/collection10.jpg";
import LitPartyImg from "/public/images/collection11.avif";
import UniqueDiningImg from "/public/images/collection12.avif";
import TerrificThalisImg from "/public/images/collection13.avif";
import PureVegImg from "/public/images/collection14.avif";
import BingeworthyDessertImg from "/public/images/collection15.jpg";
import MustVisitCafesImg from "/public/images/collection16.webp";

// Cache for storing restaurant data
const cacheMap = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Collection configurations - Now uses database collections
const COLLECTIONS = {
  "candle-dining": {
    title: "Candle Dining",
    description: "Perfect romantic places for a special evening",
    image: CandleLitImg,
    count: 18,
    filter: "RomanticDining=true",
    sortType: "rating",
  },
  "newly-opened-spots": {
    title: "Newly Opened Spots",
    description: "The latest restaurants to open their doors in the city",
    image: NewlyOpenedImg,
    count: 20,
    filter: "NewlyOpened=true",
    sortType: "newest",
  },
  "best-picture-poetry": {
    title: "Best Picture Poetry",
    description: "Picture perfect restaurants for your social media feed",
    image: BestInstaImg,
    count: 20,
    filter: "InstagramWorthy=true",
    sortType: "random",
  },
  "regional-dishes": {
    title: "Regional Dishes",
    description: "Authentic regional cuisine from across the country",
    image: RegionalFlavoursImg,
    count: 10,
    filter: "RegionalCuisine=true",
    sortType: "name",
  },
  "best-buffet": {
    title: "Best Buffet",
    description: "All-you-can-eat buffets with amazing variety",
    image: BestBuffetImg,
    count: 4,
    filter: "Buffet=true",
    sortType: "rating",
  },
  "pubs-and-bars": {
    title: "Pubs and Bars ",
    description: "Great places to unwind with drinks and good company",
    image: BestPubsImg,
    count: 5,
    filter: "Alcohol=true",
    sortType: "price",
  },
  "hyderabadi-biryani": {
    title: "Hyderabadi Biryani",
    description: "The best of Hyderabadi biryani in town",
    image: HyderabadBiryaniImg,
    count: 8,
    filter: "Cuisine=Hyderabadi&Dish=Biryani",
    sortType: "rating",
  },
  "party-places": {
    title: "Party Places",
    description: "Best venues for a night of fun and celebration",
    image: LitPartyImg,
    count: 8,
    filter: "NightLife=true",
    sortType: "newest",
  },
  "unique-dining": {
    title: "Unique Dining ",
    description: "Restaurants with extraordinary themes and experiences",
    image: UniqueDiningImg,
    count: 7,
    filter: "UniqueDining=true",
    sortType: "random",
  },
  "terrific-thalis-dishes": {
    title: "Terrific Thalis Dishes",
    description: "Best thali meals with amazing variety",
    image: TerrificThalisImg,
    count: 8,
    filter: "Dish=Thali",
    sortType: "name",
  },
  "pure-veg-visits": {
    title: "Pure Veg Visits",
    description: "Top vegetarian restaurants in town",
    image: PureVegImg,
    count: 5,
    filter: "Dietary=true",
    sortType: "price",
  },
  "binge-worthy-dessert": {
    title: "Binge worthy Dessert",
    description: "Satisfy your sweet tooth with these amazing dessert places",
    image: BingeworthyDessertImg,
    count: 6,
    filter: "Cuisine=Desserts",
    sortType: "random",
  },
  "best-cafes": {
    title: "Best Cafes",
    description: "Cozy cafes with great coffee and ambiance",
    image: MustVisitCafesImg,
    count: 8,
    filter: "others=Cafe",
    sortType: "rating",
  },
  "sunday-visits": {
    title: "Sunday Visits",
    description: "Perfect spots for a leisurely Sunday brunch or dinner",
    image: TopTrendingImg,
    count: 6,
    filter: "Weekend=true",
    sortType: "rating",
  },
  "dancing-time": {
    title: "Dancing Time",
    description: "Best places with live music and dancing",
    image: LitPartyImg,
    count: 7,
    filter: "Dancing=true",
    sortType: "newest",
  },
  "today-night": {
    title: "Today Night",
    description: "Top picks for tonight's dining experience",
    image: BestRooftopImg,
    count: 5,
    filter: "TonightSpecial=true",
    sortType: "rating",
  },
};

// Global tracking of restaurant IDs across collections to avoid cross-collection duplicates
const usedRestaurantIdsMap = new Map();

// Sort restaurants based on different criteria for each collection
const sortRestaurants = (restaurants, sortType, collectionType) => {
  const clonedRestaurants = [...restaurants];

  // First apply basic sorting
  let sortedRestaurants = [];
  switch (sortType) {
    case "rating":
      sortedRestaurants = clonedRestaurants.sort(
        (a, b) =>
          (b.restaurantInfo?.ratings?.overall || 0) -
          (a.restaurantInfo?.ratings?.overall || 0)
      );
      break;
    case "name":
      sortedRestaurants = clonedRestaurants.sort((a, b) =>
        (a.restaurantInfo?.name || "").localeCompare(
          b.restaurantInfo?.name || ""
        )
      );
      break;
    case "price":
      sortedRestaurants = clonedRestaurants.sort((a, b) => {
        const priceA =
          typeof a.restaurantInfo?.priceRange === "number"
            ? a.restaurantInfo.priceRange
            : 0;
        const priceB =
          typeof b.restaurantInfo?.priceRange === "number"
            ? b.restaurantInfo.priceRange
            : 0;
        return priceA - priceB;
      });
      break;
    case "newest":
      sortedRestaurants = clonedRestaurants.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      break;
    case "random":
      // Fisher-Yates shuffle algorithm
      sortedRestaurants = [...clonedRestaurants];
      for (let i = sortedRestaurants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedRestaurants[i], sortedRestaurants[j]] = [
          sortedRestaurants[j],
          sortedRestaurants[i],
        ];
      }
      break;
    default:
      sortedRestaurants = clonedRestaurants;
  }

  // Apply collection-specific diversification
  // Add offset based on collection type to ensure variety between collections
  const uniqueOffset = getCollectionOffset(collectionType);

  // Rotate the array by the offset to ensure different restaurants appear first
  if (uniqueOffset > 0 && sortedRestaurants.length > uniqueOffset) {
    const firstPart = sortedRestaurants.slice(0, uniqueOffset);
    const secondPart = sortedRestaurants.slice(uniqueOffset);
    sortedRestaurants = [...secondPart, ...firstPart];
  }

  // Further shuffle popular restaurants to avoid same ones appearing at top of multiple collections
  if (sortedRestaurants.length > 6) {
    // Take top 6 restaurants and shuffle them specifically
    const topSix = sortedRestaurants.slice(0, 6);
    const rest = sortedRestaurants.slice(6);

    // Shuffle top restaurants based on collection type
    const shuffledTop = shuffleBasedOnCollection(topSix, collectionType);

    return [...shuffledTop, ...rest];
  }

  return sortedRestaurants;
};

// Get an offset value based on collection type to ensure different starting points
const getCollectionOffset = (collectionType) => {
  const baseOffsets = {
    "top-trending-spots": 0,
    "candle-lit-dining": 4,
    "newly-opened-places": 2,
    "best-rooftop-places": 6,
    "best-insta-worth": 3,
    "regional-flavours": 5,
    "best-buffet-in-town": 1,
    "asian-restaurants": 7,
    "best-pubs-and-bars": 4,
    "hyderabad-biryani": 2,
    "lit-party-places": 8,
    "unique-dining-places": 5,
    "terrific-thalis": 3,
    "pure-veg-places": 7,
    "bingeworthy-dessert": 1,
    "must-visit-cafes": 6,
  };

  return baseOffsets[collectionType] || 0;
};

// Shuffle restaurants specifically based on collection type
const shuffleBasedOnCollection = (restaurants, collectionType) => {
  const result = [...restaurants];

  // Create a deterministic but different shuffle for each collection
  const seed = collectionType
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Simple deterministic shuffle based on collection name
  for (let i = result.length - 1; i > 0; i--) {
    const j = (i * seed) % result.length;
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// Function to fetch custom collections
const fetchCustomCollection = async (collectionSlug, axiosApi) => {
  try {
    const response = await axiosApi.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/marketing-dashboard/collections/by-slug/${collectionSlug}`
    );

    if (response.data) {
      // Log the restaurant data for debugging
      console.log("Fetched collection restaurants:", response.data.restaurants);

      return {
        title: response.data.title,
        description:
          response.data.description || "A custom collection of restaurants",
        image: response.data.photoWeb || TopTrendingImg,
        count: response.data.restaurants?.length || 0,
        customCollection: true,
        restaurants: response.data.restaurants || [],
        // Store the full restaurant objects directly
        fullRestaurantData: response.data.restaurants || [],
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching custom collection:", error);
    return null;
  }
};

const CollectionPages = () => {
  const { collectionType } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosApi } = useContextData();
  const isMounted = useRef(true);
  const [isCustomCollection, setIsCustomCollection] = useState(false);
  const [customRestaurants, setCustomRestaurants] = useState([]);

  // Get collection details or check if it's a custom collection
  const [collection, setCollection] = useState(
    COLLECTIONS[collectionType] || {
      title: "Collection",
      description: "Explore curated restaurants",
      image: TopTrendingImg,
      count: 20,
      filter: "",
      sortType: "random",
    }
  );

  const [cordinate, setCordinate] = useState({
    lat: "43.6534627",
    lon: "-79.4276471",
  });

  // Add this useEffect to check for custom collections
  useEffect(() => {
    // Inside the useEffect hook
    const checkCustomCollection = async () => {
      // Try to fetch collection from database by slug
      const customCollection = await fetchCustomCollection(
        collectionType,
        axiosApi
      );
      if (customCollection) {
        setCollection(customCollection);
        setIsCustomCollection(true);
        if (
          customCollection.fullRestaurantData &&
          customCollection.fullRestaurantData.length > 0
        ) {
          // Use the fully populated restaurant data directly
          setCustomRestaurants(customCollection.fullRestaurantData);
          setRestaurants(customCollection.fullRestaurantData);
          setLoading(false);
        } else {
          // No restaurants found in custom collection
          setRestaurants([]);
          setLoading(false);
        }
      } else {
        // Collection not found, set empty
        setRestaurants([]);
        setLoading(false);
      }
    };

    checkCustomCollection();
  }, [collectionType, axiosApi]);

  // Remove the duplicate useEffect that fetches restaurants for custom collections
  // and keep only one comprehensive useEffect for fetching restaurants
  {
    /*useEffect(() => {
    const fetchRestaurants = async () => {
      // If it's a custom collection with pre-defined restaurants, use those instead of fetching
      if (isCustomCollection && customRestaurants && customRestaurants.length > 0) {
        // We already set the restaurants in the checkCustomCollection function
        return;
      }
      
      try {
        // Reset state when collection changes
        const fetchCount = collection.count * 4; // Fetch 4x the needed amount to ensure we have enough unique restaurants
        const baseParams = {
          cursor: 0,
          lat: cordinate.lat,
          lon: cordinate.lon,
          radius: 10000,
          limit: `${fetchCount}`,
        };
        setLoading(true);

        // Generate cache key for current collection
        const CACHE_KEY = `collection_${collectionType}`;

        // Check cache first
        const cachedData = cacheMap.get(CACHE_KEY);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          // Ensure we display exactly the number of restaurants specified in collection.count
          if (cachedData.data.length === collection.count) {
            setRestaurants(cachedData.data);
            setLoading(false);
            return;
          }
          // If count doesn't match, we'll fetch fresh data
        }

        // Fetch more restaurants than needed to allow for diversification
        // Add extra parameter to fetch more restaurants to ensure diversity

        // Fetch restaurants based on collection filter
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getnearbyrest?${
            collection.filter
          }&cursor=${baseParams.cursor}&lat=${baseParams.lat}&lon=${
            baseParams.lon
          }&radius=${baseParams.radius}&limit=${baseParams.limit}`
        );

        if (response.data.success) {
          // Get restaurants data
          let data = response.data.data || [];
          console.log(data);
          // Filter out "Giulietta" restaurant from results
          data = data.filter(
            (restaurant) =>
              restaurant.restaurantInfo?.name !== "Giulietta" &&
              !restaurant.restaurantInfo?.name?.includes("Giulietta")
          );

          // Remove duplicates within the collection itself
          const uniqueRestaurants = [];
          const seenIds = new Set();

          data.forEach((restaurant) => {
            if (!seenIds.has(restaurant._id)) {
              seenIds.add(restaurant._id);
              uniqueRestaurants.push(restaurant);
            }
          });
                  
          // Get restaurants that haven't been used in other collections
          // or prioritize unique restaurants when possible
          const otherCollectionsUsedIds =
            usedRestaurantIdsMap.get(collectionType) || new Set();

          // First, try to get restaurants that haven't been used in other collections
          const pristineRestaurants = uniqueRestaurants.filter(
            (restaurant) => !otherCollectionsUsedIds.has(restaurant._id)
          );

          // Sort and diversify based on collection type
          let sortedRestaurants = [];

          // If we have enough pristine restaurants, use them
          if (pristineRestaurants.length >= collection.count) {
            sortedRestaurants = sortRestaurants(
              pristineRestaurants,
              collection.sortType,
              collectionType
            ).slice(0, collection.count);
          } else {
            // Otherwise, use as many pristine as possible, then fill in with others
            const sortedPristine = sortRestaurants(
              pristineRestaurants,
              collection.sortType,
              collectionType
            );
            const sortedRemainder = sortRestaurants(
              uniqueRestaurants.filter(
                (r) => !pristineRestaurants.some((p) => p._id === r._id)
              ),
              collection.sortType,
              collectionType
            );

            sortedRestaurants = [
              ...sortedPristine,
              ...sortedRemainder.slice(
                0,
                collection.count - sortedPristine.length
              ),
            ];
          }
            

          // If we still don't have enough restaurants, make multiple API calls with different filters
          if (sortedRestaurants.length < collection.count) {
            try {
              // Try a more generic filter to get additional restaurants
              const additionalResponse = await axiosApi.get(
                `${
                  import.meta.env.VITE_SERVER_URL
                }/firm/getnearbyrest?&cursor=${baseParams.cursor}&lat=${
                  baseParams.lat
                }&lon=${baseParams.lon}&radius=${baseParams.radius}&limit=${
                  baseParams.limit
                }`
              );

              if (additionalResponse.data.success) {
                // Get additional restaurants and add them to our existing data
                let additionalData = additionalResponse.data.data || [];

                // Filter out "Giulietta" restaurant from additional results
                additionalData = additionalData.filter(
                  (restaurant) =>
                    restaurant.restaurantInfo?.name !== "Giulietta" &&
                    !restaurant.restaurantInfo?.name?.includes("Giulietta")
                );

                // Remove restaurants we already have
                const existingIds = new Set(
                  sortedRestaurants.map((item) => item._id)
                );
                const uniqueAdditionalData = additionalData.filter(
                  (item) => !existingIds.has(item._id)
                );

                // Concat the additional restaurants to reach the required count
                sortedRestaurants = [
                  ...sortedRestaurants,
                  ...uniqueAdditionalData.slice(
                    0,
                    collection.count - sortedRestaurants.length
                  ),
                ];
              }
            } catch (additionalError) {
              console.error(
                "Error fetching additional restaurants:",
                additionalError
              );
            }
          }

          // Ensure we have exactly the specified number of restaurants
          sortedRestaurants = sortedRestaurants.slice(0, collection.count);

          // Record the IDs of restaurants used in this collection
          const usedIds = new Set(
            sortedRestaurants.map((restaurant) => restaurant._id)
          );
          usedRestaurantIdsMap.set(collectionType, usedIds);

          // Update cache
          cacheMap.set(CACHE_KEY, {
            data: sortedRestaurants,
            timestamp: Date.now(),
          });

          if (isMounted.current) {
            setRestaurants(sortedRestaurants);
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

    fetchRestaurants();
  }, [collectionType, collection, cordinate.lat, cordinate.lon, axiosApi, isCustomCollection, customRestaurants]);  */
  }

  // Function to create a proper grid layout
  const renderRestaurantRows = () => {
    if (restaurants.length === 0) {
      return (
        <div className="text-center py-10">
          No restaurants found for this collection.
        </div>
      );
    }

    return (
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((item) => (
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
          ))}
        </div>
      </div>
    );
  };

  // Return the JSX for the component
  return (
    <div className="collection-page">
      {/* Collection Header Section - Increased height from 300px to 400px */}
      <div className="relative w-full h-[400px] mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <div className="uppercase text-sm font-medium mb-1">
            ZOMATO COLLECTIONS
          </div>
          <h1 className="text-4xl font-bold mb-2">{collection.title}</h1>
          <p className="text-lg mb-2">{collection.description}</p>
          <p className="text-sm">{restaurants.length} Places</p>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm mb-6 px-4">
        <Link to="/" className="text-gray-500 hover:text-red-500">
          Home
        </Link>
        <span className="text-gray-500">/</span>
        <Link to="/collections" className="text-gray-500 hover:text-red-500">
          Collections
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-700">{collection.title}</span>
      </div>

      {/* Restaurant Cards - Improved grid layout */}
      {loading ? (
        <div className="text-center py-10">Loading restaurants...</div>
      ) : (
        renderRestaurantRows()
      )}
    </div>
  );
};

export default CollectionPages;
