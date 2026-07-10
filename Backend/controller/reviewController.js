const express = require("express");
const Review = require("../models/Reviews");
const router = express.Router();
const User = require("../models/user");
const historyLogRecorder = require("../utils/historyLogRecorder"); // Adjust path
const mongoose = require("mongoose");
const Firm = require("../models/Firm"); // Adjust the path as necessary
const { authenticateToken } = require("./../controller/DashboardToken/JWT");
const { isAuthenticated } = require("../config/authHandlers");
const Tiffin = require("../models/Tiffin")
router.post("/reviews/firm/:id", isAuthenticated, async (req, res) => {
  const { rating, reviewType, reviewText, email } = req.body.newReview;
  console.log(req.body.newReview, "getting review data");
  if (!rating || !reviewType || !email) {
    return res.status(400).json({
      error: "Missing required fields: email, rating, reviewType",
    });
  }
  try {
    const firmDoc = await Firm.findById(req.params.id);
    if (!firmDoc) {
      return res.status(404).json({ error: "Firm not found" });
    }
    const review = {
      email,
      authorId: req.session?.user?.id || "",
      author_name: req.session?.user?.username || "Unknown",
      date: new Date().toISOString(),
      rating,
      reviewType,
      comments: [reviewText],
    };
    console.log(review, "getting the reviews");

    firmDoc.reviews.push(review);
    await firmDoc.save();

    historyLogRecorder(
      req,
      "Firm",
      "REVIEW_ADDED",
      [firmDoc._id],
      `Review added by ${req.session.user.id.email} for firm ${firmDoc._id}`
    );

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.post("/reviews/:id", isAuthenticated, async (req, res) => {
  const { rating, reviewType, reviewText, email } = req.body.newReview;
  console.log(req.body);
  if (!rating || !reviewType || !email) {
    return res.status(400).json({
      error: "Missing required fields: email, rating, reviewType",
    });
  }
  try {
    const firmDoc = await Tiffin.findById(req.params.id);
    if (!firmDoc) {
      return res.status(404).json({ error: "Firm not found" });
    }
    console.log(req.session)
    const review = {
      email,
      authorId: req.session?.user?.id || "",
      author_name: req.session?.user?.username || "Unknown",
      date: new Date().toISOString(),
      rating,
      reviewType,
      comments: [reviewText],
    };
    firmDoc.reviews = [];
    firmDoc.reviews.push(review);
    console.log(firmDoc);
    await firmDoc.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "REVIEW_ADDED",
      [firmDoc._id],
      `Review added by ${req.session.user.id.email} for Tiffin ${firmDoc._id}`
    );

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});
router.post(
  "/reviews/restaurant-owner/commentandedit-reply/:firmId/:reviewId",
  authenticateToken,
  async (req, res) => {
    const { reply } = req.body;
    const { firmId, reviewId } = req.params;

    if (!firmId || !reviewId || !reply?.trim()) {
      return res.status(400).json({
        error: "Missing required fields: firmId, reviewId, reply",
      });
    }

    try {
      const firm = await Firm.findOne({
        _id: firmId,
        "reviews._id": reviewId,
      });

      if (!firm) {
        return res.status(404).json({ error: "Firm or review not found" });
      }

      const review = firm.reviews.id(reviewId);

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      const isNewReply = !review.ownerReply;

      // If new, create the reply; else, edit the existing one
      review.ownerReply = {
        ...review.ownerReply, // keep existing username/createdAt if editing
        reply,
        username: "RestaurantOwner",
        createdAt: review.ownerReply?.createdAt || new Date(),
        editedAt: !isNewReply ? new Date() : undefined,
      };

      firm.markModified("reviews");
      await firm.save();

      return res.status(200).json({
        message: isNewReply
          ? "Owner reply posted successfully"
          : "Owner reply updated successfully",
      });
    } catch (error) {
      console.error("Error posting/editing owner reply:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
);
router.post(
  "/reviews/tiffin-owner/commentandedit-reply/:reviewId",
  authenticateToken,
  async (req, res) => {
    const { reply } = req.body;
    const { reviewId } = req.params;
    const { email } = req.user;
    if (!reviewId || !reply?.trim()) {
      return res.status(400).json({
        error: "Missing required fields: firmId, reviewId, reply",
      });
    }

    try {
      const firm = await Tiffin.findOne({
        ownerMail: email,
        "reviews._id": reviewId,
      });

      if (!firm) {
        return res.status(404).json({ error: "Firm or review not found" });
      }

      const review = firm.reviews.id(reviewId);

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      const isNewReply = !review.ownerReply;

      // If new, create the reply; else, edit the existing one
      review.ownerReply = {
        ...review.ownerReply, // keep existing username/createdAt if editing
        reply,
        username: "TiffinOwner",
        createdAt: review.ownerReply?.createdAt || new Date(),
        editedAt: !isNewReply ? new Date() : undefined,
      };

      firm.markModified("reviews");
      await firm.save();

      return res.status(200).json({
        message: isNewReply
          ? "Owner reply posted successfully"
          : "Owner reply updated successfully",
      });
    } catch (error) {
      console.error("Error posting/editing owner reply:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
);
router.post("/reviews", async (req, res) => {
  const userName = req.session.user.username;
  const userId = req.session.user?.id;
  // Ensure newReview object exists and destructure needed fields
  if (!req.body.newReview) {
    return res
      .status(400)
      .json({ error: "Missing 'newReview' object in request body." });
  }

  const {
    email,
    date = new Date(), // Default date if not provided
    days,
    rating,
    reviewText,
    reviewType,
    aspects, // Assuming aspects is an object sent from frontend
    firm, // Expecting ObjectId string or null
    tiffin, // Expecting ObjectId string or null
  } = req.body.newReview;

  // --- Basic Validation ---
  if (!email || !reviewText) {
    return res
      .status(400)
      .json({ error: "Email and reviewText are required." });
  }

  // Validate rating if necessary (Mongoose schema might handle this too)
  if (
    rating !== undefined &&
    (typeof rating !== "number" || rating < 0 || rating > 5)
  ) {
    return res.status(400).json({ error: "Invalid rating value." });
  }

  try {
    // --- Find User ---
    console.log(`Finding user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res
        .status(404)
        .json({ error: "User with the provided email does not exist." });
    }
    console.log(`User found: ${user._id}`);

    // --- Construct Review Data Explicitly ---
    const reviewData = {
      authorId: userId,
      authorName: userName, // Assign the ObjectId from the looked-up user
      email: email, // Assign the validated email string
      date: date, // Use the provided or defaulted date
      rating: rating, // Assign the rating number
      reviewText: reviewText, // Assign the review text string
      reviewType: reviewType, // Assign the type string
      // Optional fields - include only if they exist and are needed by schema
      ...(days && { days: days }),
      ...(aspects && typeof aspects === "object" && { aspects: aspects }), // Include aspects if it's an object
      ...(firm &&
        mongoose.Types.ObjectId.isValid(firm) && {
        firm: new mongoose.Types.ObjectId(firm),
      }), // Convert firm string to ObjectId if valid
      ...(tiffin &&
        mongoose.Types.ObjectId.isValid(tiffin) && {
        tiffin: new mongoose.Types.ObjectId(tiffin),
      }), // Convert tiffin string to ObjectId if valid
    };

    console.log("Constructed review data for saving:", reviewData);

    // --- Create and Save Review ---
    const review = new Review(reviewData);
    const savedReview = await review.save(); // This should now work

    console.log(`Review saved successfully: ${savedReview._id}`);

    // --- Populate and Respond ---
    // Populate authorName and potentially firm/tiffin if needed for display
    const populatedReview = await Review.findById(savedReview._id)
      .populate("authorName", "username profileImage") // Populate specific fields from User
      // Add .populate for firm/tiffin if you need their names in the response
      // .populate("firm", "restaurantInfo.name")
      // .populate("tiffin", "kitchenName")
      .lean(); // Use lean for plain JS object response

    // --- History Logging ---
    // Consider making historyLogRecorder async if it involves DB operations
    historyLogRecorder(
      req, // Pass the request object
      savedReview.constructor.modelName, // Entity: "Review"
      "CREATE", // Action: CREATE
      [savedReview._id], // Entity ID (as array)
      `New review (ID: ${savedReview._id}) submitted by user ${user.email}` // Description
    );

    // --- Send Response ---
    res.status(201).json(populatedReview); // Return the populated review
  } catch (error) {
    console.error("Error during review creation:", error);
    // Provide more specific error info if it's a validation error
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Review validation failed", details: error.errors });
    }
    res.status(500).json({
      error: "Internal server error during review creation.",
      details: error.message,
    });
  }
});

router.get(
  "/reviews/topmostrecentreviews/:id",
  authenticateToken,
  async (req, res) => {
    try {
      // MongoDB/Mongoose example
      console.log(req.params.id, "getting the user id ");
      const topReviews = await Firm.find({ _id: req.params.id })
        .select("reviews")
        .sort({ createdAt: -1 })
        .limit(5);
      if (!topReviews) {
        historyLogRecorder(
          req,
          "Review",
          "READ",
          [req.params.id],
          `Attempted to read non-existent review ID ${req.params.id}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found" });
      }

      historyLogRecorder(
        req,
        "Review",
        "READ",
        [topReviews._id],
        `Read review with ID ${topReviews._id}`
      );
      res.status(200).json({ response: true, topReviews });
    } catch (error) {
      historyLogRecorder(
        req,
        "Review",
        "READ",
        [req.params.id],
        `Error reading review ID ${req.params.id}: ${error.message}`
      );
      res.status(500).json({ response: false, message: error.message });
    }
  }
);

//get review by multiple id
router.get(
  "/reviews/multiple-reviews/:email",
  authenticateToken,
  async (req, res) => {
    try {
      const email = req.params.email;
      const firmDocs = await Firm.find(
        {
          ownerEmail: { $regex: new RegExp(`^${email}$`, "i") },
          restaurantStatus: "Approved",
        },
        { _id: 1 }
      );

      if (!firmDocs || firmDocs.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No firms found for the provided email",
        });
      }

      const firmIds = firmDocs.map((doc) => doc._id);
      const firmObjectIds = firmIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const review = await Firm.find({
        _id: { $in: firmObjectIds },
      }).select("reviews");
      if (!review) {
        historyLogRecorder(
          req,
          "Review",
          "READ",
          [req.params.id],
          `Attempted to read non-existent review ID ${req.params.email}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found" });
      }

      historyLogRecorder(
        req,
        "Review",
        "READ",
        [review._id],
        `Read review with ID ${review._id}`
      );
      res.status(200).json({ response: true, review });
    } catch (error) {
      historyLogRecorder(
        req,
        "Review",
        "READ",
        [req.params.email],
        `Error reading review ID ${req.params.email}: ${error.message}`
      );
      res.status(500).json({ response: false, message: error.message });
    }
  }
);

router.get("/reviews", async (req, res) => {
  try {
    const { firm, page = 1, limit = 10, sort = "-date" } = req.query;

    if (!firm) {
      return res.status(400).json({ error: "Firm ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(firm)) {
      return res.status(400).json({ error: "Invalid firm ID" });
    }

    const filter = { firm: new mongoose.Types.ObjectId(firm) };

    const reviews = await Review.find(filter)
      .populate({
        path: "firm",
        select: "restaurantInfo.name",
      })
      .populate({
        path: "user",
        select: "username",
        model: "User",
      })
      .populate({
        path: "tiffin",
        select: "name",
      })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const totalReviews = await Review.countDocuments(filter);

    historyLogRecorder({
      req,
      entity: "Review",
      action: "READ",
      entityId: firm,
      description: `Fetched reviews for firm ID: ${firm}`,
    });

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalReviews,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/reviews/:id", authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: "user",
        select: "username",
        model: "User",
      })
      .populate({
        path: "firm",
        select: "restaurantInfo.name",
      })
      .populate({
        path: "tiffin",
        select: "name",
      })
      .lean();

    if (!review) {
      historyLogRecorder(
        req,
        "Review",
        "READ",
        [req.params.id],
        `Attempted to read non-existent review ID ${req.params.id}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found" });
    }

    historyLogRecorder(
      req,
      "Review",
      "READ",
      [review._id],
      `Read review with ID ${review._id}`
    );
    res.status(200).json({ response: true, review });
  } catch (error) {
    historyLogRecorder(
      req,
      "Review",
      "READ",
      [req.params.id],
      `Error reading review ID ${req.params.id}: ${error.message}`
    );
    res.status(500).json({ response: false, message: error.message });
  }
});
router.get(
  "/reviews/restaurant-dashboard/getall-reviews/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const review = await Firm.findById(req.params.id).select("reviews");

      if (!review) {
        historyLogRecorder(
          req,
          "Review",
          "READ",
          [req.params.id],
          `Attempted to read non-existent review ID ${req.params.id}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found" });
      }

      historyLogRecorder(
        req,
        "Review",
        "READ",
        [review._id],
        `Read review with ID ${review._id}`
      );
      res.status(200).json({ response: true, review });
    } catch (error) {
      historyLogRecorder(
        req,
        "Review",
        "READ",
        [req.params.id],
        `Error reading review ID ${req.params.id}: ${error.message}`
      );
      res.status(500).json({ response: false, message: error.message });
    }
  }
);

router.put(
  "/reviews/restaurant-owner/reviews-hide/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const reviewId = req.params.id; // Use reviewId directly from params
      const { isHidden } = req.body;

      console.log("Attempting to hide/unhide review:", { reviewId, isHidden });

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        console.log("Invalid review ID:", { reviewId, type: typeof reviewId });
        return res
          .status(400)
          .json({ response: false, message: "Invalid review ID." });
      }

      if (typeof isHidden !== "boolean") {
        console.log("Invalid isHidden value:", {
          isHidden,
          type: typeof isHidden,
        });
        return res.status(400).json({
          response: false,
          message: "isHidden must be a boolean value.",
        });
      }

      // Check if review exists
      const firm = await Firm.findOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        { "reviews.$": 1 }
      );

      if (!firm?.reviews?.length) {
        console.log("Review not found:", { reviewId });
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to hide/unhide non-existent review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const updateResult = await Firm.updateOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        {
          $set: {
            "reviews.$.isHidden": isHidden,
            "reviews.$.updatedAt": new Date(),
          },
        }
      );

      if (!updateResult.matchedCount) {
        console.log("Update failed for review:", reviewId);

        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const updatedFirm = await Firm.findOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        { "reviews.$": 1 }
      ).lean();

      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Review ${reviewId} ${isHidden ? "hid" : "unhid"}`
      );

      res.status(200).json({
        response: true,
        review: updatedFirm.reviews[0],
        message: `Review ${isHidden ? "hidden" : "unhidden"} successfully.`,
      });
    } catch (error) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [req.params.reviewId || "unknown"],
        `Error updating review ${req.params.reviewId || "unknown"}: ${error.message
        }`
      );

      console.error("Error hiding/unhiding review:", error.message);
      res
        .status(500)
        .json({ response: false, message: "Internal server error." });
    }
  }
);
router.put(
  "/reviews/tiffin-owner/reviews-hide/:id",
  authenticateToken,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const reviewId = req.params.id; // Use reviewId directly from params
      const { isHidden } = req.body;

      console.log("Attempting to hide/unhide review:", { reviewId, isHidden });

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        console.log("Invalid review ID:", { reviewId, type: typeof reviewId });
        return res
          .status(400)
          .json({ response: false, message: "Invalid review ID." });
      }

      if (typeof isHidden !== "boolean") {
        console.log("Invalid isHidden value:", {
          isHidden,
          type: typeof isHidden,
        });
        return res.status(400).json({
          response: false,
          message: "isHidden must be a boolean value.",
        });
      }

      // Check if review exists
      const firm = await Tiffin.findOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        { "reviews.$": 1 }
      ).session(session);

      if (!firm?.reviews?.length) {
        console.log("Review not found:", { reviewId });
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to hide/unhide non-existent review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const updateResult = await Firm.updateOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        {
          $set: {
            "reviews.$.isHidden": isHidden,
            "reviews.$.updatedAt": new Date(),
          },
        },
        { session }
      );

      if (!updateResult.matchedCount) {
        console.log("Update failed for review:", reviewId);
        await session.abortTransaction();
        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const updatedFirm = await Firm.findOne(
        { "reviews._id": new mongoose.Types.ObjectId(reviewId) },
        { "reviews.$": 1 }
      )
        .lean()
        .session(session);

      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Review ${reviewId} ${isHidden ? "hid" : "unhid"}`
      );
      await session.commitTransaction();

      res.status(200).json({
        response: true,
        review: updatedFirm.reviews[0],
        message: `Review ${isHidden ? "hidden" : "unhidden"} successfully.`,
      });
    } catch (error) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [req.params.reviewId || "unknown"],
        `Error updating review ${req.params.reviewId || "unknown"}: ${error.message
        }`
      );
      await session.abortTransaction();
      console.error("Error hiding/unhiding review:", error.message);
      res
        .status(500)
        .json({ response: false, message: "Internal server error." });
    } finally {
      session.endSession();
    }
  }
);
router.put("/reviews/:id", authenticateToken, async (req, res) => {
  try {
    // Destructure isHidden along with other potential update fields
    const { firm, tiffin, isHidden, ...updateData } = req.body;

    // Construct the update object, including isHidden if provided
    const updatePayload = {
      ...updateData,
      firm: firm || null,
      tiffin: tiffin || null,
    };

    // Only add isHidden to the payload if it's explicitly included in the request body
    if (typeof isHidden === "boolean") {
      updatePayload.isHidden = isHidden;
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!review) {
      historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [req.params.id],
        `Attempted to update non-existent review ID ${req.params.id}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found" });
    }

    historyLogRecorder(
      req,
      review.constructor.modelName,
      "UPDATE",
      [review._id],
      `Updated review with ID ${review._id} (isHidden: ${review.isHidden})` // Log isHidden status
    );
    res.status(200).json({ response: true, review });
  } catch (error) {
    historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [req.params.id],
      `Error updating review ID ${req.params.id}: ${error.message}`
    );
    res.status(400).json({ response: false, message: error.message });
  }
});

