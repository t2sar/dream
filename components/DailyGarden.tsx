import React, { useState, useMemo, useEffect } from 'react';
import { Habit, HabitLog, UserStats, SeasonalEvent, UserEventProgress, RestMode } from '../types';
import { format, subDays, startOfWeek, differenceInCalendarDays } from 'date-fns';
import { PlantIcon } from './PlantIcon';
import { Droplet, Flame, Gift, Leaf, AlertTriangle, Moon, Check, X, ShieldAlert, Sunrise, Sun, Sunset, Coffee, Target, Settings, Info, Clock, Edit2, Archive, Trash2, MoreVertical, AlertCircle, ChevronDown, Sparkles, TrendingUp, TrendingDown, Snowflake, Plus, Wrench, Grid } from 'lucide-react';
import { getChallengeTemplate } from '../challengesData';
import { SHOP_ITEMS } from '../shopData';
import { isHabitPaused } from '../restModeUtils';
import { isHabitDueToday, isHabitDueOnDate, getCompletedCountThisWeek, isPeriodTargetReached } from '../scheduleUtils';
import { getBengaliSeason } from '../seasonalUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedModal } from './AnimatedModal';
import confetti from 'canvas-confetti';
import { playHaptic } from '../haptics';

const WeatherOverlay = () => {
    const season = getBengaliSeason(new Date());
    
    if (season === 'Borsha') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-0.5 h-4 bg-blue-300/40 rounded-full animate-rain"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${0.8 + Math.random() * 0.5}s`,
                   animationDelay: `${Math.random() * 2}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes drop {
               0% { transform: translateY(-10px) scaleY(1); opacity: 0; }
               10% { opacity: 1; }
               80% { transform: translateY(100vh) scaleY(2); opacity: 0; }
               100% { opacity: 0; }
            }
            .animate-rain { animation: drop linear infinite; }
          `}</style>
        </div>
      );
    }
    
    if (season === 'Hemanto' || season === 'Sharat') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(15)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-2 h-2 bg-orange-400/30 rounded-br-full rounded-tl-full animate-leaf-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${4 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 5}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes floatDown {
               0% { transform: translateY(-10px) rotate(0deg) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) rotate(180deg) translateX(20px); }
               100% { transform: translateY(100vh) rotate(360deg) translateX(-20px); opacity: 0; }
            }
            .animate-leaf-fall { animation: floatDown linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Sheet') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(30)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-snow-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${5 + Math.random() * 5}s`,
                   animationDelay: `${Math.random() * 5}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes snowFall {
               0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) translateX(${Math.random() > 0.5 ? 20 : -20}px); }
               100% { transform: translateY(100vh) translateX(${Math.random() > 0.5 ? -20 : 20}px); opacity: 0; }
            }
            .animate-snow-fall { animation: snowFall linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Bashonto') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-2 h-2 bg-pink-300/30 rounded-bl-full rounded-tr-full animate-petal-fall"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `-${Math.random() * 20}%`,
                   animationDuration: `${3 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 3}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes petalFall {
               0% { transform: translateY(-10px) rotate(0deg) translateX(0px); opacity: 0; }
               10% { opacity: 1; }
               50% { transform: translateY(50vh) rotate(180deg) translateX(30px); }
               100% { transform: translateY(100vh) rotate(360deg) translateX(-30px); opacity: 0; }
            }
            .animate-petal-fall { animation: petalFall linear infinite; }
          `}</style>
        </div>
      );
    }

    if (season === 'Grishmo') {
       return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 mix-blend-overlay">
          {[...Array(10)].map((_, i) => (
             <div 
                key={i} 
                className="absolute w-32 h-32 bg-amber-400/5 rounded-full animate-heat-wave blur-2xl"
                style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDuration: `${4 + Math.random() * 4}s`,
                   animationDelay: `${Math.random() * 2}s`
                }} 
             />
          ))}
          <style>{`
            @keyframes heatWave {
               0% { transform: scale(1) translateY(0); opacity: 0.3; }
               50% { transform: scale(1.5) translateY(-20px); opacity: 0.6; }
               100% { transform: scale(1) translateY(0); opacity: 0.3; }
            }
            .animate-heat-wave { animation: heatWave ease-in-out infinite; }
          `}</style>
        </div>
      );
    }
    
    return null;
};

interface DailyGardenProps {
  habits: Habit[];
  logs: HabitLog;
  stats: UserStats;
  dateKey: string;
  activeEvent?: SeasonalEvent | null;
  eventProgress?: UserEventProgress;
  activeRestMode?: RestMode | null;
  onOpenRestMode?: () => void;
  onResumeRestMode?: () => void;
  onWaterPlant: (habitId: string, isMini?: boolean, customAmount?: number) => void;
  onSlipHabit?: (habitId: string, reason?: string) => void;
  onUndoSlip?: (habitId: string) => void;
  onAddHabit: () => void;
  isPerfectDayNow: boolean;
  onArchiveHabit?: (habitId: string) => void;
  onDeletePlant?: (habitId: string) => void;
  onHarvestPlant?: (habitId: string) => void;
  onEditHabit?: (habit: Habit) => void;
  onOpenOrchard: () => void;
  onBackdate?: (habitId: string, dateKey: string) => void;
  onSnoozeHabit?: (habitId: string, dateKey: string) => void;
  onMailboxClick?: () => void;
  onUpdateStats?: (stats: Partial<UserStats>) => void;
}

import { GardenSky, getGardenTimePhase } from './GardenSky';
import { WeatherParticles } from './WeatherParticles';

import { GardenCanvasTerrain } from './GardenCanvasTerrain';

export const PlantHabitCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-card p-5 flex flex-col justify-between relative min-h-[390px] md:min-h-[400px] h-full overflow-hidden border border-surface-alt/40 [box-shadow:var(--shadow-sm)] habit-card premium-shadow animate-pulse">
      {/* Subtle glow accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col">
          {/* Top Row: Plant Showcase & Info Details */}
          <div className="flex flex-row items-start gap-4 mb-3.5">
            {/* Premium Glass Showcase Container skeleton */}
            <div className="w-20 h-24 shrink-0 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-2xl p-1.5 shadow-inner flex items-end justify-center relative">
              <div className="w-12 h-16 bg-slate-300/10 dark:bg-white/10 rounded-lg" />
              <div className="w-10 h-2 bg-slate-300/20 dark:bg-white/20 rounded-full absolute bottom-2" />
            </div>
            
            {/* Right Column: Title, Category, Status, Descs */}
            <div className="flex-1 flex flex-col justify-start min-w-0 pr-2 h-24">
              <div className="flex flex-col">
                {/* Category/Status badge skeleton */}
                <div className="w-16 h-3.5 bg-slate-300/15 dark:bg-white/10 rounded-md mb-2" />
                {/* Title skeleton */}
                <div className="w-28 h-5 bg-slate-300/20 dark:bg-white/15 rounded-md mb-1.5" />
              </div>
              {/* Description skeleton line 1 */}
              <div className="w-full h-3 bg-slate-300/10 dark:bg-white/5 rounded-md mb-1" />
              {/* Description skeleton line 2 */}
              <div className="w-3/4 h-3 bg-slate-300/10 dark:bg-white/5 rounded-md" />
            </div>
          </div>

          {/* Sparkline Toggle skeleton */}
          <div className="w-24 h-3 bg-slate-300/10 dark:bg-white/5 rounded-md mt-2" />
        </div>
        
        {/* Actions Button skeleton at the bottom */}
        <div className="flex flex-col gap-3 mt-auto pt-2">
          {/* Streak details row skeleton */}
          <div className="flex items-center justify-between border-t border-surface-alt/40 pt-3">
            <div className="w-14 h-3 bg-slate-300/10 dark:bg-white/5 rounded-md" />
            <div className="w-16 h-3 bg-slate-300/10 dark:bg-white/5 rounded-md" />
          </div>
          
          {/* Big action button skeleton */}
          <div className="w-full h-[56px] bg-slate-300/15 dark:bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

const ViewportLazyWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode, id?: string, status?: string, index?: number }>(({ children, id, status, index = 0 }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const internalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!internalRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { rootMargin: "300px" });
    observer.observe(internalRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      key={id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.08 }}
      ref={(node) => {
        // @ts-ignore
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }} 
      className="min-h-[390px] md:min-h-[400px] h-full w-full flex flex-col"
    >
      {isVisible ? children : <PlantHabitCardSkeleton />}
    </motion.div>
  );
});
ViewportLazyWrapper.displayName = 'ViewportLazyWrapper';

const THEME_INFOS = {
  cream_butter: {
    name: "Cream Butter",
    description: "Playful organic light theme with warm cream canvas & sage accent.",
    isDark: false,
  },
  midnight_slate: {
    name: "Midnight Slate",
    description: "Sleek blue tech theme with carbon panels and cool slate colors.",
    isDark: true,
  },
  cosmic_cyber: {
    name: "Cyberpunk Neon",
    description: "Immersive synthwave dark purple featuring hot neon pink actions.",
    isDark: true,
  },
  forest_zen: {
    name: "Forest Zen",
    description: "Peaceful forest floor greens, dark moss, and soft birch details.",
    isDark: true,
  },
  retro_paper: {
    name: "Retro Paper",
    description: "Classic tactile feel of vintage journals with rust/coral dyes.",
    isDark: false,
  },
  classic_obsidian: {
    name: "Classic Obsidian",
    description: "Pure contrast deep space theme with emerald habit trackers.",
    isDark: true,
  },
};

const SLOT_DEFINITIONS = [
  { id: 'slot1', label: 'Left Back (Background)', className: 'absolute bottom-[18%] left-[8%] z-10', scaleClass: 'scale-90' },
  { id: 'slot2', label: 'Left Front (Foreground)', className: 'absolute bottom-[6%] left-[28%] z-30', scaleClass: 'scale-110' },
  { id: 'slot3', label: 'Center Back (Midground)', className: 'absolute bottom-[20%] left-[50%] -translate-x-1/2 z-10', scaleClass: 'scale-95' },
  { id: 'slot4', label: 'Right Back (Background)', className: 'absolute bottom-[16%] right-[24%] z-15', scaleClass: 'scale-100' },
  { id: 'slot5', label: 'Right Front (Foreground)', className: 'absolute bottom-[5%] right-[6%] z-35', scaleClass: 'scale-115' },
];

const renderAnchoredItemGraphics = (itemId: string) => {
  if (itemId === 'pot_clay_colorful') {
    return (
      <div className="relative w-12 h-10 flex items-end justify-center">
        <div className="w-10 h-7 bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 rounded-b-xl border-t-2 border-orange-400 shadow-md flex items-center justify-center">
          <div className="text-[6px] text-white font-extrabold uppercase select-none opacity-80 scale-75">ART</div>
        </div>
      </div>
    );
  }
  if (itemId === 'pot_clay_basic') {
    return (
      <div className="relative w-12 h-10 flex items-end justify-center">
        <div className="w-9 h-7 bg-amber-700 rounded-b-xl border-t-2 border-amber-600 shadow-md" />
      </div>
    );
  }
  if (itemId === 'pot_bamboo_basket') {
    return (
      <div className="relative w-12 h-10 flex items-end justify-center">
        <div className="w-10 h-8 bg-[repeating-linear-gradient(45deg,#d97706,#d97706_2px,#b45309_2px,#b45309_4px)] rounded-b-md border-t border-amber-500 shadow-md" />
      </div>
    );
  }
  if (itemId === 'pot_rooftop_tub') {
    return (
      <div className="relative w-12 h-10 flex items-end justify-center">
        <div className="w-11 h-8 bg-slate-400 border-t border-slate-300 rounded-b-md shadow-inner flex items-center justify-between px-1">
          <div className="w-1.5 h-3.5 bg-slate-600 rounded-full" />
          <div className="w-1.5 h-3.5 bg-slate-600 rounded-full" />
        </div>
      </div>
    );
  }

  // Decorations
  if (itemId === 'dec_butterfly') {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div 
          animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="w-4 h-4 bg-fuchsia-500 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(217,70,239,0.8)] flex items-center justify-center relative"
        >
          <div className="absolute -left-2 w-3.5 h-3.5 bg-fuchsia-400 rounded-full opacity-80" />
          <div className="absolute -right-2 w-3.5 h-3.5 bg-fuchsia-400 rounded-full opacity-80" />
        </motion.div>
      </div>
    );
  }
  if (itemId === 'dec_bird') {
    return (
      <div className="relative w-12 h-10 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-6 h-4 bg-blue-400 rounded-full blur-[0.5px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] relative flex items-center justify-end"
        >
          <div className="w-1.5 h-1 bg-yellow-400 rotate-45 rounded-r-full absolute right-0" />
          <div className="w-3 h-2 bg-blue-300 rounded-full absolute top-1 left-1" />
        </motion.div>
      </div>
    );
  }
  if (itemId === 'dec_fruit_basket') {
    return (
      <div className="relative w-12 h-8 flex flex-col items-center">
        <div className="flex gap-0.5 justify-center mb-[-4px] z-10">
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm" />
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-sm" />
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm" />
        </div>
        <div className="w-9 h-5 bg-amber-700 rounded-b-xl border-t-2 border-amber-500 shadow-md" />
      </div>
    );
  }
  if (itemId === 'dec_mango_basket') {
    return (
      <div className="relative w-12 h-8 flex flex-col items-center">
        <div className="flex gap-0.5 justify-center mb-[-4px] z-10">
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm rotate-12" />
          <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm -rotate-12" />
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-sm rotate-45" />
        </div>
        <div className="w-9 h-5 bg-amber-800 rounded-b-xl border-t border-amber-600 shadow-md" />
      </div>
    );
  }
  if (itemId === 'dec_small_pond') {
    return (
      <div className="relative w-16 h-4 bg-gradient-to-r from-cyan-500/50 to-blue-500/40 rounded-full blur-[1px] shadow-[inner_0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-3 h-1.5 bg-emerald-600/80 rounded-full absolute left-3 animate-pulse" />
      </div>
    );
  }
  if (itemId === 'dec_clay_lamp') {
    return (
      <div className="relative w-8 h-6 flex flex-col items-center">
        <div className="w-2 h-2.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,1)] mb-[-2px] z-10" />
        <div className="w-5 h-2.5 bg-orange-800 rounded-b-full border-t border-orange-700" />
      </div>
    );
  }
  if (itemId === 'dec_kolshi') {
    return (
      <div className="relative w-8 h-8 flex flex-col items-center">
        <div className="w-3 h-1.5 bg-slate-400 rounded-full border border-slate-300" />
        <div className="w-5 h-6 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full border border-slate-400 shadow-md -mt-0.5" />
      </div>
    );
  }
  if (itemId === 'dec_rickshaw_sign') {
    return (
      <div className="relative w-12 h-8 bg-rose-600 rounded-md border-2 border-yellow-400 text-[6px] text-yellow-300 text-center font-bold font-mono tracking-tight shadow-md flex items-center justify-center flex-col p-0.5 select-none">
        <div className="leading-none">BANGLA</div>
        <div className="text-[7px] text-white font-black">ART</div>
      </div>
    );
  }
  if (itemId === 'fence_bamboo') {
    return (
       <div className="relative w-12 h-14 flex items-end justify-center pointer-events-none">
         <div className="flex gap-[3px] items-end h-full">
           <div className="w-2.5 h-11 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
           <div className="w-2.5 h-13 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
           <div className="w-2.5 h-10 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
         </div>
         <div className="absolute bottom-3 left-0 right-0 h-1 bg-lime-900/80 rounded" />
         <div className="absolute bottom-7 left-0 right-0 h-1 bg-lime-900/80 rounded" />
       </div>
    );
  }
  if (itemId === 'fence_wooden') {
    return (
       <div className="relative w-12 h-14 flex items-end justify-center pointer-events-none">
         <div className="flex gap-[3px] items-end h-full">
           <div className="relative w-2.5 h-10 bg-amber-700 border border-amber-950 rounded-b">
             <div className="absolute -top-1.5 left-0 right-0 h-0 w-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-amber-700" />
           </div>
           <div className="relative w-2.5 h-12 bg-amber-700 border border-amber-950 rounded-b">
             <div className="absolute -top-1.5 left-0 right-0 h-0 w-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-amber-700" />
           </div>
           <div className="relative w-2.5 h-10 bg-amber-700 border border-amber-950 rounded-b">
             <div className="absolute -top-1.5 left-0 right-0 h-0 w-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-amber-700" />
           </div>
         </div>
         <div className="absolute bottom-2.5 left-0 right-0 h-1.5 bg-amber-800 border-t border-b border-amber-950" />
         <div className="absolute bottom-7 left-0 right-0 h-1.5 bg-amber-800 border-t border-b border-amber-950" />
       </div>
    );
  }
  if (itemId === 'fence_clay_wall') {
    return (
       <div className="relative w-12 h-12 flex items-end justify-center pointer-events-none">
         <div className="w-12 h-7 bg-gradient-to-t from-amber-900 to-amber-700 border border-amber-950 rounded-t-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center" />
       </div>
    );
  }

  return null;
};

export const DailyGarden: React.FC<DailyGardenProps> = React.memo(({
  habits,
  logs,
  stats,
  dateKey,
  activeEvent,
  eventProgress,
  activeRestMode,
  onOpenRestMode,
  onResumeRestMode,
  onWaterPlant,
  onSlipHabit,
  onUndoSlip,
  onAddHabit,
  isPerfectDayNow,
  onArchiveHabit,
  onDeletePlant,
  onHarvestPlant,
  onEditHabit,
  onOpenOrchard,
  onBackdate,
  onSnoozeHabit,
  onMailboxClick,
  onUpdateStats
}) => {
  const [greeting, setGreeting] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevelRef = React.useRef(stats.level);

  useEffect(() => {
    if (stats.level > prevLevelRef.current) {
      setShowLevelUp(true);
      playHaptic('unlock');
    }
    prevLevelRef.current = stats.level;
  }, [stats.level]);

  const [isCustomizingTerrain, setIsCustomizingTerrain] = useState(false);
  const [activeAnchorSlot, setActiveAnchorSlot] = useState<string | null>(null);
  const [draggedSlotId, setDraggedSlotId] = useState<string | null>(null);
  const [selectedSlotForMove, setSelectedSlotForMove] = useState<string | null>(null);
  const [enableSnapGuide, setEnableSnapGuide] = useState(false);

  const [localToast, setLocalToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (localToast) {
      const timer = setTimeout(() => {
        setLocalToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [localToast]);

  const showLocalToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLocalToast({ message, type });
  };

  const getMaxFencesAllowed = (level: number): number => {
    if (level <= 2) return 1;
    if (level <= 4) return 2;
    if (level <= 6) return 3;
    if (level <= 8) return 4;
    return 5;
  };

  const handleSnapToGridAutoArrange = () => {
    const ownedPotsAndDecors = placeableItems;
    
    if (ownedPotsAndDecors.length === 0) {
      showLocalToast("You don't own any placeable items yet! Visit the Garden Shop to buy pots, fences, or decorations.", 'error');
      playHaptic('thump');
      return;
    }

    const newSlots = {
      slot1: null as string | null,
      slot2: null as string | null,
      slot3: null as string | null,
      slot4: null as string | null,
      slot5: null as string | null,
    };

    const fences = ownedPotsAndDecors.filter(item => item.type === 'fence');
    const tallDecors = ownedPotsAndDecors.filter(item => 
      item.type === 'decoration' && ['dec_butterfly', 'dec_bird', 'dec_rickshaw_sign'].includes(item.id)
    );
    const potsAndShortDecors = ownedPotsAndDecors.filter(item => 
      item.type === 'pot' || (item.type === 'decoration' && !['dec_butterfly', 'dec_bird', 'dec_rickshaw_sign'].includes(item.id))
    );

    const usedItems = new Set<string>();

    const getNextUnused = (list: typeof ownedPotsAndDecors) => {
      return list.find(item => !usedItems.has(item.id));
    };

    const maxFencesAllowed = getMaxFencesAllowed(stats.level || 1);
    let fencesPlacedCount = 0;

    // slot1: Left Background (Fence or Tall Decor)
    let itemForSlot1 = null;
    if (fences.length > 0 && fencesPlacedCount < maxFencesAllowed) {
      const fenceItem = fences[0];
      itemForSlot1 = fenceItem.id;
      fencesPlacedCount++;
    } else {
      const tallDecor = getNextUnused(tallDecors);
      if (tallDecor) {
        itemForSlot1 = tallDecor.id;
        usedItems.add(tallDecor.id);
      } else {
        const fallback = getNextUnused(potsAndShortDecors);
        if (fallback) {
          itemForSlot1 = fallback.id;
          usedItems.add(fallback.id);
        }
      }
    }
    newSlots.slot1 = itemForSlot1;

    // slot4: Right Background (Fence or Tall Decor)
    let itemForSlot4 = null;
    if (fences.length > 0 && fencesPlacedCount < maxFencesAllowed) {
      const fenceItem = fences[1] || fences[0];
      itemForSlot4 = fenceItem.id;
      fencesPlacedCount++;
    } else {
      const tallDecor = getNextUnused(tallDecors);
      if (tallDecor) {
        itemForSlot4 = tallDecor.id;
        usedItems.add(tallDecor.id);
      } else {
        const fallback = getNextUnused(potsAndShortDecors);
        if (fallback) {
          itemForSlot4 = fallback.id;
          usedItems.add(fallback.id);
        }
      }
    }
    newSlots.slot4 = itemForSlot4;

    // slot3: Center Background (Focal centerpiece decor)
    let itemForSlot3 = null;
    const centerpieceDecor = getNextUnused(tallDecors);
    if (centerpieceDecor) {
      itemForSlot3 = centerpieceDecor.id;
      usedItems.add(centerpieceDecor.id);
    } else {
      const shortCenter = getNextUnused(potsAndShortDecors);
      if (shortCenter) {
        itemForSlot3 = shortCenter.id;
        usedItems.add(shortCenter.id);
      }
    }
    newSlots.slot3 = itemForSlot3;

    // slot2: Left Foreground (Pots or Short Decor)
    let itemForSlot2 = null;
    const foreground1 = getNextUnused(potsAndShortDecors);
    if (foreground1) {
      itemForSlot2 = foreground1.id;
      usedItems.add(foreground1.id);
    } else {
      const tallFallback = getNextUnused(tallDecors);
      if (tallFallback) {
        itemForSlot2 = tallFallback.id;
        usedItems.add(tallFallback.id);
      }
    }
    newSlots.slot2 = itemForSlot2;

    // slot5: Right Foreground (Pots or Short Decor)
    let itemForSlot5 = null;
    const foreground2 = getNextUnused(potsAndShortDecors);
    if (foreground2) {
      itemForSlot5 = foreground2.id;
      usedItems.add(foreground2.id);
    } else {
      const tallFallback = getNextUnused(tallDecors);
      if (tallFallback) {
        itemForSlot5 = tallFallback.id;
        usedItems.add(tallFallback.id);
      }
    }
    newSlots.slot5 = itemForSlot5;

    if (onUpdateStats) {
      onUpdateStats({
        anchorSlots: newSlots
      });
    }

    showLocalToast("✨ Snap-to-Grid Optimized: Tall decors placed in back, pots in front, visual overlaps resolved!", 'success');
    playHaptic('unlock');
  };

  const handleSlotDragStart = (e: React.DragEvent, slotId: string) => {
    setDraggedSlotId(slotId);
    e.dataTransfer.setData('text/plain', slotId);
    playHaptic('thump');
  };

  const handleSlotDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSlotDrop = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    const sourceSlotId = draggedSlotId || e.dataTransfer.getData('text/plain');
    if (!sourceSlotId || sourceSlotId === targetSlotId) return;

    const sourceItem = anchorSlots[sourceSlotId as keyof typeof anchorSlots];
    const targetItem = anchorSlots[targetSlotId as keyof typeof anchorSlots];

    // Helper checking
    const isSourceFence = sourceItem && sourceItem.startsWith('fence_');
    const isTargetFence = targetItem && targetItem.startsWith('fence_');
    const isSourcePotOrDecor = sourceItem && (sourceItem.startsWith('pot_') || sourceItem.startsWith('dec_') || sourceItem.startsWith('decor_'));
    const isTargetPotOrDecor = targetItem && (targetItem.startsWith('pot_') || targetItem.startsWith('dec_') || targetItem.startsWith('decor_'));

    if ((isSourceFence && isTargetPotOrDecor) || (isSourcePotOrDecor && isTargetFence)) {
      showLocalToast("Fence pieces cannot be dropped onto grid slots already occupied by pots or decorations!", 'error');
      playHaptic('thump');
      setDraggedSlotId(null);
      return;
    }

    const currentSlots = { ...anchorSlots };
    currentSlots[sourceSlotId] = targetItem || null;
    currentSlots[targetSlotId] = sourceItem || null;

    if (onUpdateStats) {
      onUpdateStats({
        anchorSlots: currentSlots
      });
    }
    setDraggedSlotId(null);
    playHaptic('thump');
  };

  const handleSlotTap = (slotId: string, isOccupied: boolean) => {
    if (isCustomizingTerrain) {
      if (selectedSlotForMove) {
        if (selectedSlotForMove === slotId) {
          // Deselect
          setSelectedSlotForMove(null);
          playHaptic('thump');
        } else {
          // Swap/Move item
          const sourceItem = anchorSlots[selectedSlotForMove as keyof typeof anchorSlots];
          const targetItem = anchorSlots[slotId as keyof typeof anchorSlots];

          const isSourceFence = sourceItem && sourceItem.startsWith('fence_');
          const isTargetFence = targetItem && targetItem.startsWith('fence_');
          const isSourcePotOrDecor = sourceItem && (sourceItem.startsWith('pot_') || sourceItem.startsWith('dec_') || sourceItem.startsWith('decor_'));
          const isTargetPotOrDecor = targetItem && (targetItem.startsWith('pot_') || targetItem.startsWith('dec_') || targetItem.startsWith('decor_'));

          if ((isSourceFence && isTargetPotOrDecor) || (isSourcePotOrDecor && isTargetFence)) {
            showLocalToast("Fence pieces cannot be placed/swapped onto slots occupied by pots or decorations!", 'error');
            playHaptic('thump');
            setSelectedSlotForMove(null);
            return;
          }

          const currentSlots = { ...anchorSlots };
          currentSlots[selectedSlotForMove] = targetItem || null;
          currentSlots[slotId] = sourceItem || null;
          if (onUpdateStats) {
            onUpdateStats({
              anchorSlots: currentSlots
            });
          }
          setSelectedSlotForMove(null);
          playHaptic('thump');
        }
      } else {
        if (isOccupied) {
          setSelectedSlotForMove(slotId);
          playHaptic('thump');
        } else {
          setActiveAnchorSlot(slotId);
          playHaptic('thump');
        }
      }
    } else {
      if (isOccupied) {
        setActiveAnchorSlot(slotId);
        playHaptic('thump');
      }
    }
  };

  const anchorSlots = useMemo(() => {
    if (stats.anchorSlots && Object.keys(stats.anchorSlots).length > 0) {
      return stats.anchorSlots;
    }
    return {
      slot1: stats.equippedLeftDecorId || null,
      slot2: null,
      slot3: null,
      slot4: null,
      slot5: stats.equippedRightDecorId || null,
    };
  }, [stats.anchorSlots, stats.equippedLeftDecorId, stats.equippedRightDecorId]);

  const placeableItems = useMemo(() => {
    return SHOP_ITEMS.filter(item => 
      (item.type === 'pot' || item.type === 'decoration' || item.type === 'fence') && 
      (item.id === 'pot_clay_basic' || stats.ownedItemIds?.includes(item.id) || stats.equippedFenceId === item.id)
    );
  }, [stats.ownedItemIds, stats.equippedFenceId]);

  const handlePlaceItem = (slotId: string, itemId: string | null) => {
    const currentSlots = { ...anchorSlots };
    if (itemId) {
      const isFence = itemId.startsWith('fence_');
      const targetItem = currentSlots[slotId];

      if (isFence) {
        // Validate occupied slot is not a pot or decoration
        if (targetItem && (targetItem.startsWith('pot_') || targetItem.startsWith('dec_') || targetItem.startsWith('decor_'))) {
          showLocalToast("Fence pieces cannot be placed onto grid slots already occupied by pots or decorations!", 'error');
          playHaptic('thump');
          return;
        }

        // Validate limit to number of fence pieces placed based on level
        const currentFencesCount = Object.values(currentSlots).filter(id => id && id.startsWith('fence_')).length;
        const targetWasFence = targetItem && targetItem.startsWith('fence_');
        const netFenceIncrease = targetWasFence ? 0 : 1;
        const maxAllowed = getMaxFencesAllowed(stats.level || 1);

        if (currentFencesCount + netFenceIncrease > maxAllowed) {
          showLocalToast(`Maximum fence pieces reached (${maxAllowed}) for Garden Lvl ${stats.level}. Level up your garden to unlock more space!`, 'error');
          playHaptic('thump');
          return;
        }
      } else {
        // Placing a pot/decoration: Validate target slot is not occupied by a fence
        if (targetItem && targetItem.startsWith('fence_')) {
          showLocalToast("Pots or decorations cannot be placed onto grid slots already occupied by fences!", 'error');
          playHaptic('thump');
          return;
        }
      }

      // If it's a unique pot/decoration, remove it from other slots to prevent duplicates.
      // Do not do this for fences, as the user can place same design fences in multiple slots!
      if (!isFence) {
        Object.keys(currentSlots).forEach(key => {
          if (currentSlots[key] === itemId) {
            currentSlots[key] = null;
          }
        });
      }
      currentSlots[slotId] = itemId;
    } else {
      currentSlots[slotId] = null;
    }

    if (onUpdateStats) {
      onUpdateStats({
        anchorSlots: currentSlots
      });
    }
    playHaptic('thump');
  };

  const currentThemeId = stats.themeId || 'cream_butter';
  // @ts-ignore
  const activeTheme = THEME_INFOS[currentThemeId] || THEME_INFOS.cream_butter;
  
  const habitatTextColors = useMemo(() => {
    if (activeTheme.isDark) {
      return {
        labelColor: "text-accent-seafoam font-semibold drop-shadow-sm",
        descColor: "text-slate-200 font-medium leading-relaxed drop-shadow-sm",
      };
    } else {
      return {
        labelColor: "text-primary-anchor font-bold",
        descColor: "text-slate-800 font-medium leading-relaxed",
      };
    }
  }, [activeTheme]);
  
  useEffect(() => {
    const phase = getGardenTimePhase();
    if (phase === 'Dawn') setGreeting('Good morning, early bird!');
    else if (phase === 'Morning') setGreeting('Good morning, Gardener!');
    else if (phase === 'Midday') setGreeting('Bright midday! How are your plants?');
    else if (phase === 'Afternoon') setGreeting('Good afternoon! Your garden awaits.');
    else if (phase === 'Sunset') setGreeting('Sunset glows! Beautiful evening.');
    else if (phase === 'Evening') setGreeting('Shubho shondha! Your garden is glowing tonight 🌙');
    else setGreeting('Late night... Your garden is sleeping soon.');
  }, []);

  const completedTodayIds = logs[dateKey] || [];
  const slippedTodayIds = (stats.slipLogs?.[dateKey] || []).map(s => s.id);
  const recentDays = useMemo(() => Array.from({length: 7}).map((_, i) => format(subDays(new Date(dateKey + 'T12:00:00'), 6 - i), 'yyyy-MM-dd')), [dateKey]);
  
  const recentHistoryStrings = useMemo(() => {
    const historyMap: Record<string, string> = {};
    for (const habit of habits) {
      historyMap[habit.id] = recentDays.map((d) => logs[d]?.includes(habit.id) ? '1' : '0').join('');
    }
    return historyMap;
  }, [habits, logs, recentDays]);

  const { scheduled, completed, wilting, critical, dead, resting, slipped } = useMemo(() => {
    const s: Habit[] = [];
    const c: Habit[] = [];
    const w: Habit[] = [];
    const crit: Habit[] = [];
    const d: Habit[] = [];
    const r: Habit[] = []; 
    const slip: Habit[] = [];

    habits.forEach(habit => {
      const isCompleted = completedTodayIds.includes(habit.id);
      const isSlipped = slippedTodayIds.includes(habit.id);
      const isPaused = isHabitPaused(habit.id, dateKey, activeRestMode || null);
      
      const isDue = isHabitDueOnDate(habit, dateKey);
      const isPeriodTargetDone = isPeriodTargetReached(habit, logs);
      
      // If it's completely done for the period, treat it as completed or resting, unless it was just completed today
      const considerCompleted = isCompleted || (isPeriodTargetDone && !isDue);
      
      if (isPaused) {
        if (!isCompleted) r.push(habit);
        else c.push(habit);
      } else if (isCompleted) {
        c.push(habit);
      } else if (isSlipped) {
        slip.push(habit);
      } else if (isPeriodTargetDone) {
        c.push(habit); // Target reached for flexible habit, count it as completed
      } else if (!isDue) {
        r.push(habit); // Scheduled for a different day, treat as resting
      } else {
        s.push(habit);
        if (habit.plantHealth !== undefined) {
          if (habit.plantHealth === 0) d.push(habit);
          else if (habit.plantHealth < 25) crit.push(habit);
          else if (habit.plantHealth < 50) w.push(habit);
        }
      }
    });

    return { scheduled: s, completed: c, wilting: w, critical: crit, dead: d, resting: r, slipped: slip };
  }, [habits, completedTodayIds, slippedTodayIds, activeRestMode, dateKey, logs]);

  const { activeHabits, avgHealth } = useMemo(() => {
    const active = [...scheduled, ...completed, ...wilting, ...critical, ...slipped].filter(h => (h.plantHealth ?? 100) > 0);
    const avg = active.length > 0
      ? Math.round(active.reduce((acc, curr) => acc + (curr.plantHealth ?? 100), 0) / active.length)
      : 100;
    return { activeHabits: active, avgHealth: avg };
  }, [scheduled, completed, wilting, critical]);

  const tMinus1 = format(subDays(new Date(dateKey), 1), 'yyyy-MM-dd');
  const tMinus2 = format(subDays(new Date(dateKey), 2), 'yyyy-MM-dd');
  const tMinus3 = format(subDays(new Date(dateKey), 3), 'yyyy-MM-dd');
  
  const getEligibleBackdates = (habit: Habit) => {
     const dates = [];
     const creationDate = format(new Date(habit.createdAt || dateKey), 'yyyy-MM-dd');
     if (tMinus1 >= creationDate && !logs[tMinus1]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus1, activeRestMode || null)) dates.push(tMinus1);
     if (tMinus2 >= creationDate && !logs[tMinus2]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus2, activeRestMode || null)) dates.push(tMinus2);
     if (stats.boostItemCounts?.['boost_streak_repair'] && stats.boostItemCounts['boost_streak_repair'] > 0) {
        if (tMinus3 >= creationDate && !logs[tMinus3]?.includes(habit.id) && !isHabitPaused(habit.id, tMinus3, activeRestMode || null)) dates.push(tMinus3);
     }
     return dates;
  };

  const weekStartFormat = format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd');
  const usedBackdates = stats.backdateWeekStart === weekStartFormat ? (stats.backdatesUsedThisWeek || 0) : 0;
  const backdatesLeftThisWeek = Math.max(0, 3 - usedBackdates);

  let healthStateMsg = 'Excellent Garden';
  if (avgHealth < 25) healthStateMsg = 'Critical Garden';
  else if (avgHealth < 50) healthStateMsg = 'Wilting Garden';
  else if (avgHealth < 75) healthStateMsg = 'Needs Care';
  else if (avgHealth < 90) healthStateMsg = 'Healthy Garden';

  const totalScheduledCount = scheduled.length + completed.length;
  const progressPercent = totalScheduledCount > 0 ? Math.round((completed.length / totalScheduledCount) * 100) : 0;

  const plantsNeedingWater = scheduled.filter(h => (h.plantHealth ?? 100) >= 50);

  const getUrgencyText = (habit: Habit) => {
    if (habit.plantHealth === 0) return 'Dead';
    if ((habit.plantHealth ?? 100) < 25) return 'Critical';
    if ((habit.plantHealth ?? 100) < 50) return 'Wilting';
    
    if (completedTodayIds.includes(habit.id)) return 'Completed Today';
    
    if (isPeriodTargetReached(habit, logs)) return 'Target Complete';
    
    if (habit.scheduleType === 'times_per_week' || habit.scheduleType === 'anytime') {
       const done = getCompletedCountThisWeek(habit, logs);
       const target = habit.targetCount || 1;
       return `${done} / ${target} this week`;
    }
    
    return 'Needs Water';
  };

  const getButtonText = (habit: Habit) => {
    if (habit.plantHealth === 0) return 'Start Recovery';
    if ((habit.plantHealth ?? 100) < 25) return 'Revive Today';
    if ((habit.plantHealth ?? 100) < 50) return 'Save Plant';
    
    if (isPeriodTargetReached(habit, logs) && !completedTodayIds.includes(habit.id)) {
       return 'Extra Care'; // They can tap it again if they really want, or we can just say Completed
       // But the card will probably be rendered in 'Completed' section and gets 'Undo' if completed today, 
       // or if it's just target reached but not completed today, maybe 'Extra Care'
    }
    
    return 'Water Plant';
  };

  let bgClass = "space-y-8 animate-in fade-in duration-500 rounded-3xl p-4 md:p-6 -mx-4 md:-mx-6 relative overflow-hidden";
  const { equippedBackgroundId, equippedFenceId, equippedLeftDecorId, equippedRightDecorId, equippedSeasonalDecorId } = stats;

  const matchTimeOfDay = true;

  let baseBgColor = '#24676d'; // Default garden teal base
  if (equippedBackgroundId === 'bg_rooftop') {
     baseBgColor = '#131e2f'; // City rooftop dark-blue base
     bgClass += " bg-gradient-to-b from-sky-900/40 to-slate-900/80 border border-sky-500/20";
  } else if (equippedBackgroundId === 'bg_village') {
     baseBgColor = '#102717'; // Village dark-green base
     bgClass += " bg-gradient-to-b from-emerald-900/40 to-green-950/80 border border-emerald-500/20";
  } else if (equippedBackgroundId === 'bg_morning_sun') {
     baseBgColor = '#3a2717'; // Warm sunrise golden-brown base
     bgClass += " bg-gradient-to-b from-amber-900/40 to-slate-900/80 border border-amber-500/20";
  } else if (equippedBackgroundId === 'bg_monsoon') {
     baseBgColor = '#1a2230'; // Rainy dark grey-blue base
     bgClass += " bg-gradient-to-b from-cyan-900/30 to-blue-950/80 border border-blue-500/20";
  } else if (equippedBackgroundId === 'bg_zamindar_palace') {
     baseBgColor = '#2d141e'; // Palace rooftop royal crimson/purple base
     bgClass += " bg-gradient-to-b from-rose-950/40 to-purple-950/80 border border-rose-500/20";
  } else if (equippedBackgroundId === 'bg_default') {
     baseBgColor = '#24676d'; // Default garden green
     bgClass += " bg-transparent border border-transparent";
  }

  // Calculate extra fireflies from completed evening habits
  const currentPhase = getGardenTimePhase();
  let extraFireflies = 0;
  if ((currentPhase === 'Evening' || currentPhase === 'Night') && isPerfectDayNow) {
     extraFireflies = 3;
  }
  
  const currentMonth = new Date().getMonth();
  const isDarkPhase = matchTimeOfDay && (currentPhase === 'Evening' || currentPhase === 'Night' || currentPhase === 'Dawn');
  const isMonsoon = activeEvent?.id?.startsWith('monsoon') || habits.some(h => h.category === 'hydration');
  const isNight = matchTimeOfDay && (currentPhase === 'Evening' || currentPhase === 'Night');
  const isAutumn = currentMonth >= 8 && currentMonth <= 10;
  const isWinter = currentMonth === 11 || currentMonth <= 1 || activeEvent?.id?.startsWith('winter');

  return (
    <div className={bgClass} style={{ backgroundColor: baseBgColor }}>
      <WeatherParticles isMonsoon={!!isMonsoon} isNight={!!isNight} isAutumn={!!isAutumn} isWinter={!!isWinter} />
      
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-full px-4 pointer-events-none"
          >
            <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-start gap-3 pointer-events-auto ${
              localToast.type === 'error'
                ? 'bg-red-500/90 border-red-500/30 text-white'
                : localToast.type === 'success'
                ? 'bg-emerald-500/90 border-emerald-500/30 text-white'
                : 'bg-zinc-900/90 border-zinc-700/50 text-white'
            }`}>
              {localToast.type === 'error' ? (
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-100" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-100" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold leading-relaxed">{localToast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 space-y-8">
      {/* Rest Mode Banner / Settings */}
      {activeRestMode && activeRestMode.isActive ? (
        <div className="bg-accent-periwinkle/10 border border-accent-periwinkle/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group relative overflow-hidden">
          <div className="flex items-center gap-2 relative z-50 self-end -mt-4 -mr-2">
             <button
                onClick={onOpenOrchard}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-mustard bg-accent-mustard/10 hover:bg-accent-mustard/20 hover:text-accent-mustard transition-colors px-3 py-1.5 rounded-full border border-accent-mustard/30"
             >
                <Leaf className="w-3.5 h-3.5" />
                Orchard
             </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-periwinkle/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-accent-periwinkle/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-accent-periwinkle" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-accent-periwinkle uppercase italic">Garden Rest Mode Active</div>
              <h3 className="text-sm font-bold text-white font-display leading-tight">
                {activeRestMode.modeType === 'vacation' ? 'Vacation Mode is active. Enjoy your break.' : 
                 activeRestMode.modeType === 'sick' ? 'Sick Mode is active. Rest is care too.' : 
                 activeRestMode.modeType === 'exam' ? 'Exam Mode is active. Your garden is lighter for now.' : 
                 activeRestMode.modeType === 'family_emergency' ? 'Emergency Pause is active. Take care of what matters.' : 
                 'Rest Day active. Plants are safe.'}
              </h3>
              <div className="text-xs text-secondary-text mt-1 flex items-center gap-2">
                 <span>No health loss during pause mode.</span>
                 {resting.length > 0 && <span className="px-1.5 py-0.5 rounded bg-accent-periwinkle/20 text-accent-periwinkle text-[9px] uppercase font-mono border border-accent-periwinkle/30">{resting.length} resting plants</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10 w-full md:w-auto">
            <button
               onClick={onOpenRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-accent-periwinkle/10 text-accent-periwinkle hover:bg-accent-periwinkle/20 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors border border-accent-periwinkle/20"
            >
               Edit
            </button>
            <button
               onClick={onResumeRestMode}
               className="flex-1 md:flex-none px-4 py-2 bg-accent-periwinkle text-surface-card hover:bg-accent-periwinkle/90 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors shadow-lg shadow-accent-periwinkle/20"
            >
               Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-3 -mb-4 relative z-10 w-full px-2">
           <button
              onClick={onOpenOrchard}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-mustard hover:text-accent-mustard transition-colors px-3 py-1 rounded-full hover:bg-accent-mustard/10"
           >
              <Leaf className="w-3 h-3" />
              Orchard
           </button>
           <button 
             onClick={onOpenRestMode}
             className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-text hover:text-accent-periwinkle transition-colors px-3 py-1 rounded-full hover:bg-accent-periwinkle/10"
           >
             <Moon className="w-3 h-3" />
             Need a break?
           </button>
        </div>
      )}

      {/* Top Banner / Summary */}
      <div className="bg-surface-soft border border-surface-alt rounded-[32px] p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-mint/10 blur-3xl rounded-full" />
        <WeatherOverlay />
        
        {/* Fences */}
        {!stats.isSimpleMode && equippedFenceId === 'fence_bamboo' && (
           <div className="absolute bottom-0 left-0 right-0 h-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#84cc16_10px,#84cc16_14px)] opacity-30 border-t border-lime-500/40"></div>
        )}
        {!stats.isSimpleMode && equippedFenceId === 'fence_wooden' && (
           <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_16px,#d97706_16px,#d97706_22px)] opacity-40 border-t-2 border-amber-700/50"></div>
        )}
        {!stats.isSimpleMode && equippedFenceId === 'fence_clay_wall' && (
           <div className="absolute bottom-0 left-0 right-0 h-6 bg-amber-900/60 border-t-4 border-amber-800/80 rounded-t-lg"></div>
        )}
        
        {/* Seasonal */}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_rain_cloud' && (
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-400/50 blur-sm rounded-full animate-pulse shadow-[0_20px_20px_rgba(56,189,248,0.3)]"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_boishakh' && (
           <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_20px,#ffffff_20px,#ffffff_40px)] opacity-70"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_eid_lights' && (
           <div className="absolute top-1 inset-x-4 flex justify-between opacity-80">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse shadow-[0_0_8px_rgba(253,224,71,0.8)]"></div>)}
           </div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_ramadan_lantern' && (
           <div className="absolute top-3 right-1/4 w-4 h-6 rounded-b-lg bg-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-t border-surface-alt"></div>
        )}
        {!stats.isSimpleMode && equippedSeasonalDecorId === 'seasonal_winter_sun' && (
           <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-orange-300/40 blur-md"></div>
        )}
        
        {/* Customize Terrain Layout Mode Toggle */}
        {!stats.isSimpleMode && (
          <button
            onClick={() => {
              setIsCustomizingTerrain(!isCustomizingTerrain);
              playHaptic('thump');
            }}
            className={`absolute top-4 right-4 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all border duration-300 pointer-events-auto cursor-pointer ${
              isCustomizingTerrain 
                ? 'bg-emerald-500 text-zinc-900 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-105 font-sans' 
                : 'bg-zinc-900/60 hover:bg-zinc-900/80 text-white/90 border-white/10 hover:border-white/30 hover:scale-102 font-sans'
            }`}
          >
            {isCustomizingTerrain ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Layout Done</span>
              </>
            ) : (
              <>
                <Wrench className="w-3.5 h-3.5" />
                <span>Customize Terrain</span>
              </>
            )}
          </button>
        )}

        {/* Snap-to-Grid Helper Card */}
        {!stats.isSimpleMode && isCustomizingTerrain && (
          <div className="absolute top-16 right-4 z-30 w-64 bg-zinc-950/95 backdrop-blur-md text-[#FDFBF7] rounded-[24px] p-4 border border-white/10 shadow-2xl flex flex-col gap-3 pointer-events-auto font-sans animate-fade-in">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-white">Snap-to-Grid Helper</span>
            </div>
            
            <p className="text-[10px] text-white/70 leading-relaxed font-medium">
              Use smart guides to optimize placement or auto-arrange owned items to prevent overlaps and visual occlusion.
            </p>

            <div className="flex flex-col gap-2">
              {/* Show Guides Switch */}
              <button
                onClick={() => {
                  setEnableSnapGuide(!enableSnapGuide);
                  playHaptic('thump');
                }}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  enableSnapGuide 
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/25 hover:bg-white/10'
                }`}
              >
                <span>Show Snap Guides</span>
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${enableSnapGuide ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-white/20'}`} />
              </button>

              {/* Auto Arrange Layout */}
              <button
                onClick={() => {
                  handleSnapToGridAutoArrange();
                  setEnableSnapGuide(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-900 text-[11px] font-extrabold uppercase tracking-wide hover:brightness-110 active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.2)] pointer-events-auto cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Auto-Arrange Layout</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Anchor Slots */}
        {!stats.isSimpleMode && (
          <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none select-none z-10">
            {SLOT_DEFINITIONS.map((slot) => {
              const placedItemId = anchorSlots[slot.id as keyof typeof anchorSlots];
              const isOccupied = !!placedItemId;
              const isSelectedForMove = selectedSlotForMove === slot.id;
              
              return (
                <div 
                  key={slot.id} 
                  className={`${slot.className} ${slot.scaleClass} transition-all duration-300 flex flex-col items-center justify-end h-20 w-20 relative`}
                  onDragOver={handleSlotDragOver}
                  onDrop={(e) => handleSlotDrop(e, slot.id)}
                >
                  {/* Snap-to-Grid Guide Ring Overlay */}
                  {isCustomizingTerrain && enableSnapGuide && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                      <motion.div
                        animate={{ 
                          scale: [0.85, 1.05, 0.85],
                          borderColor: ['slot1', 'slot3', 'slot4'].includes(slot.id) 
                            ? ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.7)', 'rgba(245,158,11,0.2)'] 
                            : ['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.7)', 'rgba(16,185,129,0.2)']
                        }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className={`absolute w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-0.5 bg-black/10`}
                      >
                        <div className="text-[7px] font-extrabold uppercase font-mono tracking-tight text-center leading-none scale-90 mb-0.5 opacity-90 drop-shadow-sm" style={{ color: ['slot1', 'slot3', 'slot4'].includes(slot.id) ? '#f59e0b' : '#10b981' }}>
                          {['slot1', 'slot3', 'slot4'].includes(slot.id) ? 'Tall / Back' : 'Short / Front'}
                        </div>
                        <div className="text-[5.5px] font-mono text-white/50 text-center leading-none scale-75 opacity-70">
                          {['slot1', 'slot3', 'slot4'].includes(slot.id) ? 'Fences/Decor' : 'Pots/Decors'}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Item placed rendering */}
                  {isOccupied && (
                    <div 
                      draggable={isCustomizingTerrain}
                      onDragStart={(e) => handleSlotDragStart(e, slot.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotTap(slot.id, true);
                      }}
                      className={`cursor-pointer pointer-events-auto transform hover:scale-110 transition-all duration-200 active:scale-95 relative z-20 flex flex-col items-center justify-end p-1 rounded-xl ${
                        isSelectedForMove ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-zinc-900 scale-105 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.6)]' : ''
                      }`}
                    >
                      {renderAnchoredItemGraphics(placedItemId)}
                      
                      {/* Floating shadow under placed item */}
                      <div className="w-8 h-1 bg-black/25 rounded-full blur-[1px] mt-0.5" />
                    </div>
                  )}

                  {/* Pedestal / Highlight when Empty or in Customize Mode */}
                  {isCustomizingTerrain && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotTap(slot.id, isOccupied);
                      }}
                      className="pointer-events-auto flex flex-col items-center justify-end relative z-30 animate-fade-in group cursor-pointer mt-1"
                    >
                      {isOccupied ? (
                        <div className="w-12 h-4 bg-gradient-to-b from-stone-400 to-stone-600 rounded-full border border-stone-300 shadow-[0_2px_4px_rgba(0,0,0,0.4)] opacity-80 flex items-center justify-center -mt-1 group-hover:opacity-100 transition-opacity">
                          <span className="text-[6px] font-mono text-white/90 font-bold scale-75">
                            {isSelectedForMove ? 'Tap Target' : `Move Slot ${slot.id.replace('slot', '')}`}
                          </span>
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.05)] ${
                          selectedSlotForMove 
                            ? 'border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                            : 'border-white/40 hover:border-emerald-400 bg-black/25 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        }`}>
                          <Plus className={`w-4 h-4 transition-colors ${selectedSlotForMove ? 'text-emerald-400' : 'text-white/60 group-hover:text-emerald-400'}`} />
                        </div>
                      )}

                      {/* Floating tooltip with Slot label */}
                      <span className="absolute bottom-14 scale-90 whitespace-nowrap bg-zinc-900 text-white border border-white/10 text-[9px] font-medium font-mono px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
                        {slot.label} {isOccupied ? (isSelectedForMove ? '(Tap target to Swap/Move)' : '(Tap to select, drag, or double tap to Edit)') : '(Tap to Place/Move)'}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold text-primary-text mb-1">{greeting}</h2>
          <p 
            className="text-secondary-text text-sm mb-3 flex items-center gap-2"
            style={{ color: '#ffffff', fontWeight: 'bold', fontStyle: 'italic' }}
          >
            <Sun className="w-4 h-4 text-status-needsCare" />
            {new Date().toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {/* Habitat Description with Dynamic Contrast Adjustment */}
          {activeTheme && (
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${habitatTextColors.labelColor}`}>
                  🏝️ {activeTheme.name} Habitat
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${habitatTextColors.descColor}`}>
                {activeTheme.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-secondary-blue"/> Watered</div>
              <div className="text-2xl font-bold text-primary-text">{completed.length} <span className="text-sm text-secondary-text font-normal">/ {totalScheduledCount}</span></div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-status-healthy"/> Health</div>
              <div className="text-2xl font-bold text-primary-text">{avgHealth}%</div>
              <div className="text-[11px] text-status-healthy font-bold mt-1">{healthStateMsg}</div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-status-wilting"/> At Risk</div>
              <div className="text-2xl font-bold text-primary-text">{critical.length + wilting.length}</div>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] text-muted-text font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-accent-peach"/> Reward</div>
              <div className="text-sm font-bold text-primary-text">
                {isPerfectDayNow ? 'Rain Boost! 🌧️' : `${scheduled.length} more to unlock`}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
              <span className="text-secondary-text">Daily Progress</span>
              <span className="text-status-healthy">{progressPercent}%</span>
            </div>
            <div className="h-4 w-full bg-surface-card rounded-progress overflow-hidden border border-surface-alt p-0.5">
              <div 
                className="h-full bg-status-healthy rounded-progress transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                {progressPercent === 100 && (
                  <div className="absolute inset-0 bg-surface-alt/20 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.activeChallenge && stats.activeChallenge.status === 'active' && (
         <div className="bg-accent-seafoam/10 border border-accent-seafoam/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-accent-seafoam/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-seafoam" />
               </div>
               <div>
                  <div className="text-[10px] font-mono tracking-widest text-accent-periwinkle uppercase italic">Active Challenge</div>
                  <h3 className="text-sm font-bold text-primary-anchor font-display leading-tight">{getChallengeTemplate(stats.activeChallenge.templateId)?.title}</h3>
                  <div className="text-xs text-secondary-text mt-1 flex items-center gap-2">
                     <span className="text-accent-seafoam">Progress: {stats.activeChallenge.completedDates.length} / {getChallengeTemplate(stats.activeChallenge.templateId)?.requiredCompletionDays} days</span>
                     {stats.activeChallenge.completedDates.includes(dateKey) && <span className="px-1.5 py-0.5 rounded bg-accent-seafoam/20 text-accent-seafoam text-[9px] uppercase font-mono border border-accent-seafoam/30">Today completed</span>}
                  </div>
               </div>
            </div>
         </div>
      )}

      {critical.length > 0 && (
         <div className="bg-accent-coral/10 border border-accent-coral/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-8 h-8 text-accent-coral" />
               <div>
                  <h3 className="text-base font-bold text-accent-coral">Urgent Care Needed</h3>
                  <p className="text-xs text-secondary-text">Your "{critical[0].name}" plant is critical. Complete its habit today to start recovery.</p>
               </div>
            </div>
         </div>
      )}

      {wilting.length > 0 && critical.length === 0 && (
         <div className="bg-accent-mustard/10 border border-accent-mustard/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
               <AlertTriangle className="w-8 h-8 text-accent-mustard" />
               <div>
                  <h3 className="text-base font-bold text-accent-mustard">Needs Attention</h3>
                  <p className="text-xs text-secondary-text">Some of your plants are getting dry. Water them to save them.</p>
               </div>
            </div>
         </div>
      )}

      <div className="space-y-6">
        {/* Empty State */}
        {habits.length === 0 && (
          <div className="bg-surface-soft border border-surface-alt rounded-large-card p-12 text-center relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-20 h-20 bg-primary-mint/20 rounded-full flex items-center justify-center mb-6">
                 <Leaf className="w-10 h-10 text-status-healthy" />
               </div>
               <h3 className="text-xl font-bold text-primary-text mb-2">Habit Garden is Empty</h3>
               <p className="text-secondary-text text-sm max-w-sm mb-8">Every habit starts as a tiny seed. Plant your first seed today and start growing your beautiful Bangladeshi fruit garden.</p>
               <button 
                 onClick={onAddHabit}
                 className="bg-primary-mint hover:bg-[#a5d8bd] text-primary-text rounded-button px-8 py-3 flex items-center gap-2 text-[14px] font-bold tracking-wide transition-transform active:scale-95 shadow-sm"
               >
                 Plant First Habit
               </button>
            </div>
          </div>
        )}

        {/* All Completed Empty State */}
        {scheduled.length === 0 && completed.length > 0 && (
           <div className="bg-status-completed/10 border border-status-completed/20 rounded-card p-8 text-center flex flex-col items-center shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <Sun className="w-12 h-12 text-status-healthy mb-4" />
              <h3 className="text-lg font-bold text-status-healthy font-display mb-1">Perfect Garden Day</h3>
              <p className="text-sm text-secondary-text">Your garden is fully watered today. Enjoy the rest of your day!</p>
           </div>
        )}

        {habits.length > 0 && (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 items-stretch content-start">
            <AnimatePresence mode="popLayout">
            {(() => {
               let globalIndex = 0;
               return (
                  <>
                     {/* Urgent section */}
                     {[...dead].length > 0 && (
                       <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="dead-heading" className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2">
                         <ShieldAlert className="w-4 h-4" /> Fresh Start Needed (Withered)
                       </motion.h3>
                     )}
                     {dead.map((habit) => {
                        const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
                        return (
                         <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                           <MemoizedPlantHabitCard habit={habit} status="Withered (Needs Restart)" buttonText="Start New Seed" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} isFrozen={isHabitPaused(habit.id, dateKey, activeRestMode || null) || !!habit.snoozedDates?.includes(dateKey)} />
                         </ViewportLazyWrapper>
                        );
                     })}

                     {[...critical, ...wilting].length > 0 && (
                       <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="at-risk-heading" className="col-span-full text-xs font-bold tracking-widest text-status-wilting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                         <ShieldAlert className="w-4 h-4" /> At Risk Plants
                       </motion.h3>
                     )}
                     {[...critical, ...wilting].map((habit) => {
                        const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
                        return (
                         <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                           <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} />
                         </ViewportLazyWrapper>
                        );
                     })}

                     {/* Needs Water */}
                     {plantsNeedingWater.length > 0 && (
                       <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="needs-water-heading" className="col-span-full text-xs font-bold tracking-widest text-secondary-text uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                         <Droplet className="w-4 h-4" /> Needs Water
                       </motion.h3>
                     )}
                     {plantsNeedingWater.map((habit) => {
                        const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
                        return (
                         <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                           <MemoizedPlantHabitCard habit={habit} status={getUrgencyText(habit)} buttonText={getButtonText(habit)} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={slippedTodayIds.includes(habit.id)} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} />
                         </ViewportLazyWrapper>
                        );
                     })}

                     {/* Failed to Water */}
                     {slipped.length > 0 && (
                       <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="failed-to-water-heading" className="col-span-full text-xs font-bold tracking-widest text-[#E57C5D] uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                         <AlertCircle className="w-4 h-4" /> Failed to Water
                       </motion.h3>
                     )}
                     {slipped.map((habit) => {
                        const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
                        return (
                         <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                  <MemoizedPlantHabitCard habit={habit} status="Missed Today" buttonText="Undo Missed" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} isSlipped={true} onSlipHabit={onSlipHabit} onUndoSlip={onUndoSlip} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} isFrozen={isHabitPaused(habit.id, dateKey, activeRestMode || null) || !!habit.snoozedDates?.includes(dateKey)} />
                </ViewportLazyWrapper>
               );
            })}

            {/* Completed */}
            {completed.length > 0 && (
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="watered-today-heading" className="col-span-full text-xs font-bold tracking-widest text-status-healthy uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Check className="w-4 h-4" /> Watered Today
              </motion.h3>
            )}
            {completed.map((habit) => {
               const isCompletedToday = completedTodayIds.includes(habit.id);
               const statusText = isCompletedToday 
                  ? (habit.type === 'avoid' ? 'Protected Today' : 'Completed Today')
                  : 'Target Met';
               const buttonText = isCompletedToday ? 'Undo' : 'Extra Care';
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               
               return (
                 <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                   <div className="opacity-80 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status={statusText} buttonText={buttonText} onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} isFrozen={isHabitPaused(habit.id, dateKey, activeRestMode || null) || !!habit.snoozedDates?.includes(dateKey)} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}

            {/* Resting Plants */}
            {resting.length > 0 && (
              <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="resting-heading" className="col-span-full text-xs font-bold tracking-widest text-status-resting uppercase flex items-center gap-2 border-b border-surface-alt pb-2 mb-2 mt-4">
                <Moon className="w-4 h-4" /> Resting Plants
              </motion.h3>
            )}
            {resting.map((habit) => {
               const quantityCurrent = stats.quantityLogs?.[dateKey]?.[habit.id] || 0;
               return (
                 <ViewportLazyWrapper key={habit.id} id={habit.id} index={globalIndex++}>
                   <div className="opacity-60 hover:opacity-100 transition-opacity h-full">
                     <MemoizedPlantHabitCard habit={habit} status="Resting" buttonText="Water" onWaterPlant={onWaterPlant} equippedPotId={stats.equippedPotId} onArchiveHabit={onArchiveHabit} onDeletePlant={onDeletePlant} onEditHabit={onEditHabit} onHarvestPlant={onHarvestPlant} isDarkPhase={isDarkPhase} eligibleBackdates={getEligibleBackdates(habit)} onBackdate={onBackdate} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={stats.customCategories} recentHistoryStr={recentHistoryStrings[habit.id] || ""} onSnooze={onSnoozeHabit} dateKey={dateKey} themeId={stats.themeId || 'cream_butter'} isFrozen={isHabitPaused(habit.id, dateKey, activeRestMode || null) || !!habit.snoozedDates?.includes(dateKey)} />
                   </div>
                 </ViewportLazyWrapper>
               );
            })}
                  </>
               );
            })()}
            </AnimatePresence>
          </motion.div>
        )}

        {habits.length > 0 && (
          <div className="mt-12 mb-12">
            <div className="flex items-center justify-between border-b border-surface-alt pb-3 mb-6">
               <h3 className="text-sm font-bold tracking-widest text-primary-text uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-mustard" /> Premium Garden Terrain View (2.5D)
               </h3>
               <span className="text-[10px] uppercase font-bold text-text-muted bg-surface-alt px-2 py-1 rounded-md tracking-wider">3D Garden Showcase</span>
            </div>
            <div className="relative shadow-2xl rounded-[32px] ring-4 ring-[#8BC34A]/20">
               <GardenCanvasTerrain habits={habits} logs={logs} stats={stats} onWaterPlant={(id) => onWaterPlant(id, false)} onMailboxClick={onMailboxClick} />
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Level Up Celebratory Animation Overlay with Sparkle Layer and Bounce */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
          >
            {/* Sparkle Confetti Layer */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(16)].map((_, i) => {
                const randomX = Math.random() * 100 - 50;
                const delay = Math.random() * 1.5;
                const duration = 2 + Math.random() * 2.5;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, y: 150, x: randomX * 4 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      scale: [0.5, 1.6, 1.6, 0.5], 
                      y: [150, -250 - Math.random() * 150],
                      x: [randomX * 4, randomX * 4 + (Math.random() * 60 - 30)]
                    }}
                    transition={{ 
                      duration: duration, 
                      delay: delay, 
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl select-none"
                  >
                    {['✨', '⭐', '🌸', '💫', '🎉', '🌱'][i % 6]}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.08, 0.98, 1], 
                y: 0, 
                opacity: 1 
              }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[var(--surface-card)] border-4 border-accent-mustard rounded-[32px] p-8 max-w-sm shadow-2xl relative z-10"
            >
              <div className="w-24 h-24 bg-accent-mustard/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-accent-mustard/30 relative shadow-inner">
                <Sparkles className="w-12 h-12 text-accent-mustard animate-pulse" />
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-accent-mustard rounded-full opacity-60"
                />
              </div>

              <h3 className="text-3xl font-black font-display text-primary-text uppercase tracking-widest mb-2">
                LEVEL UP!
              </h3>
              <p className="text-sm text-secondary-text mb-5 leading-relaxed">
                Your garden blooms with new vitality! Keep watering your habits to unlock new rare seeds and rewards.
              </p>

              <div className="bg-[var(--surface-soft)] border-2 border-[var(--surface-alt)] rounded-2xl py-4 px-8 mb-5 inline-block shadow-sm">
                <div className="text-[10px] font-mono tracking-widest text-muted-text uppercase font-semibold mb-1">New Garden Tier</div>
                <div className="text-4xl font-black text-accent-mustard font-display tracking-tight">
                  LEVEL {stats.level}
                </div>
              </div>

              {stats.rank && (
                <div className="text-xs font-bold text-accent-seafoam uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  <span>🏆</span>
                  <span>{stats.rank}</span>
                </div>
              )}

              <button
                onClick={() => setShowLevelUp(false)}
                className="mt-6 px-8 py-3 bg-accent-mustard text-primary-anchor rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-mustard/90 transition-all shadow-lg hover:shadow-accent-mustard/25 active:scale-95"
              >
                Keep Blooming!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customized Anchor Slot Customization Modal */}
      <AnimatedModal 
        isOpen={!!activeAnchorSlot} 
        onClose={() => setActiveAnchorSlot(null)} 
        alignment="bottom" 
        className="!p-6 !max-w-md mx-auto !rounded-t-[32px] !rounded-b-none overflow-hidden bg-[#1A1C1E] text-[#FDFBF7] border border-white/10 z-50"
      >
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Customize Slot {activeAnchorSlot ? activeAnchorSlot.replace('slot', '#') : ''}
              </h3>
              <p className="text-xs text-white/60 font-sans">
                {activeAnchorSlot ? SLOT_DEFINITIONS.find(s => s.id === activeAnchorSlot)?.label : ''}
              </p>
            </div>
            <button 
              onClick={() => setActiveAnchorSlot(null)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Snap-to-Grid Recommended Guides */}
          {activeAnchorSlot && (
            <div className="p-3 rounded-2xl bg-[#141517] border border-white/5 text-[11px] font-sans leading-relaxed text-white/80">
              {['slot1', 'slot3', 'slot4'].includes(activeAnchorSlot) ? (
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-extrabold text-amber-400">Background Slot Snap Recommendation: </span>
                    Fences or taller decorations (Birds, Butterflies, Rickshaw Signs) fit best here to prevent visual overlaps with foreground plants.
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-extrabold text-emerald-400">Foreground Slot Snap Recommendation: </span>
                    Pots or low-profile decorations (Pond, Fruit Basket, Clay Lamp, pitcher) fit best here to prevent blocking background items.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Selection / Remove action */}
          {activeAnchorSlot && anchorSlots[activeAnchorSlot as keyof typeof anchorSlots] && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {renderAnchoredItemGraphics(anchorSlots[activeAnchorSlot as keyof typeof anchorSlots]!)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {SHOP_ITEMS.find(item => item.id === anchorSlots[activeAnchorSlot as keyof typeof anchorSlots])?.name || 'Placed Item'}
                  </div>
                  <div className="text-[10px] text-white/40">Currently Anchored</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handlePlaceItem(activeAnchorSlot, null);
                  setActiveAnchorSlot(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}

          {/* Grid of placeable options */}
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 font-sans">
              Your Available Items ({placeableItems.length})
            </span>
            
            {placeableItems.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10">
                <Archive className="w-8 h-8 text-white/30 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-white/60 font-medium">No placeable pots or decorations owned yet.</p>
                <p className="text-[10px] text-white/40 mt-1">Visit the Garden Shop to unlock premium items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {placeableItems.map(item => {
                  const isFence = item.id.startsWith('fence_');
                  const isEquippedInAnotherSlot = !isFence && Object.entries(anchorSlots).some(([key, val]) => val === item.id && key !== activeAnchorSlot);
                  const isEquippedHere = activeAnchorSlot ? anchorSlots[activeAnchorSlot as keyof typeof anchorSlots] === item.id : false;
                  
                  const isBackgroundSlot = activeAnchorSlot ? ['slot1', 'slot3', 'slot4'].includes(activeAnchorSlot) : false;
                  const isTallOrFence = item.type === 'fence' || ['dec_butterfly', 'dec_bird', 'dec_rickshaw_sign'].includes(item.id);
                  const isOptimal = activeAnchorSlot 
                    ? (isBackgroundSlot ? isTallOrFence : !isTallOrFence)
                    : false;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (activeAnchorSlot) {
                          handlePlaceItem(activeAnchorSlot, item.id);
                          setActiveAnchorSlot(null);
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all relative overflow-hidden group text-center cursor-pointer ${
                        isEquippedHere
                          ? 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {/* Graphics preview */}
                      <div className="w-14 h-14 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        {renderAnchoredItemGraphics(item.id)}
                      </div>
                      
                      {/* Name & Type */}
                      <div className="text-[11px] font-bold text-white line-clamp-1">{item.name}</div>
                      <div className="text-[9px] text-white/40 font-mono capitalize mt-0.5">{item.type}</div>
                      
                      {/* Equipped Status badge */}
                      {isEquippedHere && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5 text-zinc-900 stroke-[3]" />
                        </div>
                      )}
                      
                      {isEquippedInAnotherSlot ? (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[7px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/10 uppercase tracking-wider font-sans">
                          Placed
                        </div>
                      ) : isOptimal ? (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[7px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider font-mono">
                          ✨ Optimal
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="text-[10px] text-white/40 text-center font-medium font-sans bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5">
            <div>
              💡 Tap any item to place it. Pots and decorations are unique, while fences can be duplicated.
            </div>
            <div className="text-emerald-400 font-bold font-mono text-[11px] tracking-wide flex items-center justify-center gap-1.5">
              <span>🚧 Fences Placed:</span>
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300">
                {Object.values(anchorSlots).filter(id => id && id.startsWith('fence_')).length} / {getMaxFencesAllowed(stats.level || 1)}
              </span>
              <span className="text-white/40 font-normal font-sans text-[10px]">(Max based on Garden Lvl {stats.level})</span>
            </div>
          </div>
        </div>
      </AnimatedModal>

    </div>
  );
});

export const renderPot = (equippedPotId?: string, className: string = "inset-x-2 bottom-1 h-3") => {
  if (equippedPotId === 'pot_clay_colorful') return <div className={`absolute ${className} bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_clay_basic') return <div className={`absolute ${className} bg-amber-700 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_bamboo_basket') return <div className={`absolute ${className} bg-[repeating-linear-gradient(45deg,#d97706,#d97706_2px,#b45309_2px,#b45309_4px)] rounded-b-sm opacity-90`} />;
  if (equippedPotId === 'pot_rooftop_tub') return <div className={`absolute ${className} bg-slate-400 border-t border-slate-300 rounded-b-md opacity-90 shadow-inner`} />;
  return null;
};

// Wrapper correctly memoizes inline functions to prevent re-renders
const MemoizedPlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWaterPlant, equippedPotId, isSlipped, onSlipHabit, onUndoSlip, onArchiveHabit, onDeletePlant, onEditHabit, onHarvestPlant, isDarkPhase, eligibleBackdates, onBackdate, backdatesLeftThisWeek, quantityCurrent, customCategories, recentHistoryStr, onSnooze, dateKey, themeId, isFrozen }) => {
   const handleWater = React.useCallback((isMini?: boolean, customAmount?: number) => onWaterPlant(habit.id, isMini, customAmount), [onWaterPlant, habit.id]);
   const handleSlip = React.useCallback(() => onSlipHabit && onSlipHabit(habit.id), [onSlipHabit, habit.id]);
   const handleUndo = React.useCallback(() => onUndoSlip && onUndoSlip(habit.id), [onUndoSlip, habit.id]);
   const handleArchive = React.useCallback(() => onArchiveHabit && onArchiveHabit(habit.id), [onArchiveHabit, habit.id]);
   const handleDelete = React.useCallback(() => onDeletePlant && onDeletePlant(habit.id), [onDeletePlant, habit.id]);
   const handleEdit = React.useCallback(() => onEditHabit && onEditHabit(habit), [onEditHabit, habit]);
   const handleHarvest = React.useCallback(() => onHarvestPlant && onHarvestPlant(habit.id), [onHarvestPlant, habit.id]);
   const handleBackdate = React.useCallback((d: string) => onBackdate && onBackdate(habit.id, d), [onBackdate, habit.id]);
   const handleSnooze = React.useCallback(() => onSnooze && onSnooze(habit.id, dateKey), [onSnooze, habit.id, dateKey]);

   return <PlantHabitCard habit={habit} status={status} buttonText={buttonText} onWater={handleWater} isSlipped={isSlipped} onSlip={onSlipHabit ? handleSlip : undefined} onUndo={onUndoSlip ? handleUndo : undefined} onArchive={onArchiveHabit ? handleArchive : undefined} onDelete={onDeletePlant ? handleDelete : undefined} onEdit={onEditHabit ? handleEdit : undefined} onHarvest={onHarvestPlant ? handleHarvest : undefined} isDarkPhase={isDarkPhase} equippedPotId={equippedPotId} eligibleBackdates={eligibleBackdates} onBackdate={onBackdate ? handleBackdate : undefined} backdatesLeftThisWeek={backdatesLeftThisWeek} quantityCurrent={quantityCurrent} customCategories={customCategories} recentHistoryStr={recentHistoryStr} onSnooze={onSnooze ? handleSnooze : undefined} dateKey={dateKey} themeId={themeId} isFrozen={isFrozen} />;
}, (prev, next) => {
  return prev.habit === next.habit &&
         prev.status === next.status &&
         prev.buttonText === next.buttonText &&
         prev.equippedPotId === next.equippedPotId &&
         prev.isSlipped === next.isSlipped &&
         prev.isDarkPhase === next.isDarkPhase &&
         prev.themeId === next.themeId &&
         prev.isFrozen === next.isFrozen &&
         prev.backdatesLeftThisWeek === next.backdatesLeftThisWeek &&
         prev.quantityCurrent === next.quantityCurrent &&
         prev.recentHistoryStr === next.recentHistoryStr &&
         prev.eligibleBackdates?.join(',') === next.eligibleBackdates?.join(',');
});

