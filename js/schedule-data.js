// Symphony Bay Shuttle Bus Schedule Data
// Source: Symphony Bay Shuttle Bus Timetable PDF (Effective 21 Jan 2016)
//
// MAIN ROUTE: New Town Plaza → Symphony Bay
//   * = Via Sunshine City (longer route, also stops at Sunshine City)
//
// SHORT ROUTE: Sunshine City → Symphony Bay
//   (A) = Departs from New Town Plaza via Sunshine City (originates from NTP)
//
// MAIN ROUTE RETURN: Villa Rhapsody → New Town Plaza
//   * = Via Sunshine City (longer route, ~25 min instead of ~17 min)
//
// SHORT ROUTE RETURN: Villa Rhapsody → Sunshine City
//   (A) = Departs from Villa Concerto Via Sunshine City to NTP (continues past SC)
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

  mainReturn: {
    name: "Villa Rhapsody → New Town Plaza",
    shortName: "To NTP",
    departure: "Villa Rhapsody",
    destination: "New Town Plaza",
    routeLabel: "Main Route",

    // ═══════════════════════════════════════════════════════════
    // WEEKDAY: Mon–Fri (excluding public holidays)
    // Expected count: 56
    // * = Via Sunshine City (~25 min instead of ~17 min)
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: *06:16–08:31  (12 entries)
    //   Col 2: 08:46–12:21  (12 entries)
    //   Col 3: 12:41–16:46  (12 entries)
    //   Col 4: 17:01–19:46  (12 entries)
    //   Col 5: 20:01–*22:41 (8 entries)
    // ═══════════════════════════════════════════════════════════
    weekday: [
      // Column 1
      { time: "06:16", viaSunshine: true },   // *
      { time: "06:31", viaSunshine: true },   // *
      { time: "06:41", viaSunshine: true },   // *
      { time: "07:01", viaSunshine: false },
      { time: "07:11", viaSunshine: false },
      { time: "07:21", viaSunshine: false },
      { time: "07:36", viaSunshine: false },
      { time: "07:46", viaSunshine: false },
      { time: "07:56", viaSunshine: false },
      { time: "08:11", viaSunshine: false },
      { time: "08:21", viaSunshine: false },
      { time: "08:31", viaSunshine: false },
      // Column 2
      { time: "08:46", viaSunshine: false },
      { time: "09:01", viaSunshine: false },
      { time: "09:21", viaSunshine: false },
      { time: "09:41", viaSunshine: false },
      { time: "10:01", viaSunshine: false },
      { time: "10:21", viaSunshine: false },
      { time: "10:41", viaSunshine: false },
      { time: "11:01", viaSunshine: false },
      { time: "11:21", viaSunshine: false },
      { time: "11:41", viaSunshine: false },
      { time: "12:01", viaSunshine: false },
      { time: "12:21", viaSunshine: false },
      // Column 3
      { time: "12:41", viaSunshine: false },
      { time: "13:01", viaSunshine: false },
      { time: "13:31", viaSunshine: false },
      { time: "14:01", viaSunshine: true },   // *
      { time: "14:31", viaSunshine: false },
      { time: "15:01", viaSunshine: true },   // *
      { time: "15:21", viaSunshine: false },
      { time: "15:41", viaSunshine: false },
      { time: "16:01", viaSunshine: false },
      { time: "16:16", viaSunshine: false },
      { time: "16:31", viaSunshine: false },
      { time: "16:46", viaSunshine: false },
      // Column 4
      { time: "17:01", viaSunshine: false },
      { time: "17:16", viaSunshine: false },
      { time: "17:31", viaSunshine: false },
      { time: "17:46", viaSunshine: false },
      { time: "18:01", viaSunshine: false },
      { time: "18:16", viaSunshine: false },
      { time: "18:31", viaSunshine: false },
      { time: "18:46", viaSunshine: false },
      { time: "19:01", viaSunshine: false },
      { time: "19:16", viaSunshine: false },
      { time: "19:31", viaSunshine: false },
      { time: "19:46", viaSunshine: false },
      // Column 5
      { time: "20:01", viaSunshine: false },
      { time: "20:21", viaSunshine: true },   // *
      { time: "20:41", viaSunshine: true },   // *
      { time: "21:01", viaSunshine: true },   // *
      { time: "21:21", viaSunshine: true },   // *
      { time: "21:41", viaSunshine: true },   // *
      { time: "22:11", viaSunshine: true },   // *
      { time: "22:41", viaSunshine: true },   // *
    ],

    // ═══════════════════════════════════════════════════════════
    // WEEKEND / PUBLIC HOLIDAYS
    // Expected count: 54
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: *06:16–09:21  (11 entries)
    //   Col 2: 09:41–13:01  (11 entries)
    //   Col 3: 13:21–16:31  (11 entries)
    //   Col 4: 16:46–19:16  (11 entries)
    //   Col 5: 19:31–*22:41 (10 entries)
    // ═══════════════════════════════════════════════════════════
    weekend: [
      // Column 1
      { time: "06:16", viaSunshine: true },   // *
      { time: "06:36", viaSunshine: true },   // *
      { time: "07:01", viaSunshine: false },
      { time: "07:21", viaSunshine: false },
      { time: "07:41", viaSunshine: false },
      { time: "08:01", viaSunshine: false },
      { time: "08:16", viaSunshine: false },
      { time: "08:31", viaSunshine: false },
      { time: "08:46", viaSunshine: false },
      { time: "09:01", viaSunshine: false },
      { time: "09:21", viaSunshine: false },
      // Column 2
      { time: "09:41", viaSunshine: false },
      { time: "10:01", viaSunshine: false },
      { time: "10:21", viaSunshine: false },
      { time: "10:41", viaSunshine: false },
      { time: "11:01", viaSunshine: false },
      { time: "11:21", viaSunshine: false },
      { time: "11:41", viaSunshine: false },
      { time: "12:01", viaSunshine: false },
      { time: "12:21", viaSunshine: false },
      { time: "12:41", viaSunshine: false },
      { time: "13:01", viaSunshine: false },
      // Column 3
      { time: "13:21", viaSunshine: false },
      { time: "13:41", viaSunshine: false },
      { time: "14:01", viaSunshine: false },
      { time: "14:21", viaSunshine: false },
      { time: "14:41", viaSunshine: false },
      { time: "15:01", viaSunshine: false },
      { time: "15:21", viaSunshine: false },
      { time: "15:41", viaSunshine: false },
      { time: "16:01", viaSunshine: false },
      { time: "16:16", viaSunshine: false },
      { time: "16:31", viaSunshine: false },
      // Column 4
      { time: "16:46", viaSunshine: false },
      { time: "17:01", viaSunshine: false },
      { time: "17:16", viaSunshine: false },
      { time: "17:31", viaSunshine: false },
      { time: "17:46", viaSunshine: false },
      { time: "18:01", viaSunshine: false },
      { time: "18:16", viaSunshine: false },
      { time: "18:31", viaSunshine: false },
      { time: "18:46", viaSunshine: false },
      { time: "19:01", viaSunshine: false },
      { time: "19:16", viaSunshine: false },
      // Column 5
      { time: "19:31", viaSunshine: false },
      { time: "19:46", viaSunshine: false },
      { time: "20:01", viaSunshine: false },
      { time: "20:21", viaSunshine: false },
      { time: "20:41", viaSunshine: true },   // *
      { time: "21:01", viaSunshine: true },   // *
      { time: "21:21", viaSunshine: true },   // *
      { time: "21:41", viaSunshine: true },   // *
      { time: "22:11", viaSunshine: true },   // *
      { time: "22:41", viaSunshine: true },   // *
    ],
  },

  shortReturn: {
    name: "Villa Rhapsody → Sunshine City",
    shortName: "To Sunshine City",
    departure: "Villa Rhapsody",
    destination: "Sunshine City",
    routeLabel: "Short Route",

    // ═══════════════════════════════════════════════════════════
    // WEEKDAY: Mon–Fri (excluding public holidays)
    // Expected count: 56
    // (A) = Departs from Villa Concerto Via Sunshine City to NTP
    //       (continues past Sunshine City to New Town Plaza)
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: (A)06:16–08:20  (12 entries)
    //   Col 2: 08:30–11:40  (12 entries)
    //   Col 3: 12:00–15:40  (12 entries)
    //   Col 4: 16:00–19:40  (12 entries)
    //   Col 5: 20:00–(A)22:41 (8 entries)
    // ═══════════════════════════════════════════════════════════
    weekday: [
      // Column 1
      { time: "06:16", fromNTP: true },    // (A)
      { time: "06:31", fromNTP: true },    // (A)
      { time: "06:41", fromNTP: true },    // (A)
      { time: "07:00", fromNTP: false },
      { time: "07:15", fromNTP: false },
      { time: "07:20", fromNTP: false },
      { time: "07:30", fromNTP: false },
      { time: "07:40", fromNTP: false },
      { time: "07:50", fromNTP: false },
      { time: "08:00", fromNTP: false },
      { time: "08:10", fromNTP: false },
      { time: "08:20", fromNTP: false },
      // Column 2
      { time: "08:30", fromNTP: false },
      { time: "08:40", fromNTP: false },
      { time: "08:50", fromNTP: false },
      { time: "09:00", fromNTP: false },
      { time: "09:20", fromNTP: false },
      { time: "09:40", fromNTP: false },
      { time: "10:00", fromNTP: false },
      { time: "10:20", fromNTP: false },
      { time: "10:40", fromNTP: false },
      { time: "11:00", fromNTP: false },
      { time: "11:20", fromNTP: false },
      { time: "11:40", fromNTP: false },
      // Column 3
      { time: "12:00", fromNTP: false },
      { time: "12:20", fromNTP: false },
      { time: "12:40", fromNTP: false },
      { time: "13:00", fromNTP: false },
      { time: "13:20", fromNTP: false },
      { time: "13:40", fromNTP: false },
      { time: "14:01", fromNTP: true },    // (A)
      { time: "14:20", fromNTP: false },
      { time: "14:40", fromNTP: false },
      { time: "15:01", fromNTP: true },    // (A)
      { time: "15:20", fromNTP: false },
      { time: "15:40", fromNTP: false },
      // Column 4
      { time: "16:00", fromNTP: false },
      { time: "16:20", fromNTP: false },
      { time: "16:40", fromNTP: false },
      { time: "17:00", fromNTP: false },
      { time: "17:20", fromNTP: false },
      { time: "17:40", fromNTP: false },
      { time: "18:00", fromNTP: false },
      { time: "18:20", fromNTP: false },
      { time: "18:40", fromNTP: false },
      { time: "19:00", fromNTP: false },
      { time: "19:20", fromNTP: false },
      { time: "19:40", fromNTP: false },
      // Column 5
      { time: "20:00", fromNTP: false },
      { time: "20:21", fromNTP: true },    // (A)
      { time: "20:41", fromNTP: true },    // (A)
      { time: "21:01", fromNTP: true },    // (A)
      { time: "21:21", fromNTP: true },    // (A)
      { time: "21:41", fromNTP: true },    // (A)
      { time: "22:11", fromNTP: true },    // (A)
      { time: "22:41", fromNTP: true },    // (A)
    ],

    // ═══════════════════════════════════════════════════════════
    // WEEKEND / PUBLIC HOLIDAYS
    // Expected count: 49
    // PDF columns read left-to-right, top-to-bottom:
    //   Col 1: (A)06:16–09:40  (11 entries)
    //   Col 2: 10:00–13:20  (11 entries)
    //   Col 3: 13:40–17:00  (11 entries)
    //   Col 4: 17:20–(A)20:41 (11 entries)
    //   Col 5: (A)21:01–(A)22:41 (5 entries)
    // ═══════════════════════════════════════════════════════════
    weekend: [
      // Column 1
      { time: "06:16", fromNTP: true },    // (A)
      { time: "06:36", fromNTP: true },    // (A)
      { time: "07:00", fromNTP: false },
      { time: "07:20", fromNTP: false },
      { time: "07:40", fromNTP: false },
      { time: "08:00", fromNTP: false },
      { time: "08:20", fromNTP: false },
      { time: "08:40", fromNTP: false },
      { time: "09:00", fromNTP: false },
      { time: "09:20", fromNTP: false },
      { time: "09:40", fromNTP: false },
      // Column 2
      { time: "10:00", fromNTP: false },
      { time: "10:20", fromNTP: false },
      { time: "10:40", fromNTP: false },
      { time: "11:00", fromNTP: false },
      { time: "11:20", fromNTP: false },
      { time: "11:40", fromNTP: false },
      { time: "12:00", fromNTP: false },
      { time: "12:20", fromNTP: false },
      { time: "12:40", fromNTP: false },
      { time: "13:00", fromNTP: false },
      { time: "13:20", fromNTP: false },
      // Column 3
      { time: "13:40", fromNTP: false },
      { time: "14:00", fromNTP: false },
      { time: "14:20", fromNTP: false },
      { time: "14:40", fromNTP: false },
      { time: "15:00", fromNTP: false },
      { time: "15:20", fromNTP: false },
      { time: "15:40", fromNTP: false },
      { time: "16:00", fromNTP: false },
      { time: "16:20", fromNTP: false },
      { time: "16:40", fromNTP: false },
      { time: "17:00", fromNTP: false },
      // Column 4
      { time: "17:20", fromNTP: false },
      { time: "17:40", fromNTP: false },
      { time: "18:00", fromNTP: false },
      { time: "18:20", fromNTP: false },
      { time: "18:40", fromNTP: false },
      { time: "19:00", fromNTP: false },
      { time: "19:20", fromNTP: false },
      { time: "19:40", fromNTP: false },
      { time: "20:00", fromNTP: false },
      { time: "20:20", fromNTP: false },
      { time: "20:41", fromNTP: true },    // (A)
      // Column 5
      { time: "21:01", fromNTP: true },    // (A)
      { time: "21:21", fromNTP: true },    // (A)
      { time: "21:41", fromNTP: true },    // (A)
      { time: "22:11", fromNTP: true },    // (A)
      { time: "22:41", fromNTP: true },    // (A)
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// SELF-VERIFICATION — runs on import
// If any of these fail, a console error appears immediately
// ═══════════════════════════════════════════════════════════════

function verify() {
  const checks = [];

  // 1. Count checks — outbound routes
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

  // Count checks — return routes
  checks.push({
    name: "Main Return weekday count",
    expected: 56,
    actual: SCHEDULES.mainReturn.weekday.length,
  });
  checks.push({
    name: "Main Return weekend count",
    expected: 54,
    actual: SCHEDULES.mainReturn.weekend.length,
  });
  checks.push({
    name: "Short Return weekday count",
    expected: 56,
    actual: SCHEDULES.shortReturn.weekday.length,
  });
  checks.push({
    name: "Short Return weekend count",
    expected: 49,
    actual: SCHEDULES.shortReturn.weekend.length,
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
  isAscending(SCHEDULES.mainReturn.weekday, "Main Return weekday");
  isAscending(SCHEDULES.mainReturn.weekend, "Main Return weekend");
  isAscending(SCHEDULES.shortReturn.weekday, "Short Return weekday");
  isAscending(SCHEDULES.shortReturn.weekend, "Short Return weekend");

  // 3. Flag counts — outbound routes
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

  // Flag counts — return routes
  const mainRetWdVia = SCHEDULES.mainReturn.weekday.filter(e => e.viaSunshine).length;
  const mainRetWeVia = SCHEDULES.mainReturn.weekend.filter(e => e.viaSunshine).length;
  const shortRetWdNtp = SCHEDULES.shortReturn.weekday.filter(e => e.fromNTP).length;
  const shortRetWeNtp = SCHEDULES.shortReturn.weekend.filter(e => e.fromNTP).length;

  // Main Return weekday: *06:16, *06:31, *06:41, *14:01, *15:01, *20:21, *20:41, *21:01, *21:21, *21:41, *22:11, *22:41 = 12
  checks.push({ name: "Main Return weekday viaSunshine count", expected: 12, actual: mainRetWdVia });
  // Main Return weekend: *06:16, *06:36, *20:41, *21:01, *21:21, *21:41, *22:11, *22:41 = 8
  checks.push({ name: "Main Return weekend viaSunshine count", expected: 8, actual: mainRetWeVia });
  // Short Return weekday: (A)06:16, (A)06:31, (A)06:41, (A)14:01, (A)15:01, (A)20:21, (A)20:41, (A)21:01, (A)21:21, (A)21:41, (A)22:11, (A)22:41 = 12
  checks.push({ name: "Short Return weekday fromNTP count", expected: 12, actual: shortRetWdNtp });
  // Short Return weekend: (A)06:16, (A)06:36, (A)20:41, (A)21:01, (A)21:21, (A)21:41, (A)22:11, (A)22:41 = 8
  checks.push({ name: "Short Return weekend fromNTP count", expected: 8, actual: shortRetWeNtp });

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
