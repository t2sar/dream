import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, MonthlyGardenReport, RestMode } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay, isSameDay, subMonths } from 'date-fns';
import { Trophy, Leaf, Activity, Droplets, CheckCircle2, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES } from '../categories';
import { isHabitPaused } from '../restModeUtils';

interface MonthlyReportViewProps {
  logs: HabitLog;
  habits: Habit[];
  activeRestMode?: RestMode | null;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = React.memo(({ logs, habits, activeRestMode }) => {
  const [monthsAgo, setMonthsAgo] = useState(0);

  const reportData = useMemo(() => {
    const today = startOfDay(new Date());
    const targetDate = subMonths(today, monthsAgo);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Check if the current target month is fully in the past (finalized) or ongoing
    const isFinalized = isBefore(monthEnd, today);

    let totalScheduled = 0;
    let totalCompleted = 0;
    let totalMissed = 0;
    let perfectDays = 0;
    let restDays = 0;
    const dailyBreakdown: { date: Date; completed: number; scheduled: number; isPerfect: boolean, isRestDay: boolean }[] = [];
    const habitPerformance: Record<string, { completed: number; scheduled: number }> = {};
    const categoryPerformance: Record<string, { completed: number; scheduled: number }> = {};

    habits.forEach(h => {
      habitPerformance[h.id] = { completed: 0, scheduled: 0 };
      if (!categoryPerformance[h.category]) {
        categoryPerformance[h.category] = { completed: 0, scheduled: 0 };
      }
    });

    daysInMonth.forEach(day => {
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
          
          let isDue = true; 
          if (isFlexible) isDue = false;
          
          if (!isPaused && isDue) allHabitsPaused = false;
          
          if (!isPaused && isDue) {
            dayScheduled++;
            totalScheduled++;
            habitPerformance[h.id].scheduled++;
            categoryPerformance[h.category].scheduled++;
          }

          if (completedIds.includes(h.id)) {
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
        restDays++;
      }

      if (!isFuture && !isRestDay) {
        totalMissed += Math.max(0, dayScheduled - dayCompleted);
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
          // Calculate approx how many targets apply in the month.
          // Since target is weekly, we can just say ~4.3 weeks per month = targetCount * 4
          // Or we can just count complete times within month vs target * 4
          // To keep it simple, we'll estimate 4 weeks
          const weeksInMonth = 4;
          const target = (h.targetCount || 1) * weeksInMonth;
          totalScheduled += target;
          habitPerformance[h.id].scheduled += target;
          categoryPerformance[h.category].scheduled += target;
          
          let compCount = 0;
          daysInMonth.forEach(day => {
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
      if (perf.scheduled >= 3) {
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

    // Fallback if no habit had 3+ scheduled instances
    if (!bestHabitId && habits.length > 0) {
      habits.forEach(h => {
        const perf = habitPerformance[h.id];
        if (perf.scheduled > 0) {
           const rate = (perf.completed / perf.scheduled) * 100;
           if (rate > maxRate) { maxRate = rate; bestHabitId = h.id; }
           if (rate < minRate) { minRate = rate; needsCareId = h.id; }
        }
      });
    }

    const bestHabit = bestHabitId ? habits.find(h => h.id === bestHabitId) : null;
    const needsCareHabit = needsCareId && needsCareId !== bestHabitId ? habits.find(h => h.id === needsCareId) : null;

    // Estimate Category
    let bestCategoryId: string | null = null;
    let maxCatRate = -1;
    Object.entries(categoryPerformance).forEach(([catId, perf]) => {
      if (perf.scheduled >= 3) {
        const rate = (perf.completed / perf.scheduled) * 100;
        if (rate > maxCatRate) {
           maxCatRate = rate;
           bestCategoryId = catId;
        }
      }
    });

    // Estimate XP earned simply by totalCompleted * average XP (e.g. 12) + perfectDays * 50
    const estimatedXp = totalCompleted * 12 + perfectDays * 50;

    let monthLabel = "";
    if (completionRate >= 90) monthLabel = "Excellent Month";
    else if (completionRate >= 75) monthLabel = "Strong Month";
    else if (completionRate >= 50) monthLabel = "Steady Month";
    else if (completionRate >= 25) monthLabel = "Recovery Month";
    else monthLabel = "Gentle Restart Month";

    let insightMessage = "";
    if (completionRate >= 90) insightMessage = "Your garden had a strong harvest this month.";
    else if (completionRate >= 75) insightMessage = "Your garden kept growing with steady care.";
    else if (completionRate >= 50) insightMessage = "Small steps kept your plants growing.";
    else if (completionRate >= 25) insightMessage = "This was a recovery month. Small roots still matter.";
    else insightMessage = "Some plants may need smaller steps next month.";

    if (restDays > 5 && completionRate < 50) {
         insightMessage = "Your garden rested when life needed space.";
    }

    // Estimate plants at risk (MVP: just check current health if it's the current month)
    const plantsAtRisk = habits.filter(h => (h.plantHealth || 100) < 50).length;
    // Estimate plants grown (MVP: mature plants)
    const plantsGrown = habits.filter(h => h.plantStage === 'Fruiting Plant' || h.plantStage === 'Mature Plant').length;

    const report: MonthlyGardenReport & { dailyBreakdown: any[], habitPerformance: any, bestHabit: Habit|null, needsCareHabit: Habit|null } = {
      id: `${format(monthStart, "yyyy-MM")}`,
      monthKey: format(monthStart, "yyyy-MM"),
      year: targetDate.getFullYear(),
      month: targetDate.getMonth(),
      startDate: format(monthStart, "yyyy-MM-dd"),
      endDate: format(monthEnd, "yyyy-MM-dd"),
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFinalized,
      totalScheduledInstances: totalScheduled,
      totalCompletedInstances: totalCompleted,
      totalMissedInstances: totalMissed,
      totalPausedInstances: 0,
      completionPercentage: completionRate,
      perfectGardenDays: perfectDays,
      restDays,
      averageGardenHealth: 80, // MVP mock
      startingGardenHealth: 80,
      endingGardenHealth: 80,
      xpEarned: estimatedXp,
      coinsEarned: Math.round(estimatedXp / 5),
      coinsSpent: 0,
      plantsGrownCount: plantsGrown,
      plantsRecoveredCount: 0,
      plantsRestartedCount: 0,
      plantsDeadCount: plantsAtRisk,
      bestHabitId: bestHabitId || undefined,
      habitNeedingCareId: needsCareId || undefined,
      bestCategoryId: bestCategoryId || undefined,
      bestStreakCount: 0,
      summaryLabel: monthLabel,
      supportiveMessage: insightMessage,
      dailyBreakdown,
      habitPerformance,
      bestHabit: bestHabit || null,
      needsCareHabit: needsCareHabit || null,
    };

    return report;
  }, [logs, habits, monthsAgo, activeRestMode]);

  if (habits.length === 0) {
    return (
      <div className="bg-surface-card p-12 shadow-md rounded-[var(--radius-card)] text-center flex flex-col items-center justify-center">
        <Leaf className="w-12 h-12 text-muted-text mb-6" />
        <h2 className="text-xl font-display font-bold text-primary-anchor mb-2">Your garden is empty.</h2>
        <p className="text-secondary-text font-mono text-xs tracking-widest uppercase">Plant your first habit seed to start growing.</p>
      </div>
    );
  }

  const BestHabitIcon = reportData.bestHabit ? ((LucideIcons as any)[reportData.bestHabit.icon] || LucideIcons.Activity) : null;
  const CareHabitIcon = reportData.needsCareHabit ? ((LucideIcons as any)[reportData.needsCareHabit.icon] || LucideIcons.Activity) : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-card p-6 shadow-md rounded-[var(--radius-card)] relative">
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-seafoam/40" />
         <div>
            <h2 className="text-2xl font-bold font-display text-primary-anchor">{reportData.summaryLabel}</h2>
            <p className="text-accent-seafoam font-mono text-[10px] tracking-widest uppercase">
              {format(new Date(reportData.startDate), "MMMM yyyy")} {reportData.isFinalized ? "(Final Report)" : "(Month still growing)"}
            </p>
         </div>
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setMonthsAgo(prev => prev + 1)}
              className="p-2 bg-surface-alt hover:bg-surface-alt/70 text-secondary-text transition-colors rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-muted-text w-28 text-center">
              {monthsAgo === 0 ? "CURRENT MONTH" : `${monthsAgo} MO AGO`}
            </span>
            <button 
              onClick={() => setMonthsAgo(prev => Math.max(0, prev - 1))}
              disabled={monthsAgo === 0}
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
             {reportData.totalCompletedInstances} <span className="text-sm text-secondary-text">/ {reportData.totalScheduledInstances}</span>
          </div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Habits Built</div>
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center relative">
          <Trophy className="w-5 h-5 text-accent-mustard mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">{reportData.perfectGardenDays}</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Perfect Days</div>
          {reportData.restDays > 0 && <div className="absolute top-2 right-2 text-accent-periwinkle text-[10px] font-mono flex gap-1 items-center"><Moon className="w-3 h-3"/> {reportData.restDays} rested</div>}
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center">
          <Droplets className="w-5 h-5 text-accent-seafoam mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">~{Math.round(reportData.xpEarned)}</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">XP Earned</div>
        </div>
        <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex flex-col items-center text-center">
          <CheckCircle2 className="w-5 h-5 text-accent-seafoam mb-2 opacity-80" />
          <div className="text-2xl font-bold text-primary-anchor mb-1">{Math.round(reportData.completionPercentage)}%</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-muted-text">Completion</div>
        </div>
      </div>

      {/* Highlights */}
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
              Your "{reportData.bestHabit.name}" plant grew strongly this month.
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
                <div className="text-[10px] font-mono tracking-widest text-accent-coral uppercase">Plant Needing Support</div>
                <div className="text-lg font-bold text-primary-anchor">{reportData.needsCareHabit.name}</div>
              </div>
            </div>
            <p className="text-sm text-secondary-text">
              Completed {reportData.habitPerformance[reportData.needsCareHabit.id].completed} / {reportData.habitPerformance[reportData.needsCareHabit.id].scheduled} times.
              Try a smaller step or gentler routine next month.
            </p>
            <div className="mt-4 flex gap-2">
              <button className="text-[10px] uppercase font-mono tracking-widest bg-accent-coral/10 text-accent-coral px-3 py-1 rounded hover:bg-accent-coral/20 transition-colors">Make Easier</button>
            </div>
          </div>
        )}
      </div>

      {/* Best Category (if any) */}
      {reportData.bestCategoryId && CATEGORIES[reportData.bestCategoryId as keyof typeof CATEGORIES] && (
         <div className="bg-surface-card p-6 shadow-sm rounded-[var(--radius-card)] flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-accent-seafoam/10 text-accent-seafoam rounded-full">
                 <Leaf className="w-5 h-5 text-accent-seafoam" />
               </div>
               <div>
                  <div className="text-[10px] font-mono tracking-widest text-muted-text uppercase">Best Category</div>
                  <div className="text-lg font-bold text-primary-anchor">{CATEGORIES[reportData.bestCategoryId as keyof typeof CATEGORIES].name}</div>
               </div>
            </div>
            <div className="text-sm text-secondary-text">
              Your {CATEGORIES[reportData.bestCategoryId as keyof typeof CATEGORIES].name} garden was strong this month.
            </div>
         </div>
      )}

      {/* Monthly Heatmap */}
      <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)] overflow-x-auto">
        <h3 className="text-xs font-mono tracking-widest text-muted-text uppercase mb-6">Monthly Calendar Heatmap</h3>
        <div className="flex gap-2 mb-4">
           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="w-10 text-center text-[9px] font-mono text-muted-text uppercase">{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Pad the beginning of the month */}
          {Array.from({ length: new Date(reportData.startDate).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}
          {reportData.dailyBreakdown.map((day, i) => {
            const isFuture = isBefore(startOfDay(new Date()), day.date) && !isSameDay(startOfDay(new Date()), day.date);
            const isToday = isSameDay(startOfDay(new Date()), day.date);
            const rate = day.scheduled > 0 ? day.completed / day.scheduled : 0;
            
            let bgColor = "bg-surface-alt/5 border border-surface-alt";
            if (day.isRestDay) bgColor = "bg-accent-periwinkle/30 border border-accent-periwinkle/50";
            else if (!isFuture && day.scheduled > 0) {
              if (rate >= 0.8) bgColor = "bg-accent-seafoam shadow-sm";
              else if (rate >= 0.5) bgColor = "bg-accent-mustard shadow-sm";
              else if (rate > 0) bgColor = "bg-accent-coral";
              else bgColor = "bg-accent-coral/50";
            } else if (!isFuture && day.scheduled === 0) {
              bgColor = "bg-transparent border border-surface-alt";
            }
            
            if (isToday) {
               bgColor += " ring-2 ring-white/50 ring-offset-2 ring-offset-[#090b10]";
            }

            return (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-sm ${bgColor} flex items-center justify-center relative group`}
                title={format(day.date, "MMM d")}
              >
                  {day.isRestDay && <Moon className="w-4 h-4 text-accent-periwinkle" />}
                  {day.isPerfect && !isFuture && !day.isRestDay && <Trophy className="w-4 h-4 text-white drop-shadow-md" />}
                  <div className="absolute opacity-0 group-hover:opacity-100 bg-[#090b10] border border-surface-alt text-white text-[10px] font-mono px-2 py-1 rounded bottom-full mb-1 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                     {format(day.date, "MMM d")}: {!isFuture ? (day.isRestDay ? 'Rest' : `${day.completed}/${day.scheduled}`) : '-'}
                  </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Notes & Next Month Focus */}
      <div className="bg-surface-card p-8 shadow-md rounded-[var(--radius-card)] relative">
         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-seafoam/40" />
         
         <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="md:w-1/2">
               <h3 className="text-lg font-bold text-primary-anchor mb-2">{reportData.supportiveMessage}</h3>
               {reportData.plantsDeadCount > 0 ? (
                  <p className="text-sm text-secondary-text mb-2">Some plants may need a fresh start. You can restart with a new seed anytime.</p>
               ) : (
                  <p className="text-sm text-secondary-text mb-2">No plants needed a fresh start this month.</p>
               )}
            </div>
            
            <div className="md:w-1/2 bg-surface-alt p-4 rounded-xl border border-accent-seafoam/20">
               <h3 className="text-[10px] font-mono tracking-widest text-accent-seafoam uppercase mb-3">Next Month Focus</h3>
               <ul className="space-y-2 text-sm text-secondary-text">
                  {reportData.needsCareHabit ? (
                    <li>• Try a smaller version for <span className="font-bold text-white">{reportData.needsCareHabit.name}</span>.</li>
                  ) : (
                    <li>• Keep <span className="font-bold text-white">{reportData.bestHabit?.name || 'growing'}</span> strong.</li>
                  )}
                  {reportData.restDays > 0 ? (
                    <li>• Good job using rest days to protect your garden.</li>
                  ) : (
                    <li>• Focus on 3 Perfect Garden Days next month.</li>
                  )}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
});
