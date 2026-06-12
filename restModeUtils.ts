import { isWithinInterval, parseISO, isSameDay } from 'date-fns';
import { RestMode, Habit, RestScopeType } from './types';

export const isDateInRestMode = (date: string, restMode: RestMode | null): boolean => {
  if (!restMode || !restMode.isActive) return false;
  
  const targetDate = parseISO(date);
  const startDate = parseISO(restMode.startDate);
  // end date might be same as start or later
  const endDate = parseISO(restMode.endDate);
  
  // Normalize time for fair comparison
  const t = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  return t >= s && t <= e;
};

export const isHabitPaused = (habitId: string, date: string, restMode: RestMode | null): boolean => {
  if (!isDateInRestMode(date, restMode)) return false;
  
  if (restMode!.scopeType === RestScopeType.ALL_HABITS) {
    return true;
  }
  
  return restMode!.habitIds?.includes(habitId) ?? false;
};
