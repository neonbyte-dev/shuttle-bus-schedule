// Service Worker — enables offline use and PWA installability
//
// Strategy: Cache-first. The shuttle schedule rarely changes (maybe once a year),
// so we cache everything aggressively. When the app loads, it serves from cache
// instantly. To push updates, bump the CACHE_VERSION number below.

const CACHE_VERSION = 'shuttle-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/schedule-data.js',
  './js/schedule-engine.js',
  './js/holidays.js',
  './js/traffic.js',
  './js/traffic-map.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

// ─── Install: cache all assets ─────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: delete old caches ───────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: serve from cache, fall back to network ─────────────
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
