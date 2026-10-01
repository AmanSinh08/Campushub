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
  ThumbsUp,
} from 'lucide-react';
import { StudyResource, StudyResourceCategory, ActiveTab, StudentProfile } from '../types';
import { BookReaderModal } from './BookReaderModal';
import { ResourceCommentsModal } from './ResourceCommentsModal';
import { downloadResourcePdf } from '../utils/bookContent';

interface StudyHubViewProps {
  resources: StudyResource[];
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenBook?: (resource: StudyResource, mode?: 'reader' | 'pdf') => void;
  onOpenUploadModal?: () => void;
  profile?: StudentProfile;
  onAddResourceComment?: (
    resourceId: string,
    data: {
      rating: number;
      comment: string;
      tag?: string;
    }
  ) => Promise<void>;
  onLikeResourceComment?: (resourceId: string, commentId: string) => Promise<void>;
}

const CATEGORIES: StudyResourceCategory[] = [
  'Textbooks',
  'Reference Books',
  'Notes',
  'Authorized Digital Resources',
  'PYQs',
  'AI Practice',
];

export const StudyHubView: React.FC<StudyHubViewProps> = ({
  resources = [],
  savedResourceIds = [],
  onToggleSaveResource,
  onNavigate,
  onOpenBook,
  onOpenUploadModal,
  profile = {
    name: 'College Student',
    rollNo: '2200540130000',
    course: 'B.Tech CSE/IT',
    year: '3rd Year',
    college: 'BBDITM Lucknow',
    email: 'student@bbditm.ac.in',
    verified: true,
    savedResourceIds: [],
    savedPYQIds: [],
    testsAttempted: 0,
    averageScore: 85,
    practiceScore: 85,
    weakArea: '',
    pyqsSolvedCount: 0,
    focusWeakTopic: '',
  },
  onAddResourceComment,
  onLikeResourceComment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicExample, setActiveTopicExample] = useState<string>('Data Structures');
  const [viewingResource, setViewingResource] = useState<StudyResource | null>(null);
  const [feedbackResource, setFeedbackResource] = useState<StudyResource | null>(null);
  const [modalInitialMode, setModalInitialMode] = useState<'reader' | 'pdf'>('reader');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleOpenBook = (res: StudyResource, mode: 'reader' | 'pdf' = 'reader') => {
    setModalInitialMode(mode);
    if (onOpenBook) {
      onOpenBook(res, mode);
    } else {
      setViewingResource(res);
    }
  };

  const handleDownloadPdfCard = (res: StudyResource) => {
    setDownloadToast(`Preparing & downloading "${res.title}" PDF...`);
    const ok = downloadResourcePdf(res);
    setTimeout(() => {
      if (ok) {
        setDownloadToast(`"${res.title}" PDF downloaded to your device!`);
      } else {
        setDownloadToast(`"${res.title}" document downloaded.`);
      }
      setTimeout(() => setDownloadToast(null), 4500);
    }, 600);

    // Also open the book reader in PDF mode so user immediately sees the PDF
    handleOpenBook(res, 'pdf');
  };

  const topicBundles = [
    {
      topic: 'Data Structures',
      physicalBook: 'Physical Book: Core Data Structures in C++',
      authorizedMaterial: 'Authorized Material: Department Lecture Notes (PDF)',
      notes: 'Notes: Handwritten Unit 1-5 Topper Summary',
      pyqs: 'PYQs: 2021-2024 Solved End-Sem Papers',
      aiPractice: 'AI Practice: 15 Interactive Doubts',
    },
    {
      topic: 'Computer Networks',
      physicalBook: 'Reference: Computer Networking: A Top-Down Approach',
      authorizedMaterial: 'Authorized Material: Department TCP/IP Packet Tracing Lab Guide',
      notes: 'Notes: OSI 7-Layer vs TCP/IP Handshake Master Sheet',
      pyqs: 'PYQs: 2022-2025 Solved University Papers',
      aiPractice: 'AI Practice: TCP Congestion Control Simulation Test',
    },
    {
      topic: 'DBMS',
      physicalBook: 'Standard: Database System Concepts (Korth 7th Ed)',
      authorizedMaterial: 'Authorized Material: Relational Algebra & SQL Handouts',
      notes: 'Notes: Normalization (1NF to BCNF) Closure Derivations',
      pyqs: 'PYQs: 2021-2025 End-Sem Exam Papers with Solutions',
      aiPractice: 'AI Practice: 20 Functional Dependency Doubts & Drill',
    },
  ];

  const currentBundle = topicBundles.find((b) => b.topic === activeTopicExample) || topicBundles[0];

  const filteredResources = (resources || []).filter((res) => {
    if (!res) return false;
    if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.subject.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Study Hub Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              ACADEMIC STUDY REPOSITORY
            </span>
            <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/60">
              Curated & Verified
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Complete Digital Study Hub</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Everything for better preparation: Standard textbooks, handwritten topper summary notes, authorized PDFs, and PYQs in one place.
              </p>
            </div>
            {onOpenUploadModal && (
              <button
                id="header-upload-btn"
                onClick={onOpenUploadModal}
                className="self-start sm:self-center flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-all active:scale-95 shrink-0"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload PDF / Notes</span>
              </button>
            )}
          </div>
        </div>

        {/* Topic Bundle Showcase: One Topic ➔ Multiple Learning Resources */}
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-900/60 pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                INTEGRATED MULTI-RESOURCE LEARNING
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white">
                One Topic ➔ Multiple Learning Resources
              </h2>
            </div>

            {/* Quick switcher for topic example */}
            <div className="flex flex-wrap gap-1.5">
              {topicBundles.map((b) => (
                <button
                  key={b.topic}
                  onClick={() => setActiveTopicExample(b.topic)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    activeTopicExample === b.topic
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'border border-cyan-900/70 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/40'
                  }`}
                >
                  {b.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Physical Book */}
            <div
              onClick={() => onNavigate('marketplace')}
              className="cursor-pointer rounded-lg border border-cyan-800/60 bg-slate-900/80 p-3 hover:border-cyan-400 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400">1. MARKETPLACE</span>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors">{currentBundle.physicalBook}</p>
              </div>
              <span className="text-[11px] text-cyan-300 mt-2 flex items-center gap-1 font-medium">
                View in Marketplace ➔
              </span>
            </div>

            {/* 2. Authorized Digital Material */}
            <div
              onClick={() => {
                setSelectedCategory('Authorized Digital Resources');
                setSearchQuery(activeTopicExample);
              }}
              className="cursor-pointer rounded-lg border border-blue-800/60 bg-slate-900/80 p-3 hover:border-blue-400 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400">2. AUTHORIZED MATERIAL</span>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-blue-300 transition-colors">{currentBundle.authorizedMaterial}</p>
              </div>
              <span className="text-[11px] text-blue-300 mt-2 flex items-center gap-1 font-medium">
                Filter Materials ➔
              </span>
            </div>

            {/* 3. Notes */}
            <div
              onClick={() => {
                setSelectedCategory('Notes');
                setSearchQuery(activeTopicExample);
              }}
              className="cursor-pointer rounded-lg border border-emerald-800/60 bg-slate-900/80 p-3 hover:border-emerald-400 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">3. TOPPER NOTES</span>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-emerald-300 transition-colors">{currentBundle.notes}</p>
              </div>
              <span className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1 font-medium">
                View Topper Notes ➔
              </span>
            </div>

            {/* 4. PYQs */}
            <div
              onClick={() => onNavigate('pyq-bank')}
              className="cursor-pointer rounded-lg border border-amber-800/60 bg-slate-900/80 p-3 hover:border-amber-400 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400">4. PYQ BANK</span>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-amber-300 transition-colors">{currentBundle.pyqs}</p>
              </div>
              <span className="text-[11px] text-amber-300 mt-2 flex items-center gap-1 font-medium">
                Solve with AI ➔
              </span>
            </div>

            {/* 5. AI Practice */}
            <div
              onClick={() => onNavigate('practice-engine')}
              className="cursor-pointer rounded-lg border border-purple-800/60 bg-slate-900/80 p-3 hover:border-purple-400 transition-colors flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-400">5. AI PRACTICE</span>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-purple-300 transition-colors">{currentBundle.aiPractice}</p>
              </div>
              <span className="text-[11px] text-purple-300 mt-2 flex items-center gap-1 font-medium">
                Start Quiz Loop ➔
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbooks, syllabus notes, topper handouts by subject (e.g. Data Structures, DBMS, OS, Networks)..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-colors shrink-0"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload PDF / Notes</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'All' && !searchQuery
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
            }`}
          >
            All Resources ({resources?.length || 0})
          </button>
          {CATEGORIES.map((cat) => {
            const count = (resources || []).filter((r) => r && r.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                {cat === 'Notes' ? 'Topper Notes & Handouts' : cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          const isSaved = savedResourceIds.includes(res.id);
          return (
            <div
              key={res.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 hover:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      {res.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedbackResource(res);
                      }}
                      className="flex items-center gap-1 rounded-full bg-amber-950/70 hover:bg-amber-900/80 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800/60 transition-colors shadow-sm"
                      title="View peer ratings & comments"
                    >
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{(res.rating ?? 4.9).toFixed(1)}</span>
                      <span className="text-amber-400/70 font-normal">
                        ({res.comments?.length || res.ratingsCount || 0})
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => onToggleSaveResource(res.id)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                    title={isSaved ? 'Remove from Saved' : 'Save to Study Hub'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 text-cyan-400 fill-cyan-400" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div
                  className="cursor-pointer group"
                  onClick={() => handleOpenBook(res, 'reader')}
                >
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {res.subject} • Sem {res.semester} • {res.author}
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                {res.unitsSummary && res.unitsSummary.length > 0 && (
                  <div className="rounded-lg bg-slate-950/60 p-2.5 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Syllabus Coverage:</p>
                    <p className="line-clamp-2">{res.unitsSummary[0]}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setFeedbackResource(res)}
                    className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 font-medium transition-colors"
                    title="Open comments and student feedback"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Feedback ({res.comments?.length || res.ratingsCount || 0})</span>
                  </button>
                  <span>•</span>
                  <span>{(Number(res.downloads ?? 0)).toLocaleString()} dl</span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFeedbackResource(res)}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors"
                    title="Rate & give feedback"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>Review</span>
                  </button>
                  <button
                    onClick={() => handleOpenBook(res, 'reader')}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors"
                    title="Read book chapters & notes"
                  >
                    <Eye className="h-3.5 w-3.5 text-cyan-400" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdfCard(res)}
                    className="flex items-center gap-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-2.5 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                    title="Download & View PDF document"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Feedback for PDF Generation */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 border border-cyan-500/50 px-4 py-3 text-cyan-200 text-xs shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <Download className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* FULL BOOK READER & OFFICIAL ACADEMIC PDF MODAL */}
      {viewingResource && (
        <BookReaderModal
          resource={viewingResource}
          onClose={() => setViewingResource(null)}
          isSaved={savedResourceIds.includes(viewingResource.id)}
          onToggleSave={onToggleSaveResource}
          initialViewMode={modalInitialMode}
          onOpenFeedback={(res) => setFeedbackResource(res)}
        />
      )}

      {/* STUDY RESOURCE COMMENTS & RATING MODAL */}
      {feedbackResource && (
        <ResourceCommentsModal
          resource={feedbackResource}
          onClose={() => setFeedbackResource(null)}
          profile={profile}
          onAddComment={async (resourceId, data) => {
            if (onAddResourceComment) {
              await onAddResourceComment(resourceId, data);
            }
            setFeedbackResource((prev) => {
              if (!prev || prev.id !== resourceId) return prev;
              const newComm = {
                id: `comm-${Date.now()}`,
                resourceId,
                authorName: profile.name,
                authorRoll: profile.rollNo,
                authorBranch: profile.course,
                authorYear: profile.year,
                rating: data.rating,
                comment: data.comment,
                tag: data.tag,
                createdAt: 'Just now',
                helpfulCount: 0,
              };
              const updatedList = [newComm, ...(prev.comments || [])];
              const avg = Number((updatedList.reduce((acc, c) => acc + (c.rating || 5), 0) / updatedList.length).toFixed(1));
              return {
                ...prev,
                rating: avg,
                ratingsCount: updatedList.length,
                comments: updatedList,
              };
            });
          }}
          onLikeComment={onLikeResourceComment}
        />
      )}
    </div>
  );
};
