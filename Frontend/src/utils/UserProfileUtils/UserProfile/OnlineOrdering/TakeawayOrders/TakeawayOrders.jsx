
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is available in the environment
import Axios from "axios"; // Using Axios as in the provided skeleton

// Inline SVG Icons (re-using the same pattern to avoid module resolution errors)
const CheckIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

const TruckIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12H7V9h2v3zm0-7a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V5z" />
        <path fillRule="evenodd" d="M2 10a8 8 0 1116 0A8 8 0 012 10zm6-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V8a2 2 0 00-2-2H8z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-1.542 1.01l-1.474-.737a11.05 11.05 0 006.105 6.105l-.737-1.474a1 1 0 011.01-1.542l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const MapMarkerIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const TagIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M17.778 8.222a.75.75 0 01-1.06 1.06L14.47 6.64l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06zM9.525 15.011a.75.75 0 01-1.06 1.06l-3-3a.75.75 0 011.06-1.06l3 3z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.915 2.5a.75.75 0 00-.708.205L.892 14.01a.75.75 0 00.708 1.295L13.018 3.795a.75.75 0 00-.077-1.082l-2-2A.75.75 0 009.525 2.5z" clipRule="evenodd" />
    </svg>
);

const InfoCircleIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 2a1 1 0 100 2h.01a1 1 0 10-.01 2H9a1 1 0 100 2h.01a1 1 0 10-.01 2z" clipRule="evenodd" />
    </svg>
);

const CloseCircleOutlineIcon = ({ size = 24, className = "" }) => (
    <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 12.707a1 1 0 01-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 12 7.293 8.707a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414L13.414 12l3.293 3.293z" clipRule="evenodd" />
    </svg>
);

const HeartIcon = ({ size = 16, className = "", filled = false }) => (
    <svg
        className={className}
        width={size}
        height={size}
        fill={filled ? "red" : "none"}
        stroke={filled ? "red" : "currentColor"}
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
    </svg>
);

const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-1000 flex items-center justify-center animate-fade-in-overlay">
            <div className="bg-white rounded-xl shadow-2xl p-0 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto animate-fade-in-content relative">
                {children}
            </div>
        </div>
    );
};

const UserProfileNoData = ({ hashId }) => (
    <div className="text-center py-10 text-gray-500">
        <p className="text-xl font-semibold mb-3">No data available for user.</p>
    </div>
);

const WhiteButton = ({ txt, count, onClick }) => (
    <button
        className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        onClick={onClick}
    >
        {txt} {count !== undefined && `(${count})`}
    </button>
);

const RedButton = ({ txt, count, onClick }) => (
    <button
        className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        onClick={onClick}
    >
        {txt} {count !== undefined && `(${count})`}
    </button>
);

const Cart = () => (
    <div className="text-center py-10 text-gray-700">
        <p className="text-xl font-semibold mb-3">Your Cart</p>
        <p>This is a placeholder for the Cart component.</p>
    </div>
);

