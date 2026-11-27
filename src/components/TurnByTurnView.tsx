import React, { useState } from 'react';

interface TurnByTurnViewProps {
  onEndRoute: () => void;
  onReportBlockage: () => void;
  onRequestEscort: () => void;
  onShowToast: (msg: string) => void;
}

const WAYPOINTS = [
  {
    id: 0,
    hudTitle: 'In 40m, turn left',
    hudSubtitle: 'East Covered Walkway',
    nextPreview: 'Then: East Wing Service Lift B to 3rd Floor',
    nextDistance: '80m',
    stepLabel: 'Next Maneuver · 40m',
    title: 'Turn left into East Covered Walkway',
    description:
      'Automatic sliding doors ahead with motion trigger. Sensor clearance 110cm.',
    helperNote:
      'Automatic push pad switch located at 90cm height on left pillar.',
    icon: 'turn_left',
    puckPos: { x: 195, y: 290 },
    etaMins: 6,
    distMeters: 320,
  },
  {
    id: 1,
    hudTitle: 'In 80m, ascend ramp',
    hudSubtitle: 'East Wing Ramp 1 (3.8% slope)',
    nextPreview: 'Then: East Service Lift B to Level 3',
    nextDistance: '120m',
    stepLabel: 'Step 2 · 80m',
    title: 'Ascend East Wing Ramp 1',
    description:
      'Dual-level steel handrails on both sides, tactile yellow truncated domes at entry and exit.',
    helperNote: 'Smooth concrete surface, width 150cm.',
    icon: 'ramp_right',
    puckPos: { x: 120, y: 185 },
    etaMins: 4,
    distMeters: 210,
  },
  {
    id: 2,
    hudTitle: 'Take Lift B to Level 3',
    hudSubtitle: 'East Wing Service Elevator',
    nextPreview: 'Then: Department Office Suite 302',
    nextDistance: '35m',
    stepLabel: 'Step 3 · 120m',
    title: 'Take East Service Lift B to Level 3',
    description:
      'Spacious 16-person cabin. Audio floor announcement and Braille horizontal button bar active.',
    helperNote: 'Confirmed working 4 min ago by Scout Maria L.',
    icon: 'elevator',
    puckPos: { x: 255, y: 140 },
    etaMins: 2,
    distMeters: 95,
  },
  {
    id: 3,
    hudTitle: 'Arriving in 35m',
    hudSubtitle: 'Department Office Suite 302 (3rd Floor)',
    nextPreview: 'Destination reached safely',
    nextDistance: '0m',
    stepLabel: 'Arrival · 35m',
    title: 'Department Office Suite 302',
    description: 'Wide double-door opening with level threshold sill.',
    helperNote: 'Step-free arrival verified.',
    icon: 'pin_drop',
    puckPos: { x: 285, y: 68 },
    etaMins: 1,
    distMeters: 35,
  },
];

