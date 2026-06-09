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

  // Category mapping
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'health':
        return {
          bg: 'bg-gradient-to-tr from-[#E01E37] to-[#7B2CBF]',
          glow: 'shadow-[0_0_25px_rgba(224,30,55,0.45)]',
          textColor: 'text-[#E01E37]',
          label: 'KINETIC CORE',
          borderColor: 'border-[#E01E37]/35',
          sparkName: 'HOT MAGMA // VAPORWAVE'
        };
      case 'productivity':
        return {
          bg: 'bg-gradient-to-tr from-[#00F5D4] to-[#3A0CA3]',
          glow: 'shadow-[0_0_25px_rgba(0,245,212,0.45)]',
          textColor: 'text-[#00F5D4]',
          label: 'DEEP FLOW CORE',
          borderColor: 'border-[#00F5D4]/35',
          sparkName: 'CYBER CYAN // INTELLECT'
        };
      case 'learning':
        return {
          bg: 'bg-gradient-to-tr from-[#F59E0B] to-[#10B981]',
          glow: 'shadow-[0_0_25px_rgba(245,158,11,0.45)]',
          textColor: 'text-[#F59E0B]',
          label: 'GOLDEN SAGE CORE',
          borderColor: 'border-[#F59E0B]/35',
          sparkName: 'GOLDEN SAGE // GROWTH'
        };
      case 'mindfulness':
        return {
          bg: 'bg-gradient-to-tr from-[#FF007F] to-[#3A0CA3]',
          glow: 'shadow-[0_0_25px_rgba(255,0,127,0.45)]',
          textColor: 'text-[#FF007F]',
          label: 'CYBER ORCHID CORE',
          borderColor: 'border-[#FF007F]/35',
          sparkName: 'CYBER ORCHID // REFLECTION'
        };
      default:
        return {
          bg: 'bg-gradient-to-tr from-[#F59E0B] to-[#D97706]',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.30)]',
          textColor: 'text-[#F59E0B]',
          label: 'ANCIENT SECTOR',
          borderColor: 'border-[#F59E0B]/30',
          sparkName: 'MUTED CHROME // RAW'
        };
    }
  };

  const theme = getCategoryTheme(habit.category);

  // Garden Logic matching Plant level
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
      p-6 rounded-none border transition-all duration-500 bg-[#0d1017]/40
      ${isCompleted 
        ? `border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]` 
        : 'border-white/5 hover:border-white/10 hover:bg-[#121620]/40'
      }
    `}>
      
      {/* Absolute Ambient Background Shard Emissive Halo */}
      <div className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-[100px] transition-opacity duration-1000 pointer-events-none ${isCompleted ? 'opacity-30 bg-cyan-400' : 'opacity-0'}`} />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          {/* Sharp, Rectangular toggle/checkbox box */}
          <button
            onClick={() => onToggle(habit.id)}
            className={`
              relative w-12 h-12 rounded-none flex items-center justify-center transition-all duration-500 group/btn border
              ${isCompleted 
                ? `${theme.bg} ${theme.glow} border-white text-zinc-950 scale-105` 
                : 'bg-transparent text-slate-500 border-white/20 hover:border-white/40 hover:text-white'
              }
            `}
          >
            <Check className={`w-6 h-6 transition-all duration-500 ${isCompleted ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} strokeWidth={3} />
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'scale-0 opacity-0 animate-pulse' : 'scale-100 opacity-100'}`}>
                <IconComponent className="w-5 h-5 opacity-70 group-hover/btn:opacity-100" strokeWidth={1.5} />
            </div>
          </button>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-display text-lg tracking-tight font-medium transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-slate-350'}`}>
                {habit.name}
              </h3>
              {habit.streak >= 7 && (
                <div className="p-1 rounded-none bg-white/5 text-amber-400 border border-white/10">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </div>
            
            {/* Extended Monospace Indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00F5D4] bg-zinc-950/60 px-2.5 py-1 uppercase border border-white/5">
                 <span className="font-bold">{theme.sparkName}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{habit.streak} day sync</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onDelete(habit.id)}
            className="p-3 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-none border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
