import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const links = [
    { id: AppView.HOME, label: '01. HOME' },
    { id: AppView.PROJECTS, label: '02. WORKS' },
    { id: AppView.ABOUT, label: '03. BIO' },
  ];

  return (
    <div className="nav-float w-full flex justify-center px-4 pointer-events-none">
      <nav className="glass-nav px-6 md:px-10 py-3 md:py-4 rounded-full flex items-center gap-6 md:gap-12 pointer-events-auto">
        <div className="flex items-center gap-2 pr-6 border-r border-white/10 hidden sm:flex">
          <span className="font-display font-black text-[10px] md:text-[11px] tracking-tight uppercase text-[#E0E6ED]">Anto Bredly</span>
        </div>
        <div className="flex gap-5 md:gap-10">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`font-mono text-[8px] md:text-[9px] font-bold tracking-[0.25em] transition-all duration-500 py-1 nav-underline whitespace-nowrap ${
                currentView === link.id 
                  ? 'text-[#E0E6ED] nav-underline-active' 
                  : 'text-[#7F8C8D] hover:text-[#E0E6ED]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;