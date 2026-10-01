import React from 'react';
import {
  ShoppingBag,
  BookOpen,
  FileQuestion,
  Sparkles,
  Target,
  LayoutDashboard,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  GraduationCap,
  Home,
  UploadCloud,
  User,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewListing: () => void;
  profile?: StudentProfile;
  onOpenAuthModal?: () => void;
  onOpenUploadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenNewListing,
  profile,
  onOpenAuthModal,
  onOpenUploadModal,
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Home', icon: Home, badge: null },
    { id: 'marketplace' as ActiveTab, label: 'Marketplace', icon: ShoppingBag, badge: null },
    { id: 'study-hub' as ActiveTab, label: 'Study Hub', icon: BookOpen, badge: 'Notes' },
    { id: 'pyq-bank' as ActiveTab, label: 'PYQ Bank + AI', icon: FileQuestion, badge: 'Papers' },
    { id: 'ai-assistant' as ActiveTab, label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'practice-engine' as ActiveTab, label: 'Practice Engine', icon: Target, badge: 'Quiz' },
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'trust-safety' as ActiveTab, label: 'Trust & Safety', icon: ShieldCheck, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1120]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Tagline */}
        <div
          id="brand-logo-button"
          onClick={() => onNavigate('overview')}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30">
            <GraduationCap className="h-6 w-6 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">CampusHub</span>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/60">
                ALL-IN-ONE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Buy • Sell • Study • Practice
            </p>
          </div>
        </div>

        {/* Quick action buttons & profile preview */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenUploadModal && (
            <button
              id="nav-upload-notes-btn"
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-700/80 bg-cyan-950/70 hover:bg-cyan-900/80 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm transition-all"
              title="Upload PDF Book or Handwritten Notes"
            >
              <UploadCloud className="h-4 w-4 text-cyan-400" />
              <span className="hidden lg:inline">Upload Notes</span>
            </button>
          )}

          <button
            id="quick-sell-btn"
            onClick={onOpenNewListing}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Sell Item</span>
            <span className="sm:hidden">Sell</span>
          </button>

          <button
            id="nav-profile-chip"
            onClick={onOpenAuthModal ? onOpenAuthModal : () => onNavigate('dashboard')}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs hover:border-slate-700 transition-colors"
            title="Student Profile & Authentication"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white uppercase">
              {profile?.name ? profile.name[0] : 'S'}
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1">
                <span className="font-medium text-slate-200">{profile?.name || 'Aman Kumar Singh'}</span>
                <span title="Verified Student">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {profile?.course ? `${profile.course} • ${profile.college || 'BBDITM'}` : 'Student Profile'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation tabs row */}
      <div className="overflow-x-auto scrollbar-none border-t border-slate-800/80 bg-slate-950/50 px-4 sm:px-6">
        <nav className="mx-auto flex max-w-7xl items-center gap-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-semibold text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
