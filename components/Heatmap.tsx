import React, { useState } from 'react';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { HabitLog } from '../types';

interface HeatmapProps {
  logs: HabitLog;
  days?: number;
}

export const Heatmap: React.FC<HeatmapProps> = ({ logs, days = 90 }) => {
  const today = new Date();
  const startDate = addDays(today, -days);
  
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: today
  });

  const getIntensity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = logs[dateStr]?.length || 0;
    
    if (completedCount === 0) return 'bg-white/5';
    if (completedCount <= 2) return 'bg-sky-900/40';
    if (completedCount <= 4) return 'bg-sky-600/60';
    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
  };

  return (
    <div className="glass p-8 rounded-3xl overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        Consistency Heatmap
      </h3>
      <div className="flex gap-1.5 min-w-max">
        {Array.from({ length: Math.ceil(dateRange.length / 7) }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1.5">
            {dateRange.slice(weekIndex * 7, (weekIndex * 7) + 7).map((date) => (
               <div
                key={date.toISOString()}
                title={`${format(date, 'MMM do')}: ${logs[format(date, 'yyyy-MM-dd')]?.length || 0} habits`}
                className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-none ${getIntensity(date)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6 text-[10px] uppercase tracking-wider text-slate-500 font-medium justify-end">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
        <div className="w-3.5 h-3.5 rounded-sm bg-sky-900/40" />
        <div className="w-3.5 h-3.5 rounded-sm bg-sky-600/60" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
        <span>More</span>
      </div>
    </div>
  );
};