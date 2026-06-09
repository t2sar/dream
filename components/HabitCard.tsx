import React from 'react';
import { Check, Flame, Trash2, Sprout, Flower, TreeDeciduous, Crown } from 'lucide-react';
import { Habit } from '../types';
import * as LucideIcons from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggle, onDelete }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[habit.icon] || LucideIcons.Activity;

  // Garden Logic: Map streak to plant stage
  const getPlantStage = (streak: number) => {
    if (streak >= 30) return { icon: Crown, color: "text-amber-500", label: "Mastered" };
    if (streak >= 14) return { icon: Flower, color: "text-rose-500", label: "Blooming" };
    if (streak >= 7) return { icon: TreeDeciduous, color: "text-emerald-500", label: "Strong" };
    if (streak >= 3) return { icon: Sprout, color: "text-lime-400", label: "Growing" };
    return { icon: LucideIcons.CircleDashed, color: "text-slate-500", label: "Seed" };
  };

  const Plant = getPlantStage(habit.streak);

  return (
    <div className={`
      relative overflow-hidden group
      p-6 rounded-3xl transition-all duration-500
      ${isCompleted 
        ? 'glass-card border-amber-500/30 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]' 
        : 'glass hover:bg-slate-800/40 border-white/5 hover:border-white/10'
      }
    `}>
      
      {/* Ethereal Glow */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl transition-opacity duration-1000 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onToggle(habit.id)}
            className={`
              relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group/btn
              ${isCompleted 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' 
                : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300 border border-white/5 hover:border-amber-500/30'
              }
            `}
          >
            <Check className={`w-8 h-8 transition-all duration-500 ${isCompleted ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} strokeWidth={3} />
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <IconComponent className="w-7 h-7" strokeWidth={1.5} />
            </div>
          </button>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-medium text-lg tracking-tight transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-slate-200'}`}>
                {habit.name}
              </h3>
              {habit.streak >= 7 && (
                <div className={`p-1 rounded-full ${habit.streak >= 21 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    <Flame className="w-3.5 h-3.5" fill="currentColor" />
                </div>
              )}
            </div>
            
            {/* Garden Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-full border border-white/5">
                 <Plant.icon className={`w-3.5 h-3.5 ${Plant.color}`} strokeWidth={2.5} />
                 <span className={`${Plant.color} tracking-wide uppercase text-[10px]`}>{Plant.label}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">{habit.streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onDelete(habit.id)}
            className="p-3 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:bg-rose-500/10"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};