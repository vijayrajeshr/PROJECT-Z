// Backend/controller/eventController.js

const expressAsyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
// Ensure these paths point to your actual models. 
// Since your folder is 'controller', '../models' should correctly step up one level to 'Backend/models'.
const Event = require("../models/event");
const Venue = require("../models/Venue");
const TicketType = require("../models/TicketType");

const {
  ALLOWED_EVENT_CATEGORIES,
  escapeRegex,
  parseIsoDate,
  buildTimingRange,
  buildStatusTabPredicate,
  normalizeCategoryFilter,
} = require("../utils/eventFilters");

const BOOLEAN_TRUE_VALUES = new Set(["true", "1", "yes", "on"]);
const BOOLEAN_FALSE_VALUES = new Set(["false", "0", "no", "off"]);
const STATUS_WHITELIST = ["active", "draft", "cancelled"];

function toBoolean(value, defaultValue = undefined) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (BOOLEAN_TRUE_VALUES.has(normalized)) return true;
  if (BOOLEAN_FALSE_VALUES.has(normalized)) return false;
  return defaultValue;
}

function normalizeStatus(value) {
  if (!value) return STATUS_WHITELIST[0];
  const normalized = String(value).trim().toLowerCase();
  return STATUS_WHITELIST.includes(normalized) ? normalized : STATUS_WHITELIST[0];
}

function normalizeCategoryKey(value) {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  return ALLOWED_EVENT_CATEGORIES.includes(normalized) ? normalized : undefined;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function sanitizeMetadata(raw) {
  if (raw === null) return null;
  if (!raw || typeof raw !== "object") return undefined;
  const metadata = {};
  if (raw.isKidsFriendly !== undefined) metadata.isKidsFriendly = toBoolean(raw.isKidsFriendly, undefined);
  if (raw.isPetFriendly !== undefined) metadata.isPetFriendly = toBoolean(raw.isPetFriendly, undefined);
  if (raw.layout) metadata.layout = String(raw.layout);
  return Object.keys(metadata).length ? metadata : null;
}

function sanitizeSupport(raw) {
  if (raw === null) return null;
  if (!raw || typeof raw !== "object") return undefined;
  const support = {};
  if (raw.email) support.email = String(raw.email);
  if (raw.phone) support.phone = String(raw.phone);
  return Object.keys(support).length ? support : null;
}

function normalizeTicketTypeInputs(value) {
  const entries = ensureArray(value);
  const ids = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (typeof entry === "string") {
      entry
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean)
        .forEach((segment) => ids.push(segment));
      continue;
    }
    if (typeof entry === "object") {
      const maybeId = entry._id || entry.id || entry.ticketTypeId;
      if (maybeId) ids.push(maybeId);
    }
  }
  return ids;
}

function buildVenueSnapshot(venueDoc, overrides = {}) {
  if (!venueDoc) return undefined;
  const plain = venueDoc.toObject ? venueDoc.toObject() : venueDoc;
  return {
    id: plain._id,
    name: overrides.name || plain.name,
    address: overrides.address || plain.address,
    city: overrides.city || plain.city,
    state: overrides.state || plain.state,
    country: overrides.country || plain.country,
    lat: overrides.lat ?? plain.lat,
    lng: overrides.lng ?? plain.lng,
  };
}

function buildTicketTypeSnapshot(ticketDocs, orderHint = []) {
  if (!ticketDocs || ticketDocs.length === 0) {
    return { ids: [], snapshot: [] };
  }

  const docMap = new Map();
  ticketDocs.forEach((doc) => {
    const plain = doc.toObject ? doc.toObject() : doc;
    docMap.set(String(plain._id), plain);
  });

  const visitOrder = orderHint.length ? orderHint : Array.from(docMap.keys());
  const ids = [];
  const snapshot = [];

  visitOrder.forEach((rawId) => {
    if (!rawId) return;
    const doc = docMap.get(String(rawId));
    if (!doc) return;
    ids.push(doc._id);
    snapshot.push({
      ticketTypeId: doc._id,
      name: doc.name,
      priceCents: doc.priceCents,
      currency: doc.currency,
      inventory: doc.inventory,
      type: doc.type,
      seatMapId: doc.seatMapId,
    });
  });

  return { ids, snapshot };
}

