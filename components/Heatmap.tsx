import React from 'react';
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
    if (completedCount <= 1) return 'bg-violet-950/40 border border-violet-850/40';
    if (completedCount <= 3) return 'bg-violet-600/60 border border-violet-500/50 shadow-[0_0_6px_rgba(123,44,191,0.25)]';
    return 'bg-[#00F5D4] border border-[#00f5d4]/40 shadow-[0_0_10px_rgba(0,245,212,0.45)]';
  };

  return (
    <div className="glass p-8 rounded-none border border-white/5 relative overflow-x-auto">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00F5D4]/40" />
      
      <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F5D4] mb-6 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><rect x="3" y="3" width="18" height="18" rx="0" ry="0"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        CONSISTENCY HEATMAP MATRIX
      </h3>
      <div className="flex gap-1.5 min-w-max">
        {Array.from({ length: Math.ceil(dateRange.length / 7) }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1.5">
            {dateRange.slice(weekIndex * 7, (weekIndex * 7) + 7).map((date) => (
               <div
                key={date.toISOString()}
                title={`${format(date, 'MMM do')}: ${logs[format(date, 'yyyy-MM-dd')]?.length || 0} habits`}
                className={`w-3.5 h-3.5 rounded-none transition-all hover:scale-125 hover:z-10 cursor-crosshair ${getIntensity(date)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6 text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold justify-end">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-none bg-white/5 border border-white/5" />
        <div className="w-3.5 h-3.5 rounded-none bg-violet-950/40 border border-violet-850/40" />
        <div className="w-3.5 h-3.5 rounded-none bg-violet-600/60 border border-violet-500/50" />
        <div className="w-3.5 h-3.5 rounded-none bg-[#00F5D4]" />
        <span>More</span>
      </div>
    </div>
  );
};
