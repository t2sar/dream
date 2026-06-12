import React, { useEffect, useState, useMemo } from 'react';

export type TimePhase = 'Dawn' | 'Morning' | 'Midday' | 'Afternoon' | 'Sunset' | 'Evening' | 'Night';

export function getGardenTimePhase(date: Date = new Date()): TimePhase {
  const h = date.getHours();
  const m = date.getMinutes();
  const time = h + m / 60;
  
  if (time >= 5 && time < 7) return 'Dawn';
  if (time >= 7 && time < 11) return 'Morning';
  if (time >= 11 && time < 15) return 'Midday';
  if (time >= 15 && time < 17.5) return 'Afternoon';
  if (time >= 17.5 && time < 19) return 'Sunset';
  if (time >= 19 && time < 22) return 'Evening';
  return 'Night';
}

interface GardenSkyProps {
  enabled: boolean;
  extraFireflies?: number;
}

export const GardenSky: React.FC<GardenSkyProps> = ({ enabled, extraFireflies = 0 }) => {
  const [phase, setPhase] = useState<TimePhase>('Morning');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(matchMedia.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    matchMedia.addEventListener('change', handler);
    return () => matchMedia.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setPhase('Morning');
      return;
    }
    setPhase(getGardenTimePhase());
    const interval = setInterval(() => {
      setPhase(getGardenTimePhase());
    }, 60000);
    return () => clearInterval(interval);
  }, [enabled]);

  // Pre-calculate random positions for fireflies (up to 15 max to cover base + extra)
  const fireflyData = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 90 + 5 + '%',
      top: Math.random() * 80 + 10 + '%',
      animationDuration: (Math.random() * 4 + 3) + 's',
      animationDelay: (Math.random() * 2) + 's',
    }));
  }, []);

  let gradient = 'bg-[#121620]'; // default
  
  switch (phase) {
    case 'Dawn': gradient = 'bg-gradient-to-b from-[#ffb48a]/30 via-[#f08bb2]/10 to-transparent'; break;
    case 'Morning': gradient = 'bg-gradient-to-b from-[#8ab4ff]/30 via-[#c4dfff]/10 to-transparent'; break;
    case 'Midday': gradient = 'bg-gradient-to-b from-[#4da8da]/40 via-[#8ab4ff]/10 to-transparent'; break;
    case 'Afternoon': gradient = 'bg-gradient-to-b from-[#ffc872]/30 via-[#ffea9d]/10 to-transparent'; break;
    case 'Sunset': gradient = 'bg-gradient-to-b from-[#ff8c42]/30 via-[#ff3c82]/10 to-transparent'; break;
    case 'Evening': gradient = 'bg-gradient-to-b from-[#0a1a3a]/60 via-[#1a2d59]/40 to-transparent'; break;
    case 'Night': gradient = 'bg-gradient-to-b from-[#020510]/80 via-[#0a1024]/60 to-transparent'; break;
  }

  const renderFireflies = (count: number) => {
    if (reducedMotion) return null;
    return fireflyData.slice(0, count).map((data, i) => (
      <div 
        key={i} 
        className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full blur-[1px] animate-[pulse_4s_ease-in-out_infinite]"
        style={{
          left: data.left,
          top: data.top,
          opacity: 0, // Handled by CSS keyframes or we just let Tailwind pulse do the fading
          animationDuration: data.animationDuration,
          animationDelay: data.animationDelay
        }}
      />
    ));
  };

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-[3000ms] ease-in-out rounded-3xl ${gradient}`}>
      
      {/* Sun/Moon */}
      <div className="absolute inset-0 transition-transform duration-[3000ms] ease-in-out">
        {phase === 'Dawn' && (
          <div className="absolute bottom-[20%] left-[20%] w-16 h-16 bg-[#ffdb8a] rounded-full blur-[2px]" />
        )}
        {(phase === 'Morning' || phase === 'Midday' || phase === 'Afternoon') && (
          <div className={`absolute w-16 h-16 bg-[#fffdeb] rounded-full blur-[1px] transition-all duration-[3000ms] ease-in-out ${phase === 'Midday' ? 'top-[10%] left-[50%] -translate-x-1/2' : phase === 'Afternoon' ? 'top-[20%] right-[30%]' : 'top-[20%] left-[30%]'}`} />
        )}
        {phase === 'Sunset' && (
           <div className="absolute bottom-[25%] right-[20%] w-20 h-20 bg-[#ff6b3d] rounded-full blur-[2px]" />
        )}
        {(phase === 'Evening' || phase === 'Night') && (
           <div className="absolute top-[15%] right-[25%] w-12 h-12 bg-[#e2e8f0] rounded-full blur-[1px] shadow-[0_0_20px_rgba(226,232,240,0.4)]" />
        )}
      </div>

      {/* Mist */}
      {phase === 'Dawn' && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-surface-alt/5 blur-xl block" />
      )}

      {/* Clouds */}
      {(phase === 'Morning' || phase === 'Midday') && !reducedMotion && (
        <>
          <div className="absolute top-[15%] left-[10%] w-32 h-8 bg-surface-alt/20 blur-md rounded-full" style={{ animation: 'slideRight 120s linear infinite' }} />
          <div className="absolute top-[25%] left-[60%] w-24 h-6 bg-surface-alt/10 blur-md rounded-full" style={{ animation: 'slideRight 150s linear infinite -40s' }} />
        </>
      )}

      {/* Birds */}
      {phase === 'Sunset' && !reducedMotion && (
        <div className="absolute top-[30%] opacity-0 animate-[flyAcross_25s_linear_forwards] flex gap-2">
           <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/60"><path d="M1 4C1 4 3 1 6 4C9 1 11 4 11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
           <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/60 mt-1"><path d="M1 4C1 4 3 1 6 4C9 1 11 4 11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
           <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/60 -mt-1"><path d="M1 4C1 4 3 1 6 4C9 1 11 4 11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      )}

      {/* Stars */}
      {phase === 'Night' && (
        <div className="absolute inset-0">
          <div className={`absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-surface-card rounded-full ${!reducedMotion && 'animate-pulse'}`} />
          <div className={`absolute top-[15%] left-[50%] w-1 h-1 bg-surface-card rounded-full ${!reducedMotion && 'animate-pulse'}`} />
          <div className={`absolute top-[25%] left-[80%] w-0.5 h-0.5 bg-surface-card rounded-full ${!reducedMotion && 'animate-pulse'}`} />
          <div className={`absolute top-[40%] left-[10%] w-1 h-1 bg-surface-card rounded-full ${!reducedMotion && 'animate-pulse'}`} />
          <div className={`absolute top-[5%] left-[70%] w-0.5 h-0.5 bg-surface-card rounded-full ${!reducedMotion && 'animate-pulse'}`} />
        </div>
      )}

      {/* Fireflies */}
      {phase === 'Evening' && renderFireflies(10 + extraFireflies)}
      {phase === 'Night' && renderFireflies(4 + extraFireflies)}

      <style>{`
        @keyframes drift {
          from { transform: translateX(-100vw); }
          to { transform: translateX(100vw); }
        }
        @keyframes flyAcross {
          0% { transform: translate(-100vw, 20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100vw, -20px); opacity: 0; }
        }
        @keyframes hoverFirefly {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
      `}</style>
    </div>
  );
};
