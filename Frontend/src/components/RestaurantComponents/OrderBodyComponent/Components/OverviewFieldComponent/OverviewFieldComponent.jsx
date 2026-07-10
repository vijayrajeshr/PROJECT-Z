import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { detectLocation } from "../../../../../components/HomeComponents/PopularPlaces/CurrentLocation/detectLocation";

import food1 from "/images/food1.jpg";
import CathTheMatachImg from "/images/cathcthematch.jpg";
import NewInTownImg from "/images/newintown.jpg";
import TrendingThisWeekImg from "/images/trendingthisweek.jpg";
import CallingBarHoppersImg from "/images/callingallbarhoppers.jpg";
import happyHoursImg from "/images/happyhours.jpg";
import rightArrow from "/icons/next.png";
import leftArrow from "/icons/prev.png";

import OverviewAboutCard from "../../../../../utils/Cards/RestaurantBodyCards/OverviewAboutCard/OverviewAboutCard";
import MenuCard from "../../../../../utils/Cards/RestaurantBodyCards/MenuCard/MenuCard";
import LabelUtil from "../../../../../utils/RestaurantUtils/LabelUtil/LabelUtil";
import ShowcaseCard from "../../../../../utils/Cards/ShowcaseCard/ShowcaseCard";
import CollectionsCard from "../../../../../utils/Cards/card2/CollectionsCard";

