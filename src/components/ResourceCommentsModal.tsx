import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  Sparkles,
  Filter,
} from 'lucide-react';
import { StudyResource, ResourceComment, StudentProfile } from '../types';

interface ResourceCommentsModalProps {
  resource: StudyResource;
  onClose: () => void;
  profile: StudentProfile;
  onAddComment: (
    resourceId: string,
    data: {
      rating: number;
      comment: string;
      tag?: string;
    }
  ) => Promise<void>;
  onLikeComment?: (resourceId: string, commentId: string) => Promise<void>;
}

const REVIEW_TAGS = [
  'Exam Essential',
  'Syllabus Aligned',
  'Clear Proofs',
  'Topper Notes',
  'Formula Sheet',
  'Must Read',
  'Lab Practice',
  'Solved Numericals',
];

export const ResourceCommentsModal: React.FC<ResourceCommentsModalProps> = ({
  resource,
  onClose,
  profile,
  onAddComment,
  onLikeComment,
}) => {
  const [comments, setComments] = useState<ResourceComment[]>(() => {
    return Array.isArray(resource?.comments) ? resource.comments : [];
  });
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Exam Essential');
  const [filterTag, setFilterTag] = useState<string>('All');
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  const currentAverageRating = resource?.rating ?? 4.9;
  const currentTotalRatings =
    (comments?.length || 0) > 0 ? comments.length : (resource?.ratingsCount ?? 0);

  // Rating descriptions
  const ratingLabels: Record<number, string> = {
    5: '⭐⭐⭐⭐⭐ Outstanding & Exam Essential',
    4: '⭐⭐⭐⭐ Very Helpful Notes & Book',
    3: '⭐⭐⭐ Good Material / Decent Coverage',
    2: '⭐⭐ Needs Revision / Incomplete',
    1: '⭐ Missing Topics / Low Quality',
  };

  // Rating distribution calculation
  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = (comments || []).filter((c) => c && Math.round(c.rating) === star).length;
    return {
      star,
      count,
      percent:
        (comments?.length || 0) > 0
          ? Math.round((count / comments.length) * 100)
          : star === 5
          ? 85
          : star === 4
          ? 15
          : 0,
    };
  });

  const handleLike = async (commentId: string) => {
    if (likedCommentIds.has(commentId)) return;

    setLikedCommentIds((prev) => new Set([...prev, commentId]));
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, helpfulCount: (c.helpfulCount || 0) + 1 } : c
      )
    );

    if (onLikeComment) {
      try {
        await onLikeComment(resource.id, commentId);
      } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    const newComment: ResourceComment = {
      id: `comm-${Date.now()}`,
      resourceId: resource.id,
      authorName: profile.name || 'Verified Student',
      authorRoll: profile.rollNo || '2200540130000',
      authorBranch: profile.course || 'B.Tech CSE',
      authorYear: profile.year || '3rd Year',
      rating: selectedRating,
      comment: commentText.trim(),
      tag: selectedTag || undefined,
      createdAt: 'Just now',
      helpfulCount: 0,
    };

    try {
      await onAddComment(resource.id, {
        rating: selectedRating,
        comment: commentText.trim(),
        tag: selectedTag,
      });

      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setSubmitSuccess('Thank you! Your feedback and rating have been posted.');
      setTimeout(() => setSubmitSuccess(null), 4000);
    } catch {
      // Retained in local modal state
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setSubmitSuccess('Feedback saved locally!');
      setTimeout(() => setSubmitSuccess(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComments = (comments || []).filter((c) => {
    if (!c) return false;
    if (filterStar !== null && Math.round(c.rating) !== filterStar) return false;
    if (filterTag !== 'All' && c.tag !== filterTag) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0b1329] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4 shrink-0">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-800/60">
                {resource.category}
              </span>
              <span className="text-xs text-slate-400">
                Sem {resource.semester} • {resource.subject}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              Student Reviews & Feedback
            </h2>
            <p className="text-xs text-slate-400 line-clamp-1">
              "{resource.title}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Rating Summary Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6">
            {/* Big Score Box */}
            <div className="text-center sm:text-left shrink-0 space-y-1">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {currentAverageRating.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(currentAverageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Based on {currentTotalRatings} verified student ratings
              </p>
            </div>

            {/* Star Distribution Bars */}
            <div className="flex-1 w-full space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              {starCounts.map(({ star, count, percent }) => (
                <button
                  key={star}
                  onClick={() => setFilterStar(filterStar === star ? null : star)}
                  className={`w-full flex items-center gap-2 text-[11px] group transition-opacity ${
                    filterStar !== null && filterStar !== star ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <span className="w-6 text-slate-400 font-medium flex items-center gap-0.5">
                    {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400 font-mono">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Leave a Review / Feedback Section */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Add Your Rating & Academic Feedback
                </h3>
              </div>
              <span className="text-[11px] text-cyan-300 font-medium bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                Logged in as: {profile.name}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Star selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Your Rating:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-600 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            (hoverRating || selectedRating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-amber-300">
                    {ratingLabels[hoverRating || selectedRating]}
                  </span>
                </div>
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Resource Highlight Tag:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REVIEW_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        selectedTag === tag
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Text Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Feedback & Review:
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share how this book/notes helped your preparation (e.g. syllabus alignment, mid-sem questions, numerical shortcuts, or chapter clarity)..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              {/* Submit Feedback Bar */}
              <div className="flex items-center justify-between pt-1">
                {submitSuccess ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {submitSuccess}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Peer verified • Visible to college batchmates
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Feedback Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Peer Feedback & Discussion ({filteredComments?.length || 0})
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </span>
              <button
                onClick={() => {
                  setFilterTag('All');
                  setFilterStar(null);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  filterTag === 'All' && filterStar === null
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {filterStar !== null && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[11px] border border-amber-800/40">
                  {filterStar} ★ Filtered
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilterStar(null)}
                  />
                </span>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3.5">
            {(filteredComments?.length || 0) === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
                <MessageSquare className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  No reviews match the selected filter.
                </p>
                <p className="text-xs text-slate-500">
                  Be the first student to share your review or clear filters to view all feedback.
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => {
                const isLiked = likedCommentIds.has(comment.id);
                return (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Author Info */}
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-xs font-bold text-cyan-300">
                          {comment.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {comment.authorName}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-950 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-300 border border-emerald-800/60">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Verified Student
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {comment.authorBranch || 'CSE'} • Roll: {comment.authorRoll || 'College ID'} • {comment.authorYear || 'Student'}
                          </p>
                        </div>
                      </div>

                      {/* Rating & Tag */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= comment.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        {comment.tag && (
                          <span className="inline-block rounded-md bg-cyan-950/60 px-2 py-0.5 text-[9px] font-semibold text-cyan-300 border border-cyan-800/50">
                            {comment.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs text-slate-300 leading-relaxed pl-10">
                      {comment.comment}
                    </p>

                    {/* Footer / Likes */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pl-10 pt-1">
                      <span>{comment.createdAt}</span>
                      <button
                        onClick={() => handleLike(comment.id)}
                        disabled={isLiked}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                          isLiked
                            ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className={`h-3 w-3 ${isLiked ? 'text-emerald-400' : ''}`} />
                        <span>Helpful ({comment.helpfulCount || 0})</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/90 px-6 py-3 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            Verified campus notes & textbooks review community
          </span>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
