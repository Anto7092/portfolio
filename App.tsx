
import React, { useState } from 'react';
import { AppView } from './types';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import { USER_CONFIG } from './config';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isChanging, setIsChanging] = useState(false);

  const navigate = (view: AppView) => {
    if (view === currentView) return;
    setIsChanging(true);
    
    setTimeout(() => {
      setCurrentView(view);
      setIsChanging(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 400);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Hero onNavigate={navigate} />;
      case AppView.PROJECTS:
        return <Projects />;
      case AppView.ABOUT:
        return <About />;
      default:
        return <Hero onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#BDC3C7]/30 bg-[#1A1D23]">
      <Navigation currentView={currentView} onNavigate={navigate} />
      
      <main className={`transition-opacity duration-300 pt-20 md:pt-24 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
        {renderContent()}
      </main>
      
      <footer className="fixed bottom-6 left-8 right-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="font-mono text-[7px] md:text-[8px] font-bold tracking-[0.5em] uppercase text-[#7F8C8D]">
          Anto Bredly © 2025
        </div>
        <div className="flex gap-4 md:gap-8 pointer-events-auto">
          <a href={`mailto:${USER_CONFIG.email}`} className="font-mono text-[7px] md:text-[8px] font-bold tracking-[0.2em] uppercase text-[#7F8C8D] hover:text-white transition-colors">
            {USER_CONFIG.email}
          </a>
          <a href={`tel:${USER_CONFIG.phone}`} className="font-mono text-[7px] md:text-[8px] font-bold tracking-[0.2em] uppercase text-[#7F8C8D] hover:text-white transition-colors">
            {USER_CONFIG.phone}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
