import { SeasonalEvent } from './types';
import { format, isWithinInterval, parse } from 'date-fns';

export const EVENTS: SeasonalEvent[] = [
  {
    id: 'mango_season_event',
    name: 'Mango Season Garden',
    theme: 'Aam / Mango',
    description: 'Complete your daily habits and grow your Aam plant during mango season.',
    startDate: '06-01',
    endDate: '06-14',
    rewardXP: 100,
    rewardCoins: 600,
    rewardBadgeId: 'aam_season_gardener',
    rewardDecorationId: 'mango_basket',
    quests: [
      {
        id: 'mango_q1',
        title: 'Water Plants',
        description: 'Water 3 plants today',
        requiredCount: 3,
        type: 'water_plants'
      },
      {
        id: 'mango_q2',
        title: 'Health or Study Habit',
        description: 'Complete one Health or Study habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'health' // Simplification
      },
      {
        id: 'mango_q3',
        title: 'Perfect Garden Day',
        description: 'Achieve one Perfect Garden Day',
        requiredCount: 1,
        type: 'perfect_day'
      }
    ]
  },
  {
    id: 'monsoon_rain_event',
    name: 'Monsoon Rain Garden',
    theme: 'Rain and recovery',
    description: 'Save wilting plants and enjoy the monsoon rain in your garden.',
    startDate: '07-01',
    endDate: '07-14',
    rewardXP: 80,
    rewardCoins: 400,
    rewardBadgeId: 'rain_garden_keeper',
    rewardDecorationId: 'rain_cloud',
    quests: [
      {
        id: 'monsoon_q1',
        title: 'Save a Plant',
        description: 'Save or improve one low-health plant',
        requiredCount: 1,
        type: 'save_wilting'
      },
      {
        id: 'monsoon_q2',
        title: 'Mindfulness Habit',
        description: 'Complete one Mindfulness habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'mindfulness'
      },
      {
        id: 'monsoon_q3',
        title: 'Maintain Garden',
        description: 'Keep garden health above 70% (Perfect Day)',
        requiredCount: 1,
        type: 'perfect_day'
      }
    ]
  },
  {
    id: 'winter_morning_event',
    name: 'Winter Morning Discipline',
    theme: 'Early routine and focus',
    description: 'Build discipline with early morning routines during winter.',
    startDate: '12-15',
    endDate: '12-31',
    rewardXP: 100,
    rewardCoins: 500,
    rewardBadgeId: 'winter_morning_gardener',
    rewardDecorationId: 'winter_sun',
    quests: [
      {
        id: 'winter_q1',
        title: 'Sleep Habit',
        description: 'Complete one Sleep habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'sleep'
      },
      {
        id: 'winter_q2',
        title: 'Hard Habit',
        description: 'Complete one Hard or Medium habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetDifficulty: 'medium'
      },
      {
        id: 'winter_q3',
        title: 'Water Plants',
        description: 'Water 2 plants',
        requiredCount: 2,
        type: 'water_plants'
      }
    ]
  },
  {
    id: 'boishakh_event',
    name: 'Boishakh Fresh Start',
    theme: 'Bengali New Year',
    description: 'Start fresh habits for the Bengali New Year!',
    startDate: '04-14',
    endDate: '04-21',
    rewardXP: 120,
    rewardCoins: 600,
    rewardBadgeId: 'new_year_planter',
    rewardDecorationId: 'boishakh_banner',
    quests: [
      {
        id: 'bois_q1',
        title: 'New Seed',
        description: 'Create or restart one habit',
        requiredCount: 1,
        type: 'create_habit'
      },
      {
        id: 'bois_q2',
        title: 'Complete Habits',
        description: 'Complete 3 habits',
        requiredCount: 3,
        type: 'complete_habit'
      },
      {
        id: 'bois_q3',
        title: 'Perfect Day',
        description: 'Reach one Perfect Garden Day',
        requiredCount: 1,
        type: 'perfect_day'
      }
    ]
  },
  {
    id: 'exam_focus_event',
    name: 'Exam Focus Garden',
    theme: 'Study and focus',
    description: 'Stay disciplined and focused during exam season.',
    startDate: '11-01',
    endDate: '11-14',
    rewardXP: 100,
    rewardCoins: 500,
    rewardBadgeId: 'focus_garden_student',
    rewardDecorationId: 'study_book',
    quests: [
      {
        id: 'exam_q1',
        title: 'Study Habit',
        description: 'Complete one Study habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'study'
      },
      {
        id: 'exam_q2',
        title: 'Hard Habit',
        description: 'Complete one Hard habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetDifficulty: 'hard'
      },
      {
        id: 'exam_q3',
        title: 'Water Plants',
        description: 'Water 3 plants',
        requiredCount: 3,
        type: 'water_plants'
      }
    ]
  },
  {
    id: 'hydration_week_event',
    name: 'Hydration Week',
    theme: 'Summer wellness',
    description: 'Stay healthy and hydrated during the hot summer.',
    startDate: '05-01',
    endDate: '05-07',
    rewardXP: 80,
    rewardCoins: 400,
    rewardBadgeId: 'hydration_badge',
    rewardDecorationId: 'coconut_water',
    quests: [
      {
        id: 'hyd_q1',
        title: 'Hydration Habit',
        description: 'Complete Hydration habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'hydration'
      },
      {
        id: 'hyd_q2',
        title: 'Health Habit',
        description: 'Complete one Health habit',
        requiredCount: 1,
        type: 'complete_habit',
        targetCategory: 'health'
      },
      {
        id: 'hyd_q3',
        title: 'Perfect Day',
        description: 'Keep garden health high (Perfect Day)',
        requiredCount: 1,
        type: 'perfect_day'
      }
    ]
  }
];

export const getActiveEvent = (currentDate: Date): SeasonalEvent | null => {
  const year = currentDate.getFullYear();
  
  for (const event of EVENTS) {
    try {
      // Parse dates relative to current year
      const start = parse(`${year}-${event.startDate}`, 'yyyy-MM-dd', new Date());
      const end = parse(`${year}-${event.endDate}`, 'yyyy-MM-dd', new Date());
      
      // Handle events that cross year boundaries (if any, though in this static list there aren't yet)
      if (end < start) {
        end.setFullYear(year + 1);
      }
      
      if (isWithinInterval(currentDate, { start, end })) {
        return event;
      }
    } catch {
       continue;
    }
  }
  return null;
};
