import React, { useState } from 'react';
import { AppView } from '../../types';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
<<<<<<< HEAD:src/components/App.tsx
//import ChatAssistant from './components/ChatAssistant';
=======
import { USER_CONFIG } from './config';
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb:App.tsx

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
<<<<<<< HEAD:src/components/App.tsx
      //case AppView.CHAT:
      //  return <ChatAssistant />;
=======
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb:App.tsx
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
<<<<<<< HEAD:src/components/App.tsx

    
      {/* Persistent Chat Hub */}
      {/*
      {currentView !== AppView.CHAT && (
        <button
          onClick={() => navigate(AppView.CHAT)}
          className="fixed bottom-6 right-6 w-10 h-10 md:w-12 md:h-12 glass-nav rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 group z-50 transition-all border border-white/5"
        >
          <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity text-[#ECF0F1]">✦</span>
          <div className="absolute right-full mr-4 bg-[#2C3E50]/90 border border-[#BDC3C7]/20 px-4 py-2 rounded-xl text-[7px] md:text-[8px] uppercase font-bold tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none -translate-x-2 group-hover:translate-x-0 text-[#BDC3C7]">
            Assistant
          </div>
        </button>
      )} 
      */}
=======
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb:App.tsx
    </div>
  );
};

export default App;