export type PlantStage = 'Seed' | 'Sprout' | 'Small Plant' | 'Young Plant' | 'Mature Plant' | 'Fruiting Plant';
export type PlantHealthStatus = 'Healthy' | 'Normal' | 'Wilting' | 'Critical' | 'Dead' | 'Resting';

export enum RestModeType {
  REST_DAY = 'rest_day',
  VACATION = 'vacation',
  SICK = 'sick',
  EXAM = 'exam',
  FAMILY_EMERGENCY = 'family_emergency',
  CUSTOM_PAUSE = 'custom_pause',
}

export enum RestScopeType {
  ONE_HABIT = 'one_habit',
  SELECTED_HABITS = 'selected_habits',
  ALL_HABITS = 'all_habits',
}

export interface RestMode {
  id: string;
  modeType: RestModeType;
  scopeType: RestScopeType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  endedAt?: string;
  reasonLabel?: string;
  notes?: string;
  reminderBehavior?: 'pause' | 'keep_essential' | 'keep_all';
  streakBehavior?: 'freeze' | 'keep_only_completed' | 'reset';
  privacyMode?: 'private' | 'shared' | 'accountability_only';
  habitIds?: string[]; // Empty if all habits. Specific habit IDs for selected ones
}

export type PlantType = 
  | 'Mango / Aam'
  | 'Jackfruit / Kathal'
  | 'Banana / Kola'
  | 'Coconut / Narikel'
  | 'Guava / Peyara'
  | 'Litchi / Lichu'
  | 'Papaya / Pepe'
  | 'Pineapple / Anaros'
  | 'Strawberry'
  | 'Asian Palmyra Palm / Taal'
  | 'Black Plum / Jam'
  | 'Jujube / Boroi'
  | 'Hog Plum / Amra'
  | 'Wood Apple / Bel'
  | 'Star Fruit / Kamranga'
  | 'Indian Gooseberry / Amloki'
  | 'Lemon / Lebu'
  | 'Orange / Komola'
  | 'Pomegranate / Dalim'
  | 'Custard Apple / Ata'
  | 'Watermelon / Tormuj'
  | 'Melon / Bangi'
  | 'Date Palm / Khejur'
  | 'Tamarind / Tetul'
  | 'Indian Olive / Jolpai'
  | 'Burmese Grape / Lotkon'
  | 'Elephant Apple / Chalta'
  | 'Monkey Jack / Deua'
  | 'Wax Apple / Jamrul'
  | 'Rose Apple / Golap Jam'
  | 'Sapodilla / Sofeda'
  | 'Pomelo / Batabi Lebu'
  | 'Malta / Malta'
  | 'Dragon Fruit / Dragon Fol'
  | 'Rambutan / Rambutan'
  | 'Longan / Ashfol'
  | 'Grape / Angur'
  | 'Fig / Dumur'
  | 'Mulberry / Toot Fol'
  | 'Bengal Currant / Karamcha'
  | 'Phalsa / Falsa'
  | 'Passion Fruit / Passion Fol'
  | 'Avocado / Avocado'
  | 'Bilimbi / Bilimbi'
  | 'Cashew Fruit / Kaju Fol'
  | 'Breadfruit / Ruti Fol'
  | 'Indian Persimmon / Gab';

