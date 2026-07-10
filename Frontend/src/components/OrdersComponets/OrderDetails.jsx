import React from "react";
import { useState, useEffect } from "react";
import { FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import moment from "moment";
import BillingDetails from "./BillingDetails";

export default function OrderDetails({ order, onStatusChange }) {
    const [ShowDeliveryDetails, setShowDeliveryDetails] = useState(false);
    const [ShowBillingDetails, setShowBillingDetails] = useState(false);
    const [remainingDays, setremainingDays] = useState(null);

    if (!order) return <div className="text-gray-500">Select an order to view details.</div>;

    const toggleDeliveryDetails = () => {
        setShowDeliveryDetails(!ShowDeliveryDetails);
    }

    const toggleBilingDetails = () => {
        setShowBillingDetails(!ShowBillingDetails);
    }

    const today = moment().startOf("day").local();
    useEffect(() => {
        if (!order?.flexiblePlan) return;

        if (order.flexiblePlan.type === "normal") {
            const startDate = moment(order.startDate).local();
            const referenceDate = moment.max(today, startDate);

            const endDate = moment(order.startDate).local().add(parseInt(order.flexiblePlan.plan, 10), "days");
            if (moment(referenceDate).isAfter(endDate)) return setremainingDays(0);
            setremainingDays(endDate.diff(referenceDate, "days"));
        }
        else if (order.flexiblePlan.type === "date-range") {
            const startDate = moment(order.flexiblePlan.startDate).local();
            const referenceDate = moment.max(today, startDate);

            const endDate = moment(order.flexiblePlan.endDate).local();
            if (moment(referenceDate).isAfter(endDate)) return setremainingDays(0);
            setremainingDays(endDate.diff(referenceDate, "days"));
        }
        else {
            if (!Array.isArray(order.flexiblePlan.flexiDates) || order.flexiblePlan.flexiDates.length === 0) {
                console.log("No flexiDates found.");
                return;
            }
            const startDate = moment(order.startDate).local();
            const referenceDate = moment.max(today, startDate);

            // Count delivery days that are after the reference date
            const remainingDeliveries = order.flexiblePlan.flexiDates.filter(date => moment(date).isAfter(referenceDate)).length;

            console.log(`Remaining deliveries: ${remainingDeliveries}`);
            setremainingDays(remainingDeliveries);

        }
    }, [order]);


    return (
        <div className="bg-white shadow-md rounded-md px-2 w-full overflow-hidden max-h-screen overflow-y-auto">
            {!ShowDeliveryDetails && !ShowBillingDetails &&
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Order Details</h2>
                        <div className="flex justify-between gap-4 items-center">
                            <div className="py-2 flex items-center gap-2">
                                {order.status === "New Order" && (
                                    <span className="text-yellow-500  px-2 py-1">
                                        New Order
                                    </span>
                                )}
                                {order.status === "Processing" && (
                                    <span className="text-blue-500  px-2 py-1">
                                        Processing
                                    </span>
                                )}
                                {order.status === "Rejected" && (
                                    <span className="text-red-500  px-2 py-1">
                                        Rejected
                                    </span>
                                )}
                                {order.status === "Plan Completed" && (
                                    <span className="text-green-500 px-2 py-1">
                                        Plan Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            <img
                                src={order.avatar}
                                alt={order.customer}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">{order.customer}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                                <FiPhone className="mr-2" />
                                ({order.phone.countryCode}) {order.phone.number}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <FiMapPin className="mr-2" />
                                {order.address}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <span>Id:</span>
                                <span className="">{order._id}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="my-2" />

                    <div className="mb-1">
                        <h4 className="text-sm font-semibold mb-1">Special Instructions</h4>
                        <p className="text-sm text-gray-500">{order.specialInstructions}</p>
                    </div>

                    <hr className="my-2" />

                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                            <h4 className="font-semibold">Meal Type</h4>
                            <p className="text-gray-500">{order.mealType}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Quantity</h4>
                            <p className="text-gray-500">{order.quantity}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">Placed Time</span>
                            <span className="text-sm text-gray-500">
                                {new Date(order.time).toLocaleString("en-GB", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                }).replace(",", "")}
                            </span>
                        </div>
                    </div>

                    <hr className="my-2" />
                    <div className="flex justify-between items-center w-full">
                        <div className="w-full">
                            <h4 className="text-sm font-semibold mb-1">Plan</h4>
                            {
                                order.flexiblePlan && order.flexiblePlan.type === "date-range" ? (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiCalendar className="mr-2" />
                                        {order.flexiblePlan.startDate
                                            ? new Date(order.flexiblePlan.startDate).toLocaleDateString("en-GB")
                                            : "N/A"}{" "}
                                        -{" "}
                                        {order.flexiblePlan.endDate
                                            ? new Date(order.flexiblePlan.endDate).toLocaleDateString("en-GB")
                                            : "N/A"}
                                    </div>
                                ) : order.flexiblePlan && order.flexiblePlan.type === "normal" ? (
                                    <span className="text-sm text-gray-500">{order.flexiblePlan.plan} Days  (Start Date:{new Date(order.startDate).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }).replace(",", "")})</span>
                                ) : order.flexiblePlan && Array.isArray(order.flexiblePlan.flexiDates) ? (
                                    <div className="flex flex-wrap gap-1">
                                        {order.flexiblePlan.flexiDates.map((date, index) => (
                                            <span
                                                key={index}
                                                className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                            >
                                                {date ? new Date(date).toLocaleDateString("en-GB") : "Invalid Date"}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No plan available</p>
                                )
                            }

                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-between gap-4 items-center mt-3">
                            <h4 className="text-sm font-semibold mb-2">Order Progress</h4>

                        </div>
                        <div>
                            <ProgressBar order={order} />
                        </div>
                    </div>
                </div>
            }
            {!ShowDeliveryDetails && !ShowBillingDetails &&
                <div className={`flex justify-between items-center my-2 mt-3 mb-3`}>
                    <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm flex items-center">Show Billing Details</button>
                    <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm flex items-center">{remainingDays} days left</button>
                </div>
            }
            {ShowDeliveryDetails && !ShowBillingDetails &&
                < div >
                    <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
                        <h2 className="text-lg font-semibold">Delivery Details</h2>
                        <button onClick={toggleDeliveryDetails} className="text-blue-600 rounded-md text-sm">{ShowDeliveryDetails ? "Show Order Details" : "Show Delivery Details"}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pb-2">
                        {Array.isArray(order.subStatus) ? (
                            order.subStatus.map((status) => (
                                <div key={status._id} className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {new Date(status.date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}:
                                    </span>
                                    <span className={`text-xs ${status.status == "Not Delivered" ? "text-red-500" : "text-green-500"}`}>
                                        {status.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No flexible plan available</p>
                        )

                        }
                    </div>
                </div>
            }
            {!ShowDeliveryDetails && ShowBillingDetails &&
                <div>
                    <div className={`flex justify-between items-center my-1 mb-2 pt-1`}>
                        <h2 className="text-lg font-semibold">Billing Details</h2>
                        <button onClick={toggleBilingDetails} className="text-blue-600 rounded-md text-sm">{ShowDeliveryDetails ? "Show Billing Details" : "Show Order Details"}</button>
                    </div>
                    <BillingDetails order={order} />
                    
                </div>
            }
        </div >
    );
}
