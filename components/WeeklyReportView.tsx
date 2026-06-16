import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, UserStats, SeasonalEvent, UserEventProgress, RestMode } from '../types';
import { startOfWeek, endOfWeek, subWeeks, eachDayOfInterval, format, isBefore, startOfDay, isSameDay } from 'date-fns';
import { Trophy, ChevronLeft, ChevronRight, Activity, Leaf, AlertCircle, Droplets, CheckCircle2, Gift, Moon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES } from '../categories';
import { isHabitPaused } from '../restModeUtils';
import { isHabitDueOnDate } from '../scheduleUtils';

interface WeeklyReportViewProps {
  logs: HabitLog;
  habits: Habit[];
  stats: UserStats;
  activeEvent?: SeasonalEvent | null;
  eventProgress?: UserEventProgress;
  activeRestMode?: RestMode | null;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = React.memo(({ logs, habits, stats, activeEvent, eventProgress, activeRestMode }) => {
  const [weeksAgo, setWeeksAgo] = useState(0);

  const reportData = useMemo(() => {
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(subWeeks(today, weeksAgo), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(today, weeksAgo), { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    let totalScheduled = 0;
    let totalCompleted = 0;
    let perfectDays = 0;
    let totalRestDays = 0;
    const dailyBreakdown: { date: Date; completed: number; scheduled: number; isPerfect: boolean, isRestDay: boolean }[] = [];
    const habitPerformance: Record<string, { completed: number; scheduled: number }> = {};
    const categoryPerformance: Record<string, { completed: number; scheduled: number }> = {};

    habits.forEach(h => {
      habitPerformance[h.id] = { completed: 0, scheduled: 0 };
      if (!categoryPerformance[h.category]) {
        categoryPerformance[h.category] = { completed: 0, scheduled: 0 };
      }
    });

    daysInWeek.forEach(day => {
      // Only count days up to today for current week scheduled
      const isFuture = isBefore(today, day) && !isSameDay(today, day);
      const dateKey = format(day, "yyyy-MM-dd");
      const completedIds = logs[dateKey] || [];

      let dayScheduled = 0;
      let dayCompleted = 0;
      let allHabitsPaused = true;

      habits.forEach(h => {
        if (!isFuture) {
          const isPaused = isHabitPaused(h.id, dateKey, activeRestMode || null);
          const isFlexible = h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly';
          
          let isDue = isHabitDueOnDate(h, day);
          if (isFlexible) {
             isDue = false; // We won't count flexible habits in daily expected totals
          }
          
          if (!isPaused && isDue) allHabitsPaused = false;
          
          if (!isPaused && isDue) {
            dayScheduled++;
            totalScheduled++;
            habitPerformance[h.id].scheduled++;
            categoryPerformance[h.category].scheduled++;
          }

          if (completedIds.includes(h.id)) {
            // Cap completed at scheduled if needed, but for MVP let's just increment
            if (!isFlexible) {
               dayCompleted++;
               totalCompleted++;
               habitPerformance[h.id].completed++;
               categoryPerformance[h.category].completed++;
            }
          }
        }
      });

      let isRestDay = false;
      if (!isFuture && habits.length > 0 && allHabitsPaused) {
        isRestDay = true;
        totalRestDays++;
      }

      const isPerfect = !isRestDay && dayScheduled > 0 && dayCompleted >= dayScheduled;
      if (isPerfect) perfectDays++;

      dailyBreakdown.push({
        date: day,
        completed: dayCompleted,
        scheduled: dayScheduled,
        isPerfect,
        isRestDay
      });
    });

    habits.forEach(h => {
       const isFlexible = h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly';
       if (isFlexible) {
          const target = h.targetCount || 1;
          totalScheduled += target;
          habitPerformance[h.id].scheduled += target;
          categoryPerformance[h.category].scheduled += target;
          
          let compCount = 0;
          daysInWeek.forEach(day => {
             const isFuture = isBefore(today, day) && !isSameDay(today, day);
             const dateKey = format(day, "yyyy-MM-dd");
             if (!isFuture && (logs[dateKey] || []).includes(h.id)) {
                compCount++;
             }
          });
          
          if (compCount > target) compCount = target; // Cap it
          totalCompleted += compCount;
          habitPerformance[h.id].completed += compCount;
          categoryPerformance[h.category].completed += compCount;
       }
    });

    const completionRate = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0;
    
    // Find best habit & habit needing care
    let bestHabitId: string | null = null;
    let maxRate = -1;
    let needsCareId: string | null = null;
    let minRate = 101;

    habits.forEach(h => {
      const perf = habitPerformance[h.id];
      if (perf.scheduled > 0) {
        const rate = (perf.completed / perf.scheduled) * 100;
        if (rate > maxRate) {
          maxRate = rate;
          bestHabitId = h.id;
        }
        if (rate < minRate) {
          minRate = rate;
          needsCareId = h.id;
        }
      }
    });

    const bestHabit = bestHabitId ? habits.find(h => h.id === bestHabitId) : null;
    const needsCareHabit = needsCareId ? habits.find(h => h.id === needsCareId) : null;

    // We can estimate XP earned simply by totalCompleted * average XP (e.g. 12) + perfectDays * 50
    const estimatedXp = totalCompleted * 12 + perfectDays * 50;

    let weekLabel = "";
    if (completionRate >= 90) weekLabel = "Excellent Week";
    else if (completionRate >= 75) weekLabel = "Strong Week";
    else if (completionRate >= 50) weekLabel = "Steady Week";
    else if (completionRate >= 25) weekLabel = "Needs Care";
    else weekLabel = "Recovery Week";

    let insightMessage = "";
    if (completionRate >= 90) insightMessage = "Your garden bloomed beautifully this week.";
    else if (completionRate >= 75) insightMessage = "Your plants stayed healthy with steady care.";
    else if (completionRate >= 50) insightMessage = "You showed up many times. Keep building.";
    else if (completionRate >= 25) insightMessage = "Some plants were thirsty, but next week can improve.";
    else insightMessage = "This was a tough week. Start again with one small habit.";

    // Estimate plants at risk (using current health since historical health isn't stored for MVP)
    const plantsAtRisk = habits.filter(h => (h.plantHealth || 100) < 50).length;
    // Estimate plants matured (using current stage)
    const plantsGrown = habits.filter(h => h.plantStage === 'Fruiting Plant').length;

    return {
      weekStart,
      weekEnd,
      totalScheduled,
      totalCompleted,
      totalRestDays,
      completionRate,
      perfectDays,
      estimatedXp,
      weekLabel,
      insightMessage,
      bestHabit,
      needsCareHabit,
      plantsAtRisk,
      plantsGrown,
      habitPerformance,
      categoryPerformance,
      dailyBreakdown
    };
  }, [logs, habits, weeksAgo, activeRestMode]);

  if (habits.length === 0) {
    return (
      <div className="bg-surface-card p-12 shadow-md rounded-[var(--radius-card)] text-center flex flex-col items-center justify-center">
        <Leaf className="w-12 h-12 text-muted-text mb-6" />
        <h2 className="text-xl font-display font-bold text-primary-anchor mb-2">Your garden is empty this week.</h2>
        <p className="text-secondary-text font-mono text-xs tracking-widest uppercase">Plant your first habit seed to start growing.</p>
      </div>
    );
  }

  const BestHabitIcon = reportData.bestHabit ? (LucideIcons as any)[reportData.bestHabit.icon] || LucideIcons.Activity : null;
  const CareHabitIcon = reportData.needsCareHabit ? (LucideIcons as any)[reportData.needsCareHabit.icon] || LucideIcons.Activity : null;

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-card p-6 shadow-md rounded-[var(--radius-card)] relative">
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-seafoam/40" />
         <div>
            <h2 className="text-2xl font-bold font-display text-primary-anchor">{reportData.weekLabel}</h2>
            <p className="text-accent-seafoam font-mono text-[10px] tracking-widest uppercase">
              {format(reportData.weekStart, "MMM d")} - {format(reportData.weekEnd, "MMM d, yyyy")}
            </p>
         </div>
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setWeeksAgo(prev => prev + 1)}
              className="p-2 bg-surface-alt hover:bg-surface-alt/70 text-secondary-text transition-colors rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-muted-text w-24 text-center">
              {weeksAgo === 0 ? "THIS WEEK" : `${weeksAgo} WEEKS AGO`}
            </span>
            <button 
              onClick={() => setWeeksAgo(prev => Math.max(0, prev - 1))}
              disabled={weeksAgo === 0}
              className="p-2 bg-surface-alt hover:bg-surface-alt/70 text-secondary-text transition-colors disabled:opacity-30 disabled:hover:bg-surface-alt rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center">
          <Activity className="w-5 h-5 text-accent-periwinkle mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">
             {reportData.totalCompleted} <span className="text-sm text-secondary-text">/ {reportData.totalScheduled}</span>
          </div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Habits Built</div>
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center relative">
          <Trophy className="w-5 h-5 text-accent-mustard mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">{reportData.perfectDays}</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Perfect Days</div>
          {reportData.totalRestDays > 0 && <div className="absolute top-2 right-2 text-accent-periwinkle text-[10px] font-mono flex gap-1 items-center"><Moon className="w-3 h-3"/> {reportData.totalRestDays} rested</div>}
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center">
          <Droplets className="w-5 h-5 text-accent-seafoam mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">~{Math.round(reportData.estimatedXp)}</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">XP Earned</div>
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center">
          <CheckCircle2 className="w-5 h-5 text-accent-seafoam mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">{Math.round(reportData.completionRate)}%</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Completion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Habit */}
        {reportData.bestHabit && (
          <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] bg-accent-seafoam/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-seafoam/20 text-accent-seafoam rounded-full">
                {BestHabitIcon && <BestHabitIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-accent-seafoam uppercase">Best Habit</div>
                <div className="text-lg font-bold text-primary-anchor">{reportData.bestHabit.name}</div>
              </div>
            </div>
            <p className="text-sm text-secondary-text">
              Completed {reportData.habitPerformance[reportData.bestHabit.id].completed} / {reportData.habitPerformance[reportData.bestHabit.id].scheduled} times.
              Your {reportData.bestHabit.plantStage || "plant"} stayed strong.
            </p>
          </div>
        )}

        {/* Needs Care */}
        {reportData.needsCareHabit && (
          <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] bg-accent-coral/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-coral/20 text-accent-coral rounded-full">
                {CareHabitIcon && <CareHabitIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-accent-coral uppercase">Needs Care</div>
                <div className="text-lg font-bold text-primary-anchor">{reportData.needsCareHabit.name}</div>
              </div>
            </div>
            <p className="text-sm text-secondary-text">
              Completed {reportData.habitPerformance[reportData.needsCareHabit.id].completed} / {reportData.habitPerformance[reportData.needsCareHabit.id].scheduled} times.
              Try making it a mini habit next week.
            </p>
          </div>
        )}
      </div>

      {/* Category Performance */}
      <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)] mb-8">
        <h3 className="text-xs font-mono tracking-widest text-muted-text uppercase mb-6">Area Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(reportData.categoryPerformance)
            .filter(([_, perf]) => perf.scheduled > 0)
            .map(([catId, perf]) => {
              const info = CATEGORIES[catId as keyof typeof CATEGORIES];
              if (!info) return null;
              const rate = (perf.completed / perf.scheduled) * 100;
              return (
                <div key={catId} className="flex flex-col gap-2 p-3 border border-surface-alt bg-[#0d1017]/30">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300">{info.name}</span>
                     <span className={`text-xs font-bold ${rate === 100 ? 'text-accent-seafoam' : rate > 50 ? 'text-accent-mustard' : 'text-accent-coral'}`}>
                       {Math.round(rate)}%
                     </span>
                   </div>
                   <div className="w-full h-1 bg-black overflow-hidden">
                     <div className={`h-full ${rate === 100 ? 'bg-accent-seafoam' : rate > 50 ? 'bg-accent-mustard' : 'bg-accent-coral'}`} style={{ width: `${rate}%` }} />
                   </div>
                   <span className="text-[9px] text-slate-500 font-mono text-right">{perf.completed}/{perf.scheduled}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Seasonal Event Progress */}
      {activeEvent && eventProgress && weeksAgo === 0 && (
        <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)] mb-8 relative overflow-hidden group bg-accent-seafoam/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-seafoam/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
          <h3 className="text-xs font-mono tracking-widest text-accent-seafoam uppercase mb-6 flex items-center gap-2">
            <Gift className="w-4 h-4" /> Seasonal Event Progress
          </h3>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
            <div>
              <div className="text-lg font-bold text-primary-anchor font-display">{activeEvent.name}</div>
              <div className="text-sm text-secondary-text mt-1">
                {Object.values(eventProgress.questProgress).filter((count, index) => 
                   count >= activeEvent.quests[index].requiredCount
                ).length} / {activeEvent.quests.length} tasks completed
              </div>
            </div>
            {eventProgress.isCompleted && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-seafoam/10 border border-accent-seafoam/30 rounded-full">
                 <CheckCircle2 className="w-4 h-4 text-accent-seafoam" />
                 <span className="text-xs font-mono tracking-widest text-accent-seafoam uppercase">Reward Unlocked: {activeEvent.rewardDecorationId.replace('_', ' ')}</span>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Breakdown */}
      <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)]">
        <h3 className="text-xs font-mono tracking-widest text-muted-text uppercase mb-6">Daily 7-Day Breakdown</h3>
        <div className="grid grid-cols-7 gap-2">
          {reportData.dailyBreakdown.map((day, i) => {
            const isFuture = isBefore(startOfDay(new Date()), day.date) && !isSameDay(startOfDay(new Date()), day.date);
            const rate = day.scheduled > 0 ? day.completed / day.scheduled : 0;
            
            let bgColor = "bg-surface-alt/5";
            if (day.isRestDay) bgColor = "bg-accent-periwinkle/50 border-accent-periwinkle/40";
            else if (!isFuture && day.scheduled > 0) {
              if (rate >= 0.8) bgColor = "bg-accent-seafoam";
              else if (rate >= 0.5) bgColor = "bg-accent-mustard";
              else if (rate > 0) bgColor = "bg-accent-coral";
              else bgColor = "bg-accent-coral/50";
            }

            return (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="text-[10px] font-mono text-slate-500 uppercase">{format(day.date, "EEE")}</div>
                <div className={`w-full aspect-square max-w-[2.5rem] rounded-full ${bgColor} border border-surface-alt flex items-center justify-center`}>
                  {day.isRestDay ? <Moon className="w-3.5 h-3.5 text-accent-periwinkle" /> : day.isPerfect && !isFuture && <Trophy className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                </div>
                <div className="text-[9px] font-mono text-slate-400">{!isFuture ? (day.isRestDay ? 'Rest' : `${day.completed}/${day.scheduled}`) : '-'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Notes */}
      <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)] relative">
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-seafoam/40" />
         <h3 className="text-lg font-bold text-primary-anchor mb-2">{reportData.insightMessage}</h3>
         <p className="text-sm text-secondary-text mb-6">
           {reportData.needsCareHabit ? `Focus for next week: Protect your ${reportData.needsCareHabit.name} habit. Consider reducing the difficulty.` : "Focus for next week: Keep up the excellent momentum and maintain your streaks."}
         </p>
         
         {reportData.completionRate >= 50 && (
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-mustard/10 border border-accent-mustard/30 text-accent-mustard text-xs font-mono uppercase tracking-widest rounded-full">
             <Trophy className="w-4 h-4" />
             Reward Earned: +{Math.round(reportData.estimatedXp * 0.1)} Bonus XP
           </div>
         )}
      </div>
    </div>
  );
});
