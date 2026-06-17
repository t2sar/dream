import { Habit, UserStats, CompanionUnlock } from './types';
import { COMPANIONS } from './companionsData';

export function evaluateCompanionUnlocks(habits: Habit[], stats: Partial<UserStats>) {
  const currentUnlockedIds = new Set((stats.companions || []).map(c => c.id));
  const newUnlocks: string[] = [];

  // Helper check
  const hasCompanion = (id: string) => currentUnlockedIds.has(id);
  const unlock = (id: string) => {
    if (!hasCompanion(id)) {
      newUnlocks.push(id);
      currentUnlockedIds.add(id);
    }
  };

  // 1. Projapoti (Butterfly): Complete your first 7-day streak
  const bestOverallStreak = Math.max(...habits.map(h => h.bestStreak || h.streak || 0), 0);
  if (bestOverallStreak >= 7) unlock('projapoti');

  // 2. Moumachhi / Shongee (Honeybee): Complete 25 total check-ins
  if ((stats.totalHabitsCompleted || 0) >= 25) {
     unlock('moumachhi'); 
     unlock('shongee'); // Some people might have the old ID or new ID 
  }

  // 3. Ladybug & Kaktadhua: Grow your first plant to stage 6 ("Fruiting Plant" or Stage index 5)
  // Let's assume stage checking: e.g. "Mature Plant" or "Fruiting Plant"
  const hasMaturePlant = habits.some(h => h.plantStage === 'Mature Plant' || h.plantStage === 'Fruiting Plant');
  if (hasMaturePlant || (stats.plantsFruitedCount && stats.plantsFruitedCount > 0)) {
     unlock('ladybug');
     unlock('kaktadhua');
  }

  // 4. Chorui (Sparrow): Reach Level 10
  if ((stats.level || 1) >= 10) unlock('chorui');

  // 5. Tuntuni (Tailorbird): Complete 15 perfect garden days
  if ((stats.perfectGardenDays || 0) >= 15) unlock('tuntuni');

  // 6. Phoring (Dragonfly): Complete a 7-day Garden Challenge
  if ((stats.challengeHistory && stats.challengeHistory.length > 0) || (stats.challengesCompletedCount && stats.challengesCompletedCount > 0)) {
     unlock('phoring');
  }

  // 7. Doel: 30-day streak on any habit
  if (bestOverallStreak >= 30) unlock('doel');

  // 8. Jonaki: 10 evenings
  if ((stats.eveningCompletions || 0) >= 10) unlock('jonaki');

  // 9. Bang: 5 rainy season days
  if ((stats.rainySeasonCompletions || 0) >= 5) unlock('bang');

  // 10. Shalik: Resist bad habits 25 times
  if ((stats.badHabitResists || 0) >= 25) unlock('shalik');

  // 11. Machranga (Kingfisher): Maintain 3 habits simultaneously for 30 days
  const habitsWith30DayStreak = habits.filter(h => (h.bestStreak || h.streak || 0) >= 30).length;
  if (habitsWith30DayStreak >= 3) unlock('machranga');

  // 12. Pecha (Owl): 15 nights
  if ((stats.nightCompletions || 0) >= 15) unlock('pecha');

  if (newUnlocks.length === 0) return null;

  const now = new Date().toISOString();
  const updatedCompanions: CompanionUnlock[] = [
    ...(stats.companions || []),
    ...newUnlocks.map(id => ({ id, unlockedAt: now }))
  ];

  return {
    newUnlockIds: newUnlocks,
    updatedCompanions
  };
}
