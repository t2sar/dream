import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { COMPANIONS } from '../companionsData';
import { CompanionSVGs } from './CompanionAssets';

interface GardenCompanionsProps {
  stats: Partial<UserStats>;
}

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
  const SvgComponent = CompanionSVGs[companion.id];
  if (!SvgComponent) return null;
  
  // Choose behavior style based on ID
  let customClass = '';
  const inlineStyle: React.CSSProperties = {};
  
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
    <div className={`absolute ${customClass} w-12 h-12 z-20`} style={inlineStyle}>
      <SvgComponent className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform hover:scale-110" />
    </div>
  );
};
