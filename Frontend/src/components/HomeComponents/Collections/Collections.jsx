import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContextData } from "../../../context/OutletContext";

import rightArrow from "/icons/next.png";
import leftArrow from "/icons/prev.png";
import CollectionsCard from "../../../utils/Cards/card2/CollectionsCard";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useLocation } from "../../../context/locationContext";

const Collections = () => {
  const { currentLocation, isLoading: isLocationLoading } = useLocation();
  const locationName = isLocationLoading 
    ? "Loading..." 
    : currentLocation?.address?.split(",")[0] || "Your City";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default, will be updated by media queries
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosApi } = useContextData();
  const { userId } = useAuth();
  // Fetch collections from the backend
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/marketing-dashboard/collections/active`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        // Fallback to actual database collections if API fails
        const fallback = [
          {
            _id: "1",
            title: "Candle Dining",
            photoWeb: "/images/collection2.jpg",
            restaurants: new Array(18),
          },
          {
            _id: "2",
            title: "Newly Opened Spots",
            photoWeb: "/images/collection3.avif",
            restaurants: new Array(20),
          },
          {
            _id: "3",
            title: "Best Picture Poetry",
            photoWeb: "/images/collection5.avif",
            restaurants: new Array(20),
          },
          {
            _id: "4",
            title: "Regional Dishes",
            photoWeb: "/images/collection6.webp",
            restaurants: new Array(10),
          },
          {
            _id: "5",
            title: "Best Buffet",
            photoWeb: "/images/collection7.avif",
            restaurants: new Array(4),
          },
          {
            _id: "6",
            title: "Party Places",
            photoWeb: "/images/collection11.avif",
            restaurants: new Array(8),
          },
        ];
        fallback.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setCollections(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Fetch city from backend
  // useEffect(() => {
  //   const getCity = async () => {
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_SERVER_URL}/api/location`,
  //         {
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setCity(data.city || "Your City");
  //     } catch (error) {
  //       console.error("Error fetching city:", error);
  //       toast.error("Error Fetching City..!");
  //       setCity("Your City");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getCity();
  // }, []);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setItemsPerPage(5); // 2xl
      else if (width >= 1280) setItemsPerPage(4); // xl
      else if (width >= 1024) setItemsPerPage(3); // lg
      else if (width >= 768) setItemsPerPage(3); // md
      else if (width >= 480) setItemsPerPage(2); // sm
      else setItemsPerPage(1); // xs
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width >= 1536) setItemsPerPage(5); // 2xl
  //     else if (width >= 1280) setItemsPerPage(4); // xl
  //     else if (width >= 1024) setItemsPerPage(3); // lg
  //     else if (width >= 768) setItemsPerPage(3); // md
  //     else if (width >= 480) setItemsPerPage(2); // sm
  //     else setItemsPerPage(1); // xs
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // Navigation handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % collections.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + collections.length) % collections.length
    );
  };

  // Calculate translateX for centered cards
  const translateXValue = currentIndex * (100 / itemsPerPage);
  const handleLike = async (id, liked) => {
    console.log(id, liked);
    try {
      const response = await axiosApi.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/marketing-dashboard/collections/${id}/like`
      );
      console.log(response.data);
      if (response.status === 200) {
        const updatedCollectionData = response.data.updatedCollection;

        setCollections((prev) =>
          prev.map((collection) =>
            // Use .toString() on both sides to ensure a correct comparison
            collection._id.toString() === id.toString()
              ? {
                  ...collection, // Keep existing local properties
                  ...updatedCollectionData, // Merge the updated data from the server
                  userLiked: !liked, // Manually toggle the local userLiked status
                }
              : collection
          )
        );

        const message = liked ? "Unliked successfully!" : "Liked successfully!";
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Please login to like the collection.");
      console.error("Error liking/unliking collection:", error);
    }
  };
  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 bg-[#ffffff]">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Collections
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
          <p className="text-gray-600 text-base md:text-lg">
            Explore curated lists of top restaurants, cafes, pubs, and bars in{" "}
            <span className="font-semibold">
              {locationName}
            </span>
            , based on trends.
          </p>
          <Link
  to="/collections"
  className="flex items-center text-primary-green-400 hover:text-primary-green-500 transition-colors duration-200 text-lg font-medium"
>
  All collections in {locationName}
  <img
    src={rightArrow}
    alt="right arrow"
    className="w-5 h-5 ml-2 transition-transform duration-200 hover:scale-110"
  />
</Link>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          aria-label="Previous collections"
          disabled={collections.length <= itemsPerPage}
        >
          <img src={leftArrow} alt="left arrow" className="w-5 h-5" />
        </button>

        {/* Carousel Wrapper */}
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{ transform: `translateX(-${translateXValue}%)` }}
        >
          {collections.map((collection, idx) => (
            <div
              key={collection.title}
              className="flex-shrink-0 flex justify-center"
              style={{ width: `${100 / itemsPerPage}%` }}
            >
              <div className="w-full  max-w-[350px] px-2">
                <CollectionsCard
                  imgSrc={
                    collection.photoWeb ||
                    `/images/collection${(idx % 16) + 1}.${
                      idx % 2 === 0 ? "avif" : "jpg"
                    }`
                  }
                  title={collection.title}
                  places={`${collection.restaurants?.length || 0} places`}
                  id={collection._id}
                  handleLike={handleLike}
                  liked={collection?.userLike?.includes(userId)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          aria-label="Next collections"
          disabled={collections.length <= itemsPerPage}
        >
          <img src={rightArrow} alt="right arrow" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Collections;
