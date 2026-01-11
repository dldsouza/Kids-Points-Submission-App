
import React, { useState, useEffect, useCallback } from 'react';
import { Kid, PurchaseRequest, RequestStatus, Transaction } from './types';
import { INITIAL_KIDS } from './constants';
import KidDashboard from './components/KidDashboard';
import ParentDashboard from './components/ParentDashboard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [view, setView] = useState<'kid' | 'parent'>('parent');
  
  // Use lazy initialization to read from localStorage immediately
  const [kids, setKids] = useState<Kid[]>(() => {
    const saved = localStorage.getItem('kp_kids');
    return saved ? JSON.parse(saved) : INITIAL_KIDS;
  });

  const [requests, setRequests] = useState<PurchaseRequest[]>(() => {
    const saved = localStorage.getItem('kp_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kp_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeKidId, setActiveKidId] = useState<string>('1');
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('kp_kids', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('kp_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('kp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addTransaction = useCallback((kidId: string, description: string, amount: number) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      kidId,
      description,
      amount,
      timestamp: Date.now(),
      type: amount >= 0 ? 'gain' : 'loss'
    };
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const handleAddPoints = useCallback((kidId: string, amount: number, reason: string) => {
    setKids(prev => prev.map(k => 
      k.id === kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints + amount) } : k
    ));
    addTransaction(kidId, reason, amount);
  }, [addTransaction]);

  const handleSubmitRequest = useCallback((request: Omit<PurchaseRequest, 'id' | 'status' | 'timestamp'>) => {
    const newRequest: PurchaseRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.SUBMITTED,
      timestamp: Date.now()
    };
    setRequests(prev => [newRequest, ...prev]);
  }, []);

  const handleProcessRequest = useCallback((requestId: string, status: RequestStatus) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    if (status === RequestStatus.APPROVED) {
      setKids(prev => prev.map(k => 
        k.id === request.kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints - request.pointCost) } : k
      ));
      addTransaction(request.kidId, `Purchased: ${request.itemName}`, -request.pointCost);
    }

    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status } : r
    ));
  }, [requests, addTransaction]);

  if (!isLoaded) return null;

  const activeKid = kids.find(k => k.id === activeKidId) || kids[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 kid-gradient rounded-lg flex items-center justify-center text-white font-black text-xl">K</div>
            <h1 className="font-black text-lg text-slate-800 tracking-tighter">KidPoint</h1>
          </div>
          {view === 'kid' && (
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
               {kids.map(k => (
                 <button 
                   key={k.id}
                   onClick={() => setActiveKidId(k.id)}
                   className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${activeKidId === k.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   {k.name}
                 </button>
               ))}
            </div>
          )}
          {view === 'parent' && (
            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Entry Tool</div>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {view === 'parent' ? (
          <ParentDashboard 
            kids={kids}
            requests={requests}
            transactions={transactions}
            onAddPoints={handleAddPoints}
            onProcessRequest={handleProcessRequest}
          />
        ) : (
          <KidDashboard 
            kid={activeKid} 
            requests={requests.filter(r => r.kidId === activeKid.id)}
            transactions={transactions.filter(t => t.kidId === activeKid.id)}
            onSubmitRequest={handleSubmitRequest}
          />
        )}
      </main>

      <Navigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;
