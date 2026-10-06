import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Bookmark,
  BookmarkCheck,
  Download,
  Eye,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileDown,
  X,
  UploadCloud,
  Star,
  MessageSquare,
  GraduationCap,
  Plus,
} from 'lucide-react';
import { StudyResource, StudyResourceCategory, StudentProfile, ActiveTab } from '../types';
import { BookReaderModal } from './BookReaderModal';
import { ResourceCommentsModal } from './ResourceCommentsModal';

interface StudyHubViewProps {
  resources: StudyResource[];
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenUploadModal?: () => void;
  profile: StudentProfile;
  onAddResourceComment?: (
    resourceId: string,
    data: { rating: number; comment: string; tag?: string }
  ) => Promise<void>;
  onLikeResourceComment?: (resourceId: string, commentId: string) => Promise<void>;
}

const CATEGORIES: StudyResourceCategory[] = [
  'Textbooks',
  'Reference Books',
  'Notes',
  'Authorized Digital Resources',
];

export const StudyHubView: React.FC<StudyHubViewProps> = ({
  resources = [],
  savedResourceIds = [],
  onToggleSaveResource,
  onNavigate,
  onOpenUploadModal,
  profile,
  onAddResourceComment,
  onLikeResourceComment,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingResource, setReadingResource] = useState<StudyResource | null>(null);
  const [commentingResource, setCommentingResource] = useState<StudyResource | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  const filteredResources = (resources || []).filter((item) => {
    if (!item) return false;
    const matchesSemester = selectedSemester === 'All' || item.semester === selectedSemester;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSemester && matchesCategory && matchesSearch;
  });

  const handleSaveWithAnimation = (id: string) => {
    onToggleSaveResource(id);
    setJustSavedId(id);
    setTimeout(() => setJustSavedId(null), 500);
  };

  return (
    <div className="space-y-6 pb-16 animate-page-enter">
      {/* 1. Study Hub Banner */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                Open Student Digital Library
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1.5 tracking-tight">
              Curriculum Study Hub & Notes
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Access textbooks, verified topper handwritten notes, and semester PDFs with instant interactive reading and student reviews.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="btn-interactive inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Book / Notes</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Topic Bundles Quick Explorer with Hover Lift */}
      <section className="space-y-3 animate-slide-up stagger-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Core Semester Topic Bundles
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: 'Computer Networks', sem: 'Sem 5', count: 6, tag: 'TCP/IP, Routing' },
            { name: 'Database Systems', sem: 'Sem 4', count: 8, tag: 'SQL, Normalization' },
            { name: 'Data Structures', sem: 'Sem 3', count: 12, tag: 'Trees, Graphs' },
            { name: 'Operating Systems', sem: 'Sem 4', count: 7, tag: 'Deadlocks, Memory' },
            { name: 'Software Eng.', sem: 'Sem 6', count: 5, tag: 'Agile, UML' },
          ].map((topic, i) => (
            <div
              key={topic.name}
              onClick={() => setSearchQuery(topic.name)}
              className="card-interactive cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                  {topic.sem}
                </span>
                <span className="text-[11px] text-[#6B7280] font-mono">{topic.count} PDFs</span>
              </div>
              <h3 className="text-xs font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors truncate">
                {topic.name}
              </h3>
              <p className="text-[10px] text-[#6B7280] truncate">{topic.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Search and Semester Filters */}
      <section className="space-y-3 animate-slide-up stagger-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by book title, subject, topper author or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs sm:text-sm text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#171717] animate-fade-in"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] shadow-xs transition-colors"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`btn-interactive shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
            }`}
          >
            All Resources ({resources.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = (resources || []).filter((r) => r.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-interactive shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Resources Cards Grid with Staggered Entrance */}
      <section className="animate-slide-up stagger-3">
        <div className="flex items-center justify-between mb-3 text-xs text-[#6B7280]">
          <span>Showing {filteredResources.length} curriculum materials</span>
          <span>Interactive in-browser PDF reader available</span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-12 text-center space-y-3 shadow-xs animate-scale-in">
            <BookOpen className="h-8 w-8 text-[#9CA3AF] mx-auto" />
            <h3 className="text-sm font-bold text-[#171717]">No study resources found</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Try changing semester or search terms. You can also upload your own handwritten notes or PDF textbook.
            </p>
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="btn-interactive px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs"
              >
                Upload Resource Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredResources.map((res, index) => {
              const isSaved = savedResourceIds.includes(res.id);
              const commentsCount = (res.comments || []).length || (res.ratingsCount || 12);
              const ratingScore = res.rating || 4.9;
              const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

              return (
                <div
                  key={res.id}
                  className={`card-interactive rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between space-y-4 group animate-slide-up ${staggerClass}`}
                >
                  <div className="space-y-3">
                    {/* Category & Save button with micro pop animation */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block rounded-md bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#DBEAFE]">
                        Sem {res.semester} • {res.category}
                      </span>
                      <button
                        onClick={() => handleSaveWithAnimation(res.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          isSaved
                            ? 'text-[#2563EB] bg-[#EFF6FF]'
                            : 'text-[#9CA3AF] hover:text-[#171717] hover:bg-[#F7F7F5]'
                        } ${justSavedId === res.id ? 'animate-pop' : ''}`}
                        title={isSaved ? 'Saved in library' : 'Save to library'}
                      >
                        {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Title & Subject */}
                    <div>
                      <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {res.subject} • By {res.author}
                      </p>
                    </div>

                    <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Stats bar */}
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                      <button
                        onClick={() => setCommentingResource(res)}
                        className="flex items-center gap-1 text-amber-500 font-semibold hover:underline"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{ratingScore.toFixed(1)}</span>
                        <span className="text-[#6B7280] font-normal">({commentsCount})</span>
                      </button>

                      <span className="text-[11px] text-[#6B7280]">
                        {res.fileSize || 'PDF'} {res.pages ? `• ${res.pages} pgs` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setReadingResource(res)}
                      className="btn-interactive flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Read Online</span>
                    </button>

                    <button
                      onClick={() => setCommentingResource(res)}
                      className="btn-interactive px-3 py-2 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#E5E7EB] text-[#6B7280] hover:text-[#171717] text-xs font-medium"
                      title="Read Student Reviews"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL: INTERACTIVE BOOK READER */}
      {readingResource && (
        <BookReaderModal
          resource={readingResource}
          onClose={() => setReadingResource(null)}
          onOpenComments={() => {
            const res = readingResource;
            setReadingResource(null);
            setCommentingResource(res);
          }}
        />
      )}

      {/* MODAL: STUDENT REVIEWS & COMMENTS */}
      {commentingResource && (
        <ResourceCommentsModal
          resource={commentingResource}
          onClose={() => setCommentingResource(null)}
          profile={profile}
          onAddComment={onAddResourceComment || (async () => {})}
          onLikeComment={onLikeResourceComment}
        />
      )}
    </div>
  );
};
