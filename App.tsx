import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Bot,
  Plus,
  Calendar,
  CalendarDays,
  Download,
  Settings,
  LogOut,
  Trophy,
  Zap,
  Cloud,
  CloudOff,
  Loader2,
  Wifi,
  WifiOff,
  Flame,
  User as UserIcon,
  FileText,
  Target,
  Store,
  Archive,
  Activity,
  Check,
  Quote,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { format, differenceInCalendarDays, subDays, startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO, eachDayOfInterval } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { playCompletionSound, playMilestoneSound } from "./audio";
import { onAuthStateChanged, User } from "firebase/auth";

import {
  auth,
  subscribeToUserData,
  saveUserData,
  syncLocalDataToCloud,
  logout,
} from "./services/firebase";

import { AnimatedModal } from "./components/AnimatedModal";
import { CustomCategoryManager } from "./components/CustomCategoryManager";
import { DailyGoalRing } from "./components/DailyGoalRing";
import { Habit, HabitLog, Tab, UserStats, PlantHealthStatus, RestMode, RestModeType, RestScopeType, ShopItem, CustomCategory } from "./types";
import { getLevelFromXP, getRankFromLevel, LEVEL_THRESHOLDS } from "./levels";
import { HabitCard } from "./components/HabitCard";
import { HabitForm } from "./components/HabitForm";
import { ProgressChart } from "./components/ProgressChart";
import { Heatmap } from "./components/Heatmap";
import { Button } from "./components/Button";
import { Login } from "./components/Login";
import { PlantIcon } from "./components/PlantIcon";
import { DailyGarden } from "./components/DailyGarden";
import { WeeklyReportView } from "./components/WeeklyReportView";
import { MonthlyReportView } from "./components/MonthlyReportView";
import { GardenCalendar } from "./components/GardenCalendar";
import { ChallengesView } from "./components/ChallengesView";
import { GardenShop } from "./components/GardenShop";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { RestModeSetup } from "./components/RestModeSetup";
import { isDateInRestMode, isHabitPaused } from "./restModeUtils";
import { AlmanacView } from "./components/AlmanacView";
import { isAlmanacSeason, getAlmanacYear, generateAlmanac } from "./almanacUtils";
import { isHabitDueOnDate, getCompletedCountThisWeek } from "./scheduleUtils";
import { GardenBadgesView } from "./components/GardenBadgesView";
import { useAndroidApp } from "./services/useAndroidApp";
import { SimpleGardenStatsDashboard } from "./components/SimpleGardenStatsDashboard";
import { checkBadgeUnlocks } from "./badgeUtils";
import { ACHIEVEMENT_BADGES } from "./badgeConfig";
import { AchievementBadge } from "./types";

import { validatePurchase, calculateDailyCoinCap, calculateSecureCoinReward, processDailyEconomyReset } from './economyEngine';
import { playHaptic } from "./haptics";
import confetti from "canvas-confetti";
import { getChallengeTemplate } from "./challengesData";
import { CATEGORIES } from "./categories";
import { GardenHistoryView } from "./components/GardenHistoryView";
import { getActiveEvent } from "./events";
import { EventBanner } from "./components/EventBanner";
import { EventDetailModal } from "./components/EventDetailModal";
import { GardenCompanions } from "./components/GardenCompanions";
import { CompanionUnlockModal } from "./components/CompanionUnlockModal";
import { OrchardModal } from "./components/OrchardModal";
import pkg from "./package.json";
import { HarvestModal } from "./components/HarvestModal";
import { BadgeUnlockModal } from "./components/BadgeUnlockModal";
import { MotivationSettings } from "./components/MotivationSettings";
import { COMPANIONS } from "./companionsData";
import { evaluateCompanionUnlocks } from "./companionUtils";

const APP_START_TIME = Date.now();

const MOTIVATIONAL_QUOTES = [
  {
    text: "Consistency is what transforms average into excellence.",
    author: "Discipline",
  },
  {
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
  {
    text: "No Zero Days. Even a single 2-minute progress keeps momentum alive.",
    author: "Habit Protocol",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Focus",
  },
  {
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
];

export const APP_THEMES = [
  {
    id: "cream_butter",
    name: "Cream Butter",
    description: "Playful organic light theme with warm cream canvas & sage accent.",
    colors: {
      "--color-background-main": "#FDFBF7",
      "--color-primary-anchor": "#1C1B1F",
      "--color-primary-text": "#1C1B1F",
      "--color-surface-card": "#FFFFFF",
      "--color-surface-soft": "#FDFBF7",
      "--color-surface-alt": "#F4EDE4",
      "--color-secondary-text": "#4A4A4A",
      "--color-muted-text": "#737373",
      "--color-primary-mint": "#4EADA0",
    },
    accentColor: "78 173 160",
    isDark: false,
  },
  {
    id: "midnight_slate",
    name: "Midnight Slate",
    description: "Sleek blue tech theme with carbon panels and cool slate colors.",
    colors: {
      "--color-background-main": "#0B101B",
      "--color-primary-anchor": "#F1F5F9",
      "--color-primary-text": "#F1F5F9",
      "--color-surface-card": "#151B2C",
      "--color-surface-soft": "#0B101B",
      "--color-surface-alt": "#212A3E",
      "--color-secondary-text": "#94A3B8",
      "--color-muted-text": "#64748B",
      "--color-primary-mint": "#22D3EE",
    },
    accentColor: "34 211 238",
    isDark: true,
  },
  {
    id: "cosmic_cyber",
    name: "Cyberpunk Neon",
    description: "Immersive synthwave dark purple featuring hot neon pink actions.",
    colors: {
      "--color-background-main": "#08040F",
      "--color-primary-anchor": "#FAF5FF",
      "--color-primary-text": "#FAF5FF",
      "--color-surface-card": "#140B25",
      "--color-surface-soft": "#08040F",
      "--color-surface-alt": "#2F144D",
      "--color-secondary-text": "#D8B4FE",
      "--color-muted-text": "#A855F7",
      "--color-primary-mint": "#ED1E79",
    },
    accentColor: "237 30 121",
    isDark: true,
  },
  {
    id: "forest_zen",
    name: "Forest Zen",
    description: "Peaceful forest floor greens, dark moss, and soft birch details.",
    colors: {
      "--color-background-main": "#0A130D",
      "--color-primary-anchor": "#E6F4EA",
      "--color-primary-text": "#E6F4EA",
      "--color-surface-card": "#122017",
      "--color-surface-soft": "#0A130D",
      "--color-surface-alt": "#223829",
      "--color-secondary-text": "#A3D9C9",
      "--color-muted-text": "#5EA388",
      "--color-primary-mint": "#4EADA0",
    },
    accentColor: "78 173 160",
    isDark: true,
  },
  {
    id: "retro_paper",
    name: "Retro Paper",
    description: "Classic tactile feel of vintage journals with rust/coral dyes.",
    colors: {
      "--color-background-main": "#F3EDE0",
      "--color-primary-anchor": "#29241E",
      "--color-primary-text": "#29241E",
      "--color-surface-card": "#FDFBF7",
      "--color-surface-soft": "#F3EDE0",
      "--color-surface-alt": "#E3D5B7",
      "--color-secondary-text": "#5C5245",
      "--color-muted-text": "#8E7D66",
      "--color-primary-mint": "#D05A3F",
    },
    accentColor: "208 90 63",
    isDark: false,
  },
  {
    id: "classic_obsidian",
    name: "Classic Obsidian",
    description: "Pure contrast deep space theme with emerald habit trackers.",
    colors: {
      "--color-background-main": "#050608",
      "--color-primary-anchor": "#FFFFFF",
      "--color-primary-text": "#FFFFFF",
      "--color-surface-card": "#10121A",
      "--color-surface-soft": "#050608",
      "--color-surface-alt": "#20232E",
      "--color-secondary-text": "#94A3B8",
      "--color-muted-text": "#5A657C",
      "--color-primary-mint": "#10B981",
    },
    accentColor: "16 185 129",
    isDark: true,
  },
];

export function applyAppTheme(
  themeId: string,
  customAccentColor?: string,
  cornerRoundness?: "sharp" | "medium" | "soft",
  borderStyle?: "invisible" | "subtle" | "solid" | "neon"
) {
  const theme = APP_THEMES.find((t) => t.id === themeId) || APP_THEMES[0];

  // Set theme colors
  Object.entries(theme.colors).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val);
  });

  // Apply accent color override
  if (customAccentColor) {
    if (customAccentColor.includes(" ")) {
      document.documentElement.style.setProperty("--primary-mint", customAccentColor);
      document.documentElement.style.setProperty("--color-primary-mint", `rgb(${customAccentColor})`);
    } else {
      document.documentElement.style.setProperty("--primary-mint", customAccentColor);
      document.documentElement.style.setProperty("--color-primary-mint", customAccentColor);
    }
  } else {
    const themeMint = theme.colors["--color-primary-mint"];
    document.documentElement.style.setProperty("--color-primary-mint", themeMint);
    try {
      const hex = themeMint.startsWith("#") ? themeMint : "#4EADA0";
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      document.documentElement.style.setProperty("--primary-mint", `${r} ${g} ${b}`);
    } catch (e) {
      document.documentElement.style.setProperty("--primary-mint", "78 173 160");
    }
  }

  // Apply corner roundness customization
  const cr = cornerRoundness || "soft";
  if (cr === "sharp") {
    document.documentElement.style.setProperty("--radius-none", "0px");
    document.documentElement.style.setProperty("--radius-sm", "0px");
    document.documentElement.style.setProperty("--radius-md", "0px");
    document.documentElement.style.setProperty("--radius-lg", "0px");
    document.documentElement.style.setProperty("--radius-xl", "0px");
    document.documentElement.style.setProperty("--radius-2xl", "0px");
    document.documentElement.style.setProperty("--radius-3xl", "0px");
    document.documentElement.style.setProperty("--radius-card", "0px");
    document.documentElement.style.setProperty("--radius-large-card", "0px");
    document.documentElement.style.setProperty("--radius-button", "0px");
    document.documentElement.style.setProperty("--radius-input", "0px");
    document.documentElement.style.setProperty("--radius-chip", "0px");
    document.documentElement.style.setProperty("--radius-progress", "0px");
  } else if (cr === "medium") {
    document.documentElement.style.setProperty("--radius-none", "2px");
    document.documentElement.style.setProperty("--radius-sm", "6px");
    document.documentElement.style.setProperty("--radius-md", "8px");
    document.documentElement.style.setProperty("--radius-lg", "12px");
    document.documentElement.style.setProperty("--radius-xl", "14px");
    document.documentElement.style.setProperty("--radius-2xl", "16px");
    document.documentElement.style.setProperty("--radius-3xl", "20px");
    document.documentElement.style.setProperty("--radius-card", "12px");
    document.documentElement.style.setProperty("--radius-large-card", "16px");
    document.documentElement.style.setProperty("--radius-button", "8px");
    document.documentElement.style.setProperty("--radius-input", "8px");
    document.documentElement.style.setProperty("--radius-chip", "9999px");
    document.documentElement.style.setProperty("--radius-progress", "9999px");
  } else {
    // Default playful
    document.documentElement.style.setProperty("--radius-none", "16px");
    document.documentElement.style.setProperty("--radius-sm", "24px");
    document.documentElement.style.setProperty("--radius-md", "24px");
    document.documentElement.style.setProperty("--radius-lg", "32px");
    document.documentElement.style.setProperty("--radius-xl", "32px");
    document.documentElement.style.setProperty("--radius-2xl", "32px");
    document.documentElement.style.setProperty("--radius-3xl", "50px");
    document.documentElement.style.setProperty("--radius-card", "24px");
    document.documentElement.style.setProperty("--radius-large-card", "32px");
    document.documentElement.style.setProperty("--radius-button", "9999px");
    document.documentElement.style.setProperty("--radius-input", "9999px");
    document.documentElement.style.setProperty("--radius-chip", "9999px");
    document.documentElement.style.setProperty("--radius-progress", "9999px");
  }

  // Apply border style intensity
  const bs = borderStyle || "subtle";
  if (bs === "invisible") {
    document.documentElement.style.setProperty("--color-surface-alt", theme.colors["--color-surface-card"]);
  } else if (bs === "solid") {
    const textBorder = theme.colors["--color-primary-anchor"];
    document.documentElement.style.setProperty("--color-surface-alt", textBorder);
  } else if (bs === "neon") {
    const themeMint = theme.colors["--color-primary-mint"];
    document.documentElement.style.setProperty("--color-surface-alt", customAccentColor ? (customAccentColor.includes(" ") ? `rgb(${customAccentColor})` : customAccentColor) : themeMint);
  } else {
    document.documentElement.style.setProperty("--color-surface-alt", theme.colors["--color-surface-alt"]);
  }
}

