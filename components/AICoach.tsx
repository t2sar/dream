import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, Habit, HabitLog } from '../types';
import { chatWithCoach, analyzeProgress } from '../services/geminiService';
import { Button } from './Button';

interface AICoachProps {
  habits: Habit[];
  logs: HabitLog;
}

export const AICoach: React.FC<AICoachProps> = ({ habits, logs }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello. I am t2sar AI. I can help you analyze your path or suggest new strategies. How can I assist you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await chatWithCoach(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', content: response, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    const analysis = await analyzeProgress(habits, logs);
    setMessages(prev => [...prev, { role: 'model', content: analysis, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] glass rounded-3xl overflow-hidden border border-white/5">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-slate-900/30 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <Bot className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide">t2sar AI</h3>
            <p className="text-xs text-sky-400/60 font-medium tracking-wider uppercase">Powered by Gemini</p>
          </div>
        </div>
        <Button variant="ghost" onClick={runAnalysis} className="text-xs" disabled={isLoading}>
          <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
          Analyze
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            )}
            <div className={`
              max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed tracking-wide font-light shadow-sm
              ${msg.role === 'user' 
                ? 'bg-sky-500 text-white rounded-tr-md' 
                : 'bg-slate-800/60 text-slate-200 rounded-tl-md border border-white/5'
              }
            `}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
               <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center shrink-0">
               <User className="w-5 h-5 text-slate-400" />
             </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div className="bg-slate-800/60 p-4 rounded-3xl rounded-tl-md flex items-center gap-1.5 border border-white/5">
              <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
              <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
              <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 bg-slate-900/40 border-t border-white/5 backdrop-blur-md">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask specific questions about your path..."
            className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="rounded-xl px-4">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};