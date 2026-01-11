
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TaskStatus, 
  RequestStatus, 
  SyncSettings, 
  Chore, 
  Transaction, 
  PurchaseRequest, 
  Kid 
} from './types.ts';
import { 
  INITIAL_KIDS, 
  CHORE_LIBRARY, 
  QUICK_PURCHASES, 
  CATEGORIES 
} from './constants.tsx';

/** 
 * NAVIGATION COMPONENT
 */
const Navigation = ({ currentView, setView }: { currentView: string, setView: (v: 'kid' | 'parent') => void }) => (
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

/**
 * KID DASHBOARD COMPONENT
 */
const KidDashboard = ({ kid, requests, transactions, onSubmitRequest }: any) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [dollarAmount, setDollarAmount] = useState(10);

  const approved = requests.filter((r: any) => r.status === RequestStatus.APPROVED);
  const pending = requests.filter((r: any) => r.status === RequestStatus.SUBMITTED);
  const hasComputerReturns = pending.some((p: any) => p.itemName === "Computer Returns 🏆");

  const calculatedPoints = useMemo(() => {
    if (dollarAmount <= 0) return 0;
    const pts = 100.99 * Math.log(dollarAmount) - 102.5;
    return Math.max(10, Math.round(pts / 5) * 5);
  }, [dollarAmount]);

  const exampleGoals = [
    { name: "Game Currency", cost: 60, icon: "🎮" },
    { name: "$20 Lego Set", cost: 200, icon: "🧱" },
    { name: "Movie Night", cost: 40, icon: "🍿" },
    { name: "New Earbuds", cost: 340, icon: "🎧" },
  ];

  const handleQuickAdd = (name: string, cost: number) => {
    onSubmitRequest({ kidId: kid.id, itemName: name, pointCost: cost });
    setShowRequestForm(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <section className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center space-y-4 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${kid.name === "Bryson" ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
        <div className={`inline-block relative p-2 ${kid.name === "Bryson" ? 'bg-red-50' : 'bg-blue-50'} rounded-full mb-2`}>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Mission Progress</h3>
          <button onClick={() => setShowRequestForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg">+ New Goal</button>
        </div>
        {pending.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold text-sm">No active missions.</div>
        ) : (
          <div className="space-y-4">
            {pending.map((goal: any) => (
              <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-800 text-sm">{goal.itemName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{kid.totalPoints} / {goal.pointCost} Pts</span>
                </div>
                <div className="w-full bg-slate-50 h-5 rounded-full overflow-hidden border border-slate-100 p-1">
                  <div className="h-full rounded-full transition-all duration-1000 bg-indigo-600" style={{ width: `${Math.min(100, (kid.totalPoints / goal.pointCost) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showRequestForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-6 text-center uppercase tracking-tighter">Request a Goal</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {exampleGoals.map(ex => (
                <button key={ex.name} onClick={() => handleQuickAdd(ex.name, ex.cost)} className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-transparent hover:border-indigo-100 text-center gap-1">
                  <span className="text-xl">{ex.icon}</span>
                  <p className="font-bold text-slate-700 text-[10px] leading-tight">{ex.name}</p>
                  <span className="text-[9px] font-black text-indigo-600">{ex.cost} Pts</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowRequestForm(false)} className="w-full text-slate-400 font-bold uppercase text-xs mt-4">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * PARENT DASHBOARD COMPONENT
 */
const ParentDashboard = ({ kids, requests, transactions, syncSettings, onAddPoints, onProcessRequest, onUpdateSyncSettings, onManualSync }: any) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [selectedKidId, setSelectedKidId] = useState(kids[0]?.id || '1');
  const [activeTab, setActiveTab] = useState<'entry' | 'vault' | 'sync'>('entry');
  const PARENT_PIN = "0515";

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Parental Lock</h2>
          <p className="text-sm text-slate-500 mb-6">Enter PIN to access Entry Tool</p>
          <input 
            type="password" inputMode="numeric" placeholder="••••"
            className="w-full text-center text-3xl tracking-[1em] py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none mb-4"
            value={pin} onChange={(e) => {
              setPin(e.target.value);
              if(e.target.value === PARENT_PIN) setIsLocked(false);
            }} 
          />
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter((r: any) => r.status === RequestStatus.SUBMITTED);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Control Center</h2>
        <button onClick={() => setIsLocked(true)} className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full uppercase">Lock</button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
        {['entry', 'vault', 'sync'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'entry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {kids.map((kid: any) => (
              <button key={kid.id} onClick={() => setSelectedKidId(kid.id)} className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedKidId === kid.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50'}`}>
                <img src={kid.avatar} className="w-10 h-10 rounded-full bg-white object-contain" alt="" />
                <span className={`font-black uppercase text-xs ${selectedKidId === kid.id ? 'text-indigo-700' : 'text-slate-400'}`}>{kid.name}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CHORE_LIBRARY.slice(0, 10).map(chore => (
              <button key={chore.id} onClick={() => onAddPoints(selectedKidId, chore.points, chore.title)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-1">
                <span className="text-2xl">{chore.icon}</span>
                <span className="text-[10px] font-black text-slate-600 uppercase">{chore.title}</span>
                <span className="text-xs font-black text-emerald-500">+{chore.points}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-indigo-50 space-y-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter text-center">Sync Settings</h3>
          <input className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs" placeholder="Google Sheet URL..." value={syncSettings.googleSheetUrl} onChange={e => onUpdateSyncSettings({...syncSettings, googleSheetUrl: e.target.value})} />
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>ID: {syncSettings.familyId}</span>
            <button onClick={onManualSync} className="text-indigo-600">Manual Sync</button>
          </div>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 max-h-[400px] overflow-y-auto no-scrollbar">
          {transactions.map((tx: any) => (
            <div key={tx.id} className="p-3 border-b border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-slate-800">{tx.description}</p>
                <p className="text-[9px] text-slate-400 uppercase">{new Date(tx.timestamp).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-black ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.amount}</span>
            </div>
          ))}
        </div>
      )}

      {pendingRequests.length > 0 && activeTab === 'entry' && (
        <div className="space-y-2 pt-4">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending Requests</h3>
          {pendingRequests.map((req: any) => (
            <div key={req.id} className="bg-white p-4 rounded-2xl border-2 border-amber-50 shadow-sm flex items-center justify-between">
              <span className="text-xs font-black">{req.itemName} ({req.pointCost})</span>
              <div className="flex gap-2">
                <button onClick={() => onProcessRequest(req.id, RequestStatus.REJECTED)} className="text-[10px] font-bold text-slate-400 px-2">Reject</button>
                <button onClick={() => onProcessRequest(req.id, RequestStatus.APPROVED)} className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-lg shadow-md">Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
const App: React.FC = () => {
  const [view, setView] = useState<'kid' | 'parent'>('parent');
  const [isSyncing, setIsSyncing] = useState(false);
  const STORAGE_KEYS = { KIDS: 'kp_kids_v5', REQUESTS: 'kp_requests_v5', TXS: 'kp_transactions_v5', SETTINGS: 'kp_settings_v5' };

  const [syncSettings, setSyncSettings] = useState<SyncSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : { googleSheetUrl: '', lastSynced: null, familyId: Math.random().toString(36).substr(2, 6).toUpperCase() };
    } catch (e) { return { googleSheetUrl: '', lastSynced: null, familyId: 'ERR' }; }
  });

  const [kids, setKids] = useState<Kid[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KIDS);
      return saved ? JSON.parse(saved) : INITIAL_KIDS;
    } catch (e) { return INITIAL_KIDS; }
  });

  const [requests, setRequests] = useState<PurchaseRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TXS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [activeKidId, setActiveKidId] = useState<string>('1');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify(kids));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(syncSettings));
  }, [kids, requests, transactions, syncSettings]);

  const pullRemoteData = useCallback(async () => {
    if (!syncSettings.googleSheetUrl?.startsWith('http')) return;
    setIsSyncing(true);
    try {
      const url = new URL(syncSettings.googleSheetUrl);
      url.searchParams.append('familyId', syncSettings.familyId);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data) {
        if (data.kids) setKids(data.kids);
        if (data.requests) setRequests(data.requests);
        if (data.transactions) setTransactions(data.transactions);
      }
    } catch (e) { console.warn(e); } finally { setIsSyncing(false); }
  }, [syncSettings]);

  const pushRemoteData = useCallback(async (k: any, r: any, t: any) => {
    if (!syncSettings.googleSheetUrl?.startsWith('http')) return;
    try {
      await fetch(syncSettings.googleSheetUrl, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({ familyId: syncSettings.familyId, kids: k, requests: r, transactions: t })
      });
    } catch (e) { console.warn(e); }
  }, [syncSettings]);

  const handleAddPoints = (kidId: string, amount: number, reason: string) => {
    const newTx = { id: Math.random().toString(36).substr(2, 9), kidId, description: reason, amount, timestamp: Date.now(), type: 'gain' as const };
    const nextKids = kids.map(k => k.id === kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints + amount) } : k);
    const nextTxs = [newTx, ...transactions];
    setKids(nextKids);
    setTransactions(nextTxs);
    pushRemoteData(nextKids, requests, nextTxs);
  };

  const handleProcessRequest = (id: string, status: RequestStatus) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    let nextKids = kids;
    if (status === RequestStatus.APPROVED) {
      nextKids = kids.map(k => k.id === req.kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints - req.pointCost) } : k);
      handleAddPoints(req.kidId, -req.pointCost, `Goal Met: ${req.itemName}`);
    }
    const nextReqs = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(nextReqs);
    setKids(nextKids);
    pushRemoteData(nextKids, nextReqs, transactions);
  };

  const handleSubmitRequest = (req: any) => {
    const newReq = { ...req, id: Math.random().toString(36).substr(2, 9), status: RequestStatus.SUBMITTED, timestamp: Date.now() };
    const nextReqs = [newReq, ...requests];
    setRequests(nextReqs);
    pushRemoteData(kids, nextReqs, transactions);
  };

  const activeKid = kids.find(k => k.id === activeKidId) || kids[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 kid-gradient rounded-lg flex items-center justify-center text-white font-black text-xl">K</div>
          <h1 className="font-black text-lg text-slate-800 tracking-tighter">KidPoint {isSyncing && "•"}</h1>
        </div>
        {view === 'kid' && (
          <div className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {kids.map(k => (
              <button key={k.id} onClick={() => setActiveKidId(k.id)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${activeKidId === k.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{k.name}</button>
            ))}
          </div>
        )}
      </header>
      <main className="max-w-xl mx-auto px-4 py-8">
        {view === 'parent' ? (
          <ParentDashboard kids={kids} requests={requests} transactions={transactions} syncSettings={syncSettings} onAddPoints={handleAddPoints} onProcessRequest={handleProcessRequest} onUpdateSyncSettings={setSyncSettings} onManualSync={pullRemoteData} />
        ) : (
          <KidDashboard kid={activeKid} requests={requests.filter(r => r.kidId === activeKid.id)} transactions={transactions.filter(t => t.kidId === activeKid.id)} onSubmitRequest={handleSubmitRequest} />
        )}
      </main>
      <Navigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;
