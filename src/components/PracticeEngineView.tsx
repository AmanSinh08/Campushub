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
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';

interface PracticeEngineViewProps {
  initialTopic?: string;
  onUpdateDashboardStats?: (result: QuizResult) => void;
}

const DEFAULT_QUESTIONS: Record<string, QuizQuestion[]> = {
  'Computer Networks': [
    {
      id: 'cn-1',
      question: 'In TCP congestion control, what triggers the transition from Slow Start to Congestion Avoidance phase?',
      options: [
        'Receiving 3 duplicate ACKs',
        'Congestion Window (cwnd) reaching Slow Start Threshold (ssthresh)',
        'A complete timeout of the retransmission timer',
        'Receiving a FIN segment from the receiver',
      ],
      correctAnswer: 1,
      topic: 'TCP Congestion Control',
      explanation: 'When cwnd reaches ssthresh, TCP switches from exponential growth (Slow Start) to linear growth (Congestion Avoidance) to cautiously probe for available bandwidth.',
    },
    {
      id: 'cn-2',
      question: 'Which routing protocol uses Dijkstra’s shortest path algorithm?',
      options: ['RIP (Routing Information Protocol)', 'BGP (Border Gateway Protocol)', 'OSPF (Open Shortest Path First)', 'EGP'],
      correctAnswer: 2,
      topic: 'Routing Protocols',
      explanation: 'OSPF is a link-state routing protocol that runs Dijkstra’s algorithm independently on each router to compute the shortest path tree.',
    },
    {
      id: 'cn-3',
      question: 'What is the purpose of the Subnet Mask in IPv4 addressing?',
      options: [
        'To identify the MAC address of the destination device',
        'To distinguish between the Network ID and Host ID portions of an IP address',
        'To encrypt the payload during transmission',
        'To assign dynamic IP addresses automatically',
      ],
      correctAnswer: 1,
      topic: 'IP Subnetting',
      explanation: 'A subnet mask defines which bits of the 32-bit IP address belong to the network identifier versus the host identifier on that subnet.',
    },
    {
      id: 'cn-4',
      question: 'Which transport layer protocol provides connection-oriented, reliable byte stream delivery?',
      options: ['UDP', 'ICMP', 'TCP', 'ARP'],
      correctAnswer: 2,
      topic: 'Transport Layer',
      explanation: 'TCP guarantees in-order, error-checked, and reliable transmission through sequence numbers, ACKs, and retransmissions.',
    },
    {
      id: 'cn-5',
      question: 'In the OSI model, which layer is responsible for end-to-end encryption and data compression?',
      options: ['Application Layer', 'Presentation Layer', 'Session Layer', 'Transport Layer'],
      correctAnswer: 1,
      topic: 'OSI Model',
      explanation: 'The Presentation Layer (Layer 6) formats, encrypts, and compresses data so that the Application layer can process it properly.',
    },
  ],
  'Database Management Systems': [
    {
      id: 'db-1',
      question: 'A relation is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
      options: [
        'Y is a prime attribute',
        'X is a superkey of the relation',
        'X is part of a candidate key',
        'The relation has no transitive dependencies',
      ],
      correctAnswer: 1,
      topic: 'Database Normalization',
      explanation: 'BCNF is stricter than 3NF. In BCNF, for every functional dependency X -> Y, X must strictly be a Superkey.',
    },
    {
      id: 'db-2',
      question: 'Which ACID property guarantees that all operations in a transaction either complete entirely or are fully rolled back?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 0,
      topic: 'ACID Properties',
      explanation: 'Atomicity ensures all-or-nothing execution of transactions so no partial states persist upon failure.',
    },
    {
      id: 'db-3',
      question: 'What type of index is created on non-ordering fields of a file where key values may repeat?',
      options: ['Primary Index', 'Clustering Index', 'Secondary Index', 'Dense Primary Index'],
      correctAnswer: 2,
      topic: 'Indexing & B+ Trees',
      explanation: 'A secondary index provides alternative access paths to records on non-ordered fields, often utilizing an extra level of indirection.',
    },
  ],
  'Data Structures & Algorithms': [
    {
      id: 'dsa-1',
      question: 'What is the worst-case time complexity of searching in an AVL Tree with N elements?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctAnswer: 1,
      topic: 'AVL Trees',
      explanation: 'Because AVL trees maintain strict height balance (|hL - hR| <= 1), the tree height is bounded strictly by O(log N), making worst-case search O(log N).',
    },
    {
      id: 'dsa-2',
      question: 'Which algorithm is used to find the Single Source Shortest Path in a weighted graph with non-negative edges?',
      options: ['Kruskal’s Algorithm', 'Prim’s Algorithm', 'Dijkstra’s Algorithm', 'Floyd-Warshall Algorithm'],
      correctAnswer: 2,
      topic: 'Graph Algorithms',
      explanation: 'Dijkstra’s algorithm computes shortest paths from a single source vertex to all other vertices in non-negative weighted graphs.',
    },
  ],
};

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  initialTopic,
  onUpdateDashboardStats,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Computer Networks');
  const [difficulty, setDifficulty] = useState<'Standard' | 'Mid-Sem Level' | 'University Exam'>('University Exam');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Quiz state: 'config' | 'taking' | 'result'
  const [quizState, setQuizState] = useState<'config' | 'taking' | 'result'>('config');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStartQuiz = () => {
    const pool = DEFAULT_QUESTIONS[selectedSubject] || DEFAULT_QUESTIONS['Computer Networks'];
    const chosen = pool.slice(0, questionCount);
    setCurrentQuestions(chosen);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimerSeconds(0);
    setTimerActive(true);
    setQuizState('taking');
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    let correct = 0;
    const weakMap: Record<string, number> = {};
    const strongMap: Record<string, number> = {};

    currentQuestions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans === q.correctAnswer) {
        correct += 1;
        strongMap[q.topic] = (strongMap[q.topic] || 0) + 1;
      } else {
        weakMap[q.topic] = (weakMap[q.topic] || 0) + 1;
      }
    });

    const total = currentQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    const weakTopics = Object.keys(weakMap);
    const strongTopics = Object.keys(strongMap);

    const result: QuizResult = {
      score: correct,
      total,
      percentage,
      weakAreas: weakTopics.length > 0 ? weakTopics : ['None! Great work.'],
      primaryWeakArea: weakTopics[0] || 'All areas strong',
      strengths: strongTopics.length > 0 ? strongTopics : ['General concepts'],
      feedback:
        percentage >= 80
          ? 'Excellent mastery! You are well prepared for the semester exam.'
          : percentage >= 50
          ? 'Good foundation, but revise your diagnosed weak topics before the finals.'
          : 'Needs targeted revision. Please review recommended topper notes in Study Hub.',
      remedyAction:
        weakTopics[0]
          ? `Review "${weakTopics[0]}" textbook chapter in Study Hub and retry drill.`
          : 'Attempt next semester subject practice drill.',
    };

    setQuizResult(result);
    setQuizState('result');

    if (onUpdateDashboardStats) {
      onUpdateDashboardStats(result);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-6 pb-16 animate-page-enter">
      {/* 1. Header Banner */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                Adaptive Exam Simulator
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1.5 tracking-tight">
              Semester Practice Engine & Weakness Diagnostic
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Take timed topic drills, simulate university exam patterns, and track exact concepts needing revision.
            </p>
          </div>

          {quizState === 'taking' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] font-mono font-bold text-sm shrink-0 animate-fade-in">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          )}
        </div>
      </section>

      {/* STATE 1: TEST CONFIGURATION */}
      {quizState === 'config' && (
        <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs space-y-6 max-w-3xl mx-auto animate-slide-up stagger-1">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Configure Your Practice Test</h2>
            <p className="text-xs text-[#6B7280]">Select curriculum subject, exam difficulty, and question count</p>
          </div>

          <div className="space-y-4">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Semester Subject
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  'Computer Networks',
                  'Database Management Systems',
                  'Data Structures & Algorithms',
                ].map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setSelectedSubject(subj)}
                    className={`btn-interactive p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedSubject === subj
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] shadow-xs'
                        : 'bg-[#F7F7F5] border-[#E5E7EB] text-[#171717] hover:bg-white'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Standard', 'Mid-Sem Level', 'University Exam'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`btn-interactive p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      difficulty === lvl
                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F7F7F5] border-[#E5E7EB] text-[#6B7280] hover:text-[#171717]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[3, 5, 8, 10].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`btn-interactive p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      questionCount === cnt
                        ? 'bg-[#171717] border-[#171717] text-white'
                        : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#171717]'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">
              Estimated duration: {questionCount * 2} minutes
            </span>
            <button
              onClick={handleStartQuiz}
              className="btn-interactive inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Target className="h-4 w-4" />
              <span>Start Practice Exam</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* STATE 2: ACTIVE TEST TAKING */}
      {quizState === 'taking' && currentQuestions.length > 0 && (
        <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs space-y-6 max-w-3xl mx-auto animate-scale-in">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#2563EB]">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
              <span className="text-[#6B7280]">
                Topic: {currentQuestions[currentIndex]?.topic}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Body with Keyed Transition */}
          <div key={currentIndex} className="space-y-4 pt-2 animate-slide-up">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] leading-relaxed">
              {currentQuestions[currentIndex]?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestions[currentIndex]?.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`btn-interactive w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold shadow-xs ring-1 ring-[#2563EB]'
                        : 'bg-white border-[#E5E7EB] text-[#171717] hover:bg-[#F7F7F5]'
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#F7F7F5] text-[#6B7280] border border-[#E5E7EB]'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              disabled={currentIndex === 0}
              className="btn-interactive px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] disabled:opacity-40 hover:bg-[#F7F7F5]"
            >
              Previous
            </button>

            {currentIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((idx) => idx + 1)}
                className="btn-interactive px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="btn-interactive px-6 py-2 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold shadow-xs"
              >
                Submit Exam
              </button>
            )}
          </div>
        </section>
      )}

      {/* STATE 3: RESULT & WEAKNESS DIAGNOSTIC */}
      {quizState === 'result' && quizResult && (
        <section className="space-y-6 max-w-3xl mx-auto animate-scale-in">
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] mx-auto flex items-center justify-center animate-pop">
              <Award className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Practice Test Score
              </span>
              <h2 className="text-4xl font-extrabold text-[#171717] mt-1">
                {quizResult.percentage}%
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {quizResult.score} of {quizResult.total} questions answered correctly
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#171717] font-medium max-w-md mx-auto leading-relaxed bg-[#F7F7F5] p-3 rounded-xl border border-[#E5E7EB]">
              {quizResult.feedback}
            </p>

            {/* Diagnostic Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              <div className="p-4 rounded-xl bg-[#DCFCE7] border border-green-200">
                <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                </span>
                <p className="text-xs text-[#171717] font-medium mt-1">
                  {quizResult.strengths.join(', ')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FEE2E2] border border-red-200">
                <span className="text-[11px] font-bold text-[#DC2626] flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Diagnosed Weak Area
                </span>
                <p className="text-xs text-[#171717] font-medium mt-1">
                  {quizResult.primaryWeakArea}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setQuizState('config')}
                className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#171717] hover:bg-[#F7F7F5]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Configure Another Test</span>
              </button>

              <button
                onClick={handleStartQuiz}
                className="btn-interactive inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <Target className="h-3.5 w-3.5" />
                <span>Retake This Test</span>
              </button>
            </div>
          </div>

          {/* Question by question explanations */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#171717]">Detailed Question Review & Explanations</h3>
            <div className="space-y-3">
              {currentQuestions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F5]/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">Question {idx + 1}</span>
                      {isCorrect ? (
                        <span className="text-[#16A34A] font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#171717]">{q.question}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] space-y-1">
                      <p className="text-[#16A34A] font-semibold">
                        Correct Answer: {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-[#6B7280] leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
