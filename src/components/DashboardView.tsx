import React from 'react';
import {
  User,
  ShoppingBag,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  UploadCloud,
  LogIn,
  Plus,
  FileText,
} from 'lucide-react';
import { StudentProfile, MarketplaceItem, StudyResource, ActiveTab } from '../types';
import { PRESENTER_INFO } from '../data/mockData';

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
    <div className="space-y-8 pb-16">
      {/* Header & Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-xl font-bold text-white shadow-lg">
              {profile?.name ? profile.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h1>
                <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Student</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Roll No: <span className="font-mono text-slate-300">{profile.rollNo}</span> • {profile.course} • Year {profile.year} • {profile.college}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenUploadModal && (
              <button
                id="dashboard-upload-btn"
                onClick={onOpenUploadModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-900/30 transition-all"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload PDF / Notes</span>
              </button>
            )}

            {onOpenAuthModal && (
              <button
                id="dashboard-manage-profile-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all"
              >
                <User className="h-3.5 w-3.5 text-cyan-400" />
                <span>Profile & Login</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Hero Stats matching Slide 10 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Active Listings
            </span>
            <p className="text-2xl font-bold text-white mt-1">{myListings?.length || 0}</p>
            <p className="text-[10px] text-cyan-400 mt-0.5">Campus Marketplace</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Saved Study Hub
            </span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{savedResources?.length || 0}</p>
            <p className="text-[10px] text-emerald-300 mt-0.5">Textbooks & PYQs</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Adaptive Practice
            </span>
            <p className="text-2xl font-bold text-amber-400 mt-1">{profile.practiceScore}%</p>
            <p className="text-[10px] text-amber-300 mt-0.5">{profile.testsAttempted} Tests Completed</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Primary Weak Area
            </span>
            <p className="text-sm font-bold text-rose-400 mt-1 truncate" title={profile.weakArea}>
              {profile.weakArea}
            </p>
            <p className="text-[10px] text-rose-300 mt-0.5">Diagnosed by AI</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Listings & Saved Study Resources */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Listings Section */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">My Active Campus Listings</h2>
              </div>
              <button
                onClick={() => onNavigate('marketplace')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Add / Manage</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {(myListings?.length || 0) === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active listings yet.</p>
            ) : (
              <div className="space-y-3">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-12 w-12 rounded-lg object-cover bg-slate-950"
                      />
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                        <p className="text-[11px] text-slate-400">
                          ₹{item.price} • {item.condition} • {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === 'available'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
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
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200"
                      >
                        {item.status === 'available' ? 'Mark Sold' : 'Relist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Resources Section */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Saved Resources & Textbooks</h2>
              </div>
              <button
                onClick={() => onNavigate('study-hub')}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Browse Hub</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {(savedResources?.length || 0) === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No saved resources yet. Explore the Digital Study Hub to bookmark curriculum materials!
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 hover:border-slate-700"
                  >
                    <div>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                        {res.category}
                      </span>
                      <h4 className="text-xs font-semibold text-white mt-1">{res.title}</h4>
                      <p className="text-[11px] text-slate-400">{res.subject} • {res.author}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('study-hub')}
                      className="rounded-lg bg-cyan-950 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 px-3 py-1 text-xs font-semibold"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Uploaded Materials Section */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">My Uploaded Books & Notes ({myUploads?.length || 0})</h2>
              </div>
              {onOpenUploadModal && (
                <button
                  onClick={onOpenUploadModal}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="h-3 w-3" />
                  <span>Upload New</span>
                </button>
              )}
            </div>

            {(myUploads?.length || 0) === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-center space-y-2.5">
                <FileText className="h-7 w-7 text-slate-500 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-300">You haven't uploaded any books or notes yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Share authorized PDF books or topper notes. Once uploaded, they automatically appear in the Study Hub for all students!
                  </p>
                </div>
                {onOpenUploadModal && (
                  <button
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload Book / Notes Now</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {myUploads.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 hover:border-slate-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                          {res.category}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ✓ Live for All Students
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white">{res.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {res.subject} • {res.fileSize} {res.pages ? `• ${res.pages} pages` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('study-hub')}
                      className="rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 px-3 py-1 text-xs font-semibold"
                    >
                      View in Hub
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): AI Weakness Tracker & Recommended Next Steps */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Weakness Tracker Card (Slide 10) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">AI Weakness Tracker</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated concept mastery breakdown derived from test attempts
              </p>
            </div>

            <div className="space-y-3">
              {[
                { concept: 'TCP Congestion Control (Tahoe / Reno)', mastery: 42, color: 'bg-rose-500' },
                { concept: 'Database Normalization (BCNF vs 3NF)', mastery: 68, color: 'bg-amber-500' },
                { concept: 'AVL Tree Double Rotations', mastery: 85, color: 'bg-emerald-500' },
                { concept: 'Process Deadlock Banker’s Algorithm', mastery: 74, color: 'bg-blue-500' },
              ].map((c) => (
                <div key={c.concept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{c.concept}</span>
                    <span className="font-bold text-slate-400">{c.mastery}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color}`}
                      style={{ width: `${c.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('practice-engine')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 py-2 text-xs font-semibold text-white shadow-md transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Drill for Weak Areas</span>
            </button>
          </div>

          {/* Recommended Next Steps (Slide 10) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Recommended Next Steps
            </h3>

            <div className="space-y-2 text-xs">
              <div
                onClick={() => onNavigate('pyq-bank')}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-500/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-white">Solve 2025 DBMS End-Sem Paper</p>
                  <p className="text-[11px] text-slate-400">Exam scheduled in 3 weeks</p>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </div>

              <div
                onClick={() => onNavigate('ai-assistant')}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-purple-500/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-white">Ask AI: 5-min Revision for TCP</p>
                  <p className="text-[11px] text-slate-400">Strengthen diagnosed weakness</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </div>

              <div
                onClick={() => onNavigate('marketplace')}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-cyan-500/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-white">Check Senior Textbook Listings</p>
                  <p className="text-[11px] text-slate-400">4 new books listed in Boys Hostel</p>
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
