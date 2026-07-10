const Firm = require("../models/Firm");
const Tiffin = require("../models/Tiffin");
const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const RestaurantOffers = require("../models/RestaurantsDasModel/Offer");
const path = require("path");
const cron = require("node-cron"); // Import node-cron
const { query } = require("express");
// const Features = require("../models/Features");
const Reviews = require("../models/Reviews");
const { error } = require("console");
const mongoose = require("mongoose");
const historyLogRecorder = require("../models/historyLog");
const validateRestaurant = require("../middleware/validate");
const Notify = require("../models/logs/notify");
const RestaurantDocument = require("../models/FirmDocuments");
const auth = require("../middleware");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); //Folder where the images uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Generating a unique file name
  },
});
const upload = multer({ storage: storage });

// function to add a firm ????
// const addFirm = async (req, res) => {
//   //Just adding the required thinngs in the process , other data linke location , video can be stored later
//   try {
//     const { firmName, area, category, phone, city, offer } = req.body;
//     const image = req.file ? req.file.filename : undefined;

//     const vendor = await User.findById(req.vendorId);
//     if (!vendor) {
//       res.status(404).json({ message: "Vendor Not Found" });
//     }
//     if (vendor.firm.length > 0) {
//       res.status(400).json({ message: "One Vendor Can Have Only One Firm" });
//     }
//     const firm = new Firm({
//       firmName,
//       area,
//       category,
//       phone,
//       city,
//       offer,
//       image,
//       vendor: vendor._id,
//     });
//     const savedFirm = await firm.save();
//     const firmId = savedFirm._id;
//     vendor.firm.push(savedFirm);
//     await vendor.save();
//     return res.status(200).json({ message: "Firm Added Successfully", firmId });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// API handler
const getSimilarRestaurants = async (req, res) => {
  try {
    const { restaurantId, cursor } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Missing restaurantId",
      });
    }

    const { data, nextCursor } = await findSimilarRestaurants(
      restaurantId,
      cursor
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No similar restaurants found with 80% or higher match",
      });
    }

    res.status(200).json({
      success: true,
      totalResults: data.length,
      data,
      nextCursor, // Send cursor for pagination
    });
  } catch (error) {
    console.error("Error finding similar restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to fetch data.",
      error: error.message,
    });
  }
};

