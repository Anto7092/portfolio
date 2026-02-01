
import React, { useState } from 'react';
import { Flashcard } from '../types';
import { geminiService } from '../services/geminiService';

const FlashcardTool: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateCards = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const cards = await geminiService.generateFlashcards(topic);
      setFlashcards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Search/Generate */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Generate Flashcards</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g., Photosynthesis, Roman History...)"
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-sm"
          />
          <button
            onClick={generateCards}
            disabled={isGenerating || !topic.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold text-sm"
          >
            {isGenerating ? 'Thinking...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Card Display */}
      {flashcards.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-4">
            <span className="text-sm font-medium text-slate-500">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFlashcards([])}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Clear Deck
              </button>
            </div>
          </div>

          <div 
            className="h-80 w-full perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-slate-100 shadow-lg p-10 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Question</span>
                <p className="text-2xl font-bold text-slate-800">{flashcards[currentIndex].question}</p>
                <p className="text-xs text-slate-400 italic mt-auto">Click to flip</p>
              </div>
              
              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl border-2 border-indigo-700 shadow-lg p-10 flex flex-col items-center justify-center text-center text-white space-y-4">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Answer</span>
                <p className="text-xl font-medium leading-relaxed">{flashcards[currentIndex].answer}</p>
                <div className="flex flex-wrap gap-2 justify-center mt-auto">
                  {flashcards[currentIndex].tags?.map(t => (
                    <span key={t} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={(e) => { e.stopPropagation(); prevCard(); }}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 transition-all active:scale-90"
            >
              ←
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextCard(); }}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 transition-all active:scale-90"
            >
              →
            </button>
          </div>
        </div>
      )}

      {flashcards.length === 0 && !isGenerating && (
        <div className="text-center py-20 px-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="text-6xl mb-4 opacity-30">📇</div>
          <h3 className="text-lg font-bold text-slate-400">No cards yet</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Enter a topic above and let ZenStudy AI generate customized flashcards for your study session.
          </p>
        </div>
      )}
    </div>
  );
};

// CSS styles added via style tag in index.html for simplicity or manually if preferred. 
// Adding perspective and transform-style-3d manually to Tailwind via standard CSS.
const styles = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
// Add these to index.html within a <style> block.

export default FlashcardTool;
