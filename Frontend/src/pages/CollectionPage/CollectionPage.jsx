import { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import ExploreOptionsNearMe from "../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe";
import NavigationBar from "../../components/Navbars/NavigationBar2/NavigationBar2";
import CollectionsCard from "../../utils/Cards/card2/CollectionsCard";
import { Link } from "react-router-dom";
import { MdFilterList, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useContextData } from "../../context/OutletContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../../utils/SearchBar/SearchBar";
import { toast } from "react-toastify";
const CollectionPage = () => {
  const [savedVisible, setSavedVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosApi } = useContextData();
  const { userId } = useAuth(); // Ensure you are getting userId from your context
  const [savedCollection, setSavedCollection] = useState([]);
  const text = {
    heading: "Collections - Delhi NCR",
    message: "Create and browse lists of the finest restaurants",
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/marketing-dashboard/collections/active`
        );
        // Map collections to add a 'userLiked' boolean for easier rendering
        const collectionsWithLikedStatus = response.data.map((collection) => ({
          ...collection,
          // This line correctly sets userLiked to true or false.
          userLiked: collection?.userLike?.includes(userId),
        }));
        setCollections(collectionsWithLikedStatus || []);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchCollections();
    }
  }, [userId, axiosApi]);

  const handleLike = async (id, liked) => {
    console.log(id);
    try {
      const response = await axiosApi.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/marketing-dashboard/collections/${id}/like`
      );

      if (response.status === 200) {
        // The server's response should contain the updated collection object.
        // We will use this to update our local state.
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
        toast.success(message);
      }
    } catch (error) {
      toast.error("Please login to like the collection.");
      console.error("Error liking/unliking collection:", error);
    }
  };

  // Filter collections based on the active tab and search term
  const displayedCollections = collections
    .filter((collection) => {
      // If 'Saved' tab is active, only show collections the user has liked
      if (savedVisible) {
        return collection?.userLiked;
      }
      // Otherwise, show all collections
      return true;
    })
    .filter((collection) =>
      // Filter by search term regardless of the tab
      collection.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  console.log(displayedCollections);
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />

      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8 w-full">
        <BreadCrumb />
        <div className="text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            {text.heading}
          </h1>
          <p className="text-lg text-gray-600">{text.message}</p>
        </div>

        <TabSwitcher
          savedVisible={savedVisible}
          setSavedVisible={setSavedVisible}
        />

        {/* Search bar is only shown on the 'Handpicked' tab */}

        <>
          <div className="flex flex-col sm:flex-row justify-between items-center my-6 gap-4">
            <div className="relative flex-grow w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search collections..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading collections...</p>
          </div>
        ) : (
          <>
            {displayedCollections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                {displayedCollections.map((collection) => (
                  <div
                    className="w-full flex justify-center"
                    key={collection._id}
                  >
                    <CollectionsCard
                      imgSrc={collection.photoWeb || "/images/collection1.avif"}
                      title={collection.title}
                      places={collection.restaurants?.length || "0"}
                      id={collection._id}
                      handleLike={handleLike}
                      liked={collection?.userLike?.includes(userId)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="col-span-full text-center text-gray-500 text-xl py-10">
                {savedVisible
                  ? "You haven't saved any collections yet. Start exploring!"
                  : "No collections found matching your criteria."}
              </p>
            )}
          </>
        )}
      </div>
      <ExploreOptionsNearMe />
      <Footer />
    </div>
  );
};

const TabSwitcher = ({ savedVisible, setSavedVisible }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        className={`px-6 py-3 text-lg font-medium transition-colors duration-200
          ${
            !savedVisible
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          } focus:outline-none`}
        onClick={() => setSavedVisible(false)}
      >
        Handpicked
      </button>
      <button
        className={`px-6 py-3 text-lg font-medium transition-colors duration-200
          ${
            savedVisible
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          } focus:outline-none`}
        onClick={() => setSavedVisible(true)}
      >
        Saved Collections
      </button>
    </div>
  );
};

const EmptySavedCard = () => (
  <section className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-inner my-10 text-center">
    <img
      src="/images/savedCollection.avif" // Ensure this path is correct
      alt="Saved Collection background"
      className="max-w-xs md:max-w-sm lg:max-w-md h-auto mb-6"
    />
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
      No Saved Collections Yet!
    </h2>
    <p className="text-gray-600 text-base md:text-lg max-w-md">
      Save collections you love, and they'll magically appear right here. Start
      exploring!
    </p>
    {/* Optional: Add a button to go back to Handpicked collections */}
    <button
      className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors duration-200"
      onClick={() => {
        /* Logic to switch back to handpicked or navigate to home */
      }}
    >
      Browse Handpicked Collections
    </button>
  </section>
);

const BreadCrumb = () => {
  let navTrack = ["Home", "Delhi NCR", "Collections"]; // Changed "Collection" to "Collections" for consistency
  return (
    <nav className="text-gray-500 text-sm mb-6">
      {navTrack.map((el, idx) => (
        <span key={idx}>
          <Link
            to={idx === 0 ? "/" : idx === 1 ? "/delhi-ncr" : "#"} // Example links
            className="hover:text-orange-500 transition-colors duration-200"
          >
            {el}
          </Link>
          {idx !== navTrack.length - 1 && (
            <span className="mx-1 text-gray-400">/</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default CollectionPage;
