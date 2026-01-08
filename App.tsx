
import React, { useState, useEffect, useCallback } from 'react';
import { Kid, PurchaseRequest, RequestStatus } from './types';
import { INITIAL_KIDS, CHORE_LIBRARY } from './constants';
import KidDashboard from './components/KidDashboard';
import ParentDashboard from './components/ParentDashboard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [view, setView] = useState<'kid' | 'parent'>('parent');
  const [kids, setKids] = useState<Kid[]>(INITIAL_KIDS);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [activeKidId, setActiveKidId] = useState<string>(INITIAL_KIDS[0].id);

  useEffect(() => {
    const savedKids = localStorage.getItem('kp_kids');
    const savedRequests = localStorage.getItem('kp_requests');
    if (savedKids) setKids(JSON.parse(savedKids));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  useEffect(() => {
    localStorage.setItem('kp_kids', JSON.stringify(kids));
    localStorage.setItem('kp_requests', JSON.stringify(requests));
  }, [kids, requests]);

  const handleAddPoints = useCallback((kidId: string, amount: number) => {
    setKids(prev => prev.map(k => 
      k.id === kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints + amount) } : k
    ));
  }, []);

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
    }

    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status } : r
    ));
  }, [requests]);

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
            onAddPoints={handleAddPoints}
            onProcessRequest={handleProcessRequest}
          />
        ) : (
          <KidDashboard 
            kid={activeKid} 
            chores={CHORE_LIBRARY} 
            requests={requests.filter(r => r.kidId === activeKid.id)}
            onCompleteChore={(points) => handleAddPoints(activeKid.id, points)}
            onSubmitRequest={handleSubmitRequest}
          />
        )}
      </main>

      <Navigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;