export const TurnByTurnView: React.FC<TurnByTurnViewProps> = ({
  onEndRoute,
  onReportBlockage,
  onRequestEscort,
  onShowToast,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [is3DView, setIs3DView] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const current = WAYPOINTS[activeStep];

  const speakCue = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
      }
    } catch {
      // ignore if speech synthesis is unavailable
    }
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) {
      speakCue(`${current.hudTitle}. ${current.hudSubtitle}`);
      onShowToast('Voice announcements set to detailed accessibility mode.');
    } else {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
      onShowToast('Voice navigation paused. Visual and haptic cues active.');
    }
  };

  const handleSelectStep = (idx: number) => {
    setActiveStep(idx);
    const wp = WAYPOINTS[idx];
    if (voiceEnabled) {
      speakCue(`${wp.hudTitle}. ${wp.hudSubtitle}`);
    }
    onShowToast(`Navigated to: ${wp.title}`);
  };

  const handleShareEta = async () => {
    const shareText = `PathFinder Access Live ETA: Arriving at NGE Building Suite 302 around 10:48 AM (${current.etaMins} min remaining via East Covered Walkway).`;
    try {
      await navigator.clipboard?.writeText(shareText);
    } catch {
      // ignore clipboard errors
    }
    onShowToast(
      'Live tracking link copied with 10:48 AM accessible arrival window.'
    );
  };

  return (
    <div className="w-full px-4 py-3 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* Guidance HUD + Interactive Route Map */}
        <div className="flex flex-col gap-3">
          {/* Top Navigation Guidance HUD */}
          <div className="bg-primary text-on-primary rounded-2xl shadow-xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-full bg-on-primary text-primary flex items-center justify-center shadow-md shrink-0">
                  <span className="material-symbols-outlined text-[34px] material-symbols-filled">
                    {current.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xl font-bold leading-tight text-on-primary tracking-tight">
                    {current.hudTitle}
                  </span>
                  <span className="text-sm text-on-primary-container opacity-95 truncate">
                    {current.hudSubtitle}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label={
                  voiceEnabled ? 'Voice Guidance Enabled' : 'Voice Guidance Muted'
                }
                onClick={handleToggleVoice}
                className={`min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0 ${
                  voiceEnabled
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {voiceEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>
            </div>

            {/* Sub-specs */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-on-primary">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  accessible_forward
                </span>
                Step-Free (0 Stairs)
              </span>
              <span className="inline-flex items-center gap-1 opacity-90">
                <span className="material-symbols-outlined text-[16px]">
                  texture
                </span>
                Smooth Pavers
              </span>
              <span className="inline-flex items-center gap-1 opacity-90">
                <span className="material-symbols-outlined text-[16px]">
                  roofing
                </span>
                Covered Canopy
              </span>
            </div>

            {/* Next maneuver preview */}
            <div className="flex items-center justify-between pt-2 border-t border-on-primary/20 text-on-primary/90 text-xs font-semibold">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[18px]">
                  subdirectory_arrow_right
                </span>
                <span className="truncate">{current.nextPreview}</span>
              </div>
              <span className="font-mono tabular-nums shrink-0 ml-2">
                {current.nextDistance}
              </span>
            </div>
          </div>

          {/* Active Reroute Banner + End Button */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 bg-secondary-fixed text-on-secondary-fixed px-3.5 py-2.5 rounded-xl shadow-sm min-w-0">
              <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">
                alt_route
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold leading-tight truncate">
                  Reroute Active (Detour 1)
                </span>
                <span className="text-[11px] leading-tight text-secondary truncate">
                  Avoids broken Main Quad Elevator
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="min-w-[48px] h-11 px-4 rounded-xl bg-surface-container-high text-secondary font-bold text-sm flex items-center justify-center gap-1 shadow-sm hover:bg-error-container active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
              <span>End</span>
            </button>
          </div>

          {/* Stylized Campus Map Canvas */}
          <div className="relative w-full h-[300px] overflow-hidden rounded-2xl bg-surface-container-low shadow-inner border border-outline-variant/35">
            <svg
              className={`absolute inset-0 w-full h-full transition-transform duration-300 ${
                is3DView ? 'scale-105 -skew-x-3' : ''
              }`}
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 390 360"
            >
              <defs>
                <pattern
                  id="campusGridTBT"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    opacity="0.45"
                    stroke="#d3daef"
                    strokeWidth="0.8"
                  />
                </pattern>
                <linearGradient
                  id="activeRouteGrad"
                  x1="0%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00685b" />
                  <stop offset="100%" stopColor="#65dac4" />
                </linearGradient>
              </defs>

              <rect width="390" height="360" fill="#f1f3ff" />
              <rect
                width="390"
                height="360"
                fill="url(#campusGridTBT)"
              />

              {/* Buildings */}
              <rect
                x="20"
                y="20"
                width="130"
                height="90"
                rx="8"
                fill="#ffffff"
                stroke="#bcc9c5"
                strokeWidth="1.5"
              />
              <text
                x="85"
                y="60"
                textAnchor="middle"
                fill="#3d4946"
                fontSize="11"
                fontWeight="700"
              >
                ENGINEERING HALL
              </text>
              <text
                x="85"
                y="74"
                textAnchor="middle"
                fill="#6d7a76"
                fontSize="9"
              >
                CIT-U Campus Center
              </text>

              <rect
                x="230"
                y="30"
                width="140"
                height="110"
                rx="8"
                fill="#ffffff"
                stroke="#bcc9c5"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="80"
                textAnchor="middle"
                fill="#3d4946"
                fontSize="11"
                fontWeight="700"
              >
                CIT-U COMPLEX
              </text>
              <text
                x="300"
                y="94"
                textAnchor="middle"
                fill="#00685b"
                fontSize="9"
                fontWeight="600"
              >
                Ramp A Access
              </text>

              <rect
                x="20"
                y="230"
                width="110"
                height="120"
                rx="8"
                fill="#ffffff"
                stroke="#bcc9c5"
                strokeWidth="1.5"
              />
              <text
                x="75"
                y="290"
                textAnchor="middle"
                fill="#3d4946"
                fontSize="10"
                fontWeight="700"
              >
                ADMIN BLDG
              </text>

              {/* Blocked Pathway */}
              <path
                d="M 195 290 L 195 125 L 210 125"
                stroke="#ffb4a3"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeWidth="10"
              />
              <path
                d="M 195 290 L 195 125 L 210 125"
                opacity="0.8"
                stroke="#b02e10"
                strokeDasharray="4 6"
                strokeLinecap="round"
                strokeWidth="3"
              />

              {/* Active Reroute Path */}
              <path
                d="M 195 290 L 195 250 Q 195 230 170 230 L 140 230 Q 120 230 120 200 L 120 160 Q 120 140 150 140 L 255 140 Q 285 140 285 110 L 285 60"
                opacity="0.45"
                stroke="#83f6e0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="14"
              />
              <path
                d="M 195 290 L 195 250 Q 195 230 170 230 L 140 230 Q 120 230 120 200 L 120 160 Q 120 140 150 140 L 255 140 Q 285 140 285 110 L 285 60"
                stroke="#00685b"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
              />

              {/* Blocked Landmark Marker */}
              <g transform="translate(195, 125)">
                <circle cx="0" cy="0" r="16" fill="#ba1a1a" />
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  opacity="0.75"
                  stroke="#ba1a1a"
                  strokeDasharray="3 3"
                  strokeWidth="2"
                />
                <path
                  d="M -6 -6 L 6 6 M 6 -6 L -6 6"
                  stroke="#ffffff"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </g>

              {/* Target Destination Pin */}
              <g transform="translate(285, 45)">
                <ellipse
                  cx="0"
                  cy="14"
                  rx="8"
                  ry="3"
                  fill="#141b2b"
                  opacity="0.25"
                />
                <path
                  d="M 0 0 C -10 -12 -12 -22 0 -32 C 12 -22 10 -12 0 0 Z"
                  fill="#00685b"
                />
                <circle cx="0" cy="-20" r="5" fill="#ffffff" />
              </g>

              {/* Animated User Wheelchair Puck */}
              <g
                transform={`translate(${current.puckPos.x}, ${current.puckPos.y})`}
                className="transition-all duration-500"
              >
                <path
                  d="M 0 0 L -24 -60 L 24 -60 Z"
                  fill="url(#activeRouteGrad)"
                  opacity="0.28"
                />
                <circle cx="0" cy="0" r="16" fill="#00685b" />
                <circle cx="0" cy="0" r="14" fill="#ffffff" />
                <circle cx="0" cy="0" r="10" fill="#00685b" />
                <path
                  d="M -3 -1 C -3 -3 0 -5 2 -4 M 0 2 C 1.5 2 3 0.5 3 -1 L 1 -1 M -1 4 C -3 4 -5 2 -5 0 C -5 -2 -3 -4 -1 -4"
                  fill="none"
                  stroke="#ffffff"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>

            {/* Map Overlay Tags */}
            <div className="absolute top-[92px] left-[34%] pointer-events-none">
              <div className="bg-error-container text-on-error-container px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  elevator
                </span>
                <span>Main Lift Out of Service</span>
              </div>
            </div>

            <div className="absolute top-[200px] left-[5%] pointer-events-none">
              <div className="bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-primary text-[14px]">
                  turn_left
                </span>
                <span>East Canopy Junction (40m)</span>
              </div>
            </div>

            {/* Right Floating Map Controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-2 z-20">
              <button
                type="button"
                aria-label="Re-center Navigation"
                onClick={() =>
                  onShowToast('Re-centered on live wheelchair beacon')
                }
                className="w-11 h-11 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[22px] material-symbols-filled">
                  my_location
                </span>
              </button>
              <button
                type="button"
                aria-label="Toggle 3D Perspective"
                onClick={() => {
                  setIs3DView((v) => !v);
                  onShowToast(
                    is3DView ? '2D Top-Down View' : '3D Corridor Perspective'
                  );
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform ${
                  is3DView
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  view_in_ar
                </span>
              </button>
              <button
                type="button"
                aria-label="Audio Beacon Aid"
                onClick={() => {
                  speakCue(`${current.hudTitle}. ${current.description}`);
                  onShowToast('Audio beacon chime played');
                }}
                className="w-11 h-11 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[22px]">
                  hearing
                </span>
              </button>
            </div>

            {/* Report Blockage Floating Pill */}
            <div className="absolute left-3 bottom-3 z-20">
              <button
                type="button"
                onClick={onReportBlockage}
                className="h-11 px-4 rounded-full bg-secondary text-on-secondary shadow-lg flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[19px]">
                  report
                </span>
                <span>Report Blockage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics + Interactive 4-Step Timeline */}
        <div className="flex flex-col gap-4">
          {/* Live Route Summary Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-4 flex flex-col gap-3 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-2xl font-extrabold text-primary">
                  {current.etaMins} min
                </span>
                <span className="text-sm text-on-surface-variant">
                  ({current.distMeters} meters)
                </span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-xs font-bold tabular-nums">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  schedule
                </span>
                <span>ETA 10:48 AM</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-surface-container-low text-center">
                <div className="flex items-center justify-center gap-1 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">
                    stairs
                  </span>
                  <span>0 Steps</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Flat Access
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low text-center">
                <div className="flex items-center justify-center gap-1 text-primary text-xs font-bold tabular-nums">
                  <span className="material-symbols-outlined text-[16px]">
                    trending_up
                  </span>
                  <span>4.2% Max</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Gentle Incline
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low text-center">
                <div className="flex items-center justify-center gap-1 text-tertiary text-xs font-bold tabular-nums">
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>+4 min saved</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  vs Quad detour
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Timeline */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  conversion_path
                </span>
                <h2 className="text-base font-bold text-on-surface">
                  Accessible Route Guidance
                </h2>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant tabular-nums">
                {WAYPOINTS.length - activeStep} Steps Remaining
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {WAYPOINTS.map((wp, idx) => {
                const isActive = idx === activeStep;
                const isDone = idx < activeStep;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleSelectStep(idx)}
                    className={`w-full text-left rounded-xl p-3.5 transition-all flex items-start gap-3 border ${
                      isActive
                        ? 'bg-surface-container-lowest border-primary shadow-md ring-1 ring-primary/20'
                        : isDone
                        ? 'bg-surface-container-low border-outline-variant/25 opacity-75'
                        : 'bg-surface-container-lowest border-outline-variant/25 shadow-sm hover:bg-surface-container-low'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-sm'
                          : isDone
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[21px]">
                        {isDone ? 'check' : wp.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold tracking-wide ${
                            isActive ? 'text-primary' : 'text-on-surface-variant'
                          }`}
                        >
                          {wp.stepLabel}
                        </span>
                        {isActive && (
                          <span className="text-[11px] font-bold text-primary">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-on-surface mt-0.5">
                        {wp.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {wp.description}
                      </p>
                      {isActive && (
                        <div className="mt-2 p-2 rounded-lg bg-surface-container flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
                            radio_button_checked
                          </span>
                          <span className="text-xs font-medium">
                            {wp.helperNote}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {activeStep < WAYPOINTS.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSelectStep(activeStep + 1)}
                className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
              >
                <span>Advance to Next Waypoint</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onEndRoute}
                className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                <span>Finish Navigation &amp; Return to Map</span>
              </button>
            )}
          </div>

          {/* Share ETA & Campus Escort */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleShareEta}
              className="min-h-[50px] px-4 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container-highest active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                share_location
              </span>
              <span>Share ETA</span>
            </button>
            <button
              type="button"
              onClick={onRequestEscort}
              className="min-h-[50px] px-4 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                support_agent
              </span>
              <span>Campus Escort</span>
            </button>
          </div>
        </div>
      </div>

      {/* End Route Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-on-surface">
              End Active Navigation?
            </h3>
            <p className="text-sm text-on-surface-variant">
              You are currently following the step-free detour via East Covered
              Walkway. Return to the main CIT-U Campus Map?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="min-h-[44px] px-4 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high"
              >
                Keep Navigating
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndConfirm(false);
                  onEndRoute();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-secondary text-on-secondary font-semibold text-sm hover:opacity-95"
              >
                End Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
