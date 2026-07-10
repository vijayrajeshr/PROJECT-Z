// import { useState, useEffect } from "react";

// const LiveLocation = () => {
//     const [latitude, setLatitude] = useState(null);
//     const [longitude, setLongitude] = useState(null);
//     const [address, setAddress] = useState("Fetching location...");
//     const LOCATIONIQ_API_KEY = "pk.44b3e3e47fc068a76bb23d989e281dff";

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLatitude(latitude);
//                     setLongitude(longitude);
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                     setAddress("Location access denied or unavailable.");
//                 },
//                 { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//             );
//         } else {
//             setAddress("Geolocation is not supported by this browser.");
//         }
//     }, []);

//     useEffect(() => {
//         if (latitude && longitude) {
//             const fetchAddress = async () => {
//                 const url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

//                 try {
//                     const response = await fetch(url);
//                     if (!response.ok) throw new Error("Failed to fetch location data");

//                     const data = await response.json();
//                     if (data.display_name) {
//                         setAddress(data.display_name);
//                     } else {
//                         setAddress("Could not retrieve an exact address.");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching address:", error);
//                     setAddress("Unable to fetch address.");
//                 }
//             };

//             fetchAddress();
//         }
//     }, [latitude, longitude]);

//     return (
//         <div>
//             <h3>Live Address:</h3>
//             <p>{address}</p>
//             {latitude && longitude && (
//                 <p>
//                     <strong>Latitude:</strong> {latitude}, <strong>Longitude:</strong> {longitude}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default LiveLocation;

import { useState, useEffect } from "react";

const LiveLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState("Fetching location...");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                    setError(null);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError(error.message);
                    setAddress("Location access denied or unavailable.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setAddress("Geolocation is not supported by this browser.");
            setError("Geolocation not supported");
        }
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            const fetchAddress = async () => {
                const apiKey = '5862e60450fe8c717230595391e2a3aa'; // Replace with your Positionstack API key
                const url = `http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${latitude},${longitude}`; // HTTP is okay for free tier

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();

                    if (data.data && data.data.length > 0) {
                        setAddress(data.data[0].label); // Use the 'label' property for a nicely formatted address
                    } else {
                        setAddress("Could not retrieve an exact address.");
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setAddress("Unable to fetch address.");
                    setError(error.message);
                }
            };

            fetchAddress();
        }
    }, [latitude, longitude]);

    return (
        <div>
            <h3>Live Address:</h3>
            <p>{address}</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {latitude && longitude && (
                <p>
                    <strong>Latitude:</strong> {latitude}, <strong>Longitude:</strong> {longitude}
                </p>
            )}
        </div>
    );
};

export default LiveLocation;