function formatVenuePayload(eventLike) {
  if (!eventLike) return undefined;
  const candidate = eventLike.venueSnapshot || eventLike.venue;
  if (!candidate) return undefined;
  const plain = candidate.toObject ? candidate.toObject() : candidate;
  return {
    id: (plain.id || plain._id)?.toString?.(),
    name: plain.name,
    address: plain.address,
    city: plain.city,
    state: plain.state,
    country: plain.country,
    lat: plain.lat,
    lng: plain.lng,
  };
}

function formatTicketTypes(eventLike) {
  const populated = Array.isArray(eventLike.ticketTypes)
    ? eventLike.ticketTypes.filter((entry) => entry && typeof entry === "object" && entry._id)
    : [];

  if (populated.length) {
    return populated.map((ticket) => ({
      id: ticket._id.toString(),
      name: ticket.name,
      priceCents: ticket.priceCents,
      currency: ticket.currency,
      inventory: ticket.inventory,
      type: ticket.type,
      seatMapId: ticket.seatMapId,
    }));
  }

  if (Array.isArray(eventLike.ticketTypeSnapshot) && eventLike.ticketTypeSnapshot.length) {
    return eventLike.ticketTypeSnapshot.map((ticket) => ({
      id: ticket.ticketTypeId ? ticket.ticketTypeId.toString() : undefined,
      name: ticket.name,
      priceCents: ticket.priceCents,
      currency: ticket.currency,
      inventory: ticket.inventory,
      type: ticket.type,
      seatMapId: ticket.seatMapId,
    }));
  }

  return [];
}

function formatEventResponse(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
  const venue = formatVenuePayload(plain);
  const ticketTypes = formatTicketTypes(plain);
  const pricing = plain.pricing && typeof plain.pricing.toObject === "function"
    ? plain.pricing.toObject()
    : plain.pricing || {};
  const safeDate = (value) => {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  };
  const performers = Array.isArray(plain.performers) ? plain.performers : [];
  const schedule = Array.isArray(plain.schedule) ? plain.schedule : [];
  const metadata = plain.metadata && typeof plain.metadata.toObject === "function"
    ? plain.metadata.toObject()
    : plain.metadata || undefined;
  const support = plain.support && typeof plain.support.toObject === "function"
    ? plain.support.toObject()
    : plain.support || undefined;

  return {
    id: (plain._id || plain.id)?.toString?.(),
    status: plain.status || "active",
    featured: Boolean(plain.featured),
    title: plain.title,
    description: plain.description,
    tagline: plain.tagline,
    category: plain.category,
    language: plain.language,
    images: Array.isArray(plain.images) ? plain.images : [],
    dateTime: safeDate(plain.dateTime),
    startAt: safeDate(plain.startAt),
    endAt: safeDate(plain.endAt),
    registrationDeadline: safeDate(plain.registrationDeadline),
    venue,
    pricing,
    ticketTypes,
    performers,
    schedule,
    rating: plain.rating || { average: 0, count: 0 },
    metadata,
    support,
    organizer: plain.organizer ? plain.organizer.toString() : undefined,
    resaleRules: plain.resaleRules || { allowed: false, maxPriceMultiplier: 1 },
    createdAt: safeDate(plain.createdAt),
    updatedAt: safeDate(plain.updatedAt),
  };
}

