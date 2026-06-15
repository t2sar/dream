import { Habit, HabitLog } from './types';
import { differenceInCalendarDays, differenceInWeeks, differenceInMonths, isValid, parseISO, startOfWeek, endOfWeek, isWithinInterval, addDays, format } from 'date-fns';

export function isHabitDueToday(habit: Habit): boolean {
  return isHabitDueOnDate(habit, new Date());
}

export function isHabitDueOnDate(habit: Habit, date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  const createdDate = habit.createdAt ? new Date(habit.createdAt) : targetDate;
  
  if (!isValid(createdDate)) return true; // Fallback

  const scheduleType = habit.scheduleType || 'daily';
  
  if (scheduleType === 'daily' || scheduleType === 'quantity') {
    return true; // Needed everyday or can be progressed today
  }

  if (scheduleType === 'specific_days') {
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday
    if (habit.scheduleDays && habit.scheduleDays.length > 0) {
      return habit.scheduleDays.includes(dayOfWeek);
    }
    return true; // Fallback
  }

  if (scheduleType === 'monthly') {
    const currentDay = targetDate.getDate();
    const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    let targetDay = habit.monthlyDay || 1;
    if (targetDay > lastDayOfMonth) targetDay = lastDayOfMonth;
    
    return currentDay === targetDay;
  }

  if (scheduleType === 'weekly' || scheduleType === 'times_per_week' || scheduleType === 'anytime') {
    return true; 
  }

  if (scheduleType === 'custom_interval') {
    const intervalValue = habit.intervalValue || 1;
    const intervalUnit = habit.intervalUnit || 'days';
    
    if (intervalUnit === 'days') {
      const daysDiff = differenceInCalendarDays(targetDate, createdDate);
      return daysDiff >= 0 && daysDiff % intervalValue === 0;
    } else if (intervalUnit === 'weeks') {
      const weeksDiff = differenceInWeeks(targetDate, createdDate);
      return weeksDiff >= 0 && weeksDiff % intervalValue === 0;
    } else if (intervalUnit === 'months') {
      const monthsDiff = differenceInMonths(targetDate, createdDate);
      return monthsDiff >= 0 && monthsDiff % intervalValue === 0;
    }
  }

  return true;
}

// Function to check if a weekly or times_per_week habit is fully completed for the current period
export function isPeriodTargetReached(habit: Habit, logs: HabitLog): boolean {
  const scheduleType = habit.scheduleType || 'daily';
  
  if (scheduleType === 'daily' || scheduleType === 'specific_days' || scheduleType === 'custom_interval' || scheduleType === 'monthly') {
     // Not evaluated across a period usually
     return false;
  }
  
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  
  let targetCount = habit.targetCount || 1;
  if (scheduleType === 'weekly') targetCount = 1;
  
  let completedCount = 0;
  
  for (let i = 0; i < 7; i++) {
     const dateStr = format(addDays(start, i), 'yyyy-MM-dd');
     if (logs[dateStr] && logs[dateStr].includes(habit.id)) {
        completedCount++;
     }
  }
  
  return completedCount >= targetCount;
}

export function getCompletedCountThisWeek(habit: Habit, logs: HabitLog): number {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  
  let completedCount = 0;
  
  for (let i = 0; i < 7; i++) {
     const dateStr = format(addDays(start, i), 'yyyy-MM-dd');
     if (logs[dateStr] && logs[dateStr].includes(habit.id)) {
        completedCount++;
     }
  }
  
  return completedCount;
}