router.delete("/reviews/:id", authenticateToken, async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    const updateResult = await Firm.updateOne(
      { "reviews._id": reviewId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    if (!updateResult.matchedCount) {
      await historyLogRecorder(
        req,
        "Review",
        "DELETE",
        [reviewId],
        `Attempted to delete non-existent review ${reviewId}`
      );

      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    await historyLogRecorder(
      req,
      "Review",
      "DELETE",
      [reviewId],
      `User ${userId} deleted review ${reviewId}`
    );

    res
      .status(200)
      .json({ response: true, message: "Review deleted successfully." });
  } catch (error) {
    await historyLogRecorder(
      req,
      "Review",
      "DELETE",
      [req.params.id],
      `Error deleting review ${req.params.id}: ${error.message}`
    );

    console.error("Error deleting review:", error.message);
    res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  }
});

router.delete("/reviews/tiffin/:id", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    const updateResult = await Tiffin.updateOne(
      { "reviews._id": reviewId },
      { $pull: { reviews: { _id: reviewId } } },
      { session }
    );

    if (!updateResult.matchedCount) {
      await historyLogRecorder(
        req,
        "Review",
        "DELETE",
        [reviewId],
        `Attempted to delete non-existent review ${reviewId}`
      );
      await session.abortTransaction();
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    await historyLogRecorder(
      req,
      "Review",
      "DELETE",
      [reviewId],
      `User ${userId} deleted review ${reviewId}`
    );
    await session.commitTransaction();

    res
      .status(200)
      .json({ response: true, message: "Review deleted successfully." });
  } catch (error) {
    await historyLogRecorder(
      req,
      "Review",
      "DELETE",
      [req.params.id],
      `Error deleting review ${req.params.id}: ${error.message}`
    );
    await session.abortTransaction();
    console.error("Error deleting review:", error.message);
    res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  } finally {
    session.endSession();
  }
});

