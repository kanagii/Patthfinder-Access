import React, { useMemo, useState } from 'react';
import { Hazard, MapFilterChipId } from '../types';
import { ResilientImage } from './ResilientImage';

interface HomeMapViewProps {
  hazards: Hazard[];
  selectedHazardId: string;
  onSelectHazard: (id: string) => void;
  activeFilter: MapFilterChipId;
  onSelectFilter: (filter: MapFilterChipId) => void;
  upvotedIds: string[];
  bookmarkedIds: string[];
  onToggleUpvote: (id: string) => void;
  onReportCleared: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenRouteCompare: () => void;
  onOpenHazardDetail: (id: string) => void;
  onOpenReport: () => void;
  onShowToast: (msg: string) => void;
}

const FILTER_CHIPS: {
  id: MapFilterChipId;
  label: string;
  icon: string;
}[] = [
  { id: 'wheelchair', label: 'Wheelchair', icon: 'accessible' },
  { id: 'strollers', label: 'Strollers', icon: 'stroller' },
  { id: 'vision', label: 'Tactile / Vision', icon: 'visibility' },
  { id: 'cane', label: 'Cane / Crutches', icon: 'elderly' },
  { id: 'step-free', label: 'Step-Free Only', icon: 'ramp_right' },
  { id: 'elevators', label: 'Elevators Only', icon: 'elevator' },
  { id: 'covered', label: 'Covered Walkways', icon: 'umbrella' },
];

const CAMPUS_DESTINATIONS = [
  {
    id: 'dest-eng',
    name: 'Engineering Building Plaza',
    subtitle: 'Verified step-free surface • Current zone',
    hazardId: 'haz-tactile-paving',
  },
  {
    id: 'dest-main',
    name: 'Main Admin Building',
    subtitle: 'West Wing Elevator out of service · Detour ready',
    hazardId: 'haz-main-elevator',
  },
  {
    id: 'dest-quad',
    name: 'Main Quad & Cafeteria',
    subtitle: 'Wet tile incline caution · Covered bypass open',
    hazardId: 'haz-quad-ramp',
  },
  {
    id: 'dest-sci',
    name: 'Science Complex & NGE Bldg',
    subtitle: 'South Lobby automatic doors operational',
    hazardId: 'haz-science-ramp',
  },
];

