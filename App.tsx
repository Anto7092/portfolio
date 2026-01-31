
import React, { useState } from 'react';
import { AppView } from './types';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isChanging, setIsChanging] = useState(false);

  const navigate = (view: AppView) => {
    if (view === currentView) return;
    setIsChanging(true);
    
    // Faster, cleaner view swap to allow the new page's internal animations to take center stage
    setTimeout(() => {
      setCurrentView(view);
      setIsChanging(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 400); // Slightly longer to allow a cleaner exit
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Hero onNavigate={navigate} />;
      case AppView.PROJECTS:
        return <Projects />;
      case AppView.ABOUT:
        return <About />;
      case AppView.CHAT:
        return <ChatAssistant />;
      default:
        return <Hero onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#BDC3C7]/30">
      <Navigation currentView={currentView} onNavigate={navigate} />
      
      <main className={`transition-opacity duration-300 pt-20 md:pt-24 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
        {renderContent()}
      </main>
      
      <footer className="fixed bottom-6 left-8 font-mono text-[7px] md:text-[8px] font-bold tracking-[0.5em] uppercase text-[#7F8C8D] z-10 hidden lg:block">
        Anto Bredly Portfolio © 2025
      </footer>

      {/* Persistent Chat Hub */}
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
    </div>
  );
};

export default App;
