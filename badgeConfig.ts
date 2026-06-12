import { AchievementBadge } from './types';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // Starter
  {
    badgeId: 'first_seed',
    title: 'First Seed',
    description: 'Create your first habit.',
    category: 'Starter',
    iconName: 'Sprout',
    conditionType: 'habit_created_count',
    targetValue: 1,
    rewardXP: 10,
    rewardCoins: 2
  },
  {
    badgeId: 'first_water',
    title: 'First Water',
    description: 'Complete your first habit.',
    category: 'Starter',
    iconName: 'Droplet',
    conditionType: 'habit_completed_count',
    targetValue: 1,
    rewardXP: 20,
    rewardCoins: 5
  },
  {
    badgeId: 'first_perfect_day',
    title: 'First Perfect Garden Day',
    description: 'Complete all scheduled habits in one day.',
    category: 'Starter',
    iconName: 'Trophy',
    conditionType: 'perfect_garden_days',
    targetValue: 1,
    rewardXP: 30,
    rewardCoins: 10
  },

  // Streak
  {
    badgeId: '3_day_roots',
    title: '3-Day Roots',
    description: 'Maintain any habit streak for 3 days.',
    category: 'Streak',
    iconName: 'ArrowUpRight',
    conditionType: 'streak_reached',
    targetValue: 3,
    rewardXP: 20,
    rewardCoins: 0
  },
  {
    badgeId: '7_day_sprout_keeper',
    title: '7-Day Sprout Keeper',
    description: 'Maintain any habit streak for 7 days.',
    category: 'Streak',
    iconName: 'Leaf',
    conditionType: 'streak_reached',
    targetValue: 7,
    rewardXP: 50,
    rewardCoins: 10
  },
  {
    badgeId: '14_day_garden_builder',
    title: '14-Day Garden Builder',
    description: 'Maintain any habit streak for 14 days.',
    category: 'Streak',
    iconName: 'Trees',
    conditionType: 'streak_reached',
    targetValue: 14,
    rewardXP: 100,
    rewardCoins: 20
  },
  {
    badgeId: '30_day_fruit_grower',
    title: '30-Day Fruit Grower',
    description: 'Maintain any habit streak for 30 days.',
    category: 'Streak',
    iconName: 'Apple',
    conditionType: 'streak_reached',
    targetValue: 30,
    rewardXP: 200,
    rewardCoins: 50
  },

  // Plant
  {
    badgeId: 'first_fruit',
    title: 'First Fruit',
    description: 'Grow any fruit plant to Fruiting stage.',
    category: 'Plant',
    iconName: 'Grape', // Or another fruit icon available
    conditionType: 'plant_fruiting_count',
    targetValue: 1,
    rewardXP: 100,
    rewardCoins: 25
  },
  {
    badgeId: 'fruit_garden_starter',
    title: 'Fruit Garden Starter',
    description: 'Grow 3 plants to Fruiting stage.',
    category: 'Plant',
    iconName: 'Cherry', 
    conditionType: 'plant_fruiting_count',
    targetValue: 3,
    rewardXP: 150,
    rewardCoins: 40
  },

  // Recovery
  {
    badgeId: 'plant_saver',
    title: 'Plant Saver',
    description: 'Save one wilting or critical plant.',
    category: 'Recovery',
    iconName: 'HeartHandshake',
    conditionType: 'plant_saved_count',
    targetValue: 1,
    rewardXP: 30,
    rewardCoins: 10
  },
  {
    badgeId: 'recovery_hero',
    title: 'Recovery Hero',
    description: 'Recover 3 wilting or critical plants.',
    category: 'Recovery',
    iconName: 'ShieldPlus',
    conditionType: 'plant_saved_count',
    targetValue: 3,
    rewardXP: 60,
    rewardCoins: 15
  },

  // Daily Garden
  {
    badgeId: 'perfect_garden_week',
    title: 'Perfect Garden Week',
    description: 'Achieve 7 Perfect Garden Days.',
    category: 'Daily Garden',
    iconName: 'Sun',
    conditionType: 'perfect_garden_days',
    targetValue: 7,
    rewardXP: 150,
    rewardCoins: 40
  },

  // Challenge
  {
    badgeId: 'first_challenge',
    title: 'First Challenge',
    description: 'Complete any challenge.',
    category: 'Challenge',
    iconName: 'Flag',
    conditionType: 'challenge_completed_count',
    targetValue: 1,
    rewardXP: 50,
    rewardCoins: 10
  },

  // Level
  {
    badgeId: 'level_5_gardener',
    title: 'Level 5 Gardener',
    description: 'Reach Level 5.',
    category: 'Level',
    iconName: 'Star',
    conditionType: 'level_reached',
    targetValue: 5,
    rewardXP: 50,
    rewardCoins: 20
  },
  {
    badgeId: 'level_10_garden_helper',
    title: 'Level 10 Garden Helper',
    description: 'Reach Level 10.',
    category: 'Level',
    iconName: 'Award',
    conditionType: 'level_reached',
    targetValue: 10,
    rewardXP: 100,
    rewardCoins: 30
  },
  {
    badgeId: 'level_20_garden_keeper',
    title: 'Level 20 Garden Keeper',
    description: 'Reach Level 20.',
    category: 'Level',
    iconName: 'Crown',
    conditionType: 'level_reached',
    targetValue: 20,
    rewardXP: 200,
    rewardCoins: 50
  },

  // Shop
  {
    badgeId: 'first_purchase',
    title: 'First Purchase',
    description: 'Buy first shop item.',
    category: 'Starter',
    iconName: 'ShoppingCart',
    conditionType: 'shop_purchase_count',
    targetValue: 1,
    rewardXP: 10,
    rewardCoins: 0
  }
];
