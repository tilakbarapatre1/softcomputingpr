import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, ArrowRight, CornerDownLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { aiAssistantApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  dataPoints?: any;
  suggestedActions?: Array<{ label: string; link: string }>;
}

const PRESET_PROMPTS = [
  "Which products should I reorder today?",
  "Which products are overstocked?",
  "Which supplier is best for Basmati Rice?",
  "What should I purchase with a ₹1 lakh budget?",
  "Which products have high stockout risk?"
];

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "👋 Hello! I am your **Smart Inventory AI Copilot**.\n\nI can analyze real-time retail stock, time-series ML demand forecasts, supplier reliability scores, and run OR-Tools procurement optimizations.\n\nWhat would you like to explore today?"
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || query).trim();
    if (!promptText || isLoading) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: promptText };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await aiAssistantApi.ask(promptText);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.answer,
        dataPoints: res.data_points,
        suggestedActions: res.suggested_actions
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "⚠️ Apologies, I encountered an issue accessing the live database. Please ensure the backend server is running."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (link: string) => {
    onClose();
    navigate(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#121c19] border border-[#e5ebe5] dark:border-[#20332c] rounded-2xl shadow-2xl flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-[#e5ebe5] dark:border-[#20332c] flex items-center justify-between bg-[#f8faf8] dark:bg-[#16231f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-[#a3e635] shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                AI Inventory & Procurement Copilot
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full">
                  Decision Engine
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Grounded in database inventory levels & OR-Tools MILP optimizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-[#20332c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 px-6 space-y-4 text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1b3b32] text-white font-medium rounded-br-none shadow-sm'
                    : 'bg-[#f4f7f4] dark:bg-[#182622] text-slate-800 dark:text-slate-200 rounded-bl-none border border-[#e5ebe5] dark:border-[#233831]'
                }`}
              >
                {/* Format markdown bullet points and headings */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act.link)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-[#f4f7f4] dark:bg-[#182622] p-3 rounded-xl w-fit border border-[#e5ebe5] dark:border-[#233831]">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analyzing live database and running optimization models...</span>
            </div>
          )}
        </div>

        {/* Preset Prompt Chips */}
        <div className="px-4 py-2 bg-[#fbfdfb] dark:bg-[#111a17] border-t border-[#e5ebe5] dark:border-[#20332c] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Prompts:
          </span>
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#182622] hover:bg-emerald-50 dark:hover:bg-[#20332c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 px-4 bg-white dark:bg-[#141f1c] border-t border-[#e5ebe5] dark:border-[#20332c] flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI anything regarding stock, forecasts, suppliers, or budget..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-[#121c19] text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] flex items-center justify-center font-bold disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
