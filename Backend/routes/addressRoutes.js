const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const {
  createAddresses,
  getAddressesByCity,
  getAddressesByLocality,
  getLocationData,
} = require("../controller/addressController");

router.post("/api/addresses", createAddresses);
router.get("/api/addresses/:city", getAddressesByCity);
router.get("/api/addresses/locality/:locality", getAddressesByLocality);
router.get("/api/location", getLocationData);
// Create a new address
// router.post("/api/post/addresses", async (req, res) => {
//   try {
//     const { address, service_area, location } = req.body;

//     if (!address || !service_area) {
//       return res.status(400).json({
//         success: false,
//         message: "Address and service_area are required.",
//       });
//     }

//     const newAddress = new Address({
//       address,
//       service_area,
//       location, // Optional: Only include if location is sent (with type and coordinates)
//     });

//     await newAddress.save();
//     return res.status(201).json({ success: true, data: newAddress });
//   } catch (error) {
//     console.error("Error creating address:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.post("/api/post/addresses", async (req, res) => {
//   try {
//     let { address, service_area, location } = req.body;

//     if (!address || !service_area) {
//       return res.status(400).json({
//         success: false,
//         message: "Address and service_area are required.",
//       });
//     }

//     // ✅ Extract only the first part before comma
//     const trimmedAddress = address.split(",")[0].trim();

//     const newAddress = new Address({
//       address: trimmedAddress,
//       service_area,
//       location, // Optional
//     });

//     await newAddress.save();
//     return res.status(201).json({ success: true, data: newAddress });
//   } catch (error) {
//     console.error("Error creating address:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

module.exports = router;
