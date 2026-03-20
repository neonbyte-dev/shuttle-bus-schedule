// Schedule Engine — "Next bus" logic, day-type detection, HKT timezone
//
// This file has NO schedule data. It only contains logic.
// Data lives in schedule-data.js. Holidays live in holidays.js.

import { SCHEDULES } from './schedule-data.js';
import { HK_HOLIDAYS } from './holidays.js';

// ─── Timezone ──────────────────────────────────────────────────
// HKT = UTC+8, no daylight saving. Simple and stable.

/**
 * Get current time in Hong Kong as { hours, minutes, totalMinutes }
 */
export function getCurrentHKT() {
  const now = new Date();
  // toLocaleString with timeZone forces the output to HKT
  const hktString = now.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
  const hktDate = new Date(hktString);
  const hours = hktDate.getHours();
  const minutes = hktDate.getMinutes();
  const seconds = hktDate.getSeconds();
  return {
    hours,
    minutes,
    seconds,
    totalMinutes: hours * 60 + minutes,
    totalSeconds: hours * 3600 + minutes * 60 + seconds,
  };
}

/**
 * Get today's date in HKT as "YYYY-MM-DD"
 */
export function getHKTDateString() {
  const now = new Date();
  // Use en-CA because it outputs YYYY-MM-DD format
  return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' });
}

/**
 * Get the HKT day of week (0=Sun, 6=Sat)
 */
export function getHKTDayOfWeek() {
  const now = new Date();
  const hktString = now.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
  return new Date(hktString).getDay();
}

// ─── Day Type Detection ────────────────────────────────────────

/**
 * Determine if today uses the weekend/holiday schedule.
 * Returns "weekday" or "weekend"
 */
export function getDayType() {
  const dayOfWeek = getHKTDayOfWeek();
  const dateStr = getHKTDateString();

  // Saturday (6) or Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "weekend";
  }

  // Public holiday check
  if (HK_HOLIDAYS.includes(dateStr)) {
    return "weekend";
  }

  return "weekday";
}

/**
 * Get the human-readable day type label
 */
export function getDayTypeLabel() {
  const dayType = getDayType();
  const dateStr = getHKTDateString();
  const dayOfWeek = getHKTDayOfWeek();

  if (dayType === "weekend") {
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && HK_HOLIDAYS.includes(dateStr)) {
      return "Public Holiday";
    }
    return dayOfWeek === 0 ? "Sunday" : "Saturday";
  }
  return "Weekday";
}

// ─── Time Utilities ────────────────────────────────────────────

/**
 * Convert "HH:MM" string to minutes since midnight
 */
export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert "HH:MM" string to seconds since midnight
 */
export function timeToSeconds(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60;
}

/**
 * Format a duration in seconds as a human-readable countdown
 * > 60 min → "1h 23m"
 * 5-60 min → "23 min"
 * 1-5 min → "3 min" (urgent)
 * < 1 min → "< 1 min" (very urgent)
 */
