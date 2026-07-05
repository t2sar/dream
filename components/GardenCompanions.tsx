import React, { useEffect, useState, useRef } from 'react';
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
          <CompanionCard key={id} companionId={id} trustDays={stats.companions?.find(c => c.id === id)?.trustDays || 0} />
        );
      })}
    </div>
  );
};

interface CompanionCardProps {
  companionId: string;
  trustDays: number;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({ companionId, trustDays }) => {

  let trustLevel = 1;
  if (trustDays > 100) trustLevel = 6;
  else if (trustDays > 70) trustLevel = 5;
  else if (trustDays > 45) trustLevel = 4;
  else if (trustDays > 25) trustLevel = 3;
  else if (trustDays > 10) trustLevel = 2;

  const SvgComponent = CompanionAssetsDictionary[companionId];
  const [targetPos, setTargetPos] = useState<{ x: number, y: number, name?: string, status?: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFleeing, setIsFleeing] = useState(false);

  useEffect(() => {
    // Only certain companions visit
    if (companionId === 'kaktadhua' || companionId === 'jonaki') return;

    const pickTarget = () => {
      if (trustLevel < 2) {
         setTargetPos(null);
         return;
      }
      
      // Find all habit card nodes in the DOM
      const nodes = Array.from(document.querySelectorAll('.habit-card-visit-node')) as HTMLElement[];
      const container = containerRef.current?.closest('.inset-0') as HTMLElement; // The GardenCompanions parent
      
      if (nodes.length > 0 && container && Math.random() > 0.3) {
        // Weight by attention needed
        const weightedNodes: HTMLElement[] = [];
        nodes.forEach((node) => {
           const status = node.getAttribute('data-status') || 'Normal';
           let weight = 1;
           
           // Level 3+ Perk: Helpful Nudge - strongly prefers wilting/critical plants
           if (trustLevel >= 3) {
               if (status === 'Dead' || status === 'Critical') weight = 50;
               else if (status === 'Wilting') weight = 20;
           } else {
               if (status === 'Dead' || status === 'Critical') weight = 3;
               else if (status === 'Wilting') weight = 2;
           }
           
           for (let i = 0; i < weight; i++) {
              weightedNodes.push(node);
           }
        });
        
        const target = weightedNodes[Math.floor(Math.random() * weightedNodes.length)];
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const x = targetRect.left - containerRect.left + (Math.random() * targetRect.width * 0.6);
        const y = targetRect.top - containerRect.top - 40; // Perch slightly above the plant
        
        const habitName = target.getAttribute('data-habit-name') || '';
        const status = target.getAttribute('data-status') || 'Normal';
        
        setTargetPos({ x, y, name: habitName, status });
      } else {
        // Return to a default or wild position occasionally
        setTargetPos(null);
      }
    };

    // Initial delay so layout can settle
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timerId = setTimeout(() => {
        if (!isFleeing) pickTarget();
        scheduleNext();
      }, 10000 + Math.random() * 8000);
    };

    timerId = setTimeout(() => {
       pickTarget();
       scheduleNext();
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [companionId, trustLevel, isFleeing]);

  useEffect(() => {
    if (trustLevel >= 4) {
      const handleMouseMove = (e: MouseEvent) => {
        if (Math.random() > 0.95) { 
           const container = containerRef.current?.closest('.inset-0') as HTMLElement;
           if (container) {
             const containerRect = container.getBoundingClientRect();
             setTargetPos({ 
               x: e.clientX - containerRect.left - 30, 
               y: e.clientY - containerRect.top - 30, 
               name: 'Cursor', 
               status: 'Normal' 
             });
           }
        }
      };
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [trustLevel]);

  if (!SvgComponent) return null;
  
  // Determine flyer vs sitter
  const isFlyer = ['shongee', 'projapoti', 'moumachhi', 'phoring', 'jonaki', 'machranga', 'pecha'].includes(companionId);
  const isSitter = ['doel', 'kaktadhua', 'ladybug', 'chorui', 'tuntuni', 'bang', 'shalik'].includes(companionId);
  
  let baseClass = '';
  switch (companionId) {
    case 'shongee':
      baseClass = 'top-1/3 left-1/4 animate-hovering animate-duration-[4000ms]';
      break;
    case 'kaktadhua':
      baseClass = 'bottom-10 right-10 scale-150 transform-origin-bottom';
      break;
    case 'doel':
      baseClass = 'bottom-20 left-1/4 animate-perch-sing animate-duration-[10000ms]';
      break;
    case 'projapoti':
      baseClass = 'animate-fluttering top-1/4 left-1/4 animate-duration-[12000ms]';
      break;
    case 'moumachhi':
      baseClass = 'animate-hovering top-1/3 right-1/4 animate-duration-[4000ms]';
      break;
    case 'ladybug':
      baseClass = 'animate-crawling bottom-10 left-10 animate-duration-[20000ms]';
      break;
    case 'chorui':
      baseClass = 'animate-hopping bottom-4 right-1/3 animate-duration-[6000ms]';
      break;
    case 'tuntuni':
      baseClass = 'animate-perch-flick top-1/3 left-1/3 animate-duration-[5000ms]';
      break;
    case 'phoring':
      baseClass = 'animate-darting top-1/4 right-1/5 animate-duration-[7000ms]';
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
      baseClass = 'animate-frog-hop bottom-2 right-10 animate-duration-[15000ms]';
      break;
    case 'shalik':
      baseClass = 'animate-strutting bottom-2 left-1/2 animate-duration-[10000ms]';
      break;
    case 'machranga':
      baseClass = 'animate-dive top-1/4 right-1/4 animate-duration-[12000ms]';
      break;
    case 'pecha':
      baseClass = 'animate-perch-blink top-20 right-10 animate-duration-[8000ms] opacity-80';
      break;
  }

  // Remove positioning classes from baseClass if we have a target
  const isVisiting = targetPos !== null;
  const appliedClass = isVisiting 
    ? baseClass.replace(/top-\S+|bottom-\S+|left-\S+|right-\S+/g, '') 
    : baseClass;

  const style: React.CSSProperties = isVisiting ? {
     top: 0,
     left: 0,
     transform: `translate(${targetPos.x}px, ${targetPos.y}px)`,
     transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)',
  } : {
     transition: 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)'
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => {
        if (trustLevel <= 1) {
           setIsFleeing(true);
           setTargetPos(null); // flee back to edge
           setTimeout(() => setIsFleeing(false), 5000);
        }
      }}
      onClick={() => {
         if (trustLevel <= 2) {
           setIsFleeing(true);
           setTargetPos(null);
           setTimeout(() => setIsFleeing(false), 5000);
         } else if (trustLevel >= 3) {
           // Happy animation
           const el = containerRef.current;
           if (el) {
              el.style.transform = (el.style.transform || '') + ' scale(1.2) rotate(10deg)';
              setTimeout(() => {
                 if (el) el.style.transform = el.style.transform.replace(' scale(1.2) rotate(10deg)', '');
              }, 300);
           }
         }
      }}
      className={`absolute ${appliedClass} w-16 h-16 z-20 group pointer-events-auto cursor-pointer ${isFleeing ? 'opacity-50' : ''}`}
      style={{
         ...style,
         ...(trustLevel >= 6 ? { filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' } : {})
      }}
    >
      <div className={`relative w-full h-full ${isVisiting ? 'animate-companion-nuzzle' : (isFlyer ? 'animate-companion-float' : (isSitter ? 'animate-companion-bounce' : ''))}`}>
         {isFlyer && (
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/10 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         )}
         {isSitter && (
           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#78350F]/20 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         )}
         
         {isVisiting && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center animate-bounce z-30">
               {targetPos.status === 'Dead' || targetPos.status === 'Critical' || targetPos.status === 'Wilting' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 drop-shadow-md">
                     <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
               ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rose-400 drop-shadow-md">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
               )}
            </div>
         )}
         
         <SvgComponent className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1" />
      </div>
    </div>
  );
};
