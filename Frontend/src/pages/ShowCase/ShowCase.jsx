import axios from "axios";
// import { useEffect, useRef, useState } from "react";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { useLocation } from "../../context/locationContext";
import { useContextData } from "../../context/OutletContext";
import { Link } from "react-router-dom";
import BannerCarousel from "../../components/BannerCarousel/BannerCarousel";
import FilterPopupWindow from "../../components/FilterPopupWindow/FilterPopupWindow";
import FilterPopupWindowTiffin from "../../components/FilterPopupWindow/FilterPopupWindowTiffin";
import Footer from "../../components/Footer/Footer";
import Collections from "../../components/HomeComponents/Collections/Collections";
import ExploreOptionsNearMe from "../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe";
import { detectLocation } from "../../components/HomeComponents/PopularPlaces/CurrentLocation/detectLocation";
import NavigationBar2 from "../../components/Navbars/NavigationBar2/NavigationBar2";
import SearchBar from "../../utils/SearchBar/SearchBar";

import {
  diningOutPage,
  nightLifePage,
  orderOnlinePage,
  proAndProPlusPage,
} from "../../helpers/constants";
import NotAvailable from "../../pages/Noresults/Notavailable";
import CircleCard1 from "../../utils/Cards/CircleCards/CircleCard1/CircleCard1";
import CircleCard2 from "../../utils/Cards/CircleCards/CircleCard2/CircleCard2";
import ShowcaseCard from "../../utils/Cards/ShowcaseCard/ShowcaseCard";
import CarouselUtil from "../../utils/CarouselUtil/CarouselUtil";
import CategorySelectionComp from "../../utils/OrderingUtils/CategorySelectionComp/CategorySelectionComp";
import FilterBox from "../../utils/OrderingUtils/FilterBox/FilterBox";
import css from "./ShowCase.module.css";
import kfcImg from "/icons/Brands/kfc.png";
import pizzahutImg from "/icons/Brands/pizzahut.png";
import scoopsImg from "/icons/Brands/scoops.png";
import delivery1 from "/icons/delivery1.png";
import delivery2 from "/icons/delivery2.png";
import dinning1 from "/icons/dinning1.png";
import dinning2 from "/icons/dinning2.png";
import downArrowIcon from "/icons/down-arrow.png";
import filtersIcon from "/icons/filter.png";
import biryaniCImg from "/icons/Food/biryaniC.png";
import burgerImg from "/icons/Food/burger.png";
import chickenImg from "/icons/Food/chicken.png";
import friesImg from "/icons/Food/fries.png";
import homestyleImg from "/icons/Food/homestyle.png";
import noodelsImg from "/icons/Food/noodels.png";
import pannerImg from "/icons/Food/panner.png";
import pizzaImg from "/icons/Food/pizza.png";
import sandwichImg from "/icons/Food/sandwich.png";
import shawarmaImg from "/icons/Food/shawarma.png";
import nightlife1 from "/icons/nightlife1.png";
import nightlife2 from "/icons/nightlife2.png";
import tiffin1 from "/icons/tiffin1.png";
import tiffin2 from "/icons/tiffin2.png";

import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const sortMapping = {
  popularity: "default",
  ratingHighToLow: "HighToLow",
  costLowToHigh: "lowToHigh",
  costHighToLow: "highToLow",
  deliveryTime: "deliveryTime",
};

