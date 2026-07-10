// import { useState, useEffect } from "react";

// import copyIcon from "/icons/copy.png";
// import directioIcon from "/icons/direction.png";

// import css from "./OverviewAboutCard.module.css";

// import AlertBox from "../../../Alerts/AlertBox/AlertBox";
// import BtnWithIcon from "../../../Buttons/BtnWithIcon/BtnWithIcon";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// const OverviewAboutCard = ({ data }) => {
//   const [alert, setAlert] = useState({ show: false });

//   // Extract restaurant data
//   const restaurantInfo = data?.restaurantInfo || {};
//   const { name, address, lat, lng, phoneNo } = restaurantInfo;
//   const [coordinates, setCoordinates] = useState(null);
//   // Construct full address
//   const fullAddress = `${name || "Restaurant"}, ${
//     address || "Address not available"
//   }`;
//   const fetchCoordinates = async (fullAddress) => {
//     const openCageApiKey = "2fe6302d9d304ad5bf5520116c8f75ad"; // OpenCage API Key
//     const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
//       fullAddress
//     )}&key=${openCageApiKey}`;

//     try {
//       const response = await fetch(geocodeUrl);
//       const data = await response.json();
//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry;
//         setCoordinates({ lat, lng });
//       } else {
//         console.error("Coordinates not found for this address.");
//         setCoordinates(null);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       setCoordinates(null);
//     }
//   };

//   // Map configuration
//   useEffect(() => {
//     if (fullAddress?.trim()) {
//       fetchCoordinates(fullAddress);
//     }
//   }, [fullAddress]);

//   // Google Maps Embed URL (Static Map)
//   // const googleMapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
//   //   fullAddress
//   // )}&zoom=15`;

//   // Function to copy full address to clipboard
//   const copyToClipboard = () => {
//     if (fullAddress) {
//       navigator.clipboard
//         .writeText(fullAddress)
//         .then(() => setAlert({ show: true }))
//         .catch((err) => console.error("Failed to copy text: ", err));
//     }
//   };

//   // Function to open Google Maps with full address
//   const handleDirection = () => {
//     if (address) {
//       const formattedAddress = encodeURIComponent(fullAddress);
//       const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
//       window.open(googleMapsUrl, "_blank");
//     } else {
//       console.error("Full address not available");
//     }
//   };

//   // Auto-hide alert after 5 seconds
//   useEffect(() => {
//     if (alert.show) {
//       const timer = setTimeout(() => {
//         setAlert({ show: false });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [alert.show]);

//   return (
//     <>
//       <div className={css.outerDiv}>
//         <div className={css.innerDiv}>
//           <div className={css.header}>
//             <div className={css.htxt}>Call</div>
//             <div className={css.phone}>{phoneNo || "N/A"}</div>
//           </div>

//           <div className={css.direction}>
//             <div className={css.htxt}>Direction</div>

//             {/* Render Embedded Map */}
//             {/* <iframe
//             Render Embedded Map
//             <iframe
//               className={css.map}
//               title="Location Map"
//               width="100%"
//               height="200"
//               loading="lazy"
//               allowFullScreen
//               referrerPolicy="no-referrer-when-downgrade"
//               src={googleMapEmbedUrl}
//             ></iframe> */}
//             <MapContainer
//               center={[
//                 coordinates?.lat || 43.654652,
//                 coordinates?.lng || -79.380934,
//               ]}
//               zoom={15}
//               style={{ height: "200px", width: "100%", zIndex: 1 }}
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               />
//               <Marker
//                 position={[
//                   coordinates?.lat || 43.654652,
//                   coordinates?.lng || -79.380934,
//                 ]}
//               >
//                 <Popup>{address}</Popup>
//               </Marker>
//             </MapContainer>

//             <div className={css.addTxt}>{fullAddress}</div>
//           </div>

//           <div className={css.btns}>
//             <BtnWithIcon icon={copyIcon} txt="Copy" onClick={copyToClipboard} />
//             <BtnWithIcon
//               icon={directioIcon}
//               txt="Direction"
//               onClick={handleDirection}
//             />
//           </div>
//         </div>
//       </div>

//       {alert.show && (
//         <AlertBox
//           text="Restaurant Address Copied to Clipboard"
//           setClose={setAlert}
//           stateVal="show"
//         />
//       )}
//     </>
//   );
// };

// export default OverviewAboutCard;

import { useState, useEffect } from "react";
import L from "leaflet"; // Import Leaflet for custom icon handling

import copyIcon from "/icons/copy.png";
import directionIcon from "/icons/direction.png"; // Renamed for consistency

import css from "./OverviewAboutCard.module.css";

