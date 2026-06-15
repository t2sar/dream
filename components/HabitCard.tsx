import React from "react";
import {
  Check,
  Flame,
  Trash2,
  Sprout,
  Flower,
  TreeDeciduous,
  Crown,
  Droplets,
} from "lucide-react";
import { Habit } from "../types";
import { CATEGORIES } from "../categories";
import { PlantIcon } from "./PlantIcon";
import * as LucideIcons from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  isSlipped?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeDifficulty?: (id: string, difficulty: 'easy'|'medium'|'hard') => void;
  onSlip?: (id: string) => void;
  undoSlip?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = React.memo(({
  habit,
  isCompleted,
  isSlipped,
  onToggle,
  onDelete,
  onChangeDifficulty,
  onSlip,
  undoSlip,
  onArchive,
}) => {
  const IconComponent =
    (LucideIcons as any)[habit.icon] || LucideIcons.Activity;

  // Category mapping
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "health":
        return {
          bg: "bg-gradient-to-tr from-[#E01E37] to-[#7B2CBF]",
          glow: "shadow-[0_0_25px_rgba(224,30,55,0.45)]",
          textColor: "text-[#E01E37]",
          label: "KINETIC CORE",
          borderColor: "border-[#E01E37]/35",
          sparkName: "KINETIC CORE",
        };
      case "productivity":
        return {
          bg: "bg-gradient-to-tr from-[#00F5D4] to-[#3A0CA3]",
          glow: "shadow-[0_0_25px_rgba(0,245,212,0.45)]",
          textColor: "text-[#00F5D4]",
          label: "DEEP WORK CORE",
          borderColor: "border-[#00F5D4]/35",
          sparkName: "DEEP WORK CORE",
        };
      case "learning":
        return {
          bg: "bg-gradient-to-tr from-[#F59E0B] to-[#10B981]",
          glow: "shadow-[0_0_25px_rgba(245,158,11,0.45)]",
          textColor: "text-[#F59E0B]",
          label: "GOLDEN SAGE CORE",
          borderColor: "border-[#F59E0B]/35",
          sparkName: "GOLDEN SAGE CORE",
        };
      case "mindfulness":
        return {
          bg: "bg-gradient-to-tr from-[#FF007F] to-[#3A0CA3]",
          glow: "shadow-[0_0_25px_rgba(255,0,127,0.45)]",
          textColor: "text-[#FF007F]",
          label: "CYBER ORCHID CORE",
          borderColor: "border-[#FF007F]/35",
          sparkName: "CYBER ORCHID CORE",
        };
      default:
        return {
          bg: "bg-gradient-to-tr from-[#F59E0B] to-[#D97706]",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.30)]",
          textColor: "text-[#F59E0B]",
          label: "RAW TITANIUM",
          borderColor: "border-[#F59E0B]/30",
          sparkName: "RAW TITANIUM",
        };
    }
  };

  const theme = getCategoryTheme(habit.category);

  const getHealthColor = (health: number) => {
    if (health <= 0) return "text-slate-600";
    if (health < 20) return "text-rose-500";
    if (health < 50) return "text-amber-500";
    if (health < 80) return "text-lime-400";
    return "text-emerald-500";
  };

  const healthColor = getHealthColor(habit.plantHealth ?? 100);

  return (
    <div
      className={`
      relative overflow-hidden group
      p-6 rounded-none border transition-all duration-500 bg-[#0d1017]/40
      ${
        habit.isGolden 
          ? `border-amber-400/50 shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)] bg-amber-900/10`
          : isCompleted
          ? `border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]`
          : "border-white/5 hover:border-white/10 hover:bg-[#121620]/40"
      }
    `}
    >
      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-[100px] transition-opacity duration-1000 pointer-events-none ${isCompleted ? "opacity-30 bg-cyan-400" : "opacity-0"}`}
      />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if ("vibrate" in navigator) {
                  navigator.vibrate(50);
                }
                if (isSlipped && undoSlip) undoSlip(habit.id);
                // Can't toggle complete if currently slipped without undoing first, but we handle that logic in parent maybe or here
                if (!isSlipped) onToggle(habit.id);
              }}
              className={`
                relative w-12 h-12 rounded-none flex items-center justify-center transition-all duration-500 group/btn border
                ${
                  isCompleted
                    ? habit.type === 'avoid' ? "bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.45)] border-emerald-500 text-emerald-400 scale-105" : "bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.45)] border-blue-500 text-blue-400 scale-105"
                    : "bg-transparent text-slate-500 border-white/20 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10"
                }
                ${isSlipped ? "opacity-30 cursor-not-allowed" : ""}
              `}
              title={isCompleted ? (habit.type === 'avoid' ? "Protected today" : "Watered today") : (habit.type === 'avoid' ? "Protect Plant" : "Water Plant")}
              disabled={isSlipped}
            >
              <Check
                className={`w-6 h-6 transition-all duration-500 ${isCompleted ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
                strokeWidth={3}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isCompleted ? "scale-0 opacity-0 animate-pulse" : "scale-100 opacity-100"}`}
              >
                {habit.type === 'avoid' ? (
                   <LucideIcons.Shield className="w-5 h-5 opacity-70 group-hover/btn:opacity-100" strokeWidth={1.5} />
                ) : (
                   <Droplets className="w-5 h-5 opacity-70 group-hover/btn:opacity-100 animate-pulse" strokeWidth={1.5} />
                )}
              </div>
            </button>
            
            {habit.type === 'avoid' && (
               <button
                 onClick={() => {
                   if ("vibrate" in navigator) {
                     navigator.vibrate(50);
                   }
                   if (isSlipped && undoSlip) {
                      undoSlip(habit.id);
                   } else if (!isSlipped && onSlip && !isCompleted) {
                      onSlip(habit.id);
                   }
                 }}
                 disabled={isCompleted}
                 className={`text-[9px] font-mono tracking-widest uppercase transition-colors px-1 py-1 border ${
                   isCompleted ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600' : 
                   isSlipped ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-transparent text-slate-500 border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                 }`}
               >
                 {isSlipped ? "Recover" : "Slipped"}
               </button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <PlantIcon 
                plantType={habit.plantType} 
                stage={habit.plantStage} 
                status={habit.plantStatus} 
                isPrivate={habit.isPrivate} 
                health={habit.plantHealth}
                isLegendary={habit.isLegendary} 
                isArchived={habit.isArchived} 
                isGolden={habit.isGolden}
                className="w-10 h-10" 
              />
              <h3
                className={`font-display text-xl tracking-tight font-medium transition-colors duration-300 ${isCompleted ? "text-white" : "text-slate-200"}`}
              >
                {habit.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {CATEGORIES[habit.category] && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-zinc-950/60 px-2.5 py-1 uppercase border border-white/5 text-slate-400">
                  {React.createElement(CATEGORIES[habit.category].icon, { className: "w-3 h-3 text-slate-400" })}
                  <span>{CATEGORIES[habit.category].name}</span>
                </div>
              )}

              {habit.difficulty && (
                <div className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-zinc-950/60 px-2.5 py-1 uppercase border ${
                  habit.difficulty === 'easy' ? 'text-emerald-400 border-emerald-400/20' : 
                  habit.difficulty === 'medium' ? 'text-amber-400 border-amber-400/20' : 
                  'text-rose-400 border-rose-400/20'
                }`}>
                  <span className="text-xs">
                    {habit.difficulty === 'easy' ? '🍃' : habit.difficulty === 'medium' ? '💧' : '🔥'}
                  </span>
                  <span>{habit.difficulty}</span>
                </div>
              )}

              <span
                className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-500 ${healthColor}`}
              >
                {habit.plantStatus || "Healthy"} ({habit.plantHealth ?? 100}%)
              </span>

              <span
                className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-500 flex items-center gap-1.5 ${isCompleted ? theme.textColor : "text-slate-500"}`}
                style={{
                  textShadow: isCompleted ? "0 0 15px currentColor" : "none",
                }}
              >
                <Sprout className="w-3.5 h-3.5" />
                {habit.plantStage || "Seed"} ({habit.xp ?? ((habit.totalCompletions || 0) * 10)} XP)
              </span>

              {habit.streak > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                    <Flame
                      className={`w-3.5 h-3.5 fill-current ${isCompleted ? "animate-pulse" : ""}`}
                    />
                    {habit.streak} Day Streak
                  </span>
                  {(() => {
                    const tiers = [5, 14, 21, 30];
                    const nextTier = tiers.find(t => t > habit.streak);
                    if (!nextTier) return null;
                    const prevTier = [...tiers].reverse().find(t => t <= habit.streak) || 0;
                    const progress = Math.max(0, habit.streak - prevTier);
                    const required = nextTier - prevTier;
                    const percent = (progress / required) * 100;
                    
                    return (
                      <div className="flex items-center gap-1.5 w-full pr-2">
                        <div className="flex-1 bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/10 min-w-[50px]">
                           <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">Tier {nextTier}</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {habit.bestStreak && habit.bestStreak > 0 ? (
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 rounded-sm" title="Peak Consistency">
                  <Crown className="w-3 h-3" />
                  Best: {habit.bestStreak}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onChangeDifficulty && (
             <select
               value={habit.difficulty || 'medium'}
               onChange={(e) => onChangeDifficulty(habit.id, e.target.value as any)}
               className="bg-transparent text-[10px] uppercase font-mono tracking-widest text-slate-500 hover:text-white border border-transparent hover:border-white/20 p-2 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
               title="Change Difficulty"
             >
               <option value="easy">Easy 🍃</option>
               <option value="medium">Medium 💧</option>
               <option value="hard">Hard 🔥</option>
             </select>
          )}
          {onArchive && (
            <button
              onClick={() => onArchive(habit.id)}
              className="p-3 text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-indigo-500/20 hover:bg-indigo-500/5 rounded-none"
              title="Archive to Garden History"
            >
              <LucideIcons.Archive className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-3 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-none border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
