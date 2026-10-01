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
  FileText,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PYQPaper, PYQQuestion, ActiveTab } from '../types';
import { downloadPyqPaperPdf, generatePyqPdfBlobUrl } from '../utils/bookContent';

interface PYQBankViewProps {
  papers: PYQPaper[];
  onStartMockTestFromPYQ: (paper: PYQPaper) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const PYQBankView: React.FC<PYQBankViewProps> = ({
  papers,
  onStartMockTestFromPYQ,
  onNavigate,
}) => {
  // Available subjects from papers
  const availableSubjects = Array.from(new Set(papers.map((p) => p.subject)));

  const [selectedCourse, setSelectedCourse] = useState<string>('B.Tech CSE/IT');
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    availableSubjects[0] || 'Database Management Systems (DBMS)'
  );
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Filter papers matching selected subject
  const subjectPapers = papers.filter((p) => p.subject === selectedSubject);
  const availableYearsForSubject = subjectPapers.map((p) => p.year).sort((a, b) => b - a);

  // Ensure active paper resolves correctly
  const activePaper =
    papers.find((p) => p.subject === selectedSubject && p.year === selectedYear) ||
    subjectPapers[0] ||
    papers[0];

  const [selectedQuestion, setSelectedQuestion] = useState<PYQQuestion | null>(
    activePaper?.questions[0] || null
  );

  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Open PDF viewer for active paper
  const handleOpenPdfModal = (paper: PYQPaper) => {
    const url = generatePyqPdfBlobUrl(paper);
    if (url) {
      setPdfBlobUrl(url);
      setIsPdfModalOpen(true);
    }
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  // AI Operation States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<
    'explain' | 'diagnose' | 'similar' | null
  >('explain');
  const [explanationOutput, setExplanationOutput] = useState<string | null>(null);
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [studentDraftAnswer, setStudentDraftAnswer] = useState<string>('');
  const [diagnosisOutput, setDiagnosisOutput] = useState<string | null>(null);

  // Sync selected question when active paper changes
  useEffect(() => {
    if (activePaper?.questions?.length) {
      setSelectedQuestion(activePaper.questions[0]);
      setExplanationOutput(null);
      setDiagnosisOutput(null);
      setSimilarQuestions([]);
      setStudentDraftAnswer(activePaper.questions[0]?.defaultAnswer || '');
    }
  }, [activePaper?.id]);

  // When subject changes, synchronize selected semester and year to match first available paper
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const matching = papers.find((p) => p.subject === newSubject);
    if (matching) {
      setSelectedSemester(matching.semester);
      setSelectedYear(matching.year);
    }
  };

