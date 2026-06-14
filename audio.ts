export type SoundType = 'chime' | 'droplet' | 'pop' | 'none';

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
        audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playCompletionSound(type: SoundType = 'droplet', volume: number = 0.5) {
  if (type === 'none') return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'droplet') {
    oscillator.type = 'sine';
    
    // Quick pitch drop
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    // Amplitude envelope: quick attack, quick decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } else if (type === 'chime') {
    oscillator.type = 'sine';
    
    oscillator.frequency.setValueAtTime(1200, now);

    // Add a harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, now);
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    oscillator.start(now);
    osc2.start(now);
    oscillator.stop(now + 1.0);
    osc2.stop(now + 0.5);
  } else if (type === 'pop') {
     // A simple pop sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }
}
