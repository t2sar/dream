import React from 'react';
import { COMPANIONS } from '../companionsData';

interface CompanionUnlockModalProps {
  companionIds: string[];
  onClose: () => void;
}

export const CompanionUnlockModal: React.FC<CompanionUnlockModalProps> = ({ companionIds, onClose }) => {
  if (!companionIds || companionIds.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121620] border border-emerald-500/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
        
        <div className="p-6 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
             <div className="absolute inset-0 bg-emerald-500/20 animate-ping rounded-full" style={{ animationDuration: '3s' }} />
             <div className="text-4xl relative z-10">🐦‍⬛</div>
          </div>
          
          <div>
             <h2 className="text-2xl font-black font-display tracking-tight text-white mb-2">New Companion!</h2>
             <p className="text-emerald-400 font-mono text-sm tracking-widest uppercase mb-4">A friend has arrived</p>
          </div>

          <div className="space-y-4">
             {companionIds.map(id => {
                const comp = COMPANIONS.find(c => c.id === id);
                if (!comp) return null;
                return (
                   <div key={id} className="bg-surface-alt/5 border border-surface-alt rounded-xl p-4">
                      <h3 className="font-bold text-white text-lg">{comp.name}</h3>
                      <p className="text-emerald-400 font-mono text-xs mb-2">{comp.banglaName}</p>
                      <p className="text-slate-400 text-sm">has chosen your garden.</p>
                      <p className="text-xs text-slate-500 mt-2 italic px-2">Earned: {comp.unlockConditionStr}</p>
                   </div>
                );
             })}
          </div>

          <button
             onClick={onClose}
             className="w-full py-4 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Welcome Them
          </button>
        </div>
      </div>
    </div>
  );
};
