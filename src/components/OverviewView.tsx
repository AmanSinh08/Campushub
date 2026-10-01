import React from 'react';
import {
  ShoppingBag,
  BookOpen,
  FileQuestion,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const modules = [
    {
      id: 'marketplace' as ActiveTab,
      title: 'Student Marketplace',
      tagline: 'Buy and sell books, cycles, electronics, furniture, hostel items and more.',
      icon: ShoppingBag,
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      actionText: 'Explore Marketplace',
    },
    {
      id: 'study-hub' as ActiveTab,
      title: 'Digital Study Hub',
      tagline: 'Find curriculum textbooks, toppers handwritten notes, and authorized resources.',
      icon: BookOpen,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      actionText: 'Open Study Hub',
    },
    {
      id: 'pyq-bank' as ActiveTab,
      title: 'PYQ Bank + AI',
      tagline: 'Access previous-year university questions by course, semester, subject & exam.',
      icon: FileQuestion,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      actionText: 'Browse PYQ Papers',
    },
    {
      id: 'ai-assistant' as ActiveTab,
      title: 'AI Study Assistant',
      tagline: 'Understand topics, get bullet summaries, solve doubts and practice with AI.',
      icon: Sparkles,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      actionText: 'Launch AI Buddy',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Slide 1 Hero Banner: ALL-IN-ONE STUDENT ECOSYSTEM */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-900/60 bg-gradient-to-b from-[#0e172a] via-[#0B1120] to-[#070c18] p-6 sm:p-10 text-center shadow-2xl">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ALL-IN-ONE STUDENT ECOSYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Campus<span className="text-cyan-400">Hub</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-cyan-200">
            Buy • Sell • Study • Practice
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Everything a student needs, in one place. Built exclusively for university and campus life to bridge peer commerce and smart AI-guided academics.
          </p>

          {/* 4 quick module navigation chips matching Slide 1 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
            <button
              onClick={() => onNavigate('marketplace')}
              className="rounded-full border border-cyan-500/50 bg-cyan-950/50 hover:bg-cyan-900/50 px-4 py-2 text-xs font-semibold text-cyan-300 transition-all hover:scale-105"
            >
              Buying & Selling
            </button>
            <button
              onClick={() => onNavigate('study-hub')}
              className="rounded-full border border-emerald-500/50 bg-emerald-950/50 hover:bg-emerald-900/50 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all hover:scale-105"
            >
              Books & Study Material
            </button>
            <button
              onClick={() => onNavigate('pyq-bank')}
              className="rounded-full border border-amber-500/50 bg-amber-950/50 hover:bg-amber-900/50 px-4 py-2 text-xs font-semibold text-amber-300 transition-all hover:scale-105"
            >
              PYQs & Practice
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="rounded-full border border-purple-500/50 bg-purple-950/50 hover:bg-purple-900/50 px-4 py-2 text-xs font-semibold text-purple-300 transition-all hover:scale-105"
            >
              AI-Powered Learning
            </button>
          </div>
        </div>
      </section>

      {/* What is CampusHub? 4 Modules */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">WELCOME TO CAMPUSHUB</span>
          <h2 className="text-2xl font-bold text-white mt-1">What is CampusHub?</h2>
          <p className="text-sm text-slate-400">One Platform for Every Student Need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-all hover:border-slate-600 ${m.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/80">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{m.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{m.tagline}</p>
                </div>
                <button
                  onClick={() => onNavigate(m.id)}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
                >
                  <span>{m.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-3 text-center text-sm font-semibold text-cyan-300">
          Buy ➔ Sell ➔ Study ➔ Practice
        </div>
      </section>

      {/* The CampusHub Vision */}
      <section className="rounded-2xl border border-slate-800 bg-[#0c1322] p-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">THE CAMPUSHUB VISION</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">One Platform. Complete Student Experience.</h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-base font-bold text-cyan-400">Buy</p>
            <p className="text-xs text-slate-400 mt-1">Affordable student items</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-base font-bold text-emerald-400">Sell</p>
            <p className="text-xs text-slate-400 mt-1">Unused hostel items</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-base font-bold text-blue-400">Study</p>
            <p className="text-xs text-slate-400 mt-1">Curated books & notes</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-base font-bold text-amber-400">Practice</p>
            <p className="text-xs text-slate-400 mt-1">PYQs & mock tests</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 col-span-2 sm:col-span-1">
            <p className="text-base font-bold text-purple-400">Learn</p>
            <p className="text-xs text-slate-400 mt-1">AI-powered guidance</p>
          </div>
        </div>

        <blockquote className="italic text-base sm:text-lg text-slate-300 font-medium">
          “From your 10th to graduation with competition — CampusHub stays with you.”
        </blockquote>
      </section>
    </div>
  );
};
