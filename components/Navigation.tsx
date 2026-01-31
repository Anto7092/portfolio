
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
    <div className="nav-float w-[90%] md:w-auto px-4">
      <nav className="glass-nav px-4 md:px-8 py-2 md:py-3 rounded-full flex items-center justify-between md:justify-start gap-4 md:gap-12">
        <div className="flex items-center gap-2 pr-4 md:pr-8 border-r border-white/10">
          <span className="font-display font-black text-[10px] md:text-[11px] tracking-tight uppercase text-[#E0E6ED]">Anto Bredly</span>
        </div>
        <div className="flex gap-4 md:gap-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`font-mono text-[8px] md:text-[9px] font-bold tracking-[0.25em] transition-all duration-500 py-1 nav-underline ${
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
