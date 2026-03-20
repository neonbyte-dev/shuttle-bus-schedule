// Traffic Module — Google Routes API integration
//
// Fetches live traffic-aware travel times for shuttle routes.
// Results are cached and used to adjust the static ETAs.
//
// Usage caps:
//   - Poll every 5 minutes (not every second)
//   - Only poll when the app is visible (not in background)
//   - Max 50 API calls per day (~4 hours of active use)
//   - Each poll = 3 route requests = 3 API calls
//   - 50 calls / 3 = ~16 polls/day = 80 min of active polling
//   - At 5 min intervals, that's ~80 min of the app being open
//   - Well within the free tier ($200/mo credit, $5/1000 calls)

const API_KEY = 'AIzaSyClaYayXrmTg4RuhJx0lxFblJHIgx31JwE';
const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

// Poll interval: 5 minutes
const POLL_INTERVAL_MS = 5 * 60 * 1000;

// Daily cap: 50 API calls (individual route requests, not polls)
const DAILY_CAP = 50;

// Coordinates for the three stops
// Coordinates verified against Google Maps directions link:
// https://www.google.com/maps/dir/New+Town+Plaza+Phase+1/533+Sai+Sha+Rd,+Symphony+Bay
const LOCATIONS = {
  ntp: { lat: 22.3818, lng: 114.1886 },         // New Town Plaza Phase 1, Sha Tin Centre St
  sunshine: { lat: 22.4245, lng: 114.2321 },     // Sunshine City, Ma On Shan
  symphonyBay: { lat: 22.4293, lng: 114.2519 },  // 533 Sai Sha Rd, Symphony Bay
};

// The three route configurations
const ROUTE_CONFIGS = [
  {
    key: 'main_direct',
    name: 'NTP → Symphony Bay',
    from: LOCATIONS.ntp,
    to: LOCATIONS.symphonyBay,
    intermediates: [],
  },
  {
    key: 'short_direct',
    name: 'Sunshine City → Symphony Bay',
    from: LOCATIONS.sunshine,
    to: LOCATIONS.symphonyBay,
    intermediates: [],
  },
  {
    key: 'main_via_sunshine',
    name: 'NTP → via SC → Symphony Bay',
    from: LOCATIONS.ntp,
    to: LOCATIONS.symphonyBay,
    intermediates: [LOCATIONS.sunshine],
  },
];

// ─── State ─────────────────────────────────────────────────────
let trafficData = null;       // Latest traffic results
let lastFetchTime = 0;        // Timestamp of last successful fetch
let pollTimer = null;
let dailyCallCount = 0;
let dailyCountDate = '';      // "YYYY-MM-DD" — resets each day

// ─── Daily Usage Tracking ──────────────────────────────────────
function loadDailyCount() {
  const stored = localStorage.getItem('shuttle-traffic-usage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date === today) {
        dailyCallCount = parsed.count;
        dailyCountDate = parsed.date;
        return;
      }
    } catch (e) { /* ignore */ }
  }
  // New day or no data
  dailyCallCount = 0;
  dailyCountDate = new Date().toISOString().slice(0, 10);
}

function saveDailyCount() {
  localStorage.setItem('shuttle-traffic-usage', JSON.stringify({
    date: dailyCountDate,
    count: dailyCallCount,
  }));
}

function canMakeApiCall() {
  // Check if we've hit the daily cap
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dailyCountDate) {
    // New day — reset counter
    dailyCallCount = 0;
    dailyCountDate = today;
    saveDailyCount();
  }
  return dailyCallCount < DAILY_CAP;
}

