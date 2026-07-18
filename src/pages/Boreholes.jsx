import React, { useState } from "react";
import {
  Hammer,
  Search,
  ShieldCheck,
  AlertTriangle,
  Droplet,
  ArrowUpDown,
  ChevronRight,
  TrendingDown
} from "lucide-react";

export default function Boreholes({
  boreholes = [],
  onSelectBorehole
}) {
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'safe' | 'marginal' | 'contaminated'
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' | 'level' | 'contamination'

  // Calculate quick analytics for boreholes
  const totalBoreholes = boreholes.length;
  const safeCount = boreholes.filter((b) => b.status === "safe").length;
  const marginalCount = boreholes.filter((b) => b.status === "marginal").length;
  const contaminatedCount = boreholes.filter((b) => b.status === "contaminated").length;

  const avgContamination = Math.round(
    boreholes.reduce((sum, b) => sum + b.contamination, 0) / totalBoreholes
  );
  const avgLevel = (
    boreholes.reduce((sum, b) => sum + b.waterLevel, 0) / totalBoreholes
  ).toFixed(1);

  // Filter list
  const getFilteredBoreholes = () => {
    let list = boreholes;

    if (filterStatus !== "all") {
      list = list.filter((b) => b.status === filterStatus);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.state.toLowerCase().includes(term) ||
          b.location.toLowerCase().includes(term)
      );
    }

    // Sort list
    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "level") return a.waterLevel - b.waterLevel;
      if (sortBy === "contamination") return b.contamination - a.contamination;
      return 0;
    });
  };

  const filteredList = getFilteredBoreholes();

  // Color mappings: Safe = Green, Marginal = Yellow, Contaminated = Red
  const getStatusColor = (status) => {
    if (status === "safe")
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200";
    if (status === "marginal")
      return "bg-yellow-50 text-yellow-750 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-250";
    return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Hammer className="h-6 w-6 text-emerald-600" />
          Groundwater Borehole Network
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Monitoring water table depths and TDS chemical contamination levels across Nigerian communities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-950/30">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-bold">
              Safe Water Ratio
            </span>
            <div className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
              {safeCount} / {totalBoreholes} Safe
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/30">
            <TrendingDown className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-bold">
              Avg Aquifer Depth
            </span>
            <div className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
              {avgLevel} meters
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="rounded-lg bg-yellow-50 p-2.5 dark:bg-yellow-950/30">
            <Droplet className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-bold">
              Average Salinity / TDS
            </span>
            <div className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
              {avgContamination} PPM
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Boreholes" },
            { id: "safe", label: "Safe (<150 PPM)" },
            { id: "marginal", label: "Marginal (150-300)" },
            { id: "contaminated", label: "Unsafe (>300 PPM)" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? "bg-slate-800 text-white dark:bg-slate-700"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-1 font-bold">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-500 hover:text-slate-800 focus:outline-none dark:hover:text-slate-350"
            >
              <option value="name">Sort by Name</option>
              <option value="level">Sort by Depth</option>
              <option value="contamination">Sort by Contamination</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search boreholes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Boreholes Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredList.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs font-medium text-slate-400 dark:border-slate-800">
            No borehole stations found matching the filter selection.
          </div>
        ) : (
          filteredList.map((bh) => (
            <div
              key={bh.id}
              onClick={() => onSelectBorehole(bh)}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 cursor-pointer transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {bh.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-bold">
                      {bh.state} State
                    </span>
                  </div>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase ${getStatusColor(
                      bh.status
                    )}`}
                  >
                    {bh.status === "contaminated" ? "unsafe" : bh.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Water Level (Depth):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{bh.waterLevel} m</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>Salinity / TDS:</span>
                    <span
                      className={`font-bold ${
                        bh.status === "contaminated"
                          ? "text-red-500"
                          : bh.status === "marginal"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {bh.contamination} PPM
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                <span className="flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5" />
                  TDS safety metric
                </span>
                <span className="flex items-center group-hover:translate-x-1 transition-transform">
                  View History
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
