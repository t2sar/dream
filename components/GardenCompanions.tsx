import React, { useEffect, useState, useMemo } from 'react';
import { Leaf, Bird, Moon, Sparkles, Sprout, Wind, Shell, Zap } from 'lucide-react';
import { UserStats } from '../types';
import { COMPANIONS } from '../companionsData';

interface GardenCompanionsProps {
  stats: Partial<UserStats>;
}

// Basic Inline SVGs for companions
const SVGS = {
  projapoti: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M4 12V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2M20 12V8c0-2.2-1.8-4-4-4-1.5 0-2.8.8-3.5 2M4 12v4c0 2.2 1.8 4 4 4 1.5 0 2.8-.8 3.5-2M20 12v4c0 2.2-1.8 4-4 4-1.5 0-2.8-.8-3.5-2" stroke="url(#projapotiGrad)"/></svg>,
  moumachhi: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="6" stroke="#f59e0b"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="#fcd34d"/></svg>,
  ladybug: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" fill="#ef4444" stroke="#7f1d1d"/><path d="M12 4v16M12 4a3 3 0 00-3-3h6a3 3 0 00-3 3z"/><circle cx="9" cy="10" r="1.5" fill="#000"/><circle cx="15" cy="10" r="1.5" fill="#000"/><circle cx="9" cy="15" r="1.5" fill="#000"/><circle cx="15" cy="15" r="1.5" fill="#000"/></svg>,
  chorui: <Bird className="text-amber-600" size={20} />,
  tuntuni: <Bird className="text-lime-500" size={16} />,
  phoring: <Wind className="text-cyan-400" size={20} />,
  doel: <Bird className="text-white drop-shadow-[0_0_2px_black]" size={24} fill="#0f172a" />,
  jonaki: <Sparkles className="text-yellow-300" size={12} fill="#fde047" />,
  bang: <Shell className="text-emerald-500" size={24} />,
  shalik: <Bird className="text-stone-800" size={22} fill="#292524" />,
  machranga: <Bird className="text-teal-400" size={24} fill="#f97316" />,
  pecha: <Bird className="text-slate-300" size={28} fill="#475569" />,
};

export const GardenCompanions: React.FC<GardenCompanionsProps> = ({ stats }) => {
  const [sessionCompanions, setSessionCompanions] = useState<string[]>([]);
  
  useEffect(() => {
    // Determine active companions
    const unlockedIds = (stats.companions || []).map(c => c.id);
    if (unlockedIds.length === 0) return;
    
    // Mix and randomly pick up to 3 for this session
    // We favor Jonaki during evening/night, Pecha at night, Doel at Dawn
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour <= 5;
    const isEvening = hour >= 17 && hour < 20;

    // Shuffle and pick 3, making sure we don't exceed screen clutter
    let pool = [...unlockedIds];
    
    // Apply time-based filters
    if (isNight && pool.includes('pecha')) pool.push('pecha', 'pecha'); // higher chance
    if (isNight && pool.includes('jonaki')) pool.push('jonaki', 'jonaki');
    if (!isNight) pool = pool.filter(id => id !== 'pecha'); // Owl mostly night
    
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const uniquePicked = Array.from(new Set(shuffled)).slice(0, 3);
    
    setSessionCompanions(uniquePicked);
  }, [stats.companions]);

  if (sessionCompanions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <svg width="0" height="0">
         <defs>
            <linearGradient id="projapotiGrad" x1="0" y1="0" x2="1" y2="1">
               <stop offset="0%" stopColor="#ec4899" />
               <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
         </defs>
      </svg>
      {sessionCompanions.map(id => {
        const comp = COMPANIONS.find(c => c.id === id);
        if (!comp) return null;

        return (
          <CompanionRenderer key={id} companion={comp} />
        );
      })}
    </div>
  );
};

const CompanionRenderer = ({ companion }: { companion: typeof COMPANIONS[0] }) => {
  // Using pure CSS animations to keep it lightweight!
  const svg = (SVGS as any)[companion.id];
  if (!svg) return null;
  
  // Choose behavior style based on ID
  let customClass = '';
  let inlineStyle: React.CSSProperties = {};
  
  switch (companion.id) {
    case 'projapoti':
      customClass = 'animate-fluttering top-1/4 left-1/4 animate-duration-[12000ms]';
      break;
    case 'moumachhi':
      customClass = 'animate-hovering top-1/3 right-1/4 animate-duration-[4000ms]';
      break;
    case 'ladybug':
      customClass = 'animate-crawling bottom-10 left-10 animate-duration-[20000ms]';
      break;
    case 'chorui':
      customClass = 'animate-hopping bottom-4 right-1/3 animate-duration-[6000ms]';
      break;
    case 'tuntuni':
      customClass = 'animate-perch-flick top-1/3 left-1/3 animate-duration-[5000ms]';
      break;
    case 'phoring':
      customClass = 'animate-darting top-1/4 right-1/5 animate-duration-[7000ms]';
      break;
    case 'doel':
      customClass = 'animate-perch-sing bottom-20 left-1/4 animate-duration-[10000ms]';
      break;
    case 'jonaki':
      return (
         <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
               <div 
                  key={i} 
                  className={`absolute rounded-full bg-yellow-300 shadow-[0_0_8px_#fef08a] w-1.5 h-1.5 animate-pulse`} 
                  style={{
                     left: `${20 + Math.random() * 60}%`, 
                     top: `${40 + Math.random() * 40}%`,
                     animationDuration: `${2 + Math.random() * 3}s`,
                     animationDelay: `${Math.random()}s`
                  }} 
               />
            ))}
         </div>
      )
    case 'bang':
      customClass = 'animate-frog-hop bottom-2 right-10 animate-duration-[15000ms]';
      break;
    case 'shalik':
      customClass = 'animate-strutting bottom-2 left-1/2 animate-duration-[10000ms]';
      break;
    case 'machranga':
      customClass = 'animate-dive top-1/4 right-1/4 animate-duration-[12000ms]';
      break;
    case 'pecha':
      customClass = 'animate-perch-blink top-20 right-10 animate-duration-[8000ms] opacity-80';
      break;
  }

  return (
    <div className={`absolute ${customClass}`} style={inlineStyle}>
      {svg}
    </div>
  );
};
