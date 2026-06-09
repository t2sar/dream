import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart2, Bot, Plus, Calendar, Download, Settings, LogOut, Trophy, Zap, Cloud, CloudOff, Loader2, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged, User } from 'firebase/auth';

import { Habit, HabitLog, Tab, UserStats } from './types';
import { HabitCard } from './components/HabitCard';
import { HabitForm } from './components/HabitForm';
import { ProgressChart } from './components/ProgressChart';
import { Heatmap } from './components/Heatmap';
import { Button } from './components/Button';
import { Login } from './components/Login';

const MOTIVATIONAL_QUOTES = [
  { text: "Consistency is what transforms average into excellence.", author: "Discipline" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "No Zero Days. Even a single 2-minute progress keeps momentum alive.", author: "Habit Protocol" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Focus" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
];

// Firebase Services
import { auth, subscribeToUserData, saveUserData, syncLocalDataToCloud, logout } from './services/firebase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  // App State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRACKER);
  const [showAddForm, setShowAddForm] = useState(false);
  const [date] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Data State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog>({});
  const [dataLoading, setDataLoading] = useState(false);
  
  // Install Prompt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Network Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Auth Listener
  useEffect(() => {
    if (!auth.app) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Migration Check
        const localHabits = localStorage.getItem('t2sar_habits');
        if (localHabits) {
          const parsedHabits = JSON.parse(localHabits);
          const parsedLogs = JSON.parse(localStorage.getItem('t2sar_logs') || '{}');
          await syncLocalDataToCloud(currentUser.uid, parsedHabits, parsedLogs);
          localStorage.removeItem('t2sar_habits');
          localStorage.removeItem('t2sar_logs');
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Sync Listener (Real-time)
  useEffect(() => {
    if (!user) return;
    
    setDataLoading(true);
    const unsubscribe = subscribeToUserData(user.uid, (data) => {
      if (data) {
        setHabits(data.habits || []);
        setLogs(data.logs || {});
      }
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Stats Calculation
  const calculateStats = (): UserStats => {
    const totalHabitsCompleted = (Object.values(logs) as string[][]).reduce((acc, curr) => acc + curr.length, 0);
    const xp = totalHabitsCompleted * 10;
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    return { xp, level, totalHabitsCompleted };
  };

  const stats = calculateStats();

  // 4. Save to Cloud Helper
  const persistData = (newHabits: Habit[], newLogs: HabitLog) => {
    if (user) {
      saveUserData(user.uid, { habits: newHabits, logs: newLogs });
    }
  };

  // 5. Install Prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const dateKey = format(date, 'yyyy-MM-dd');

  // Logic Handlers
  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: uuidv4(),
      streak: 0,
      createdAt: new Date().toISOString()
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    persistData(updatedHabits, logs);
    setShowAddForm(false);
  };

  const deleteHabit = (id: string) => {
    if (confirm('Delete this habit?')) {
      const updatedHabits = habits.filter(h => h.id !== id);
      setHabits(updatedHabits);
      persistData(updatedHabits, logs);
    }
  };

  const toggleHabit = (id: string) => {
    const currentCompleted = logs[dateKey] || [];
    const isCompleted = currentCompleted.includes(id);
    
    let newCompleted;
    if (isCompleted) {
      newCompleted = currentCompleted.filter(hId => hId !== id);
    } else {
      newCompleted = [...currentCompleted, id];
    }

    const newLogs = { ...logs, [dateKey]: newCompleted };
    
    // Optimistic Update locally
    setLogs(newLogs);
    updateStreak(id, !isCompleted, newLogs);
  };

  const updateStreak = (id: string, isNowCompleted: boolean, currentLogs: HabitLog) => {
    const updatedHabits = habits.map(h => {
      if (h.id !== id) return h;
      return {
        ...h,
        streak: isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
      };
    });
    setHabits(updatedHabits);
    persistData(updatedHabits, currentLogs);
  };

  // -- Render Logic --

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-28 transition-all bg-[#09090B] selection:bg-amber-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Sync Status Indicator (Absolute Top Right) */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
         {!isOnline ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-pulse">
                <WifiOff className="w-3 h-3" />
                Offline
            </div>
         ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-1000 opacity-50 hover:opacity-100">
                <Cloud className="w-3 h-3" />
                Synced
            </div>
         )}
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-card rounded-2xl z-50 flex justify-between items-center px-8 text-xs font-medium text-slate-500 shadow-2xl shadow-black/50 overflow-x-auto gap-4">
        <button onClick={() => setActiveTab(Tab.TRACKER)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.TRACKER ? 'text-amber-500 scale-110' : 'hover:text-slate-300'}`}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab(Tab.PROGRESS)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.PROGRESS ? 'text-amber-500 scale-110' : 'hover:text-slate-300'}`}>
          <BarChart2 className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab(Tab.SETTINGS)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SETTINGS ? 'text-amber-500 scale-110' : 'hover:text-slate-300'}`}>
          <Settings className="w-6 h-6" />
        </button>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-28 glass border-r border-white/5 flex-col items-center py-12 z-50">
        <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 rounded-2xl flex items-center justify-center mb-16 shadow-[0_0_20px_rgba(219,39,119,0.4)] rotate-3 hover:rotate-12 transition-transform duration-500">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex flex-col gap-10 w-full px-4">
           {[
             { id: Tab.TRACKER, icon: LayoutDashboard },
             { id: Tab.PROGRESS, icon: BarChart2 },
             { id: Tab.SETTINGS, icon: Settings },
           ].map(item => (
             <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${activeTab === item.id ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
           ))}
        </div>

        {deferredPrompt && (
          <div className="mt-auto mb-4 w-full px-4">
            <button onClick={handleInstallClick} className="w-full aspect-square flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors rounded-2xl hover:bg-emerald-500/10">
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto p-6 md:p-16">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-500 to-amber-400 bg-300% animate-gradient">
                {activeTab === Tab.TRACKER && `Hello, ${user.displayName?.split(' ')[0] || 'Dreamer'}`}
                {activeTab === Tab.PROGRESS && 'Progress'}
                {activeTab === Tab.SETTINGS && 'Settings'}
              </h1>
              {activeTab === Tab.TRACKER && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <Trophy className="w-3 h-3" />
                  Lvl {stats.level}
                </div>
              )}
            </div>
            
            {/* XP Bar */}
            {activeTab === Tab.TRACKER && (
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-semibold">
                   <span>Experience</span>
                   <span className="text-amber-550">{stats.xp} XP</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    style={{ width: `${Math.min(100, (stats.xp % 100))}%` }} 
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === Tab.TRACKER && (
               <button 
               onClick={() => setShowAddForm(true)}
               className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 rounded-2xl p-4 md:px-8 md:py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 active:scale-95"
             >
               <Plus className="w-6 h-6" strokeWidth={3} />
               <span className="hidden md:inline font-bold tracking-wide">New Habit</span>
             </button>
            )}
          </div>
        </header>

        {dataLoading ? (
           <div className="flex items-center justify-center h-64">
             <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
           </div>
        ) : (
          <>
            {activeTab === Tab.TRACKER && (
              <div className="space-y-8">
                {/* Dynamic Motivational Quote Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/15 flex gap-5 items-center backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-zinc-950 shrink-0 shadow-lg shadow-amber-500/20">
                     <Zap className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                     <p className="text-sm font-medium italic text-slate-200">
                       "{quote.text}"
                     </p>
                     <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1.5">
                       — {quote.author}
                     </p>
                  </div>
                </div>

                {showAddForm && (
                  <HabitForm onAdd={handleAddHabit} onCancel={() => setShowAddForm(false)} />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {habits.length === 0 ? (
                    <div className="col-span-full text-center py-24 glass rounded-3xl border-dashed border-white/10">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Calendar className="w-10 h-10 text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Begin your journey</h3>
                      <p className="text-slate-500 max-w-sm mx-auto font-light">Add your first seed.</p>
                    </div>
                  ) : (
                    habits.map(habit => (
                      <HabitCard 
                        key={habit.id}
                        habit={habit}
                        isCompleted={(logs[dateKey] || []).includes(habit.id)}
                        onToggle={toggleHabit}
                        onDelete={deleteHabit}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === Tab.PROGRESS && (
              <div className="space-y-8">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="glass p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-2">
                           <Zap className="w-4 h-4 text-amber-500" />
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">{stats.totalHabitsCompleted}</span>
                    </div>
                     <div className="glass p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-2">
                           <Trophy className="w-4 h-4 text-amber-500" />
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">{stats.level}</span>
                    </div>
                 </div>
                 
                 <Heatmap logs={logs} />
                 <ProgressChart logs={logs} habits={habits} />
              </div>
            )}



            {activeTab === Tab.SETTINGS && (
                <div className="space-y-8">
                    <div className="glass p-10 rounded-3xl">
                        <div className="flex items-center gap-6 mb-8">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-14 h-14 rounded-2xl border border-amber-500/20" />
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <Cloud className="w-7 h-7 text-amber-500" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
                                <p className="text-slate-400 font-light">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-emerald-400 text-sm font-medium bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10 mb-6">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                            {isOnline ? 'Cloud Sync Active' : 'Offline Mode (Changes queued)'}
                        </div>

                        <Button onClick={() => logout()} variant="danger" className="w-full md:w-auto px-8">
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="glass p-8 rounded-3xl">
                         <h2 className="text-lg font-bold text-white mb-4">About t2sar dream</h2>
                         <p className="text-slate-400 text-sm">
                           Version 3.1<br/>
                           Your data is backed up to Google Cloud. 
                           Install on Android for a native experience.
                         </p>
                    </div>
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;