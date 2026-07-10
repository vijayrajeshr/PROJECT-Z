const mongoose = require("mongoose");
const Firm = require("../../models/Firm");

exports.additionalOutletSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const { restaurantInfo } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Firm.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update SocialMediaLinks if provided
    if (restaurantInfo && restaurantInfo.SocialMediaLinks) {
      // Validate URLs manually before setting (optional, since schema validation exists)
      const socialLinks = restaurantInfo.SocialMediaLinks;
      for (const [platform, url] of Object.entries(socialLinks)) {
        if (url && !/^https?:\/\//.test(url)) {
          return res
            .status(400)
            .json({ message: `Invalid URL for ${platform}` });
        }
      }
      restaurant.restaurantInfo.SocialMediaLinks = new Map(
        Object.entries(socialLinks).filter(([_, url]) => url) // Filter out empty URLs
      );
    }

    await restaurant.save();
    return res.status(200).json({
      message: "Updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({
      message: "Failed to update restaurant",
      error: error.message,
    });
  }
};

exports.updateRestaurantsDetails = async (req, res) => {
  try {
    const {
      email,
      phoneNo, // local number (e.g., 9876543210)
      countryCode, // e.g., +91
      fullNumber, // e.g., +919876543210
      name,
      category,
      address,
      serviceClouserDay,
      operatingTimes,
      additionalSettings,
    } = req.body;
    console.log(req.body, "items");
    // Validate required fields
    if (!name || !email || !phoneNo || !countryCode || !fullNumber) {
      return res
        .status(400)
        .json({ message: "Firm name, email, and phone number are required" });
    }

    // Validate email format
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Phone number validations
    if (!/^\+\d{1,4}$/.test(countryCode)) {
      return res.status(400).json({ message: "Invalid country code format" });
    }

    if (!/^\d{6,15}$/.test(phoneNo)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const expectedFullNumber = `${countryCode}${phoneNo}`;
    if (fullNumber !== expectedFullNumber) {
      return res.status(400).json({ message: "Phone number mismatch" });
    }

    if (!/^\+\d{6,15}$/.test(fullNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid full phone number format" });
    }

    // Flatten and validate category
    const flattenedCategory = Array.isArray(category) ? category.flat() : [];
    if (flattenedCategory.length !== 1 && flattenedCategory.length !== 2) {
      return res.status(400).json({ message: "Invalid category format" });
    }
    if (!flattenedCategory.every((item) => ["veg", "non-veg"].includes(item))) {
      return res.status(400).json({ message: "Invalid category values" });
    }

    const firm = await Firm.findById(req.params.id);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    // Check for unique firm name (if changed)
    if (name !== firm.restaurantInfo.name) {
      const existingFirm = await Firm.findOne({
        "restaurantInfo.name": name,
      });
      if (existingFirm) {
        return res.status(400).json({ message: "Firm name already exists" });
      }
    }

    // Update firm info
    firm.ownerEmail = email;
    firm.restaurantInfo = {
      name,
      category: flattenedCategory || "",
      address: address || "",
      phoneNo,
    };
    // Save owner phone as an object
    firm.ownerPhoneNo = {
      countryCode,
      number: phoneNo,
      fullNumber,
    };

    // Save closure days
    firm.serviceClouserDay = Array.isArray(serviceClouserDay)
      ? serviceClouserDay.map((date) => new Date(date))
      : [];

    // Save operating times
    firm.operatingTimes = {
      Monday: operatingTimes?.Monday || { open: "", close: "" },
      Tuesday: operatingTimes?.Tuesday || { open: "", close: "" },
      Wednesday: operatingTimes?.Wednesday || { open: "", close: "" },
      Thursday: operatingTimes?.Thursday || { open: "", close: "" },
      Friday: operatingTimes?.Friday || { open: "", close: "" },
      Saturday: operatingTimes?.Saturday || { open: "", close: "" },
      Sunday: operatingTimes?.Sunday || { open: "", close: "" },
    };

    // Save additional settings
    firm.additionalSettings = {
      catering: Boolean(additionalSettings?.catering),
      houseParty: Boolean(additionalSettings?.houseParty),
      specialEvents: Boolean(additionalSettings?.specialEvents),
      freeDelivery: additionalSettings?.freeDelivery || "",
      deliveryDetails: additionalSettings?.deliveryDetails || "",
      deliveryCity: additionalSettings?.deliveryCity || "",
      specialMealDay: additionalSettings?.specialMealDay || "",
    };

    await firm.save();

    res.status(200).json({
      message: "Firm details updated successfully",
      data: {
        id: firm._id,
        email: firm.ownerEmail,
        phoneNo: firm.ownerPhoneNo,
        name: firm.restaurantInfo.name,
        category: firm.restaurantInfo.category,
        address: firm.restaurantInfo.address,
        serviceClouserDay: firm.serviceClouserDay,
        operatingTimes: firm.operatingTimes,
        additionalSettings: firm.additionalSettings,
      },
    });
  } catch (error) {
    console.error("Error updating firm:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
