import { FaCircle } from "react-icons/fa";
import PhoneInput from "./PhoneNumberWithCountryCode";

export default function TiffinDetails({
  restaurantData,
  ontiffinFormDataChange,
  error,
  isEditMode = true,
}) {
  // Handle input changes for text and email fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    ontiffinFormDataChange({
      ...restaurantData,
      [name]: value,
    });
  };

  // Handle phone number changes
  const handlePhoneChange = (phoneData) => {
    const value = phoneData?.target?.value || {};

    ontiffinFormDataChange({
      ...restaurantData,
      phoneNo: value.number || "",
      fullNumber: value.fullNumber || "",
      countryCode: value.countryCode || "",
    });
  };

  // Handle category selection
  const handleCategoryChange = (value) => {
    ontiffinFormDataChange({
      ...restaurantData,
      category: value === "both" ? ["veg", "non-veg"] : [value],
    });
  };

  // Flatten category for rendering
  const flattenedCategory = Array.isArray(restaurantData?.category)
    ? restaurantData.category.flat()
    : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Restaurant Details
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center gap-2 w-full">
        <div className="w-1/2">
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 text-sm"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={restaurantData?.email || ""}
            onChange={handleInputChange}
            placeholder="Enter your mail"
            required
            disabled={!isEditMode}
            className="w-full py-1 px-2 border rounded-md text-sm"
          />
        </div>
        <PhoneInput
          value={restaurantData.phoneNo}
          onChange={handlePhoneChange}
          required
          disabled={!isEditMode}
        />
      </div>
      <div className="flex w-full gap-2">
        <div className="w-1/2">
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 text-sm"
          >
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={restaurantData?.name || ""}
            onChange={handleInputChange}
            placeholder="Enter your firm name"
            required
            disabled={!isEditMode}
            className="w-full py-1 px-2 border rounded-md"
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="address"
            className="block font-medium text-gray-700 text-sm"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={restaurantData?.address || ""}
            onChange={handleInputChange}
            placeholder="Enter your full address"
            required
            disabled={!isEditMode}
            className="w-full py-1 px-2 border rounded-md"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 text-sm">
          Category
        </label>
        <div className="flex space-x-4">
          {["veg", "non-veg", "both"].map((option) => {
            const isSelected = (() => {
              if (Array.isArray(flattenedCategory)) {
                if (flattenedCategory.length === 2) {
                  return option === "both";
                } else if (flattenedCategory.length === 1) {
                  return flattenedCategory[0] === option;
                }
              }
              return false;
            })();

            return (
              <div
                key={option}
                className={`flex items-center space-x-2 ${
                  isEditMode ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => isEditMode && handleCategoryChange(option)}
              >
                <FaCircle
                  className={isSelected ? "text-blue-600" : "text-gray-400"}
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end"></div>
    </div>
  );
}
