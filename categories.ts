import { HabitCategory } from './types';
import { 
  Heart, Dumbbell, GraduationCap, Briefcase, Moon, 
  Star, Flower2, Coins, Home, BookOpen, Brush, 
  MessageCircle, Sparkles, Shield, Sprout, Apple, 
  Droplets, Tag, Users 
} from 'lucide-react';
import { PlantType } from './types';

export interface CategorySpec {
  id: HabitCategory;
  name: string;
  description: string;
  icon: any;        // Lucide component
  color: string;
  iconName: string;
  suggestedPlants: PlantType[];
}

export const CATEGORIES: Record<HabitCategory, CategorySpec> = {
  health: {
    id: 'health', name: 'Health', description: 'Wellness, medicine, body care',
    icon: Heart, iconName: 'Heart', color: 'text-green-500', 
    suggestedPlants: ['Papaya / Pepe', 'Guava / Peyara', 'Lemon / Lebu', 'Indian Gooseberry / Amloki', 'Pomelo / Batabi Lebu']
  },
  fitness: {
    id: 'fitness', name: 'Fitness', description: 'Exercise, walking, gym',
    icon: Dumbbell, iconName: 'Dumbbell', color: 'text-orange-500',
    suggestedPlants: ['Jackfruit / Kathal', 'Coconut / Narikel', 'Date Palm / Khejur', 'Elephant Apple / Chalta', 'Bengal Currant / Karamcha']
  },
  study: {
    id: 'study', name: 'Study', description: 'Learning, exam prep, courses',
    icon: GraduationCap, iconName: 'GraduationCap', color: 'text-blue-500',
    suggestedPlants: ['Mango / Aam', 'Black Plum / Jam', 'Longan / Ashfol', 'Fig / Dumur', 'Indian Gooseberry / Amloki']
  },
  work: {
    id: 'work', name: 'Work', description: 'Job tasks, productivity',
    icon: Briefcase, iconName: 'Briefcase', color: 'text-gray-400',
    suggestedPlants: ['Mango / Aam', 'Coconut / Narikel', 'Date Palm / Khejur', 'Cashew Fruit / Kaju Fol']
  },
  sleep: {
    id: 'sleep', name: 'Sleep', description: 'Bedtime, waking up early',
    icon: Moon, iconName: 'Moon', color: 'text-purple-500',
    suggestedPlants: ['Banana / Kola', 'Custard Apple / Ata', 'Melon / Bangi', 'Fig / Dumur']
  },
  prayer_spiritual: {
    id: 'prayer_spiritual', name: 'Prayer / Spiritual', description: 'Prayer, dhikr, religious routine',
    icon: Star, iconName: 'Star', color: 'text-teal-400',
    suggestedPlants: ['Date Palm / Khejur', 'Wood Apple / Bel', 'Asian Palmyra Palm / Taal', 'Fig / Dumur']
  },
  mindfulness: {
    id: 'mindfulness', name: 'Mindfulness', description: 'Meditation, journaling',
    icon: Flower2, iconName: 'Flower2', color: 'text-indigo-400',
    suggestedPlants: ['Wood Apple / Bel', 'Custard Apple / Ata', 'Rose Apple / Golap Jam', 'Indian Persimmon / Gab']
  },
  finance: {
    id: 'finance', name: 'Finance', description: 'Saving, budgeting',
    icon: Coins, iconName: 'Coins', color: 'text-yellow-500',
    suggestedPlants: ['Cashew Fruit / Kaju Fol', 'Pomegranate / Dalim', 'Coconut / Narikel', 'Mango / Aam']
  },
  family: {
    id: 'family', name: 'Family', description: 'Family time, calls',
    icon: Users, iconName: 'Users', color: 'text-pink-400',
    suggestedPlants: ['Jackfruit / Kathal', 'Breadfruit / Ruti Fol', 'Banana / Kola', 'Coconut / Narikel']
  },
  home: {
    id: 'home', name: 'Home', description: 'Cleaning, organizing',
    icon: Home, iconName: 'Home', color: 'text-amber-600',
    suggestedPlants: ['Papaya / Pepe', 'Banana / Kola', 'Guava / Peyara', 'Lemon / Lebu']
  },
  reading: {
    id: 'reading', name: 'Reading', description: 'Books, articles',
    icon: BookOpen, iconName: 'BookOpen', color: 'text-blue-600',
    suggestedPlants: ['Mango / Aam', 'Black Plum / Jam', 'Tamarind / Tetul', 'Fig / Dumur']
  },
  creativity: {
    id: 'creativity', name: 'Creativity', description: 'Writing, drawing, music',
    icon: Brush, iconName: 'Brush', color: 'text-fuchsia-500',
    suggestedPlants: ['Dragon Fruit / Dragon Fol', 'Star Fruit / Kamranga', 'Pineapple / Anaros', 'Passion Fruit / Passion Fol']
  },
  social: {
    id: 'social', name: 'Social', description: 'Friends, networking',
    icon: MessageCircle, iconName: 'MessageCircle', color: 'text-sky-400',
    suggestedPlants: ['Litchi / Lichu', 'Orange / Komola', 'Rambutan / Rambutan', 'Grape / Angur']
  },
  self_care: {
    id: 'self_care', name: 'Self-care', description: 'Skincare, grooming',
    icon: Sparkles, iconName: 'Sparkles', color: 'text-rose-400',
    suggestedPlants: ['Rose Apple / Golap Jam', 'Guava / Peyara', 'Strawberry', 'Pomelo / Batabi Lebu']
  },
  bad_habit_control: {
    id: 'bad_habit_control', name: 'Bad Habit Control', description: 'Avoiding negative habits',
    icon: Shield, iconName: 'Shield', color: 'text-red-500',
    suggestedPlants: ['Bengal Currant / Karamcha', 'Jackfruit / Kathal', 'Elephant Apple / Chalta', 'Asian Palmyra Palm / Taal']
  },
  personal_growth: {
    id: 'personal_growth', name: 'Personal Growth', description: 'Discipline, skill building',
    icon: Sprout, iconName: 'Sprout', color: 'text-green-400',
    suggestedPlants: ['Mango / Aam', 'Date Palm / Khejur', 'Asian Palmyra Palm / Taal', 'Pomegranate / Dalim']
  },
  food_nutrition: {
    id: 'food_nutrition', name: 'Food & Nutrition', description: 'Healthy meals, avoiding junk',
    icon: Apple, iconName: 'Apple', color: 'text-lime-500',
    suggestedPlants: ['Papaya / Pepe', 'Guava / Peyara', 'Banana / Kola', 'Mango / Aam', 'Orange / Komola']
  },
  hydration: {
    id: 'hydration', name: 'Hydration', description: 'Drinking water',
    icon: Droplets, iconName: 'Droplets', color: 'text-cyan-400',
    suggestedPlants: ['Coconut / Narikel', 'Watermelon / Tormuj', 'Lemon / Lebu', 'Wax Apple / Jamrul', 'Phalsa / Falsa']
  },
  custom: {
    id: 'custom', name: 'Custom', description: 'User-created category',
    icon: Tag, iconName: 'Tag', color: 'text-slate-400',
    suggestedPlants: []
  }
};

export const suggestCategory = (title: string): HabitCategory | null => {
  const t = title.toLowerCase();
  if (/water|drink|glass|hydration/.test(t)) return 'hydration';
  if (/walk|run|gym|workout|exercise|pushup|yoga/.test(t)) return 'fitness';
  if (/study|exam|class|course|learn|homework|notes/.test(t)) return 'study';
  if (/sleep|wake|bedtime|early morning/.test(t)) return 'sleep';
  if (/pray|prayer|namaz|quran|dhikr|dua/.test(t)) return 'prayer_spiritual';
  if (/money|save|budget|expense|spend/.test(t)) return 'finance';
  if (/read|book|pages/.test(t)) return 'reading';
  if (/clean|room|laundry|dishes|home/.test(t)) return 'home';
  if (/journal|meditate|breathing|calm|gratitude/.test(t)) return 'mindfulness';
  if (/skin|skincare|grooming|bath|self-care/.test(t)) return 'self_care';
  if (/no smoking|no sugar|no junk food|no social media|stop|avoid|quit/.test(t)) return 'bad_habit_control';
  return null;
};