  // 1. "Explain Question X"
  const handleExplainQuestion = async (q: PYQQuestion) => {
    setSelectedQuestion(q);
    setAiMode('explain');
    setIsAiLoading(true);
    setExplanationOutput(null);

    try {
      const res = await fetch('/api/ai/explain-pyq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.text,
          marks: q.marks,
          subject: activePaper.subject,
          topic: q.topic,
        }),
      });
      const data = await res.json();
      setExplanationOutput(data.explanation || data.error || 'No explanation generated.');
    } catch (err: any) {
      setExplanationOutput(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 2. "Why is my answer wrong?"
  const handleDiagnoseAnswer = async () => {
    if (!selectedQuestion || !studentDraftAnswer.trim()) return;
    setAiMode('diagnose');
    setIsAiLoading(true);
    setDiagnosisOutput(null);

    try {
      const res = await fetch('/api/ai/diagnose-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: selectedQuestion.text,
          studentAnswer: studentDraftAnswer,
          subject: activePaper.subject,
        }),
      });
      const data = await res.json();
      setDiagnosisOutput(data.diagnosis || data.error || 'No diagnosis received.');
    } catch (err: any) {
      setDiagnosisOutput(`Error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 3. "Give me 5 similar questions"
  const handleGetSimilarQuestions = async (q: PYQQuestion) => {
    setSelectedQuestion(q);
    setAiMode('similar');
    setIsAiLoading(true);
    setSimilarQuestions([]);

    try {
      const res = await fetch('/api/ai/similar-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.text,
          topic: q.topic,
          subject: activePaper.subject,
        }),
      });
      const data = await res.json();
      setSimilarQuestions(data.questions || []);
    } catch (err: any) {
      setSimilarQuestions([`Error generating questions: ${err.message}`]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Slide 9 Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              UNIVERSITY EXAM ARCHIVE & PYQ INTELLIGENCE
            </span>
            <span className="rounded-full bg-amber-950 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-800/60">
              Exam Hall Ready • Real Papers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">PYQ Bank + AI</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Original university previous-year question papers (2022–2025) with printable PDF downloads, in-browser PDF viewer, and instant AI step-by-step solutions.
          </p>
        </div>

        {/* Search Query Selector matching Slide 9 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
            <span>FILTER PAPERS BY: COURSE | SUBJECT | SEMESTER | YEAR</span>
            <span className="text-slate-400 font-normal">{papers?.length || 0} Papers Available in Repository</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
              >
                <option value="B.Tech CSE/IT">B.Tech CSE / IT</option>
                <option value="BCA">BCA (Computer Apps)</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => {
                  const sem = Number(e.target.value);
                  setSelectedSemester(sem);
                  const paperInSem = papers.find((p) => p.semester === sem);
                  if (paperInSem) {
                    setSelectedSubject(paperInSem.subject);
                    setSelectedYear(paperInSem.year);
                  }
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
              >
                <option value={3}>Semester 3</option>
                <option value={4}>Semester 4</option>
                <option value={5}>Semester 5</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Available Years for Subject</label>
              <div className="flex gap-1.5">
                {availableYearsForSubject.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      selectedYear === yr
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paper Information Banner with Direct PDF & Test Actions */}
          {activePaper && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-500/20 text-blue-400 px-2 py-0.5 text-[11px] font-bold">
                    {activePaper.examType} {activePaper.year}
                  </span>
                  <span className="text-white font-bold text-sm">{activePaper.subject}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Course: {activePaper.course}</span>
                  <span>•</span>
                  <span>Sem {activePaper.semester}</span>
                  <span>•</span>
                  <span>{activePaper?.questions?.length || 0} Questions</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">{activePaper.totalMarks} Marks</span>
                </div>
              </div>

              {/* Action Buttons: PDF Preview, Download, Mock Test */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="view-pyq-pdf-modal-btn"
                  onClick={() => handleOpenPdfModal(activePaper)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View PDF</span>
                </button>

                <button
                  id="download-pyq-pdf-btn"
                  onClick={() => downloadPyqPaperPdf(activePaper)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  id="create-mock-test-from-pyq-btn"
                  onClick={() => onStartMockTestFromPYQ(activePaper)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Mock Test from PYQ</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4 AI Superpower Highlights from Slide 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/20 p-3">
            <p className="text-xs font-bold text-cyan-300">“Explain Question X”</p>
            <p className="text-[11px] text-slate-400 mt-1">Detailed step-by-step solution breakdown with marking tips</p>
          </div>
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/20 p-3">
            <p className="text-xs font-bold text-rose-300">“Why is my answer wrong?”</p>
            <p className="text-[11px] text-slate-400 mt-1">Identify mistake logic & conceptual gap in student answers</p>
          </div>
          <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-3">
            <p className="text-xs font-bold text-amber-300">“Give me 5 similar questions”</p>
            <p className="text-[11px] text-slate-400 mt-1">Practice similar question patterns for mastering skill</p>
          </div>
          <div className="rounded-lg border border-purple-500/40 bg-purple-950/20 p-3">
            <p className="text-xs font-bold text-purple-300">“Create a mock test from PYQ”</p>
            <p className="text-[11px] text-slate-400 mt-1">Generate timed simulated exam test with instant AI scoring</p>
          </div>
        </div>
      </div>

      {/* Main PYQ Questions List & AI Assistant Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Questions in this Paper</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {activePaper?.questions?.length || 0} Questions • {activePaper?.totalMarks || 70} Total Marks
              </span>
            </div>

            {/* Quick jump to PDF */}
            <button
              onClick={() => handleOpenPdfModal(activePaper)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Full Paper PDF</span>
            </button>
          </div>

          <div className="space-y-3">
            {activePaper.questions.map((q) => {
              const isSelected = selectedQuestion?.id === q.id;
              return (
                <div
                  key={q.id}
                  id={`pyq-question-card-${q.id}`}
                  className={`rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-amber-500/70 bg-slate-900/95 shadow-md shadow-amber-950/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                        Q{q.qNumber}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {q.topic}
                      </span>
                    </div>
                    <span className="rounded-md bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                      {q.marks} MARKS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-medium">
                    {q.text}
                  </p>

                  {/* 3 Action buttons per question matching Slide 9 */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleExplainQuestion(q)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isSelected && aiMode === 'explain'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Explain Solution</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedQuestion(q);
                        setAiMode('diagnose');
                        setDiagnosisOutput(null);
                        setStudentDraftAnswer(q.defaultAnswer || '');
                      }}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isSelected && aiMode === 'diagnose'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      <span>Why is my answer wrong?</span>
                    </button>

                    <button
                      onClick={() => handleGetSimilarQuestions(q)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isSelected && aiMode === 'similar'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                      <span>5 Similar Questions</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Intelligence Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-28 rounded-2xl border border-slate-800 bg-[#0f172a] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">AI Study Buddy Intelligence</h3>
              </div>
              {selectedQuestion && (
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 font-semibold">
                  Focus: Q{selectedQuestion.qNumber}
                </span>
              )}
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => {
                  setAiMode('explain');
                  if (!explanationOutput && selectedQuestion) {
                    handleExplainQuestion(selectedQuestion);
                  }
                }}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-all ${
                  aiMode === 'explain'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Solution
              </button>
              <button
                onClick={() => {
                  setAiMode('diagnose');
                  if (selectedQuestion && !studentDraftAnswer) {
                    setStudentDraftAnswer(selectedQuestion.defaultAnswer || '');
                  }
                }}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-all ${
                  aiMode === 'diagnose'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Diagnose
              </button>
              <button
                onClick={() => {
                  setAiMode('similar');
                  if (similarQuestions.length === 0 && selectedQuestion) {
                    handleGetSimilarQuestions(selectedQuestion);
                  }
                }}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-all ${
                  aiMode === 'similar'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 Similar
              </button>
            </div>

            {/* MODE 1: EXPLAIN QUESTION */}
            {aiMode === 'explain' && (
              <div className="space-y-3">
                <div className="rounded-lg bg-cyan-950/30 border border-cyan-800/40 p-3 text-xs text-cyan-300">
                  <p className="font-semibold">Examiner Model Solution:</p>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                    {selectedQuestion?.text}
                  </p>
                </div>

                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                    <p className="text-xs">Generating university step-by-step solution...</p>
                  </div>
                ) : explanationOutput ? (
                  <div className="max-h-[420px] overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed space-y-3">
                    <div className="prose prose-invert prose-xs max-w-none">
                      <ReactMarkdown>{explanationOutput}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Click "Explain Solution" on any question to view the full model derivation.
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: DIAGNOSE ANSWER ("Why is my answer wrong?") */}
            {aiMode === 'diagnose' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Submit what you wrote or plan to write. AI detects conceptual gaps, missing invariants, and marks deduction risks!
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Your Proposed Answer / Logic:
                  </label>
                  <textarea
                    rows={4}
                    value={studentDraftAnswer}
                    onChange={(e) => setStudentDraftAnswer(e.target.value)}
                    placeholder="Type your answer here... (e.g., A relation is in 3NF if no transitive dependencies exist...)"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleDiagnoseAnswer}
                  disabled={isAiLoading || !studentDraftAnswer.trim()}
                  className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-2 text-xs font-semibold text-white shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Diagnosing Mistake Logic...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Diagnose My Answer</span>
                    </>
                  )}
                </button>

                {diagnosisOutput && (
                  <div className="mt-3 max-h-[300px] overflow-y-auto rounded-xl border border-rose-900/60 bg-rose-950/20 p-3.5 text-xs text-slate-200 space-y-2">
                    <div className="prose prose-invert prose-xs max-w-none">
                      <ReactMarkdown>{diagnosisOutput}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: 5 SIMILAR QUESTIONS */}
            {aiMode === 'similar' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  5 exam questions sharing the exact same test pattern to build complete exam mastery:
                </p>

                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                    <p className="text-xs">Formulating university pattern questions...</p>
                  </div>
                ) : similarQuestions.length > 0 ? (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto">
                    {similarQuestions.map((sq, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 leading-relaxed hover:border-amber-500/40 transition-colors"
                      >
                        {sq}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Click "5 Similar Questions" to generate parallel exam questions.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF QUESTION PAPER MODAL */}
      {isPdfModalOpen && activePaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activePaper.subject}</span>
                    <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5">
                      {activePaper.year} End-Sem
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official Technical University Examination Paper • {activePaper.totalMarks} Marks • 3 Hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadPyqPaperPdf(activePaper)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleClosePdfModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF iframe */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              {pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  title={`${activePaper.subject} ${activePaper.year} PYQ Paper`}
                  className="h-full w-full rounded-lg border border-slate-800 bg-white"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mr-2" />
                  <span>Rendering university question paper...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

