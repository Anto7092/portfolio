import React, { useState, useEffect, useRef } from 'react';
import { USER_CONFIG } from '../config';

const Projects: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedTitle, setTypedTitle] = useState('');
  const [showCaret, setShowCaret] = useState(true);
  const [phase, setPhase] = useState<'typing' | 'scanning' | 'ready'>('typing');
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [showMetadata, setShowMetadata] = useState(false);
  const [scanTop, setScanTop] = useState(-50);
  
  const titleText = "Selected ProJects.";
  const sectionRef = useRef<HTMLElement>(null);

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let currentIdx = 0;
    const typeInterval = setInterval(() => {
      if (currentIdx <= titleText.length) {
        setTypedTitle(titleText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowCaret(false);
          setPhase('scanning');
        }, 500);
      }
    }, 80);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(typeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (phase === 'scanning') {
      const duration = 1500;
      const startTime = performance.now();

      const animateScan = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (sectionRef.current) {
          const height = sectionRef.current.offsetHeight;
          setScanTop(progress * height);
        }

        USER_CONFIG.projects.forEach((p, idx) => {
          if (progress > (idx * 0.2) + 0.1) {
            setVisibleCards(prev => new Set([...prev, p.id]));
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animateScan);
        } else {
          setPhase('ready');
          setTimeout(() => setShowMetadata(true), 300);
        }
      };

      requestAnimationFrame(animateScan);
    }
  }, [phase]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setCardRotate({ x: rotateX, y: rotateY });
  };

  const shadowOffset = {
    x: -mousePos.x * 15,
    y: -mousePos.y * 15
  };

  const archiveHeaderStyle = {
    transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
    textShadow: `
      ${shadowOffset.x}px ${shadowOffset.y}px 10px rgba(0, 0, 0, 0.4),
      ${shadowOffset.x * 1.5}px ${shadowOffset.y * 1.5}px 30px rgba(0, 0, 0, 0.2)
    `,
    transition: 'transform 0.1s ease-out, text-shadow 0.15s ease-out',
  };

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto py-12 md:py-24 px-6 relative overflow-visible">
      {phase === 'scanning' && <div className="scan-line" style={{ top: `${scanTop}px` }} />}

      <div className="flex flex-col mb-16 md:mb-24 items-start relative z-10">
        <h2 
          className="font-display h-fluid font-extrabold leading-[0.9] tracking-tighter text-[#E0E6ED] flex items-center headline-shadow mb-4"
          style={archiveHeaderStyle}
        >
          {typedTitle}
          {showCaret && <span className="caret ml-2 md:ml-4" />}
        </h2>
        <p className={`font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#7F8C8D] transition-all duration-1000 delay-500 ${typedTitle.length > 0 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Personal work exploring AI, systems, and computation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 perspective-1000">
        {USER_CONFIG.projects.map((project) => (
          <div 
            key={project.id} 
            className={`project-card relative ${visibleCards.has(project.id) ? 'is-visible' : ''}`}
            onMouseMove={(e) => handleCardMouseMove(e, project.id)}
            onMouseEnter={() => setHoveredCardId(project.id)}
            onMouseLeave={() => {
                setHoveredCardId(null);
                setCardRotate({ x: 0, y: 0 });
            }}
            style={{
              transform: hoveredCardId === project.id 
                ? `rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg) scale3d(1.05, 1.05, 1.05)` 
                : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: hoveredCardId === project.id ? 'none' : 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              transformStyle: 'preserve-3d',
              zIndex: hoveredCardId === project.id ? 20 : 1
            }}
          >
            <div 
              className={`relative flex flex-col bg-[#1A1D23] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${hoveredCardId === project.id ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'shadow-none'}`}
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className={`w-full h-full object-cover grayscale transition-all duration-1000 ${hoveredCardId === project.id ? 'grayscale-0 scale-110' : 'opacity-40'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D23] via-transparent to-transparent opacity-90"></div>
              </div>
              
              <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col bg-[#1A1D23]/60 backdrop-blur-xl border-x border-b border-white/5 rounded-b-2xl">
                <div className={`flex flex-wrap gap-2 metadata-pop ${showMetadata ? 'active' : ''}`}>
                  {project.tags.map(tag => (
                    <span key={tag} className="font-mono text-[7px] md:text-[8px] font-bold tracking-widest uppercase text-[#BDC3C7] border border-white/10 px-2 py-0.5 rounded bg-white/5 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-1" style={{ transform: 'translateZ(30px)' }}>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[#ECF0F1]">
                    {project.title}
                  </h3>
                  <p className="text-[#7F8C8D] text-xs md:text-sm font-medium leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className={`pt-4 border-t border-white/5 mt-auto flex justify-between items-center metadata-pop ${showMetadata ? 'active' : ''}`}>
                  <span className="font-mono text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-[#7F8C8D]">Vol. 01 — 2025</span>
                  <button className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-[#ECF0F1] hover:text-white transition-colors group">
                    View <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;