import React, { useState, useEffect } from "react";
import {
  X,
  Waves,
  Hammer,
  AlertTriangle,
  Sliders,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Droplet
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

export default function Drawer({ isOpen, onClose, item, onUpdateThresholds }) {
  const [stationName, setStationName] = useState("");
  const [stationLocation, setStationLocation] = useState("");
  const [latCoord, setLatCoord] = useState("");
  const [lngCoord, setLngCoord] = useState("");
  const [levelThreshold, setLevelThreshold] = useState("");
  const [debitThreshold, setDebitThreshold] = useState("");

  // Sync state when item changes
  useEffect(() => {
    if (item) {
      setStationName(item.name || "");
      setStationLocation(item.location || "");
      setLatCoord(item.lat || "");
      setLngCoord(item.lng || "");
      if (item.type === "station") {
        setLevelThreshold(item.maxLevelThreshold || "");
        setDebitThreshold(item.maxDebitThreshold || "");
      }
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleDetailsSave = (e) => {
    e.preventDefault();
    if (item.type === "station" && onUpdateThresholds) {
      onUpdateThresholds(item.id, {
        name: stationName,
        location: stationLocation,
        lat: parseFloat(latCoord),
        lng: parseFloat(lngCoord),
        maxLevelThreshold: parseFloat(levelThreshold),
        maxDebitThreshold: parseFloat(debitThreshold)
      });
    }
  };

  const isStation = item.type === "station";
  
  // Warning turns RED, Anomaly turns YELLOW, Normal turns GREEN
  const isWarning = item.status === "warning" || (isStation && (item.currentLevel >= item.maxLevelThreshold || item.currentDebit >= item.maxDebitThreshold)) || (item.type === "borehole" && item.status === "contaminated");
  const isAnomaly = item.status === "anomaly" || (item.type === "borehole" && item.status === "marginal");

  const statusColor = isWarning
    ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
    : isAnomaly
    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";

  return (
    <>
      {/* Blurred Backdrop — blurs the page behind the drawer */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer Panel — isolation: isolate keeps this crisp and unaffected by the backdrop blur */}
      <div className="drawer-panel">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {isStation ? (
              <Waves className="h-5 w-5 text-blue-500" />
            ) : (
              <Hammer className="h-5 w-5 text-emerald-600" />
            )}
            <div>
              <h2 className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
                {isStation ? "River Station Detail" : "Groundwater Borehole"}
              </h2>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                ID: {item.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-5 space-y-6">
          
          {/* Metadata Block */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.location || `${item.state} State, Nigeria`}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusColor}`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Latitude
                </span>
                {item.lat.toFixed(4)}
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Longitude
                </span>
                {item.lng.toFixed(4)}
              </div>
              {isStation && (
                <div className="col-span-2">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                    River Basin
                  </span>
                  {item.river}
                </div>
              )}
              {isStation && item.lastSeen && (
                <div className="col-span-2">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                    Last Telemetry Received
                  </span>
                  <span className="text-slate-800 dark:text-white">
                    {new Date(item.lastSeen).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Settings (Only for Stations) */}
          {isStation && onUpdateThresholds && (
            <div className="space-y-3 border-b border-slate-100 pb-5 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-display text-xs font-bold text-slate-800 dark:text-white">
                <Sliders className="h-4 w-4 text-emerald-600" />
                <span>Configure Station Settings</span>
              </div>
              
              <form onSubmit={handleDetailsSave} className="space-y-4">
                {/* Station Name Edit */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                    required
                  />
                </div>

                {/* Station Location Edit */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                    Location Name (e.g. State / Region)
                  </label>
                  <input
                    type="text"
                    value={stationLocation}
                    onChange={(e) => setStationLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                    required
                  />
                </div>

                {/* Coordinate Position Edits */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latCoord}
                      onChange={(e) => setLatCoord(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lngCoord}
                      onChange={(e) => setLngCoord(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Threshold limits edits */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Max Water Level (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={levelThreshold}
                      onChange={(e) => setLevelThreshold(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                      Max Debit (m³/s)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={debitThreshold}
                      onChange={(e) => setDebitThreshold(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Historical Data Charts */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 font-display text-xs font-bold text-slate-800 dark:text-white">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Historical Trend (Past 24 Hours)</span>
            </div>

            {item.isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center py-12 border border-slate-200 rounded-xl dark:border-slate-800 bg-slate-50/20">
                <span className="relative flex h-5 w-5 mb-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-450 opacity-75"></span>
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-blue-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
                  Fetching readings from telemetry database...
                </span>
              </div>
            ) : isStation ? (
              // Station Charts: Level & Debit
              <div className="space-y-5">
                {/* Level Chart */}
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Water Level (meters)</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      Current: {item.currentLevel}m
                    </span>
                  </div>
                  <div className="h-40 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.history} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" domain={["auto", "auto"]} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="level"
                          stroke="#3B82F6"
                          strokeWidth={2.5}
                          dot={false}
                        />
                        {item.maxLevelThreshold && (
                          <ReferenceLine
                            y={item.maxLevelThreshold}
                            stroke="#EF4444"
                            strokeDasharray="4 4"
                            label={{
                              value: `Limit: ${item.maxLevelThreshold}m`,
                              position: "top",
                              fill: "#EF4444",
                              fontSize: 9,
                              fontWeight: "bold"
                            }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Debit Chart */}
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Discharge / Flow Rate (m³/s)</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      Current: {item.currentDebit} m³/s
                    </span>
                  </div>
                  <div className="h-40 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.history} margin={{ left: -20, right: 5, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" domain={["auto", "auto"]} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="debit"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          dot={false}
                        />
                        {item.maxDebitThreshold && (
                          <ReferenceLine
                            y={item.maxDebitThreshold}
                            stroke="#EF4444"
                            strokeDasharray="4 4"
                            label={{
                              value: `Limit: ${item.maxDebitThreshold}`,
                              position: "top",
                              fill: "#EF4444",
                              fontSize: 9,
                              fontWeight: "bold"
                            }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Telemetry History Log Table */}
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                    <span>Telemetry History Log</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {item.history ? item.history.length : 0} Entries
                    </span>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-150 dark:border-slate-800">
                    <table className="w-full text-left text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Recorded At</th>
                          <th className="px-3 py-2 text-right">Water Level</th>
                          <th className="px-3 py-2 text-right">Flow (Debit)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                        {!item.history || item.history.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="px-3 py-6 text-center text-slate-400 dark:text-slate-500">
                              No history records found.
                            </td>
                          </tr>
                        ) : (
                          item.history.slice().reverse().map((h, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                              <td className="px-3 py-2 text-slate-750 dark:text-slate-300 font-semibold">
                                {h.fullTime || h.time}
                              </td>
                              <td className="px-3 py-2 text-right font-extrabold text-blue-500">
                                {h.level}m
                              </td>
                              <td className="px-3 py-2 text-right font-extrabold text-emerald-500">
                                {h.debit} m³/s
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // Borehole Charts: Contamination & Depth
              <div className="space-y-5">
                {/* Contamination Index Chart */}
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-emerald-500" />
                      Contamination TDS (PPM)
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      Current: {item.contamination} PPM
                    </span>
                  </div>
                  <div className="h-40 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.history} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="day" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" domain={[0, "auto"]} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="contamination"
                          stroke="#D97706"
                          strokeWidth={2.5}
                          dot={{ r: 2 }}
                        />
                        {/* Contaminated Warning Line (300 PPM) */}
                        <ReferenceLine
                          y={300}
                          stroke="#EF4444"
                          strokeDasharray="3 3"
                          label={{
                            value: "Contaminated Threshold (300 PPM)",
                            position: "top",
                            fill: "#EF4444",
                            fontSize: 9,
                            fontWeight: "bold"
                          }}
                        />
                        {/* Safe Line (150 PPM) */}
                        <ReferenceLine
                          y={150}
                          stroke="#10B981"
                          strokeDasharray="3 3"
                          label={{
                            value: "Safe Level (150 PPM)",
                            position: "bottom",
                            fill: "#10B981",
                            fontSize: 9,
                            fontWeight: "bold"
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Borehole Water Table Depth */}
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Depth to Water Table (m)</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      Current Depth: {item.waterLevel}m
                    </span>
                  </div>
                  <div className="h-40 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.history} margin={{ left: -25, right: 5, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="day" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" domain={["auto", "auto"]} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="level"
                          stroke="#0284C7"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-500" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            Validated by NIHSA Hydrological Network Center
          </span>
        </div>
      </div>
    </>
  );
}
