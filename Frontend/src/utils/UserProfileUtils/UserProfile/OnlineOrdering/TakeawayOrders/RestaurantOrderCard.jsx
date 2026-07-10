import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const RestaurantOrderCard = React.forwardRef(({ order, onToggleFavorite }, ref) => {
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};

    const restaurantName = firstItem.sourceEntityId?.restaurantInfo?.name || "Unknown Restaurant";
    const imageUrl = firstItem.sourceEntityId?.image_url || "/path/to/default-image.jpg";
    const itemName = firstItem.name || "N/A";
    const totalPrice = (order.totalPrice - (order.discount || 0)).toFixed(2);

    const orderTime = new Date(order?.orderTime).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div ref={ref} className="bg-white rounded-lg shadow-md overflow-hidden relative border border-gray-200">
            <button
                onClick={() => onToggleFavorite(order._id)}
                className="absolute top-3 right-3 text-2xl z-10"
                aria-label={order.fav ? "Remove from favorites" : "Add to favorites"}
            >
                {order.fav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
            </button>

            <div className="relative w-full h-40 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={restaurantName}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status.toLowerCase() === "notaccept" || order.status.toLowerCase() === "rejected"
                        ? "bg-red-500 text-white"
                        : order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "preparing"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{restaurantName}</h3>
                <p className="text-gray-600 text-sm mb-1">Ordered: {itemName}</p>
                {order.items.length > 1 && (
                    <p className="text-gray-500 text-xs">+{order.items.length - 1} more items</p>
                )}
                <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-gray-900">₹{totalPrice}</p>
                    <p className="text-gray-500 text-sm">{orderTime}</p>
                </div>
                {/* <div className="mt-4 flex flex-col space-y-2">
                    <button
                        onClick={() => {}}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                        View Details
                    </button>
                </div> */}
            </div>
        </div>
    );
});

export default RestaurantOrderCard;