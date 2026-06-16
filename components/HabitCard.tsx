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
import * as Tooltip from "@radix-ui/react-tooltip";

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
          bg: "bg-gradient-to-tr from-accent-coral to-accent-blush",
          glow: "shadow-lg shadow-accent-coral/40",
          textColor: "text-accent-coral",
          label: "KINETIC CORE",
          borderColor: "border-accent-coral/35",
          sparkName: "KINETIC CORE",
        };
      case "productivity":
        return {
          bg: "bg-gradient-to-tr from-accent-seafoam to-accent-periwinkle",
          glow: "shadow-lg shadow-accent-seafoam/40",
          textColor: "text-accent-seafoam",
          label: "DEEP WORK CORE",
          borderColor: "border-accent-seafoam/35",
          sparkName: "DEEP WORK CORE",
        };
      case "learning":
        return {
          bg: "bg-gradient-to-tr from-accent-mustard to-accent-seafoam",
          glow: "shadow-lg shadow-accent-mustard/40",
          textColor: "text-accent-mustard",
          label: "GOLDEN SAGE CORE",
          borderColor: "border-accent-mustard/35",
          sparkName: "GOLDEN SAGE CORE",
        };
      case "mindfulness":
        return {
          bg: "bg-gradient-to-tr from-accent-periwinkle to-accent-blush",
          glow: "shadow-lg shadow-accent-periwinkle/40",
          textColor: "text-accent-periwinkle",
          label: "CYBER ORCHID CORE",
          borderColor: "border-accent-periwinkle/35",
          sparkName: "CYBER ORCHID CORE",
        };
      default:
        return {
          bg: "bg-gradient-to-tr from-accent-mustard to-accent-coral",
          glow: "shadow-lg shadow-accent-mustard/40",
          textColor: "text-accent-mustard",
          label: "RAW TITANIUM",
          borderColor: "border-accent-mustard/30",
          sparkName: "RAW TITANIUM",
        };
    }
  };

  const theme = getCategoryTheme(habit.category);

  const getHealthColor = (health: number) => {
    if (health <= 0) return "text-secondary-text";
    if (health < 20) return "text-accent-coral";
    if (health < 50) return "text-accent-mustard";
    if (health < 80) return "text-accent-seafoam";
    return "text-accent-seafoam";
  };

  const healthColor = getHealthColor(habit.plantHealth ?? 100);

  return (
    <div
      className={`
      relative overflow-hidden group
      p-8 floating-card squircular transition-all duration-500
      ${
        habit.isGolden 
          ? `border-accent-mustard/50 shadow-lg shadow-accent-mustard/20 bg-accent-mustard/10`
          : isCompleted
          ? `border-surface-alt shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]`
          : "border-surface-alt hover:border-surface-alt hover:bg-surface-alt/40"
      }
    `}
    >
      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full transition-opacity duration-1000 pointer-events-none ${isCompleted ? "opacity-[0.03] bg-accent-periwinkle mix-blend-screen" : "opacity-0"}`}
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
                    : "bg-transparent text-slate-500 border-surface-alt hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10"
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
                   isSlipped ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-transparent text-slate-500 border-surface-alt hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                 }`}
               >
                 {isSlipped ? "Recover" : "Slipped"}
               </button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-5 mb-3">
              <div className="w-20 h-24 shrink-0 flex flex-col items-center justify-end relative group/plant cursor-pointer mt-2">
                 <PlantIcon 
                   plantType={habit.plantType} 
                   stage={habit.plantStage} 
                   status={habit.plantStatus} 
                   isPrivate={habit.isPrivate} 
                   health={habit.plantHealth}
                   isLegendary={habit.isLegendary} 
                   isArchived={habit.isArchived} 
                   isGolden={habit.isGolden}
                   className="w-20 h-24 absolute bottom-[5%] z-10 drop-shadow-md group-hover/plant:-translate-y-1 transition-transform" 
                 />
                 <div className="w-14 h-2.5 bg-black/15 shadow-[0_0_10px_4px_rgba(0,0,0,0.15)] rounded-[100%] absolute bottom-[-5%] z-0" />
              </div>
              <h3
                className={`font-display text-2xl tracking-tight font-medium transition-colors duration-300 ${isCompleted ? "text-white" : "text-slate-200"}`}
              >
                {habit.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {CATEGORIES[habit.category] && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-zinc-950/60 px-2.5 py-1 uppercase border border-surface-alt text-slate-400">
                  {React.createElement(CATEGORIES[habit.category].icon, { className: "w-3 h-3 text-slate-400" })}
                  <span>{CATEGORIES[habit.category].name}</span>
                </div>
              )}

              {habit.difficulty && (
                <div className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest bg-zinc-950/60 px-2.5 py-1 uppercase border ${
                  habit.difficulty === 'easy' ? 'text-accent-seafoam border-accent-seafoam/20' : 
                  habit.difficulty === 'medium' ? 'text-accent-mustard border-accent-mustard/20' : 
                  'text-accent-coral border-accent-coral/20'
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
                <div className="flex flex-col gap-1.5 relative">
                  <span className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 p-1 rounded-sm relative ${
                    habit.streak >= 30 ? 'text-accent-coral bg-accent-coral/10 border border-accent-coral/20 shadow-sm' :
                    habit.streak >= 21 ? 'text-accent-mustard bg-accent-mustard/10 border border-accent-mustard/20 shadow-sm' :
                    habit.streak >= 14 ? 'text-accent-coral bg-accent-coral/5 border border-accent-coral/10 shadow-sm' :
                    habit.streak >= 5 ? 'text-accent-mustard bg-accent-mustard/5 border border-accent-mustard/10' :
                    'text-accent-mustard'
                  }`}>
                    <div className="relative">
                      <Flame
                        className={`w-3.5 h-3.5 fill-current ${isCompleted ? "animate-pulse" : ""}`}
                      />
                      {/* Sparks/Fire Particles for Multiplier Tiers */}
                      {habit.streak >= 5 && (
                        <svg className="absolute inset-0 pointer-events-none overflow-visible w-full h-full" viewBox="0 0 24 24">
                          <g style={{ willChange: 'transform, opacity' }}>
                            <circle cx="-2" cy="-4" r="2" fill="#FBBF24" className="animate-bounce opacity-70" style={{ animationDuration: '0.8s' }} />
                            <circle cx="2" cy="-10" r="2" fill="#F97316" className="animate-ping opacity-90" style={{ animationDuration: '1.2s' }} />
                            <circle cx="8" cy="-6" r="2" fill="#FACC15" className="animate-bounce opacity-80" style={{ animationDuration: '1.5s' }} />
                          </g>
                        </svg>
                      )}
                    </div>
                    <span>{habit.streak} Day Streak</span>
                    
                    {/* Tooltip trigger */}
                    <Tooltip.Provider delayDuration={200}>
                       <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                             <div className="relative inline-block cursor-help ml-0.5 pointer-events-auto">
                                <LucideIcons.HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
                             </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                             <Tooltip.Content 
                                sideOffset={5} 
                                className="w-56 p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 normal-case tracking-normal text-left"
                             >
                               <p className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mb-2 border-b border-surface-alt pb-1">
                                  🔥 Streak Multipliers
                               </p>
                               <div className="space-y-1 text-[9px] font-mono text-slate-400">
                                  <div className="flex justify-between">
                                     <span>5 Days:</span>
                                     <span className="text-accent-seafoam">1.2x Payout</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span>14 Days:</span>
                                     <span className="text-accent-seafoam">2.0x Payout</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span>21 Days:</span>
                                     <span className="text-accent-mustard">3.0x Payout</span>
                                  </div>
                                  <div className="flex justify-between">
                                     <span>30+ Days:</span>
                                     <span className="text-accent-coral font-bold">5.0x Payout</span>
                                  </div>
                               </div>
                               {(() => {
                                  // Calculate next field preview
                                  const currentStreak = habit.streak;
                                  let nextThreshold = 5;
                                  let currentMult = "1.0x";
                                  let nextMult = "1.2x";
                                  
                                  if (currentStreak >= 30) {
                                     return (
                                        <div className="mt-2 pt-1 border-t border-surface-alt text-[9px] font-mono text-accent-coral">
                                           Ultimate 5.0x reward tier reached!
                                        </div>
                                     );
                                  } else if (currentStreak >= 21) {
                                     nextThreshold = 30;
                                     currentMult = "3.0x";
                                     nextMult = "5.0x";
                                  } else if (currentStreak >= 14) {
                                     nextThreshold = 21;
                                     currentMult = "2.0x";
                                     nextMult = "3.0x";
                                  } else if (currentStreak >= 5) {
                                     nextThreshold = 14;
                                     currentMult = "1.2x";
                                     nextMult = "2.0x";
                                  }
                                  
                                  const diff = nextThreshold - currentStreak;
                                  return (
                                     <div className="mt-2 pt-2 border-t border-surface-alt text-[9px] font-mono leading-tight text-slate-300">
                                        Next bonus in <strong className="text-amber-400 font-bold">{diff} {diff === 1 ? 'day' : 'days'}</strong> (At {nextThreshold} days: <span className="text-emerald-400 font-semibold">{currentMult} → {nextMult} multiplier</span>)
                                     </div>
                                  );
                               })()}
                             </Tooltip.Content>
                          </Tooltip.Portal>
                       </Tooltip.Root>
                    </Tooltip.Provider>
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
                        <div className="flex-1 bg-black/60 h-1.5 rounded-full overflow-hidden border border-surface-alt min-w-[50px]">
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
               className="bg-transparent text-[10px] uppercase font-mono tracking-widest text-slate-500 hover:text-white border border-transparent hover:border-surface-alt p-2 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
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