export type HabitCategory = 
  | 'health' | 'fitness' | 'study' | 'work' | 'sleep' 
  | 'prayer_spiritual' | 'mindfulness' | 'finance' | 'family' 
  | 'home' | 'reading' | 'creativity' | 'social' | 'self_care' 
  | 'bad_habit_control' | 'personal_growth' | 'food_nutrition' 
  | 'hydration' | 'custom' | string;

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  icon: string;
  streak: number;
  bestStreak?: number;
  totalCompletions?: number;
  plantType?: PlantType;
  plantStage?: PlantStage;
  plantHealth?: number;
  plantStatus?: PlantHealthStatus;
  difficulty?: 'easy' | 'medium' | 'hard';
  xp?: number;
  lastMissCheckedDate?: string;
  lastHarvestStreak?: number;
  graceDays?: number;
  createdAt: string;
  creationDate?: string;
  type?: 'build' | 'avoid';
  replacementAction?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  archiveType?: ArchiveType;
  archiveNote?: string;
  isLegendary?: boolean;
  legendaryDate?: string;
  isRevived?: boolean;
  revivalDate?: string;
  revivalCount?: number;
  totalScheduledCount?: number;
  isFreshStart?: boolean;
  isGolden?: boolean;
  
  // Flexible Scheduling
  scheduleType?: 'daily' | 'specific_days' | 'times_per_week' | 'weekly' | 'monthly' | 'custom_interval' | 'quantity' | 'anytime';
  scheduleDays?: number[]; // 0=Sun, 1=Mon, etc. for specific_days
  targetCount?: number; // for times_per_week
  monthlyDay?: number; // for monthly
  intervalValue?: number; // for custom_interval
  intervalUnit?: 'days' | 'weeks' | 'months'; // for custom_interval
  quantityTarget?: number; // for quantity
  quantityUnit?: string; // for quantity
  snoozedDates?: string[]; // tracks dates where the habit was snoozed
}

export interface HabitLog {
  [date: string]: string[]; // Date string (YYYY-MM-DD) -> Array of completed Habit IDs
}

export interface CompanionUnlock {
  id: string;
  unlockedAt: string;
}

export interface OrchardEntry {
  fruitId: string;
  habitId: string;
  count: number;
  firstHarvest: string;
  lastHarvest: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface UserMotivation {
  id: string;
  quote_text: string;
  author?: string;
  created_at: string;
}

export interface UserStats {
  xp: number;
  level: number;
  totalHabitsCompleted: number;
  rank?: string;
  perfectGardenDays?: number;
  plantsRevived?: number;
  dailyGardenStreak?: number;
  bestDailyGardenStreak?: number;
  coins?: number;
  badges?: string[];
  decorations?: string[];
  customCategories?: CustomCategory[];
  eventProgress?: UserEventProgress;
  activeChallenge?: ActiveChallenge | null;
  challengeHistory?: ActiveChallenge[];
  ownedItemIds?: string[];
  equippedBackgroundId?: string;
  equippedPotId?: string;
  equippedFenceId?: string;
  equippedLeftDecorId?: string;
  equippedRightDecorId?: string;
  equippedSeasonalDecorId?: string;
  anchorSlots?: Record<string, string | null>;
  isSimpleMode?: boolean;
  boostItemCounts?: Record<string, number>;
  claimedRewardIds?: string[];
  slipLogs?: Record<string, { id: string, reason?: string, time?: string }[]>;
  companions?: CompanionUnlock[];
  activeCompanionId?: string;
  eveningCompletions?: number;
  nightCompletions?: number;
  rainySeasonCompletions?: number;
  badHabitResists?: number;
  orchard?: OrchardEntry[];
  backdatesUsedThisWeek?: number;
  backdateWeekStart?: string;
  backdatedLogs?: Record<string, string[]>; // dateKey -> habitIds
  lastCoinResetDate?: string; // tracks daily reset for coins
  dailyCoinsEarned?: number; // caps daily coins to balance economy
  lastPurchaseDates?: Record<string, string>; // tracks cooldowns for shop items
  hapticsEnabled?: boolean;
  eveningSummaryEnabled?: boolean;
  eveningSummaryTime?: string; // e.g., '21:00'
  quietHoursStart?: string;
  quietHoursEnd?: string;
  monthlyReports?: Record<string, MonthlyGardenReport>; // key is YYYY-MM
  almanacs?: Record<string, AlmanacData>; // key is YYYY
  melodyBoostUntil?: string; // date string or ISO
  quantityLogs?: Record<string, Record<string, number>>; // dateKey -> habitId -> amount
  // Gardener's Streak
  lastLoginDate?: string;
  currentLoginStreak?: number;
  lastPerfectDate?: string;
  currentPerfectStreak?: number;
  lastMailboxGiftDate?: string;
  completionSound?: 'chime' | 'droplet' | 'pop' | 'none'; // New setting
  dailyReminderEnabled?: boolean;
  dailyReminderTime?: string; // e.g., '09:00'
  accentColor?: string; // e.g. '#8FCFAD'
  themeId?: string; // e.g. 'cream_butter'
  cornerRoundness?: 'sharp' | 'medium' | 'soft';
  borderStyle?: 'invisible' | 'subtle' | 'solid' | 'neon';
  streakFreezes?: number;
  // Achievement fields
  habitsCreatedCount?: number;
  challengesCompletedCount?: number;
  questsCompletedCount?: number;
  shopPurchasesCount?: number;
  plantsFruitedCount?: number;
  hardHabitsCompletedCount?: number;
  unlockedBadgeIds?: Record<string, { unlockedAt: string, rewardClaimed: boolean }>;
  