export function formatCountdown(totalSeconds) {
  if (totalSeconds < 0) return "Departed";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

/**
 * Get urgency level for styling
 * "urgent" = < 5 min, "warning" = 5-10 min, "normal" = > 10 min
 */
export function getUrgencyLevel(totalSeconds) {
  const minutes = totalSeconds / 60;
  if (minutes < 1) return "imminent";
  if (minutes < 5) return "urgent";
  if (minutes < 10) return "warning";
  return "normal";
}

// ─── Estimated Journey Duration (minutes) ──────────────────────
// Based on actual travel times from Villa Rhapsody:
//   Direct from NTP → Symphony Bay: 17 min
//   Direct from Sunshine City → Symphony Bay: 7 min
//   Via Sunshine City (NTP → SC → Symphony Bay): 25 min
//
// When live traffic is available (Google Routes API), these get
// replaced by real-time estimates. See traffic.js.
export const JOURNEY_TIMES = {
  main: {
    direct: 17,       // NTP → Symphony Bay (direct)
    viaSunshine: 25,   // NTP → Sunshine City → Symphony Bay
  },
  short: {
    direct: 7,         // Sunshine City → Symphony Bay
    fromNTP: 25,       // NTP → Sunshine City → Symphony Bay (full journey from NTP)
  },
};

/**
 * Get estimated arrival time for a bus entry
 * @param {Object} entry - { time, viaSunshine?, fromNTP? }
 * @param {"main"|"short"} routeKey
 * @returns {{ arrivalTime: string, durationMin: number }}
 */
export function getEstimatedArrival(entry, routeKey) {
  let durationMin;

  if (routeKey === 'main') {
    durationMin = entry.viaSunshine ? JOURNEY_TIMES.main.viaSunshine : JOURNEY_TIMES.main.direct;
  } else {
    durationMin = entry.fromNTP ? JOURNEY_TIMES.short.fromNTP : JOURNEY_TIMES.short.direct;
  }

  // Calculate arrival time
  const [h, m] = entry.time.split(':').map(Number);
  const totalMin = h * 60 + m + durationMin;
  const arrH = Math.floor(totalMin / 60) % 24;
  const arrM = totalMin % 60;
  const arrivalTime = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;

  return { arrivalTime, durationMin };
}

// ─── Next Bus Logic ────────────────────────────────────────────

/**
 * Get the schedule array for a given route and day type
 * @param {"main"|"short"} routeKey
 * @returns {Array} The schedule entries for today
 */
export function getTodaySchedule(routeKey) {
  const dayType = getDayType();
  return SCHEDULES[routeKey][dayType];
}

/**
 * Check if a bus entry is "direct" (not via another stop)
 */
function isDirect(entry, routeKey) {
  if (routeKey === 'main') return !entry.viaSunshine;
  if (routeKey === 'short') return !entry.fromNTP;
  return true;
}

/**
 * Get the next N upcoming buses from a route
 * @param {"main"|"short"} routeKey
 * @param {number} count - How many upcoming buses to return (default 3)
 * @param {boolean} directOnly - If true, skip Via Sunshine / From NTP buses
 * @returns {Array<{time: string, secondsUntil: number, countdown: string, urgency: string, viaSunshine?: boolean, fromNTP?: boolean}>}
 */
export function getNextBuses(routeKey, count = 3, directOnly = false) {
  const schedule = getTodaySchedule(routeKey);
  const now = getCurrentHKT();
  const nowSeconds = now.totalSeconds;

  const upcoming = [];

  for (const entry of schedule) {
    // Skip non-direct buses when filter is active
    if (directOnly && !isDirect(entry, routeKey)) continue;

    const entrySeconds = timeToSeconds(entry.time);
    const secondsUntil = entrySeconds - nowSeconds;

    if (secondsUntil > -60) {
      // Include buses that departed less than 1 minute ago (might still catch it)
      upcoming.push({
        time: entry.time,
        secondsUntil: Math.max(0, secondsUntil),
        countdown: formatCountdown(Math.max(0, secondsUntil)),
        urgency: getUrgencyLevel(Math.max(0, secondsUntil)),
        viaSunshine: entry.viaSunshine || false,
        fromNTP: entry.fromNTP || false,
      });
    }

    if (upcoming.length >= count) break;
  }

  return upcoming;
}

/**
 * Get all remaining buses today for a route
 * @param {"main"|"short"} routeKey
 * @param {boolean} directOnly
 * @returns {Array}
 */
export function getRemainingBuses(routeKey, directOnly = false) {
  return getNextBuses(routeKey, Infinity, directOnly);
}

/**
 * Get the first bus time for tomorrow
 * @param {"main"|"short"} routeKey
 * @returns {string} Time string like "06:35"
 */
export function getFirstBusTomorrow(routeKey) {
  // Tomorrow could be a different day type, but we don't know for sure
  // (could be a holiday). For simplicity, show the earliest possible time.
  const weekdayFirst = SCHEDULES[routeKey].weekday[0].time;
  const weekendFirst = SCHEDULES[routeKey].weekend[0].time;
  // Return the earlier of the two — worst case user arrives a bit early
  return weekdayFirst <= weekendFirst ? weekdayFirst : weekendFirst;
}

/**
 * Get the last bus time today
 * @param {"main"|"short"} routeKey
 * @returns {string}
 */
export function getLastBusToday(routeKey) {
  const schedule = getTodaySchedule(routeKey);
  return schedule[schedule.length - 1].time;
}

/**
 * Get total number of buses today
 * @param {"main"|"short"} routeKey
 * @param {boolean} directOnly
 * @returns {number}
 */
export function getTotalBusesToday(routeKey, directOnly = false) {
  const schedule = getTodaySchedule(routeKey);
  if (!directOnly) return schedule.length;
  return schedule.filter(e => isDirect(e, routeKey)).length;
}

/**
 * Get route metadata
 * @param {"main"|"short"} routeKey
 */
export function getRouteInfo(routeKey) {
  const route = SCHEDULES[routeKey];
  return {
    name: route.name,
    shortName: route.shortName,
    departure: route.departure,
    destination: route.destination,
    routeLabel: route.routeLabel,
  };
}
