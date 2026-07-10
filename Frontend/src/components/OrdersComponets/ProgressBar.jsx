import React from "react";
import moment from "moment";
import { IoIosTimer } from "react-icons/io";

const ProgressBar = ({ order }) => {
    if (!order || !order.subStatus) {
        // Return fallback UI if order or subStatus is undefined
        return <div>Loading...</div>;
    }

    const today = moment().startOf("day");
    const progressSteps = ["New Order", "Processing", "Delivered"];

    if (order.status === "Rejected") {
        progressSteps.pop("Delivered");
        progressSteps.pop("Processing");
        progressSteps.push("Rejected");
    }
    else if (order.status === "Plan Completed") {
        // progressSteps.pop("Delivered")
        progressSteps.push("Plan Over");
    }

    // Find today's subStatus
    const subStatusForToday = order.subStatus.find((sub) =>
        moment(sub.date).isSame(today, "day")
    );

    // console.log("subStatus for today is:", subStatusForToday)

    // // Determine the current step
    let currentStep = 1; // Default to "Processing"

    if (subStatusForToday) {
        if (subStatusForToday.status === "Delivered") {
            currentStep = 3;
        }

        else if (order.status === "Processing" && subStatusForToday.status !== "Delivered") {
            currentStep = 2;
        }
        else if (order.status === "Rejected" || order.status === "Plan Completed" && subStatusForToday.status !== "Delivered") {
            currentStep = 4;
        }
    }
    else if (!subStatusForToday) {
        if (order.status === "Processing" && !subStatusForToday) {
            currentStep = 2
        } else if (order.status === "Rejected" || order.status === "Plan Completed" && !subStatusForToday) {
            currentStep = 4;
        }
    }
    else {
        currentStep = 1;
    }
    // console.log("Current step:", currentStep);
    return (
        <div className="flex items-center gap-0">
            {progressSteps.map((step, index) => (
                <div key={index} className="flex flex-col">
                    {/* Step Indicator */}
                    <div className="flex  items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold 
                            ${currentStep === 4 && order.status === "Rejected" ? "bg-red-500" : currentStep === 4 && order.status === "Plan Completed" ? "bg-green-500" : currentStep === 3 ? "bg-green-500" :
                                    index + 1 < currentStep
                                        ? "bg-green-500" : index + 1 === currentStep
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                }`}
                        >
                            {index + 1}
                            {/* {index == 0 ? <img src="../order.png" alt="" /> : index == 1 ? <img src="../order-processing.png" width={23} alt="" /> : index === 2 ? <img src="../delivered.png" alt="" /> : index === 3 && order.status === "Rejected" ? <img src="../cancel-order.png" width={23} alt="" /> : <img src="../checklist.png" width={23} alt="" />} */}
                        </div>
                        <div className="">

                            {
                                index < progressSteps.length - 1 && (
                                    <div
                                        className={`h-1 w-10 ${currentStep === 4 && order.status === "Rejected" ? "bg-red-500" : currentStep === 4 && order.status === "Plan completed" ? "bg-green-500" : index + 1 < currentStep ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                    ></div>
                                )
                            }
                        </div>
                    </div>
                    <div className="text-[9px] mt-1 text-gray-600 whitespace-nowrap">
                        {step}
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default ProgressBar;
