import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, RestMode } from '../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
  subDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Trophy, Droplets, Leaf, Moon, AlertCircle, X } from 'lucide-react';
import { isHabitPaused } from '../restModeUtils';

import { UserStats } from '../types';

interface GardenCalendarProps {
  logs: HabitLog;
  habits: Habit[];
  activeRestMode?: RestMode | null;
  stats?: UserStats;
  onBackdate?: (habitId: string, dateKey: string) => void;
}

import { isHabitDueOnDate } from '../scheduleUtils';

export const GardenCalendar: React.FC<GardenCalendarProps> = React.memo(({ logs, habits, activeRestMode, stats, onBackdate }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [backdateMenuOpenFor, setBackdateMenuOpenFor] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');
  const tMinus1 = format(subDays(today, 1), 'yyyy-MM-dd');
  const tMinus2 = format(subDays(today, 2), 'yyyy-MM-dd');
  
  const weekStartFormat = format(startOfWeek(today, {weekStartsOn: 1}), 'yyyy-MM-dd');
  const usedBackdates = stats?.backdateWeekStart === weekStartFormat ? (stats?.backdatesUsedThisWeek || 0) : 0;
  const backdatesLeftThisWeek = Math.max(0, 3 - usedBackdates);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const jumpToToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
    setSelectedDate(startOfDay(new Date()));
  };

  const monthData = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    let monthlyScheduled = 0;
    let monthlyCompleted = 0;
    let monthlyPerfectDays = 0;
    let monthlyMissedDays = 0;
    let monthlyXp = 0;

    const daysData = days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const isPastOrToday = !isBefore(startOfDay(new Date()), day);
      const slippedIds = (stats?.slipLogs?.[dateKey] || []).map(s => s.id);
      
      let scheduled = 0;
      let completedCount = 0;
      let completedHabits: Habit[] = [];
      let missedHabits: Habit[] = [];
      let slippedHabits: Habit[] = [];

      let allHabitsPaused = true;

      habits.forEach(h => {
         const createdDate = new Date(h.createdAt);
         if (!isBefore(day, startOfDay(createdDate))) {
            const isPaused = isHabitPaused(h.id, dateKey, activeRestMode || null);
            const isFlexible = h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly';
            let isDue = isHabitDueOnDate(h, day);
            if (isFlexible) isDue = false;

            if (!isPaused && isDue) allHabitsPaused = false;
            
            if (!isPaused && isDue) {
              scheduled++;
              if (isPastOrToday && isSameMonth(day, currentMonth)) {
                 monthlyScheduled++;
              }
            }
            // For flexible habits, if they completed it today, we count it as completed
            if (slippedIds.includes(h.id)) {
               slippedHabits.push(h);
            } else if (logs[dateKey]?.includes(h.id)) {
               completedCount++;
               completedHabits.push(h);
               if (isPastOrToday && isSameMonth(day, currentMonth)) {
                  monthlyCompleted++;
                  monthlyXp += (h.xp || 12); 
               }
            } else {
               if (isPastOrToday && !isPaused && isDue) {
                 missedHabits.push(h);
               }
            }
         }
      });
      
      let isRestDay = false;
      if (isPastOrToday && habits.length > 0 && allHabitsPaused) {
         isRestDay = true;
      }

      const rate = scheduled > 0 ? completedCount / scheduled : -1;
      
      if (isPastOrToday && isSameMonth(day, currentMonth) && !isRestDay) {
         if (scheduled > 0) {
            if (completedCount >= scheduled && slippedHabits.length === 0) monthlyPerfectDays++;
            else if (completedCount === 0) monthlyMissedDays++;
         }
      }

      return {
        date: day,
        dateKey,
        isCurrentMonth: isSameMonth(day, currentMonth),
        scheduled,
        completedCount,
        rate,
        completedHabits,
        missedHabits,
        slippedHabits,
        isFuture: !isPastOrToday,
        isRestDay,
      };
    });

    const completionRate = monthlyScheduled > 0 ? (monthlyCompleted / monthlyScheduled) * 100 : 0;

    return {
      days: daysData,
      monthlyCompleted,
      monthlyScheduled,
      completionRate,
      monthlyPerfectDays,
      monthlyMissedDays,
      monthlyXp,
    };
  }, [currentMonth, logs, habits, activeRestMode, stats]);

  const selectedDayData = selectedDate ? monthData.days.find(d => isSameDay(d.date, selectedDate)) : null;

  const getDayColor = (rate: number, isFuture: boolean, isRestDay: boolean) => {
    if (isRestDay) return "bg-indigo-500/50 border border-indigo-400"; // Rest Day
    if (isFuture || rate === -1) return "bg-surface-alt/5 border border-surface-alt"; // Rest/Future
    if (rate >= 1) return "bg-amber-400 border border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]"; // Perfect (Gold)
    if (rate >= 0.8) return "bg-emerald-500 border border-emerald-400"; // Excellent
    if (rate >= 0.5) return "bg-teal-400 border border-teal-300"; // Good
    if (rate > 0) return "bg-orange-400 border border-orange-300"; // Weak
    return "bg-rose-500/50 border border-rose-500/30"; // Missed
  };

  return (
    <div className="space-y-8 pb-32 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass p-6 border border-surface-alt relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00F5D4]/40" />
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Garden Calendar</h2>
          <p className="text-[#00F5D4] font-mono text-[10px] tracking-widest uppercase mt-1">
            Visual Habit Consistency
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <button onClick={prevMonth} className="p-2 hover:bg-surface-alt/10 rounded-full transition-colors text-white">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <span className="font-mono text-sm tracking-widest text-[#00F5D4] uppercase w-32 text-center font-bold">
             {format(currentMonth, 'MMMM yyyy')}
           </span>
           <button onClick={nextMonth} className="p-2 hover:bg-surface-alt/10 rounded-full transition-colors text-white">
             <ChevronRight className="w-5 h-5" />
           </button>
           <button 
              onClick={jumpToToday}
              className="ml-2 px-3 py-1.5 bg-gradient-to-tr from-cyan-600/20 to-violet-600/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-500/10 transition-colors"
           >
             Today
           </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center text-center">
             <div className="text-xl font-bold text-white font-display">{monthData.monthlyCompleted}</div>
             <div className="text-[9px] font-mono tracking-widest uppercase text-slate-400">Habits Completed</div>
         </div>
         <div className="glass p-4 border border-emerald-500/10 flex flex-col items-center justify-center text-center bg-emerald-950/10">
             <div className="text-xl font-bold text-emerald-400 font-display">{Math.round(monthData.completionRate)}%</div>
             <div className="text-[9px] font-mono tracking-widest uppercase text-slate-400">Monthly Rate</div>
         </div>
         <div className="glass p-4 border border-amber-500/10 flex flex-col items-center justify-center text-center bg-amber-950/10">
             <div className="text-xl font-bold text-amber-400 font-display flex items-center gap-1">
               {monthData.monthlyPerfectDays} <Trophy className="w-4 h-4" />
             </div>
             <div className="text-[9px] font-mono tracking-widest uppercase text-slate-400">Perfect Days</div>
         </div>
         <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center text-center">
             <div className="text-xl font-bold text-blue-400 font-display">~{Math.round(monthData.monthlyXp)}</div>
             <div className="text-[9px] font-mono tracking-widest uppercase text-slate-400">XP Earned</div>
         </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass p-6 md:p-8 border border-surface-alt relative">
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00F5D4]/40" />
        
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-500">
               {d}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2">
           {monthData.days.map((day, i) => (
             <button
                key={i}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  aspect-square rounded-sm transition-all duration-200 
                  flex items-center justify-center relative
                  ${getDayColor(day.rate, day.isFuture, day.isRestDay)}
                  ${!day.isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                  ${selectedDate && isSameDay(selectedDate, day.date) ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110 z-10' : 'hover:scale-105'}
                `}
             >
                {day.isRestDay && !day.isFuture && (
                   <Moon className="w-3 h-3 text-indigo-200/90 drop-shadow-sm" />
                )}
                {day.rate >= 1 && !day.isFuture && !day.isRestDay && (
                   <Trophy className="w-3 h-3 text-white/90 drop-shadow-sm" />
                )}
                {day.rate === 0 && day.scheduled > 0 && !day.isFuture && !day.isRestDay && (
                   <Leaf className="w-3 h-3 text-white/60 drop-shadow-sm rotate-45" />
                )}
                <span className="absolute top-1 left-1 text-[8px] font-mono text-white/50">{format(day.date, 'd')}</span>
             </button>
           ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 items-center justify-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-amber-400" /> Perfect (100%)
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-emerald-500" /> Strong (80-99%)
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-teal-400" /> Partial (50-79%)
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-orange-400" /> Low (1-49%)
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-rose-500/50" /> Missed
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-indigo-500/50" /> Rest Day
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-3 h-3 rounded-sm bg-surface-alt/5" /> Future / No Data
           </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDayData && (
        <div className="glass p-6 md:p-8 border border-surface-alt border-t-cyan-500/30">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h3 className="text-xl font-bold font-display text-white">{format(selectedDayData.date, 'MMMM d, yyyy')}</h3>
                 <p className="text-xs font-mono tracking-widest text-slate-400 uppercase mt-1">
                   {selectedDayData.isFuture ? 'Future Date' : 
                    selectedDayData.rate === 1 ? 'Perfect Garden Day' :
                    selectedDayData.rate >= 0.8 ? 'Excellent Day' :
                    selectedDayData.rate >= 0.5 ? 'Partial Day' :
                    selectedDayData.rate > 0 ? 'Low Progress' :
                    selectedDayData.scheduled > 0 ? 'Missed Day' : 'Rest Day'}
                 </p>
              </div>
              {!selectedDayData.isFuture && selectedDayData.scheduled > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold font-display text-cyan-400">
                    {Math.round(selectedDayData.rate * 100)}%
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                    {selectedDayData.completedCount} / {selectedDayData.scheduled} Habits
                  </div>
                </div>
              )}
           </div>

           {!selectedDayData.isFuture ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {(selectedDayData.completedHabits.length > 0 || selectedDayData.scheduled === 0) && (
                 <div>
                   <h4 className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-2">
                     <Droplets className="w-4 h-4" /> Completed & Watered
                   </h4>
                   {selectedDayData.completedHabits.length > 0 ? (
                     <ul className="space-y-2">
                       {selectedDayData.completedHabits.map(h => (
                         <li key={h.id} className="flex items-center gap-2 text-sm text-slate-300">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           {h.name}
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <p className="text-sm text-slate-500 italic">No habits were scheduled to be completed.</p>
                   )}
                 </div>
               )}

              {selectedDayData.slippedHabits.length > 0 && (
                 <div className="mb-6">
                   <h4 className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-3 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4" /> Avoid Habits Slipped
                   </h4>
                   <ul className="space-y-2">
                     {selectedDayData.slippedHabits.map(h => (
                       <li key={h.id} className="flex items-center gap-2 text-sm text-rose-400/80 cursor-default">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                         {h.name} {h.isPrivate ? " (Private)" : ""}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {selectedDayData.missedHabits.length > 0 && (
                 <div>
                   <h4 className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-3 flex items-center gap-2">
                     <Leaf className="w-4 h-4 rotate-45" /> Missed / Thirsty
                   </h4>
                   <ul className="space-y-4">
                     {selectedDayData.missedHabits.map(h => {
                       const isEligible = onBackdate && (selectedDayData.dateKey === tMinus1 || selectedDayData.dateKey === tMinus2) && selectedDayData.dateKey >= format(new Date(h.createdAt || todayStr), 'yyyy-MM-dd') && !isHabitPaused(h.id, selectedDayData.dateKey, activeRestMode || null);
                       return (
                       <li key={h.id} className="text-sm text-slate-400 cursor-default decoration-rose-500/50">
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 line-through">
                               <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 flex-shrink-0" />
                               {h.name}
                             </div>
                             {isEligible && (
                                backdateMenuOpenFor === h.id ? (
                                   <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 ml-3 relative">
                                      <button onClick={() => setBackdateMenuOpenFor(null)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-3 h-3" /></button>
                                      <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-2">Repair {format(selectedDayData.date, 'EEEE')}</p>
                                      <button 
                                         onClick={() => { onBackdate(h.id, selectedDayData.dateKey); setBackdateMenuOpenFor(null); }}
                                         className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 py-1.5 rounded text-[9px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                                      >
                                         Confirm (-5 coins)
                                      </button>
                                      <div className="text-[8px] text-slate-400 text-center uppercase tracking-widest mt-1">{backdatesLeftThisWeek} left this week</div>
                                      {backdatesLeftThisWeek <= 0 && <p className="text-[8px] text-rose-400 text-center uppercase tracking-widest mt-1">Weekly limit reached (Max 3)</p>}
                                   </div>
                                ) : (
                                   <button onClick={() => setBackdateMenuOpenFor(h.id)} className="text-[10px] text-slate-500 hover:text-emerald-400 font-mono tracking-widest transition-colors self-start ml-3 pl-1 border-l border-slate-700">
                                      Forgot to log a day? 🕰️
                                   </button>
                                )
                             )}
                          </div>
                       </li>
                     )})}
                   </ul>
                 </div>
               )}
             </div>
           ) : (
             <p className="text-slate-500 text-sm italic">You can only water plants in the present.</p>
           )}
        </div>
      )}

    </div>
  );
});
