const express = require("express");
const router = express.Router();
const Firm = require("../../models/Firm");
const mongoose = require("mongoose");
const OperatingHoursOffer = require("../../models/RestaurantsDasModel/OperatingHoursOffer");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");

const {
  updateOperatingHours,
  // generateTimeSlots,
  initializeOperatingHours,
  getFormattedOperatingHoursWithOffers,
  getFormattedOperatingHoursWithOnlyOffers,
} = require("../../controller/RestaurantDasController/operatingHoursController");
function generateTimeSlots(start, end) {
  const slots = [];
  const toMinutes = (t) => {
    const [time, modifier] = t.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  const format = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h >= 12 ? "PM" : "AM";
    const hours12 = h % 12 === 0 ? 12 : h % 12;
    return `${hours12}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  let current = toMinutes(start);
  const endMin = toMinutes(end);
  while (current <= endMin) {
    slots.push(format(current));
    current += 30;
  }
  return slots;
}

// GET all operating hours with populated offers
router.get("/", async (req, res) => {
  try {
    const operatingHours = await OperatingHoursOffer.find({})
      .populate({
        path: "timeSlotOffers.offerId",
        model: "Offer",
      })
      .sort({ day: 1 });
    res.json(operatingHours);
  } catch (error) {
    console.error("Error fetching operating hours:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update operating hours (both POST and PUT routes)
router.get("/gethours/:id", authenticateToken, async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id);

    if (!firm) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // Check if opening_hours exists and is an object
    if (!firm.opening_hours || typeof firm.opening_hours !== "object") {
      console.log(
        "Opening hours not found or invalid for firm:",
        req.params.id
      );
      return res.status(200).json({
        success: true,
        data: {
          opening_hours: {},
          time_slots: {},
        },
      });
    }

    // Generate time slots for each day in opening_hours
    const timeSlots = Object.entries(firm.opening_hours).reduce(
      (acc, [key, hours]) => {
        const day = dayMap[key] || key; // Map to standard day name
        // Only process if hours is a valid string
        if (typeof hours === "string" && hours.trim() !== "") {
          try {
            acc[day] = FirmgenerateTimeSlots(hours); // Generate time slots
          } catch (error) {
            console.error(`Error generating time slots for ${day}:`, error);
            acc[day] = []; // Set empty array on error
          }
        } else {
          acc[day] = []; // Set empty array for invalid hours
        }
        return acc;
      },
      {}
    );

    console.log("Generated time slots:", timeSlots);

    res.status(200).json({
      success: true,
      data: {
        time_slots: timeSlots,
      },
    });
  } catch (err) {
    console.error("Error fetching operating hours:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", initializeOperatingHours);
router.put("/", updateOperatingHours);

router.put("/:id", authenticateToken, async (req, res) => {
  const restaurantId = req.params.id;
  const { day, time } = req.body;
  console.log(req.body, "getting ");

  // Validate inputs
  if (!day || !time) {
    return res
      .status(400)
      .json({ error: "Both 'day' and 'time' are required" });
  }

  // Validate restaurant ID
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ error: "Invalid restaurant ID" });
  }

  // Validate day
  const dbDayKey = day; // Expecting day to be in backend format (e.g., TuesdayTue)
  if (!Object.keys(dayMap).includes(dbDayKey)) {
    return res.status(400).json({ error: "Invalid day name" });
  }

  // Validate time format (expects HH:mm-HH:mm)
  const timeRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) {
    return res
      .status(400)
      .json({ error: "Invalid time format. Expected HH:mm-HH:mm" });
  }

  // Convert 24-hour format to 12-hour AM/PM format
  const convertTo12HourFormat = (timeRange) => {
    const [start, end] = timeRange.split("-");
    const convertTime = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      return `${adjustedHours}${period}`;
    };
    return `${convertTime(start)}-${convertTime(end)}`;
  };

  const formattedTime = convertTo12HourFormat(time); // e.g., "20:00-22:00" -> "8PM-10PM"

  try {
    const updatedRestaurant = await Firm.findByIdAndUpdate(
      restaurantId,
      { [`opening_hours.${dbDayKey}`]: formattedTime },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({
      message: `Opening hours for ${day} updated successfully`,
      opening_hours: updatedRestaurant.opening_hours,
    });
  } catch (err) {
    console.error("Failed to update opening hours:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/day/:day/offers", authenticateToken, async (req, res) => {
  try {
    const { timeSlots, offerId, firmId } = req.body;
    const { day } = req.params;

    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty timeSlots array." });
    }

    if (!firmId || !mongoose.isValidObjectId(firmId)) {
      return res.status(400).json({ message: "Valid firmId is required." });
    }

    if (offerId && !mongoose.isValidObjectId(offerId)) {
      return res.status(400).json({ message: "Invalid offerId format." });
    }

    // Get or create the document for the day
    let operatingHours = await OperatingHoursOffer.findOne({ day });
    if (!operatingHours) {
      operatingHours = new OperatingHoursOffer({
        day,
        openTime: "10:00 AM",
        closeTime: "10:00 PM",
        timeSlotOffers: [],
      });
    }

    const validSlots = generateTimeSlots(
      operatingHours.openTime,
      operatingHours.closeTime
    );

    for (const slot of timeSlots) {
      if (!validSlots.includes(slot)) {
        return res.status(400).json({ message: `Invalid time slot: ${slot}` });
      }

      // Find or create the time slot entry
      let slotIndex = operatingHours.timeSlotOffers.findIndex(
        (t) => t.timeSlot === slot
      );
      if (slotIndex === -1) {
        // Add new slot if not exists
        operatingHours.timeSlotOffers.push({ timeSlot: slot, offers: [] });
        slotIndex = operatingHours.timeSlotOffers.length - 1;
      }

      const slotEntry = operatingHours.timeSlotOffers[slotIndex];

      if (!Array.isArray(slotEntry.offers)) {
        slotEntry.offers = [];
      }

      const exists = slotEntry.offers.some(
        (o) =>
          o.offerId?.toString() === offerId && o.firmId?.toString() === firmId
      );

      if (!exists) {
        slotEntry.offers.push({ offerId, firmId });
      }

      // Reassign updated slotEntry in case of mutation
      operatingHours.timeSlotOffers[slotIndex] = slotEntry;
    }

    const saved = await operatingHours.save();
    const populated = await OperatingHoursOffer.findById(saved._id).populate(
      "timeSlotOffers.offers.offerId timeSlotOffers.offers.firmId"
    );

    res.status(200).json(populated);
  } catch (error) {
    console.error("Error updating time slot offers:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.delete("/day/:day/offers", authenticateToken, async (req, res) => {
  try {
    const { timeSlots } = req.body;
    if (!timeSlots || !Array.isArray(timeSlots)) {
      return res.status(400).json({ message: "Time slots array is required" });
    }

    const operatingHours = await OperatingHoursOffer.findOne({
      day: req.params.day,
    });
    if (!operatingHours) {
      return res
        .status(404)
        .json({ message: "Operating hours not found for this day" });
    }

    operatingHours.timeSlotOffers = operatingHours.timeSlotOffers.filter(
      (item) => !timeSlots.includes(item.timeSlot)
    );
    const updatedHours = await operatingHours.save();
    res.json(updatedHours);
  } catch (error) {
    console.error("Error removing offers:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get(
  "/formatted-with-offers-only",
  authenticateToken,
  async (req, res) => {
    try {
      const formattedData = await getFormattedOperatingHoursWithOnlyOffers();
      res.json(formattedData);
    } catch (error) {
      console.error(
        "Error fetching formatted operating hours with offers only:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/formatted", authenticateToken, async (req, res) => {
  try {
    const formattedData = await getFormattedOperatingHoursWithOffers();
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching formatted operating hours:", error);
    res.status(500).json({ message: error.message });
  }
});

const normalizeTime = (timeStr) => {
  // Normalize time format (e.g., "5PM" -> "5:00 PM", "05:30PM" -> "5:30 PM")
  let normalized = timeStr.replace(/(\d+)([AP]M)/, "$1:00$2"); // Add :00 if missing
  return normalized
    .replace(/(\d+:\d{2})([AP]M)/, "$1 $2") // Ensure space before AM/PM
    .replace(/^0/, ""); // Remove leading zero for consistency
};

// Helper function to check if a single time matches a time slot (single time or range)
const isTimeInRange = (singleTime, timeSlot) => {
  const normalizedSingleTime = normalizeTime(singleTime);
  const normalizedTimeSlot = normalizeTime(timeSlot);

  // If timeSlot is a single time (e.g., "05:30 PM")
  if (!timeSlot.includes("-")) {
    return normalizedSingleTime === normalizedTimeSlot;
  }

  // If timeSlot is a range (e.g., "05:30 PM-06:30 PM")
  const [rangeStart, rangeEnd] = timeSlot.split("-").map(normalizeTime);
  const singleDate = new Date(`2025-07-01 ${normalizedSingleTime}`);
  const startDate = new Date(`2025-07-01 ${rangeStart}`);
  const endDate = new Date(`2025-07-01 ${rangeEnd}`);
  return singleDate >= startDate && singleDate <= endDate; // Include end boundary
};

// Helper function to generate 30-minute time slots within a range
const FirmgenerateTimeSlots = (hoursString) => {
  const slots = [];
  const timeRanges =
    hoursString.match(
      /(\d{1,2}(?::\d{2})?(?:AM|PM))-(\d{1,2}(?::\d{2})?(?:AM|PM))/g
    ) || [];

  timeRanges.forEach((range) => {
    const [start, end] = range.split("-").map(normalizeTime);
    let current = new Date(`2025-07-01 ${start}`);
    const endTime = new Date(`2025-07-01 ${end}`);

    while (current <= endTime) {
      const timeStr = normalizeTime(
        current.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      slots.push(timeStr);
      current = new Date(current.getTime() + 30 * 60 * 1000); // Add 30 minutes
    }
  });
  return slots;
};

// Map non-standard day keys to standard names
const dayMap = {
  SundaySun: "Sunday",
  MondayMon: "Monday",
  TuesdayTue: "Tuesday",
  WednesdayWed: "Wednesday",
  ThursdayThu: "Thursday",
  FridayFri: "Friday",
  SaturdaySat: "Saturday",
};

router.get("/formatted-with-offers-only/:id", async (req, res) => {
  try {
    const firmId = req.params.id;
    const dayParam = req.query.day; // e.g., "Wednesday" or "WednesdayWed"

    // Fetch firm's opening hours
    const firm = await Firm.findById(firmId).select("opening_hours").lean();
    if (!firm || !firm.opening_hours) {
      console.log("Firm or opening hours not found"); // Debugging
      return res.status(404).json({ message: "Firm or opening hours found" });
    }

    // Determine days to process
    const normalizedDayParam = dayParam ? dayMap[dayParam] || dayParam : null;
    const days = normalizedDayParam
      ? [normalizedDayParam]
      : Object.values(dayMap);

    // Generate time slots for each day based on opening_hours
    const operatingHours = Object.entries(firm.opening_hours).reduce(
      (acc, [key, hours]) => {
        const day = dayMap[key] || key;
        acc[day] = FirmgenerateTimeSlots(hours);
        return acc;
      },
      {}
    );

    // Fetch offers for the specified day(s) and firm
    const query = {
      ...(normalizedDayParam
        ? { day: normalizedDayParam }
        : { day: { $in: days } }),
      "timeSlotOffers.offers.firmId": firmId, // Filter by firmId in timeSlotOffers.offers
    };
    const allOffersMus = await OperatingHoursOffer.find(query)
      .populate({
        path: "timeSlotOffers.offers.offerId",
        model: "RestaurantOffers",
        select: "name code offerType discountValue startDate endDate",
      })
      .sort({ day: 1 })
      .lean();

    // Get current date for filtering expired offers
    const currentDate = new Date();

    // Format result
    const formattedOffers = days
      .filter((day) => operatingHours[day] && operatingHours[day].length > 0) // Only include days with valid slots
      .map((day) => {
        const dayData = allOffersMus.find((d) => d.day === day) || {
          timeSlotOffers: [],
        };
        const slotOffersMap = {}; // Map time slots to arrays of offers
        const offerCountMap = {}; // Track offer count per time slot

        dayData.timeSlotOffers?.forEach((slot) => {
          // Check each generated single time slot against the offer's time slot
          operatingHours[day].forEach((singleTime) => {
            if (isTimeInRange(singleTime, slot.timeSlot)) {
              // Handle array of offers
              slot.offers?.forEach((offer) => {
                if (
                  String(offer.firmId) === firmId &&
                  offer.offerId &&
                  // Check if offer is not expired
                  new Date(offer.offerId.startDate) <= currentDate &&
                  new Date(offer.offerId.endDate) >= currentDate
                ) {
                  // Increment offer count for this time slot
                  offerCountMap[singleTime] =
                    (offerCountMap[singleTime] || 0) + 1;

                  // Initialize slotOffersMap[singleTime] as an array if not set
                  if (!slotOffersMap[singleTime]) {
                    slotOffersMap[singleTime] = [];
                  }

                  // Push the offer to the array
                  slotOffersMap[singleTime].push({
                    id: offer.offerId._id,
                    name: offer.offerId.name,
                    code: offer.offerId.code,
                    offerType: offer.offerId.offerType,
                    discountValue: offer.offerId.discountValue,
                    startDate: offer.offerId.startDate,
                    endDate: offer.offerId.endDate,
                    _refId: offer._id,
                  });
                }
              });
            }
          });
        });

        // Only include time slots with offers (offerCount > 0)
        const timeSlotsWithOffers = operatingHours[day]
          .filter((slot) => offerCountMap[slot] > 0)
          .map((slot) => ({
            slot,
            offers: slotOffersMap[slot] || [], // Return array of offers
            offerCount: offerCountMap[slot] || 0, // Include offer count
          }));

        // Only return the day if it has time slots with offers
        if (timeSlotsWithOffers.length === 0) {
          return null;
        }

        return {
          day,
          timeSlots: timeSlotsWithOffers,
        };
      })
      .filter((day) => day !== null); // Remove days with no time slots

    if (formattedOffers.length === 0) {
      console.log("No time slots with offers found"); // Debugging
      return res
        .status(404)
        .json({ message: "No time slots with offers found" });
    }

    res.json({
      hours: firm.opening_hours,
      availableOffers: formattedOffers,
    });
  } catch (error) {
    console.error(
      "Error formatting operating hours with populated offers:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
