import React from 'react';
import {
  User,
  ShoppingBag,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  UploadCloud,
  Plus,
  FileText,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { StudentProfile, MarketplaceItem, StudyResource, ActiveTab } from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  myListings: MarketplaceItem[];
  savedResources: StudyResource[];
  onNavigate: (tab: ActiveTab) => void;
  onToggleStatus: (id: string, newStatus: 'available' | 'sold') => Promise<void>;
  uploadedResources?: StudyResource[];
  onOpenUploadModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  myListings = [],
  savedResources = [],
  onNavigate,
  onToggleStatus,
  uploadedResources = [],
  onOpenUploadModal,
  onOpenAuthModal,
}) => {
  const myUploads = (uploadedResources || []).filter(
    (r) =>
      Boolean(r) &&
      Boolean(
        profile?.uploadedResourceIds?.includes(r.id) ||
          (r.author && profile?.name && r.author.toLowerCase().includes(profile.name.toLowerCase()))
      )
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-page-enter">
      {/* Back Button */}
      <div className="flex items-center">
        <button
          onClick={() => onNavigate('overview')}
          className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F7F7F5] text-xs font-semibold text-[#6B7280] hover:text-[#171717] transition-all shadow-2xs"
          title="Back to Overview"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#2563EB]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 1. GREETING / HEADER CARD with slide-up entrance */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-xl font-bold flex items-center justify-center shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                  Welcome back, {profile?.name || 'Student'}
                </h1>
                {profile?.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-bold text-[#16A34A] border border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B7280] mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-mono text-[#171717] font-semibold">Roll: {profile?.rollNo || '2100540130042'}</span>
                <span>•</span>
                <span>{profile?.course || 'B.Tech CSE'}</span>
                <span>•</span>
                <span>{profile?.year || '3rd Year'}</span>
                <span>•</span>
                <span className="text-[#6B7280]">{profile?.college || 'BBDITM'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload PDF / Notes</span>
              </button>
            )}

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#171717] border border-[#E5E7EB] text-xs font-medium"
              >
                <User className="h-3.5 w-3.5 text-[#6B7280]" />
                <span>Account Profile</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. IMPORTANT SUMMARY CARDS with Staggered Entrance and Card Hover */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-slide-up stagger-1">
        {/* Metric 1 */}
        <div className="card-interactive rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Active Listings
            </span>
            <div className="h-7 w-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <ShoppingBag className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-[#171717]">{myListings?.length || 0}</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Marketplace peer items</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-interactive rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Saved Library
            </span>
            <div className="h-7 w-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-[#16A34A]">{savedResources?.length || 0}</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Bookmarked textbooks & notes</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-interactive rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Practice Score
            </span>
            <div className="h-7 w-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-[#D97706]">{profile.practiceScore}%</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{profile.testsAttempted} mock tests taken</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card-interactive rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Diagnosed Weakness
            </span>
            <div className="h-7 w-7 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs sm:text-sm font-bold text-[#DC2626] truncate" title={profile.weakArea}>
              {profile.weakArea}
            </p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Target review recommended</p>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S FOCUS & WEAK AREA DRILL BANNER */}
      <section className="rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up stagger-2">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#171717]">
              Today's Recommended Drill: {profile.focusWeakTopic || profile.weakArea}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Target this diagnosed topic before the upcoming semester examination to boost your overall mastery score.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('practice-engine')}
          className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shrink-0"
        >
          <Target className="h-3.5 w-3.5" />
          <span>Launch Topic Quiz</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>

      {/* 4. MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up stagger-3">
        {/* Left Column (7 cols): Saved Notes & Marketplace Listings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved Resources Card */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#171717]">Saved Notes & Textbooks</h3>
              </div>
              <button
                onClick={() => onNavigate('study-hub')}
                className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {(savedResources?.length || 0) === 0 ? (
              <div className="py-6 text-center text-xs text-[#6B7280]">
                No saved resources yet. Bookmark key textbooks in Study Hub to read them here.
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F7F7F5]/50 p-3 hover:bg-white hover:border-[#2563EB]/40 transition-all gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="inline-block rounded bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold uppercase px-1.5 py-0.5">
                        {res.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#171717] mt-1 truncate">{res.title}</h4>
                      <p className="text-[11px] text-[#6B7280] truncate">{res.subject} • {res.author}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('study-hub')}
                      className="btn-interactive px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-xs font-semibold text-[#171717] hover:text-[#2563EB] shrink-0"
                    >
                      Read Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Uploaded Materials */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-[#16A34A]" />
                <h3 className="text-sm font-bold text-[#171717]">
                  My Uploaded Notes & PDFs ({myUploads?.length || 0})
                </h3>
              </div>
              {onOpenUploadModal && (
                <button
                  onClick={onOpenUploadModal}
                  className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload More</span>
                </button>
              )}
            </div>

            {(myUploads?.length || 0) === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E5E7EB] p-6 text-center space-y-2">
                <FileText className="h-8 w-8 text-[#9CA3AF] mx-auto" />
                <p className="text-xs font-semibold text-[#171717]">No notes or books uploaded yet</p>
                <p className="text-[11px] text-[#6B7280]">
                  Share your topper notes or authorized PDF resources with batchmates across colleges.
                </p>
                {onOpenUploadModal && (
                  <button
                    onClick={onOpenUploadModal}
                    className="btn-interactive mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload First PDF</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {myUploads.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3 bg-white hover:border-[#E5E7EB] gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#DCFCE7] text-[#16A34A] text-[9px] font-bold uppercase px-1.5 py-0.5">
                          {res.category}
                        </span>
                        <span className="text-[10px] text-[#16A34A] font-semibold">✓ Live on Campus</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#171717] mt-1 truncate">{res.title}</h4>
                      <p className="text-[11px] text-[#6B7280] truncate">{res.subject} • {res.fileSize || 'PDF'}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('study-hub')}
                      className="btn-interactive px-3 py-1.5 rounded-lg bg-[#F7F7F5] hover:bg-gray-200/80 text-xs font-medium text-[#171717] shrink-0"
                    >
                      View in Hub
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Marketplace Listings */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#171717]">My Campus Marketplace Listings</h3>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Add New</span>
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {(myListings?.length || 0) === 0 ? (
              <p className="text-xs text-[#6B7280] py-4 text-center">No active listings currently on sale.</p>
            ) : (
              <div className="space-y-3">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-12 w-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-[#E5E7EB]"
                      />
                      <div className="min-w-0 truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#6B7280] truncate">
                          ₹{item.price} • {item.condition} • {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          item.status === 'available'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() =>
                          onToggleStatus(
                            item.id,
                            item.status === 'available' ? 'sold' : 'available'
                          )
                        }
                        className="btn-interactive rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F7F7F5] px-3 py-1 text-xs font-semibold text-[#171717]"
                      >
                        {item.status === 'available' ? 'Mark Sold' : 'Relist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Academic Information & Concept Mastery */}
        <div className="lg:col-span-5 space-y-6">
          {/* Concept Mastery Breakdown with animated progress bars */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#171717]">Academic Concept Mastery</h3>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Real-time tracking computed from your recent semester drills
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                { concept: 'TCP Congestion Control (Tahoe / Reno)', mastery: 42, color: 'bg-[#DC2626]' },
                { concept: 'Database Normalization (BCNF vs 3NF)', mastery: 68, color: 'bg-[#D97706]' },
                { concept: 'AVL Tree Double Rotations', mastery: 85, color: 'bg-[#16A34A]' },
                { concept: 'Process Deadlock Banker’s Algorithm', mastery: 74, color: 'bg-[#2563EB]' },
              ].map((c) => (
                <div key={c.concept} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#171717] truncate mr-2">{c.concept}</span>
                    <span className="font-mono font-bold text-[#6B7280] shrink-0">{c.mastery}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color} transition-all duration-500 ease-out`}
                      style={{ width: `${c.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('practice-engine')}
              className="btn-interactive w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] py-2.5 text-xs font-semibold"
            >
              <Target className="h-3.5 w-3.5" />
              <span>Launch Adaptive Practice Test</span>
            </button>
          </div>

          {/* Recommended Next Actions */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#171717] border-b border-[#E5E7EB] pb-2">
              Next Recommended Actions
            </h3>

            <div className="space-y-2.5 text-xs">
              <div
                onClick={() => onNavigate('pyq-bank')}
                className="btn-interactive cursor-pointer rounded-xl border border-[#E5E7EB] p-3 hover:border-[#2563EB] hover:bg-[#F7F7F5]/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <p className="font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Review 2025 DBMS Exam Paper</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Step-by-step marking answers included</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>

              <div
                onClick={() => onNavigate('ai-assistant')}
                className="btn-interactive cursor-pointer rounded-xl border border-[#E5E7EB] p-3 hover:border-[#2563EB] hover:bg-[#F7F7F5]/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <p className="font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Ask AI: 5-min Revision for TCP</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Focus on your diagnosed weak area</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>

              <div
                onClick={() => onNavigate('marketplace')}
                className="btn-interactive cursor-pointer rounded-xl border border-[#E5E7EB] p-3 hover:border-[#2563EB] hover:bg-[#F7F7F5]/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <p className="font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Browse Senior Textbook Listings</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Discounted semester books on campus</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
