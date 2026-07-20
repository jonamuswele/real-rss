import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import WaterLevel from "./pages/WaterLevel";
import Boreholes from "./pages/Boreholes";
import Anomalies from "./pages/Anomalies";
import ExportData from "./pages/ExportData";
import { api } from "./services/api";

// Initial mock data
import {
  INITIAL_STATIONS,
  INITIAL_BOREHOLES,
  INITIAL_ANOMALIES
} from "./data/mockData";

export default function App() {
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [boreholes, setBoreholes] = useState(INITIAL_BOREHOLES);
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);

  // Drawer state management
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Helper to fetch and merge data from the backend
  const fetchAndMergeData = async () => {
    try {
      const apiStations = await api.getStations();
      
      // Fetch the latest readings for current levels
      const latestReadings = await api.getLatestReadings();

      // Build stations list entirely from backend database
      const loadedStations = apiStations.map((as) => {
        let metadata = {};
        try {
          metadata = JSON.parse(as.location);
        } catch (e) {
          // Fallback if the database has a plain text location (not JSON)
          metadata = {
            name: as.node_id,
            location: (as.location && as.location !== "NIHSA") ? as.location : "Central Nigeria",
            lat: 9.0765,
            lng: 7.3986,
          };
        }

        const latestReading = latestReadings.find((lr) => lr.node_id === as.node_id);
        const currentLevel = latestReading ? parseFloat(latestReading.level_cm.toFixed(2)) : 0;
        
        // Scale debit only if debit threshold is configured
        const minLevel = metadata.minLevelThreshold !== undefined && metadata.minLevelThreshold !== null && metadata.minLevelThreshold !== "" ? parseFloat(metadata.minLevelThreshold) : null;
        const maxLevel = metadata.maxLevelThreshold ? parseFloat(metadata.maxLevelThreshold) : null;
        const maxDebit = metadata.maxDebitThreshold ? parseFloat(metadata.maxDebitThreshold) : null;
        const currentDebit = maxDebit ? Math.round(currentLevel * 300) : null;

        // Re-evaluate safety status dynamically
        const isWarning = (maxLevel && currentLevel >= maxLevel) || (minLevel !== null && currentLevel <= minLevel) || (maxDebit && currentDebit >= maxDebit);

        return {
          id: as.node_id,
          name: metadata.name || as.node_id,
          river: metadata.river || "River Basin",
          location: metadata.location || ((as.location && as.location !== "NIHSA") ? as.location : "Central Nigeria"),
          lat: metadata.lat ? parseFloat(metadata.lat) : 9.0765, // Center of Nigeria
          lng: metadata.lng ? parseFloat(metadata.lng) : 7.3986, // Center of Nigeria
          minLevelThreshold: minLevel,
          maxLevelThreshold: maxLevel,
          maxDebitThreshold: maxDebit,
          currentLevel,
          currentDebit,
          status: isWarning ? "warning" : "normal",
          lastSeen: as.last_seen || (latestReading ? latestReading.recorded_at : null),
          history: [] // dynamically loaded when selected
        };
      });

      setStations(loadedStations);
    } catch (err) {
      console.error("Error fetching or seeding data from backend:", err);
    }
  };

  // Sync data on mount and poll every 10 seconds
  useEffect(() => {
    fetchAndMergeData();
    const interval = setInterval(fetchAndMergeData, 10000);
    return () => clearInterval(interval);
  }, [anomalies]);

  // Auto-close detail drawer on routing page changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Helper to open details drawer for stations
  const handleSelectStation = async (station) => {
    setSelectedItem({ ...station, type: "station", isLoadingHistory: true });
    setIsDrawerOpen(true);
    try {
      const readings = await api.getReadingsForStation(station.id);

      // Map readings directly from database
      const history = readings.map((r) => {
        const date = new Date(r.recorded_at);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const fullTime = date.toLocaleString([], { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const level = parseFloat(r.level_cm.toFixed(2));
        const debit = station.maxDebitThreshold ? Math.round(level * 300) : null;
        return {
          time,
          fullTime,
          level,
          debit
        };
      }).reverse(); // Recharts expects chronological order (left to right)

      setSelectedItem((prev) => {
        if (prev && prev.id === station.id) {
          return {
            ...prev,
            history,
            isLoadingHistory: false
          };
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to load historical readings for station:", err);
      setSelectedItem((prev) => {
        if (prev && prev.id === station.id) {
          return {
            ...prev,
            isLoadingHistory: false
          };
        }
        return prev;
      });
    }
  };

  // Helper to open details drawer for boreholes
  const handleSelectBorehole = (borehole) => {
    setSelectedItem({ ...borehole, type: "borehole" });
    setIsDrawerOpen(true);
  };

  // Handler to update name, coordinates, and thresholds of a specific station
  const handleUpdateStationDetails = async (stationId, updatedFields) => {
    // Find the current station to merge fields
    const current = stations.find((st) => st.id === stationId);
    if (!current) return;

    const merged = {
      name: updatedFields.name !== undefined ? updatedFields.name : current.name,
      river: updatedFields.river !== undefined ? updatedFields.river : current.river,
      location: updatedFields.location !== undefined ? updatedFields.location : current.location,
      lat: updatedFields.lat !== undefined ? updatedFields.lat : current.lat,
      lng: updatedFields.lng !== undefined ? updatedFields.lng : current.lng,
      minLevelThreshold: updatedFields.minLevelThreshold !== undefined ? updatedFields.minLevelThreshold : current.minLevelThreshold,
      maxLevelThreshold: updatedFields.maxLevelThreshold !== undefined ? updatedFields.maxLevelThreshold : current.maxLevelThreshold,
      maxDebitThreshold: updatedFields.maxDebitThreshold !== undefined ? updatedFields.maxDebitThreshold : current.maxDebitThreshold,
    };

    try {
      // Save serialized object in backend location field
      await api.updateStationLocation(stationId, JSON.stringify(merged));
    } catch (err) {
      console.error(`Failed to update station ${stationId} metadata on backend:`, err);
    }

    setStations((prevStations) =>
      prevStations.map((st) => {
        if (st.id === stationId) {
          const updatedStation = {
            ...st,
            ...updatedFields
          };

          const isWarning =
            updatedStation.currentLevel >= updatedStation.maxLevelThreshold ||
            updatedStation.currentDebit >= updatedStation.maxDebitThreshold;

          // Check if there's any active anomaly for this station
          const hasActiveAnomaly = activeAnomalies.some(
            (a) => a.sourceId === stationId && a.status === "active"
          );

          if (isWarning) {
            updatedStation.status = "warning";
          } else if (hasActiveAnomaly) {
            updatedStation.status = "anomaly";
          } else {
            updatedStation.status = "normal";
          }

          // Sync the updated item inside the open drawer
          setSelectedItem({ ...updatedStation, type: "station" });
          return updatedStation;
        }
        return st;
      })
    );
  };

  // Handler to mark an active anomaly as resolved
  const handleResolveAnomaly = (anomalyId) => {
    setAnomalies((prevAnomalies) => {
      const updatedAnomalies = prevAnomalies.map((a) =>
        a.id === anomalyId ? { ...a, status: "resolved" } : a
      );

      // If resolved anomaly belongs to a station, check if we should clear its anomaly status
      const anomaly = prevAnomalies.find((a) => a.id === anomalyId);
      if (anomaly && anomaly.sourceType === "station") {
        const stationId = anomaly.sourceId;
        const stillHasActiveAnomalies = updatedAnomalies.some(
          (a) => a.sourceId === stationId && a.status === "active"
        );

        if (!stillHasActiveAnomalies) {
          setStations((prevStations) =>
            prevStations.map((st) => {
              if (st.id === stationId) {
                // Evaluate if it should be normal or warning based on thresholds
                const isWarning =
                  st.currentLevel >= st.maxLevelThreshold ||
                  st.currentDebit >= st.maxDebitThreshold;

                return {
                  ...st,
                  status: isWarning ? "warning" : "normal"
                };
              }
              return st;
            })
          );
        }
      }

      // Similarly for boreholes
      if (anomaly && anomaly.sourceType === "borehole") {
        const boreholeId = anomaly.sourceId;
        const stillHasActiveAnomalies = updatedAnomalies.some(
          (a) => a.sourceId === boreholeId && a.status === "active"
        );

        if (!stillHasActiveAnomalies) {
          setBoreholes((prevBoreholes) =>
            prevBoreholes.map((bh) => {
              if (bh.id === boreholeId) {
                return {
                  ...bh,
                  status: bh.contamination > 300 ? "contaminated" : bh.contamination > 150 ? "marginal" : "safe"
                };
              }
              return bh;
            })
          );
        }
      }

      return updatedAnomalies;
    });
  };

  // Count active warnings and anomalies for sidebar notification badges
  const warningCount = stations.filter(
    (st) =>
      st.currentLevel >= st.maxLevelThreshold ||
      st.currentDebit >= st.maxDebitThreshold
  ).length;

  // Dynamically generate anomalies from station warning thresholds & 24-hour timeout
  const activeAnomalies = stations.flatMap((st) => {
    const list = [];
    const now = new Date();

    // 1. High Water Level Exceeded
    if (st.maxLevelThreshold && st.currentLevel >= st.maxLevelThreshold) {
      list.push({
        id: `ANOM_MAX_${st.id}`,
        type: "Critical High Water Level",
        cause: "Water level exceeded maximum flood safety threshold",
        sourceType: "station",
        sourceId: st.id,
        sourceName: st.name,
        description: `Water level has reached ${st.currentLevel}m, exceeding maximum limit of ${st.maxLevelThreshold}m.`,
        detectedAt: st.lastSeen ? new Date(st.lastSeen).toLocaleString() : new Date().toLocaleString(),
        status: "active",
      });
    }

    // 2. Low Water Level Below Minimum Limit
    if (st.minLevelThreshold !== null && st.minLevelThreshold !== undefined && st.currentLevel <= st.minLevelThreshold) {
      list.push({
        id: `ANOM_MIN_${st.id}`,
        type: "Low Water Level Anomaly",
        cause: "Water level dropped below minimum dry-bed threshold",
        sourceType: "station",
        sourceId: st.id,
        sourceName: st.name,
        description: `Water level has dropped to ${st.currentLevel}m, below minimum limit of ${st.minLevelThreshold}m.`,
        detectedAt: st.lastSeen ? new Date(st.lastSeen).toLocaleString() : new Date().toLocaleString(),
        status: "active",
      });
    }

    // 3. High Volumetric Flow Rate
    if (st.maxDebitThreshold && st.currentDebit >= st.maxDebitThreshold) {
      list.push({
        id: `ANOM_DEBIT_${st.id}`,
        type: "High Volumetric Flow",
        cause: "Volumetric discharge rate exceeded safety limit",
        sourceType: "station",
        sourceId: st.id,
        sourceName: st.name,
        description: `Volumetric flow rate reached ${st.currentDebit} m³/s, exceeding threshold of ${st.maxDebitThreshold} m³/s.`,
        detectedAt: st.lastSeen ? new Date(st.lastSeen).toLocaleString() : new Date().toLocaleString(),
        status: "active",
      });
    }

    // 4. Sensor Offline / 1-Day Telemetry Timeout (No transmission for 24+ hours)
    if (st.lastSeen) {
      const lastSeenDate = new Date(st.lastSeen);
      const hoursDiff = (now - lastSeenDate) / (1000 * 60 * 60);
      if (hoursDiff >= 24) {
        list.push({
          id: `ANOM_TIMEOUT_${st.id}`,
          type: "Telemetry Timeout / Offline",
          cause: "No data transmitted by station sensor for over 24 hours (1 day)",
          sourceType: "station",
          sourceId: st.id,
          sourceName: st.name,
          description: `No telemetry signal received from ${st.name} since ${lastSeenDate.toLocaleString()} (${Math.floor(hoursDiff)} hours offline).`,
          detectedAt: lastSeenDate.toLocaleString(),
          status: "active",
        });
      }
    }

    return list;
  });

  const activeAnomalyCount = activeAnomalies.length;

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        warningCount={warningCount}
        anomalyCount={activeAnomalyCount}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
      />

      {/* Main Panel */}
      <div className={`main-content ${isSidebarMinimized ? "ml-sidebar-min" : "ml-sidebar-full"}`}>
        {/* Top Header Strip */}
        <header className="top-bar">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Nigeria Hydrological Services Agency (NIHSA)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Telemetry Feed Connected</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main className="page-content animate-fade-in">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  stations={stations}
                  boreholes={boreholes}
                  anomalies={activeAnomalies}
                  onSelectStation={handleSelectStation}
                  onSelectBorehole={handleSelectBorehole}
                />
              }
            />
            <Route
              path="/water-levels"
              element={
                <WaterLevel
                  stations={stations}
                  anomalies={activeAnomalies}
                  onSelectStation={handleSelectStation}
                />
              }
            />
            <Route
              path="/boreholes"
              element={
                <Boreholes
                  boreholes={boreholes}
                  onSelectBorehole={handleSelectBorehole}
                />
              }
            />
            <Route
              path="/anomalies"
              element={
                <Anomalies
                  anomalies={activeAnomalies}
                  stations={stations}
                  boreholes={boreholes}
                  onResolveAnomaly={handleResolveAnomaly}
                />
              }
            />
            <Route
              path="/export"
              element={<ExportData stations={stations} />}
            />
          </Routes>
        </main>
      </div>

      {/* Side Slide-out Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItem}
        onUpdateThresholds={handleUpdateStationDetails}
      />
    </div>
  );
}
