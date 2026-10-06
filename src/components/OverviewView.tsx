import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileQuestion,
  ShoppingBag,
  BarChart3,
  ArrowRight,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

interface PlanTask {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_TASKS: PlanTask[] = [
  { id: 't1', text: 'Complete Unit 4 Notes', completed: true },
  { id: 't2', text: 'Solve 10 PYQs', completed: false },
  { id: 't3', text: 'Revise Important Formulas', completed: false },
];

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  // Interactive Today's Plan checklist with localStorage persistence
  const [tasks, setTasks] = useState<PlanTask[]>(() => {
    try {
      const saved = localStorage.getItem('campushub_todays_plan');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_TASKS;
  });

  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('campushub_todays_plan', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: PlanTask = {
      id: `task-${Date.now()}`,
      text: newTaskInput.trim(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskInput('');
  };

  const handleRemoveTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetDefaults = () => {
    setTasks(DEFAULT_TASKS);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-page-enter">
      {/* 1. TODAY'S OVERVIEW CARD (No greeting or student name) */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                Here's what's happening today.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Your daily study snapshot — pending topics, practice targets, and streak progress.
              </p>
            </div>

            <button
              onClick={() => onNavigate('study-hub')}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs shrink-0"
            >
              <span>Continue Studying</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 3 Small Stats: 2 Subjects, 12 Questions, 5 Day Streak */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Stat 1 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB]">
              <div className="h-10 w-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280]">In Progress</p>
                <p className="text-base font-bold text-[#171717]">📚 2 Subjects</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB]">
              <div className="h-10 w-10 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <FileQuestion className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280]">Daily Target</p>
                <p className="text-base font-bold text-[#171717]">📝 12 Questions</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB]">
              <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280]">Study Momentum</p>
                <p className="text-base font-bold text-[#171717]">🔥 5 Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS (Find Notes, Practice PYQs, Marketplace, My Progress) */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
          Quick Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Quick Action 1: Find Notes */}
          <button
            onClick={() => onNavigate('study-hub')}
            className="card-interactive p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-left flex flex-col justify-between group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                📚 Find Notes
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Verified handwritten notes & PDFs
              </p>
            </div>
          </button>

          {/* Quick Action 2: Practice PYQs */}
          <button
            onClick={() => onNavigate('pyq-bank')}
            className="card-interactive p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-left flex flex-col justify-between group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileQuestion className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                📝 Practice PYQs
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                University papers with AI step-by-step solutions
              </p>
            </div>
          </button>

          {/* Quick Action 3: Marketplace */}
          <button
            onClick={() => onNavigate('marketplace')}
            className="card-interactive p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-left flex flex-col justify-between group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                🛍️ Marketplace
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Buy & sell books, tech & essentials
              </p>
            </div>
          </button>

          {/* Quick Action 4: My Progress */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="card-interactive p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-left flex flex-col justify-between group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                📊 My Progress
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Test scores, weak areas & study metrics
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 3. CONTINUE STUDYING & TODAY'S PLAN (2-Column Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Card: CONTINUE STUDYING */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#DBEAFE]">
                <span>🔥 Continue Studying</span>
              </span>
              <span className="text-xs font-bold text-[#2563EB]">80% Complete</span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#171717]">
                Engineering Mathematics
              </h4>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Unit 4 — Differential Equations
              </p>
            </div>

            {/* 80% Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-700 ease-out"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB]">
            <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>Last studied 25 min ago</span>
            </span>

            <button
              onClick={() => onNavigate('study-hub')}
              className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>

        {/* Card: TODAY'S PLAN with EDIT, ADD & REMOVE OPTIONS */}
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#171717]">
                  Today's Plan
                </h4>
                <span className="text-xs font-semibold text-[#6B7280] bg-[#F7F7F5] border border-[#E5E7EB] px-2.5 py-0.5 rounded-lg">
                  {tasks.length > 0 ? `${completedCount} of ${tasks.length} completed` : '0 completed'}
                </span>
              </div>

              {/* Edit Option Toggle */}
              <button
                onClick={() => setIsEditingPlan(!isEditingPlan)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isEditingPlan
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : 'bg-[#F7F7F5] text-[#2563EB] border-[#E5E7EB] hover:bg-blue-50'
                }`}
                title={isEditingPlan ? 'Done editing' : 'Add or remove items'}
              >
                {isEditingPlan ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {/* Add New Activity Form (Active when Editing or quick add) */}
            {isEditingPlan && (
              <form onSubmit={handleAddTask} className="flex gap-2 pt-1 animate-slide-down">
                <input
                  type="text"
                  placeholder="Add a new goal or revision item..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newTaskInput.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </form>
            )}

            {/* Checklist items */}
            <div className="space-y-2 pt-1">
              {tasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F7F7F5] border border-dashed border-[#E5E7EB] text-center space-y-2">
                  <p className="text-xs text-[#6B7280]">No activities in your plan right now.</p>
                  <button
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1 text-xs text-[#2563EB] font-semibold hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Restore default goals</span>
                  </button>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`group w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-[#F0FDF4] border-green-200 text-[#16A34A]'
                        : 'bg-[#F7F7F5] border-[#E5E7EB] text-[#171717] hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 fill-green-100" />
                      ) : (
                        <Circle className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium truncate ${
                          task.completed ? 'line-through text-[#6B7280]' : 'text-[#171717]'
                        }`}
                      >
                        {task.completed ? `✓ ${task.text}` : `○ ${task.text}`}
                      </span>
                    </div>

                    {/* Delete button (Always visible in edit mode, or on hover) */}
                    {(isEditingPlan || true) && (
                      <button
                        onClick={(e) => handleRemoveTask(task.id, e)}
                        className={`p-1 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-red-50 transition-colors shrink-0 ${
                          isEditingPlan ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        title="Remove activity"
                        aria-label="Remove activity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
            <span>{isEditingPlan ? 'Tip: Tap any item to mark completed' : 'Daily revision targets'}</span>
            <span className="font-semibold text-[#2563EB]">
              {tasks.length > 0 && completedCount === tasks.length ? '🎉 All targets completed!' : 'Stay consistent'}
            </span>
          </div>
        </div>
      </section>

      {/* 4. MOTIVATION CARD */}
      <section className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border border-amber-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#171717]">
                🔥 You're on a 5-day streak!
              </h4>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Keep going — consistency beats cramming.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-interactive inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#E5E7EB] text-[#171717] text-xs font-semibold shadow-xs shrink-0"
          >
            <span>View Progress →</span>
          </button>
        </div>
      </section>

      {/* 5. ADDITIONAL CAMPUS ECOSYSTEM WORKSPACES (With updated headings & wording) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Explore Campus Hub
            </h3>
            <p className="text-xs text-[#6B7280]">Essential student tools built for college life</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Marketplace (Updated from "Hostel Marketplace" and "Buy & Sell") */}
          <div
            onClick={() => onNavigate('marketplace')}
            className="card-interactive cursor-pointer p-4 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                  Marketplace
                </p>
                <p className="text-[11px] text-[#6B7280]">Buy & Sell</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Card 2: Study Library */}
          <div
            onClick={() => onNavigate('study-hub')}
            className="card-interactive cursor-pointer p-4 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                  Study Library
                </p>
                <p className="text-[11px] text-[#6B7280]">Topper notes & textbook chapters</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Card 3: AI Practice Tests */}
          <div
            onClick={() => onNavigate('practice-engine')}
            className="card-interactive cursor-pointer p-4 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors">
                  Exam Simulator
                </p>
                <p className="text-[11px] text-[#6B7280]">Timed mocks & instant solutions</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>
    </div>
  );
};