  // Custom Motivations
  motivations?: UserMotivation[];
  motivationFrequencyLimit?: number; // 1, 3, 5, or -1 for unlimited
  motivationsShownToday?: number;
  lastMotivationDate?: string;
  lastWeeklyCelebrationWeek?: string;
}

export interface AchievementBadge {
  badgeId: string;
  title: string;
  description: string;
  category: 'Starter' | 'Streak' | 'Plant' | 'Recovery' | 'Daily Garden' | 'Challenge' | 'Level';
  iconName: string;
  conditionType: 'habit_created_count' | 'habit_completed_count' | 'streak_reached' | 'perfect_garden_days' | 'plant_fruiting_count' | 'plant_saved_count' | 'challenge_completed_count' | 'quest_completed_count' | 'level_reached' | 'shop_purchase_count';
  targetValue: number;
  rewardXP: number;
  rewardCoins: number;
}


export interface AlmanacData {
  year: string;
  totalCheckins: number;
  bestStreak: { days: number; habitName: string; icon: string };
  topHabit: { name: string; fruit: string; count: number; icon: string; summaryText?: string };
  rhythm: { label: string; percent: number; busiestMonth: string };
  harvest: { plantsGrown: number; harvests: number; badges: number; companions: number };
  comebacks: number;
  computedAt: string;
}

export interface MonthlyGardenReport {
  id: string;
  monthKey: string; // YYYY-MM
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  generatedAt: string;
  updatedAt: string;
  isFinalized: boolean;
  totalScheduledInstances: number;
  totalCompletedInstances: number;
  totalMissedInstances: number;
  totalPausedInstances: number;
  completionPercentage: number;
  perfectGardenDays: number;
  restDays: number;
  averageGardenHealth: number;
  startingGardenHealth: number;
  endingGardenHealth: number;
  xpEarned: number;
  coinsEarned: number;
  coinsSpent: number;
  plantsGrownCount: number;
  plantsRecoveredCount: number;
  plantsRestartedCount: number;
  plantsDeadCount: number;
  bestHabitId?: string;
  habitNeedingCareId?: string;
  bestCategoryId?: string;
  categoryNeedingCareId?: string;
  bestStreakHabitId?: string;
  bestStreakCount: number;
  bestStreakType?: string;
  nextMonthFocusType?: string;
  nextMonthFocusHabitId?: string;
  nextMonthFocusCategoryId?: string;
  summaryLabel: string;
  supportiveMessage: string;
}

export type ShopItemCategory = 'pot' | 'decoration' | 'background' | 'boost' | 'fence' | 'seasonal' | 'seed';

export type ShopItemTier = 1 | 2 | 3;

export interface ShopItem {
  id: string;
  name: string;
  type: ShopItemCategory;
  price: number; // Auto-calculated via engine, but required at runtime
  description: string;
  iconName: string; // e.g., 'Leaf', 'Sun', etc., or custom SVG rendering trigger
  isConsumable?: boolean;
  requiredLevel?: number; // Auto-calculated if tier is present
  maxCapacity?: number;
  cooldownHours?: number;
  tier?: ShopItemTier;
  isSale?: boolean;
  rarity?: 'Common' | 'Rare' | 'Legendary';
}

export type EventQuestType = 'water_plants' | 'complete_habit' | 'perfect_day' | 'save_wilting' | 'create_habit';

export interface EventQuest {
  id: string;
  title: string;
  description: string;
  requiredCount: number;
  type: EventQuestType;
  targetCategory?: HabitCategory;
  targetDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface SeasonalEvent {
  id: string;
  name: string;
  theme: string;
  description: string;
  startDate: string; // ISO MM-DD
  endDate: string; // ISO MM-DD
  quests: EventQuest[];
  rewardXP: number;
  rewardCoins: number;
  rewardBadgeId: string;
  rewardDecorationId: string;
  isOptional?: boolean;
}

export interface UserEventProgress {
  eventId: string;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  rewardClaimed: boolean;
  questProgress: Record<string, number>;
}

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'not_started' | 'active' | 'completed' | 'failed';

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  category: HabitCategory | 'all' | 'recovery';
  durationDays: number;
  requiredCompletionDays: number;
  difficulty: ChallengeDifficulty;
  rewardXP: number;
  rewardCoins: number;
  rewardBadgeId?: string;
  suggestedHabitName?: string;
  suggestedPlantOptions?: string[];
}

export interface ActiveChallenge {
  id: string; // unique instance ID
  templateId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  linkedHabitId?: string;
  linkedCategory?: HabitCategory | 'all' | 'recovery';
  completedDates: string[]; // List of YYYY-MM-DD
  status: ChallengeStatus;
}

export enum Tab {
  TRACKER = 'tracker',
  PROGRESS = 'progress',
  CHALLENGES = 'challenges',
  CALENDAR = 'calendar',
  SHOP = 'shop',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  REPORT = 'report',
  STATS = 'stats',
  TROPHY = 'trophy',
  BADGES = 'badges',
}

export type ArchiveType = 
  | 'completed_plant'
  | 'archived_plant'
  | 'revived_plant'
  | 'fresh_start_plant'
  | 'legendary_plant'
  | 'restarted_plant'
  | 'challenge_completed_plant'
  | 'fruiting_plant'
  | 'protected_avoid_plant'
  | 'completed_goal'
  | 'completed_challenge'
  | 'retired_habit'
  | 'paused_long_term'
  | 'restarted_as_new_seed'
  | 'no_longer_needed'
  | 'manual_archive'
  | 'inactive_cleanup';

export interface DashboardHighlight {
  id: string;
  periodType: 'this_week' | 'this_month' | 'all_time';
  eventType: 'streak_milestone' | 'plant_grew' | 'plant_recovered' | 'perfect_garden_day' | 'coins_earned' | 'xp_milestone' | 'badge_unlocked' | 'trophy_added' | 'legendary_plant' | 'recovery_completed';
  habitId?: string;
  plantTypeId?: string;
  title: string;
  subtitle: string;
  date: string;
  isSensitive: boolean;
  priorityScore: number;
}

export interface SimpleStatsDashboardSummary {
  id: string;
  periodType: 'this_week' | 'this_month' | 'all_time';
  periodStartDate: string;
  periodEndDate: string;
  generatedAt: string;
  updatedAt: string;
  totalHabitsCompleted: number;
  totalPlantCareActions: number;
  buildHabitCompletions: number;
  avoidHabitProtections: number;
  currentBestStreak: number;
  currentBestStreakHabitId?: string;
  currentBestStreakType?: 'daily' | 'weekly' | 'monthly' | 'scheduled';
  bestCategoryId?: string;
  bestCategoryCompletionPercentage: number;
  gardenHealthScore: number;
  gardenHealthLabel: 'Excellent' | 'Healthy' | 'Needs Care' | 'Wilting' | 'Critical';
  xpEarned: number;
  coinsEarned: number;
  currentCoinBalance: number;
  plantsGrownCount: number;
  plantsRecoveredCount: number;
  perfectGardenDays: number;
  restDays: number;
  trophyPlantsAdded: number;
  legendaryPlantsCount: number;
  strongestPlantHabitId?: string;
  mostImprovedHabitId?: string;
  suggestionType?: string;
  suggestionHabitId?: string;
  suggestionText?: string;
}

export interface DashboardSettings {
  dashboardEnabled: boolean;
  defaultPeriod: 'this_week' | 'this_month' | 'all_time';
  showSensitiveHabitNames: boolean;
  showGardenHealth: boolean;
  showCoins: boolean;
  showXP: boolean;
  showSuggestions: boolean;
  showRecentHighlights: boolean;
  maxHighlightCards: number;
  refreshDashboardOnAppOpen: boolean;
  useCachedDashboardOnly: boolean;
}
