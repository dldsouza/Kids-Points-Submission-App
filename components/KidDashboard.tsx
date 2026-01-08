
import React, { useState, useEffect } from 'react';
import { Kid, PurchaseRequest, RequestStatus } from '../types';

interface Props {
  kid: Kid;
  chores: any;
  requests: PurchaseRequest[];
  onCompleteChore: (points: number) => void;
  onSubmitRequest: (req: Omit<PurchaseRequest, 'id' | 'status' | 'timestamp'>) => void;
}

const KidDashboard: React.FC<Props> = ({ kid, requests, onSubmitRequest }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newCost, setNewCost] = useState(40);

  const approved = requests.filter(r => r.status === RequestStatus.APPROVED);
  const pending = requests.filter(r => r.status === RequestStatus.SUBMITTED);

  // Special logic for Bryson's unique goal
  const hasComputerReturns = pending.some(p => p.itemName === "Computer Returns 🏆");

  const exampleGoals = [
    { name: "400 Robux", cost: 40, icon: "🎮" },
    { name: "Movie Night", cost: 40, icon: "🍿" },
    { name: "Sleepover", cost: 20, icon: "⛺" }
  ];

  const handleQuickAdd = (name: string, cost: number) => {
    onSubmitRequest({ kidId: kid.id, itemName: name, pointCost: cost });
    setShowRequestForm(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      {/* Analytics Card */}
      <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
        <div className="inline-block relative p-1 bg-slate-50 rounded-full mb-2">
          <img src={kid.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover bg-indigo-50" alt={kid.name} />
          {kid.name === "Remy" && <span className="absolute -bottom-1 -right-1 text-2xl">🤠</span>}
          {kid.name === "Bryson" && <span className="absolute -bottom-1 -right-1 text-2xl">👺</span>}
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">{kid.totalPoints}</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Available Points</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <div className="border-r border-slate-50">
            <div className="text-xl font-bold text-emerald-500">{approved.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-black">Successes</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-500">{pending.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-black">Active Goals</div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Mission Progress</h3>
          <button 
            onClick={() => setShowRequestForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg shadow-indigo-100"
          >
            + New Goal
          </button>
        </div>

        {/* Special Bryson Goal Auto-Offer */}
        {kid.name === "Bryson" && !hasComputerReturns && (
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 rounded-2xl shadow-lg text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h4 className="font-bold text-sm">Computer Returns</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Ultimate 600pt Reward</p>
              </div>
            </div>
            <button 
              onClick={() => handleQuickAdd("Computer Returns 🏆", 600)}
              className="bg-white text-amber-600 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase shadow-inner"
            >
              Accept
            </button>
          </div>
        )}

        {pending.length === 0 && (kid.name !== "Bryson" || hasComputerReturns) ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <p className="text-slate-400 font-bold text-sm">No active missions. Click "New Goal"!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map(goal => {
              const progress = Math.min(100, (kid.totalPoints / goal.pointCost) * 100);
              const isSpecial = goal.itemName.includes("🏆");
              return (
                <div key={goal.id} className={`bg-white p-6 rounded-2xl border ${isSpecial ? 'border-amber-200 shadow-amber-50' : 'border-slate-100'} shadow-sm space-y-3`}>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-800 text-sm">{goal.itemName}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{kid.totalPoints} / {goal.pointCost} Pts</span>
                  </div>
                  <div className="w-full bg-slate-50 h-5 rounded-full overflow-hidden border border-slate-100 p-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isSpecial ? 'bg-amber-400' : 'bg-indigo-600'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase ${progress >= 100 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {progress >= 100 ? 'Mission Ready!' : `${Math.ceil(goal.pointCost - kid.totalPoints)} left`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 italic">Target: {goal.pointCost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Goal Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-6 text-center uppercase tracking-tighter">Choose Your Reward</h3>
            
            <div className="grid grid-cols-1 gap-2 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Quick Examples</p>
              {exampleGoals.map(ex => (
                <button 
                  key={ex.name}
                  onClick={() => handleQuickAdd(ex.name, ex.cost)}
                  className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-indigo-100 active:bg-indigo-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ex.icon}</span>
                    <span className="font-bold text-slate-700 text-sm">{ex.name}</span>
                  </div>
                  <span className="text-xs font-black text-indigo-600">{ex.cost} Pts</span>
                </button>
              ))}
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase">Or Custom</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="space-y-4">
              <input 
                placeholder="Name your reward..."
                className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Points</span>
                  <span className="text-indigo-600">{newCost}</span>
                </div>
                <input 
                  type="range" min="10" max="1000" step="10"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={newCost}
                  onChange={e => setNewCost(parseInt(e.target.value))}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowRequestForm(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-xs">Close</button>
                <button 
                  onClick={() => {
                    if(!newItem) return;
                    onSubmitRequest({ kidId: kid.id, itemName: newItem, pointCost: newCost });
                    setShowRequestForm(false);
                    setNewItem('');
                  }}
                  className="flex-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-100"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidDashboard;
