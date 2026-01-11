
import React, { useState, useMemo } from 'react';
import { Kid, PurchaseRequest, RequestStatus, Transaction } from '../types';

interface Props {
  kid: Kid;
  requests: PurchaseRequest[];
  transactions: Transaction[];
  onSubmitRequest: (req: Omit<PurchaseRequest, 'id' | 'status' | 'timestamp'>) => void;
}

const KidDashboard: React.FC<Props> = ({ kid, requests, transactions, onSubmitRequest }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [dollarAmount, setDollarAmount] = useState(10);

  const approved = requests.filter(r => r.status === RequestStatus.APPROVED);
  const pending = requests.filter(r => r.status === RequestStatus.SUBMITTED);

  const hasComputerReturns = pending.some(p => p.itemName === "Computer Returns 🏆");

  const calculatedPoints = useMemo(() => {
    if (dollarAmount <= 0) return 0;
    const pts = 100.99 * Math.log(dollarAmount) - 102.5;
    return Math.max(10, Math.round(pts / 5) * 5);
  }, [dollarAmount]);

  const exampleGoals = [
    { name: "Game Currency", cost: 60, icon: "🎮", label: "~$5" },
    { name: "$20 Lego Set", cost: 200, icon: "🧱", label: "$20" },
    { name: "Movie Night", cost: 40, icon: "🍿", label: "Special" },
    { name: "New Earbuds", cost: 340, icon: "🎧", label: "$80" },
  ];

  const handleQuickAdd = (name: string, cost: number) => {
    onSubmitRequest({ kidId: kid.id, itemName: name, pointCost: cost });
    setShowRequestForm(false);
  };

  const getThemeColor = () => {
    return kid.name === "Bryson" ? "bg-red-50" : "bg-blue-50";
  };

  const getHeaderColor = () => {
    return kid.name === "Bryson" ? "bg-pink-500" : "bg-blue-500";
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      {/* Analytics Card */}
      <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center space-y-4 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${getHeaderColor()}`}></div>
        <div className={`inline-block relative p-2 ${getThemeColor()} rounded-full mb-2`}>
          <img src={kid.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-contain bg-white" alt={kid.name} />
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

      {/* History Log */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Recent Activity</h3>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto no-scrollbar">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-300 font-bold text-sm uppercase italic">No history yet</div>
            ) : (
              transactions.map((tx, idx) => (
                <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-sm">{tx.description}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`font-black text-sm ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Mission Progress</h3>
          <button 
            onClick={() => setShowRequestForm(true)}
            className={`px-4 py-2 ${getHeaderColor()} text-white rounded-full text-[10px] font-black uppercase shadow-lg`}
          >
            + New Goal
          </button>
        </div>

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
            <p className="text-slate-400 font-bold text-sm">No active missions.</p>
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
            <h3 className="text-xl font-black text-slate-800 mb-6 text-center uppercase tracking-tighter">Request a Goal</h3>
            
            <div className="grid grid-cols-1 gap-2 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Standard Goals</p>
              <div className="grid grid-cols-2 gap-2">
                {exampleGoals.map(ex => (
                  <button 
                    key={ex.name}
                    onClick={() => handleQuickAdd(ex.name, ex.cost)}
                    className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-transparent hover:border-indigo-100 active:bg-indigo-50 transition-all text-center gap-1"
                  >
                    <span className="text-xl">{ex.icon}</span>
                    <p className="font-bold text-slate-700 text-[10px] leading-tight">{ex.name}</p>
                    <span className="text-[9px] font-black text-indigo-600">{ex.cost} Pts</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Custom Reward Tool</p>
              <input 
                placeholder="What is the reward? (e.g. New Toy)"
                className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
              
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex justify-between text-xs font-black mb-4 uppercase">
                  <span className="text-indigo-400 tracking-tighter">Value: ${dollarAmount}</span>
                  <span className="text-indigo-600">{calculatedPoints} Pts</span>
                </div>
                <input 
                  type="range" min="1" max="1000" step="1" 
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-2"
                  value={dollarAmount}
                  onChange={(e) => setDollarAmount(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-[8px] text-indigo-300 font-bold uppercase px-1">
                  <span>$1</span>
                  <span>$500</span>
                  <span>$1k</span>
                </div>
                <p className="text-[9px] text-indigo-400 text-center font-bold uppercase tracking-widest italic mt-2">Points scale steeply for high-value items</p>
              </div>

              <button 
                onClick={() => {
                  if(!newItem) return;
                  onSubmitRequest({ kidId: kid.id, itemName: newItem, pointCost: calculatedPoints });
                  setShowRequestForm(false);
                  setNewItem('');
                  setDollarAmount(10);
                }}
                className={`w-full py-4 ${getHeaderColor()} text-white rounded-2xl font-black uppercase text-xs shadow-lg`}
              >
                Submit Request
              </button>
              <button onClick={() => setShowRequestForm(false)} className="w-full text-slate-400 font-bold uppercase text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidDashboard;
