import React from "react";
import {
  Waves,
  Hammer,
  AlertTriangle,
  CloudSun,
  Compass,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import NigeriaMap from "../components/NigeriaMap";
import { WEATHER_FORECAST } from "../data/mockData";

export default function Home({
  stations = [],
  boreholes = [],
  anomalies = [],
  onSelectStation,
  onSelectBorehole
}) {
  // Dynamically calculate active warnings (Exceeding safety thresholds)
  const warningStations = stations.filter(
    (st) =>
      st.currentLevel >= st.maxLevelThreshold ||
      st.currentDebit >= st.maxDebitThreshold
  );

  const activeAnomalies = anomalies.filter((a) => a.status === "active");

  const statCards = [
    {
      title: "River Stations",
      value: stations.length,
      sub: `${stations.filter((s) => s.status === "normal").length} Operating Normally`,
      icon: Waves,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900"
    },
    {
      title: "Active Boreholes",
      value: boreholes.length,
      sub: `${boreholes.filter((b) => b.status === "safe").length} Safe Water Sources`,
      icon: Hammer,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900"
    },
    {
      title: "Active Warnings",
      value: warningStations.length,
      sub: "Exceeding safety thresholds",
      icon: ShieldAlert,
      // Warning is RED
      color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30 border-red-100 dark:border-red-900"
    },
    {
      title: "Hydrological Anomalies",
      value: activeAnomalies.length,
      sub: "Immediate review flagged",
      icon: AlertTriangle,
      // Anomaly is YELLOW
      color: "text-yellow-750 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Map at the very top (Hero Element) */}
      <div className="w-full">
        <NigeriaMap
          stations={stations}
          boreholes={boreholes}
          onSelectStation={onSelectStation}
          onSelectBorehole={onSelectBorehole}
        />
      </div>

      {/* Welcome Title (Compact) */}
      <div className="max-w-2xl">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Nigeria Hydrological Services Agency (NIHSA)
        </h1>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          National Hydrological Sensing & Groundwater Contamination Dashboard
        </p>
      </div>

      {/* 2. Compact Stats Grid (Max width constraint to prevent over-stretching) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 bg-white shadow-xs flex items-center justify-between dark:bg-slate-900 ${card.color}`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {card.title}
                </span>
                <div className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
                  {card.value}
                </div>
                <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400">
                  {card.sub}
                </div>
              </div>
              <div className="rounded-lg p-2 bg-white/60 dark:bg-slate-900/60 shadow-2xs">
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Grid: Wide Tables (2/3 width) and Compact Info/Forecast (1/3 width) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Wide Tables Column (Left - 2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Warnings Table (RED Theme) */}
          <div className="rounded-xl border border-red-200 bg-white p-5 shadow-xs dark:border-red-950 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-red-50 p-1.5 dark:bg-red-950/30">
                  <ShieldAlert className="h-4.5 w-4.5 text-red-600 dark:text-red-455" />
                </span>
                <div>
                  <h3 className="font-display text-xs font-extrabold text-slate-900 dark:text-white">
                    Active Station Warnings (RED)
                  </h3>
                  <p className="text-[9px] font-semibold text-slate-450 dark:text-slate-500 uppercase">
                    Level or Debit thresholds exceeded
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-800 dark:bg-red-950 dark:text-red-400">
                {warningStations.length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              {warningStations.length === 0 ? (
                <div className="py-6 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                  No stations are currently exceeding safety limits.
                </div>
              ) : (
                <table className="w-full text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                      <th className="pb-2">Station</th>
                      <th className="pb-2">Basin / River</th>
                      <th className="pb-2">Current telemetry</th>
                      <th className="pb-2">Safety Limits</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {warningStations.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {st.name}
                        </td>
                        <td className="py-2.5 text-slate-400">
                          {st.river}
                        </td>
                        <td className="py-2.5 font-extrabold text-red-500">
                          {st.currentLevel}m / {st.currentDebit} m³/s
                        </td>
                        <td className="py-2.5 text-slate-400 font-semibold">
                          {st.maxLevelThreshold}m / {st.maxDebitThreshold}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onSelectStation(st)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                          >
                            Details
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Anomalies Table (YELLOW Theme) */}
          <div className="rounded-xl border border-yellow-200 bg-white p-5 shadow-xs dark:border-yellow-950 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-yellow-50 p-1.5 dark:bg-yellow-950/30">
                  <AlertTriangle className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-450" />
                </span>
                <div>
                  <h3 className="font-display text-xs font-extrabold text-slate-900 dark:text-white">
                    Active Hydrological Anomalies (YELLOW)
                  </h3>
                  <p className="text-[9px] font-semibold text-slate-450 dark:text-slate-500 uppercase">
                    Telemetry faults or unexpected trends flagged
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[9px] font-bold text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400">
                {activeAnomalies.length} Flagged
              </span>
            </div>

            <div className="overflow-x-auto">
              {activeAnomalies.length === 0 ? (
                <div className="py-6 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                  No active hydrological anomalies flagged.
                </div>
              ) : (
                <table className="w-full text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                      <th className="pb-2">Source Location</th>
                      <th className="pb-2">Divergence Type</th>
                      <th className="pb-2">Alert Details</th>
                      <th className="pb-2">Timestamp</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                    {activeAnomalies.map((anom) => (
                      <tr key={anom.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {anom.sourceName}
                        </td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-750 dark:bg-yellow-950/20 dark:text-yellow-400">
                            {anom.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500 font-semibold max-w-xs truncate" title={anom.description}>
                          {anom.description}
                        </td>
                        <td className="py-2.5 text-slate-400">
                          {anom.detectedAt}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => {
                              if (anom.sourceType === "station") {
                                const st = stations.find((s) => s.id === anom.sourceId);
                                if (st) onSelectStation(st);
                              } else {
                                const bh = boreholes.find((b) => b.id === anom.sourceId);
                                if (bh) onSelectBorehole(bh);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                          >
                            Investigate
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Compact Columns: Forecast & Guidelines (Right - 1/3 Width) */}
        <div className="space-y-6">
          {/* Weather Station Forecast (Compact) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-1.5">
              <CloudSun className="h-4.5 w-4.5 text-amber-500" />
              <h3 className="font-display text-xs font-extrabold text-slate-900 dark:text-white">
                Basin Hydromet Forecast
              </h3>
            </div>
            <div className="space-y-3">
              {WEATHER_FORECAST.map((w, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0 dark:border-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{w.icon}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{w.day}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{w.condition}</span>
                    <span className="text-slate-800 dark:text-white font-bold">{w.temp}°C</span>
                    <span className="text-blue-500 font-bold">{w.rainProb}% Rain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Panel (Compact) */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <Compass className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">NIHSA Field Guidelines</h4>
                <p className="text-[10px] leading-relaxed text-emerald-700/80 dark:text-emerald-400/70 font-medium">
                  Under the Water Resources Act, please report abnormal river level drops or borehole contaminants exceeding 300 PPM TDS to the regional coordination office immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
