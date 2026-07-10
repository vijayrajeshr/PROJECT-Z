// Import statements moved to the bottom of the file

// Get all collections

const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const { upload } = require("../../config/cloudinary");

const NAME_REGEX = /^[A-Za-z0-9\s'&()\-\.]+$/;
const DESCRIPTION_REGEX = /^[A-Za-z0-9\s.,'&()\-:;!?"]+$/;


exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Create a new collection
exports.createCollection = async (req, res) => {
  try {
    const { title, description, isDefault, status, restaurants } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (title.length > 120) {
      return res.status(400).json({ message: "Name exceeds limit" });
    }

    if (!NAME_REGEX.test(title)) {
      return res.status(400).json({ message: "Name contains invalid characters" });
    }

    if (description.length > 500) {
      return res.status(400).json({ message: "Description exceeds limit" });
    }

    if (!DESCRIPTION_REGEX.test(description)) {
      return res.status(400).json({ message: "Invalid characters in description" });
    }

    // Check if collection with same title already exists
    const existingCollection = await Collection.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });
    
    if (existingCollection) {
      return res
        .status(400)
        .json({ message: "This collection name already exists" });
    }

    const collection = new Collection({
      title,
      description,
      isDefault: isDefault || false,
      status: status || "Inactive",
    });

    // Add restaurants if provided
    if (restaurants && Array.isArray(restaurants)) {
      collection.restaurants = restaurants;
    }

    // Check if Cloudinary credentials are configured
    const cloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    // Handle image upload if provided and Cloudinary is configured
    if (req.files && req.files.length > 0) {
    const photo = req.files[0]; // Get the first file
    
    if (photo) {
        // With the new setup, 'photo.path' is ALREADY the Cloudinary URL.
        // No need to await uploadOnCloudinary() anymore.
        collection.photoWeb = photo.path;
        collection.photoApp = photo.path;
    }
}

    await collection.save();

    res
      .status(201)
      .json({ message: "Collection created successfully", collection });
  } catch (error) {
    console.error("Error creating collection:", error);
    res
      .status(500)
      .json({ message: "Failed to create collection", error: error.message });
  }
};

function tryParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString);
    // Handle non-objects, non-arrays, and invalid types
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;

    // --- DEBUG LOGS ---
    console.log("--- START Backend updateCollection ---");
    console.log("Received req.body:", req.body);
    console.log("Type of req.body.restaurants:", typeof req.body.restaurants);
    if (req.body.restaurants) {
      console.log(
        "Is req.body.restaurants an Array?",
        Array.isArray(req.body.restaurants)
      );
    }
    console.log("--- END Backend updateCollection ---");
    // --- END DEBUG LOGS ---

    const { title, description, isDefault, status, startDate, endDate } =
      req.body;
    let { restaurants } = req.body; // Use `let` to allow modification

    // Find the collection document
    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).send("Collection not found");

    // --- THE KEY FIX IS HERE ---
    // Check if 'restaurants' is a string and try to parse it.
    if (restaurants && typeof restaurants === "string") {
      const parsedRestaurants = tryParseJSON(restaurants);
      if (parsedRestaurants && Array.isArray(parsedRestaurants)) {
        // Success: the string was a valid JSON array. Use the parsed array.
        restaurants = parsedRestaurants;
      } else {
        // Fail: the string was not a valid JSON array.
        // This is an error, so we should log it and maybe send a bad request response.
        console.warn(
          "Received restaurants field as a string that could not be parsed into an array:",
          restaurants
        );
        // We can choose to either ignore this and let the Mongoose validation fail,
        // or return an error now. Let's return an error for better feedback.
        return res
          .status(400)
          .json({
            message:
              "Invalid format for restaurants field. Expected an array of IDs.",
          });
      }
    }
    // Now, 'restaurants' is either a valid array or undefined.

    if (title !== undefined && title.length > 120) {
      return res.status(400).json({ message: "Name exceeds limit" });
    }

    if (title !== undefined && !NAME_REGEX.test(title)) {
      return res.status(400).json({ message: "Name contains invalid characters" });
    }

    if (description !== undefined && description.length > 500) {
      return res.status(400).json({ message: "Description exceeds limit" });
    }

    if (description !== undefined && !DESCRIPTION_REGEX.test(description)) {
      return res.status(400).json({ message: "Invalid characters in description" });
    }

    // Update only the fields that are present in the request body
    if (title !== undefined) collection.title = title;
    if (description !== undefined) collection.description = description;
    if (isDefault !== undefined) collection.isDefault = isDefault;
    if (status !== undefined) collection.status = status;
    if (startDate !== undefined) collection.startDate = startDate;
    if (endDate !== undefined) collection.endDate = endDate;

    // This block is now safer, as `restaurants` is either a proper array or undefined
    if (restaurants !== undefined && Array.isArray(restaurants)) {
      // Ensure all elements are valid ObjectId strings before assignment
      const validRestaurants = restaurants.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (validRestaurants.length !== restaurants.length) {
        console.warn(
          "Some restaurant IDs were not valid ObjectIds and have been filtered out."
        );
      }
      collection.restaurants = validRestaurants;
    }

    // Handle image uploads if provided
    // Ensure cloudinaryConfigured is defined in this file's scope
    const cloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (req.files && req.files.length > 0) {
    const photo = req.files[0]; // Get the first file
    
    if (photo) {
        // The 'path' property now holds the Cloudinary URL directly
        collection.photoWeb = photo.path;
        collection.photoApp = photo.path;
    }
}

    await collection.save();
    res.json({ message: "Collection updated successfully", collection });
  } catch (err) {
    console.error("error while updating collection: ", err.message);

    let errorMessage = err.message;
    // Check if the error is a Mongoose validation error
    if (err.name === "ValidationError") {
      errorMessage = `Collection validation failed: ${Object.keys(err.errors)
        .map((key) => err.errors[key].message)
        .join(", ")}`;
    }
    // Check for the specific CastError on the restaurants field
    else if (err.name === "CastError" && err.path === "restaurants.0") {
      errorMessage = `Invalid format for restaurants. Expected an array of valid IDs, but received an invalid value.`;
    }

    res
      .status(400)
      .json({ message: errorMessage, errorDetails: err.errors || null });
  }
};
// Delete a collection
exports.deleteCollection = async (req, res) => {
  const { id } = req.params;
  let collectionTitle = "Unknown";
  try {
    const collection = await Collection.findById(id);
    if (!collection) {
      historyLogRecorder(
        req,
        "Collection",
        "DELETE",
        [id],
        `Attempted to delete non-existent collection ID ${id}`
      );
      return res.status(404).json({ message: "Collection not found" });
    }
    collectionTitle = collection.title;

    // Check if this is a default collection
    if (collection.isDefault) {
      const defaultCount = await Collection.countDocuments({ isDefault: true });
      if (defaultCount <= 1) {
        // Find another collection to make default
        const anotherCollection = await Collection.findOne({
          _id: { $ne: id },
          status: "Active",
        });

        if (anotherCollection) {
          // Make another collection default
          anotherCollection.isDefault = true;
          await anotherCollection.save();

          historyLogRecorder(
            req,
            "Collection",
            "UPDATE",
            [anotherCollection._id],
            `Made collection '${anotherCollection.title}' default as part of deleting '${collectionTitle}'`
          );
        } else {
          historyLogRecorder(
            req,
            "Collection",
            "DELETE",
            [id],
            `Attempted to delete the last default collection '${collectionTitle}' (ID: ${id}). Forbidden.`
          );
          return res.status(403).json({
            message:
              "Cannot delete a default collection. Please make another collection default first.",
          });
        }
      }
    }

    const deleteCloudinaryAsset = async (url) => {
      if (!url) return;
      const parts = url.split("/");
      const publicIdWithExt = parts
        .slice(parts.indexOf("upload") + 2)
        .join("/");
      const publicId =
        publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) ||
        publicIdWithExt;
      if (publicId) {
        console.log(`Attempting to delete Cloudinary asset: ${publicId}`);
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
          console.log(`Deleted Cloudinary asset: ${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            `Cloudinary deletion failed for public ID ${publicId}:`,
            cloudinaryError
          );
        }
      }
    };

    // Corrected: Use the instance's properties
    await Promise.all([
      deleteCloudinaryAsset(collection.photoWeb),
      deleteCloudinaryAsset(collection.photoApp),
    ]);

    await Collection.findByIdAndDelete(id);

    historyLogRecorder(
      req,
      "Collection",
      "DELETE",
      [id],
      `Deleted collection '${collectionTitle}' (ID: ${id})`
    );

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    historyLogRecorder(
      req,
      "Collection",
      "DELETE",
      [id],
      `Error deleting collection '${collectionTitle}' (ID: ${id}): ${err.message}`
    );
    return res.status(500).json({
      message: "Deletion failed. Please try again later",
      error: err.message,
    });
  }
};

// Bulk delete collections
exports.deleteCollectionsBulk = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No collections selected" });
  }

  try {
    const collections = await Collection.find({ _id: { $in: ids } });

    if (!collections.length) {
      return res.status(404).json({ message: "Collections not found" });
    }

    const totalDefaults = await Collection.countDocuments({ isDefault: true });
    const defaultsToDelete = collections.filter((c) => c.isDefault).length;

    if (totalDefaults - defaultsToDelete < 1) {
      return res.status(403).json({ message: "Cannot delete the last default collection" });
    }

    const deleteCloudinaryAsset = async (url) => {
      if (!url) return;
      const parts = url.split("/");
      const publicIdWithExt = parts.slice(parts.indexOf("upload") + 2).join("/");
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) || publicIdWithExt;
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
        } catch (cloudinaryError) {
          console.error("Cloudinary deletion failed for", publicId, cloudinaryError);
        }
      }
    };

    await Promise.all(
      collections.map(async (collection) => {
        await Promise.all([
          deleteCloudinaryAsset(collection.photoWeb),
          deleteCloudinaryAsset(collection.photoApp),
        ]);
      })
    );

    const result = await Collection.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Collections deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Bulk delete error:", err);
    return res.status(500).json({ message: "Bulk deletion failed", error: err.message });
  }
};

// Return active collections
exports.getActiveCollections = async (req, res) => {
  try {
    const activeCollections = await Collection.find({ status: "Active" })
      .sort({ title: 1 }) // Alphabetical order for consistent listing
      .populate({
        path: "restaurants",
        model: "Firm",
        select: "restaurantInfo image_urls distance promoted",
      });
    res.status(200).json(activeCollections);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error fetching active collections",
        message: err.message,
      });
  }
};

// POST: add a new click entry with the current date
exports.clickCounts = async (req, res) => {
  try {
    const { _id } = req.params;

    // Add a new click entry with the current date
    const updatedCollection = await Collection.findByIdAndUpdate(
      _id,
      { $push: { clicks: { date: new Date() } } }, // Push a new click object
      { new: true }
    );

    res.status(200).json({
      Collection: updatedCollection.title,
      totalClicks: updatedCollection.clicks.length, // Total clicks = length of the array
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating collection click count: ",
      error: err.message,
    });
  }
};

// GET: get clicks by timeframe
exports.getClicksByTimeframe = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe } = req.query; // 'day', 'week', 'month', 'year'

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Get current date
    const now = new Date();
    let startDate;

    // Calculate start date based on timeframe
    switch (timeframe) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        const day = now.getDay();
        startDate = new Date(now.setDate(now.getDate() - day));
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }

    // Filter clicks by date
    const filteredClicks = collection.clicks.filter(
      (click) => new Date(click.date) >= startDate
    );

    res.status(200).json({
      collection: collection.title,
      timeframe,
      totalClicks: filteredClicks.length,
      clicks: filteredClicks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error getting collection clicks by timeframe",
      error: err.message,
    });
  }
};

// Import statements
const Collection = require("../../models/marketing-dashboard/Collection");
// const { uploadOnCloudinary } = require("../../config/cloudinary");

const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const historyLogRecorder = require("../../utils/historyLogRecorder"); // Adjust path
const Notify = require("../../models/logs/notify");
// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ title: 1 });
    historyLogRecorder(
      req,
      "Collection",
      "READ",
      collections.map((c) => c._id),
      `Retrieved all collections (${collections.length} found)`
    );
    res.json(collections);
  } catch (err) {
    historyLogRecorder(
      req,
      "Collection",
      "READ",
      [],
      `Error retrieving all collections: ${err.message}`
    );
    res.status(500).send(err.message);
  }
};

// Create a new collection
/*
exports.createCollection = async (req, res) => {
  let savedCollectionId = null;
  try {
    const { title, isDefault, status } = req.body;
    
    // Check if collection with same title already exists
    const existingCollection = await Collection.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });
    
    if (existingCollection) {
      return res
        .status(400)
        .json({ message: "This collection name already exists" });
    }
    
    const collection = new Collection({
      title,
      isDefault: isDefault || false,
      status: status || "Inactive",
    });

    await collection.save();
    savedCollectionId = collection._id;

    historyLogRecorder(
      req,
      collection.constructor.modelName,
      "CREATE",
      [collection._id],
      `Created new collection '${collection.title}' with ID ${collection._id}`
    );
      const newNotify=new Notify({
            timestamp:new Date(),
            level:"A New Collection",
            type:['admin','restaurant'],
            message:"A New Collection is created in a marketing dashboard",
            metadata:{
              category:["Marketing"],
              isViewed:false,
              isAccept:false,
              isReject:false,
            }
    })
    await newNotify.save();
    res
      .status(201)
      .json({ message: "Collection created successfully", collection });
  } catch (err) {
    historyLogRecorder(
      req,
      "Collection",
      "CREATE",
      savedCollectionId ? [savedCollectionId] : [],
      `Error creating collection: ${err.message}`
    );
    res.status(400).send(err.message);
  }
};
*/

// update a collection
exports.updateCollection = async (req, res) => {
  const { id } = req.params;
  let collectionTitle = "Unknown";
  try {
    const { startDate, endDate, ...bodyFields } = req.body;

    const collection = await Collection.findById(id);
    if (!collection) {
      historyLogRecorder(
        req,
        "Collection",
        "UPDATE",
        [id],
        `Attempted to update non-existent collection ID ${id}`
      );
      return res.status(404).send("Collection not found");
    }
    collectionTitle = collection.title;

    const fieldsToUpdate = {};
    Object.keys(bodyFields).forEach((key) => {
      if (bodyFields[key] !== undefined) {
        fieldsToUpdate[key] = bodyFields[key];
      }
    });
    Object.assign(collection, fieldsToUpdate);

    let newStartDate = collection.startDate;
    let newEndDate = collection.endDate;

    if (startDate !== undefined || endDate !== undefined) {
      newStartDate =
        startDate !== undefined
          ? new Date(startDate)
          : collection.startDate
          ? new Date(collection.startDate)
          : null;
      newEndDate =
        endDate !== undefined
          ? new Date(endDate)
          : collection.endDate
          ? new Date(collection.endDate)
          : null;

      if (startDate !== undefined) collection.startDate = newStartDate;
      if (endDate !== undefined) collection.endDate = newEndDate;

      const now = new Date();
      if (newStartDate && now < newStartDate) {
        collection.status = "Upcoming";
      } else if (newEndDate && now > newEndDate) {
        collection.status = "Inactive";
      } else if (newStartDate && newEndDate) {
        collection.status = "Active";
      } else if (newStartDate && !newEndDate) {
        collection.status = "Active";
      } else {
        collection.status = "Inactive";
      }
    }

    if (collection.isDefault) {
      collection.status = "Active";
      collection.startDate = undefined;
      collection.endDate = undefined;
    }

    // if (req.files && req.files.length > 0) {
    //   const photoWeb = req.files.find((file) => file.fieldname === "photoWeb");
    //   if (photoWeb) {
    //     const cloudinaryRes = await uploadOnCloudinary(photoWeb.path);
    //     if (cloudinaryRes) {
    //       collection.photoWeb = cloudinaryRes.url;
    //     }
    //   }

    //   const photoApp = req.files.find((file) => file.fieldname === "photoApp");
    //   if (photoApp) {
    //     const cloudinaryRes = await uploadOnCloudinary(photoApp.path);
    //     if (cloudinaryRes) {
    //       collection.photoApp = cloudinaryRes.url;
    //     }
    //   }
    // }

    if (req.files && req.files.length > 0) {
    // 1. Find the file object for "photoWeb"
    const photoWeb = req.files.find((file) => file.fieldname === "photoWeb");
    if (photoWeb) {
      // Multer-storage-cloudinary puts the cloud URL directly in 'path' or 'path'
      banner.photoWeb = photoWeb.path; 
    }

    // 2. Find the file object for "photoApp"
    const photoApp = req.files.find((file) => file.fieldname === "photoApp");
    if (photoApp) {
      banner.photoApp = photoApp.path;
    }
}

    await collection.save();

    historyLogRecorder(
      req,
      collection.constructor.modelName,
      "UPDATE",
      [collection._id],
      `Updated collection '${collection.title}' (ID: ${collection._id})`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "A Collection is Updated",
      type: ["admin", "restaurant"],
      message: "A Collection details is updated check it once",
      metadata: {
        category: ["Marketing"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();
    res.json({ message: "Collection updated successfully", collection });
  } catch (err) {
    console.log("error while updating collection: ", err.message);
    historyLogRecorder(
      req,
      "Collection",
      "UPDATE",
      [id],
      `Error updating collection '${collectionTitle}' (ID: ${id}): ${err.message}`
    );
    res.status(400).json({ message: err.message });
  }
};

// to delete
exports.deleteCollection = async (req, res) => {
  const { id } = req.params;
  let collectionTitle = "Unknown";
  try {
    const collection = await Collection.findById(id);
    if (!collection) {
      historyLogRecorder(
        req,
        "Collection",
        "DELETE",
        [id],
        `Attempted to delete non-existent collection ID ${id}`
      );
      return res.status(404).json({ message: "Collection not found" });
    }
    collectionTitle = collection.title;

    // Check if this is a default collection
    if (collection.isDefault) {
      const defaultCount = await Collection.countDocuments({ isDefault: true });
      if (defaultCount <= 1) {
        // Find another collection to make default
        const anotherCollection = await Collection.findOne({
          _id: { $ne: id },
          status: "Active",
        });

        if (anotherCollection) {
          // Make another collection default
          anotherCollection.isDefault = true;
          await anotherCollection.save();

          historyLogRecorder(
            req,
            "Collection",
            "UPDATE",
            [anotherCollection._id],
            `Made collection '${anotherCollection.title}' default as part of deleting '${collectionTitle}'`
          );
        } else {
          historyLogRecorder(
            req,
            "Collection",
            "DELETE",
            [id],
            `Attempted to delete the last default collection '${collectionTitle}' (ID: ${id}). Forbidden.`
          );
          return res.status(403).json({
            message: "At least one default Collection must remain",
          });
        }
      }
    }

    const deleteCloudinaryAsset = async (url) => {
      if (!url) return;
      const parts = url.split("/");
      const publicIdWithExt = parts
        .slice(parts.indexOf("upload") + 2)
        .join("/");
      const publicId =
        publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) ||
        publicIdWithExt;
      if (publicId) {
        console.log(`Attempting to delete Cloudinary asset: ${publicId}`);
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
          console.log(`Deleted Cloudinary asset: ${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            `Cloudinary deletion failed for public ID ${publicId}:`,
            cloudinaryError
          );
        }
      }
    };

    // Corrected: Use the instance's properties
    await Promise.all([
      deleteCloudinaryAsset(collection.photoWeb),
      deleteCloudinaryAsset(collection.photoApp),
    ]);

    await Collection.findByIdAndDelete(id);

    historyLogRecorder(
      req,
      "Collection",
      "DELETE",
      [id],
      `Deleted collection '${collectionTitle}' (ID: ${id})`
    );

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    historyLogRecorder(
      req,
      "Collection",
      "DELETE",
      [id],
      `Error deleting collection '${collectionTitle}' (ID: ${id}): ${err.message}`
    );
    return res.status(500).json({
      message: "Deletion failed. Please try again later",
      error: err.message,
    });
  }
};

