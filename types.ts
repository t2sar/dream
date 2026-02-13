export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'mindfulness' | 'other';
  color: string;
  icon: string;
  streak: number;
  createdAt: string;
}

export interface HabitLog {
  [date: string]: string[]; // Date string (YYYY-MM-DD) -> Array of completed Habit IDs
}

export interface UserStats {
  xp: number;
  level: number;
  totalHabitsCompleted: number;
}

export interface AIAdvice {
  text: string;
  actionableSteps?: string[];
}

export enum Tab {
  TRACKER = 'tracker',
  PROGRESS = 'progress',
  COACH = 'coach',
  SETTINGS = 'settings',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}