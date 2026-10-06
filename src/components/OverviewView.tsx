import React from 'react';
import {
  ShoppingBag,
  BookOpen,
  FileQuestion,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Search,
  Plus,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Card with Staggered Entrance */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 md:p-10 shadow-xs animate-slide-up">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold border border-[#DBEAFE] animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
            <span>All-In-One Campus Productivity Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-tight leading-tight animate-slide-up stagger-1">
            Everything for your campus life, <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">in one unified workspace.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed animate-slide-up stagger-2">
            Buy & sell textbooks within your hostel safely, read verified topper notes, solve previous year questions with step-by-step AI answers, and track your semester prep.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 animate-slide-up stagger-3">
            <button
              onClick={() => onNavigate('marketplace')}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explore Marketplace</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('study-hub')}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#171717] border border-[#E5E7EB] text-xs sm:text-sm font-medium"
            >
              <BookOpen className="h-4 w-4 text-[#2563EB]" />
              <span>Browse Study Notes & PDFs</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid with Staggered Entrance & Interactive Hover */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#171717]">Campus Ecosystem Features</h2>
            <p className="text-xs text-[#6B7280]">Select a workspace to start studying or trading</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Marketplace */}
          <div
            onClick={() => onNavigate('marketplace')}
            className="card-interactive cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between group animate-slide-up stagger-1"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white group-hover:scale-105 transition-all">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Campus Marketplace</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Buy & sell textbooks, calculators, cycles, and study lamps with roll-number verified peers. Zero commission.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
              <span>View Listings</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Study Hub */}
          <div
            onClick={() => onNavigate('study-hub')}
            className="card-interactive cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between group animate-slide-up stagger-2"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white group-hover:scale-105 transition-all">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Study Hub & Notes</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Access curated textbooks, verified topper notes, and course PDFs with built-in interactive reader and peer reviews.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
              <span>Open Library</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: PYQ Bank */}
          <div
            onClick={() => onNavigate('pyq-bank')}
            className="card-interactive cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between group animate-slide-up stagger-3"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white group-hover:scale-105 transition-all">
                <FileQuestion className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">PYQ Bank & Solutions</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Previous year university question papers with AI-generated step-by-step marking scheme answers and code.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
              <span>Browse Papers</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Practice Engine */}
          <div
            onClick={() => onNavigate('practice-engine')}
            className="card-interactive cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between group animate-slide-up stagger-4"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white group-hover:scale-105 transition-all">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">Practice & AI Assistant</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Take timed semester practice tests, detect topic weak areas, and ask complex academic queries instantly.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2563EB]">
              <span>Start Practice</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety highlights */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-xs animate-slide-up stagger-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">Roll Number Verified</h4>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Only authenticated university students with valid roll numbers and email OTP can trade or post notes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">Campus Safe Zones</h4>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Designated in-person exchange spots at college library, cafeteria, and hostel main gates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">Academic Tracking</h4>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Automatically tracks test history, identifies weak concepts, and recommends target revision notes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
