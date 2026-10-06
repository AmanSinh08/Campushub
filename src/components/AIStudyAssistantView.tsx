import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  BrainCircuit,
  FileCheck,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Target,
  Layers,
  ArrowRight,
  Loader2,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface AIStudyAssistantViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onLaunchPracticeWithTopic: (topic: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  topic?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Explain TCP 3-Way Handshake step-by-step with sequence numbers',
  'What is the difference between BCNF and 3NF with a concrete example?',
  'Write AVL tree double rotation algorithm in C++ with diagrams',
  'Explain Banker’s Algorithm for deadlock avoidance with 4 marks format',
  'Summarize Software Engineering SDLC models comparison table',
];

const STUDY_MODES = [
  { id: 'explain', label: 'Concept Deep Dive', icon: BookOpen, desc: 'Detailed theoretical clarity with real examples' },
  { id: 'exam', label: 'Exam Marking Answer', icon: FileCheck, desc: 'Concise, high-scoring structured response' },
  { id: 'solver', label: 'Numerical & Code Solver', icon: Zap, desc: 'Step-by-step math derivation or code implementation' },
  { id: 'summary', label: '5-Min Quick Revision', icon: BrainCircuit, desc: 'Bullet points, formulas & key cheat sheet' },
];

export const AIStudyAssistantView: React.FC<AIStudyAssistantViewProps> = ({
  onNavigate,
  onLaunchPracticeWithTopic,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('explain');
  const [inputText, setInputText] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Computer Networks');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello! I am your **CampusHub AI Study Assistant**. 🎓\n\nI can help you understand tough concepts, generate examination model answers, solve numerical problems, and prepare revision notes for your semester subjects.\n\n*Select a mode above or click one of the quick prompts below to get started.*`,
      timestamp: 'Just now',
    },
  ]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const modeInstruction =
        selectedMode === 'exam'
          ? 'Provide response formatted as a high-scoring university examination answer with bullet points and bold headers.'
          : selectedMode === 'solver'
          ? 'Provide a step-by-step mathematical derivation or clean code implementation with time/space complexity.'
          : selectedMode === 'summary'
          ? 'Provide a concise 5-minute revision summary with key formulas, memory aids, and common exam pitfalls.'
          : 'Provide an intuitive, comprehensive explanation suitable for engineering students with real-world analogies.';

      const prompt = `Subject: ${selectedSubject}
Mode: ${selectedMode} (${modeInstruction})
Question: ${textToSend.trim()}`;

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: selectedMode }),
      });

      const data = await res.json();
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Here is the step-by-step explanation for your concept. Please review the key formulas and standard exam points.',
        topic: selectedSubject,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const fallbackMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### ${selectedSubject} — Study Guide\n\n**Key Steps for ${textToSend.trim()}:**\n1. Define foundational terms and assumptions.\n2. Apply the core algorithmic or mathematical principle.\n3. Verify edge conditions and state standard time complexity.\n\n*Tip: Would you like to practice a 5-question test on this topic?*`,
        topic: selectedSubject,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-page-enter">
      {/* 1. Header Card with entrance */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                Gemini-Powered Academic Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1.5 tracking-tight">
              AI Campus Study Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Ask complex syllabus questions, get examination-formatted answers, and launch targeted practice tests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              <option value="Computer Networks">Computer Networks</option>
              <option value="Database Management Systems">DBMS</option>
              <option value="Data Structures & Algorithms">DSA</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Theory of Computation">Theory of Computation</option>
            </select>
          </div>
        </div>

        {/* Study Mode Selector */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STUDY_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`btn-interactive p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
                    : 'bg-[#F7F7F5] border-[#E5E7EB] hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 transition-transform ${isSelected ? 'text-[#2563EB] scale-105' : 'text-[#6B7280]'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#171717]'}`}>
                    {mode.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] mt-1 line-clamp-1">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Main Chat Workspace */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col h-[580px] animate-slide-up stagger-1">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#2563EB] text-white rounded-br-xs shadow-xs'
                    : 'bg-[#F7F7F5] text-[#171717] border border-[#E5E7EB] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[#9CA3AF]">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <>
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-[#171717] flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-[#16A34A] font-bold flex items-center gap-0.5 animate-checkmark-pop">
                          <Check className="h-3 w-3" /> Copied
                        </span>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>

                    <button
                      onClick={() => onLaunchPracticeWithTopic(selectedSubject)}
                      className="text-[#2563EB] font-semibold hover:underline flex items-center gap-0.5 ml-2"
                    >
                      <Target className="h-3 w-3" />
                      <span>Practice Quiz</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* AI Thinking Animation with 3 Pulsing/Bouncing Dots */}
          {isLoading && (
            <div className="flex items-center gap-2.5 p-3.5 px-4 rounded-2xl bg-[#F7F7F5] border border-[#E5E7EB] text-xs text-[#6B7280] w-fit animate-slide-up">
              <span className="font-semibold text-[#171717]">AI is formulating answer</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] ai-dot-1"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] ai-dot-2"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] ai-dot-3"></span>
              </span>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-[#F7F7F5]/60 border-t border-[#E5E7EB] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-[#6B7280] shrink-0">Quick Ask:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="btn-interactive shrink-0 text-[11px] bg-white hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#2563EB]/40 border border-[#E5E7EB] px-3 py-1 rounded-xl text-[#171717] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E5E7EB]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your syllabus (e.g. explain TCP congestion control, BCNF proofs, Dijkstra's algorithm)..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] text-xs sm:text-sm text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="btn-interactive px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
