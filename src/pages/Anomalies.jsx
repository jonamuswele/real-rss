import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves,
  Hammer
} from "lucide-react";

export default function Anomalies({
  anomalies = [],
  stations = [],
  boreholes = [],
  onResolveAnomaly
}) {
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'resolved' | 'rules'

  const activeList = anomalies.filter((a) => a.status === "active");
  const resolvedList = anomalies.filter((a) => a.status === "resolved");

  const handleResolveClick = (id) => {
    if (onResolveAnomaly) {
      onResolveAnomaly(id);
    }
  };

  const getSourceIcon = (sourceType) => {
    return sourceType === "station" ? (
      <Waves className="h-4 w-4 text-blue-500" />
    ) : (
      <Hammer className="h-4 w-4 text-emerald-600" />
    );
  };

  const rules = [
    {
      title: "1. Critical Dry-Bed Threshold",
      trigger: "Level drops below minimum limits",
      desc: "Triggered immediately if a river station drops below its critical low water level (e.g. 4.50m for Jebba Gorge). This signals dry riverbeds, severe drought conditions, or sensor exposure above the water line.",
      badge: "Low Level"
    },
    {
      title: "2. Sudden Volumetric Discharge",
      trigger: "Rate of change > 1.0m / hour",
      desc: "Triggered if the water level changes at a rate that is physically impossible under standard weather conditions (e.g. rising/falling > 1 meter within a single hour). Commonly flags flash flooding, upstream dam opening, or stuck-float drops.",
      badge: "Rate of Change"
    },
    {
      title: "3. Telemetry Flatlining",
      trigger: "0.00m change over 24 hours",
      desc: "Flags stations whose levels remain mathematically identical for 24+ consecutive hours. In natural flowing rivers or aquifers, level micro-fluctuations occur constantly. A flatline indicates a stuck mechanical float or locked transmitter.",
      badge: "Flatline"
    },
    {
      title: "4. Seasonal Historical Divergence",
      trigger: "Divergence from 30-day seasonal average",
      desc: "Compares current basin levels to a 30-day moving average calculated from the same month over the past 10 years. If the current trend diverges by more than 2.5 standard deviations (Z-score > 2.5), an anomaly is flagged for review.",
      badge: "Historical Deviation"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-yellow-500 animate-pulse" />
          Hydrological Anomalies & Telemetry Logs
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Automated anomaly logging using algorithmic divergence models and mechanical sensor fault rules
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "active", label: "Active Flags", count: activeList.length },
          { id: "resolved", label: "Resolved Logs", count: resolvedList.length },
          { id: "rules", label: "Detection Algorithms", count: rules.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-5 py-3 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "border-yellow-600 text-yellow-750 dark:border-yellow-500 dark:text-yellow-400"
                : "border-transparent text-slate-500 hover:text-slate-855"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 rounded-full px-1.5 py-0.25 text-[10px] font-bold ${
              tab.id === "active" && tab.count > 0
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {activeList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-xs font-medium text-slate-400 dark:border-slate-800 dark:bg-slate-900">
              No active anomalies currently flagged. System operating normally.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeList.map((anom) => (
                <div
                  key={anom.id}
                  className="rounded-xl border border-yellow-200 bg-white p-5 shadow-xs dark:border-yellow-950 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/40">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-850 dark:text-white">
                          {getSourceIcon(anom.sourceType)}
                          {anom.sourceName}
                        </span>
                        <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-[9px] font-bold text-yellow-800 dark:bg-yellow-950/55 dark:text-yellow-450 uppercase">
                          {anom.type}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {anom.detectedAt}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {anom.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <button
                      onClick={() => handleResolveClick(anom.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-emerald-700 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-800"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "resolved" && (
        <div className="space-y-4">
          {resolvedList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-xs font-medium text-slate-400 dark:border-slate-800 dark:bg-slate-900">
              No resolved logs in current database period.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-500">
                    <th className="p-4">Source</th>
                    <th className="p-4">Divergence Type</th>
                    <th className="p-4">Logged details</th>
                    <th className="p-4">Logged At</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {resolvedList.map((anom) => (
                    <tr key={anom.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="p-4 font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                        {getSourceIcon(anom.sourceType)}
                        {anom.sourceName}
                      </td>
                      <td className="p-4">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
                          {anom.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate" title={anom.description}>
                        {anom.description}
                      </td>
                      <td className="p-4 text-slate-400">
                        {anom.detectedAt}
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Resolved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "rules" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs font-extrabold text-slate-850 dark:text-white">
                  {rule.title}
                </h3>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500 uppercase">
                  {rule.badge}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase">
                  Trigger condition: {rule.trigger}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400 font-medium">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