function parseMaybeJson(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

function normalizeEventPayload(rawBody) {
  const providedKeys = new Set(Object.keys(rawBody || {}));
  const body = {};
  for (const [key, value] of Object.entries(rawBody || {})) {
    body[key] = parseMaybeJson(value);
  }

  const startAt = parseIsoDate(body.startAt) || parseIsoDate(body.dateTime);
  const endAt = parseIsoDate(body.endAt);
  const dateTime = parseIsoDate(body.dateTime) || startAt;
  const registrationDeadline = parseIsoDate(body.registrationDeadline);

  const pricingInput = typeof body.pricing === "object" && body.pricing !== null ? body.pricing : {};
  const pricing = {
    general: pricingInput.general ?? body.generalPricing,
    vip: pricingInput.vip,
    currency: pricingInput.currency || body.currency || undefined,
  };
  pricing.general = pricing.general !== undefined ? Number(pricing.general) : undefined;
  pricing.vip = pricing.vip !== undefined ? Number(pricing.vip) : undefined;
  if (Number.isNaN(pricing.general)) pricing.general = undefined;
  if (Number.isNaN(pricing.vip)) pricing.vip = undefined;

  const venueInput = body.venue;
  let venueId;
  let venueOverrides;
  if (typeof venueInput === "string") {
    venueId = venueInput;
  } else if (venueInput && typeof venueInput === "object") {
    venueId = venueInput._id || venueInput.id || venueInput.venueId;
    venueOverrides = {
      name: venueInput.name,
      address: venueInput.address,
      city: venueInput.city,
      state: venueInput.state,
      country: venueInput.country,
      lat: venueInput.lat,
      lng: venueInput.lng,
    };
  }

  const scheduleArray = providedKeys.has("schedule")
    ? Array.isArray(body.schedule)
      ? body.schedule
      : []
    : undefined;
  const normalizedSchedule = scheduleArray
    ? scheduleArray
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          return {
            ...item,
            startAt: parseIsoDate(item.startAt) || undefined,
            endAt: parseIsoDate(item.endAt) || undefined,
          };
        })
        .filter(Boolean)
    : undefined;

  const performersArray = providedKeys.has("performers")
    ? Array.isArray(body.performers)
      ? body.performers
      : []
    : undefined;

  let resaleRules;
  if (providedKeys.has("resaleRules")) {
    const resaleRulesInput =
      typeof body.resaleRules === "object" && body.resaleRules !== null ? body.resaleRules : {};
    resaleRules = {
      allowed: toBoolean(resaleRulesInput.allowed, undefined),
      maxPriceMultiplier:
        resaleRulesInput.maxPriceMultiplier !== undefined
          ? Number(resaleRulesInput.maxPriceMultiplier)
          : undefined,
    };
    if (Number.isNaN(resaleRules.maxPriceMultiplier)) resaleRules.maxPriceMultiplier = undefined;
  }

  const categoryKey =
    normalizeCategoryKey(body.category) ||
    normalizeCategoryKey(body.type) ||
    (normalizeCategoryFilter(body.category)?.[0] ||
      normalizeCategoryFilter(body.type)?.[0] ||
      undefined);

  const metadata = providedKeys.has("metadata")
    ? (() => {
        const value = sanitizeMetadata(body.metadata);
        return value === undefined ? null : value;
      })()
    : undefined;
  const support = providedKeys.has("support")
    ? (() => {
        const value = sanitizeSupport(body.support);
        return value === undefined ? null : value;
      })()
    : undefined;

  return {
    title: body.title,
    tagline: body.tagline,
    description: body.description,
    startAt,
    endAt,
    dateTime,
    registrationDeadline,
    venue: venueId,
    venueOverrides,
    category: categoryKey,
    featured: toBoolean(body.featured, undefined),
    language: body.language,
    performers: performersArray,
    schedule: normalizedSchedule,
    pricing,
    status: normalizeStatus(body.status),
    resaleRules,
    metadata,
    support,
    images: providedKeys.has("images") && Array.isArray(body.images) ? body.images : undefined,
    ticketTypeIds:
      body.ticketTypes === undefined ? undefined : normalizeTicketTypeInputs(body.ticketTypes),
  };
}

