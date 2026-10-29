// Citybus 580 — live arrival times from the HK government open-data feed
//
// Route 580 runs Sai Sha Residences <-> Sha Tin Central (next to New Town Plaza)
// and stops at Symphony Bay on Sai Sha Road. It is a public bus, so unlike the
// shuttle it has no fixed timetable here — we ask Citybus for the next arrivals.
//
// Feed: https://rt.data.gov.hk/v2/transport/citybus/eta/CTB/{stop}/580
// Free, no key, and it allows calls straight from the browser.

const ETA_URL = 'https://rt.data.gov.hk/v2/transport/citybus/eta/CTB';
const ROUTE = '580';

// Which stop to read depends on the direction toggle
const STOPS = {
  out:  { stop: '003457', dir: 'O', from: 'Symphony Bay', to: 'Sha Tin Central (NTP)' },
  home: { stop: '002046', dir: 'I', from: 'Sha Tin Central (NTP)', to: 'Symphony Bay' },
};

const FETCH_EVERY_MS = 30000;  // the feed itself updates about once a minute
const REDRAW_EVERY_MS = 15000; // keep "x min" fresh between fetches

let getDirection = () => 'home';
let etas = [];          // [{ time: Date, remark: string }]
let lastDirection = null;
let lastFetchOk = null; // null = not fetched yet, true/false after
let fetchTimer = null;

const listEl = () => document.getElementById('bus580-list');
const subEl = () => document.getElementById('bus580-sub');

async function fetchEtas() {
  const direction = getDirection();
  const cfg = STOPS[direction] || STOPS.home;
  lastDirection = direction;
  try {
    const res = await fetch(`${ETA_URL}/${cfg.stop}/${ROUTE}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Direction changed while we were waiting — that answer is for the other stop
    if (direction !== getDirection()) return;
    etas = (json.data || [])
      .filter(e => e.dir === cfg.dir)
      .map(e => ({ time: e.eta ? new Date(e.eta) : null, remark: e.rmk_en || '' }))
      .filter(e => e.time || e.remark);
    lastFetchOk = true;
  } catch (err) {
    console.warn('580 ETA fetch failed:', err);
    lastFetchOk = false;
  }
  draw();
}

function draw() {
  const list = listEl();
  if (!list) return;
  const cfg = STOPS[getDirection()] || STOPS.home;
  subEl().textContent = `${cfg.from} → ${cfg.to}`;

  if (lastFetchOk === null) {
    list.innerHTML = '<div class="bus580-empty">Loading live times…</div>';
    return;
  }

  const now = Date.now();
  const upcoming = etas.filter(e => !e.time || e.time.getTime() > now - 60000);

  if (upcoming.length === 0) {
    list.innerHTML = lastFetchOk
      ? '<div class="bus580-empty">No 580 due right now</div>'
      : '<div class="bus580-empty">Live times unavailable — check connection</div>';
    return;
  }

  list.innerHTML = upcoming.map(e => {
    if (!e.time) {
      return `<div class="upcoming-item"><div class="upcoming-info">
        <div class="upcoming-annotation">${e.remark}</div></div></div>`;
    }
    const mins = Math.max(0, Math.round((e.time.getTime() - now) / 60000));
    const clock = e.time.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Hong_Kong',
    });
    const label = mins <= 0 ? 'Arriving' : `${mins} min`;
    const cls = mins <= 2 ? 'urgent' : mins <= 5 ? 'warning' : '';
    return `<div class="upcoming-item">
      <div class="upcoming-dot-col"><span class="bus580-dot"></span></div>
      <div class="upcoming-info">
        <div class="upcoming-time">${clock}</div>
        ${e.remark ? `<div class="upcoming-annotation">${e.remark}</div>` : ''}
      </div>
      <div class="upcoming-countdown ${cls}">${label}</div>
    </div>`;
  }).join('');
}

// Call when the direction toggle changes, so the card switches stop at once
export function refresh580() {
  if (getDirection() !== lastDirection) {
    etas = [];
    lastFetchOk = null;
    draw();
    fetchEtas();
  }
}

export function start580(directionGetter) {
  getDirection = directionGetter;
  draw();
  fetchEtas();
  fetchTimer = setInterval(fetchEtas, FETCH_EVERY_MS);
  setInterval(draw, REDRAW_EVERY_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchEtas();
  });
}
