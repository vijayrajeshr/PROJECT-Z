// import CollapsableCard from "../../../utils/Cards/CollapsableCard/CollapsableCard";
// import css from "./ExploreOptionsNearMe.module.css";

// let ExploreOptionsNearMe = () => {
//   let topRestaurantChains = [
//     "Burger Singh",
//     "Domino's",
//     "Dunkin' Donuts",
//     "Faasos",
//     "KFC",
//     "McDonald's",
//     "Paradise Biryani",
//     "Subway",
//     "WOW! Momo",
//   ];

//   let cities = [
//     "Delhi NCR",
//     "Kolkata",
//     "Mumbai",
//     "Bengaluru",
//     "Hyderabad",
//     "Chennai",
//     "Ahmedabad",
//     "Chandigarh",
//     "Nashik",
//     "Ooty",
//     "Amritsar",
//     "Kanpur",
//     "Visakhapatnam",
//     "Ranchi",
//     "Vadodara",
//     "Nagpur",
//     "Puducherry",
//     "Surat",
//     "Srinagar",
//     "Khajuraho",
//     "Haridwar",
//     "Leh",
//     "Pushkar",
//     "Jaipur",
//     "Lucknow",
//     "Goa",
//     "Shimla",
//     "Allahabad",
//     "Dehradun",
//     "Patna",
//     "Guwahati",
//     "Bhopal",
//     "Mysore",
//     "Coimbatore",
//     "Rajkot",
//     "Udaipur",
//     "Trivandrum",
//     "Madurai",
//   ];

//   return (
//     <div className={`${css.outerDiv} `}>
//       <div className={`${css.innerDiv} max-sm:w-[80%] max-xl:w-[80%]`}>
//         <div className={`${css.title} max-sm:text-[24px]`}>
//           Explore options near me
//         </div>
//         <div className={css.cards}>
//           <CollapsableCard
//             title="Top Restaurant Chains"
//             content={topRestaurantChains}
//           />
//           <CollapsableCard title="Cities We Deliver To" content={cities} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExploreOptionsNearMe;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CollapsableCard from "../../../utils/Cards/CollapsableCard/CollapsableCard";

const ExploreOptionsNearMe = () => {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityMapping, setCityMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Using the endpoint without minRating parameter to get all restaurants first
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getnearbyrest?lat=43.6534627&lon=-79.4276471&radius=5&limit=50&sortBy=HighToLow`,
          { withCredentials: true }
        );

        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Get restaurants with rating >= 4.5
          const highRatedRestaurants = response.data.data
            .filter(restaurant =>
              restaurant.restaurantInfo?.name &&
              restaurant.restaurantInfo?.ratings?.overall >= 4.5
            );

          if (highRatedRestaurants.length > 0) {
            // Take top 16 or all if less than 16
            const top16 = highRatedRestaurants
              .slice(0, 16)
              .map(restaurant => ({
                id: restaurant._id,
                name: restaurant.restaurantInfo.name
              }));

            // Apply custom ordering for Pura Vida Restaurant and Quetzal
            const reorderedRestaurants = reorderRestaurants(top16);

            setTopRestaurants(reorderedRestaurants);
            console.log("Fetched top restaurants with rating >= 4.5:", reorderedRestaurants);
          } else {
            // If no high-rated restaurants, just take the top 16 restaurants regardless of rating
            const fallbackTop16 = response.data.data
              .filter(restaurant => restaurant.restaurantInfo?.name)
              .slice(0, 16)
              .map(restaurant => ({
                id: restaurant._id,
                name: restaurant.restaurantInfo.name
              }));

            // Apply custom ordering for Pura Vida Restaurant and Quetzal
            const reorderedRestaurants = reorderRestaurants(fallbackTop16);

            setTopRestaurants(reorderedRestaurants);
            console.log("No high-rated restaurants found, using top restaurants:", reorderedRestaurants);
          }
        } else {
          console.error("Failed to fetch restaurants:", response.data.message || "No data returned");
          setTopRestaurants([{ name: "No restaurants found" }]);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setTopRestaurants([{ name: "Error loading restaurants" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch cities data from MongoDB
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/get/delivery-cities`,
          { withCredentials: true }
        );

        if (response.data.success && response.data.cities && response.data.cities.length > 0) {
          // Deduplicate city names as a safeguard
          let uniqueCities = Array.from(new Set(response.data.cities));
          // Remove unwanted/invalid city and duplicate 'Delhi'
          uniqueCities = uniqueCities.filter((city, idx, arr) => {
            if (city.trim().toLowerCase() === 'hsdhsg hgsafgsdgf'.toLowerCase()) return false;
            // Only keep the first occurrence of 'Delhi'
            if (city.trim().toLowerCase() === 'delhi') return arr.findIndex(c => c.trim().toLowerCase() === 'delhi') === idx;
            return true;
          });
          setCities(uniqueCities);
          setCityMapping(response.data.cityMapping);
          console.log("Fetched delivery cities:", uniqueCities);
          console.log("City mapping:", response.data.cityMapping);
        } else {
          console.error("Failed to fetch cities:", response.data.message || "No cities returned");
          setCities([]);
          setCityMapping({});
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
        setCityMapping({});
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Function to reorder restaurants - swap Pura Vida Restaurant and Quetzal
  const reorderRestaurants = (restaurants) => {
    // Create a copy of the array to avoid mutating the original
    const reordered = [...restaurants];

    // Find indices of Pura Vida Restaurant and Quetzal
    const puraVidaIndex = reordered.findIndex(r => r.name === "Pura Vida Restaurant");
    const quetzalIndex = reordered.findIndex(r => r.name === "Quetzal");

    // If both restaurants exist in the list
    if (puraVidaIndex !== -1) {
      // Remove Pura Vida Restaurant from its current position
      const puraVida = reordered.splice(puraVidaIndex, 1)[0];

      // Add Pura Vida Restaurant to the end of the list
      reordered.push(puraVida);

      // If Quetzal exists, move it to Pura Vida's original position
      if (quetzalIndex !== -1) {
        // Remove Quetzal from its current position
        const quetzal = reordered.splice(
          // Adjust index if Quetzal was after Pura Vida
          quetzalIndex > puraVidaIndex ? quetzalIndex - 1 : quetzalIndex,
          1
        )[0];

        // Insert Quetzal at Pura Vida's original position
        reordered.splice(puraVidaIndex, 0, quetzal);
      }
    }

    return reordered;
  };

  return (
    <div className="bg-[#ffffff] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl  sm:text-5xl lg:text-6xl font-semibold text-gray-800 mb-12 text-center md:text-left">
          Discover Nearby Picks
        </h2>

        {/*  <div className="flex flex-col items-center">
          <div className="w-full max-w-5xl text-lg sm:text-xl">
            <CollapsableCard
              title="Top Restaurant Chains"
              content={topRestaurantChains}
            />
          </div>

          <div className="w-full max-w-5xl text-lg sm:text-xl">
            <CollapsableCard title="Cities We Deliver To" content={cities} />
          </div>        */}
        <div className="gap-6">
          <CollapsableCard
            title="Top Restaurant Chains"
            content={loading ? [{ name: "Loading..." }] : topRestaurants.length > 0 ? topRestaurants : [{ name: "No restaurants found" }]}
          />
          <CollapsableCard
            title="Cities We Deliver To"
            content={citiesLoading ? ["Loading..."] : cities.length > 0 ? cities : ["No cities available"]}
            cityMapping={cityMapping} // Pass the city mapping to the CollapsableCard
          />
        </div>
      </div>
    </div>
  );
};

export default ExploreOptionsNearMe;