function checkWeeklyConsistencyThreeWeeks(habits: Habit[], logs: HabitLog, referenceDate: Date): boolean {
  if (habits.length === 0) return false;
  
  // Checking last 3 weeks: Week 0 (current), Week 1 (previous), Week 2 (2 weeks ago)
  const weeks = [0, 1, 2].map(num => {
    const ref = subWeeks(referenceDate, num);
    const start = startOfWeek(ref, { weekStartsOn: 1 });
    const end = endOfWeek(ref, { weekStartsOn: 1 });
    return { start, end };
  });

  const activeHabits = habits.filter(h => !h.isArchived);
  if (activeHabits.length === 0) return false;

  // For each week, let's check if the target was met for ALL active habits
  for (const week of weeks) {
    let weekSuccess = true;
    let checkedAny = false;
    
    for (const h of activeHabits) {
      // Check if habit was created after this week ended. If so, ignore it for this week's check.
      if (h.createdAt && new Date(h.createdAt) > week.end) {
        continue;
      }
      
      checkedAny = true;
      // Calculate completed times for h inside the week's interval
      let completionsInWeek = 0;
      const daysInWeek = eachDayOfInterval({ start: week.start, end: week.end });
      daysInWeek.forEach(logDate => {
        const dateStr = format(logDate, "yyyy-MM-dd");
        if (logs[dateStr] && logs[dateStr].includes(h.id)) {
           completionsInWeek++;
        }
      });
      
      const target = h.scheduleType === 'weekly' ? 1 
                   : (h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' ? (h.targetCount || 1)
                   : (h.scheduleType === 'specific_days' ? (h.scheduleDays || []).length
                   : 5)); // 5 days for daily as a standard
      
      if (completionsInWeek < target) {
        weekSuccess = false;
        break;
      }
    }
    
    if (!checkedAny || !weekSuccess) {
      return false; // This week failed
    }
  }
  
  return true;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [habits, setHabits] = useState<Habit[]>([]);
  useAndroidApp(habits);

  // App State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRACKER);
  const [progressSubTab, setProgressSubTab] = useState<'virtual_garden' | 'calendar'>('virtual_garden');
  const [reportViewMode, setReportViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [statsSubTab, setStatsSubTab] = useState<'overview' | 'reports' | 'challenges' | 'badges' | 'profile' | 'history'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRestModeModal, setShowRestModeModal] = useState(false);
  const [activeRestMode, setActiveRestMode] = useState<RestMode | null>(null);
  const [recentlyUnlockedCompanions, setRecentlyUnlockedCompanions] = useState<string[]>([]);
  const [harvestedData, setHarvestedData] = useState<{fruitId: string, fruitName: string, xpReward: number, coinReward: number, habitName: string} | null>(null);
  const [showOrchard, setShowOrchard] = useState(false);
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [currentAlmanacYear, setCurrentAlmanacYear] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, title: string, message: string, confirmText?: string, cancelText?: string, secondaryActionText?: string, onConfirm: () => void, onSecondaryAction?: () => void, variant?: 'danger' | 'warning' | 'info' }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<AchievementBadge[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortType, setSortType] = useState<'health' | 'alpha' | 'recent' | 'recovery'>('recent');
  const [date, setDate] = useState(new Date());
  const dateKey = format(date, "yyyy-MM-dd");

  React.useEffect(() => {
    // Throttled background side-effects loop (time updates, midnight rollover)
    // Only runs heavily when idle or unfocused, reducing battery consumption
    const runChecks = () => {
       const newDate = new Date();
       if (format(newDate, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")) {
          setDate(newDate); // triggers midnight cascade
       }
       import('./components/GardenSky').then(({ getGardenTimePhase }) => {
          const phase = getGardenTimePhase();
          if (document.body.getAttribute('data-time-phase') !== phase) {
             document.body.setAttribute('data-time-phase', phase);
          }
       });
    };
    
    runChecks();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') requestAnimationFrame(runChecks);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleFocus = () => requestAnimationFrame(runChecks);
    window.addEventListener('focus', handleFocus);

    const loop = () => {
       requestAnimationFrame(runChecks);
    };
    
    // Scans every 5 minutes instead of 1 minute loops
    const interval = setInterval(loop, 5 * 60000);

    return () => {
       document.removeEventListener('visibilitychange', handleVisibilityChange);
       window.removeEventListener('focus', handleFocus);
       clearInterval(interval);
    };
  }, [date]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Motivation Popup State
  const [motivationPopup, setMotivationPopup] = useState<{ text: string, author?: string } | null>(null);
  const [massiveCoinPopup, setMassiveCoinPopup] = useState<number | null>(null);
  const [growthMultiplierPopup, setGrowthMultiplierPopup] = useState<{
     streak: number;
     extraCoins: number;
     habitName: string;
     multiplier: number;
  } | null>(null);
  const [weeklyCelebrationData, setWeeklyCelebrationData] = useState<{
     activePlants: number;
     maturePlants: number;
     totalHabitsCompleted: number;
     currentLevel: number;
     coinReward: number;
     xpReward: number;
  } | null>(null);

  // Data State
  const [logs, setLogs] = useState<HabitLog>({});
  const [extraStats, setExtraStats] = useState<Partial<UserStats>>({
      perfectGardenDays: 0, plantsRevived: 0, xp: 0
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [hasProcessedStreak, setHasProcessedStreak] = useState(false);
  const hasShownMotivationRef = React.useRef(false);

  const activeEvent = React.useMemo(() => getActiveEvent(new Date()), []);
  const eventProgress = extraStats.eventProgress?.eventId === activeEvent?.id 
    ? extraStats.eventProgress 
    : (activeEvent ? {
        eventId: activeEvent.id,
        startedAt: new Date().toISOString(),
        isCompleted: false,
        rewardClaimed: false,
        questProgress: {}
      } : undefined);

  // Install Prompt
   
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastData, setToastData] = useState<{message: string, action?: {label: string, onClick: () => void}} | null>(null);

  const showToast = (message: string, action?: {label: string, onClick: () => void}) => {
    setToastData({message, action});
    setTimeout(() => setToastData(null), 5000);
  };


  // Network Listener
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 1. Auth Listener
  useEffect(() => {
    if (!auth.app) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Migration Check
        const localHabits = localStorage.getItem("t2sar_habits");
        if (localHabits) {
          const parsedHabits = JSON.parse(localHabits);
          const parsedLogs = JSON.parse(
            localStorage.getItem("t2sar_logs") || "{}",
          );
          await syncLocalDataToCloud(currentUser.uid, parsedHabits, parsedLogs);
          localStorage.removeItem("t2sar_habits");
          localStorage.removeItem("t2sar_logs");
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Sync Listener (Real-time)
  useEffect(() => {
    if (!user) return;

    setDataLoading(true);
    const unsubscribe = subscribeToUserData(user.uid, (data) => {
      if (data) {
        setHabits(data.habits || []);
        setLogs(data.logs || {});
        setExtraStats(data.extraStats || { perfectGardenDays: 0, plantsRevived: 0, xp: 0 });
        setActiveRestMode(data.activeRestMode || null);
      } else {
        // Offline fallback: load from localStorage
        try {
          const cached = localStorage.getItem('t2sar_offline_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            setHabits(parsed.habits || []);
            setLogs(parsed.logs || {});
            setExtraStats(parsed.extraStats || { perfectGardenDays: 0, plantsRevived: 0, xp: 0 });
            setActiveRestMode(parsed.activeRestMode || null);
          }
        } catch (e) {
          console.error('Failed to load offline cache:', e);
        }
      }
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Accent and Full Visual Theme Controller Effect
  useEffect(() => {
    if (!extraStats) return;
    const themeId = extraStats.themeId || "cream_butter";
    const accentColor = extraStats.accentColor;
    const cornerRoundness = extraStats.cornerRoundness || "soft";
    const borderStyle = extraStats.borderStyle || "subtle";

    import("./components/GardenSky").then(({ getGardenTimePhase }) => {
      const phase = getGardenTimePhase();
      const isNightPhase = phase === "Evening" || phase === "Night";
      const actualTheme = (isNightPhase && (extraStats.matchTimeOfDay !== false) && themeId === "cream_butter")
        ? "classic_obsidian"
        : themeId;
      applyAppTheme(actualTheme, accentColor, cornerRoundness, borderStyle);
    });
  }, [extraStats?.themeId, extraStats?.accentColor, extraStats?.cornerRoundness, extraStats?.borderStyle, extraStats?.matchTimeOfDay, date]);

  // Gardener's Streak Processing
  useEffect(() => {
    if (dataLoading || !user || !extraStats || hasProcessedStreak) return;

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const lastLogin = extraStats.lastLoginDate;
    
    if (lastLogin === todayStr) {
      setHasProcessedStreak(true);
      return;
    }

    let currentStreak = extraStats.currentLoginStreak || 0;
    let xpBonus = 0;
    let updated = false;

    if (!lastLogin) {
      currentStreak = 1;
      xpBonus = 10;
      updated = true;
    } else {
      const diff = differenceInCalendarDays(new Date(todayStr), new Date(lastLogin));
      if (diff === 1) {
        currentStreak += 1;
        xpBonus = Math.min(currentStreak * 5, 50);
        updated = true;
      } else if (diff > 1) {
        currentStreak = 1;
        xpBonus = 5;
        updated = true;
      }
    }

    if (updated) {
      setHasProcessedStreak(true);
      const updatedStats = {
        ...extraStats,
        lastLoginDate: todayStr,
        currentLoginStreak: currentStreak,
        xp: (extraStats.xp || 0) + xpBonus
      };
      setExtraStats(updatedStats);
      saveUserData(user.uid, { habits, logs, extraStats: updatedStats, activeRestMode });
      
      setTimeout(() => {
        showToast(`🌱 Gardener's Streak Day ${currentStreak}! +${xpBonus} XP`);
        playHaptic('grow');
      }, 1500);
    }
  }, [dataLoading, user, extraStats, habits, logs, activeRestMode, hasProcessedStreak]);

  // Motivation Popup logic
  useEffect(() => {
    if (dataLoading || !user || !extraStats || hasShownMotivationRef.current) return;
    hasShownMotivationRef.current = true;

    setTimeout(() => {
      let shownToday = extraStats.motivationsShownToday || 0;
      const lastDate = extraStats.lastMotivationDate;

      if (lastDate !== dateKey) {
        shownToday = 0;
      }

      const limit = extraStats.motivationFrequencyLimit ?? 1;

      if (limit === -1 || shownToday < limit) {
        const customQuotes = extraStats.motivations || [];
        
        if (customQuotes.length > 0 || MOTIVATIONAL_QUOTES.length > 0) {
          const validQuotes = customQuotes.length > 0 ? customQuotes : MOTIVATIONAL_QUOTES;
          const chosen = validQuotes[Math.floor(Math.random() * validQuotes.length)];
          
          setMotivationPopup({ text: (chosen as any).quote_text || (chosen as any).text, author: (chosen as any).author });

          // Update stats and sync
          const updatedStats = {
            ...extraStats,
            motivationsShownToday: shownToday + 1,
            lastMotivationDate: dateKey
          };
          setExtraStats(updatedStats);
          saveUserData(user.uid, { habits, logs, extraStats: updatedStats, activeRestMode });
        }
      }
    }, 2000); // 2 second delay for gentle entry after loading
  }, [dataLoading, user, extraStats, habits, logs, activeRestMode, dateKey]);

  // Process missed habits once per day
  useEffect(() => {
    if (dataLoading || habits.length === 0) return;
    let changed = false;
    
    let activeFreezes = extraStats.streakFreezes || 0;
    let freezesUsed = 0;
    const frozenDates = new Set<string>();

    const updatedHabits = habits.map((habit) => {
      const lastDate =
        habit.lastMissCheckedDate ||
        format(new Date(habit.createdAt || Date.now()), "yyyy-MM-dd");
      const daysMissed = Math.max(
        0,
        differenceInCalendarDays(new Date(dateKey), new Date(lastDate)),
      );

      if (daysMissed > 0) {
        let missedCount = 0;
        
        for (let i = 1; i <= daysMissed; i++) {
          const checkDateStr = format(
            subDays(new Date(dateKey), i),
            "yyyy-MM-dd",
          );
          
          const wasProtected = isHabitPaused(habit.id, checkDateStr, activeRestMode);
          const wasDue = isHabitDueOnDate(habit, checkDateStr);
          
          if (!wasDue) continue;
          
          if (habit.scheduleType === 'times_per_week' || habit.scheduleType === 'weekly' || habit.scheduleType === 'anytime') {
             continue;
          }
          
          const didComplete = logs[checkDateStr]?.includes(habit.id);
          if (!didComplete && !wasProtected) {
            // Did we already freeze this date globally for another habit in this loop?
            if (frozenDates.has(checkDateStr)) {
               // Protected by a freeze already consumed in this loop
               continue;
            } else if (activeFreezes > 0) {
               // Consume a freeze to protect this whole day for all habits
               activeFreezes--;
               freezesUsed++;
               frozenDates.add(checkDateStr);
               // Do not increment missedCount, it's frozen!
            } else {
               missedCount++;
            }
          }
        }

        if (missedCount > 0) {
          changed = true;
          let newHealth = habit.plantHealth ?? 100;
          let remainingMisses = missedCount;
          let grace = habit.graceDays || 0;

          if (grace >= remainingMisses) {
            grace -= remainingMisses;
            remainingMisses = 0;
          } else {
            remainingMisses -= grace;
            grace = 0;
          }

          const diff = habit.difficulty || 'medium';
          const missLoss = diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25;
          newHealth -= remainingMisses * missLoss;
          newHealth = Math.max(0, newHealth);

          const status = newHealth <= 0
              ? "Dead"
              : newHealth < 20
                ? "Critical"
                : newHealth < 50
                  ? "Wilting"
                  : newHealth < 80
                    ? "Normal"
                    : "Healthy";

          return {
            ...habit,
            streak: remainingMisses > 0 ? 0 : habit.streak,
            graceDays: grace,
            plantHealth: newHealth,
            plantStatus: status as PlantHealthStatus,
            lastMissCheckedDate: dateKey,
          };
        }
      }

      if (daysMissed > 0) {
        changed = true;
        return { ...habit, lastMissCheckedDate: dateKey };
      }
      return habit;
    });

    if (changed || freezesUsed > 0) {
      setTimeout(() => {
        setHabits(updatedHabits);
        
        const newExtraStats = { ...extraStats };
        if (freezesUsed > 0) {
           newExtraStats.streakFreezes = Math.max(0, (newExtraStats.streakFreezes || 0) - freezesUsed);
        }
        
        persistData(updatedHabits, logs, newExtraStats, activeRestMode);
        if (freezesUsed > 0) {
           setExtraStats(newExtraStats);
        }
      }, 500);
    }
  }, [dataLoading, dateKey]);

  // 3. Stats Calculation
  const stats = React.useMemo<UserStats>(() => {
    // Instead of recalculating from full history scan (Object.values(logs).reduce):
    // Use the cached extraStats if it exists, or compute purely incrementally.
    const totalHabitsCompleted = extraStats.totalHabitsCompleted || 0;
    const totalXp = (extraStats.xp || 0) + habits.reduce((acc, h) => acc + (h.xp || (h.totalCompletions || 0) * 10), 0) || totalHabitsCompleted * 10;
    const level = getLevelFromXP(totalXp);
    const rank = getRankFromLevel(level);

    return { 
        ...extraStats,
        xp: totalXp, 
        level, 
        totalHabitsCompleted, 
        rank,
        perfectGardenDays: extraStats.perfectGardenDays || 0,
        plantsRevived: extraStats.plantsRevived || 0
    };
  }, [extraStats, habits]);

  // 4. Save to Cloud Helper
  const persistData = (newHabits: Habit[], newLogs: HabitLog, incomingStats: Partial<UserStats> = extraStats, newRestMode: RestMode | null = activeRestMode) => {
    // Verify badges using a dynamically constructed full stats object
    const totalCompleted = newHabits.reduce((acc, h) => acc + (h.totalCompletions || 0), 0);
    const totalXp = (incomingStats.xp || 0) + newHabits.reduce((acc, h) => acc + (h.xp || (h.totalCompletions || 0) * 10), 0) || totalCompleted * 10;
    const computedLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1; // Assuming getLevelFromXP logic fallback if needed
    
    // We should use the existing global getLevelFromXP function
    const fullLevel = typeof getLevelFromXP === 'function' ? getLevelFromXP(totalXp) : computedLevel;
    
    // Check badges before saving
    const statsToSave = { ...incomingStats };
    const statsForCheck = {
      ...statsToSave,
      totalHabitsCompleted: totalCompleted,
      level: fullLevel,
      // For streak, let's use the local 'bestStreak' across all habits.
      bestDailyGardenStreak: newHabits.reduce((max, h) => Math.max(max, h.bestStreak || 0), 0)
    };
    
    const { newStats, unlockedBadges } = checkBadgeUnlocks(statsForCheck);
    
    if (unlockedBadges.length > 0) {
      // Apply the modified extra fields from checkBadgeUnlocks to statsToSave
      Object.assign(statsToSave, {
        unlockedBadgeIds: newStats.unlockedBadgeIds,
        xp: newStats.xp,
        coins: newStats.coins
      });
      setExtraStats(statsToSave);
      
      try {
        const locallyShownBadges = JSON.parse(localStorage.getItem('t2sar_shown_badges') || '[]');
        const actualNewBadges = unlockedBadges.filter(b => !locallyShownBadges.includes(b.badgeId));
        
        // Suppress popups during initial hydration (first 5 seconds)
        const isHydrationLoad = Date.now() - APP_START_TIME < 5000;
        
        if (actualNewBadges.length > 0) {
           localStorage.setItem('t2sar_shown_badges', JSON.stringify([
              ...locallyShownBadges, 
              ...actualNewBadges.map(b => b.badgeId)
           ]));
           
           if (!isHydrationLoad) {
             playHaptic('unlock');
             setNewlyUnlockedBadges(prev => [...prev, ...actualNewBadges]);
             playHaptic('allDone');

             // Special visual badge unlock trigger for milestones
             actualNewBadges.forEach(badge => {
               if (badge.badgeId === '21_day_nature_master' || badge.badgeId === '30_day_fruit_grower') {
                  showToast(`🔥 Epic Milestone: ${badge.title} Unlocked!`, {
                     label: "Awesome!",
                     onClick: () => {}
                  });
               }
             });
           }
        }
      } catch (e) {
        if (Date.now() - APP_START_TIME >= 5000) {
           setNewlyUnlockedBadges(prev => [...prev, ...unlockedBadges]);
        }
      }
    }

    const companionResults = evaluateCompanionUnlocks(newHabits, statsToSave);
    if (companionResults) {
       Object.assign(statsToSave, {
          companions: companionResults.updatedCompanions
       });
       setExtraStats(statsToSave);
       
       const isHydrationLoad = Date.now() - APP_START_TIME < 5000;
       if (!isHydrationLoad) {
         setRecentlyUnlockedCompanions(prev => [...prev, ...companionResults.newUnlockIds]);
         playHaptic('unlock');
       }
    }

    if (user) {
      saveUserData(user.uid, { habits: newHabits, logs: newLogs, extraStats: statsToSave, activeRestMode: newRestMode });
    }

    // Offline fallback: always persist to localStorage
    try {
      localStorage.setItem('t2sar_offline_cache', JSON.stringify({
        habits: newHabits,
        logs: newLogs,
        extraStats: statsToSave,
        activeRestMode: newRestMode
      }));
    } catch (e) {
      console.error('Failed to save offline cache:', e);
    }
  };

  const lastStateHash = React.useRef<string>('');
  const throttleTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (dataLoading || authLoading || !user) return;
    
    const currentHash = JSON.stringify({ h: habits, l: logs, s: extraStats, r: activeRestMode });
    if (currentHash === lastStateHash.current) return;
    
    if (!throttleTimeoutRef.current) {
        lastStateHash.current = currentHash;
        persistData(habits, logs, extraStats, activeRestMode);
        throttleTimeoutRef.current = setTimeout(() => {
            throttleTimeoutRef.current = null;
            // Also commit any trailing changes that occurred during the throttle window
            const latestHash = JSON.stringify({ h: stateRefs.current.habits, l: stateRefs.current.logs, s: stateRefs.current.extraStats, r: stateRefs.current.activeRestMode });
            if (latestHash !== lastStateHash.current) {
               lastStateHash.current = latestHash;
               persistData(stateRefs.current.habits, stateRefs.current.logs, stateRefs.current.extraStats, stateRefs.current.activeRestMode);
            }
        }, 15000); // 15 seconds aggressive throttle
    }
  }, [habits, logs, extraStats, activeRestMode, user, dataLoading, authLoading]);

  // 5. Install Prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // 6. Evening Notification Summary
  const lastSummaryRef = React.useRef<string | null>(null);
  
  // Use refs to avoid resetting the interval on every state change
  const lastDailyReminderRef = React.useRef('');

  const stateRefs = React.useRef({ user, dataLoading, habits, logs, extraStats, activeRestMode });
  useEffect(() => {
    stateRefs.current = { user, dataLoading, habits, logs, extraStats, activeRestMode };
  }, [user, dataLoading, habits, logs, extraStats, activeRestMode]);

  useEffect(() => {
    const interval = setInterval(async () => {
       const { user, dataLoading, habits, logs, extraStats, activeRestMode } = stateRefs.current;
       if (!user || dataLoading) return;
       
       const now = new Date();
       const currentHours = now.getHours().toString().padStart(2, '0');
       const currentMinutes = now.getMinutes().toString().padStart(2, '0');
       const currentTime = `${currentHours}:${currentMinutes}`;
       const todayDateKey = format(now, 'yyyy-MM-dd');
       const { sendNotification, getEveningSummaryContent } = await import('./notifications');

       // ======== Evening Summary (Existing) ========
       const isSummaryEnabled = extraStats.eveningSummaryEnabled !== false;
       if (isSummaryEnabled) {
         let targetTime = extraStats.eveningSummaryTime || '21:00';
         
         if (extraStats.quietHoursStart && extraStats.quietHoursEnd) {
           if (targetTime >= extraStats.quietHoursStart && targetTime < extraStats.quietHoursEnd) {
             const [qH, qM] = extraStats.quietHoursStart.split(':').map(Number);
             let nH = qH;
             let nM = qM - 1;
             if (nM < 0) {
               nM = 59;
               nH -= 1;
             }
             targetTime = `${nH.toString().padStart(2, '0')}:${nM.toString().padStart(2, '0')}`;
           }
         }
         
         if (currentTime === targetTime) {
           if (lastSummaryRef.current !== todayDateKey) {
             const todaysHabits = habits.filter(h => !isHabitPaused(h.id, todayDateKey, activeRestMode));
             const unfinished = todaysHabits.filter(h => {
                 const completions = logs[todayDateKey] || [];
                 return !completions.includes(h.id);
             });
             
             if (unfinished.length > 0) {
                const summaryString = getEveningSummaryContent(unfinished);
                if (summaryString) {
                   const parts = summaryString.split('\n');
                   const title = parts[0] || 'Evening Garden Summary';
                   const body = parts.slice(1).join('\n') || '';
                   sendNotification(title, { body, icon: '/icon.png', badge: '/icon.png' });
                   lastSummaryRef.current = todayDateKey;
                }
             }
           }
         }
       }

       // ======== Daily Reminder (New) ========
       const isDailyReminderEnabled = extraStats.dailyReminderEnabled === true;
       if (isDailyReminderEnabled && extraStats.dailyReminderTime) {
          if (currentTime === extraStats.dailyReminderTime) {
             if (lastDailyReminderRef.current !== todayDateKey) {
                sendNotification("Time to check your garden! 🌿", { 
                  body: "Your plants might need watering.",
                  icon: "/icon.png",
                  badge: "/icon.png"
                });
                lastDailyReminderRef.current = todayDateKey;
             }
          }
       }

    }, 60000); // Check every 60 seconds using the ref
    
    return () => clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Logic Handlers
  const handleAddHabit = (
    newHabitData: Omit<
      Habit,
      | "id"
      | "streak"
      | "createdAt"
      | "bestStreak"
      | "totalCompletions"
      | "xp"
      | "plantStage"
      | "plantHealth"
      | "plantStatus"
      | "lastMissCheckedDate"
      | "graceDays"
    >,
  ) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: uuidv4(),
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      xp: 0,
      plantStage: "Seed",
      plantHealth: 100,
      plantStatus: "Healthy",
      lastMissCheckedDate: format(new Date(), "yyyy-MM-dd"),
      graceDays: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedHabits = [...habits, newHabit];
    const newStats = { ...extraStats, habitsCreatedCount: (extraStats.habitsCreatedCount || 0) + 1 };
    setExtraStats(newStats);
    setHabits(updatedHabits);
    persistData(updatedHabits, logs, newStats);
    setShowAddForm(false);
  };

  const deleteHabit = (id: string, isPermanentArchiveDelete = false) => {
    const habitToDel = habits.find((h) => h.id === id);
    if (!habitToDel) return;
    
    if (!isPermanentArchiveDelete) {
       setConfirmDialog({
         isOpen: true,
         title: 'Delete or Archive?',
         message: 'You can archive this plant to save it in your Garden History, or delete it entirely.',
         confirmText: 'Delete',
         secondaryActionText: 'Archive',
         variant: 'danger',
         onConfirm: () => {
            const updatedHabits = habits.filter((h) => h.id !== id);
            setHabits(updatedHabits);
            persistData(updatedHabits, logs);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
         },
         onSecondaryAction: () => {
            const updatedHabits = habits.map(h => h.id === id ? { 
               ...h, 
               isArchived: true, 
               archivedAt: new Date().toISOString(),
               archiveType: 'manual_archive' as const 
            } : h);
            setHabits(updatedHabits);
            persistData(updatedHabits, logs);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
         }
       });
       return;
    } else {
       setConfirmDialog({
         isOpen: true,
         title: 'Permanently Delete?',
         message: 'This will permanently delete this archived plant. This cannot be undone.',
         confirmText: 'Delete Forever',
         variant: 'danger',
         onConfirm: () => {
            const updatedHabits = habits.filter((h) => h.id !== id);
            setHabits(updatedHabits);
            persistData(updatedHabits, logs);
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
         }
       });
       return;
    }
  };

  const handleExportData = () => {
    const dataToExport = { habits, logs, extraStats };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garden-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Garden data exported successfully!");
  };

  const restoreArchivedHabit = (id: string, asNewSeed: boolean) => {
    const updatedHabits = [...habits];
    const index = updatedHabits.findIndex(h => h.id === id);
    if (index === -1) return;

    if (asNewSeed) {
       // Create a new habit with same params
       const target = updatedHabits[index];
       const newHabit: Habit = {
          ...target,
          id: uuidv4(),
          isArchived: false,
          archivedAt: undefined,
          archiveType: undefined,
          archiveNote: undefined,
          streak: 0,
          bestStreak: 0,
          totalCompletions: 0,
          plantStage: 'Seed',
          plantHealth: 100,
          xp: 0,
          lastMissCheckedDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
       };
       updatedHabits.push(newHabit);
       // Original stays archived, mark as restarted
       updatedHabits[index] = {
           ...updatedHabits[index],
           archiveType: 'restarted_as_new_seed',
           archiveNote: updatedHabits[index].archiveNote || "Saved as memory. Re-planted a fresh seed."
       };
    } else {
       // Continue existing
       updatedHabits[index] = {
          ...updatedHabits[index],
          isArchived: false,
          archivedAt: undefined,
          archiveType: undefined,
          archiveNote: undefined,
          lastMissCheckedDate: new Date().toISOString().split('T')[0] // reset miss checking
       };
    }
    
    setHabits(updatedHabits);
    persistData(updatedHabits, logs);
  };

  const updateArchiveNote = (id: string, note: string) => {
      const updatedHabits = habits.map(h => h.id === id ? { ...h, archiveNote: note } : h);
      setHabits(updatedHabits);
      persistData(updatedHabits, logs);
  };

  const updateHabitDifficulty = (id: string, difficulty: 'easy'|'medium'|'hard') => {
    if (confirm("Changing difficulty will affect future XP, coins, and plant growth only. Continue?")) {
      const updatedHabits = habits.map(h => h.id === id ? { ...h, difficulty } : h);
      setHabits(updatedHabits);
      persistData(updatedHabits, logs);
    }
  };

  const handleSlipHabit = (id: string, reason?: string) => {
    const currentSlips = extraStats.slipLogs?.[dateKey] || [];
    const isSlipped = currentSlips.some(s => s.id === id);

    if (isSlipped) return; // already slipped today

    const newSlips = [...currentSlips, { id, reason, time: new Date().toISOString() }];
    const newExtraStats = {
      ...extraStats,
      slipLogs: {
        ...(extraStats.slipLogs || {}),
        [dateKey]: newSlips
      }
    };
    
    // Optimistic Update locally
    setExtraStats(newExtraStats);

    const changedHabit = habits.find(h => h.id === id);
    if (!changedHabit) return;

    const ownedFreezes = newExtraStats.streakFreezes || 0;
    let usedFreeze = false;
    
    if (ownedFreezes > 0) {
      usedFreeze = true;
      newExtraStats.streakFreezes = ownedFreezes - 1;
      setExtraStats(newExtraStats);
    }

    const diff = changedHabit.difficulty || 'medium';
    const healthLoss = changedHabit.type === 'avoid' ? 20 : (diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25);
    let newHealth = (changedHabit.plantHealth ?? 100) - healthLoss;
    newHealth = Math.max(0, newHealth);

    const updatedHabits = habits.map(h => {
        if (h.id !== id) return h;
        return {
           ...h,
           streak: usedFreeze ? h.streak : 0,
           plantHealth: newHealth,
           plantStatus: getPlantStatus(newHealth)
        };
    });

    setHabits(updatedHabits);
    persistData(updatedHabits, logs, newExtraStats);
  };

  const undoSlipHabit = (id: string) => {
     const currentSlips = extraStats.slipLogs?.[dateKey] || [];
     const isSlipped = currentSlips.some(s => s.id === id);
     if (!isSlipped) return;

     const newSlips = currentSlips.filter(s => s.id !== id);
     const newExtraStats = {
       ...extraStats,
       slipLogs: {
         ...(extraStats.slipLogs || {}),
         [dateKey]: newSlips
       }
     };
     setExtraStats(newExtraStats);

     const changedHabit = habits.find(h => h.id === id);
     if (!changedHabit) return;

     const diff = changedHabit.difficulty || 'medium';
     const healthGain = changedHabit.type === 'avoid' ? 20 : (diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25);
     let newHealth = (changedHabit.plantHealth ?? 100) + healthGain;
     newHealth = Math.min(100, newHealth);

     const updatedHabits = habits.map(h => {
         if (h.id !== id) return h;
         return {
            ...h,
            plantHealth: newHealth,
            plantStatus: getPlantStatus(newHealth),
            // Note: we don't fully restore streak here to keep it simple
         };
     });

     setHabits(updatedHabits);
     persistData(updatedHabits, logs, newExtraStats);
  };

  const handleHarvestPlant = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.plantStage !== 'Fruiting Plant') return;

    const diff = habit.difficulty || 'medium';
    const xpReward = diff === 'easy' ? 30 : diff === 'medium' ? 50 : diff === 'hard' ? 80 : 120;
    const coinReward = diff === 'easy' ? 400 : diff === 'medium' ? 700 : diff === 'hard' ? 1000 : 1600;
    
    playHaptic('harvest');
    const newOrchard = [...(extraStats.orchard || [])];
    const fruitId = habit.plantType || 'Unknown';
    const existingIndex = newOrchard.findIndex(o => o.fruitId === fruitId && o.habitId === habit.id);
    const nowStr = new Date().toISOString();
    
    if (existingIndex >= 0) {
       newOrchard[existingIndex] = {
          ...newOrchard[existingIndex],
          count: newOrchard[existingIndex].count + 1,
          lastHarvest: nowStr
       };
    } else {
       newOrchard.push({
          fruitId,
          habitId: habit.id,
          count: 1,
          firstHarvest: nowStr,
          lastHarvest: nowStr
       });
    }

    const currentDailyCoins = extraStats.dailyCoinsEarned || 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const lastReset = extraStats.lastCoinResetDate || todayStr;
    
    let activeDailyCoins = currentDailyCoins;
    if (lastReset !== todayStr) {
       activeDailyCoins = 0;
    }
    
    let finalCoinReward = coinReward;
    if (activeDailyCoins + finalCoinReward > 25) {
       finalCoinReward = Math.max(0, 25 - activeDailyCoins);
    }
    
    const newExtraStats = {
       ...extraStats,
       xp: (extraStats.xp || 0) + xpReward,
       coins: (extraStats.coins || 0) + finalCoinReward,
       dailyCoinsEarned: activeDailyCoins + finalCoinReward,
       lastCoinResetDate: todayStr,
       orchard: newOrchard
    };
    
    const updatedHabits: Habit[] = habits.map(h => {
       if (h.id === habit.id) {
          return {
             ...h,
             plantStage: 'Seed' as const,
             xp: 0,
             plantHealth: 100,
             plantStatus: 'Normal' as const,
          };
       }
       return h;
    });

    setHabits(updatedHabits);
    setExtraStats(newExtraStats);
    persistData(updatedHabits, logs, newExtraStats);
    
    if (extraStats.hapticsEnabled !== false) {
       playHaptic('grow');
    }

    // Play sound based on fruit
    const specialFruits = ['Asian Palmyra Palm / Taal', 'Black Plum / Jam', 'Wood Apple / Bel', 'Star Fruit / Kamranga', 'Dragon Fruit / Dragon Fol'];
    import('./audio').then(({ playCompletionSound }) => {
       if (specialFruits.includes(habit.plantType || '')) {
           playCompletionSound('chime');
       } else {
           playCompletionSound('pop');
       }
    });

    setHarvestedData({ fruitId, fruitName: fruitId.split(' / ')[0], xpReward, coinReward, habitName: habit.name });
  };

  const toggleHabit = (id: string, isMini: boolean = false, customAmount?: number) => {
    const currentSlips = extraStats.slipLogs?.[dateKey] || [];
    if (currentSlips.some(s => s.id === id)) return; // Cannot complete if currently marked as slipped

    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    if (habit.scheduleType === 'quantity' && habit.quantityTarget) {
      if (isMini || customAmount !== undefined) {
        const currentQuantity = extraStats.quantityLogs?.[dateKey]?.[id] || 0;
        if (currentQuantity >= habit.quantityTarget) return; // already done

        const addAmount = customAmount !== undefined ? customAmount : 1;
        const newQuantity = currentQuantity + addAmount;
        const newQuantityLogs = {
          ...(extraStats.quantityLogs || {}),
          [dateKey]: {
            ...((extraStats.quantityLogs || {})[dateKey] || {}),
            [id]: newQuantity
          }
        };

      setExtraStats(prev => {
         const updated = { ...prev, quantityLogs: newQuantityLogs };
         persistData(habits, logs, updated);
         return updated;
      });

      if (newQuantity >= habit.quantityTarget) {
         // Auto-complete the habit!
         completeHabitFully(id);
      }
      }
      return;
    }

    completeHabitFully(id);
  };

  const completeHabitFully = (id: string) => {
    const currentCompleted = logs[dateKey] || [];
    const isCompleted = currentCompleted.includes(id);

    let newCompleted;
    if (isCompleted) {
      newCompleted = currentCompleted.filter((hId) => hId !== id);
    } else {
      newCompleted = [...currentCompleted, id];
      // Play completion sound if user preference is true or not explicitly disabled
      const soundTheme = extraStats.completionSound || 'droplet';
      playCompletionSound(soundTheme);
    }

    const newLogs = { ...logs, [dateKey]: newCompleted };

    // Optimistic Update locally
    setLogs(newLogs);
    updateStreak(id, !isCompleted, newLogs);
    
    if (!isCompleted) {
       showToast("Plant Watered!", {
          label: "Undo",
          onClick: () => completeHabitFully(id)
       });
    }
  };

  const getPlantStage = (xp: number, totalCompletions: number): Habit["plantStage"] => {
    // Legacy fallback
    if (xp === undefined) {
      if (totalCompletions >= 30) return "Fruiting Plant";
      if (totalCompletions >= 14) return "Mature Plant";
      if (totalCompletions >= 7) return "Young Plant";
      if (totalCompletions >= 3) return "Small Plant";
      if (totalCompletions >= 1) return "Sprout";
      return "Seed";
    }

    if (xp >= 400) return "Fruiting Plant";
    if (xp >= 250) return "Mature Plant";
    if (xp >= 120) return "Young Plant";
    if (xp >= 60) return "Small Plant";
    if (xp >= 20) return "Sprout";
    return "Seed";
  };

  const getPlantStatus = (health: number): Habit["plantStatus"] => {
    if (health <= 0) return "Dead";
    if (health < 20) return "Critical";
    if (health < 50) return "Wilting";
    if (health < 80) return "Normal";
    return "Healthy";
  };

  const handleBackdate = (habitId: string, targetDateKey: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const tMinus1 = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const tMinus2 = format(subDays(new Date(), 2), 'yyyy-MM-dd');
    const tMinus3 = format(subDays(new Date(), 3), 'yyyy-MM-dd');
    if (targetDateKey !== tMinus1 && targetDateKey !== tMinus2 && targetDateKey !== tMinus3) return;

    const logsCopy = { ...logs };
    const currentCompleted = logsCopy[targetDateKey] || [];
    if (currentCompleted.includes(habitId)) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const creationDate = format(new Date(habit.createdAt), 'yyyy-MM-dd');
    if (targetDateKey < creationDate) return;

    const weekStartFormat = format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd');
    let currentUsed = extraStats.backdatesUsedThisWeek || 0;
    if (extraStats.backdateWeekStart !== weekStartFormat) currentUsed = 0;
    if (currentUsed >= 3) return;

    let newExtraStats = { ...extraStats };

    if (targetDateKey === tMinus3) {
      // Consume streak repair item
      const itemKey = 'boost_streak_repair';
      const count = newExtraStats.boostItemCounts?.[itemKey] || 0;
      if (count <= 0) return; // Cannot repair 3 days ago without item
      newExtraStats.boostItemCounts = {
         ...newExtraStats.boostItemCounts,
         [itemKey]: count - 1
      };
    } else {
      const cost = 5;
      newExtraStats.coins = Math.max(0, (newExtraStats.coins || 0) - cost);
    }

    const newBackdateObj = { ...newExtraStats.backdatedLogs };
    newBackdateObj[targetDateKey] = [...(newBackdateObj[targetDateKey] || []), habitId];

    newExtraStats = {
      ...newExtraStats,
      backdatesUsedThisWeek: currentUsed + 1,
      backdateWeekStart: weekStartFormat,
      backdatedLogs: newBackdateObj
    };

    const newLogs = { ...logsCopy, [targetDateKey]: [...currentCompleted, habitId] };

    // Calculate partial XP and health for backdating
    const diff = habit.difficulty || 'medium';
    const rawXpGain = diff === 'easy' ? 8 : diff === 'medium' ? 12 : 18;
    const xpGain = Math.ceil(rawXpGain / 2);

    let healthGain = diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25;
    if (habit.type === 'avoid') {
      healthGain = (habit.plantHealth ?? 100) < 100 ? 20 : 10;
    }

    // Recompute streak locally
    let newStreak = 0;
    let checkDate = new Date();
    // Count days backward from today
    while (true) {
        const dStr = format(checkDate, 'yyyy-MM-dd');
        if (dStr < creationDate) break;
        
        const completed = newLogs[dStr]?.includes(habit.id);
        const protectedDay = isHabitPaused(habit.id, dStr, activeRestMode);
        
        if (completed) {
            newStreak++;
        } else if (!protectedDay && dStr !== todayStr) {
            // Missing a past day breaks the streak immediately
            break;
        }
        checkDate = subDays(checkDate, 1);
    }

    const updatedHabits = habits.map(h => {
        if (h.id !== habitId) return h;
        const newXp = (h.xp || 0) + xpGain;
        const newHealth = Math.min(100, (h.plantHealth ?? 100) + healthGain);
        
        return {
            ...h,
            xp: newXp,
            plantHealth: newHealth,
            plantStatus: getPlantStatus(newHealth),
            streak: newStreak,
            bestStreak: Math.max(h.bestStreak || 0, newStreak),
            totalCompletions: (h.totalCompletions || 0) + 1,
            plantStage: getPlantStage(newXp, (h.totalCompletions || 0) + 1)
        };
    });

    setLogs(newLogs);
    setHabits(updatedHabits);
    setExtraStats(newExtraStats);
    persistData(updatedHabits, newLogs, newExtraStats);
    
    const dayName = format(new Date(targetDateKey), 'EEEE');
    const oldStreak = habit.streak;
    showToast(`${dayName} repaired 🌱${newStreak > oldStreak ? ` Streak restored: ${newStreak} days` : ''}`);
  };

  const updateStreak = (
    id: string,
    isNowCompleted: boolean,
    currentLogs: HabitLog,
  ) => {
    let extraXpGained = 0;
    let extraPerfectDays = 0;
    let extraPlantsRevived = 0;
    let isPerfectDayNow = false;
    let didStageGrow = false;
    let isProtectAction = false;
    let playThirtyDaySound = false;
    let playGoldenAnimation = false;

    const updatedHabits = habits.map((h) => {
      if (h.id !== id) return h;

      if (h.type === 'avoid') {
         isProtectAction = true;
      }

      let newTotalCompletions =
        (h.totalCompletions || 0) + (isNowCompleted ? 1 : -1);
      newTotalCompletions = Math.max(0, newTotalCompletions);

      const diff = h.difficulty || 'medium';
      const xpGain = diff === 'easy' ? 8 : diff === 'medium' ? 12 : 18;
      
      let isRevivedNow = false;
      let newRevivalCount = h.revivalCount || 0;
      
      // Calculate extra XP for recovery/streaks
      if (isNowCompleted) {
        if (h.plantStatus === 'Wilting') {
          extraXpGained += 10;
          isRevivedNow = true;
          newRevivalCount += 1;
        } else if (h.plantStatus === 'Critical') {
          extraXpGained += 20;
          extraPlantsRevived += 1;
          isRevivedNow = true;
          newRevivalCount += 1;
        } else if (h.plantStatus === 'Dead') {
          extraXpGained += 100;
          extraPlantsRevived += 1;
          isRevivedNow = true;
          newRevivalCount += 1;
        }

        const tempNewStreak = h.streak + 1;
        if (tempNewStreak === 3) extraXpGained += 10;
        if (tempNewStreak === 7) extraXpGained += 25;
        if (tempNewStreak === 14) extraXpGained += 50;
        if (tempNewStreak === 30) extraXpGained += 100;
        

        // Stage check
        const oldStage = h.plantStage || 'Seed';
        const newTempXp = (h.xp || 0) + xpGain;
        const newStage = getPlantStage(newTempXp, newTotalCompletions);
        if (oldStage !== newStage) {
           didStageGrow = true;
        }
        if (oldStage !== 'Fruiting Plant' && newStage === 'Fruiting Plant') {
          extraXpGained += 75;
        }
      } else {
        // Rollbacks (naive - we don't rollback perfect days or stage bonuses to keep it simple, but we subtract basic XP)
      }

      let newXp = (h.xp || 0) + (isNowCompleted ? xpGain : -xpGain);
      newXp = Math.max(0, newXp);

      let newStreak = h.streak;
      const isFlexible = h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly';
      
      if (isFlexible) {
         const target = h.scheduleType === 'weekly' ? 1 : (h.targetCount || 1);
         const completedThisWeek = getCompletedCountThisWeek(h, currentLogs);
         if (isNowCompleted) {
             if (completedThisWeek === target) {
                 newStreak += 1;
             }
         } else {
             if (completedThisWeek === target - 1) {
                 newStreak = Math.max(0, newStreak - 1);
             }
         }
      } else {
         newStreak = isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
      }
      const newBestStreak = Math.max(h.bestStreak || 0, newStreak);

      let healthGain = diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25;
      if (h.type === 'avoid') {
        healthGain = (h.plantHealth ?? 100) < 100 ? 20 : 10; // +20 if recovering, else +10
      }
      let newHealth = (h.plantHealth ?? 100) + (isNowCompleted ? healthGain : -healthGain);
      newHealth = Math.max(0, Math.min(100, newHealth));

      let newGraceDays = h.graceDays || 0;
      if (isNowCompleted && newStreak === 7) newGraceDays++;
      if (isNowCompleted && newStreak === 30) {
         newGraceDays += 2;
         playThirtyDaySound = true;
      }
      newGraceDays = Math.min(newGraceDays, 5);

      let becomesGolden = false;
      if (isNowCompleted && newStreak === 100 && !h.isGolden) {
          becomesGolden = true;
          newXp += 500;
          playGoldenAnimation = true;
      }

      return {
        ...h,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalCompletions: newTotalCompletions,
        xp: newXp,
        plantStage: getPlantStage(newXp, newTotalCompletions),
        plantHealth: newHealth,
        plantStatus: getPlantStatus(newHealth),
        graceDays: newGraceDays,
        isRevived: h.isRevived || isRevivedNow,
        revivalCount: newRevivalCount,
        isGolden: h.isGolden || becomesGolden,
      };
    });

    // Check perfect day (all due habits completed)
    if (isNowCompleted && habits.length > 0) {
      const completionList = currentLogs[dateKey] || [];
      const scheduledToday = habits.filter(h => {
         if (h.isArchived) return false;
         if (h.type === 'avoid') return false;
         const isPaused = isHabitPaused(h.id, dateKey, activeRestMode || null);
         if (isPaused) return false;

         let isDue = isHabitDueOnDate(h, dateKey);
         const isFlexible = h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly';
         if (isFlexible) isDue = false;

         return isDue;
      });
      // if all scheduled are completed
      if (scheduledToday.length > 0 && scheduledToday.every(h => completionList.includes(h.id))) {
        extraXpGained += 50;
        extraPerfectDays += 1;
        isPerfectDayNow = true;
      }
    }

    setHabits(updatedHabits);
    
    // Process extra stats
    let newExtraStats = extraStats;
    let baseCoinsDelta = 0;
    let bonusCoinsDelta = 0;
    
    let incEvening = 0;
    let incNight = 0;
    let incRainy = 0;
    let incResist = 0;
    
    if (isNowCompleted) {
      const h = habits.find(h => h.id === id);
      if (h) {
        const diff = h.difficulty || 'medium';
        const baseAward = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 40;
        
        let streakMultiplier = 1.0;
        const currentStreak = h.streak || 0;
        const updatedH = updatedHabits.find(uh => uh.id === id);
        const finalStreak = updatedH?.streak || 0;

        let extraMilestoneCoins = 0;
        let triggeredGrowthPopup = false;

        if (finalStreak === 7 || finalStreak === 14 || finalStreak === 30) {
           triggeredGrowthPopup = true;
           let mult = 1.0;
           let coinsBonus = 0;
           if (finalStreak === 7) {
              mult = 2.0;
              coinsBonus = 75;
           } else if (finalStreak === 14) {
              mult = 3.0;
              coinsBonus = 150;
           } else if (finalStreak === 30) {
              mult = 5.0;
              coinsBonus = 300;
           }
           extraMilestoneCoins = coinsBonus;
           
           // Trigger sound + haptics
           playMilestoneSound();
           import('./haptics').then(({ playHaptic }) => playHaptic('unlock'));
           
           setGrowthMultiplierPopup({
              streak: finalStreak,
              multiplier: mult,
              extraCoins: coinsBonus,
              habitName: h.name
           });
        }

        if (currentStreak >= 30) {
           streakMultiplier = 5.0;
           if (!triggeredGrowthPopup) {
              setMassiveCoinPopup(Math.floor(baseAward * streakMultiplier));
           }
        }
        else if (currentStreak >= 21) streakMultiplier = 3.0;
        else if (currentStreak >= 14) streakMultiplier = 2.0;
        else if (currentStreak >= 5) streakMultiplier = 1.2;
        
        baseCoinsDelta += Math.floor(baseAward * streakMultiplier);
        bonusCoinsDelta += extraMilestoneCoins;
        if (h.type === 'avoid') incResist++;
        
        if (h.plantStatus === 'Wilting' || h.plantStatus === 'Critical' || h.plantStatus === 'Dead') {
           bonusCoinsDelta += 20;
        }
      }
      if (isPerfectDayNow) {
        bonusCoinsDelta += 40;
        if (activeEvent && activeEvent.id === 'monsoon_festival') incRainy++;
      }
      
      const hr = new Date().getHours();
      if (hr >= 19 && hr < 22) incEvening++;
      if (hr >= 22 || hr < 5) incNight++;
      
    } else {
      const h = habits.find(h => h.id === id);
      if (h) {
        const diff = h.difficulty || 'medium';
        const baseAward = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 40;
        
        let streakMultiplier = 1.0;
        const currentStreak = h.streak || 0;
        if (currentStreak >= 30) streakMultiplier = 5.0;
        else if (currentStreak >= 21) streakMultiplier = 3.0;
        else if (currentStreak >= 14) streakMultiplier = 2.0;
        else if (currentStreak >= 5) streakMultiplier = 1.2;
        
        baseCoinsDelta -= Math.floor(baseAward * streakMultiplier);

        if (h.plantStatus === 'Wilting' || h.plantStatus === 'Critical' || h.plantStatus === 'Dead') {
           bonusCoinsDelta -= 20;
        }
      }
    }
    
    // Process Active Event Quests
    let updatedEventProgress = eventProgress;
    const eventCompletedJustNow = false;
    const eventCoinsGained = 0;
    const eventXpGained = 0;
    const eventBadgeGained: string | null = null;
    const eventDecorationGained: string | null = null;

    if (activeEvent && isNowCompleted && updatedEventProgress && !updatedEventProgress.isCompleted) {
       const habitObj = habits.find(h => h.id === id);
       let madeProgress = false;
       const nextQuestProgress = { ...updatedEventProgress.questProgress };
       
       activeEvent.quests.forEach((q, i) => {
          const currentAmount = nextQuestProgress[q.id] || 0;
          if (currentAmount < q.requiredCount) {
             let hit = false;
             if (q.type === 'water_plants') { hit = true; }
             if (q.type === 'complete_habit') {
                hit = true;
                if (q.targetCategory && habitObj?.category !== q.targetCategory) hit = false;
                if (q.targetDifficulty && habitObj?.difficulty !== q.targetDifficulty) hit = false;
             }
             if (q.type === 'perfect_day' && isPerfectDayNow) { hit = true; }
             if (q.type === 'save_wilting' && extraPlantsRevived > 0) { hit = true; }
             
             if (hit) {
                nextQuestProgress[q.id] = currentAmount + 1;
                madeProgress = true;
             }
          }
       });

       if (madeProgress) {
          const completedCount = activeEvent.quests.filter(q => (nextQuestProgress[q.id] || 0) >= q.requiredCount).length;
          const nowCompleted = completedCount >= activeEvent.quests.length;
          
          updatedEventProgress = {
             ...updatedEventProgress,
             questProgress: nextQuestProgress,
          };
       }
    }

    const updatedChallenge = extraStats.activeChallenge ? { ...extraStats.activeChallenge } : null;
    let challengeDailyBonus = 0;

    if (updatedChallenge && isNowCompleted && updatedChallenge.status === 'active') {
       const habitObj = habits.find(h => h.id === id);
       let matches = false;
       if (updatedChallenge.linkedHabitId && updatedChallenge.linkedHabitId === id) {
          matches = true;
       } else if (!updatedChallenge.linkedHabitId) {
          if (updatedChallenge.linkedCategory === 'all') matches = true;
          else if (updatedChallenge.linkedCategory === 'recovery' && extraPlantsRevived > 0) matches = true;
          else if (habitObj?.category === updatedChallenge.linkedCategory) matches = true;
       }
       
       if (matches && !updatedChallenge.completedDates.includes(dateKey)) {
          updatedChallenge.completedDates = [...updatedChallenge.completedDates, dateKey];
          challengeDailyBonus = 1; // daily challenge XP bonus
          bonusCoinsDelta += 20;   // daily challenge Coin bonus
       }
    }

    let finalCoinsDelta = 0;
    
    // 1. Process daily reset & Famine recovery first
    const resetUpdates = processDailyEconomyReset(newExtraStats);
    if (resetUpdates) {
       newExtraStats = { ...newExtraStats, ...resetUpdates };
    }
    
    // 2. Fetch the dynamic daily cap
    const dynamicCap = calculateDailyCoinCap(habits, extraStats.level || 1);
    
    let currentDailyCoins = newExtraStats.dailyCoinsEarned || 0;
    
    if (baseCoinsDelta > 0) {
       // Only apply hard cap bounds from our economy engine for requested earnings
       const allowedBase = calculateSecureCoinReward(baseCoinsDelta, newExtraStats, dynamicCap);
       currentDailyCoins += allowedBase;
       finalCoinsDelta = allowedBase + bonusCoinsDelta;
    } else if (baseCoinsDelta < 0) {
       currentDailyCoins = Math.max(0, currentDailyCoins + baseCoinsDelta);
       finalCoinsDelta = baseCoinsDelta + bonusCoinsDelta;
    } else {
       finalCoinsDelta = bonusCoinsDelta;
    }
    
    const earnedCoins = finalCoinsDelta;

    if (extraXpGained > 0 || extraPerfectDays > 0 || extraPlantsRevived > 0 || updatedEventProgress !== eventProgress || updatedChallenge !== extraStats.activeChallenge || challengeDailyBonus > 0 || earnedCoins !== 0 || incEvening > 0 || incNight > 0 || incRainy > 0 || incResist > 0 || isNowCompleted !== undefined) {
       newExtraStats = {
          ...newExtraStats,
          totalHabitsCompleted: Math.max(0, (newExtraStats.totalHabitsCompleted || 0) + (isNowCompleted ? 1 : -1)),
          xp: (newExtraStats.xp || 0) + extraXpGained + challengeDailyBonus,
          perfectGardenDays: (newExtraStats.perfectGardenDays || 0) + extraPerfectDays,
          plantsRevived: (newExtraStats.plantsRevived || 0) + extraPlantsRevived,
          eventProgress: updatedEventProgress,
          activeChallenge: updatedChallenge,
          coins: Math.max(0, (newExtraStats.coins || 0) + finalCoinsDelta),
          dailyCoinsEarned: currentDailyCoins,
          lastCoinResetDate: newExtraStats.lastCoinResetDate || dateKey,
          eveningCompletions: Math.max(0, (newExtraStats.eveningCompletions || 0) + incEvening),
          nightCompletions: Math.max(0, (newExtraStats.nightCompletions || 0) + incNight),
          rainySeasonCompletions: Math.max(0, (newExtraStats.rainySeasonCompletions || 0) + incRainy),
          badHabitResists: Math.max(0, (newExtraStats.badHabitResists || 0) + incResist),
          
          plantsFruitedCount: updatedHabits.filter(h => h.plantStage === 'Fruiting Plant').length,
          hardHabitsCompletedCount: Math.max(0, (newExtraStats.hardHabitsCompletedCount || 0) + (isNowCompleted && habits.find(h => h.id === id)?.difficulty === 'hard' ? 1 : (habits.find(h => h.id === id)?.difficulty === 'hard' ? -1 : 0))),
       };
    }
    
    // Check Companions
    const existingCompIds = (newExtraStats.companions || []).map(c => c.id);
    const newComps: {id: string, unlockedAt: string}[] = [];
    
    if (!existingCompIds.includes('projapoti') && updatedHabits.some(h => Math.max(h.bestStreak||0, h.streak) >= 7)) newComps.push({id: 'projapoti', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('moumachhi') && ((stats.totalHabitsCompleted || 0) + (isNowCompleted?1:0)) >= 25) newComps.push({id: 'moumachhi', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('ladybug') && updatedHabits.some(h => h.plantStage === 'Fruiting Plant')) newComps.push({id: 'ladybug', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('chorui') && stats.level >= 10) newComps.push({id: 'chorui', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('tuntuni') && (newExtraStats.perfectGardenDays || 0) >= 15) newComps.push({id: 'tuntuni', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('phoring') && newExtraStats.challengeHistory?.some(c => c.status === 'completed')) newComps.push({id: 'phoring', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('doel') && updatedHabits.some(h => Math.max(h.bestStreak||0, h.streak) >= 30)) newComps.push({id: 'doel', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('jonaki') && (newExtraStats.eveningCompletions || 0) >= 10) newComps.push({id: 'jonaki', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('bang') && (newExtraStats.rainySeasonCompletions || 0) >= 5) newComps.push({id: 'bang', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('shalik') && (newExtraStats.badHabitResists || 0) >= 25) newComps.push({id: 'shalik', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('machranga') && updatedHabits.filter(h => Math.max(h.bestStreak||0, h.streak) >= 30).length >= 3) newComps.push({id: 'machranga', unlockedAt: new Date().toISOString()});
    if (!existingCompIds.includes('pecha') && (newExtraStats.nightCompletions || 0) >= 15) newComps.push({id: 'pecha', unlockedAt: new Date().toISOString()});
    
    if (newComps.length > 0) {
       newExtraStats = { ...newExtraStats, companions: [...(newExtraStats.companions || []), ...newComps] };
       
       // Note: We need a state variable to show unlock modal
       setRecentlyUnlockedCompanions(prev => [...prev, ...newComps.map(c => c.id)]);
    }

    // Weekly Consistency Check
    if (isNowCompleted) {
       const today = new Date();
       const currentWeekStart = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
       if (newExtraStats.lastWeeklyCelebrationWeek !== currentWeekStart) {
          const metConsistency = checkWeeklyConsistencyThreeWeeks(updatedHabits, currentLogs, today);
          if (metConsistency) {
             newExtraStats = {
                ...newExtraStats,
                lastWeeklyCelebrationWeek: currentWeekStart,
                coins: (newExtraStats.coins || 0) + 500, // reward 500 coins for 3-weeks consistency!
                xp: (newExtraStats.xp || 0) + 200,      // reward 200 XP!
             };
             
             // Prepare growth summary
             const activeCount = updatedHabits.filter(h => !h.isArchived).length;
             const matureCount = updatedHabits.filter(h => !h.isArchived && (h.plantStage === 'Mature Plant' || h.plantStage === 'Fruiting Plant')).length;
             const totalCompletedCount = (newExtraStats.totalHabitsCompleted || 0);
             const currentLvl = newExtraStats.level || stats.level || 1;
             
             // Trigger modal
             setWeeklyCelebrationData({
                activePlants: activeCount,
                maturePlants: matureCount,
                totalHabitsCompleted: totalCompletedCount,
                currentLevel: currentLvl,
                coinReward: 500,
                xpReward: 200,
             });
          }
       }
    }

    if (newExtraStats !== extraStats) {
       setExtraStats(newExtraStats);
    }
    
    // Play haptics
    // Priority: All done > Grow > Protect > Water
    if (isNowCompleted && extraStats.hapticsEnabled !== false) {
       if (isPerfectDayNow) {
          playHaptic('allDone');
       } else if (didStageGrow) {
          playHaptic('grow');
          confetti({
             particleCount: 50,
             spread: 60,
             origin: { y: 0.8 },
             colors: ['#00F5D4', '#E3A47D', '#8FCFAD']
          });
       } else if (isProtectAction) {
          playHaptic('protect');
       } else {
          playHaptic('water');
       }
    }
    
    if (playThirtyDaySound) {
       import('./audio').then(({ playCompletionSound }) => {
          playCompletionSound('chime');
       });
    }

    if (playGoldenAnimation) {
       showToast("✨ 100 Day Streak! Your plant mutated into a Golden variant! ✨");
       confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FFFF00']
       });
       import('./audio').then(({ playCompletionSound }) => {
          playCompletionSound('chime');
       });
    }

    persistData(updatedHabits, currentLogs, newExtraStats);
  };

  // Handle Claiming Event Rewards
  const claimEventReward = () => {
    if (!activeEvent || !eventProgress) return;
    const completedTasks = Object.values(eventProgress.questProgress).filter((count, index) => 
      count >= activeEvent.quests[index].requiredCount
    ).length;
    
    if (completedTasks >= activeEvent.quests.length && !eventProgress.rewardClaimed) {
      const newBadges = [...(extraStats.badges || [])];
      if (activeEvent.rewardBadgeId && !newBadges.includes(activeEvent.rewardBadgeId)) {
        newBadges.push(activeEvent.rewardBadgeId);
      }
      
      const newDecorations = [...(extraStats.decorations || [])];
      if (activeEvent.rewardDecorationId && !newDecorations.includes(activeEvent.rewardDecorationId)) {
        newDecorations.push(activeEvent.rewardDecorationId);
      }

      const newEventProgress = {
        ...eventProgress,
        isCompleted: true,
        rewardClaimed: true,
        completedAt: new Date().toISOString()
      };

      const newExtraStats = {
        ...extraStats,
        xp: (extraStats.xp || 0) + activeEvent.rewardXP,
        coins: (extraStats.coins || 0) + activeEvent.rewardCoins,
        badges: newBadges,
        decorations: newDecorations,
        eventProgress: newEventProgress
      };

      setExtraStats(newExtraStats);
      persistData(habits, logs, newExtraStats);
      setShowEventModal(false);
    }
  };

  const handleJoinChallenge = (templateId: string, habitId?: string) => {
    const template = getChallengeTemplate(templateId);
    if (!template) return;
    const newChallenge = {
      id: Date.now().toString(),
      templateId,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(Date.now() + template.durationDays * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      linkedCategory: template.category,
      linkedHabitId: habitId,
      completedDates: [],
      status: 'active' as const
    };
    const newExtraStats = {
      ...extraStats,
      activeChallenge: newChallenge
    };
    setExtraStats(newExtraStats);
    persistData(habits, logs, newExtraStats);
  };

  const handleQuitChallenge = (challengeId: string) => {
    if (extraStats.activeChallenge?.id !== challengeId) return;
    const newExtraStats = {
      ...extraStats,
      activeChallenge: null,
      challengeHistory: [
         ...(extraStats.challengeHistory || []), 
         { ...extraStats.activeChallenge, status: 'failed' as const }
      ]
    };
    setExtraStats(newExtraStats);
    persistData(habits, logs, newExtraStats);
  };

  const handleClaimChallengeReward = (challengeId: string) => {
    if (extraStats.activeChallenge?.id !== challengeId) return;
    const template = getChallengeTemplate(extraStats.activeChallenge!.templateId);
    if (!template) return;
    const newBadges = [...(extraStats.badges || [])];
    if (template.rewardBadgeId && !newBadges.includes(template.rewardBadgeId)) {
        newBadges.push(template.rewardBadgeId);
    }
    const completedChal = { ...extraStats.activeChallenge!, status: 'completed' as const };
    const newExtraStats = {
        ...extraStats,
        xp: (extraStats.xp || 0) + template.rewardXP,
        coins: (extraStats.coins || 0) + template.rewardCoins,
        badges: newBadges,
        activeChallenge: null,
        challengesCompletedCount: (extraStats.challengesCompletedCount || 0) + 1,
        challengeHistory: [
            ...(extraStats.challengeHistory || []), 
            completedChal
        ]
    };
    setExtraStats(newExtraStats);
    persistData(habits, logs, newExtraStats);
  };

  const handleBuyItem = (item: ShopItem) => {
    const errorMsg = validatePurchase(extraStats, item);
    if (errorMsg) {
       alert(errorMsg);
       return;
    }

    const currentCoins = extraStats.coins || 0;
    const now = new Date();
    
    const newExtraStats = { 
       ...extraStats, 
       coins: currentCoins - item.price,
       shopPurchasesCount: (extraStats.shopPurchasesCount || 0) + 1
    };
    
    if (item.isConsumable) {
       if (item.id === 'item_streak_freeze') {
           newExtraStats.streakFreezes = (newExtraStats.streakFreezes || 0) + 1;
       } else {
           newExtraStats.boostItemCounts = {
              ...(newExtraStats.boostItemCounts || {}),
              [item.id]: (newExtraStats.boostItemCounts?.[item.id] || 0) + 1
           };
       }
       if (item.cooldownHours) {
          newExtraStats.lastPurchaseDates = {
             ...(newExtraStats.lastPurchaseDates || {}),
             [item.id]: now.toISOString()
          };
       }
    } else {
       newExtraStats.ownedItemIds = [...(newExtraStats.ownedItemIds || []), item.id];
    }
    
    setExtraStats(newExtraStats);
    persistData(habits, logs, newExtraStats);
  };

  const handleEquipItem = (item: ShopItem) => {
    const newExtraStats = { ...extraStats };
    if (item.id === 'reset') {
       newExtraStats.equippedBackgroundId = undefined;
       newExtraStats.equippedPotId = undefined;
       newExtraStats.equippedFenceId = undefined;
       newExtraStats.equippedSeasonalDecorId = undefined;
       newExtraStats.equippedLeftDecorId = undefined;
       newExtraStats.equippedRightDecorId = undefined;
    } else if (item.type === 'background') {
       newExtraStats.equippedBackgroundId = item.id;
    } else if (item.type === 'pot') {
       newExtraStats.equippedPotId = item.id;
    } else if (item.type === 'fence') {
       newExtraStats.equippedFenceId = item.id;
    } else if (item.type === 'seasonal') {
       newExtraStats.equippedSeasonalDecorId = item.id;
    } else if (item.type === 'decoration') {
       if (!newExtraStats.equippedLeftDecorId) {
          newExtraStats.equippedLeftDecorId = item.id;
       } else if (!newExtraStats.equippedRightDecorId && newExtraStats.equippedLeftDecorId !== item.id) {
          newExtraStats.equippedRightDecorId = item.id;
       } else {
          newExtraStats.equippedLeftDecorId = item.id;
       }
    }
    setExtraStats(newExtraStats);
    persistData(habits, logs, newExtraStats);
  };

  const { activeHabitsList, dueHabitsList, isPerfectDayNowTopLevel } = React.useMemo(() => {
    const active = habits.filter(h => !h.isArchived);
    const due = active.filter(h => {
       if (h.scheduleType === 'times_per_week' || h.scheduleType === 'anytime' || h.scheduleType === 'weekly') {
          const completedCount = getCompletedCountThisWeek(h, logs);
          const target = h.targetCount || 1;
          if (completedCount >= target && !logs[dateKey]?.includes(h.id)) {
             return false;
          } 
          return false;
       }
       return isHabitDueOnDate(h, dateKey);
    });
    const perfect = due.length > 0 && due.every((h) => (logs[dateKey] || []).includes(h.id));
    return { activeHabitsList: active, dueHabitsList: due, isPerfectDayNowTopLevel: perfect };
  }, [habits, logs, dateKey]);

  // Stable handlers for performance
  const handlersRef = React.useRef({
     toggleHabit,
     handleSlipHabit,
     undoSlipHabit,
     deleteHabit,
     handleHarvestPlant,
     handleBackdate
  });
  
  React.useEffect(() => {
    handlersRef.current = {
      toggleHabit,
      handleSlipHabit,
      undoSlipHabit,
      deleteHabit,
      handleHarvestPlant,
      handleBackdate
    };
  });

  const stableToggleHabit = React.useCallback((id: string, isM?: boolean, amt?: number) => handlersRef.current.toggleHabit(id, isM, amt), []);
  const stableHandleSlipHabit = React.useCallback((id: string, r?: string) => handlersRef.current.handleSlipHabit(id, r), []);
  const stableUndoSlipHabit = React.useCallback((id: string) => handlersRef.current.undoSlipHabit(id), []);
  const stableDeleteHabit = React.useCallback((id: string) => handlersRef.current.deleteHabit(id), []);
  const stableHarvestPlant = React.useCallback((id: string) => handlersRef.current.handleHarvestPlant(id), []);
  const stableBackdate = React.useCallback((id: string, d: string) => handlersRef.current.handleBackdate(id, d), []);

  const almanacEligibility = React.useMemo(() => {
    const year = getAlmanacYear(date);
    if (!year) return false;
    if (extraStats.almanacs?.[year]) return true;
    let count = 0;
    for (const key in logs) {
       if (key.startsWith(year)) count++;
       if (count >= 10) return true;
    }
    return false;
  }, [logs, date, extraStats.almanacs]);

  const sortedActiveHabits = React.useMemo(() => {
    return [...activeHabitsList].sort((a, b) => {
       if (sortType === 'recovery') {
          const aRecovery = (a.plantHealth !== undefined && a.plantHealth < 50);
          const bRecovery = (b.plantHealth !== undefined && b.plantHealth < 50);
          if (aRecovery && !bRecovery) return -1;
          if (!aRecovery && bRecovery) return 1;
          return (a.plantHealth ?? 100) - (b.plantHealth ?? 100);
       }
       if (sortType === 'health') {
          return (a.plantHealth ?? 100) - (b.plantHealth ?? 100);
       }
       if (sortType === 'alpha') {
          return a.name.localeCompare(b.name);
       }
       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [activeHabitsList, sortType]);

  const filteredTrackerHabits = React.useMemo(() => {
    return categoryFilter === 'all' ? habits : habits.filter((h) => h.category === categoryFilter);
  }, [categoryFilter, habits]);

  // -- Render Logic --

  if (showSplash) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 bg-[#FDFBF7]"
      >
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
          <img 
            src="/logo.svg" 
            alt="Your Garden Logo" 
            className="w-full h-full object-contain drop-shadow-md"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
        <h1 
          className="font-display font-extrabold tracking-tight text-3xl"
          style={{ color: '#1C1B1F' }}
        >
          Your Garden
        </h1>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="app-background-reset flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent-mustard animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Show onboarding if they have no habits and haven't dismissed it
  if (!dataLoading && habits.length === 0 && !localStorage.getItem('t2sar_onboarding_done')) {
    return (
      <OnboardingWizard onComplete={(name, category, plantType) => {
        const newHabit: Habit = {
          id: uuidv4(),
          name,
          category,
          plantType,
          type: "build",
          streak: 0,
          bestStreak: 0,
          totalCompletions: 0,
          xp: 0,
          plantStage: "Seed",
          plantHealth: 100,
          plantStatus: "Healthy",
          lastMissCheckedDate: format(new Date(), "yyyy-MM-dd"),
          graceDays: 0,
          createdAt: new Date().toISOString(),
          color: "emerald",
          icon: "Sprout",
        };
        const updatedHabits = [newHabit];
        const newStats = { ...extraStats, habitsCreatedCount: (extraStats.habitsCreatedCount || 0) + 1 };
        setExtraStats(newStats);
        setHabits(updatedHabits);
        persistData(updatedHabits, logs, newStats);
        localStorage.setItem('t2sar_onboarding_done', 'true');
      }} />
    );
  }

  return (
    <div className="app-background-reset pb-24 md:pb-0 md:pl-28 transition-all relative">
      {/* Sync Status Indicator (Absolute Top Right) */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        {!isOnline ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-pulse">
            <WifiOff className="w-3 h-3" />
            Offline
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-1000 opacity-50 hover:opacity-100">
            <Cloud className="w-3 h-3" />
            Synced
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-primary-anchor text-surface-soft shadow-xl rounded-full z-50 flex justify-between items-center px-6 text-xs font-medium overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab(Tab.TRACKER)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.TRACKER ? "text-primary-mint scale-110 drop-shadow-md" : "text-surface-soft/60 hover:text-surface-soft"}`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.PROGRESS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.PROGRESS ? "text-primary-mint scale-110 drop-shadow-md" : "text-surface-soft/60 hover:text-surface-soft"}`}
        >
          <BarChart2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.SHOP)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SHOP ? "text-primary-mint scale-110 drop-shadow-md" : "text-surface-soft/60 hover:text-surface-soft"}`}
        >
          <Store className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.STATS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.STATS ? "text-primary-mint scale-110 drop-shadow-md" : "text-surface-soft/60 hover:text-surface-soft"}`}
        >
          <Activity className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.SETTINGS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SETTINGS ? "text-primary-mint scale-110 drop-shadow-md" : "text-surface-soft/60 hover:text-surface-soft"}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-28 bg-[#6d5e8f] text-surface-soft shadow-xl border-r border-surface-alt/10 flex-col items-center py-12 z-50 rounded-r-[32px]">
        <div className="flex flex-col gap-10 w-full px-6 md:px-8 overflow-y-auto hidden-scrollbar">
          {[
            { id: Tab.TRACKER, icon: LayoutDashboard },
            { id: Tab.PROGRESS, icon: BarChart2 },
            { id: Tab.SHOP, icon: Store },
            { id: Tab.STATS, icon: Activity },
            { id: Tab.SETTINGS, icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${activeTab === item.id ? "bg-surface-soft/10 text-primary-mint shadow-sm scale-110" : "text-surface-soft/60 hover:text-surface-soft hover:bg-surface-soft/5"}`}
            >
              <item.icon className={`w-6 h-6 ${item.id === Tab.SHOP ? 'bg-[#987878] p-1 rounded-md' : ''}`} />
            </button>
          ))}
        </div>

        {deferredPrompt && (
          <div className="mt-auto mb-4 w-full px-6 md:px-8">
            <button
              onClick={handleInstallClick}
              className="w-full aspect-square flex flex-col items-center justify-center gap-1 text-surface-soft/60 hover:text-primary-mint transition-colors rounded-2xl hover:bg-surface-soft/10"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 sm:px-8 sm:py-10 md:p-12 lg:p-16 min-h-screen bg-[#16aa92]">
        {/* Garden Companions Ambient Layer */}
        <React.Suspense fallback={null}>
          {activeTab === Tab.TRACKER && <GardenCompanions stats={extraStats} />}
        </React.Suspense>

        {/* Companion Unlock Overlay */}
        <React.Suspense fallback={null}>
          {recentlyUnlockedCompanions.length > 0 && (
             <CompanionUnlockModal 
                companionIds={recentlyUnlockedCompanions}
                onClose={() => setRecentlyUnlockedCompanions([])}
             />
          )}
        </React.Suspense>

        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight font-display text-primary-text">
                {activeTab === Tab.TRACKER &&
                  `HELLO, ${user.displayName?.split(" ")[0] || "USER"}`}
                {activeTab === Tab.PROGRESS && "Your Garden"}
                {activeTab === Tab.SHOP && "Garden Shop"}
                {activeTab === Tab.STATS && (
                  statsSubTab === 'overview' ? "Garden Stats Overview" :
                  statsSubTab === 'reports' ? "Garden Reports" :
                  statsSubTab === 'challenges' ? "Garden Challenges" :
                  statsSubTab === 'badges' ? "Garden Badges" :
                  statsSubTab === 'profile' ? "Gardener Profile" :
                  "Garden History"
                )}
                {activeTab === Tab.SETTINGS && "Settings"}
              </h1>
              {activeTab === Tab.TRACKER && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-mint/20 border border-primary-mint text-status-healthy text-[10px] font-bold tracking-wide uppercase">
                  <Trophy className="w-3 h-3" />
                  LVL {stats.level}
                </div>
              )}
            </div>

            {/* XP Bar */}
            {activeTab === Tab.TRACKER && (
              <div className="mt-6 max-w-sm">
                <div className="flex justify-between text-[11px] text-secondary-text mb-2 font-bold uppercase tracking-wide">
                  <span>{stats.rank} · LVL {stats.level}</span>
                  <span className="text-status-healthy">
                    XP · {stats.xp} / {LEVEL_THRESHOLDS[stats.level + 1] || "Max"}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-card rounded-progress overflow-hidden border border-surface-alt p-0.5">
                  <div
                    className="h-full bg-status-healthy rounded-progress transition-all duration-1000 shadow-sm"
                    style={{ 
                      width: LEVEL_THRESHOLDS[stats.level + 1] 
                        ? `${((stats.xp - LEVEL_THRESHOLDS[stats.level]) / (LEVEL_THRESHOLDS[stats.level + 1] - LEVEL_THRESHOLDS[stats.level])) * 100}%` 
                        : '100%' 
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {activeTab === Tab.TRACKER && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary-mint hover:bg-[#a5d8bd] text-primary-text rounded-button p-4 md:px-8 md:py-4 flex items-center gap-2 shadow-sm font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                <span className="hidden md:inline">Plant Seed</span>
              </button>
            )}
          </div>
        </header>

        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <React.Suspense fallback={
            <div className="flex-1 flex flex-col gap-6 w-full animate-pulse opacity-60">
              <div className="h-12 bg-surface-alt/40 rounded-xl w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1,2,3].map(i => <div key={i} className="h-48 bg-surface-alt/30 rounded-[24px]"></div>)}
              </div>
            </div>
          }>
            {activeTab === Tab.TRACKER && (
              <div className="space-y-8">
                {/* Weekly Report Banner (Shows on Sun/Mon) */}
                {[0, 1].includes(new Date().getDay()) && (
                  <div className="p-6 rounded-card bg-surface-soft border border-surface-alt flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative shadow-sm">
                    <div>
                      <h3 className="text-primary-text font-display font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-secondary-blue" />
                        Your Weekly Garden Report is ready
                      </h3>
                      <p className="text-secondary-text text-sm mt-1">
                        See how your plants grew and habits performed this past week.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setStatsSubTab('reports');
                        setActiveTab(Tab.STATS);
                      }}
                      className="px-6 py-3 bg-surface-card hover:bg-surface-alt text-secondary-text font-bold text-[11px] uppercase tracking-wide border border-surface-alt rounded-button transition-colors shrink-0 shadow-sm"
                    >
                      View Report
                    </button>
                  </div>
                )}

                {/* Daily Goal Ring Setup */}
                <DailyGoalRing 
                  completed={dueHabitsList.filter(h => (logs[dateKey] || []).includes(h.id)).length} 
                  total={dueHabitsList.length} 
                />

                {/* Active Event Banner */}
                {activeEvent && eventProgress && (
                  <EventBanner 
                    event={activeEvent} 
                    progress={eventProgress} 
                    onViewEvent={() => setShowEventModal(true)} 
                  />
                )}

                {/* Almanac Banner */}
                {isAlmanacSeason(date) && (() => {
                   const year = getAlmanacYear(date);
                   if (almanacEligibility) {
                      return (
                        <div 
                          onClick={() => {
                             setCurrentAlmanacYear(year);
                             setShowAlmanac(true);
                          }}
                          className="w-full max-w-sm mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#000428] border border-emerald-500/30 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <LucideIcons.BookOpen className="w-5 h-5 text-emerald-400" />
                             </div>
                             <div>
                                <h3 className="text-primary-text font-bold font-display text-lg">Your {year} Garden Almanac is ready</h3>
                                <p className="text-emerald-200 text-xs font-mono tracking-widest uppercase">Tap to open your story</p>
                             </div>
                          </div>
                        </div>
                      );
                   }
                   return null;
                })()}

                {/* Sort Dropdown */}
                <div className="flex justify-end -mb-4 relative z-10">
                  <select 
                     value={sortType} 
                     onChange={(e) => setSortType(e.target.value as any)}
                     className="bg-surface-soft border border-surface-alt text-primary-text text-sm rounded-lg px-4 py-2 outline-none focus:border-primary-mint font-mono uppercase tracking-wider shadow-sm appearance-none cursor-pointer hover:bg-surface-alt/50 transition-colors"
                  >
                     <option value="recent">Sort: Recent</option>
                     <option value="health">Sort: Health</option>
                     <option value="recovery">Needs Recovery</option>
                     <option value="alpha">Sort: Alphabetical</option>
                  </select>
                </div>

                {/* Daily Garden Main View */}
                <DailyGarden
                  habits={sortedActiveHabits}
                  logs={logs}
                  stats={stats}
                  dateKey={dateKey}
                  activeEvent={activeEvent}
                  eventProgress={eventProgress}
                  activeRestMode={activeRestMode}
                  onOpenRestMode={() => setShowRestModeModal(true)}
                  onResumeRestMode={() => {
                    const updatedMode = activeRestMode ? { ...activeRestMode, isActive: false, endedAt: new Date().toISOString() } : null;
                    setActiveRestMode(updatedMode);
                    persistData(habits, logs, extraStats, updatedMode);
                  }}
                  onWaterPlant={stableToggleHabit}
                  onSlipHabit={stableHandleSlipHabit}
                  onUndoSlip={stableUndoSlipHabit}
                  onAddHabit={() => setShowAddForm(true)}
                  isPerfectDayNow={isPerfectDayNowTopLevel}
                  onDeletePlant={stableDeleteHabit}
                  onHarvestPlant={stableHarvestPlant}
                  onOpenOrchard={() => setShowOrchard(true)}
                  onBackdate={stableBackdate}
                />

                <HabitForm
                  isOpen={showAddForm}
                  userMaxStreak={Math.max(0, ...habits.map((h) => h.bestStreak || 0))}
                  ownedSeeds={extraStats.ownedItemIds?.filter(id => id.startsWith('seed_')) || []}
                  customCategories={extraStats.customCategories || []}
                  onAdd={handleAddHabit}
                  onCancel={() => setShowAddForm(false)}
                />

                {showRestModeModal && (
                  <RestModeSetup
                    onClose={() => setShowRestModeModal(false)}
                    onSave={(mode) => {
                      setActiveRestMode(mode);
                      setShowRestModeModal(false);
                      persistData(habits, logs, extraStats, mode);
                    }}
                    habits={activeHabitsList}
                    currentRestMode={activeRestMode}
                  />
                )}

                {showEventModal && activeEvent && eventProgress && (
                  <EventDetailModal
                    event={activeEvent}
                    progress={eventProgress}
                    onClose={() => setShowEventModal(false)}
                    onClaimReward={claimEventReward}
                  />
                )}
              </div>
            )}

            {activeTab === Tab.PROGRESS && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 p-1 bg-surface-alt/5 border border-surface-alt w-fit rounded-lg mb-4">
                   <button 
                     onClick={() => setProgressSubTab('virtual_garden')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${progressSubTab === 'virtual_garden' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Your Garden
                   </button>
                   <button 
                     onClick={() => setProgressSubTab('calendar')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${progressSubTab === 'calendar' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Garden Calendar
                   </button>
                </div>

                {progressSubTab === 'virtual_garden' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt relative shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-secondary-blue" />
                      <span className="text-[10px] text-muted-text font-bold uppercase tracking-widest">
                        Completed
                      </span>
                    </div>
                    <span className="text-3xl font-bold font-display text-primary-text tracking-tight">
                      {stats.totalHabitsCompleted}
                    </span>
                  </div>
                  <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt relative shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-accent-peach" />
                      <span className="text-[10px] text-muted-text font-bold uppercase tracking-widest">
                        Level
                      </span>
                    </div>
                    <span className="text-3xl font-bold font-display text-primary-text tracking-tight">
                      {stats.level}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-soft p-8 rounded-[32px] border border-surface-alt relative shadow-sm">
                  <h2 className="text-xl font-bold font-display text-primary-text mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-status-healthy" />
                    Your Garden
                  </h2>
                  <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
                    <button 
                      onClick={() => setCategoryFilter('all')}
                      className={`px-4 py-2 font-bold text-[11px] uppercase tracking-wide whitespace-nowrap transition-colors border rounded-chip ${categoryFilter === 'all' ? 'bg-primary-mint/20 text-status-healthy border-primary-mint shadow-sm' : 'bg-surface-card text-secondary-text border-surface-alt hover:bg-surface-alt'}`}
                    >
                      All
                    </button>
                    {Array.from(new Set(habits.map(h => h.category))).map(cat => {
                      if (!cat || !CATEGORIES[cat]) return null;
                      const isSelected = categoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(isSelected ? 'all' : cat)}
                          className={`px-4 py-2 flex items-center gap-2 font-bold text-[11px] uppercase tracking-wide whitespace-nowrap transition-colors border rounded-chip ${isSelected ? 'bg-primary-mint/20 text-status-healthy border-primary-mint shadow-sm' : 'bg-surface-card text-secondary-text border-surface-alt hover:bg-surface-alt'}`}
                        >
                          {CATEGORIES[cat].name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredTrackerHabits.map((habit) => (
                      <div
                        key={habit.id}
                        className="grid grid-rows-[auto,auto,auto,auto] justify-items-center gap-1 p-4 bg-surface-card border border-surface-alt rounded-2xl hover:border-primary-mint transition-all group shadow-sm max-w-[140px] mx-auto w-full"
                      >
                        <div className="w-16 h-20 flex flex-col items-center justify-end relative mb-3 group-hover:scale-105 transition-transform duration-300">
                          <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} health={habit.plantHealth} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className="w-16 h-20 absolute bottom-[5%] z-10 drop-shadow-md" />
                          {/* Elliptical shadow under the plant */}
                          <div className="w-10 h-2 bg-black/15 shadow-[0_0_8px_4px_rgba(0,0,0,0.15)] rounded-[100%] absolute bottom-[-5%] z-0" />
                        </div>
                        <h3 className="text-sm font-bold text-primary-text font-display text-center capitalize leading-tight">
                          {habit.type === 'avoid' && habit.isPrivate ? 'Protected' : habit.name}
                        </h3>
                        <div className="text-[10px] text-status-needsCare font-bold flex items-center justify-center gap-1 w-full mt-1">
                          <Flame className="w-3 h-3" />
                          Streak: {habit.streak} days
                        </div>
                        <div className="text-[10px] text-secondary-text font-bold text-center w-full">
                          Status: {habit.plantStatus || 'Healthy'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredTrackerHabits.length === 0 && (
                    <div className="text-center text-muted-text text-sm py-10 font-bold uppercase tracking-wide">
                      Your garden is empty. Plant a new seed today.
                    </div>
                  )}
                </div>

                <Heatmap logs={logs} />
                <ProgressChart logs={logs} habits={habits} />
              </div>
                ) : (
                  <GardenCalendar logs={logs} habits={habits} stats={stats} activeRestMode={activeRestMode} />
                )}
              </div>
            )}

            {activeTab === Tab.SHOP && (
              <GardenShop 
                 stats={stats}
                 onBuyItem={handleBuyItem}
                 onEquipItem={handleEquipItem}
                 onEquipCompanion={(compId) => setExtraStats(prev => ({ ...prev, activeCompanionId: compId || undefined }))}
              />
            )}

            {activeTab === Tab.STATS && (
              <div className="space-y-6">
                {/* Status Tab Toggle */}
                <div className="flex flex-wrap gap-2 p-1 bg-surface-alt/5 border border-surface-alt w-fit rounded-lg">
                   <button 
                     onClick={() => setStatsSubTab('overview')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'overview' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Overview
                   </button>
                   <button 
                     onClick={() => setStatsSubTab('reports')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'reports' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Garden Reports
                   </button>
                   <button 
                     onClick={() => setStatsSubTab('challenges')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'challenges' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Garden Challenges
                   </button>
                   <button 
                     onClick={() => setStatsSubTab('badges')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'badges' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Garden Badges
                   </button>
                   <button 
                     onClick={() => setStatsSubTab('profile')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'profile' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Gardener Profile
                   </button>
                   <button 
                     onClick={() => setStatsSubTab('history')}
                     className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${statsSubTab === 'history' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-muted-text hover:text-secondary-text border border-transparent'}`}
                   >
                     Garden History
                   </button>
                </div>

                {statsSubTab === 'profile' && (
                  <div className="space-y-8">
                    {/* Profile Header Card */}
                    <div className="bg-surface-soft p-8 rounded-[32px] border border-surface-alt relative flex flex-col md:flex-row items-center gap-8 shadow-sm">
                      <div className="w-24 h-24 rounded-full bg-surface-card border border-surface-alt flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-10 h-10 text-primary-mint" />
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold font-display text-primary-text mb-1">
                          {user.displayName || "Gardener"}
                        </h2>
                        <p className="text-sm font-bold tracking-wide text-status-healthy uppercase mb-4">
                          {stats.rank} (Level {stats.level})
                        </p>
                        
                        {/* XP Progress Bar */}
                        <div className="w-full max-w-md mx-auto md:mx-0">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[11px] font-bold tracking-wide text-secondary-text uppercase">
                              Total XP: {stats.xp}
                            </span>
                            <span className="text-[11px] font-bold tracking-wide text-muted-text uppercase">
                              Next Lvl: {LEVEL_THRESHOLDS[stats.level + 1] ? LEVEL_THRESHOLDS[stats.level + 1] : "Max"}
                            </span>
                          </div>
                          <div className="h-3 w-full bg-surface-card rounded-progress overflow-hidden border border-surface-alt p-0.5 shadow-inner-sm">
                            <div 
                              className="h-full bg-status-healthy rounded-progress transition-all duration-1000" 
                              style={{ 
                                width: LEVEL_THRESHOLDS[stats.level + 1] 
                                  ? `${((stats.xp - LEVEL_THRESHOLDS[stats.level]) / (LEVEL_THRESHOLDS[stats.level + 1] - LEVEL_THRESHOLDS[stats.level])) * 100}%` 
                                  : '100%' 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt flex flex-col items-center justify-center text-center shadow-sm">
                        <Zap className="w-6 h-6 text-yellow-400 mb-3" />
                        <div className="text-2xl font-display font-bold text-primary-text mb-1">{stats.currentLoginStreak || 0}</div>
                        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-text">Login Streak</div>
                      </div>
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt flex flex-col items-center justify-center text-center shadow-sm">
                        <Trophy className="w-6 h-6 text-accent-peach mb-3" />
                        <div className="text-2xl font-display font-bold text-primary-text mb-1">{stats.totalHabitsCompleted}</div>
                        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-text">Habits Built</div>
                      </div>
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt flex flex-col items-center justify-center text-center shadow-sm">
                        <Flame className="w-6 h-6 text-status-wilting mb-3" />
                        <div className="text-2xl font-display font-bold text-primary-text mb-1">{stats.perfectGardenDays}</div>
                        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-text">Perfect Days</div>
                      </div>
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt flex flex-col items-center justify-center text-center shadow-sm">
                        <Cloud className="w-6 h-6 text-status-healthy mb-3" />
                        <div className="text-2xl font-display font-bold text-primary-text mb-1">{habits.filter(h => h.plantStage === 'Fruiting Plant').length}</div>
                        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-text">Plants Matured</div>
                      </div>
                      <div className="bg-surface-soft p-6 rounded-[24px] border border-surface-alt flex flex-col items-center justify-center text-center shadow-sm">
                        <Zap className="w-6 h-6 text-secondary-blue mb-3" />
                        <div className="text-2xl font-display font-bold text-primary-text mb-1">{stats.plantsRevived}</div>
                        <div className="text-[10px] font-bold tracking-wide uppercase text-muted-text">Plants Saved</div>
                      </div>
                    </div>
                  </div>
                )}

                {statsSubTab === 'overview' && (
                  <SimpleGardenStatsDashboard
                     habits={habits}
                     logs={logs}
                     stats={stats}
                     setActiveTab={setActiveTab}
                     userName={user?.displayName || "Gardener"}
                     onViewReports={() => setStatsSubTab('reports')}
                     onViewHistory={() => setStatsSubTab('history')}
                  />
                )}

                {statsSubTab === 'reports' && (
                  <div className="space-y-6">
                    <div className="flex gap-2 p-1 bg-surface-alt/5 border border-surface-alt w-fit rounded-lg">
                       <button 
                         onClick={() => setReportViewMode('weekly')}
                         className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${reportViewMode === 'weekly' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-slate-400 hover:text-primary-text border border-transparent'}`}
                       >
                         Weekly Report
                       </button>
                       <button 
                         onClick={() => setReportViewMode('monthly')}
                         className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-md ${reportViewMode === 'monthly' ? 'bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm font-semibold' : 'text-slate-400 hover:text-primary-text border border-transparent'}`}
                       >
                         Monthly Report
                       </button>
                    </div>
                    {reportViewMode === 'weekly' ? (
                      <WeeklyReportView 
                         logs={logs} 
                         habits={habits} 
                         stats={stats} 
                         activeEvent={activeEvent} 
                         eventProgress={eventProgress}
                         activeRestMode={activeRestMode}
                      />
                    ) : (
                      <MonthlyReportView 
                         logs={logs} 
                         habits={habits} 
                         activeRestMode={activeRestMode}
                      />
                    )}
                  </div>
                )}

                {statsSubTab === 'challenges' && (
                  <ChallengesView 
                     habits={activeHabitsList}
                     stats={stats}
                     onJoinChallenge={handleJoinChallenge}
                     onQuitChallenge={handleQuitChallenge}
                     onClaimChallengeReward={handleClaimChallengeReward}
                  />
                )}

                {statsSubTab === 'badges' && (
                  <GardenBadgesView stats={stats} />
                )}

                {statsSubTab === 'history' && (
                  <GardenHistoryView 
                    archivedHabits={habits.filter(h => h.isArchived)} 
                    onRestore={restoreArchivedHabit}
                    onDeletePermanently={(id) => deleteHabit(id, true)}
                    onUpdateNote={updateArchiveNote}
                  />
                )}
              </div>
            )}

            {activeTab === Tab.CALENDAR && (
              <GardenCalendar logs={logs} habits={habits} stats={stats} activeRestMode={activeRestMode} /> // Keep all
            )}

            {activeTab === Tab.SETTINGS && (
              <div className="space-y-8">
                <div className="glass p-10 rounded-none border border-surface-alt relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00F5D4]/40" />
                  <div className="flex items-center gap-6 mb-8">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="w-14 h-14 rounded-none border border-cyan-500/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-none bg-cyan-500/5 flex items-center justify-center border border-cyan-500/20">
                        <Cloud className="w-7 h-7 text-cyan-400" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-primary-text font-display uppercase tracking-wide">
                        {user.displayName}
                      </h2>
                      <p className="text-slate-500 font-mono text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-cyan-400 text-xs font-mono tracking-widest uppercase bg-cyan-500/5 p-4 rounded-none border border-cyan-500/10 mb-6">
                    <span
                      className={`w-2 h-2 rounded-full ${isOnline ? "bg-cyan-400 shadow-[0_0_8px_#00F5D4]" : "bg-rose-500"} animate-pulse`}
                    />
                    {isOnline
                      ? "CLOUD SYNC PROTOCOL ACTIVE"
                      : "OFFLINE MODE (CHANGES QUEUED)"}
                  </div>
                  
                  <div className="flex items-center justify-between bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-4">
                     <div>
                        <h3 className="text-primary-text font-bold text-sm">Simple Garden Mode</h3>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Disable animations and decorations</p>
                     </div>
                     <button 
                        onClick={() => {
                           const newStats = { ...extraStats, isSimpleMode: !extraStats.isSimpleMode };
                           setExtraStats(newStats);
                           persistData(habits, logs, newStats);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative ${extraStats.isSimpleMode ? 'bg-cyan-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 bg-surface-card rounded-full absolute top-1 transition-transform ${extraStats.isSimpleMode ? 'translate-x-7' : 'translate-x-1'}`} />
                     </button>
                  </div>

                  <div className="flex items-center justify-between bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-4">
                     <div>
                        <h3 className="text-primary-text font-bold text-sm">Vibration Effects</h3>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Haptic feedback on habit completion</p>
                     </div>
                     <button 
                        onClick={() => {
                           const enabled = extraStats.hapticsEnabled !== false;
                           const newStats = { ...extraStats, hapticsEnabled: !enabled };
                           setExtraStats(newStats);
                           persistData(habits, logs, newStats);
                           if (!enabled) playHaptic('water', true);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative ${(extraStats.hapticsEnabled !== false) ? 'bg-cyan-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 bg-surface-card rounded-full absolute top-1 transition-transform ${(extraStats.hapticsEnabled !== false) ? 'translate-x-7' : 'translate-x-1'}`} />
                     </button>
                  </div>

                  <div className="flex bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-4 flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-primary-text font-bold text-sm">Evening Garden Summary</h3>
                           <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">One gentle nudge for unfinished plants</p>
                        </div>
                        <button 
                           onClick={async () => {
                              const enabled = extraStats.eveningSummaryEnabled !== false;
                              const newStats = { ...extraStats, eveningSummaryEnabled: !enabled };
                              setExtraStats(newStats);
                              persistData(habits, logs, newStats);
                              
                              if (!enabled && 'Notification' in window) {
                                await Notification.requestPermission();
                              }
                           }}
                           className={`w-12 h-6 rounded-full transition-colors relative ${(extraStats.eveningSummaryEnabled !== false) ? 'bg-cyan-500' : 'bg-slate-700'}`}
                        >
                           <div className={`w-4 h-4 bg-surface-card rounded-full absolute top-1 transition-transform ${(extraStats.eveningSummaryEnabled !== false) ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                     </div>
                     
                     {(extraStats.eveningSummaryEnabled !== false) && (
                       <div className="flex items-center justify-between border-t border-surface-alt pt-4">
                         <div>
                            <p className="text-slate-400 font-mono text-[10px] tracking-wider uppercase">Summary Time</p>
                         </div>
                         <input 
                           type="time" 
                           value={extraStats.eveningSummaryTime || '21:00'} 
                           onChange={(e) => {
                              const newStats = { ...extraStats, eveningSummaryTime: e.target.value };
                              setExtraStats(newStats);
                              persistData(habits, logs, newStats);
                           }}
                           className="bg-transparent border border-surface-alt text-primary-text font-mono text-sm px-2 py-1 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                         />
                       </div>
                     )}
                  </div>

                  {/* Daily Reminder Block */}
                  <div className="bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6 flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-primary-text font-bold text-sm text-balance">Daily Quick Reminder</h3>
                           <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-[200px] leading-relaxed">A gentle nudge at a specific time</p>
                        </div>
                        <button 
                           onClick={async () => {
                              const enabled = extraStats.dailyReminderEnabled === true;
                              const newStats = { ...extraStats, dailyReminderEnabled: !enabled };
                              setExtraStats(newStats);
                              persistData(habits, logs, newStats);
                              
                              if (!enabled && 'Notification' in window) {
                                await Notification.requestPermission();
                              }
                           }}
                           className={`w-12 h-6 rounded-full transition-colors relative ${(extraStats.dailyReminderEnabled === true) ? 'bg-cyan-500' : 'bg-slate-700'}`}
                        >
                           <div className={`w-4 h-4 bg-surface-card rounded-full absolute top-1 transition-transform ${(extraStats.dailyReminderEnabled === true) ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                     </div>
                     
                     {(extraStats.dailyReminderEnabled === true) && (
                       <div className="flex items-center justify-between border-t border-surface-alt pt-4">
                         <div>
                            <p className="text-slate-400 font-mono text-[10px] tracking-wider uppercase">Reminder Time</p>
                         </div>
                         <input 
                           type="time" 
                           value={extraStats.dailyReminderTime || '09:00'} 
                           onChange={(e) => {
                              const newStats = { ...extraStats, dailyReminderTime: e.target.value };
                              setExtraStats(newStats);
                              persistData(habits, logs, newStats);
                           }}
                           className="bg-transparent border border-surface-alt text-primary-text font-mono text-sm px-2 py-1 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                         />
                       </div>
                     )}
                  </div>

                  <div className="flex items-center justify-between bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6">
                     <div>
                        <h3 className="text-primary-text font-bold text-sm">Garden Matches Time of Day</h3>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Visuals change from dawn to night</p>
                     </div>
                     <button 
                        onClick={() => {
                           const currentMatch = extraStats.matchTimeOfDay ?? true;
                           const newStats = { ...extraStats, matchTimeOfDay: !currentMatch };
                           setExtraStats(newStats);
                           persistData(habits, logs, newStats);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors relative ${(extraStats.matchTimeOfDay !== false) ? 'bg-cyan-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 bg-surface-card rounded-full absolute top-1 transition-transform ${(extraStats.matchTimeOfDay !== false) ? 'translate-x-7' : 'translate-x-1'}`} />
                     </button>
                  </div>

                  <div className="flex items-center justify-between bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6">
                     <div>
                        <h3 className="text-primary-text font-bold text-sm">Completion Sound Cue</h3>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Audio cue on habit completion</p>
                     </div>
                     <select 
                        value={extraStats.completionSound || 'droplet'}
                        onChange={(e) => {
                           const soundTheme = e.target.value as 'chime' | 'droplet' | 'pop' | 'none';
                           const newStats = { ...extraStats, completionSound: soundTheme };
                           setExtraStats(newStats);
                           persistData(habits, logs, newStats);
                           if (soundTheme !== 'none') {
                              playCompletionSound(soundTheme);
                           }
                        }}
                        className="bg-background-main border border-surface-alt text-primary-text font-mono text-xs px-3 py-2 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                     >
                        <option value="droplet">Water Droplet</option>
                        <option value="chime">Soft Chime</option>
                        <option value="pop">Pop</option>
                        <option value="none">Disabled</option>
                     </select>
                  </div>

                  <MotivationSettings 
                    stats={extraStats}
                    onUpdate={(newStats) => {
                       setExtraStats(newStats as any);
                       persistData(habits, logs, newStats as any);
                    }}
                    onPreview={() => {
                       const customQuotes = extraStats.motivations || [];
                       const validQuotes = customQuotes.length > 0 ? customQuotes : MOTIVATIONAL_QUOTES;
                       const chosen = validQuotes[Math.floor(Math.random() * validQuotes.length)];
                       setMotivationPopup({ text: (chosen as any).quote_text || (chosen as any).text, author: (chosen as any).author });
                    }}
                  />

                  <CustomCategoryManager 
                    categories={extraStats.customCategories || []}
                    onChange={(customCategories) => {
                       const newStats = { ...extraStats, customCategories };
                       setExtraStats(newStats);
                       persistData(habits, logs, newStats);
                    }}
                  />

                   {/* APP DESIGN & VISUAL LAB */}
                   <div className="flex flex-col gap-6 bg-surface-alt/5 p-6 rounded-none border border-surface-alt mb-6">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <LucideIcons.Brush className="w-5 h-5 text-primary-mint" />
                            <h3 className="text-primary-text font-bold text-base">Aesthetic & Layout Design Lab</h3>
                         </div>
                         <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                            Fully customize your app canvas, boxes, elements and accent styling
                         </p>
                      </div>

                      {/* Option 1: Full App Preset Themes */}
                      <div className="space-y-3">
                         <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">1. Canvas Presets (Body & Containers)</span>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {APP_THEMES.map((t) => {
                               const isActive = (extraStats.themeId || 'cream_butter') === t.id;
                               return (
                                  <button
                                     key={t.id}
                                     onClick={() => {
                                        const newStats = { ...extraStats, themeId: t.id };
                                        setExtraStats(newStats);
                                        persistData(habits, logs, newStats);
                                     }}
                                     className={`relative p-3 rounded text-left border cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col justify-between h-28 overflow-hidden group`}
                                     style={{
                                        backgroundColor: t.colors['--color-surface-card'],
                                        borderColor: isActive ? t.colors['--color-primary-mint'] : 'rgba(148, 163, 184, 0.2)',
                                        boxShadow: isActive ? `0 0 12px ${t.colors['--color-primary-mint']}40` : 'none',
                                     }}
                                  >
                                     <div 
                                        className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full opacity-10 group-hover:scale-125 transition-transform"
                                        style={{ backgroundColor: t.colors['--color-primary-mint'] }}
                                     />
                                     
                                     <div>
                                        <div className="flex items-center justify-between mb-1">
                                           <span className="font-bold text-xs" style={{ color: t.colors['--color-primary-text'] }}>
                                              {t.name}
                                           </span>
                                           {isActive ? (
                                              <span className="text-[9px] font-mono uppercase bg-primary-mint/10 border border-primary-mint px-1.5 py-0.5 rounded text-primary-mint">
                                                 Active
                                              </span>
                                           ) : (
                                              t.isDark ? (
                                                 <LucideIcons.Moon className="w-3 h-3 text-slate-500" />
                                              ) : (
                                                 <LucideIcons.Sun className="w-3 h-3 text-slate-400" />
                                              )
                                           )}
                                        </div>
                                        <p className="text-[10px] leading-relaxed block" style={{ color: t.colors['--color-secondary-text'] }}>
                                           {t.description}
                                        </p>
                                     </div>

                                     <div className="flex gap-1.5 items-center mt-2 relative z-10">
                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-500/10" style={{ backgroundColor: t.colors['--color-background-main'] }} title="BG" />
                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-500/10" style={{ backgroundColor: t.colors['--color-surface-card'] }} title="Card" />
                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-500/10" style={{ backgroundColor: t.colors['--color-surface-alt'] }} title="Border" />
                                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.colors['--color-primary-mint'] }} title="Accent" />
                                     </div>
                                  </button>
                               );
                            })}
                         </div>
                      </div>

                      {/* Option 2: Ambient Accent Tint Override */}
                      <div className="space-y-3 pt-3 border-t border-slate-500/10">
                         <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">2. Ambient Accent Tint (Indicators & Action Buttons)</span>
                         <div className="flex flex-wrap items-center gap-3">
                            {[
                               { name: 'Mint / Sage', value: '78 173 160', hex: '#4EADA0' },
                               { name: 'Teal Bright', value: '143 207 173', hex: '#8FCFAD' },
                               { name: 'Rose Petal', value: '251 113 133', hex: '#fb7185' },
                               { name: 'Electric Cyan', value: '34 211 238', hex: '#22d3ee' },
                               { name: 'Desert Amber', value: '251 191 36', hex: '#fbbf24' },
                               { name: 'Pure Amethyst', value: '192 132 252', hex: '#c084fc' },
                               { name: 'Harvest Rust', value: '208 90 63', hex: '#D05A3F' },
                               { name: 'Obsidian Emerald', value: '16 185 129', hex: '#10B981' }
                            ].map((color) => {
                               const isSelected = extraStats.accentColor === color.value;
                               return (
                                  <button
                                     key={color.name}
                                     onClick={() => {
                                        const newStats = { ...extraStats, accentColor: color.value };
                                        setExtraStats(newStats);
                                        persistData(habits, logs, newStats);
                                     }}
                                     className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center relative active:scale-95 cursor-pointer`}
                                     style={{ 
                                        backgroundColor: color.hex,
                                        borderColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.1)'
                                     }}
                                     title={color.name}
                                  >
                                     {isSelected && (
                                        <Check className="w-5 h-5 text-primary-text drop-shadow-md" />
                                     )}
                                  </button>
                               );
                            })}
                         </div>
                      </div>

                      {/* Option 3: Corner Curvatures (Geometry style) */}
                      <div className="space-y-3 pt-3 border-t border-slate-500/10">
                         <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">3. Box Corner Geometry (Curvatures)</span>
                         <div className="grid grid-cols-3 gap-3">
                            {[
                               { id: 'sharp', label: 'Brutalist Sharp', desc: '0px corners', styleText: 'rounded-none' },
                               { id: 'medium', label: 'Modern Elegant', desc: '12px corners', styleText: 'rounded-[12px]' },
                               { id: 'soft', label: 'Playful Organic', desc: '32px round pill', styleText: 'rounded-[16px]' }
                            ].map((item) => {
                               const isActive = (extraStats.cornerRoundness || 'soft') === item.id;
                               return (
                                  <button
                                     key={item.id}
                                     onClick={() => {
                                        const newStats = { ...extraStats, cornerRoundness: item.id as any };
                                        setExtraStats(newStats);
                                        persistData(habits, logs, newStats);
                                     }}
                                     className={`p-3 border text-left rounded cursor-pointer relative hover:border-slate-400 transition-colors ${
                                        isActive ? 'bg-background-main/40 border-primary-mint text-primary-text' : 'bg-transparent border-slate-500/20 text-slate-300'
                                     }`}
                                  >
                                     <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="font-bold text-[11px] tracking-tight">{item.label}</span>
                                        {isActive && <div className="w-2 h-2 rounded-full bg-primary-mint" />}
                                     </div>
                                     <p className="text-[9px] text-slate-400 font-mono leading-none">{item.desc}</p>
                                     
                                     <div className="mt-3 flex gap-1 justify-start">
                                        <span className={`w-8 h-4 border border-slate-500/30 ${item.styleText}`} />
                                        <span className={`w-4 h-4 border border-slate-500/30 ${item.styleText}`} />
                                     </div>
                                  </button>
                               );
                            })}
                         </div>
                      </div>

                      {/* Option 4: Box Border Outlines */}
                      <div className="space-y-3 pt-3 border-t border-slate-500/10">
                         <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider block">4. Box Border Styles (Outlines)</span>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                               { id: 'subtle', label: 'Default Subtle', desc: 'Standard soft outline' },
                               { id: 'invisible', label: 'Seamless None', desc: 'Smooth flat bg' },
                               { id: 'solid', label: 'Comic Bold', desc: 'High contrast black outline' },
                               { id: 'neon', label: 'Cosmic Glow', desc: 'Glowing neon outline' }
                            ].map((item) => {
                               const isActive = (extraStats.borderStyle || 'subtle') === item.id;
                               return (
                                  <button
                                     key={item.id}
                                     onClick={() => {
                                        const newStats = { ...extraStats, borderStyle: item.id as any };
                                        setExtraStats(newStats);
                                        persistData(habits, logs, newStats);
                                     }}
                                     className={`p-3 border text-left rounded cursor-pointer relative hover:border-slate-400 transition-colors ${
                                        isActive ? 'bg-background-main/40 border-primary-mint text-primary-text' : 'bg-transparent border-slate-500/20 text-slate-300'
                                     }`}
                                  >
                                     <div className="flex items-center justify-between gap-1 mb-1">
                                        <span 
                                           className="font-bold text-[11px] tracking-tight"
                                           style={item.id === 'invisible' ? { color: '#000000' } : undefined}
                                        >
                                           {item.label}
                                        </span>
                                        {isActive && <div className="w-2 h-2 rounded-full bg-primary-mint" />}
                                     </div>
                                     <p 
                                        className="text-[9px] text-slate-400 leading-normal"
                                        style={item.id === 'solid' ? { backgroundColor: '#ffffff', color: '#080101', fontWeight: 'bold' } : undefined}
                                     >
                                        {item.desc}
                                     </p>
                                  </button>
                               );
                            })}
                         </div>
                      </div>
                   </div>

                   {/* Recently Unlocked Badges */}
                   {extraStats.unlockedBadgeIds && Object.keys(extraStats.unlockedBadgeIds).length > 0 && (
                      <div className="bg-surface-alt/5 p-4 rounded-none border border-emerald-500/10 mb-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                         <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                               <LucideIcons.Award className="w-4 h-4 text-emerald-400" />
                               <h3 className="text-primary-text font-bold text-sm">Recently Unlocked Badges</h3>
                            </div>
                            <button onClick={() => { setStatsSubTab('badges'); setActiveTab(Tab.STATS); }} className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] hover:text-[#00d8b9] transition-colors">
                               View All
                            </button>
                         </div>
                         <div className="flex flex-wrap gap-3 relative z-10">
                            {Object.entries(extraStats.unlockedBadgeIds)
                              .sort(([, a], [, b]) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
                              .slice(0, 3)
                              .map(([badgeId]) => {
                                 const badge = ACHIEVEMENT_BADGES.find(b => b.badgeId === badgeId);
                                 if (!badge) return null;
                                 const Icon = (LucideIcons as any)[badge.iconName] || LucideIcons.Award;
                                 return (
                                    <div key={badgeId} className="flex items-center gap-3 p-3 bg-emerald-950/20 border border-emerald-500/20 shadow-sm w-full md:w-auto md:flex-1 md:min-w-[200px]">
                                       <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                          <Icon className="w-5 h-5 text-emerald-400" />
                                       </div>
                                       <div className="min-w-0">
                                          <p className="text-primary-text font-bold text-sm truncate">{badge.title}</p>
                                          <p className="text-[10px] font-mono tracking-widest text-emerald-400/80 uppercase truncate">{badge.category}</p>
                                       </div>
                                    </div>
                                 );
                              })}
                         </div>
                      </div>
                   )}

                   {extraStats.almanacs && Object.keys(extraStats.almanacs).length > 0 && (
                     <div className="bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6">
                        <div className="flex items-center gap-2 mb-4">
                           <LucideIcons.Library className="w-4 h-4 text-emerald-400" />
                           <h3 className="text-primary-text font-bold text-sm">Garden Almanacs</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                           {Object.values(extraStats.almanacs).sort((a,b) => b.year.localeCompare(a.year)).map(a => (
                              <button
                                key={a.year}
                                onClick={() => {
                                   setCurrentAlmanacYear(a.year);
                                   setShowAlmanac(true);
                                }}
                                className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-emerald-900/40 to-[#000428] border border-emerald-500/20 hover:border-emerald-500/50 transition-colors shadow-lg hover:scale-[1.02] transform"
                              >
                                 <LucideIcons.Book className="w-8 h-8 text-emerald-300 mb-2 drop-shadow-md" />
                                 <span className="text-primary-text font-display font-bold">{a.year}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  )}

                  <Button
                    onClick={() => logout()}
                    variant="danger"
                    className="w-full md:w-auto px-8 rounded-none font-mono text-xs tracking-widest uppercase py-3 border border-rose-500/20 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect Session
                  </Button>
                </div>

                <div className="glass p-8 rounded-none border border-surface-alt relative mb-6">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-[#00F5D4] mb-4" style={{ color: '#f57100' }}>
                    DATA & BACKUP
                  </h2>
                  <p className="text-slate-500 font-mono text-[10px] leading-relaxed uppercase tracking-wider mb-6">
                    Export your entire garden history as a JSON file. Keep it safe!
                  </p>
                  <Button
                    onClick={handleExportData}
                    className="w-full py-4 text-xs font-mono tracking-widest uppercase bg-zinc-800 text-slate-300 hover:text-primary-text hover:bg-zinc-700 border-zinc-700 rounded-none transition-all flex items-center justify-center gap-3"
                  >
                    <Download className="w-4 h-4" />
                    Export Garden Data
                  </Button>
                </div>

                <div className="glass p-8 rounded-none border border-surface-alt relative">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-[#00F5D4] mb-4">
                    SYSTEM SETTINGS
                  </h2>
                  <p className="text-slate-500 font-mono text-[10px] leading-relaxed uppercase tracking-wider">
                    Version {pkg.version}
                  </p>
                </div>
              </div>
            )}
          </React.Suspense>
        )}

        <React.Suspense fallback={null}>
          {showOrchard && (
            <OrchardModal 
               entries={extraStats.orchard || []} 
               habits={habits}
               onClose={() => setShowOrchard(false)} 
            />
          )}

          {harvestedData && (
            <HarvestModal 
               data={harvestedData} 
               onClose={() => setHarvestedData(null)} 
            />
          )}

          {showAlmanac && currentAlmanacYear && (
            <AlmanacView 
               almanac={
                  extraStats.almanacs?.[currentAlmanacYear] || 
                  (generateAlmanac(currentAlmanacYear, logs, habits, extraStats) || {
                     year: currentAlmanacYear,
                     totalCheckins: 0,
                     bestStreak: {days: 0, habitName: '', icon: ''},
                     topHabit: {name: '', fruit: '', count: 0, icon: ''},
                     rhythm: {label: '', percent: 0, busiestMonth: ''},
                     harvest: {plantsGrown: 0, harvests: 0, badges: 0, companions: 0},
                     comebacks: 0,
                     computedAt: new Date().toISOString()
                  })
               }
               userName={user?.displayName || "Gardener"}
               userRank={stats.rank}
               onClose={() => {
                  setShowAlmanac(false);
                  if (!extraStats.almanacs || !extraStats.almanacs[currentAlmanacYear]) {
                     const generated = generateAlmanac(currentAlmanacYear, logs, habits, extraStats);
                     if (generated) {
                        const newStats = {
                           ...extraStats,
                           almanacs: {
                              ...(extraStats.almanacs || {}),
                              [currentAlmanacYear]: generated
                           }
                        };
                        setExtraStats(newStats);
                        persistData(habits, logs, newStats);
                     }
                  }
               }}
            />
          )}

          {newlyUnlockedBadges.length > 0 && (
            <BadgeUnlockModal
               badges={newlyUnlockedBadges}
               onClose={() => setNewlyUnlockedBadges([])}
            />
          )}
        </React.Suspense>
        
        <AnimatedModal 
           isOpen={!!motivationPopup} 
           onClose={() => setMotivationPopup(null)}
           alignment="center"
           className="!max-w-md mx-auto !p-0 overflow-hidden bg-surface-card border border-surface-alt shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
           {motivationPopup && (
              <div className="relative p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
                 <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#00F5D4]/10 to-transparent pointer-events-none" />
                 
                 <Quote className="w-10 h-10 text-[#00F5D4]/30 mb-6 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]" />
                 
                 <p className="text-xl md:text-2xl font-display font-medium text-primary-text leading-relaxed text-balance relative z-10" style={{ fontFamily: "inherit" }}>
                    {motivationPopup.text}
                 </p>
                 
                 {motivationPopup.author && (
                    <p className="mt-6 text-sm font-mono text-emerald-400 uppercase tracking-widest relative z-10">
                       — {motivationPopup.author}
                    </p>
                 )}
                 
                 <button 
                    onClick={() => setMotivationPopup(null)}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-primary-text transition-colors z-20 hover:bg-white/5 rounded-full"
                 >
                    <Check className="w-5 h-5" />
                 </button>
              </div>
           )}
        </AnimatedModal>
        
        <AnimatedModal 
           isOpen={!!massiveCoinPopup} 
           onClose={() => setMassiveCoinPopup(null)}
           alignment="center"
           className="!max-w-md mx-auto !p-0 overflow-hidden bg-surface-card border border-amber-400/20 shadow-[0_20px_60px_rgba(251,191,36,0.15)]"
        >
           {massiveCoinPopup !== null && (
              <div className="relative p-10 text-center flex flex-col items-center justify-center min-h-[240px]">
                 <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-400/20 to-transparent pointer-events-none" />
                 
                 <div className="w-20 h-20 bg-amber-400/20 rounded-full flex items-center justify-center mb-6 animate-bounce relative z-10 mx-auto border border-amber-400/30">
                    <span className="text-4xl drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">🪙</span>
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl font-display font-bold text-amber-400 drop-shadow-md mb-4 relative z-10">
                    +{massiveCoinPopup} Coins!
                 </h2>
                 
                 <p className="text-sm font-mono text-amber-200/80 uppercase tracking-widest relative z-10 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20">
                    30+ Day Streak Bonus
                 </p>
                 
                 <button 
                    onClick={() => setMassiveCoinPopup(null)}
                    className="absolute top-4 right-4 p-2 text-amber-400/50 hover:text-amber-400 transition-colors z-20 hover:bg-amber-400/10 rounded-full"
                 >
                    <Check className="w-5 h-5" />
                 </button>
              </div>
           )}
        </AnimatedModal>

        <AnimatedModal 
           isOpen={!!growthMultiplierPopup} 
            onClose={() => setGrowthMultiplierPopup(null)}
            alignment="center"
            className="!max-w-md mx-auto !p-0 overflow-hidden bg-[#0B1528] border border-amber-400/40 rounded-3xl shadow-[0_30px_70px_rgba(245,158,11,0.25)] relative"
         >
            {growthMultiplierPopup !== null && (
               <div className="relative p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[320px] text-white">
                  <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-amber-400/15 via-emerald-400/5 to-transparent pointer-events-none" />
                  
                  <div className="mb-4 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest animate-pulse">
                     🏆 Growth Milestone
                  </div>
                  
                  <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                     <div className="absolute inset-0 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin [animation-duration:3s]" />
                     <div className="absolute inset-2 border-2 border-dashed border-amber-400/20 rounded-full animate-spin [animation-duration:6s] ease-linear" />
                     <div className="absolute w-16 h-16 bg-gradient-to-tr from-amber-500 to-emerald-400 rounded-full blur-md opacity-30 animate-pulse" />
                     <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center relative z-10 border border-amber-400/30 shadow-lg animate-bounce">
                        <span className="text-4xl text-amber-400">⚡</span>
                     </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-display font-black text-amber-400 tracking-tight mb-2 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
                     {growthMultiplierPopup.streak}-Day Milestone!
                  </h2>
                  
                  <p className="text-emerald-400 font-mono text-sm tracking-wide mb-4">
                     for "<span className="text-slate-200 font-semibold">{growthMultiplierPopup.habitName}</span>"
                  </p>
                  
                  <div className="space-y-3 w-full bg-slate-900/60 border border-white/5 p-4 rounded-2xl mb-6">
                     <div className="flex justify-between items-center text-sm font-mono text-slate-300">
                        <span>Streak Boost:</span>
                        <span className="text-amber-400 font-bold">{growthMultiplierPopup.multiplier.toFixed(1)}x Multiplier</span>
                     </div>
                     <div className="h-[1px] bg-white/5 w-full" />
                     <div className="flex justify-between items-center font-display font-bold text-lg text-white">
                        <span>Coins Granted:</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                           🪙 +{growthMultiplierPopup.extraCoins}
                        </span>
                     </div>
                  </div>

                  <p className="text-slate-400 text-xs italic mb-4">
                     Keep your streak alive to unlock higher multipliers!
                  </p>

                  <button 
                     id="growth-milestone-claim-btn"
                     onClick={() => {
                        setGrowthMultiplierPopup(null);
                        import('./haptics').then(({ playHaptic }) => playHaptic('complete'));
                     }}
                     className="w-full py-3 bg-gradient-to-r from-amber-400 to-emerald-500 hover:from-amber-500 hover:to-emerald-600 font-bold text-slate-950 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                     Claim Rewards 🎉
                  </button>
               </div>
            )}
         </AnimatedModal>

         <AnimatedModal 
           isOpen={!!weeklyCelebrationData}           onClose={() => setWeeklyCelebrationData(null)}
           alignment="center"
           className="!max-w-md mx-auto !p-0 overflow-hidden bg-surface-card border border-[#00F5D4]/20 shadow-[0_20px_60px_rgba(0,245,212,0.15)]"
        >
           {weeklyCelebrationData !== null && (
              <div className="relative p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
                 <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#00F5D4]/10 to-transparent pointer-events-none" />
                 
                 <div className="w-20 h-20 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mb-6 animate-pulse relative z-10 mx-auto border border-[#00F5D4]/20">
                    <span className="text-4xl drop-shadow-[0_0_20px_rgba(0,245,212,0.8)]">🌟</span>
                 </div>
                 
                 <h2 className="text-2xl md:text-3xl font-display font-medium text-primary-text tracking-tight text-center leading-snug mb-2 relative z-10">
                    Weekly Consistency!
                 </h2>
                 <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6 relative z-10 font-mono uppercase tracking-wider">
                    3 Consecutive Weeks Achieved
                 </p>
                 
                 <div className="w-full bg-background-main border border-surface-alt rounded-2xl p-4 text-left space-y-3 mb-6 relative z-10">
                    <h3 className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase italic mb-2 border-b border-surface-alt pb-1">
                       GARDEN GROWTH REPORT
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">🏡 Active Plants</span>
                       <span className="font-bold text-slate-200">{weeklyCelebrationData.activePlants}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">🌳 Mature & Fruiting</span>
                       <span className="font-bold text-[#00F5D4]">{weeklyCelebrationData.maturePlants}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">💧 Total Completions</span>
                       <span className="font-bold text-emerald-400">{weeklyCelebrationData.totalHabitsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400">🏆 Gardener Level</span>
                       <span className="font-bold text-amber-400">{weeklyCelebrationData.currentLevel}</span>
                    </div>
                 </div>

                 <div className="w-full flex gap-3 mb-6 relative z-10">
                    <div className="flex-1 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-center">
                       <p className="text-xs font-mono text-yellow-500 uppercase tracking-wider mb-1">COINS AWARDED</p>
                       <p className="text-lg font-bold text-yellow-400">+{weeklyCelebrationData.coinReward}</p>
                    </div>
                    <div className="flex-1 bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-3 text-center">
                       <p className="text-xs font-mono text-cyan-500 uppercase tracking-wider mb-1">XP RECEIVED</p>
                       <p className="text-lg font-bold text-[#00F5D4]">+{weeklyCelebrationData.xpReward}</p>
                    </div>
                 </div>
                 
                 <button 
                    onClick={() => setWeeklyCelebrationData(null)}
                    className="w-full py-3 bg-gradient-to-r from-[#00F5D4] to-emerald-500 hover:from-[#00d8b9] hover:to-emerald-600 text-zinc-900 font-bold font-mono tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,245,212,0.15)] active:scale-95"
                 >
                    Acknowledge
                 </button>
              </div>
           )}
        </AnimatedModal>

        {toastData && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-primary-text px-6 py-3 rounded-full text-sm font-medium shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-5 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {toastData.message.includes("XP") ? <Zap className="w-4 h-4 text-[#00F5D4]" /> : <Check className="w-4 h-4 text-[#00F5D4]" />}
            <span>{toastData.message}</span>
          </div>
          {toastData.action && (
            <button 
              onClick={() => {
                toastData.action!.onClick();
                setToastData(null);
              }}
              className="ml-2 pl-3 border-l border-surface-alt text-[#00F5D4] font-bold uppercase tracking-wider hover:text-primary-text transition-colors text-xs"
            >
              {toastData.action.label}
            </button>
          )}
        </div>
      )}

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          secondaryActionText={confirmDialog.secondaryActionText}
          variant={confirmDialog.variant}
          onConfirm={confirmDialog.onConfirm}
          onSecondaryAction={confirmDialog.onSecondaryAction}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        />
      </main>
    </div>
  );
}

export default App;