import AlertBox from "../../../Alerts/AlertBox/AlertBox";
import BtnWithIcon from "../../../Buttons/BtnWithIcon/BtnWithIcon";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// IMPORTANT: This is a common workaround for Leaflet's default marker icon
// not appearing due to Webpack/bundler issues. Ensure these paths are correct
// relative to your project's public folder or CDN.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const OverviewAboutCard = ({ data }) => {
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [coordinates, setCoordinates] = useState(null);
  const [mapLoadingError, setMapLoadingError] = useState(false); // New state for map-specific errors

  // Destructure restaurant info with robust defaults
  const {
    name = "Restaurant",
    address = "Address not available",
    lat: propLat, // Rename to avoid conflict with state `lat`
    lng: propLng, // Rename to avoid conflict with state `lng`
    phoneNo = "N/A",
  } = data?.restaurantInfo || {};

  // Construct full address for geocoding and display
  const fullAddress = `${name}, ${address}`;

  /**
   * Fetches coordinates for a given address using OpenCage Geocoding API.
   * Prioritizes existing lat/lng props if available.
   * @param {string} addressToGeocode - The address string to geocode.
   */
  const fetchCoordinates = async (addressToGeocode) => {
    // If lat and lng are provided in data, use them directly
    if (propLat && propLng) {
      setCoordinates({ lat: propLat, lng: propLng });
      setMapLoadingError(false); // Clear any previous error
      return;
    }

    // Using a public key directly is not recommended for production.
    // Consider using an environment variable (e.g., process.env.REACT_APP_OPENCAGE_API_KEY)
    // and setting up a proxy or a backend call for security.
    const openCageApiKey = "2fe6302d9d304ad5bf5520116c8f75ad";

    if (!openCageApiKey) {
      console.error("OpenCage API Key is missing. Map functionality may be limited.");
      setMapLoadingError(true);
      setAlert({ show: true, message: "Map services temporarily unavailable: API key missing." });
      return;
    }

    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      addressToGeocode
    )}&key=${openCageApiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error(`Geocoding API HTTP error! Status: ${response.status}`);
      }
      const geoData = await response.json();

      if (geoData.results && geoData.results.length > 0) {
        const { lat, lng } = geoData.results[0].geometry;
        setCoordinates({ lat, lng });
        setMapLoadingError(false); // Clear error if successful
      } else {
        console.warn("No coordinates found for this address. Displaying default location.");
        setCoordinates(null); // Keep coordinates null to use default map center
        setMapLoadingError(true); // Indicate that the address couldn't be geocoded
        setAlert({ show: true, message: "Could not pinpoint restaurant on map." });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setCoordinates(null); // Fallback to default map location
      setMapLoadingError(true); // Indicate an error in fetching coordinates
      setAlert({ show: true, message: "Failed to load map location due to a network error." });
    }
  };

  // Fetch coordinates on component mount or when fullAddress/props change
  useEffect(() => {
    if (fullAddress?.trim()) {
      fetchCoordinates(fullAddress);
    }
  }, [fullAddress, propLat, propLng]); // Include propLat and propLng as dependencies

  /**
   * Copies the full address to the clipboard.
   */
  const copyToClipboard = () => {
    if (fullAddress && fullAddress !== "Restaurant, Address not available") {
      navigator.clipboard
        .writeText(fullAddress)
        .then(() => setAlert({ show: true, message: "Address copied to clipboard!" }))
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          setAlert({ show: true, message: "Failed to copy address." });
        });
    } else {
      setAlert({ show: true, message: "No valid address available to copy." });
    }
  };

  /**
   * Opens Google Maps in a new tab with directions to the restaurant address.
   */
  const handleDirection = () => {
    if (coordinates) {
      // Prefer using precise coordinates for directions
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=&travelmode=driving`;
      window.open(googleMapsUrl, "_blank");
    } else if (fullAddress && fullAddress !== "Restaurant, Address not available") {
      // Fallback to searching by address if coordinates aren't available
      const formattedAddress = encodeURIComponent(fullAddress);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      setAlert({ show: true, message: "Address not available for directions." });
      console.error("Full address or coordinates not available for directions.");
    }
  };

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Default map center (e.g., a central location in India as per current context)
  // This will be used if specific coordinates aren't available or fail to load.
  const defaultMapCenter = [20.5937, 78.9629]; // Coordinates for center of India

  return (
    <>
      <div className={css.outerDiv}>
        <div className={css.innerDiv}>
          <div className={css.header}>
            <h2 className={css.htxt}>Contact Information</h2>
            <div className={css.phone}>
              {phoneNo !== "N/A" ? (
                <a href={`tel:${phoneNo}`} aria-label={`Call ${name} at ${phoneNo}`}>
                  {phoneNo}
                </a>
              ) : (
                <span aria-label="Phone number not available">{phoneNo}</span>
              )}
            </div>
          </div>

          <div className={css.direction}>
            <h2 className={css.htxt}>Location & Directions</h2>

            {mapLoadingError && !coordinates && ( // Show error message only if no coordinates could be found
              <div className={css.mapErrorMessage}>
                <p>
                  Sorry, we couldn't load the exact location on the map for this address.
                  {fullAddress !== "Restaurant, Address not available" && ` Showing default location.`}
                </p>
                <p>Please use the address below or "Get Directions" button for navigation.</p>
              </div>
            )}

            <MapContainer
              center={coordinates ? [coordinates.lat, coordinates.lng] : defaultMapCenter}
              zoom={coordinates ? 15 : 8} // Zoom in closer if specific coordinates are found, else wider for default
              style={{ height: "250px", width: "100%", zIndex: 1, borderRadius: "8px", overflow: "hidden" }}
              className={css.mapContainer} // For additional styling
              key={coordinates ? `${coordinates.lat}-${coordinates.lng}` : 'default-map'} // Key to re-render map if center changes
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {coordinates && (
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>
                    **{name}**
                    <br />
                    {address}
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            <div className={css.addTxt}>{fullAddress}</div>
          </div>

          <div className={css.btns}>
            <BtnWithIcon
              icon={copyIcon}
              txt="Copy Address"
              onClick={copyToClipboard}
              aria-label="Copy restaurant address to clipboard"
            />
            <BtnWithIcon
              icon={directionIcon}
              txt="Get Directions"
              onClick={handleDirection}
              aria-label="Open Google Maps for directions"
            />
          </div>
        </div>
      </div>

      {alert.show && (
        <AlertBox
          text={alert.message}
          setClose={() => setAlert({ show: false, message: "" })} // Reset message when closing
          stateVal="show"
        />
      )}
    </>
  );
};

export default OverviewAboutCard;