import { Suspense, lazy, useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';

const AdminDashboardView = lazy(() =>
  import('./components/AdminDashboardView').then((m) => ({
    default: m.AdminDashboardView,
  }))
);
import { HazardDetailView } from './components/HazardDetailView';
import { HomeMapView } from './components/HomeMapView';
import { OnboardingView } from './components/OnboardingView';
import { PhonePrototypeFrame } from './components/PhonePrototypeFrame';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { NewHazardPayload, ReportHazardView } from './components/ReportHazardView';
import { ReportSuccessView } from './components/ReportSuccessView';
import { RewardsView } from './components/RewardsView';
import { RouteComparisonView } from './components/RouteComparisonView';
import { TurnByTurnView } from './components/TurnByTurnView';
import {
  DEFAULT_SENSORY_SETTINGS,
  INITIAL_ACTIVITY,
  INITIAL_BADGES,
  INITIAL_HAZARDS,
  INITIAL_LEADERBOARD,
  INITIAL_PERKS,
  INITIAL_QUESTS,
  STITCH_ASSETS,
} from './data/initialData';
import {
  ActivityItem,
  AppView,
  CampusPerk,
  Hazard,
  MapFilterChipId,
  MobilityModeId,
  Quest,
  SensorySettings,
} from './types';

export default function App() {
  const [view, setView] = useState<AppView>('map');
  const [previousView, setPreviousView] = useState<AppView>('map');

  const [mobilityMode, setMobilityMode] =
    useState<MobilityModeId>('wheelchair');
  const [mapFilter, setMapFilter] = useState<MapFilterChipId>('wheelchair');
  const [sensory, setSensory] = useState<SensorySettings>(
    DEFAULT_SENSORY_SETTINGS
  );

  const [hazards, setHazards] = useState<Hazard[]>(INITIAL_HAZARDS);
  const [selectedHazardId, setSelectedHazardId] = useState<string>(
    INITIAL_HAZARDS[0].id
  );
  const [submittedHazard, setSubmittedHazard] = useState<Hazard | null>(null);

  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const [karmaPoints, setKarmaPoints] = useState<number>(1420);
  const [streakDays] = useState<number>(12);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [perks, setPerks] = useState<CampusPerk[]>(INITIAL_PERKS);
  const [activities, setActivities] =
    useState<ActivityItem[]>(INITIAL_ACTIVITY);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const navigateTo = (next: AppView) => {
    setPreviousView(view);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleUpvote = (id: string) => {
    const already = upvotedIds.includes(id);
    setUpvotedIds((prev) =>
      already ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, upvotes: already ? h.upvotes - 1 : h.upvotes + 1 }
          : h
      )
    );
    if (!already) {
      showToast('Thank you! Verification logged for campus community.');
    }
  };

  const handleReportCleared = (id: string) => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, downvotes: h.downvotes + 1 } : h
      )
    );
    showToast('Report submitted: You indicated this blockage is resolved.');
  };

  const handleToggleBookmark = (id: string) => {
    const already = bookmarkedIds.includes(id);
    setBookmarkedIds((prev) =>
      already ? prev.filter((x) => x !== id) : [...prev, id]
    );
    showToast(
      already
        ? 'Removed from saved campus hazards.'
        : 'Bookmarked hazard for route alerts.'
    );
  };

  const handleVoteDetail = (id: string, voteType: 'confirm' | 'dispute') => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              upvotes: voteType === 'confirm' ? h.upvotes + 1 : h.upvotes,
              downvotes: voteType === 'dispute' ? h.downvotes + 1 : h.downvotes,
            }
          : h
      )
    );
    showToast(
      voteType === 'confirm'
        ? 'Thank you! Your confirmation keeps step-free routes accurate.'
        : 'Clearance logged! A campus scout will verify.'
    );
  };

  const handleAddComment = (id: string, text: string) => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              comments: [
                {
                  id: `c-${Date.now()}`,
                  author: 'Maria S.',
                  role: '(BSIT · You)',
                  initials: 'MS',
                  isScout: true,
                  timeAgo: 'Just now',
                  text,
                },
                ...h.comments,
              ],
            }
          : h
      )
    );
    showToast('Verification note posted to live campus thread.');
  };

  const handleSubmitReport = (payload: NewHazardPayload) => {
    const newId = `haz-${Date.now()}`;
    const ticketNum = Math.floor(8825 + Math.random() * 170);
    const newHazard: Hazard = {
      id: newId,
      ticketCode: `#CIT-FAC-${ticketNum}`,
      title: payload.title,
      location: payload.location,
      building: payload.building,
      floor: payload.floor,
      category: payload.category,
      severity: payload.severity,
      status: payload.severity === 'high' ? 'Urgent' : 'In Progress',
      reportedAgo: 'Just now',
      reporterName: 'Maria S.',
      reporterRole: 'BSIT 3rd Year',
      reporterKarma: karmaPoints + 25,
      verifiedCount: 1,
      upvotes: 1,
      downvotes: 0,
      distanceMeters: 45,
      detourTitle: 'South Covered Ramp B (+2 mins)',
      detourSubtitle: 'Step-free bypass verified by PathFinder routing',
      detourSlope: 'Step-free · Max slope 4.1% (Gentle)',
      photoUrl: STITCH_ASSETS.elevatorReport,
      photoCaption: payload.notes,
      photoZone: payload.floor,
      facilitiesNote: 'Auto-dispatched to CIT-U Facilities Management',
      avgFixHours: '3.0 hrs',
      reportVolume: 1,
      dispatched: true,
      mapCoords: payload.coords,
      comments: [],
    };

    setHazards((prev) => [newHazard, ...prev]);
    setSelectedHazardId(newId);
    setSubmittedHazard(newHazard);
    setKarmaPoints((k) => k + 25);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Reported ${payload.title}`,
        subtitle: `${payload.building} · Just now`,
        pointsText: '+25 pts',
        icon: 'flag',
      },
      ...prev,
    ]);
    navigateTo('report-success');
  };

  const handleCompleteQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.completed) return;
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );
    setKarmaPoints((k) => k + target.points);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Quest Completed: ${target.title}`,
        subtitle: 'CIT-U Campus · Just now',
        pointsText: `+${target.points} pts`,
        icon: 'task_alt',
      },
      ...prev,
    ]);
    showToast(`Quest verified! +${target.points} Scout Karma unlocked.`);
  };

  const handleRedeemPerk = (perkId: string) => {
    const target = perks.find((p) => p.id === perkId);
    if (!target) return;

    if (target.redeemed) {
      showToast(`${target.title} voucher QR is active for counter scan.`);
      return;
    }

    if (karmaPoints < target.pointsCost) {
      showToast(
        `Need ${target.pointsCost - karmaPoints} more Karma pts to redeem ${
          target.title
        }.`
      );
      return;
    }

    setPerks((prev) =>
      prev.map((p) => (p.id === perkId ? { ...p, redeemed: true } : p))
    );
    setKarmaPoints((k) => k - target.pointsCost);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Redeemed: ${target.title}`,
        subtitle: `${target.partner} · Just now`,
        pointsText: `-${target.pointsCost} pts`,
        icon: 'qr_code_2',
      },
      ...prev,
    ]);
    showToast(`Redeemed ${target.title}! Show your QR code at the counter.`);
  };

  const handleDispatchTicket = (id: string) => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              dispatched: true,
              status: h.status === 'Urgent' ? 'In Progress' : h.status,
              facilitiesNote: 'Facilities Crew Dispatched via PDAO Portal',
            }
          : h
      )
    );
    showToast('Maintenance ticket dispatched to CIT-U Facilities.');
  };

  const handleResolveHazard = (id: string) => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              status: 'Resolved',
              dispatched: true,
              facilitiesNote: 'Marked cleared by Facilities Admin',
            }
          : h
      )
    );
    showToast('Hazard marked Resolved across Campus Navigator & PDAO.');
  };

  const selectedHazard =
    hazards.find((h) => h.id === selectedHazardId) ?? hazards[0];

  const rootClass = sensory.highContrastMap ? 'high-contrast' : '';

  const safetyModal = showSafetyModal && (
    <div
      onClick={() => setShowSafetyModal(false)}
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined material-symbols-filled">
              support_agent
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              CIT-U Campus Escort &amp; Safety
            </h3>
            <p className="text-xs text-on-surface-variant">
              24/7 Wildcat Accessibility Assistance
            </p>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant">
          Request a trained campus escort or connect directly with CIT-U
          Security &amp; Clinic responders.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setShowSafetyModal(false);
              showToast('Escort dispatched to your GPS pin (ETA 3 mins).');
            }}
            className="w-full min-h-[48px] rounded-xl bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[19px]">
              directions_run
            </span>
            Request Campus Escort Now
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSafetyModal(false);
              showToast(
                'Connected to Cebu Campus Accessibility Desk (032) 261-7741.'
              );
            }}
            className="w-full min-h-[44px] rounded-xl bg-surface-container text-on-surface font-bold text-sm"
          >
            Call Security Desk (032) 261-7741
          </button>
          <button
            type="button"
            onClick={() => setShowSafetyModal(false)}
            className="w-full min-h-[40px] rounded-xl text-on-surface-variant font-semibold text-xs hover:bg-surface-container-low"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const toastBanner = toastMessage && (
    <div
      role="status"
      className={`fixed z-50 bg-inverse-surface text-inverse-on-surface px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 ${
        view === 'admin'
          ? 'bottom-6 left-1/2 -translate-x-1/2 max-w-md'
          : 'bottom-20 left-3.5 right-3.5'
      }`}
    >
      <span className="material-symbols-outlined text-inverse-primary text-[19px] shrink-0">
        check_circle
      </span>
      <span className="text-xs font-semibold flex-1">{toastMessage}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setToastMessage(null)}
        className="text-inverse-on-surface/80 hover:text-inverse-on-surface ml-1 shrink-0"
      >
        <span className="material-symbols-outlined text-[17px]">close</span>
      </button>
    </div>
  );

  return (
    <div className={rootClass}>
      {view === 'admin' ? (
        <>
          <Suspense
            fallback={
              <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6">
                <span className="text-sm font-semibold text-on-surface-variant">
                  Loading PDAO Analytics Portal...
                </span>
              </div>
            }
          >
            <AdminDashboardView
              hazards={hazards}
              onDispatchTicket={handleDispatchTicket}
              onResolveHazard={handleResolveHazard}
              onExitAdmin={() => navigateTo('map')}
              onShowToast={showToast}
            />
          </Suspense>
          {toastBanner}
        </>
      ) : (
        <PhonePrototypeFrame currentView={view} onSelectView={navigateTo}>
          <AppShell
            currentView={view}
            onNavigate={navigateTo}
            onBack={() =>
              navigateTo(previousView === view ? 'map' : previousView)
            }
            onTriggerSafetyModal={() => setShowSafetyModal(true)}
          >
          {view === 'onboarding' && (
            <OnboardingView
              selectedMode={mobilityMode}
              onSelectMode={(mode) => {
                setMobilityMode(mode);
                if (mode === 'wheelchair' || mode === 'power-chair') {
                  setMapFilter('wheelchair');
                } else if (mode === 'vision') {
                  setMapFilter('vision');
                } else if (mode === 'cane') {
                  setMapFilter('cane');
                } else {
                  setMapFilter('covered');
                }
              }}
              onContinue={() => {
                showToast('Accessibility profile applied to CIT-U Campus Map.');
                navigateTo('map');
              }}
              onSkip={() => {
                setMobilityMode('wheelchair');
                setMapFilter('step-free');
                navigateTo('map');
              }}
            />
          )}

          {view === 'map' && (
            <HomeMapView
              hazards={hazards}
              selectedHazardId={selectedHazardId}
              onSelectHazard={setSelectedHazardId}
              activeFilter={mapFilter}
              onSelectFilter={setMapFilter}
              upvotedIds={upvotedIds}
              bookmarkedIds={bookmarkedIds}
              onToggleUpvote={handleToggleUpvote}
              onReportCleared={handleReportCleared}
              onToggleBookmark={handleToggleBookmark}
              onOpenRouteCompare={() => navigateTo('routes')}
              onOpenHazardDetail={(id) => {
                setSelectedHazardId(id);
                navigateTo('hazard-detail');
              }}
              onOpenReport={() => navigateTo('report')}
              onShowToast={showToast}
            />
          )}

          {view === 'routes' && (
            <RouteComparisonView
              onStartNavigation={() => navigateTo('navigation')}
              onShowToast={showToast}
            />
          )}

          {view === 'navigation' && (
            <TurnByTurnView
              onEndRoute={() => {
                showToast('Route ended. Returned to CIT-U Campus Map.');
                navigateTo('map');
              }}
              onReportBlockage={() => navigateTo('report')}
              onRequestEscort={() => setShowSafetyModal(true)}
              onShowToast={showToast}
            />
          )}

          {view === 'hazard-detail' && selectedHazard && (
            <HazardDetailView
              hazard={selectedHazard}
              isBookmarked={bookmarkedIds.includes(selectedHazard.id)}
              onToggleBookmark={handleToggleBookmark}
              onVote={handleVoteDetail}
              onAddComment={handleAddComment}
              onOpenRouteCompare={() => navigateTo('routes')}
              onShowToast={showToast}
            />
          )}

          {view === 'report' && (
            <ReportHazardView
              onSubmitReport={handleSubmitReport}
              onCancel={() => navigateTo('map')}
              onShowToast={showToast}
            />
          )}

          {view === 'report-success' && (
            <ReportSuccessView
              submittedHazard={submittedHazard}
              karmaPoints={karmaPoints}
              streakDays={streakDays}
              onBackToMap={() => navigateTo('map')}
              onTrackReport={(id) => {
                setSelectedHazardId(id);
                navigateTo('hazard-detail');
              }}
              onNewReport={() => navigateTo('report')}
              onShowToast={showToast}
            />
          )}

          {view === 'rewards' && (
            <RewardsView
              karmaPoints={karmaPoints}
              streakDays={streakDays}
              quests={quests}
              badges={INITIAL_BADGES}
              perks={perks}
              leaderboard={INITIAL_LEADERBOARD}
              activities={activities}
              onCompleteQuest={handleCompleteQuest}
              onRedeemPerk={handleRedeemPerk}
            />
          )}

          {view === 'profile' && (
            <ProfileSettingsView
              karmaPoints={karmaPoints}
              mobilityMode={mobilityMode}
              onChangeMobilityMode={setMobilityMode}
              sensory={sensory}
              onUpdateSensory={(next) =>
                setSensory((prev) => ({ ...prev, ...next }))
              }
              onResetDefaults={() => {
                setSensory(DEFAULT_SENSORY_SETTINGS);
                showToast('Filter parameters reset to defaults (4.5% incline).');
              }}
              onOpenOnboarding={() => navigateTo('onboarding')}
              onOpenAdminPortal={() => navigateTo('admin')}
              onShowToast={showToast}
            />
          )}
          </AppShell>
          {safetyModal}
          {toastBanner}
        </PhonePrototypeFrame>
      )}
    </div>
  );
}
