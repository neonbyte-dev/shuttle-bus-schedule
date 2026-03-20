// Traffic Map — Google Maps with traffic layer and route polyline
//
// Shows an interactive map with:
//   1. Traffic layer (red/yellow/green congestion overlay)
//   2. Route polyline for the currently selected route
//   3. Markers for departure and arrival stops
//
// The map only initializes when the user expands the "Traffic Map" section.
// This saves API quota and bandwidth.

import { getRoutePolyline, getTrafficStatus } from './traffic.js';

const API_KEY = 'AIzaSyClaYayXrmTg4RuhJx0lxFblJHIgx31JwE';

// Stop coordinates
// Coordinates verified against Google Maps directions link
const STOPS = {
  ntp: { lat: 22.3818, lng: 114.1886, label: 'New Town Plaza' },
  sunshine: { lat: 22.4245, lng: 114.2321, label: 'Sunshine City' },
  symphonyBay: { lat: 22.4293, lng: 114.2519, label: 'Symphony Bay' },
};

// Map center (between all stops)
const MAP_CENTER = { lat: 22.406, lng: 114.215 };

let map = null;
let trafficLayer = null;
let routePolyline = null;
let markers = [];
let mapInitialized = false;

/**
 * Decode a Google encoded polyline string into an array of {lat, lng}
 */
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

/**
 * Initialize the Google Map (called once when map section is first opened)
 */
function initMap() {
  if (mapInitialized || !window.google?.maps) return;

  const mapEl = document.getElementById('traffic-map');
  if (!mapEl) return;

  // Dark map style — makes traffic colors (red/yellow/green) pop
  const DARK_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
    { featureType: 'land', elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
  ];

  map = new google.maps.Map(mapEl, {
    center: MAP_CENTER,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    styles: DARK_STYLE,
  });

  // Add traffic layer — shows real-time congestion colors
  // On a dark map, the green/yellow/red lines are much more visible
  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  mapInitialized = true;

  // Draw the current route if traffic data is available
  updateMapRoute();
}

/**
 * Clear existing route and markers from the map
 */
function clearRoute() {
  if (routePolyline) {
    routePolyline.setMap(null);
    routePolyline = null;
  }
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}

/**
 * Add a marker to the map
 */
function addMarker(position, title, color) {
  const marker = new google.maps.Marker({
    position,
    map,
    title,
  });
  markers.push(marker);
  return marker;
}

/**
 * Update the route displayed on the map based on current route selection
 */
export function updateMapRoute(routeKey = 'main', viaSunshine = false) {
  if (!mapInitialized || !map) return;

  clearRoute();

  // Get polyline from traffic data
  const encoded = getRoutePolyline(routeKey, viaSunshine);

  if (encoded) {
    const path = decodePolyline(encoded);

    // Outer glow line (wider, semi-transparent)
    const glowLine = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#60a5fa',
      strokeOpacity: 0.3,
      strokeWeight: 12,
    });
    glowLine.setMap(map);
    markers.push(glowLine); // track for cleanup

    // Main route line
    routePolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 1,
      strokeWeight: 5,
    });
    routePolyline.setMap(map);

    // Fit map to route bounds
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, { top: 20, bottom: 20, left: 20, right: 20 });
  }

  // Add simple pin markers at departure and arrival
  const isMainRoute = routeKey === 'main' || routeKey === 'mainReturn';
  const isReturn = routeKey === 'mainReturn' || routeKey === 'shortReturn';

  if (isMainRoute) {
    addMarker(isReturn ? STOPS.symphonyBay : STOPS.ntp, isReturn ? 'Symphony Bay' : 'New Town Plaza');
    if (viaSunshine) {
      addMarker(STOPS.sunshine, 'Sunshine City');
    }
    addMarker(isReturn ? STOPS.ntp : STOPS.symphonyBay, isReturn ? 'New Town Plaza' : 'Symphony Bay');
  } else {
    addMarker(isReturn ? STOPS.symphonyBay : STOPS.sunshine, isReturn ? 'Symphony Bay' : 'Sunshine City');
    addMarker(isReturn ? STOPS.sunshine : STOPS.symphonyBay, isReturn ? 'Sunshine City' : 'Symphony Bay');
  }

  // Update status text
  const statusEl = document.getElementById('traffic-map-status');
  const status = getTrafficStatus();
  if (statusEl && status.available) {
    statusEl.innerHTML = `<span class="live-dot"></span>${status.label}`;
  }
}

/**
 * Set up the map — poll for Google Maps API readiness then init.
 * This avoids race conditions with the async script callback.
 */
export function setupTrafficMap() {
  function tryInit() {
    if (window.google?.maps) {
      initMap();
    } else {
      // Google Maps not loaded yet — retry in 500ms
      setTimeout(tryInit, 500);
    }
  }
  // Start trying after a short delay (let DOM render)
  setTimeout(tryInit, 300);
}

// Global callback — still set it as a fallback for the script tag
window.initTrafficMap = function () {
  // noop — setupTrafficMap handles init via polling
};