// return active collections
exports.getActiveCollections = async (req, res) => {
  try {
    const activeCollections = await Collection.find({ status: "Active" })
      .sort({ title: 1 }) // Alphabetical order for consistent listing
      .populate({
        path: "restaurants",
        model: "Firm",
        select: "restaurantInfo image_urls distance promoted",
      });
    historyLogRecorder(
      req,
      "Collection",
      "READ",
      activeCollections.map((c) => c._id),
      `Retrieved active collections (${activeCollections.length} found)`
    );
    res.status(200).json(activeCollections);
  } catch (err) {
    historyLogRecorder(
      req,
      "Collection",
      "READ",
      [],
      `Error retrieving active collections: ${err.message}`
    );
    res.status(500).json({
      error: "Error fetching active collections",
      message: err.message,
    });
  }
};

// POST: add a new click entry with the current date
exports.clickCounts = async (req, res) => {
  const { _id } = req.params;
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      _id,
      { $push: { clicks: { date: new Date() } } },
      { new: true }
    );

    if (!updatedCollection) {
      historyLogRecorder(
        req,
        "Collection",
        "UPDATE",
        [_id],
        `Attempted to record click for non-existent collection ID ${_id}`
      );
      return res
        .status(404)
        .json({ msg: "Collection not found to record click." });
    }

    historyLogRecorder(
      req,
      updatedCollection.constructor.modelName,
      "UPDATE",
      [updatedCollection._id],
      `Recorded a click for collection '${updatedCollection.title}' (ID: ${updatedCollection._id}). New total clicks: ${updatedCollection.clicks.length}`
    );

    res.status(200).json({
      Collection: updatedCollection.title,
      totalClicks: updatedCollection.clicks.length,
    });
  } catch (err) {
    historyLogRecorder(
      req,
      "Collection",
      "UPDATE",
      [_id],
      `Error recording click for collection ID ${_id}: ${err.message}`
    );
    res.status(500).json({
      msg: "Error updating collection click count",
      error: err.message,
    });
  }
};