router.post("/reviews/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.session?.user?.id;
    const username = req.session?.user?.username;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    if (!comment) {
      return res
        .status(400)
        .json({ response: false, message: "Comment is required." });
    }

    const firm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    );
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Attempted to comment on non-existent review ${reviewId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updateResult = await Firm.updateOne(
      { "reviews._id": reviewId },
      {
        $push: {
          "reviews.$.usercomments": {
            commentId: new mongoose.Types.ObjectId().toString(),
            username,
            comment,
            date: new Date(),
            replies: [],
          },
        },
        $set: { "reviews.$.updatedAt": new Date() },
      }
    );

    if (!updateResult.matchedCount) {
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).lean();

    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} added comment to review ${reviewId}`
    );

    res.status(200).json({
      response: true,
      review: updatedFirm.reviews[0],
      message: "Comment added successfully.",
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  }
});
router.post("/reviews/tiffin/:id/comments", isAuthenticated, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.session?.user?.id;
    const username = req.session?.user?.username;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    if (!comment) {
      return res
        .status(400)
        .json({ response: false, message: "Comment is required." });
    }

    const firm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).session(session);
    console.log(firm);
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Attempted to comment on non-existent review ${reviewId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updateResult = await Tiffin.updateOne(
      { "reviews._id": reviewId },
      {
        $push: {
          "reviews.$.usercomments": {
            commentId: new mongoose.Types.ObjectId().toString(),
            username,
            comment,
            date: new Date(),
            replies: [],
          },
        },
        $set: { "reviews.$.updatedAt": new Date() },
      },
      { session }
    );

    if (!updateResult.matchedCount) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    )
      .lean()
      .session(session);

    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} added comment to review ${reviewId}`
    );
    await session.commitTransaction();

    res.status(200).json({
      response: true,
      review: updatedFirm.reviews[0],
      message: "Comment added successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error adding comment:", error.message);
    res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  } finally {
    session.endSession();
  }
});
router.post(
  "/reviews/:reviewId/comments/:commentId/replies",
  isAuthenticated,
  async (req, res) => {
    try {
      const { reviewId, commentId } = req.params;
      const { reply } = req.body;
      const userId = req.session?.user?.id;
      const username = req.session?.user?.username;

      if (
        !userId ||
        !mongoose.Types.ObjectId.isValid(reviewId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return res.status(400).json({
          response: false,
          message: "Invalid user, review, or comment ID.",
        });
      }

      if (!reply?.trim()) {
        return res
          .status(400)
          .json({ response: false, message: "Reply text is required." });
      }

      const firm = await Firm.findOne(
        {
          "reviews._id": reviewId,
          "reviews.usercomments.commentId": commentId,
        },
        { "reviews.$": 1 }
      );

      if (!firm?.reviews?.length) {
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to reply to non-existent review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const review = firm.reviews[0];
      const comment = review.usercomments.find(
        (c) => c.commentId === commentId
      );
      if (!comment) {
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to reply to non-existent comment ${commentId} in review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Comment not found." });
      }

      const updateResult = await Firm.updateOne(
        {
          "reviews._id": reviewId,
          "reviews.usercomments.commentId": commentId,
        },
        {
          $push: {
            "reviews.$.usercomments.$[comment].replies": {
              reply,
              username,
              createdAt: new Date(),
            },
          },
          $set: { "reviews.$.updatedAt": new Date() },
        },
        {
          arrayFilters: [{ "comment.commentId": commentId }],
        }
      );

      if (!updateResult.matchedCount) {
        return res
          .status(404)
          .json({ response: false, message: "Comment not found." });
      }

      const updatedFirm = await Firm.findOne(
        { "reviews._id": reviewId },
        { "reviews.$": 1 }
      ).lean();

      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `User ${userId} replied to comment ${commentId} in review ${reviewId}`
      );

      res.status(200).json({
        response: true,
        review: updatedFirm.reviews[0],
        message: "Reply added successfully.",
      });
    } catch (error) {
      console.error("Error adding reply:", error.message);
      res
        .status(500)
        .json({ response: false, message: "Internal server error." });
    }
  }
);
router.post(
  "/reviews/tiffin/:reviewId/comments/:commentId/replies",
  isAuthenticated,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { reviewId, commentId } = req.params;
      const { reply } = req.body;
      const userId = req.session?.user?.id;
      const username = req.session?.user?.username;

      if (
        !userId ||
        !mongoose.Types.ObjectId.isValid(reviewId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return res.status(400).json({
          response: false,
          message: "Invalid user, review, or comment ID.",
        });
      }

      if (!reply?.trim()) {
        return res
          .status(400)
          .json({ response: false, message: "Reply text is required." });
      }

      const firm = await Tiffin.findOne(
        {
          "reviews._id": reviewId,
          "reviews.usercomments.commentId": commentId,
        },
        { "reviews.$": 1 }
      ).session(session);

      if (!firm?.reviews?.length) {
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to reply to non-existent review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Review not found." });
      }

      const review = firm.reviews[0];
      const comment = review.usercomments.find(
        (c) => c.commentId === commentId
      );
      if (!comment) {
        await historyLogRecorder(
          req,
          "Review",
          "UPDATE",
          [reviewId],
          `Attempted to reply to non-existent comment ${commentId} in review ${reviewId}`
        );
        return res
          .status(404)
          .json({ response: false, message: "Comment not found." });
      }

      const updateResult = await Tiffin.updateOne(
        {
          "reviews._id": reviewId,
          "reviews.usercomments.commentId": commentId,
        },
        {
          $push: {
            "reviews.$.usercomments.$[comment].replies": {
              reply,
              username,
              createdAt: new Date(),
            },
          },
          $set: { "reviews.$.updatedAt": new Date() },
        },
        {
          arrayFilters: [{ "comment.commentId": commentId }],
          session,
        }
      );

      if (!updateResult.matchedCount) {
        await session.abortTransaction();
        return res
          .status(404)
          .json({ response: false, message: "Comment not found." });
      }

      const updatedFirm = await Tiffin.findOne(
        { "reviews._id": reviewId },
        { "reviews.$": 1 }
      )
        .lean()
        .session(session);

      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `User ${userId} replied to comment ${commentId} in review ${reviewId}`
      );
      await session.commitTransaction();

      res.status(200).json({
        response: true,
        review: updatedFirm.reviews[0],
        message: "Reply added successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Error adding reply:", error.message);
      res
        .status(500)
        .json({ response: false, message: "Internal server error." });
    } finally {
      session.endSession();
    }
  }
);
router.post("/reviews/:id/follow", isAuthenticated, async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ response: false, message: "Authentication required." });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid review ID." });
    }

    const firm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    );
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Failed follow/unfollow attempt for review ${reviewId} by user ${userId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const review = firm.reviews[0];
    const hasFollowed = review.followBy.includes(userId);

    const updateReviewQuery = hasFollowed
      ? {
        $inc: { "reviews.$.followers": -1 },
        $pull: { "reviews.$.followBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      }
      : {
        $inc: { "reviews.$.followers": 1 },
        $addToSet: { "reviews.$.followBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      };

    const updateUserQuery = hasFollowed
      ? { $pull: { followings: reviewId }, $set: { updatedAt: new Date() } }
      : {
        $addToSet: { followings: reviewId },
        $set: { updatedAt: new Date() },
      };

    const [updateReviewResult] = await Promise.all([
      Firm.updateOne({ "reviews._id": reviewId }, updateReviewQuery),
      User.updateOne({ _id: userId }, updateUserQuery),
    ]);

    if (!updateReviewResult.matchedCount) {
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).lean();

    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} ${hasFollowed ? "unfollowed" : "followed"
      } review ${reviewId}`
    );

    res.status(200).json({
      response: true,
      followers: updatedFirm.reviews[0].followers,
      followBy: updatedFirm.reviews[0].followBy,
      message: hasFollowed ? "Review unfollowed." : "Review followed.",
    });
  } catch (error) {
    console.error("Error in follow/unfollow:", error.message);
    res.status(500).json({
      response: false,
      message: "Server error.",
      error: error.message,
    });
  }
});

router.post("/reviews/tiffin/:id/follow", isAuthenticated, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ response: false, message: "Authentication required." });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid review ID." });
    }

    const firm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).session(session);
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Failed follow/unfollow attempt for review ${reviewId} by user ${userId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const review = firm.reviews[0];
    const hasFollowed = review.followBy.includes(userId);

    const updateReviewQuery = hasFollowed
      ? {
        $inc: { "reviews.$.followers": -1 },
        $pull: { "reviews.$.followBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      }
      : {
        $inc: { "reviews.$.followers": 1 },
        $addToSet: { "reviews.$.followBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      };

    const updateUserQuery = hasFollowed
      ? { $pull: { followings: reviewId }, $set: { updatedAt: new Date() } }
      : {
        $addToSet: { followings: reviewId },
        $set: { updatedAt: new Date() },
      };

    const [updateReviewResult] = await Promise.all([
      Tiffin.updateOne({ "reviews._id": reviewId }, updateReviewQuery, {
        session,
      }),
      User.updateOne({ _id: userId }, updateUserQuery, { session }),
    ]);

    if (!updateReviewResult.matchedCount) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    )
      .lean()
      .session(session);
    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} ${hasFollowed ? "unfollowed" : "followed"
      } review ${reviewId}`
    );

    await session.commitTransaction();
    res.status(200).json({
      response: true,
      followers: updatedFirm.reviews[0].followers,
      followBy: updatedFirm.reviews[0].followBy,
      message: hasFollowed ? "Review unfollowed." : "Review followed.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in follow/unfollow:", error.message);
    res.status(500).json({
      response: false,
      message: "Server error.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});
router.post("/reviews/:id/like", isAuthenticated, async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    const firm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    );
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Failed like/unlike for review ${reviewId} by user ${userId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const review = firm.reviews[0];
    const hasLiked = review.likedBy.includes(userId);
    const updateQuery = hasLiked
      ? {
        $inc: { "reviews.$.likes": -1 },
        $pull: { "reviews.$.likedBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      }
      : {
        $inc: { "reviews.$.likes": 1 },
        $addToSet: { "reviews.$.likedBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      };

    const updateResult = await Firm.updateOne(
      { "reviews._id": reviewId },
      updateQuery
    );

    if (!updateResult.matchedCount) {
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).lean();

    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} ${hasLiked ? "unliked" : "liked"} review ${reviewId}`
    );

    res.status(200).json({
      response: true,
      likes: updatedFirm.reviews[0].likes,
      likedBy: updatedFirm.reviews[0].likedBy,
      message: hasLiked ? "Review unliked." : "Review liked.",
    });
  } catch (error) {
    console.error("Error in like/unlike:", error.message);
    res.status(500).json({ response: false, message: "Server error." });
  }
});
router.post("/reviews/tiffin/:id/like", isAuthenticated, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: reviewId } = req.params;
    const userId = req.session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    const firm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    ).session(session);
    if (!firm?.reviews?.length) {
      await historyLogRecorder(
        req,
        "Review",
        "UPDATE",
        [reviewId],
        `Failed like/unlike for review ${reviewId} by user ${userId}`
      );
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const review = firm.reviews[0];
    const hasLiked = review.likedBy.includes(userId);
    const updateQuery = hasLiked
      ? {
        $inc: { "reviews.$.likes": -1 },
        $pull: { "reviews.$.likedBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      }
      : {
        $inc: { "reviews.$.likes": 1 },
        $addToSet: { "reviews.$.likedBy": userId },
        $set: { "reviews.$.updatedAt": new Date() },
      };

    const updateResult = await Tiffin.updateOne(
      { "reviews._id": reviewId },
      updateQuery,
      { session }
    );

    if (!updateResult.matchedCount) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const updatedFirm = await Tiffin.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 }
    )
      .lean()
      .session(session);
    await historyLogRecorder(
      req,
      "Review",
      "UPDATE",
      [reviewId],
      `User ${userId} ${hasLiked ? "unliked" : "liked"} review ${reviewId}`
    );

    await session.commitTransaction();
    res.status(200).json({
      response: true,
      likes: updatedFirm.reviews[0].likes,
      likedBy: updatedFirm.reviews[0].likedBy,
      message: hasLiked ? "Review unliked." : "Review liked.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in like/unlike:", error.message);
    res.status(500).json({ response: false, message: "Server error." });
  } finally {
    session.endSession();
  }
});

// router.get("/reviews/user/profile", async (req, res) => {
//   try {
//     console.log(req?.session);
//     const sessionUserId = req.session?.user?.id;

//     if (!sessionUserId) {
//       return res
//         .status(401)
//         .json({ response: false, message: "Unauthorized access." });
//     }

//     if (!mongoose.Types.ObjectId.isValid(sessionUserId)) {
//       return res
//         .status(400)
//         .json({ response: false, message: "Invalid user ID format." });
//     }
//     const firms = await Firm.find(
//       { "reviews.authorId": sessionUserId},
//       {
//         "reviews.$": 1,
//         "restaurantInfo.name": 1,
//         "restaurantInfo.address": 1,
//         "restaurantInfo.image_urls": 1,
//       }
//     )
//       .populate("reviews.authorId", "username")
//       .lean();
//     const reviews = firms.map((firm) => ({
//       ...firm.reviews[0],
//       restaurant: {
//         name: firm.restaurantInfo.name,
//         address: firm.restaurantInfo.address,
//         imageUrl: firm.restaurantInfo.image_urls?.[0] || "",
//       },
//     }));

//     res.status(200).json({ response: true, reviews });
//   } catch (error) {
//     console.error("Error fetching user reviews:", error.message);
//     res
//       .status(500)
//       .json({ response: false, message: "Internal server error." });
//   }
// });
router.get("/reviews/user/profile", async (req, res) => {
  try {
    console.log(req?.session);
    const sessionUserId = req.session?.user?.id;

    if (!sessionUserId) {
      return res
        .status(401)
        .json({ response: false, message: "Unauthorized access." });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionUserId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user ID format." });
    }

    // --- Fetch reviews for Firms (Restaurants) ---
    const firms = await Firm.find(
      { "reviews.authorId": sessionUserId },
      {
        "reviews.$": 1, // Project only the matched review
        "restaurantInfo.name": 1,
        "restaurantInfo.address": 1,
        "image_urls": 1,
      }
    )
      .populate("reviews.authorId", "username")
      .lean();

    const restaurantReviews = firms.map((firm) => ({
      ...firm.reviews[0], // Access the first (and only, due to $) matched review
      firmType: "restaurant", // Add a type to distinguish
      firmDetails: {
        name: firm.restaurantInfo.name,
        address: firm.restaurantInfo.address,
        imageUrl: firm.restaurantInfo.image_urls?.[0] || "",
      },
    }));

    // --- Fetch reviews for Tiffins ---
    const tiffins = await Tiffin.find(
      { "reviews.authorId": sessionUserId },
      {
        "reviews.$": 1, // Project only the matched review
        kitchenName: 1,
        address: 1,
        images: 1,
      }
    )
      .populate("reviews.authorId", "username")
      .lean();

    const tiffinReviews = tiffins.map((tiffin) => ({
      ...tiffin.reviews[0], // Access the first (and only, due to $) matched review
      firmType: "tiffin", // Add a type to distinguish
      firmDetails: {
        name: tiffin.kitchenName,
        address: tiffin.address,
        imageUrl: tiffin.images?.[0] || "",
      },
    }));

    // Combine all reviews
    const allReviews = [...restaurantReviews, ...tiffinReviews];

    res.status(200).json({ response: true, reviews: allReviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error.message);
    res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  }
});
router.get("/reviews/:id/status", isAuthenticated, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ response: false, message: "Invalid user or review ID." });
    }

    // Get the review embedded inside the firm document
    const firm = await Firm.findOne(
      { "reviews._id": reviewId },
      { "reviews.$": 1 } // Only project the matched review
    ).lean();

    if (!firm?.reviews?.length) {
      return res
        .status(404)
        .json({ response: false, message: "Review not found." });
    }

    const review = firm.reviews[0];

    const isFollow =
      Array.isArray(review.followBy) && review.followBy.includes(userId);
    const isLike =
      Array.isArray(review.likedBy) && review.likedBy.includes(userId);

    return res.status(200).json({
      response: true,
      data: {
        isFollow,
        isLike,
        followers: review.followers || 0,
        likes: review.likes || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching review status:", error);
    return res
      .status(500)
      .json({ response: false, message: "Internal server error." });
  }
});

module.exports = router;