// Secure Virtual Economy Calculation Engine
import { UserStats, ShopItem, Habit } from './types';

// Constants
export const BASE_DAILY_COIN_CAP = 1000;
export const MAX_DAILY_COIN_CAP = 5000;
export const FAMINE_COIN_THRESHOLD = 50; 
export const FAMINE_RECOVERY_BONUS = 150;

/**
 * Calculates a dynamic daily coin cap based on the user's highest active streak.
 * This prevents hyperinflation by capping rapid-fire completion of temporary habits.
 */
export function calculateDailyCoinCap(habits: Habit[], userLevel: number): number {
    let highestStreak = 0;
    habits.forEach(habit => {
        if (!habit.isArchived && habit.streak && habit.streak > highestStreak) {
            highestStreak = habit.streak;
        }
    });

    const tierBonus = Math.floor(highestStreak / 7) * 200; 
    const levelBonus = (userLevel || 1) * 50;
    
    return Math.min(BASE_DAILY_COIN_CAP + tierBonus + levelBonus, MAX_DAILY_COIN_CAP);
}

/**
 * Validates daily reset for coins, including famine recovery logic.
 * Returns updated extraStats fields if a reset occurred.
 */
export function processDailyEconomyReset(extraStats: Partial<UserStats>): Partial<UserStats> | null {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastReset = extraStats.lastCoinResetDate;
    
    if (lastReset !== todayStr) {
        const updates: Partial<UserStats> = {
            lastCoinResetDate: todayStr,
            dailyCoinsEarned: 0
        };

        // Famine Recovery: If the user is soft-locked with almost 0 coins, give them a baseline to recover.
        const currentCoins = extraStats.coins || 0;
        if (currentCoins < FAMINE_COIN_THRESHOLD) {
            updates.coins = currentCoins + FAMINE_RECOVERY_BONUS;
        }
        
        return updates;
    }
    
    return null;
}

/**
 * Determines if the user can earn coins, preventing farming exploits.
 * Returns the actual amount of coins they are allowed to earn, given their cap.
 */
export function calculateSecureCoinReward(requestedCoins: number, extraStats: Partial<UserStats>, dynamicCap: number): number {
    const todayEarned = extraStats.dailyCoinsEarned || 0;
    
    if (todayEarned >= dynamicCap) {
        return 0; // Cap reached, no more coins today
    }
    
    const allowedEarnings = Math.min(requestedCoins, dynamicCap - todayEarned);
    return allowedEarnings;
}

/**
 * Validates a purchase request robustly.
 * Returns an error string if invalid, or null if valid.
 */
export function validatePurchase(extraStats: Partial<UserStats>, item: ShopItem): string | null {
    const currentCoins = extraStats.coins || 0;
    if (currentCoins < item.price) {
        return `Insufficient balance: requires ${item.price} coins, but you only have ${currentCoins}.`;
    }
    
    if (item.requiredLevel && (extraStats.level || 1) < item.requiredLevel) {
        return `Level too low: requires level ${item.requiredLevel}.`;
    }
    
    // Consumable specific limits
    if (item.isConsumable) {
        // Safe check for streak freezes or standard boosts
        let currentCount = 0;
        if (item.id === 'item_streak_freeze') {
            currentCount = (extraStats as any).streakFreezes || 0; // fallback typing
        } else {
            currentCount = extraStats.boostItemCounts?.[item.id] || 0;
        }

        if (item.maxCapacity && currentCount >= item.maxCapacity) {
            return `Maximum capacity reached: you cannot hold more than ${item.maxCapacity} of this item.`;
        }
        
        if (item.cooldownHours) {
            const lastPurchases = extraStats.lastPurchaseDates || {};
            const lastDateStr = lastPurchases[item.id];
            
            if (lastDateStr) {
                const msSince = Date.now() - new Date(lastDateStr).getTime();
                const hoursSince = msSince / (1000 * 60 * 60);
                if (hoursSince < item.cooldownHours) {
                    return `Item is on cooldown. Try again in ${Math.ceil(item.cooldownHours - hoursSince)} hours.`;
                }
            }
        }
    }
    
    // Check if already owned for non-consumables
    if (!item.isConsumable && item.type !== 'seed') {
        const owned = extraStats.ownedItemIds || [];
        if (owned.includes(item.id)) {
            return `You already own this item.`;
        }
    }
    
    return null; /* Valid transaction */
}
