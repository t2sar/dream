export type HapticEvent = 'water' | 'allDone' | 'grow' | 'protect' | 'complete' | 'harvest' | 'unlock' | 'slip' | 'thump';

export const playHaptic = (event: HapticEvent, enabled: boolean = true) => {
  if (!enabled) return;
  
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (event) {
      case 'thump':
        navigator.vibrate([15]); // A very short, subtle thump pulse
        break;
      case 'water':
        navigator.vibrate([30, 60, 30]);
        break;
      case 'complete':
        // Success feeling: medium-pause-strong
        navigator.vibrate([40, 60, 80]);
        break;
      case 'harvest':
        // Burst of joy: strong, multiple light pulses
        navigator.vibrate([80, 40, 30, 40, 30, 40, 50]);
        break;
      case 'unlock':
        // Grand reveal: strong-pause-strong-medium
        navigator.vibrate([100, 50, 100, 50, 60]);
        break;
      case 'slip':
        // Negative reinforcement: single heavy long vibrate
        navigator.vibrate([200]);
        break;
      case 'allDone':
        navigator.vibrate([30, 80, 60]);
        break;
      case 'grow':
        navigator.vibrate([80]);
        break;
      case 'protect':
        navigator.vibrate([150]);
        break;
    }
  } catch (err) {
    // Silently continue
  }
};
