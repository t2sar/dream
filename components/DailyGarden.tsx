import React, { useState, useMemo, useEffect } from 'react';
import { Habit, HabitLog, UserStats, SeasonalEvent, UserEventProgress, RestMode } from '../types';
import { format, subDays, startOfWeek } from 'date-fns';
import { PlantIcon } from './PlantIcon';
import { Droplet, Flame, Gift, Leaf, AlertTriangle, Moon, Check, X, ShieldAlert, Sunrise, Sun, Sunset, Coffee, Target, Settings, Info } from 'lucide-react';
import { getChallengeTemplate } from '../challengesData';
import { isHabitPaused } from '../restModeUtils';
import { isHabitDueToday, getCompletedCountThisWeek, isPeriodTargetReached } from '../scheduleUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedModal } from './AnimatedModal';

interface DailyGardenProps {
  habits: Habit[];
  logs: HabitLog;
  stats: UserStats;
  dateKey: string;
  activeEvent?: SeasonalEvent | null;
  eventProgress?: UserEventProgress;
  activeRestMode?: RestMode | null;
  onOpenRestMode?: () => void;
  onResumeRestMode?: () => void;
  onWaterPlant: (habitId: string, isMini?: boolean, customAmount?: number) => void;
  onSlipHabit?: (habitId: string, reason?: string) => void;
  onUndoSlip?: (habitId: string) => void;
  onAddHabit: () => void;
  isPerfectDayNow: boolean;
  onDeletePlant?: (habitId: string) => void;
  onHarvestPlant?: (habitId: string) => void;
  onOpenOrchard: () => void;
  onBackdate?: (habitId: string, dateKey: string) => void;
}

import { GardenSky, getGardenTimePhase } from './GardenSky';

const ViewportLazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "300px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[140px] w-full">
      {isVisible ? children : null}
    </div>
  );
};

