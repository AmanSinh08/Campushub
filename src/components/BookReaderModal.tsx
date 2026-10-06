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
  Sparkles,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  List,
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
  onOpenComments?: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  resource,
  onClose,
  isSaved = false,
  onToggleSave,
  initialViewMode = 'reader',
  onOpenComments,
}) => {
  const chapters = useMemo(() => getChaptersForResource(resource), [resource]);

  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>(initialViewMode);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

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
        setDownloadToast(`"${resource.title}" PDF downloaded successfully!`);
      } else {
        setDownloadToast(`PDF downloaded as print document.`);
      }
      setTimeout(() => setDownloadToast(null), 4000);
    }, 500);
  };

  const themeClasses = {
    light: 'bg-white text-[#171717]',
    sepia: 'bg-[#FAF6EE] text-[#433422]',
    dark: 'bg-[#121826] text-[#E2E8F0]',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`w-full max-w-6xl rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden ${
          isFullscreen ? 'h-full rounded-none' : 'h-[92vh]'
        }`}
      >
        {/* Top Action Bar */}
        <div className="h-14 border-b border-[#E5E7EB] px-4 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F7F7F5] shrink-0"
              title="Toggle Chapters Sidebar"
            >
              <List className="h-5 w-5" />
            </button>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-bold text-[#171717] truncate">
                {resource.title}
              </h2>
              <p className="text-[11px] text-[#6B7280] truncate">
                {resource.subject} • Chapter {currentChapter?.chapterNumber || 1}: {currentChapter?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme switcher */}
            <div className="flex items-center rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] p-0.5">
              <button
                onClick={() => setReadingTheme('light')}
                className={`p-1.5 rounded-lg text-xs ${readingTheme === 'light' ? 'bg-white shadow-xs text-[#171717]' : 'text-[#6B7280]'}`}
                title="Light Reading Mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`p-1.5 rounded-lg text-xs ${readingTheme === 'sepia' ? 'bg-[#FAF6EE] shadow-xs text-[#433422]' : 'text-[#6B7280]'}`}
                title="Sepia Mode"
              >
                <Coffee className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('dark')}
                className={`p-1.5 rounded-lg text-xs ${readingTheme === 'dark' ? 'bg-[#121826] shadow-xs text-white' : 'text-[#6B7280]'}`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            {onOpenComments && (
              <button
                onClick={onOpenComments}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F7F7F5] text-[#6B7280]"
                title="Reviews"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#171717]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Download Toast Notification */}
        {downloadToast && (
          <div className="bg-[#DCFCE7] border-b border-green-200 px-4 py-2 text-xs text-[#16A34A] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {downloadToast}
            </span>
            <button onClick={() => setDownloadToast(null)} className="text-[#16A34A]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chapter navigation sidebar */}
          {showSidebar && (
            <aside className="w-64 border-r border-[#E5E7EB] bg-[#F7F7F5]/50 flex flex-col shrink-0">
              <div className="p-3 border-b border-[#E5E7EB]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Filter chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chapters.map((ch, idx) => {
                  const isSelected = idx === activeChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#DBEAFE]'
                          : 'text-[#6B7280] hover:text-[#171717] hover:bg-white'
                      }`}
                    >
                      <p className="text-[10px] font-semibold text-[#9CA3AF]">
                        Chapter {ch.chapterNumber}
                      </p>
                      <p className="truncate font-medium">{ch.title}</p>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Reading Canvas */}
          <main className={`flex-1 overflow-y-auto p-6 sm:p-10 ${themeClasses[readingTheme]}`}>
            <article className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-gray-200/60 pb-4">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  Chapter {currentChapter?.chapterNumber}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
                  {currentChapter?.title}
                </h1>
                {currentChapter?.subtitle && (
                  <p className="text-sm text-[#6B7280] mt-1">{currentChapter.subtitle}</p>
                )}
              </div>

              {/* Markdown content */}
              <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                <Markdown>{currentChapter?.content || ''}</Markdown>
              </div>

              {/* Key Formulas Section */}
              {currentChapter?.formulas && currentChapter.formulas.length > 0 && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Key Examination Formulas
                  </h3>
                  <div className="space-y-1 text-xs font-mono">
                    {currentChapter.formulas.map((f, i) => (
                      <div key={i} className="p-2 rounded bg-white border border-gray-200">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter Navigation Stepper */}
              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between">
                <button
                  onClick={() => setActiveChapterIndex((idx) => Math.max(0, idx - 1))}
                  disabled={activeChapterIndex === 0}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40"
                >
                  ← Previous Chapter
                </button>

                <button
                  onClick={() => setActiveChapterIndex((idx) => Math.min(chapters.length - 1, idx + 1))}
                  disabled={activeChapterIndex === chapters.length - 1}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold disabled:opacity-40"
                >
                  Next Chapter →
                </button>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};
