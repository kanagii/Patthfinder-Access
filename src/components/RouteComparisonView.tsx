import React, { useState } from 'react';
import { STITCH_ASSETS } from '../data/initialData';

interface RouteComparisonViewProps {
  onStartNavigation: () => void;
  onShowToast: (msg: string) => void;
}

export const RouteComparisonView: React.FC<RouteComparisonViewProps> = ({
  onStartNavigation,
  onShowToast,
}) => {
  const [swapped, setSwapped] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'B' | 'A'>('B');

  const origin = swapped ? 'NGE Building' : 'Main Gate';
  const destination = swapped ? 'Main Gate' : 'NGE Building';

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      {/* Route Endpoints Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md p-3.5 flex items-center justify-between gap-3 border border-outline-variant/30">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] material-symbols-filled">
              accessible_forward
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider truncate">
              CIT-U Main Campus
            </span>
            <span className="text-base font-bold text-on-surface truncate">
              {origin} → {destination}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Swap route endpoints"
          onClick={() => {
            setSwapped((s) => !s);
            onShowToast(
              `Endpoints swapped: ${destination} → ${origin}`
            );
          }}
          className="min-w-[46px] min-h-[46px] rounded-xl bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container active:scale-95 transition-transform shrink-0"
        >
          <span className="material-symbols-outlined text-[22px]">
            swap_vert
          </span>
        </button>
      </div>

      {/* Stacked Phone Layout: Map + Route Cards */}
      <div className="flex flex-col gap-4">
        {/* Route Comparison Map */}
        <div className="relative w-full h-64 bg-surface-container rounded-2xl overflow-hidden shadow-md border border-outline-variant/30">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${STITCH_ASSETS.campusMapPhoto}')` }}
          />
          <div className="absolute inset-0 bg-surface/25 pointer-events-none" />

          {/* Vector Route Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 320"
            preserveAspectRatio="none"
          >
            {/* Route A (Blocked) */}
            <path
              d="M 65 255 L 155 170 L 245 160 L 330 75"
              fill="none"
              stroke="#b02e10"
              strokeWidth="5"
              strokeDasharray="10 8"
              strokeLinecap="round"
              opacity={selectedRoute === 'A' ? '1' : '0.8'}
            />
            <line
              x1="185"
              y1="152"
              x2="215"
              y2="182"
              stroke="#b02e10"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1="215"
              y1="152"
              x2="185"
              y2="182"
              stroke="#b02e10"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Route B (Step-free Recommended) */}
            <path
              d="M 65 255 Q 110 280 185 265 T 315 165 L 330 75"
              fill="none"
              stroke="#ffffff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <path
              d="M 65 255 Q 110 280 185 265 T 315 165 L 330 75"
              fill="none"
              stroke="#00685b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Alert Banner */}
          <div className="absolute top-3 left-3 right-3 z-20">
            <div className="bg-error-container text-on-error-container rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-error shrink-0 material-symbols-filled">
                warning
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold truncate">
                  Blocked ramp ahead
                </span>
                <span className="text-xs truncate">
                  Main Quad construction · Route A rerouted
                </span>
              </div>
            </div>
          </div>

          {/* Start Marker */}
          <div className="absolute left-[13%] bottom-[16%] -translate-x-1/2 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[19px] material-symbols-filled">
                my_location
              </span>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-surface-container-lowest text-on-surface text-[11px] font-bold shadow-sm whitespace-nowrap">
              {origin}
            </span>
          </div>

          {/* Blockage Icon */}
          <div className="absolute left-[50%] top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[20px] material-symbols-filled">
                block
              </span>
            </div>
          </div>

          {/* Destination Marker */}
          <div className="absolute right-[13%] top-[18%] translate-x-1/2 flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[20px] material-symbols-filled">
                flag
              </span>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-surface-container-lowest text-on-surface text-[11px] font-bold shadow-sm whitespace-nowrap">
              {destination}
            </span>
          </div>

          {/* Floating Step-Free Badge */}
          <div className="absolute right-3 bottom-3 z-20">
            <div className="bg-primary text-on-primary rounded-full px-3.5 py-1.5 shadow-xl flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] material-symbols-filled">
                verified
              </span>
              <span className="text-xs font-bold whitespace-nowrap">
                +4 min, step-free
              </span>
            </div>
          </div>
        </div>

        {/* Route Comparison Cards + Start CTA */}
        <div className="flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">
                Route Comparison
              </h2>
              <span className="text-xs font-bold text-primary">
                Step-Free Mode
              </span>
            </div>

            {/* Route B: Recommended */}
            <button
              type="button"
              onClick={() => setSelectedRoute('B')}
              className={`w-full text-left bg-surface-container-lowest rounded-xl p-4 shadow-md flex flex-col gap-3 active:scale-[0.99] transition-all border ${
                selectedRoute === 'B'
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-outline-variant/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px] material-symbols-filled">
                      directions_walk
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-on-surface">
                        Route B
                      </span>
                      <span className="text-xs font-bold text-primary">
                        · Recommended
                      </span>
                    </div>
                    <span className="text-sm text-on-surface-variant truncate">
                      Via NGE Covered Walkway
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 tabular-nums">
                  <span className="text-lg font-extrabold text-primary">
                    +4 min
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    7 min total
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-outline-variant/25 text-xs font-semibold text-on-surface">
                <span className="inline-flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px] material-symbols-filled">
                    check_circle
                  </span>
                  100% Step-Free
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    trending_up
                  </span>
                  Max 4.2% incline
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    roofing
                  </span>
                  Shaded path
                </span>
              </div>
            </button>

            {/* Route A: Blocked */}
            <button
              type="button"
              onClick={() => {
                setSelectedRoute('A');
                onShowToast(
                  'Route A is currently blocked due to Main Quad Ramp construction.'
                );
              }}
              className={`w-full text-left bg-surface-container-low rounded-xl p-4 shadow-sm flex items-center justify-between gap-3 opacity-90 active:scale-[0.99] transition-all border ${
                selectedRoute === 'A'
                  ? 'border-error ring-2 ring-error/20'
                  : 'border-outline-variant/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] material-symbols-filled">
                    cancel
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-on-surface line-through">
                      Route A
                    </span>
                    <span className="text-xs font-bold text-error">
                      · Blocked
                    </span>
                  </div>
                  <span className="text-sm text-on-surface-variant truncate">
                    Main Quad Ramp · Closed
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-error shrink-0">
                Unavailable
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onStartNavigation}
            className="w-full min-h-[54px] rounded-xl bg-primary text-on-primary font-bold text-base shadow-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[22px] material-symbols-filled">
              navigation
            </span>
            <span>Start Navigation via Route B</span>
          </button>
        </div>
      </div>
    </div>
  );
};
