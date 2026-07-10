const { DateTime } = require("luxon");

const ALLOWED_EVENT_CATEGORIES = [
  "concert",
  "standup",
  "drama",
  "workshop",
  "festival",
];

const CATEGORY_LABEL_TO_KEY = {
  Concert: "concert",
  "Stand-up": "standup",
  Drama: "drama",
  Workshop: "workshop",
  Festival: "festival",
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseIsoDate(value, tz = "utc") {
  if (!value) return null;
  if (value instanceof Date) return value;

  const dt = DateTime.fromISO(String(value), { zone: tz });
  if (!dt.isValid) return null;
  return dt.toJSDate();
}

function startOfDay(date, tz = "utc") {
  return DateTime.fromJSDate(date, { zone: tz }).startOf("day").toJSDate();
}

function endOfDay(date, tz = "utc") {
  return DateTime.fromJSDate(date, { zone: tz }).endOf("day").toJSDate();
}

function getTodayRange(now = new Date(), tz = "utc") {
  const dt = DateTime.fromJSDate(now, { zone: tz });
  return {
    from: dt.startOf("day").toJSDate(),
    to: dt.endOf("day").toJSDate(),
  };
}

// Upcoming weekend: Saturday 00:00 -> Sunday 23:59:59 in the provided timezone.
function getUpcomingWeekendRange(now = new Date(), tz = "utc") {
  const dt = DateTime.fromJSDate(now, { zone: tz });

  // Luxon weekday: 1 (Mon) .. 7 (Sun)
  // We want next Saturday if today is Mon-Fri; if today is Sat/Sun, use current weekend.
  let saturday;
  if (dt.weekday === 6) {
    saturday = dt.startOf("day");
  } else if (dt.weekday === 7) {
    saturday = dt.minus({ days: 1 }).startOf("day");
  } else {
    // days until Saturday (6)
    const daysUntilSaturday = 6 - dt.weekday;
    saturday = dt.plus({ days: daysUntilSaturday }).startOf("day");
  }

  const sundayEnd = saturday.plus({ days: 1 }).endOf("day");
  return { from: saturday.toJSDate(), to: sundayEnd.toJSDate() };
}

function normalizeCategoryFilter(typeParam) {
  if (!typeParam) return null;

  const raw = Array.isArray(typeParam)
    ? typeParam
    : String(typeParam)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (raw.length === 0) return null;

  const keys = raw
    .map((label) => CATEGORY_LABEL_TO_KEY[label] || String(label).toLowerCase())
    .filter((value) => Boolean(value) && ALLOWED_EVENT_CATEGORIES.includes(value));

  return keys.length ? keys : null;
}

function buildTimingRange({ timing, date, now = new Date(), tz = "utc" }) {
  const mode = timing ? String(timing) : "anytime";
  if (mode === "anytime") return null;

  if (mode === "today") return getTodayRange(now, tz);

  if (mode === "thisWeekend") return getUpcomingWeekendRange(now, tz);

  if (mode === "custom") {
    const parsed = parseIsoDate(date, tz);
    if (!parsed) return null;
    return { from: startOfDay(parsed, tz), to: endOfDay(parsed, tz) };
  }

  return null;
}

function buildStatusTabPredicate(tab, now = new Date()) {
  const value = tab ? String(tab) : "all";
  const nowDate = now instanceof Date ? now : new Date(now);

  if (value === "all") return null;

  if (value === "past") {
    return { endAt: { $lt: nowDate } };
  }

  if (value === "upcoming") {
    return { startAt: { $gt: nowDate } };
  }

  if (value === "active") {
    return {
      status: "active",
      startAt: { $lte: nowDate },
      endAt: { $gte: nowDate },
    };
  }

  return null;
}

module.exports = {
  ALLOWED_EVENT_CATEGORIES,
  CATEGORY_LABEL_TO_KEY,
  escapeRegex,
  parseIsoDate,
  buildTimingRange,
  buildStatusTabPredicate,
  normalizeCategoryFilter,
};
