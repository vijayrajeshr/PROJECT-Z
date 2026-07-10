import React, { useState, useEffect } from "react";
import css from "./Dining.module.css";

const Step1 = ({ formData, handleChange, setFormData, serviceType }) => {
  // Local states for referral popup
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [tempReferralEmail, setTempReferralEmail] = useState("");
  const [city, setCity] = useState("");

  // Check if the service is Tiffin
  const isTiffin = serviceType === "tiffin";

  // Handle adding a new cuisine or meal
  const handleAddCuisine = () => {
    const newItem = formData.newCuisine.trim();
    if (newItem) {
      setFormData({
        ...formData,
        cuisines: [...formData.cuisines, newItem],
        newCuisine: "",
      });
    }
  };

  // Remove cuisine or meal by index
  const handleRemoveCuisine = (index) => {
    const updated = [...formData.cuisines];
    updated.splice(index, 1);
    setFormData({ ...formData, cuisines: updated });
  };

  // Whenever 'referred' is toggled, show/hide the modal accordingly
  useEffect(() => {
    if (formData.referred) {
      // If checked, open modal with current referralEmail (if any)
      setTempReferralEmail(formData.referralEmail || "");
      setShowReferralModal(true);
    } else {
      // If unchecked, close modal and clear referral email
      setShowReferralModal(false);
      setTempReferralEmail("");
      setFormData((prev) => ({ ...prev, referralEmail: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.referred]);

  // Click on "Okay" in the popup
  const handleOkReferral = () => {
    // Basic validation: ensure "@" is present
    if (tempReferralEmail.trim() && !tempReferralEmail.includes("@")) {
      alert('Please enter a valid email address containing "@"');
      return;
    }
    setFormData((prev) => ({ ...prev, referralEmail: tempReferralEmail }));
    setShowReferralModal(false);
  };

  // Click on "Clear" link in the popup
  const handleClearReferral = () => {
    setTempReferralEmail("");
  };

  // For Restaurant service: Use browser's Geolocation API and Nominatim API for reverse geocoding
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Update coordinates in formData
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          // Use Nominatim API for reverse geocoding
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          fetch(url, {
            headers: {
              "User-Agent": "YourAppName/1.0 (your.email@example.com)", // Replace with your own details
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.display_name) {
                setFormData((prev) => ({
                  ...prev,
                  location: data.display_name,
                }));
              } else {
                alert("Unable to determine your address from the location.");
              }
            })
            .catch((error) => {
              console.error("Error fetching address:", error);
              alert("Error retrieving location details.");
            });
        },
        (error) => {
          console.error("Error retrieving location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // For Tiffin service: Add city to deliverable cities
  const handleAddCity = () => {
    if (city.trim()) {
      setFormData({
        ...formData,
        cities: [...(formData.cities || []), city.trim()],
      });
      setCity("");
    }
  };

  // For Tiffin service: Remove city from deliverable cities
  const handleRemoveCity = (index) => {
    const updatedCities = [...(formData.cities || [])];
    updatedCities.splice(index, 1);
    setFormData({ ...formData, cities: updatedCities });
  };

  // Toggle meal day selection
  const handleMealDayToggle = (day) => {
    setFormData((prev) => {
      const currentDays = prev.mealDays || [];
      if (currentDays.includes(day)) {
        return { ...prev, mealDays: currentDays.filter((d) => d !== day) };
      } else {
        return { ...prev, mealDays: [...currentDays, day] };
      }
    });
  };

  // Toggle flexible order dates
  const handleFlexibleOrderToggle = () => {
    setFormData((prev) => ({
      ...prev,
      flexibleOrderDates: !prev.flexibleOrderDates,
    }));
  };

  return (
    <>
      {/* ===== Referral Modal ===== */}
      {showReferralModal && (
        <div className={css.modalOverlay}>
          <div className={css.modalContainer}>
            <label
              htmlFor="referralEmail"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              Email ID of referrer
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="email"
                id="referralEmail"
                value={tempReferralEmail}
                onChange={(e) => setTempReferralEmail(e.target.value)}
                placeholder="Enter referrer email"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "4px",
                  marginRight: "10px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleClearReferral}
                className={css.clearButton}
                style={{ marginRight: "5px" }}
              >
                Clear
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={handleOkReferral} className={css.okButton}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant/Tiffin Name */}
      <div className={css.formGroup}>
        <label
          htmlFor="restaurantName"
          style={{ marginBottom: "5px", fontSize: "24px", fontWeight: 550 }}
        >
          {isTiffin ? "Tiffin Name" : "Restaurant Name"}
        </label>
        <input
          type="text"
          id="restaurantName"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleChange}
          placeholder={
            isTiffin ? "Enter your tiffin name" : "Enter your restaurant name"
          }
          required
        />
      </div>

      {/* Owner Details */}
      <div className={css.ownerDetailsContainer}>
        <div className={css.formGroup}>
          <h3
            style={{ marginBottom: "5px", fontSize: "24px", fontWeight: 550 }}
          >
            Owner details
          </h3>
          <p
            style={{ color: "#6b6b6b", fontSize: "14px", marginBottom: "20px" }}
          >
            Zomato will use these details for all business communications and
            updates
          </p>
          {/* Full Name & Email side by side */}
          <div className={css.row} style={{ marginBottom: "20px" }}>
            <div className={css.half}>
              <label htmlFor="ownerName">Full name</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>
            <div className={css.half}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>
          </div>
          {/* Owner's Phone Number */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="ownerPhoneNumber">Phone number</label>
            <div className={css.phoneWrapper}>
              <div className={css.flagWrapper}>
                <img
                  src={`https://flagcdn.com/w40/${
                    formData.ownerCountryCode === "+91"
                      ? "in"
                      : formData.ownerCountryCode === "+1"
                      ? "us"
                      : formData.ownerCountryCode === "+44"
                      ? "gb"
                      : "au"
                  }.png`}
                  alt="Country Flag"
                  className={css.flag}
                />
                <select
                  className={css.countrySelect}
                  name="ownerCountryCode"
                  value={formData.ownerCountryCode}
                  onChange={handleChange}
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (Australia)</option>
                </select>
              </div>
              <input
                type="tel"
                id="ownerPhoneNumber"
                name="ownerPhoneNumber"
                value={formData.ownerPhoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
          {/* Checkbox: Get updates via WhatsApp */}
          <div
            className={css.checkboxContainer}
            style={{ marginBottom: "15px" }}
          >
            <input
              type="checkbox"
              id="useNumberViaWhatsApp"
              name="useNumberViaWhatsApp"
              checked={formData.useNumberViaWhatsApp}
              onChange={handleChange}
            />
            <label htmlFor="useNumberViaWhatsApp">
              Get {isTiffin ? "tiffin" : "restaurant"} updates via WhatsApp
            </label>
          </div>
          {/* Primary Contact Section */}
          <div style={{ marginBottom: "10px" }}>
            <h4
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: 550,
              }}
            >
              {isTiffin ? "Tiffin's" : "Restaurant's"} primary contact number
            </h4>
            <p
              style={{
                fontSize: "14px",
                color: "#6b6b6b",
                marginBottom: "5px",
              }}
            >
              Customers, delivery partners and Zomato may call on this number
              for order support
            </p>
          </div>
          {/* Checkbox: Same as owner mobile number */}
          <div
            className={css.checkboxContainer}
            style={{ marginBottom: "20px" }}
          >
            <input
              type="checkbox"
              id="useSamePhoneNumber"
              name="useSamePhoneNumber"
              checked={formData.useSamePhoneNumber}
              onChange={handleChange}
            />
            <label htmlFor="useSamePhoneNumber">
              Same as owner mobile number
            </label>
          </div>
          {/* Conditional Restaurant Phone Number */}
          {!formData.useSamePhoneNumber && (
            <div style={{ marginBottom: "20px" }}>
              <div className={css.phoneWrapper}>
                <div className={css.flagWrapper}>
                  <img
                    src={`https://flagcdn.com/w40/${
                      formData.restaurantCountryCode === "+91"
                        ? "in"
                        : formData.restaurantCountryCode === "+1"
                        ? "us"
                        : formData.restaurantCountryCode === "+44"
                        ? "gb"
                        : "au"
                    }.png`}
                    alt="Country Flag"
                    className={css.flag}
                  />
                  <select
                    className={css.countrySelect}
                    name="restaurantCountryCode"
                    value={formData.restaurantCountryCode}
                    onChange={handleChange}
                  >
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                  </select>
                </div>
                <input
                  type="tel"
                  id="restaurantPhoneNumber"
                  name="restaurantPhoneNumber"
                  value={formData.restaurantPhoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Location or Tiffin Cities Container */}
      <div className={css.restaurantLocationContainer}>
        {/* Restaurant Location or Tiffin Cities */}
        <div className={css.formGroup} style={{ marginBottom: "20px" }}>
          <h3
            style={{ marginBottom: "10px", fontSize: "24px", fontWeight: 550 }}
          >
            {isTiffin
              ? "Cities in which deliveries are available"
              : "Add your restaurant's location for order pick-up"}
          </h3>

          {isTiffin ? (
            // Multi-city selection for Tiffin
            <>
              <div
                className={css.searchBarGroup}
                style={{ marginBottom: "20px", display: "flex", gap: "8px" }}
              >
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter a city name"
                  style={{ flex: 1, padding: "12px", borderRadius: "8px" }}
                />
                <button
                  type="button"
                  onClick={handleAddCity}
                  className={css.addCuisineButton}
                >
                  Add City
                </button>
              </div>
              <div style={{ marginTop: "10px" }}>
                {(formData.cities || []).map((city, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f0f0f0",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(index)}
                      style={{
                        marginLeft: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </>
          ) : (
            // Single location for Restaurant
            <>
              <div
                className={css.searchBarGroup}
                style={{ marginBottom: "20px" }}
              >
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Fetch for area or street name"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Use Current Location Button and Display */}
              <div style={{ marginBottom: "20px" }}>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    backgroundColor: "blue",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  Get current location
                </button>
              </div>
            </>
          )}
        </div>

        {/* Only show address details for Restaurant, not for Tiffin */}
        {!isTiffin && (
          <div className={css.formGroup} style={{ marginBottom: "20px" }}>
            <h3
              style={{ marginBottom: "5px", fontSize: "24px", fontWeight: 550 }}
            >
              Restaurant address details
            </h3>
            <p
              style={{
                color: "#6b6b6b",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              Address details are based on the restaurant location mentioned
              above
            </p>
            {/* Row 1: shopNo1, shopNo2 */}
            <div className={css.row} style={{ marginBottom: "20px" }}>
              <div style={{ flex: 1, marginRight: "10px" }}>
                <label htmlFor="shopNo1">
                  Shop no. / building no. (optional)
                </label>
                <input
                  type="text"
                  id="shopNo1"
                  name="shopNo1"
                  value={formData.shopNo1}
                  onChange={handleChange}
                  placeholder="Shop no. / building no."
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="shopNo2">Floor / tower (optional)</label>
                <input
                  type="text"
                  id="shopNo2"
                  name="shopNo2"
                  value={formData.shopNo2}
                  onChange={handleChange}
                  placeholder="Floor / tower"
                />
              </div>
            </div>
            {/* Row 2: area, city */}
            <div className={css.row} style={{ marginBottom: "20px" }}>
              <div style={{ flex: 1, marginRight: "10px" }}>
                <label htmlFor="area">Area / Sector / Locality*</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area / Sector / Locality"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
            </div>
            {/* Row 3: Landmark */}
            <div className={css.row}>
              <div style={{ flex: 1, marginRight: "10px" }}>
                <label htmlFor="landmark">
                  Add any nearby landmark (optional)
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                />
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
          </div>
        )}
      </div>

      <div className={css.formGroup} style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <label
            htmlFor="latitude"
            style={{
              marginBottom: "5px",
              fontSize: "24px",
              fontWeight: 550,
              display: "block",
            }}
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Enter latitude"
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label
            htmlFor="longitude"
            style={{
              marginBottom: "5px",
              fontSize: "24px",
              fontWeight: 550,
              display: "block",
            }}
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Enter longitude"
            required
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className={css.formGroup}>
        <label
          style={{ marginBottom: "5px", fontSize: "20px", fontWeight: 550 }}
        >
          Choose the category
        </label>
        <div className={css.horizontalGroup}>
          <div className={css.checkboxContainer}>
            <input
              type="checkbox"
              id="categoryVeg"
              name="categoryVeg"
              checked={formData.categoryVeg}
              onChange={handleChange}
            />
            <label htmlFor="categoryVeg" style={{ fontSize: "16px" }}>
              Veg
            </label>
          </div>
          <div className={css.checkboxContainer}>
            <input
              type="checkbox"
              id="categoryNonVeg"
              name="categoryNonVeg"
              checked={formData.categoryNonVeg}
              onChange={handleChange}
            />
            <label htmlFor="categoryNonVeg" style={{ fontSize: "16px" }}>
              Non-veg
            </label>
          </div>
          <div className={css.checkboxContainer}>
            <input
              type="checkbox"
              id="categoryBoth"
              name="categoryBoth"
              checked={formData.categoryBoth}
              onChange={handleChange}
            />
            <label htmlFor="categoryBoth" style={{ fontSize: "16px" }}>
              Both
            </label>
          </div>
        </div>
      </div>

      {/* Only show Services Offered for Restaurant, not for Tiffin */}
      {!isTiffin && (
        <div className={css.formGroup}>
          <label
            style={{ marginBottom: "5px", fontSize: "20px", fontWeight: 550 }}
          >
            Services Offered
          </label>
          <div className={css.horizontalGroup}>
            <div className={css.checkboxContainer}>
              <input
                type="checkbox"
                id="serviceNightLife"
                name="serviceNightLife"
                checked={formData.serviceNightLife}
                onChange={handleChange}
              />
              <label htmlFor="serviceNightLife" style={{ fontSize: "16px" }}>
                Night Life
              </label>
            </div>
            <div className={css.checkboxContainer}>
              <input
                type="checkbox"
                id="serviceDineOut"
                name="serviceDineOut"
                checked={formData.serviceDineOut}
                onChange={handleChange}
              />
              <label htmlFor="serviceDineOut" style={{ fontSize: "16px" }}>
                Dine Out
              </label>
            </div>
            <div className={css.checkboxContainer}>
              <input
                type="checkbox"
                id="serviceDelivery"
                name="serviceDelivery"
                checked={formData.serviceDelivery}
                onChange={handleChange}
              />
              <label htmlFor="serviceDelivery" style={{ fontSize: "16px" }}>
                Delivery
              </label>
            </div>
            <div className={css.checkboxContainer}>
              <input
                type="checkbox"
                id="serviceTiffin"
                name="serviceTiffin"
                checked={formData.serviceTiffin}
                onChange={handleChange}
              />
              <label htmlFor="serviceTiffin" style={{ fontSize: "16px" }}>
                Tiffin
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Add Cuisines for Restaurant or Add Meals for Tiffin */}
      <div className={css.formGroup}>
        <label
          htmlFor="newCuisine"
          style={{ marginBottom: "5px", fontSize: "20px", fontWeight: 550 }}
        >
          {isTiffin ? "Add Meals" : "Add Cuisines"}
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            id="newCuisine"
            name="newCuisine"
            value={formData.newCuisine}
            onChange={handleChange}
            placeholder={isTiffin ? "Enter a meal" : "Enter a cuisine"}
          />
          <button
            type="button"
            onClick={handleAddCuisine}
            className={css.addCuisineButton}
          >
            Add
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          {formData?.cuisines?.map((cuisine, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: "#f0f0f0",
                padding: "5px 10px",
                borderRadius: "20px",
                marginRight: "5px",
                marginBottom: "5px",
              }}
            >
              {cuisine}
              <button
                type="button"
                onClick={() => handleRemoveCuisine(index)}
                style={{
                  marginLeft: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Meal Days section for Tiffin */}
      {isTiffin && (
        <div
          className={css.formGroup}
          style={{
            marginBottom: "20px",
            border: "1px solid #e0e0e0",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 550, margin: 0 }}>
                Meal Days
              </h3>
              <div style={{ marginLeft: "8px", cursor: "pointer" }}>ℹ️</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <div>
              <input
                type="checkbox"
                id="day-sunday"
                checked={formData.mealDays?.includes("Sunday") || false}
                onChange={() => handleMealDayToggle("Sunday")}
              />
              <label htmlFor="day-sunday" style={{ marginLeft: "8px" }}>
                Sunday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-monday"
                checked={formData.mealDays?.includes("Monday") || false}
                onChange={() => handleMealDayToggle("Monday")}
              />
              <label htmlFor="day-monday" style={{ marginLeft: "8px" }}>
                Monday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-tuesday"
                checked={formData.mealDays?.includes("Tuesday") || false}
                onChange={() => handleMealDayToggle("Tuesday")}
              />
              <label htmlFor="day-tuesday" style={{ marginLeft: "8px" }}>
                Tuesday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-wednesday"
                checked={formData.mealDays?.includes("Wednesday") || false}
                onChange={() => handleMealDayToggle("Wednesday")}
              />
              <label htmlFor="day-wednesday" style={{ marginLeft: "8px" }}>
                Wednesday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-thursday"
                checked={formData.mealDays?.includes("Thursday") || false}
                onChange={() => handleMealDayToggle("Thursday")}
              />
              <label htmlFor="day-thursday" style={{ marginLeft: "8px" }}>
                Thursday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-friday"
                checked={formData.mealDays?.includes("Friday") || false}
                onChange={() => handleMealDayToggle("Friday")}
              />
              <label htmlFor="day-friday" style={{ marginLeft: "8px" }}>
                Friday
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="day-saturday"
                checked={formData.mealDays?.includes("Saturday") || false}
                onChange={() => handleMealDayToggle("Saturday")}
              />
              <label htmlFor="day-saturday" style={{ marginLeft: "8px" }}>
                Saturday
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "24px",
                  backgroundColor: formData.flexibleOrderDates
                    ? "#ff5a5f"
                    : "#ccc",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={handleFlexibleOrderToggle}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: formData.flexibleOrderDates ? "18px" : "2px",
                    transition: "left 0.2s",
                  }}
                ></div>
              </div>
              <span
                style={{
                  marginLeft: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Flexible Order Dates
                <div style={{ marginLeft: "8px", cursor: "pointer" }}>ℹ️</div>
              </span>
            </div>

            <button
              className={css.saveButton}
              style={{
                backgroundColor: "#ff5a5f",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* "Referred by someone?" Checkbox */}
      <div className={css.formGroup}>
        <div className={css.checkboxContainer}>
          <input
            type="checkbox"
            id="referred"
            name="referred"
            checked={formData.referred}
            onChange={handleChange}
          />
          <label
            htmlFor="referred"
            style={{ fontSize: "15px", fontWeight: 550 }}
          >
            Referred by someone?
          </label>
        </div>
        {formData.referralEmail && (
          <div style={{ marginTop: "10px" }}>
            <p>Referred by : {formData.referralEmail}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Step1;
