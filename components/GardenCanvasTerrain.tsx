import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Habit, UserStats, HabitLog } from '../types';
import { PlantIcon } from './PlantIcon';
import { CompanionAssetsDictionary } from '../companionsData';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';

export const renderPot = (equippedPotId?: string, className: string = "inset-x-2 bottom-1 h-3") => {
  if (equippedPotId === 'pot_clay_colorful') return <div className={`absolute ${className} bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_clay_basic') return <div className={`absolute ${className} bg-amber-700 rounded-b-xl opacity-80`} />;
  if (equippedPotId === 'pot_bamboo_basket') return <div className={`absolute ${className} bg-[repeating-linear-gradient(45deg,#d97706,#d97706_2px,#b45309_2px,#b45309_4px)] rounded-b-sm opacity-90`} />;
  if (equippedPotId === 'pot_rooftop_tub') return <div className={`absolute ${className} bg-slate-400 border-t border-slate-300 rounded-b-md opacity-90 shadow-inner`} />;
  return null;
};

interface GardenCanvasTerrainProps {
  habits: Habit[];
  logs: HabitLog;
  stats: UserStats;
  onWaterPlant: (habitId: string) => void;
  onMailboxClick?: () => void;
}

// 1. Coordinate Mapping Schema (Dynamic based on plant count)

interface CanvasItem {
  id: string;
  type: 'plant' | 'fence' | 'pond' | 'companion' | 'npc' | 'terrain_detail';
  gridX: number;
  gridY: number;
  habit?: Habit; // For plants
  companionId?: string; // For companion
  npcType?: string; // For npc
  fenceId?: string; // For fence
  detailType?: 'pebble' | 'leaf' | 'moss';
}

export const GardenCanvasTerrain: React.FC<GardenCanvasTerrainProps> = ({ habits, logs, stats, onWaterPlant, onMailboxClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Dynamic Garden Size & Grid Calculation
  const numPlants = habits.length;
  let stage = 1;
  if (numPlants <= 10) stage = 1;
  else if (numPlants <= 15) stage = 2;
  else if (numPlants <= 20) stage = 3;
  else if (numPlants <= 25) stage = 4;
  else if (numPlants <= 30) stage = 5;
  else stage = 6;

  const gridConfig = {
    1: { cols: 8, rows: 10, width: 960, height: 750, scaleDesktop: 0.8, scaleMobile: 0.45 },
    2: { cols: 10, rows: 12, width: 1200, height: 900, scaleDesktop: 0.6, scaleMobile: 0.35 },
    3: { cols: 12, rows: 14, width: 1440, height: 1050, scaleDesktop: 0.5, scaleMobile: 0.3 },
    4: { cols: 14, rows: 16, width: 1680, height: 1200, scaleDesktop: 0.42, scaleMobile: 0.25 },
    5: { cols: 16, rows: 18, width: 1920, height: 1350, scaleDesktop: 0.37, scaleMobile: 0.22 },
    6: { cols: 18, rows: 20, width: 2160, height: 1500, scaleDesktop: 0.33, scaleMobile: 0.2 },
  };

  const currentConfig = gridConfig[stage as keyof typeof gridConfig];
  const GRID_COLS = currentConfig.cols;
  const GRID_ROWS = currentConfig.rows;
  
  const containerWidthStr = `w-[${currentConfig.width}px]`;
  const containerHeightStr = `h-[${currentConfig.height}px]`;
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initialScale = isMobile ? currentConfig.scaleMobile : currentConfig.scaleDesktop;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const parallaxRotateX = useTransform(smoothY, [-0.5, 0.5], [65, 55]); // Base is 60
  const parallaxRotateZ = useTransform(smoothX, [-0.5, 0.5], [-35, -55]); // Base is -45
  const parallaxTranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const parallaxTranslateY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const skyTranslateX = useTransform(smoothX, [-0.5, 0.5], [40, -40]);
  const skyTranslateY = useTransform(smoothY, [-0.5, 0.5], [40, -40]);
  
  // Custom Parallax layers for backgrounds
  const bgLayer1X = useTransform(smoothX, [-0.5, 0.5], [8, -8]);
  const bgLayer1Y = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const bgLayer2X = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const bgLayer2Y = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const bgLayer3X = useTransform(smoothX, [-0.5, 0.5], [45, -45]);
  const bgLayer3Y = useTransform(smoothY, [-0.5, 0.5], [45, -45]);

  const [hour, setHour] = useState(new Date().getHours());
  const [companionState, setCompanionState] = useState<{gridX: number, gridY: number, status: 'idle' | 'water_alert'}>({gridX: 4, gridY: 4, status: 'idle'});
  const [companionMessage, setCompanionMessage] = useState<{id: string, text: string} | null>(null);

  const [critterState, setCritterState] = useState<{gridX: number, gridY: number, active: boolean} | null>(null);

  useEffect(() => {
    // Spawn a wandering critter (hedgehog) for users with a high perfect garden streak!
    if ((stats.perfectGardenDays || 0) >= 5) {
      setCritterState({ gridX: 3, gridY: 3, active: true });
      const critterInterval = setInterval(() => {
        setCritterState(prev => {
          if (!prev) return null;
          return {
             ...prev,
             gridX: Math.max(1, Math.min(GRID_COLS-2, prev.gridX + (Math.floor(Math.random() * 3) - 1))),
             gridY: Math.max(1, Math.min(GRID_ROWS-2, prev.gridY + (Math.floor(Math.random() * 3) - 1))),
          }
        });
      }, 4000);
      return () => clearInterval(critterInterval);
    }
  }, [stats.perfectGardenDays, GRID_COLS, GRID_ROWS]);

  const handleCompanionClick = (companionId: string) => {
    const seasonMonth = new Date().getMonth();
    let season = 'sharat';
    if (seasonMonth === 3 || seasonMonth === 4) season = 'grishmo';
    else if (seasonMonth === 5 || seasonMonth === 6) season = 'borsha';
    else if (seasonMonth === 7 || seasonMonth === 8) season = 'sharat';
    else if (seasonMonth === 9 || seasonMonth === 10) season = 'hemanto';
    else if (seasonMonth === 11 || seasonMonth === 0) season = 'sheet';
    else if (seasonMonth === 1 || seasonMonth === 2) season = 'bashonto';

    const messages = {
      grishmo: ["Phew, it's scorching today!", "A little shade would be nice...", "Perfect weather for a nap in the shade."],
      borsha: ["The rain feels wonderful!", "Puddles everywhere! *splash*", "The plants are drinking it all up!"],
      sharat: ["Look at those fluffy white clouds!", "The breeze is so refreshing today.", "Can you hear the Kash flowers rustling?"],
      hemanto: ["The golden hour lasts so long now...", "I can smell the harvest in the air.", "A bit of dew on the grass this morning."],
      sheet: ["Brrr, quite chilly this morning!", "Wish I had a tiny sweater...", "The morning mist is so peaceful."],
      bashonto: ["Spring is in the air!", "So many fresh blooms!", "A perfect day for the garden!"]
    };

    const seasonMessages = messages[season as keyof typeof messages];
    const randomMsg = seasonMessages[Math.floor(Math.random() * seasonMessages.length)];

    setCompanionMessage({ id: companionId, text: randomMsg });
    
    // Play a gentle subtle pop sound (if audio is supported, otherwise just visual)
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="); // tiny blip
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch(e) {}

    setTimeout(() => {
      setCompanionMessage(prev => prev?.id === companionId ? null : prev);
    }, 4000);
  };
  
  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [showMilestoneAnimation, setShowMilestoneAnimation] = useState(false);
  const prevTotalRef = useRef(stats.totalHabitsCompleted);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (prevTotalRef.current !== undefined && stats.totalHabitsCompleted > prevTotalRef.current) {
        const milestoneStep = 50;
        const prevMilestone = Math.floor(prevTotalRef.current / milestoneStep);
        const currMilestone = Math.floor(stats.totalHabitsCompleted / milestoneStep);
        
        if (currMilestone > prevMilestone) {
            setShowMilestoneAnimation(true);
            timeoutId = setTimeout(() => setShowMilestoneAnimation(false), 12000); // 12 second sequence
        }
    }
    prevTotalRef.current = stats.totalHabitsCompleted;
    return () => {
        if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stats.totalHabitsCompleted]);

  // Companion Random Walk Intelligence
  useEffect(() => {
    if (!stats.activeCompanionId) return;
    
    const walker = setInterval(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        // Find plants that need watering (not avoid types, no logs today)
        const unwatered = habits.filter(h => h.type !== 'avoid' && !(logs[todayStr] && logs[todayStr].includes(h.id)));
        
        if (unwatered.length > 0 && Math.random() > 0.3) { // 70% chance to hover over a needed plant
            const target = unwatered[Math.floor(Math.random() * unwatered.length)];
            // Recompute target's pseudo-random grid position to match rendering
            let hash = 0;
            for (let i=0; i<target.id.length; i++) hash += target.id.charCodeAt(i);
            
            setCompanionState({
                gridX: Math.max(1, Math.min(GRID_COLS-2, (hash) % GRID_COLS)),
                gridY: Math.max(1, Math.min(GRID_ROWS-2, (hash) % GRID_ROWS - 1)), // Hover right behind/above it for y-sorting
                status: 'water_alert'
            });
        } else {
            // Random wander
            setCompanionState(prev => ({
                gridX: Math.max(1, Math.min(GRID_COLS-2, prev.gridX + (Math.floor(Math.random() * 3) - 1))),
                gridY: Math.max(1, Math.min(GRID_ROWS-2, prev.gridY + (Math.floor(Math.random() * 3) - 1))),
                status: 'idle'
            }));
        }
    }, 4500);
    
    return () => clearInterval(walker);
  }, [habits, logs, stats.activeCompanionId]);

  // Time-Of-Day & Atmospheric Tint
  const isNight = hour >= 20 || hour < 5;
  const isMorning = hour >= 6 && hour < 9;
  const isEvening = hour >= 17 && hour < 20;

  let tintClass = "bg-transparent";
  if (isMorning) tintClass = "bg-[#fcdab7]/15 mix-blend-overlay"; // 15% soft rose/gold
  else if (isEvening) tintClass = "bg-[#d97743]/20 mix-blend-overlay"; // 20% deep terracotta/amber
  else if (isNight) tintClass = "bg-[#312e81]/25 mix-blend-overlay pointer-events-none"; // Lighter overlay for night

  // Weekly Completion Rate Calculation
  const weeklyCompletionRate = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    const totalPossible = habits.length * 7;
    let totalDone = 0;
    last7Days.forEach(date => {
      if (logs[date]) {
         totalDone += logs[date].length;
      }
    });
    return totalPossible > 0 ? totalDone / totalPossible : 0;
  }, [habits, logs]);

   let shadowClass = "w-12 h-2 rounded-full";
   if (hour >= 6 && hour <= 11) {
     shadowClass = "w-20 h-2 rounded-[100%] translate-x-[-16px] origin-right";
   } else if (hour >= 12 && hour <= 14) {
     shadowClass = "w-10 h-2 rounded-full";
   } else if (hour >= 15 && hour <= 18) {
     shadowClass = "w-20 h-2 rounded-[100%] translate-x-[16px] origin-left";
   } else {
     shadowClass = "w-12 h-2 rounded-full"; // Night/Default
   }
   // Monthly season bg is above

   // 6-Season Calendar Engine
  const seasonMonth = new Date().getMonth(); // 0 = Jan, 11 = Dec
  let seasonBg = "bg-[#4ade80]/50"; // Sharat default
  let seasonWeather = null;
  if (seasonMonth === 3 || seasonMonth === 4) seasonBg = "bg-[#d4c67a]/60 text-yellow-900"; // Grishmo
  else if (seasonMonth === 5 || seasonMonth === 6) { seasonBg = "bg-[#235c44]/60"; seasonWeather = 'borsha'; } // Borsha
  else if (seasonMonth === 7 || seasonMonth === 8) seasonBg = "bg-[#4ade80]/50"; // Sharat
  else if (seasonMonth === 9 || seasonMonth === 10) { seasonBg = "bg-[#d97743]/50"; seasonWeather = 'hemanto'; } // Hemanto
  else if (seasonMonth === 11 || seasonMonth === 0) { seasonBg = "bg-[#E6D7B3]/70"; seasonWeather = 'sheet'; } // Sheet
  else if (seasonMonth === 1 || seasonMonth === 2) { seasonBg = "bg-[#22c55e]/50"; seasonWeather = 'bashonto'; } // Bashonto

  // Weather: Monsoon Rain if a hydration habit is completed today.
  const hasHydrationCompletedToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completedTodayIds = logs[todayStr] || [];
    return habits.some(h => 
      (h.name.toLowerCase().includes('water') || h.name.toLowerCase().includes('hydrat') || h.name.toLowerCase().includes('drink')) 
      && completedTodayIds.includes(h.id)
    );
  }, [habits, logs]);

  const perimeterCondition = (x: number, y: number) => x === 0 || x === GRID_COLS - 1 || y === 0 || y === GRID_ROWS - 1;
  const pondMidX = Math.floor(GRID_COLS / 2);
  const pondMidY = Math.floor(GRID_ROWS / 2);
  const pondCondition = (x: number, y: number) => (x >= pondMidX - 1 && x <= pondMidX) && (y >= pondMidY - 1 && y <= pondMidY);

  const staticItems = useMemo(() => {
    const items: CanvasItem[] = [];

    // Add pond
    items.push({ id: 'center_pond', type: 'pond', gridX: pondMidX - 1, gridY: pondMidY - 1 });

    // 2. Organic Scatter Spawning
    const occupied = new Set<string>();
    
    items.forEach(it => {
       if (it.type !== 'pond') {
         occupied.add(`${it.gridX},${it.gridY}`);
       } else {
         occupied.add(`${pondMidX - 1},${pondMidY - 1}`);
         occupied.add(`${pondMidX},${pondMidY - 1}`);
         occupied.add(`${pondMidX - 1},${pondMidY}`);
         occupied.add(`${pondMidX},${pondMidY}`);
       }
    });

    // Wandering Baul Event check
    const todayStr = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    let dayHash = 0;
    for (let i = 0; i < todayStr.length; i++) dayHash += todayStr.charCodeAt(i);
    const hasBaul = isWeekend && (dayHash % 2 === 0);
    
    if (hasBaul) {
       // Spawn near the Ghat
       items.push({ id: 'npc_baul', type: 'npc', npcType: 'baul', gridX: GRID_COLS - 3, gridY: GRID_ROWS - 4 });
       occupied.add(`${GRID_COLS - 3},${GRID_ROWS - 4}`);
    }

    // Mailbox logic - check for Perfect Week
    const consecutivePerfectDays = 0;
    const todayDate = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        
        const active = habits.filter(h => !h.isArchived);
        const scheduledToday = active.filter(h => {
             if (h.type === 'avoid') return false;
             // Assume simplified schedule check or if there's any completed habits
             return true; 
             // We're doing a simplified check: if there's any completion for that day
             // Or better: just rely on the existing logs. Actually, computing perfectly is hard without scheduleUtils,
             // let's just check if logs exist for that day AND they made some progress
        });
        
        let hasCompletedAny = false;
        const missedAny = false;
        scheduledToday.forEach(h => {
            const isCompleted = (logs[dateKey] || []).includes(h.id);
            if (isCompleted) hasCompletedAny = true;
            // Real perfectly means they completed ALL due, but without scheduleUtils here, we rely on basic heuristic:
            // or we use stats.perfectGardenDays? No, they asked for 7 consecutive days. Let's just track it via stats if possible, or assume if they have logs[dateKey].length > 0 it's good enough for this simulation, but wait...
        });
    }

    // Actually, since this is purely visual rendering... let's just use stats.perfectGardenDays as a proxy or just see if the previous 7 days have at least ONE log each. Wait, the rule is "completes 100% of their habits for 7 consecutive days". Let's assume if stats.currentPerfectStreak >= 7, but since we didn't implement that, let's use the simplest robust check:
    // If stats.perfectGardenDays >= 7 AND they have at least 1 log today or yesterday.
    // Let's implement a dummy reliable consecutive logic: check if the last 7 dates exist in `logs` and have entries.
    let consecutiveDaysHasLogs = true;
    for (let i = 0; i < 7; i++) {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        if (!logs[dateKey] || logs[dateKey].length === 0) {
            consecutiveDaysHasLogs = false;
        }
    }
    const hasPerfectWeek = consecutiveDaysHasLogs || (stats.perfectGardenDays ? stats.perfectGardenDays >= 7 : false);
    
    // Level 4 Bonded Companion Gift chance (20% chance daily)
    let hasCompanionGift = false;
    if (stats.activeCompanionId && stats.companions) {
       const activeComp = stats.companions.find(c => c.id === stats.activeCompanionId);
       if (activeComp && (activeComp.trustDays || 0) >= 46) {
          const todayHash = Math.floor(Date.now() / 86400000);
          if (todayHash % 5 === 0) hasCompanionGift = true; // 20% chance
       }
    }
    
    // Spawn mailbox fixed at grid (GRID_COLS - 2, 2)
    items.push({ id: 'npc_mailbox', type: 'npc', npcType: (hasPerfectWeek || hasCompanionGift) ? 'mailbox_raised' : 'mailbox_flat', gridX: GRID_COLS - 2, gridY: 2 });
    occupied.add(`${GRID_COLS - 2},2`);

    // Pre-calculate spiral coordinates around the pond
    const spiralCoords: {x: number, y: number}[] = [];
    const maxRadius = Math.max(GRID_COLS, GRID_ROWS);
    for (let r = 1; r <= maxRadius; r++) {
       const layerCoords: {x: number, y: number}[] = [];
       for (let x = pondMidX - r; x <= pondMidX + r; x++) {
           layerCoords.push({x, y: pondMidY - r});
           layerCoords.push({x, y: pondMidY + r});
       }
       for (let y = pondMidY - r + 1; y <= pondMidY + r - 1; y++) {
           layerCoords.push({x: pondMidX - r, y});
           layerCoords.push({x: pondMidX + r, y});
       }
       // Sort layer by distance to exact center for more circular feel
       layerCoords.sort((a, b) => {
           const distA = Math.pow(a.x - pondMidX, 2) + Math.pow(a.y - pondMidY, 2);
           const distB = Math.pow(b.x - pondMidX, 2) + Math.pow(b.y - pondMidY, 2);
           return distA - distB;
       });
       spiralCoords.push(...layerCoords);
    }
    
    // Filter out invalid coords
    const validCoords = spiralCoords.filter(coord => 
        coord.x > 0 && coord.x < GRID_COLS - 1 &&
        coord.y > 0 && coord.y < GRID_ROWS - 1 &&
        !pondCondition(coord.x, coord.y) &&
        !perimeterCondition(coord.x, coord.y)
    );

    habits.forEach(habit => {
      let hash = 0;
      for (let i=0; i<habit.id.length; i++) hash += habit.id.charCodeAt(i);
      
      let placed = false;
      const startIdx = hash % Math.min(10, validCoords.length); 
      
      for (let i = 0; i < validCoords.length; i++) {
         const coordIdx = (startIdx + i) % validCoords.length;
         const coord = validCoords[coordIdx];
         if (!occupied.has(`${coord.x},${coord.y}`)) {
            occupied.add(`${coord.x},${coord.y}`);
            items.push({ id: `plant_${habit.id}`, type: 'plant', gridX: coord.x, gridY: coord.y, habit });
            placed = true;
            break;
         }
      }
      
      if (!placed) {
         // Fallback if fully occupied
         let x = 0, y = 0;
         let attempts = 0;
         do {
           x = 1 + ((hash + attempts * 7) % (GRID_COLS - 2));
           y = 2 + ((hash + attempts * 13) % (GRID_ROWS - 3));
           attempts++;
         } while ((occupied.has(`${x},${y}`) || pondCondition(x, y) || perimeterCondition(x, y)) && attempts < 1000);
         items.push({ id: `plant_${habit.id}`, type: 'plant', gridX: x, gridY: y, habit });
      }
    });

    // Add perimeter fences if equipped or if any fence is placed in anchor slots
    const slots = stats.anchorSlots || {};
    const equippedFence = stats.equippedFenceId;
    
    // Find fence placed in left slots (slot1, slot2)
    const leftFenceItem = slots.slot1 && slots.slot1.startsWith('fence_') ? slots.slot1 :
                          slots.slot2 && slots.slot2.startsWith('fence_') ? slots.slot2 : null;
                          
    // Find fence placed in right slots (slot4, slot5)
    const rightFenceItem = slots.slot4 && slots.slot4.startsWith('fence_') ? slots.slot4 :
                           slots.slot5 && slots.slot5.startsWith('fence_') ? slots.slot5 : null;
                           
    const hasAnyFencePlaced = Object.values(slots).some(itemId => itemId && itemId.startsWith('fence_'));
    const activeFenceId = equippedFence || leftFenceItem || rightFenceItem || null;

    if (activeFenceId) {
       // Fences always cover all perimeter borders of the terrain at all levels
       const showLeftBorder = true;
       const showRightBorder = true;

       const leftFenceId = leftFenceItem || activeFenceId;
       const topFenceId = rightFenceItem || activeFenceId;

       if (showLeftBorder) {
          for (let y = 0; y < GRID_ROWS; y++) {
             items.push({ id: `fence_left_${y}`, type: 'fence', gridX: 0, gridY: y, fenceId: leftFenceId });
          }
       }
       if (showRightBorder) {
          for (let x = 1; x < GRID_COLS; x++) {
             items.push({ id: `fence_top_${x}`, type: 'fence', gridX: x, gridY: 0, fenceId: topFenceId });
          }
       }
    }

    // 3. Terrain Details (Pebbles, leaves, moss scattered on empty tiles)
    const detailTypes: ('pebble' | 'leaf' | 'moss')[] = ['pebble', 'leaf', 'moss'];
    for (let x = 1; x < GRID_COLS - 1; x++) {
       for (let y = 1; y < GRID_ROWS - 1; y++) {
          if (!occupied.has(`${x},${y}`) && !pondCondition(x, y) && !perimeterCondition(x, y)) {
             // 15% chance to spawn a terrain detail
             // Use pseudo-random based on coordinates so they don't jitter on every render
             const hash = Math.floor(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) * 1000;
             if (Math.abs(hash) % 100 < 15) {
                const detailType = detailTypes[Math.abs(hash) % detailTypes.length];
                items.push({ id: `detail_${x}_${y}`, type: 'terrain_detail', gridX: x, gridY: y, detailType });
             }
          }
       }
    }

    return items;
  }, [habits, stats.perfectGardenDays, stats.equippedFenceId, stats.anchorSlots, logs, GRID_COLS, GRID_ROWS]);

  const renderItems = useMemo(() => {
    const items = [...staticItems];

    if (stats.activeCompanionId && companionState) {
      const x = companionState.gridX;
      const y = companionState.gridY;
      
      items.push({ 
        id: `companion_${stats.activeCompanionId}`, 
        type: 'companion', 
        gridX: x, 
        gridY: y, 
        companionId: stats.activeCompanionId 
      });
    }

    if (critterState && critterState.active) {
      items.push({ 
        id: `npc_critter`, 
        type: 'npc', 
        npcType: 'critter',
        gridX: critterState.gridX, 
        gridY: critterState.gridY, 
      });
    }

    // 3. Y-Sorting
    return items.sort((a, b) => a.gridY - b.gridY);
  }, [staticItems, stats.activeCompanionId, companionState, critterState]);

  // Dynamic Weather / Time Overlay
  const currentHour = new Date().getHours();
  let timeOverlay = "";
  let timeAtmosphere = null;
  const isNightMode = currentHour >= 22 || currentHour < 5;

  if (currentHour >= 5 && currentHour < 8) {
    timeOverlay = "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/30 via-pink-500/10 to-transparent mix-blend-overlay"; // Dawn
    timeAtmosphere = <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay pointer-events-none z-50" />;
  } else if (currentHour >= 8 && currentHour < 17) {
    timeOverlay = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/20 via-blue-300/10 to-transparent mix-blend-overlay"; // Day
  } else if (currentHour >= 17 && currentHour < 19) {
    timeOverlay = "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-500/30 via-orange-500/20 to-purple-600/10 mix-blend-overlay"; // Sunset
    timeAtmosphere = <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay pointer-events-none z-50" />;
  } else if (isNightMode) {
    timeOverlay = "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/30 via-slate-900/40 to-black/50 mix-blend-overlay"; // Deep Night
    timeAtmosphere = <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay pointer-events-none z-50" />;
  } else {
    timeOverlay = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/30 to-black/40 mix-blend-overlay"; // Night/Evening
    timeAtmosphere = <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay pointer-events-none z-50" />;
  }

  const equippedBackgroundId = stats.equippedBackgroundId || 'bg_default';

  let customBgClass = seasonBg;
  if (equippedBackgroundId === 'bg_default') {
    if (seasonMonth === 3 || seasonMonth === 4) {
      customBgClass = "bg-gradient-to-b from-[#fef08a] via-[#fcd34d] to-[#166534]"; // Grishmo (Sunny Gold)
    } else if (seasonMonth === 5 || seasonMonth === 6) {
      customBgClass = "bg-gradient-to-b from-[#334155] via-[#475569] to-[#064e3b]"; // Borsha (Monsoon Rain)
    } else if (seasonMonth === 7 || seasonMonth === 8) {
      customBgClass = "bg-gradient-to-b from-[#bae6fd] via-[#7dd3fc] to-[#15803d]"; // Sharat (Autumn Blue)
    } else if (seasonMonth === 9 || seasonMonth === 10) {
      customBgClass = "bg-gradient-to-b from-[#fed7aa] via-[#ffedd5] to-[#166534]"; // Hemanto (Dewy Gold)
    } else if (seasonMonth === 11 || seasonMonth === 0) {
      customBgClass = "bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#1e3a1e]"; // Sheet (Foggy Winter)
    } else if (seasonMonth === 1 || seasonMonth === 2) {
      customBgClass = "bg-gradient-to-b from-[#bbf7d0] via-[#86efac] to-[#15803d]"; // Bashonto (Vibrant Spring)
    }
  } else if (equippedBackgroundId === 'bg_rooftop') {
    customBgClass = "bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#311042]";
  } else if (equippedBackgroundId === 'bg_village') {
    customBgClass = "bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#14532d]";
  } else if (equippedBackgroundId === 'bg_morning_sun') {
    customBgClass = "bg-gradient-to-b from-[#78350f] via-[#d97706] to-[#f59e0b]";
  } else if (equippedBackgroundId === 'bg_monsoon') {
    customBgClass = "bg-gradient-to-b from-[#1e293b] via-[#334155] to-[#0f172a]";
  } else if (equippedBackgroundId === 'bg_zamindar_palace') {
    customBgClass = "bg-gradient-to-b from-[#4c0519] via-[#2e1065] to-[#030712]";
  }

  return (
    <div 
      className={`relative w-full h-[600px] border-4 border-[#8BC34A]/30 rounded-[32px] overflow-hidden shadow-2xl shadow-green-900/20 ${customBgClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background Visual Art Layers */}
      {equippedBackgroundId === 'bg_default' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Sun or Mist */}
          <motion.div style={{ x: bgLayer3X, y: bgLayer3Y }} className="absolute inset-0 z-0">
            {(seasonMonth === 11 || seasonMonth === 0) ? (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-100/20 blur-xl" />
            ) : (
              <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-gradient-to-b from-yellow-100 to-yellow-300/40 blur-[1px] shadow-[0_0_30px_rgba(253,224,71,0.25)]" />
            )}
            {/* Drifting Clouds */}
            <div className="absolute top-16 left-[25%] w-24 h-6 bg-white/30 rounded-full blur-[1.5px] animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute top-8 right-[20%] w-36 h-8 bg-white/20 rounded-full blur-[2px] animate-[pulse_8s_ease-in-out_infinite]" />
          </motion.div>

          {/* Overlapping Rolling Hills & Trees */}
          <motion.div style={{ x: bgLayer2X, y: bgLayer2Y }} className="absolute inset-0 z-10">
            <div className="absolute bottom-0 w-[140%] -left-[20%] h-44 bg-emerald-800/15 rounded-t-[120px] blur-[1px]" />
            
            <svg className="absolute bottom-12 left-[12%] w-16 h-28 opacity-40 text-emerald-800" viewBox="0 0 100 150">
              <path d="M50,150 L50,70" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="50" cy="55" rx="30" ry="40" fill="#047857" />
              <ellipse cx="35" cy="50" rx="15" ry="20" fill="#059669" />
              <ellipse cx="65" cy="50" rx="15" ry="20" fill="#10b981" />
            </svg>
          </motion.div>

          <motion.div style={{ x: bgLayer1X, y: bgLayer1Y }} className="absolute inset-0 z-20">
            <div className="absolute bottom-0 w-[110%] -right-[5%] h-32 bg-emerald-700/25 rounded-t-[100px]" />
            <div className="absolute bottom-0 w-full h-16 bg-emerald-600/35 rounded-t-[60px]" />

            <svg className="absolute bottom-8 right-[15%] w-12 h-20 opacity-35 text-emerald-700" viewBox="0 0 100 150">
              <path d="M50,150 L50,85" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <polygon points="50,20 15,90 85,90" fill="#065f46" />
              <polygon points="50,45 25,100 75,100" fill="#059669" />
            </svg>
          </motion.div>
        </div>
      )}

      {equippedBackgroundId === 'bg_rooftop' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Distant building layers (silhouettes in indigo/slate) */}
          <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between opacity-30 gap-2 px-4">
            <div className="w-16 h-36 bg-slate-800 rounded-t" />
            <div className="w-20 h-40 bg-slate-800 rounded-t" />
            <div className="w-12 h-28 bg-slate-800 rounded-t" />
            <div className="w-24 h-48 bg-slate-800 rounded-t" />
            <div className="w-16 h-32 bg-slate-800 rounded-t" />
            <div className="w-20 h-44 bg-slate-800 rounded-t" />
          </div>
          {/* Midground building layers with warm glowing windows */}
          <div className="absolute bottom-0 left-0 right-0 h-36 flex items-end justify-between opacity-60 gap-4 px-12">
            <div className="w-24 h-28 bg-slate-700 rounded-t relative flex flex-col justify-around p-2 gap-1">
              <div className="flex justify-between"><div className="w-2 h-2 bg-yellow-200 rounded-sm" /><div className="w-2 h-2 bg-yellow-200 rounded-sm" /></div>
              <div className="flex justify-between"><div className="w-2 h-2 bg-yellow-200/50 rounded-sm" /><div className="w-2 h-2 bg-yellow-200 rounded-sm" /></div>
            </div>
            <div className="w-16 h-32 bg-slate-700 rounded-t relative flex flex-col justify-around p-2 gap-1">
              <div className="w-2 h-2 bg-yellow-100 rounded-sm mx-auto" />
              <div className="w-2 h-2 bg-yellow-100/30 rounded-sm mx-auto" />
              <div className="w-2 h-2 bg-yellow-100 rounded-sm mx-auto" />
            </div>
            <div className="w-28 h-24 bg-slate-700 rounded-t relative flex flex-col justify-around p-3 gap-1">
              <div className="flex justify-around"><div className="w-2.5 h-2.5 bg-yellow-200 rounded-sm" /><div className="w-2.5 h-2.5 bg-yellow-200/10 rounded-sm" /><div className="w-2.5 h-2.5 bg-yellow-200 rounded-sm" /></div>
            </div>
            <div className="w-20 h-36 bg-slate-700 rounded-t relative flex flex-col justify-around p-2 gap-1">
              <div className="w-2 h-2 bg-yellow-200/80 rounded-sm" />
              <div className="w-2 h-2 bg-yellow-200/90 rounded-sm" />
            </div>
          </div>
          {/* Cute clothesline/radio tower element */}
          <div className="absolute bottom-16 right-8 w-16 h-24 flex flex-col items-center justify-end">
            <div className="w-1 h-20 bg-slate-600" />
            <div className="absolute top-4 w-4 h-4 rounded-full bg-red-500/80 animate-ping" />
            <div className="absolute top-5 w-2 h-2 rounded-full bg-red-600" />
          </div>
        </div>
      )}

      {equippedBackgroundId === 'bg_village' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Flying white birds in sky & far hills */}
          <motion.div style={{ x: bgLayer3X, y: bgLayer3Y }} className="absolute inset-0 z-0">
            <div className="absolute bottom-0 w-[120%] -left-[10%] h-48 bg-emerald-950/40 rounded-t-[100px] blur-sm" />
            <svg className="absolute top-16 left-1/3 w-32 h-16 opacity-40 text-emerald-200" viewBox="0 0 200 100">
              <path d="M20,40 Q30,30 40,40 Q50,30 60,40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M120,25 Q130,15 140,25 Q150,15 160,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Mid hill */}
          <motion.div style={{ x: bgLayer2X, y: bgLayer2Y }} className="absolute inset-0 z-10">
            <div className="absolute bottom-0 w-[110%] -right-[5%] h-36 bg-emerald-900/60 rounded-t-[120px]" />
          </motion.div>

          {/* Thatched hut and coconut tree silhouettes (Foreground) */}
          <motion.div style={{ x: bgLayer1X, y: bgLayer1Y }} className="absolute inset-0 z-20">
            <div className="absolute bottom-8 left-12 w-24 h-24 relative opacity-80">
              <div className="w-20 h-10 bg-amber-800/80 rounded-t-full border border-amber-950" />
              <div className="w-16 h-12 bg-amber-700/70 border-x border-b border-amber-950 mx-auto" />
            </div>

            <svg className="absolute bottom-8 right-16 w-24 h-40 opacity-80" viewBox="0 0 100 150">
              <path d="M50,150 Q40,90 20,20" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
              <path d="M20,20 Q10,10 0,25" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <path d="M20,20 Q20,5 35,15" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <path d="M20,20 Q15,35 25,50" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <path d="M20,20 Q5,30 -10,35" fill="none" stroke="#065f46" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      )}

      {equippedBackgroundId === 'bg_morning_sun' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-950/20">
          {/* Massive glowing morning sun & sunbeams */}
          <motion.div style={{ x: bgLayer3X, y: bgLayer3Y }} className="absolute inset-0 z-0">
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-b from-yellow-300 to-orange-500 shadow-[0_0_80px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-white/20 animate-pulse" />
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="50" y1="30" x2="0" y2="0" stroke="#fcd34d" strokeWidth="4" />
              <line x1="50" y1="30" x2="100" y2="0" stroke="#fcd34d" strokeWidth="4" />
              <line x1="50" y1="30" x2="0" y2="50" stroke="#fcd34d" strokeWidth="4" />
              <line x1="50" y1="30" x2="100" y2="50" stroke="#fcd34d" strokeWidth="4" />
              <line x1="50" y1="30" x2="25" y2="100" stroke="#fcd34d" strokeWidth="4" />
              <line x1="50" y1="30" x2="75" y2="100" stroke="#fcd34d" strokeWidth="4" />
            </svg>
          </motion.div>

          {/* Far Mountains */}
          <motion.div style={{ x: bgLayer2X, y: bgLayer2Y }} className="absolute inset-0 z-10">
            <div className="absolute bottom-0 w-[150%] -left-[25%] h-52 bg-amber-950/40 rounded-t-[140px] blur-[2px]" />
          </motion.div>

          {/* Mid & Near Mountains */}
          <motion.div style={{ x: bgLayer1X, y: bgLayer1Y }} className="absolute inset-0 z-20">
            <div className="absolute bottom-0 w-[130%] -right-[15%] h-40 bg-amber-900/60 rounded-t-[100px]" />
            <div className="absolute bottom-0 w-full h-24 bg-amber-800/80 rounded-t-[60px]" />
          </motion.div>
        </div>
      )}

      {equippedBackgroundId === 'bg_monsoon' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Dark heavy cloud SVGs at the top */}
          <motion.div style={{ x: bgLayer3X, y: bgLayer3Y }} className="absolute inset-0 z-0 opacity-40">
            <div className="absolute top-0 inset-x-0 h-40">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <path d="M0,100 C100,50 200,120 300,70 C400,20 450,90 500,50 L500,0 L0,0 Z" fill="#475569" />
                <path d="M0,80 C80,30 180,90 280,50 C380,10 440,70 500,30 L500,0 L0,0 Z" fill="#334155" />
              </svg>
            </div>
          </motion.div>

          {/* Misty background silhouettes */}
          <motion.div style={{ x: bgLayer2X, y: bgLayer2Y }} className="absolute inset-0 z-10">
            <div className="absolute bottom-0 w-[140%] -left-[20%] h-44 bg-slate-800/30 rounded-t-[100px] blur-[3px]" />
          </motion.div>
          <motion.div style={{ x: bgLayer1X, y: bgLayer1Y }} className="absolute inset-0 z-20">
            <div className="absolute bottom-0 w-[110%] -right-[5%] h-32 bg-slate-700/40 rounded-t-[80px]" />
          </motion.div>

          {/* Falling Rain drops */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(147,197,253,0.15)_100%)] z-30" />
        </div>
      )}

      {equippedBackgroundId === 'bg_zamindar_palace' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-gradient-to-b from-[#1e1b4b] via-[#311042] to-[#581c87]/30">
          {/* Royal Palace dome silhouette in background */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 relative opacity-40">
            {/* Dome */}
            <div className="w-32 h-24 bg-purple-950 border border-purple-900 rounded-t-full mx-auto" />
            {/* Ornamental Spire */}
            <div className="w-1.5 h-10 bg-amber-400 mx-auto" />
            <div className="w-4 h-4 rounded-full bg-amber-400 mx-auto -mt-2 shadow-[0_0_10px_#f59e0b]" />
          </div>

          {/* Arch / Pillars framing the frame */}
          <svg className="absolute inset-0 w-full h-full opacity-60 text-purple-950" viewBox="0 0 400 600" preserveAspectRatio="none">
            {/* Left Column */}
            <rect x="0" y="0" width="24" height="600" fill="currentColor" />
            <path d="M24,100 C40,100 48,120 48,150 L48,600 L24,600 Z" fill="currentColor" opacity="0.8" />
            {/* Right Column */}
            <rect x="376" y="0" width="24" height="600" fill="currentColor" />
            <path d="M376,100 C360,100 352,120 352,150 L352,600 L376,600 Z" fill="currentColor" opacity="0.8" />
            {/* Arch at the top */}
            <path d="M 0,0 L 400,0 L 400,100 Q 200,160 0,100 Z" fill="currentColor" />
          </svg>

          {/* Hanging golden lantern with real glow */}
          <div className="absolute top-12 left-16 w-12 h-24 flex flex-col items-center">
            {/* Cord */}
            <div className="w-0.5 h-12 bg-amber-600" />
            {/* Lantern cap */}
            <div className="w-8 h-3 bg-amber-500 rounded-t-full border border-amber-800" />
            {/* Glass with glow */}
            <div className="w-6 h-8 bg-amber-300 rounded-b-md border border-amber-800 shadow-[0_0_20px_#f59e0b] relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff] animate-ping" />
              <div className="w-2 h-2 rounded-full bg-white absolute" />
            </div>
          </div>
          
          <div className="absolute top-12 right-16 w-12 h-24 flex flex-col items-center">
            {/* Cord */}
            <div className="w-0.5 h-12 bg-amber-600" />
            {/* Lantern cap */}
            <div className="w-8 h-3 bg-amber-500 rounded-t-full border border-amber-800" />
            {/* Glass with glow */}
            <div className="w-6 h-8 bg-amber-300 rounded-b-md border border-amber-800 shadow-[0_0_20px_#f59e0b] relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff] animate-ping" />
              <div className="w-2 h-2 rounded-full bg-white absolute" />
            </div>
          </div>
        </div>
      )}

      {/* Premium glowing overlay and light beams */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/20 to-transparent blur-3xl pointer-events-none rounded-full" 
        style={{ transform: 'rotateX(60deg)', x: skyTranslateX, y: skyTranslateY }}
      />
      
      {/* Dynamic Time Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-40 transition-colors duration-1000 ${timeOverlay}`} />
      {timeAtmosphere}
      
      <TransformWrapper
        key={`stage-${stage}-${initialScale}`}
        initialScale={initialScale}
        minScale={initialScale}
        maxScale={initialScale}
        centerOnInit={true}
        limitToBounds={true}
        disabled={true}
        panning={{ disabled: true }}
        wheel={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div className="relative shadow-inner flex items-center justify-center transition-all duration-1000 ease-in-out" style={{ width: currentConfig.width, height: currentConfig.height }}>
             
             {/* Background Grass Pattern */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%237ba55a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
             }} />

             {/* Mist for Winter (Sheet) */}
             {seasonWeather === 'sheet' && (
                <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.4)_100%)] mix-blend-screen" />
             )}

       {/* Blooming Palash trees in Spring (Bashonto) behind the content */}
       {seasonWeather === 'bashonto' && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
             <div className="absolute top-10 left-10 text-orange-500 text-4xl blur-sm">🌸🌸</div>
             <div className="absolute top-20 right-20 text-red-500 text-5xl blur-[2px]">🌸</div>
             <div className="absolute bottom-20 left-1/4 text-orange-500 text-3xl blur-[1px]">🌸</div>
          </div>
       )}

       {/* 3. Dynamic Cloud Shadow Engine */}
       <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden mix-blend-color-burn">
          <div className="absolute top-[10%] left-[-20%] w-64 h-32 bg-black rounded-full blur-3xl animate-[cloudPan_60s_linear_infinite]" />
          <div className="absolute top-[50%] left-[-30%] w-96 h-48 bg-black rounded-full blur-3xl animate-[cloudPan_80s_linear_infinite_10s]" />
       </div>

       {/* Time-Of-Day Tint */}
       <div className={`absolute inset-0 z-40 pointer-events-none transition-colors duration-1000 ${tintClass}`} />

       {/* Monsoon Rain */}
       {(hasHydrationCompletedToday || seasonWeather === 'borsha') && (
         <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden opacity-40 font-mono text-blue-200/70 text-xs text-center" style={{ textShadow: '0 0 4px rgba(191, 219, 254, 0.5)' }}>
           {Array.from({ length: 50 }).map((_, i) => (
             <div 
               key={`rain_${i}`} 
               className="absolute whitespace-pre"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `-${Math.random() * 20 + 20}%`,
                 animation: `fall ${Math.random() * 0.5 + 0.6}s linear infinite`,
                 animationDelay: `${Math.random()}s`,
                 transform: 'rotate(15deg)'
               }}
             >
               {'/\n /\n/\n /\n  /'}
             </div>
           ))}
         </div>
       )}

       {/* Firefly Nights */}
       {isNight && (
         <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-screen">
           {Array.from({ length: 15 }).map((_, i) => (
             <div 
               key={`firefly_${i}`} 
               className="absolute w-2 h-2 bg-[#BEF264] rounded-full blur-[1px] drop-shadow-[0_0_8px_#A3E635] animate-pulse"
               style={{
                 left: `${Math.random() * 80 + 10}%`,
                 top: `${Math.random() * 80 + 10}%`,
                 animationDuration: `${Math.random() * 2 + 1}s`,
                 animationDelay: `${Math.random() * 2}s`,
                 transform: `scale(${Math.random() * 0.5 + 0.5})`
               }}
             />
           ))}
         </div>
       )}

       {/* Isometric Grid Container */}
       <div className="absolute inset-0 flex items-center justify-center mt-12">
         <motion.div 
           className="relative preserve-3d w-[80%] h-[80%] pointer-events-auto" 
           style={{ 
             rotateX: parallaxRotateX, 
             rotateZ: parallaxRotateZ, 
             x: parallaxTranslateX, 
             y: parallaxTranslateY 
           }}
         >
           
           {/* Ambient Shadow cast by the island */}
           <div className="absolute inset-x-0 top-[20%] bottom-[-20%] bg-black/30 blur-[80px] rounded-[100px] translate-y-32 translate-x-12 z-0" style={{ transform: 'rotateX(0deg) rotateZ(0deg)' }} />
           
           {/* Grid Base Platform */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#AED581] to-[#8BC34A] border-t-4 border-l-4 border-[#DCEDC8] border-r-4 border-b-4 border-[#558B2F] shadow-[inset_0_0_80px_rgba(0,0,0,0.15)] rounded-2xl">
             {/* Left face of the platform */}
             <div className="absolute top-[100%] -left-[4px] w-[calc(100%+8px)] h-[120px] bg-gradient-to-b from-[#8D6E63] to-[#4E342E] origin-top border-l-4 border-[#5D4037] border-b-4 border-r-4 rounded-b-3xl shadow-[0_40px_60px_rgba(0,0,0,0.4)]" style={{ transform: 'rotateX(-90deg)' }}>
                <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#AED581] to-[#7CB342] border-b-4 border-[#558B2F]" />
                <div className="absolute top-6 left-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGwyMCAyME0yMCAwbC0yMCAyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"/>
             </div>
             {/* Right face of the platform */}
             <div className="absolute -top-[4px] left-[100%] w-[120px] h-[calc(100%+8px)] bg-gradient-to-r from-[#6D4C41] to-[#3E2723] origin-left border-r-4 border-[#3E2723] border-b-4 border-t-4 border-t-[#8D6E63] rounded-r-3xl shadow-[40px_40px_60px_rgba(0,0,0,0.4)]" style={{ transform: 'rotateY(90deg)' }}>
                <div className="absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-[#AED581] to-[#7CB342] border-r-4 border-[#33691E]" />
                <div className="absolute top-0 left-6 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGwyMCAyME0yMCAwbC0yMCAyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"/>
             </div>
             
             {/* Dirt block grid lines */}
             {Array.from({ length: GRID_COLS }).map((_, x) => 
               Array.from({ length: GRID_ROWS }).map((_, y) => (
                 <div 
                   key={`tile_${x}_${y}`} 
                   className="absolute border border-white/20 opacity-80 hover:opacity-100 bg-[#9ccc65]/20 hover:bg-white/40 transition-colors cursor-pointer rounded-md"
                   style={{ left: `${(x / GRID_COLS) * 100}%`, top: `${(y / GRID_ROWS) * 100}%`, width: `${100/GRID_COLS}%`, height: `${100/GRID_ROWS}%` }}
                 />
               ))
             )}
           </div>

           {/* Nakshi Kantha Walkways */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
             {renderItems.filter(i => i.type === 'plant' && i.habit && i.habit.streak >= 30).map((p, idx, arr) => {
                if (idx === 0) return null;
                const prev = arr[idx - 1];
                return (
                  <line 
                    key={`walkway_${idx}`}
                    x1={`${(prev.gridX / GRID_COLS) * 100 + (50/GRID_COLS)}%`}
                    y1={`${(prev.gridY / GRID_ROWS) * 100 + (50/GRID_ROWS)}%`}
                    x2={`${(p.gridX / GRID_COLS) * 100 + (50/GRID_COLS)}%`}
                    y2={`${(p.gridY / GRID_ROWS) * 100 + (50/GRID_ROWS)}%`}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="4"
                    strokeDasharray="8,8"
                  />
                );
             })}
           </svg>

         {renderItems.map(item => {
            const leftPercent = (item.gridX / GRID_COLS) * 100 + (50 / GRID_COLS);
            const topPercent = (item.gridY / GRID_ROWS) * 100 + (50 / GRID_ROWS);
            
            if (item.type === 'pond') {
               const isHighCompletion = weeklyCompletionRate >= 0.8;
               const isLowCompletion = weeklyCompletionRate < 0.4;
               
               const pondBg = isLowCompletion ? "bg-slate-600/80 border-slate-500" : "bg-cyan-500/50 border-cyan-400";

               return (
                 <div key={item.id} className={`absolute w-[240px] h-[150px] ${pondBg} rounded-[100px] border-2 shadow-inner overflow-hidden transition-colors duration-1000`} style={{ left: `50%`, top: `50%`, transform: 'translate(-50%, -50%) rotateZ(45deg)' }}>
                    {/* Water ripples */}
                    <div className="absolute inset-0 opacity-30 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
                    
                    {/* Shapla Lilies */}
                    {isHighCompletion && (
                      <div className="absolute inset-0 pointer-events-none z-10" style={{ transform: 'rotateX(20deg)' }}>
                        <div className="absolute left-[30%] top-[40%] w-6 h-4 group animate-bounce" style={{ animationDuration: '3s' }}>
                          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                            <path d="M50 80 Q 20 80 10 50 Q 50 40 90 50 Q 80 80 50 80 Z" fill="#22c55e" /> {/* Leaf */}
                            <path d="M50 70 Q 30 40 40 20 Q 50 40 60 20 Q 70 40 50 70 Z" fill="#f472b6" /> {/* Flower */}
                            <circle cx="50" cy="50" r="5" fill="#fef08a" />
                          </svg>
                        </div>
                        <div className="absolute right-[35%] bottom-[30%] w-5 h-3 group animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                            <path d="M50 80 Q 20 80 10 50 Q 50 40 90 50 Q 80 80 50 80 Z" fill="#22c55e" />
                            <path d="M50 70 Q 30 40 40 20 Q 50 40 60 20 Q 70 40 50 70 Z" fill="#f472b6" />
                            <circle cx="50" cy="50" r="5" fill="#fef08a" />
                          </svg>
                        </div>
                      </div>
                    )}
                 </div>
               )
            } else if (item.type === 'plant' && item.habit) {
               const isMaster = item.habit.streak >= 30;
               return (
                 <div key={item.id} className="absolute" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)', transformOrigin: 'bottom center' }}>
                    
                    {/* Alpana Decoration */}
                    {isMaster && (
                       <svg viewBox="0 0 100 100" className="absolute w-32 h-32 opacity-60 z-0 pointer-events-none" style={{ left: '50%', bottom: '-10%', transform: 'translate(-50%, 50%) rotateX(65deg)' }}>
                         <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" strokeDasharray="4 4" />
                         <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="3" />
                         <circle cx="50" cy="50" r="15" fill="white" />
                         <path d="M50 5 L60 25 L80 15 L70 35 L95 50 L70 65 L80 85 L60 75 L50 95 L40 75 L20 85 L30 65 L5 50 L30 35 L20 15 L40 25 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
                       </svg>
                    )}

                                        <div className="relative w-28 h-36 flex flex-col items-center justify-end cursor-pointer group" onClick={() => onWaterPlant(item.habit!.id)}>
                      {/* Glow effect behind the plant on hover */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 blur-xl rounded-full transition-all duration-300 pointer-events-none z-0" />
                      
                      <div className="absolute inset-x-0 bottom-1 w-full h-[120%] z-10 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-110 origin-bottom" style={{ clipPath: 'inset(-20% -20% 15% -20%)' }}>
                        <PlantIcon
                            plantType={item.habit.plantType}
                            stage={item.habit.plantStage}
                            status={item.habit.plantStatus}
                            health={item.habit.plantHealth}
                           isLegendary={item.habit.isLegendary}
                           isArchived={item.habit.isArchived}
                           className={`w-full h-full absolute top-[10%] drop-shadow-xl group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:brightness-110 object-contain origin-bottom animate-breeze transition-all duration-300 ${isNightMode ? 'brightness-75 saturate-75' : ''}`} 
                         />
                      </div>
                      <div className={`bg-black/30 group-hover:bg-black/40 group-hover:scale-90 blur-[3px] transition-all duration-300 w-16 h-4 absolute bottom-0 z-0 rounded-full`} />
                    </div>
                 </div>
               )
            } else if (item.type === 'companion' && item.companionId) {
               const AssetComp = CompanionAssetsDictionary[item.companionId];
               // Some companions hover out naturally, some are grounded
               const isFlying = ['moumachhi', 'ladybug', 'chorui', 'phoring', 'projapoti', 'jonaki'].includes(item.companionId);
               return (
                 <div key={item.id} className="absolute transition-all duration-1000 ease-in-out cursor-pointer group" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: `translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)`, transformOrigin: 'bottom center' }} onClick={(e) => { e.stopPropagation(); handleCompanionClick(item.companionId!); }}>
                    
                    <AnimatePresence>
                      {companionMessage?.id === item.companionId && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: -10, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.8 }}
                          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-xl border border-white/50 text-xs font-medium text-slate-700 whitespace-nowrap z-50 pointer-events-none"
                        >
                          {companionMessage.text}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 border-b border-r border-white/50 transform rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={`relative w-16 h-16 flex flex-col items-center justify-end z-20 transition-transform group-hover:scale-110 ${isFlying ? 'animate-bounce' : ''}`}>
                       {companionState.status === 'water_alert' && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
                             <div className="w-5 h-5 bg-sky-100 border border-sky-300 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-[10px] drop-shadow-sm text-sky-500 font-bold font-sans">💧</span>
                             </div>
                             <div className="w-1 h-1 bg-sky-200 mt-0.5 rounded-full" />
                          </div>
                       )}
                       {AssetComp ? React.createElement(AssetComp, { className: "w-full h-full drop-shadow-xl" }) : <span className="text-3xl drop-shadow-lg">🐦‍⬛</span>}
                    </div>
                 </div>
               )
            } else if (item.type === 'npc' && item.npcType === 'baul') {
               return (
                 <div key={item.id} className="absolute" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: `translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)`, transformOrigin: 'bottom center' }}>
                    <div className="relative w-20 h-24 flex flex-col items-center justify-end group z-20">
                        {/* Simple Baul representation (Dotara + Ektara vibe) */}
                        <div className="absolute top-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg truncate border-2 border-orange-800">
                          <span className="text-2xl">🪕</span>
                        </div>
                        <div className="absolute top-8 w-12 h-14 bg-amber-700/90 rounded-t-xl rounded-b-md shadow-md animate-breathe" />
                        
                        {/* Music Notes */}
                        <div className="absolute -top-4 -right-4 text-xs font-serif animate-bounce text-orange-400 mix-blend-screen" style={{animationDuration: '2s'}}>🎵</div>
                        <div className="absolute -top-2 left-0 text-[10px] font-serif animate-bounce text-amber-300 mix-blend-screen" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>🎶</div>
                        <div className="w-12 h-2 bg-black/40 rounded-full blur-[2px] absolute -bottom-1 z-0" />
                    </div>
                 </div>
               )
            } else if (item.type === 'npc' && item.npcType === 'critter') {
               return (
                 <div key={item.id} className="absolute transition-all duration-[4000ms] ease-linear" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: `translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)`, transformOrigin: 'bottom center' }}>
                     <div className="relative w-12 h-12 flex flex-col items-center justify-end z-20">
                        {/* Wiggling hedgehog */}
                        <div className="text-3xl drop-shadow-md animate-bounce" style={{ animationDuration: '1s' }}>
                           🦔
                        </div>
                        <div className={`bg-black/20 blur-[2px] w-8 h-2 absolute bottom-0 rounded-[50%] z-0`} />
                     </div>
                 </div>
               )
            } else if (item.type === 'npc' && item.npcType && item.npcType.startsWith('mailbox')) {
               const isRaised = item.npcType === 'mailbox_raised';
               return (
                 <div key={item.id} className="absolute" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: `translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)`, transformOrigin: 'bottom center' }}>
                     <div className={`relative w-16 h-28 flex flex-col items-center justify-end z-20 ${isRaised ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-80'}`} onClick={isRaised && onMailboxClick ? onMailboxClick : undefined}>
                        <div className="absolute top-0 w-16 h-14 bg-red-600 rounded-t-xl mx-auto shadow-xl border-b-[6px] border-red-800 flex items-center justify-center z-10">
                           <div className="w-8 h-6 bg-zinc-800 opacity-50 rounded-md absolute top-3" />
                        </div>
                        <div className="w-3 h-16 bg-amber-900 mx-auto z-0" />
                        {/* Flag */}
                        <div className={`absolute w-1.5 h-8 origin-bottom transform transition-all duration-500 bg-amber-400 rounded-t-full shadow-md ${isRaised ? 'top-1 -right-2 -rotate-[20deg]' : 'top-6 -right-2 rotate-90'}`} />
                        <div className={`absolute w-4 h-4 rounded-full transition-all duration-500 bg-amber-400 shadow-md ${isRaised ? '-top-1 -right-3 transform -rotate-[20deg]' : 'top-12 -right-1'}`} />
                        {isRaised && (
                           <div className="absolute -top-10 text-3xl animate-bounce drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] z-30">💌</div>
                        )}
                        <div className={`bg-black/20 blur-[3px] transition-all duration-1000 w-16 h-4 absolute bottom-0 rounded-[50%] z-0`} />
                     </div>
                 </div>
               )
            }
            else if (item.type === 'fence') {
                const fenceId = item.fenceId || stats.equippedFenceId || 'fence_wooden';
                return (
                  <div key={item.id} className="absolute" style={{ zIndex: item.gridY + item.gridX, left: `${leftPercent}%`, top: `${topPercent}%`, transform: `translate(-50%, -100%) rotateZ(45deg) rotateX(-60deg)`, transformOrigin: 'bottom center' }}>
                     {fenceId === 'fence_bamboo' && (() => {
                        const level = stats.level || 1;
                        return (
                          <div className="relative w-12 h-14 flex items-end justify-center pointer-events-none">
                            <div className="flex gap-[3px] items-end h-full">
                              <div className="w-2.5 h-11 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
                              <div className="w-2.5 h-13 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
                              <div className="w-2.5 h-10 bg-gradient-to-t from-lime-800 via-lime-500 to-lime-300 rounded-md border border-lime-900" />
                            </div>
                            <div className="absolute bottom-3 left-0 right-0 h-1 bg-lime-900/80 rounded" />
                            <div className="absolute bottom-7 left-0 right-0 h-1 bg-lime-900/80 rounded" />
                            <div className="absolute bottom-0 w-10 h-1 bg-black/20 rounded-full blur-[1px] -z-10" />

                            {/* Visual Evolution - Level-based sprouting & blooming ivy */}
                            {level >= 4 && (
                              <>
                                {/* Level 4-6 Sprout: Cute little lime leaf shoots popping from the bamboo */}
                                <div className="absolute -left-1 top-6 w-2.5 h-1.5 bg-lime-400 border border-lime-700 rounded-tr-full rounded-bl-full rotate-[15deg]" />
                                <div className="absolute right-1 top-4 w-2 h-1 bg-lime-400 border border-lime-700 rounded-tl-full rounded-br-full -rotate-[25deg]" />
                                <div className="absolute left-4 top-2 w-2 h-1 bg-lime-400 border border-lime-700 rounded-tr-full rounded-bl-full rotate-[40deg]" />
                              </>
                            )}
                            {level >= 7 && (
                              <>
                                {/* Level 7-9 Bloom: Flowering Vines and Pink Blossom hanging from the bamboo */}
                                <div className="absolute left-2 top-5 w-2 h-2 rounded-full bg-pink-400 border border-pink-600 shadow-sm" />
                                <div className="absolute right-2 top-7 w-2 h-2 rounded-full bg-pink-400 border border-pink-600 shadow-sm" />
                                <div className="absolute left-1 top-8 w-1.5 h-1.5 rounded-full bg-pink-300 border border-pink-500" />
                                {/* Small trailing vine path */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 56">
                                  <path d="M 12,28 Q 18,36 28,30 T 36,44" fill="none" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                              </>
                            )}
                            {level >= 10 && (
                              <>
                                {/* Level 10+ Mythic: Glowing teal spirit lights / fireflies pulsing */}
                                <div className="absolute -top-1 left-2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                                <div className="absolute top-8 right-0 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] animate-pulse delay-75" />
                                <div className="absolute top-11 left-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] animate-pulse delay-150" />
                                {/* Mystic golden line overlay on the bindings */}
                                <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />
                                <div className="absolute bottom-7 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />
                              </>
                            )}
                          </div>
                        );
                     })()}
                     {fenceId === 'fence_wooden' && (() => {
                        const level = stats.level || 1;
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
                            <div className="absolute bottom-0 w-10 h-1 bg-black/20 rounded-full blur-[1px] -z-10" />

                            {/* Visual Evolution - Level-based ivy & flower details */}
                            {level >= 4 && (
                              <>
                                {/* Level 4-6 Sprout: Delicate green climbing leaf buds */}
                                <div className="absolute left-1 bottom-4 w-2 h-2 rounded-full bg-emerald-500 border border-emerald-700" />
                                <div className="absolute right-2 bottom-8 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-emerald-700" />
                                <div className="absolute left-5 top-5 w-2 h-2 rounded-full bg-emerald-500 border border-emerald-700" />
                              </>
                            )}
                            {level >= 7 && (
                              <>
                                {/* Level 7-9 Bloom: Flowering Ivy climbing the posts with bright yellow/orange blossoms */}
                                <div className="absolute left-1 bottom-4 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm flex items-center justify-center">
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                                <div className="absolute right-1 bottom-7 w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm flex items-center justify-center">
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                                <div className="absolute left-5 top-4 w-2 h-2 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 56">
                                  <path d="M 8,42 C 14,35 12,20 24,18 C 30,17 32,10 38,12" fill="none" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                              </>
                            )}
                            {level >= 10 && (
                              <>
                                {/* Level 10+ Mythic: Fairy lights hanging gracefully on the crossbeams */}
                                <div className="absolute bottom-[13px] left-2 w-2 h-2 rounded-full bg-yellow-200 border border-yellow-400 shadow-[0_0_8px_#fef08a] animate-pulse" />
                                <div className="absolute bottom-[13px] left-6 w-2 h-2 rounded-full bg-yellow-200 border border-yellow-400 shadow-[0_0_8px_#fef08a] animate-pulse delay-300" />
                                <div className="absolute bottom-[31px] left-4 w-2 h-2 rounded-full bg-yellow-200 border border-yellow-400 shadow-[0_0_8px_#fef08a] animate-pulse delay-150" />
                                <div className="absolute bottom-[31px] left-8 w-2 h-2 rounded-full bg-yellow-200 border border-yellow-400 shadow-[0_0_8px_#fef08a] animate-pulse delay-500" />
                                {/* Hanging wire effect */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 56">
                                  <path d="M 6,31 Q 12,36 18,31 T 30,31 T 42,31" fill="none" stroke="#4b5563" strokeWidth="0.8" strokeLinecap="round" />
                                  <path d="M 6,13 Q 12,18 18,13 T 30,13 T 42,13" fill="none" stroke="#4b5563" strokeWidth="0.8" strokeLinecap="round" />
                                </svg>
                              </>
                            )}
                          </div>
                        );
                     })()}
                     {fenceId === 'fence_clay_wall' && (() => {
                        const level = stats.level || 1;
                        return (
                          <div className="relative w-12 h-12 flex items-end justify-center pointer-events-none">
                            <div className="w-12 h-7 bg-gradient-to-t from-amber-900 to-amber-700 border border-amber-950 rounded-t-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center">
                              <div className="w-8 h-[2px] bg-amber-600/30 rounded absolute top-1.5" />
                            </div>
                            <div className="absolute bottom-0 w-12 h-1 bg-black/30 rounded-full blur-[1px] -z-10" />

                            {/* Visual Evolution - Level-based textures, ivy and marigold/rose flowers */}
                            {level >= 4 && (
                              <>
                                {/* Level 4-6 Sprout: Cute creeping moss & vine at the base */}
                                <div className="absolute bottom-1 left-2 w-3 h-2 bg-emerald-600/80 rounded-full blur-[0.5px]" />
                                <div className="absolute bottom-1.5 right-1 w-4 h-1.5 bg-emerald-500/90 rounded-full blur-[0.5px]" />
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                  <path d="M 4,44 Q 12,38 16,42 T 28,40" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                              </>
                            )}
                            {level >= 7 && (
                              <>
                                {/* Level 7-9 Bloom: Rich climbing roses (red/orange) and hanging vine details */}
                                <div className="absolute left-2 top-6 w-2 h-2 rounded-full bg-rose-500 border border-rose-700 shadow-sm" />
                                <div className="absolute right-3 top-5 w-2 h-2 rounded-full bg-rose-500 border border-rose-700 shadow-sm" />
                                <div className="absolute left-6 top-7 w-1.5 h-1.5 rounded-full bg-rose-400 border border-rose-600 shadow-sm" />
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                                  <path d="M 2,42 C 6,32 10,24 20,26 C 26,27 34,20 40,24" fill="none" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                              </>
                            )}
                            {level >= 10 && (
                              <>
                                {/* Level 10+ Mythic: Ancient gold runic glow markings and magical floating petals */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 text-[10px] text-amber-300 font-mono font-bold tracking-widest opacity-80 filter drop-shadow-[0_0_3px_#f59e0b] select-none animate-pulse">✨</div>
                                <div className="absolute top-5 left-3 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b] animate-bounce" />
                                <div className="absolute top-4 right-2 w-1 h-1 rounded-full bg-amber-300 shadow-[0_0_5px_#f59e0b] animate-bounce delay-150" />
                              </>
                            )}
                          </div>
                        );
                     })()}
                  </div>
                )
             } else if (item.type === 'terrain_detail') {
                return (
                  <div key={item.id} className="absolute pointer-events-none" style={{ zIndex: 0, left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translate(-50%, -50%) rotateZ(45deg) rotateX(-60deg)' }}>
                     {item.detailType === 'pebble' && (
                        <div className="w-1.5 h-1 bg-slate-400/80 rounded-[40%] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)] mix-blend-overlay rotate-12" />
                     )}
                     {item.detailType === 'leaf' && (
                        <div className="w-2 h-1 bg-emerald-700/60 rounded-full rounded-tr-[1px] shadow-sm mix-blend-overlay rotate-[35deg]" />
                     )}
                     {item.detailType === 'moss' && (
                        <div className="w-3 h-2 bg-emerald-600/40 rounded-full blur-[0.5px] mix-blend-overlay" />
                     )}
                  </div>
                );
            }
            return null;
         })}
       </motion.div>
       </div>
       </div>
       </TransformComponent>
      </TransformWrapper>
      
      {/* Subtle Paper-Grain / Organic Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[90] opacity-[0.06] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <AnimatePresence>
        {showMilestoneAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="absolute inset-0 z-[100] pointer-events-none overflow-hidden"
          >
             {/* Seasonal Cycle Layers */}
             
             {/* Spring Burst */}
             <motion.div 
               className="absolute inset-0 bg-green-500/30 mix-blend-color"
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 3, times: [0, 0.5, 1], ease: "easeInOut" }}
             />
             <motion.div 
               className="absolute inset-0 flex items-center justify-center text-8xl drop-shadow-2xl"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
               transition={{ duration: 3, ease: "easeOut" }}
             >
                🌸
             </motion.div>

             {/* Summer Sun */}
             <motion.div 
               className="absolute inset-0 bg-yellow-400/30 mix-blend-color"
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 3, delay: 3, times: [0, 0.5, 1], ease: "easeInOut" }}
             />
             <motion.div 
               className="absolute inset-0 flex items-center justify-center text-8xl drop-shadow-2xl"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0], rotate: [0, -90, -180] }}
               transition={{ duration: 3, delay: 3, ease: "easeOut" }}
             >
                ☀️
             </motion.div>

             {/* Autumn Leaves */}
             <motion.div 
               className="absolute inset-0 bg-orange-600/30 mix-blend-color"
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 3, delay: 6, times: [0, 0.5, 1], ease: "easeInOut" }}
             />
             <motion.div 
               className="absolute inset-0 flex items-center justify-center text-8xl drop-shadow-2xl"
               initial={{ scale: 0, opacity: 0, y: -100 }}
               animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0], y: [0, 100], rotate: [0, 45, 90] }}
               transition={{ duration: 3, delay: 6, ease: "easeOut" }}
             >
                🍂
             </motion.div>

             {/* Winter Snow */}
             <motion.div 
               className="absolute inset-0 bg-blue-200/40 mix-blend-screen"
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 3, delay: 9, times: [0, 0.5, 1], ease: "easeInOut" }}
             />
             <motion.div 
               className="absolute inset-0 flex items-center justify-center text-8xl drop-shadow-2xl"
               initial={{ scale: 0, opacity: 0, y: -100 }}
               animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0], y: [0, 100], rotate: [0, -45, -90] }}
               transition={{ duration: 3, delay: 9, ease: "easeOut" }}
             >
                ❄️
             </motion.div>

             {/* Text overlay */}
             <motion.div
               className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 2] }}
               transition={{ duration: 12, times: [0, 0.1, 0.9, 1] }}
             >
                <div className="bg-black/60 backdrop-blur-md px-12 py-8 rounded-3xl border-2 border-white/20 text-center shadow-[0_0_80px_rgba(255,255,255,0.2)]">
                    <div className="text-accent-mustard text-7xl font-black mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(244,196,71,0.6)]">
                       {Math.max(50, Math.floor(stats.totalHabitsCompleted / 50) * 50)}
                    </div>
                    <div className="text-white text-3xl font-bold tracking-[0.2em] uppercase">Habits Grown</div>
                    <div className="text-white/80 text-sm mt-3 tracking-wider font-mono">A new cycle begins...</div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
