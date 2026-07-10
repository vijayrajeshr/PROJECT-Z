const RestaurantClaimOwnerside = require("../models/RestaurantClaimOwnerside");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const historyLogRecorder = require("../models/historyLog");
const Restaurant = require("../models/claimRestaurant");
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "restaurant-claims",
      resource_type: "auto",
    });
    fs.unlinkSync(file.path); // Remove local file after upload
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("File upload failed");
  }
};

exports.createClaim = async (req, res) => {
  try {
    const userId = req.session?.user.id;
    if (!userId) {
      return res.status(400).json({
        message: "Please Login!",
      });
    }
    const { name, address, ownerName, registrationNumber, email, phone } =
      req.body;

    const documentUrls = {};
    const fileFields = [
      "proofOfOwnership",
      "foodServicesPermit",
      "additionalDocuments",
    ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        documentUrls[field] = await uploadToCloudinary(req.files[field][0]);
      }
    }

    const restaurantClaim = new RestaurantClaimOwnerside({
      name,
      address,
      ownerName,
      registrationNumber,
      email,
      phone,
      ...documentUrls,
      status: "pending",
    });

    await restaurantClaim.save();

    historyLogRecorder(
      req,
      "RestaurantClaimOwnerside",
      "create",
      [restaurantClaim._id],
      "New restaurant claim created"
    );

    res.status(201).json({
      success: true,
      message: "Restaurant claim submitted successfully",
      data: restaurantClaim,
    });
  } catch (error) {
    console.error("Claim creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting restaurant claim",
    });
  }
};

exports.getAllClaims = async (req, res) => {
  try {
    const claims = await RestaurantClaimOwnerside.find();
    res.status(200).json({
      success: true,
      data: claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant claims",
      error: error.message,
    });
  }
};

exports.getClaimById = async (req, res) => {
  try {
    const claim = await RestaurantClaimOwnerside.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Restaurant claim not found",
      });
    }
    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant claim",
      error: error.message,
    });
  }
};

exports.updateClaim = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Upload new files to Cloudinary if provided
    if (req.files) {
      if (req.files["proofOfOwnership"]) {
        const proofOfOwnership = await cloudinary.uploader.upload(
          req.files["proofOfOwnership"][0].path,
          { folder: "restaurants/proofs" }
        );
        updateData.proofOfOwnership = proofOfOwnership.secure_url;
      }
      if (req.files["foodServicesPermit"]) {
        const foodServicesPermit = await cloudinary.uploader.upload(
          req.files["foodServicesPermit"][0].path,
          { folder: "restaurants/permits" }
        );
        updateData.foodServicesPermit = foodServicesPermit.secure_url;
      }
      if (req.files["additionalDocuments"]) {
        const additionalDocuments = await cloudinary.uploader.upload(
          req.files["additionalDocuments"][0].path,
          { folder: "restaurants/documents" }
        );
        updateData.additionalDocuments = additionalDocuments.secure_url;
      }
    }

    const claim = await RestaurantClaimOwnerside.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Restaurant claim not found",
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating restaurant claim",
      error: error.message,
    });
  }
};

exports.deleteClaim = async (req, res) => {
  try {
    const claim = await RestaurantClaimOwnerside.findByIdAndDelete(
      req.params.id
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Restaurant claim not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant claim deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting restaurant claim",
      error: error.message,
    });
  }
};

// Approve a claim
exports.approve = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant name is required" });
    }

    // Find the claim using restaurant name and update the status
    const updatedClaim = await RestaurantClaimOwnerside.findOneAndUpdate(
      { name }, // Finding by restaurant name
      { status: "approved" },
      { new: true }
    );

    if (!updatedClaim) {
      return res
        .status(404)
        .json({ success: false, message: "Claim not found" });
    }

    // Extract ownerName from the updated claim
    const { ownerName } = updatedClaim;

    // Update the restaurant status and ownerName
    await Restaurant.findOneAndUpdate(
      { name },
      { status: "claimed", ownerName }
    );

    res.status(200).json({
      success: true,
      message: "Claim approved successfully",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Error approving claim:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Find a restaurant by registration number
// Find a restaurant by email

exports.getRestaurantByOwnerName = async (req, res) => {
  try {
    const { userId, id } = req.params;
    console.log(req.params, "gettimg params");
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const restaurant = await RestaurantClaimOwnerside.findOne({
      UserId: userId,
      _id: id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error("Error fetching restaurant by owner userId:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllRestaurantByOwnerName = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Logged in User ID:", userId);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const restaurant = await RestaurantClaimOwnerside.find({
      UserId: userId,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error("Error fetching restaurant by owner userId:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getRestaurantByOwnerNameAndByRestaurantId = async (req, res) => {
  try {
    const { ownerId, _id } = req.params;
    console.log("UserId:", ownerId); // "684d10e616842e5b27c131c4"
    console.log("_id:", _id); // "68373a79e95f56f1ff822ba6"
    if (!ownerId || !_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required and Rest ID" });
    }

    const restaurant = await RestaurantClaimOwnerside.findOne({
      UserId: ownerId,
      _id: _id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error("Error fetching restaurant by owner userId:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
