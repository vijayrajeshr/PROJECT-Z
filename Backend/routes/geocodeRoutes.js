const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { address, limit = 1 } = req.query;

    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "Address required" });
    }

    const openCageApiKey = "2fe6302d9d304ad5bf5520116c8f75ad";
    const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${openCageApiKey}`;

    const response = await fetch(openCageUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng,
        displayName: data.results[0].formatted,
      };
      return res.status(200).json(result);
    }

    return res.status(404).json({ error: "No coordinates found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
