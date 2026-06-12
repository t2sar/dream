import { Habit } from './types';
import { format } from 'date-fns';

export const checkAndRequestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Check if current time matches the target time (e.g. '21:00')
export const isTimeMatch = (targetTime: string): boolean => {
  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;
  
  return currentTime === targetTime;
};

export const getEveningSummaryContent = (unfinishedHabits: Habit[]): string | null => {
  const count = unfinishedHabits.length;
  if (count === 0) return null;
  
  const options = [
    `Shondha nemeche — your garden's waiting 🌙`,
    `The evening is here. Some plants need you. 🌱`,
    `A quiet evening reminder for your garden. 🌿`,
    `Take a moment for your plants before the day ends. ✨`
  ];
  
  const greeting = options[Math.floor(Math.random() * options.length)];
  
  if (count === 1) {
    return `${greeting}\nOne plant is still waiting for water today: ${unfinishedHabits[0].name}`;
  } else if (count >= 2 && count <= 3) {
    const names = unfinishedHabits.map(h => h.name).join(', ');
    return `${greeting}\n${count} plants are waiting for you: ${names}`;
  } else {
    // 4+ unfinished
    return `${greeting}\n${count} plants are waiting for water today. Even one counts.`;
  }
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, options);
      notification.onclick = function() {
         window.focus();
         this.close();
      };
    } catch (e) {
      // In some environments, Notification requires a Service Worker
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    }
  }
};
