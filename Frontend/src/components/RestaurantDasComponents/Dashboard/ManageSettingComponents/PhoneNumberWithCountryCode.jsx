import React, { useState, useEffect } from "react";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

const PhoneInput = ({
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  const countryCodes = {
    US: { name: "United States", code: "+1" },
    CA: { name: "Canada", code: "+1" },
    MX: { name: "Mexico", code: "+52" },
    GB: { name: "United Kingdom", code: "+44" },
    DE: { name: "Germany", code: "+49" },
    FR: { name: "France", code: "+33" },
    IT: { name: "Italy", code: "+39" },
    ES: { name: "Spain", code: "+34" },
    NL: { name: "Netherlands", code: "+31" },
    CN: { name: "China", code: "+86" },
    JP: { name: "Japan", code: "+81" },
    IN: { name: "India", code: "+91" },
    KR: { name: "South Korea", code: "+82" },
    SG: { name: "Singapore", code: "+65" },
    MY: { name: "Malaysia", code: "+60" },
    AE: { name: "UAE", code: "+971" },
    IL: { name: "Israel", code: "+972" },
    SA: { name: "Saudi Arabia", code: "+966" },
    AU: { name: "Australia", code: "+61" },
    NZ: { name: "New Zealand", code: "+64" },
    BR: { name: "Brazil", code: "+55" },
    AR: { name: "Argentina", code: "+54" },
    CO: { name: "Colombia", code: "+57" },
    CL: { name: "Chile", code: "+56" },
    JM: { name: "Jamaica", code: "+1876" },
    BS: { name: "Bahamas", code: "+1242" },
    BB: { name: "Barbados", code: "+1246" },
    TT: { name: "Trinidad & Tobago", code: "+1868" },
    ZA: { name: "South Africa", code: "+27" },
    EG: { name: "Egypt", code: "+20" },
    NG: { name: "Nigeria", code: "+234" },
    KE: { name: "Kenya", code: "+254" },
  };

  // Helper function to find country from phone number
  const findCountryFromCode = (countryCode) => {
    if (!countryCode) return "US";
    const code = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
    const entry = Object.entries(countryCodes).find(
      ([_, data]) => data.code === code
    );
    return entry ? entry[0] : "US";
  };

  // Initialize state
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return value?.countryCode ? findCountryFromCode(value.countryCode) : "US";
  });
  const [phoneNumber, setPhoneNumber] = useState(value?.number || "");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync with external value changes
  useEffect(() => {
    if (
      value?.countryCode &&
      value.countryCode !== countryCodes[selectedCountry].code
    ) {
      setSelectedCountry(findCountryFromCode(value.countryCode));
    }
    if (value?.number !== undefined && value.number !== phoneNumber) {
      setPhoneNumber(value.number);
      validatePhoneNumber(value.number);
    }
  }, [value?.countryCode, value?.number]);

  // Validate phone number
  const validatePhoneNumber = (number) => {
    if (!number && required) {
      setIsValid(false);
      setErrorMessage("Phone number is required");
      return false;
    }

    if (!number) {
      setIsValid(true);
      setErrorMessage("");
      return true;
    }

    try {
      const fullNumber = `${countryCodes[selectedCountry].code}${number}`;
      const phoneNumberObj = parsePhoneNumber(fullNumber, selectedCountry);
      const isValid = phoneNumberObj
        ? isValidPhoneNumber(fullNumber, selectedCountry)
        : false;

      setIsValid(isValid);
      setErrorMessage(
        isValid
          ? ""
          : `Please enter a valid ${countryCodes[selectedCountry].name} phone number`
      );

      return isValid;
    } catch (error) {
      setIsValid(false);
      setErrorMessage("Invalid phone number format");
      return false;
    }
  };

  // Handle country selection change
  const handleCountryChange = (e) => {
    if (disabled) return;
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    if (onChange) {
      const fullNumber = phoneNumber
        ? `${countryCodes[newCountry].code}${phoneNumber}`
        : "";
      onChange({
        target: {
          name: "phone",
          value: {
            countryCode: countryCodes[newCountry].code,
            number: phoneNumber,
            fullNumber,
          },
        },
      });
    }

    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  };
  console.log("Selected Country:", value);
  // Handle phone number input change
  const handlePhoneChange = (e) => {
    if (disabled) return;
    // Allow digits, spaces, dashes, and parentheses
    let number = e.target.value.replace(/[^\d\s()-]/g, "").trim();
    setPhoneNumber(number);
    const isValid = validatePhoneNumber(number);

    if (onChange) {
      const fullNumber = number
        ? `${countryCodes[selectedCountry].code}${number}`
        : "";
      onChange({
        target: {
          name: "phone",
          value: {
            countryCode: countryCodes[selectedCountry].code,
            number,
            fullNumber,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-2 w-1/2">
      <label
        htmlFor="phone"
        className="block font-medium text-gray-700 text-sm"
      >
        Phone
      </label>
      <div className="flex gap-2 w-full">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={disabled}
          className={`w-40 py-1 px-2 border rounded-md bg-white text-sm ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {Object.entries(countryCodes).map(
            ([code, { name, code: phoneCode }]) => (
              <option key={code} value={code}>
                {name} ({phoneCode})
              </option>
            )
          )}
        </select>
        <div className="flex-1 w-full">
          <input
            type="tel"
            id="phone"
            value={phoneNumber || value?.number || ""}
            onChange={handlePhoneChange}
            required={required}
            disabled={disabled}
            placeholder="Enter phone number"
            className={`w-full py-1 px-2 border rounded-md ${
              !isValid && phoneNumber ? "border-red-500" : "border-gray-300"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          />
          {!isValid && phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
