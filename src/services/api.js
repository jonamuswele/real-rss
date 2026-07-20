// Get API URL from environment variable, fallback to localhost if missing or invalid
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl === "undefined" || envUrl === "null") {
    // In local development, fallback to FastAPI backend on port 8000
    return "http://localhost:8000";
  }
  return envUrl.replace(/\/+$/, "");
};

const BASE_URL = getBaseUrl();

/**
 * API service to communicate with the FastAPI river monitor backend.
 */
export const api = {
  /**
   * Fetch all stations from the database.
   */
  async getStations() {
    const res = await fetch(`${BASE_URL}/api/stations`);
    if (!res.ok) {
      throw new Error(`Failed to fetch stations: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Update the location of a specific station.
   * @param {string} nodeId
   * @param {string} location
   */
  async updateStationLocation(nodeId, location) {
    const res = await fetch(`${BASE_URL}/api/stations/${nodeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update station location: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch the latest readings for all stations.
   */
  async getLatestReadings() {
    const res = await fetch(`${BASE_URL}/api/readings/latest`);
    if (!res.ok) {
      throw new Error(`Failed to fetch latest readings: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch reading history for a specific station.
   * @param {string} nodeId
   * @param {number} limit
   */
  async getReadingsForStation(nodeId, limit = 100) {
    const res = await fetch(`${BASE_URL}/api/readings/${nodeId}?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch readings for station ${nodeId}: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Ingest a new water level reading (used by telemetry simulators or during seeding).
   * @param {Object} data - { node_id: string, level_cm: number, recorded_at: string }
   */
  async ingestReading(data) {
    const res = await fetch(`${BASE_URL}/api/water-level`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to ingest reading: ${res.statusText}`);
    }
    return res.json();
  },
};
