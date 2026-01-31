
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I am Anto's digital twin. I can discuss architectural choices, specific projects, or collaboration opportunities. How may I assist?",
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
        content: responseText || "The connection was interrupted. Please re-engage.",
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
    <section className="max-w-2xl mx-auto pt-16 md:pt-24 pb-12 reveal h-[calc(100vh-180px)] flex flex-col px-6">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 md:pr-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[85%] space-y-1`}>
              <p className={`font-mono text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-[#7F8C8D] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'Visitor' : 'Concierge'}
              </p>
              <div className={`px-4 md:px-5 py-3 md:py-4 rounded-2xl text-[12px] md:text-[13px] leading-relaxed font-medium ${
                msg.role === 'user' 
                  ? 'bg-[#ECF0F1] text-[#2C3E50] shadow-xl' 
                  : 'bg-[#34495E] border border-white/5 text-[#ECF0F1]'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#34495E] border border-white/5 px-4 py-2 rounded-full flex gap-1.5 items-center">
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-[#7F8C8D] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-8 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Inquire about project architecture..."
          className="w-full bg-[#34495E]/50 border border-white/10 rounded-full py-3 md:py-4 px-6 outline-none focus:border-[#BDC3C7] transition-all text-sm font-medium text-[#ECF0F1] placeholder:text-[#7F8C8D] shadow-inner"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="absolute right-2 top-1.5 md:top-2 w-8 h-8 md:w-10 md:h-10 bg-[#ECF0F1] text-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#BDC3C7] transition-all disabled:opacity-20 active:scale-95"
        >
          <span className="text-lg leading-none font-bold">↑</span>
        </button>
      </div>
    </section>
  );
};

export default ChatAssistant;
