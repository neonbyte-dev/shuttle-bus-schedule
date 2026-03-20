// App — UI logic, countdown timer, route switching
//
// This file connects the schedule engine to the DOM.
// No schedule data or calculation logic lives here.

import {
  getCurrentHKT,
  getHKTDateString,
  getDayType,
  getDayTypeLabel,
  getNextBuses,
  getRemainingBuses,
  getFirstBusTomorrow,
  getLastBusToday,
  getTotalBusesToday,
  getRouteInfo,
  timeToMinutes,
  formatCountdown,
  getUrgencyLevel,
  timeToSeconds,
  getEstimatedArrival,
} from './schedule-engine.js';

import { SCHEDULES } from './schedule-data.js';
import { startTrafficPolling, getTrafficAdjustment, getTrafficStatus } from './traffic.js';
import { setupTrafficMap, updateMapRoute } from './traffic-map.js';

// ─── State ─────────────────────────────────────────────────────
let currentRoute = localStorage.getItem('shuttle-route') || 'main';
let directOnly = localStorage.getItem('shuttle-direct') === 'true';
let updateInterval = null;
let lastMapRoute = null; // Track to avoid re-drawing map every second

// ─── DOM Elements ──────────────────────────────────────────────
const routeButtons = document.querySelectorAll('.route-btn');
const dayDateEl = document.getElementById('day-date');
const dayTypeEl = document.getElementById('day-type');
const currentTimeEl = document.getElementById('current-time');
const nextBusSection = document.getElementById('next-bus-section');
const nextBusCard = document.getElementById('next-bus-card');
const lastBusWarning = document.getElementById('last-bus-warning');
const comingUpSection = document.getElementById('coming-up-section');
const comingUpList = document.getElementById('coming-up-list');
const noBusesSection = document.getElementById('no-buses-section');
const firstBusTomorrowEl = document.getElementById('first-bus-tomorrow');
const fullSchedule = document.getElementById('full-schedule');
const remainingCountEl = document.getElementById('remaining-count');
const fullScheduleList = document.getElementById('full-schedule-list');
const directFilterBtn = document.getElementById('direct-filter');

// ─── Route Toggle ──────────────────────────────────────────────
routeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const route = btn.dataset.route;
    if (route === currentRoute) return;

    currentRoute = route;
    localStorage.setItem('shuttle-route', route);

    // Update active state
    routeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Re-render
    render();
  });
});

// Set initial active button
routeButtons.forEach(btn => {
  btn.classList.toggle('active', btn.dataset.route === currentRoute);
});

// ─── Direct Only Filter ────────────────────────────────────────
directFilterBtn.classList.toggle('active', directOnly);

directFilterBtn.addEventListener('click', () => {
  directOnly = !directOnly;
  localStorage.setItem('shuttle-direct', directOnly);
  directFilterBtn.classList.toggle('active', directOnly);
  render();
});

// ─── Date & Time Display ───────────────────────────────────────
function updateDateDisplay() {
  const now = new Date();
  const hktString = now.toLocaleDateString('en-US', {
    timeZone: 'Asia/Hong_Kong',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  dayDateEl.textContent = hktString;
  dayTypeEl.textContent = getDayTypeLabel();
}

function updateTimeDisplay() {
  const hkt = getCurrentHKT();
  const h = String(hkt.hours).padStart(2, '0');
  const m = String(hkt.minutes).padStart(2, '0');
  const s = String(hkt.seconds).padStart(2, '0');
  currentTimeEl.textContent = `${h}:${m}:${s}`;
}

// ─── Annotation Helpers ────────────────────────────────────────
function getDotClass(bus, routeKey) {
  if (routeKey === 'main' && bus.viaSunshine) return 'dot-via';
  if (routeKey === 'short' && bus.fromNTP) return 'dot-ntp';
  return 'dot-direct';
}

function getPillHTML(bus, routeKey) {
  if (routeKey === 'main' && bus.viaSunshine) {
    return `<span class="pill pill-via"><span class="dot dot-via"></span>Via Sunshine City</span>`;
  }
  if (routeKey === 'short' && bus.fromNTP) {
    return `<span class="pill pill-ntp"><span class="dot dot-ntp"></span>From New Town Plaza</span>`;
  }
  return `<span class="pill pill-direct"><span class="dot dot-direct"></span>Direct</span>`;
}

function getAnnotationText(bus, routeKey) {
  if (routeKey === 'main' && bus.viaSunshine) return 'Via Sunshine City';
  if (routeKey === 'short' && bus.fromNTP) return 'From NTP';
  return 'Direct';
}

// ─── Progress Bar ──────────────────────────────────────────────
// Shows how much time has passed between the previous bus and the next bus.
// When the bar is full (100%), the next bus departs.
function getProgressPercent(nextBus, routeKey) {
  const schedule = SCHEDULES[currentRoute][getDayType()];
  const now = getCurrentHKT();
  const nowSeconds = now.totalSeconds;
  const nextSeconds = timeToSeconds(nextBus.time);

  // Find the previous bus (the one before the next)
  let prevSeconds = null;
  for (let i = 0; i < schedule.length; i++) {
    const s = timeToSeconds(schedule[i].time);
    if (s >= nextSeconds) break;
    prevSeconds = s;
  }

  // If no previous bus (first bus of the day), use 30 min before as baseline
  if (prevSeconds === null) {
    prevSeconds = nextSeconds - 1800;
  }

  const totalWindow = nextSeconds - prevSeconds;
  const elapsed = nowSeconds - prevSeconds;

  if (totalWindow <= 0) return 100;
  return Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));
}

// ─── Main Render ───────────────────────────────────────────────
function render() {
  const nextBuses = getNextBuses(currentRoute, 3, directOnly);
  const remaining = getRemainingBuses(currentRoute, directOnly);
  const totalToday = getTotalBusesToday(currentRoute, directOnly);
  const routeInfo = getRouteInfo(currentRoute);

  updateTimeDisplay();

  // ── No buses left ──
  if (nextBuses.length === 0) {
    nextBusSection.style.display = 'none';
    comingUpSection.style.display = 'none';
    lastBusWarning.style.display = 'none';
    noBusesSection.style.display = 'block';
    firstBusTomorrowEl.textContent = `First bus tomorrow: ${getFirstBusTomorrow(currentRoute)}`;
    renderFullSchedule(remaining, totalToday);
    return;
  }

  noBusesSection.style.display = 'none';
  nextBusSection.style.display = 'block';

  // ── Warning banner ──
  if (remaining.length <= 3 && remaining.length > 0) {
    lastBusWarning.style.display = 'flex';
    lastBusWarning.innerHTML = `⚠️ Only ${remaining.length} bus${remaining.length === 1 ? '' : 'es'} left today`;
  } else {
    lastBusWarning.style.display = 'none';
  }

  // ── Hero card (next bus) ──
  const next = nextBuses[0];
  const progress = getProgressPercent(next, currentRoute);

  const nextEta = getEstimatedArrival(next, currentRoute);
  const nextTraffic = getTrafficAdjustment(next, currentRoute);
  const trafficStatus = getTrafficStatus();

  // Calculate traffic-adjusted arrival
  // Logic: base ETA (from your known times) + traffic delta from Google = actual ETA
  // The arrival time shown INCLUDES the traffic adjustment already
  let arrivalDisplay = `Arrive ~${nextEta.arrivalTime}`;
  let rideDuration = `${nextEta.durationMin} min`;
  let trafficBadge = '';
  if (nextTraffic) {
    // Adjust arrival time by traffic delta
    const [ah, am] = nextEta.arrivalTime.split(':').map(Number);
    const adjMin = ah * 60 + am + nextTraffic.deltaMinutes;
    const adjH = Math.floor(adjMin / 60) % 24;
    const adjM = adjMin % 60;
    const adjTime = `${String(adjH).padStart(2, '0')}:${String(adjM).padStart(2, '0')}`;
    arrivalDisplay = `Arrive ~${adjTime}`;
    const totalRide = nextEta.durationMin + nextTraffic.deltaMinutes;
    rideDuration = `${totalRide} min ride`;

    if (nextTraffic.deltaMinutes > 2) {
      trafficBadge = `<span class="traffic-badge traffic-slow">🔴 Heavy traffic +${nextTraffic.deltaMinutes} min</span>`;
    } else if (nextTraffic.deltaMinutes > 0) {
      trafficBadge = `<span class="traffic-badge traffic-slow">🟡 Slight delay +${nextTraffic.deltaMinutes} min</span>`;
    } else if (nextTraffic.deltaMinutes < -1) {
      trafficBadge = `<span class="traffic-badge traffic-fast">🟢 Light traffic, ${Math.abs(nextTraffic.deltaMinutes)} min faster</span>`;
    } else {
      trafficBadge = `<span class="traffic-badge traffic-normal">🟢 Normal traffic</span>`;
    }
  }

  nextBusCard.innerHTML = `
    <div class="hero-label">Next Bus ${trafficStatus.available ? `<span class="traffic-status"><span class="live-dot"></span>${trafficStatus.label}</span>` : ''}</div>
    <div class="hero-main">
      <span class="hero-time">${next.time}</span>
      <div class="hero-countdown-wrap">
        <span class="hero-countdown ${next.urgency}">${next.countdown}</span>
        <div class="hero-countdown-label">until departure</div>
      </div>
    </div>
    <div class="hero-progress">
      <div class="hero-progress-bar ${next.urgency}" style="width: ${progress}%"></div>
    </div>
    <div class="hero-footer">
      <div class="hero-annotation">
        ${getPillHTML(next, currentRoute)}
      </div>
      <span class="hero-eta">${arrivalDisplay} <span class="hero-eta-duration">(${rideDuration})</span></span>
    </div>
    ${trafficBadge ? `<div class="hero-traffic">${trafficBadge}</div>` : ''}
  `;

  // ── Update traffic map route (only when route changes, not every second) ──
  const mapRouteKey = `${currentRoute}_${next.viaSunshine || false}`;
  if (mapRouteKey !== lastMapRoute) {
    lastMapRoute = mapRouteKey;
    updateMapRoute(currentRoute, next.viaSunshine || false);
  }

  // ── Coming up list ──
  if (nextBuses.length > 1) {
    comingUpSection.style.display = 'block';
    comingUpList.innerHTML = nextBuses.slice(1).map(bus => {
      const eta = getEstimatedArrival(bus, currentRoute);
      const traffic = getTrafficAdjustment(bus, currentRoute);
      let arrTime = eta.arrivalTime;
      if (traffic) {
        const [ah, am] = eta.arrivalTime.split(':').map(Number);
        const adjMin = ah * 60 + am + traffic.deltaMinutes;
        const adjH = Math.floor(adjMin / 60) % 24;
        const adjM = adjMin % 60;
        arrTime = `${String(adjH).padStart(2, '0')}:${String(adjM).padStart(2, '0')}`;
      }
      return `
      <div class="upcoming-item">
        <div class="upcoming-dot-col">
          <span class="dot ${getDotClass(bus, currentRoute)}"></span>
        </div>
        <div class="upcoming-info">
          <div class="upcoming-time">${bus.time}</div>
          <div class="upcoming-annotation">${getAnnotationText(bus, currentRoute)} · Arrive ~${arrTime}</div>
        </div>
        <span class="upcoming-countdown ${bus.urgency}">${bus.countdown}</span>
      </div>
    `;
    }).join('');
  } else {
    comingUpSection.style.display = 'none';
  }

  // ── Full schedule ──
  renderFullSchedule(remaining, totalToday);
}

