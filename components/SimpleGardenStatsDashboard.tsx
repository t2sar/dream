import React, { useState, useMemo } from 'react';
import { Habit, HabitLog, UserStats, SimpleStatsDashboardSummary, DashboardSettings, DashboardHighlight, Tab } from '../types';
import * as LucideIcons from 'lucide-react';
import { Leaf, Award, Star, Activity, Flame, Coins, CheckCircle2, TrendingUp, HeartPulse, Target, ShieldCheck, HeartHandshake } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format, parseISO } from 'date-fns';

interface SimpleGardenStatsDashboardProps {
  habits: Habit[];
  logs: HabitLog;
  stats: Partial<UserStats>;
  setActiveTab: (tab: Tab) => void;
  userName: string;
}

const defaultSettings: DashboardSettings = {
  dashboardEnabled: true,
  defaultPeriod: 'this_week',
  showSensitiveHabitNames: false,
  showGardenHealth: true,
  showCoins: true,
  showXP: true,
  showSuggestions: true,
  showRecentHighlights: true,
  maxHighlightCards: 5,
  refreshDashboardOnAppOpen: true,
  useCachedDashboardOnly: true,
};

const SENSITIVE_CATEGORIES = ['health', 'finance', 'bad_habit', 'prayer', 'self_care', 'mood', 'journal', 'medicine'];

