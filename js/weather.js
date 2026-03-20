// Weather Module — Hong Kong Observatory API (free, no key needed)
//
// Fetches current conditions + rain forecast for the commute.
// API docs: https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation.pdf
//
// Polls every 30 minutes (weather doesn't change by the second).
// Graceful fallback — if API fails, weather section just hides.

const HKO_CURRENT = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en';
const HKO_FORECAST = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en';
const HKO_WARNING = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warningInfo&lang=en';

const POLL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let weatherData = null;
let pollTimer = null;

// Weather icon mapping (HKO icon codes → emoji)
const WEATHER_ICONS = {
  50: '☀️', 51: '☀️', 52: '🌤️', 53: '🌤️', 54: '🌥️',
  60: '🌧️', 61: '🌧️', 62: '🌧️', 63: '⛈️', 64: '⛈️',
  65: '🌩️', 70: '🌤️', 71: '🌤️', 72: '🌤️', 73: '🌤️',
  74: '🌤️', 75: '🌤️', 76: '🌥️', 77: '🌥️', 80: '🌫️',
  81: '🌫️', 82: '🌫️', 83: '💨', 84: '💨', 85: '❄️',
  90: '🔥', 91: '🔥', 92: '🌞', 93: '🌞',
};

// Simple fallback based on description keywords
function getWeatherEmoji(iconCode, description) {
  if (WEATHER_ICONS[iconCode]) return WEATHER_ICONS[iconCode];
  const desc = (description || '').toLowerCase();
  if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
  if (desc.includes('thunder')) return '⛈️';
  if (desc.includes('cloud')) return '🌥️';
  if (desc.includes('sun') || desc.includes('fine')) return '☀️';
  if (desc.includes('haze') || desc.includes('fog')) return '🌫️';
  return '🌤️';
}

async function fetchWeather() {
  try {
    // Fetch current conditions and forecast in parallel
    const [currentRes, forecastRes, warningRes] = await Promise.all([
      fetch(HKO_CURRENT).then(r => r.json()).catch(() => null),
      fetch(HKO_FORECAST).then(r => r.json()).catch(() => null),
      fetch(HKO_WARNING).then(r => r.json()).catch(() => null),
    ]);

    if (!currentRes) return null;

    // Current temperature — find Sha Tin or use average
    let temp = null;
    if (currentRes.temperature?.data) {
      const shaTin = currentRes.temperature.data.find(s =>
        s.place === 'Sha Tin' || s.place === 'Sai Kung'
      );
      temp = shaTin ? shaTin.value : currentRes.temperature.data[0]?.value;
    }

    // Current humidity
    let humidity = null;
    if (currentRes.humidity?.data) {
      humidity = currentRes.humidity.data[0]?.value;
    }

    // Rainfall — check if it's raining now
    let isRaining = false;
    let rainfallMm = 0;
    if (currentRes.rainfall?.data) {
      const local = currentRes.rainfall.data.find(s =>
        s.place === 'Sha Tin' || s.place === 'Sai Kung' || s.place === 'Tai Po'
      );
      if (local && local.max > 0) {
        isRaining = true;
        rainfallMm = local.max;
      }
    }

    // Current weather icon + description
    let iconCode = currentRes.icon?.[0];
    let description = currentRes.iconString || '';

    // Forecast — today and tomorrow
    let todayForecast = null;
    let tomorrowForecast = null;
    let rainChance = null;
    if (forecastRes?.weatherForecast) {
      todayForecast = forecastRes.weatherForecast[0];
      tomorrowForecast = forecastRes.weatherForecast[1];
      // PSR = probability of significant rain
      if (todayForecast?.PSR) {
        rainChance = todayForecast.PSR;
      }
    }

    // Warnings (typhoon, rainstorm, etc.)
    let activeWarnings = [];
    if (warningRes?.details) {
      activeWarnings = warningRes.details.map(w => w.warningStatementCode || w.subtype || 'Warning');
    }

    // Determine if user needs umbrella
    const needsUmbrella = isRaining ||
      rainChance === 'High' ||
      rainChance === 'Medium High' ||
      (description && description.toLowerCase().includes('rain'));

    const emoji = getWeatherEmoji(iconCode, description);

    weatherData = {
      temp,
      humidity,
      description,
      emoji,
      isRaining,
      rainfallMm,
      rainChance,
      needsUmbrella,
      activeWarnings,
      todayForecast,
      tomorrowForecast,
      fetchedAt: Date.now(),
    };

    return weatherData;
  } catch (err) {
    console.error('Weather fetch failed:', err.message);
    return null;
  }
}

// ─── Public API ────────────────────────────────────────────────

export function getWeather() {
  return weatherData;
}

export function startWeatherPolling() {
  // Initial fetch
  fetchWeather().then(() => renderWeather());

  // Poll every 30 min
  pollTimer = setInterval(() => {
    if (!document.hidden) {
      fetchWeather().then(() => renderWeather());
    }
  }, POLL_INTERVAL_MS);

  // Re-fetch when tab becomes visible if stale
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && weatherData && Date.now() - weatherData.fetchedAt > POLL_INTERVAL_MS) {
      fetchWeather().then(() => renderWeather());
    }
  });
}

function renderWeather() {
  const el = document.getElementById('weather-card');
  if (!el || !weatherData) {
    if (el) el.style.display = 'none';
    return;
  }

  el.style.display = 'block';

  const { temp, humidity, description, emoji, isRaining, rainChance, needsUmbrella, activeWarnings } = weatherData;

  // Warning banner
  let warningHTML = '';
  if (activeWarnings.length > 0) {
    warningHTML = `<div class="weather-warning">⚠️ ${activeWarnings.join(', ')}</div>`;
  }

  // Action recommendation based on conditions
  let actionHTML = '';
  if (isRaining) {
    actionHTML = `<div class="weather-action action-rain">☔ Bring umbrella & raincoat</div>`;
  } else if (needsUmbrella) {
    actionHTML = `<div class="weather-action action-rain">🌂 Bring umbrella — rain expected</div>`;
  } else if (rainChance && rainChance !== 'Low') {
    actionHTML = `<div class="weather-action action-maybe">🌂 Pack umbrella just in case</div>`;
  } else if (temp !== null && temp >= 33) {
    actionHTML = `<div class="weather-action action-hot">🥵 Very hot — stay hydrated, bring water</div>`;
  } else if (temp !== null && temp >= 30) {
    actionHTML = `<div class="weather-action action-warm">☀️ Hot day — sunscreen & water</div>`;
  } else if (temp !== null && temp <= 15) {
    actionHTML = `<div class="weather-action action-cold">🧥 Bring a jacket — it's cold</div>`;
  } else if (temp !== null && temp <= 20) {
    actionHTML = `<div class="weather-action action-cool">🧥 Light jacket recommended</div>`;
  } else {
    actionHTML = `<div class="weather-action action-good">👍 Good conditions for commute</div>`;
  }

  el.innerHTML = `
    ${warningHTML}
    <div class="weather-main">
      <span class="weather-emoji">${emoji}</span>
      <div class="weather-info">
        <div class="weather-temp">${temp !== null ? temp + '°C' : '--'}</div>
        <div class="weather-desc">${description}${humidity ? ` · ${humidity}%` : ''}</div>
      </div>
    </div>
    ${actionHTML}
  `;
}