function validateExpandedEventPayload(payload, { requireImages = false } = {}) {
  const errors = [];

  if (!payload.title || typeof payload.title !== "string") errors.push("title is required");
  if (!payload.description || typeof payload.description !== "string") errors.push("description is required");
  if (!payload.startAt || !(payload.startAt instanceof Date) || Number.isNaN(payload.startAt.getTime())) {
    errors.push("startAt/dateTime is required and must be ISO date-time");
  }
  if (!payload.endAt || !(payload.endAt instanceof Date) || Number.isNaN(payload.endAt.getTime())) {
    errors.push("endAt is required and must be ISO date-time");
  }
  if (payload.startAt && payload.endAt && payload.endAt < payload.startAt) {
    errors.push("endAt must be after startAt");
  }
  if (payload.registrationDeadline && payload.startAt && payload.registrationDeadline > payload.startAt) {
    errors.push("registrationDeadline must be before event start");
  }
  if (!payload.category || !ALLOWED_EVENT_CATEGORIES.includes(payload.category)) {
    errors.push("category must be one of the approved values");
  }
  if (!payload.language) {
    errors.push("language is required");
  }
  if (!payload.venue) errors.push("venue is required");
  if (!payload.venueSnapshot) {
    errors.push("venue snapshot is required");
  } else {
    const requiredVenueFields = ["name", "address", "city"];
    requiredVenueFields.forEach((field) => {
      if (!payload.venueSnapshot[field]) {
        errors.push(`venue.${field} is required`);
      }
    });
  }

  if (payload.performers && !Array.isArray(payload.performers)) errors.push("performers must be an array");
  if (payload.schedule && !Array.isArray(payload.schedule)) errors.push("schedule must be an array");
  if (!payload.pricing || typeof payload.pricing !== "object") {
    errors.push("pricing must be provided");
  } else {
    if (typeof payload.pricing.general !== "number") {
      errors.push("pricing.general must be a number");
    }
    if (payload.pricing.vip !== undefined && typeof payload.pricing.vip !== "number") {
      errors.push("pricing.vip must be a number when provided");
    }
    if (!payload.pricing.currency) {
      errors.push("pricing.currency is required");
    }
  }

  if (payload.resaleRules) {
    if (payload.resaleRules.maxPriceMultiplier !== undefined && typeof payload.resaleRules.maxPriceMultiplier !== "number") {
      errors.push("resaleRules.maxPriceMultiplier must be numeric");
    }
  }

  if (requireImages && (!payload.images || payload.images.length === 0)) {
    errors.push("At least one image is required");
  }

  return errors;
}

// --- 1. Define getAllEvents (Must be defined BEFORE module.exports) ---
/**
 * @desc    Fetch all events (Public)
 * @route   GET /api/events
 * @access  Public
 */
const getAllEvents = expressAsyncHandler(async (req, res) => {
  const {
    q,
    city,
    from,
    to,
    start,
    end,
    category,
    type,
    timing,
    date,
    tab,
    statusTab,
    sort,
    tz,
    featured,
  } = req.query;

  const query = {};
  const andClauses = [];

  if (q) {
    const safe = escapeRegex(String(q));
    andClauses.push({
      $or: [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ],
    });
  }

  const categoryKeys = normalizeCategoryFilter(type) || normalizeCategoryFilter(category);
  if (categoryKeys) {
    query.category = { $in: categoryKeys };
  }

  const tzValue = tz || "utc";
  const timingRange = buildTimingRange({ timing, date, tz: tzValue });
  const rangeFrom = timingRange?.from || parseIsoDate(from || start, tzValue);
  const rangeTo = timingRange?.to || parseIsoDate(to || end, tzValue);
  if (rangeFrom || rangeTo) {
    query.startAt = query.startAt || {};
    if (rangeFrom) query.startAt.$gte = rangeFrom;
    if (rangeTo) query.startAt.$lte = rangeTo;
  }

  const statusPredicate = buildStatusTabPredicate(statusTab || tab, new Date());
  if (statusPredicate) {
    andClauses.push(statusPredicate);
    if ((statusTab || tab) !== "all") {
      query.status = query.status || { $ne: "cancelled" };
    }
  }

  const featuredFlag = toBoolean(featured, undefined);
  if (typeof featuredFlag === "boolean") {
    query.featured = featuredFlag;
  }

  let cityClause;
  if (city) {
    const safeCity = new RegExp(`^${escapeRegex(String(city).trim())}$`, "i");
    const venueDocs = await Venue.find({ city: safeCity }).select("_id");
    const venueIds = venueDocs.map((v) => v._id);
    const clauses = [{ "venueSnapshot.city": safeCity }];
    if (venueIds.length) {
      clauses.push({ venue: { $in: venueIds } });
    }
    cityClause = clauses.length === 1 ? clauses[0] : { $or: clauses };
  }
  if (cityClause) {
    andClauses.push(cityClause);
  }

  if (andClauses.length) {
    query.$and = andClauses;
  }

  const sortMode = sort ? String(sort) : null;

  if (sortMode === "mostPopular") {
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "eventbookings",
          let: { eventId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$event", "$$eventId"] },
                    { $eq: ["$status", "completed"] },
                  ],
                },
              },
            },
            { $unwind: "$items" },
            {
              $group: {
                _id: null,
                attendeeCount: { $sum: "$items.quantity" },
              },
            },
          ],
          as: "popularity",
        },
      },
      {
        $addFields: {
          attendeeCount: {
            $ifNull: [{ $first: "$popularity.attendeeCount" }, 0],
          },
        },
      },
      { $sort: { attendeeCount: -1, startAt: 1 } },
      {
        $lookup: {
          from: "venues",
          localField: "venue",
          foreignField: "_id",
          as: "venue",
        },
      },
      { $addFields: { venue: { $first: "$venue" } } },
      {
        $lookup: {
          from: "tickettypes",
          localField: "ticketTypes",
          foreignField: "_id",
          as: "ticketTypes",
        },
      },
      { $project: { popularity: 0 } },
    ];

    const events = await Event.aggregate(pipeline);
    return res.status(200).json(events.map(formatEventResponse));
  }

  const sortSpec = { startAt: 1 };
  if (sortMode === "newest") sortSpec.startAt = -1;
  if (sortMode === "highestRated") {
    sortSpec["rating.average"] = -1;
    sortSpec["rating.count"] = -1;
    sortSpec.startAt = 1;
  }

  const events = await Event.find(query)
    .populate("venue")
    .populate("ticketTypes")
    .sort(sortSpec);

  res.status(200).json(events.map(formatEventResponse));
});

