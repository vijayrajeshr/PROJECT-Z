import React from "react";
import {
  MdOutlineDeliveryDining,
  MdOutlineDining,
  MdOutlineDinnerDining,
} from "react-icons/md";
import { TbPackage } from "react-icons/tb";

const ServiceTypeComponent = ({ serviceTypes }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm mb-1">Service Type</label>
      <div className="flex gap-4 items-center">
        {/* Delivery */}
        {serviceTypes.includes("Delivery") && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <MdOutlineDeliveryDining size={20} className="text-blue-500" />
            <span className="text-blue-500 text-sm">Delivery</span>
          </div>
        )}
        {serviceTypes.includes("Dine-in") && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            {/* <MdOutlineDeliveryDining size={20} className="text-blue-500" /> */}
            <MdOutlineDining size={20} className="text-blue-500" />
            <span className="text-blue-500 text-sm">Dine-in</span>
          </div>
        )}

        {/* Takeaway */}
        {serviceTypes.includes("Takeaway") && (
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-md border border-yellow-200">
            <TbPackage size={20} className="text-yellow-500" />
            <span className="text-yellow-500 text-sm">Takeaway</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default ServiceTypeComponent;
