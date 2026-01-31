import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I built this space to help you explore my thoughts and work.\n\nYou can ask about my project decisions, my learning path in AI, or how to reach me directly for opportunities.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: m.content }]
      }));
      
      const responseText = await geminiService.chatWithAssistant(input, history);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "I'm having a bit of trouble connecting to my system. Could you try again?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="max-w-screen-xl mx-auto pt-16 md:pt-24 pb-10 h-[calc(100vh-100px)] flex flex-col px-6 md:px-12 animate-in fade-in duration-1000">
      <div className="flex flex-col mb-8 items-start border-b border-white/5 pb-6">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tighter text-[#E0E6ED] headline-shadow">
          Anto Bredly
        </h2>
        <div className="mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-[#7F8C8D]">
              System Active • V3.1
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[95%] md:max-w-[75%] space-y-2`}>
              <div className={`flex items-center gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <p className={`font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#7F8C8D]/50`}>
                  {msg.role === 'user' ? 'Visitor' : 'Anto'}
                </p>
                <p className="font-mono text-[7px] text-[#7F8C8D]/30 tabular-nums">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className={`px-6 md:px-10 py-5 md:py-8 rounded-[2rem] text-[14px] md:text-[15px] leading-[1.8] font-medium whitespace-pre-wrap shadow-xl border transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-[#E0E6ED] text-[#1A1D23] border-transparent rounded-tr-none' 
                  : 'bg-[#1A1D23] border-white/5 text-[#E0E6ED]/90 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-[#1A1D23] border border-white/5 px-6 py-3 rounded-full flex gap-1.5 items-center shadow-md">
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce [animation-duration:0.6s]" />
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]" />
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-8" />
      </div>

      <div className="mt-6 relative w-full group">
        <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-[#1A1D23] to-transparent pointer-events-none" />
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="w-full bg-[#1A1D23] border border-white/10 rounded-full py-5 md:py-6 pl-10 pr-20 md:pr-24 outline-none focus:border-white/20 transition-all text-sm md:text-base font-medium text-[#E0E6ED] placeholder:text-[#7F8C8D]/40 shadow-2xl"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 md:right-4 w-11 h-11 md:w-14 md:h-14 bg-[#E0E6ED] text-[#1A1D23] rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-5 disabled:scale-100 active:scale-90 shadow-xl z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="3">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatAssistant;