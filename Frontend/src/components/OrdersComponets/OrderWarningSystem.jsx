import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
// import moment from 'moment';

const OrderWarningSystem = ({ orders, onOrderSelect }) => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAlertopen, setisAlertopen] = useState(true);
    // const today = moment().local().startOf('day');
    useEffect(() => {
        // Filter orders that are between 12 and 24 hours old and still in "New Order" status
        const currentTime = new Date();
        const filteredOrders = orders.filter(order => {
            const orderTime = new Date(order.time);
            const hoursDifference = (currentTime - orderTime) / (1000 * 60 * 60);
            return order.status === "New Order" && hoursDifference >= 12 && hoursDifference <= 72;
        });

        setPendingOrders(filteredOrders);
    }, [orders]);

    const closeAlert = () => {
        setIsDropdownOpen(false);
        setisAlertopen(!isAlertopen);
    }

    // console.log("pending orders", pendingOrders)

    if (pendingOrders.length === 0) return null;

    return (
        <div className={`relative ${isAlertopen ? "mb-4" : "mb-0"}`}>
            {isAlertopen &&
                <div className='flex items-center gap-1'>
                    <div
                        className="bg-yellow-50 rounded-sm px-1 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors flex gap-1 items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <FiAlertCircle className="h-3 w-3 text-yellow-600" />
                        <p className="text-yellow-800 text-xs">

                            {pendingOrders.length} orders need urgent attention! Pending for over 12 hours, auto-rejects 2 days after the start date of plan.
                        </p>

                    </div>
                    <MdOutlineCancel onClick={closeAlert} size={14} className='text-red-600 cursor-pointer' />
                </div>
            }
            {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="max-h-64 overflow-y-auto">
                        {pendingOrders.map(order => {
                            const orderTime = new Date(order.time);
                            const days = Math.round((new Date() - orderTime) / (1000 * 60 * 60 * 24));
                            const hours = Math.round((new Date() - orderTime) / (1000 * 60 * 60));

                            return (
                                <div
                                    key={order._id}
                                    className="p-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => {
                                        onOrderSelect(order);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{order.customer}</span>
                                            <span className="text-sm text-gray-600 ml-2">({order.mealType})</span>
                                        </div>
                                        <span className="text-sm text-yellow-600">Pending for {days} day / {hours} hours</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Total: {order.total} • Distance: {order.distance}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderWarningSystem;