let locationErrorShown = false;
export const detectLocation = async (setLocation) => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  try {
    // Check permission state first
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permissionStatus.state === "denied") {
        alert(
          "Location access is blocked. Please allow location access in your browser settings:\n" +
            "1. Click the lock icon in the address bar.\n" +
            "2. Go to Site Settings or Permissions.\n" +
            "3. Set Location to 'Allow' and refresh the page."
        );
        return;
      }
      if (permissionStatus.state === "granted") {
        console.log("Location access already granted.");
      } else {
        console.log("Prompting for location access.");
      }
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude } = position.coords;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`;
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "YourAppName/1.0 (contact@yourdomain.com)", // Add User-Agent for Nominatim
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    console.log("API Response:", data);

    let locationData = { latitude, longitude };

    if (data.address) {
      const address = formatAddress(data.address); // Ensure formatAddress is defined
      console.log(`Detected Address: ${address}`);
      locationData.address = address;
    } else if (data.display_name) {
      console.log(`Using display_name: ${data.display_name}`);
      locationData.address = data.display_name;
    } else {
      console.error("Address data is missing");
      alert("Could not retrieve address. Please try again.");
      locationData.address = "Unknown location";
    }

    setLocation(locationData);
  } catch (error) {
    console.error("Error detecting location:", error);
    let message = "An unknown error occurred while detecting location.";
    if (error.code) {
      const errorMessages = {
        1:
          "Location access denied. Please allow location access in your browser settings:\n" +
          "1. Click the lock icon in the address bar.\n" +
          "2. Go to Site Settings or Permissions.\n" +
          "3. Set Location to 'Allow' and refresh the page.",
        2: "Location information is unavailable. Ensure location services are enabled on your device.",
        3: "The request to get user location timed out. Please try again.",
      };
      message = errorMessages[error.code] || message;
    }
    //
    if (!locationErrorShown) {
      alert(message);
      locationErrorShown = true;
    }
  }
};

// // Helper function to format the address from detailed components
const formatAddress = (address) => {
  const parts = [];
  if (address.house_number) parts.push(address.house_number);
  if (address.road) parts.push(address.road);
  if (address.neighbourhood) parts.push(address.neighbourhood);
  if (address.suburb) parts.push(address.suburb);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postcode) parts.push(address.postcode);
  if (address.country) parts.push(address.country);
  return parts.filter(Boolean).join(", ");
};

// let locationErrorShown = false;

// export const detectLocation = async (setLocation) => {
//   if (!navigator.geolocation) {
//     alert("Geolocation is not supported by this browser.");
//     return;
//   }

//   try {
//     if (navigator.permissions) {
//       const permissionStatus = await navigator.permissions.query({
//         name: "geolocation",
//       });

//       if (permissionStatus.state === "denied") {
//         alert(
//           "Location access is blocked. Please allow location access in your browser settings:\n" +
//             "1. Click the lock icon in the address bar.\n" +
//             "2. Go to Site Settings or Permissions.\n" +
//             "3. Set Location to 'Allow' and refresh the page."
//         );
//         return;
//       }
//     }

//     const position = await new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(resolve, reject, {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       });
//     });

//     const { latitude, longitude } = position.coords;

//     const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`;
//     const response = await fetch(apiUrl, {
//       headers: {
//         "User-Agent": "YourAppName/1.0 (contact@yourdomain.com)",
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch location data");

//     const data = await response.json();

//     let address;
//     if (data.address) {
//       address = formatAddress(data.address);
//     } else if (data.display_name) {
//       address = data.display_name;
//     } else {
//       alert("Could not retrieve address. Please try again.");
//       address = "Unknown location";
//     }

//     const locationData = {
//       address,
//       service_area:
//         data.address?.city ||
//         data.address?.state ||
//         data.address?.country ||
//         "Unknown",
//       location: {
//         type: "Point",
//         coordinates: [longitude, latitude],
//       },
//     };

//     setLocation(locationData); // Optional: update local state

//     // 👉 POST to backend to save the address
//     const saveResponse = await fetch("/api/post/addresses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(locationData),
//     });

//     if (!saveResponse.ok) {
//       const err = await saveResponse.json();
//       throw new Error(err.message || "Failed to save address");
//     }

//     const savedData = await saveResponse.json();
//     console.log("Address saved successfully:", savedData.data);
//     alert("Location saved successfully!");
//   } catch (error) {
//     console.error("Location error:", error);
//     let message = "An unknown error occurred while detecting location.";
//     if (error.code) {
//       const errorMessages = {
//         1: "Location access denied. Please allow location access in your browser settings.",
//         2: "Location information is unavailable.",
//         3: "The request to get user location timed out.",
//       };
//       message = errorMessages[error.code] || message;
//     }

//     if (!locationErrorShown) {
//       alert(message);
//       locationErrorShown = true;
//     }
//   }
// };

// // 🔧 Helper to format a clean address string
// const formatAddress = (address) => {
//   const parts = [];
//   if (address.house_number) parts.push(address.house_number);
//   if (address.road) parts.push(address.road);
//   if (address.neighbourhood) parts.push(address.neighbourhood);
//   if (address.suburb) parts.push(address.suburb);
//   if (address.city) parts.push(address.city);
//   if (address.state) parts.push(address.state);
//   if (address.postcode) parts.push(address.postcode);
//   if (address.country) parts.push(address.country);
//   return parts.filter(Boolean).join(", ");
// };
