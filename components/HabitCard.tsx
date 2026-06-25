import React, { useState, useEffect, useRef } from "react";
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
import { playHaptic } from "../haptics";
import { PlantIcon } from "./PlantIcon";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import confetti from "canvas-confetti";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  isSlipped?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
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
  onEdit,
  onChangeDifficulty,
  onSlip,
  undoSlip,
  onArchive,
}) => {
  const [justCompleted, setJustCompleted] = useState(false);
  const [showMilestoneBurst, setShowMilestoneBurst] = useState(false);
  const prevCompletedRef = useRef(isCompleted);

  useEffect(() => {
    if (!prevCompletedRef.current && isCompleted) {
      setJustCompleted(true);
      const isMilestone = habit.streak === 7 || habit.streak === 30 || habit.streak === 100;
      if (isMilestone) {
        setShowMilestoneBurst(true);
      }
      const timer = setTimeout(() => {
        setJustCompleted(false);
        setShowMilestoneBurst(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, habit.streak]);

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
    <motion.div
      layout
      animate={
        isSlipped
          ? {
              scale: [1, 0.98, 1],
              y: [0, 2, 0],
              backgroundColor: [
                "var(--surface)",
                "rgba(229, 124, 93, 0.15)",
                "rgba(229, 124, 93, 0.05)"
              ],
              boxShadow: [
                "0 4px 12px rgba(0,0,0,0.05)",
                "0 12px 32px rgba(229, 124, 93, 0.3)",
                "0 8px 24px rgba(229, 124, 93, 0.1)"
              ],
              borderColor: "rgba(229, 124, 93, 0.3)"
            }
          : isCompleted
          ? {
              scale: [1, 1.015, 1],
              y: [0, -2, 0],
              backgroundColor: [
                "var(--surface)",
                "rgba(127, 145, 240, 0.1)",
                "rgba(255, 255, 255, 0.04)"
              ],
              boxShadow: [
                "0 4px 12px rgba(0,0,0,0.05)",
                "0 12px 32px rgba(127, 145, 240, 0.2)",
                "0 8px 24px rgba(0,0,0,0.08)"
              ],
              borderColor: "transparent"
            }
          : {
              scale: [1, 1.01, 1],
              y: 0,
              backgroundColor: "var(--surface)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderColor: "transparent"
            }
      }
      transition={{ 
        duration: isSlipped || isCompleted ? 1.2 : 4, 
        ease: "easeInOut",
        repeat: isSlipped || isCompleted ? 0 : Infinity,
      }}
      className={`
      relative overflow-hidden group border
      p-8 floating-card squircular transition-all duration-500
      ${isSlipped ? "failed" : ""}
      ${justCompleted ? "animate-pop-card" : ""}
      ${
        habit.isGolden 
          ? `border-accent-mustard/50 shadow-lg shadow-accent-mustard/20 bg-accent-mustard/10`
          : isSlipped
          ? ``
          : isCompleted
          ? `border-surface-alt shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]`
          : "border-surface-alt hover:border-surface-alt hover:bg-surface-alt/40"
      }
    `}
    >
      {justCompleted && (
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent animate-pulse duration-500" />
           {[...Array(24)].map((_, i) => {
             const angle = Math.random() * Math.PI * 2;
             const velocity = 30 + Math.random() * 50;
             const tx = Math.cos(angle) * velocity;
             const ty = Math.sin(angle) * velocity;
             const colors = ['bg-[#00c98f]', 'bg-[#a8e6cf]', 'bg-[#dcedc1]', 'bg-[#3b82f6]', 'bg-accent-mustard', 'bg-accent-coral'];
             const color = colors[Math.floor(Math.random() * colors.length)];
             return (
               <motion.div
                 key={`jc-${i}`}
                 initial={{ top: '50%', left: '50%', scale: 0, opacity: 1 }}
                 animate={{ 
                   top: `calc(50% + ${ty}px)`, 
                   left: `calc(50% + ${tx}px)`, 
                   scale: [0, 1.2, 0.8, 0], 
                   opacity: [1, 1, 0] 
                 }}
                 transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
                 className={`absolute w-1.5 h-1.5 rounded-full ${color} shadow-sm`}
               />
             );
           })}
        </div>
      )}
      {showMilestoneBurst && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const tx = `${Math.cos(angle) * 100}px`;
            const ty = `${Math.sin(angle) * 100}px`;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-accent-mustard animate-particle-burst"
                style={{
                  '--tx': tx,
                  '--ty': ty,
                  animationDelay: `${Math.random() * 0.2}s`
                } as any}
              />
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-[popCard_1.5s_ease-out_forwards]">
            <span className="text-accent-mustard font-bold text-4xl drop-shadow-lg">
              {habit.streak} DAY STREAK!
            </span>
          </div>
        </div>
      )}

      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full transition-opacity duration-1000 pointer-events-none ${isCompleted ? "opacity-[0.03] bg-accent-periwinkle mix-blend-screen" : "opacity-0"}`}
      />
      
      <div
        className={`absolute inset-0 z-0 pointer-events-none transition-all duration-[2000ms] ease-in-out ${isSlipped ? "bg-slate-900/30 backdrop-grayscale-[0.8]" : "opacity-0"}`}
      />

      <div className="flex flex-col xl:flex-row xl:items-center justify-between relative z-10 gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                if (!isCompleted) {
                  playHaptic('thump');
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (rect.left + rect.width / 2) / window.innerWidth;
                  const y = (rect.top + rect.height / 2) / window.innerHeight;
                  confetti({
                    particleCount: 40,
                    spread: 70,
                    origin: { x, y },
                    colors: ['#00c98f', '#a8e6cf', '#dcedc1', '#3b82f6'],
                    zIndex: 100,
                  });
                } else {
                  playHaptic('water'); // or slight tap when un-completing
                }
                if (isSlipped && undoSlip) undoSlip(habit.id);
                // Can't toggle complete if currently slipped without undoing first, but we handle that logic in parent maybe or here
                if (!isSlipped) onToggle(habit.id);
              }}
              className={`
                relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group/btn border
                ${
                  isCompleted
                    ? habit.type === 'avoid' ? "bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.45)] border-emerald-500 text-emerald-400 scale-105 hover:scale-110" : "bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.45)] border-blue-500 text-blue-400 scale-105 hover:scale-110"
                    : "bg-transparent text-slate-500 border-surface-alt hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 hover:scale-[1.02]"
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
                   if (isSlipped && undoSlip) {
                      playHaptic('water');
                      undoSlip(habit.id);
                   } else if (!isSlipped && onSlip && !isCompleted) {
                      playHaptic('slip');
                      onSlip(habit.id);
                   }
                 }}
                 disabled={isCompleted}
                 className={`text-[9px] font-mono tracking-widest uppercase transition-all duration-300 px-3 py-1 border rounded-full hover:scale-[1.02] ${
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

              <motion.span
                layout
                className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-500 flex items-center gap-1.5 ${healthColor}`}
              >
                {habit.plantStatus === 'Critical' ? <LucideIcons.AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> : 
                 habit.plantStatus === 'Wilting' ? <LucideIcons.AlertTriangle className="w-3.5 h-3.5" /> : 
                 habit.plantStatus === 'Resting' ? <LucideIcons.Moon className="w-3.5 h-3.5" /> : 
                 <LucideIcons.Leaf className="w-3.5 h-3.5" />}
                {habit.plantStatus || "Healthy"} ({habit.plantHealth ?? 100}%)
              </motion.span>

              <AnimatePresence mode="popLayout">
                <motion.span
                  layout
                  key={habit.plantStage || "Seed"}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-500 flex items-center gap-1.5 ${isCompleted ? theme.textColor : "text-slate-500"}`}
                  style={{
                    textShadow: isCompleted ? "0 0 15px currentColor" : "none",
                  }}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  {habit.plantStage || "Seed"} ({habit.xp ?? ((habit.totalCompletions || 0) * 10)} XP)
                </motion.span>
              </AnimatePresence>

              {habit.streak > 0 && (
                <div className="flex flex-col gap-1.5 relative">
                  <motion.span 
                    animate={isCompleted ? { scale: [1, 1.15, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 p-1 rounded-sm relative inline-flex ${
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
                   </motion.span>
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

        <div className="flex flex-wrap items-center gap-2 self-end xl:self-auto">
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
              className="p-3 text-secondary-text hover:text-accent-periwinkle opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-accent-periwinkle/20 hover:bg-accent-periwinkle/5 rounded-full hover:scale-[1.02]"
              title="Archive to Garden History"
            >
              <LucideIcons.Archive className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(habit.id)}
              className="p-3 text-secondary-text hover:text-accent-seafoam opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-accent-seafoam/20 hover:bg-accent-seafoam/5 rounded-full hover:scale-[1.02]"
              title="Edit Habit"
            >
              <LucideIcons.Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-3 text-secondary-text hover:text-accent-coral opacity-0 group-hover:opacity-100 transition-all rounded-full hover:scale-[1.02] border border-transparent hover:border-accent-coral/20 hover:bg-accent-coral/5"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Completion Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${theme.bg} transition-all duration-1000 ease-out`} 
        style={{ width: isCompleted ? '100%' : '0%', opacity: isCompleted ? 1 : 0 }} 
      />
    </motion.div>
  );
}, (prev, next) => {
  return prev.habit === next.habit &&
         prev.isCompleted === next.isCompleted &&
         prev.isSlipped === next.isSlipped;
});