const OverviewFieldComponent = ({
  data = {
    phone: "9988098812",
    address: "50000, Baner, Pune, Maharashtra, India",
    lat: 18.5204,
    lng: 73.8567,
  },
}) => {
  const { city, hotel, id, name, page = "" } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarRestaurants, setSimilarRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cordinate, setCordinate] = useState({
    lat: "43.6319",
    lon: "-79.3716",
  });

  // Detect location
  useEffect(() => {
    detectLocation((locationData) => {
      if (locationData) {
        setCordinate({
          lat: locationData.latitude || "43.6319",
          lon: locationData.longitude || "-79.3716",
          address: locationData.address?.split(",")[0]?.trim(),
        });
      } else {
        setError("Failed to detect location, using default coordinates.");
      }
    });
  }, []);

  // Post recently viewed
  useEffect(() => {
    const recentlyViewedRestaurant = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/firm/recently-viewed/${id}`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Error posting recently viewed:", err);
      }
    };
    if (id) recentlyViewedRestaurant();
  }, [id]);

  // Fetch similar restaurants
  useEffect(() => {
    const getSimilarRestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/recommend?restaurant=${name}`
        );
        setSimilarRestaurants(response.data || []);
      } catch (err) {
        console.error("Error fetching similar restaurants:", err);
      }
    };

    if (id && name) getSimilarRestaurants();
  }, [id, name, cordinate]);

  // Fetch restaurant overview
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`
        );
        setOverview(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching overview:", err);
        setError("Failed to load restaurant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurants();
    } else {
      setError("Invalid restaurant ID provided.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 640) {
      setCardsPerPage(1);
    } else if (window.innerWidth < 1024) {
      setCardsPerPage(2);
    } else {
      setCardsPerPage(3);
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const [cardsPerPage, setCardsPerPage] = useState(3);

const nextRestaurant = () => {
  setCurrentIndex((prevIndex) => prevIndex + cardsPerPage);
};

const prevRestaurant = () => {
  setCurrentIndex((prevIndex) => prevIndex - cardsPerPage);
};

const displayedRestaurants = similarRestaurants.slice(currentIndex, currentIndex + cardsPerPage);
  

  if (loading)
    return (
      <p className="text-center text-lg text-secondary-text py-8 animate-pulse">
        Loading amazing restaurant details...
      </p>
    );
  if (error)
    return (
      <p className="text-red-600 text-center text-lg py-8 font-semibold">
        {error}
      </p>
    );

  const extractPriceForTwo = (price) => {
    if (typeof price === "number") return price * 2;
    if (typeof price === "string") {
      const numbers = price.match(/\d+/g)?.map(Number) || [];
      if (numbers.length === 1) return numbers[0] * 2;
      if (numbers.length === 2) return ((numbers[0] + numbers[1]) / 2) * 2;
    }
    return null;
  };

 

  

  return (
    <div className="w-full bg-[white] mt-[-40px]  px-3 sm:px-6 lg:px-12 min-h-screen">
  {/* About Section */}
  <div className="flex flex-col lg:flex-row gap-6 bg-light-background rounded-xl shadow-smooth p-4 sm:p-6 lg:p-8 mb-8">
    {/* Left Content */}
    <div className="flex-1">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-text mb-4">
        About this place
      </h2>

      {/* Menu */}
      <section className="mb-1">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-text mb-1">
          Menu
        </h3>
        <Link
          to={`/${city}/${id}/${name}/menu`}
          className="text-primary-brand hover:text-red-700 font-medium flex items-center gap-2 text-sm sm:text-base mb-1"
        >
          See all menus
          <img src={rightArrow} className="w-4 h-4" alt="right arrow" />
        </Link>

        <div className="mb-3">
          <h4 className="text-base sm:text-lg md:text-xl font-semibold text-secondary-text mb-1">
            Cuisines
          </h4>
          <div className="flex flex-wrap gap-3">
            {overview?.restaurantInfo?.cuisines?.length > 0 ? (
              overview.restaurantInfo.cuisines.map((val, idx) => (
                <LabelUtil
                  key={idx}
                  link={`/show-case?cuisines=${val
                    .trim()
                    .replace(/\s+/g, "%20")}&page=dinning-out`}
                  txt={val.trim()}
                  className="bg-primary-brand/10 text-primary-brand px-3 py-1 rounded-full text-sm font-medium border border-primary-brand/20 hover:bg-primary-brand/20 transition-colors"
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No cuisines listed</p>
            )}
          </div>

          <Link to={`/${city}/${id}/${name}/menu`} className="block mt-1">
            {overview?.menu_images?.length > 0 ? (
              overview.menu_images.slice(0, 1).map((val, idx) => (
                <MenuCard
                  key={idx}
                  ttl={overview.restaurantInfo?.name || "Menu"}
                  imgSrc={val}
                  pages={`${overview.menu_images.length} pages`}
                />
              ))
            ) : (
              <p className="text-gray-500">No menu available</p>
            )}
          </Link>
        </div>
      </section>

      {/* Known For */}
      <section className="mb-3">
        <h3 className="text-xl sm:text-2xl font-semibold text-secondary-text mb-1">
          People Say This Place Is Known For
        </h3>
        <p className="text-secondary-text">
          {overview?.reviewSummary ||
            "No reviews available yet. Be the first to share your experience!"}
        </p>
      </section>

      {/* Cost */}
      <section className="mb-1">
        <h3 className="text-xl sm:text-2xl font-semibold text-secondary-text mb-1">
          Average Cost
        </h3>
        <p className="text-secondary-text text-lg font-medium">
          {overview?.restaurantInfo?.priceRange
            ? "CAN$ " +
              extractPriceForTwo(overview.restaurantInfo.priceRange) +
              " for two people (approx.)"
            : "Cost information not available"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Exclusive of applicable taxes and charges, if any
        </p>
      </section>
    </div>

    {/* About Card */}
    <div className="lg:w-2/5 min-w-[250px] mt-6 lg:mt-0">
      <OverviewAboutCard data={overview || data} />
    </div>
  </div>

  {/* Features Section */}
  <section className="bg-light-background rounded-xl shadow-smooth  mb-8">
    <h3 className="text-2xl sm:text-3xl font-semibold text-secondary-text mb-6 text-center">
      Features
    </h3>
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {overview?.features?.length > 0 ? (
    overview.features.map((val, idx) => (
      <li
        key={idx}
        className="flex items-center gap-3 p-3 sm:p-4 bg-dark-background rounded-lg border border-gray-700 hover:border-green-500 transition-all text-secondary-text text-sm sm:text-base"
      >
        <img
          src="/icons/tick-green.png"
          alt="Feature"
          className="w-5 h-5"
        />
        <span>{val}</span>
      </li>
    ))
  ) : (
    <li className="text-center text-gray-400 col-span-full">
      No features available
    </li>
  )}
</ul>

  </section>

  {/* Featured In Section */}
  <section className="bg-light-background rounded-xl shadow-smooth  mb-8">
    <h3 className="text-2xl sm:text-3xl font-semibold text-secondary-text mb-6 text-center">
      Featured In
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Link to="/CatchTheMatch">
        <CollectionsCard
          imgSrc={CathTheMatachImg}
          title="Catch the Match"
          places="20"
        />
      </Link>
      <Link to="/new-in-town">
        <CollectionsCard
          imgSrc={NewInTownImg}
          title="New In Town"
          places="15"
        />
      </Link>
      <Link to="/calling-bar-hoppers">
        <CollectionsCard
          imgSrc={CallingBarHoppersImg}
          title="Calling all Bars"
          places="18"
        />
      </Link>
      <Link to="/trending-this-week">
        <CollectionsCard
          imgSrc={TrendingThisWeekImg}
          title="Trending This Week"
          places="25"
        />
      </Link>
    </div>
  </section>

<section className="bg-light-background rounded-xl shadow-smooth  mb-8 max-w-7xl mx-auto">
  <h3 className="text-2xl sm:text-3xl font-semibold text-secondary-text mb-6 text-center">
    Similar Restaurants
  </h3>
  {similarRestaurants.length > 0 ? (
    <div className="relative flex items-center justify-center">

      {/* --- Left Arrow --- */}
      <button
        onClick={prevRestaurant}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
        disabled={currentIndex === 0}
      >
        <img src={leftArrow} alt="Prev" className="w-6 h-6" />
      </button>

      {/* --- Responsive Card Container --- */}
      {/* This grid now correctly displays the right number of items because the 
          'displayedRestaurants' array is also responsive. 
      */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-8">
        {displayedRestaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <ShowcaseCard
              distance={restaurant.distance}
              diningStyle={
                restaurant.restaurantInfo?.additionalInfo?.diningStyle ||
                "Casual Dining"
              }
              priceRange={restaurant.price}
              address={restaurant.address}
              name={restaurant.restaurant_name || "N/A"}
              rating={restaurant.rating || "N/A"}
              imgSrc={restaurant.image_url || food1}
              link2={`/hyderabad/${restaurant.id}/${restaurant.restaurant_name
                .toLowerCase()
                .replace(/\s+/g, "-")}/overview`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={nextRestaurant}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
        disabled={currentIndex + cardsPerPage >= similarRestaurants.length}
      >
        <img src={rightArrow} alt="Next" className="w-6 h-6" />
      </button>
    </div>
  ) : (
    <p className="text-center text-gray-500">
      No similar restaurants available.
    </p>
  )}
</section>
</div>

  );
};

export default OverviewFieldComponent;