// GET: get filtered clicks
exports.getClicksByTimeframe = async (req, res) => {
  const { id } = req.params;
  const { timeframe } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid collection ID" });
    }

    const now = new Date();
    const utcNow = new Date(now.toISOString().slice(0, -1)); // Workaround for UTC parsing
    let startDate;

    switch (timeframe) {
      case "today":
        startDate = new Date(utcNow);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "week":
        // Start on Monday
        const day = utcNow.getUTCDay();
        const diff = day === 0 ? 6 : day - 1;
        startDate = new Date(utcNow);
        startDate.setUTCDate(utcNow.getUTCDate() - diff);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(
          Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1)
        );
        break;
      default:
        return res.status(400).json({ msg: "Invalid timeframe" });
    }

    const collection = await Collection.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          _id: 1,
          title: 1,
          totalClicks: { $size: { $ifNull: ["$clicks", []] } },
          filteredClicks: {
            $size: {
              $filter: {
                input: { $ifNull: ["$clicks", []] },
                as: "click",
                cond: { $gte: ["$$click.date", startDate] },
              },
            },
          },
        },
      },
    ]);

    if (!collection.length) {
      return res.status(404).json({ msg: "Collection not found" });
    }

    historyLogRecorder(
      req,
      "Collection",
      "READ",
      [id],
      `Retrieved click counts for collection '${collection[0].title}' (ID: ${id}). Timeframe: ${timeframe}. Total: ${collection[0].totalClicks}, Filtered: ${collection[0].filteredClicks}`
    );

    res.status(200).json({
      totalClicks: collection[0].totalClicks,
      timeframeClicks: collection[0].filteredClicks,
    });
  } catch (err) {
    historyLogRecorder(
      req,
      "Collection",
      "READ",
      [id],
      `Error retrieving clicks for collection ID ${id} (Timeframe: ${timeframe}): ${err.message}`
    );
    res.status(500).json({ msg: "Error fetching clicks", error: err.message });
  }
};
// Get collection by slug
exports.getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Convert slug to title format (e.g., "my-collection" to "My Collection")
    const titleFromSlug = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Find collection by title (case insensitive) and deeply populate restaurants with ALL needed fields
    const collection = await Collection.findOne({
      title: { $regex: new RegExp("^" + titleFromSlug + "$", "i") },
    }).populate({
      path: "restaurants",
      model: "Firm",
      select:
        "restaurantInfo image_urls distance promoted time offB proExtraB off proExtra",
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Add debug information
    console.log(
      `Collection ${collection.title} has ${collection.restaurants.length} restaurants`
    );
    if (collection.restaurants.length > 0) {
      console.log(
        "First restaurant name:",
        collection.restaurants[0].restaurantInfo?.name
      );
    }

    res.json(collection);
  } catch (err) {
    console.error("Error in getCollectionBySlug:", err);
    res.status(500).send(err.message);
  }
};

