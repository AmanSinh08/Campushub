import React, { useState, useMemo, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  X,
  Download,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Search,
  Bookmark,
  BookmarkCheck,
  Printer,
  FileDown,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  BookMarked,
  List,
  HelpCircle,
  Clock,
  FileText,
  ExternalLink,
  Star,
  MessageSquare,
} from 'lucide-react';
import { StudyResource, BookChapter } from '../types';
import { getChaptersForResource, downloadResourcePdf, generatePdfBlobUrl } from '../utils/bookContent';

interface BookReaderModalProps {
  resource: StudyResource;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  initialViewMode?: 'reader' | 'pdf';
  onOpenFeedback?: (resource: StudyResource) => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  resource,
  onClose,
  isSaved = false,
  onToggleSave,
  initialViewMode = 'reader',
  onOpenFeedback,
}) => {
  const chapters = useMemo(() => getChaptersForResource(resource), [resource]);

  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>(initialViewMode);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [showExamQuestions, setShowExamQuestions] = useState<boolean>(true);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Generate or refresh PDF blob URL when switching to PDF mode or chapter change
  useEffect(() => {
    let currentUrl: string | null = null;
    if (viewMode === 'pdf') {
      currentUrl = generatePdfBlobUrl(resource, activeChapterIndex);
      setPdfBlobUrl(currentUrl);
    }
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [viewMode, resource, activeChapterIndex]);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleDownloadPdf = () => {
    setDownloadToast(`Preparing & downloading "${resource.title}" PDF...`);
    const success = downloadResourcePdf(resource, activeChapterIndex);
    setTimeout(() => {
      if (success) {
        setDownloadToast(`"${resource.title}" PDF successfully downloaded! Check your downloads.`);
      } else {
        setDownloadToast(`PDF downloaded as print document.`);
      }
      setTimeout(() => setDownloadToast(null), 4500);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(150, Math.max(75, prev + delta)));
  };

  // Theme styling definitions
  const themeClasses = {
    dark: {
      bg: 'bg-[#0b0f19]',
      cardBg: 'bg-[#0f172a]',
      paperBg: 'bg-[#131b2e] border-slate-700/80 text-slate-100',
      headerBg: 'bg-[#0b1120] border-slate-800 text-slate-200',
      sidebarBg: 'bg-[#0b1120] border-slate-800 text-slate-300',
      textColor: 'text-slate-100',
      mutedText: 'text-slate-400',
      accentBorder: 'border-cyan-500/40',
      codeBg: 'bg-slate-950 border-slate-800 text-cyan-300',
    },
    sepia: {
      bg: 'bg-[#f4ecd8]',
      cardBg: 'bg-[#fbf0d9]',
      paperBg: 'bg-[#fdf6e7] border-[#e2d4b7] text-[#3e2e1e]',
      headerBg: 'bg-[#efe3cb] border-[#dfcfb0] text-[#3e2e1e]',
      sidebarBg: 'bg-[#ebdcc0] border-[#dfcfb0] text-[#4a3b2a]',
      textColor: 'text-[#3e2e1e]',
      mutedText: 'text-[#725e46]',
      accentBorder: 'border-[#c49b63]',
      codeBg: 'bg-[#f2e2c2] border-[#dfcfb0] text-[#633a11]',
    },
    light: {
      bg: 'bg-slate-100',
      cardBg: 'bg-white',
      paperBg: 'bg-white border-slate-300 text-slate-900 shadow-md',
      headerBg: 'bg-slate-50 border-slate-200 text-slate-800',
      sidebarBg: 'bg-slate-50 border-slate-200 text-slate-700',
      textColor: 'text-slate-900',
      mutedText: 'text-slate-600',
      accentBorder: 'border-cyan-600',
      codeBg: 'bg-slate-100 border-slate-200 text-indigo-950',
    },
  }[readingTheme];

  // Filtered chapters if search query is entered
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.keyTopics.some((t) => t.toLowerCase().includes(q)) ||
        c.content.toLowerCase().includes(q)
    );
  }, [chapters, searchQuery]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${themeClasses.bg} ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 sm:pt-3'
      } backdrop-blur-md transition-colors duration-200`}
    >
      {/* Toast notification */}
      {downloadToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-cyan-600 text-white px-5 py-2.5 shadow-2xl text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-200" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div
        className={`flex-1 flex flex-col overflow-hidden rounded-2xl border ${themeClasses.cardBg} ${
          isFullscreen ? 'rounded-none border-0' : 'shadow-2xl border-slate-700/80'
        }`}
      >
        {/* READER HEADER TOOLBAR */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b ${themeClasses.headerBg} shrink-0`}
        >
          {/* Left: Book Meta & Category */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-lg border border-slate-700/60 hover:bg-black/10 transition-colors"
              title="Toggle chapters drawer"
            >
              <List className="h-4 w-4" />
            </button>

            <div className="h-8 w-8 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {resource.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {resource.subject} • Sem {resource.semester}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md md:max-w-xl">
                {resource.title}
              </h2>
            </div>
          </div>

          {/* Right: Controls (Theme, Zoom, Download, Print, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            {/* View Mode Switcher: Interactive Book vs Official PDF View */}
            <div className="flex items-center rounded-lg border border-slate-700/60 p-0.5 bg-black/30 text-xs">
              <button
                onClick={() => setViewMode('reader')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  viewMode === 'reader'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive Textbook Reader with Chapters & Exam Tips"
              >
                <BookOpen className="h-3 w-3" />
                <span>Interactive Book</span>
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  viewMode === 'pdf'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Official Academic PDF Document View"
              >
                <FileText className="h-3 w-3" />
                <span>Official PDF View</span>
              </button>
            </div>

            {/* Reading Theme Selector (only in reader mode) */}
            {viewMode === 'reader' && (
              <div className="flex items-center rounded-lg border border-slate-700/60 p-0.5 bg-black/20 text-xs">
                <button
                  onClick={() => setReadingTheme('dark')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    readingTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Dark Mode (Midnight)"
                >
                  <Moon className="h-3 w-3" />
                  <span className="hidden md:inline">Dark</span>
                </button>
                <button
                  onClick={() => setReadingTheme('sepia')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    readingTheme === 'sepia' ? 'bg-[#ebdcc0] text-[#3e2e1e]' : 'text-slate-400 hover:text-[#3e2e1e]'
                  }`}
                  title="Sepia Mode (Warm Book Paper)"
                >
                  <Coffee className="h-3 w-3" />
                  <span className="hidden md:inline">Sepia</span>
                </button>
                <button
                  onClick={() => setReadingTheme('light')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    readingTheme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-900'
                  }`}
                  title="Light Mode (Crisp Paper)"
                >
                  <Sun className="h-3 w-3" />
                  <span className="hidden md:inline">Light</span>
                </button>
              </div>
            )}

            {/* Zoom Controls (only in reader mode) */}
            {viewMode === 'reader' && (
              <div className="hidden sm:flex items-center rounded-lg border border-slate-700/60 p-0.5 bg-black/20 text-xs">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-[10px] font-mono font-bold text-slate-400">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Save / Bookmark Button */}
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(resource.id)}
                className="flex items-center gap-1 rounded-lg border border-slate-700/60 px-2.5 py-1.5 text-xs font-semibold hover:bg-black/10 transition-colors"
                title={isSaved ? 'Bookmarked in Study Hub' : 'Bookmark this book'}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="hidden lg:inline text-cyan-400">Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">Save</span>
                  </>
                )}
              </button>
            )}

            {/* Student Reviews & Feedback */}
            {onOpenFeedback && (
              <button
                onClick={() => onOpenFeedback(resource)}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors shadow-sm"
                title="View & write student reviews and ratings"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>Reviews ({(resource.rating ?? 4.9).toFixed(1)})</span>
              </button>
            )}

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow transition-all active:scale-95"
              title="Download academic PDF document"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg border border-slate-700/60 hover:bg-black/10 transition-colors hidden md:flex"
              title="Print document"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-slate-700/60 hover:bg-black/10 transition-colors hidden sm:flex"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20 transition-colors"
              title="Close Reader"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* READER MAIN BODY (SIDEBAR + PAGE VIEWPORT) OR OFFICIAL PDF VIEW */}
        {viewMode === 'pdf' ? (
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* PDF Sub-bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase">
                  Academic PDF Format
                </span>
                <span className="text-white font-semibold truncate max-w-sm">
                  {resource.title}
                </span>
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  • Unit {currentChapter.chapterNumber}: {currentChapter.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow transition-all active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .PDF File</span>
                </button>

                {pdfBlobUrl && (
                  <a
                    href={pdfBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-200 transition-colors"
                    title="Open PDF in separate browser tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Open in Tab</span>
                  </a>
                )}
              </div>
            </div>

            {/* Embedded PDF Viewer or Visual Layout */}
            <div className="flex-1 w-full h-full relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              {pdfBlobUrl ? (
                <iframe
                  src={`${pdfBlobUrl}#toolbar=1&navpanes=1`}
                  title={`${resource.title} PDF Document`}
                  className="w-full h-full border-0 bg-slate-900"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="h-12 w-12 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-white">Generating Official PDF Document...</p>
                  <button
                    onClick={handleDownloadPdf}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Download Direct PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
          {/* CHAPTERS SIDEBAR */}
          {showSidebar && (
            <div
              className={`w-64 sm:w-72 md:w-80 border-r ${themeClasses.sidebarBg} flex flex-col shrink-0 overflow-hidden transition-all`}
            >
              {/* Search within Book */}
              <div className="p-3 border-b border-inherit">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in book topics..."
                    className="w-full rounded-lg border border-inherit bg-black/10 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Table of Contents List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  <span>Table of Contents</span>
                  <span>{chapters.length} Units</span>
                </div>

                {filteredChapters.map((ch, idx) => {
                  const originalIndex = chapters.findIndex((c) => c.id === ch.id);
                  const isActive = originalIndex === activeChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapterIndex(originalIndex)}
                      className={`w-full text-left rounded-xl p-2.5 transition-all text-xs border ${
                        isActive
                          ? 'bg-cyan-600 text-white border-cyan-500 font-semibold shadow-md'
                          : 'border-transparent hover:bg-black/10 hover:border-inherit text-inherit'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-cyan-200' : 'text-slate-400'}`}>
                          Unit {ch.chapterNumber}
                        </span>
                        <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>
                          {ch.pagesRange}
                        </span>
                      </div>
                      <div className="font-bold text-xs mt-0.5 line-clamp-1">
                        {ch.title.replace(/^Unit \d+:?\s*/i, '')}
                      </div>
                      {ch.subtitle && (
                        <p className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>
                          {ch.subtitle}
                        </p>
                      )}
                    </button>
                  );
                })}

                {filteredChapters.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No matching chapters found for "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Sidebar Footer: Document Metadata */}
              <div className="p-3 border-t border-inherit text-[11px] space-y-1.5 bg-black/10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pages:</span>
                  <span className="font-semibold">{resource.pages || 240} Pages</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Downloads:</span>
                  <span className="font-semibold text-cyan-400">{(Number(resource.downloads ?? 0)).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold">{resource.category}</span>
                </div>
                <div className="pt-1.5 text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>Verified BBDITM Academic Content</span>
                </div>
              </div>
            </div>
          )}

          {/* MAIN PAGE VIEWPORT */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
            {/* Top Chapter Breadcrumb & Page Tracker */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-inherit bg-black/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-cyan-400">
                  Unit {currentChapter.chapterNumber} of {chapters.length}
                </span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="font-semibold text-inherit truncate max-w-sm">
                  {currentChapter.title}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Estimated Read: 12 min</span>
              </div>
            </div>

            {/* Scrollable Document Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  width: '100%',
                  maxWidth: '850px',
                }}
                className={`rounded-2xl border p-6 sm:p-10 shadow-xl space-y-6 transition-all duration-150 ${themeClasses.paperBg}`}
              >
                {/* Academic Document Header (University Stamp) */}
                <div className="border-b border-inherit/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
                        BBDITM Digital Academic Repository
                      </span>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.2 border border-emerald-500/20 font-bold">
                        Official Curriculum
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black mt-1">
                      {currentChapter.title}
                    </h1>
                    {currentChapter.subtitle && (
                      <p className="text-xs sm:text-sm mt-0.5 opacity-80 italic">
                        {currentChapter.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="text-right sm:border-l sm:border-inherit/30 sm:pl-4 text-xs opacity-75 shrink-0">
                    <p className="font-semibold">{resource.subject}</p>
                    <p>{resource.course} • Sem {resource.semester}</p>
                    <p className="font-mono text-[11px] text-cyan-500 font-bold">{currentChapter.pagesRange}</p>
                  </div>
                </div>

                {/* Key Focus Areas Banner */}
                <div className="rounded-xl border border-inherit/30 bg-black/5 p-3 sm:p-4 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-cyan-500">
                    <BookMarked className="h-3.5 w-3.5" />
                    <span>Unit Key Focus Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentChapter.keyTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-black/10 border border-inherit/20 px-2.5 py-1 text-[11px] font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formula & Invariants Cheat-Sheet Card (if present) */}
                {currentChapter.formulas && currentChapter.formulas.length > 0 && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                      <Sparkles className="h-4 w-4" />
                      <span>Exam Formula & Mathematical Invariants</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-amber-300">
                      {currentChapter.formulas.map((formula, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-black/30 border border-amber-500/20 px-3 py-1.5"
                        >
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Chapter Content formatted with Markdown */}
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                  <Markdown>{currentChapter.content}</Markdown>
                </div>

                {/* High-Frequency University Exam Questions */}
                {currentChapter.examQuestions && currentChapter.examQuestions.length > 0 && (
                  <div className="border-t border-inherit/40 pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-cyan-400">
                        <HelpCircle className="h-4 w-4" />
                        <span>High-Frequency University Exam Questions</span>
                      </div>
                      <button
                        onClick={() => setShowExamQuestions(!showExamQuestions)}
                        className="text-[11px] text-cyan-500 hover:underline font-semibold"
                      >
                        {showExamQuestions ? 'Collapse' : 'Show Questions'}
                      </button>
                    </div>

                    {showExamQuestions && (
                      <div className="space-y-2 pt-1">
                        {currentChapter.examQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-inherit/30 bg-black/10 p-3 text-xs leading-relaxed"
                          >
                            <span className="font-bold text-cyan-400 mr-1.5">Q{idx + 1}:</span>
                            <span>{q.replace(/^Q\d+:?\s*/i, '')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Academic Fair-Use Notice */}
                <div className="border-t border-inherit/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] opacity-60">
                  <span>Author: {resource.author} • Department Curriculum</span>
                  <span>CampusHub Academic Fair-Use Copy • BBDITM Lucknow</span>
                </div>
              </div>
            </div>

            {/* BOTTOM NAVIGATION TOOLBAR */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-t border-inherit bg-black/10 shrink-0">
              <button
                onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeChapterIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 px-3 py-1.5 text-xs font-semibold hover:bg-black/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Unit</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Unit <span className="font-bold text-white">{activeChapterIndex + 1}</span> of {chapters.length}
                </span>

                <button
                  onClick={handleDownloadPdf}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-cyan-600/90 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download This Book PDF</span>
                </button>
              </div>

              <button
                onClick={() => setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))}
                disabled={activeChapterIndex === chapters.length - 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 px-3 py-1.5 text-xs font-semibold hover:bg-black/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next Unit</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
