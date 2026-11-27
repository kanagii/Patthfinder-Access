import React, { useMemo, useState } from 'react';
import {
  ActivityItem,
  BadgeItem,
  CampusPerk,
  LeaderboardEntry,
  Quest,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface RewardsViewProps {
  karmaPoints: number;
  streakDays: number;
  quests: Quest[];
  badges: BadgeItem[];
  perks: CampusPerk[];
  leaderboard: LeaderboardEntry[];
  activities: ActivityItem[];
  onCompleteQuest: (questId: string) => void;
  onRedeemPerk: (perkId: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  karmaPoints,
  streakDays,
  quests,
  badges,
  perks,
  leaderboard,
  activities,
  onCompleteQuest,
  onRedeemPerk,
}) => {
  const [mobileTab, setMobileTab] = useState<'karma' | 'leaderboard'>('karma');

  const levelTarget = 2000;
  const levelProgressPct = Math.min(
    100,
    Math.round((karmaPoints / levelTarget) * 100)
  );
  const pointsRemaining = Math.max(0, levelTarget - karmaPoints);

  const sortedLeaderboard = useMemo(() => {
    return leaderboard
      .map((entry) =>
        entry.isCurrentUser ? { ...entry, points: karmaPoints } : entry
      )
      .sort((a, b) => b.points - a.points);
  }, [leaderboard, karmaPoints]);

  const featuredPerk = perks[0];
  const otherPerks = perks.slice(1);

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      {/* Phone Sub-tab Switcher (matches both Karma & Leaderboard Stitch screens) */}
      <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl">
        <button
          type="button"
          onClick={() => setMobileTab('karma')}
          className={`flex-1 min-h-[42px] rounded-lg text-xs font-bold transition-colors ${
            mobileTab === 'karma'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant'
          }`}
        >
          Scout Karma &amp; Quests
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('leaderboard')}
          className={`flex-1 min-h-[42px] rounded-lg text-xs font-bold transition-colors ${
            mobileTab === 'leaderboard'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant'
          }`}
        >
          Leaderboard &amp; Perks
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* TAB 1: Karma Hero + Community Impact + Quests + Badges */}
        <div
          className={`flex-col gap-5 ${
            mobileTab === 'karma' ? 'flex' : 'hidden'
          }`}
        >
          {/* Top Hero Karma Card */}
          <section className="w-full bg-primary text-on-primary rounded-2xl p-5 shadow-md flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-on-primary/15 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[32px] material-symbols-filled">
                    military_tech
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">
                    CIT-U Campus Scout
                  </span>
                  <h2 className="text-lg font-bold text-on-primary truncate">
                    Level 4 Pathfinder Scout
                  </h2>
                  <span className="text-xs text-on-primary-container/90">
                    CIT-U Cebu Chapter
                  </span>
                </div>
              </div>

              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-16 h-16 -rotate-90"
                  viewBox="0 0 64 64"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-primary-container opacity-50"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray="163.36"
                    strokeDashoffset={
                      163.36 - (163.36 * levelProgressPct) / 100
                    }
                    strokeLinecap="round"
                    className="text-primary-fixed transition-all duration-700"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-on-primary tabular-nums">
                  {levelProgressPct}%
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-3xl font-extrabold text-on-primary tracking-tight">
                  {karmaPoints.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-primary-fixed">
                  Karma Pts
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-fixed tabular-nums">
                <span className="material-symbols-outlined text-[16px]">
                  trending_up
                </span>
                <span>+185 this week</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold tabular-nums">
                <span>Next: Pathfinder Guardian (Lvl 5)</span>
                <span className="text-primary-fixed">
                  {pointsRemaining.toLocaleString()} pts remaining
                </span>
              </div>
              <div className="w-full h-2.5 bg-primary-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-fixed rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-primary-container/60 rounded-xl px-3.5 py-2.5 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed material-symbols-filled">
                  local_fire_department
                </span>
                <span>{streakDays}-Day Scout Streak</span>
              </span>
              <span className="text-primary-fixed">Top 5% Contributor</span>
            </div>
          </section>

          {/* Community Impact 2x2 Grid */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Community Impact
              </h3>
              <span className="text-xs font-bold text-primary">
                CIT-U Real-Time
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex flex-col gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[21px]">
                    flag
                  </span>
                </div>
                <span className="text-xl font-extrabold text-on-surface tabular-nums">
                  38
                </span>
                <span className="text-xs font-bold text-on-surface">
                  Obstacles Reported
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  34 confirmed by facilities &amp; students
                </p>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex flex-col gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[21px]">
                    alt_route
                  </span>
                </div>
                <span className="text-xl font-extrabold text-on-surface tabular-nums">
                  2,410
                </span>
                <span className="text-xs font-bold text-on-surface">
                  Detours Assisted
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Saved ~160 hrs of blocked transit
                </p>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex flex-col gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[21px]">
                    task_alt
                  </span>
                </div>
                <span className="text-xl font-extrabold text-on-surface tabular-nums">
                  14
                </span>
                <span className="text-xs font-bold text-on-surface">
                  Hazards Cleared
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Fixed by CIT-U Facilities via your tickets
                </p>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex flex-col gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[21px]">
                    verified
                  </span>
                </div>
                <span className="text-xl font-extrabold text-on-surface tabular-nums">
                  99.2%
                </span>
                <span className="text-xs font-bold text-on-surface">
                  Trust Accuracy
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Gold Tier peer verification score
                </p>
              </div>
            </div>
          </section>

          {/* Active Campus Quests */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Active Campus Quests
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                Refreshes in 4h
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border border-outline-variant/25 flex flex-col gap-3 ${
                    q.completed
                      ? 'bg-surface-container-low opacity-85'
                      : 'bg-surface-container-lowest shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                          q.completed
                            ? 'bg-primary-fixed text-on-primary-fixed'
                            : q.accentColor === 'tertiary'
                            ? 'bg-surface-container text-tertiary'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {q.completed ? 'check' : q.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`block text-sm font-bold text-on-surface ${
                            q.completed ? 'line-through opacity-75' : ''
                          }`}
                        >
                          {q.title}
                        </span>
                        <span className="block text-xs text-on-surface-variant mt-0.5">
                          {q.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0 tabular-nums">
                      +{q.points} pts
                    </span>
                  </div>

                  {!q.completed && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          {q.accentColor === 'tertiary'
                            ? 'schedule'
                            : 'location_on'}
                        </span>
                        <span>{q.meta}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onCompleteQuest(q.id)}
                        className="min-h-[44px] px-4 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container active:scale-95 transition-all"
                      >
                        {q.accentColor === 'tertiary'
                          ? 'Complete Audit'
                          : 'Verify Now'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Scout Badges */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Scout Badges
              </h3>
              <span className="text-xs font-bold text-primary">
                5 / {badges.length} Unlocked
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/25 flex flex-col items-center text-center gap-1.5"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${b.bgClass} ${b.textClass} flex items-center justify-center shadow-inner`}
                  >
                    <span className="material-symbols-outlined text-[24px] material-symbols-filled">
                      {b.icon}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-on-surface truncate w-full">
                    {b.title}
                  </span>
                  <span className="text-[11px] text-on-surface-variant line-clamp-2">
                    {b.description}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                      b.status === 'In Progress'
                        ? 'text-tertiary'
                        : 'text-primary'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* TAB 2: Weekly Leaderboard + Featured Cafe Voucher + Perks + Recent Activity */}
        <div
          className={`flex-col gap-5 ${
            mobileTab === 'leaderboard' ? 'flex' : 'hidden'
          }`}
        >
          {/* Weekly Campus Leaderboard */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Weekly Campus Leaderboard
              </h3>
              <span className="text-xs font-semibold text-on-surface-variant">
                Resets Sun
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm border border-outline-variant/25 flex flex-col gap-2">
              {sortedLeaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl min-h-[56px] ${
                    entry.isCurrentUser
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-sm'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs tabular-nums ${
                        entry.isCurrentUser
                          ? 'bg-primary text-on-primary'
                          : idx === 0
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-highest text-on-surface'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full ${entry.avatarBgClass} ${entry.avatarTextClass} flex items-center justify-center shrink-0 font-bold text-xs`}
                    >
                      {entry.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold truncate">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[11px] font-bold text-primary">
                            · You
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs truncate block ${
                          entry.isCurrentUser
                            ? 'text-on-primary-fixed-variant'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        Lvl {entry.level} · {entry.department}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 tabular-nums">
                    <span className="text-base font-extrabold">
                      {entry.points.toLocaleString()}
                    </span>
                    <span className="text-xs opacity-80">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Partner Cafe Voucher Card with Interactive QR */}
          {featuredPerk && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-on-surface">
                  Campus Perks
                </h3>
                <span className="text-xs font-bold text-primary">
                  CIT-U &amp; Partners
                </span>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md border border-outline-variant/25 flex flex-col">
                <div className="relative h-36 w-full bg-surface-container">
                  <ResilientImage
                    src={featuredPerk.imageUrl || ''}
                    alt={featuredPerk.title}
                    className="w-full h-full object-cover"
                    fallbackIcon="coffee"
                    fallbackLabel={featuredPerk.partner}
                  />
                  <div className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold shadow-sm tabular-nums">
                    {featuredPerk.pointsCost} pts
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {featuredPerk.partner}
                      </span>
                      <h4 className="text-base font-bold text-on-surface mt-0.5">
                        {featuredPerk.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {featuredPerk.description}
                      </p>
                    </div>

                    {/* Interactive QR Preview */}
                    <div
                      className={`shrink-0 w-20 h-20 rounded-xl p-2 flex items-center justify-center shadow-sm transition-colors ${
                        featuredPerk.redeemed
                          ? 'bg-primary-fixed'
                          : 'bg-surface-container-low'
                      }`}
                    >
                      <svg
                        aria-label="Voucher QR Code"
                        className="w-full h-full text-on-surface"
                        viewBox="0 0 36 36"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="10"
                          height="10"
                          rx="1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="24"
                          y="2"
                          width="10"
                          height="10"
                          rx="1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                        <rect
                          x="27"
                          y="5"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="2"
                          y="24"
                          width="10"
                          height="10"
                          rx="1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                        <rect
                          x="5"
                          y="27"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="16"
                          y="4"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="16"
                          y="12"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="4"
                          y="16"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="12"
                          y="16"
                          width="8"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="24"
                          y="16"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="30"
                          y="16"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="16"
                          y="24"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="24"
                          y="24"
                          width="4"
                          height="4"
                          fill="currentColor"
                        />
                        <rect
                          x="28"
                          y="28"
                          width="6"
                          height="6"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRedeemPerk(featuredPerk.id)}
                    className={`w-full min-h-[50px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all ${
                      featuredPerk.redeemed
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-primary text-on-primary hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[21px]">
                      qr_code_2
                    </span>
                    <span>
                      {featuredPerk.redeemed
                        ? 'Voucher Active — Show QR at Counter'
                        : `Redeem Voucher (${featuredPerk.pointsCost} pts)`}
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Other Campus Perks */}
          <div className="flex flex-col gap-2.5">
            {otherPerks.map((perk) => (
              <div
                key={perk.id}
                className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center ${perk.iconColorClass} shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {perk.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-on-surface truncate">
                      {perk.title}
                    </span>
                    <span className="block text-xs text-on-surface-variant truncate">
                      {perk.partner}
                    </span>
                    <span className="block text-xs font-bold text-primary mt-0.5 tabular-nums">
                      {perk.pointsCost.toLocaleString()} Karma Pts
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRedeemPerk(perk.id)}
                  className={`min-h-[44px] px-4 font-bold text-xs rounded-xl shrink-0 transition-all ${
                    perk.redeemed
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                >
                  {perk.redeemed ? 'Claimed' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>

          {/* Recent Activity History */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Recent Activity
              </h3>
              <span className="text-xs text-on-surface-variant">
                Last 48 Hours
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/25 p-3 flex flex-col gap-1.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[17px]">
                      {act.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-on-surface truncate">
                      {act.title}
                    </span>
                    <span className="block text-xs text-on-surface-variant truncate">
                      {act.subtitle}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-primary shrink-0 tabular-nums">
                    {act.pointsText}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
