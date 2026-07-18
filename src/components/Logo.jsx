import React from "react";

export default function Logo({ size = 48, showText = true, textClass = "" }) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* High-Fidelity SVG Replication of the NIHSA Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm animate-fade-in"
      >
        {/* Droplet Body Outer boundary */}
        <path
          d="M150 15 C 230 115, 275 190, 275 235 C 275 304, 219 360, 150 360 C 81 360, 25 304, 25 235 C 25 190, 70 115, 150 15 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* Soil Layer and Water Boundary (Middle line) */}
        <line x1="27" y1="180" x2="273" y2="180" stroke="#000000" strokeWidth="2.5" />

        {/* Water Table Level (Deep Blue/Purple in the right side reservoir) */}
        <path
          d="M150 180 C 180 180, 190 220, 230 220 C 255 220, 268 190, 272 180 L 273 180 L 272 180 Z"
          fill="none"
        />
        {/* Actual Water Area shape on the right */}
        <path
          d="M150 180 C 180 180, 200 220, 240 220 C 260 220, 268 195, 271 180 C 272 195, 266 220, 250 230 C 230 242, 210 245, 190 235 C 170 225, 160 195, 150 180 Z"
          fill="#1E3A8A"
          opacity="0.95"
        />
        {/* River Basin Line */}
        <path
          d="M150 180 C 170 195, 180 230, 210 235 C 240 240, 260 200, 271 180"
          stroke="#000000"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Underground Strata Lines (Dashed and dotted horizontal lines representing geology) */}
        <line x1="33" y1="195" x2="267" y2="195" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />
        <line x1="37" y1="210" x2="263" y2="210" stroke="#475569" strokeDasharray="2,5" strokeWidth="1" />
        <line x1="42" y1="225" x2="258" y2="225" stroke="#475569" strokeWidth="1.2" />
        <line x1="48" y1="240" x2="252" y2="240" stroke="#64748B" strokeDasharray="4,4" strokeWidth="1" />
        <line x1="56" y1="255" x2="244" y2="255" stroke="#64748B" strokeWidth="1.2" />
        <line x1="68" y1="270" x2="232" y2="270" stroke="#94A3B8" strokeWidth="1" />
        <line x1="84" y1="285" x2="216" y2="285" stroke="#94A3B8" strokeDasharray="2,2" strokeWidth="1.2" />
        <line x1="108" y1="300" x2="192" y2="300" stroke="#CBD5E1" strokeWidth="1" />

        {/* Mound of Earth / Soil on the left */}
        <path
          d="M27 180 C 50 180, 80 155, 110 155 C 130 155, 142 170, 150 180 Z"
          fill="#854D0E"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* Tree on the soil mound */}
        {/* Trunk */}
        <path d="M92 155 L92 125 C92 122, 94 120, 96 120 L98 120" stroke="#451A03" strokeWidth="3" fill="none" />
        <path d="M86 155 L90 130" stroke="#451A03" strokeWidth="2.5" fill="none" />
        {/* Leaves */}
        <circle cx="85" cy="115" r="14" fill="#047857" />
        <circle cx="102" cy="112" r="16" fill="#065F46" />
        <circle cx="92" cy="98" r="15" fill="#10B981" />
        <circle cx="78" cy="104" r="10" fill="#34D399" />

        {/* Sun, Cloud, and Rain */}
        {/* Sun */}
        <circle cx="150" cy="55" r="16" fill="#FBBF24" />
        {/* Sun rays */}
        <path
          d="M150 32 L150 38 M150 72 L150 78 M127 55 L133 55 M167 55 L173 55 M134 39 L138 43 M166 71 L162 67 M134 71 L138 67 M166 39 L162 43"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Cloud */}
        <path
          d="M110 75 C110 68, 120 62, 130 65 C135 60, 150 60, 155 67 C162 67, 170 72, 168 80 C173 83, 171 92, 162 92 L112 92 C105 92, 102 85, 110 75 Z"
          fill="#D1D5DB"
          stroke="#9CA3AF"
          strokeWidth="1"
        />
        {/* Raindrops */}
        <path
          d="M115 100 L112 106 M125 102 L122 108 M135 100 L132 106 M145 103 L142 109 M155 101 L152 107 M165 102 L162 108"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Borehole Structure (Left side) */}
        {/* Above ground head */}
        <rect x="58" y="152" width="6" height="28" fill="#475569" stroke="#000000" strokeWidth="1" />
        <rect x="50" y="150" width="22" height="3" fill="#334155" />
        {/* Pump lever */}
        <path d="M52 150 L42 153" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        {/* Underground casing */}
        <rect x="60" y="180" width="3" height="60" fill="#64748B" opacity="0.8" />
        <line x1="58" y1="210" x2="65" y2="210" stroke="#000000" strokeWidth="1" />
        <line x1="58" y1="230" x2="65" y2="230" stroke="#000000" strokeWidth="1" />

        {/* Water Level / Gauge Staff (Right side in the water) */}
        <rect x="220" y="160" width="4" height="40" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
        {/* Gauge marks */}
        <line x1="220" y1="165" x2="223" y2="165" stroke="#EF4444" strokeWidth="1" />
        <line x1="220" y1="170" x2="224" y2="170" stroke="#000000" strokeWidth="1" />
        <line x1="220" y1="175" x2="223" y2="175" stroke="#EF4444" strokeWidth="1" />
        <line x1="220" y1="180" x2="224" y2="180" stroke="#000000" strokeWidth="1" />
        <line x1="220" y1="185" x2="223" y2="185" stroke="#EF4444" strokeWidth="1" />
        <line x1="220" y1="190" x2="224" y2="190" stroke="#000000" strokeWidth="1" />

        {/* Bottom Semi-circle Crest (NIHSA Green Banner) */}
        <path
          d="M26 182 C 26 230, 42 270, 75 300 C 58 275, 42 240, 38 200 Z"
          fill="#006A4E"
          stroke="#006A4E"
          strokeWidth="1"
        />
        <path
          d="M274 182 C 274 230, 258 270, 225 300 C 242 275, 258 240, 262 200 Z"
          fill="#006A4E"
          stroke="#006A4E"
          strokeWidth="1"
        />
        {/* Main green arch wrapping the bottom */}
        <path
          d="M26 180 C 26 270, 80 325, 150 325 C 220 325, 274 270, 274 180 C 255 180, 245 180, 245 180 C 245 250, 200 295, 150 295 C 100 295, 55 250, 55 180 Z"
          fill="#006A4E"
        />

        {/* Nigerian Coat of Arms Circle at the bottom center */}
        <circle cx="150" cy="295" r="22" fill="#FFFFFF" stroke="#006A4E" strokeWidth="2.5" />
        {/* Stylized shield */}
        <path d="M142 284 L158 284 L158 296 C158 304, 142 304, 142 296 Z" fill="#1E293B" />
        {/* White Y shape (Niger/Benue rivers) inside shield */}
        <path d="M142 284 L148 284 L150 291 L152 284 L158 284 L152 294 L152 301 L148 301 L148 294 Z" fill="#FFFFFF" />
        {/* Red Eagle top */}
        <path d="M147 280 L153 280 L150 275 Z" fill="#EF4444" />
        {/* Support Chargers (Horses, represented as white curves) */}
        <path d="M137 283 C137 292, 140 295, 141 298" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <path d="M163 283 C163 292, 160 295, 159 298" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

        {/* Tiny Banner text curves or labels (represent labels) */}
        {/* Since text on a path is hard to align perfectly inside small SVGs, we use geometric representation */}
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-[15px] leading-tight tracking-wider text-emerald-600 dark:text-emerald-500">
            NIHSA
          </span>
          <span className={`font-sans font-semibold text-[9px] uppercase tracking-widest text-slate-500 ${textClass}`}>
            Nigeria Hydrological Services
          </span>
        </div>
      )}
    </div>
  );
}
