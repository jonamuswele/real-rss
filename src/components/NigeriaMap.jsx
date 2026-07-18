import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { Waves, Hammer } from "lucide-react";

export default function NigeriaMap({
  stations = [],
  boreholes = [],
  onSelectStation,
  onSelectBorehole
}) {
  const [mapType, setMapType] = useState("all"); // 'all' | 'stations' | 'boreholes'
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!leafletMapRef.current && mapContainerRef.current) {
      // Center of Nigeria
      leafletMapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([9.082, 8.675], 6);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Create Layer Group for markers
      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Markers when data or filters change
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    // Clear previous markers
    markersLayerRef.current.clearLayers();

    // Plot River Stations
    if (mapType === "all" || mapType === "stations") {
      stations.forEach((st) => {
        // Warning turns RED, Anomaly turns YELLOW, Normal turns GREEN
        let markerColor = "#00A86B"; // Normal (Green)
        if (st.status === "warning") {
          markerColor = "#EF4444"; // Warning (Red)
        } else if (st.status === "anomaly") {
          markerColor = "#F59E0B"; // Anomaly (Yellow)
        }

        const marker = L.circleMarker([st.lat, st.lng], {
          radius: 9,
          fillColor: markerColor,
          color: "#FFFFFF",
          weight: 2,
          fillOpacity: 0.9,
          className: "leaflet-marker-pulse"
        });

        // Hover Details Tooltip
        const tooltipContent = `
          <div style="font-family: 'Nunito Sans', sans-serif; line-height: 1.4;">
            <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 12px; color: #10B981;">
              🌊 ${st.name}
            </div>
            <div style="font-size: 10px; color: #94A3B8; margin-top: 1px;">${st.river}</div>
            <div style="margin: 6px 0; border-top: 1px solid #334155;"></div>
            <div style="font-size: 11px; color: #E2E8F0;">
              <div><strong>Level:</strong> ${st.currentLevel}m / limit ${st.maxLevelThreshold}m</div>
              <div><strong>Debit:</strong> ${st.currentDebit} m³/s / limit ${st.maxDebitThreshold}</div>
              <div style="margin-top: 4px;">
                <strong>Status:</strong> 
                <span style="font-weight: 800; text-transform: uppercase; color: ${markerColor}">
                  ${st.status}
                </span>
              </div>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          className: "leaflet-tooltip-nihsa",
          direction: "top",
          offset: [0, -8],
          opacity: 0.95
        });

        // Click selection -> open drawer
        marker.on("click", () => {
          if (onSelectStation) {
            onSelectStation(st);
          }
        });

        marker.addTo(markersLayerRef.current);
      });
    }

    // Plot Groundwater Boreholes
    if (mapType === "all" || mapType === "boreholes") {
      boreholes.forEach((bh) => {
        // Warning (Contaminated) turns RED, Anomaly (Marginal) turns YELLOW, Safe turns GREEN
        let markerColor = "#00A86B"; // Safe (Green)
        if (bh.status === "contaminated") {
          markerColor = "#EF4444"; // Warning (Red)
        } else if (bh.status === "marginal") {
          markerColor = "#F59E0B"; // Anomaly (Yellow)
        }

        // Draw boreholes as SVG triangles to distinguish from river station circles
        const triangleIcon = L.divIcon({
          className: "",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <polygon
              points="10,2 19,18 1,18"
              fill="${markerColor}"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>`,
          iconSize: [20, 20],
          iconAnchor: [10, 18]
        });
        const marker = L.marker([bh.lat, bh.lng], { icon: triangleIcon });

        // Hover Details Tooltip
        const tooltipContent = `
          <div style="font-family: 'Nunito Sans', sans-serif; line-height: 1.4;">
            <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 12px; color: #0284C7;">
              🚰 ${bh.name}
            </div>
            <div style="font-size: 10px; color: #94A3B8; margin-top: 1px;">${bh.location}</div>
            <div style="margin: 6px 0; border-top: 1px solid #334155;"></div>
            <div style="font-size: 11px; color: #E2E8F0;">
              <div><strong>Depth:</strong> ${bh.waterLevel} meters</div>
              <div><strong>Contamination:</strong> ${bh.contamination} PPM</div>
              <div style="margin-top: 4px;">
                <strong>Safety:</strong> 
                <span style="font-weight: 800; text-transform: uppercase; color: ${markerColor}">
                  ${bh.status === "contaminated" ? "unsafe" : bh.status}
                </span>
              </div>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          className: "leaflet-tooltip-nihsa",
          direction: "top",
          offset: [0, -8],
          opacity: 0.95
        });

        // Click selection -> open drawer
        marker.on("click", () => {
          if (onSelectBorehole) {
            onSelectBorehole(bh);
          }
        });

        marker.addTo(markersLayerRef.current);
      });
    }
  }, [stations, boreholes, mapType]);

  return (
    <div className="w-full space-y-4">
      {/* Map Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hydrological Stations Map</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">OpenStreetMap Leaflet Network Telemetry</p>
        </div>
        
        {/* Toggle options */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          <button
            onClick={() => setMapType("all")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              mapType === "all"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            All Locations
          </button>
          <button
            onClick={() => setMapType("stations")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              mapType === "stations"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            River Stations
          </button>
          <button
            onClick={() => setMapType("boreholes")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              mapType === "boreholes"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Boreholes
          </button>
        </div>
      </div>

      {/* Leaflet Map div */}
      <div className="w-full relative">
        <div ref={mapContainerRef} id="leaflet-map" />

        {/* Legend Panel overlay */}
        <div className="absolute bottom-3 right-3 z-[400] rounded-lg bg-white/95 p-3 text-[10px] shadow-md backdrop-blur-xs dark:bg-slate-900/95 space-y-1.5 font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 font-extrabold">Marker Type</div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 border border-white flex-shrink-0"></span>
            <span>River Station (Circle)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 20 20" className="flex-shrink-0">
              <polygon points="10,2 19,18 1,18" fill="#94A3B8" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span>Borehole (Triangle)</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 font-extrabold">Status Color</div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white flex-shrink-0"></span>
            <span>Normal / Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 border border-white flex-shrink-0"></span>
            <span>Warning / Unsafe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 border border-white flex-shrink-0"></span>
            <span>Anomaly / Marginal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
