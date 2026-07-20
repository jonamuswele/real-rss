import React, { useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle,
  Database,
  Waves,
  RefreshCw
} from "lucide-react";
import { api } from "../services/api";

export default function ExportData({ stations = [] }) {
  const [selectedStation, setSelectedStation] = useState("all");
  const [timeRange, setTimeRange] = useState("all"); // 'all' | '24h' | '7d' | '30d'
  const [exportFormat, setExportFormat] = useState("csv"); // 'csv' | 'json'
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fetch telemetry data based on selected station filter
  useEffect(() => {
    fetchExportPreview();
  }, [selectedStation, timeRange]);

  const fetchExportPreview = async () => {
    setIsLoading(true);
    try {
      let records = [];

      if (selectedStation === "all") {
        // Fetch latest readings across all stations
        const latestReadings = await api.getLatestReadings();
        records = latestReadings.map((r) => {
          const st = stations.find((s) => s.id === r.node_id);
          return {
            stationId: r.node_id,
            stationName: st ? st.name : r.node_id,
            location: st ? st.location : (r.location || "NIHSA"),
            waterLevel: parseFloat(r.level_cm.toFixed(2)),
            recordedAt: r.recorded_at
          };
        });
      } else {
        // Fetch detailed readings history for the single selected station
        const rawReadings = await api.getReadingsForStation(selectedStation, 500);
        const st = stations.find((s) => s.id === selectedStation);
        
        records = (rawReadings || []).map((r) => ({
          stationId: r.node_id || selectedStation,
          stationName: st ? st.name : selectedStation,
          location: st ? st.location : "NIHSA",
          waterLevel: parseFloat(r.level_cm.toFixed(2)),
          recordedAt: r.recorded_at
        }));
      }

      // Filter by time range if requested
      if (timeRange !== "all") {
        const now = new Date();
        const cutoff = new Date();
        if (timeRange === "24h") cutoff.setHours(now.getHours() - 24);
        if (timeRange === "7d") cutoff.setDate(now.getDate() - 7);
        if (timeRange === "30d") cutoff.setDate(now.getDate() - 30);

        records = records.filter((r) => new Date(r.recordedAt) >= cutoff);
      }

      setPreviewData(records);
    } catch (err) {
      console.error("Failed to load export preview data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (previewData.length === 0) return;

    const timestamp = new Date().toISOString().split("T")[0];
    const stationTag = selectedStation === "all" ? "all_stations" : selectedStation;
    const filename = `nihsa_telemetry_${stationTag}_${timestamp}.${exportFormat}`;

    if (exportFormat === "csv") {
      // Build CSV header and rows
      const headers = ["Station ID", "Station Name", "Location", "Water Level", "Recorded At"];
      const csvRows = [
        headers.join(","),
        ...previewData.map((row) =>
          [
            `"${row.stationId}"`,
            `"${row.stationName.replace(/"/g, '""')}"`,
            `"${row.location.replace(/"/g, '""')}"`,
            row.waterLevel,
            `"${row.recordedAt}"`
          ].join(",")
        )
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      triggerFileDownload(blob, filename);
    } else {
      // Build JSON payload
      const jsonContent = JSON.stringify(previewData, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
      triggerFileDownload(blob, filename);
    }

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const triggerFileDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          Telemetry Data Export & Reports
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Export database telemetry logs for offline hydrological analysis, Excel reports, or third-party integrations
        </p>
      </div>

      {/* Control Panel Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Export Configuration Settings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Station Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Select Target Station
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:outline-emerald-500"
            >
              <option value="all">🌐 All Stations (Full Network Export)</option>
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  🌊 {st.name} ({st.id})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Time Scope
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:outline-emerald-500"
            >
              <option value="all">📅 All Database Records</option>
              <option value="24h">⏱️ Past 24 Hours</option>
              <option value="7d">📆 Past 7 Days</option>
              <option value="30d">🗓️ Past 30 Days</option>
            </select>
          </div>

          {/* Export Format Switch */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat("csv")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  exportFormat === "csv"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  exportFormat === "json"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                }`}
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Download Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Database className="h-4 w-4 text-slate-400" />
            <span>Ready to export: <strong className="text-slate-800 dark:text-white">{previewData.length}</strong> records</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchExportPreview}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading || previewData.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 text-white animate-bounce" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Telemetry ({exportFormat.toUpperCase()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Data Preview Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-blue-500" />
            <h3 className="font-display text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Data Preview Log
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Showing top {Math.min(previewData.length, 100)} records
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse">
            Loading preview from database...
          </div>
        ) : previewData.length === 0 ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-400">
            No telemetry records found for the selected station and time range.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-150 dark:border-slate-800">
            <table className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Station ID</th>
                  <th className="px-4 py-3">Station Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Water Level</th>
                  <th className="px-4 py-3 text-right">Recorded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {previewData.slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                      {row.stationId}
                    </td>
                    <td className="px-4 py-3">{row.stationName}</td>
                    <td className="px-4 py-3 text-slate-400">{row.location}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-blue-500">
                      {row.waterLevel}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(row.recordedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