function renderFullSchedule(remaining, totalToday) {
  const schedule = SCHEDULES[currentRoute][getDayType()];
  const now = getCurrentHKT();
  const nowSeconds = now.totalSeconds;

  remainingCountEl.textContent = `${remaining.length} of ${totalToday}`;

  fullScheduleList.innerHTML = schedule.map(entry => {
    const entrySeconds = timeToSeconds(entry.time);
    const isPast = entrySeconds < nowSeconds - 60;
    const secondsUntil = entrySeconds - nowSeconds;
    const isNext = !isPast && remaining.length > 0 && entry.time === remaining[0].time;

    const dotClass = currentRoute === 'main' && entry.viaSunshine
      ? 'dot-via'
      : currentRoute === 'short' && entry.fromNTP
      ? 'dot-ntp'
      : 'dot-direct';

    const isIndirect = (currentRoute === 'main' && entry.viaSunshine) ||
                       (currentRoute === 'short' && entry.fromNTP);
    const isFiltered = directOnly && isIndirect && !isPast;

    const annotationText = currentRoute === 'main' && entry.viaSunshine
      ? 'Via Sunshine City'
      : currentRoute === 'short' && entry.fromNTP
      ? 'From NTP'
      : '';

    const countdown = isPast
      ? ''
      : formatCountdown(Math.max(0, secondsUntil));

    return `
      <div class="fs-item ${isPast ? 'past' : ''} ${isNext ? 'next' : ''} ${isFiltered ? 'filtered' : ''}">
        <span class="fs-time">${entry.time}</span>
        <span class="fs-dot"><span class="dot ${dotClass}"></span></span>
        <span class="fs-annotation">${annotationText}</span>
        <span class="fs-countdown">${countdown}</span>
      </div>
    `;
  }).join('');
}

// ─── Update Loop ───────────────────────────────────────────────
function startUpdating() {
  // Initial render
  updateDateDisplay();
  render();

  // Update every second
  updateInterval = setInterval(() => {
    updateTimeDisplay();
    render();
  }, 1000);

  // Update date at midnight HKT
  let lastDate = getHKTDateString();
  setInterval(() => {
    const newDate = getHKTDateString();
    if (newDate !== lastDate) {
      lastDate = newDate;
      updateDateDisplay();
    }
  }, 60000);
}

// ─── Initialize ────────────────────────────────────────────────
startUpdating();
startTrafficPolling();
setupTrafficMap();

// ─── Visibility API ────────────────────────────────────────────
// When the user switches away and comes back, force a re-render
// to make sure countdowns are fresh (setInterval can be throttled
// by the browser when the tab is in the background).
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateDateDisplay();
    render();
  }
});
