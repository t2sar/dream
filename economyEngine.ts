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
    
    let finalRequested = requestedCoins;
    if (requestedCoins > 0) {
        // Hemanto Season Logic (10% boost in Oct/Nov)
        const currentMonth = new Date().getMonth();
        if (currentMonth === 9 || currentMonth === 10) {
            finalRequested = Math.floor(requestedCoins * 1.10);
            console.log(`[Economy Engine] Hemanto season active! Coin yield boosted: ${requestedCoins} -> ${finalRequested}`);
        }
    }

    if (todayEarned >= dynamicCap) {
        return 0; // Cap reached, no more coins today
    }
    
    const allowedEarnings = Math.min(finalRequested, dynamicCap - todayEarned);
    return allowedEarnings;
}

export function runEconomyDiagnostics(extraStats?: Partial<UserStats>, habits?: Habit[]) {
    console.log("=== RUNNING ECONOMY ENGINE DIAGNOSTICS ===");
    let passed = true;
    
    // Check for potential coin overflow from current state
    if (extraStats) {
        if ((extraStats.coins || 0) > 9999999) {
            console.warn(`[Economy Engine] Potential coin overflow detected! Coins: ${extraStats.coins}`);
            passed = false;
        }
        if (habits && extraStats.level) {
            const dynamicCap = calculateDailyCoinCap(habits, extraStats.level);
            if ((extraStats.dailyCoinsEarned || 0) > dynamicCap) {
                console.warn(`[Economy Engine] Daily coin limit overflow detected! Earned: ${extraStats.dailyCoinsEarned}, Cap: ${dynamicCap}`);
                passed = false;
            }
        }
    }

    // Test 1: Standard Reward
    const res1 = calculateSecureCoinReward(100, { dailyCoinsEarned: 500 }, 1000);
    if (res1 !== 100) { console.error("Economy Test 1 Failed: Expected 100, got", res1); passed = false; }
    
    // Test 2: Reward hitting the cap exactly
    const res2 = calculateSecureCoinReward(500, { dailyCoinsEarned: 500 }, 1000);
    if (res2 !== 500) { console.error("Economy Test 2 Failed: Expected 500, got", res2); passed = false; }
    
    // Test 3: Reward overflowing the cap
    const res3 = calculateSecureCoinReward(600, { dailyCoinsEarned: 500 }, 1000);
    if (res3 !== 500) { console.error("Economy Test 3 Failed: Expected 500, got", res3); passed = false; }
    
    // Test 4: Reward when already at cap
    const res4 = calculateSecureCoinReward(100, { dailyCoinsEarned: 1000 }, 1000);
    if (res4 !== 0) { console.error("Economy Test 4 Failed: Expected 0, got", res4); passed = false; }
    
    // Test 5: Reward when over cap (edge case)
    const res5 = calculateSecureCoinReward(100, { dailyCoinsEarned: 1200 }, 1000);
    if (res5 !== 0) { console.error("Economy Test 5 Failed: Expected 0, got", res5); passed = false; }
    
    if (passed) {
        console.log("Economy Engine Secure: Daily ceilings strictly enforced. No overflow detected.");
    } else {
        console.error("Economy Engine Diagnostics Failed! Security risk detected.");
    }
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
