// const Address = require("../models/Address");

// // City normalization function
// const normalizeCityName = (city) => {
//   city = city.trim().toLowerCase();
//   const cityMap = {
//     // "new delhi": "delhi",
//     delhi: "delhi",
//     ncr: "delhi",
//     gurgaon: "gurugram",
//     gurugram: "gurugram",
//     bangalore: "bengaluru",
//     bengaluru: "bengaluru",
//     mumbai: "mumbai",
//     bombay: "mumbai",
//     pune: "pune",
//     hyderabad: "hyderabad",
//     chennai: "chennai",
//     kolkata: "kolkata",
//     calcutta: "kolkata",
//     Howrah: "howrah",
//     jaipur: "jaipur",
//   };
//   return cityMap[city] || city;
// };

// // Create new address
// exports.createAddresses = async (req, res) => {
//   try {
//     const addresses = req.body;
//     if (!Array.isArray(addresses) || addresses.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "An array of addresses is required" });
//     }

//     for (const { address, service_area } of addresses) {
//       if (!address || !service_area) {
//         return res.status(400).json({
//           message: "Each address must have address and service area",
//         });
//       }
//     }

//     const newAddresses = await Address.insertMany(addresses);
//     res
//       .status(201)
//       .json({ message: "Addresses saved successfully", newAddresses });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Error saving addresses", error });
//   }
// };

// // show all subcity name and count all restaurent
// exports.getAddressesByCity = async (req, res) => {
//   try {
//     let city = req.params.city;
//     city = normalizeCityName(city);
//     const cityPattern = new RegExp(city, "i");
//     const localityCounts = await Address.aggregate([
//       { $match: { service_area: cityPattern } },
//       {
//         $addFields: {
//           locality: {
//             $trim: { input: { $first: { $split: ["$address", ","] } } },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$locality",
//           name: { $first: "$locality" },
//           count: { $sum: 1 },
//           sampleAddress: { $first: "$address" },
//         },
//       },
//       { $sort: { count: -1 } },
//     ]);

//     if (localityCounts.length === 0) {
//       return res
//         .status(404)
//         .json({ message: `No addresses found in ${city}`, data: [] });
//     }

//     res.status(200).json(localityCounts);
//   } catch (error) {
//     console.error(`Error fetching addresses for ${req.params.city}:`, error);
//     res.status(500).json({
//       message: `Error fetching addresses for ${req.params.city}`,
//       error: error.message,
//     });
//   }
// };

// exports.getAddressesByLocality = async (req, res) => {
//   try {
//     const addresses = await Address.find({
//       address: new RegExp(`^${req.params.locality}\\b`, "i"),
//     });
//     res.status(200).json(addresses);
//   } catch (error) {
//     console.error("Error fetching locality addresses:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // // // all City Fetch Automatically at user side
// // exports.getLocationData = async (req, res) => {
// //   try {
// //     // Step 1: Get the IP address of the client
// //     const ipResponse = await fetch("https://get.geojs.io/v1/ip.json");
// //     const ipData = await ipResponse.json();
// //     const ip = ipData.ip;
// //     // Step 2: Use the IP to get full location data with lat/lon
// //     const geoResponse = await fetch(
// //       `https://get.geojs.io/v1/ip/geo/${ip}.json`
// //     );
// //     const geoData = await geoResponse.json();
// //     if (geoData.error) {
// //       console.error("GeoJS Error:", geoData);
// //       return res.status(429).json({ error: geoData.message });
// //     }

// //     const locationData = {
// //       city: geoData.city || "Unknown City",
// //       state: geoData.region || "Unknown State",
// //       country: geoData.country || "Unknown Country",
// //       lat: geoData.latitude,
// //       lon: geoData.longitude,
// //     };

// //     const newAddress = new Address({
// //       address: geoData.city,
// //       service_area: geoData.city,
// //       coordinates: {
// //         type: "Point",
// //         coordinates: [
// //           parseFloat(geoData.longitude),
// //           parseFloat(geoData.latitude),
// //         ],
// //       },
// //     });
// //     await newAddress.save();

// //     res.json(locationData);
// //   } catch (error) {
// //     console.error("Error fetching location:", error);
// //     res.status(500).json({ error: "Error fetching location" });
// //   }
// // };

