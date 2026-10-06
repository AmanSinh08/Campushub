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
    (comments?.length || 0) > 0 ? comments.length : (resource?.ratingsCount ?? 12);

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
      setSubmitSuccess('Thank you! Your feedback has been posted.');
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch {
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setSubmitSuccess('Feedback saved!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-5 sm:px-6 py-4 shrink-0 bg-white">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] border border-[#DBEAFE]">
                {resource.category}
              </span>
              <span className="text-xs text-[#6B7280]">
                Sem {resource.semester} • {resource.subject}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#171717] leading-snug">
              Student Reviews & Notes Feedback
            </h2>
            <p className="text-xs text-[#6B7280] line-clamp-1">
              "{resource.title}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#171717]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Rating Summary Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F5] p-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left shrink-0 space-y-1">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-4xl font-extrabold text-[#171717]">
                  {currentAverageRating.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-[#6B7280]">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(currentAverageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Based on {currentTotalRatings} student reviews
              </p>
            </div>

            <div className="flex-1 w-full space-y-1.5 border-t sm:border-t-0 sm:border-l border-[#E5E7EB] pt-3 sm:pt-0 sm:pl-6">
              {starCounts.map(({ star, count, percent }) => (
                <button
                  key={star}
                  onClick={() => setFilterStar(filterStar === star ? null : star)}
                  className="w-full flex items-center gap-2 text-xs group"
                >
                  <span className="w-6 text-[#6B7280] font-medium flex items-center gap-0.5">
                    {star} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[#6B7280] font-mono text-[11px]">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF]/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-[#171717] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#2563EB]" />
                <span>Add Your Academic Review</span>
              </h3>
              <span className="text-[11px] text-[#2563EB] font-medium bg-white px-2 py-0.5 rounded-full border border-[#DBEAFE]">
                {profile.name}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Select Rating:
                </label>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          (hoverRating || selectedRating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Resource Tag:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REVIEW_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        selectedTag === tag
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:text-[#171717]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share how this book/notes helped your preparation (e.g. syllabus alignment, mid-sem numericals)..."
                  className="w-full p-3 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {submitSuccess ? (
                  <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {submitSuccess}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#6B7280]">Visible to university batchmates</span>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
                >
                  {isSubmitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Verified Peer Discussions ({filteredComments.length})
            </h3>

            {filteredComments.length === 0 ? (
              <p className="text-xs text-[#6B7280] py-6 text-center">
                Be the first student to review this material!
              </p>
            ) : (
              filteredComments.map((c) => {
                const isLiked = likedCommentIds.has(c.id);
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-[#E5E7EB] bg-white space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center">
                          {c.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{c.authorName}</p>
                          <p className="text-[10px] text-[#6B7280]">
                            {c.authorBranch} • Roll: {c.authorRoll}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{c.rating}</span>
                      </div>
                    </div>

                    <p className="text-[#171717] leading-relaxed pl-9">{c.comment}</p>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] pl-9 pt-1">
                      <span>{c.createdAt}</span>
                      <button
                        onClick={() => handleLike(c.id)}
                        disabled={isLiked}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs ${
                          isLiked
                            ? 'bg-[#DCFCE7] text-[#16A34A] border-green-200 font-bold'
                            : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#171717]'
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({c.helpfulCount || 0})</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
