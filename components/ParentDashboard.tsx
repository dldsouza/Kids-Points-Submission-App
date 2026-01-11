
import React, { useState } from 'react';
import { Kid, Chore, RequestStatus, PurchaseRequest, Transaction, SyncSettings } from '../types';
import { CHORE_LIBRARY, CATEGORIES, QUICK_PURCHASES } from '../constants';

interface Props {
  kids: Kid[];
  requests: PurchaseRequest[];
  transactions: Transaction[];
  syncSettings: SyncSettings;
  onAddPoints: (kidId: string, amount: number, reason: string) => void;
  onProcessRequest: (id: string, status: RequestStatus) => void;
  onUpdateSyncSettings: (settings: SyncSettings) => void;
  onManualSync: () => void;
}

const ParentDashboard: React.FC<Props> = ({ 
  kids, requests, transactions, syncSettings, 
  onAddPoints, onProcessRequest, onUpdateSyncSettings, onManualSync 
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [selectedKidId, setSelectedKidId] = useState(kids[0]?.id || '1');
  const [customPoints, setCustomPoints] = useState(0);
  const [customNote, setCustomNote] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'entry' | 'vault' | 'sync'>('entry');

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
    onAddPoints(selectedKidId, amount, customNote || (isDeduction ? "Manual Deduction" : "Manual Bonus"));
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
              type="password" inputMode="numeric" placeholder="••••"
              className="w-full text-center text-3xl tracking-[1em] py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none"
              value={pin} onChange={(e) => setPin(e.target.value)} autoFocus
            />
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === RequestStatus.SUBMITTED);
  const filteredChores = filter === 'All' ? CHORE_LIBRARY : CHORE_LIBRARY.filter(c => c.category === filter);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Control Center</h2>
          <button onClick={() => setIsLocked(true)} className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full uppercase">Lock Access</button>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {[
            {id: 'entry', label: 'Point Entry', icon: '✍️'},
            {id: 'vault', label: 'History', icon: '🏛️'},
            {id: 'sync', label: 'Cloud Sync', icon: '☁️'}
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'sync' && (
        <section className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-indigo-50 space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Family Sync Settings</h3>
            <p className="text-xs text-slate-400 font-medium">Connect multiple devices (tablets, phones) using one cloud source.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Family ID (Pairing Code)</label>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-2xl font-black text-indigo-600 tracking-widest">{syncSettings.familyId}</span>
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-indigo-600">Copy Code</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Cloud Endpoint (Apps Script URL)</label>
              <input 
                className="w-full p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 focus:ring-2 focus:ring-indigo-500"
                placeholder="https://script.google.com/macros/s/..."
                value={syncSettings.googleSheetUrl}
                onChange={e => onUpdateSyncSettings({...syncSettings, googleSheetUrl: e.target.value})}
              />
              <p className="text-[9px] text-slate-400 leading-relaxed italic">
                * To sync across devices, host a simple Google Apps Script that handles GET/POST and paste the Deployment URL here.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Last Sync: {syncSettings.lastSynced ? new Date(syncSettings.lastSynced).toLocaleTimeString() : 'Never'}
              </div>
              <button 
                onClick={onManualSync}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 transition-colors"
              >
                Sync Now
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'vault' && (
        <section className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 animate-in zoom-in-95">
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
            {transactions.length === 0 ? (
              <p className="text-center py-20 text-slate-300 font-black uppercase italic text-sm">Vault is empty</p>
            ) : (
              transactions.map((tx) => {
                const kid = kids.find(k => k.id === tx.kidId);
                return (
                  <div key={tx.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center p-1">
                        <img src={kid?.avatar} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{tx.description}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{kid?.name} • {new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === 'entry' && (
        <div className="space-y-6 animate-in zoom-in-95">
          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Child</h3>
            <div className="grid grid-cols-2 gap-4">
              {kids.map(kid => (
                <button
                  key={kid.id}
                  onClick={() => setSelectedKidId(kid.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    selectedKidId === kid.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:border-slate-100'
                  }`}
                >
                  <img src={kid.avatar} className="w-10 h-10 rounded-full bg-indigo-50 object-contain" alt="" />
                  <span className={`font-black uppercase text-xs ${selectedKidId === kid.id ? 'text-indigo-700' : 'text-slate-400'}`}>
                    {kid.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Task</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
                {CATEGORIES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase whitespace-nowrap transition-all ${filter === c ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-100'}`}
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
                  onClick={() => onAddPoints(selectedKidId, chore.points, chore.title)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all flex flex-col items-center text-center gap-2"
                >
                  <span className="text-3xl">{chore.icon}</span>
                  <span className="text-[10px] font-black text-slate-600 leading-tight uppercase tracking-tighter">{chore.title}</span>
                  <span className="text-xs font-black text-emerald-500">+{chore.points}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Deductions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_PURCHASES.map(item => (
                <button
                  key={item.id}
                  onClick={() => onAddPoints(selectedKidId, item.points, item.title)}
                  className="bg-white p-4 rounded-2xl border border-rose-50 shadow-sm hover:shadow-md active:scale-95 transition-all flex flex-col items-center text-center gap-1"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase">{item.title}</span>
                  <span className="text-xs font-black text-rose-500">{item.points}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Entry</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black mb-3 uppercase">
                  <span className="text-slate-400">Point Value</span>
                  <span className="text-indigo-600">{customPoints} Points</span>
                </div>
                <input 
                  type="range" min="0" max="200" step="5" 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(parseInt(e.target.value))}
                />
              </div>
              <textarea 
                placeholder="Why are these points being changed?..."
                className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[80px] placeholder:text-slate-300"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
              />
              <div className="flex gap-3">
                <button 
                  disabled={!customNote}
                  onClick={() => handleCustomSubmit(true)} 
                  className="flex-1 py-4 rounded-2xl bg-rose-50 text-rose-600 font-black uppercase text-[10px] border border-rose-100 disabled:opacity-30"
                >
                  Deduct
                </button>
                <button 
                  disabled={!customNote}
                  onClick={() => handleCustomSubmit(false)} 
                  className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100 uppercase text-[10px] disabled:opacity-30"
                >
                  Award
                </button>
              </div>
            </div>
          </section>

          {pendingRequests.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending Decisions</h3>
              <div className="space-y-2">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white p-5 rounded-2xl border-2 border-amber-50 shadow-sm flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-slate-800 text-sm">{req.itemName}</h5>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{kids.find(k => k.id === req.kidId)?.name} • {req.pointCost} Pts</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onProcessRequest(req.id, RequestStatus.REJECTED)} className="px-3 py-2 text-slate-400 font-black text-[10px] uppercase">No</button>
                      <button onClick={() => onProcessRequest(req.id, RequestStatus.APPROVED)} className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase shadow-md shadow-indigo-100">Buy</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