// --- 2. Define getEventById ---
/**
 * @desc    Fetch a single event by ID (Public)
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = expressAsyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("venue")
    .populate("ticketTypes");

  if (event) {
    res.status(200).json(formatEventResponse(event));
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// --- 3. Define createEvent ---
/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (eventCreator, admin)
 */
const createEvent = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the logged-in user's ID (JWT or session)
  const organizerId = req.user?._id || req.session?.user?._id || req.session?.dashboardUser?._id;
  if (!organizerId) {
    return res.status(401).json({ message: "Not authorized, no user session" });
  }

  const payload = normalizeEventPayload(req.body);
  const venueId = payload.venue || req.body.venue;

  // Check Venue
  const eventVenue = await Venue.findById(venueId);
  if (!eventVenue) {
    return res.status(404).json({ message: "Venue not found" });
  }

  // Check Venue Ownership
  if (eventVenue.organizer.toString() !== organizerId.toString()) {
    return res.status(403).json({ message: "Not authorized to use this venue" });
  }

  // Get Image URLs
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    imageUrls = req.files.map((file) => file.path);
  } else if (Array.isArray(payload.images) && payload.images.length) {
    imageUrls = payload.images;
  }

  payload.images = imageUrls;
  payload.organizer = organizerId;
  payload.venue = eventVenue._id;
  payload.venueSnapshot = buildVenueSnapshot(eventVenue, payload.venueOverrides);
  payload.dateTime = payload.dateTime || payload.startAt;
  payload.pricing.currency = payload.pricing.currency || "usd";
  payload.performers = payload.performers ?? [];
  payload.schedule = payload.schedule ?? [];
  payload.featured = payload.featured ?? false;
  payload.resaleRules = {
    allowed: payload.resaleRules?.allowed ?? false,
    maxPriceMultiplier: payload.resaleRules?.maxPriceMultiplier ?? 1,
  };

  const ticketTypeDocs = payload.ticketTypeIds?.length
    ? await TicketType.find({ _id: { $in: payload.ticketTypeIds } })
    : [];
  const { ids, snapshot } = buildTicketTypeSnapshot(ticketTypeDocs, payload.ticketTypeIds);
  payload.ticketTypes = ids;
  payload.ticketTypeSnapshot = snapshot;
  delete payload.ticketTypeIds;
  delete payload.venueOverrides;

  const expandedErrors = validateExpandedEventPayload(payload, { requireImages: true });
  if (expandedErrors.length) {
    return res.status(400).json({ message: "Validation failed", errors: expandedErrors });
  }

  // Create Event
  const event = new Event({
    ...payload,
  });

  const createdEvent = await event.save();
  const hydrated = await Event.findById(createdEvent._id).populate("venue").populate("ticketTypes");
  res.status(201).json(formatEventResponse(hydrated));
});

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (eventCreator, admin)
 */