const ShowCase = () => {
  const { currentLocation, isLoading: isLocationLoading } = useLocation();
  console.log('%c[SHOWCASE] Step 3: Component rendered. Current global location is:', 'color: purple; font-weight: bold;', currentLocation);
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  // const location = useLocation();
  // const navigate = useNavigate();
  //  const { id, page, name, city } = useParams();
  const urlParams = new URLSearchParams(routerLocation.search);
  const page = urlParams.get("page");

  const pageParam = urlParams.get("page"); // e.g., "pro-and-pro-plus/Brampton"
  let selectedCityFromUrl = "";
  if (pageParam && pageParam.includes("/")) {
    selectedCityFromUrl = decodeURIComponent(pageParam.split("/")[1]);
  }
  const [isOpen, setIsOpen] = useState(false);
  const [Tiffin, setTiffin] = useState([]);
  const [error, setError] = useState(null);
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [city, setCity] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false); // New state for progress bar visibility
  const [notFound, setNotFound] = useState(false);
  const [nextCursor, setNextCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState("Tiffin Services"); // Add this state for the page title
  const [isActive, setIsActive] = useState({
    delivery: page === orderOnlinePage,
    dinning: page === diningOutPage,
    nightlife: page === nightLifePage,
    kitchen: page === proAndProPlusPage,
  });
  const { axiosApi } = useContextData();
  const showcaseRef = useRef(null);

  const [filters, setFilters] = useState(() => {
    const urlParams = new URLSearchParams(routerLocation.search);
    return {
      feature: urlParams.get("feature") || "",
      cuisines: urlParams.get("cuisines") || "",
      dish: urlParams.get("dish") || "",
      minRating: urlParams.get("minRating") || "",
      maxRating: urlParams.get("maxRating") || "",
      Alcohol: urlParams.get("Alcohol") === "true",
      Dietary: urlParams.get("Dietary") === "true",
      sortBy: urlParams.get("sortBy") || "",
      others: urlParams.get("others") || "",
      priceRange: urlParams.get("priceRange") || "",
      openNow: urlParams.get("openNow") === "true",
      offers: urlParams.get("offers") === "true",
      category: urlParams.get("category") || "",
    };
  });

  const handleApplyFilters = async () => {
    try {
      if (page === proAndProPlusPage) {
        let url;
        const params = new URLSearchParams();

        if (filters.openNow) {
          url = `${import.meta.env.VITE_SERVER_URL
            }/api/tiffin/tiffins/open-now`;
        } else if (filters.minRating) {
          url = `${import.meta.env.VITE_SERVER_URL
            }/api/tiffin/tiffins/high-rated`;
        } else {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
          });
          url = `${import.meta.env.VITE_SERVER_URL
            }/api/tiffin/tiffins/filter?${params.toString()}`;
        }
        console.log("Final fetch URL:", url);

        const response = await axios.get(url);
        const tiffins = response.data.tiffins || response.data;
        setTiffin(tiffins);
      } else {
        await fetchData(0, false, true);
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters");
      if (page === proAndProPlusPage) {
        setTiffin([]);
      }
    }
  };
  // useEffect(() => {
  //   console.log("Running getTiffin because isActive changed");
  //   getTiffin();
  // }, [isActive]);

  // Trigger filter application when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleApplyFilters();
    }, 300); // Debounce to avoid rapid API calls
    return () => clearTimeout(timer);
  }, [filters, page]);

  // Initial data fetch when location changes
  useEffect(() => {
    // Only fetch if we have a location from the global context
    if (currentLocation) {
      console.log("ShowCase page is fetching data for:", currentLocation.address);
      setRestaurantData([]); // Clear old results
      setNextCursor(0);
      setHasMore(true);
      setNotFound(false);
      fetchData(0, false, true); // Fetch data for the new location
    }
  }, [currentLocation, filters, page]);
  // Fetch restaurant data
  const fetchData = async (
    cursor = 0,
    isLoadMore = false,
    useFilters = true
  ) => {
    if (!currentLocation?.latitude || !currentLocation?.longitude || (isLoadMore && !hasMore) || loading)
      return;

    setLoading(true);
    setShowProgress(true); // Show progress bar
    setProgress(0);
    setError(null);

    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10; // Smaller, consistent increment
      });
    }, 100); // Faster interval for smoother updates

    try {
      const baseParams = {
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
        // lat: "43.6534627",
        // lon: "-79.4276471",
        radius: 5,
        limit: 20,
        cursor: cursor,
      };

      const queryParams =
        useFilters &&
          Object.values(filters).some((val) => val !== "" && val !== false)
          ? new URLSearchParams({
            ...baseParams,
            ...Object.fromEntries(
              Object.entries(filters).filter(
                ([_, v]) => v !== "" && v !== false
              )
            ),
          }).toString()
          : new URLSearchParams(baseParams).toString();

      const url = `${import.meta.env.VITE_SERVER_URL
        }/firm/getnearbyrest?${queryParams}`;
      console.log("Fetching URL:", url);

      const response = await axios.get(url, { withCredentials: true });

      if (response.data.success) {
        const newData = response.data.data || [];
        if (newData.length > 0) {
          setRestaurantData((prev) =>
            isLoadMore ? [...prev, ...newData] : newData
          );
          setNextCursor(response.data.nextCursor);
          setHasMore(
            response.data.nextCursor !== null && newData.length === 20
          );
          setNotFound(false);
        } else if (useFilters && !isLoadMore) {
          setNotFound(true);
          removeNotFound();
        } else {
          setHasMore(false);
          setNotFound(true);
        }
      } else {
        if (useFilters && !isLoadMore) {
          setNotFound(true);
          removeNotFound();
        } else {
          setHasMore(false);
          setNotFound(true);
        }
        setError(response.data.message || "No restaurants found");
      }
    } catch (err) {
      if (useFilters && !isLoadMore) {
        setNotFound(true);
        removeNotFound();
      } else {
        setHasMore(false);
        setNotFound(true);
        setError(err.response?.data?.message || "Failed to fetch restaurants");
      }
    } finally {
      clearInterval(interval);
      setProgress(100);
      // Delay hiding the progress bar for better UX
      setTimeout(() => {
        setLoading(false);
        setShowProgress(false);
      }, 300); // Minimum display time of 300ms
    }
  };

  const removeNotFound = async () => {
    setTimeout(async () => {
      setNotFound(false);
      await fetchData(0, false, false);
    }, 1500);
  };


  // Scroll-based lazy loading
  useEffect(() => {
    if (
      loading ||
      !hasMore ||
      page === proAndProPlusPage ||
      nextCursor === null
    )
      // const locationName = cordinate.address || "your area";
      return;

    const handleScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 2000 &&
        hasMore &&
        !loading
      ) {
        fetchData(nextCursor, true, true);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, nextCursor, page, filters]);

  // Handle filter changes with scroll to top
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => {
      let newFilters = { ...prev };
      if (name === "category") {
        newFilters.category = value;
      }

      if (type === "checkbox") {
        if (name === "minRating" || name === "maxRating") {
          newFilters[name] = checked ? value : "";
        } else if (
          name === "Alcohol" ||
          name === "openNow" ||
          name === "offers" ||
          name === "Dietary"
        ) {
          if (checked) {
            newFilters[name] = true;
          } else {
            delete newFilters[name];
          }
        } else {
          const currentValues = prev[name] ? prev[name].split(",") : [];
          const newValues = checked
            ? [...currentValues, value]
            : currentValues.filter((v) => v !== value);
          newFilters[name] = newValues.join(",");
        }
      } else if (type === "text") {
        newFilters[name] = value;
      } else if (name === "sortBy") {
        console.log(sortMapping[value]);
        newFilters[name] = sortMapping[value] || value;
      }

      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(newFilters).filter(([_, v]) => v !== "" && v !== false)
        )
      );
      queryParams.set("page", page);

      setTimeout(() => {
        navigate(`${location.pathname}?${queryParams.toString()}`, {
          replace: true,
        });
        if (showcaseRef.current) {
          showcaseRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
      return newFilters;
    });
  };

  // Sync filters with URL
  useEffect(() => {
    const urlParams = new URLSearchParams(routerLocation.search);
    const urlFilters = {
      feature: urlParams.get("feature") || "",
      cuisines: urlParams.get("cuisines") || "", // This will be "Wine bars" if present
      dish: urlParams.get("dish") || "",
      minRating: urlParams.get("minRating") || "",
      maxRating: urlParams.get("maxRating") || "",
      Alcohol: urlParams.get("Alcohol") === "true",
      Dietary: urlParams.get("Dietary") === "true",
      sortBy: urlParams.get("sortBy") || "",
      others: urlParams.get("others") || "",
      priceRange: urlParams.get("priceRange") || "",
      openNow: urlParams.get("openNow") === "true",
      offers: urlParams.get("offers") === "true",
      category: urlParams.get("category") || "",
    };

    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [routerLocation.search]);

  const scrollToSection = () => {
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const filterOptions = {
    delivery: [
      { text: "Filter", leftIcon: filtersIcon },
      {
        text: "Vegetarian options",
        name: "cuisines",
        type: "checkbox",
        value: "Vegetarian options",
      },
    ],
    dinning: [
      { text: "Filter", leftIcon: filtersIcon },
      {
        text: "Rating 4.5+",
        name: "minRating",
        value: "4.6",
        type: "checkbox",
      },

      {
        text: "Outdoor Seating",
        name: "feature",
        value: "Outdoor seating",
        type: "checkbox",
      },
      {
        text: "Serves Alcohol",
        name: "Alcohol",
        type: "checkbox",
        value: "true",
      },
      // { text: "Open Now", name: "openNow", type: "checkbox", value: "true" },
      { text: "Cuisines", name: "cuisines", rightIcon: downArrowIcon },
      { text: "Sort", name: "sortBy", rightIcon: downArrowIcon },
    ],
    nightLife: [
      { text: "Filter", leftIcon: filtersIcon },
      // { text: "Offers", name: "offers", type: "checkbox", value: "true" },
      {
        text: "Rating 4.5+",
        name: "minRating",
        value: "4.6",
        type: "checkbox",
      },
      { text: "Pubs & Bars", name: "Alcohol", value: "true", type: "checkbox" },
    ],
    kitchen: [
      { text: "Filter", leftIcon: filtersIcon },
      {
        text: "Rating 4.5+",
        name: "minRating",
        value: "4.5",
        type: "checkbox",
      },

      { text: "Open Now", name: "openNow", type: "checkbox", value: "true" },
    ],
  };

  const getFilterKey = (page) => {
    switch (page) {
      case orderOnlinePage:
        return "delivery";
      case diningOutPage:
        return "dinning";
      case nightLifePage:
        return "nightLife";
      case proAndProPlusPage:
        return "kitchen";
      default:
        return "delivery";
    }
  };

  const foodCardScroll = [
    { name: "Biryani", imgSrc: biryaniCImg },
    { name: "Burger", imgSrc: burgerImg },
    { name: "Chicken", imgSrc: chickenImg },
    { name: "Fries", imgSrc: friesImg },
    // { name: "Home Style", imgSrc: homestyleImg },
    { name: "Noodles", imgSrc: noodelsImg },
    { name: "Paneer", imgSrc: pannerImg },
    { name: "Pizza", imgSrc: pizzaImg },
    { name: "Sandwich", imgSrc: sandwichImg },
    { name: "Shawarma", imgSrc: shawarmaImg },
  ];

  const brandsCardScroll = [
    { name: "KFC", imgSrc: kfcImg, time: "45" },
    { name: "Pizza Hut", imgSrc: pizzahutImg, time: "35" },
    { name: "Scoops", imgSrc: scoopsImg, time: "49" },
    { name: "KFC", imgSrc: kfcImg, time: "19" },
    { name: "Pizza Hut", imgSrc: pizzahutImg, time: "22" },
    { name: "Scoops", imgSrc: scoopsImg, time: "33" },
  ];
  const filterBoxes = filterOptions[getFilterKey(page)].map((val, id) => (
    <div key={id}>
      <FilterBox
        leftIcon={val.leftIcon ?? null}
        rightIcon={val.rightIcon ?? null}
        text={val.text}
        handleFilter={handleChange}
        name={val.name}
        value={val.value ?? ""}
        type={val.type || "checkbox"}
        filterGroup={filters}
        setIsOpen={val.text === "Filter" ? setIsOpen : undefined}
        checked={
          val.name === "cuisines" && filters.cuisines.includes(val.value)
        } // Ensure cuisine filter is checked if active
      />
    </div>
  ));

  // Move this useEffect inside the ShowCase component, before the return statement
  // Modify the useEffect that checks for filtered tiffins
  useEffect(() => {
    // Check if there are filtered tiffins in localStorage
    const filteredTiffinsStr = localStorage.getItem("filteredTiffins");
    const selectedCity = localStorage.getItem("selectedCity");
    const tiffinFetchError = localStorage.getItem("tiffinFetchError");
    // Check if this is the first visit after city selection
    const isFirstVisit = localStorage.getItem("isFirstVisitAfterCitySelection");

    if (filteredTiffinsStr && selectedCity && page && page.startsWith(proAndProPlusPage) && isFirstVisit === "true") {
      try {
        const filteredTiffins = JSON.parse(filteredTiffinsStr);
        // Set the filtered tiffins to the state
        setTiffin(filteredTiffins);
        // Update the cordinate address to show the selected city
        setCordinate(prev => ({
          ...prev,
          address: selectedCity
        }));
        // Set page title to include the selected city
        setPageTitle(`Tiffin Services in ${selectedCity}`);

        // Set notFound if there are no tiffins and there was an error
        if (filteredTiffins.length === 0 && tiffinFetchError === "true") {
          setNotFound(true);
        } else {
          setNotFound(false);
        }
      } catch (error) {
        console.error("Error parsing filtered tiffins:", error);
        // If there's an error, fetch all tiffins as fallback
        getTiffin();
      }
    } else if (page && page.startsWith(proAndProPlusPage)) {
      // If no filtered tiffins in localStorage or not the first visit, fetch all tiffins
      getTiffin(false); // Pass false to clear any city filters
    }
  }, [page]);

  // Modify the getTiffin function to handle city filtering
  const getTiffin = async (cityFilter = null) => {
    try {
      setNotFound(false); // Reset notFound state

      // If cityFilter is explicitly set to false (from No button click or revisit), clear the selected city
      if (cityFilter === false) {
        localStorage.removeItem("selectedCity");
        localStorage.removeItem("filteredTiffins");
        localStorage.removeItem("tiffinFetchError");
        localStorage.removeItem("isFirstVisitAfterCitySelection");
        setPageTitle("Tiffin Services");
      }

      // Check if this is not the first visit after city selection
      const isFirstVisit = localStorage.getItem("isFirstVisitAfterCitySelection");
      if (isFirstVisit === "false") {
        // If not the first visit, clear city filter
        localStorage.removeItem("selectedCity");
        localStorage.removeItem("filteredTiffins");
        localStorage.removeItem("tiffinFetchError");
        localStorage.removeItem("isFirstVisitAfterCitySelection");
        setPageTitle("Tiffin Services");
        cityFilter = false; // Force to fetch all tiffins
      }

      // Use the city parameter from the function call, or get from localStorage
      const selectedCity = cityFilter === false ? null : (cityFilter || selectedCityFromUrl);
      let url = `${import.meta.env.VITE_SERVER_URL}/api/tiffin`;

      // If a city is selected, add it to the query parameters
      if (selectedCity) {
        url = `${import.meta.env.VITE_SERVER_URL}/firm/get/tiffins?city=${encodeURIComponent(selectedCity)}`;
      }

      const response = await axiosApi.get(url);

      if (response.data.success) {
        if (response.data.tiffins && response.data.tiffins.length > 0) {
          setTiffin(response.data.tiffins);
        } else {
          setTiffin([]);
          // Only set notFound if a city was selected and no tiffins were found
          if (selectedCity) {
            setNotFound(true);
          }
        }

        // Update page title if city is selected
        if (selectedCity) {
          setPageTitle(`Tiffin Services in ${selectedCity}`);
        } else {
          setPageTitle("Tiffin Services");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching tiffin");
      setTiffin([]);
      setNotFound(true);
    }
  };

  // Add this near the other useEffect hooks, preferably after the main data-fetching useEffect
  useEffect(() => {
    return () => {
      // Cleanup city filter when leaving the page
      localStorage.removeItem("selectedCity");
      localStorage.removeItem("filteredTiffins");
      localStorage.removeItem("tiffinFetchError");
      localStorage.removeItem("isFirstVisitAfterCitySelection");
    };
  }, []);

  const locationName = currentLocation?.address || 'your area';
  if (isLocationLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading your location...</h2>
      </div>
    );
  }
  return (

    <div className="flex justify-center bg-[#ffffff] w-full items-center flex-col overflow-x-hidden">
      {showProgress && (
        <div className="fixed top-0 left-0 w-full h-1 z-[1000]">
          <div
            className={`h-full bg-[#ffffff] transition-all duration-300 ease-out ${css.progressBar}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <NavigationBar2 />
      <div className="w-full bg-[#ffffff] max-w-7xl mt-6 px-4 mx-auto">
        <div className="mt-4 ml-3 sm:ml-4 md:ml-[130px] ">
        </div>
      </div>
      {page === proAndProPlusPage ? (
        <FilterPopupWindowTiffin
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleChange={handleChange}
          filters={filters}
          sortMapping={sortMapping}
          onApplyFilters={handleApplyFilters}
        />
      ) : (
        <FilterPopupWindow
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleChange={handleChange}
          filters={filters}
          sortMapping={sortMapping}
        />
      )}
      <div className={`${css.showCaseDiv} mb-10`}>
        <div
          className={`${css.showcaseComps} grid grid-cols-4 bg-[#ffffff] max-sm:grid-cols-2 max-md:grid-cols-3 max-xl:grid-cols-3 max-lg:grid-cols-3 max-xl:pl-48 max-xl:pr-48 max-lg:pl-24 max-lg:pr-24 max-md:justify-center pl-52 pr-52 mr-auto max-md:pl-12 max-md:pr-12 max-sm:pl-12 max-sm:pr-12  max-sm:justify-center max-lg:justify-center max-xl:justify-center `}
        >
          <CategorySelectionComp
            title="Takeaway"
            imgSrc={delivery1}
            imgSrc2={delivery2}
            color="#FCEEC0"
            comp="delivery"
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <CategorySelectionComp
            title="Dining"
            imgSrc={dinning1}
            imgSrc2={dinning2}
            color="#EDF4FF"
            comp="dinning"
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <CategorySelectionComp
            title="NightLife"
            imgSrc={nightlife1}
            imgSrc2={nightlife2}
            color="#EDF4FF"
            comp="nightlife"
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <CategorySelectionComp
            title="Tiffin"
            imgSrc={tiffin1}
            imgSrc2={tiffin2}
            color="#EDF4FF"
            comp="kitchen"
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </div>
      </div>
      {page === diningOutPage && (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#ffffff]">
          <Collections />
        </div>
      )}
      {page === nightLifePage ? (
        <>
          <div className="mx-auto w-full bg-[#ffffff] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Collections />
          </div>
          <div className={css.innerDiv3}>
            <div className={css.filtersDivDinningNightlife}>{filterBoxes}</div>
          </div>
        </>
      ) : (
        <div className={css.innerDiv3}>
          <div className={css.filtersDiv}>{filterBoxes}</div>
        </div>
      )}
      {page === orderOnlinePage && (
        <div className={css.innerDiv4}>
          <div className={css.w6}>
            <div className={css.innerDiv4Title}>
            </div>
            <div className={css.rollerCarosuel}>
              <CarouselUtil>
                {foodCardScroll?.map((val, id) => (
                  <div className={css.cardW} key={id}>
                    <CircleCard1
                      imgSrc={val.imgSrc}
                      name={val.name}
                      refto={scrollToSection}
                      link={`/show-case?dish=${val.name
                        .trim()
                        .toLocaleLowerCase()
                        .replace(/\s+/g, " ")}&page=order-online`}
                    />
                  </div>
                ))}
              </CarouselUtil>
            </div>
          </div>
        </div>
      )}

      {page === orderOnlinePage ? (
        <BannerCarousel page="Order-online" />
      ) : page === diningOutPage ? (
        <BannerCarousel page="Dining-out" />
      ) : page === nightLifePage ? (
        <BannerCarousel page="Night-life" />
      ) : page && page.startsWith(proAndProPlusPage) ? (
        <BannerCarousel page="Tiffin-services" />
      ) : null}
      <div className={`${css.innerDiv6} mt-12 sm:mt-12 md:mt-20`} ref={showcaseRef}>
        {notFound && <NotAvailable />}
        <div className="w-full grid gap-4 place-items-center">
          <div className={css.innerDiv6Title}>
            {page === orderOnlinePage
              ? `Delivery Restaurants in ${locationName}`
              : page === diningOutPage
                ? `Dine-Out Restaurants in ${locationName}`
                : page && page.startsWith(proAndProPlusPage)
                  ? `Tiffin services in ${locationName}`
                  : `Nightlife Restaurants in ${locationName}`}
          </div>
          <div className="grid grid-cols-3 w-full justify-items-center gap-6 
                max-md:grid-cols-1 max-sm:grid-cols-1 
                max-lg:grid-cols-2 max-2xl:grid-cols-3 max-xl:grid-cols-3">
            {!currentLocation ? (
              <div>Loading location data...</div>
            ) : page && page.startsWith(proAndProPlusPage) ? (
              Array.isArray(Tiffin) && Tiffin.length > 0 ? (
                Tiffin.map((item) => (
                  <ShowcaseCard
                    key={item._id}
                    promoted={true}
                    time={item.operatingTimes?.Monday?.open || "N/A"}
                    offB={true}
                    proExtraB={false}
                    off={
                      item.offers && item.offers[0]
                        ? `${item.offers[0].discount}% OFF`
                        : "No offer"
                    }
                    proExtra="40"
                    name={item.kitchenName}
                    rating={item.ratings || 0}
                    imgSrc={
                      item.images?.[0] ||
                      "http://localhost:5173/icons/Food/burger.png"
                    }
                    link2={`/${currentLocation.address.split(",")[0].trim()
                        ? currentLocation.address.split(",")[0].trim().replace(/\//g, "")
                        : "location"
                      }/${item._id}/${item.kitchenName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}/tiffins`}
                  />
                ))
              ) : (
                <div className="text-center p-4">Loading Tiffins...</div>
              )
            ) : (
              <>
                {restaurantData?.map((item, index) => (
                  <div className="flex justify-center items-center" key={index}>
                    <ShowcaseCard
                      distance={item.distance}
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
                      link2={`/${currentLocation.address.split(",")[0].trim()
                          ? currentLocation.address.split(",")[0].trim().replace(/\//g, "")
                          : "location"
                        }/${item._id}/${item.restaurantInfo.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/overview`}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <span>Loading more restaurants...</span>
                  </div>
                )}
                {!hasMore && restaurantData.length > 0 && (
                  <div className="text-center p-4 text-gray-500 justify-center flex">
                    You've reached the end of available restaurants
                  </div>
                )}
                {restaurantData.length === 0 && !loading && (
                  <div className="text-center p-4">
                    No restaurants available with current filters
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ExploreOptionsNearMe />
      <Footer />
    </div>
  );
};
export default ShowCase;


