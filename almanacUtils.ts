import { HabitLog, Habit, UserStats, AlmanacData } from './types';
import { format } from 'date-fns';

export function isAlmanacSeason(date: Date): boolean {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 11 = Dec
  const day = date.getDate();
  
  // Dec 26 - Dec 31
  if (month === 11 && day >= 26) return true;
  // Jan 1 - Jan 31
  if (month === 0) return true;
  
  return false;
}

export function getAlmanacYear(date: Date): string {
  if (date.getMonth() === 0) {
    return (date.getFullYear() - 1).toString();
  }
  return date.getFullYear().toString();
}

export function generateAlmanac(
  year: string,
  logs: HabitLog,
  habits: Habit[],
  stats: Partial<UserStats>
): AlmanacData | null {
  // Compute total checkins in the year
  let totalCheckins = 0;
  const completionsPerHabit: Record<string, number> = {};
  const completionsPerMonth: Record<string, number> = {};

  const yearPrefix = year + '-';

  Object.entries(logs).forEach(([dateStr, habitIds]) => {
    if (dateStr.startsWith(yearPrefix)) {
      totalCheckins += habitIds.length;
      
      const monthPrefix = dateStr.substring(0, 7); // YYYY-MM
      completionsPerMonth[monthPrefix] = (completionsPerMonth[monthPrefix] || 0) + habitIds.length;

      habitIds.forEach(id => {
        completionsPerHabit[id] = (completionsPerHabit[id] || 0) + 1;
      });
    }
  });

  if (totalCheckins < 10) return null; // Eligibility

  // Best streak - from current habits, since we might not have historical streak logs
  let bestStreakDays = 0;
  let bestStreakHabitName = "A habit";
  let bestStreakIcon = "Activity";
  
  habits.forEach(h => {
    const s = h.bestStreak || h.streak || 0;
    if (s > bestStreakDays) {
      bestStreakDays = s;
      bestStreakHabitName = h.name;
      bestStreakIcon = h.icon || "Activity";
    }
  });

  // Top Habit
  let topHabitId = "";
  let maxCompletions = 0;
  Object.entries(completionsPerHabit).forEach(([id, count]) => {
    if (count > maxCompletions) {
      maxCompletions = count;
      topHabitId = id;
    }
  });

  const topHabitObj = habits.find(h => h.id === topHabitId);
  const topHabit = {
    name: topHabitObj?.name || 'A forgotten habit',
    fruit: topHabitObj?.plantType?.split(' / ')[0] || 'Plant',
    icon: topHabitObj?.icon || 'Leaf',
    count: maxCompletions
  };

  // Rhythm
  const eveComps = stats.eveningCompletions || 0;
  const nightComps = stats.nightCompletions || 0;
  
  let label = "Dupurer Mali";
  let percent = 50;

  if (stats.matchTimeOfDay !== false) {
     if (eveComps > 0 || nightComps > 0) {
        label = "Nishachor";
        percent = Math.min(100, Math.max(30, Math.round(((eveComps + nightComps) / Math.max(1, totalCheckins)) * 100)));
     } else {
        label = "Bhorer Pakhi";
        percent = 60 + Math.round(Math.random() * 20); // 60-80%
     }
  }

  // Busiest month
  let busiestMonthStr = '???';
  let maxMonthCount = -1;
  Object.entries(completionsPerMonth).forEach(([monthPrefix, count]) => {
     if (count > maxMonthCount) {
       maxMonthCount = count;
       busiestMonthStr = monthPrefix;
     }
  });
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let busiestMonth = "A good month";
  if (busiestMonthStr.includes('-')) {
     const mIndex = parseInt(busiestMonthStr.split('-')[1]) - 1;
     if (mIndex >= 0 && mIndex < 12) busiestMonth = monthNames[mIndex];
  }

  // Harvest
  const plantsGrown = habits.filter(h => h.plantStage === 'Fruiting Plant' || h.plantStage === 'Mature Plant').length;
  const harvests = stats.orchard?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const badges = stats.badges?.length || 0;
  const companions = stats.companions?.length || 0;

  // Comebacks
  const comebacks = Object.values(stats.slipLogs || {}).flat().length || 0;

  return {
    year,
    totalCheckins,
    bestStreak: { days: bestStreakDays, habitName: bestStreakHabitName, icon: bestStreakIcon },
    topHabit,
    rhythm: { label, percent, busiestMonth },
    harvest: { plantsGrown, harvests, badges, companions },
    comebacks,
    computedAt: new Date().toISOString()
  };
}
