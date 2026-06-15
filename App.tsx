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
import { format, differenceInCalendarDays, subDays, startOfWeek } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { playCompletionSound } from "./audio";
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

// Haptics utility for sensory feedback
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
import { HarvestModal } from "./components/HarvestModal";
import { BadgeUnlockModal } from "./components/BadgeUnlockModal";
import { MotivationSettings } from "./components/MotivationSettings";
import { COMPANIONS } from "./companionsData";

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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [habits, setHabits] = useState<Habit[]>([]);
  useAndroidApp(habits);

  // App State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRACKER);
  const [reportViewMode, setReportViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRestModeModal, setShowRestModeModal] = useState(false);
  const [activeRestMode, setActiveRestMode] = useState<RestMode | null>(null);
  const [recentlyUnlockedCompanions, setRecentlyUnlockedCompanions] = useState<string[]>([]);
  const [harvestedData, setHarvestedData] = useState<{fruitId: string, fruitName: string, xpReward: number, coinReward: number, habitName: string} | null>(null);
  const [showOrchard, setShowOrchard] = useState(false);
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [currentAlmanacYear, setCurrentAlmanacYear] = useState<string | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<AchievementBadge[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortType, setSortType] = useState<'health' | 'alpha' | 'recent' | 'recovery'>('recent');
  const [date, setDate] = useState(new Date());
  const dateKey = format(date, "yyyy-MM-dd");

  React.useEffect(() => {
    // Check every minute if the date string changed to handle midnight rollover without heavy looping
    const midnightCheckInterval = setInterval(() => {
       const newDate = new Date();
       if (format(newDate, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")) {
          setDate(newDate); // triggers midnight cascade
       }
    }, 60000);
    return () => clearInterval(midnightCheckInterval);
  }, [date]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Motivation Popup State
  const [motivationPopup, setMotivationPopup] = useState<{ text: string, author?: string } | null>(null);

  // Data State
  const [logs, setLogs] = useState<HabitLog>({});
  const [extraStats, setExtraStats] = useState<Partial<UserStats>>({
      perfectGardenDays: 0, plantsRevived: 0, xp: 0
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [hasProcessedStreak, setHasProcessedStreak] = useState(false);
  const hasShownMotivationRef = React.useRef(false);

  // Time of Day Synchronization
  React.useEffect(() => {
    const updateTimePhase = () => {
      import('./components/GardenSky').then(({ getGardenTimePhase }) => {
         const phase = getGardenTimePhase();
         document.body.setAttribute('data-time-phase', phase);
      });
    };
    updateTimePhase();
    const interval = setInterval(updateTimePhase, 60000);
    return () => clearInterval(interval);
  }, []);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
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
        if (data.extraStats?.accentColor) {
           document.documentElement.style.setProperty('--primary-mint', data.extraStats.accentColor);
        }
        setActiveRestMode(data.activeRestMode || null);
      }
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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
        let isFlexibleTargetMetForLastCycle = false;
        
        for (let i = 1; i <= daysMissed; i++) {
          const checkDateStr = format(
            subDays(new Date(dateKey), i),
            "yyyy-MM-dd",
          );
          
          const wasProtected = isHabitPaused(habit.id, checkDateStr, activeRestMode);
          const wasDue = isHabitDueOnDate(habit, checkDateStr);
          
          if (!wasDue) continue; // If it's not due on that specific day based on schedule (and not times_per_week evaluated daily), skip.
          // Wait, times_per_week returns true for every day, so we need to be careful not to penalize everyday.
          // So let's handle flexible schedules separately.
          
          if (habit.scheduleType === 'times_per_week' || habit.scheduleType === 'weekly' || habit.scheduleType === 'anytime') {
             // For flexible schedules, we shouldn't do simple daily checks. 
             // We'd ideally check if the whole week was missed. For MVP, we simply don't penalize daily to keep it simple, 
             // or we check if target was met for previous weeks.
             continue; // No daily penalty for flexible schedule
          }
          
          const didComplete = logs[checkDateStr]?.includes(habit.id);
          if (!didComplete && !wasProtected) missedCount++;
        }

        if (missedCount > 0) {
          changed = true;
          let newHealth = habit.plantHealth ?? 100;
          let remainingMisses = missedCount;
          
          let ownedFreezes = extraStats.boostItemCounts?.['boost_streak_freeze'] || 0;
          let freezesUsed = 0;
          
          if (ownedFreezes >= remainingMisses) {
            freezesUsed = remainingMisses;
            remainingMisses = 0;
          } else {
            freezesUsed = ownedFreezes;
            remainingMisses -= ownedFreezes;
          }
          
          if (freezesUsed > 0) {
             const newCounts = {
                ...(extraStats.boostItemCounts || {}),
                'boost_streak_freeze': ownedFreezes - freezesUsed
             };
             setExtraStats(prev => ({ ...prev, boostItemCounts: newCounts }));
          }

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

    if (changed) {
      setTimeout(() => {
        setHabits(updatedHabits);
        persistData(updatedHabits, logs, extraStats, activeRestMode);
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
    const totalCompleted = (Object.values(newLogs) as string[][]).reduce((acc, curr) => acc + curr.length, 0);
    const totalXp = (incomingStats.xp || 0) + newHabits.reduce((acc, h) => acc + (h.xp || (h.totalCompletions || 0) * 10), 0) || totalCompleted * 10;
    const computedLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1; // Assuming getLevelFromXP logic fallback if needed
    
    // We should use the existing global getLevelFromXP function
    const fullLevel = typeof getLevelFromXP === 'function' ? getLevelFromXP(totalXp) : computedLevel;
    
    // Check badges before saving
    let statsToSave = { ...incomingStats };
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
      setNewlyUnlockedBadges(prev => [...prev, ...unlockedBadges]);
      playHaptic('allDone');
    }

    if (user) {
      saveUserData(user.uid, { habits: newHabits, logs: newLogs, extraStats: statsToSave, activeRestMode: newRestMode });
    }
  };

  // Auto-save debounced effect
  useEffect(() => {
    if (dataLoading || authLoading || !user) return;
    const timeoutId = setTimeout(() => {
      persistData(habits, logs, extraStats, activeRestMode);
    }, 1500);
    return () => clearTimeout(timeoutId);
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
       const choice = prompt("Delete or archive this plant?\nType 'archive' to save it in Garden History and keep its journey, or 'delete' to remove entirely.");
       if (choice?.toLowerCase() === 'archive') {
          const updatedHabits = habits.map(h => h.id === id ? { 
             ...h, 
             isArchived: true, 
             archivedAt: new Date().toISOString(),
             archiveType: 'manual_archive' as const 
          } : h);
          setHabits(updatedHabits);
          persistData(updatedHabits, logs);
          return;
       } else if (choice?.toLowerCase() !== 'delete') {
          return;
       }
    } else {
       if (!confirm("Permanently delete this archived plant? This cannot be undone.")) return;
    }

    const updatedHabits = habits.filter((h) => h.id !== id);
    setHabits(updatedHabits);
    persistData(updatedHabits, logs);
  };

  const restoreArchivedHabit = (id: string, asNewSeed: boolean) => {
    let updatedHabits = [...habits];
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

    let changedHabit = habits.find(h => h.id === id);
    if (!changedHabit) return;

    let ownedFreezes = newExtraStats.boostItemCounts?.['boost_streak_freeze'] || 0;
    let usedFreeze = false;
    
    if (ownedFreezes > 0) {
      usedFreeze = true;
      newExtraStats.boostItemCounts = {
        ...newExtraStats.boostItemCounts,
        'boost_streak_freeze': ownedFreezes - 1
      };
      setExtraStats(newExtraStats);
    }

    const diff = changedHabit.difficulty || 'medium';
    let healthLoss = changedHabit.type === 'avoid' ? 20 : (diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25);
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

     let changedHabit = habits.find(h => h.id === id);
     if (!changedHabit) return;

     const diff = changedHabit.difficulty || 'medium';
     let healthGain = changedHabit.type === 'avoid' ? 20 : (diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25);
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
    const coinReward = diff === 'easy' ? 20 : diff === 'medium' ? 35 : diff === 'hard' ? 50 : 80;
    
    const newOrchard = [...(extraStats.orchard || [])];
    const fruitId = habit.plantType || 'Unknown';
    let existingIndex = newOrchard.findIndex(o => o.fruitId === fruitId && o.habitId === habit.id);
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

    let logsCopy = { ...logs };
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
    let diff = habit.difficulty || 'medium';
    let rawXpGain = diff === 'easy' ? 8 : diff === 'medium' ? 12 : 18;
    let xpGain = Math.ceil(rawXpGain / 2);

    let healthGain = diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25;
    if (habit.type === 'avoid') {
      healthGain = (habit.plantHealth ?? 100) < 100 ? 20 : 10;
    }

    // Recompute streak locally
    let newStreak = 0;
    let checkDate = new Date();
    // Count days backward from today
    while (true) {
        let dStr = format(checkDate, 'yyyy-MM-dd');
        if (dStr < creationDate) break;
        
        let completed = newLogs[dStr]?.includes(habit.id);
        let protectedDay = isHabitPaused(habit.id, dStr, activeRestMode);
        
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

    const updatedHabits = habits.map((h) => {
      if (h.id !== id) return h;

      if (h.type === 'avoid') {
         isProtectAction = true;
      }

      let newTotalCompletions =
        (h.totalCompletions || 0) + (isNowCompleted ? 1 : -1);
      newTotalCompletions = Math.max(0, newTotalCompletions);

      let diff = h.difficulty || 'medium';
      let xpGain = diff === 'easy' ? 8 : diff === 'medium' ? 12 : 18;
      
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

        let tempNewStreak = h.streak + 1;
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
      let newBestStreak = Math.max(h.bestStreak || 0, newStreak);

      let healthGain = diff === 'easy' ? 15 : diff === 'medium' ? 20 : 25;
      if (h.type === 'avoid') {
        healthGain = (h.plantHealth ?? 100) < 100 ? 20 : 10; // +20 if recovering, else +10
      }
      let newHealth = (h.plantHealth ?? 100) + (isNowCompleted ? healthGain : -healthGain);
      newHealth = Math.max(0, Math.min(100, newHealth));

      let newGraceDays = h.graceDays || 0;
      if (isNowCompleted && newStreak === 7) newGraceDays++;
      if (isNowCompleted && newStreak === 30) newGraceDays += 2;
      newGraceDays = Math.min(newGraceDays, 5);

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
        let diff = h.difficulty || 'medium';
        let baseAward = diff === 'easy' ? 2 : diff === 'medium' ? 4 : 6;
        
        let streakMultiplier = 1.0;
        const currentStreak = h.streak || 0;
        if (currentStreak >= 30) streakMultiplier = 2.0;
        else if (currentStreak >= 14) streakMultiplier = 1.5;
        else if (currentStreak >= 5) streakMultiplier = 1.2;
        
        baseCoinsDelta += Math.floor(baseAward * streakMultiplier);
        if (h.type === 'avoid') incResist++;
        
        if (h.plantStatus === 'Wilting' || h.plantStatus === 'Critical' || h.plantStatus === 'Dead') {
           bonusCoinsDelta += 10;
        }
      }
      if (isPerfectDayNow) {
        bonusCoinsDelta += 10;
        if (activeEvent && activeEvent.id === 'monsoon_festival') incRainy++;
      }
      
      const hr = new Date().getHours();
      if (hr >= 19 && hr < 22) incEvening++;
      if (hr >= 22 || hr < 5) incNight++;
      
    } else {
      const h = habits.find(h => h.id === id);
      if (h) {
        let diff = h.difficulty || 'medium';
        let baseAward = diff === 'easy' ? 2 : diff === 'medium' ? 4 : 6;
        
        let streakMultiplier = 1.0;
        const currentStreak = h.streak || 0;
        if (currentStreak >= 30) streakMultiplier = 2.0;
        else if (currentStreak >= 14) streakMultiplier = 1.5;
        else if (currentStreak >= 5) streakMultiplier = 1.2;
        
        baseCoinsDelta -= Math.floor(baseAward * streakMultiplier);

        if (h.plantStatus === 'Wilting' || h.plantStatus === 'Critical' || h.plantStatus === 'Dead') {
           bonusCoinsDelta -= 10;
        }
      }
    }
    
    // Process Active Event Quests
    let updatedEventProgress = eventProgress;
    let eventCompletedJustNow = false;
    let eventCoinsGained = 0;
    let eventXpGained = 0;
    let eventBadgeGained: string | null = null;
    let eventDecorationGained: string | null = null;

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

    let updatedChallenge = extraStats.activeChallenge ? { ...extraStats.activeChallenge } : null;
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
          challengeDailyBonus = 5; // daily challenge bonus
          bonusCoinsDelta += 5;
       }
    }

    let finalCoinsDelta = 0;
    let currentDailyCoins = newExtraStats.dailyCoinsEarned || 0;
    let lastReset = newExtraStats.lastCoinResetDate || dateKey;
    
    if (lastReset !== dateKey) {
       currentDailyCoins = 0;
       lastReset = dateKey;
    }
    
    if (baseCoinsDelta > 0) {
       let allowedBase = baseCoinsDelta;
       if (currentDailyCoins + allowedBase > 25) {
          allowedBase = Math.max(0, 25 - currentDailyCoins);
       }
       currentDailyCoins += allowedBase;
       finalCoinsDelta = allowedBase + bonusCoinsDelta;
    } else if (baseCoinsDelta < 0) {
       currentDailyCoins = Math.max(0, currentDailyCoins + baseCoinsDelta);
       finalCoinsDelta = baseCoinsDelta + bonusCoinsDelta;
    } else {
       finalCoinsDelta = bonusCoinsDelta;
    }
    
    let earnedCoins = finalCoinsDelta;

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
          lastCoinResetDate: lastReset,
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
    const currentCoins = extraStats.coins || 0;
    if (currentCoins < item.price) return;
    
    // Check required level
    if (item.requiredLevel && (extraStats.level || 1) < item.requiredLevel) {
       alert(`You need to be level ${item.requiredLevel} to buy this.`);
       return;
    }
    
    const now = new Date();
    
    // Check bounds for consumables
    if (item.isConsumable) {
       const currentCount = extraStats.boostItemCounts?.[item.id] || 0;
       if (item.maxCapacity && currentCount >= item.maxCapacity) {
          alert(`You can't carry more than ${item.maxCapacity} of ${item.name}.`);
          return;
       }
       
       if (item.cooldownHours) {
          const lastPurchases = extraStats.lastPurchaseDates || {};
          const lastDateStr = lastPurchases[item.id];
          if (lastDateStr) {
             const lastD = new Date(lastDateStr);
             const diffHours = (now.getTime() - lastD.getTime()) / (1000 * 60 * 60);
             if (diffHours < item.cooldownHours) {
                alert(`${item.name} is on cooldown. Try again later.`);
                return;
             }
          }
       }
    }
    
    let newExtraStats = { 
       ...extraStats, 
       coins: currentCoins - item.price,
       shopPurchasesCount: (extraStats.shopPurchasesCount || 0) + 1
    };
    
    if (item.isConsumable) {
       newExtraStats.boostItemCounts = {
          ...(newExtraStats.boostItemCounts || {}),
          [item.id]: (newExtraStats.boostItemCounts?.[item.id] || 0) + 1
       };
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
    let newExtraStats = { ...extraStats };
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

  // -- Render Logic --

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-28 transition-all relative">
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
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-card rounded-[32px] z-50 flex justify-between items-center px-6 text-xs font-medium text-muted-text overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab(Tab.TRACKER)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.TRACKER ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.PROGRESS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.PROGRESS ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <BarChart2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.SHOP)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SHOP ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <Store className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.CHALLENGES)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.CHALLENGES ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <Target className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.CALENDAR)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.CALENDAR ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <CalendarDays className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.PROFILE)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.PROFILE ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <UserIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.TROPHY)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.TROPHY ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <Archive className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab(Tab.SETTINGS)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.SETTINGS ? "text-primary-mint scale-110" : "hover:text-secondary-text"}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-28 glass border-r border-surface-alt flex-col items-center py-12 z-50">
        <div className="flex flex-col gap-10 w-full px-6 md:px-8 overflow-y-auto hidden-scrollbar">
          {[
            { id: Tab.TRACKER, icon: LayoutDashboard },
            { id: Tab.PROGRESS, icon: BarChart2 },
            { id: Tab.CHALLENGES, icon: Target },
            { id: Tab.SHOP, icon: Store },
            { id: Tab.CALENDAR, icon: CalendarDays },
            { id: Tab.PROFILE, icon: UserIcon },
            { id: Tab.STATS, icon: Activity },
            { id: Tab.REPORT, icon: FileText },
            { id: Tab.BADGES, icon: LucideIcons.Award },
            { id: Tab.TROPHY, icon: Archive },
            { id: Tab.SETTINGS, icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${activeTab === item.id ? "bg-primary-mint/10 text-status-healthy border border-primary-mint/20 shadow-sm" : "text-muted-text hover:text-secondary-text hover:bg-surface-alt/50"}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>

        {deferredPrompt && (
          <div className="mt-auto mb-4 w-full px-6 md:px-8">
            <button
              onClick={handleInstallClick}
              className="w-full aspect-square flex flex-col items-center justify-center gap-1 text-muted-text hover:text-status-healthy transition-colors rounded-2xl hover:bg-primary-mint/10"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 sm:px-8 sm:py-10 md:p-12 lg:p-16 min-h-screen">
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
                {activeTab === Tab.CHALLENGES && "Garden Challenges"}
                {activeTab === Tab.SHOP && "Garden Shop"}
                {activeTab === Tab.CALENDAR && "Garden Calendar"}
                {activeTab === Tab.PROFILE && "Gardener Profile"}
                {activeTab === Tab.STATS && "Garden Stats Overview"}
                {activeTab === Tab.REPORT && "Garden Reports"}
                {activeTab === Tab.BADGES && "Garden Badges"}
                {activeTab === Tab.TROPHY && "Trophy Garden"}
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
                      onClick={() => setActiveTab(Tab.REPORT)}
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
                   const existingAlmanac = extraStats.almanacs?.[year];
                   // Check eligibility - rough estimate if not yet generated
                   const count = Object.keys(logs).filter(k => k.startsWith(year + '-')).length;
                   if (count >= 10 || existingAlmanac) {
                      return (
                        <div 
                          onClick={() => {
                             setCurrentAlmanacYear(year);
                             setShowAlmanac(true);
                          }}
                          className="w-full max-w-sm mb-6 p-4 rounded-none bg-gradient-to-r from-emerald-900 to-[#000428] border border-emerald-500/30 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <LucideIcons.BookOpen className="w-5 h-5 text-emerald-400" />
                             </div>
                             <div>
                                <h3 className="text-white font-bold font-display text-lg">Your {year} Garden Almanac is ready</h3>
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
                  habits={[...activeHabitsList].sort((a, b) => {
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
                  })}
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
                  onWaterPlant={(id) => toggleHabit(id)}
                  onSlipHabit={handleSlipHabit}
                  onUndoSlip={undoSlipHabit}
                  onAddHabit={() => setShowAddForm(true)}
                  isPerfectDayNow={isPerfectDayNowTopLevel}
                  onDeletePlant={deleteHabit}
                  onHarvestPlant={handleHarvestPlant}
                  onOpenOrchard={() => setShowOrchard(true)}
                  onBackdate={handleBackdate}
                />

                <HabitForm
                  isOpen={showAddForm}
                  userMaxStreak={Math.max(0, ...habits.map((h) => h.bestStreak || 0))}
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
                    {(categoryFilter === 'all' ? habits : habits.filter(h => h.category === categoryFilter)).map((habit) => (
                      <div
                        key={habit.id}
                        className="flex flex-col items-center p-4 bg-surface-card border border-surface-alt rounded-2xl hover:border-primary-mint transition-all group shadow-sm"
                      >
                        <div className="w-12 h-12 text-5xl mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} health={habit.plantHealth} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className="w-12 h-12" />
                        </div>
                        <h3 className="text-sm font-bold text-primary-text font-display text-center capitalize mb-1">
                          {habit.type === 'avoid' && habit.isPrivate ? 'Protected' : habit.name}
                        </h3>
                        <div className="text-[10px] text-status-needsCare font-bold flex items-center justify-center gap-1 mt-1 w-full">
                          <Flame className="w-3.5 h-3.5" />
                          Streak: {habit.streak} days
                        </div>
                        <div className="text-[10px] text-secondary-text font-bold text-center w-full mt-1">
                          Status: {habit.plantStatus || 'Healthy'}
                        </div>
                      </div>
                    ))}
                  </div>
                  {(categoryFilter === 'all' ? habits : habits.filter(h => h.category === categoryFilter)).length === 0 && (
                    <div className="text-center text-muted-text text-sm py-10 font-bold uppercase tracking-wide">
                      Your garden is empty. Plant a new seed today.
                    </div>
                  )}
                </div>

                <Heatmap logs={logs} />
                <ProgressChart logs={logs} habits={habits} />
              </div>
            )}

            {activeTab === Tab.PROFILE && (
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

                {/* Companions Album Showcase */}
                <div className="bg-surface-soft p-8 rounded-[32px] border border-surface-alt relative mt-8 shadow-sm">
                  <h3 className="text-xl font-display font-bold text-primary-text mb-1 flex items-center gap-2">
                    Garden Companions
                  </h3>
                  <p className="text-sm font-bold tracking-wide text-status-healthy uppercase mb-8">
                    {extraStats.companions?.length || 0} / {COMPANIONS.length} Discovered
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {COMPANIONS.map(comp => {
                      const isUnlocked = extraStats.companions?.some(c => c.id === comp.id);
                      return (
                        <div key={comp.id} className={`p-4 rounded-xl border ${isUnlocked ? 'border-primary-mint/50 bg-primary-mint/10' : 'border-surface-alt bg-surface-alt/50 opacity-60'} flex flex-col items-center text-center transition-all`}>
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 ${isUnlocked ? 'bg-surface-card text-2xl shadow-sm' : 'bg-surface-alt text-xl grayscale'}`}>
                            {isUnlocked ? '🐦‍⬛' : '❓'}
                          </div>
                          <h4 className="font-bold text-primary-text text-sm mb-0.5">{isUnlocked ? comp.name : '???'}</h4>
                          <h5 className="font-bold text-[10px] text-status-healthy mb-2 uppercase">{isUnlocked ? comp.banglaName : 'Unknown'}</h5>
                          <p className="text-[11px] text-secondary-text leading-tight">
                            {isUnlocked ? `Unlocked: ${comp.unlockConditionStr}` : 'Condition locked'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === Tab.CHALLENGES && (
              <ChallengesView 
                 habits={activeHabitsList}
                 stats={stats}
                 onJoinChallenge={handleJoinChallenge}
                 onQuitChallenge={handleQuitChallenge}
                 onClaimChallengeReward={handleClaimChallengeReward}
              />
            )}

            {activeTab === Tab.SHOP && (
              <GardenShop 
                 stats={stats}
                 onBuyItem={handleBuyItem}
                 onEquipItem={handleEquipItem}
              />
            )}

            {activeTab === Tab.STATS && (
              <SimpleGardenStatsDashboard
                 habits={habits}
                 logs={logs}
                 stats={stats}
                 setActiveTab={setActiveTab}
                 userName={user?.displayName || "Gardener"}
              />
            )}

            {activeTab === Tab.REPORT && (
              <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-surface-alt/5 border border-surface-alt w-fit">
                   <button 
                     onClick={() => setReportViewMode('weekly')}
                     className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-colors ${reportViewMode === 'weekly' ? 'bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20' : 'text-slate-400 hover:text-white border border-transparent'}`}
                   >
                     Weekly Report
                   </button>
                   <button 
                     onClick={() => setReportViewMode('monthly')}
                     className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-colors ${reportViewMode === 'monthly' ? 'bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20' : 'text-slate-400 hover:text-white border border-transparent'}`}
                   >
                     Monthly Report
                   </button>
                </div>
                {reportViewMode === 'weekly' ? (
                  <WeeklyReportView 
                     logs={logs} 
                     habits={habits} // Keep all for historical
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

            {activeTab === Tab.BADGES && (
              <GardenBadgesView stats={stats} />
            )}

            {activeTab === Tab.TROPHY && (
              <GardenHistoryView 
                archivedHabits={habits.filter(h => h.isArchived)} 
                onRestore={restoreArchivedHabit}
                onDeletePermanently={(id) => deleteHabit(id, true)}
                onUpdateNote={updateArchiveNote}
              />
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
                      <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wide">
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
                        <h3 className="text-white font-bold text-sm">Simple Garden Mode</h3>
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
                        <h3 className="text-white font-bold text-sm">Vibration Effects</h3>
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
                           <h3 className="text-white font-bold text-sm">Evening Garden Summary</h3>
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
                           className="bg-transparent border border-surface-alt text-white font-mono text-sm px-2 py-1 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                         />
                       </div>
                     )}
                  </div>

                  {/* Daily Reminder Block */}
                  <div className="bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6 flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-white font-bold text-sm text-balance">Daily Quick Reminder</h3>
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
                           className="bg-transparent border border-surface-alt text-white font-mono text-sm px-2 py-1 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                         />
                       </div>
                     )}
                  </div>

                  <div className="flex items-center justify-between bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6">
                     <div>
                        <h3 className="text-white font-bold text-sm">Garden Matches Time of Day</h3>
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
                        <h3 className="text-white font-bold text-sm">Completion Sound Cue</h3>
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
                        className="bg-[#0d1017] border border-surface-alt text-white font-mono text-xs px-3 py-2 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
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

                  <div className="flex flex-col gap-3 bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6">
                     <div>
                        <h3 className="text-white font-bold text-sm">Accent Color Theme</h3>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Personalize your primary color</p>
                     </div>
                     <div className="flex items-center gap-3">
                        {[
                           { name: 'Mint', value: '143 207 173', hex: '#8FCFAD' },
                           { name: 'Rose', value: '251 113 133', hex: '#fb7185' },
                           { name: 'Cyan', value: '34 211 238', hex: '#22d3ee' },
                           { name: 'Amber', value: '251 191 36', hex: '#fbbf24' },
                           { name: 'Purple', value: '192 132 252', hex: '#c084fc' }
                        ].map((color) => (
                           <button
                              key={color.name}
                              onClick={() => {
                                 const newStats = { ...extraStats, accentColor: color.value };
                                 document.documentElement.style.setProperty('--primary-mint', color.value);
                                 setExtraStats(newStats);
                                 persistData(habits, logs, newStats);
                              }}
                              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                                 (extraStats.accentColor || '143 207 173') === color.value 
                                    ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                                    : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                           >
                              {(extraStats.accentColor || '143 207 173') === color.value && (
                                 <Check className="w-4 h-4 text-white drop-shadow-md" />
                              )}
                           </button>
                        ))}
                     </div>
                  </div>

                   {/* Recently Unlocked Badges */}
                   {extraStats.unlockedBadgeIds && Object.keys(extraStats.unlockedBadgeIds).length > 0 && (
                      <div className="bg-surface-alt/5 p-4 rounded-none border border-emerald-500/10 mb-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                         <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-2">
                               <LucideIcons.Award className="w-4 h-4 text-emerald-400" />
                               <h3 className="text-white font-bold text-sm">Recently Unlocked Badges</h3>
                            </div>
                            <button onClick={() => setActiveTab(Tab.BADGES)} className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] hover:text-[#00d8b9] transition-colors">
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
                                          <p className="text-white font-bold text-sm truncate">{badge.title}</p>
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
                           <h3 className="text-white font-bold text-sm">Garden Almanacs</h3>
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
                                 <span className="text-white font-display font-bold">{a.year}</span>
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

                <div className="glass p-8 rounded-none border border-surface-alt relative">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-[#00F5D4] mb-4">
                    SYSTEM SETTINGS
                  </h2>
                  <p className="text-slate-500 font-mono text-[10px] leading-relaxed uppercase tracking-wider">
                    Version 3.2
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
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors z-20 hover:bg-white/5 rounded-full"
                 >
                    <Check className="w-5 h-5" />
                 </button>
              </div>
           )}
        </AnimatedModal>
        
        {toastMessage && (
           <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#0d1017] border border-[#00F5D4]/50 shadow-[0_10px_40px_rgba(0,245,212,0.2)] text-[#00F5D4] px-6 py-3 rounded-full font-mono text-[11px] font-bold tracking-widest flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
               {toastMessage}
           </div>
        )}
      </main>
    </div>
  );
}

export default App;
