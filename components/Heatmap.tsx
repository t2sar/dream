import React from "react";
import { format, addDays, eachDayOfInterval } from "date-fns";
import { HabitLog } from "../types";

interface HeatmapProps {
  logs: HabitLog;
  days?: number;
}

export const Heatmap: React.FC<HeatmapProps> = React.memo(({ logs, days = 90 }) => {
  const today = new Date();
  const startDate = addDays(today, -days);

  const dateRange = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  const getIntensity = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const completedCount = logs[dateStr]?.length || 0;

    if (completedCount === 0) return "bg-surface-alt/20";
    if (completedCount <= 1)
      return "bg-emerald-900/40 border border-emerald-800/40";
    if (completedCount <= 3)
      return "bg-emerald-500/60 border border-emerald-400/50 shadow-[0_0_6px_rgba(16,185,129,0.25)]";
    return "bg-[#4ade80] border border-[#4ade80]/40 shadow-[0_0_10px_rgba(74,222,128,0.45)]";
  };

  return (
    <div className="bg-surface-soft p-6 md:p-8 rounded-[32px] border border-surface-alt shadow-sm relative overflow-x-auto">
      <h3 className="text-sm font-bold tracking-wide uppercase text-secondary-text mb-6 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-status-healthy"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Consistency Heatmap Matrix
      </h3>
      <div className="flex gap-1.5 min-w-max">
        {Array.from({ length: Math.ceil(dateRange.length / 7) }).map(
          (_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5">
              {dateRange.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => (
                <div
                  key={date.toISOString()}
                  title={`${format(date, "MMM do")}: ${logs[format(date, "yyyy-MM-dd")]?.length || 0} habits`}
                  className={`w-3.5 h-3.5 rounded-[2px] transition-all hover:scale-125 hover:z-10 cursor-crosshair ${getIntensity(date)}`}
                />
              ))}
            </div>
          ),
        )}
      </div>
      <div className="flex items-center gap-3 mt-6 text-[10px] font-bold text-muted-text uppercase tracking-widest justify-end">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-[2px] bg-surface-alt/20" />
        <div className="w-3.5 h-3.5 rounded-[2px] bg-emerald-900/40 border border-emerald-800/40" />
        <div className="w-3.5 h-3.5 rounded-[2px] bg-emerald-500/60 border border-emerald-400/50" />
        <div className="w-3.5 h-3.5 rounded-[2px] bg-[#4ade80]" />
        <span>More</span>
      </div>
    </div>
  );
});