export const HomeMapView: React.FC<HomeMapViewProps> = ({
  hazards,
  selectedHazardId,
  onSelectHazard,
  activeFilter,
  onSelectFilter,
  upvotedIds,
  bookmarkedIds,
  onToggleUpvote,
  onReportCleared,
  onToggleBookmark,
  onOpenRouteCompare,
  onOpenHazardDetail,
  onOpenReport,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [showAllLayers, setShowAllLayers] = useState(true);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const selectedHazard = useMemo(
    () => hazards.find((h) => h.id === selectedHazardId) ?? hazards[0],
    [hazards, selectedHazardId]
  );

  const activeAlerts = useMemo(() => {
    const remaining = hazards.filter((h) => h.id !== selectedHazard?.id);
    return showAllAlerts ? remaining : remaining.slice(0, 2);
  }, [hazards, selectedHazard, showAllAlerts]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const matchingHazards = hazards
      .filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.building.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q)
      )
      .map((h) => ({
        id: h.id,
        name: h.title,
        subtitle: h.location,
        hazardId: h.id,
      }));
    const matchingBuildings = CAMPUS_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q)
    );
    return [...matchingHazards, ...matchingBuildings].slice(0, 5);
  }, [searchQuery, hazards]);

  const isUpvoted = selectedHazard
    ? upvotedIds.includes(selectedHazard.id)
    : false;
  const isBookmarked = selectedHazard
    ? bookmarkedIds.includes(selectedHazard.id)
    : false;

  const getPinStyle = (h: Hazard) => {
    if (h.status === 'Resolved') {
      return {
        bg: 'bg-primary text-on-primary',
        icon: 'check_circle',
      };
    }
    if (h.severity === 'high') {
      return {
        bg: 'bg-secondary text-on-secondary',
        icon: h.category === 'elevator' ? 'elevator' : 'construction',
      };
    }
    if (h.severity === 'medium') {
      return {
        bg: 'bg-tertiary-container text-on-tertiary-container',
        icon: 'warning',
      };
    }
    return {
      bg: 'bg-tertiary text-on-tertiary',
      icon: 'blind',
    };
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="flex flex-col flex-1">
        {/* Interactive Map Viewport */}
        <div className="flex flex-col">
          <div className="relative w-full h-[390px] bg-surface-container overflow-hidden">
            {/* Interactive Zoomable SVG Campus Map */}
            <div
              className="absolute inset-0 bg-[#eef3fb] transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg
                className="w-full h-full object-cover"
                fill="none"
                viewBox="0 0 420 620"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="campus-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 24 0 L 0 0 0 24"
                      fill="none"
                      stroke="#d7e0f5"
                      strokeWidth="0.8"
                    />
                  </pattern>
                  <filter
                    id="soft-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="130%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodColor="#141b2b"
                      floodOpacity="0.12"
                    />
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="#edf2fa" />
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#campus-grid)"
                  opacity="0.75"
                />

                {/* Green Quadrangles & Lawns */}
                <rect
                  x="52"
                  y="190"
                  width="130"
                  height="96"
                  rx="8"
                  fill="#d2ede3"
                />
                <circle cx="117" cy="238" r="26" fill="#badfd2" />
                <rect
                  x="230"
                  y="270"
                  width="134"
                  height="85"
                  rx="10"
                  fill="#d2ede3"
                />

                {/* Campus Buildings */}
                <path
                  d="M40 330 H160 V430 H40 Z"
                  fill="#ffffff"
                  filter="url(#soft-shadow)"
                />
                <rect
                  x="48"
                  y="338"
                  width="104"
                  height="84"
                  rx="4"
                  fill="#e9edff"
                />
                <text
                  x="100"
                  y="385"
                  textAnchor="middle"
                  fill="#3d4946"
                  fontSize="10"
                  fontWeight="700"
                >
                  ENGINEERING BLDG
                </text>

                <path
                  d="M190 120 H360 V220 H190 Z"
                  fill="#ffffff"
                  filter="url(#soft-shadow)"
                />
                <rect
                  x="198"
                  y="128"
                  width="154"
                  height="84"
                  rx="4"
                  fill="#e9edff"
                />
                <text
                  x="275"
                  y="174"
                  textAnchor="middle"
                  fill="#3d4946"
                  fontSize="10"
                  fontWeight="700"
                >
                  MAIN ADMIN BLDG
                </text>

                <path
                  d="M240 390 H370 V490 H240 Z"
                  fill="#ffffff"
                  filter="url(#soft-shadow)"
                />
                <rect
                  x="248"
                  y="398"
                  width="114"
                  height="84"
                  rx="4"
                  fill="#e9edff"
                />
                <text
                  x="305"
                  y="445"
                  textAnchor="middle"
                  fill="#3d4946"
                  fontSize="10"
                  fontWeight="700"
                >
                  SCIENCE COMPLEX
                </text>

                {/* Covered Primary Walkways & Ramps */}
                <path
                  d="M100 330 L100 240 Q100 200 150 200 L230 200 L230 170"
                  stroke="#bcc9c5"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M100 330 L100 240 Q100 200 150 200 L230 200 L230 170"
                  stroke="#ffffff"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Blocked Direct Corridor */}
                <path
                  d="M150 200 L240 200"
                  stroke="#fd6442"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />

                {/* Active Recommended Accessible Route */}
                {showAllLayers && (
                  <>
                    <path
                      d="M100 350 L100 270 Q100 240 140 240 L200 240 Q220 240 220 210 L220 180"
                      stroke="#008373"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M100 350 L100 270 Q100 240 140 240 L200 240 Q220 240 220 210 L220 180"
                      stroke="#83f6e0"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Secondary Tactile Paving Pathway */}
                <path
                  d="M160 380 L240 380 L240 420"
                  stroke={activeFilter === 'vision' ? '#b15f00' : '#bcc9c5'}
                  strokeWidth={activeFilter === 'vision' ? '7' : '6'}
                  strokeLinecap="round"
                />
              </svg>

              {/* Current User Location Marker */}
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Engineering Plaza: Verified step-free surface (Current Location)'
                  )
                }
                style={{ left: '22%', top: '55%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 cursor-pointer focus-visible:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container-lowest shadow-[0_2px_10px_rgba(0,104,91,0.35)] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-on-primary" />
                    </div>
                  </div>
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container text-[11px] font-bold shadow-md whitespace-nowrap">
                  You are here
                </span>
              </button>

              {/* Dynamic Hazard Pins */}
              {hazards.map((h) => {
                const isSelected = h.id === selectedHazard?.id;
                const style = getPinStyle(h);
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-label={h.title}
                    onClick={() => {
                      onSelectHazard(h.id);
                      onShowToast(`Focused: ${h.title}`);
                    }}
                    style={{
                      left: `${h.mapCoords.x}%`,
                      top: `${h.mapCoords.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform cursor-pointer focus-visible:outline-none ${
                      isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${style.bg} shadow-lg flex items-center justify-center ${
                        isSelected
                          ? 'ring-4 ring-surface-container-lowest'
                          : 'ring-2 ring-surface-container-lowest'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px] material-symbols-filled">
                        {style.icon}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="mt-1 px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-bold text-[10px] shadow-sm whitespace-nowrap max-w-[140px] truncate">
                        {h.building}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TOP FLOATING SEARCH & FILTER BAR */}
            <div className="absolute top-0 inset-x-0 p-3 z-30 flex flex-col gap-2 pointer-events-none">
              <div className="pointer-events-auto relative">
                <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_16px_rgba(20,27,43,0.12)] flex items-center min-h-[52px] px-3.5 gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search accessible routes"
                    placeholder="Search campus buildings, accessible ramps..."
                    className="flex-1 bg-transparent border-0 outline-none text-on-surface placeholder:text-on-surface-variant text-sm min-w-0"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery('')}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Voice Search"
                    onClick={() =>
                      onShowToast(
                        'Voice search listening: say a CIT-U building name'
                      )
                    }
                    className="w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container active:scale-95 flex items-center justify-center transition-transform"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      mic
                    </span>
                  </button>
                </div>

                {/* Live Search Dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-1.5 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 overflow-hidden">
                    {searchResults.map((res) => (
                      <button
                        key={res.id + res.name}
                        type="button"
                        onClick={() => {
                          onSelectHazard(res.hazardId);
                          setSearchQuery('');
                          onShowToast(`Navigated map to ${res.name}`);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-surface-container-low flex items-center justify-between gap-2 border-b last:border-b-0 border-outline-variant/25"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-on-surface truncate">
                            {res.name}
                          </div>
                          <div className="text-xs text-on-surface-variant truncate">
                            {res.subtitle}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                          north_east
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Horizontal Scrollable Filter Chips */}
              <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {FILTER_CHIPS.map((chip) => {
                  const isActive = activeFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        onSelectFilter(chip.id);
                        onShowToast(`Map filter set: ${chip.label}`);
                      }}
                      className={`min-h-[44px] px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all active:scale-95 ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high shadow-sm'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isActive ? 'material-symbols-filled' : ''
                        }`}
                      >
                        {chip.icon}
                      </span>
                      <span>{chip.label}</span>
                      {isActive && (
                        <span className="material-symbols-outlined text-[16px]">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT EDGE FLOATING ACTION TOOLS */}
            <div className="absolute right-3 bottom-8 z-30 flex flex-col gap-2 items-end">
              <button
                type="button"
                onClick={onOpenReport}
                className="h-11 px-4 rounded-full bg-secondary text-on-secondary shadow-xl flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[19px] material-symbols-filled">
                  crisis_alert
                </span>
                <span>Pin Hazard</span>
              </button>

              <button
                type="button"
                aria-label="Toggle Accessibility Layers"
                onClick={() => {
                  setShowAllLayers((v) => !v);
                  onShowToast(
                    showAllLayers
                      ? 'Accessible route overlay hidden'
                      : 'Accessible route overlay visible'
                  );
                }}
                className={`w-11 h-11 rounded-xl shadow-md flex items-center justify-center active:scale-90 transition-transform ${
                  showAllLayers
                    ? 'bg-surface-container-lowest text-primary'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  layers
                </span>
              </button>

              <button
                type="button"
                aria-label="Re-center to my location"
                onClick={() => {
                  setZoom(1);
                  onShowToast('Re-centered on Engineering Plaza (GPS ±2m)');
                }}
                className="w-11 h-11 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container shadow-md flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[24px]">
                  my_location
                </span>
              </button>

              <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden">
                <button
                  type="button"
                  aria-label="Zoom In"
                  onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.15).toFixed(2)))}
                  className="w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    add
                  </span>
                </button>
                <div className="w-full h-px bg-surface-container" />
                <button
                  type="button"
                  aria-label="Zoom Out"
                  onClick={() => setZoom((z) => Math.max(0.9, +(z - 0.15).toFixed(2)))}
                  className="w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    remove
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overlapping Mobile Bottom Sheet */}
        <div className="flex flex-col gap-4 -mt-5 z-30">
          {selectedHazard && (
            <div className="w-full bg-surface-container-lowest rounded-t-3xl shadow-[0_-8px_30px_rgba(20,27,43,0.12)] px-4 pt-3 pb-5 flex flex-col gap-3.5 border-t border-outline-variant/30">
              {/* Mobile drag handle */}
              <div className="w-12 h-1.5 rounded-full bg-surface-container-highest mx-auto my-0.5" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                    <span className="material-symbols-outlined text-[16px] material-symbols-filled">
                      {selectedHazard.status === 'Resolved' ? 'task_alt' : 'block'}
                    </span>
                    <span>
                      {selectedHazard.status === 'Resolved'
                        ? 'RESOLVED ACCESS'
                        : selectedHazard.severity === 'high'
                        ? 'BLOCKED ACCESSIBILITY'
                        : 'CAUTION ADVISORY'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-on-surface-variant">
                      {selectedHazard.ticketCode}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-on-surface leading-snug">
                    {selectedHazard.title}
                  </h2>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                      location_on
                    </span>
                    <span className="truncate">{selectedHazard.location}</span>
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Bookmark hazard"
                  onClick={() => onToggleBookmark(selectedHazard.id)}
                  className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isBookmarked
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isBookmarked ? 'material-symbols-filled' : ''
                    }`}
                  >
                    bookmark
                  </span>
                </button>
              </div>

              {/* Verification Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-surface-container-low text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[17px]">
                    schedule
                  </span>
                  <span>Reported {selectedHazard.reportedAgo}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[17px]">
                    verified_user
                  </span>
                  <span>
                    Verified by {selectedHazard.verifiedCount} campus scouts
                  </span>
                </div>
              </div>

              {/* Photo Evidence & Verified Detour */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenHazardDetail(selectedHazard.id)}
                  className="col-span-1 h-22 rounded-xl overflow-hidden relative shadow-sm group"
                >
                  <ResilientImage
                    src={selectedHazard.photoUrl}
                    alt={selectedHazard.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    fallbackIcon="elevator"
                    fallbackLabel="Photo"
                  />
                  <span className="absolute bottom-1 right-1 bg-inverse-surface/85 text-inverse-on-surface text-[10px] px-1.5 py-0.5 rounded font-bold">
                    Photo
                  </span>
                </button>

                <div className="col-span-2 p-3 rounded-xl bg-surface-container flex flex-col justify-center gap-0.5 min-w-0">
                  <div className="flex items-center gap-1 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-[17px]">
                      alt_route
                    </span>
                    <span>Verified Safe Detour</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {selectedHazard.detourTitle}
                  </p>
                  <span className="text-[11px] font-medium text-on-surface-variant truncate">
                    {selectedHazard.detourSlope}
                  </span>
                </div>
              </div>

              {/* Community Voting & Primary Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleUpvote(selectedHazard.id)}
                    className={`min-w-[64px] min-h-[46px] px-3 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold tabular-nums active:scale-95 transition-all ${
                      isUpvoted
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px] material-symbols-filled">
                      thumb_up
                    </span>
                    <span>{selectedHazard.upvotes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReportCleared(selectedHazard.id)}
                    className="min-w-[56px] min-h-[46px] px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center gap-1.5 text-sm font-bold tabular-nums active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      thumb_down
                    </span>
                    <span>{selectedHazard.downvotes}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1 justify-end">
                  <button
                    type="button"
                    onClick={onOpenRouteCompare}
                    className="flex-1 min-h-[46px] max-w-[165px] px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      directions
                    </span>
                    <span>Reroute Me</span>
                  </button>

                  <button
                    type="button"
                    aria-label="View Hazard Details"
                    onClick={() => onOpenHazardDetail(selectedHazard.id)}
                    className="min-w-[46px] min-h-[46px] rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      info
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nearby Campus Alerts Feed */}
          <div className="px-4 flex flex-col gap-2.5 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  radar
                </span>
                <span>
                  Nearby Campus Alerts (
                  {hazards.filter((h) => h.status !== 'Resolved').length} Active)
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAllAlerts((v) => !v)}
                className="text-xs font-bold text-primary hover:underline min-h-[36px] px-2"
              >
                {showAllAlerts ? 'Show Less' : 'View All'}
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-start justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onSelectHazard(alert.id)}
                    className="flex items-start gap-3 min-w-0 flex-1 text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        alert.severity === 'high'
                          ? 'bg-secondary text-on-secondary'
                          : alert.status === 'Resolved'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-tertiary-container text-on-tertiary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[21px]">
                        {alert.status === 'Resolved'
                          ? 'task_alt'
                          : alert.severity === 'high'
                          ? 'construction'
                          : 'warning'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface truncate">
                          {alert.title}
                        </span>
                        <span className="text-[11px] font-bold text-tertiary shrink-0">
                          {alert.status === 'Resolved'
                            ? 'RESOLVED'
                            : alert.severity === 'high'
                            ? 'BLOCKED'
                            : 'CAUTION'}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        {alert.location}
                      </p>
                      <span className="text-[11px] font-semibold text-primary mt-1 truncate">
                        {alert.detourSubtitle}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-label={`Route bypass for ${alert.title}`}
                    onClick={onOpenRouteCompare}
                    className="min-w-[44px] min-h-[44px] rounded-full text-primary hover:bg-surface-container flex items-center justify-center active:scale-90 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      turn_right
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