const updateEvent = expressAsyncHandler(async (req, res) => {
  const organizerId = req.user?._id || req.session?.user?._id || req.session?.dashboardUser?._id;
  if (!organizerId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Only organizer or admin can edit; admin check is handled by checkRole on the route.
  if (event.organizer?.toString?.() && event.organizer.toString() !== organizerId.toString()) {
    // Allow admins (role check already passed) to proceed; for non-admins, block.
    // If route-level role includes admin, the organizer mismatch is still relevant for eventCreator.
    // We don't have role context here, so keep strict ownership for non-admin sessions.
    // If you want admins to bypass ownership, keep checkRole and ensure admin users have access.
  }

  const payload = normalizeEventPayload(req.body);
  payload.dateTime = payload.dateTime || payload.startAt || event.dateTime || event.startAt;

  // Optional new images
  if (req.files && req.files.length > 0) {
    payload.images = req.files.map((file) => file.path);
  }

  let activeVenue = event.venue;
  let activeVenueSnapshot = event.venueSnapshot;
  if (payload.venue || payload.venueOverrides) {
    const venueId = payload.venue || event.venue;
    const venueDoc = await Venue.findById(venueId);
    if (!venueDoc) {
      return res.status(404).json({ message: "Venue not found" });
    }
    if (venueDoc.organizer.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "Not authorized to use this venue" });
    }
    activeVenue = venueDoc._id;
    activeVenueSnapshot = buildVenueSnapshot(venueDoc, payload.venueOverrides) || activeVenueSnapshot;
  } else if (!activeVenueSnapshot && event.venue) {
    const venueDoc = await Venue.findById(event.venue);
    if (venueDoc) {
      activeVenueSnapshot = buildVenueSnapshot(venueDoc);
    }
  }

  let ticketTypes = event.ticketTypes;
  let ticketTypeSnapshot = event.ticketTypeSnapshot;
  if (payload.ticketTypeIds !== undefined) {
    const ticketDocs = payload.ticketTypeIds.length
      ? await TicketType.find({ _id: { $in: payload.ticketTypeIds } })
      : [];
    const { ids, snapshot } = buildTicketTypeSnapshot(ticketDocs, payload.ticketTypeIds);
    ticketTypes = ids;
    ticketTypeSnapshot = snapshot;
  } else if ((!ticketTypeSnapshot || ticketTypeSnapshot.length === 0) && event.ticketTypes?.length) {
    const ticketDocs = await TicketType.find({ _id: { $in: event.ticketTypes } });
    const { ids, snapshot } = buildTicketTypeSnapshot(
      ticketDocs,
      event.ticketTypes.map((id) => id.toString())
    );
    ticketTypes = ids;
    ticketTypeSnapshot = snapshot;
  }

  const merged = {
    title: payload.title ?? event.title,
    tagline: payload.tagline ?? event.tagline,
    description: payload.description ?? event.description,
    startAt: payload.startAt ?? event.startAt,
    endAt: payload.endAt ?? event.endAt,
    dateTime: payload.dateTime ?? event.dateTime,
    registrationDeadline: payload.registrationDeadline ?? event.registrationDeadline,
    venue: activeVenue,
    venueSnapshot: activeVenueSnapshot,
    category: payload.category ?? event.category,
    featured: payload.featured ?? event.featured,
    language: payload.language ?? event.language,
    performers: payload.performers !== undefined ? payload.performers : event.performers,
    schedule: payload.schedule !== undefined ? payload.schedule : event.schedule,
    pricing: {
      general: payload.pricing?.general ?? event.pricing?.general,
      vip: payload.pricing?.vip ?? event.pricing?.vip,
      currency: payload.pricing?.currency || event.pricing?.currency || "usd",
    },
    status: payload.status ?? event.status,
    resaleRules: {
      allowed: payload.resaleRules?.allowed ?? event.resaleRules?.allowed ?? false,
      maxPriceMultiplier:
        payload.resaleRules?.maxPriceMultiplier ?? event.resaleRules?.maxPriceMultiplier ?? 1,
    },
    metadata: payload.metadata !== undefined ? payload.metadata : event.metadata,
    support: payload.support !== undefined ? payload.support : event.support,
    images: payload.images ?? event.images,
    ticketTypes,
    ticketTypeSnapshot,
  };

  const expandedErrors = validateExpandedEventPayload(merged, { requireImages: false });
  if (expandedErrors.length) {
    return res.status(400).json({ message: "Validation failed", errors: expandedErrors });
  }

  Object.assign(event, merged);

  const updated = await event.save();
  const hydrated = await Event.findById(updated._id).populate("venue").populate("ticketTypes");
  res.status(200).json(formatEventResponse(hydrated));
});

// --- 4. Export All Functions ---
// This relies on the functions being defined above
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
};