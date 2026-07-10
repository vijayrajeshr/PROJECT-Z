import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import OrderDetails from "./OrderDeatils"; // Assuming this component exists and works
import { FaExternalLinkAlt } from "react-icons/fa"; // Added for 'View Details' icon

const OrderHistoryCard = ({
  udata,
  onToggleFavorite,
}) => {
  const {
    _id,
    items,
    totalPrice,
    status,
    createdAt,
    restaurantName: directRestaurantName,
    fav, // Assume this prop reflects the current favorite status
  } = udata;
  // console.log(udata) // Keep this for debugging if needed

  const [isFavorite, setIsFavorite] = useState(fav);
  const [showAllItemsModal, setShowAllItemsModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // State for OrderDetails modal

  // Adjusted to 3 for the toggle button to appear for more than 3 items
  const initialItemCount = 3;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRestaurantInfo = () => {
    // Priority 1: directRestaurantName as an object with name/address/image_urls
    if (directRestaurantName && typeof directRestaurantName === "object" && directRestaurantName.name && directRestaurantName.address) {
      return {
        name: directRestaurantName.name,
        address: directRestaurantName.address,
        image: directRestaurantName.image_urls?.[0], // Use optional chaining for image_urls
      };
    }
    // Priority 2: restaurantInfo nested under directRestaurantName
    if (directRestaurantName?.restaurantInfo) {
      return {
        name: directRestaurantName.restaurantInfo.name,
        address: directRestaurantName.restaurantInfo.address,
        image: directRestaurantName.image_urls?.[0],
      };
    }
    // Priority 3: restaurantInfo nested within the first item
    if (items?.[0]?.restaurantName?.restaurantInfo) {
      return {
        name: items[0].restaurantName.restaurantInfo.name,
        address: items[0].restaurantName.restaurantInfo.address,
        image: items[0].restaurantName.image_urls?.[0],
      };
    }
    // Fallback if no specific restaurant info is found
    return { name: "Restaurant Name", address: "Address Not Available", image: "https://via.placeholder.com/150" }; // Larger placeholder
  };

  const {
    name: restaurantNameValue,
    address: restaurantAddressValue,
    image: restaurantImage,
  } = getRestaurantInfo();

  const getStatusColorClass = () => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Preparing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Placed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const displayedItems = items?.slice(0, initialItemCount);
  const hasMoreItems = items?.length > initialItemCount;

  const handleToggleFavorite = () => {
    const newFavStatus = !isFavorite;
    setIsFavorite(newFavStatus); // Optimistic UI update
    if (onToggleFavorite) {
      onToggleFavorite(_id, newFavStatus); // Notify parent component/API
    }
  };

  return (
    // The main card container
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100 relative overflow-hidden
                    transition-all duration-300 hover:shadow-lg flex flex-col min-h-[400px]"> {/* Added min-h for consistent card height */}
      {/* Restaurant Image at the very top */}
      <div className="w-full h-28 rounded-t-xl overflow-hidden mb-3"> {/* Reduced height: h-28 */}
        <img
          src={restaurantImage}
          alt={restaurantNameValue}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Favorite Icon - Positioned clearly */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white bg-opacity-70 backdrop-blur-sm shadow-sm
                   text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <AiFillHeart size={22} className="text-red-500" />
        ) : (
          <AiOutlineHeart size={22} />
        )}
      </button>
      <div className="flex items-center justify-between pb-3 border-b border-gray-200"> {/* Reduced padding/margin */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight"> {/* Slightly smaller font */}
            {restaurantNameValue}
          </h2>
          <p className="text-xs text-gray-500 mt-1"> {/* Smaller address font */}
            {restaurantAddressValue}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColorClass()}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 text-gray-800 flex-grow"> {/* Flex-grow to push footer down */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Order ID
          </p>
          <p className="text-sm font-mono text-gray-700 break-words">
            {_id}
          </p>
          <div className="text-md md:text-right">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Total Amount
          </p>
          <p className="text-xl font-bold text-red-600">₹ {totalPrice}</p>
        </div>
        </div>
        

        <div className="col-span-1 ">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider "> {/* Reduced bottom margin */}
            Items Ordered
          </p>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-0.5"> {/* Reduced list item spacing */}
            {displayedItems?.map((item, index) => (
              <li key={item.productId?._id || index}>
                <span className="font-semibold">{item.quantity}x</span>{" "}
                {item.productId?.name || "Unknown Item"}
              </li>
            ))}
          </ul>
          {hasMoreItems && (
            <button
              className="text-blue-600 hover:text-blue-800 hover:underline text-xs  focus:outline-none flex items-center" 
              onClick={() => setShowAllItemsModal(true)}
            >
              Show More ({items.length - initialItemCount} more items)
            </button>
          )}
        </div>

        <div className="">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Ordered On
          </p>
          <p className="font-semibold text-gray-700">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {showDetails && (
        <OrderDetails order={udata} onClose={() => setShowDetails(false)} />
      )}

      {showAllItemsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              onClick={() => setShowAllItemsModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full
                         transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-4 text-red-600 text-center">
              All Order Items
            </h3>
            <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <ul className="list-disc list-inside text-gray-800 space-y-2 text-base">
                {items?.map((item, index) => (
                  <li key={item.productId?._id || index}>
                    <span className="font-bold">{item.quantity}x</span>{" "}
                    {item.productId?.name || "Unknown Item"}{" "}
                    <span className="text-gray-500 text-sm">
                      (₹{item.price})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;