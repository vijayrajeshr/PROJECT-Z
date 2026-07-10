import React from "react";

const PricingComponent = ({
  isEditMode,
  pricing,
  taxes,
  charges,
  onChange,
}) => {
  const taxOptions = ["No Tax", "5% GST", "12% GST", "18% GST"];
  const chargeOptions = ["No Charge", "Packaging Fee", "Service Charge"];

  return (
    <div className="mb-4 flex justify-center items-center ">
      <div className=" gap-4">
        {/* Pricing Field */}
        <div>
          <label className="flex justify-center text-sm mb-1">Pricing</label>
          {isEditMode ? (
            <input
              type="number"
              value={pricing}
              onChange={(e) => onChange("pricing", e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />
          ) : (
            <div className="bg-gray-100 px-3 py-2 rounded-md">
              {"$" + pricing || "N/A"}
            </div>
          )}
        </div>

        {/* Taxes Dropdown */}
        {/* <div>
          <label className="block text-sm mb-1">Taxes</label>
          {isEditMode ? (
            <select
              value={taxes}
              onChange={(e) => onChange("taxes", e.target.value)}
              className="w-full border px-3 py-2 rounded-md transition-all duration-300"
            >
              {taxOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-gray-100 px-3 py-2 rounded-md">
              {taxes || "N/A"}
            </div>
          )}
        </div> */}

        {/* Charges Dropdown */}
        {/* <div>
          <label className="block text-sm mb-1">Charges</label>
          {isEditMode ? (
            <select
              value={charges}
              onChange={(e) => onChange("charges", e.target.value)}
              className="w-full border px-3 py-2 rounded-md transition-all duration-300"
            >
              {chargeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-gray-100 px-3 py-2 rounded-md">
              {charges || "N/A"}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PricingComponent;