const TakeawayOrders = ({ hashId }) => {
    const navigate = useNavigate();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState(""); // New state for cancel reason
        const [cancellingOrderId, setCancellingOrderId] = useState(null); // New state for tracking cancellation
        const [message,setMessage]=useState('');
    const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const observer = useRef();
    const lastOrderElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchOrders = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/orders/menu/user?page=${page}&limit=12`,
                {
                    withCredentials: true,
                }
            );

            const { orders: fetchedOrders, totalPages, currentPage: fetchedCurrentPage } = response.data;
            console.log("Fetched Takeaway Orders:", fetchedOrders);

            if (page === 1) {
                setOrders(fetchedOrders);
            } else {
                setOrders((prevOrders) => [...prevOrders, ...fetchedOrders]);
            }

            setHasMore(fetchedCurrentPage < totalPages);
            setCurrentPage(fetchedCurrentPage);
        } catch (error) {
            console.error("Error fetching takeaway orders:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL]);

    useEffect(() => {
        if (!showCart) {
            fetchOrders(currentPage);
        }
    }, [currentPage, fetchOrders, showCart]);

    const toggleFavorite = (event, orderId) => {
        event.stopPropagation(); // Prevent opening the modal when clicking the favorite icon
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, fav: !order.fav } : order
            )
        );

        Axios.put(
            `${SERVER_URL}/api/orderFav/${orderId}`,
            {},
            {
                withCredentials: true,
            }
        )
            .then((response) => {
                console.log("Favorite status updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error toggling favorite:", error);
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, fav: !order.fav } : order
                    )
                );
            });
    };

    const formatDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return new Date(dateStr).toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "notaccept":
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
                case "user_cancel":
                return "bg-red-100 text-red-800 border-red-200";
            case "pending":
            case "preparing":
            case "accept":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setIsCancelModalOpen(false); // Ensure cancel modal is closed too
        setCancelReason("");
    };
    const openCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
        setCancelReason(""); // Clear reason
    };
    const handleCancelOrderSubmit = async () => {
            if (!selectedOrder || !cancelReason.trim()) {
                setMessage("Please provide a reason for cancellation.");
                return;
            }
    
            setMessage("");
            setCancellingOrderId(selectedOrder._id); // Set the ID of the order being cancelled
    
            try {
                // Assuming a PUT endpoint for cancellation that takes reason in body
                const response = await Axios.put(
                    `${import.meta.env.VITE_SERVER_URL}/api/orders/cancel/${selectedOrder._id}`,
                    { reason: cancelReason },
                    { withCredentials: true }
                );
    
                if (response.status === 200) {
                    setMessage(`Order #${selectedOrder._id.slice(-6)} cancelled successfully.`);
                    // Update the status of the cancelled order in the local state
                    setOrders(prevOrders =>
                        prevOrders.map(order =>
                            order._id === selectedOrder._id ? { ...order, status: "user_cancel" } : order
                        )
                    );
                    closeModal();
                } else {
                    setMessage(`Failed to cancel order: ${response.data.message || 'Unknown error'}`);
                }
            } catch (err) {
                console.error("Error cancelling order:", err);
                setMessage(`Error cancelling order: ${err.response?.data?.message || err.message || 'An unknown error occurred.'}`);
            } finally {
                setCancellingOrderId(null); // Reset cancelling state
                closeCancelModal(); // Close the cancellation reason modal
            }
        };
    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Your TakeAway Orders</h1>
            

            {showCart ? (
                <Cart />
            ) : (
                <>
                    {initialLoad && isLoading ? (
                        <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                            <ClockIcon className="mr-2 animate-spin" size={24} /> Fetching your delicious orders...
                        </div>
                    ) : orders.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                                {orders.map((order, index) => {
                                    const isLastOrder = orders.length === index + 1;
                                    const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};
                                    const restaurantName = firstItem.sourceEntityId?.restaurantInfo?.name || "Unknown Restaurant";
                                    const restaurantImage = firstItem.sourceEntityId?.image_url || "https://placehold.co/150x150/f0f9ff/00796b?text=Restaurant";
                                    const itemNames = order.items.map(item => item.name).join(', ');

                                    return (
                                        <div
                                            key={order._id}
                                            ref={isLastOrder ? lastOrderElementRef : null}
                                            className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                                                ${selectedOrder && selectedOrder._id === order._id ? "ring-2 ring-teal-500" : ""}`}
                                            onClick={() => openModal(order)}
                                        >
                                            <div className="p-4 flex flex-col items-center text-center">
                                                <div className="relative w-full mb-3">
                                                    <img
                                                        src={restaurantImage}
                                                        alt={restaurantName}
                                                        className="w-full h-40 object-cover rounded-lg shadow-inner"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/f0f9ff/00796b?text=Restaurant+Image"; }}
                                                    />
                                                    <span
                                                        className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(order.status)}`}
                                                    >
                                                        {order.status?.toLowerCase() === "delivered" ? (
                                                            <CheckIcon size={10} className="inline mr-1" />
                                                        ) : (
                                                            <ClockIcon size={10} className="inline mr-1" />
                                                        )}
                                                        {order.status}
                                                    </span>
                                                    <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                                                        #{order._id.slice(-6)}
                                                    </span>
                                                    <button
                                                        className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform duration-200"
                                                        onClick={(e) => toggleFavorite(e, order._id)}
                                                    >
                                                        <HeartIcon size={20} filled={order.fav} />
                                                    </button>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{restaurantName}</h3>
                                                <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">Items: {itemNames}</p>

                                                <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                                                    <span className="text-xl font-bold text-gray-800">
                                                        ₹{order?.totalPrice?.toFixed(2)}
                                                    </span>
                                                    <button className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors duration-200 shadow-md">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {isLoading && (
                                <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                                    <ClockIcon className="mr-2 animate-spin" size={20} /> Loading more orders...
                                </div>
                            )}
                            {!hasMore && !isLoading && orders.length > 0 && (
                                <div className="text-center py-4 text-gray-500">You've seen all your orders.</div>
                            )}
                        </>
                    ) : (
                        <div className="py-10">
                            <UserProfileNoData hashId={hashId} />
                        </div>
                    )}
                </>
            )}

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {selectedOrder && (
                    <div className="p-6 bg-white rounded-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                        >
                            <CloseCircleOutlineIcon size={32} />
                        </button>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            <InfoCircleIcon className="mr-2 text-teal-600" size={24} /> Order Details <span className="text-teal-600 ml-2">#{selectedOrder._id.slice(-6)}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center"><TruckIcon className="mr-2 text-blue-500" size={18} /> Restaurant:</p>
                                <p className="ml-5"><b>Name : </b>{selectedOrder.items[0]?.sourceEntityId?.restaurantInfo?.name || "N/A"}</p>
                                <p className="ml-5"><b>Address : </b>{selectedOrder.items[0]?.sourceEntityId?.restaurantInfo?.address || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center"><TagIcon className="mr-2 text-purple-500" size={18} /> Order Type:</p>
                                <p className="ml-5">Takeaway</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center"><ClockIcon className="mr-2 text-yellow-500" size={18} /> Order Placed:</p>
                                <p className="ml-5">{formatDate(selectedOrder.orderTime)} at {formatTime(selectedOrder.orderTime)}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center"><ClockIcon className="mr-2 text-green-500" size={18} /> Scheduled Takeaway Time:</p>
                                <p className="ml-5">{formatDate(selectedOrder.deliverTime)} at {formatTime(selectedOrder.deliverTime)}</p>
                            </div>
                            {selectedOrder.specialInstructions && (
                                <div className="col-span-full bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <p className="font-semibold text-gray-600 flex items-center"><InfoCircleIcon className="mr-2 text-gray-500" size={18} /> Special Instructions:</p>
                                    <p className="italic ml-5">{selectedOrder.specialInstructions}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Items:</h4>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            {item.foodType && <p className="text-xs text-gray-500">Food Type: {item.foodType}</p>}
                                        </div>
                                        <span className="font-semibold text-teal-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Payment Summary:</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-base text-gray-700">
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                                </div>
                                {selectedOrder.deliveryFee > 0 && (
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>Delivery Fee:</span>
                                        <span>+ ₹{selectedOrder.deliveryFee?.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedOrder.gstCharges > 0 && (
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>GST Charges:</span>
                                        <span>+ ₹{selectedOrder.gstCharges?.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedOrder.platformFee > 0 && (
                                    <div className="flex justify-between text-base text-gray-700">
                                        <span>Platform Fee:</span>
                                        <span>+ ₹{selectedOrder.platformFee?.toFixed(2)}</span>
                                    </div>
                                )}
                                {Array.isArray(selectedOrder?.totalOtherCharges) && selectedOrder.totalOtherCharges.length > 0 && (
                                <div>
                                    {selectedOrder.totalOtherCharges.map((charge, idx) => (
                                        <div key={idx} className="flex justify-between text-base text-gray-700">
                                            <span>{charge.name}:</span>
                                            <span>+ ₹{charge.amount?charge.amount?.toFixed(2):charge.value?.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                )}
                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-base text-red-600 font-medium">
                                        <span>Discount:</span>
                                        <span>- ₹{selectedOrder.discount?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-extrabold text-xl text-gray-900 mt-4 border-t pt-3">
                                    <span>Total Paid:</span>
                                    <span className="text-teal-600">₹{selectedOrder.totalPrice?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {selectedOrder.subStatus && selectedOrder.subStatus.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Timeline:</h4>
                                <ol className="relative border-l border-gray-200 ml-4">
                                    {selectedOrder.subStatus
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((statusEntry, idx) => (
                                            <li key={idx} className="mb-4 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    {statusEntry.statue === "delivered" ? (
                                                        <CheckIcon className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <ClockIcon className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </span>
                                                <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                                                    {statusEntry.statue}
                                                    {idx === selectedOrder.subStatus.length - 1 && (
                                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
                                                    )}
                                                </h3>
                                                <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                                                    On {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
                                                </time>
                                                {selectedOrder.status === "user_cancel" && selectedOrder.cancellationReason && (
                                                <div>
                                                    <p className="text-sm text-gray-600 mt-1 pl-2 border-l-2 border-red-400 italic">
                                                        Reason: {selectedOrder.cancellationReason}
                                                    </p>
                                                    <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                                                    On {formatDate(selectedOrder.cancelledAt)}
                                                    </time>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                </ol>
                            </div>
                        )}
                        {selectedOrder.status !== 'preparing' &&
                        selectedOrder.status !== 'ready' &&
                         selectedOrder.status !== 'rejected' &&
                         selectedOrder.status !== 'user_cancel' && (
                            <div className="mt-6 border-t pt-4 text-center">
                                <button
                                    onClick={openCancelModal}
                                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </CustomModal>
            <CustomModal
                isOpen={isCancelModalOpen}
                onClose={closeCancelModal}
            >
                <div className="p-6 bg-white rounded-lg relative">
                    <button
                        onClick={closeCancelModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                    >
                        <CloseCircleOutlineIcon size={32} />
                    </button>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">
                        Cancel Order #{selectedOrder?._id.slice(-6)}
                    </h2>
                    <p className="text-gray-700 mb-4">Please provide a reason for cancelling this order:</p>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4 resize-y"
                        rows="4"
                        placeholder="e.g., Change of plans, moving, received wrong order, etc."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeCancelModal}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handleCancelOrderSubmit}
                            disabled={!cancelReason.trim() || cancellingOrderId === selectedOrder?._id}
                            className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200
                                ${!cancelReason.trim() || cancellingOrderId === selectedOrder?._id
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                        >
                            {cancellingOrderId === selectedOrder?._id ? 'Cancelling...' : 'Submit Cancellation'}
                        </button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};

export default TakeawayOrders;