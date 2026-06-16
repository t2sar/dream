/**
 * UNLOCK ENGINE SERVICE
 * 
 * Provides robust, anti-mass-unlock logic, time-gated tier cooldowns, 
 * single-milestone locks, and streak preservation tracking for Shop Items
 * (Plants, Companions, Decorations, Pots, and Fences).
 * 
 * Strictly contains logic, validation checks, schemas, and transaction updates.
 * NO UI layout code or SVG elements are generated.
 */

import { UserStats, ShopItem } from '../types';

/**
 * 1. DATA SCHEMA TIERING DEFINITIONS
 */

export enum ItemTier {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface UnlockCondition {
  /**
   * The minimum streak needed to make the item eligible for unlocking.
   */
  requiredStreakDays: number;
  
  /**
   * The classification of the rarity/value tier of the item.
   */
  itemTier: ItemTier;
  
  /**
   * Time in hours that must pass before any other item of any tier
   * (or same tier) can be unlocked. Enforces the Tier Global Cooldown.
   */
  cooldownPeriodHours: number;
}

/**
 * Extended ShopItem schema reflecting the new unlock engine conditions.
 */
export interface TieredShopItem extends ShopItem {
  unlockCondition?: UnlockCondition;
}

/**
 * User Statistics additions mapped securely to the Firestore UserProfile profile object.
 */
export interface UserUnlockProfile {
  /**
   * List of specific milestone streak values that have already been 'Spent' 
   * in the current streak cycle to claim an item.
   * E.g., [7] means the 7-day milestone is spent and cannot be reused.
   */
  spentStreakMilestones?: number[];

  /**
   * Universal timestamp of the most recent item unlock across the entire shop.
   * ISO 8601 String format.
   */
  lastItemUnlockTimestamp?: string;

  /**
   * The specific time until which the shop is fully locked down due to cooldown.
   * ISO 8601 String format.
   */
  shopLockoutUntil?: string;

  /**
   * The tier of the last unlocked item which triggered the current lockout.
   */
  lastUnlockedTier?: ItemTier;

  /**
   * Permanently unlocked/purchased item IDs. This continues to persist 
   * even if streaks are broken, ensuring they are never locked again.
   */
  unlockedItemIds?: string[];
}

/**
 * Helper to cast standard UserStats with our new unlock fields securely.
 */
export type UserStatsWithUnlock = UserStats & UserUnlockProfile;

/**
 * 2. CORE LOGIC ENGINE CLASS
 */
export class UnlockEngine {
  
  /**
   * Determines if a user meets all criteria to unlock a specific tiered shop item.
   * Enforces Rule A (Milestone Lock) and Rule B (Global Tier Cooldown).
   */
  public static canUserUnlockItem(
    user: UserStatsWithUnlock, 
    item: TieredShopItem
  ): { canUnlock: boolean; reason?: string } {
    const unlockedList = user.unlockedItemIds || user.ownedItemIds || [];
    
    // Safety check: already unlocked items do not need to be unlocked again
    if (unlockedList.includes(item.id)) {
      return { canUnlock: false, reason: 'Item is already unlocked.' };
    }

    // Default items without explicit unlock conditions are always purchaseable/unlockable
    if (!item.unlockCondition) {
      return { canUnlock: true };
    }

    const { requiredStreakDays, itemTier, cooldownPeriodHours } = item.unlockCondition;
    const currentStreak = user.dailyGardenStreak || 0;

    // --- RULE B: Check Global Cooldown / Lockout Period ---
    if (user.shopLockoutUntil) {
      const lockoutTime = new Date(user.shopLockoutUntil).getTime();
      const currentTime = Date.now();
      
      if (currentTime < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - currentTime) / (1000 * 60));
        const hours = Math.floor(remainingMinutes / 60);
        const mins = remainingMinutes % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        return { 
          canUnlock: false, 
          reason: `Shop is on cooldown. Next unlock available in ${timeStr} due to a recent ${user.lastUnlockedTier || 'high-tier'} unlock.` 
        };
      }
    }

