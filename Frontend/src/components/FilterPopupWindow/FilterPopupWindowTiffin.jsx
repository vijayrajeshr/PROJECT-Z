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

const FilterPopupWindowTiffin = ({
  isOpen,
  setIsOpen,
  handleChange,
  filters,
  onApplyFilters,
  sortMapping,
}) => {
  const sorts = [
    { id: "popularity", label: "Popularity", value: "Popularity" },
    {
      id: "ratingHighToLow",
      label: "Rating: High to Low",
      value: "ratingHighToLow",
    },
    { id: "costLowToHigh", label: "Cost: Low to High", value: "costLowToHigh" },
    { id: "costHighToLow", label: "Cost: High to Low", value: "costHighToLow" },
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
    { id: "veg", label: "Veg", value: "veg" },
    { id: "nonveg", label: "Nonveg", value: "nonveg" },
  ];

  const filterTabs = [
    { label: "Sort by", value: "sort" },
    { label: "Rating", value: "rating" },
    { label: "Cost for two", value: "costForTwo" },
    { label: "More filters", value: "moreFilters" },
  ];

  const [cuisineSearch, setCuisineSearch] = useState("");
  const [activeTab, setActiveTab] = useState("sort");
  const [localFilters, setLocalFilters] = useState(filters);

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
      minRating: "",
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
      sortBy: value,
      order: value === "costLowToHigh" ? "asc" : "desc",
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
    setLocalFilters((prev) => ({
      ...prev,
      category: checked ? value : "",
    }));
  };

  const handleClearAll = () => {
    const clearedFilters = {
      sortBy: "",
      cuisines: "",
      minRating: "",
      maxRating: "",
      priceRange: "",
      feature: "",
      others: "",
      category: "",
      Alcohol: false,
      openNow: false,
      offers: false,
    };

    setLocalFilters(clearedFilters);

    handleChange({ target: { name: "sortBy", value: "", type: "text" } });
    handleChange({ target: { name: "cuisines", value: "", type: "text" } });
    handleChange({ target: { name: "category", value: "", type: "text" } });
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
                  checked={localFilters.sortBy === item.value}
                  onChange={handleSortChange}
                  className="accent-blue-500"
                />
                <span
                  className={
                    localFilters.sortBy === item.value
                      ? "text-blue-500 font-semibold"
                      : ""
                  }
                >
                  {item.label}
                </span>
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
                    className="accent-blue-500"
                  />
                  <span
                    className={
                      localFilters.cuisines &&
                      localFilters.cuisines.split(",").includes(c.value)
                        ? "text-blue-500 font-semibold"
                        : ""
                    }
                  >
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      case "rating":
        const ratingValue = parseFloat(localFilters.maxRating) || 0;
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
              className="w-full accent-blue-500"
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
              className="w-full accent-blue-500"
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
                  checked={localFilters.category === m.value}
                  onChange={handleMoreFiltersChange}
                  className="accent-blue-500"
                />
                <span
                  className={
                    localFilters.category === m.value
                      ? "text-blue-500 font-semibold"
                      : ""
                  }
                >
                  {m.label}
                </span>
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
                className={`${css.tab} ${
                  activeTab === tab.value ? css.active : ""
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

export default FilterPopupWindowTiffin;
