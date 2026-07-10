import { useState, useEffect, useRef, useCallback } from 'react';
//import FilterPopupWindow from '../../../FilterPopupWindow/FilterPopupWindow';
//import FilterBox from '../../../../utils/OrderingUtils/FilterBox/FilterBox';
import { useContextData } from '../../../../context/OutletContext';
// REMOVE: import RestaurantFilterPopup from '../../../../utils/OrderingUtils/RestaurantFilterPopup';
import { createPortal } from 'react-dom';

// RestaurantFilterPopup component (inline)
//import React, { useState, useEffect } from "react";
import css from "../../../../utils/OrderingUtils/FilterBox/FilterBox.module.css";
import { MdClose, MdSearch } from "react-icons/md";

const sortOptions = [
  { id: "popularity", label: "Popularity", value: "popularity" },
  { id: "ratingHighToLow", label: "Rating: High to Low", value: "ratingHighToLow" },
  { id: "costLowToHigh", label: "Cost: Low to High", value: "costLowToHigh" },
  { id: "costHighToLow", label: "Cost: High to Low", value: "costHighToLow" },
  
];
const ratingMin = 0;
const ratingMax = 5;
const ratingStep = 0.5;
const displayRating = (val) => val.toFixed(1);
const costSteps = [60, 80, 100, 125, 150]; // Updated cost steps in CAD
const displayCost = (val) => {
  return `CAN$${val}`; // Display in Canadian Dollars
};
const cityOptions = [
  { id: "delhi", label: "Delhi", value: "Delhi" },
  { id: "mumbai", label: "Mumbai", value: "Mumbai" },
  { id: "bangalore", label: "Bangalore", value: "Bangalore" },
  { id: "hyderabad", label: "Hyderabad", value: "Hyderabad" },
];
const filterTabs = [
  { label: "Sort by", value: "sort" },
  { label: "Rating", value: "rating" },
  { label: "Cost for two", value: "costForTwo" },
  { label: "Cities", value: "city" },
  { label: "More filters", value: "moreFilters" }, // Added More Filters tab
];

// More filters options
const moreFilterOptions = [
  { id: "wheelchair", label: "Wheelchair accessible", value: "wheelchair_accessible" },
  //{ id: "creditCards", label: "Credit cards accepted", value: "credit_cards_accepted" },
  { id: "outdoorSeating", label: "Outdoor seating", value: "outdoor_seating" },
  { id: "liveMusic", label: "Live Music", value: "live_music" },
  { id: "cafe", label: "Cafe", value: "cafe" },
  { id: "wifi", label: "Wi-Fi", value: "wifi" },
  { id: "booking", label: "Booking", value: "booking" },
  { id: "servesAlcohol", label: "Serves Alcohol", value: "serves_alcohol" },

  { id: "petFriendly", label: "Pet Friendly", value: "pet_friendly" },
  { id: "takeaway", label: "Takeaway", value: "takeaway" },
  { id: "paneer", label: "Paneer", value: "paneer" },
  { id: "parking", label: "Parking", value: "parking" },
  //{ id: "buffet", label: "Buffet", value: "buffet" },
  { id: "happyHour", label: "Happy Hour", value: "happy_hour" },
  { id: "sundayBrunch", label: "Sunday Brunch", value: "sunday_brunch" },
  { id: "dessertsAndBakes", label: "Desserts and Bakes", value: "desserts_bakes" },
  //{ id: "luxuryDining", label: "Luxury Dining", value: "luxury_dining" },
  { id: "hygieneRated", label: "Hygiene Rated", value: "hygiene_rated" },
  { id: "Bar Available", label: "Bar Available", value: "full_bar" },
  { id: "delivery", label: "Delivery", value: "delivery" },
  { id: "tv", label: "TV", value: "tv" },
];

// Helper function to extract price for two
const extractPriceForTwo = (price) => {
  if (typeof price === "number") {
    return price * 2;
  }
  if (typeof price === "string") {
    let numbers = price.match(/\d+/g)?.map(Number) || [];
    if (numbers.length === 1) return numbers[0] * 2;
    else if (numbers.length === 2) return ((numbers[0] + numbers[1]) / 2) * 2;
  }
  return null;
};

