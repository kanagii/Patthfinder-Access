import React, { useState } from 'react';
import { STITCH_ASSETS } from '../data/initialData';
import { Hazard } from '../types';
import { ResilientImage } from './ResilientImage';

interface HazardDetailViewProps {
  hazard: Hazard;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onVote: (id: string, voteType: 'confirm' | 'dispute') => void;
  onAddComment: (id: string, text: string) => void;
  onOpenRouteCompare: () => void;
  onShowToast: (msg: string) => void;
}

export const HazardDetailView: React.FC<HazardDetailViewProps> = ({
  hazard,
  isBookmarked,
  onToggleBookmark,
  onVote,
  onAddComment,
  onOpenRouteCompare,
  onShowToast,
}) => {
  const [commentText, setCommentText] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(false);
  const [userVoteChoice, setUserVoteChoice] = useState<
    'confirm' | 'dispute' | null
  >(null);

  const totalVotes = Math.max(1, hazard.upvotes + hazard.downvotes);
  const confidencePct = Math.round((hazard.upvotes / totalVotes) * 100);

  const handleRecordVote = (type: 'confirm' | 'dispute') => {
    setUserVoteChoice(type);
    onVote(hazard.id, type);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    const finalNote = photoAttached
      ? `${trimmed} [Photo Verification Attached]`
      : trimmed;
    onAddComment(hazard.id, finalNote);
    setCommentText('');
    setPhotoAttached(false);
  };

  const handleShare = async () => {
    const shareText = `${hazard.title} (${hazard.ticketCode}) at ${hazard.location}. Detour: ${hazard.detourSubtitle}`;
    try {
      await navigator.clipboard?.writeText(shareText);
    } catch {
      // ignore
    }
    onShowToast('Hazard link & detour details copied to clipboard.');
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* Alert Header, Photo Evidence & Detour */}
        <div className="flex flex-col gap-4">
          {/* Urgent Status Alert Header */}
          <section className="bg-secondary-container text-on-secondary-container rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
                <span className="material-symbols-outlined text-[17px] material-symbols-filled">
                  warning
                </span>
                <span>
                  {hazard.severity === 'high'
                    ? 'High Severity Obstacle · Active Detour'
                    : 'Campus Accessibility Advisory'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">
                  {hazard.ticketCode}
                </span>
                <button
                  type="button"
                  aria-label="Share hazard"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-lg bg-on-secondary-container/10 hover:bg-on-secondary-container/20 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    share
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Bookmark hazard"
                  onClick={() => onToggleBookmark(hazard.id)}
                  className="w-9 h-9 rounded-lg bg-on-secondary-container/10 hover:bg-on-secondary-container/20 flex items-center justify-center"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isBookmarked ? 'material-symbols-filled' : ''
                    }`}
                  >
                    bookmark
                  </span>
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-on-secondary-container">
              {hazard.title}
            </h2>
            <p className="text-sm text-on-secondary-container/90 mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">
                domain
              </span>
              <span>{hazard.location}</span>
            </p>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-on-secondary-container/20 text-xs font-bold">
              <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-secondary px-3 py-1.5 rounded-lg shadow-sm tabular-nums">
                <span className="material-symbols-outlined text-[17px]">
                  near_me
                </span>
                <span>{hazard.distanceMeters}m away from your location</span>
              </div>
              <span>{hazard.floor} affected</span>
            </div>
          </section>

          {/* Visual Evidence Photo Card */}
          <section className="relative rounded-2xl overflow-hidden bg-surface-container shadow-md">
            <div className="relative w-full h-52 overflow-hidden">
              <ResilientImage
                src={hazard.photoUrl}
                alt={hazard.title}
                className="w-full h-full object-cover"
                fallbackIcon="elevator"
                fallbackLabel={hazard.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent" />

              <div className="absolute top-3 left-3 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                Live Photo · {hazard.reportedAgo}
              </div>

              <button
                type="button"
                aria-label="Enlarge hazard photo"
                onClick={() => setZoomedPhoto(true)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-inverse-surface/75 backdrop-blur-md text-inverse-on-surface flex items-center justify-center hover:bg-inverse-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  zoom_in
                </span>
              </button>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-inverse-on-surface">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary-fixed text-[20px] shrink-0">
                    verified
                  </span>
                  <span className="text-xs font-semibold truncate">
                    {hazard.photoCaption}
                  </span>
                </div>
                <span className="text-xs font-bold bg-inverse-on-surface/20 px-2.5 py-0.5 rounded shrink-0">
                  {hazard.photoZone}
                </span>
              </div>
            </div>
          </section>

          {/* Suggested Step-Free Detour Card */}
          <section className="bg-primary text-on-primary rounded-2xl p-5 shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full bg-on-primary/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary text-[26px] material-symbols-filled">
                  accessible_forward
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 text-primary-fixed text-xs font-bold mb-1">
                  <span className="material-symbols-outlined text-[15px]">
                    check_circle
                  </span>
                  <span>Suggested Step-Free Detour</span>
                </div>
                <h3 className="text-lg font-bold text-on-primary leading-tight">
                  {hazard.detourTitle}
                </h3>
                <p className="text-sm text-on-primary/90 mt-1">
                  {hazard.detourSubtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-on-primary/20 flex gap-2.5">
              <button
                type="button"
                onClick={onOpenRouteCompare}
                className="flex-1 min-h-[50px] bg-primary-fixed text-on-primary-fixed font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[21px]">
                  alt_route
                </span>
                <span>View Reroute Path</span>
              </button>
              <button
                type="button"
                aria-label="Audio navigation instructions"
                onClick={() => {
                  try {
                    window.speechSynthesis?.speak(
                      new SpeechSynthesisUtterance(hazard.detourSubtitle)
                    );
                  } catch {
                    // ignore
                  }
                  onShowToast(`Audio cue: ${hazard.detourSubtitle}`);
                }}
                className="w-[50px] h-[50px] bg-on-primary/20 text-on-primary rounded-xl flex items-center justify-center hover:bg-on-primary/30 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[22px]">
                  volume_up
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Reporter Info, Crowdsource Verification & Live Thread */}
        <div className="flex flex-col gap-4">
          {/* Reporter Profile & Facilities Dispatch */}
          <section className="bg-surface-container-low rounded-2xl p-4 space-y-3 shadow-sm border border-outline-variant/25">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <ResilientImage
                    src={STITCH_ASSETS.scoutMarkAvatar}
                    alt={hazard.reporterName}
                    className="w-full h-full object-cover"
                    fallbackIcon="person"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-on-surface">
                      {hazard.reporterName}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      ({hazard.reporterRole})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-tertiary flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[15px] material-symbols-filled">
                      military_tech
                    </span>
                    <span>
                      Gold Scout L4 · {hazard.reporterKarma.toLocaleString()}{' '}
                      Karma
                    </span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant shrink-0">
                {hazard.reportedAgo}
              </span>
            </div>

            <div className="bg-surface-container-highest rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-tint text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  engineering
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-on-surface">
                  CIT-U Facilities &amp; Engineering
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {hazard.facilitiesNote}
                </p>
              </div>
              <span className="text-xs font-bold text-primary shrink-0">
                {hazard.status}
              </span>
            </div>
          </section>

          {/* Community Crowdsource Verification Card */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-md space-y-4 border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[21px]">
                    how_to_vote
                  </span>
                  <span>Still there? Help Wildcats Verify</span>
                </h3>
                <span className="text-xs font-bold text-primary">
                  Live Status
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Your confirmation updates real-time routing for wheelchairs
                &amp; step-free paths.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleRecordVote('confirm')}
                className={`min-h-[50px] rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] ${
                  userVoteChoice === 'confirm'
                    ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                    : 'bg-secondary text-on-secondary hover:opacity-95'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  block
                </span>
                <span>Yes, Still Blocked</span>
              </button>

              <button
                type="button"
                onClick={() => handleRecordVote('dispute')}
                className={`min-h-[50px] rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                  userVoteChoice === 'dispute'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  task_alt
                </span>
                <span>Cleared / Fixed</span>
              </button>
            </div>

            {/* Trust Meter */}
            <div className="bg-surface-container-low rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs font-bold">
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="text-on-surface">
                    {hazard.upvotes} Confirmed
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-on-surface-variant">
                    {hazard.downvotes} Disputed
                  </span>
                </div>
                <span className="text-primary tabular-nums">
                  {confidencePct}% Confidence
                </span>
              </div>

              <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${confidencePct}%` }}
                />
                <div
                  className="bg-secondary h-full transition-all duration-500"
                  style={{ width: `${100 - confidencePct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant tabular-nums">
                <span>Verified by {totalVotes} Wildcats</span>
                <span>
                  {confidencePct >= 75 ? 'High Reliability' : 'Needs Review'}
                </span>
              </div>
            </div>
          </section>

          {/* Live Community Comments Thread */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[21px]">
                  forum
                </span>
                <span>Live Campus Thread</span>
              </h3>
              <span className="text-xs font-semibold text-on-surface-variant tabular-nums">
                {hazard.comments.length} Updates
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {hazard.comments.length === 0 ? (
                <p className="text-sm text-on-surface-variant py-3 text-center">
                  No field notes yet. Share an update below for fellow Wildcats.
                </p>
              ) : (
                hazard.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={
                      comment.isStaff
                        ? 'bg-surface-container-low rounded-xl p-3 space-y-1.5'
                        : 'flex items-start gap-2.5'
                    }
                  >
                    {comment.isStaff ? (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                              <span className="material-symbols-outlined text-[17px]">
                                build
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-on-surface">
                                  {comment.author}
                                </span>
                                <span className="text-[11px] font-bold text-primary">
                                  · Staff
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant">
                                {comment.role}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-on-surface-variant">
                            {comment.timeAgo}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface pl-10">
                          {comment.text}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs shrink-0">
                          {comment.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-bold text-on-surface truncate">
                                {comment.author}
                              </span>
                              <span className="text-xs text-on-surface-variant truncate">
                                {comment.role}
                              </span>
                            </div>
                            <span className="text-xs text-on-surface-variant shrink-0">
                              {comment.timeAgo}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant mt-0.5">
                            {comment.text}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="pt-2 border-t border-outline-variant/25">
              {photoAttached && (
                <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-primary-fixed/40 text-on-primary-fixed text-xs font-semibold">
                  <span>Photo proof attached to note</span>
                  <button
                    type="button"
                    onClick={() => setPhotoAttached(false)}
                    className="underline"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach verification photo"
                  onClick={() => {
                    setPhotoAttached((v) => !v);
                    onShowToast(
                      photoAttached
                        ? 'Photo attachment removed'
                        : 'Campus camera proof attached'
                    );
                  }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    photoAttached
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    add_a_photo
                  </span>
                </button>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add verification note..."
                  className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 text-sm outline-none focus:bg-surface-container transition-colors min-w-0"
                />
                <button
                  type="submit"
                  aria-label="Send verification comment"
                  className="w-11 h-11 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors flex items-center justify-center shrink-0 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    send
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {zoomedPhoto && (
        <div
          onClick={() => setZoomedPhoto(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative h-72">
              <ResilientImage
                src={hazard.photoUrl}
                alt={hazard.title}
                className="w-full h-full object-cover"
                fallbackIcon="elevator"
              />
              <button
                type="button"
                aria-label="Close photo"
                onClick={() => setZoomedPhoto(false)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[22px]">
                  close
                </span>
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {hazard.title}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {hazard.photoCaption} · {hazard.photoZone}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-primary">
                {hazard.ticketCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
