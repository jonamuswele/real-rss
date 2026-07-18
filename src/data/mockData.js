// NIHSA Hydrological System Mock Data

// ── River Stations (Water Level & Debit) ──────────────────────────────────
// Locations roughly mapped to coordinates within Nigeria (scale: Lat 4 to 14, Lng 3 to 15)
export const INITIAL_STATIONS = [];

// ── Boreholes (Water Level & Contamination) ───────────────────────────────
export const INITIAL_BOREHOLES = [];

// ── Anomaly Logs & History ────────────────────────────────────────────────
export const INITIAL_ANOMALIES = [];

// Weather Forecast for Dashboard
export const WEATHER_FORECAST = [
  { day: "Lokoja", temp: 31, condition: "Thunderstorms", icon: "⛈️", rainProb: 85 },
  { day: "Abuja", temp: 29, condition: "Scattered Rain", icon: "🌦️", rainProb: 60 },
  { day: "Lagos", temp: 28, condition: "Heavy Showers", icon: "🌧️", rainProb: 90 },
  { day: "Kano", temp: 35, condition: "Sunny/Dusty", icon: "☀️", rainProb: 10 },
  { day: "Port Harcourt", temp: 27, condition: "Heavy Rain", icon: "🌧️", rainProb: 95 },
  { day: "Maiduguri", temp: 37, condition: "Hot & Dry", icon: "☀️", rainProb: 5 },
];