export const SimpleGardenStatsDashboard = React.memo(function SimpleGardenStatsDashboard({ habits, logs, stats, setActiveTab, userName }: SimpleGardenStatsDashboardProps) {
  const [period, setPeriod] = useState<'this_week' | 'this_month' | 'all_time'>(defaultSettings.defaultPeriod);

  // Compute stats based on period
  // For MVP, we derive from raw data to keep it simple as we don't have a background cron cache.
  
  const computedSummary = useMemo<SimpleStatsDashboardSummary>(() => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === 'this_week') {
      startDate = startOfWeek(today, { weekStartsOn: 1 });
      endDate = endOfWeek(today, { weekStartsOn: 1 });
    } else if (period === 'this_month') {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
    } else {
      startDate = new Date(2000, 0, 1);
      endDate = today;
    }

    const activeHabits = habits.filter(h => !h.isArchived);
    
    let completedInPeriod = 0;
    let buildCompletions = 0;
    let avoidProtections = 0;
    
    // Total lifetime habits completed
    const lifetimeCompleted = Object.values(logs).reduce((acc, curr) => acc + curr.length, 0);

    const categoryCounts: Record<string, { total: number; completed: number }> = {};

    Object.entries(logs).forEach(([dateStr, habitIds]) => {
      const logDate = parseISO(dateStr);
      const inRange = isWithinInterval(logDate, { start: startDate, end: endDate });
      
      if (inRange) {
        completedInPeriod += habitIds.length;
        habitIds.forEach(id => {
          const habit = habits.find(h => h.id === id);
          if (habit) {
            if (habit.type === 'avoid') avoidProtections++;
            else buildCompletions++;
            
            if (!categoryCounts[habit.category]) {
              categoryCounts[habit.category] = { total: 0, completed: 0 };
            }
            categoryCounts[habit.category].completed++;
          }
        });
      }
    });

    // We don't have accurate historical schedules in MVP, so best category is based on raw completions for now
    let bestCat = '';
    let bestCatScore = 0;
    Object.entries(categoryCounts).forEach(([cat, counts]) => {
      if (counts.completed > bestCatScore) {
        bestCatScore = counts.completed;
        bestCat = cat;
      }
    });

    let currentBestStreak = 0;
    let currentBestStreakHabitId = undefined;
    activeHabits.forEach(h => {
      if (h.streak > currentBestStreak) {
        currentBestStreak = h.streak;
        currentBestStreakHabitId = h.id;
      }
    });

    const plantHealthSum = activeHabits.reduce((acc, h) => acc + (h.plantHealth || 100), 0);
    const avgHealth = activeHabits.length > 0 ? Math.round(plantHealthSum / activeHabits.length) : 100;
    
    let healthLabel: 'Excellent' | 'Healthy' | 'Needs Care' | 'Wilting' | 'Critical' = 'Healthy';
    if (avgHealth >= 90) healthLabel = 'Excellent';
    else if (avgHealth >= 75) healthLabel = 'Healthy';
    else if (avgHealth >= 50) healthLabel = 'Needs Care';
    else if (avgHealth >= 25) healthLabel = 'Wilting';
    else healthLabel = 'Critical';

    // Simple approximations for MVP period data
    const xpEarned = period === 'all_time' ? (stats.xp || 0) : Math.round((completedInPeriod / lifetimeCompleted) * (stats.xp || 0) || completedInPeriod * 10);
    const coinsEarned = period === 'all_time' ? Math.floor(stats.coins || 0) : Math.round((completedInPeriod / lifetimeCompleted) * (stats.coins || 0) || completedInPeriod * 2);

    return {
      id: `summary-${period}-${Date.now()}`,
      periodType: period,
      periodStartDate: startDate.toISOString(),
      periodEndDate: endDate.toISOString(),
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalHabitsCompleted: lifetimeCompleted,
      totalPlantCareActions: lifetimeCompleted,
      buildHabitCompletions: buildCompletions,
      avoidHabitProtections: avoidProtections,
      currentBestStreak,
      currentBestStreakHabitId,
      currentBestStreakType: 'scheduled',
      bestCategoryId: bestCat,
      bestCategoryCompletionPercentage: bestCat ? 88 : 0, // Mocked percentage for MVP
      gardenHealthScore: avgHealth,
      gardenHealthLabel: healthLabel,
      xpEarned,
      coinsEarned,
      currentCoinBalance: Math.floor(stats.coins || 0),
      plantsGrownCount: period === 'all_time' ? (stats.plantsFruitedCount || 0) : (stats.plantsFruitedCount ? Math.min(stats.plantsFruitedCount, 2) : 0),
      plantsRecoveredCount: period === 'all_time' ? (stats.plantsRevived || 0) : (stats.plantsRevived ? Math.min(stats.plantsRevived, 1) : 0),
      perfectGardenDays: period === 'all_time' ? (stats.perfectGardenDays || 0) : (stats.perfectGardenDays ? Math.min(stats.perfectGardenDays, completedInPeriod > 0 ? 1 : 0) : 0),
      restDays: 0,
      trophyPlantsAdded: period === 'all_time' ? habits.filter(h => h.isArchived).length : Math.min(habits.filter(h => h.isArchived).length, 1),
      legendaryPlantsCount: habits.filter(h => h.isLegendary).length,
    };
  }, [period, habits, logs, stats]);

  const bestHabit = habits.find(h => h.id === computedSummary.currentBestStreakHabitId);
  const isBestHabitSensitive = bestHabit && SENSITIVE_CATEGORIES.includes(bestHabit.category);
  const bestHabitDisplay = isBestHabitSensitive && !defaultSettings.showSensitiveHabitNames ? 'Private Plant' : (bestHabit?.name || 'Your Garden');

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="glass p-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-xl font-display font-bold text-white mb-1">Your Garden Progress</h2>
          <p className="text-slate-400 text-sm mb-4">Small steps are growing your garden.</p>
          
          <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-[#00F5D4]">
            <div className="flex items-center gap-1.5"><Star className="w-4 h-4" /> Lvl {stats.level || 1} • {stats.rank || 'Seedling'}</div>
            <div className="flex items-center gap-1.5"><HeartPulse className="w-4 h-4" /> {computedSummary.gardenHealthLabel}</div>
            <div className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {stats.xp || 0} XP</div>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex bg-[#0d1017] p-1 rounded border border-surface-alt mx-auto w-fit">
        {(['this_week', 'this_month', 'all_time'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-colors rounded ${period === p ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            {p.replace('_', ' ')}
          </button>
        ))}
      </div>

      {computedSummary.totalHabitsCompleted === 0 && (
         <div className="glass p-8 text-center flex flex-col items-center">
            <Leaf className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Your garden is just starting.</h3>
            <p className="text-slate-400 text-sm mb-6">Stats will appear as you care for plants.</p>
            <button
               onClick={() => setActiveTab(Tab.TRACKER)}
               className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-mono tracking-widest uppercase text-xs transition-colors"
            >
               Water your first plant
            </button>
         </div>
      )}

      {computedSummary.totalHabitsCompleted > 0 && (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Total Habits Completed */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.TRACKER)}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Completed</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.totalHabitsCompleted}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">All-time plant care</p>
            </div>

            {/* Current Best Streak */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.TRACKER)}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Best Streak</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.currentBestStreak}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">{bestHabitDisplay}</p>
            </div>

            {/* Best Category */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Best Category</span>
              </div>
              <div className="text-base sm:text-xl font-display font-bold text-white mb-1 truncate">
                 {computedSummary.bestCategoryId ? (SENSITIVE_CATEGORIES.includes(computedSummary.bestCategoryId) && !defaultSettings.showSensitiveHabitNames ? 'Private Category' : computedSummary.bestCategoryId) : 'No data'}
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">{period.replace('_', ' ')}</p>
            </div>

            {/* Garden Health */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.TRACKER)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <HeartPulse className="w-4 h-4 text-pink-400" />
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Health</span>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                 <div className="text-2xl sm:text-3xl font-display font-bold text-white leading-none">{computedSummary.gardenHealthScore}%</div>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden mb-1">
                 <div className="bg-gradient-to-r from-pink-500 to-emerald-400 h-full" style={{ width: `${computedSummary.gardenHealthScore}%` }} />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">{computedSummary.gardenHealthLabel}</p>
            </div>

            {/* XP */}
            <div className="glass p-4 sm:p-5 border border-surface-alt">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">XP</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.xpEarned}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">{period.replace('_', ' ')}</p>
            </div>

            {/* Coins */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.SHOP)}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Coins</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.coinsEarned}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">Bal: {computedSummary.currentCoinBalance}</p>
            </div>
            
            {/* Plants Grown */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.TROPHY)}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Grown</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.plantsGrownCount}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">{period.replace('_', ' ')}</p>
            </div>

            {/* Perfect Days */}
            <div className="glass p-4 sm:p-5 border border-surface-alt active:scale-95 transition-transform" onClick={() => setActiveTab(Tab.CALENDAR)}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest truncate">Perfect Days</span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{computedSummary.perfectGardenDays}</div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase truncate">Small progress counts.</p>
            </div>
          </div>

          {/* Plant Growth Summary */}
          {period !== 'this_week' && period !== 'this_month' && (
             <div className="glass p-5 border border-surface-alt mt-6">
                <h3 className="text-white font-bold mb-4 font-display text-lg">Garden Growth</h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                         <Leaf className="w-4 h-4 text-emerald-400" />
                         <span>Plants completely grown</span>
                      </div>
                      <span className="font-mono text-[#00F5D4]">{computedSummary.plantsGrownCount}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                         <HeartHandshake className="w-4 h-4 text-pink-400" />
                         <span>Plants recovered</span>
                      </div>
                      <span className="font-mono text-[#00F5D4]">{computedSummary.plantsRecoveredCount}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                         <Award className="w-4 h-4 text-yellow-500" />
                         <span>Trophy plants</span>
                      </div>
                      <span className="font-mono text-[#00F5D4]">{computedSummary.trophyPlantsAdded}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                         <Star className="w-4 h-4 text-indigo-400" />
                         <span>Legendary plants</span>
                      </div>
                      <span className="font-mono text-[#00F5D4]">{computedSummary.legendaryPlantsCount}</span>
                   </div>
                </div>
             </div>
          )}

          {/* Gentle Suggestion */}
          <div className="glass p-5 border border-indigo-500/20 mt-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="w-24 h-24 text-indigo-400" />
             </div>
             <div className="relative z-10 flex gap-4 items-start">
                <div className="p-2 bg-indigo-500/20 rounded-full shrink-0">
                   <Leaf className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                   <h4 className="text-white font-bold mb-1">A Gentle Suggestion</h4>
                   <p className="text-sm text-slate-300 leading-relaxed">
                      {computedSummary.gardenHealthScore < 70 
                         ? "Some plants need care, but recovery is possible. Consider a gentle Recovery Plan for your wilting plants." 
                         : "Your garden is growing one step at a time. Keep finding joy in steady progress."}
                   </p>
                </div>
             </div>
          </div>

          {/* Report Links */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => setActiveTab(Tab.REPORT)}
              className="flex-1 px-4 py-3 bg-surface-alt/5 hover:bg-surface-alt/10 text-slate-300 font-mono text-xs tracking-widest uppercase transition-colors border border-surface-alt flex items-center justify-center gap-2"
            >
              <LucideIcons.FileText className="w-4 h-4" />
              View Reports
            </button>
            <button
              onClick={() => setActiveTab(Tab.CALENDAR)}
              className="flex-1 px-4 py-3 bg-surface-alt/5 hover:bg-surface-alt/10 text-slate-300 font-mono text-xs tracking-widest uppercase transition-colors border border-surface-alt flex items-center justify-center gap-2"
            >
              <LucideIcons.CalendarDays className="w-4 h-4" />
              Open Calendar
            </button>
          </div>
        </>
      )}
    </div>
  );
});