exports.getLocationData = async (req, res) => {
  try {
    // Step 1: Get the IP address of the client
    const ipResponse = await fetch("https://get.geojs.io/v1/ip.json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // Step 2: Use the IP to get full location data with lat/lon
    const geoResponse = await fetch(
      `https://get.geojs.io/v1/ip/geo/${ip}.json`
    );
    const geoData = await geoResponse.json();

    if (geoData.error) {
      console.error("GeoJS Error:", geoData);
      return res.status(429).json({ error: geoData.message });
    }

    const lat = parseFloat(geoData.latitude);
    const lon = parseFloat(geoData.longitude);

    const locationData = {
      city: geoData.city || "Unknown City",
      state: geoData.region || "Unknown State",
      country: geoData.country || "Unknown Country",
      lat,
      lon,
    };

    // ✅ Check if address already exists by address and coordinates
    const existingAddress = await Address.findOne({
      address: geoData.city,
      "location.coordinates": [lon, lat],
    });

    if (!existingAddress) {
      const newAddress = new Address({
        address: geoData.city,
        service_area: geoData.city,
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      });
      await newAddress.save();
    }

    res.json(locationData);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Error fetching location" });
  }
};

const Address = require("../models/Address");
const User = require("../models/user");

// City normalization function
const normalizeCityName = (city) => {
  city = city.trim().toLowerCase();
  const cityMap = {
    // "new delhi": "delhi",
    delhi: "delhi",
    ncr: "delhi",
    gurgaon: "gurugram",
    gurugram: "gurugram",
    bangalore: "bengaluru",
    bengaluru: "bengaluru",
    mumbai: "mumbai",
    bombay: "mumbai",
    pune: "pune",
    hyderabad: "hyderabad",
    chennai: "chennai",
    kolkata: "kolkata",
    calcutta: "kolkata",
    jaipur: "jaipur",
  };
  return cityMap[city] || city;
};

// Create new address
exports.createAddresses = async (req, res) => {
  try {
    const addresses = req.body;
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res
        .status(400)
        .json({ message: "An array of addresses is required" });
    }

    for (const { address, service_area } of addresses) {
      if (!address || !service_area) {
        return res.status(400).json({
          message: "Each address must have address and service area",
        });
      }
    }

    const newAddresses = await Address.insertMany(addresses);
    res
      .status(201)
      .json({ message: "Addresses saved successfully", newAddresses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error saving addresses", error });
  }
};

// show all subcity name and count all restaurent
exports.getAddressesByCity = async (req, res) => {
  try {
    let city = req.params.city;
    // Assuming normalizeCityName is defined (it is defined later in your file)
    city = normalizeCityName(city); 
    const cityPattern = new RegExp(city, "i");
    
    // The aggregation pipeline runs a search on the service_area field (the city)
    // and then groups all addresses by the first part of the address (the locality name).
    const localityCounts = await Address.aggregate([
      { $match: { service_area: cityPattern } },
      {
        $addFields: {
          locality: {
            // Extract the locality (first segment before the comma) and trim spaces
            $trim: { input: { $first: { $split: ["$address", ","] } } },
          },
        },
      },
      {
        $group: {
          _id: "$locality", // Group by the unique locality name
          name: { $first: "$locality" }, // Keep the locality name
          count: { $sum: 1 }, // Count the number of addresses (restaurants) in this locality
        },
      },
      { $sort: { count: -1 } },
      { // FINAL STAGE: Shape the output data
        $project: {
          _id: 0, // Exclude the MongoDb _id
          place: "$name", // Rename 'name' (which is the locality) to 'place' for the frontend
          count: 1, // Include the count
        },
      },
    ]);

    // If no localities found, return 200 OK with an empty array
    if (localityCounts.length === 0) {
      return res.status(200).json([]); 
    }


    res.status(200).json(localityCounts);
  } catch (error) {
    console.error(`Error fetching addresses for ${req.params.city}:`, error);
    res.status(500).json({
      message: `Error fetching addresses for ${req.params.city}`,
      error: error.message,
    });
  }
};

exports.CreateUserAddress = async (req, res) => {
  try {
    const addresses = req.body;

    // Validate: must be an array
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ message: "Array of address objects is required" });
    }

    // Validate user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attach user ID to each address
    const addressesWithUser = addresses.map(addr => ({
      ...addr,
      user: req.user.id
    }));

    // Save all addresses
    const saved = await Address.insertMany(addressesWithUser);

    res.status(201).json({
      message: "Addresses saved successfully",
      addresses: saved
    });
  } catch (error) {
    console.error("Error saving user addresses:", error);
    res.status(500).json({ message: "Error saving address", error: error.message });
  }
};

exports.getUserSavedAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" })
    const addresses = await Address.find({ user: req.user.id });
    res.status(200).json(addresses);
  }
  catch (error) {
    console.error(`Error fetching user saved address:`, error);
    res.status(500).json({ message: "Error fetching address", error: error.message });
  }
}

exports.deleteUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    // Validate user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find and delete the address
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user.id, // Ensure the address belongs to the current user
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address deleted successfully", deletedAddress });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Error deleting address", error: error.message });
  }
};
exports.editUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updatedData = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingAddress = await Address.findOne({
      _id: addressId,
      user: req.user.id,
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found or not authorized" });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};
exports.getAddressesByLocality = async (req, res) => {
  try {
    const addresses = await Address.find({
      address: new RegExp(`^${req.params.locality}\\b`, "i"),
    });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching locality addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // all City Fetch Automatically at user side
// exports.getLocationData = async (req, res) => {
//   try {
//     // Step 1: Get the IP address of the client
//     const ipResponse = await fetch("https://get.geojs.io/v1/ip.json");
//     const ipData = await ipResponse.json();
//     const ip = ipData.ip;
//     console.log(ip);
//     // Step 2: Use the IP to get full location data with lat/lon
//     const geoResponse = await fetch(
//       `https://get.geojs.io/v1/ip/geo/${ip}.json`
//     );
//     const geoData = await geoResponse.json();
//     if (geoData.error) {
//       console.error("GeoJS Error:", geoData);
//       return res.status(429).json({ error: geoData.message });
//     }

//     const locationData = {
//       city: geoData.city || "Unknown City",
//       state: geoData.region || "Unknown State",
//       country: geoData.country || "Unknown Country",
//       lat: geoData.latitude,
//       lon: geoData.longitude,
//     };

//     res.json(locationData);
//   } catch (error) {
//     console.error("Error fetching location:", error);
//     res.status(500).json({ error: "Error fetching location" });
//   }
// };
