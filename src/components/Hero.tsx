import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';

interface HeroProps {
  onNavigate: (view: AppView) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [latency, setLatency] = useState('0.002');
  
  const [typedExploring, setTypedExploring] = useState('');
  const [typedIntelligence, setTypedIntelligence] = useState('');
  const [isSynthActive, setIsSynthActive] = useState(false);
  const [isSynthDone, setIsSynthDone] = useState(false);
  const [isIntelActive, setIsIntelActive] = useState(false);
  const [isIntelDone, setIsIntelDone] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const fullExploring = "Exploring";
  const fullIntelligence = "Intelligence.";

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const metaTimer = setTimeout(() => setShowMeta(true), 150);

    const latencyInterval = setInterval(() => {
      const val = (0.002 + Math.random() * 0.002).toFixed(3);
      setLatency(val);
    }, 2000);

    const typeSequentially = async () => {
      setIsSynthActive(true);
      for (let i = 0; i <= fullExploring.length; i++) {
        setTypedExploring(fullExploring.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 140)); 
      }
      setIsSynthActive(false);
      setIsSynthDone(true);

      await new Promise(resolve => setTimeout(resolve, 500));

      setIsIntelActive(true);
      for (let i = fullIntelligence.length - 1; i >= 0; i--) {
        setTypedIntelligence(fullIntelligence.slice(i));
        await new Promise(resolve => setTimeout(resolve, 140));
      }
      setIsIntelActive(false);
      setIsIntelDone(true);
    };

    const startTimer = setTimeout(typeSequentially, 800);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollProgress(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(metaTimer);
      clearTimeout(startTimer);
      clearInterval(latencyInterval);
    };
  }, []);

  const exploringX = scrollProgress * -0.1;
  const intelligenceX = scrollProgress * 0.1;

  const cursorParallax = {
    x: mousePos.x * 12,
    y: mousePos.y * 12
  };

  const shadowOffset = {
    x: -mousePos.x * 15,
    y: -mousePos.y * 15
  };

  const exploringStyle = {
    transform: `translate3d(${exploringX + cursorParallax.x}px, ${cursorParallax.y}px, 0)`,
    textShadow: `
      ${shadowOffset.x}px ${shadowOffset.y}px 10px rgba(0, 0, 0, 0.4),
      ${shadowOffset.x * 1.5}px ${shadowOffset.y * 1.5}px 30px rgba(0, 0, 0, 0.2)
    `,
    transition: 'transform 0.1s ease-out, text-shadow 0.15s ease-out',
    zIndex: 20
  };

  const intelligenceStyle = {
    transform: `translate3d(${intelligenceX + (cursorParallax.x * -1.2)}px, ${cursorParallax.y * -1.2}px, 0)`,
    textShadow: `${shadowOffset.x * 0.5}px ${shadowOffset.y * 0.5}px 20px rgba(0, 0, 0, 0.3)`,
    transition: 'transform 0.1s ease-out, text-shadow 0.15s ease-out',
    zIndex: 10
  };

  return (
    <section ref={heroRef} className="w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center px-4 pt-[80px] pb-[100px] relative overflow-hidden">
      
      <div className={`mb-6 md:mb-10 font-mono text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-[#7F8C8D] transition-opacity duration-1000 ${showMeta ? 'opacity-100' : 'opacity-0'}`}>
        Student • AI / ML
      </div>
      
      <div className="relative mb-14 md:mb-20 select-none w-full flex flex-col items-center">
        <h1 className="font-display h-fluid font-extrabold leading-[0.9] tracking-tighter text-[#E0E6ED] flex flex-col w-full gap-2 md:gap-4">
          
          <div className="flex justify-start w-full px-4 md:pl-20 lg:pl-48">
            <span 
              className="will-change-transform headline-shadow inline-flex items-center min-h-[1.1em]" 
              style={exploringStyle}
            >
              {typedExploring}
              {isSynthActive && <span className="caret ml-2 md:ml-3" />}
            </span>
          </div>

          <div className="flex justify-end w-full px-4 md:pr-20 lg:pr-48">
            <span 
              className="outline-text-silver transition-all hover:text-[#E0E6ED] duration-700 will-change-transform headline-shadow inline-flex items-center min-h-[1.1em]"
              style={intelligenceStyle}
            >
              {isIntelActive && <span className="caret mr-2 md:mr-3" />}
              {typedIntelligence}
            </span>
          </div>
        </h1>
      </div>
      
      <div className={`space-y-4 mb-10 md:mb-16 transition-all duration-1000 delay-500 ${isIntelDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="max-w-2xl p-fluid text-[#BDC3C7] leading-[1.7] font-medium mx-auto tracking-wide text-balanced px-6">
          I’m exploring how intelligence can be built, understood, and improved through code and math.
        </p>
      </div>
      
      <div className={`flex flex-col items-center gap-6 transition-all duration-1000 delay-700 ${isIntelDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <button 
          onClick={() => onNavigate(AppView.PROJECTS)}
          className="group text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-[#E0E6ED] flex items-center gap-6 py-4 px-12 rounded-full border border-white/5 transition-all duration-700 hover:scale-[1.02] hover:border-white/20 cta-glow bg-white/5 relative overflow-hidden active:scale-95"
        >
          explore my projects
          <div className="flex items-center gap-1">
            <div className="w-12 md:w-16 h-[1px] bg-[#7F8C8D]/40 relative overflow-hidden group-hover:bg-[#E0E6ED]/60 transition-colors">
            </div>
          </div>
        </button>
      </div>

      <div className={`absolute top-28 left-10 font-mono text-[7px] text-[#7F8C8D]/30 tracking-widest uppercase hidden xl:block text-left transition-opacity duration-1000 delay-1000 ${isIntelDone ? 'opacity-100' : 'opacity-0'}`}>
        RESEARCH_INDEX: 0x42 <br /> 
        STUDY_CORE: V3.1
      </div>

      <div className={`absolute bottom-24 right-10 font-mono text-[7px] text-[#7F8C8D]/30 tracking-widest uppercase text-right hidden xl:block transition-opacity duration-1000 delay-1000 ${isIntelDone ? 'opacity-100' : 'opacity-0'}`}>
        NETWORK: <span className="text-white/30">SECURE</span> <br /> 
        LATENCY: {latency}ms
      </div>
    </section>
  );
};

export default Hero;