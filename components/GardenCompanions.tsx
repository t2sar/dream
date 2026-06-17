import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { COMPANIONS, CompanionAssetsDictionary } from '../companionsData';

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
      {sessionCompanions.map(id => {
        const comp = COMPANIONS.find(c => c.id === id);
        if (!comp) return null;

        return (
          <CompanionCard key={id} companionId={id} />
        );
      })}
    </div>
  );
};

interface CompanionCardProps {
  companionId: string;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({ companionId }) => {
  const SvgComponent = CompanionAssetsDictionary[companionId];
  if (!SvgComponent) return null;
  
  // Determine flyer vs sitter
  const isFlyer = ['shongee', 'projapoti', 'moumachhi', 'phoring', 'jonaki', 'machranga', 'pecha'].includes(companionId);
  const isSitter = ['doel', 'kaktadhua', 'ladybug', 'chorui', 'tuntuni', 'bang', 'shalik'].includes(companionId);
  
  let customClass = '';
  switch (companionId) {
    case 'shongee':
      customClass = 'top-1/3 left-1/4 animate-hovering animate-duration-[4000ms]';
      break;
    case 'kaktadhua':
      customClass = 'bottom-10 right-10 scale-150 transform-origin-bottom';
      break;
    case 'doel':
      customClass = 'bottom-20 left-1/4 animate-perch-sing animate-duration-[10000ms]';
      break;
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
    <div className={`absolute ${customClass} w-16 h-16 z-20 group pointer-events-auto cursor-pointer`}>
      <div className="relative w-full h-full">
         {isFlyer && (
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/10 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         )}
         {isSitter && (
           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#78350F]/20 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         )}
         <SvgComponent className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1" />
      </div>
    </div>
  );
};
