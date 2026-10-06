import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, Zap } from 'lucide-react';
import { UserProfile, ReadinessBreakdown } from '../../types';
import { getCoachAdvice } from '../../services/gemini';

interface CareerCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  readiness: ReadinessBreakdown;
  currentDay: number;
}

const PRESET_QUERIES = [
  "What should I do today?",
  "Why am I falling behind?",
  "Prepare me for tomorrow's interview.",
  "Which skill should I improve?",
  "How should I approach this internship?"
];

export const CareerCoachModal: React.FC<CareerCoachModalProps> = ({
  isOpen,
  onClose,
  user,
  readiness,
  currentDay,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string }>>([
    {
      sender: 'coach',
      text: `👋 Hey Guru! I'm your AI Career Coach. You have 248 strikes and a 7-day streak on Day ${currentDay}. What's the main obstacle between you and your AI internship today?`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      const coachReply = await getCoachAdvice(textToSend, user, readiness, currentDay);
      setMessages([...newMessages, { sender: 'coach', text: coachReply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          sender: 'coach',
          text: `Focus on your Next Best Action right now: Complete 10 ML interview questions in the Arena, then apply to 2 Bengaluru startups before 8 PM.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-[#090e18] border border-purple-500/40 p-6 md:p-7 flex flex-col h-[600px] shadow-[0_0_60px_rgba(168,85,247,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white font-mono">
                  AI CAREER COACH
                </h3>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded font-bold">
                  GEMINI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground-truth advice mapped to your Bengaluru AIML target
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-mono"
          >
            ✕ ESC
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs md:text-sm ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'coach' && (
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-mono flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Formulating tactical strategy...</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Query Chips */}
        <div className="py-2 overflow-x-auto flex items-center gap-1.5 shrink-0 max-w-full">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              disabled={isLoading}
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-900/40 whitespace-nowrap transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-slate-800 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask tactical advice (e.g., 'Review my Foreset AI prep')..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className={`p-2.5 rounded-xl font-bold transition-colors ${
              inputVal.trim() && !isLoading
                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
