import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Habit, UserStats } from '../types';
import { PlantIcon } from './PlantIcon';

interface GardenTerrainViewProps {
  habits: Habit[];
  equippedPotId?: string;
  stats: UserStats;
  dateKey: string;
}

export const GardenTerrainView: React.FC<GardenTerrainViewProps> = ({ habits, equippedPotId, stats, dateKey }) => {
  // Simple grid layout algorithm
  const columns = Math.ceil(Math.sqrt(habits.length > 0 ? habits.length : 1));
  
  return (
    <div className="w-full h-[60vh] bg-surface-card border border-surface-alt rounded-2xl overflow-hidden relative shadow-inner">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        limitToBounds={false}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div className="p-20 relative w-full h-full min-w-[800px] min-h-[800px] flex items-center justify-center bg-[#a8c985]">
            {/* Base Grass Pattern SVG */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%237ba55a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }} />
            
            <div 
              className="grid gap-xs relative z-10"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: '40px',
                padding: '40px'
              }}
            >
              {habits.map((habit, i) => {
                return (
                  <div key={habit.id} className="relative w-32 h-32 flex flex-col items-center justify-end">
                    {/* Dirt Patch SVG Base */}
                    <div className="absolute bottom-0 w-28 h-16 bg-[#7c5a45] rounded-[50%] border-b-4 border-[#5c4033] shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]"></div>
                    
                    {/* The Plant */}
                    <div className="relative z-10 w-24 h-24 mb-6 flex justify-center items-end drop-shadow-xl hover:scale-110 transition-transform">
                      <PlantIcon 
                         plantType={habit.plantType} 
                         stage={habit.plantStage} 
                         status={habit.plantStatus} 
                         health={habit.plantHealth}
                         isLegendary={habit.isLegendary}
                         isArchived={habit.isArchived}
                         className="w-full h-full object-contain origin-bottom"
                      />
                    </div>
                    
                    {/* Floating Name/Level indicator */}
                    <div className="absolute -bottom-6 bg-surface-card/90 backdrop-blur-sm border border-surface-alt px-2 py-0.5 rounded-md text-[10px] font-bold text-primary-text flex items-center gap-1 shadow-sm whitespace-nowrap z-20">
                      {habit.name}
                    </div>
                  </div>
                );
              })}
              
              {habits.length === 0 && (
                 <div className="col-span-full text-center text-[#5c4033] font-bold">
                    No plants in the garden yet. Plant some seeds!
                 </div>
              )}
            </div>
            
          </div>
        </TransformComponent>
      </TransformWrapper>
      
      <div className="absolute bottom-4 left-4 bg-surface-card/60 backdrop-blur border border-surface-alt px-3 py-1.5 rounded-lg text-xs font-bold text-muted-text pointer-events-none z-10">
        Pinch or scroll to zoom. Drag to pan.
      </div>
    </div>
  );
};
