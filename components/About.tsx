import React, { useState, useEffect, useRef } from 'react';
import { USER_CONFIG } from '../config';

const About: React.FC = () => {
  const [readProgress, setReadProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const mercuryDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Global read progress calculation
      const currentProgress = (scrollPos / docHeight) * 100;
      setReadProgress(prev => Math.max(prev, Math.min(currentProgress, 100)));

      if (timelineRef.current && mercuryDotRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calibrated math: 
        // The dot starts moving when the top of the timeline reaches the middle of the screen.
        // It reaches the bottom when the bottom of the timeline reaches the middle of the screen.
        const center = viewportHeight / 2;
        const distFromTop = center - rect.top;
        const totalDist = rect.height;
        
        let dotProgress = distFromTop / totalDist;
        
        // Clamping between 0 and 1
        dotProgress = Math.max(0, Math.min(dotProgress, 1));
        
        // Calibration for the end of the document: 
        // If the user has reached the bottom of the page (99% or higher global progress), 
        // we force the dot to reach the end of its track to ensure visual completion.
        if (currentProgress > 99) {
          dotProgress = 1;
        }

        mercuryDotRef.current.style.top = `${dotProgress * 100}%`;
      }
      setLastScrollY(scrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set positions
    handleScroll();
    
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
              newParts.push(<span key={`${keyword}-${i}`} className="viscous-keyword text-white font-semibold">{subPart}</span>);
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-20 md:mb-32">
        <div className="md:col-span-8 space-y-12">
          <div className="space-y-6">
            <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#7F8C8D]">The Identity</span>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] text-[#E0E6ED] tracking-tighter headline-shadow">
              {USER_CONFIG.bio.heading}
            </h2>
          </div>
          
          <div className="max-w-2xl text-[#E0E6ED]/90 text-sm md:text-base lg:text-lg leading-relaxed space-y-8 font-medium">
            {USER_CONFIG.bio.paragraphs.map((p, i) => {
              if (p === "— — —") {
                return (
                  <div key={i} className="py-8 flex items-center gap-4 opacity-30 select-none">
                    <span className="font-mono text-xs tracking-[0.5em] text-[#7F8C8D]">— — —</span>
                  </div>
                );
              }
              return (
                <p key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                  {renderRichText(p, USER_CONFIG.bio.keywords)}
                </p>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-4 hidden md:block">
          <div className="status-panel sticky top-32 space-y-10 font-mono">
            <div className="space-y-6">
              <div className="relative group w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 shadow-2xl">
                <img 
                  src={USER_CONFIG.profileImage} 
                  alt={USER_CONFIG.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-[#E0E6ED] tracking-tight">{USER_CONFIG.name}</h3>
                <p className="text-[9px] text-[#7F8C8D] uppercase tracking-[0.3em]">{USER_CONFIG.role}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] text-[#7F8C8D] uppercase tracking-widest">Progress</span>
                <span className="text-[10px] text-white/60 tabular-nums">{Math.round(readProgress)}%</span>
              </div>
              <div className="relative h-[2px] bg-white/10 overflow-hidden rounded-full">
                <div 
                  className="absolute h-full bg-[#E0E6ED] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(224,230,237,0.4)]" 
                  style={{ width: `${readProgress}%` }} 
                />
              </div>
              <p className="text-[8px] text-[#7F8C8D]/60 uppercase tracking-widest">System: Online</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 md:mt-32">
        <div ref={timelineRef} className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10">
          <div ref={mercuryDotRef} className="mercury-dot" />
        </div>

        <div className="space-y-16 md:space-y-28 pl-10 md:pl-16 relative">
          {USER_CONFIG.timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[48px] md:-left-[64px] top-1.5 font-mono text-[7px] text-white/5 opacity-0 md:group-hover:opacity-100 transition-opacity">
                {item.year}
              </div>
              
              <div className="space-y-3">
                <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#7F8C8D] tracking-widest">{item.year}</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[#E0E6ED] md:group-hover:translate-x-2 transition-transform duration-500">{item.title}</h3>
                <p className="text-[#7F8C8D] text-sm md:text-base max-w-xl leading-relaxed font-medium">
                  {renderRichText(item.desc, USER_CONFIG.bio.keywords)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;