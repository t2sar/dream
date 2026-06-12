import React, { useMemo } from 'react';
import { Leaf, X } from 'lucide-react';
import { OrchardEntry } from '../types';
import { PlantIcon } from './PlantIcon';

interface OrchardModalProps {
  entries: OrchardEntry[];
  habits: { id: string, name: string }[];
  onClose: () => void;
}

export const OrchardModal: React.FC<OrchardModalProps> = ({ entries, habits, onClose }) => {
  // Merge duplicates by fruitId
  const mergedFruits = useMemo(() => {
    const map = new Map<string, { fruitId: string, count: number, habits: string[], first: Date, last: Date }>();
    for (const entry of entries) {
      const hName = habits.find(h => h.id === entry.habitId)?.name || 'Unknown Plant';
      if (!map.has(entry.fruitId)) {
         map.set(entry.fruitId, {
            fruitId: entry.fruitId,
            count: entry.count,
            habits: [`${hName} (${entry.count})`],
            first: new Date(entry.firstHarvest),
            last: new Date(entry.lastHarvest)
         });
      } else {
         const existing = map.get(entry.fruitId)!;
         existing.count += entry.count;
         existing.habits.push(`${hName} (${entry.count})`);
         const eFirst = new Date(entry.firstHarvest);
         const eLast = new Date(entry.lastHarvest);
         if (eFirst < existing.first) existing.first = eFirst;
         if (eLast > existing.last) existing.last = eLast;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.last.getTime() - a.last.getTime());
  }, [entries, habits]);

  const [selected, setSelected] = React.useState<typeof mergedFruits[0] | null>(null);

  if (selected) {
     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121620] border border-amber-500/30 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
             <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
               <X className="w-5 h-5" />
             </button>
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                   <PlantIcon plantType={selected.fruitId as any} stage="Fruiting Plant" status="Normal" className="w-16 h-16 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-hovering" />
                </div>
                <h3 className="text-2xl font-black font-display text-white mb-1">{selected.fruitId.split(' / ')[0]}</h3>
                <p className="text-xs font-mono text-amber-500 tracking-widest uppercase mb-6">Harvested {selected.count} {selected.count === 1 ? 'Time' : 'Times'}</p>
                
                <div className="w-full bg-black/30 rounded-xl p-4 text-left border border-surface-alt space-y-3">
                   <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Grown From</div>
                      <div className="text-sm text-slate-300">{selected.habits.join(', ')}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                         <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">First Harvest</div>
                         <div className="text-sm text-slate-300">{selected.first.toLocaleDateString()}</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Last Harvest</div>
                         <div className="text-sm text-slate-300">{selected.last.toLocaleDateString()}</div>
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelected(null)} className="mt-8 w-full py-4 text-xs font-black uppercase tracking-widest font-mono bg-surface-alt/5 hover:bg-surface-alt/10 text-white rounded-xl transition-colors">
                   Back to Orchard
                </button>
             </div>
          </div>
        </div>
     );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121620] border border-amber-500/30 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
        
        <div className="p-6 pb-4 flex justify-between items-center border-b border-surface-alt">
           <div>
             <h2 className="text-2xl font-black font-display tracking-tight text-white mb-1 flex items-center gap-2">
                My Orchard
             </h2>
             <p className="text-amber-500 font-mono text-xs tracking-widest uppercase">
                {mergedFruits.reduce((s, a) => s + a.count, 0)} Total Harvests
             </p>
           </div>
           <button onClick={onClose} className="p-2 rounded-full bg-surface-alt/5 text-slate-400 hover:text-white hover:bg-rose-500/20 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
           {mergedFruits.length === 0 ? (
              <div className="text-center py-16 px-4">
                 <div className="w-20 h-20 mx-auto bg-surface-alt/5 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-slate-500" />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">Orchard is Empty</h3>
                 <p className="text-sm text-slate-400 max-w-xs mx-auto">Nurture a plant to its final stage to harvest its fruit.</p>
              </div>
           ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {mergedFruits.map((item, idx) => (
                    <button 
                       key={idx}
                       onClick={() => setSelected(item)}
                       className="bg-black/20 border border-surface-alt rounded-2xl p-4 flex flex-col items-center hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group"
                    >
                       <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                          <PlantIcon plantType={item.fruitId as any} stage="Fruiting Plant" status="Normal" className="w-12 h-12 group-hover:scale-110 transition-transform drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
                          <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#121620]">
                             ×{item.count}
                          </div>
                       </div>
                       <span className="text-xs font-bold text-white text-center leading-tight truncate w-full">{item.fruitId.split(' / ')[0]}</span>
                    </button>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
