import React from 'react';
import { Check } from 'lucide-react';

interface DailyGoalRingProps {
  completed: number;
  total: number;
}

export const DailyGoalRing: React.FC<DailyGoalRingProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-6 p-6 rounded-[32px] bg-white/10 border border-surface-alt shadow-lg relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00F5D4]/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#00F5D4"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-[0_0_8px_rgba(0,245,212,0.5)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            {percentage === 100 && total > 0 ? (
               <Check className="w-7 h-7 text-[#00F5D4] drop-shadow-[0_0_8px_rgba(0,245,212,0.5)]" />
            ) : (
               <div className="flex flex-col items-center">
                 <span className="text-xl font-display font-bold text-white leading-none">{completed}</span>
                 <span className="text-[10px] font-mono text-slate-400 mt-1">{total}</span>
               </div>
            )}
        </div>
      </div>
      
      <div className="relative z-10 flex-1" style={{ color: '#ffffff', fontWeight: 'bold' }}>
         <h3 className="font-display font-bold text-lg text-white mb-1 tracking-wide" style={{ color: 'inherit' }}>Daily Goal</h3>
         <p className="text-sm font-medium text-slate-400 leading-relaxed text-balance">
            {total === 0 
              ? "No habits scheduled for today." 
              : percentage === 100 
                 ? "You've completed all your habits today! Outstanding." 
                 : `Completed ${completed} of ${total} habits. Keep the momentum going!`
            }
         </p>
      </div>
    </div>
  );
};
