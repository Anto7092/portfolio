
import React from 'react';
import { AppView } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StudyDashboardProps {
  onViewChange: (view: AppView) => void;
}

const data = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.2 },
  { name: 'Thu', hours: 4.5 },
  { name: 'Fri', hours: 2.1 },
  { name: 'Sat', hours: 0.5 },
  { name: 'Sun', hours: 3.0 },
];

const StudyDashboard: React.FC<StudyDashboardProps> = ({ onViewChange }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, Student! 👋</h1>
            <p className="text-slate-600 max-w-md">
              Ready to crush your goals today? Your AI Tutor is online and ready to help you with your next assignment.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => onViewChange(AppView.AI_TUTOR)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Ask a Question
              </button>
              <button 
                onClick={() => onViewChange(AppView.FLASHCARDS)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-full font-medium transition-all"
              >
                Review Cards
              </button>
            </div>
          </div>
          <div className="w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center animate-bounce duration-[3000ms]">
            <span className="text-6xl">📖</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-20 -mt-20"></div>
      </section>

      {/* Stats and Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Hours Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Study Hours This Week</h3>
            <select className="text-xs border-slate-200 rounded-lg p-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 px-2">Recommended Tools</h3>
          <button 
            onClick={() => onViewChange(AppView.MINDMAP)}
            className="w-full group text-left bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧠</div>
            <div>
              <p className="font-bold text-slate-800">Mind Map Maker</p>
              <p className="text-sm text-slate-500">Visualize complex relations in seconds.</p>
            </div>
          </button>
          
          <button 
            onClick={() => onViewChange(AppView.FLASHCARDS)}
            className="w-full group text-left bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚡</div>
            <div>
              <p className="font-bold text-slate-800">Card Generator</p>
              <p className="text-sm text-slate-500">Upload notes, get smart flashcards.</p>
            </div>
          </button>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Pro Feature</span>
              <span className="text-xl">🌟</span>
            </div>
            <p className="font-bold mb-1">Essay Proofreader</p>
            <p className="text-xs text-slate-400 mb-4">Get feedback on structure, tone, and grammar.</p>
            <button className="w-full bg-white text-slate-900 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
              Unlock All Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;
