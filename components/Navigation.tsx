
import React from 'react';

interface Props {
  currentView: 'kid' | 'parent';
  setView: (view: 'kid' | 'parent') => void;
}

const Navigation: React.FC<Props> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 px-6 z-50 shadow-2xl">
      <div className="max-w-md mx-auto flex justify-around">
        <button 
          onClick={() => setView('parent')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'parent' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Entry Tool</span>
        </button>
        <button 
          onClick={() => setView('kid')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'kid' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
