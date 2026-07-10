import React, { createContext, useState, useContext, useEffect } from 'react';
import { detectLocation } from '../components/HomeComponents/PopularPlaces/CurrentLocation/detectLocation'; // Corrected path

// 1. Create the context
const LocationContext = createContext();

// 2. Create the Provider component
export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs only once when the app loads
  useEffect(() => {
    let locationFound = false;
    setIsLoading(true);

    // 1. Load Recent Locations first (if any)
    try {
      const savedRecent = localStorage.getItem('recentLocations');
      if (savedRecent) {
        setRecentLocations(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.error("Failed to parse recent locations", e);
    }

    // 2. Load the last-used ("persistent") location
    try {
      const savedLocationItem = localStorage.getItem('persistentLocation');
      if (savedLocationItem) {
        const { location, timestamp } = JSON.parse(savedLocationItem);
        const fifteenMinutes = 15 * 60 * 1000;
        const timeElapsed = Date.now() - timestamp;

        if (timeElapsed < fifteenMinutes) {
          console.log('%c[CONTEXT] Step 1A: Found and loaded fresh persistent location.', 'color: green; font-weight: bold;', location);
          setCurrentLocation(location);
          locationFound = true;
        } else {
          console.log('%c[CONTEXT] Step 1A: Stale location found, removing.', 'color: orange;');
          localStorage.removeItem('persistentLocation');
        }
      }
    } catch (error) {
      console.error("Failed to parse persistent location:", error);
      localStorage.removeItem('persistentLocation');
    }

    // 3. If no fresh location was found, detect a new one
    if (!locationFound) {
      console.log('%c[CONTEXT] Step 1B: No fresh location. Detecting via GPS.', 'color: blue;');
      triggerDetectLocation();
    } else {
      setIsLoading(false); // We're done loading
    }
  }, []); // Runs only once on app load

  // Main function to update the location from any component
  const updateLocation = (newLocation) => {
    console.log('%c[CONTEXT] Step 2: "updateLocation" called with:', 'color: green; font-weight: bold;', newLocation);
    
    // 1. Save as the current persistent location (with timestamp)
    const locationWithTimestamp = {
      location: newLocation,
      timestamp: Date.now(),
    };
    localStorage.setItem('persistentLocation', JSON.stringify(locationWithTimestamp));
    
    // 2. Update the app state
    setCurrentLocation(newLocation);
    
    // 3. Update the Recent Locations list
    setRecentLocations(prevRecent => {
      // Add the new location, filter out any duplicates, and keep only the top 5
      const updatedRecent = [
        newLocation, 
        ...prevRecent.filter(loc => loc.address !== newLocation.address)
      ].slice(0, 5);
      
      localStorage.setItem('recentLocations', JSON.stringify(updatedRecent));
      return updatedRecent;
    });
  };
  
  // Function to trigger a new GPS scan
  const triggerDetectLocation = () => {
    setIsLoading(true);
    detectLocation((locationData) => {
      if (locationData && locationData.latitude && locationData.longitude) {
        const newLocation = {
          address: locationData.address,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
        updateLocation(newLocation); // Use our main function to save it
      } else {
        console.error("Failed to detect location.");
      }
      setIsLoading(false);
    });
  };

  // The "value" is what we make available to all other components
  const value = {
    currentLocation,
    recentLocations, // <-- Provide the recent locations
    updateLocation,  // <-- Provide the main update function
    detectLocation: triggerDetectLocation,
    isLoading,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useLocation = () => {
  return useContext(LocationContext);
};