const PlantHabitCard: React.FC<any> = React.memo(({ habit, status, buttonText, onWater, isSlipped, onSlip, onUndo, equippedPotId, onArchive, onDelete, onEdit, onHarvest, isDarkPhase, eligibleBackdates = [], onBackdate, backdatesLeftThisWeek = 3, quantityCurrent = 0, customCategories = [], recentHistoryStr = "", onSnooze, dateKey, themeId, isFrozen }) => {
  const isDanger = status === 'Critical' || status === 'Wilting' || isSlipped;
  const isCompleted = status === 'Completed Today' || status === 'Protected Today' || status === 'Resting' || status === 'Target Met';
  
  const isPacha = habit.plantStage === 'Fruiting Plant' && habit.streak >= 21 && (habit.streak - (habit.lastHarvestStreak ?? 21) >= 7);
  const canHarvest = isPacha && !!onHarvest;

  const health = habit.plantHealth ?? 100;
  const healthColor = health < 25 ? 'text-accent-coral font-extrabold animate-pulse' : health < 50 ? 'text-accent-mustard font-bold' : 'text-primary-mint font-bold';

  const isTwoButtons = !isCompleted && !isSlipped && habit.type !== 'avoid' && !!onSlip;
  const getDisplayButtonText = () => {
    if (isSlipped) return "Undo Missed";
    const label = buttonText === "Water" ? "Water Plant" : buttonText;
    if (isTwoButtons) {
      if (label === "Water Plant") return "Water";
      if (label === "Revive Today") return "Revive";
      if (label === "Save Plant") return "Save";
      if (label === "Start Recovery") return "Recover";
      if (label === "Extra Care") return "Care";
    }
    return label;
  };
  
  const recentHistory = React.useMemo(() => {
    return recentHistoryStr.split('').map((s: string) => s === '1');
  }, [recentHistoryStr]);

  const healthTrend = React.useMemo(() => {
    if (!recentHistoryStr || recentHistoryStr.length < 6) return 0;
    const last3 = recentHistoryStr.slice(-3);
    const prev3 = recentHistoryStr.slice(-6, -3);
    const last3Count = (last3.match(/1/g) || []).length;
    const prev3Count = (prev3.match(/1/g) || []).length;
    
    if (last3Count > prev3Count || last3Count === 3) return 1;
    if (last3Count < prev3Count || last3Count === 0) return -1;
    return 0;
  }, [recentHistoryStr]);
  
  const [justCompleted, setJustCompleted] = useState(false);
  const [sheenActive, setSheenActive] = useState(false);
  const prevCompletedRef = React.useRef(isCompleted);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevCompletedRef.current !== isCompleted) {
      setSheenActive(true);
      const sheenTimer = setTimeout(() => setSheenActive(false), 850);
      
      if (!prevCompletedRef.current && isCompleted && (status === 'Completed Today' || status === 'Protected Today' || status === 'Target Met')) {
        setJustCompleted(true);
        playHaptic('thump');
        
        if (cardRef.current) {
           const rect = cardRef.current.getBoundingClientRect();
           const y = (rect.top + rect.height / 2) / window.innerHeight;
           const x = (rect.left + rect.width / 2) / window.innerWidth;
           
           const isMilestone = habit.streak > 0 && (habit.streak === 7 || habit.streak === 14 || habit.streak === 30 || habit.streak % 30 === 0);
           
           if (isMilestone) {
              const duration = 2000;
              const end = Date.now() + duration;
              const fireColors = ['#ff0000', '#ff4500', '#ffa500', '#ffd700'];

              (function frame() {
                 confetti({
                   particleCount: 5,
                   startVelocity: 30,
                   spread: 360,
                   ticks: 40,
                   origin: { x, y },
                   colors: fireColors,
                   zIndex: 100,
                   gravity: 0.5,
                   scalar: 1.2
                 });
                 if (Date.now() < end) {
                   requestAnimationFrame(frame);
                 }
              }());
           } else {
              confetti({
                particleCount: 40,
                spread: 70,
                origin: { x, y },
                colors: ['#00c98f', '#a8e6cf', '#dcedc1', '#f5f5f5'],
                zIndex: 100,
                scalar: 0.8,
                startVelocity: 25
              });
           }
        }

        const timer = setTimeout(() => setJustCompleted(false), 2000);
        prevCompletedRef.current = isCompleted;
        return () => {
          clearTimeout(timer);
          clearTimeout(sheenTimer);
        };
      }
      
      prevCompletedRef.current = isCompleted;
      return () => clearTimeout(sheenTimer);
    }
  }, [isCompleted, status, habit.streak]);

  const formattedSchedule = () => {
     if (habit.scheduleType === 'times_per_week') return `${habit.targetCount}x/week`;
     if (habit.scheduleType === 'weekly') return `Weekly`;
     if (habit.scheduleType === 'monthly') return `Monthly (Day ${habit.monthlyDay})`;
     if (habit.scheduleType === 'specific_days') return `Selected Days`;
     if (habit.scheduleType === 'quantity') return `${habit.quantityTarget} ${habit.quantityUnit}/day`;
     if (habit.scheduleType === 'custom_interval') return `Every ${habit.intervalValue} ${habit.intervalUnit}`;
     if (habit.scheduleType === 'anytime') return `Anytime`;
     return 'Daily';
  };
  
  const [showBackdateOptions, setShowBackdateOptions] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipReason, setSlipReason] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');
  const [showAgeInfo, setShowAgeInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const creationDateObj = habit.creationDate ? new Date(habit.creationDate) : new Date(habit.createdAt || Date.now());
  const activeDays = differenceInCalendarDays(new Date(), creationDateObj);
  const prettyCreationDate = format(creationDateObj, "MMM d, yyyy");

  let cardBg = 'glass-card';
  let cardBorder = 'border-status-healthy/30';
  let cardGlow = 'shadow-[0_0_15px_rgba(78,173,160,0.15),inset_0_0_25px_rgba(78,173,160,0.4)]';
  let statusColor = 'text-status-healthy';
  let buttonBg = 'bg-primary-mint text-white border border-transparent shadow-sm';
  let buttonHover = 'hover:bg-[#00c98f]';
  let iconBg = 'bg-primary-mint/20';

  if (isCompleted) {
    cardBg = 'glass-card bg-status-completed/10';
    cardBorder = 'border-primary-mint/30';
    cardGlow = 'shadow-[0_0_15px_rgba(78,173,160,0.1),inset_0_0_10px_rgba(78,173,160,0.1)]';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border border-surface-alt';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (isDanger) {
    cardBg = 'glass-card bg-status-wilting/5';
    cardBorder = 'border-status-wilting/40';
    cardGlow = 'shadow-[0_0_15px_rgba(229,183,105,0.2),inset_0_0_10px_rgba(229,183,105,0.1)] animate-[pulse_3s_ease-in-out_infinite]';
    if (status === 'Critical' || isSlipped) {
      cardBorder = 'border-status-critical/40';
      cardGlow = 'shadow-[0_0_20px_rgba(229,124,93,0.3),inset_0_0_15px_rgba(229,124,93,0.2)] animate-[pulse_2s_ease-in-out_infinite]';
    }
    statusColor = 'text-status-wilting';
    buttonBg = 'bg-status-needsCare text-white border border-transparent shadow-sm';
    buttonHover = 'hover:bg-[#d4b060]';
    iconBg = 'bg-status-wilting/20';
  } else if (status === 'Resting') {
    cardBg = 'glass-card bg-status-resting/10';
    cardBorder = 'border-status-resting/40';
    cardGlow = 'shadow-[0_0_15px_rgba(100,116,139,0.15),inset_0_0_10px_rgba(100,116,139,0.1)]';
    statusColor = 'text-status-resting';
    buttonBg = 'bg-surface-alt/50 text-secondary-text shadow-sm border border-surface-alt';
    buttonHover = 'hover:bg-surface-alt';
    iconBg = 'bg-surface-alt/50';
  } else if (canHarvest) {
    cardBg = 'glass-card bg-accent-peach/10';
    cardBorder = 'border-accent-peach/40';
    cardGlow = 'shadow-[0_0_20px_rgba(247,211,186,0.3),inset_0_0_20px_rgba(247,211,186,0.25)] animate-[pulse_3s_ease-in-out_infinite]';
    buttonBg = 'bg-accent-peach text-white shadow-sm border border-transparent';
    buttonHover = 'hover:bg-[#F4C5A5]';
    iconBg = 'bg-accent-peach/30';
  }

  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Check if swipe is mostly horizontal and significant distance
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 75) {
      if (distanceX > 0 && onSnooze && !isCompleted && status !== 'Resting') {
        // swipe left -> Snooze
        onSnooze();
      } else if (distanceX < 0 && onWater && !isCompleted && !isSlipped) {
        // swipe right -> Water
        onWater(false, undefined);
      }
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={false}
      animate={justCompleted ? { 
        scale: [1, 1.04, 1], 
        y: [0, -6, 0],
        borderColor: ["rgba(78, 173, 160, 0.3)", "#00f2fe", "rgba(78, 173, 160, 0.3)"],
        boxShadow: [
          "0 0 0px rgba(0, 242, 254, 0)",
          "0 0 40px rgba(0, 242, 254, 0.8), inset 0 0 20px rgba(0, 242, 254, 0.4)",
          "0 0 0px rgba(0, 242, 254, 0)"
        ],
        backgroundColor: [
          "rgba(78, 173, 160, 0.1)",
          "rgba(0, 242, 254, 0.2)",
          "rgba(78, 173, 160, 0.1)"
        ]
      } : { 
        scale: 1, y: 0, borderColor: "", boxShadow: "", backgroundColor: "" 
      }}
      transition={justCompleted ? { duration: 0.8, type: "spring", bounce: 0.5 } : { }}
      className={`${cardBg} rounded-2xl p-4 flex flex-col justify-between group transition-transform duration-300 relative h-full overflow-hidden border ${cardBorder} ${justCompleted ? '' : cardGlow} habit-card premium-shadow bg-clip-padding`}
    >
      {sheenActive && (
        <div className="sheen-layer sheen-active" />
      )}
      {justCompleted && (
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
           <div className="absolute inset-0 bg-gradient-to-tr from-status-healthy/30 to-transparent animate-pulse duration-500" />
           {[...Array(24)].map((_, i) => {
             const angle = Math.random() * Math.PI * 2;
             const velocity = 30 + Math.random() * 50;
             const tx = Math.cos(angle) * velocity;
             const ty = Math.sin(angle) * velocity;
             const colors = ['bg-[#00c98f]', 'bg-[#a8e6cf]', 'bg-[#dcedc1]', 'bg-[#3b82f6]', 'bg-accent-mustard', 'bg-accent-coral'];
             const color = colors[Math.floor(Math.random() * colors.length)];
             return (
               <motion.div
                 key={i}
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
      <div className="relative z-10 flex flex-col gap-2.5 h-full w-full justify-between">
      <AnimatePresence>
        {justCompleted && (
          <motion.div 
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute -top-4 right-8 z-50 pointer-events-none"
          >
            <div className="w-12 h-12 bg-surface-card rounded-full shadow-lg flex items-center justify-center text-2xl border-4 border-[#00F5D4]">
              🌱
            </div>
            <motion.div 
               animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 rounded-full border-2 border-[#00F5D4]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`absolute top-3 right-3 flex gap-1 z-20 transition-all ${showSettings ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
        {onSnooze && !isCompleted && status !== 'Resting' && (
          <button
            onClick={onSnooze}
            className="p-2 text-muted-text hover:text-primary-text hover:bg-surface-alt/50 rounded-full"
            title="Snooze for 24h"
          >
            <Clock className="w-4 h-4" />
          </button>
        )}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'text-primary-text bg-surface-alt' : 'text-muted-text hover:text-primary-text hover:bg-surface-alt/50'}`}
            title="Settings"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showSettings && (
            <>
               <div className="fixed inset-0 z-20" onClick={() => setShowSettings(false)} />
               <div className="absolute top-10 right-0 bg-surface-card border border-surface-alt rounded-xl shadow-lg z-30 flex flex-col p-1 animate-in zoom-in-95 duration-100 w-36">
                 {onEdit && (
                   <button
                     onClick={() => { onEdit(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary-text hover:text-accent-seafoam transition-colors rounded-lg hover:bg-surface-alt text-left w-full"
                   >
                     <Edit2 className="w-3.5 h-3.5" /> Edit Habit
                   </button>
                 )}
                 {onArchive && (
                   <button
                     onClick={() => { onArchive(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary-text hover:text-accent-periwinkle transition-colors rounded-lg hover:bg-surface-alt text-left w-full"
                   >
                     <Archive className="w-3.5 h-3.5" /> Archive
                   </button>
                 )}
                 {onDelete && (
                   <button
                     onClick={() => { onDelete(habit.id); setShowSettings(false); }}
                     className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-status-critical transition-colors rounded-lg hover:bg-status-critical/10 text-left w-full"
                   >
                     <Trash2 className="w-3.5 h-3.5" /> Delete
                   </button>
                 )}
               </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {/* Top Row: Plant Showcase & Info Details */}
        <div className="flex flex-row items-stretch gap-3 w-full">
             {/* Premium Glass Showcase Container for Plant Icon */}
             <div 
               onClick={() => setShowAgeInfo(!showAgeInfo)} 
               className="w-[74px] h-[92px] shrink-0 flex flex-col items-center justify-end relative group cursor-pointer bg-gradient-to-b from-slate-900/10 to-slate-900/5 dark:from-white/10 dark:to-white/5 border border-slate-900/15 dark:border-white/15 rounded-xl p-1 shadow-inner transition-all duration-300 hover:scale-[1.03] active:scale-95 pt-1 overflow-hidden"
             >
               {/* Ambient grid background pattern inside display case */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
               <AnimatePresence>
                   {showAgeInfo && (
                     <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.9 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 5, scale: 0.9 }}
                       className="absolute -top-[4.5rem] left-1/2 -translate-x-1/2 z-40 bg-surface text-primary-text text-[10px] whitespace-nowrap p-2 rounded-lg shadow-xl border border-surface-alt font-sans pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150"
                     >
                       <div className="font-bold text-center mb-0.5 text-primary-mint text-[11px]">Lifespan</div>
                       <div className="opacity-90">Planted: {prettyCreationDate}</div>
                       <div className="opacity-90">Days active: {activeDays}</div>
                       <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-b border-r border-surface-alt rotate-45" />
                     </motion.div>
                   )}
               </AnimatePresence>
               <AnimatePresence>
                 {justCompleted && (
                   <motion.div 
                     initial={{ opacity: 1 }} 
                     animate={{ opacity: 1 }} 
                     exit={{ opacity: 0 }} 
                     className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
                   >
                     {[...Array(6)].map((_, i) => (
                       <motion.div
                         key={`water-${i}`}
                         initial={{ top: -20, left: 10 + Math.random() * 60, scale: 0, opacity: 0 }}
                         animate={{ top: 80, scale: 1, opacity: [0, 1, 0] }}
                         transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeIn' }}
                         className="absolute w-2 h-3 bg-blue-400/80 rounded-full drop-shadow-sm"
                         style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                       />
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
               <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} health={habit.plantHealth} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className={`w-16 h-20 absolute bottom-[8%] z-10 drop-shadow-md animate-breathe transform-gpu will-change-transform group-hover:scale-[1.05] transition-transform ${isSlipped ? 'opacity-80 grayscale-[0.5]' : ''} ${canHarvest ? 'animate-bounce drop-shadow-sm scale-105' : ''} ${habit.plantStage === 'Fruiting Plant' && !canHarvest ? 'opacity-95' : ''}`} />
               {/* Position custom pot exactly overlapping the base */}
               {renderPot(equippedPotId, 'absolute bottom-[12%] inset-x-3.5 h-3 z-20')}
               {/* Elliptical shadow under the plant */}
               <div className="w-12 h-1.5 bg-black/15 shadow-[0_0_8px_3px_rgba(0,0,0,0.15)] rounded-[100%] absolute bottom-[4%] z-0" />
             </div>
             
             {/* Right Column: Title, Category, Status, Descs */}
             <div className="flex-1 flex flex-col justify-between min-w-0 pr-1 py-0.5">
               <div className="flex flex-col gap-1">
                 <div className="flex items-center justify-between gap-1 flex-wrap">
                   <motion.div className="text-[8px] font-extrabold tracking-widest uppercase flex items-center gap-1 leading-none px-1.5 py-0.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 shadow-sm">
                     {isCompleted ? <Check className="w-2.5 h-2.5 text-status-healthy" /> : status === 'Critical' ? <AlertTriangle className="w-2.5 h-2.5 text-status-critical animate-pulse" /> : status === 'Wilting' ? <AlertTriangle className="w-2.5 h-2.5 text-status-wilting" /> : isSlipped ? <ShieldAlert className="w-2.5 h-2.5 text-[#E57C5D]" /> : status === 'Resting' ? <Moon className="w-2.5 h-2.5 text-status-resting" /> : <Leaf className="w-2.5 h-2.5 text-status-healthy" />}
                     <motion.span className={`transition-colors duration-500 font-mono text-[8px] ${statusColor}`}>{isSlipped ? "Slipped" : status}</motion.span>
                   </motion.div>
                   {(() => {
                      if (!habit.category) return null;
                       const custom = customCategories.find((c: any) => c.id === habit.category || c.name === habit.category);
                       if (custom) {
                          return (
                             <span className="text-[7.5px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0" style={{ backgroundColor: `${custom.color}20`, color: custom.color, border: `1px solid ${custom.color}30` }}>
                               {custom.name}
                             </span>
                          );
                       }
                       return (
                         <span className="text-[7.5px] px-1.5 py-0.5 rounded-full border border-surface-alt bg-surface-alt/20 text-slate-400 uppercase tracking-wider font-bold shrink-0">
                           {habit.category.replace('_', ' ')}
                         </span>
                       );
                    })()}
                 </div>

                 <h4 className="font-extrabold text-primary-text text-[13px] lg:text-[14px] capitalize tracking-tight leading-snug truncate mt-0.5 flex items-center gap-1.5">
                   <span className="truncate max-w-[130px] sm:max-w-none">{habit.type === 'avoid' && habit.isPrivate ? 'Protected' : habit.name}</span>
                   {isFrozen && (
                     <div title="Streak Protected" className="bg-[#E0F7FA]/20 text-[#00BCD4] p-0.5 rounded-full ring-1 ring-[#00BCD4]/30 shadow-[0_0_8px_rgba(0,188,212,0.3)]">
                       <Snowflake className="w-3 h-3" />
                     </div>
                   )}
                 </h4>

                 {/* Advanced Health Vitality Bar */}
                 <div className="flex flex-col gap-0.5 mt-1">
                   <div className="flex items-center justify-between text-[8.5px] font-bold text-muted-text">
                     <span className="flex items-center gap-0.5"><Leaf className="w-2 h-2 text-primary-mint"/> Vitality</span>
                     <span className={`flex items-center gap-0.5 ${healthColor}`}>
                        {health}%
                        {healthTrend === 1 && <span title="Improving health"><TrendingUp className="w-2.5 h-2.5 text-primary-mint" /></span>}
                        {healthTrend === -1 && <span title="Declining health"><TrendingDown className="w-2.5 h-2.5 text-status-critical" /></span>}
                     </span>
                   </div>
                   <div className="w-full h-1 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden p-[1px] border border-slate-300/20 dark:border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${health}%` }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                       className={`h-full rounded-full ${
                         health < 25 ? 'bg-gradient-to-r from-red-500 to-status-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                         health < 50 ? 'bg-gradient-to-r from-amber-500 to-status-needsCare' : 
                         'bg-gradient-to-r from-emerald-500 to-status-healthy shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                       }`}
                     />
                   </div>
                 </div>
               </div>
               
               {habit.description && (() => {
                  const isDarkTheme = (THEME_INFOS[themeId as keyof typeof THEME_INFOS]?.isDark ?? false);
                  const descTextColor = isDarkTheme 
                    ? (isDarkPhase ? 'text-slate-200/80' : 'text-slate-300/85')
                    : (isDarkPhase ? 'text-slate-600' : 'text-slate-700');
                  return (
                    <p className={`text-[9px] mt-1 leading-snug line-clamp-1 transition-colors ${descTextColor} opacity-90 font-medium tracking-wide`}>
                       {habit.description}
                    </p>
                  );
               })()}
             </div>
        </div>


        {/* Schedule and Targets Row */}
        {((habit.scheduleType && habit.scheduleType !== 'daily') || (habit.scheduleType === 'quantity' && habit.quantityTarget !== undefined && habit.quantityTarget > 0)) && (
          <div className="flex flex-wrap items-center gap-1 mb-1.5 h-[16px]">
            {habit.scheduleType && habit.scheduleType !== 'daily' && (
               <div className="inline-flex items-center px-1.5 py-0.5 bg-surface-alt/40 border border-black/5 rounded-chip text-[8px] font-bold text-muted-text tracking-wide uppercase shrink-0">
                  {formattedSchedule()}
               </div>
            )}
            {habit.scheduleType === 'quantity' && habit.quantityTarget !== undefined && habit.quantityTarget > 0 && (
               <div className="inline-flex items-center px-1.5 py-0.5 bg-status-healthy/10 border border-status-healthy/20 rounded-chip text-[8px] font-extrabold text-status-healthy tracking-wider uppercase shrink-0">
                  Progress: {quantityCurrent} / {habit.quantityTarget} {habit.quantityUnit}
               </div>
            )}
          </div>
        )}

        {/* Full Width Collapsible Sparkline Panel */}
        {recentHistory && recentHistory.length > 0 && (
           <div className="w-full">
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 setIsExpanded(!isExpanded);
               }}
               className="text-[9px] font-mono tracking-widest uppercase text-muted-text hover:text-primary-text flex items-center gap-1 transition-colors mb-1"
             >
               <span>{isExpanded ? "Hide History" : "Show History"}</span>
               <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
             </button>
             
             <motion.div
               initial={false}
               animate={{ 
                 height: isExpanded ? "auto" : 0,
                 opacity: isExpanded ? 1 : 0,
                 marginTop: isExpanded ? 4 : 0
               }}
               transition={{ 
                 type: "spring", 
                 stiffness: 220, 
                 damping: 24 
               }}
               className="overflow-hidden"
             >
               <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-2.5 shadow-inner">
                 <div className="text-[9px] text-muted-text font-bold uppercase tracking-wider mb-1.5">7-Day Completion History</div>
                 <div className="flex items-end gap-1.5 h-6 opacity-95 justify-between px-1" aria-label="7-day sparkline">
                   {recentHistory.map((completed: boolean, idx: number) => (
                      <div 
                         key={idx} 
                         className={`w-2.5 rounded-sm transition-all ${completed ? 'bg-status-healthy h-full shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-surface-alt/40 h-2'}`}
                         title={completed ? 'Completed' : 'Missed/Not Scheduled'}
                      />
                   ))}
                 </div>
               </div>
             </motion.div>
           </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2 mt-auto w-full">
         <div className="flex flex-col gap-2.5 w-full">
            <div className="flex items-center justify-between w-full px-1">
               <span className="text-[11px] font-bold text-status-needsCare flex items-center gap-1">
                   <div className="relative inline-flex items-center">
                    <Flame
                      className={`w-3.5 h-3.5 origin-bottom ${habit.streak >= 30 ? 'text-accent-coral animate-flameFlicker' : habit.streak >= 21 ? 'text-accent-mustard animate-flameFlicker' : habit.streak >= 14 ? 'text-accent-coral animate-flameFlicker' : habit.streak >= 5 ? 'text-accent-mustard animate-flameFlicker' : habit.streak > 0 ? 'animate-flameFlicker' : ''}`}
                      style={{
                        animationDuration: habit.streak >= 30 ? '0.2s' : habit.streak >= 21 ? '0.3s' : habit.streak >= 14 ? '0.5s' : habit.streak >= 5 ? '0.8s' : '1.2s',
                        filter: habit.streak >= 30 ? 'drop-shadow(0 0 8px rgba(229,124,93,0.8)) brightness(1.5)' : 
                                habit.streak >= 21 ? 'drop-shadow(0 0 6px rgba(244,196,71,0.7)) brightness(1.3)' : 
                                habit.streak >= 14 ? 'drop-shadow(0 0 4px rgba(229,124,93,0.6)) brightness(1.1)' : 
                                habit.streak >= 5 ? 'drop-shadow(0 0 2px rgba(244,196,71,0.4))' : 'none',
                        transform: habit.streak >= 30 ? 'scale(1.25)' : habit.streak >= 21 ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                    {/* Sparks/Fire Particles for Multiplier Tiers */}
                    {habit.streak >= 5 && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <span className="absolute -top-1.5 -left-1 w-1 h-1 bg-accent-mustard rounded-full animate-bounce opacity-70" style={{ animationDuration: '0.8s', boxShadow: '0 0 2px var(--color-accent-mustard-rgb)' }} />
                        <span className="absolute -top-3 left-1.5 w-1 h-1 bg-accent-coral rounded-full animate-ping opacity-90" style={{ animationDuration: '1.2s' }} />
                        <span className="absolute -top-2 left-3 w-1 h-1 bg-accent-mustard rounded-full animate-bounce opacity-80" style={{ animationDuration: '1.5s', boxShadow: '0 0 2px var(--color-accent-mustard-rgb)' }} />
                      </div>
                    )}
                 </div> Streak: 
                 <AnimatePresence mode="popLayout">
                    <motion.span
                       key={habit.streak}
                       initial={{ scale: 0.5, y: -10, opacity: 0 }}
                       animate={{ scale: 1, y: 0, opacity: 1 }}
                       exit={{ scale: 1.5, y: 10, opacity: 0, position: 'absolute' }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                       className="inline-block relative"
                    >
                       {habit.streak}
                    </motion.span>
                 </AnimatePresence>
               </span>
            </div>
            
            <div className="w-full flex justify-center">
            {canHarvest ? (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={onHarvest}
                    className={`px-4 py-2 min-h-[38px] h-[38px] w-full rounded-xl hover:scale-[1.02] font-extrabold text-xs tracking-wide transition-all duration-300 active:scale-[0.98] active:shadow-inner active:opacity-80 flex items-center justify-center gap-1.5 ${buttonBg} ${buttonHover}`}
                 >
                    Harvest 🧺
                 </button>
               </div>
            ) : habit.scheduleType === 'quantity' && quantityCurrent < (habit.quantityTarget || 1) ? (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={() => onWater(true)}
                    disabled={isSlipped}
                    className={`px-3 py-2 min-h-[38px] h-[38px] flex-1 rounded-xl hover:scale-[1.02] font-extrabold text-xs tracking-wide transition-all duration-300 active:scale-[0.98] active:shadow-inner active:opacity-80 flex items-center justify-center gap-1.5 ${buttonBg} ${buttonHover} disabled:opacity-50`}
                 >
                    +1
                 </button>
                 <button 
                    onClick={() => setShowQuantityModal(true)}
                    disabled={isSlipped}
                    className={`px-3 py-2 min-h-[38px] h-[38px] flex-1 rounded-xl hover:scale-[1.02] font-extrabold text-xs tracking-wide transition-all duration-300 active:scale-[0.98] active:shadow-inner active:opacity-80 flex items-center justify-center gap-1.5 bg-surface-alt text-white border border-transparent hover:bg-zinc-700 disabled:opacity-50`}
                 >
                    Log...
                 </button>
               </div>
            ) : (
               <div className="flex flex-row justify-center items-center gap-3 w-full">
                 <button 
                    onClick={() => {
                      if (isSlipped && onUndo) onUndo();
                      else if (!isSlipped) onWater();
                    }} 
                    className={`flex-1 py-2 px-3 min-h-[38px] h-[38px] rounded-xl font-extrabold text-xs lg:text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] active:shadow-inner active:opacity-80 flex items-center justify-center gap-1.5 ${isSlipped ? 'bg-transparent text-[#E57C5D] border border-[#E57C5D] hover:bg-[#E57C5D]/10' : isCompleted ? buttonBg + ' ' + buttonHover : 'bg-[var(--primary-anchor)] text-[var(--bg-base)] border border-transparent hover:opacity-90 shadow-md'}`}
                 >
                    {habit.type === 'avoid' ? <ShieldAlert className="w-4 h-4" /> : isSlipped ? <AlertCircle className="w-4 h-4" /> : <Droplet className="w-4 h-4" />}
                    <span className="truncate">{getDisplayButtonText()}</span>
                 </button>
                 {!isCompleted && !isSlipped && habit.type !== 'avoid' && onSlip && (
                   <button
                     onClick={() => onSlip()}
                     className="px-3 py-2 min-h-[38px] h-[38px] flex-1 rounded-xl font-extrabold text-xs lg:text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] active:shadow-inner active:opacity-80 flex items-center justify-center bg-transparent text-[#E57C5D] border border-[#E57C5D] hover:bg-[#E57C5D]/10"
                   >
                     <span className="truncate">Missed</span>
                   </button>
                 )}
               </div>
            )}
            </div>
         </div>

         {/* Action Row Removed (Now in settings dropdown) */}

         {showBackdateOptions && eligibleBackdates.length > 0 && onBackdate && (
            <div className="absolute inset-x-0 bottom-0 bg-surface-card p-4 rounded-b-[24px] border-t border-surface-alt shadow-lg z-30 animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex justify-between items-center mb-3">
                   <h5 className="text-[11px] font-bold uppercase tracking-wide text-secondary-text">Repair Journey</h5>
                   <button onClick={() => setShowBackdateOptions(false)} className="text-muted-text hover:text-primary-text p-1"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex gap-2">
                   {eligibleBackdates.map((dateStr: string) => {
                       const dayName = format(new Date(dateStr), 'EEEE');
                       const isTMinus3 = format(subDays(new Date(), 3), 'yyyy-MM-dd') === dateStr;
                       return (
                          <button key={dateStr} onClick={() => { onBackdate(dateStr); setShowBackdateOptions(false); }} className="flex-1 bg-surface-card hover:bg-surface-alt text-secondary-text border border-surface-alt py-2 rounded-xl font-bold text-[10px] uppercase tracking-wide transition-colors flex flex-col items-center gap-1 shadow-sm">
                             <span>Repair {dayName}</span>
                             <span className="text-muted-text text-[9px]">{isTMinus3 ? '-1 Streak Repair' : '-5 coins'} · {backdatesLeftThisWeek} left</span>
                          </button>
                       );
                   })}
                </div>
                {backdatesLeftThisWeek <= 0 && (
                   <p className="text-[10px] text-status-critical mt-2 text-center uppercase font-bold tracking-wide">Weekly limit reached (Max 3)</p>
                )}
            </div>
         )}
         
         {!showBackdateOptions && eligibleBackdates.length > 0 && Array.isArray(eligibleBackdates) && eligibleBackdates.length > 0 && (
             <button onClick={() => setShowBackdateOptions(true)} className="w-full text-center mt-2 text-[11px] font-bold text-muted-text hover:text-secondary-text tracking-wide transition-colors">
                Forgot to log a day? 🕰️
             </button>
         )}

         {habit.type === 'avoid' && (
            <button
               onClick={() => {
                 if (isSlipped && onUndo) onUndo();
                 else if (!isSlipped && onSlip && !isCompleted) setShowSlipModal(true);
               }}
               disabled={isCompleted}
               className={`w-full py-1.5 mt-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] ${
                  isCompleted ? 'opacity-0 cursor-default pointer-events-none' :
                  isSlipped ? 'bg-status-critical/10 text-status-critical hover:bg-status-critical/20' :
                  'bg-surface-card text-muted-text border border-surface-alt hover:bg-surface-alt hover:text-primary-text'
               }`}
            >
               {isSlipped ? "Undo Slip (Recover)" : "I Slipped"}
            </button>
         )}
      </div>
      </div>

      <AnimatedModal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} alignment="center" className="!p-0 !max-w-sm mx-auto overflow-hidden bg-surface-card border border-surface-alt">
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-accent-mustard" /> Plant Protection
               </h3>
               <button onClick={() => setShowSlipModal(false)} className="p-2 -mr-2 text-muted-text hover:text-primary-text transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <p className="text-secondary-text text-sm mb-6">
              It happens to the best of gardeners. Log this slip, shake it off, and focus on the next step. Your plant will recover if you care for it.
            </p>

            <form onSubmit={(e) => {
               e.preventDefault();
               if (onSlip) {
                  onSlip(); // The reason can be supported but `DailyGarden` parent passes `handleSlipHabit(id, reason)` optionally - wait, signature in DailyGarden is onSlip?: () => void. So the reason is dropped. That's fine for now, or we can update it if we have time.
                  setSlipReason('');
                  setShowSlipModal(false);
               }
            }}>
               <button type="submit" className="w-full bg-accent-seafoam/10 text-accent-seafoam py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-accent-seafoam/20 transition-colors shadow-sm">
                  Start Recovery
               </button>
            </form>
         </div>
      </AnimatedModal>

      <AnimatedModal isOpen={showQuantityModal} onClose={() => setShowQuantityModal(false)} alignment="bottom" className="!p-0 !max-w-sm mx-auto !rounded-t-[32px] !rounded-b-none overflow-hidden bg-surface-card border border-surface-alt">
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <Target className="w-5 h-5 text-accent-seafoam" /> Log Progress
               </h3>
               <button onClick={() => setShowQuantityModal(false)} className="p-2 -mr-2 text-muted-text hover:text-primary-text transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <p className="text-secondary-text text-xs font-mono uppercase tracking-widest mb-4 flex justify-between">
              <span>Goal: {habit.quantityTarget} {habit.quantityUnit}</span>
              <span>Done: {quantityCurrent}</span>
            </p>

            <form onSubmit={(e) => {
               e.preventDefault();
               const amount = Number(manualQuantity);
               if (amount > 0) {
                  onWater(false, amount);
                  setManualQuantity('');
                  setShowQuantityModal(false);
               }
            }} className="flex gap-2">
               <input 
                  type="number" 
                  autoFocus
                  className="flex-1 bg-surface-soft border border-surface-alt rounded-xl px-4 py-3 text-primary-text font-mono outline-none focus:border-accent-seafoam transition-colors"
                  placeholder={`Amount of ${habit.quantityUnit || 'units'}`}
                  value={manualQuantity}
                  onChange={e => setManualQuantity(e.target.value)}
                  min={1}
               />
               <button type="submit" disabled={!manualQuantity} className="bg-accent-seafoam text-black px-6 py-3 rounded-xl font-bold font-mono tracking-widest uppercase hover:bg-accent-seafoam/80 transition-colors shadow-sm disabled:opacity-50">
                  Save
               </button>
            </form>
         </div>
      </AnimatedModal>

    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.habit.id === nextProps.habit.id &&
         prevProps.status === nextProps.status &&
         prevProps.buttonText === nextProps.buttonText &&
         prevProps.isSlipped === nextProps.isSlipped &&
         prevProps.equippedPotId === nextProps.equippedPotId &&
         prevProps.isDarkPhase === nextProps.isDarkPhase &&
         prevProps.quantityCurrent === nextProps.quantityCurrent &&
         prevProps.habit.plantHealth === nextProps.habit.plantHealth &&
         prevProps.habit.streak === nextProps.habit.streak &&
         prevProps.habit.plantStage === nextProps.habit.plantStage &&
         prevProps.habit.plantStatus === nextProps.habit.plantStatus &&
         prevProps.habit.isArchived === nextProps.habit.isArchived &&
         prevProps.recentHistoryStr === nextProps.recentHistoryStr;
});
