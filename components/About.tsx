import React, { useState, useEffect, useRef } from 'react';
import { USER_CONFIG } from '../config';

const About: React.FC = () => {
  const [readProgress, setReadProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const mercuryDotRef = useRef<HTMLDivElement>(null);

  const words = USER_CONFIG.bio.heading.split(' ');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      
      const currentProgress = (scrollPos / height) * 100;
      setReadProgress(prev => Math.max(prev, Math.min(currentProgress, 100)));

      const currentVelocity = Math.abs(scrollPos - lastScrollY);
      setVelocity(currentVelocity);
      setLastScrollY(scrollPos);

      if (timelineRef.current && mercuryDotRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const sectionHeight = timelineRef.current.offsetHeight;
        const timelineStart = scrollPos + rect.top - window.innerHeight / 2;
        const relativeScroll = Math.max(0, Math.min(scrollPos - timelineStart, sectionHeight));
        const dotTopPercent = (relativeScroll / sectionHeight) * 100;
        mercuryDotRef.current.style.top = `${dotTopPercent}%`;
        
        const stretch = 1 + (currentVelocity * 0.15);
        mercuryDotRef.current.style.transform = `scaleY(${Math.min(stretch, 3)})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const renderRichText = (text: string, keywords: string[]) => {
    let parts: (string | React.ReactNode)[] = [text];
    keywords.forEach(keyword => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const splitPart = part.split(new RegExp(`(${keyword})`, 'gi'));
          splitPart.forEach((subPart, i) => {
            if (subPart.toLowerCase() === keyword.toLowerCase()) {
              newParts.push(<span key={`${keyword}-${i}`} className="viscous-keyword text-white">{subPart}</span>);
            } else {
              newParts.push(subPart);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    return parts;
  };

  return (
    <section className="max-w-6xl mx-auto py-12 md:py-24 bio-reveal px-6 relative overflow-visible">
      <div className="bg-sigil tracking-[-0.15em] select-none">{USER_CONFIG.bio.monogram}</div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-20 md:mb-32">
        <div className="md:col-span-8 space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#7F8C8D]">The Narrative</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] text-[#E0E6ED] text-balanced">
              {words.map((word, i) => {
                const isLogic = word.toLowerCase().includes('logic');
                const isAesthetic = word.toLowerCase().includes('aesthetic');
                return (
                  <span 
                    key={i} 
                    className={`inline-block mr-3 opacity-0 animate-[fade-in_0.6s_ease-out_forwards] ${isLogic || isAesthetic ? 'viscous-keyword' : ''}`}
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    {isLogic ? <span className="italic font-normal">logic</span> : 
                     isAesthetic ? <span className="underline decoration-[#7F8C8D] underline-offset-8">aesthetic</span> : word}
                  </span>
                );
              })}
            </h2>
          </div>
          
          <div className="max-w-2xl text-[#E0E6ED]/80 text-sm md:text-base leading-relaxed space-y-6 font-medium">
            {USER_CONFIG.bio.paragraphs.map((p, i) => (
              <p key={i}>
                {renderRichText(p, USER_CONFIG.bio.keywords)}
              </p>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 hidden md:block">
          <div className="status-panel sticky top-32 space-y-8 font-mono">
            <div className="space-y-6">
              <div className="relative group w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-2xl grayscale transition-all duration-700 hover:grayscale-0 border border-white/5 shadow-2xl">
                <img 
                  src={USER_CONFIG.profileImage} 
                  alt={USER_CONFIG.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D23] via-transparent to-transparent opacity-60"></div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-[#E0E6ED] tracking-tight">{USER_CONFIG.name}</h3>
                <p className="text-[9px] text-[#7F8C8D] uppercase tracking-[0.3em]">{USER_CONFIG.role}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] text-[#7F8C8D] uppercase tracking-widest">Initialization Progress</span>
                <span className="text-[10px] text-white/60 tabular-nums">{Math.round(readProgress)}%</span>
              </div>
              <div className="relative h-[2px] bg-white/5 overflow-hidden rounded-full">
                <div 
                  className="absolute h-full bg-[#E0E6ED] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(224,230,237,0.5)]" 
                  style={{ width: `${readProgress}%` }} 
                />
              </div>
              <p className="text-[8px] text-[#7F8C8D]/60 uppercase tracking-widest">Status: {readProgress === 100 ? 'Fully Initialized' : 'Synthesizing...'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-12 md:mt-20">
        <div ref={timelineRef} className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5">
          <div ref={mercuryDotRef} className="mercury-dot" />
        </div>

        <div className="space-y-16 md:space-y-24 pl-8 md:pl-12 relative">
          {USER_CONFIG.timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[42px] top-1.5 font-mono text-[7px] text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.year}
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#7F8C8D] tracking-widest transition-colors group-hover:text-[#E0E6ED]">{item.year}</span>
                <h3 className="font-display text-lg md:text-xl font-bold text-[#E0E6ED] group-hover:translate-x-2 transition-transform duration-500">{item.title}</h3>
                <p className="text-[#7F8C8D] text-xs md:text-sm max-w-lg leading-relaxed group-hover:text-[#BDC3C7] transition-colors">
                  {renderRichText(item.desc, USER_CONFIG.bio.keywords)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-24 md:mt-40 pt-12 md:pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-4">
          <h4 className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#E0E6ED]">Core Stack</h4>
          <div className="grid grid-cols-2 gap-x-8 md:gap-x-12 gap-y-2 font-mono text-[9px] md:text-[10px] text-[#7F8C8D]">
            {USER_CONFIG.skills.map((skill) => (
              <span key={skill} className="hover:text-white transition-colors cursor-crosshair">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </section>
  );
};

export default About;