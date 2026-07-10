import React, { useState, useEffect } from "react";
import css from "./FilterPopupWindow.module.css";
import { MdClose } from "react-icons/md";

const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];

const displayRating = (val) => (val === 0 ? "Any" : val.toFixed(1));
const displayCost = (val) => {
  if (val <= 60) return "CAN$60 or less";
  if (val >= 150) return "CAN$150+";
  return `CAN$${val}`;
};

const FilterPopupWindow = ({
  isOpen,
  setIsOpen,
  handleChange,
  filters,
  onApplyFilters,
  sortMapping,
}) => {
  const sorts = [
    { id: "popularity", label: "Popularity", value: "popularity" },
    {
      id: "ratingHighToLow",
      label: "Rating: High to Low",
      value: "ratingHighToLow",
    },
    { id: "costLowToHigh", label: "Cost: Low to High", value: "costLowToHigh" },
    { id: "costHighToLow", label: "Cost: High to Low", value: "costHighToLow" },
    { id: "deliveryTime", label: "Distance", value: "deliveryTime" },
  ];

  const allCuisines = [
    { id: "american", label: "American", value: "American" },
    { id: "mexican", label: "Mexican", value: "Mexican" },
    { id: "italian", label: "Italian", value: "Italian" },
    { id: "chinese", label: "Chinese", value: "Chinese" },
    { id: "japanese", label: "Japanese", value: "Japanese" },
    { id: "thai", label: "Thai", value: "Thai" },
    { id: "korean", label: "Korean", value: "Korean" },
    { id: "vietnamese", label: "Vietnamese", value: "Vietnamese" },
    { id: "indian", label: "Indian", value: "Indian" },
    { id: "mediterranean", label: "Mediterranean", value: "Mediterranean" },
    { id: "seafood", label: "Seafood", value: "Seafood" },
    { id: "fusion", label: "Global Fusion", value: "Fusion" },
    { id: "desserts", label: "Desserts & Snacks", value: "Desserts" },
    { id: "chains", label: "Popular Chains", value: "Chains" },
  ];

  const moreFilters = [
    {
      id: "wheelchairAccessible",
      label: "Wheelchair accessible",
      value: "Wheelchair accessible",
    },
    {
      id: "creditCard",
      label: "Credit cards accepted",
      value: "Сredit cards accepted",
    },
    {
      id: "dish",
      label: "paneer",
      value: "paneer",
    },
    {
      id: "parking",
      label: "Parking",
      value: "Parking",
    },
    { id: "buffet", label: "Buffet", value: "Buffet" },
    { id: "happyHours", label: "Happy Hour", value: "Happy Hour" },
    { id: "servesAlcohol", label: "Serves Alcohol", value: "Serves Alcohol" },
    { id: "sundayBrunch", label: "Sunday Brunch", value: "Sunday Brunch" },
    {
      id: "dessertsAndBakes",
      label: "Desserts and Bakes",
      value: "Desserts and Bakes",
    },
    { id: "luxuryDining", label: "Luxury Dining", value: "Luxury Dining" },
    { id: "cafes", label: "Cafe", value: "Cafe" },
    { id: "fineDining", label: "Fine Dining", value: "Fine Dining" },
    { id: "wifi", label: "Wi-Fi", value: "Wi-Fi" },
    {
      id: "outdoorSeating",
      label: "Outdoor seating",
      value: "Outdoor seating",
    },
    { id: "onlineBookings", label: "Booking", value: "Booking" },
    { id: "hygieneRated", label: "Hygiene Rated", value: "Hygiene Rated" },
    { id: "pubsAndBars", label: "Full Bar", value: "Full Bar" },
    { id: "liveMusic", label: "Live Music", value: "Live Music" },
    { id: "petFriendly", label: "Pet Friendly", value: "Pet Friendly" },
    { id: "takeaway", label: "Takeaway", value: "Takeaway" },
    { id: "delivery", label: "Delivery", value: "Delivery" },
    { id: "tv", label: "TV", value: "TV" },
  ];

  const filterTabs = [
    { label: "Sort by", value: "sort" },
    { label: "Cuisines", value: "cuisines" },
    { label: "Rating", value: "rating" },
    { label: "Cost for two", value: "costForTwo" },
    { label: "More filters", value: "moreFilters" },
  ];

  const [cuisineSearch, setCuisineSearch] = useState("");
  const [activeTab, setActiveTab] = useState("sort");
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync localFilters with parent filters when popup opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const filteredCuisines = allCuisines.filter((c) =>
    c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

  const handleRatingChange = (e) => {
    const stepIndex = parseInt(e.target.value, 10);
    const rating = ratingSteps[stepIndex];
    setLocalFilters((prev) => ({
      ...prev,
      minRating: rating > 0 ? rating.toString() : "",
      maxRating: rating > 0 ? rating.toString() : "",
    }));
  };

  const handleCostChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: `${val}`,
    }));
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: sortMapping[value] || value,
    }));
  };

  const handleCuisineChange = (e) => {
    const { value, checked } = e.target;
    const currentCuisines = localFilters.cuisines
      ? localFilters.cuisines.split(",")
      : [];
    const newCuisines = checked
      ? [...currentCuisines, value]
      : currentCuisines.filter((c) => c !== value);
    setLocalFilters((prev) => ({
      ...prev,
      cuisines: newCuisines.join(","),
    }));
  };

  const handleMoreFiltersChange = (e) => {
    const { value, checked } = e.target;
    setLocalFilters((prev) => {
      if (value === "Serves Alcohol") {
        return { ...prev, Alcohol: checked };
      } else if (value === "openNow") {
        return { ...prev, openNow: checked };
      } else if (
        [
          "Wi-Fi",
          "Outdoor seating",
          "Takeaway",
          "Delivery",
          "Booking",
          "TV",
          "Wheelchair accessible",
          "Сredit cards accepted",
          "Parking",
        ].includes(value)
      ) {
        const currentFeatures = prev.feature ? prev.feature.split(",") : [];
        const newFeatures = checked
          ? [...currentFeatures, value]
          : currentFeatures.filter((f) => f !== value);
        return { ...prev, feature: newFeatures.join(",") };
      } else {
        const currentOthers = prev.others ? prev.others.split(",") : [];
        const newOthers = checked
          ? [...currentOthers, value]
          : currentOthers.filter((o) => o !== value);
        return { ...prev, others: newOthers.join(",") };
      }
    });
  };

  const handleClearAll = () => {
    // Define the cleared state
    const clearedFilters = {
      sortBy: "",
      cuisines: "",
      minRating: "",
      dish: "",
      maxRating: "",
      priceRange: "",
      feature: "",
      others: "",
      Alcohol: false,
      openNow: false,
      offers: false,
    };

    // Update local state
    setLocalFilters(clearedFilters);

    // Trigger handleChange for each filter to update parent state
    handleChange({ target: { name: "sortBy", value: "", type: "text" } });
    handleChange({ target: { name: "cuisines", value: "", type: "text" } });
    handleChange({ target: { name: "dish", value: "", type: "text" } });
    handleChange({ target: { name: "minRating", value: "", type: "text" } });
    handleChange({ target: { name: "maxRating", value: "", type: "text" } });
    handleChange({ target: { name: "priceRange", value: "", type: "text" } });
    handleChange({ target: { name: "feature", value: "", type: "text" } });
    handleChange({ target: { name: "others", value: "", type: "text" } });
    handleChange({
      target: {
        name: "Alcohol",
        value: "false",
        type: "checkbox",
        checked: false,
      },
    });
    handleChange({
      target: {
        name: "openNow",
        value: "false",
        type: "checkbox",
        checked: false,
      },
    });
    handleChange({
      target: {
        name: "offers",
        value: "false",
        type: "checkbox",
        checked: false,
      },
    });

    // Clear search input
    setCuisineSearch("");
  };

  const handleApply = () => {
    Object.entries(localFilters).forEach(([name, value]) => {
      handleChange({
        target: {
          name,
          value: typeof value === "boolean" ? value : value || "",
          type: typeof value === "boolean" ? "checkbox" : "text",
          checked: typeof value === "boolean" ? value : undefined,
        },
      });
    });
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sort":
        return (
          <div className={css.optionsContainer}>
            {sorts.map((item) => (
              <label key={item.id} className={css.option}>
                <input
                  type="radio"
                  name="sortBy"
                  value={item.value}
                  checked={
                    localFilters.sortBy ===
                    (sortMapping[item.value] || item.value)
                  }
                  onChange={handleSortChange}
                />
                {item.label}
              </label>
            ))}
          </div>
        );
      case "cuisines":
        return (
          <div className={css.optionsContainer}>
            <input
              type="text"
              placeholder="Search here"
              className={css.searchBar}
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
            />
            <div className={css.cuisineList}>
              {filteredCuisines.map((c) => (
                <label key={c.id} className={css.option}>
                  <input
                    type="checkbox"
                    value={c.value}
                    checked={
                      localFilters.cuisines &&
                      localFilters.cuisines.split(",").includes(c.value)
                    }
                    onChange={handleCuisineChange}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
        );
      case "rating":
        const ratingValue = parseFloat(localFilters.minRating) || 0;
        return (
          <div className={css.sliderContainer}>
            <div className={css.sliderLabel}>
              Rating: {displayRating(ratingValue)}
            </div>
            <input
              type="range"
              min="0"
              max={ratingSteps.length - 1}
              step="1"
              value={
                ratingSteps.indexOf(ratingValue) === -1
                  ? 0
                  : ratingSteps.indexOf(ratingValue)
              }
              onChange={handleRatingChange}
            />
            <div className={css.sliderMarks}>
              {ratingSteps.map((val) => (
                <span key={val}>{displayRating(val)}</span>
              ))}
            </div>
          </div>
        );
      case "costForTwo":
        const costValue = parseInt(localFilters.priceRange, 10) || 60;
        return (
          <div className={css.sliderContainer}>
            <div className={css.sliderLabel}>
              Cost for two: {displayCost(costValue)}
            </div>
            <input
              type="range"
              min="60"
              max="150"
              step="10"
              value={costValue}
              onChange={handleCostChange}
            />
            <div className={css.sliderMarks}>
              <span>CAN$60</span>
              <span>CAN$150</span>
            </div>
          </div>
        );
      case "moreFilters":
        return (
          <div className={css.optionsContainer}>
            {moreFilters.map((m) => (
              <label key={m.id} className={css.option}>
                <input
                  type="checkbox"
                  value={m.value}
                  checked={
                    m.value === "Serves Alcohol"
                      ? localFilters.Alcohol
                      : m.value === "openNow"
                        ? localFilters.openNow
                        : (localFilters.feature &&
                          localFilters.feature.split(",").includes(m.value)) ||
                        (localFilters.others &&
                          localFilters.others.split(",").includes(m.value))
                  }
                  onChange={handleMoreFiltersChange}
                />
                {m.label}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return isOpen ? (
    <div className={css.filterWindow}>
      <div className={css.filterBoxWrapper}>
        <div className={css.header}>
          <h2>Filters</h2>
          <MdClose onClick={() => setIsOpen(false)} className={css.closeBtn} />
        </div>

        <div className={css.container}>
          <ul className={css.sidebar}>
            {filterTabs.map((tab) => (
              <li
                key={tab.value}
                className={`${css.tab} ${activeTab === tab.value ? css.active : ""
                  }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
          <div className={css.main}>{renderTabContent()}</div>
        </div>

        <div className={css.footer}>
          <button className={css.clearBtn} onClick={handleClearAll}>
            Clear all
          </button>
          <button className={css.applyBtn} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default FilterPopupWindow;
