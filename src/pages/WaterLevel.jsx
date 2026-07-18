import React, { useState } from "react";
import {
  Waves,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Search,
  ChevronRight
} from "lucide-react";

export default function WaterLevel({
  stations = [],
  anomalies = [],
  onSelectStation
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'warnings' | 'anomalies'
  const [searchTerm, setSearchTerm] = useState("");

  // Determine warnings dynamically based on thresholds
  const warningStations = stations.filter(
    (st) =>
      st.currentLevel >= st.maxLevelThreshold ||
      st.currentDebit >= st.maxDebitThreshold
  );

  // Determine anomaly stations
  const anomalyStations = stations.filter((st) => st.status === "anomaly");

  // Filter stations based on active tab
  const getFilteredStations = () => {
    let list = stations;
    if (activeTab === "warnings") {
      list = warningStations;
    } else if (activeTab === "anomalies") {
      list = anomalyStations;
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (st) =>
          st.name.toLowerCase().includes(term) ||
          st.river.toLowerCase().includes(term) ||
          st.location.toLowerCase().includes(term)
      );
    }
    return list;
  };

  const filteredList = getFilteredStations();

  // Status badges: Warning = Red, Anomaly = Yellow, Normal = Green
  const getStatusBadge = (st) => {
    const isWarning =
      st.currentLevel >= st.maxLevelThreshold ||
      st.currentDebit >= st.maxDebitThreshold;
    const isAnomaly = st.status === "anomaly";

    if (isAnomaly) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-[10px] font-bold text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200">
          <AlertTriangle className="h-3 w-3" />
          Anomaly
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200">
          <AlertTriangle className="h-3 w-3" />
          Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
        <ShieldCheck className="h-3 w-3" />
        Normal
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Waves className="h-6 w-6 text-blue-500" />
            River Station Network
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Real-time level monitoring and volumetric flow rate telemetry
          </p>
        </div>
      </div>

      {/* Tabs & Search Strip */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        {/* Navigation Tabs inside the page */}
        <div className="flex border-b border-slate-100 pb-0.5 sm:border-0 dark:border-slate-850">
          {[
            { id: "all", label: "All Stations", count: stations.length },
            { id: "warnings", label: "Warnings", count: warningStations.length },
            { id: "anomalies", label: "Anomalies", count: anomalyStations.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-2 text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.25 text-[10px] font-bold text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stations, rivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
          />
        </div>
      </div>

      {/* Grid Cards of Stations */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredList.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs font-medium text-slate-400 dark:border-slate-800">
            No hydrological stations match the current filter or search criteria.
          </div>
        ) : (
          filteredList.map((st) => {
            const isLevelWarning = st.currentLevel >= st.maxLevelThreshold;
            const isDebitWarning = st.currentDebit >= st.maxDebitThreshold;
            const isWarningState = isLevelWarning || isDebitWarning;
            const isAnomalyState = st.status === "anomaly";

            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st)}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                {/* Accent band reflecting status: Warning = Red, Anomaly = Yellow, Normal = Green */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                    isWarningState
                      ? "bg-red-500"
                      : isAnomalyState
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }`}
                />

                <div className="space-y-4">
                  {/* Top line with metadata & badge */}
                  <div className="flex items-start justify-between pl-2">
                    <div>
                      <h3 className="font-display text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {st.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block">
                        {st.river}
                      </span>
                      {st.lastSeen && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5 font-semibold">
                          Telemetry: {new Date(st.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(st)}
                  </div>

                  {/* Level and Debit metrics */}
                  <div className="grid grid-cols-2 gap-4 pl-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                        Water Level
                      </span>
                      <div
                        className={`text-sm font-extrabold ${
                          isLevelWarning ? "text-red-500" : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {st.currentLevel} m
                      </div>
                      <span className="text-[9px] font-medium text-slate-400 font-bold">
                        Max: {st.maxLevelThreshold}m
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                        Flow Rate (Debit)
                      </span>
                      <div
                        className={`text-sm font-extrabold ${
                          isDebitWarning ? "text-red-500" : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {st.currentDebit} m³/s
                      </div>
                      <span className="text-[9px] font-medium text-slate-400 font-bold">
                        Max: {st.maxDebitThreshold}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action click prompt */}
                <div className="mt-5 pl-2 flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-50 dark:border-slate-800/40">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5" />
                    Configure thresholds
                  </span>
                  <span className="flex items-center group-hover:translate-x-1 transition-transform">
                    View History
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
