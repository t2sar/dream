import { AchievementBadge } from './types';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // Starter
  {
    badgeId: 'first_seed',
    title: 'Habit Architect',
    description: 'Create 10 habits.',
    category: 'Starter',
    iconName: 'Sprout',
    conditionType: 'habit_created_count',
    targetValue: 10,
    rewardXP: 50,
    rewardCoins: 200
  },
  {
    badgeId: 'first_water',
    title: 'Consistent Waterer',
    description: 'Complete 50 habits.',
    category: 'Starter',
    iconName: 'Droplet',
    conditionType: 'habit_completed_count',
    targetValue: 50,
    rewardXP: 100,
    rewardCoins: 400
  },
  {
    badgeId: 'first_perfect_day',
    title: 'Perfect Garden Novice',
    description: 'Achieve 10 Perfect Garden Days.',
    category: 'Starter',
    iconName: 'Trophy',
    conditionType: 'perfect_garden_days',
    targetValue: 10,
    rewardXP: 150,
    rewardCoins: 500
  },

  // Streak
  {
    badgeId: '3_day_roots',
    title: '10-Day Roots',
    description: 'Maintain any habit streak for 10 days.',
    category: 'Streak',
    iconName: 'ArrowUpRight',
    conditionType: 'streak_reached',
    targetValue: 10,
    rewardXP: 100,
    rewardCoins: 200
  },
  {
    badgeId: '7_day_sprout_keeper',
    title: '25-Day Sprout Keeper',
    description: 'Maintain any habit streak for 25 days.',
    category: 'Streak',
    iconName: 'Leaf',
    conditionType: 'streak_reached',
    targetValue: 25,
    rewardXP: 250,
    rewardCoins: 500
  },
  {
    badgeId: '14_day_garden_builder',
    title: '50-Day Garden Builder',
    description: 'Maintain any habit streak for 50 days.',
    category: 'Streak',
    iconName: 'Trees',
    conditionType: 'streak_reached',
    targetValue: 50,
    rewardXP: 500,
    rewardCoins: 1000
  },
  {
    badgeId: '21_day_nature_master',
    title: '100-Day Nature Master',
    description: 'Maintain any habit streak for 100 days.',
    category: 'Streak',
    iconName: 'Sparkles',
    conditionType: 'streak_reached',
    targetValue: 100,
    rewardXP: 1000,
    rewardCoins: 2500
  },
  {
    badgeId: '30_day_fruit_grower',
    title: '180-Day Fruit Grower',
    description: 'Maintain any habit streak for 180 days.',
    category: 'Streak',
    iconName: 'Apple',
    conditionType: 'streak_reached',
    targetValue: 180,
    rewardXP: 2500,
    rewardCoins: 5000
  },

  // Plant
  {
    badgeId: 'first_fruit',
    title: 'Orchard Starter',
    description: 'Grow 5 plants to Fruiting stage.',
    category: 'Plant',
    iconName: 'Grape', // Or another fruit icon available
    conditionType: 'plant_fruiting_count',
    targetValue: 5,
    rewardXP: 300,
    rewardCoins: 1000
  },
  {
    badgeId: 'fruit_garden_starter',
    title: 'Master Orchardist',
    description: 'Grow 20 plants to Fruiting stage.',
    category: 'Plant',
    iconName: 'Cherry', 
    conditionType: 'plant_fruiting_count',
    targetValue: 20,
    rewardXP: 800,
    rewardCoins: 2500
  },

  // Recovery
  {
    badgeId: 'plant_saver',
    title: 'Plant Medic',
    description: 'Save 10 wilting or critical plants.',
    category: 'Recovery',
    iconName: 'HeartHandshake',
    conditionType: 'plant_saved_count',
    targetValue: 10,
    rewardXP: 200,
    rewardCoins: 800
  },
  {
    badgeId: 'recovery_hero',
    title: 'Recovery Legend',
    description: 'Recover 50 wilting or critical plants.',
    category: 'Recovery',
    iconName: 'ShieldPlus',
    conditionType: 'plant_saved_count',
    targetValue: 50,
    rewardXP: 800,
    rewardCoins: 2500
  },

  // Daily Garden
  {
    badgeId: 'perfect_garden_week',
    title: 'Perfect Garden Month',
    description: 'Achieve 30 Perfect Garden Days.',
    category: 'Daily Garden',
    iconName: 'Sun',
    conditionType: 'perfect_garden_days',
    targetValue: 30,
    rewardXP: 500,
    rewardCoins: 2000
  },

  // Challenge
  {
    badgeId: 'first_challenge',
    title: 'Challenge Champion',
    description: 'Complete 5 challenges.',
    category: 'Challenge',
    iconName: 'Flag',
    conditionType: 'challenge_completed_count',
    targetValue: 5,
    rewardXP: 250,
    rewardCoins: 1000
  },

  // Level
  {
    badgeId: 'level_5_gardener',
    title: 'Level 15 Gardener',
    description: 'Reach Level 15.',
    category: 'Level',
    iconName: 'Star',
    conditionType: 'level_reached',
    targetValue: 15,
    rewardXP: 250,
    rewardCoins: 1000
  },
  {
    badgeId: 'level_10_garden_helper',
    title: 'Level 30 Garden Helper',
    description: 'Reach Level 30.',
    category: 'Level',
    iconName: 'Award',
    conditionType: 'level_reached',
    targetValue: 30,
    rewardXP: 600,
    rewardCoins: 2500
  },
  {
    badgeId: 'level_20_garden_keeper',
    title: 'Level 50 Garden Keeper',
    description: 'Reach Level 50.',
    category: 'Level',
    iconName: 'Crown',
    conditionType: 'level_reached',
    targetValue: 50,
    rewardXP: 1500,
    rewardCoins: 5000
  },

  // Shop
  {
    badgeId: 'first_purchase',
    title: 'Shop Patron',
    description: 'Buy 10 shop items.',
    category: 'Starter',
    iconName: 'ShoppingCart',
    conditionType: 'shop_purchase_count',
    targetValue: 10,
    rewardXP: 150,
    rewardCoins: 0
  }
];