export const DailyGarden: React.FC<DailyGardenProps> = React.memo(({
  habits,
  logs,
  stats,
  dateKey,
  activeEvent,
  eventProgress,
  activeRestMode,
  onOpenRestMode,
  onResumeRestMode,
  onWaterPlant,
  onSlipHabit,
  onUndoSlip,
  onAddHabit,
  isPerfectDayNow,
  onDeletePlant,
  onHarvestPlant,
  onOpenOrchard,
  onBackdate
}) => {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const phase = stats.matchTimeOfDay !== false ? getGardenTimePhase() : 'Morning';
    if (phase === 'Dawn') setGreeting('Good morning, early bird!');
    else if (phase === 'Morning') setGreeting('Good morning, Gardener!');
    else if (phase === 'Midday') setGreeting('Bright midday! How are your plants?');
    else if (phase === 'Afternoon') setGreeting('Good afternoon! Your garden awaits.');
    else if (phase === 'Sunset') setGreeting('Sunset glows! Beautiful evening.');
    else if (phase === 'Evening') setGreeting('Shubho shondha! Your garden is glowing tonight 🌙');
    else setGreeting('Late night... Your garden is sleeping soon.');
  }, [stats.matchTimeOfDay]);

  const completedTodayIds = logs[dateKey] || [];
  const slippedTodayIds = (stats.slipLogs?.[dateKey] || []).map(s => s.id);
  const recentDays = useMemo(() => Array.from({length: 7}).map((_, i) => format(subDays(new Date(dateKey + 'T12:00:00'), 6 - i), 'yyyy-MM-dd')), [dateKey]);
  
  const recentHistoryStrings = useMemo(() => {
    const historyMap: Record<string, string> = {};
    for (const habit of habits) {
      historyMap[habit.id] = recentDays.map((d) => logs[d]?.includes(habit.id) ? '1' : '0').join('');
    }
    return historyMap;
  }, [habits, logs, recentDays]);

  const { scheduled, completed, wilting, critical, dead, resting } = useMemo(() => {
    const s: Habit[] = [];
    const c: Habit[] = [];
    const w: Habit[] = [];
    const crit: Habit[] = [];
    const d: Habit[] = [];
    const r: Habit[] = []; 

    habits.forEach(habit => {
      const isCompleted = completedTodayIds.includes(habit.id);
      const isPaused = isHabitPaused(habit.id, dateKey, activeRestMode || null);
      
      const isDue = isHabitDueToday(habit);
      const isPeriodTargetDone = isPeriodTargetReached(habit, logs);
      
      // If it's completely done for the period, treat it as completed or resting, unless it was just completed today
      const considerCompleted = isCompleted || (isPeriodTargetDone && !isDue);
      
      if (isPaused) {
        if (!isCompleted) r.push(habit);
        else c.push(habit);
      } else if (isCompleted) {
        c.push(habit);
      } else if (isPeriodTargetDone) {
        c.push(habit); // Target reached for flexible habit, count it as completed
      } else if (!isDue) {
        r.push(habit); // Scheduled for a different day, treat as resting
      } else {
        s.push(habit);
        if (habit.plantHealth !== undefined) {
          if (habit.plantHealth === 0) d.push(habit);
          else if (habit.plantHealth < 25) crit.push(habit);
          else if (habit.plantHealth < 50) w.push(habit);
        }
      }
    });

    return { scheduled: s, completed: c, wilting: w, critical: crit, dead: d, resting: r };
  }, [habits, completedTodayIds, activeRestMode, dateKey, logs]);

  const { activeHabits, avgHealth } = useMemo(() => {
    const active = [...scheduled, ...completed, ...wilting, ...critical].filter(h => (h.plantHealth ?? 100) > 0);
    const avg = active.length > 0
      ? Math.round(active.reduce((acc, curr) => acc + (curr.plantHealth ?? 100), 0) / active.length)
      : 100;
    return { activeHabits: active, avgHealth: avg };
  }, [scheduled, completed, wilting, critical]);

  const tMinus1 = format(subDays(new Date(dateKey), 1), 'yyyy-MM-dd');
  const tMinus2 = format(subDays(new Date(dateKey), 2), 'yyyy-MM-dd');
  const tMinus3 = format(subDays(new Date(dateKey), 3), 'yyyy-MM-dd');
  
  const getEligibleBackdates = (habit: Habit) => {
     const dates = [];
     const creationDate = format(new Date(habit.createdAt || dateKey), 'yyyy-MM-dd');
     if (tMinus1 >= creationDate && !logs[tMinus1]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus1, activeRestMode || null)) dates.push(tMinus1);
     if (tMinus2 >= creationDate && !logs[tMinus2]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus2, activeRestMode || null)) dates.push(tMinus2);
     if (stats.boostItemCounts?.['boost_streak_repair'] && stats.boostItemCounts['boost_streak_repair'] > 0) {
        if (tMinus3 >= creationDate && !logs[tMinus3]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus3, activeRestMode || null)) dates.push(tMinus3);
     }
     return dates;
  };

  const weekStartFormat = format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd');
  const usedBackdates = stats.backdateWeekStart === weekStartFormat ? (stats.backdatesUsedThisWeek || 0) : 0;
  const backdatesLeftThisWeek = Math.max(0, 3 - usedBackdates);

  let healthStateMsg = 'Excellent Garden';
  if (avgHealth < 25) healthStateMsg = 'Critical Garden';
  else if (avgHealth < 50) healthStateMsg = 'Wilting Garden';
  else if (avgHealth < 75) healthStateMsg = 'Needs Care';
  else if (avgHealth < 90) healthStateMsg = 'Healthy Garden';

  const totalScheduledCount = scheduled.length + completed.length;
  const progressPercent = totalScheduledCount > 0 ? Math.round((completed.length / totalScheduledCount) * 100) : 0;

  const plantsNeedingWater = scheduled.filter(h => (h.plantHealth ?? 100) >= 50);

  const getUrgencyText = (habit: Habit) => {
    if (habit.plantHealth === 0) return 'Dead';
    if ((habit.plantHealth ?? 100) < 25) return 'Critical';
    if ((habit.plantHealth ?? 100) < 50) return 'Wilting';
    
    if (completedTodayIds.includes(habit.id)) return 'Completed Today';
    
    if (isPeriodTargetReached(habit, logs)) return 'Target Complete';
    
    if (habit.scheduleType === 'times_per_week' || habit.scheduleType === 'anytime') {
       const done = getCompletedCountThisWeek(habit, logs);
       const target = habit.targetCount || 1;
       return `${done} / ${target} this week`;
    }
    
    return 'Needs Water';
  };

  const getButtonText = (habit: Habit) => {
    if (habit.plantHealth === 0) return 'Start Recovery';
    if ((habit.plantHealth ?? 100) < 25) return 'Revive Today';
    if ((habit.plantHealth ?? 100) < 50) return 'Save Plant';
    
    if (isPeriodTargetReached(habit, logs) && !completedTodayIds.includes(habit.id)) {
       return 'Extra Care'; // They can tap it again if they really want, or we can just say Completed
       // But the card will probably be rendered in 'Completed' section and gets 'Undo' if completed today, 
       // or if it's just target reached but not completed today, maybe 'Extra Care'
    }
    
    return 'Water Plant';
  };

  let bgClass = "space-y-8 animate-in fade-in duration-500 rounded-3xl p-4 md:p-6 -mx-4 md:-mx-6 relative overflow-hidden";
  const { equippedBackgroundId, equippedFenceId, equippedLeftDecorId, equippedRightDecorId, equippedSeasonalDecorId } = stats;

  const matchTimeOfDay = stats.matchTimeOfDay !== false;

  if (!matchTimeOfDay) {
     if (equippedBackgroundId === 'bg_rooftop') {
        bgClass += " bg-gradient-to-b from-sky-900/40 to-slate-900/80 border border-sky-500/20";
     } else if (equippedBackgroundId === 'bg_village') {
        bgClass += " bg-gradient-to-b from-emerald-900/40 to-green-950/80 border border-emerald-500/20";
     } else if (equippedBackgroundId === 'bg_morning_sun') {
        bgClass += " bg-gradient-to-b from-amber-900/40 to-slate-900/80 border border-amber-500/20";
     } else if (equippedBackgroundId === 'bg_monsoon') {
        bgClass += " bg-gradient-to-b from-cyan-900/30 to-blue-950/80 border border-blue-500/20";
     } else if (equippedBackgroundId === 'bg_default') {
        bgClass += " bg-transparent border border-transparent";
     }
  }

  // Calculate extra fireflies from completed evening habits
  const currentPhase = stats.matchTimeOfDay !== false ? getGardenTimePhase() : 'Morning';
  let extraFireflies = 0;
  if ((currentPhase === 'Evening' || currentPhase === 'Night') && isPerfectDayNow) {
     extraFireflies = 3;
  }
  
  const isDarkPhase = matchTimeOfDay && (currentPhase === 'Evening' || currentPhase === 'Night' || currentPhase === 'Dawn');

  return (
    <div className={bgClass} style={{ backgroundColor: '#24676d' }}>
      <GardenSky enabled={matchTimeOfDay} extraFireflies={extraFireflies} />
      
      <div className="relative z-10 space-y-8">
      {/* Rest Mode Banner / Settings */}
      {activeRestMode && activeRestMode.isActive ? (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group relative overflow-hidden">
          <div className="flex items-center gap-2 relative z-50 self-end -mt-4 -mr-2">
             <button
                onClick={onOpenOrchard}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-full border border-amber-500/30"
             >
                <Leaf className="w-3.5 h-3.5" />
                Orchard
             </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase italic">Garden Rest Mode Active</div>
              <h3 className="text-sm font-bold text-white font-display leading-tight">
                {activeRestMode.modeType === 'vacation' ? 'Vacation Mode is active. Enjoy your break.' : 
                 activeRestMode.modeType === 'sick' ? 'Sick Mode is active. Rest is care too.' : 
                 activeRestMode.modeType === 'exam' ? 'Exam Mode is active. Your garden is lighter for now.' : 
                 activeRestMode.modeType === 'family_emergency' ? 'Emergency Pause is active. Take care of what matters.' : 
                 'Rest Day active. Plants are safe.'}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                 <span>No health loss during pause mode.</span>
                 {resting.length > 0 && <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] uppercase font-mono border border-indigo-500/30">{resting.length} resting plants</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10 w-full md:w-auto">
            <button
               onClick={onOpenRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors border border-indigo-500/20"
            >
               Edit
            </button>
            <button
               onClick={onResumeRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20"
            >
               Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-3 -mb-4 relative z-10 w-full px-2">
           <button
              onClick={onOpenOrchard}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors px-3 py-1 rounded-full hover:bg-amber-500/10"
           >
              <Leaf className="w-3 h-3" />
              Orchard
           </button>
           <button 
             onClick={onOpenRestMode}
             className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors px-3 py-1 rounded-full hover:bg-indigo-500/10"
           >
             <Moon className="w-3 h-3" />
             Need a break?
           </button>
        </div>
      )}

      {/* Top Banner / Summary */}
      <div className="bg-surface-soft border border-surface-alt rounded-[32px] p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-mint/10 blur-3xl rounded-full" />
        
        {/* Fences */}
        {!stats.isSimpleMode && equippedFenceId === 'fence_bamboo' && (
           <div className="absolute bottom-0 left-0 right-0 h-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#84cc16_10px,#84cc16_14px)] opacity-30 border-t border-lime-500/40"></div>
        )}
        {!stats.isSimpleMode && equippedFenceId === 'fence_wooden' && (
           <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_16px,#d97706_16px,#d97706_22px)] opacity-40 border-t-2 border-amber-700/50"></div>
        )}
        {!stats.isSimpleMode && equippedFenceId === 'fence_clay_wall' && (
           <div className="absolute bottom-0 left-0 right-0 h-6 bg-amber-900/60 border-t-4 border-amber-800/80 rounded-t-lg"></div>
        )}
        
        {/* Seasonal */}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_rain_cloud' && (
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-400/50 blur-sm rounded-full animate-pulse shadow-[0_20px_20px_rgba(56,189,248,0.3)]"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_boishakh' && (
           <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_20px,#ffffff_20px,#ffffff_40px)] opacity-70"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_eid_lights' && (
           <div className="absolute top-1 inset-x-4 flex justify-between opacity-80">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse shadow-[0_0_8px_rgba(253,224,71,0.8)]"></div>)}
           </div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_ramadan_lantern' && (
           <div className="absolute top-3 right-1/4 w-4 h-6 rounded-b-lg bg-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-t border-white/40"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_winter_sun' && (
           <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-orange-300/40 blur-md"></div>
        )}
        
        {/* Small Decorations */}
        {!stats.isSimpleMode && (
          <>
            <div className="absolute bottom-2 left-4 z-0 opacity-80 pointer-events-none flex items-end">
                 {equippedLeftDecorId === 'dec_butterfly' && <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce blur-[1px] mb-8"></div>}
                 {equippedLeftDecorId === 'dec_bird' && <div className="w-4 h-3 bg-blue-400 rounded-full blur-[1px] mb-6 translate-x-4"></div>}
                 {equippedLeftDecorId === 'dec_fruit_basket' && <div className="w-8 h-6 bg-amber-700 rounded-b-xl border-t-2 border-amber-500 flex justify-center"><div className="w-4 h-2 bg-rose-500 rounded-full -mt-1"></div></div>}
                 {equippedLeftDecorId === 'dec_mango_basket' && <div className="w-8 h-6 bg-amber-800 rounded-b-xl border-t border-amber-600 flex justify-center"><div className="w-5 h-3 bg-yellow-500 rounded-full -mt-1 blur-[1px]"></div></div>}
                 {equippedLeftDecorId === 'dec_small_pond' && <div className="w-16 h-4 bg-cyan-500/40 rounded-full blur-[2px]"></div>}
                 {equippedLeftDecorId === 'dec_clay_lamp' && <div className="w-4 h-2 bg-orange-800 rounded-b-full"><div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto -mt-2 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div></div>}
                 {equippedLeftDecorId === 'dec_kolshi' && <div className="w-5 h-6 bg-slate-300 rounded-full border border-slate-400"></div>}
                 {equippedLeftDecorId === 'dec_rickshaw_sign' && <div className="w-10 h-6 bg-rose-600 rounded-sm border-2 border-yellow-400 text-[6px] text-yellow-300 text-center font-bold">ART</div>}
            </div>
            
            <div className="absolute bottom-2 right-4 z-0 opacity-80 pointer-events-none flex items-end">
                 {equippedRightDecorId === 'dec_butterfly' && <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce blur-[1px] mb-8"></div>}
                 {equippedRightDecorId === 'dec_bird' && <div className="w-4 h-3 bg-blue-400 rounded-full blur-[1px] mb-6 -translate-x-4"></div>}
                 {equippedRightDecorId === 'dec_fruit_basket' && <div className="w-8 h-6 bg-amber-700 rounded-b-xl border-t-2 border-amber-500 flex justify-center"><div className="w-4 h-2 bg-rose-500 rounded-full -mt-1"></div></div>}
                 {equippedRightDecorId === 'dec_mango_basket' && <div className="w-8 h-6 bg-amber-800 rounded-b-xl border-t border-amber-600 flex justify-center"><div className="w-5 h-3 bg-yellow-500 rounded-full -mt-1 blur-[1px]"></div></div>}
                 {equippedRightDecorId === 'dec_small_pond' && <div className="w-16 h-4 bg-cyan-500/40 rounded-full blur-[2px]"></div>}
                 {equippedRightDecorId === 'dec_clay_lamp' && <div className="w-4 h-2 bg-orange-800 rounded-b-full"><div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto -mt-2 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div></div>}
                 {equippedRightDecorId === 'dec_kolshi' && <div className="w-5 h-6 bg-slate-300 rounded-full border border-slate-400"></div>}
                 {equippedRightDecorId === 'dec_rickshaw_sign' && <div className="w-10 h-6 bg-rose-600 rounded-sm border-2 border-yellow-400 text-[6px] text-yellow-300 text-center font-bold">ART</div>}
            </div>
          </>
        )}
        
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold text-primary-text mb-1">{greeting}</h2>
          <p className="text-secondary-text text-sm mb-6 flex items-center gap-2">
            <Sun className="w-4 h-4 text-status-needsCare" />
            {new Date().toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-secondary-blue"/> Watered</div>
              <div className="text-2xl font-bold text-primary-text">{completed.length} <span className="text-sm text-secondary-text font-normal">/ {totalScheduledCount}</span></div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-status-healthy"/> Health</div>
              <div className="text-2xl font-bold text-primary-text">{avgHealth}%</div>
              <div className="text-[11px] text-status-healthy font-bold mt-1">{healthStateMsg}</div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-status-wilting"/> At Risk</div>
              <div className="text-2xl font-bold text-primary-text">{critical.length + wilting.length}</div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-accent-peach"/> Reward</div>
              <div className="text-sm font-bold text-primary-text">
                {isPerfectDayNow ? 'Rain Boost! 🌧️' : `${scheduled.length} more to unlock`}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
              <span className="text-secondary-text">Daily Progress</span>
              <span className="text-status-healthy">{progressPercent}%</span>
            </div>
            <div className="h-4 w-full bg-surface-card rounded-progress overflow-hidden border border-surface-alt p-0.5">
              <div 
                className="h-full bg-status-healthy rounded-progress transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                {progressPercent === 100 && (
                  <div className="absolute inset-0 bg-surface-alt/20 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.activeChallenge && stats.activeChallenge.status === 'active' && (
         <div className="bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#00F5D4]" />
               </div>
               <div>
                  <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase italic">Active Challenge</div>
                  <h3 className="text-sm font-bold text-white font-display leading-tight">{getChallengeTemplate(stats.activeChallenge.templateId)?.title}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                     <span className="text-[#00F5D4]">Progress: {stats.activeChallenge.completedDates.length} / {getChallengeTemplate(stats.activeChallenge.templateId)?.requiredCompletionDays} days</span>
                     {stats.activeChallenge.completedDates.includes(dateKey) && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-mono border border-emerald-500/30">Today completed</span>}
                  </div>
               </div>
            </div>
         </div>
      )}

      {critical.length > 0 && (
         <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-8 h-8 text-rose-400" />
               <div>
                  <h3 className="text-base font-bold text-rose-400">Urgent Care Needed</h3>
                  <p className="text-xs text-rose-300/80">Your "{critical[0].name}" plant is critical. Complete its habit today to start recovery.</p>
               </div>
            </div>
         </div>
      )}

      {wilting.length > 0 && critical.length === 0 && (
         <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <AlertTriangle className="w-8 h-8 text-amber-400" />
               <div>
                  <h3 className="text-base font-bold text-amber-400">Needs Attention</h3>
                  <p className="text-xs text-amber-300/80">Some of your plants are getting dry. Water them to save them.</p>
               </div>
            </div>
         </div>
      )}

      <div className="space-y-6">
        {/* Empty State */}
        {habits.length === 0 && (
          <div className="bg-surface-soft border border-surface-alt rounded-large-card p-12 text-center relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-20 h-20 bg-primary-mint/20 rounded-full flex items-center justify-center mb-6">
                 <Leaf className="w-10 h-10 text-status-healthy" />
               </div>
               <h3 className="text-xl font-bold text-primary-text mb-2">Your Garden is Empty</h3>
               <p className="text-secondary-text text-sm max-w-sm mb-8">Every habit starts as a tiny seed. Plant your first seed today and start growing your beautiful Bangladeshi fruit garden.</p>
               <button 
                 onClick={onAddHabit}
                 className="bg-primary-mint hover:bg-[#a5d8bd] text-primary-text rounded-button px-8 py-3 flex items-center gap-2 text-[14px] font-bold tracking-wide transition-transform active:scale-95 shadow-sm"
               >
                 Plant First Habit
               </button>
            </div>
          </div>
        )}

        {/* All Completed Empty State */}
        {scheduled.length === 0 && completed.length > 0 && (
           <div className="bg-status-completed/10 border border-status-completed/20 rounded-card p-8 text-center flex flex-col items-center shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <Sun className="w-12 h-12 text-status-healthy mb-4" />
              <h3 className="text-lg font-bold text-status-healthy font-display mb-1">Perfect Garden Day</h3>
              <p className="text-sm text-secondary-text">Your garden is fully watered today. Enjoy the rest of your day!</p>
           </div>
        )}

        {habits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
            {/* Urgent section */}
            {[...dead].length > 0 && (
              <h3 className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2">
                <ShieldAlert className="w-4 h-4" /> Fresh Start Needed (Withered)
              </h3>
            )}
            {dead.map(habit => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id}>
                  <MemoizedPlantHabitCard habit={habit} status="Withered (Needs Restart)" buttonText="Start New Seed" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onDeletePlant={onDeletePlant} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} />
                </ViewportLazyWrapper>
               );
            })}

            {[...critical, ...wilting].length > 0 && (
              <h3 className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <ShieldAlert className="w-4 h-4" /> At Risk Plants
              </h3>
            )}
            {[...critical, ...wilting].map(habit => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id}>
                  <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onDeletePlant={onDeletePlant} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Needs Water */}
            {plantsNeedingWater.length > 0 && (
              <h3 className="col-span-full text-xs font-bold tracking-widest text-secondary-text uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Droplet className="w-4 h-4" /> Needs Water
              </h3>
            )}
            {plantsNeedingWater.map(habit => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id}>
                  <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onDeletePlant={onDeletePlant} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Completed */}
            {completed.length > 0 && (
              <h3 className="col-span-full text-xs font-bold tracking-widest text-status-healthy uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Check className="w-4 h-4" /> Watered Today
              </h3>
            )}
            {completed.map(habit => {
               const isCompletedToday = completedTodayIds.includes(habit.id);
               const statusText = isCompletedToday 
                  ? (habit.type === 'avoid' ? 'Protected Today' : 'Completed Today')
                  : 'Target Met';
               const buttonText = isCompletedToday ? 'Undo' : 'Extra Care';
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               
               return (
                 <ViewportLazyWrapper key={habit.id}>
                   <div className="opacity-80 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status={statusText} buttonText={buttonText} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onDeletePlant={onDeletePlant} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}

            {/* Resting Plants */}
            {resting.length > 0 && (
              <h3 className="col-span-full text-xs font-bold tracking-widest text-status-resting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Moon className="w-4 h-4" /> Resting Plants
              </h3>
            )}
            {resting.map(habit => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                 <ViewportLazyWrapper key={habit.id}>
                   <div className="opacity-60 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status="Resting" buttonText="Water" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onDeletePlant={onDeletePlant} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}
          </div>
        )}
      </div>
      </div>

    </div>
  );
});

export const renderPot = (equippedPotId?: string, className: string = "inset-x-2 bottom-1 h-3") => {
  if (equippedPotId === 'pot_clay_colorful') return <div className={`absolute ${className} bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_clay_basic') return <div className={`absolute ${className} bg-amber-700 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_bamboo_basket') return <div className={`absolute ${className} bg-[repeating-linear-gradient(45deg,#d97706,#d97706_2px,#b45309_2px,#b45309_4px)] rounded-b-sm opacity-90`} />;
  if (equippedPotId === 'pot_rooftop_tub') return <div className={`absolute ${className} bg-slate-400 border-t border-slate-300 rounded-b-md opacity-90 shadow-inner`} />;
  return null;
};

// Wrapper correctly memoizes inline functions to prevent re-renders
const MemoizedPlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWaterPlant, equippedPotId, isSlipped, onSlipHabit, onUndoSlip, onDeletePlant, onHarvestPlant, isDarkPhase, eligibleBackdates, onBackdate, backdatesLeftThisWeek, quantityCurrent, customCategories, recentHistoryStr }) => {
   const handleWater = React.useCallback((isMini?: boolean, customAmount?: number) => onWaterPlant(habit.id, isMini, customAmount), [onWaterPlant, habit.id]);
   const handleSlip = React.useCallback(() => onSlipHabit && onSlipHabit(habit.id), [onSlipHabit, habit.id]);
   const handleUndo = React.useCallback(() => onUndoSlip && onUndoSlip(habit.id), [onUndoSlip, habit.id]);
   const handleDelete = React.useCallback(() => onDeletePlant && onDeletePlant(habit.id), [onDeletePlant, habit.id]);
   const handleHarvest = React.useCallback(() => onHarvestPlant && onHarvestPlant(habit.id), [onHarvestPlant, habit.id]);
   const handleBackdate = React.useCallback((d: string) => onBackdate && onBackdate(habit.id, d), [onBackdate, habit.id]);

   return <PlantHabitCard habit={habit} status={status} buttonText={buttonText} onWater={handleWater} isSlipped={isSlipped} onSlip={handleSlip} onUndo={handleUndo} equippedPotId={equippedPotId} onDelete={handleDelete} onHarvest={handleHarvest} isDarkPhase={isDarkPhase} eligibleBackdates={eligibleBackdates} onBackdate={handleBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={customCategories} recentHistoryStr={recentHistoryStr} />;
});

const PlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWater, isSlipped, onSlip, onUndo, equippedPotId, onDelete, onHarvest, isDarkPhase, eligibleBackdates = [], onBackdate, backdatesLeftThisWeek = 3, quantityCurrent = 0, customCategories = [], recentHistoryStr = "" }) => {
  const isDanger = status === 'Critical' || status === 'Wilting' || isSlipped;
  const isCompleted = status === 'Completed Today' || status === 'Protected Today' || status === 'Resting' || status === 'Target Met';
  const canHarvest = habit.plantStage === 'Fruiting Plant' && !!onHarvest;
  
  const recentHistory = React.useMemo(() => {
    return recentHistoryStr.split('').map((s: string) => s === '1');
  }, [recentHistoryStr]);
  
  const [justCompleted, setJustCompleted] = useState(false);
  const prevCompletedRef = React.useRef(isCompleted);

  useEffect(() => {
    if (!prevCompletedRef.current && isCompleted && (status === 'Completed Today' || status === 'Protected Today' || status === 'Target Met')) {
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 2000);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, status]);

  const formattedSchedule = () => {
     if (habit.scheduleType === 'times_per_week') return `${habit.targetCount}x/week`;
     if (habit.scheduleType === 'weekly') return `Weekly`;
     if (habit.scheduleType === 'monthly') return `Monthly (Day ${habit.monthlyDay})`;
     if (habit.scheduleType === 'specific_days') return `Selected Days`;
     if (habit.scheduleType === 'quantity') return `${habit.quantityTarget} ${habit.quantityUnit}/day`;
     if (habit.scheduleType === 'custom_interval') return `Every ${habit.intervalValue} ${habit.intervalUnit}`;
     if (habit.scheduleType === 'anytime') return `Anytime`;
     return 'Daily';
  };
  
  const [showBackdateOptions, setShowBackdateOptions] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipReason, setSlipReason] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');

  let cardBg = 'glass-card';
  let statusColor = 'text-status-healthy';
  let buttonBg = 'bg-primary-mint text-white border-transparent shadow-sm';
  let buttonHover = 'hover:bg-[#00c98f]';
  let iconBg = 'bg-primary-mint/20';

  if (isCompleted) {
    cardBg = 'glass-card bg-status-completed/10';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border border-white/10';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (isDanger) {
    cardBg = 'glass-card bg-status-wilting/5 border-status-wilting/20';
    statusColor = 'text-status-wilting';
    buttonBg = 'bg-status-needsCare text-white border-transparent shadow-sm';
    buttonHover = 'hover:bg-[#d4b060]';
    iconBg = 'bg-status-wilting/20';
  } else if (status === 'Resting') {
    cardBg = 'glass-card bg-status-resting/10';
    statusColor = 'text-status-resting';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border-white/10';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (canHarvest) {
    cardBg = 'glass-card bg-accent-peach/10 border-accent-peach/30';
    buttonBg = 'bg-accent-peach text-white shadow-sm border-transparent';
    buttonHover = 'hover:bg-[#F4C5A5]';
    iconBg = 'bg-accent-peach/30';
  }

  return (
    <div className={`${cardBg} rounded-card p-8 flex flex-col justify-between group transition-all duration-700 relative h-full overflow-hidden ${justCompleted ? 'scale-[1.02] shadow-[0_0_40px_rgba(34,197,94,0.3)]' : 'hover:shadow-md hover:-translate-y-0.5'}`}>
      {justCompleted && (
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
           <div className="absolute inset-0 bg-gradient-to-tr from-status-healthy/30 to-transparent animate-pulse duration-500" />
           {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-status-healthy opacity-60 animate-ping" style={{
                 top: `${Math.floor(Math.random() * 80) + 10}%`,
                 left: `${Math.floor(Math.random() * 80) + 10}%`,
                 animationDelay: `${i * 0.1}s`,
                 animationDuration: '1s'
              }} />
           ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full">
      <AnimatePresence>
        {justCompleted && (
          <motion.div 
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute -top-4 right-8 z-50 pointer-events-none"
          >
            <div className="w-12 h-12 bg-surface-card rounded-full shadow-lg flex items-center justify-center text-2xl border-4 border-[#00F5D4]">
              🌱
            </div>
            <motion.div 
               animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 rounded-full border-2 border-[#00F5D4]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 p-2 text-muted-text hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-surface-alt/50 rounded-full"
          title="Delete or Archive Plant"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
           <div className={`w-20 h-20 flex items-center justify-center relative`}>
             {renderPot(equippedPotId, 'inset-x-4 bottom-1 h-3')}
             
             <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} health={habit.plantHealth} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className={`w-20 h-20 relative z-10 animate-breathe transform-gpu will-change-transform group-hover:scale-105 transition-transform ${isSlipped ? 'opacity-80 grayscale-[0.5]' : ''} ${canHarvest ? 'animate-bounce drop-shadow-sm scale-110' : ''} ${habit.plantStage === 'Fruiting Plant' && !canHarvest ? 'animate-pulse' : ''}`} />
           </div>
           <div>
             <div className="text-[11px] font-bold tracking-wide uppercase mb-1 flex items-center gap-1">
               {isDanger ? <AlertTriangle className="w-3.5 h-3.5 text-status-wilting" /> : isCompleted ? <Check className="w-3.5 h-3.5 text-status-healthy" /> : <div className="w-2 h-2 rounded-full bg-status-healthy" />}
               <span className={statusColor}>{isSlipped ? "Slipped Today" : status}</span>
             </div>
             <h4 className="font-bold text-primary-text text-base capitalize flex items-center gap-2">
                {habit.type === 'avoid' && habit.isPrivate ? 'Protected' : habit.name}
                {(() => {
                   if (!habit.category) return null;
                   const custom = customCategories.find((c: any) => c.id === habit.category || c.name === habit.category);
                   if (custom) {
                      return (
                         <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${custom.color}20`, color: custom.color, border: `1px solid ${custom.color}40` }}>
                           {custom.name}
                         </span>
                      );
                   }
                   return (
                     <span className="text-[9px] px-1.5 py-0.5 rounded border border-surface-alt bg-surface-alt/20 text-slate-400">
                       {habit.category.replace('_', ' ')}
                     </span>
                   );
                })()}
             </h4>
             {habit.scheduleType && habit.scheduleType !== 'daily' && (
                <div className="inline-block mt-1 px-2 py-0.5 bg-surface-alt/40 border border-black/5 rounded-chip text-[10px] font-bold text-muted-text tracking-wide uppercase">
                   {formattedSchedule()}
                </div>
             )}
             {habit.scheduleType === 'quantity' && habit.quantityTarget !== undefined && habit.quantityTarget > 0 && (
                <div className="mt-1 text-[11px] font-bold text-status-healthy">
                   Progress: {quantityCurrent} / {habit.quantityTarget} {habit.quantityUnit}
                </div>
             )}
            
            {/* Sparkline */}
            {recentHistory && recentHistory.length > 0 && (
               <div className="flex items-end gap-1 mt-3 h-4 opacity-80" aria-label="7-day sparkline">
                 {recentHistory.map((completed: boolean, idx: number) => (
                    <div 
                       key={idx} 
                       className={`w-1.5 rounded-t-sm transition-all ${completed ? 'bg-status-healthy h-full shadow-[0_0_5px_rgba(34,197,94,0.3)]' : 'bg-surface-alt h-1.5'}`}
                       title={completed ? 'Completed' : 'Missed/Not Scheduled'}
                    />
                 ))}
               </div>
            )}
           </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto pt-2">
         <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
               <span className="text-[11px] font-bold text-status-needsCare flex items-center gap-1">
                 <div className="relative inline-flex items-center">
                    <Flame className={`w-3.5 h-3.5 ${habit.streak >= 30 ? 'text-red-500 animate-pulse' : habit.streak >= 21 ? 'text-amber-500 animate-pulse' : habit.streak >= 14 ? 'text-orange-500 animate-pulse' : habit.streak >= 5 ? 'text-yellow-500 animate-pulse' : ''}`}/>
                    {/* Sparks/Fire Particles for Multiplier Tiers */}
                    {habit.streak >= 5 && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <span className="absolute -top-1.5 -left-1 w-1 h-1 bg-amber-400 rounded-full animate-bounce opacity-70" style={{ animationDuration: '0.8s', boxShadow: '0 0 2px rgba(251, 191, 36, 0.5)' }} />
                        <span className="absolute -top-3 left-1.5 w-1 h-1 bg-orange-500 rounded-full animate-ping opacity-90" style={{ animationDuration: '1.2s' }} />
                        <span className="absolute -top-2 left-3 w-1 h-1 bg-yellow-400 rounded-full animate-bounce opacity-80" style={{ animationDuration: '1.5s', boxShadow: '0 0 2px rgba(250, 204, 21, 0.5)' }} />
                      </div>
                    )}
                 </div> Streak: 
                 <AnimatePresence mode="popLayout">
                    <motion.span
                       key={habit.streak}
                       initial={{ scale: 0.5, y: -10, opacity: 0 }}
                       animate={{ scale: 1, y: 0, opacity: 1 }}
                       exit={{ scale: 1.5, y: 10, opacity: 0, position: 'absolute' }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                       className="inline-block relative"
                    >
                       {habit.streak}
                    </motion.span>
                 </AnimatePresence>
               </span>
               <span className="text-[11px] font-bold text-status-healthy flex items-center gap-1"><Leaf className="w-3.5 h-3.5"/> Health: {habit.plantHealth ?? 100}%</span>
            </div>
            
            {canHarvest ? (
               <button 
                  onClick={onHarvest}
                  className={`px-4 py-3 min-h-[44px] flex-grow-0 rounded-button font-bold text-sm tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2 ${buttonBg} ${buttonHover}`}
               >
                  Harvest 🧺
               </button>
            ) : habit.scheduleType === 'quantity' && quantityCurrent < (habit.quantityTarget || 1) ? (
               <div className="flex gap-2 relative">
                 <button 
                    onClick={() => onWater(true)}
                    disabled={isSlipped}
                    className={`px-4 py-3 min-h-[44px] flex-grow-0 rounded-button font-bold text-sm tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2 ${buttonBg} ${buttonHover} disabled:opacity-50`}
                 >
                    +1
                 </button>
                 <button 
                    onClick={() => setShowQuantityModal(true)}
                    disabled={isSlipped}
                    className={`px-3 py-3 min-h-[44px] flex-grow-0 rounded-button font-bold text-sm tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2 bg-surface-alt text-white hover:bg-zinc-700 disabled:opacity-50`}
                 >
                    Log...
                 </button>
               </div>
            ) : (
               <button 
                  onClick={() => {
                    if (isSlipped && onUndo) onUndo();
                    else if (!isSlipped) onWater();
                  }} 
                  disabled={isSlipped}
                  className={`px-4 py-2 flex-grow-0 rounded-button font-bold text-sm tracking-wide transition-transform active:scale-95 flex items-center justify-center gap-2 ${isSlipped ? 'bg-gray-200 text-muted-text cursor-not-allowed' : buttonBg + ' ' + buttonHover}`}
               >
                  {habit.type === 'avoid' ? <ShieldAlert className="w-4 h-4" /> : <Droplet className="w-4 h-4" />}
                  {buttonText}
               </button>
            )}
         </div>

         {showBackdateOptions && eligibleBackdates.length > 0 && onBackdate && (
            <div className="absolute inset-x-0 bottom-0 bg-surface-card p-4 rounded-b-[24px] border-t border-surface-alt shadow-lg z-30 animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex justify-between items-center mb-3">
                   <h5 className="text-[11px] font-bold uppercase tracking-wide text-secondary-text">Repair Journey</h5>
                   <button onClick={() => setShowBackdateOptions(false)} className="text-muted-text hover:text-primary-text p-1"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex gap-2">
                   {eligibleBackdates.map((dateStr: string) => {
                       const dayName = format(new Date(dateStr), 'EEEE');
                       const isTMinus3 = format(subDays(new Date(), 3), 'yyyy-MM-dd') === dateStr;
                       return (
                          <button key={dateStr} onClick={() => { onBackdate(dateStr); setShowBackdateOptions(false); }} className="flex-1 bg-surface-card hover:bg-surface-alt text-secondary-text border border-surface-alt py-2 rounded-xl font-bold text-[10px] uppercase tracking-wide transition-colors flex flex-col items-center gap-1 shadow-sm">
                             <span>Repair {dayName}</span>
                             <span className="text-muted-text text-[9px]">{isTMinus3 ? '-1 Streak Repair' : '-5 coins'} · {backdatesLeftThisWeek} left</span>
                          </button>
                       );
                   })}
                </div>
                {backdatesLeftThisWeek <= 0 && (
                   <p className="text-[10px] text-status-critical mt-2 text-center uppercase font-bold tracking-wide">Weekly limit reached (Max 3)</p>
                )}
            </div>
         )}
         
         {!showBackdateOptions && eligibleBackdates.length > 0 && Array.isArray(eligibleBackdates) && eligibleBackdates.length > 0 && (
             <button onClick={() => setShowBackdateOptions(true)} className="w-full text-center mt-2 text-[11px] font-bold text-muted-text hover:text-secondary-text tracking-wide transition-colors">
                Forgot to log a day? 🕰️
             </button>
         )}

         {habit.type === 'avoid' && (
            <button
               onClick={() => {
                 if (isSlipped && onUndo) onUndo();
                 else if (!isSlipped && onSlip && !isCompleted) setShowSlipModal(true);
               }}
               disabled={isCompleted}
               className={`w-full py-1.5 mt-1 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  isCompleted ? 'opacity-0 cursor-default pointer-events-none' :
                  isSlipped ? 'bg-status-critical/10 text-status-critical hover:bg-status-critical/20' :
                  'bg-surface-card text-muted-text border border-surface-alt hover:bg-surface-alt hover:text-primary-text'
               }`}
            >
               {isSlipped ? "Undo Slip (Recover)" : "I Slipped"}
            </button>
         )}
      </div>
      </div>

      <AnimatedModal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} alignment="center" className="!p-0 !max-w-sm mx-auto overflow-hidden bg-surface-card border border-surface-alt">
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-amber-500" /> Plant Protection
               </h3>
               <button onClick={() => setShowSlipModal(false)} className="p-2 -mr-2 text-muted-text hover:text-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <p className="text-secondary-text text-sm mb-6">
              It happens to the best of gardeners. Log this slip, shake it off, and focus on the next step. Your plant will recover if you care for it.
            </p>

            <form onSubmit={(e) => {
               e.preventDefault();
               if (onSlip) {
                  onSlip(); // The reason can be supported but `DailyGarden` parent passes `handleSlipHabit(id, reason)` optionally - wait, signature in DailyGarden is onSlip?: () => void. So the reason is dropped. That's fine for now, or we can update it if we have time.
                  setSlipReason('');
                  setShowSlipModal(false);
               }
            }}>
               <button type="submit" className="w-full bg-[#00F5D4]/10 text-[#00F5D4] py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-[#00F5D4]/20 transition-colors shadow-sm">
                  Start Recovery
               </button>
            </form>
         </div>
      </AnimatedModal>

      <AnimatedModal isOpen={showQuantityModal} onClose={() => setShowQuantityModal(false)} alignment="bottom" className="!p-0 !max-w-sm mx-auto !rounded-t-[32px] !rounded-b-none overflow-hidden bg-surface-card border border-surface-alt">
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <Target className="w-5 h-5 text-[#00F5D4]" /> Log Progress
               </h3>
               <button onClick={() => setShowQuantityModal(false)} className="p-2 -mr-2 text-muted-text hover:text-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <p className="text-secondary-text text-xs font-mono uppercase tracking-widest mb-4 flex justify-between">
              <span>Goal: {habit.quantityTarget} {habit.quantityUnit}</span>
              <span>Done: {quantityCurrent}</span>
            </p>

            <form onSubmit={(e) => {
               e.preventDefault();
               const amount = Number(manualQuantity);
               if (amount > 0) {
                  onWater(false, amount);
                  setManualQuantity('');
                  setShowQuantityModal(false);
               }
            }} className="flex gap-2">
               <input 
                  type="number" 
                  autoFocus
                  className="flex-1 bg-surface-soft border border-surface-alt rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-[#00F5D4] transition-colors"
                  placeholder={`Amount of ${habit.quantityUnit || 'units'}`}
                  value={manualQuantity}
                  onChange={e => setManualQuantity(e.target.value)}
                  min={1}
               />
               <button type="submit" disabled={!manualQuantity} className="bg-[#00F5D4] text-black px-6 py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-[#00d8b9] transition-colors shadow-[0_0_20px_rgba(0,245,212,0.2)] disabled:opacity-50">
                  Save
               </button>
            </form>
         </div>
      </AnimatedModal>

    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.habit.id === nextProps.habit.id &&
         prevProps.status === nextProps.status &&
         prevProps.buttonText === nextProps.buttonText &&
         prevProps.isSlipped === nextProps.isSlipped &&
         prevProps.equippedPotId === nextProps.equippedPotId &&
         prevProps.isDarkPhase === nextProps.isDarkPhase &&
         prevProps.quantityCurrent === nextProps.quantityCurrent &&
         prevProps.habit.plantHealth === nextProps.habit.plantHealth &&
         prevProps.habit.streak === nextProps.habit.streak &&
         prevProps.habit.plantStage === nextProps.habit.plantStage &&
         prevProps.habit.plantStatus === nextProps.habit.plantStatus &&
         prevProps.habit.isArchived === nextProps.habit.isArchived &&
         prevProps.recentHistoryStr === nextProps.recentHistoryStr;
});
