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
import ReactMarkdown from 'react-markdown';
import { ActiveTab } from '../types';

interface AIStudyAssistantViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onLaunchPracticeWithTopic: (topic: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode?: string;
  timestamp: string;
}

export const AIStudyAssistantView: React.FC<AIStudyAssistantViewProps> = ({
  onNavigate,
  onLaunchPracticeWithTopic,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<string>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `### Namaste! I am your CampusHub AI Study Buddy 🎓\n\nI am configured for university curriculum (B.Tech CSE/IT, BCA, etc.). How can I assist your study session today?\n\n- **Chat / Ask Anything**: Ask a doubt, ask for tips, or say hi!\n- **Understand**: Need an intuitive, real-world breakdown of difficult concepts?\n- **Summarize**: Want high-yield bullet summaries of heavy chapters?\n- **Solve Doubts**: Stuck on a specific problem or theory?\n- **Generate Questions**: Need university exam-pattern questions?\n- **Revise**: Want a 5-minute rapid memory cheat sheet?`,
      timestamp: 'Just now',
    },
  ]);

  // The 6 Slide 7 Prompt Cards
  const quickPrompts = [
    {
      mode: 'understand',
      title: 'Understand',
      example: 'Explain recursion in simple words with memory stack diagram',
      badge: 'Core Concept',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    },
    {
      mode: 'summarize',
      title: 'Summarize',
      example: 'Summarize BCNF vs 3NF normalization rules in bullet points',
      badge: 'Quick Notes',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
    {
      mode: 'doubts',
      title: 'Solve Doubts',
      example: 'Why is normalization needed in relational database systems?',
      badge: 'Instant Help',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      mode: 'questions',
      title: 'Generate Questions',
      example: 'Give me important 7-mark exam questions for Computer Networks',
      badge: 'Exam Prep',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    },
    {
      mode: 'mock',
      title: 'Create Mock Tests',
      example: 'Launch a 10-question practice test on Operating Systems Deadlocks',
      badge: 'Interactive',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
    {
      mode: 'revise',
      title: 'Revise',
      example: 'Give me a quick 5-minute revision sheet for TCP Congestion Control',
      badge: 'Last Minute',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    },
  ];

  const handleSendMessage = async (promptToSend?: string, modeToSend?: string) => {
    const text = promptToSend || inputPrompt;
    // If promptToSend was provided (clicked quick prompt card), use its specific mode.
    // If user typed in input bar, use modeToSend or activeMode (defaults to 'chat' so it won't force a lecture).
    const mode = modeToSend || (promptToSend ? 'understand' : activeMode);
    if (!text.trim() || isLoading) return;

    // Special trigger for Mock Tests card -> launches Practice Engine directly!
    if (mode === 'mock') {
      onLaunchPracticeWithTopic(selectedSubject);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      mode,
      timestamp: 'Just now',
    };

    const previousHistory = messages
      .filter((m) => m.id !== 'welcome-msg')
      .slice(-6)
      .map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          mode,
          topic: selectedSubject,
          history: previousHistory,
        }),
      });

      const data = await res.json();
      const aiResponse = data.response || data.error || 'No response generated.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        mode,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Error communicating with AI: ${err.message}`,
          timestamp: 'Just now',
        },
      ]);
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
    <div className="space-y-8 pb-16">
      {/* Slide 7 Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                GEMINI AI STUDY MENTOR
              </span>
              <span className="rounded-full bg-purple-950 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-800/60">
                Powered by Gemini 3.8 Flash
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">AI Study Assistant</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Your personal AI study buddy tailored for engineering curriculum: understand, summarize, solve doubts, generate tests, and revise.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Subject Context:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
              <option value="Database Management Systems (DBMS)">Database Management Systems (DBMS)</option>
              <option value="Computer Networks (CN)">Computer Networks (CN)</option>
              <option value="Operating Systems (OS)">Operating Systems (OS)</option>
              <option value="Discrete Mathematics">Discrete Mathematics</option>
            </select>
          </div>
        </div>

        {/* 6 Quick Capability Cards */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            STUDY ASSISTANT CAPABILITY MATRIX (CLICK ANY TO RUN IMMEDIATELY)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPrompts.map((card) => (
              <div
                key={card.title}
                onClick={() => {
                  setActiveMode(card.mode);
                  handleSendMessage(card.example, card.mode);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all hover:scale-[1.02] hover:shadow-md ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{card.title}</h3>
                  <span className="rounded bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold uppercase">
                    {card.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic mt-2 line-clamp-2">
                  “{card.example}”
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center text-xs font-semibold text-slate-400">
          Study ➔ Understand ➔ Practice ➔ Improve
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl overflow-hidden flex flex-col h-[640px]">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0B1120]/60">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-3xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'border border-slate-800 bg-slate-900/90 text-slate-200'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  {isAI ? (
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none space-y-2">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}

                  {isAI && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>CampusHub AI • Verified Academic Guidance</span>
                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Notes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-800 text-white font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-950 border border-purple-800 text-purple-400">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <span>CampusHub AI is formulating structured explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Mode Selector */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          {/* Quick Mode Switcher */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Mode:</span>
              {[
                { id: 'chat', label: '💬 Chat / Ask Anything' },
                { id: 'understand', label: '💡 Understand' },
                { id: 'summarize', label: '📝 Summarize' },
                { id: 'doubts', label: '❓ Solve Doubts' },
                { id: 'questions', label: '🎯 Exam Qs' },
                { id: 'revise', label: '⚡ 5-Min Revision' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMode(m.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap ${
                    activeMode === m.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {messages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-msg',
                      sender: 'ai',
                      text: `### Namaste! I am your CampusHub AI Study Buddy 🎓\n\nI am configured for university curriculum (B.Tech CSE/IT, BCA, etc.). How can I assist your study session today?\n\n- **Chat / Ask Anything**: Ask a doubt, ask for tips, or say hi!\n- **Understand**: Need an intuitive, real-world breakdown of difficult concepts?\n- **Summarize**: Want high-yield bullet summaries of heavy chapters?\n- **Solve Doubts**: Stuck on a specific problem or theory?\n- **Generate Questions**: Need university exam-pattern questions?\n- **Revise**: Want a 5-minute rapid memory cheat sheet?`,
                      timestamp: 'Just now',
                    },
                  ])
                }
                title="Clear chat history"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors shrink-0 ml-auto"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Chat</span>
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              id="ai-assistant-input"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeMode === 'chat'
                  ? "Say hi, ask a doubt, or ask anything (e.g., 'hii', 'bhai deadlock samjha do', 'DBMS 3NF rules')..."
                  : activeMode === 'summarize'
                  ? "Enter concept to summarize (e.g., 'TCP vs UDP', 'Normal forms in DBMS')..."
                  : activeMode === 'doubts'
                  ? "What doubt are you stuck on?..."
                  : activeMode === 'questions'
                  ? "Which topic exam questions do you need?..."
                  : activeMode === 'revise'
                  ? "Enter chapter to generate 5-minute revision sheet..."
                  : "Explain a concept (e.g., 'Recursion with stack diagram')..."
              }
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Focus Topic: <strong className="text-slate-300">{selectedSubject}</strong></span>
            <button
              onClick={() => onLaunchPracticeWithTopic(selectedSubject)}
              className="text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Test yourself on this topic</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
