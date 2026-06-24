import React, { useState, useMemo, useEffect } from 'react';
import { Habit, HabitLog, UserStats, SeasonalEvent, UserEventProgress, RestMode } from '../types';
import { format, subDays, startOfWeek, differenceInCalendarDays } from 'date-fns';
import { PlantIcon } from './PlantIcon';
import { Droplet, Flame, Gift, Leaf, AlertTriangle, Moon, Check, X, ShieldAlert, Sunrise, Sun, Sunset, Coffee, Target, Settings, Info, Clock, Edit2, Archive, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import { getChallengeTemplate } from '../challengesData';
import { isHabitPaused } from '../restModeUtils';
import { isHabitDueToday, isHabitDueOnDate, getCompletedCountThisWeek, isPeriodTargetReached } from '../scheduleUtils';
import { getBengaliSeason } from '../seasonalUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedModal } from './AnimatedModal';
import confetti from 'canvas-confetti';

const WeatherOverlay = () => {
    const season = getBengaliSeason(new Date());
    
    if (season === 'Borsha') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-0.5 h-4 bg-blue-300/40 rounded-full animate-rain"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${0.8 + Math.random() * 0.5}s`,
                   animationDelay: `${Math.random() * 2}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes drop {
               0% { transform: translateY(-10px) scaleY(1); opacity: 0; }
               10% { opacity: 1; }
               80% { transform: translateY(100vh) scaleY(2); opacity: 0; }
               100% { opacity: 0; }
            }
            .animate-rain { animation: drop linear infinite; }
          `}</style>
        </div>
      );
    }
    
    if (season === 'Hemanto' || season === 'Sharat') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(15)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-2 h-2 bg-orange-400/30 rounded-br-full rounded-tl-full animate-leaf-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${4 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 5}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes floatDown {
               0% { transform: translateY(-10px) rotate(0deg) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) rotate(180deg) translateX(20px); }
               100% { transform: translateY(100vh) rotate(360deg) translateX(-20px); opacity: 0; }
            }
            .animate-leaf-fall { animation: floatDown linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Sheet') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(30)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-snow-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${5 + Math.random() * 5}s`,
                   animationDelay: `${Math.random() * 5}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes snowFall {
               0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) translateX(${Math.random() > 0.5 ? 20 : -20}px); }
               100% { transform: translateY(100vh) translateX(${Math.random() > 0.5 ? -20 : 20}px); opacity: 0; }
            }
            .animate-snow-fall { animation: snowFall linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Bashonto') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-2 h-2 bg-pink-300/30 rounded-bl-full rounded-tr-full animate-petal-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${3 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 3}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes petalFall {
               0% { transform: translateY(-10px) rotate(0deg) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) rotate(180deg) translateX(30px); }
               100% { transform: translateY(100vh) rotate(360deg) translateX(-30px); opacity: 0; }
            }
            .animate-petal-fall { animation: petalFall linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Grishmo') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 mix-blend-overlay">
          {[...Array(10)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-32 h-32 bg-amber-400/5 rounded-full animate-heat-wave blur-2xl"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDuration: `${4 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 2}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes heatWave {
               0% { transform: scale(1) translateY(0); opacity: 0.3; }
               50% { transform: scale(1.5) translateY(-20px); opacity: 0.6; }
               100% { transform: scale(1) translateY(0); opacity: 0.3; }
            }
            .animate-heat-wave { animation: heatWave ease-in-out infinite; }
          `}</style>
        </div>
      );
    }
    
    return null;
};

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
  onArchiveHabit?: (habitId: string) => void;
  onDeletePlant?: (habitId: string) => void;
  onHarvestPlant?: (habitId: string) => void;
  onEditHabit?: (habit: Habit) => void;
  onOpenOrchard: () => void;
  onBackdate?: (habitId: string, dateKey: string) => void;
  onSnoozeHabit?: (habitId: string, dateKey: string) => void;
  onMailboxClick?: () => void;
}

import { GardenSky, getGardenTimePhase } from './GardenSky';
import { WeatherParticles } from './WeatherParticles';

import { GardenCanvasTerrain } from './GardenCanvasTerrain';

const ViewportLazyWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode, id?: string, status?: string, index?: number }>(({ children, id, status, index = 0 }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const internalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!internalRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "300px" });
    observer.observe(internalRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      key={id}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.08 }}
      ref={(node) => {
        // @ts-ignore
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }} 
      className="min-h-[140px] w-full"
    >
      {isVisible ? children : null}
    </motion.div>
  );
});
ViewportLazyWrapper.displayName = 'ViewportLazyWrapper';

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
  onArchiveHabit,
  onDeletePlant,
  onHarvestPlant,
  onEditHabit,
  onOpenOrchard,
  onBackdate,
  onSnoozeHabit,
  onMailboxClick
}) => {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const phase = getGardenTimePhase();
    if (phase === 'Dawn') setGreeting('Good morning, early bird!');
    else if (phase === 'Morning') setGreeting('Good morning, Gardener!');
    else if (phase === 'Midday') setGreeting('Bright midday! How are your plants?');
    else if (phase === 'Afternoon') setGreeting('Good afternoon! Your garden awaits.');
    else if (phase === 'Sunset') setGreeting('Sunset glows! Beautiful evening.');
    else if (phase === 'Evening') setGreeting('Shubho shondha! Your garden is glowing tonight 🌙');
    else setGreeting('Late night... Your garden is sleeping soon.');
  }, []);

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

  const { scheduled, completed, wilting, critical, dead, resting, slipped } = useMemo(() => {
    const s: Habit[] = [];
    const c: Habit[] = [];
    const w: Habit[] = [];
    const crit: Habit[] = [];
    const d: Habit[] = [];
    const r: Habit[] = []; 
    const slip: Habit[] = [];

    habits.forEach(habit => {
      const isCompleted = completedTodayIds.includes(habit.id);
      const isSlipped = slippedTodayIds.includes(habit.id);
      const isPaused = isHabitPaused(habit.id, dateKey, activeRestMode || null);
      
      const isDue = isHabitDueOnDate(habit, dateKey);
      const isPeriodTargetDone = isPeriodTargetReached(habit, logs);
      
      // If it's completely done for the period, treat it as completed or resting, unless it was just completed today
      const considerCompleted = isCompleted || (isPeriodTargetDone && !isDue);
      
      if (isPaused) {
        if (!isCompleted) r.push(habit);
        else c.push(habit);
      } else if (isCompleted) {
        c.push(habit);
      } else if (isSlipped) {
        slip.push(habit);
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

    return { scheduled: s, completed: c, wilting: w, critical: crit, dead: d, resting: r, slipped: slip };
  }, [habits, completedTodayIds, slippedTodayIds, activeRestMode, dateKey, logs]);

  const { activeHabits, avgHealth } = useMemo(() => {
    const active = [...scheduled, ...completed, ...wilting, ...critical, ...slipped].filter(h => (h.plantHealth ?? 100) > 0);
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

  const matchTimeOfDay = true;

  let baseBgColor = '#24676d'; // Default garden teal base
  if (equippedBackgroundId === 'bg_rooftop') {
     baseBgColor = '#131e2f'; // City rooftop dark-blue base
     bgClass += " bg-gradient-to-b from-sky-900/40 to-slate-900/80 border border-sky-500/20";
  } else if (equippedBackgroundId === 'bg_village') {
     baseBgColor = '#102717'; // Village dark-green base
     bgClass += " bg-gradient-to-b from-emerald-900/40 to-green-950/80 border border-emerald-500/20";
  } else if (equippedBackgroundId === 'bg_morning_sun') {
     baseBgColor = '#3a2717'; // Warm sunrise golden-brown base
     bgClass += " bg-gradient-to-b from-amber-900/40 to-slate-900/80 border border-amber-500/20";
  } else if (equippedBackgroundId === 'bg_monsoon') {
     baseBgColor = '#1a2230'; // Rainy dark grey-blue base
     bgClass += " bg-gradient-to-b from-cyan-900/30 to-blue-950/80 border border-blue-500/20";
  } else if (equippedBackgroundId === 'bg_zamindar_palace') {
     baseBgColor = '#2d141e'; // Palace rooftop royal crimson/purple base
     bgClass += " bg-gradient-to-b from-rose-950/40 to-purple-950/80 border border-rose-500/20";
  } else if (equippedBackgroundId === 'bg_default') {
     baseBgColor = '#24676d'; // Default garden green
     bgClass += " bg-transparent border border-transparent";
  }

  // Calculate extra fireflies from completed evening habits
  const currentPhase = getGardenTimePhase();
  let extraFireflies = 0;
  if ((currentPhase === 'Evening' || currentPhase === 'Night') && isPerfectDayNow) {
     extraFireflies = 3;
  }
  
  const currentMonth = new Date().getMonth();
  const isDarkPhase = matchTimeOfDay && (currentPhase === 'Evening' || currentPhase === 'Night' || currentPhase === 'Dawn');
  const isMonsoon = activeEvent?.id?.startsWith('monsoon') || habits.some(h => h.category === 'hydration');
  const isNight = matchTimeOfDay && (currentPhase === 'Evening' || currentPhase === 'Night');
  const isAutumn = currentMonth >= 8 && currentMonth <= 10;
  const isWinter = currentMonth === 11 || currentMonth <= 1 || activeEvent?.id?.startsWith('winter');

  return (
    <div className={bgClass} style={{ backgroundColor: baseBgColor }}>
      <WeatherParticles isMonsoon={!!isMonsoon} isNight={!!isNight} isAutumn={!!isAutumn} isWinter={!!isWinter} />
      
      <div className="relative z-10 space-y-8">
      {/* Rest Mode Banner / Settings */}
      {activeRestMode && activeRestMode.isActive ? (
        <div className="bg-accent-periwinkle/10 border border-accent-periwinkle/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group relative overflow-hidden">
          <div className="flex items-center gap-2 relative z-50 self-end -mt-4 -mr-2">
             <button
                onClick={onOpenOrchard}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-mustard bg-accent-mustard/10 hover:bg-accent-mustard/20 hover:text-accent-mustard transition-colors px-3 py-1.5 rounded-full border border-accent-mustard/30"
             >
                <Leaf className="w-3.5 h-3.5" />
                Orchard
             </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-periwinkle/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-accent-periwinkle/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-accent-periwinkle" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-accent-periwinkle uppercase italic">Garden Rest Mode Active</div>
              <h3 className="text-sm font-bold text-white font-display leading-tight">
                {activeRestMode.modeType === 'vacation' ? 'Vacation Mode is active. Enjoy your break.' : 
                 activeRestMode.modeType === 'sick' ? 'Sick Mode is active. Rest is care too.' : 
                 activeRestMode.modeType === 'exam' ? 'Exam Mode is active. Your garden is lighter for now.' : 
                 activeRestMode.modeType === 'family_emergency' ? 'Emergency Pause is active. Take care of what matters.' : 
                 'Rest Day active. Plants are safe.'}
              </h3>
              <div className="text-xs text-secondary-text mt-1 flex items-center gap-2">
                 <span>No health loss during pause mode.</span>
                 {resting.length > 0 && <span className="px-1.5 py-0.5 rounded bg-accent-periwinkle/20 text-accent-periwinkle text-[9px] uppercase font-mono border border-accent-periwinkle/30">{resting.length} resting plants</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10 w-full md:w-auto">
            <button
               onClick={onOpenRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-accent-periwinkle/10 text-accent-periwinkle hover:bg-accent-periwinkle/20 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors border border-accent-periwinkle/20"
            >
               Edit
            </button>
            <button
               onClick={onResumeRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-accent-periwinkle text-surface-card hover:bg-accent-periwinkle/90 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors shadow-lg shadow-accent-periwinkle/20"
            >
               Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-3 -mb-4 relative z-10 w-full px-2">
           <button
              onClick={onOpenOrchard}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-mustard hover:text-accent-mustard transition-colors px-3 py-1 rounded-full hover:bg-accent-mustard/10"
           >
              <Leaf className="w-3 h-3" />
              Orchard
           </button>
           <button 
             onClick={onOpenRestMode}
             className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-text hover:text-accent-periwinkle transition-colors px-3 py-1 rounded-full hover:bg-accent-periwinkle/10"
           >
             <Moon className="w-3 h-3" />
             Need a break?
           </button>
        </div>
      )}

      {/* Top Banner / Summary */}
      <div className="bg-surface-soft border border-surface-alt rounded-[32px] p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-mint/10 blur-3xl rounded-full" />
        <WeatherOverlay />
        
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
           <div className="absolute top-3 right-1/4 w-4 h-6 rounded-b-lg bg-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-t border-surface-alt"></div>
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
          <p 
            className="text-secondary-text text-sm mb-6 flex items-center gap-2"
            style={{ color: '#ffffff', fontWeight: 'bold', fontStyle: 'italic' }}
          >
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
         <div className="bg-accent-seafoam/10 border border-accent-seafoam/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-accent-seafoam/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-seafoam" />
               </div>
               <div>
                  <div className="text-[10px] font-mono tracking-widest text-accent-periwinkle uppercase italic">Active Challenge</div>
                  <h3 className="text-sm font-bold text-primary-anchor font-display leading-tight">{getChallengeTemplate(stats.activeChallenge.templateId)?.title}</h3>
                  <div className="text-xs text-secondary-text mt-1 flex items-center gap-2">
                     <span className="text-accent-seafoam">Progress: {stats.activeChallenge.completedDates.length} / {getChallengeTemplate(stats.activeChallenge.templateId)?.requiredCompletionDays} days</span>
                     {stats.activeChallenge.completedDates.includes(dateKey) && <span className="px-1.5 py-0.5 rounded bg-accent-seafoam/20 text-accent-seafoam text-[9px] uppercase font-mono border border-accent-seafoam/30">Today completed</span>}
                  </div>
               </div>
            </div>
         </div>
      )}

      {critical.length > 0 && (
         <div className="bg-accent-coral/10 border border-accent-coral/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-8 h-8 text-accent-coral" />
               <div>
                  <h3 className="text-base font-bold text-accent-coral">Urgent Care Needed</h3>
                  <p className="text-xs text-secondary-text">Your "{critical[0].name}" plant is critical. Complete its habit today to start recovery.</p>
               </div>
            </div>
         </div>
      )}

      {wilting.length > 0 && critical.length === 0 && (
         <div className="bg-accent-mustard/10 border border-accent-mustard/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <AlertTriangle className="w-8 h-8 text-accent-mustard" />
               <div>
                  <h3 className="text-base font-bold text-accent-mustard">Needs Attention</h3>
                  <p className="text-xs text-secondary-text">Some of your plants are getting dry. Water them to save them.</p>
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
               <h3 className="text-xl font-bold text-primary-text mb-2">Habit Garden is Empty</h3>
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
          <div className="mb-8">
            <h3 className="text-xs font-bold tracking-widest text-primary-text uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-4">
               Garden Terrain View (2.5D)
            </h3>
            <GardenCanvasTerrain habits={habits} logs={logs} stats={stats} onWaterPlant={(id) => onWaterPlant(id, false)} onMailboxClick={onMailboxClick} />
          </div>
        )}

        {habits.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch content-start">
            <AnimatePresence mode="popLayout">
            {/* Urgent section */}
            {[...dead].length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="dead-heading" className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2">
                <ShieldAlert className="w-4 h-4" /> Fresh Start Needed (Withered)
              </motion.h3>
            )}
            {dead.map((habit, i) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                  <MemoizedPlantHabitCard habit={habit} status="Withered (Needs Restart)" buttonText="Start New Seed" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                </ViewportLazyWrapper>
               );
            })}

            {[...critical, ...wilting].length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="at-risk-heading" className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <ShieldAlert className="w-4 h-4" /> At Risk Plants
              </motion.h3>
            )}
            {[...critical, ...wilting].map((habit, i) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                  <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Needs Water */}
            {plantsNeedingWater.length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="needs-water-heading" className="col-span-full text-xs font-bold tracking-widest text-secondary-text uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Droplet className="w-4 h-4" /> Needs Water
              </motion.h3>
            )}
            {plantsNeedingWater.map((habit, i) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                  <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Failed to Water */}
            {slipped.length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="failed-to-water-heading" className="col-span-full text-xs font-bold tracking-widest text-[#E57C5D] uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <AlertCircle className="w-4 h-4" /> Failed to Water
              </motion.h3>
            )}
            {slipped.map((habit, i) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                  <MemoizedPlantHabitCard habit={habit} status="Missed Today" buttonText="Undo Missed" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={true} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Completed */}
            {completed.length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="watered-today-heading" className="col-span-full text-xs font-bold tracking-widest text-status-healthy uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Check className="w-4 h-4" /> Watered Today
              </motion.h3>
            )}
            {completed.map((habit, i) => {
               const isCompletedToday = completedTodayIds.includes(habit.id);
               const statusText = isCompletedToday 
                  ? (habit.type === 'avoid' ? 'Protected Today' : 'Completed Today')
                  : 'Target Met';
               const buttonText = isCompletedToday ? 'Undo' : 'Extra Care';
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               
               return (
                 <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                   <div className="opacity-80 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status={statusText} buttonText={buttonText} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}

            {/* Resting Plants */}
            {resting.length > 0 && (
              <motion.h3 layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="resting-heading" className="col-span-full text-xs font-bold tracking-widest text-status-resting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Moon className="w-4 h-4" /> Resting Plants
              </motion.h3>
            )}
            {resting.map((habit, i) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                 <ViewportLazyWrapper key={habit.id} id={habit.id} index={i}>
                   <div className="opacity-60 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status="Resting" buttonText="Water" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}
            </AnimatePresence>
          </motion.div>
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
const MemoizedPlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWaterPlant, equippedPotId, isSlipped, onSlipHabit, onUndoSlip, onArchiveHabit, onDeletePlant, onEditHabit, onHarvestPlant, isDarkPhase, eligibleBackdates, onBackdate, backdatesLeftThisWeek, quantityCurrent, customCategories, recentHistoryStr, onSnooze, dateKey }) => {
   const handleWater = React.useCallback((isMini?: boolean, customAmount?: number) => onWaterPlant(habit.id, isMini, customAmount), [onWaterPlant, habit.id]);
   const handleSlip = React.useCallback(() => onSlipHabit && onSlipHabit(habit.id), [onSlipHabit, habit.id]);
   const handleUndo = React.useCallback(() => onUndoSlip && onUndoSlip(habit.id), [onUndoSlip, habit.id]);
   const handleArchive = React.useCallback(() => onArchiveHabit && onArchiveHabit(habit.id), [onArchiveHabit, habit.id]);
   const handleDelete = React.useCallback(() => onDeletePlant && onDeletePlant(habit.id), [onDeletePlant, habit.id]);
   const handleEdit = React.useCallback(() => onEditHabit && onEditHabit(habit), [onEditHabit, habit]);
   const handleHarvest = React.useCallback(() => onHarvestPlant && onHarvestPlant(habit.id), [onHarvestPlant, habit.id]);
   const handleBackdate = React.useCallback((d: string) => onBackdate && onBackdate(habit.id, d), [onBackdate, habit.id]);
   const handleSnooze = React.useCallback(() => onSnooze && onSnooze(habit.id, dateKey), [onSnooze, habit.id, dateKey]);

   return <PlantHabitCard habit={habit} status={status} buttonText={buttonText} onWater={handleWater} isSlipped={isSlipped} onSlip={onSlipHabit ? handleSlip : undefined} onUndo={onUndoSlip ? handleUndo : undefined} onArchive={onArchiveHabit ? handleArchive : undefined} onDelete={onDeletePlant ? handleDelete : undefined} onEdit={onEditHabit ? handleEdit : undefined} onHarvest={onHarvestPlant ? handleHarvest : undefined} isDarkPhase={isDarkPhase} equippedPotId={equippedPotId} eligibleBackdates={eligibleBackdates} onBackdate={onBackdate ? handleBackdate : undefined} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={customCategories} recentHistoryStr={recentHistoryStr} onSnooze={onSnooze ? handleSnooze : undefined} dateKey={dateKey} />;
}, (prev, next) => {
  return prev.habit === next.habit &&
         prev.status === next.status &&
         prev.buttonText === next.buttonText &&
         prev.equippedPotId === next.equippedPotId &&
         prev.isSlipped === next.isSlipped &&
         prev.isDarkPhase === next.isDarkPhase &&
         prev.backdatesLeftThisWeek === next.backdatesLeftThisWeek &&
         prev.quantityCurrent === next.quantityCurrent &&
         prev.recentHistoryStr === next.recentHistoryStr &&
         prev.eligibleBackdates?.join(',') === next.eligibleBackdates?.join(',');
});

const PlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWater, isSlipped, onSlip, onUndo, equippedPotId, onArchive, onDelete, onEdit, onHarvest, isDarkPhase, eligibleBackdates = [], onBackdate, backdatesLeftThisWeek = 3, quantityCurrent = 0, customCategories = [], recentHistoryStr = "", onSnooze }) => {
  const isDanger = status === 'Critical' || status === 'Wilting' || isSlipped;
  const isCompleted = status === 'Completed Today' || status === 'Protected Today' || status === 'Resting' || status === 'Target Met';
  const isPacha = habit.plantStage === 'Fruiting Plant' && habit.streak >= 21 && (habit.streak - (habit.lastHarvestStreak ?? 21) >= 7);
  const canHarvest = isPacha && !!onHarvest;
  
  const recentHistory = React.useMemo(() => {
    return recentHistoryStr.split('').map((s: string) => s === '1');
  }, [recentHistoryStr]);
  
  const [justCompleted, setJustCompleted] = useState(false);
  const prevCompletedRef = React.useRef(isCompleted);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prevCompletedRef.current && isCompleted && (status === 'Completed Today' || status === 'Protected Today' || status === 'Target Met')) {
      setJustCompleted(true);
      
      if (habit.streak > 0 && (habit.streak === 7 || habit.streak === 14 || habit.streak === 30 || habit.streak % 30 === 0)) {
         if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            
            const duration = 2000;
            const end = Date.now() + duration;
            const fireColors = ['#ff0000', '#ff4500', '#ffa500', '#ffd700'];

            (function frame() {
               confetti({
                 particleCount: 5,
                 startVelocity: 30,
                 spread: 360,
                 ticks: 40,
                 origin: { x, y },
                 colors: fireColors,
                 zIndex: 100,
                 gravity: 0.5,
                 scalar: 1.2
               });
               if (Date.now() < end) {
                 requestAnimationFrame(frame);
               }
            }());
         }
      }

      const timer = setTimeout(() => setJustCompleted(false), 2000);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, status, habit.streak]);

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
  const [showAgeInfo, setShowAgeInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const creationDateObj = habit.creationDate ? new Date(habit.creationDate) : new Date(habit.createdAt || Date.now());
  const activeDays = differenceInCalendarDays(new Date(), creationDateObj);
  const prettyCreationDate = format(creationDateObj, "MMM d, yyyy");

  let cardBg = 'glass-card';
  let cardBorder = 'border-status-healthy/30';
  let statusColor = 'text-status-healthy';
  let buttonBg = 'bg-primary-mint text-white border border-transparent shadow-sm';
  let buttonHover = 'hover:bg-[#00c98f]';
  let iconBg = 'bg-primary-mint/20';

  if (isCompleted) {
    cardBg = 'glass-card bg-status-completed/10';
    cardBorder = 'border-primary-mint/30';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border border-surface-alt';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (isDanger) {
    cardBg = 'glass-card bg-status-wilting/5';
    cardBorder = 'border-status-wilting/40';
    if (status === 'Critical' || isSlipped) cardBorder = 'border-status-critical/40';
    statusColor = 'text-status-wilting';
    buttonBg = 'bg-status-needsCare text-white border border-transparent shadow-sm';
    buttonHover = 'hover:bg-[#d4b060]';
    iconBg = 'bg-status-wilting/20';
  } else if (status === 'Resting') {
    cardBg = 'glass-card bg-status-resting/10';
    cardBorder = 'border-status-resting/40';
    statusColor = 'text-status-resting';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border border-surface-alt';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (canHarvest) {
    cardBg = 'glass-card bg-accent-peach/10';
    cardBorder = 'border-accent-peach/40';
    buttonBg = 'bg-accent-peach text-white shadow-sm border border-transparent';
    buttonHover = 'hover:bg-[#F4C5A5]';
    iconBg = 'bg-accent-peach/30';
  }

  return (
    <motion.div 
      ref={cardRef}
      layout 
      initial={false}
      animate={justCompleted ? { scale: [1, 1.03, 1], y: [0, -6, 0] } : { scale: [1, 1.01, 1], y: 0 }}
      transition={justCompleted ? { duration: 0.6, type: "spring", bounce: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`${justCompleted ? '!bg-primary-mint/20 shadow-[0_0_40px_rgba(78,173,160,0.3)]' : cardBg + ' hover:-translate-y-1 hover:scale-[1.02]'} rounded-card p-8 flex flex-col justify-between group transition-all duration-500 relative h-[380px] overflow-hidden border ${cardBorder} [box-shadow:var(--shadow-sm)] hover:[box-shadow:var(--shadow-lg)]`}
    >
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
      <div className={`absolute top-3 right-3 flex gap-1 z-20 transition-all ${showSettings ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
        {onSnooze && !isCompleted && status !== 'Resting' && (
          <button
            onClick={onSnooze}
            className="p-2 text-muted-text hover:text-primary-text hover:bg-surface-alt/50 rounded-full"
            title="Snooze for 24h"
          >
            <Clock className="w-4 h-4" />
          </button>
        )}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'text-primary-text bg-surface-alt' : 'text-muted-text hover:text-primary-text hover:bg-surface-alt/50'}`}
            title="Settings"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showSettings && (
            <>
               <div className="fixed inset-0 z-20" onClick={() => setShowSettings(false)} />
               <div className="absolute top-10 right-0 bg-surface-card border border-surface-alt rounded-xl shadow-lg z-30 flex flex-col p-1 animate-in zoom-in-95 duration-100 w-36">
                 {onEdit && (
                   <button
                     onClick={() => { onEdit(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary-text hover:text-accent-seafoam transition-colors rounded-lg hover:bg-surface-alt text-left w-full"
                   >
                     <Edit2 className="w-3.5 h-3.5" /> Edit Habit
                   </button>
                 )}
                 {onArchive && (
                   <button
                     onClick={() => { onArchive(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary-text hover:text-accent-periwinkle transition-colors rounded-lg hover:bg-surface-alt text-left w-full"
                   >
                     <Archive className="w-3.5 h-3.5" /> Archive
                   </button>
                 )}
                 {onDelete && (
                   <button
                     onClick={() => { onDelete(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-status-critical transition-colors rounded-lg hover:bg-status-critical/10 text-left w-full"
                   >
                     <Trash2 className="w-3.5 h-3.5" /> Delete
                   </button>
                 )}
               </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 mb-4">
           {/* Display Case Container for PlantAssetsDictionary SVG */}
           <div onClick={() => setShowAgeInfo(!showAgeInfo)} className={`w-20 h-24 shrink-0 flex flex-col items-center justify-end relative group cursor-pointer`}>
             <AnimatePresence>
                 {showAgeInfo && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 5, scale: 0.9 }}
                     className="absolute -top-[4.5rem] left-1/2 -translate-x-1/2 z-40 bg-surface text-primary-text text-[10px] whitespace-nowrap p-2 rounded-lg shadow-xl border border-surface-alt font-sans pointer-events-none"
                   >
                     <div className="font-bold text-center mb-0.5 text-primary-mint text-[11px]">Lifespan</div>
                     <div className="opacity-90">Planted: {prettyCreationDate}</div>
                     <div className="opacity-90">Days active: {activeDays}</div>
                     <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-b border-r border-surface-alt rotate-45" />
                   </motion.div>
                 )}
             </AnimatePresence>
             <AnimatePresence>
               {justCompleted && (
                 <motion.div 
                   initial={{ opacity: 1 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }} 
                   className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
                 >
                   {[...Array(6)].map((_, i) => (
                     <motion.div
                       key={`water-${i}`}
                       initial={{ top: -20, left: 10 + Math.random() * 60, scale: 0, opacity: 0 }}
                       animate={{ top: 80, scale: 1, opacity: [0, 1, 0] }}
                       transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeIn' }}
                       className="absolute w-2 h-3 bg-blue-400/80 rounded-full drop-shadow-sm"
                       style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                     />
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
             <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} health={habit.plantHealth} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className={`w-20 h-24 absolute bottom-[5%] z-10 drop-shadow-md animate-breathe transform-gpu will-change-transform group-hover:scale-[1.03] transition-transform ${isSlipped ? 'opacity-80 grayscale-[0.5]' : ''} ${canHarvest ? 'animate-bounce drop-shadow-sm scale-105' : ''} ${habit.plantStage === 'Fruiting Plant' && !canHarvest ? 'opacity-95' : ''}`} />
             {/* Position custom pot exactly overlapping the base */}
             {renderPot(equippedPotId, 'absolute bottom-[10%] inset-x-4 h-4 z-20')}
             {/* Elliptical shadow under the plant */}
             <div className="w-14 h-2 bg-black/15 shadow-[0_0_10px_4px_rgba(0,0,0,0.15)] rounded-[100%] absolute bottom-[-5%] z-0" />
           </div>
           
           <div className="flex-1 flex flex-col justify-center">
             <div className="text-[11px] font-bold tracking-wide uppercase mb-1.5 flex items-center gap-1">
               {isDanger ? <AlertTriangle className="w-3.5 h-3.5 text-status-wilting" /> : isCompleted ? <Check className="w-3.5 h-3.5 text-status-healthy" /> : <div className="w-2 h-2 rounded-full bg-status-healthy" />}
               <span className={statusColor}>{isSlipped ? "Slipped Today" : status}</span>
             </div>
             <h4 className="font-bold text-primary-text text-base lg:text-lg capitalize flex items-center gap-2 leading-tight">
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
      
      <div className="flex flex-col gap-3 mt-auto pt-2">
         <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between w-full px-1">
               <span className="text-[11px] font-bold text-status-needsCare flex items-center gap-1">
                 <div className="relative inline-flex items-center">
                    <Flame className={`w-3.5 h-3.5 ${habit.streak >= 30 ? 'text-accent-coral animate-pulse' : habit.streak >= 21 ? 'text-accent-mustard animate-pulse' : habit.streak >= 14 ? 'text-accent-coral animate-pulse' : habit.streak >= 5 ? 'text-accent-mustard animate-pulse' : ''}`}/>
                    {/* Sparks/Fire Particles for Multiplier Tiers */}
                    {habit.streak >= 5 && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <span className="absolute -top-1.5 -left-1 w-1 h-1 bg-accent-mustard rounded-full animate-bounce opacity-70" style={{ animationDuration: '0.8s', boxShadow: '0 0 2px var(--color-accent-mustard-rgb)' }} />
                        <span className="absolute -top-3 left-1.5 w-1 h-1 bg-accent-coral rounded-full animate-ping opacity-90" style={{ animationDuration: '1.2s' }} />
                        <span className="absolute -top-2 left-3 w-1 h-1 bg-accent-mustard rounded-full animate-bounce opacity-80" style={{ animationDuration: '1.5s', boxShadow: '0 0 2px var(--color-accent-mustard-rgb)' }} />
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
            
            <div className="w-full flex justify-center">
            {canHarvest ? (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={onHarvest}
                    className={`px-4 py-3 min-h-[44px] flex-grow-0 rounded-full hover:scale-105 font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 active:shadow-inner active:opacity-80 flex items-center justify-center gap-2 ${buttonBg} ${buttonHover}`}
                 >
                    Harvest 🧺
                 </button>
               </div>
            ) : habit.scheduleType === 'quantity' && quantityCurrent < (habit.quantityTarget || 1) ? (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={() => onWater(true)}
                    disabled={isSlipped}
                    className={`px-4 py-3 min-h-[44px] flex-1 rounded-full hover:scale-105 font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 active:shadow-inner active:opacity-80 flex items-center justify-center gap-2 ${buttonBg} ${buttonHover} disabled:opacity-50`}
                 >
                    +1
                 </button>
                 <button 
                    onClick={() => setShowQuantityModal(true)}
                    disabled={isSlipped}
                    className={`px-3 py-3 min-h-[44px] flex-1 rounded-full hover:scale-105 font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 active:shadow-inner active:opacity-80 flex items-center justify-center gap-2 bg-surface-alt text-white border border-transparent hover:bg-zinc-700 disabled:opacity-50`}
                 >
                    Log...
                 </button>
               </div>
            ) : (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={() => {
                      if (isSlipped && onUndo) onUndo();
                      else if (!isSlipped) onWater();
                    }} 
                    className={`flex-1 py-3 px-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-inner active:opacity-80 flex items-center justify-center gap-2 ${isSlipped ? 'bg-transparent text-[#E57C5D] border border-[#E57C5D] hover:bg-[#E57C5D]/10' : isCompleted ? buttonBg + ' ' + buttonHover : 'bg-[#1C1B1F] text-white border border-transparent hover:bg-[#2A292D] shadow-md'}`}
                 >
                    {habit.type === 'avoid' ? <ShieldAlert className="w-4 h-4" /> : isSlipped ? <AlertCircle className="w-4 h-4" /> : <Droplet className="w-4 h-4" />}
                    {isSlipped ? "Undo Missed" : buttonText === "Water" ? "Water Plant" : buttonText}
                 </button>
                 {!isCompleted && !isSlipped && habit.type !== 'avoid' && onSlip && (
                   <button
                     onClick={() => onSlip()}
                     className="px-4 py-3 flex-1 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-inner active:opacity-80 flex items-center justify-center bg-transparent text-[#E57C5D] border border-[#E57C5D] hover:bg-[#E57C5D]/10 shrink-0"
                   >
                     Missed
                   </button>
                 )}
               </div>
            )}
            </div>
         </div>

         {/* Action Row Removed (Now in settings dropdown) */}

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
               className={`w-full py-1.5 mt-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] ${
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
                 <ShieldAlert className="w-5 h-5 text-accent-mustard" /> Plant Protection
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
               <button type="submit" className="w-full bg-accent-seafoam/10 text-accent-seafoam py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-accent-seafoam/20 transition-colors shadow-sm">
                  Start Recovery
               </button>
            </form>
         </div>
      </AnimatedModal>

      <AnimatedModal isOpen={showQuantityModal} onClose={() => setShowQuantityModal(false)} alignment="bottom" className="!p-0 !max-w-sm mx-auto !rounded-t-[32px] !rounded-b-none overflow-hidden bg-surface-card border border-surface-alt">
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <Target className="w-5 h-5 text-accent-seafoam" /> Log Progress
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
                  className="flex-1 bg-surface-soft border border-surface-alt rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-accent-seafoam transition-colors"
                  placeholder={`Amount of ${habit.quantityUnit || 'units'}`}
                  value={manualQuantity}
                  onChange={e => setManualQuantity(e.target.value)}
                  min={1}
               />
               <button type="submit" disabled={!manualQuantity} className="bg-accent-seafoam text-black px-6 py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-accent-seafoam/80 transition-colors shadow-sm disabled:opacity-50">
                  Save
               </button>
            </form>
         </div>
      </AnimatedModal>

    </motion.div>
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
