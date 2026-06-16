import { UserStats, AchievementBadge } from './types';
import { ACHIEVEMENT_BADGES } from './badgeConfig';

export interface BadgeUnlockResult {
  newStats: Partial<UserStats>;
  unlockedBadges: AchievementBadge[];
}

export function checkBadgeUnlocks(stats: Partial<UserStats>): BadgeUnlockResult {
  const unlockedBadges: AchievementBadge[] = [];
  const currentUnlocked = stats.unlockedBadgeIds || {};
  const newStats = { ...stats };
  
  let xpGained = 0;
  let coinsGained = 0;
  let hasNewUnlocks = false;

  const newUnlockedObj = { ...currentUnlocked };

  ACHIEVEMENT_BADGES.forEach(badge => {
    if (newUnlockedObj[badge.badgeId]) return; // Already unlocked

    let progress = 0;
    switch (badge.conditionType) {
      case 'habit_created_count': progress = stats.habitsCreatedCount || 0; break;
      case 'habit_completed_count': progress = stats.totalHabitsCompleted || 0; break;
      case 'streak_reached': progress = stats.bestDailyGardenStreak || 0; break;
      case 'perfect_garden_days': progress = stats.perfectGardenDays || 0; break;
      case 'plant_fruiting_count': progress = stats.plantsFruitedCount || 0; break;
      case 'plant_saved_count': progress = stats.plantsRevived || 0; break;
      case 'challenge_completed_count': progress = stats.challengesCompletedCount || 0; break;
      case 'quest_completed_count': progress = stats.questsCompletedCount || 0; break;
      case 'level_reached': progress = stats.level || 1; break;
      case 'shop_purchase_count': progress = stats.shopPurchasesCount || 0; break;
    }

    if (progress >= badge.targetValue) {
      newUnlockedObj[badge.badgeId] = { unlockedAt: new Date().toISOString(), rewardClaimed: true };
      unlockedBadges.push(badge);
      xpGained += badge.rewardXP;
      coinsGained += badge.rewardCoins;
      hasNewUnlocks = true;
    }
  });

  if (hasNewUnlocks) {
    newStats.unlockedBadgeIds = newUnlockedObj;
    newStats.xp = (newStats.xp || 0) + xpGained;
    newStats.coins = (newStats.coins || 0) + coinsGained;
    
    // Check level up due to badge XP
    // Note: To avoid circular dependency with LEVEL_THRESHOLDS in App.tsx, 
    // it's best if the caller handles level ups after receiving the newly added XP, 
    // or we just let it be handled on the next render pass if the app has a use effect for level up.
  }

  return { newStats, unlockedBadges };
}
