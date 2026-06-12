export type HapticEvent = 'water' | 'allDone' | 'grow' | 'protect';

export const playHaptic = (event: HapticEvent, enabled: boolean = true) => {
  if (!enabled) return;
  
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (event) {
      case 'water':
        // Two quick light pulses: ~30ms, pause 60ms, ~30ms
        navigator.vibrate([30, 60, 30]);
        break;
      case 'allDone':
        // Light-pause-medium: 30ms, 80ms pause, 60ms
        navigator.vibrate([30, 80, 60]);
        break;
      case 'grow':
        // Single firm pulse: ~80ms
        navigator.vibrate([80]);
        break;
      case 'protect':
        // One long soft pulse: ~150ms
        navigator.vibrate([150]);
        break;
    }
  } catch (err) {
    // Silently continue if vibrate fails (e.g. cross-origin iframe without permission, though preview handles it)
  }
};
