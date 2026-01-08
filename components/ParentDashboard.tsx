
import React, { useState } from 'react';
import { Kid, Chore, RequestStatus, PurchaseRequest } from '../types';
import { CHORE_LIBRARY, CATEGORIES } from '../constants';

interface Props {
  kids: Kid[];
  requests: PurchaseRequest[];
  onAddPoints: (kidId: string, amount: number) => void;
  onProcessRequest: (id: string, status: RequestStatus) => void;
}

const ParentDashboard: React.FC<Props> = ({ kids, requests, onAddPoints, onProcessRequest }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [selectedKidId, setSelectedKidId] = useState(kids[0].id);
  const [customPoints, setCustomPoints] = useState(0);
  const [customNote, setCustomNote] = useState('');
  const [filter, setFilter] = useState('All');

  const PARENT_PIN = "0515";

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === PARENT_PIN) {
      setIsLocked(false);
    } else {
      alert("Incorrect PIN");
      setPin('');
    }
  };

  const handleCustomSubmit = (isDeduction: boolean) => {
    const amount = isDeduction ? -Math.abs(customPoints) : Math.abs(customPoints);
    onAddPoints(selectedKidId, amount);
    setCustomPoints(0);
    setCustomNote('');
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Parental Lock</h2>
          <p className="text-sm text-slate-500 mb-6">Enter PIN to access Entry Tool</p>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input 
              type="password" 
              inputMode="numeric"
              placeholder="••••"
              className="w-full text-center text-3xl tracking-[1em] py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Unlock</button>
          </form>
          <p className="text-[10px] text-slate-300 mt-4 uppercase font-bold tracking-widest italic tracking-normal">Enter the family secret code</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === RequestStatus.SUBMITTED);
  const filteredChores = filter === 'All' ? CHORE_LIBRARY : CHORE_LIBRARY.filter(c => c.category === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800">Point Entry Tool</h2>
        <button onClick={() => setIsLocked(true)} className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Lock Tool</button>
      </div>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Child</h3>
        <div className="grid grid-cols-2 gap-4">
          {kids.map(kid => (
            <button
              key={kid.id}
              onClick={() => setSelectedKidId(kid.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                selectedKidId === kid.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:border-slate-100'
              }`}
            >
              <img src={kid.avatar} className="w-10 h-10 rounded-full" alt="" />
              <span className={`font-bold ${selectedKidId === kid.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                {kid.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Assign Task</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${filter === c ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredChores.map(chore => (
            <button
              key={chore.id}
              onClick={() => onAddPoints(selectedKidId, chore.points)}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all flex flex-col items-center text-center gap-2"
            >
              <span className="text-2xl">{chore.icon}</span>
              <span className="text-[10px] font-bold text-slate-600 leading-tight uppercase">{chore.title}</span>
              <span className="text-xs font-black text-emerald-500">+{chore.points}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Manual Adjust</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-black mb-2 uppercase">
              <span className="text-slate-400">Value</span>
              <span className="text-indigo-600">{customPoints} Points</span>
            </div>
            <input 
              type="range" min="0" max="100" step="5" 
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={customPoints}
              onChange={(e) => setCustomPoints(parseInt(e.target.value))}
            />
          </div>
          <textarea 
            placeholder="Notes (optional)..."
            className="w-full p-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={() => handleCustomSubmit(true)} className="flex-1 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold border border-rose-100 uppercase text-xs">Deduct</button>
            <button onClick={() => handleCustomSubmit(false)} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100 uppercase text-xs">Award</button>
          </div>
        </div>
      </section>

      {pendingRequests.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending Decisions</h3>
          <div className="space-y-2">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{req.itemName}</h5>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{kids.find(k => k.id === req.kidId)?.name} • {req.pointCost} Pts</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onProcessRequest(req.id, RequestStatus.REJECTED)} className="px-3 py-1 text-slate-400 font-bold text-xs uppercase">No</button>
                  <button onClick={() => onProcessRequest(req.id, RequestStatus.APPROVED)} className="px-4 py-1 bg-indigo-600 text-white text-xs font-black rounded-lg uppercase">Buy</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ParentDashboard;
