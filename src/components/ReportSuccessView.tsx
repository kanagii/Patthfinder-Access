import React, { useState } from 'react';
import { Hazard } from '../types';

interface ReportSuccessViewProps {
  submittedHazard: Hazard | null;
  karmaPoints: number;
  streakDays: number;
  onBackToMap: () => void;
  onTrackReport: (hazardId: string) => void;
  onNewReport: () => void;
  onShowToast: (msg: string) => void;
}

export const ReportSuccessView: React.FC<ReportSuccessViewProps> = ({
  submittedHazard,
  karmaPoints,
  streakDays,
  onBackToMap,
  onTrackReport,
  onNewReport,
  onShowToast,
}) => {
  const [shared, setShared] = useState(false);

  const levelTarget = 2000;
  const pct = Math.min(100, Math.round((karmaPoints / levelTarget) * 100));
  const remaining = Math.max(0, levelTarget - karmaPoints);

  const handleShareBadge = async () => {
    try {
      await navigator.clipboard?.writeText(
        `I just unlocked +25 Scout Karma and the Campus Pathfinder badge on PathFinder Access CIT-U!`
      );
    } catch {
      // ignore
    }
    setShared(true);
    onShowToast('Achievement copied to clipboard!');
    setTimeout(() => setShared(false), 2200);
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      {/* Celebratory Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 text-center shadow-md flex flex-col items-center border border-outline-variant/25">
        <div className="relative flex items-center justify-center my-3">
          <div className="w-20 h-20 rounded-full bg-primary-fixed/60 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg text-on-primary">
              <span className="material-symbols-outlined text-4xl font-bold material-symbols-filled">
                check
              </span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1.5">
          <span className="material-symbols-outlined text-[16px] material-symbols-filled">
            verified
          </span>
          CIT-U MOBILITY SHIELD ACTIVE
        </span>

        <h2 className="text-2xl font-extrabold text-on-surface">
          Report Submitted!
        </h2>
        <p className="text-sm text-on-surface-variant max-w-md mt-1">
          {submittedHazard
            ? `${submittedHazard.title} is now live on the CIT-U campus map.`
            : 'Thank you for keeping CIT-U accessible, barrier-free, and safe for all Wildcats.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Karma Points & Streak Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-md flex flex-col justify-between gap-4 border border-outline-variant/25">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">
                  military_tech
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  Karma Unlocked
                </span>
                <p className="text-lg font-extrabold text-on-surface tabular-nums">
                  +25 Karma Points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-tertiary tabular-nums">
              <span className="material-symbols-outlined text-[18px] material-symbols-filled">
                local_fire_department
              </span>
              <span>{streakDays}-Day Streak</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  shield
                </span>
                Level 4 Pathfinder Scout
              </span>
              <span className="text-on-surface-variant">Target: Level 5</span>
            </div>
            <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-semibold tabular-nums">
              <span className="text-on-surface">
                {karmaPoints.toLocaleString()} / 2,000 pts ({pct}%)
              </span>
              <span className="text-secondary">
                {remaining.toLocaleString()} pts to Guardian
              </span>
            </div>
          </div>
        </div>

        {/* Badge Unlock Showcase Card */}
        <div className="rounded-2xl bg-surface-container-high p-5 shadow-md flex flex-col justify-between gap-4 border border-outline-variant/25">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-tertiary">
              <span className="material-symbols-outlined text-[16px] material-symbols-filled">
                workspace_premium
              </span>
              NEW BADGE UNLOCKED
            </span>
            <span className="text-xs font-semibold text-on-surface-variant">
              Rank Milestone
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-3xl text-tertiary material-symbols-filled">
                explore
              </span>
              <span className="text-[10px] uppercase font-bold tracking-tight text-on-tertiary-fixed-variant mt-0.5">
                Tier 2
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-on-surface truncate">
                Campus Pathfinder
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Awarded for reporting a verified obstacle and actively helping
                reroute fellow Wildcats around campus blockades.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareBadge}
            className={`w-full min-h-[46px] px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
              shared
                ? 'bg-primary-fixed text-on-primary-fixed'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-dim'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>
              {shared ? 'Achievement Copied!' : 'Share Scout Achievement'}
            </span>
          </button>
        </div>
      </div>

      {/* Immediate Campus Impact */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-md flex flex-col gap-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary material-symbols-filled">
              campaign
            </span>
            Immediate Campus Impact
          </h3>
          <span className="text-xs font-bold text-primary">Live Sync</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                directions_walk
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                6 Students Rerouted
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Active navigation algorithms safely guided students around the
                reported barrier.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                engineering
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-on-surface">
                  Work Ticket Dispatched
                </p>
                <span className="font-mono text-xs text-secondary font-bold">
                  {submittedHazard?.ticketCode ?? '#CIT-FAC-8824'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Automatically routed to CIT-U Facilities Management &amp; Cebu
                City PDAO.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={onBackToMap}
          className="flex-1 min-h-[54px] px-6 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-base flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">map</span>
          <span>Back to Campus Map</span>
        </button>

        {submittedHazard && (
          <button
            type="button"
            onClick={() => onTrackReport(submittedHazard.id)}
            className="min-h-[54px] px-5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-bold text-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[19px]">
              receipt_long
            </span>
            <span>Track Report</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNewReport}
          className="min-h-[54px] px-5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-bold text-sm flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[19px]">
            add_location_alt
          </span>
          <span>New Report</span>
        </button>
      </div>
    </div>
  );
};