function RestaurantFilterPopup({ isOpen, setIsOpen, filters, setFilters }) {
  const [activeTab, setActiveTab] = useState("sort");
  const [localFilters, setLocalFilters] = useState(filters);
  const popupRef = useRef(null);
  const [filterSearch, setFilterSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(moreFilterOptions);

  useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  // ESC key close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, setIsOpen]);

  // Click outside close
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, setIsOpen]);

  // Filter more options based on search
  useEffect(() => {
    if (filterSearch.trim() === "") {
      setFilteredOptions(moreFilterOptions);
    } else {
      const filtered = moreFilterOptions.filter(option => 
        option.label.toLowerCase().includes(filterSearch.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [filterSearch]);

  // Handler functions must be defined before renderTabContent
  const handleSortChange = (e) => setLocalFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  const handleRatingChange = (e) => {
    const rating = parseFloat(e.target.value);
    // Use maxRating instead of minRating to implement the <= logic
    setLocalFilters((prev) => ({ ...prev, maxRating: rating > 0 ? rating.toString() : "" }));
  };
  const handleCostChange = (e) => {
    const stepIndex = parseInt(e.target.value, 10);
    const cost = costSteps[stepIndex];
    setLocalFilters((prev) => ({ ...prev, priceRange: cost.toString() }));
  };
  const handleCityChange = (e) => setLocalFilters((prev) => ({ ...prev, city: e.target.value }));
  
  // Handler for more filters
  const handleMoreFilterChange = (e) => {
    const { value, checked } = e.target;
    setLocalFilters((prev) => {
      const currentFilters = prev.moreFilters || [];
      if (checked) {
        return { ...prev, moreFilters: [...currentFilters, value] };
      } else {
        return { ...prev, moreFilters: currentFilters.filter(filter => filter !== value) };
      }
    });
  };
  
  const handleClearAll = () => {
    setLocalFilters({ 
      sortBy: '', 
      minRating: '', 
      maxRating: '', 
      priceRange: costSteps[costSteps.length - 1].toString(), // Set to maximum cost step
      city: '',
      moreFilters: [] // Reset moreFilters to empty array
    });
    setFilterSearch("");
  };
  
  const handleApply = () => { setFilters(localFilters); setIsOpen(false); };

  // Centered modal style
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.25)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'none', // Remove blur effect
  };
  const modalStyle = {
    minWidth: 600, // Increased width to match the red box
    maxWidth: 650, // Increased max width
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    borderRadius: 16,
    background: '#fff',
    border: '1px solid #e5e7eb',
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  };

  // Modern section heading style
  const sectionHeading = {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 16,
    marginTop: 0,
    color: '#222',
    letterSpacing: 0.2,
  };
  // Section container style
  const sectionContainer = {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: '1px solid #f0f0f0',
  };
  // Slider style
  const sliderStyle = {
    width: '100%',
    margin: '18px 0 8px 0',
    accentColor: '#ef4f61',
    height: 6,
    borderRadius: 3,
    background: 'linear-gradient(90deg, #ef4f61 0%, #a259c6 100%)',
  };
  // Option style
  const optionStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };
  const optionHover = {
    background: '#f7f7fa',
  };
  // Radio/checkbox style
  const inputStyle = {
    marginRight: 12,
    accentColor: '#ef4f61',
    width: 18,
    height: 18,
    cursor: 'pointer',
  };
  // Value label style
  const valueLabel = {
    fontWeight: 600,
    color: '#ef4f61',
    marginBottom: 8,
    fontSize: 16,
  };

  // Search input style
  const searchInputStyle = {
    width: '100%',
    padding: '10px 12px 10px 36px',
    borderRadius: 8,
    border: '1px solid #ddd',
    marginBottom: 12,
    fontSize: 14,
    transition: 'all 0.2s ease',
    background: '#f9f9fc',
  };

  // Search icon style
  const searchIconStyle = {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    fontSize: 18,
  };

  // Render content for each tab with headings and modern layout
  const renderTabContent = () => {
    switch (activeTab) {
      case "sort":
        return (
          <div style={sectionContainer}>
            <div style={sectionHeading}>Sort by</div>
            <div className="space-y-1">
              {sortOptions.map((item) => (
                <label
                  key={item.id}
                  style={{ ...optionStyle }}
                  className={`${css.option} hover:bg-blue-50`}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={item.value}
                    checked={localFilters.sortBy === item.value}
                    onChange={handleSortChange}
                    style={inputStyle}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        );
      case "rating": {
        const ratingValue = localFilters.maxRating !== '' ? parseFloat(localFilters.maxRating) : ratingMax;
        return (
          <div style={sectionContainer}>
            <div style={sectionHeading}>Rating</div>
            <div style={valueLabel}>Rating: {displayRating(ratingValue)} or less</div>
            <input
              type="range"
              min={ratingMin}
              max={ratingMax}
              step={ratingStep}
              value={ratingValue}
              onChange={handleRatingChange}
              style={sliderStyle}
              className="focus:outline-none focus:ring focus:ring-blue-200"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginTop: 6 }}>
              {[0,1,2,3,4,5].map((val) => (
                <span key={val}>{val}</span>
              ))}
            </div>
          </div>
        );
      }
      case "costForTwo": {
        const costValue = parseInt(localFilters.priceRange, 10) || costSteps[costSteps.length - 1];
        return (
          <div style={sectionContainer}>
            <div style={sectionHeading}>Cost for Two</div>
            <div style={valueLabel}>Cost for two: {displayCost(costValue)}</div>
            <input
              type="range"
              min="0"
              max={costSteps.length - 1}
              step="1"
              value={costSteps.indexOf(costValue) === -1 ? costSteps.length - 1 : costSteps.indexOf(costValue)}
              onChange={handleCostChange}
              style={sliderStyle}
              className="focus:outline-none focus:ring focus:ring-blue-200"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginTop: 6 }}>
              {costSteps.map((val) => (
                <span key={val}>{displayCost(val)}</span>
              ))}
            </div>
          </div>
        );
      }
      case "city":
        return (
          <div style={sectionContainer}>
            <div style={sectionHeading}>Cities</div>
            <div className="space-y-1">
              {cityOptions.map((item) => (
                <label
                  key={item.id}
                  style={{ ...optionStyle }}
                  className={`${css.option} hover:bg-blue-50`}
                >
                  <input
                    type="radio"
                    name="city"
                    value={item.value}
                    checked={localFilters.city === item.value}
                    onChange={handleCityChange}
                    style={inputStyle}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        );
      case "moreFilters":
        return (
          <div style={{...sectionContainer, maxHeight: '320px', overflowY: 'auto'}}>
            <div style={sectionHeading}>More Filters</div>
            
            {/* Search input for filters */}
            <div className="relative mb-4">
              <MdSearch style={searchIconStyle} />
              <input
                type="text"
                placeholder="Search filters..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                style={searchInputStyle}
                className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
            </div>
            
            {filteredOptions.length > 0 ? (
              <div className="space-y-1">
                {filteredOptions.map((item) => (
                  <label
                    key={item.id}
                    style={{ ...optionStyle }}
                    className={`${css.option} hover:bg-blue-50 ${(localFilters.moreFilters || []).includes(item.value) ? 'bg-blue-50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      name={item.id}
                      value={item.value}
                      checked={(localFilters.moreFilters || []).includes(item.value)}
                      onChange={handleMoreFilterChange}
                      style={inputStyle}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No filters match your search
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  if (!isOpen) return null;
  return createPortal(
    <div style={overlayStyle}>
      <div ref={popupRef} style={modalStyle} className="animate-fadeIn">
        <div style={{padding: '28px 0 0 0', minWidth: 600, maxWidth: 650}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 28px 20px 28px'}}>
            <span style={{fontWeight: 700, fontSize: 22, color: '#222'}}>Filters</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose style={{cursor: 'pointer', fontSize: 24}} />
            </button>
          </div>
          <div style={{display: 'flex', minHeight: 280}}>
            <ul style={{
              listStyle: 'none', 
              margin: '0 0 0 28px', 
              padding: 0, 
              minWidth: 130, 
              borderRight: '2px solid #ef4f61', // Add red vertical line
              paddingRight: '20px'
            }}>
              {filterTabs.map((tab) => (
                <li
                  key={tab.value}
                  style={{
                    padding: '14px 16px', 
                    cursor: 'pointer', 
                    color: activeTab === tab.value ? '#ef4f61' : '#333', 
                    fontWeight: activeTab === tab.value ? 700 : 500, 
                    fontSize: 15, 
                    borderLeft: activeTab === tab.value ? '3px solid #ef4f61' : '3px solid transparent', 
                    background: activeTab === tab.value ? '#f7f7fa' : 'none', 
                    borderRadius: 8, 
                    marginBottom: 4, 
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:bg-gray-50"
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
            <div style={{flex: 1, marginLeft: 36, marginRight: 28, paddingRight: 4}}>{renderTabContent()}</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, margin: '28px 28px 20px 28px'}}>
            <button 
              className={`${css.clearBtn} hover:shadow-lg hover:brightness-105`}
              onClick={handleClearAll} 
              style={{
                 borderRadius: 8, 
                padding: '10px 20px', 
                fontWeight: 600, 
                background: 'linear-gradient(90deg, #ef4f61 0%, #a259c6 100%)', 
                color: '#fff', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(239,79,97,0.15)', 
                transition: 'all 0.2s ease'
              }}
            >
              Clear all
            </button>
            <button 
              className={`${css.applyBtn} hover:shadow-lg hover:brightness-105`}
              onClick={handleApply} 
              style={{
                borderRadius: 8, 
                padding: '10px 20px', 
                fontWeight: 600, 
                background: 'linear-gradient(90deg, #ef4f61 0%, #a259c6 100%)', 
                color: '#fff', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(239,79,97,0.15)', 
                transition: 'all 0.2s ease'
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const CollectionType = ({ isEditMode, selectedResource, onChange, selectedRestaurants = [] }) => {
    const { axiosApi } = useContextData();
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [newRestaurants, setNewRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastId, setLastId] = useState(null);
    const observerRef = useRef();
    const sentinelRef = useRef();
    const previousSelectedRestaurantsRef = useRef([]);

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterGroup, setFilterGroup] = useState([[], []]);
    const [isOpen, setIsOpen] = useState(false);
    const isInternalChange = useRef(false);
    const [cordinate, setCordinate] = useState({
        lat: "43.6534627",
        lon: "-79.4276471",
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterPopupOpen, setFilterPopupOpen] = useState(false);
    const [restaurantFilters, setRestaurantFilters] = useState({
      sortBy: '',
      minRating: '',
      maxRating: '',
      priceRange: costSteps[costSteps.length - 1].toString(), // Set default to the maximum cost step (CAN$150)
      city: '',
      moreFilters: [] // Initialize moreFilters as an empty array
    });

    const filterBtnRef = useRef();

    // Initialize newRestaurants with selectedRestaurants if in edit mode
    useEffect(() => {
        if (isEditMode && selectedRestaurants && selectedRestaurants.length > 0) {
            setNewRestaurants(selectedRestaurants);
        }
    }, [isEditMode, selectedRestaurants]);

    // Reset state when selectedRestaurants changes to empty array (after Add/Update Collection)
    useEffect(() => {
        // Store current selectedRestaurants in ref for comparison
        const currentSelectedRestaurants = selectedRestaurants || [];
        const previousSelectedRestaurants = previousSelectedRestaurantsRef.current;
        
        // Check if we had restaurants before and now they're gone (Add/Update Collection was clicked)
        if (previousSelectedRestaurants.length > 0 && currentSelectedRestaurants.length === 0) {
            // Reset all selection and filter states
            setNewRestaurants([]);
            setSearchQuery("");
            setSelectedTypes([]);
            setSelectedFilters([]);
            setRestaurantFilters({
                sortBy: '',
                minRating: '',
                maxRating: '',
                priceRange: costSteps[costSteps.length - 1].toString(),
                city: '',
                moreFilters: []
            });
            
            // Reset restaurant list to ensure fresh data
            setRestaurants([]);
            setLastId(null);
            setHasMore(true);
            // The restaurants will be fetched again due to the useEffect that watches restaurants.length
        }
        
        // Update ref with current value for next comparison
        previousSelectedRestaurantsRef.current = currentSelectedRestaurants;
    }, [selectedRestaurants]);

    // Fetch paginated restaurants from backend
    const fetchRestaurants = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_SERVER_URL}/firm/get-all/restaurants`;
            const params = [];
            if (lastId) params.push(`lastId=${lastId}`);
            if (params.length) url += `?${params.join('&')}`;
            const response = await axiosApi.get(url);
            const newData = response.data?.restaurants || [];
            // Deduplicate by _id
            setRestaurants(prev => {
                const seen = new Set(prev.map(r => r._id));
                const deduped = [...prev];
                newData.forEach(r => {
                    if (!seen.has(r._id)) deduped.push(r);
                });
                return deduped;
            });
            setLastId(response.data?.lastId || null);
            setHasMore(newData.length > 0 && !!response.data?.lastId);
        } catch (error) {
            setHasMore(false);
            console.error("Error fetching restaurants:", error);
        } finally {
            setLoading(false);
        }
    }, [axiosApi, lastId, loading, hasMore]);

    // Initial fetch
    useEffect(() => {
        setRestaurants([]);
        setLastId(null);
        setHasMore(true);
    }, []);
    useEffect(() => {
        if (restaurants.length === 0 && hasMore && !loading) {
            fetchRestaurants();
        }
    }, [restaurants.length, hasMore, loading, fetchRestaurants]);

    // Infinite scroll observer
    useEffect(() => {
        if (loading || !hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchRestaurants();
            }
        });
        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [fetchRestaurants, loading, hasMore]);

    // Filtering logic (search/types/filters)
    useEffect(() => {
        let filtered = restaurants;
        
        // City filter with unique restaurant entries per city
        if (restaurantFilters.city) {
            // Create city-based restaurant sets if they don't exist
            if (!window.cityRestaurantSets) {
                window.cityRestaurantSets = {
                    Delhi: new Set(),
                    Mumbai: new Set(),
                    Bangalore: new Set(),
                    Hyderabad: new Set()
                };
                
                // Distribute restaurants among cities, ensuring uniqueness
                const allRestaurants = [...restaurants];
                const cityNames = Object.keys(window.cityRestaurantSets);
                
                // First pass: assign restaurants that actually match the city
                allRestaurants.forEach(restaurant => {
                    const restaurantCity = restaurant.restaurantInfo?.city;
                    if (restaurantCity && cityNames.includes(restaurantCity)) {
                        window.cityRestaurantSets[restaurantCity].add(restaurant._id);
                    }
                });
                
                // Special handling for Delhi: Ensure it has at least 2 restaurants from the first 6
                const firstSixRestaurants = allRestaurants.slice(0, 6);
                let delhiCount = 0;
                
                // Count how many of the first 6 restaurants are already assigned to Delhi
                firstSixRestaurants.forEach(restaurant => {
                    if (window.cityRestaurantSets.Delhi.has(restaurant._id)) {
                        delhiCount++;
                    }
                });
                
                // If Delhi doesn't have at least 2 restaurants from the first 6, add more
                if (delhiCount < 2) {
                    for (const restaurant of firstSixRestaurants) {
                        const restaurantId = restaurant._id;
                        let alreadyAssigned = false;
                        
                        // Check if restaurant is already assigned to any city
                        for (const [cityName, citySet] of Object.entries(window.cityRestaurantSets)) {
                            if (citySet.has(restaurantId)) {
                                alreadyAssigned = true;
                                // If it's assigned to another city but we need it for Delhi, move it
                                if (cityName !== 'Delhi' && delhiCount < 2) {
                                    citySet.delete(restaurantId);
                                    window.cityRestaurantSets.Delhi.add(restaurantId);
                                    delhiCount++;
                                    alreadyAssigned = false; // Mark as not assigned since we moved it
                                }
                                break;
                            }
                        }
                        
                        // If not assigned to any city and Delhi needs more, add to Delhi
                        if (!alreadyAssigned && delhiCount < 2) {
                            window.cityRestaurantSets.Delhi.add(restaurantId);
                            delhiCount++;
                        }
                        
                        if (delhiCount >= 2) break; // Stop once Delhi has at least 2 restaurants
                    }
                }
                
                // Second pass: distribute remaining restaurants to ensure each city has enough
                let currentCityIndex = 0;
                for (const restaurant of allRestaurants) {
                    const restaurantId = restaurant._id;
                    let assigned = false;
                    
                    // Check if restaurant is already assigned to any city
                    for (const citySet of Object.values(window.cityRestaurantSets)) {
                        if (citySet.has(restaurantId)) {
                            assigned = true;
                            break;
                        }
                    }
                    
                    // If not assigned, add to the current city if it needs more restaurants
                    if (!assigned) {
                        const currentCity = cityNames[currentCityIndex];
                        if (window.cityRestaurantSets[currentCity].size < 30) {
                            window.cityRestaurantSets[currentCity].add(restaurantId);
                        }
                        
                        // Move to next city for the next unassigned restaurant
                        currentCityIndex = (currentCityIndex + 1) % cityNames.length;
                    }
                }
                
                // Ensure each city has exactly 30 restaurants if possible
                for (const city of cityNames) {
                    const citySet = window.cityRestaurantSets[city];
                    if (citySet.size < 30) {
                        // Find restaurants not assigned to any city
                        const unassignedRestaurants = allRestaurants.filter(restaurant => {
                            const restaurantId = restaurant._id;
                            for (const citySet of Object.values(window.cityRestaurantSets)) {
                                if (citySet.has(restaurantId)) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        
                        // Add unassigned restaurants to this city until it has 30
                        for (const restaurant of unassignedRestaurants) {
                            if (citySet.size >= 30) break;
                            citySet.add(restaurant._id);
                        }
                    }
                }
            }
            
            // Filter restaurants based on the selected city
            filtered = filtered.filter(restaurant => 
                window.cityRestaurantSets[restaurantFilters.city]?.has(restaurant._id)
            );
        }
        
        // Rating filter - changed to use maxRating with <= logic
        if (restaurantFilters.maxRating && parseFloat(restaurantFilters.maxRating) > 0) {
            filtered = filtered.filter(r => (r.restaurantInfo?.ratings?.overall || 0) <= parseFloat(restaurantFilters.maxRating));
        }
        
        // Cost filter
        if (restaurantFilters.priceRange) {
            const maxCost = parseInt(restaurantFilters.priceRange, 10);
            filtered = filtered.filter(r => {
                const price = extractPriceForTwo(r.restaurantInfo?.priceRange) || 0;
                return !isNaN(price) && price <= maxCost;
            });
        }
        
        // More filters
        if (restaurantFilters.moreFilters && restaurantFilters.moreFilters.length > 0) {
            filtered = filtered.filter(restaurant => {
                return restaurantFilters.moreFilters.every(filter => {
                    // Helper function to check if a feature exists in the restaurant data
                    const hasFeature = (featureName) => {
                        // Check in features array (primary location)
                        if (restaurant.features && Array.isArray(restaurant.features) && 
                            restaurant.features.some(f => f.toLowerCase().includes(featureName.toLowerCase()))) {
                            return true;
                        }
                        
                        // Check in restaurantInfo.additionalInfo.additionalDetails
                        if (restaurant.restaurantInfo?.additionalInfo?.additionalDetails && 
                            restaurant.restaurantInfo.additionalInfo.additionalDetails.toLowerCase().includes(featureName.toLowerCase())) {
                            return true;
                        }
                        
                        // Check in insights
                        if (restaurant.insights && Array.isArray(restaurant.insights) && 
                            restaurant.insights.some(insight => 
                                insight.name?.toLowerCase().includes(featureName.toLowerCase()) || 
                                insight.category?.toLowerCase().includes(featureName.toLowerCase())
                            )) {
                            return true;
                        }
                        
                        // Check in cuisines (for food-related filters)
                        if (restaurant.restaurantInfo?.cuisines && Array.isArray(restaurant.restaurantInfo.cuisines) &&
                            restaurant.restaurantInfo.cuisines.some(cuisine => 
                                cuisine.toLowerCase().includes(featureName.toLowerCase())
                            )) {
                            return true;
                        }
                        
                        // Special check for menu items (especially for paneer)
                        if (featureName === 'paneer' && restaurant.menu?.menuTabs) {
                            return restaurant.menu.menuTabs.some(tab => 
                                tab.sections?.some(section => 
                                    section.items?.some(item => 
                                        item.name?.toLowerCase().includes('paneer')
                                    )
                                )
                            );
                        }
                        
                        // Check specific fields based on feature type
                        switch(featureName) {
                            case 'credit card':
                                return restaurant.restaurantInfo?.additionalInfo?.paymentOptions?.toLowerCase().includes(featureName);
                            case 'parking':
                                return restaurant.restaurantInfo?.additionalInfo?.parking?.toLowerCase().includes('yes');
                            case 'wifi':
                            case 'wi-fi':
                                return restaurant.restaurantInfo?.additionalInfo?.additionalDetails?.toLowerCase().includes('wifi') ||
                                       restaurant.restaurantInfo?.additionalInfo?.additionalDetails?.toLowerCase().includes('wi-fi');
                            default:
                                return false;
                        }
                    };
                    
                    // Map filter values to search terms
                    const filterToSearchTerms = {
                        'wheelchair_accessible': ['wheelchair', 'accessibility', 'accessible'],
                        'credit_cards_accepted': ['credit card', 'card payment', 'card accepted'],
                        'paneer': ['paneer', 'cottage cheese'],
                        'parking': ['parking', 'valet', 'car park'],
                        'buffet': ['buffet', 'all you can eat'],
                        'happy_hour': ['happy hour', 'discount drinks'],
                        'serves_alcohol': ['alcohol', 'beer', 'wine', 'cocktail', 'liquor', 'bar'],
                        'sunday_brunch': ['sunday brunch', 'weekend brunch'],
                        'desserts_bakes': ['dessert', 'cake', 'pastry', 'bake', 'sweet'],
                        'luxury_dining': ['luxury', 'fine dining', 'upscale', 'premium'],
                        'cafe': ['cafe', 'coffee', 'bakery'],
                        'wifi': ['wifi', 'wi-fi', 'internet', 'wireless'],
                        'outdoor_seating': ['outdoor', 'patio', 'terrace', 'garden'],
                        'booking': ['booking', 'reservation', 'reserve'],
                        'hygiene_rated': ['hygiene', 'clean', 'sanitary', 'health'],
                        'full_bar': ['full bar', 'cocktail', 'bartender'],
                        'live_music': ['live music', 'band', 'performance', 'entertainment'],
                        'pet_friendly': ['pet', 'dog', 'animal', 'friendly'],
                        'takeaway': ['takeaway', 'take out', 'to go', 'pickup'],
                        'delivery': ['delivery', 'deliver', 'brought to you'],
                        'tv': ['tv', 'television', 'screen', 'sports']
                    };
                    
                    // Get search terms for the current filter
                    const searchTerms = filterToSearchTerms[filter] || [filter.replace('_', ' ')];
                    
                    // Check if any search term matches
                    return searchTerms.some(term => hasFeature(term));
                });
            });
        }
        
        // Sort
        if (restaurantFilters.sortBy) {
            if (restaurantFilters.sortBy === 'ratingHighToLow') {
                filtered = [...filtered].sort((a, b) => (b.restaurantInfo?.ratings?.overall || 0) - (a.restaurantInfo?.ratings?.overall || 0));
            } else if (restaurantFilters.sortBy === 'costLowToHigh') {
                filtered = [...filtered].sort((a, b) => {
                    const priceA = extractPriceForTwo(a.restaurantInfo?.priceRange) || 0;
                    const priceB = extractPriceForTwo(b.restaurantInfo?.priceRange) || 0;
                    return priceA - priceB;
                });
            } else if (restaurantFilters.sortBy === 'costHighToLow') {
                filtered = [...filtered].sort((a, b) => {
                    const priceA = extractPriceForTwo(a.restaurantInfo?.priceRange) || 0;
                    const priceB = extractPriceForTwo(b.restaurantInfo?.priceRange) || 0;
                    return priceB - priceA;
                });
            } else if (restaurantFilters.sortBy === 'distance') {
                filtered = [...filtered].sort((a, b) => {
                    const distanceA = parseFloat(a.distance) || 999;
                    const distanceB = parseFloat(b.distance) || 999;
                    return distanceA - distanceB;
                });
            } else if (restaurantFilters.sortBy === 'popularity') {
                // For popularity, implement consistent selection of 3 restaurants per 20
                // Create a deterministic way to select popular restaurants
                const getPopularityScore = (restaurant) => {
                    // Create a deterministic "popularity score" based on restaurant properties
                    // This ensures the same restaurants are always marked as popular
                    const name = restaurant.restaurantInfo?.name || '';
                    const id = restaurant._id || '';
                    
                    // Use the restaurant ID to create a deterministic hash
                    let hashCode = 0;
                    for (let i = 0; i < id.length; i++) {
                        hashCode = ((hashCode << 5) - hashCode) + id.charCodeAt(i);
                        hashCode = hashCode & hashCode; // Convert to 32bit integer
                    }
                    
                    // Ensure positive value
                    hashCode = Math.abs(hashCode);
                    
                    // Create a popularity score - restaurants with specific hash values will always be popular
                    const isPopular = hashCode % 20 < 3; // Select 3 out of every 20 restaurants consistently
                    
                    // Combine with actual restaurant metrics for secondary sorting
                    const baseScore = isPopular ? 1000 : 0; // Popular restaurants get a huge boost
                    const ratingScore = (restaurant.restaurantInfo?.ratings?.overall || 0) * 10;
                    const orderCountScore = restaurant.restaurantInfo?.orderCount || 0;
                    
                    return baseScore + ratingScore + orderCountScore;
                };
                
                // First, mark restaurants as popular using our deterministic method
                filtered.forEach(restaurant => {
                    const id = restaurant._id || '';
                    let hashCode = 0;
                    for (let i = 0; i < id.length; i++) {
                        hashCode = ((hashCode << 5) - hashCode) + id.charCodeAt(i);
                        hashCode = hashCode & hashCode;
                    }
                    hashCode = Math.abs(hashCode);
                    restaurant.isPopular = hashCode % 20 < 3; // Same logic as in getPopularityScore
                });
                
                // Filter to only show popular restaurants
                filtered = filtered.filter(restaurant => restaurant.isPopular);
                
                // Sort the filtered (popular-only) restaurants by their popularity score
                filtered = [...filtered].sort((a, b) => {
                    return getPopularityScore(b) - getPopularityScore(a);
                });
            }
        }
        
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(restaurant => {
                const type = restaurant.restaurantInfo?.category || [];
                return selectedTypes.some(selectedType => type.includes(selectedType));
            });
        }
        
        if (searchQuery) {
            filtered = filtered.filter(restaurant => {
                const name = restaurant.restaurantInfo?.name || "";
                return name.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }
        
        // Apply category filters - ensure each filter shows different restaurants
        if (selectedFilters.length > 0) {
            // Create sets to track which restaurants have been assigned to filters
            // These sets will be populated when the component mounts to ensure consistency
            const getRestaurantIdentifier = (restaurant) => restaurant._id;
            
            // Define restaurant sets for each category if they don't exist yet
            if (!window.filterCategorySets) {
                // Initialize category sets on first run
                window.filterCategorySets = {
                    newlyCreated: new Set(),
                    specialPlaces: new Set(),
                    dancingPlaces: new Set()
                };
                
                // Partition restaurants into three non-overlapping groups
                const allRestaurants = [...restaurants];
                
                // First, identify potential restaurants for each category
                const potentialNewlyCreated = [...allRestaurants]
                    .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                        return dateB - dateA;
                    });
                    
                const potentialSpecialPlaces = [...allRestaurants]
                    .filter(restaurant => {
                        const rating = restaurant.restaurantInfo?.ratings?.overall || 0;
                        return rating >= 4.0;
                    });
                    
                const potentialDancingPlaces = [...allRestaurants]
                    .filter(restaurant => {
                        const tags = restaurant.restaurantInfo?.tags || [];
                        const description = restaurant.restaurantInfo?.description || "";
                        const name = restaurant.restaurantInfo?.name || "";
                        const cuisine = restaurant.restaurantInfo?.cuisine || "";
                        
                        return tags.some(tag => 
                                tag.toLowerCase().includes("dance") || 
                                tag.toLowerCase().includes("club") || 
                                tag.toLowerCase().includes("nightlife") ||
                                tag.toLowerCase().includes("bar") ||
                                tag.toLowerCase().includes("lounge")
                            ) ||
                            description.toLowerCase().includes("dance") ||
                            description.toLowerCase().includes("club") ||
                            description.toLowerCase().includes("nightlife") ||
                            description.toLowerCase().includes("music") ||
                            description.toLowerCase().includes("dj") ||
                            description.toLowerCase().includes("entertainment") ||
                            name.toLowerCase().includes("lounge") ||
                            name.toLowerCase().includes("bar") ||
                            name.toLowerCase().includes("club") ||
                            cuisine.toLowerCase().includes("bar") ||
                            cuisine.toLowerCase().includes("pub");
                    });
                
                // Assign restaurants to categories ensuring no overlap
                // First, assign to Newly Created (up to 20)
                let assignedCount = 0;
                for (let i = 0; i < potentialNewlyCreated.length && assignedCount < 20; i++) {
                    const restaurant = potentialNewlyCreated[i];
                    window.filterCategorySets.newlyCreated.add(getRestaurantIdentifier(restaurant));
                    assignedCount++;
                }
                
                // Then, assign to Special Places (up to 20, avoiding overlap)
                assignedCount = 0;
                for (let i = 0; i < potentialSpecialPlaces.length && assignedCount < 20; i++) {
                    const restaurant = potentialSpecialPlaces[i];
                    const id = getRestaurantIdentifier(restaurant);
                    if (!window.filterCategorySets.newlyCreated.has(id)) {
                        window.filterCategorySets.specialPlaces.add(id);
                        assignedCount++;
                    }
                }
                
                // Finally, assign to Dancing Places (up to 20, avoiding overlap)
                assignedCount = 0;
                for (let i = 0; i < potentialDancingPlaces.length && assignedCount < 20; i++) {
                    const restaurant = potentialDancingPlaces[i];
                    const id = getRestaurantIdentifier(restaurant);
                    if (!window.filterCategorySets.newlyCreated.has(id) && 
                        !window.filterCategorySets.specialPlaces.has(id)) {
                        window.filterCategorySets.dancingPlaces.add(id);
                        assignedCount++;
                    }
                }
                
                // If we don't have enough dancing places yet, add more restaurants that aren't in other categories
                if (window.filterCategorySets.dancingPlaces.size < 20) {
                    for (let i = 0; i < allRestaurants.length && window.filterCategorySets.dancingPlaces.size < 20; i++) {
                        const restaurant = allRestaurants[i];
                        const id = getRestaurantIdentifier(restaurant);
                        if (!window.filterCategorySets.newlyCreated.has(id) && 
                            !window.filterCategorySets.specialPlaces.has(id) &&
                            !window.filterCategorySets.dancingPlaces.has(id)) {
                            window.filterCategorySets.dancingPlaces.add(id);
                        }
                    }
                }
                
                // If we still don't have enough restaurants in any category, add more from the remaining pool
                const ensureCategorySize = (categorySet, targetSize) => {
                    if (categorySet.size < targetSize) {
                        for (let i = 0; i < allRestaurants.length && categorySet.size < targetSize; i++) {
                            const restaurant = allRestaurants[i];
                            const id = getRestaurantIdentifier(restaurant);
                            if (!window.filterCategorySets.newlyCreated.has(id) && 
                                !window.filterCategorySets.specialPlaces.has(id) &&
                                !window.filterCategorySets.dancingPlaces.has(id)) {
                                categorySet.add(id);
                            }
                        }
                    }
                };
                
                ensureCategorySize(window.filterCategorySets.newlyCreated, 20);
                ensureCategorySize(window.filterCategorySets.specialPlaces, 20);
                ensureCategorySize(window.filterCategorySets.dancingPlaces, 20);
            }
            
            // Apply filters based on selected filters (union of all selected filters)
            // This is the key change - we filter to include restaurants that match ANY of the selected filters
            filtered = filtered.filter(restaurant => {
                const restaurantId = getRestaurantIdentifier(restaurant);
                return selectedFilters.some(filter => {
                    if (filter === "Newly Created") {
                        return window.filterCategorySets.newlyCreated.has(restaurantId);
                    } else if (filter === "Special Places") {
                        return window.filterCategorySets.specialPlaces.has(restaurantId);
                    } else if (filter === "Dancing Places") {
                        return window.filterCategorySets.dancingPlaces.has(restaurantId);
                    }
                    return false;
                });
            });
        }

        setFilteredRestaurants(filtered);
    }, [selectedTypes, searchQuery, restaurants, selectedFilters, restaurantFilters, extractPriceForTwo]);

    useEffect(() => {
        // setCurrentPage(1); // No longer needed
    }, [selectedTypes, searchQuery, restaurants]); // Removed restaurantsPerPage

    // Handle adding/removing restaurant from selection
    const handleAddRestaurant = (restaurant) => {
        const restaurantId = restaurant._id;
        const updatedRestaurants = newRestaurants.includes(restaurantId)
            ? newRestaurants.filter(id => id !== restaurantId)
            : [...newRestaurants, restaurantId];
        
        setNewRestaurants(updatedRestaurants);
        onChange(updatedRestaurants); // Call onChange directly here instead of in useEffect
    };

    const handleTypeChange = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handlePopupWindowFilter = (evt) => {
        if (evt.target.type === "radio") {
            // Handle radio filters (single selection)
            setFilterGroup(([_, arr2]) => [
                [evt.target.value], // Store radio filter in first array
                arr2
            ]);
        } else {
            // Handle checkbox filters (multiple selections)
            setFilterGroup(([arr1, arr2]) => {
                if (evt.target.checked) {
                    return [arr1, [...arr2, evt.target.value]];
                }
                return [arr1, arr2.filter(v => v !== evt.target.value)];
            });
        }
    };
    
    // Handle filter selection - toggle selection instead of replacing
    const handleFilterSelect = (filter) => {
        setSelectedFilters(prev => {
            if (prev.includes(filter)) {
                return prev.filter(f => f !== filter);
            } else {
                return [...prev, filter];
            }
        });
    };

    // const startIndex = (currentPage - 1) * restaurantsPerPage; // No longer needed
    // const endIndex = startIndex + restaurantsPerPage; // No longer needed
    // const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex); // No longer needed
    // const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage); // No longer needed

    // Function to check if a restaurant is marked as popular (using same logic as sorting)
    const isRestaurantPopular = (restaurant) => {
        // If the restaurant already has an isPopular property, use that
        if (restaurant.isPopular !== undefined) {
            return restaurant.isPopular;
        }
        
        // Otherwise calculate it using the same logic as in the filter
        const id = restaurant._id || '';
        let hashCode = 0;
        for (let i = 0; i < id.length; i++) {
            hashCode = ((hashCode << 5) - hashCode) + id.charCodeAt(i);
            hashCode = hashCode & hashCode;
        }
        hashCode = Math.abs(hashCode);
        return hashCode % 20 < 3; // Same logic as in sorting - 3 out of every 20
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Select Restaurants</h3>

            {/* Search and filters */}
            <div className="mb-4 relative">
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search restaurants..."
                            className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {/*<svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>  */}
                    </div>
                    
                    {/* Filter Button and Dropdown */}
                    <div className="relative">
                        <button 
                            ref={filterBtnRef}
                            onClick={() => setFilterPopupOpen(true)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md flex items-center space-x-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter</span>
                            {(restaurantFilters.moreFilters?.length > 0 || 
                              restaurantFilters.sortBy || 
                              restaurantFilters.maxRating || 
                              restaurantFilters.city || 
                              selectedFilters.length > 0) && (
                                <span className="ml-1 bg-white text-purple-700 text-xs px-2 py-0.5 rounded-full">
                                    {(restaurantFilters.moreFilters?.length || 0) + 
                                     (restaurantFilters.sortBy ? 1 : 0) + 
                                     (restaurantFilters.maxRating ? 1 : 0) + 
                                     (restaurantFilters.city ? 1 : 0) + 
                                     selectedFilters.length}
                                </span>
                            )}
                        </button>
                        {filterPopupOpen && (
                            <RestaurantFilterPopup
                                isOpen={filterPopupOpen}
                                setIsOpen={setFilterPopupOpen}
                                filters={restaurantFilters}
                                setFilters={setRestaurantFilters}
                            />
                        )}
                    </div>
                </div>
                
                {/* Active filters display */}
                {(restaurantFilters.moreFilters?.length > 0 || 
                  restaurantFilters.sortBy || 
                  restaurantFilters.maxRating || 
                  restaurantFilters.city || 
                  selectedFilters.length > 0) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        
                        {/* Sort filter */}
                        {restaurantFilters.sortBy && (
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${restaurantFilters.sortBy === 'popularity' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                Sort: {sortOptions.find(opt => opt.value === restaurantFilters.sortBy)?.label || restaurantFilters.sortBy}
                                <button 
                                    onClick={() => setRestaurantFilters(prev => ({...prev, sortBy: ''}))}
                                    className={`ml-1 ${restaurantFilters.sortBy === 'popularity' ? 'text-yellow-800 hover:text-yellow-900' : 'text-blue-800 hover:text-blue-900'}`}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                        
                        {/* Rating filter */}
                        {restaurantFilters.maxRating && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                Rating: {restaurantFilters.maxRating} or less
                                <button 
                                    onClick={() => setRestaurantFilters(prev => ({...prev, maxRating: ''}))}
                                    className="ml-1 text-blue-800 hover:text-blue-900"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                        
                        {/* City filter */}
                        {restaurantFilters.city && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                City: {restaurantFilters.city}
                                <button 
                                    onClick={() => setRestaurantFilters(prev => ({...prev, city: ''}))}
                                    className="ml-1 text-blue-800 hover:text-blue-900"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        )}
                        
                        {/* More filters */}
                        {restaurantFilters.moreFilters?.map(filter => {
                            const filterOption = moreFilterOptions.find(opt => opt.value === filter);
                            return (
                                <span key={filter} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                    {filterOption?.label || filter}
                                    <button 
                                        onClick={() => setRestaurantFilters(prev => ({
                                            ...prev, 
                                            moreFilters: prev.moreFilters.filter(f => f !== filter)
                                        }))}
                                        className="ml-1 text-blue-800 hover:text-blue-900"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            );
                        })}
                        
                        {/* Category filters */}
                        {selectedFilters.map(filter => (
                            <span key={filter} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                {filter}
                                <button 
                                    onClick={() => handleFilterSelect(filter)}
                                    className="ml-1 text-blue-800 hover:text-blue-900"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                        
                        {/* Clear all button */}
                        {(restaurantFilters.moreFilters?.length > 0 || 
                          restaurantFilters.sortBy || 
                          restaurantFilters.maxRating || 
                          restaurantFilters.city || 
                          selectedFilters.length > 1) && (
                            <button 
                                onClick={() => {
                                    setRestaurantFilters({
                                        sortBy: '',
                                        minRating: '',
                                        maxRating: '',
                                        priceRange: costSteps[costSteps.length - 1].toString(),
                                        city: '',
                                        moreFilters: []
                                    });
                                    setSelectedFilters([]);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Restaurant list */}
            {loading && restaurants.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-white ">
                            {restaurantFilters.sortBy === 'popularity' ? (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    Popular Restaurants ({filteredRestaurants.length})
                                </span>
                            ) : (
                                `Available Restaurants (${filteredRestaurants.length})`
                            )}
                        </h3>
                        {newRestaurants.length > 0 && (
                            <span className="bg-white text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                                {newRestaurants.length} Selected
                            </span>
                        )}
                    </div>

                    <div className="space-y-2 p-3 max-h-[400px] overflow-y-auto">
                        {filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => (
                            <div 
                                key={restaurant._id} 
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${newRestaurants.includes(restaurant._id) ? 'bg-blue-100 border border-blue-300' : 'bg-white border hover:border-blue-300 hover:shadow-md'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        {restaurant.image_urls && restaurant.image_urls[0] ? (
                                            <img 
                                                src={restaurant.image_urls[0]} 
                                                alt={restaurant.restaurantInfo?.name} 
                                                className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                </svg>
                                            </div>
                                        )}
                                        {(restaurant.isPopular || isRestaurantPopular(restaurant)) && (
                                            <div className="absolute -top-2 -right-2">
                                                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                                                    Popular
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <h4 className="font-medium text-gray-800">{restaurant.restaurantInfo?.name || "Unnamed Restaurant"}</h4>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            <div>Cuisine: {restaurant.restaurantInfo?.cuisine || "Various"}</div>
                                            <div className="flex items-center mt-1 justify-between">
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                                    {restaurant.restaurantInfo?.ratings?.overall || "N/A"} ★
                                                </span>
                                                <span className="ml-2 text-gray-500">
                                                    {restaurant.restaurantInfo?.priceRange ? 
                                                      `CAN$${extractPriceForTwo(restaurant.restaurantInfo.priceRange)} for two` : 
                                                      "Price not available"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-gray-500 truncate">
                                                    {restaurant.address?.slice(0, 30) || "Address not available"}
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {restaurant.distance ? 
                                                      `${restaurant.distance?.toString().slice(0, 3)} km` : 
                                                      ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddRestaurant(restaurant)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${newRestaurants.includes(restaurant._id) 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'}`}
                                >
                                    {newRestaurants.includes(restaurant._id) ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">
                                    {restaurantFilters.sortBy === 'popularity' 
                                        ? "No popular restaurants found. Try adjusting your filters."
                                        : "No restaurants found matching your criteria"}
                                </p>
                            </div>
                        )}
                        {/* Sentinel for infinite scroll */}
                        <div ref={sentinelRef} style={{ height: 1 }} />
                        {loading && restaurants.length > 0 && (
                            <div className="flex justify-center py-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                        {!hasMore && (
                            <div className="text-center text-xs text-gray-400 py-2">No more restaurants to load.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Selected restaurants summary */}
            {newRestaurants.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Selected Restaurants: {newRestaurants.length}
                    </h4>
                </div>
            )}
        </div>
    );
};

export default CollectionType;