const excelBulkUpload = async (req, res, next) => {
  try {
    let restaurantInfo = req.body;

    // Validate and transform restaurant data
    const validatedData = restaurantInfo.map((obj) => {
      const { error, value } = validateRestaurant.validate(obj, {
        abortEarly: false,
      });

      if (error) {
        const errorMessages = error.details
          .map((err) => err.message)
          .join(", ");
        throw new Error(`Validation errors: ${errorMessages}`);
      }

      return {
        ...value,
        cuisines: value.cuisines.split(/,\s*/),
        dietary: value.dietary.split(/,\s*/),
        category: value.category.split(/,\s*/),
      };
    });

    // Simulate database operation
    const allFirm = await Firm.insertMany(validatedData);
    if (allFirm) {
      console.log("We got the firms", allFirm);
    }
    res.status(200).json({ message: "Data successfully saved", data: allFirm });
  } catch (err) {
    // Handle Joi errors within the same middleware
    if (err.isJoi || err.message.includes("Validation errors")) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// function to search firm by firm name  +++
const searchFirmByName = async (req, res) => {
  try {
    const { firmName } = req.query;
    if (!firmName) {
      return res
        .status(400)
        .json({ message: "Please provide a firmName to search." });
    }
    const firms = await Firm.find({
      firmName: { $regex: firmName, $options: "i" },
    }).select("restaurantInfo.name address");
    // .populate("Reviews")
    // .populate({
    //   path: "menu.menuTabs.sections.items",
    //   model: "MenuItem",
    // });

    if (firms.length === 0) {
      return res
        .status(404)
        .json({ message: "No firms found matching the search criteria." });
    }

    res.status(200).json({ firms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// function to delete firm +++
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) {
      return res.status(404).json({ error: "Firm Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// function to find veg resturants ---
const pureVegFirms = async (req, res) => {
  try {
    // console.log("I get hitted");
    const { cursor, limit = 10, itemLimit = 30 } = req.query;
    const parsedLimit = parseInt(limit, 10) || 10; // Ensure limit is a valid number

    let query = { category: { $size: 1, $all: ["veg"] } };
    // let itemLimit = 30;

    if (cursor) {
      query._id = { $gt: cursor }; // Convert cursor to ObjectId
    }

    const firms = await Firm.find(query)
      .limit(parsedLimit)
      // .populate({
      //   path: "menu.menuTabs.sections.items",
      //   model: "MenuItem",
      //   strictPopulate: false, // Prevent errors if some fields are null
      //   options: { limit: parseInt(itemLimit) }, // Limit menu items per section
      // })
      .sort({ _id: 1 });

    // console.log(firms);

    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//filter by rating +++
const filterFirmsByRating = async (req, res) => {
  try {
    const { rating, cursor, limit = 10 } = req.query;
    // const { rating, limit = 10 } = req.query;
    console.log(rating);
    if (!rating) {
      return res
        .status(400)
        .json({ message: "Please select a rating filter." });
    }

    const ratingThreshold = parseFloat(rating);
    if (isNaN(ratingThreshold) || ![3.5, 4.0, 4.5].includes(ratingThreshold)) {
      return res.status(400).json({
        message: "Invalid rating option. Please select 3.5, 4.0, or 4.5.",
      });
    }
    let query = { "ratings.overall": { $gte: ratingThreshold } };
    // if (cursor) query._id = { $gt: cursor };

    const firms = await Firm.find(query).limit(parseInt(limit));
    // .sort({ _id: 1 });
    if (!firms) {
      return res.status(404).json({ message: "No firms found." });
    }
    res.status(200).json({
      firms,
      // nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//filrer by offers count +++
const filterFirmsWithOffers = async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;
    let query = { offer: { $exists: true, $ne: [] } };
    if (cursor) query._id = { $gt: cursor };
    const firms = await Firm.find(query)
      .limit(parseInt(limit))
      .populate("Offer")
      .sort({ _id: 1 });
    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//??????
const filterFirmsByCuisines = async (req, res) => {
  try {
    const { cuisines, cursor, limit = 10 } = req.query;
    if (!cuisines)
      return res
        .status(400)
        .json({ message: "Please select at least one cuisine to filter." });
    const cuisinesArray = Array.isArray(cuisines) ? cuisines : [cuisines];
    let query = { cuisines: { $in: cuisinesArray } };
    if (cursor) query._id = { $gt: cursor };
    const firms = await Firm.find(query)
      .limit(parseInt(limit))
      .sort({ _id: 1 });
    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//filter by dietary +++
const filterFirmByDietary = async (req, res) => {
  try {
    const { dietary, cursor, limit = 10 } = req.query;
    if (!dietary)
      return res
        .status(400)
        .json({ message: "Please select at least one dietary preference." });
    const dietaryArray = Array.isArray(dietary) ? dietary : [dietary];
    let query = { dietary: { $in: dietaryArray } };
    if (cursor) query._id = { $gt: cursor };
    const firms = await Firm.find(query)
      .limit(parseInt(limit))
      .sort({ _id: 1 });
    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//??? popularity on which basis
const sortFirmsByPopularity = async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;
    let query = {};
    if (cursor) query._id = { $gt: cursor };
    const firms = await Firm.find(query)
      .limit(parseInt(limit))
      .sort({ popularity: -1 });
    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//apply many filters +++
const filterFirms = async (req, res) => {
  try {
    const {
      firmName,
      category,
      cuisines,
      dietary,
      minRating,
      sortByPopularity,
      offer,
      pureVeg,
      cursor,
      limit = 10,
    } = req.query;
    let filter = {};
    if (firmName) filter.firmName = { $regex: firmName, $options: "i" };
    if (category)
      filter.category = {
        $all: Array.isArray(category) ? category : [category],
      };
    if (cuisines)
      filter.cuisines = {
        $in: Array.isArray(cuisines) ? cuisines : [cuisines],
      };
    if (dietary)
      filter.dietary = { $in: Array.isArray(dietary) ? dietary : [dietary] };
    if (minRating) filter.ratings = { $gte: parseFloat(minRating) };
    if (offer === "true") filter.offer = { $exists: true, $ne: "" };
    if (pureVeg === "true") filter.category = { $all: ["veg"] };
    if (cursor) filter._id = { $gt: cursor };
    let sort = {};
    if (sortByPopularity === "true") sort.popularity = -1;
    const firms = await Firm.find(filter).limit(parseInt(limit)).sort(sort);
    res.status(200).json({
      firms,
      nextCursor: firms.length ? firms[firms.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// In firmController.js - update the addRestaurant function
const addRestaurant = async (req, res) => {
  console.log("We are inside addRestaurant");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  try {
    const {
      firmName,
      ownerName,
      phoneNo,
      ownerEmail,
      ownerPhone,
      location,
      shopNo,
      floorLevel,
      area,
      city,
      landmark,
      category,
      services,
      cuisines,
      longitude,
      latitude,
      termsAccepted,
    } = req.body;

    // Validate restaurant name
    if (!firmName || firmName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
      });
    }

    // Handle array fields
    let cuisineArray = [];
    if (Array.isArray(cuisines)) {
      cuisineArray = cuisines;
    } else if (cuisines) {
      cuisineArray = [cuisines];
    }

    let featuresArray = [];
    if (Array.isArray(services)) {
      featuresArray = services;
    } else if (services) {
      featuresArray = [services];
    }

    // Constructing the full address
    const fullAddress = `${shopNo ? `Shop ${shopNo}, ` : ""}${
      floorLevel ? `Floor ${floorLevel}, ` : ""
    }${area ? `${area}, ` : ""}${city ? `${city}` : ""}${
      landmark ? `, near ${landmark}` : ""
    }`;

    // Handle image URL if file was uploaded - FIXED PATH
    const imageUrls = [];
    if (req.file) {
      // Use the correct path based on your Multer configuration
      imageUrls.push(`/uploads/restaurants/${req.file.filename}`);
    }

    // Create new restaurant document
    const newRestaurant = new Firm({
      ownerName,
      ownerEmail,
      ownerPhone,
      newlyAdded: true,
      termsAccepted: true,
      termsAcceptedDate: new Date(),
      registrationStatus: "completed",
      restaurantInfo: {
        name: firmName,
        phoneNo: phoneNo,
        address: fullAddress,
        area: area,
        city: city,
        category: category === "both" ? ["veg", "non-veg"] : [category?.toLowerCase() || "veg"],
        cuisines: cuisineArray,
        additionalInfo: {
          ownerName: ownerName || "",
          ownerEmail: ownerEmail || "",
          ownerPhone: ownerPhone || "",
        },
      },
      features: featuresArray,
      popularity: 0,
      source_url: "web_registration",
      latitude: latitude || 43.6534627,
      longitude: longitude || -79.4276471,
      image_urls: imageUrls, // This should now contain the correct path
      location: {
        type: "Point",
        coordinates: [longitude || -79.4276471, latitude || 43.6534627],
      },
    });

    // Save to MongoDB database
    const savedRestaurant = await newRestaurant.save();
    console.log("Restaurant saved with ID:", savedRestaurant._id);
    console.log("Image URLs:", savedRestaurant.image_urls);

    res.status(201).json({
      success: true,
      message: "Restaurant information saved successfully",
      restaurant: {
        id: savedRestaurant._id,
        name: savedRestaurant.restaurantInfo.name,
        image_urls: savedRestaurant.image_urls, // Include image URLs in response
        status: "complete",
      },
      nextStep: "/restaurant/documents",
    });
  } catch (error) {
    console.error("Error adding restaurant: ", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
};

const updateRestaurantStatus = async (req, res) => {
  try {
    const { restaurantId, status, ownerEmail } = req.body;

    const validStatuses = [
      "Pending",
      "Claimed",
      "Unclaimed",
      "Revoked",
      "Approved",
      "Rejected",
      "Later",
    ];

    if (!restaurantId || !status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID or status",
      });
    }

    const updatedRestaurant = await Firm.findByIdAndUpdate(
      restaurantId,
      { restaurantStatus: status },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant status updated successfully",
      restaurant: {
        id: updatedRestaurant._id,
        status: updatedRestaurant.restaurantStatus,
      },
    });
  } catch (error) {
    console.error("Error updating restaurant status: ", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
};

const updateTiffinStatus = async (req, res) => {
  try {
    const { tiffinId, status } = req.body;

    // Validate input with the same valid statuses plus "Active"
    const validStatuses = [
      "Pending",
      "Claimed",
      "Unclaimed",
      "Revoked",
      "Approved",
      "Rejected",
      "Later",
      "Active",
    ];
    if (!tiffinId || !status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tiffin ID or status",
      });
    }

    // Find and update the tiffin
    const updatedTiffin = await Tiffin.findByIdAndUpdate(
      tiffinId,
      { status: status }, // Use the status field we added to the Tiffin model
      { new: true } // Return the updated document
    );

    if (!updatedTiffin) {
      return res.status(404).json({
        success: false,
        message: "Tiffin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tiffin status updated successfully",
      tiffin: {
        id: updatedTiffin._id,
        status: updatedTiffin.status,
      },
    });
  } catch (error) {
    console.error("Error updating tiffin status: ", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
};

//Testing testAddRestaurant, Created by Murtuza
const testAddRestaurant = async (req, res) => {
  try {
    console.log("Test restaurant data:", req.body);

    // Create a basic restaurant with minimal required fields
    const newRestaurant = new Firm({
      restaurantInfo: {
        name: req.body.firmName || "Test Restaurant",
        category: ["veg"],
      },
      // Use a fake vendor ID
      vendor: [new mongoose.Types.ObjectId()],
    });

    // Save to database
    const savedRestaurant = await newRestaurant.save();
    console.log("Restaurant saved:", savedRestaurant._id);

    // Verify it was saved
    const verifiedRestaurant = await Firm.findById(savedRestaurant._id);

    res.status(201).json({
      success: true,
      message: "Test restaurant created successfully",
      restaurant: {
        id: savedRestaurant._id,
        name: savedRestaurant.restaurantInfo.name,
      },
    });
  } catch (error) {
    console.error("Test restaurant creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: error.message,
    });
  }
};

// Apply Multer middleware in the route

// get firm by id +++
const getFirmById = async (req, res) => {
  try {
    const { id } = req.params;
    const firm = await Firm.findById(id)
      // .select("-menu -reviews -offer")
      .sort({ updatedAt: -1 }); // Sort in descending
    if (!firm) {
      return res.status(404).json({ error: "Firm Not Found" });
    }

    // console.log(firm);
    historyLogRecorder(
      req, // Request object
      firm.constructor.modelName, // Entity: "Firm"
      "READ", // Action: READ
      [firm._id], // Entity ID (as an array)
      `Retrieved details for Firm ID ${firm._id}` // Description
    );
    return res.status(200).json(firm);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// get firm by id reviews +++
const getFirmReviewsById = async (req, res) => {
  try {
    const id = req.params.id;
    const limit = parseInt(req.query.limit) || 5;
    const firm = await Firm.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          reviews: {
            $slice: [
              {
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$reviews",
                      as: "review",
                      cond: {
                        $or: [
                          { $eq: ["$$review.isHidden", false] },
                          { $not: ["$$review.isHidden"] }, // Field doesn't exist
                        ],
                      },
                    },
                  },
                  sortBy: { date: -1 },
                },
              },
              limit,
            ],
          },
        },
      },
    ]);

    if (!firm.length) {
      return res.status(404).json({ error: "Firm Not Found" });
    }

    await historyLogRecorder(
      req,
      "Firm",
      "READ",
      [firm[0]._id],
      `Retrieved ${limit} reviews (non-hidden or no flag) for Firm ID ${firm[0]._id} sorted by date.`
    );

    return res.status(200).json(firm[0]);
  } catch (error) {
    console.error("Error fetching firm reviews by date:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all restaurants +++
const getAllRestaurants = async (req, res) => {
  try {
    console.log(req.session.user);
    const { lastId } = req.query;
    const limit = 20;

    let query = { restaurantStatus: "Pending" };
    if (lastId) {
      query = { _id: { $gt: lastId } };
    }
    const restaurants = await Firm.find(query).limit(limit).select("-menu");
    historyLogRecorder(
      req, // Request object
      "Firm", // Entity: "Firm" (since we query Firm model directly)
      "READ", // Action: READ
      restaurants.map((r) => r._id), // Entity IDs: Array of retrieved firm IDs
      `Retrieved list of restaurants (limit: ${limit}, starting after: ${
        lastId || "start"
      })` // Description
    );

    return res.status(200).json({
      restaurants,
      lastId:
        restaurants.length > 0 ? restaurants[restaurants.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllRestaurants1 = async (req, res) => {
  console.log("Function calling");
  try {
    let query = {};

    const restaurants = await Firm.find({});
    await historyLogRecorder(
      req,
      "Firm",
      "READ",
      restaurants.map((r) => r._id),
      `Retrieved list of all restaurants`
    );

    return res.status(200).json({
      restaurants,
      lastId:
        restaurants.length > 0 ? restaurants[restaurants.length - 1]._id : null,
    });
  } catch (error) {
    console.error("Error in getAllRestaurants1:", error.message, error.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//getting newly added Tiffins
const getTiffins = async (req, res) => {
  try {
    console.log(req.session.user);
    const { lastId } = req.query;
    const limit = 20;

    let query = { newlyAdded: true };
    if (lastId) {
      query = { _id: { $gt: lastId } };
    }
    const tiffins = await Tiffin.find(query).limit(limit).select("-menu");
    historyLogRecorder(
      req, // Request object
      "Tiffin", // Entity: "Tiffin" (since we query Tiffin model directly)
      "READ", // Action: READ
      tiffins.map((r) => r._id), // Entity IDs: Array of retrieved firm IDs
      `Retrieved list of tiffins (limit: ${limit}, starting after: ${
        lastId || "start"
      })` // Description
    );

    return res.status(200).json({
      tiffins,
      lastId: tiffins.length > 0 ? tiffins[tiffins.length - 1]._id : null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//getting newly added restaurants
const getNewRestaurants = async (req, res) => {
  try {
    console.log(req.session.user);
    const { lastId } = req.query;
    const limit = 20;

    let query = { newlyCreated: true };
    if (lastId) {
      query = { _id: { $gt: lastId } };
    }
    const restaurants = await Firm.find({ newlyAdded: true })
      .limit(limit)
      .select("-menu");
    historyLogRecorder(
      req, // Request object
      "Firm", // Entity: "Firm" (since we query Firm model directly)
      "READ", // Action: READ
      restaurants.map((r) => r._id), // Entity IDs: Array of retrieved firm IDs
      `Retrieved list of restaurants (limit: ${limit}, starting after: ${
        lastId || "start"
      })` // Description
    );

    return res.status(200).json({
      restaurants,
      lastId:
        restaurants.length > 0 ? restaurants[restaurants.length - 1]._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const updateMenuItems = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { restaurantId } = req.params;
//     let { sanitizedItem } = req.body;

//     console.log("req.body:", req.body); // Debug: Log incoming payload

//     // Parse sanitizedItem if it's a string
//     if (typeof sanitizedItem === "string") {
//       try {
//         sanitizedItem = JSON.parse(sanitizedItem);
//       } catch (error) {
//         return res
//           .status(400)
//           .json({ message: "Invalid sanitizedItem format!" });
//       }
//     }

//     // Ensure sanitizedItem is an array
//     const items = Array.isArray(sanitizedItem)
//       ? sanitizedItem
//       : [sanitizedItem];

//     // Validate restaurantId
//     if (!restaurantId || !mongoose.isValidObjectId(restaurantId)) {
//       return res
//         .status(400)
//         .json({ message: "Valid Restaurant ID is required!" });
//     }

//     // Validate items
//     if (!items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one item is required!" });
//     }

//     // Validate item structure
//     for (const item of items) {
//       if (
//         !item._id ||
//         !mongoose.isValidObjectId(item._id) ||
//         !item.name ||
//         item.price === undefined ||
//         !item.categoryId?.name ||
//         !mongoose.isValidObjectId(item.categoryId.name) ||
//         !item.subcategoryId?.name ||
//         !mongoose.isValidObjectId(item.subcategoryId.name)
//       ) {
//         return res.status(400).json({
//           message:
//             "Each item must have a valid _id, name, price, categoryId.name, and subcategoryId.name!",
//         });
//       }
//     }

//     // Find the restaurant
//     const restaurant = await Firm.findById(restaurantId).session(session);
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found!" });
//     }

//     const updatedItems = [];

//     // Process each item
//     for (const item of items) {
//       // Find the existing menu item
//       const existingItem = await MenuItem.findOne({
//         _id: item._id,
//         firm: restaurant._id,
//       }).session(session);

//       if (!existingItem) {
//         return res.status(404).json({ message: `Item not found: ${item._id}` });
//       }

//       // Find the new menu tab and section
//       const newMenuTab = restaurant.menu.menuTabs.find(
//         (tab) => tab.id.toString() === item.categoryId.name
//       );
//       if (!newMenuTab) {
//         return res.status(404).json({
//           message: `Tab not found for categoryId: ${item.categoryId.name}`,
//         });
//       }

//       const newSection = newMenuTab.sections.find(
//         (sec) => sec.id.toString() === item.subcategoryId.name
//       );
//       if (!newSection) {
//         return res.status(404).json({
//           message: `Section not found for subcategoryId: ${item.subcategoryId.name}`,
//         });
//       }

//       // Remove item from previous category/subcategory if they have changed
//       if (
//         existingItem.categoryId &&
//         existingItem.subcategoryId &&
//         (existingItem.categoryId.toString() !== item.categoryId.name ||
//           existingItem.subcategoryId.toString() !== item.subcategoryId.name)
//       ) {
//         const prevMenuTab = restaurant.menu.menuTabs.find(
//           (tab) => tab.id.toString() === existingItem.categoryId.toString()
//         );
//         if (prevMenuTab) {
//           const prevSection = prevMenuTab.sections.find(
//             (sec) => sec.id.toString() === existingItem.subcategoryId.toString()
//           );
//           if (prevSection) {
//             prevSection.items = prevSection.items.filter(
//               (itemId) => itemId.toString() !== existingItem._id.toString()
//             );
//           }
//         }
//       }

//       // Update fields
//       existingItem.name = item.name || existingItem.name;
//       existingItem.price = item.price.toString();
//       existingItem.pricing = item.pricing?.toString() || existingItem.pricing;
//       existingItem.description = item.description ?? existingItem.description;
//       existingItem.type = item.type ?? existingItem.type;
//       existingItem.serviceType = item.serviceType ?? existingItem.serviceType;

//       // Update dishDetails
//       if (item.dishDetails) {
//         existingItem.dishDetails = {
//           servingInfo:
//             item.dishDetails.servingInfo ||
//             existingItem.dishDetails?.servingInfo ||
//             "",
//           calorieCount:
//             item.dishDetails.calorieCount ||
//             existingItem.dishDetails?.calorieCount ||
//             "",
//           portionSize:
//             item.dishDetails.portionSize ||
//             existingItem.dishDetails?.portionSize ||
//             "",
//           allergyDetails:
//             item.dishDetails.allergyDetails ||
//             existingItem.dishDetails?.allergyDetails ||
//             "N/A",
//         };
//       }

//       // Update category and subcategory
//       if (
//         item.categoryId.name &&
//         mongoose.isValidObjectId(item.categoryId.name)
//       ) {
//         existingItem.categoryId = item.categoryId.name; // Set as ObjectId
//       }
//       if (
//         item.subcategoryId.name &&
//         mongoose.isValidObjectId(item.subcategoryId.name)
//       ) {
//         existingItem.subcategoryId = item.subcategoryId.name; // Set as ObjectId
//       }

//       await existingItem.save({ session });
//       updatedItems.push(existingItem);

//       // Add item to new section if not already included
//       if (!newSection.items.includes(existingItem._id)) {
//         newSection.items.push(existingItem._id);
//       }
//     }

//     // Save restaurant
//     await restaurant.save({ session });

//     // Commit transaction
//     await session.commitTransaction();

//     return res.status(200).json({
//       message: "Menu items updated successfully!",
//       items: updatedItems,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error updating menu items:", error.stack);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };

const addnewItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    let { tabId, sectionId, item, tabName, sectionName } = req.body;

    // Validate restaurantId
    if (!restaurantId || !mongoose.isValidObjectId(restaurantId)) {
      return res
        .status(400)
        .json({ message: "Valid Restaurant ID is required!" });
    }

    // Parse item if it's a JSON string
    let parsedItem;
    if (typeof item === "string") {
      try {
        parsedItem = JSON.parse(item)[0]; // Extract first object from array
      } catch (err) {
        return res.status(400).json({ message: "Invalid item format!" });
      }
    } else {
      parsedItem = item;
    }

    // Find restaurant
    const restaurant = await Firm.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    // Find menu tab by tabId or tabName (handle case where tabName is mistakenly an _id)
    let menuTab;
    if (tabId) {
      menuTab = restaurant.menu.menuTabs.find(
        (tab) => tab._id.toString() === tabId
      );
    } else if (tabName) {
      // Check if tabName is actually an _id
      if (mongoose.isValidObjectId(tabName)) {
        menuTab = restaurant.menu.menuTabs.find(
          (tab) => tab._id.toString() === tabName
        );
      } else {
        menuTab = restaurant.menu.menuTabs.find((tab) => tab.name === tabName);
      }
    }

    // If menu tab doesn't exist, create a new one
    if (!menuTab) {
      if (!tabName || mongoose.isValidObjectId(tabName)) {
        return res
          .status(400)
          .json({ message: "Valid tab name or ID is required!" });
      }
      menuTab = {
        _id: tabId || new mongoose.Types.ObjectId(),
        name: tabName,
        sections: [],
      };
      restaurant.menu.menuTabs.push(menuTab);
    }

    // Find section by sectionId or sectionName
    let section;
    if (sectionId) {
      section = menuTab.sections.find(
        (sec) => sec._id.toString() === sectionId
      );
    } else if (sectionName) {
      section = menuTab.sections.find((sec) => sec.name === sectionName);
    }

    // If section doesn't exist, create a new one
    if (!section) {
      section = {
        _id: sectionId || new mongoose.Types.ObjectId(),
        name: sectionName || "Default Section",
        description: "",
        items: [],
      };
      menuTab.sections.push(section);
    }

    // Handle image uploads
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Create new item
    const createdItem = {
      _id: new mongoose.Types.ObjectId(),
      name: parsedItem.name,
      type: parsedItem.type,
      price: parsedItem.price,
      taxes: parsedItem.taxes,
      description: parsedItem.description,
      dishDetails: parsedItem.dishDetails,
      images: imageUrls,
      categoryId: parsedItem.categoryId,
      subcategoryId: parsedItem.subcategoryId,
      serviceType: parsedItem.serviceType,
    };

    // Push item to section.items
    section.items.push(createdItem);

    // Mark modified paths for Mongoose
    restaurant.markModified("menu.menuTabs");

    // Save the updated restaurant document
    await restaurant.save();

    return res.status(201).json({
      message: "Item added successfully!",
      item: createdItem,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Item name already exists!" });
    }
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { restaurantId, itemId, categoryId, subcategoryId } = req.query;

    if (
      ![restaurantId, itemId, categoryId, subcategoryId].every((id) =>
        mongoose.isValidObjectId(id)
      )
    ) {
      return res.status(400).json({
        message:
          "Valid restaurantId, itemId, categoryId, and subcategoryId are required!",
      });
    }

    const result = await Firm.updateOne(
      { _id: new mongoose.Types.ObjectId(restaurantId) },
      {
        $pull: {
          "menu.menuTabs.$[category].sections.$[section].items": {
            _id: new mongoose.Types.ObjectId(itemId),
          },
        },
      },
      {
        arrayFilters: [
          { "category._id": new mongoose.Types.ObjectId(categoryId) },
          { "section._id": new mongoose.Types.ObjectId(subcategoryId) },
        ],
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or already deleted!" });
    }

    return res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// const addmenuTab = async (req, res) => {
//   try {
//     const { restaurantId } = req.params;
//     const { tabName } = req.body;

//     // Validate inputs
//     if (!restaurantId) {
//       return res.status(400).json({ message: "Restaurant ID is required" });
//     }
//     if (!tabName || !tabName.trim()) {
//       return res
//         .status(400)
//         .json({ message: "Tab name is required and cannot be empty" });
//     }

//     // Find the restaurant
//     const restaurant = await Firm.findById(restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     // Check if tabName already exists
//     const menuTab = restaurant.menu.menuTabs.find(
//       (tab) => tab.name === tabName
//     );
//     if (menuTab) {
//       return res
//         .status(400)
//         .json({ message: "Category with this name already exists" });
//     }

//     // Create new tab
//     const newTab = { name: tabName, sections: [], items: [] };
//     restaurant.menu.menuTabs.push(newTab);

//     // Save the restaurant
//     await restaurant.save();

//     // Return the newly created tab
//     const createdTab = restaurant.menu.menuTabs.find(
//       (tab) => tab.name === tabName
//     );

//     return res.status(201).json({
//       message: "Category created successfully",
//       category: createdTab,
//     });
//   } catch (error) {
//     console.error("Error adding category:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

//changes end here

const updateMenuItems = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params;
    let { sanitizedItem, tabId, sectionId, tabName, sectionName } = req.body;

    // Log request data for debugging
    console.log("req.body:", req.body, {
      tabId,
      sectionId,
      sanitizedItem,
      tabName,
      sectionName,
    });
    console.log("req.files:", req.files);
    console.log("req.params:", req.params);

    // Validate restaurantId and itemId
    if (!restaurantId || !mongoose.isValidObjectId(restaurantId)) {
      return res
        .status(400)
        .json({ message: "Valid Restaurant ID is required!" });
    }
    if (!itemId || !mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Valid Item ID is required!" });
    }
    if (tabId && !mongoose.isValidObjectId(tabId)) {
      return res.status(400).json({ message: "Invalid tabId!" });
    }
    if (sectionId && !mongoose.isValidObjectId(sectionId)) {
      return res.status(400).json({ message: "Invalid sectionId!" });
    }

    // Check if sanitizedItem exists
    if (!sanitizedItem) {
      return res
        .status(400)
        .json({ message: "sanitizedItem is missing in request body!" });
    }

    // Parse sanitizedItem if it's a string
    let parsedItem;
    if (typeof sanitizedItem === "string") {
      try {
        const parsedArray = JSON.parse(sanitizedItem);
        if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
          return res
            .status(400)
            .json({ message: "sanitizedItem must be a non-empty array!" });
        }
        parsedItem = parsedArray[0];
      } catch (err) {
        console.error("JSON parsing error:", err);
        return res.status(400).json({
          message: "Invalid sanitizedItem format!",
          error: err.message,
        });
      }
    } else {
      parsedItem = sanitizedItem;
    }

    // Validate parsedItem
    if (
      !parsedItem ||
      !parsedItem._id ||
      parsedItem._id.toString() !== itemId
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing Item ID in sanitizedItem!" });
    }
    if (!parsedItem.categoryId || !parsedItem.subcategoryId) {
      return res
        .status(400)
        .json({ message: "Missing categoryId or subcategoryId!" });
    }

    // Find the restaurant
    const restaurant = await Firm.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    // Find menu tab by tabId or tabName
    let menuTab;
    if (tabId) {
      menuTab = restaurant.menu.menuTabs.find(
        (tab) => tab._id.toString() === tabId
      );
    } else if (tabName) {
      if (mongoose.isValidObjectId(tabName)) {
        menuTab = restaurant.menu.menuTabs.find(
          (tab) => tab._id.toString() === tabName
        );
      } else {
        menuTab = restaurant.menu.menuTabs.find((tab) => tab.name === tabName);
      }
    }

    // If menu tab doesn't exist, create a new one
    if (!menuTab) {
      if (!tabName || mongoose.isValidObjectId(tabName)) {
        return res
          .status(400)
          .json({ message: "Valid tab name or ID is required!" });
      }
      menuTab = {
        _id: tabId || new mongoose.Types.ObjectId(),
        name: tabName,
        sections: [],
      };
      restaurant.menu.menuTabs.push(menuTab);
    }

    // Find section by sectionId or sectionName
    let section;
    if (sectionId) {
      section = menuTab.sections.find(
        (sec) => sec._id.toString() === sectionId
      );
    } else if (sectionName) {
      section = menuTab.sections.find((sec) => sec.name === sectionName);
    }

    // If section doesn't exist, create a new one
    if (!section) {
      section = {
        _id: sectionId || new mongoose.Types.ObjectId(),
        name: sectionName || "Default Section",
        description: "",
        items: [],
      };
      menuTab.sections.push(section);
    }

    // Find the item in the section
    let itemToUpdate = section.items.find(
      (item) => item._id.toString() === itemId
    );
    let oldSection, oldMenuTab;
    if (!itemToUpdate) {
      // Search all tabs and sections for the item
      for (const tab of restaurant.menu.menuTabs) {
        for (const sec of tab.sections) {
          const item = sec.items.find((item) => item._id.toString() === itemId);
          if (item) {
            itemToUpdate = item;
            oldSection = sec;
            oldMenuTab = tab;
            break;
          }
        }
        if (itemToUpdate) break;
      }
    }
    if (!itemToUpdate) {
      return res.status(404).json({ message: `Item not found: ${itemId}` });
    }

    // If item is in a different section/tab, move it
    if (oldSection && oldSection !== section) {
      oldSection.items = oldSection.items.filter(
        (item) => item._id.toString() !== itemId
      );
      section.items.push(itemToUpdate);
    }

    // Handle file uploads
    const imageUrls =
      req.files?.["images"]?.map((file) => `/uploads/${file.filename}`) ||
      itemToUpdate.images ||
      [];
    const videoUrl = req.files?.["video"]?.[0]?.filename
      ? `/uploads/${req.files["video"][0].filename}`
      : parsedItem.video || itemToUpdate.video || "";

    // Update item fields
    itemToUpdate.name = parsedItem.name || itemToUpdate.name || "Untitled";
    itemToUpdate.pricing = parsedItem.pricing || itemToUpdate.pricing || "5";
    itemToUpdate.price = parsedItem.pricing || itemToUpdate.price || "5";
    itemToUpdate.description =
      parsedItem.description ||
      itemToUpdate.description ||
      "No description provided";
    itemToUpdate.type = parsedItem.type || itemToUpdate.type || "Veg";
    itemToUpdate.taxes = parsedItem.taxes || itemToUpdate.taxes || "5% GST";
    itemToUpdate.serviceType =
      parsedItem.serviceType || itemToUpdate.serviceType || [];
    itemToUpdate.dishDetails = {
      servingInfo:
        parsedItem.dishDetails?.servingInfo ||
        itemToUpdate.dishDetails?.servingInfo ||
        "1",
      calorieCount:
        parsedItem.dishDetails?.calorieCount ||
        itemToUpdate.dishDetails?.calorieCount ||
        "250",
      portionSize:
        parsedItem.dishDetails?.portionSize ||
        itemToUpdate.dishDetails?.portionSize ||
        "Small",
      allergyDetails:
        parsedItem.dishDetails?.allergyDetails ||
        itemToUpdate.dishDetails?.allergyDetails ||
        "N/A",
    };
    itemToUpdate.category =
      parsedItem.category || itemToUpdate.category || "Breads";
    itemToUpdate.subcategory =
      parsedItem.subcategory || itemToUpdate.subcategory || "Pizzas";
    itemToUpdate.categoryId = parsedItem.categoryId; // Allow updating categoryId
    itemToUpdate.subcategoryId = parsedItem.subcategoryId; // Allow updating subcategoryId
    itemToUpdate.images = imageUrls;
    itemToUpdate.video = videoUrl;
    itemToUpdate.variations =
      parsedItem.variations || itemToUpdate.variations || [];

    // Mark modified paths for Mongoose
    restaurant.markModified("menu.menuTabs");

    // Save the restaurant
    await restaurant.save();

    return res.status(200).json({
      message: "Menu item updated successfully!",
      item: itemToUpdate,
    });
  } catch (error) {
    console.error("Error updating menu item:", error.stack);
    return res.status(500).json({
      message: "Failed to save menu item",
      error: error.message,
    });
  }
};

const addmenuTab = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { categoryName } = req.body;

    // Validate inputs
    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID!" });
    }

    if (!categoryName || typeof categoryName !== "string") {
      return res.status(400).json({ message: "Category name is required!" });
    }

    // Find the restaurant
    const restaurant = await Firm.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    // Check if the category already exists
    const existingCategory = restaurant.menu.menuTabs.find(
      (tab) => tab.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }

    // Create new category/tab
    const newCategory = {
      _id: new mongoose.Types.ObjectId(),
      name: categoryName,
      sections: [],
    };

    restaurant.menu.menuTabs.push(newCategory);
    await restaurant.save();

    return res.status(201).json({
      message: "Category added successfully!",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const addSubcategory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { categoryId, subcategoryName } = req.body;

    if (
      !mongoose.isValidObjectId(restaurantId) ||
      !mongoose.isValidObjectId(categoryId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid restaurant or category ID." });
    }

    if (!subcategoryName || typeof subcategoryName !== "string") {
      return res.status(400).json({ message: "Subcategory name is required." });
    }

    const restaurant = await Firm.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const category = restaurant.menu.menuTabs.find(
      (tab) => tab._id.toString() === categoryId
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const normalizedName = subcategoryName.trim().toLowerCase();

    const exists = category.sections.some(
      (sec) => sec.name.trim().toLowerCase() === normalizedName
    );
    if (exists) {
      return res.status(409).json({ message: "Subcategory already exists." });
    }

    const newSection = {
      _id: new mongoose.Types.ObjectId(),
      name: subcategoryName.trim(),
      description: "",
      items: [],
    };

    category.sections.push(newSection);
    await restaurant.save();

    return res.status(201).json({
      message: "Subcategory added successfully.",
      subcategory: newSection,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).populate({
      path: "menu.menuTabs.sections.items",
      model: "MenuItem",
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    historyLogRecorder(
      req, // Request object
      restaurant.constructor.modelName, // Entity: "Firm"
      "READ", // Action: READ
      [restaurant._id], // Entity ID (as an array)
      `Retrieved full menu for Restaurant ID ${restaurantId}` // Description
    );
    return res.status(200).json({
      menuTabs: restaurant.menu.menuTabs,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getMenuTabs = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "menu.menuTabs.name"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuTabs = restaurant.menu?.menuTabs.map((tab) => tab.name) || [];
    historyLogRecorder(
      req, // Request object
      restaurant.constructor.modelName, // Entity: "Firm"
      "READ", // Action: READ
      [restaurant._id], // Entity ID (as an array)
      `Retrieved menu tab names for Restaurant ID ${restaurantId}` // Description
    );
    return res.status(200).json({ menuTabs });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getMenuSections = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Firm.findById(restaurantId).select(
      "menu.menuTabs.sections.name"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const sections = restaurant.menu?.menuTabs.flatMap((tab) => tab) || [];

    return res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//const getMenuSectionsWithItems = async (req, res) => {
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }
//     const menuData =
//       restaurant.menu?.menuTabs.flatMap((tab) =>
//         tab.sections.map((section) => ({
//           sectionName: section.name,
//           items: section.items.map((item) => ({
//             name: item.name,
//             price: item.price,
//             description: item.description,
//             variations: item.variations,
//             id: item._id,
//           })),
//         }))
//       ) || [];

//     return res.status(200).json({ menuSections: menuData });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getMenuSectionsWithItems = async (req, res) => {          
  try {
    const { restaurantId } = req.params;

    const restaurant = await Firm.findById(restaurantId)
      .populate({
        path: "menu.menuTabs.sections.items",
        select:
          "_id name price description veg category serviceType subcategory categoryId subcategoryId",
      })
      .populate({
        path: "menu.menuTabs",
        select: "name sections",
        populate: {
          path: "sections",
          select: "name items", // select items field so we can access section.items
        },
      });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuData = (restaurant.menu?.menuTabs || []).map((tab) => ({
      tabName: tab.name || "Unnamed Tab",
      categoryId: tab._id,
      sections: (tab.sections || []).map((section) => ({
        sectionName: section.name || "Unnamed Section",
        subcategoryId: section._id,
        items: (section.items || []).map((item) => ({
          id: item._id || null,
          type: item.type,
          category: item.category,
          subcategory: item.subcategory,
          categoryId: tab._id,
          veg: item.veg,
          subcategoryId: section._id,
          name: item.name || "Unnamed Item",
          price: item.price || "N/A",
          serviceType: item.serviceType || "N/A",
          dishDetails: item.dishDetails || "N/A",
          description: item.description || "",
          images: item.images || "",
          video: item.video || "",
        })),
      })),
    }));

    return res.status(200).json({ menuSections: menuData });
  } catch (error) {
    console.error("Error fetching menu sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getUserTextMenuSectionsWithItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Firm.findById(restaurantId)
      .populate({
        path: "menu_text_user.menuTabs.sections.items",
        select:
          "_id name price description veg category serviceType subcategory categoryId subcategoryId",
      })
      .populate({
        path: "menu_text_user.menuTabs",
        select: "name sections",
        populate: {
          path: "sections",
          select: "name items", // select items field so we can access section.items
        },
      });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuData = (restaurant.menu_text_user?.menuTabs || []).map((tab) => ({
      tabName: tab.name || "Unnamed Tab",
      categoryId: tab._id,
      sections: (tab.sections || []).map((section) => ({
        sectionName: section.name || "Unnamed Section",
        subcategoryId: section._id,
        items: (section.items || []).map((item) => ({
          id: item._id || null,
          type: item.type,
          category: item.category,
          subcategory: item.subcategory,
          categoryId: tab._id,
          subcategoryId: section._id,
          name: item.name || "Unnamed Item",
          price: item.price || "N/A",
          serviceType: item.serviceType || "N/A",
          dishDetails: item.dishDetails || "N/A",
          description: item.description || "",
          images: item.images || "",
          video: item.video || "",
          veg: item.veg,
        })),
      })),
    }));

    return res.status(200).json({ menuSections: menuData });
  } catch (error) {
    console.error("Error fetching menu sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const getMenuTextUserSectionsWithItems = async (req, res) => {      // For menu_text_user
  try {
    const { restaurantId } = req.params;

    const restaurant = await Firm.findById(restaurantId)
      .populate({
        path: "menu_text_user.menuTabs.sections.items",
        select:
          "_id name price description variations type category subcategory categoryId subcategoryId",
      })
      .populate({
        path: "menu_text_user.menuTabs",
        select: "name sections",
        populate: {
          path: "sections",
          select: "name items", // select items field so we can access section.items
        },
      });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuData = (restaurant.menu_text_user?.menuTabs || []).map((tab) => ({
      tabName: tab.name || "Unnamed Tab",
      categoryId: tab._id,
      sections: (tab.sections || []).map((section) => ({
        sectionName: section.name || "Unnamed Section",
        subcategoryId: section._id,
        items: (section.items || []).map((item) => ({
          id: item._id || null,
          type: item.type,
          category: item.category,
          subcategory: item.subcategory,
          categoryId: tab._id,
          subcategoryId: section._id,
          name: item.name || "Unnamed Item",
          price: item.price || "N/A",
          serviceType: item.serviceType || "N/A",
          dishDetails: item.dishDetails || "N/A",
          description: item.description || "",
          images: item.images || "",
          video: item.video || "",
          variations: item.variations || [],
        })),
      })),
    }));

    return res.status(200).json({ menuSections: menuData });
  } catch (error) {
    console.error("Error fetching menu text user sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




//+++
const getMenuImages = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select("menu_images");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({ menuImages: restaurant.menu_images });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getPhoneNumber = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.phoneNo"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({ phone: restaurant.restaurantInfo.phoneNo });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getAddress = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.address"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({ address: restaurant.restaurantInfo.address });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getInstagram = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.instagram"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res
      .status(200)
      .json({ instagram: restaurant.restaurantInfo.instagram });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getAdditionalInfo = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.additionalInfo"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      restaurantId,
      "Fetched additional info of the restaurant"
    );
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      restaurantId,
      "Fetched additional info of the restaurant"
    );
    return res
      .status(200)
      .json({ additionalInfo: restaurant.restaurantInfo.additionalInfo });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getRestaurantOverview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.overview"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      restaurantId,
      "Fetched overview of the restaurant"
    );
    return res
      .status(200)
      .json({ overview: restaurant.restaurantInfo.overview });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getRestaurantRatings = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Firm.findById(restaurantId).select(
      "restaurantInfo.ratings"
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      restaurantId,
      "Fetched ratings of the restaurant"
    );
    return res.status(200).json({ ratings: restaurant.restaurantInfo.ratings });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getRestaurantsByRatings = async (req, res) => {
  try {
    const { food, service, ambience, lastId } = req.query;
    const limit = 50;
    let query = {};
    if (food || service || ambience) {
      query["restaurantInfo.ratings"] = {};
      if (food) {
        query["restaurantInfo.ratings.food"] = { $gte: Number(food) };
      }
      if (service) {
        query["restaurantInfo.ratings.service"] = { $gte: Number(service) };
      }
      if (ambience) {
        query["restaurantInfo.ratings.ambience"] = { $gte: Number(ambience) };
      }
    }
    if (lastId) {
      query._id = { $gt: lastId };
    }
    const restaurants = await Firm.find(query).limit(limit);
    return res.status(200).json({
      restaurants,
      lastId:
        restaurants.length > 0 ? restaurants[restaurants.length - 1]._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};
//+++
const getRestaurantFAQs = async (req, res) => {
  try {
    const { firmId } = req.params;
    //to select faqs from the firm
    const firm = await Firm.findById(firmId, "faqs");
    if (!firm) {
      return res.status(404).json({ message: "Firm not found." });
    }
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      firm._id,
      "Fetched Faqs from the restaurant"
    );
    res.status(200).json({ faqs: firm.faqs });
  } catch (error) {
    console.error("Error in getFirmFAQs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++

const getRestaurantImages = async (req, res) => {
  try {
    const { firmId } = req.params;
    const firm = await Firm.findById(firmId, "image_url");
    if (!firm) {
      return res.status(404).json({ message: "Firm not found." });
    }

    res.status(200).json({ image_urls: firm?.image_urls || [] });
  } catch (error) {
    console.error("Error in getFirmImages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//+++
const getRestaurantOpeningHours = async (req, res) => {
  try {
    const { firmId } = req.params;
    const firm = await Firm.findById(firmId, "opening_hours");
    if (!firm) {
      return res.status(404).json({ message: "Firm not found." });
    }
    historyLogRecorder(
      req,
      "Firm",
      "READ",
      firm._id,
      "Fetched the opening hours of the restaurant"
    );
    res.status(200).json({ opening_hours: firm.opening_hours });
  } catch (error) {
    console.error("Error in getFirmOpeningHours:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const user = await User.findById("67ee0bd23cf5e5dd298fa263");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFavorite = user?.favorites?.some((fav) => fav.toString() === id);

    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteRestaurants = async (req, res) => {
  try {
    const userId = "67ee0bd23cf5e5dd298fa263";

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user?.favorites || user?.favorites.length === 0) {
      return res.status(200).json({ favorites: [] });
    }

    const favoriteRestaurants = await Firm.find({
      _id: { $in: user.favorites },
    });

    res.status(200).json({ favorites: favoriteRestaurants });
  } catch (error) {
    console.error("Error fetching favorite restaurants:", error);
    res.status(500).json({ message: error.message });
  }
};

const addFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const user = await User.findById("67ee0bd23cf5e5dd298fa263");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user?.favorites?.some((fav) => fav.toString() === id)) {
      user?.favorites.push(id);
      await user.save();
      return res.status(200).json({ message: "Item added to favorites!" });
    }

    res.status(400).json({ message: "Item already in favorites." });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const user = await User.findById("67ee0bd23cf5e5dd298fa263");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter((fav) => fav.toString() !== id);
    await user.save();

    res.status(200).json({ message: "Item removed from favorites!" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { documentType, restaurantId } = req.body;
    const file = req.file;
    console.log(file, documentType, file.path, "getting all three fileds");
    if (!file || !documentType || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for restaurant document upload",
      });
    }

    // Check if restaurant exists
    const restaurant = await Firm.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Find or create document record
    let documentRecord = await RestaurantDocument.findOne({
      restaurantId: restaurantId,
    });

    if (!documentRecord) {
      documentRecord = new RestaurantDocument({
        restaurantId: restaurantId,
      });
    }

    // Update the specific document field
    documentRecord[documentType] = file.path;
    await documentRecord.save();

    // Log the document upload
    historyLogRecorder(
      req,
      "RestaurantDocument",
      "UPDATE",
      documentRecord._id,
      `Document ${documentType} uploaded for restaurant ${restaurantId}`
    );

    res.status(200).json({
      success: true,
      message: `${documentType} uploaded successfully`,
      filePath: file.path,
    });
  } catch (error) {
    console.error("Error uploading restaurant document: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading document",
      error: error.message,
    });
  }
};

// const completeRegistration = async (req, res) => {
//   try {
//     const { restaurantId, termsAccepted } = req.body;

//     if (!restaurantId || termsAccepted !== true) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid restaurant ID or terms not accepted",
//       });
//     }

//     // Find and update the restaurant service
//     const updateRestaurant = await Firm.findByIdAndUpdate(
//       restaurantId,
//       {
//         // Add any finalization fields if needed
//         registrationStatus: "complete", // Add status field to indicate registration is complete
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updateRestaurant) {
//       return res.status(404).json({
//         success: false,
//         message: "Restaurant not found",
//       });
//     }

//     // Record history log
//     try {
//       historyLogRecorder(
//         req,
//         updateRestaurant.constructor.modelName,
//         "UPDATE",
//         updateRestaurant._id,
//         `Completed registration for restaurant service '${updateRestaurant.restaurantInfo.name}'`
//       );
//     } catch (logError) {
//       console.warn("Warning: Unable to record history log", logError);
//       // Continue execution even if logging fails
//     }

//     res.status(200).json({
//       success: true,
//       message: "Tiffin service registration completed successfully",
//     });
//   } catch (error) {
//     console.error("Error completing restaurant registration: ", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       details: error.message,
//     });
//   }
// };

module.exports = {
  // addFirm: [upload.single("image"), addFirm],
  deleteFirmById,
  // completeRegistration,
  searchFirmByName,
  pureVegFirms,
  getSimilarRestaurants,
  filterFirmsByRating,
  filterFirmsWithOffers,
  filterFirmsByCuisines,
  filterFirmByDietary,
  sortFirmsByPopularity,
  filterFirms,
  checkFavorite,
  updateMenuItems,
  addFavorite,
  addnewItem,
  deleteItem,
  removeFavorite,
  addSubcategory,
  // new functions according to data scraped
  addRestaurant,
  updateRestaurantStatus,
  updateTiffinStatus,
  getFirmById, //get it
  getAllRestaurants, //get it
  getNewRestaurants, //for getting newly added restaurants
  getTiffins, //to get all added tiffins
  getRestaurantMenu, //get
  getMenuTabs,
  getMenuSections,
  getMenuSectionsWithItems,
  getUserTextMenuSectionsWithItems,
  getMenuTextUserSectionsWithItems,
  getMenuImages,
  getFirmReviewsById,
  addmenuTab,
  getPhoneNumber,
  getAddress,
  getInstagram,
  getAdditionalInfo,
  getRestaurantOverview,
  getRestaurantRatings,
  getRestaurantsByRatings,
  getRestaurantFAQs,
  getRestaurantImages,
  getRestaurantOpeningHours,
  excelBulkUpload,
  uploadDocument,
  getAllRestaurants1,
  getFavoriteRestaurants,
  //new function to check testAddRestaurant
  testAddRestaurant,
};
