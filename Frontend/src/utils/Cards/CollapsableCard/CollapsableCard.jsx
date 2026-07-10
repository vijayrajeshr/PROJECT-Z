import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CityConfirmationDialog from '../../../components/CityConfirmationDialog/CityConfirmationDialog';

import css from './CollapsableCard.module.css';

import downArrow from '/icons/down-arrow.png';

let CollapsableCard = ({ title, content, cityMapping = {} }) => {
    let [isTopChainsOpen, setIsTopChainsOpen] = useState(false);
    let [isCitiesOpen, setIsCitiesOpen] = useState(false);
    let [selectedCity, setSelectedCity] = useState(null);
    let [filteredTiffins, setFilteredTiffins] = useState([]);
    let [loading, setLoading] = useState(false);
    let [showCityDialog, setShowCityDialog] = useState(false);
    let [cityToConfirm, setCityToConfirm] = useState("");
    const navigate = useNavigate();

    const handleToggle = (section) => {
        if (section === "Top Restaurant Chains") {
            setIsTopChainsOpen((prev) => !prev);
        } else if (section === "Cities We Deliver To") {
            setIsCitiesOpen((prev) => !prev);
        }
    };

    const handleItemClick = async (e, item) => {
        e.stopPropagation(); // Prevent the toggle from firing
        
        if (title === "Top Restaurant Chains" && item.id) {
            // Store the restaurant ID in localStorage (similar to SearchBar.jsx)
            localStorage.setItem("id", item.id);
            
            // Navigate to restaurant overview page using the same pattern as SearchBar.jsx
            navigate(`/hyderabad/${item.id}/${item.name}/overview`);
        } else if (title === "Cities We Deliver To") {
            // Handle city name click
            const cityName = item; // The item is the city name
            setCityToConfirm(cityName);
            setShowCityDialog(true);
        }
    };
    
    const handleConfirmCity = async () => {
        setSelectedCity(cityToConfirm);
        setLoading(true);
        try {
            // Fetch tiffins for the selected city name
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/firm/get/tiffins?city=${encodeURIComponent(cityToConfirm)}`,
                { withCredentials: true }
            );
            
            // Store the filtered tiffins and selected city in localStorage
            localStorage.setItem("filteredTiffins", JSON.stringify(response.data.tiffins || []));
            localStorage.setItem("selectedCity", cityToConfirm);
            
            // Set flag to indicate this is the first visit after city selection
            localStorage.setItem("isFirstVisitAfterCitySelection", "true");
            
            // Clear any previous filters and errors before navigating
            localStorage.removeItem("filters");
            localStorage.removeItem("tiffinFetchError");
    
            // Navigate to the ShowCase page with the filtered tiffins
            navigate(`/show-case?page=pro-and-pro-plus/${encodeURIComponent(cityToConfirm)}`);
        } catch (error) {
            console.error("Error fetching tiffins for city:", error);
            // Handle error case - still navigate but with empty tiffins array
            localStorage.setItem("filteredTiffins", JSON.stringify([]));
            localStorage.setItem("selectedCity", cityToConfirm);
            localStorage.setItem("tiffinFetchError", "true");
            localStorage.setItem("isFirstVisitAfterCitySelection", "true");
            navigate(`/show-case?page=pro-and-pro-plus/${encodeURIComponent(cityToConfirm)}`);
        } finally {
            setLoading(false);
            setShowCityDialog(false);
        }
    };
    
    const handleRejectCity = () => {
        // Clear any city filters and navigate to show all tiffins
        localStorage.removeItem("selectedCity");
        localStorage.removeItem("filteredTiffins");
        localStorage.removeItem("tiffinFetchError");
        navigate(`/show-case?page=pro-and-pro-plus`);
        setShowCityDialog(false);
    };

    const isRestaurantItem = (item) => {
        return title === "Top Restaurant Chains" && typeof item === 'object' && item !== null;
    };

    return (
        <>
            <div className={css.outerDiv}>
                <div className={css.bar} onClick={() => handleToggle(title)}>
                    <div className={css.title}>{title}</div>
                    <img
                        src={downArrow}
                        alt="down arrow"
                        className={
                            title === 'Top Restaurant Chains'
                                ? `${css.arrow} ${isTopChainsOpen ? css.arrowRotateDown : css.arrowRotateUp}`
                                : `${css.arrow} ${isCitiesOpen ? css.arrowRotateDown : css.arrowRotateUp}`
                        }
                    />
                </div>
                <div
                    className={
                        `${css.content} ` +
                        (title === 'Top Restaurant Chains'
                            ? isTopChainsOpen
                                ? css.dblock + ' ' + css.restaurantGrid
                                : css.dnone
                            : isCitiesOpen
                            ? css.dblock + ' ' + css.cityGrid
                            : css.dnone)
                    }
                >
                    {content?.map((item, index) => {
                        // For restaurants, display the name property
                        // For cities, display the city name from mapping if available
                        let displayText;
                        if (isRestaurantItem(item)) {
                            displayText = item.name;
                        } else if (title === "Cities We Deliver To" && cityMapping[item]) {
                            displayText = cityMapping[item]; // Display city name instead of index
                        } else {
                            displayText = item;
                        }
                        
                        const isClickable = isRestaurantItem(item) || title === "Cities We Deliver To";
                        
                        return (
                            <div 
                                key={index} 
                                className={`${css.val} ${isClickable ? css.clickable : ''}`}
                                tabIndex={isClickable ? 0 : -1}
                                onClick={(e) => isClickable ? handleItemClick(e, item) : null}
                                onKeyDown={(e) => {
                                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                        handleItemClick(e, item);
                                    }
                                }}
                            >
                                {displayText}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <CityConfirmationDialog 
                isOpen={showCityDialog}
                onClose={() => setShowCityDialog(false)}
                cityName={cityToConfirm}
                onConfirm={handleConfirmCity}
                onReject={handleRejectCity}
            />
        </>
    );
}

export default CollapsableCard;