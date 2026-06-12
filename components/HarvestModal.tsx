import React from 'react';
import { PlantIcon } from './PlantIcon';

interface HarvestModalProps {
  data: { fruitId: string, fruitName: string, xpReward: number, coinReward: number, habitName: string };
  onClose: () => void;
}

export const HarvestModal: React.FC<HarvestModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121620] border border-amber-500/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
        
        <div className="p-6 text-center">
          <div className="mx-auto w-24 h-24 mb-4 bg-amber-500/10 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(245,158,11,0.2)]">
             <div className="absolute inset-0 border border-amber-500/50 rounded-full animate-ping opacity-50" style={{ animationDuration: '3s' }} />
             <PlantIcon plantType={data.fruitId as any} stage="Fruiting Plant" status="Normal" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10" />
          </div>
          
          <h2 className="text-2xl font-black font-display text-white mb-2 line-clamp-1">Harvested!</h2>
          <p className="text-amber-500 font-mono text-sm tracking-widest uppercase pb-4">
             {data.fruitName}
          </p>

          <div className="bg-black/30 rounded-xl p-4 border border-surface-alt mb-6">
             <p className="text-xs text-slate-400 mb-2">From habit <span className="text-slate-300 font-bold">"{data.habitName}"</span></p>
             <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                   <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-1">XP Gained</div>
                   <div className="font-bold text-lg text-white">+{data.xpReward}</div>
                </div>
                <div className="w-px bg-surface-alt/10" />
                <div className="text-center">
                   <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-1">Coins Earned</div>
                   <div className="font-bold text-lg text-white">+{data.coinReward}</div>
                </div>
             </div>
          </div>

          <button
             onClick={onClose}
             className="w-full py-4 text-sm font-black uppercase tracking-widest font-mono bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors shadow-lg shadow-amber-500/20"
          >
             Collect Reward
          </button>
        </div>
      </div>
    </div>
  );
};