    // --- CHECK ELIGIBILITY STREAK DECREE ---
    if (currentStreak < requiredStreakDays) {
      return { 
        canUnlock: false, 
        reason: `Requires an active streak of ${requiredStreakDays} days (Current: ${currentStreak} days).` 
      };
    }

    // --- RULE A: The Milestone Lock (One Unlock Per Milestone Instance) ---
    const spentMilestones = user.spentStreakMilestones || [];
    if (spentMilestones.includes(requiredStreakDays)) {
      return { 
        canUnlock: false, 
        reason: `The ${requiredStreakDays}-day streak milestone has already been spent on this cycle. Rebuild your streak to claim another milestone.` 
      };
    }

    // All validation guards passed successfully
    return { canUnlock: true };
  }

  /**
   * Commits an item unlock transaction, writing to the profile's timestamp,
   * tracking spent milestones, and calculating the tier-specific lockout cooldown.
   */
  public static processItemUnlock(
    user: UserStatsWithUnlock, 
    item: TieredShopItem
  ): { updatedStats: UserStatsWithUnlock; success: boolean; error?: string } {
    
    // 1. Run eligibility validation guard first
    const validation = this.canUserUnlockItem(user, item);
    if (!validation.canUnlock) {
      return { 
        updatedStats: user, 
        success: false, 
        error: validation.reason || 'Unlock criteria not met.' 
      };
    }

    const now = new Date();
    const updatedStats = { ...user };

    // Initialize collections securely if missing
    const currentUnlocked = [...(user.unlockedItemIds || user.ownedItemIds || [])];
    const spentMilestones = [...(user.spentStreakMilestones || [])];

    // Add item to permanently unlocked list
    if (!currentUnlocked.includes(item.id)) {
      currentUnlocked.push(item.id);
    }
    updatedStats.unlockedItemIds = currentUnlocked;
    updatedStats.ownedItemIds = currentUnlocked; // Keep synced with legacy owned list

    if (item.unlockCondition) {
      const { requiredStreakDays, itemTier, cooldownPeriodHours } = item.unlockCondition;

      // 2. Consume/Spend the Milestone for this active streak cycle
      if (requiredStreakDays > 0 && !spentMilestones.includes(requiredStreakDays)) {
        spentMilestones.push(requiredStreakDays);
      }
      updatedStats.spentStreakMilestones = spentMilestones;

      // 3. Impose the Global Tier Cooldown lockout period
      const lockoutEndTime = new Date(now.getTime() + cooldownPeriodHours * 60 * 60 * 1000);
      
      updatedStats.lastItemUnlockTimestamp = now.toISOString();
      updatedStats.shopLockoutUntil = lockoutEndTime.toISOString();
      updatedStats.lastUnlockedTier = itemTier;
    }

    return {
      updatedStats,
      success: true
    };
  }

  /**
   * 3. STREAK BREAK / PRESERVATION LOGIC
   * 
   * Call this when validating habit streak completion or daily reset routines.
   * If the user's active streak drops or breaks:
   *  - PRESERVES permanently unlocked items (they are never lost!).
   *  - RESETS spent milestones that are higher than the new streak or cleans up
   *    stale spent markers, forcing the user to build up their active streak again to lock/unlock others.
   */
  public static handleStreakChange(
    user: UserStatsWithUnlock, 
    newStreak: number
  ): UserStatsWithUnlock {
    const updatedStats = { ...user };
    
    // Ensure active streak is updated in general user stats
    updatedStats.dailyGardenStreak = newStreak;

    // Reset ofspent / milestone lock flags:
    if (newStreak === 0) {
      // Complete reset of active streak - clearspent milestones so they can all be claimed again
      // when building the streak back up.
      updatedStats.spentStreakMilestones = [];
    } else {
      // If streak simply reduced or shifted, filter out milestones that are now inaccessible
      // or maintain lower-level milestones as spent.
      const currentSpent = user.spentStreakMilestones || [];
      // Clean up milestones higher than the new current streak (they are no longer active)
      updatedStats.spentStreakMilestones = currentSpent.filter(m => m <= newStreak);
    }

    return updatedStats;
  }
}
