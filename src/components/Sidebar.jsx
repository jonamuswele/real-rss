import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Waves,
  Hammer,
  AlertTriangle,
  ShieldCheck,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Logo from "./Logo";

export default function Sidebar({
  warningCount = 0,
  anomalyCount = 0,
  isMinimized = false,
  onToggleMinimize
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      path: "/water-levels",
      label: "River Stations",
      icon: Waves,
      badge: warningCount > 0 ? { count: warningCount, type: "danger" } : null // Warning is Red
    },
    {
      path: "/boreholes",
      label: "Boreholes",
      icon: Hammer,
      badge: null
    },
    {
      path: "/anomalies",
      label: "Anomalies",
      icon: AlertTriangle,
      badge: anomalyCount > 0 ? { count: anomalyCount, type: "warning" } : null // Anomaly is Yellow
    }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
        isMinimized ? "w-sidebar-min" : "w-sidebar-full"
      }`}
    >
      {/* Sidebar Header with NIHSA Logo & Collapse Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-3.5 dark:border-slate-800">
        <div className="overflow-hidden flex-1">
          <Logo size={isMinimized ? 34 : 40} showText={!isMinimized} />
        </div>
        
        {/* Toggle Minimize Button */}
        <button
          onClick={onToggleMinimize}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
          title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {!isMinimized && (
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Main Menu
          </span>
        )}
        {isMinimized && (
          <div className="border-t border-slate-100 my-2 dark:border-slate-800"></div>
        )}

        <div className={`space-y-1 ${isMinimized ? "flex flex-col items-center" : ""}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isMinimized ? item.label : ""}
                className={`relative flex items-center rounded-lg p-2.5 text-sm font-medium transition-all duration-150 group ${
                  isMinimized ? "justify-center w-10 h-10" : "justify-between w-full"
                } ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105 ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                    }`}
                  />
                  {!isMinimized && <span>{item.label}</span>}
                </div>

                {/* Badges */}
                {item.badge && (
                  <>
                    {!isMinimized ? (
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.badge.type === "danger"
                            ? "bg-red-100 text-red-750 dark:bg-red-950/40 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400"
                        }`}
                      >
                        {item.badge.count}
                      </span>
                    ) : (
                      // Collapsed Badge: Small pulsing dot overlaying icon corner
                      <span
                        className={`absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full border border-white ${
                          item.badge.type === "danger"
                            ? "bg-red-500 animate-pulse"
                            : "bg-yellow-500 animate-pulse"
                        }`}
                      />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-6">
          {!isMinimized && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              System status
            </span>
          )}
          <div className={`px-3 space-y-3.5 ${isMinimized ? "flex flex-col items-center px-0 pt-2" : "mt-3"}`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {!isMinimized && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Live Feed: Online
                </span>
              )}
            </div>
            {!isMinimized && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                <span className="font-medium">NIHSA Secured</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      
    </aside>
  );
}
