import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Search,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Copy,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Send,
  X,
  Loader2,
  CheckCircle2,
  Check,
  Target,
} from 'lucide-react';
import { PYQPaper, PYQQuestion, ActiveTab } from '../types';

interface PYQBankViewProps {
  papers: PYQPaper[];
  onStartMockTestFromPYQ: (paper: PYQPaper) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const PYQBankView: React.FC<PYQBankViewProps> = ({
  papers = [],
  onStartMockTestFromPYQ,
  onNavigate,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<number | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(papers[0] || null);
  const [selectedQuestion, setSelectedQuestion] = useState<PYQQuestion | null>(
    papers[0]?.questions[0] || null
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync selected paper questions
  useEffect(() => {
    if (selectedPaper && selectedPaper.questions?.length > 0) {
      setSelectedQuestion(selectedPaper.questions[0]);
      setAiSolution(selectedPaper.questions[0]?.defaultAnswer || null);
    }
  }, [selectedPaper]);

  const courses = Array.from(new Set(papers.map((p) => p.course)));
  const subjects = Array.from(new Set(papers.map((p) => p.subject)));
  const years = Array.from(new Set(papers.map((p) => p.year))).sort((a, b) => b - a);

  const filteredPapers = papers.filter((p) => {
    const matchCourse = selectedCourse === 'All' || p.course === selectedCourse;
    const matchSubject = selectedSubject === 'All' || p.subject === selectedSubject;
    const matchSem = selectedSemester === 'All' || p.semester === selectedSemester;
    const matchYear = selectedYear === 'All' || p.year === selectedYear;
    return matchCourse && matchSubject && matchSem && matchYear;
  });

  const handleSelectQuestion = (q: PYQQuestion) => {
    setSelectedQuestion(q);
    setAiSolution(q.defaultAnswer || null);
  };

  const handleGenerateAISolution = async () => {
    if (!selectedQuestion) return;
    setIsGenerating(true);
    setAiSolution(null);

    try {
      const prompt = `Provide an examination-ready, high-scoring model answer for this university PYQ question:
Subject: ${selectedPaper?.subject} (Semester ${selectedPaper?.semester})
Question: ${selectedQuestion.text}
Marks Allocated: ${selectedQuestion.marks} Marks
Topic: ${selectedQuestion.topic}

Structure the response clearly:
1. Core Definition / Concept Statement
2. Step-by-Step Explanation / Proof / Architecture
3. Relevant Formula / Code / Diagram representation (clean formatted text/math)
4. Key Exam Tip to score full ${selectedQuestion.marks} marks`;

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'exam-solution' }),
      });

      const data = await res.json();
      if (data.answer) {
        setAiSolution(data.answer);
      } else {
        setAiSolution(
          `### Model Solution (${selectedQuestion.marks} Marks)\n\n**1. Concept Overview:**\nThis question evaluates core mastery of **${selectedQuestion.topic}** in **${selectedPaper?.subject}**.\n\n**2. Step-by-Step Derivation & Solution:**\n- State fundamental axioms clearly.\n- Apply the governing equations.\n- Conclude with theoretical significance.\n\n**3. Marking Scheme Tip:** Include neat labelled diagrams and equation boxes for full marks.`
        );
      }
    } catch {
      setAiSolution(
        selectedQuestion.defaultAnswer ||
          `### Exam Model Answer (${selectedQuestion.marks} Marks)\n\n**Key Steps:**\n1. Define ${selectedQuestion.topic} clearly.\n2. Write down standard derivation or algorithm.\n3. State time/space complexity and exam assumptions.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySolution = () => {
    if (!aiSolution) return;
    navigator.clipboard.writeText(aiSolution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. PYQ Bank Banner */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                Official University PYQ Repository
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1.5 tracking-tight">
              Previous Year Question Papers & AI Solutions
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Solve past university papers with instant marking scheme solutions, step-by-step code, and launch mock tests.
            </p>
          </div>

          {selectedPaper && (
            <button
              onClick={() => onStartMockTestFromPYQ(selectedPaper)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] shrink-0"
            >
              <Target className="h-4 w-4" />
              <span>Start Timed Mock Exam</span>
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="w-full text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="w-full text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. Papers Selector Ribbon */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filteredPapers.map((paper) => {
          const isSelected = selectedPaper?.id === paper.id;
          return (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className={`shrink-0 text-left p-3 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-[#2563EB] shadow-sm ring-2 ring-[#2563EB]/10'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
                }`}>
                  {paper.year}
                </span>
                <span className="text-xs font-bold text-[#171717] truncate">{paper.subject}</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">
                Sem {paper.semester} • {paper.questions.length} Questions • {paper.totalMarks} Marks
              </p>
            </button>
          );
        })}
      </section>

      {/* 3. Main Split View: Questions List (Left) & AI Model Solution (Right) */}
      {selectedPaper ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Questions List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Paper Questions ({selectedPaper.questions.length})
              </h2>
              <span className="text-xs text-[#6B7280] font-mono">{selectedPaper.examType}</span>
            </div>

            <div className="space-y-2.5">
              {selectedPaper.questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-left space-y-2 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
                        : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-md border border-[#DBEAFE]">
                        Q{q.qNumber} • {q.marks} Marks
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-medium truncate max-w-[140px]">
                        {q.topic}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#171717] leading-relaxed line-clamp-3">
                      {q.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Marking Scheme Solution Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
              {/* Question Header */}
              {selectedQuestion && (
                <div className="space-y-2 border-b border-[#E5E7EB] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2563EB]">
                      Question {selectedQuestion.qNumber} Detailed Answer
                    </span>
                    <span className="text-xs font-semibold text-[#171717] bg-[#F7F7F5] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                      Allocated: {selectedQuestion.marks} Marks
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#171717] leading-relaxed">
                    {selectedQuestion.text}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Topic: <span className="font-semibold text-[#171717]">{selectedQuestion.topic}</span>
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleGenerateAISolution}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI Model Answer</span>
                    </>
                  )}
                </button>

                {aiSolution && (
                  <button
                    onClick={handleCopySolution}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#E5E7EB] text-xs font-medium text-[#171717] transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Solution'}</span>
                  </button>
                )}
              </div>

              {/* Solution display area */}
              <div className="rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] p-4 sm:p-5 text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-wrap font-sans">
                {aiSolution ? (
                  aiSolution
                ) : (
                  <div className="py-8 text-center text-[#6B7280] space-y-2">
                    <Sparkles className="h-6 w-6 text-[#9CA3AF] mx-auto" />
                    <p>Click "Generate AI Model Answer" to see full step-by-step examination solution.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-12 text-center text-[#6B7280]">
          No papers found matching the selected filters.
        </div>
      )}
    </div>
  );
};