exports.getLikedCollections = async (req, res) => {
  try {
    const userId = req.session.user.id; // Get the user ID from the authenticated session

    // Validate the user ID from the session
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID in session" });
    }

    // Find all collections where the `userLike` field matches the authenticated user's ID.
    // The `populate` method is used here to get the full restaurant details if needed.
    // Adjust the `select` string based on the fields you want to return.
    const likedCollections = await Collection.find({
      userLike: userId,
    }).populate({
      path: "restaurants",
      model: "Firm", // Make sure this matches the `ref` in your schema
      select: "name photo price city", // Specify which fields to include
    });

    // If no collections are found, return an empty array and a 200 OK status.
    if (!likedCollections || likedCollections.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No collections liked by this user",
        data: [],
      });
    }

    // Respond with the list of liked collections.
    return res.status(200).json({
      success: true,
      message: "Successfully fetched liked collections",
      data: likedCollections,
    });
  } catch (error) {
    console.error("Error fetching liked collections:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// exports.toggleCollectionLike = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Assuming req.session.user.id holds the authenticated user's ID
//     const userId = req.session.user.id;

//     // Validate the IDs
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid Collection ID" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     // Find the collection
//     const collection = await Collection.findById(id);

//     if (!collection) {
//       return res.status(404).json({ message: "Collection not found" });
//     }

//     let updateOperation;
//     let message;
//     let liked;

//     // Check if the user's ID is already in the userLike array
//     const userAlreadyLiked = collection.userLike.includes(userId);

//     if (userAlreadyLiked) {
//       updateOperation = { $pull: { userLike: userId } };
//       message = "Collection unliked successfully";
//       liked = false;
//     } else {
//       // If the user hasn't liked it, "like" it by adding their ID to the array
//       // The $addToSet operator is ideal here as it prevents duplicate IDs
//       updateOperation = { $addToSet: { userLike: userId } };
//       message = "Collection liked successfully";
//       liked = true;
//     }

//     // Perform the update atomically
//     const updatedCollection = await Collection.findByIdAndUpdate(
//       id,
//       updateOperation,
//       { new: true }
//     );

//     // Send a successful response
//     return res.status(200).json({
//       success: true,
//       message,
//       liked,
//       updatedCollection, // Optional: return the updated document
//     });
//   } catch (error) {
//     console.error("Error toggling collection like:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// exports.toggleCollectionLike = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Assuming req.session.user.id holds the authenticated user's ID
//     const userId = req.session.user?.id;

//     // Validate the IDs
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid Collection ID" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     // Find the collection to check its current state
//     const collection = await Collection.findById(id);

//     if (!collection) {
//       return res.status(404).json({ message: "Collection not found" });
//     }

//     // Safely check if the user has already liked the collection.
//     // The 'collection.userLike' might be undefined or null for older documents,
//     // so we use optional chaining and the '?? []' to ensure it's an array.
//     if(!collection.userLike){
//       collection.userLike=[];
//     }
//     const userAlreadyLiked = (collection.userLike ?? []).includes(userId);

//     let updateOperation;
//     let message;
//     let liked;

//     if (userAlreadyLiked) {
//       // The user has liked it, so "unlike" it by removing their ID.
//       updateOperation = { $pull: { userLike: userId } };
//       message = "Collection unliked successfully";
//       liked = false;
//     } else {
//       // The user hasn't liked it, so "like" it by adding their ID to the array.
//       // $addToSet is the best operator here to prevent duplicates.
//       updateOperation = { $addToSet: { userLike: userId } };
//       message = "Collection liked successfully";
//       liked = true;
//     }

//     // Perform the update atomically
//     const updatedCollection = await Collection.findByIdAndUpdate(
//       id,
//       updateOperation,
//       { new: true }
//     );

//     // Send a successful response
//     return res.status(200).json({
//       success: true,
//       message,
//       liked,
//       updatedCollection,
//     });
//   } catch (error) {
//     console.error("Error toggling collection like:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
exports.toggleCollectionLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user?.id;

    // Validate the IDs
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Collection ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find the collection to check its current state
    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // --- FIX: Safely determine if user has liked and handle data type issues ---
    let userAlreadyLiked = false;
    let updateOperation;
    let message;
    let liked;

    // Check the type of collection.userLike
    if (Array.isArray(collection.userLike)) {
      // userLike is correctly an array, proceed as planned
      userAlreadyLiked = collection.userLike.includes(userId);
    } else if (collection.userLike) {
      // userLike is NOT an array, but a single value (the inconsistent data)
      // Check if the single value matches the userId
      userAlreadyLiked = collection.userLike.toString() === userId.toString();
      // Here, we'll need to use $set to fix the field to an array first.
      // The `$addToSet` and `$pull` operators won't work correctly on a non-array.
    }

    if (userAlreadyLiked) {
      // The user has liked it, so "unlike" it by removing their ID.
      // This will either pull from the array or set the field to an empty array
      // if it was a single object ID.
      updateOperation = { $pull: { userLike: userId } };
      message = "Collection unliked successfully";
      liked = false;
    } else {
      // The user hasn't liked it.
      // We will handle the case where the field is not an array.
      if (!Array.isArray(collection.userLike)) {
        // If the field is not an array, we must first fix it by setting it to an array.
        // The best way to handle this is to perform the update differently.
        // We can use $set to ensure it's an array with the user's ID.
        // Or we can perform the fix first and then the like.
        // Let's use a two-step approach for clarity and safety.

        // Step 1: Fix the data inconsistency
        await Collection.findByIdAndUpdate(
          id,
          { $set: { userLike: [userId] } },
          { new: true }
        );

        message = "Collection liked successfully";
        liked = true;

        // Since the update is already done, we can just return.
        // Or, we can set updatedCollection here to the result of the previous update.
        const updatedCollection = await Collection.findById(id);
        return res.status(200).json({
          success: true,
          message,
          liked,
          updatedCollection,
        });
      } else {
        // The user hasn't liked it and the field is already an array,
        // so "like" it by adding their ID to the array.
        updateOperation = { $addToSet: { userLike: userId } };
        message = "Collection liked successfully";
        liked = true;
      }
    }

    // Perform the update atomically (only if updateOperation was set)
    if (updateOperation) {
      const updatedCollection = await Collection.findByIdAndUpdate(
        id,
        updateOperation,
        { new: true }
      );

      // Send a successful response
      return res.status(200).json({
        success: true,
        message,
        liked,
        updatedCollection,
      });
    }
  } catch (error) {
    console.error("Error toggling collection like:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
