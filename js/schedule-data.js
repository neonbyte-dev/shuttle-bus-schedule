// Symphony Bay Shuttle Bus Schedule Data
// Source: Symphony Bay Shuttle Bus Timetable PDF (Effective 21 Jan 2016)
//
// MAIN ROUTE: New Town Plaza → Symphony Bay
//   * = Via Sunshine City (longer route, also stops at Sunshine City)
//
// SHORT ROUTE: Sunshine City → Symphony Bay
//   (A) = Departs from New Town Plaza via Sunshine City (originates from NTP)
//
// Each entry: { time: "HH:MM", viaSunshine: true/false } or { time: "HH:MM", fromNTP: true/false }
// Times are HKT (UTC+8), no daylight saving.

export const SCHEDULES = {
  main: {
    name: "New Town Plaza → Symphony Bay",
    shortName: "New Town Plaza",
    departure: "New Town Plaza",
    destination: "Symphony Bay",
    routeLabel: "Main Route",

    // ═══════════════════════════════════════════════════════════
    // WEEKDAY: Mon–Fri (excluding public holidays)
    // Expected count: 55
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: 06:35–09:00  (12 entries)
    //   Col 2: 09:15–12:55  (12 entries)
    //   Col 3: 13:15–17:15  (12 entries)
    //   Col 4: 17:30–20:15  (12 entries)
    //   Col 5: *20:40–*23:00 (7 entries)
    // ═══════════════════════════════════════════════════════════
    weekday: [
      // Column 1
      { time: "06:35", viaSunshine: false },
      { time: "06:50", viaSunshine: false },
      { time: "07:00", viaSunshine: false },
      { time: "07:25", viaSunshine: false },
      { time: "07:35", viaSunshine: false },
      { time: "07:50", viaSunshine: false },
      { time: "08:00", viaSunshine: false },
      { time: "08:10", viaSunshine: false },
      { time: "08:25", viaSunshine: false },
      { time: "08:35", viaSunshine: false },
      { time: "08:45", viaSunshine: false },
      { time: "09:00", viaSunshine: false },
      // Column 2
      { time: "09:15", viaSunshine: false },
      { time: "09:35", viaSunshine: false },
      { time: "09:55", viaSunshine: false },
      { time: "10:15", viaSunshine: false },
      { time: "10:35", viaSunshine: false },
      { time: "10:55", viaSunshine: false },
      { time: "11:15", viaSunshine: false },
      { time: "11:35", viaSunshine: false },
      { time: "11:55", viaSunshine: false },
      { time: "12:15", viaSunshine: false },
      { time: "12:35", viaSunshine: false },
      { time: "12:55", viaSunshine: false },
      // Column 3
      { time: "13:15", viaSunshine: false },
      { time: "13:45", viaSunshine: true },   // *
      { time: "14:20", viaSunshine: false },
      { time: "14:45", viaSunshine: true },   // *
      { time: "15:20", viaSunshine: false },
      { time: "15:35", viaSunshine: false },
      { time: "15:55", viaSunshine: false },
      { time: "16:15", viaSunshine: false },
      { time: "16:30", viaSunshine: false },
      { time: "16:45", viaSunshine: false },
      { time: "17:00", viaSunshine: false },
      { time: "17:15", viaSunshine: false },
      // Column 4
      { time: "17:30", viaSunshine: false },
      { time: "17:45", viaSunshine: false },
      { time: "18:00", viaSunshine: false },
      { time: "18:15", viaSunshine: false },
      { time: "18:30", viaSunshine: false },
      { time: "18:45", viaSunshine: false },
      { time: "19:00", viaSunshine: false },
      { time: "19:15", viaSunshine: false },
      { time: "19:30", viaSunshine: false },
      { time: "19:45", viaSunshine: false },
      { time: "20:00", viaSunshine: true },   // *
      { time: "20:15", viaSunshine: true },   // *
      // Column 5
      { time: "20:40", viaSunshine: true },   // *
      { time: "21:00", viaSunshine: true },   // *
      { time: "21:20", viaSunshine: true },   // *
      { time: "21:40", viaSunshine: true },   // *
      { time: "22:00", viaSunshine: true },   // *
      { time: "22:30", viaSunshine: true },   // *
      { time: "23:00", viaSunshine: true },   // *
    ],

    // ═══════════════════════════════════════════════════════════
    // WEEKEND / PUBLIC HOLIDAYS
    // Expected count: 54
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: 06:35–09:35  (11 entries)
    //   Col 2: 09:55–13:15  (11 entries)
    //   Col 3: 13:35–16:45  (11 entries)
    //   Col 4: 17:00–19:30  (11 entries)
    //   Col 5: 19:45–*23:00 (10 entries)
    // ═══════════════════════════════════════════════════════════
    weekend: [
      // Column 1
      { time: "06:35", viaSunshine: false },
      { time: "06:55", viaSunshine: false },
      { time: "07:15", viaSunshine: false },
      { time: "07:35", viaSunshine: false },
      { time: "07:55", viaSunshine: false },
      { time: "08:15", viaSunshine: false },
      { time: "08:30", viaSunshine: false },
      { time: "08:45", viaSunshine: false },
      { time: "09:00", viaSunshine: false },
      { time: "09:15", viaSunshine: false },
      { time: "09:35", viaSunshine: false },
      // Column 2
      { time: "09:55", viaSunshine: false },
      { time: "10:15", viaSunshine: false },
      { time: "10:35", viaSunshine: false },
      { time: "10:55", viaSunshine: false },
      { time: "11:15", viaSunshine: false },
      { time: "11:35", viaSunshine: false },
      { time: "11:55", viaSunshine: false },
      { time: "12:15", viaSunshine: false },
      { time: "12:35", viaSunshine: false },
      { time: "12:55", viaSunshine: false },
      { time: "13:15", viaSunshine: false },
      // Column 3
      { time: "13:35", viaSunshine: false },
      { time: "13:55", viaSunshine: false },
      { time: "14:15", viaSunshine: false },
      { time: "14:35", viaSunshine: false },
      { time: "14:55", viaSunshine: false },
      { time: "15:15", viaSunshine: false },
      { time: "15:35", viaSunshine: false },
      { time: "15:55", viaSunshine: false },
      { time: "16:15", viaSunshine: false },
      { time: "16:30", viaSunshine: false },
      { time: "16:45", viaSunshine: false },
      // Column 4
      { time: "17:00", viaSunshine: false },
      { time: "17:15", viaSunshine: false },
      { time: "17:30", viaSunshine: false },
      { time: "17:45", viaSunshine: false },
      { time: "18:00", viaSunshine: false },
      { time: "18:15", viaSunshine: false },
      { time: "18:30", viaSunshine: false },
      { time: "18:45", viaSunshine: false },
      { time: "19:00", viaSunshine: false },
      { time: "19:15", viaSunshine: false },
      { time: "19:30", viaSunshine: false },
      // Column 5
      { time: "19:45", viaSunshine: false },
      { time: "20:00", viaSunshine: false },
      { time: "20:15", viaSunshine: false },
      { time: "20:35", viaSunshine: true },   // *
      { time: "21:00", viaSunshine: true },   // *
      { time: "21:20", viaSunshine: true },   // *
      { time: "21:40", viaSunshine: true },   // *
      { time: "22:00", viaSunshine: true },   // *
      { time: "22:30", viaSunshine: true },   // *
      { time: "23:00", viaSunshine: true },   // *
    ],
  },

  short: {
    name: "Sunshine City → Symphony Bay",
    shortName: "Sunshine City",
    departure: "Sunshine City",
    destination: "Symphony Bay",
    routeLabel: "Short Route",

    // ═══════════════════════════════════════════════════════════
    // WEEKDAY: Mon–Fri (excluding public holidays)
    // Expected count: 54
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: 07:10–09:10  (12 entries)
    //   Col 2: 09:30–13:10  (12 entries)
    //   Col 3: 13:30–17:10  (12 entries)
    //   Col 4: 17:30–(A)20:55 (12 entries)
    //   Col 5: (A)21:15–(A)23:15 (6 entries)
    // ═══════════════════════════════════════════════════════════
    weekday: [
      // Column 1
      { time: "07:10", fromNTP: false },
      { time: "07:22", fromNTP: false },
      { time: "07:37", fromNTP: false },
      { time: "07:47", fromNTP: false },
      { time: "07:57", fromNTP: false },
      { time: "08:07", fromNTP: false },
      { time: "08:17", fromNTP: false },
      { time: "08:27", fromNTP: false },
      { time: "08:37", fromNTP: false },
      { time: "08:47", fromNTP: false },
      { time: "08:57", fromNTP: false },
      { time: "09:10", fromNTP: false },
      // Column 2
      { time: "09:30", fromNTP: false },
      { time: "09:50", fromNTP: false },
      { time: "10:10", fromNTP: false },
      { time: "10:30", fromNTP: false },
      { time: "10:50", fromNTP: false },
      { time: "11:10", fromNTP: false },
      { time: "11:30", fromNTP: false },
      { time: "11:50", fromNTP: false },
      { time: "12:10", fromNTP: false },
      { time: "12:30", fromNTP: false },
      { time: "12:50", fromNTP: false },
      { time: "13:10", fromNTP: false },
      // Column 3
      { time: "13:30", fromNTP: false },
      { time: "13:50", fromNTP: false },
      { time: "14:00", fromNTP: true },    // (A)
      { time: "14:30", fromNTP: false },
      { time: "14:50", fromNTP: false },
      { time: "15:00", fromNTP: true },    // (A)
      { time: "15:30", fromNTP: false },
      { time: "15:50", fromNTP: false },
      { time: "16:10", fromNTP: false },
      { time: "16:30", fromNTP: false },
      { time: "16:50", fromNTP: false },
      { time: "17:10", fromNTP: false },
      // Column 4
      { time: "17:30", fromNTP: false },
      { time: "17:50", fromNTP: false },
      { time: "18:10", fromNTP: false },
      { time: "18:30", fromNTP: false },
      { time: "18:50", fromNTP: false },
      { time: "19:10", fromNTP: false },
      { time: "19:30", fromNTP: false },
      { time: "19:50", fromNTP: false },
      { time: "20:10", fromNTP: false },
      { time: "20:15", fromNTP: true },    // (A)
      { time: "20:30", fromNTP: true },    // (A)
      { time: "20:55", fromNTP: true },    // (A)
      // Column 5
      { time: "21:15", fromNTP: true },    // (A)
      { time: "21:35", fromNTP: true },    // (A)
      { time: "21:55", fromNTP: true },    // (A)
      { time: "22:15", fromNTP: true },    // (A)
      { time: "22:45", fromNTP: true },    // (A)
      { time: "23:15", fromNTP: true },    // (A)
    ],

    // ═══════════════════════════════════════════════════════════
    // WEEKEND / PUBLIC HOLIDAYS
    // Expected count: 48
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: –, –, 07:10–09:50 (11 entries, first 2 are dashes = no bus)
    //   Col 2: 10:10–13:30  (11 entries)
    //   Col 3: 13:50–17:10  (11 entries)
    //   Col 4: 17:30–(A)20:50 (11 entries)
    //   Col 5: (A)21:15–(A)23:15 (6 entries, last 2 are dashes)
    // Note: first two weekend slots are dashes (no bus before 07:10)
    // ═══════════════════════════════════════════════════════════
    weekend: [
      // Column 1 (starts at 07:10, first two rows are dashes)
      { time: "07:10", fromNTP: false },
      { time: "07:30", fromNTP: false },
      { time: "07:50", fromNTP: false },
      { time: "08:10", fromNTP: false },
      { time: "08:30", fromNTP: false },
      { time: "08:50", fromNTP: false },
      { time: "09:10", fromNTP: false },
      { time: "09:30", fromNTP: false },
      { time: "09:50", fromNTP: false },
      // Column 2
      { time: "10:10", fromNTP: false },
      { time: "10:30", fromNTP: false },
      { time: "10:50", fromNTP: false },
      { time: "11:10", fromNTP: false },
      { time: "11:30", fromNTP: false },
      { time: "11:50", fromNTP: false },
      { time: "12:10", fromNTP: false },
      { time: "12:30", fromNTP: false },
      { time: "12:50", fromNTP: false },
      { time: "13:10", fromNTP: false },
      { time: "13:30", fromNTP: false },
      // Column 3
      { time: "13:50", fromNTP: false },
      { time: "14:10", fromNTP: false },
      { time: "14:30", fromNTP: false },
      { time: "14:50", fromNTP: false },
      { time: "15:10", fromNTP: false },
      { time: "15:30", fromNTP: false },
      { time: "15:50", fromNTP: false },
      { time: "16:10", fromNTP: false },
      { time: "16:30", fromNTP: false },
      { time: "16:50", fromNTP: false },
      { time: "17:10", fromNTP: false },
      // Column 4
      { time: "17:30", fromNTP: false },
      { time: "17:50", fromNTP: false },
      { time: "18:10", fromNTP: false },
      { time: "18:30", fromNTP: false },
      { time: "18:50", fromNTP: false },
      { time: "19:10", fromNTP: false },
      { time: "19:30", fromNTP: false },
      { time: "19:50", fromNTP: false },
      { time: "20:10", fromNTP: false },
      { time: "20:30", fromNTP: false },
      { time: "20:50", fromNTP: true },    // (A)
      // Column 5
      { time: "21:15", fromNTP: true },    // (A)
      { time: "21:35", fromNTP: true },    // (A)
      { time: "21:55", fromNTP: true },    // (A)
      { time: "22:15", fromNTP: true },    // (A)
      { time: "22:45", fromNTP: true },    // (A)
      { time: "23:15", fromNTP: true },    // (A)
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// SELF-VERIFICATION — runs on import
// If any of these fail, a console error appears immediately
// ═══════════════════════════════════════════════════════════════

function verify() {
  const checks = [];

  // 1. Count checks
  checks.push({
    name: "Main weekday count",
    expected: 55,
    actual: SCHEDULES.main.weekday.length,
  });
  checks.push({
    name: "Main weekend count",
    expected: 54,
    actual: SCHEDULES.main.weekend.length,
  });
  checks.push({
    name: "Short weekday count",
    expected: 54,
    actual: SCHEDULES.short.weekday.length,
  });
  checks.push({
    name: "Short weekend count",
    expected: 48,
    actual: SCHEDULES.short.weekend.length,
  });

  // 2. Monotonicity checks (times must be ascending)
  function isAscending(entries, label) {
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].time <= entries[i - 1].time) {
        checks.push({
          name: `${label} ascending at index ${i}`,
          expected: `> ${entries[i - 1].time}`,
          actual: entries[i].time,
        });
        return;
      }
    }
    checks.push({ name: `${label} ascending`, expected: "all ascending", actual: "all ascending" });
  }

  isAscending(SCHEDULES.main.weekday, "Main weekday");
  isAscending(SCHEDULES.main.weekend, "Main weekend");
  isAscending(SCHEDULES.short.weekday, "Short weekday");
  isAscending(SCHEDULES.short.weekend, "Short weekend");

  // 3. Flag counts
  const mainWdVia = SCHEDULES.main.weekday.filter(e => e.viaSunshine).length;
  const mainWeVia = SCHEDULES.main.weekend.filter(e => e.viaSunshine).length;
  const shortWdNtp = SCHEDULES.short.weekday.filter(e => e.fromNTP).length;
  const shortWeNtp = SCHEDULES.short.weekend.filter(e => e.fromNTP).length;

  // Main weekday: *13:45, *14:45, *20:00, *20:15, *20:40, *21:00, *21:20, *21:40, *22:00, *22:30, *23:00 = 11
  checks.push({ name: "Main weekday viaSunshine count", expected: 11, actual: mainWdVia });
  // Main weekend: *20:35, *21:00, *21:20, *21:40, *22:00, *22:30, *23:00 = 7
  checks.push({ name: "Main weekend viaSunshine count", expected: 7, actual: mainWeVia });
  // Short weekday: (A)14:00, (A)15:00, (A)20:15, (A)20:30, (A)20:55, (A)21:15, (A)21:35, (A)21:55, (A)22:15, (A)22:45, (A)23:15 = 11
  checks.push({ name: "Short weekday fromNTP count", expected: 11, actual: shortWdNtp });
  // Short weekend: (A)20:50, (A)21:15, (A)21:35, (A)21:55, (A)22:15, (A)22:45, (A)23:15 = 7
  checks.push({ name: "Short weekend fromNTP count", expected: 7, actual: shortWeNtp });

  // Report results
  let allPassed = true;
  for (const check of checks) {
    if (check.expected !== check.actual) {
      console.error(`❌ SCHEDULE VERIFY FAILED: ${check.name} — expected ${check.expected}, got ${check.actual}`);
      allPassed = false;
    }
  }
  if (allPassed) {
    console.log("✅ All schedule verification checks passed (" + checks.length + " checks)");
  }
}

verify();
