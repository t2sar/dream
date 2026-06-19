import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, syncLocalDataToCloud } from '../services/firebase';
import { Habit, HabitLog, UserStats, RestMode } from '../types';
import { Button } from './Button';
import { RefreshCw, Database, CloudOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  user: User | null;
  habits: Habit[];
  logs: HabitLog;
  extraStats: Partial<UserStats>;
  activeRestMode: RestMode | null;
}

export const DataDiagnosticPanel: React.FC<Props> = ({ 
  user, habits, logs, extraStats, activeRestMode 
}) => {
  const [remoteState, setRemoteState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRemoteData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setRemoteState(snapshot.data());
      } else {
        setRemoteState({ notFound: true });
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch remote state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRemoteData();
    }
  }, [user]);

  const handleForceSync = async () => {
    if (!user) return;
    setSyncing(true);
    setError(null);
    try {
      // Intentionally pass a future timestamp to force overwrite
      await syncLocalDataToCloud(
        user.uid, 
        habits, 
        logs, 
        extraStats, 
        activeRestMode, 
        Date.now() + 5000 
      );
      await fetchRemoteData(); // Refresh panel
    } catch (e: any) {
      setError(e.message || "Force sync failed");
    } finally {
      setSyncing(false);
    }
  };

  if (!user) return null;

  const localHabitsCount = habits.length;
  const remoteHabitsCount = remoteState && !remoteState.notFound && remoteState.habits ? remoteState.habits.length : 0;
  
  const inSync = remoteState && !remoteState.notFound && localHabitsCount === remoteHabitsCount; // naive check

  return (
    <div className="glass p-6 rounded-none border border-surface-alt relative mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-sky-400" />
        <h2 className="text-sm font-mono uppercase tracking-widest text-sky-400">
          Data Integrity Diagnostic
        </h2>
      </div>

      <p className="text-slate-400 font-mono text-[10px] leading-relaxed uppercase tracking-wider mb-6">
        Compare local browser state with Cloud Firestore document. Use this if you experience missing data upon logging out.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-surface-alt/5 border border-surface-alt">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            Local Browser <div className="w-2 h-2 rounded-full bg-emerald-400 ml-auto animate-pulse" />
          </h3>
          <p className="text-2xl font-display font-bold text-primary-text">{localHabitsCount} Habits</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wide">
            Logs: {Object.keys(logs).length}
          </p>
        </div>

        <div className="p-4 bg-surface-alt/5 border border-surface-alt relative">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            Cloud Remote
            {loading ? (
              <RefreshCw className="w-3 h-3 ml-auto animate-spin" />
            ) : remoteState?.notFound ? (
              <CloudOff className="w-3 h-3 ml-auto text-rose-400" />
            ) : inSync ? (
              <CheckCircle2 className="w-3 h-3 ml-auto text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 ml-auto text-amber-400" />
            )}
          </h3>
          {remoteState?.notFound ? (
            <p className="text-sm font-mono text-rose-400">No Document</p>
          ) : (
            <>
              <p className="text-2xl font-display font-bold text-primary-text">{remoteHabitsCount} Habits</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wide">
                Updated: {remoteState?.lastUpdated ? new Date(remoteState.lastUpdated).toLocaleTimeString() : 'Unknown'}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleForceSync}
          disabled={syncing}
          variant="primary"
          className="flex-1 py-3 text-xs font-mono tracking-widest uppercase rounded-none transition-all flex items-center justify-center gap-2"
        >
          {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {syncing ? 'Syncing...' : 'Force Local to Cloud Sync'}
        </Button>
        <Button
          onClick={fetchRemoteData}
          disabled={loading}
          variant="secondary"
          className="py-3 px-4 text-xs font-mono uppercase bg-transparent hover:bg-surface-alt/20 border border-surface-alt rounded-none"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
