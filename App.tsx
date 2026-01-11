
import React, { useState, useEffect, useCallback } from 'react';
import { Kid, PurchaseRequest, RequestStatus, Transaction, SyncSettings } from './types';
import { INITIAL_KIDS } from './constants';
import KidDashboard from './components/KidDashboard';
import ParentDashboard from './components/ParentDashboard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [view, setView] = useState<'kid' | 'parent'>('parent');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const STORAGE_KEYS = {
    KIDS: 'kp_kids_v3',
    REQUESTS: 'kp_requests_v3',
    TXS: 'kp_transactions_v3',
    SETTINGS: 'kp_settings_v3'
  };

  const [syncSettings, setSyncSettings] = useState<SyncSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : { 
      googleSheetUrl: '', 
      lastSynced: null, 
      familyId: Math.random().toString(36).substr(2, 6).toUpperCase() 
    };
  });

  const [kids, setKids] = useState<Kid[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KIDS);
    return saved ? JSON.parse(saved) : INITIAL_KIDS;
  });

  const [requests, setRequests] = useState<PurchaseRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TXS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeKidId, setActiveKidId] = useState<string>('1');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KIDS, JSON.stringify(kids));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(syncSettings));
  }, [kids, requests, transactions, syncSettings]);

  /**
   * PULL DATA
   * Note: Google Apps Script redirects can cause 'Failed to fetch'.
   * We use redirect: 'follow' to handle the transition from script.google.com to googleusercontent.com
   */
  const pullRemoteData = useCallback(async () => {
    if (!syncSettings.googleSheetUrl || !syncSettings.googleSheetUrl.startsWith('http')) return;
    
    setIsSyncing(true);
    try {
      const url = new URL(syncSettings.googleSheetUrl);
      url.searchParams.append('familyId', syncSettings.familyId);
      url.searchParams.append('t', Date.now().toString()); // Cache busting

      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data && typeof data === 'object') {
        if (data.kids) setKids(data.kids);
        if (data.requests) setRequests(data.requests);
        if (data.transactions) setTransactions(data.transactions);
        setSyncSettings(prev => ({ ...prev, lastSynced: Date.now() }));
      }
    } catch (e) {
      console.warn("Sync Pull Encountered an Issue. This is common if the script isn't published as 'Anyone' or is still deploying.", e);
    } finally {
      setIsSyncing(false);
    }
  }, [syncSettings.googleSheetUrl, syncSettings.familyId]);

  /**
   * PUSH DATA
   * mode: 'no-cors' is used because Google Apps Script doesn't return CORS headers on POST.
   * This means we can't read the response, but the data still gets there.
   */
  const pushRemoteData = useCallback(async (currentKids: Kid[], currentRequests: PurchaseRequest[], currentTxs: Transaction[]) => {
    if (!syncSettings.googleSheetUrl || !syncSettings.googleSheetUrl.startsWith('http')) return;
    
    setIsSyncing(true);
    try {
      await fetch(syncSettings.googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: syncSettings.familyId,
          kids: currentKids,
          requests: currentRequests,
          transactions: currentTxs
        })
      });
      setSyncSettings(prev => ({ ...prev, lastSynced: Date.now() }));
    } catch (e) {
      console.error("Sync Push Failed", e);
    } finally {
      setIsSyncing(false);
    }
  }, [syncSettings.googleSheetUrl, syncSettings.familyId]);

  useEffect(() => {
    setIsLoaded(true);
    pullRemoteData();
    const interval = setInterval(pullRemoteData, 60000); // Check for updates every minute
    return () => clearInterval(interval);
  }, [pullRemoteData]);

  const addTransaction = useCallback((kidId: string, description: string, amount: number) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      kidId,
      description,
      amount,
      timestamp: Date.now(),
      type: amount >= 0 ? 'gain' : 'loss'
    };
    setTransactions(prev => {
      const next = [newTx, ...prev];
      // Note: We use functional updates to ensure we have the latest state for push
      setKids(currentKids => {
        setRequests(currentReqs => {
          pushRemoteData(currentKids, currentReqs, next);
          return currentReqs;
        });
        return currentKids;
      });
      return next;
    });
  }, [pushRemoteData]);

  const handleAddPoints = useCallback((kidId: string, amount: number, reason: string) => {
    setKids(prev => {
      const next = prev.map(k => 
        k.id === kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints + amount) } : k
      );
      addTransaction(kidId, reason, amount);
      return next;
    });
  }, [addTransaction]);

  const handleSubmitRequest = useCallback((request: Omit<PurchaseRequest, 'id' | 'status' | 'timestamp'>) => {
    const newRequest: PurchaseRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.SUBMITTED,
      timestamp: Date.now()
    };
    setRequests(prev => {
      const next = [newRequest, ...prev];
      pushRemoteData(kids, next, transactions);
      return next;
    });
  }, [kids, transactions, pushRemoteData]);

  const handleProcessRequest = useCallback((requestId: string, status: RequestStatus) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    let updatedKids = kids;
    if (status === RequestStatus.APPROVED) {
      updatedKids = kids.map(k => 
        k.id === request.kidId ? { ...k, totalPoints: Math.max(0, k.totalPoints - request.pointCost) } : k
      );
      setKids(updatedKids);
      addTransaction(request.kidId, `Approved Goal: ${request.itemName}`, -request.pointCost);
    }

    setRequests(prev => {
      const next = prev.map(r => r.id === requestId ? { ...r, status } : r);
      pushRemoteData(updatedKids, next, transactions);
      return next;
    });
  }, [kids, requests, transactions, addTransaction, pushRemoteData]);

  if (!isLoaded) return null;

  const activeKid = kids.find(k => k.id === activeKidId) || kids[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 kid-gradient rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm">K</div>
            <h1 className="font-black text-lg text-slate-800 tracking-tighter flex items-center gap-2">
              KidPoint
              {isSyncing && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </h1>
          </div>
          {view === 'kid' && (
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
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
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {view === 'parent' ? (
          <ParentDashboard 
            kids={kids}
            requests={requests}
            transactions={transactions}
            syncSettings={syncSettings}
            onAddPoints={handleAddPoints}
            onProcessRequest={handleProcessRequest}
            onUpdateSyncSettings={setSyncSettings}
            onManualSync={pullRemoteData}
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
