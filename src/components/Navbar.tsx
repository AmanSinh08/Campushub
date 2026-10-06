import React, { useState } from 'react';
import {
  ShoppingBag,
  BookOpen,
  FileQuestion,
  Sparkles,
  Target,
  LayoutDashboard,
  ShieldCheck,
  Plus,
  UploadCloud,
  User,
  CheckCircle2,
  Menu,
  X,
  Compass,
  ChevronRight,
  Bell,
  Check,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';
import { CampusHubLogo } from './CampusHubLogo';
import { getDynamicGreeting } from '../utils/greeting';

interface NavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewListing: () => void;
  profile: StudentProfile;
  onOpenAuthModal: () => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenNewListing,
  profile,
  onOpenAuthModal,
  onOpenUploadModal,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dynamicGreeting = getDynamicGreeting(profile?.name);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'Active' },
    { id: 'study-hub', label: 'Study Hub', icon: BookOpen, badge: 'PDFs' },
    { id: 'pyq-bank', label: 'PYQ Bank', icon: FileQuestion },
    { id: 'practice-engine', label: 'Practice Engine', icon: Target },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'Smart' },
    { id: 'trust-safety', label: 'Trust & Safety', icon: ShieldCheck },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onNavigate(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white border-r border-[#E5E7EB] z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E5E7EB]">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <CampusHubLogo size={34} glow={false} />
            <div>
              <span className="font-bold text-base text-[#171717] tracking-tight block leading-tight font-sans">
                Campus<span className="text-[#2563EB]">Hub</span>
              </span>
              <span className="text-[11px] text-[#6B7280] font-medium block leading-tight">
                Our Campus. One Hub.
              </span>
            </div>
          </button>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="p-4 space-y-2 border-b border-[#E5E7EB] bg-[#F7F7F5]/50">
          <button
            onClick={onOpenNewListing}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Sell on Campus</span>
          </button>
          <button
            onClick={onOpenUploadModal}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#171717] border border-[#E5E7EB] text-xs font-medium transition-all"
          >
            <UploadCloud className="h-4 w-4 text-[#2563EB]" />
            <span>Upload Notes / PDF</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F7F7F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#E5E7EB] text-[#6B7280]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Profile Footer Card */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onOpenAuthModal}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F7F7F5] border border-transparent hover:border-[#E5E7EB] transition-all text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center border border-[#DBEAFE] shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-[#171717] truncate leading-tight">
                  {profile?.name || 'Verified Student'}
                </p>
                {profile?.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                {profile?.rollNo ? `Roll: ${profile.rollNo}` : profile?.course || 'Student Account'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9CA3AF] shrink-0" />
          </button>
        </div>
      </aside>

      {/* TOP HEADER (Mobile & Desktop Top Bar) */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile Drawer Trigger & Greeting with subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#6B7280] hover:text-[#171717] hover:bg-[#F7F7F5] transition-colors shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-[#171717] tracking-tight leading-tight truncate">
                {dynamicGreeting.fullGreeting}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#6B7280] leading-tight truncate mt-0.5">
                Ready to make today productive?
              </p>
            </div>
          </div>

          {/* Right: Notification Bell & Small Circular Profile/Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#171717] hover:bg-[#F7F7F5] border border-transparent hover:border-[#E5E7EB] transition-all"
                title="Notifications"
                aria-label="Campus notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white"></span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-3 z-50 animate-scale-in text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] px-1">
                    <span className="font-bold text-[#171717]">Campus Updates</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-[#2563EB] hover:underline font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-0.5">
                      <p className="font-semibold text-[#171717]">📚 Unit 4 Notes Uploaded</p>
                      <p className="text-[11px] text-[#6B7280]">Differential Equations handwritten notes ready.</p>
                      <p className="text-[10px] text-[#2563EB]">15 min ago</p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] space-y-0.5">
                      <p className="font-semibold text-[#171717]">🔥 5-Day Study Streak Active</p>
                      <p className="text-[11px] text-[#6B7280]">Keep going — consistency beats cramming.</p>
                      <p className="text-[10px] text-[#6B7280]">Today</p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] space-y-0.5">
                      <p className="font-semibold text-[#171717]">🛍️ Marketplace Listing Live</p>
                      <p className="text-[11px] text-[#6B7280]">Your textbooks are visible to verified campus peers.</p>
                      <p className="text-[10px] text-[#6B7280]">Yesterday</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Small circular profile/avatar */}
            <button
              onClick={onOpenAuthModal}
              className="relative h-9 w-9 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] hover:ring-2 hover:ring-blue-400/40 transition-all font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
              title={`Student Profile: ${profile?.name || 'Account'}`}
              aria-label="Open student profile"
            >
              <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}</span>
              {profile?.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER MODAL / SHEET */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 border-r border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CampusHubLogo size={28} glow={false} />
                <span className="font-bold text-sm text-[#171717] font-sans">
                  Campus<span className="text-[#2563EB]">Hub</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#171717] hover:bg-[#F7F7F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-2 border-b border-[#E5E7EB] bg-[#F7F7F5]/60">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenNewListing();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Sell on Campus</span>
              </button>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenUploadModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#171717] text-xs font-medium"
              >
                <UploadCloud className="h-4 w-4 text-[#2563EB]" />
                <span>Upload Notes / PDF</span>
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                        : 'text-[#6B7280] hover:text-[#171717] hover:bg-[#F7F7F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E5E7EB] text-[#6B7280]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile trigger in drawer */}
            <div className="p-4 border-t border-[#E5E7EB]">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171717] truncate">{profile?.name || 'Verified Student'}</p>
                  <p className="text-[10px] text-[#6B7280] truncate">Roll: {profile?.rollNo || 'Account Settings'}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-30 px-2 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around">
          {[
            { id: 'overview' as ActiveTab, label: 'Home', icon: Compass },
            { id: 'marketplace' as ActiveTab, label: 'Market', icon: ShoppingBag },
            { id: 'study-hub' as ActiveTab, label: 'Study Hub', icon: BookOpen },
            { id: 'practice-engine' as ActiveTab, label: 'Practice', icon: Target },
            { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