// ─── API Call ──────────────────────────────────────────────────
async function fetchRoute(config) {
  const body = {
    origin: { location: { latLng: { latitude: config.from.lat, longitude: config.from.lng } } },
    destination: { location: { latLng: { latitude: config.to.lat, longitude: config.to.lng } } },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
  };

  if (config.intermediates.length > 0) {
    body.intermediates = config.intermediates.map(loc => ({
      location: { latLng: { latitude: loc.lat, longitude: loc.lng } }
    }));
  }

  const res = await fetch(ROUTES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline',
    },
    body: JSON.stringify(body),
  });

  dailyCallCount++;
  saveDailyCount();

  const data = await res.json();

  if (data.routes && data.routes[0]) {
    const route = data.routes[0];
    const staticSec = parseInt(route.staticDuration);
    const trafficSec = parseInt(route.duration);
    return {
      key: config.key,
      name: config.name,
      staticSeconds: staticSec,
      trafficSeconds: trafficSec,
      staticMinutes: Math.round(staticSec / 60),
      trafficMinutes: Math.round(trafficSec / 60),
      deltaMinutes: Math.round((trafficSec - staticSec) / 60),
      distanceKm: (route.distanceMeters / 1000).toFixed(1),
      polyline: route.polyline?.encodedPolyline || null,
    };
  }

  throw new Error(data.error?.message || 'Unknown API error');
}

// ─── Fetch All Routes ──────────────────────────────────────────
async function fetchAllTraffic() {
  if (!canMakeApiCall()) {
    console.log(`Traffic API: daily cap reached (${dailyCallCount}/${DAILY_CAP})`);
    return null;
  }

  try {
    const results = await Promise.all(ROUTE_CONFIGS.map(fetchRoute));
    const data = {};
    for (const r of results) {
      data[r.key] = r;
    }

    trafficData = {
      routes: data,
      fetchedAt: Date.now(),
      callsUsed: dailyCallCount,
      callsRemaining: DAILY_CAP - dailyCallCount,
    };

    lastFetchTime = Date.now();
    console.log(`Traffic updated: ${dailyCallCount}/${DAILY_CAP} calls used today`);
    return trafficData;
  } catch (err) {
    console.error('Traffic fetch failed:', err.message);
    return null;
  }
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Get the traffic-adjusted duration for a bus entry.
 * Returns null if no traffic data is available.
 *
 * @param {Object} entry - { viaSunshine?, fromNTP? }
 * @param {"main"|"short"} routeKey
 * @returns {{ trafficMinutes: number, deltaMinutes: number, label: string } | null}
 */
export function getTrafficAdjustment(entry, routeKey) {
  if (!trafficData) return null;

  let key;
  if (routeKey === 'main') {
    key = entry.viaSunshine ? 'main_via_sunshine' : 'main_direct';
  } else {
    // Always use short_direct — user boards at Sunshine City regardless of where bus came from
    key = 'short_direct';
  }

  const route = trafficData.routes[key];
  if (!route) return null;

  const delta = route.deltaMinutes;
  let label;
  if (delta > 0) {
    label = `+${delta} min traffic`;
  } else if (delta < 0) {
    label = `${delta} min, light traffic`;
  } else {
    label = 'normal traffic';
  }

  return {
    trafficMinutes: route.trafficMinutes,
    deltaMinutes: delta,
    label,
  };
}

/**
 * Get the traffic status summary for display
 */
export function getTrafficStatus() {
  if (!trafficData) {
    return { available: false, label: 'No traffic data' };
  }

  const ageMin = Math.round((Date.now() - trafficData.fetchedAt) / 60000);
  return {
    available: true,
    ageMinutes: ageMin,
    label: ageMin < 1 ? 'Live traffic' : `Traffic (${ageMin}m ago)`,
    callsUsed: trafficData.callsUsed,
    callsRemaining: trafficData.callsRemaining,
  };
}

/**
 * Get polyline data for a route (for future map feature)
 */
export function getRoutePolyline(routeKey, viaSunshine) {
  if (!trafficData) return null;
  const key = viaSunshine ? 'main_via_sunshine' :
              routeKey === 'main' ? 'main_direct' : 'short_direct';
  return trafficData.routes[key]?.polyline || null;
}

/**
 * Start polling for traffic data.
 * Respects visibility API — pauses when tab is hidden.
 */
export function startTrafficPolling() {
  loadDailyCount();

  // Initial fetch
  fetchAllTraffic();

  // Poll every 5 minutes
  pollTimer = setInterval(() => {
    if (!document.hidden) {
      fetchAllTraffic();
    }
  }, POLL_INTERVAL_MS);

  // Re-fetch when tab becomes visible (if data is stale)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastFetchTime > POLL_INTERVAL_MS) {
      fetchAllTraffic();
    }
  });
}

/**
 * Stop polling
 */
export function stopTrafficPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
