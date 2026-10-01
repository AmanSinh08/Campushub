import React, { useState } from 'react';
import {
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Loader2,
  HelpCircle,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { QuizQuestion, QuizResult } from '../types';

interface PracticeEngineViewProps {
  initialTopic?: string;
  onUpdateDashboardStats: (newTestScore: number, primaryWeakArea?: string) => void;
}

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  initialTopic,
  onUpdateDashboardStats,
}) => {
  // Step 1: Config state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [subject, setSubject] = useState('Computer Networks');
  const [chapter, setChapter] = useState(initialTopic || 'Computer Networks — TCP/IP');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Step 2: Attempt state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Step 3: AI Check result
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Step 4: Doubt explanation state
  const [doubtText, setDoubtText] = useState('');
  const [doubtExplanation, setDoubtExplanation] = useState<string | null>(null);
  const [isExplainingDoubt, setIsExplainingDoubt] = useState(false);

  // Step 5: Fresh targeted drill
  const [drillQuestions, setDrillQuestions] = useState<QuizQuestion[]>([]);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, number>>({});
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const [drillScore, setDrillScore] = useState<number | null>(null);

  // Sync initialTopic when changed
  React.useEffect(() => {
    if (initialTopic) {
      setChapter(initialTopic);
      const lower = initialTopic.toLowerCase();
      if (lower.includes('dbms') || lower.includes('database') || lower.includes('sql') || lower.includes('normaliz')) {
        setSubject('Database Management Systems');
      } else if (lower.includes('dsa') || lower.includes('tree') || lower.includes('graph') || lower.includes('list') || lower.includes('algorithm')) {
        setSubject('Data Structures & Algorithms');
      } else if (lower.includes('os') || lower.includes('operating') || lower.includes('deadlock') || lower.includes('paging')) {
        setSubject('Operating Systems');
      } else if (lower.includes('network') || lower.includes('tcp') || lower.includes('ip') || lower.includes('osi')) {
        setSubject('Computer Networks');
      }
    }
  }, [initialTopic]);

  // Timer effect during attempt
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Step 1 -> Step 2: Generate Quiz
  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: chapter,
          difficulty,
          questionCount,
        }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // Robust offline fallback so AI practice NEVER fails or freezes
      const mockPool: QuizQuestion[] = [
        {
          id: 'fb-1',
          question: `In ${chapter || subject}, what is the primary structural mechanism used to ensure correctness and prevent inconsistent states?`,
          options: [
            'Maintaining invariant constraints across all state transitions',
            'Allowing unrestricted asynchronous concurrent writes without locks',
            'Periodically terminating the process and clearing temporary cache',
            'Relying solely on external hardware interrupt routines',
          ],
          correctAnswer: 0,
          topic: `${chapter || subject} Core Invariants`,
          explanation: 'Maintaining invariant constraints is the foundational requirement in computer systems to ensure correctness and eliminate anomaly conditions.',
        },
        {
          id: 'fb-2',
          question: `Which of the following describes the worst-case asymptotic upper bound for searching/traversing in this domain?`,
          options: [
            'O(1) constant time regardless of state depth',
            'O(log n) logarithmic reduction per comparison step',
            'O(n) linear scan across unbalanced structures',
            'O(n!) factorial exponential growth',
          ],
          correctAnswer: 2,
          topic: 'Time & Space Bounds',
          explanation: 'When structures become skewed or unbalanced without self-balancing rotations or indexing, operations degrade to O(n) linear search.',
        },
        {
          id: 'fb-3',
          question: `In university exam evaluations, what is considered the most critical diagram or proof step for ${chapter || subject}?`,
          options: [
            'Drawing the complete state transition or execution timeline with labeled axes',
            'Writing only random English bullet points without formulas',
            'Omitting boundary edge-case verifications to save time',
            'Assuming infinite buffer capacity without overflow checking',
          ],
          correctAnswer: 0,
          topic: 'Exam Methodology',
          explanation: 'Examiners award top marks for explicit state transition diagrams, formal invariant equations, and clear edge-case proofs.',
        },
        {
          id: 'fb-4',
          question: `When handling concurrent conflicting requests in ${subject}, what protocol prevents deadlock or race conditions?`,
          options: [
            'Enforcing a strict total ordering on resource acquisition',
            'Allowing all threads to spin continuously without release conditions',
            'Disabling compiler warnings and type assertions',
            'Reverting all transactions automatically after 1 millisecond',
          ],
          correctAnswer: 0,
          topic: 'Concurrency Control & Deadlock',
          explanation: 'Establishing a strict total ordering of resources prevents circular wait—the mandatory condition for deadlock elimination.',
        },
        {
          id: 'fb-5',
          question: `What anomaly is eliminated by transitioning to a normalized or optimized structure in ${subject}?`,
          options: [
            'Insertion, Deletion, and Update anomalies causing redundant storage',
            'CPU heat dissipation issues during integer addition',
            'Network cable physical resistance',
            'Display resolution scaling defects',
          ],
          correctAnswer: 0,
          topic: 'System Optimization & Normalization',
          explanation: 'Proper normalization and modular architecture directly eliminate data anomalies and redundant duplicate entries.',
        },
      ];
      setQuestions(mockPool.slice(0, questionCount));
    } finally {
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setTimeElapsed(0);
      setTimerActive(true);
      setCurrentStep(2);
      setIsGeneratingQuiz(false);
    }
  };

  // Select answer in Step 2
  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  // Step 2 -> Step 3: Submit Answers & AI Check
  const handleSubmitQuiz = async () => {
    setTimerActive(false);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/evaluate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          userAnswers,
          topic: chapter,
          subject,
        }),
      });

      const data = await res.json();
      setQuizResult(data);
      setCurrentStep(3);

      // Pre-fill Step 4 doubt query
      const detectedWeakArea = data.primaryWeakArea || 'TCP Congestion Control';
      setDoubtText(`Explain ${detectedWeakArea} in detail and why students confuse it in exams.`);

      // Update student profile stats
      onUpdateDashboardStats(data.percentage, detectedWeakArea);
    } catch (err: any) {
      alert(`Evaluation error: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Step 3 -> Step 4: Ask Doubt to AI
  const handleAskDoubt = async () => {
    if (!doubtText.trim()) return;
    setIsExplainingDoubt(true);
    setDoubtExplanation(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: doubtText,
          mode: 'doubts',
          topic: chapter,
        }),
      });

      const data = await res.json();
      setDoubtExplanation(data.response || 'No explanation received.');
      setCurrentStep(4);
    } catch (err: any) {
      setDoubtExplanation(`Error: ${err.message}`);
    } finally {
      setIsExplainingDoubt(false);
    }
  };

  // Step 4 -> Step 5: Launch Fresh Targeted Practice Test on Weak Area
  const handleLaunchTargetedDrill = async () => {
    setIsGeneratingDrill(true);
    try {
      const weakConcept = quizResult?.primaryWeakArea || 'TCP Congestion Control';
      const res = await fetch('/api/ai/targeted-drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakTopic: weakConcept,
          subject,
        }),
      });

      const data = await res.json();
      setDrillQuestions(data.drillQuestions || []);
      setDrillAnswers({});
      setDrillScore(null);
      setCurrentStep(5);
    } catch (err: any) {
      alert(`Drill generation error: ${err.message}`);
    } finally {
      setIsGeneratingDrill(false);
    }
  };

  // Evaluate targeted drill in Step 5
  const handleSubmitDrill = () => {
    let score = 0;
    drillQuestions.forEach((q) => {
      if (drillAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    setDrillScore(score);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Practice Engine Header & 5-Step Loop Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              ADAPTIVE PRACTICE ENGINE
            </span>
            <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/60">
              Adaptive Closed-Loop Learning
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">AI-Powered Practice</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Practice directly from study material with continuous AI weakness diagnostics and targeted remedial loops.
          </p>
        </div>

        {/* Step Progression Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>ADAPTIVE CASE STUDY: COMPUTER NETWORKS — TCP/IP</span>
            <span>STEP {currentStep} OF 5</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { step: 1, title: 'Step 1: Config', desc: 'Chapter, Difficulty, Qs' },
              { step: 2, title: 'Step 2: Attempt', desc: 'Student submits answers' },
              { step: 3, title: 'Step 3: AI Check', desc: 'Identifies weak area' },
              { step: 4, title: 'Step 4: Doubt', desc: 'AI explains concept' },
              { step: 5, title: 'Step 5: Practice', desc: 'Fresh targeted test' },
            ].map((s) => {
              const isCurrent = currentStep === s.step;
              const isPast = currentStep > s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    if (isPast) setCurrentStep(s.step as any);
                  }}
                  className={`rounded-lg border p-3 transition-all ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-md shadow-cyan-950 text-white'
                      : isPast
                      ? 'border-emerald-800 bg-slate-900/80 text-slate-300 cursor-pointer'
                      : 'border-slate-800 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{s.title}</span>
                    {isPast && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] mt-1 line-clamp-1">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-2.5 text-center text-xs font-semibold text-emerald-300">
          Personalized learning loop instead of one-size-fits-all practice!
        </div>
      </div>

      {/* STEP 1: CONFIGURATION */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">STEP 1: CONFIG</span>
            <h2 className="text-xl font-bold text-white mt-1">Configure Adaptive Practice Test</h2>
            <p className="text-xs text-slate-400">Select chapter, target difficulty, and test length</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Computer Networks">Computer Networks (CN)</option>
                <option value="Database Management Systems">Database Management Systems (DBMS)</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA)</option>
                <option value="Operating Systems">Operating Systems (OS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chapter / Specific Topic (Case Study)
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Computer Networks — TCP/IP"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Quick presets:</span>
                {[
                  'Computer Networks — TCP/IP',
                  'DBMS — Normalization (1NF to BCNF)',
                  'OS — Process Synchronization & Deadlocks',
                  'DSA — AVL & Binary Search Trees',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setChapter(preset)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        difficulty === lvl
                          ? 'bg-cyan-600 text-white'
                          : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Number of Questions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        questionCount === num
                          ? 'bg-cyan-600 text-white'
                          : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                id="generate-adaptive-quiz-btn"
                onClick={handleStartQuiz}
                disabled={isGeneratingQuiz || !chapter.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50"
              >
                {isGeneratingQuiz ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Formulating Adaptive Test with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    <span>Start Practice Test (Step 2 ➔)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ATTEMPT QUIZ */}
      {currentStep === 2 && questions.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          {/* Header & timer */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">STEP 2: ATTEMPT</span>
              <h2 className="text-lg font-bold text-white mt-0.5">{chapter}</h2>
              <p className="text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length} • {difficulty} Difficulty
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs text-amber-400 font-mono font-bold">
              <Clock className="h-4 w-4" />
              <span>{formatTimer(timeElapsed)}</span>
            </div>
          </div>

          {/* Question card */}
          {questions[currentQuestionIndex] && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                    Topic: {questions[currentQuestionIndex].topic}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                  {questions[currentQuestionIndex].question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {questions[currentQuestionIndex].options.map((option, optIdx) => {
                  const isSelected =
                    userAnswers[questions[currentQuestionIndex].id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        handleSelectAnswer(questions[currentQuestionIndex].id, optIdx)
                      }
                      className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-md'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Question navigation footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-6 w-6 rounded-md text-[10px] font-bold ${
                        userAnswers[q.id] !== undefined
                          ? 'bg-cyan-600 text-white'
                          : idx === currentQuestionIndex
                          ? 'border border-cyan-400 text-cyan-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(questions.length - 1, prev + 1)
                      )
                    }
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-white"
                  >
                    Next ➔
                  </button>
                ) : (
                  <button
                    id="submit-quiz-answers-btn"
                    onClick={handleSubmitQuiz}
                    disabled={isEvaluating}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Submit Test (Step 3 ➔)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: AI CHECK & WEAK AREA ANALYSIS (Slide 8 Step 3) */}
      {currentStep === 3 && quizResult && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">STEP 3: AI CHECK</span>
            <h2 className="text-xl font-bold text-white mt-1">Diagnostic Assessment & Weak Area</h2>
            <p className="text-xs text-slate-400">AI pinpointed specific conceptual bottlenecks</p>
          </div>

          {/* Score banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <span className="text-xs text-slate-400">Score</span>
              <p className="text-3xl font-extrabold text-white mt-1">
                {quizResult.score} / {quizResult.total}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <span className="text-xs text-slate-400">Accuracy</span>
              <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                {quizResult.percentage}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <span className="text-xs text-slate-400">Time Taken</span>
              <p className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
                {formatTimer(timeElapsed)}
              </p>
            </div>
          </div>

          {/* Identified Weak Area Card */}
          <div className="rounded-xl border border-rose-500/60 bg-rose-950/30 p-5 space-y-3 shadow-lg shadow-rose-950/20">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>IDENTIFIED WEAK AREA (AI Conceptual Diagnostic)</span>
            </div>

            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-rose-400">■</span>
              <span>{quizResult.primaryWeakArea || 'TCP Congestion Control'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {quizResult.feedback}
            </p>
          </div>

          {/* Remedial Step 4 Trigger */}
          <div className="rounded-xl border border-cyan-800/80 bg-cyan-950/25 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-cyan-300">Ready for Step 4 (AI Remediation Doubt)?</p>
              <p className="text-[11px] text-slate-400">
                Let AI explain <span className="text-white font-semibold">"{quizResult.primaryWeakArea}"</span> to clear your confusion.
              </p>
            </div>

            <button
              id="proceed-to-step-4-btn"
              onClick={handleAskDoubt}
              disabled={isExplainingDoubt}
              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              {isExplainingDoubt ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Explaining Concept...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ask AI Doubt (Step 4 ➔)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DOUBT RESOLUTION (Slide 8 Step 4) */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">STEP 4: DOUBT & REMEDIATION</span>
            <h2 className="text-xl font-bold text-white mt-1">Student Doubt Resolution</h2>
            <p className="text-xs text-slate-400">AI provides deep conceptual breakdown for full clarity</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Asks:</span>
            <p className="text-sm font-semibold text-cyan-300">
              “{doubtText}”
            </p>
          </div>

          {/* AI Explanation response */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="h-4 w-4" />
              <span>CampusHub AI Conceptual Explanation:</span>
            </div>

            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-slate-200 leading-relaxed">
              <ReactMarkdown>{doubtExplanation || ''}</ReactMarkdown>
            </div>
          </div>

          {/* Proceed to Step 5 CTA */}
          <div className="pt-2 flex justify-end">
            <button
              id="proceed-to-step-5-btn"
              onClick={handleLaunchTargetedDrill}
              disabled={isGeneratingDrill}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all"
            >
              {isGeneratingDrill ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Targeted Drill...</span>
                </>
              ) : (
                <>
                  <span>Launch Fresh Targeted Practice Test (Step 5 ➔)</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FRESH TARGETED PRACTICE DRILL (Slide 8 Step 5) */}
      {currentStep === 5 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">STEP 5: TARGETED PRACTICE</span>
            <h2 className="text-xl font-bold text-white mt-1">Fresh Targeted Mastery Drill</h2>
            <p className="text-xs text-slate-400">
              3 targeted questions generated solely to cement <span className="text-cyan-300 font-semibold">{quizResult?.primaryWeakArea}</span>
            </p>
          </div>

          <div className="space-y-4">
            {drillQuestions.map((dq, idx) => (
              <div
                key={dq.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Drill Q{idx + 1}</span>
                  <span className="text-[10px] text-slate-400">{dq.topic}</span>
                </div>
                <p className="text-xs sm:text-sm text-white font-medium">{dq.question}</p>

                <div className="space-y-2">
                  {dq.options.map((opt, optIdx) => {
                    const isSelected = drillAnswers[dq.id] === optIdx;
                    const isSubmitted = drillScore !== null;
                    const isCorrect = optIdx === dq.correctAnswer;
                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() =>
                          setDrillAnswers((prev) => ({ ...prev, [dq.id]: optIdx }))
                        }
                        className={`w-full text-left rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-between ${
                          isSubmitted && isCorrect
                            ? 'border border-emerald-500 bg-emerald-950/60 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'border border-rose-500 bg-rose-950/60 text-white'
                            : isSelected
                            ? 'border border-cyan-400 bg-cyan-950/60 text-white'
                            : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {drillScore !== null && (
                  <div className="rounded-lg bg-slate-950 p-2.5 text-[11px] text-slate-300 border border-slate-800">
                    <span className="font-semibold text-cyan-400">Why: </span>
                    {dq.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {drillScore === null ? (
            <button
              onClick={handleSubmitDrill}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-md"
            >
              Verify Targeted Mastery Drill
            </button>
          ) : (
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/40 p-5 text-center space-y-3">
              <Award className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">
                Drill Completed: {drillScore} / {drillQuestions.length} Correct!
              </h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                Congratulations! You successfully completed the 5-step adaptive learning loop for {chapter}. Your weakness in {quizResult?.primaryWeakArea} is resolved!
              </p>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setQuizResult(null);
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start Another Practice Loop</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
