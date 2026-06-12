import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { Habit } from '../types';

export const useAndroidApp = (habits: Habit[]) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Hide splash screen when React is ready
    SplashScreen.hide().catch(console.error);

    // Handle android back button
    let backButtonListener: any = null;
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    }).then(listener => {
      backButtonListener = listener;
    });

    // Request Notification Permissions
    LocalNotifications.requestPermissions().catch(console.error);

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  // Update offline/local notifications
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !habits || habits.length === 0) return;

    const scheduleReminders = async () => {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] }); // Cancel existing to avoid spam
        
        const activeHabits = habits.filter(h => !h.archivedAt && h.type !== 'avoid');
        if (activeHabits.length > 0) {
          // Schedule a generic privacy-safe notification
          // "Your plant needs care today."
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Habit Garden",
                body: "Your plant needs care today. Come water your garden!",
                id: 1,
                schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 4) }, // In 4 hours
                sound: undefined,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        }
      } catch (err) {
        console.error("Local Notification Error", err);
      }
    };

    scheduleReminders();
  }, [habits]);
};
