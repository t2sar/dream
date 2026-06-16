import React from 'react';
import { SeasonalEvent, UserEventProgress } from '../types';
import { X, Gift, Trophy, Star, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface EventDetailModalProps {
  event: SeasonalEvent;
  progress: UserEventProgress;
  onClose: () => void;
  onClaimReward: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, progress, onClose, onClaimReward }) => {
  const completedTasks = Object.values(progress.questProgress).filter((count, index) => 
    count >= event.quests[index].requiredCount
  ).length;

  const isAllComplete = completedTasks >= event.quests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-background-main border border-surface-alt shadow-2xl relative flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-surface-alt relative bg-gradient-to-b from-[#00F5D4]/10 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-[#00F5D4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00F5D4]/30 shadow-[0_0_15px_rgba(0,245,212,0.15)]">
            <Gift className="w-8 h-8 text-[#00F5D4]" />
          </div>
          
          <h2 className="text-xl font-bold text-center text-white font-display mb-2">{event.name}</h2>
          <p className="text-xs text-center text-slate-400 max-w-xs mx-auto">
            {event.description}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Event Progress</span>
              <span className="text-xs font-bold text-[#00F5D4]">{completedTasks} / {event.quests.length}</span>
            </div>
            <div className="h-2 w-full bg-surface-alt/5 overflow-hidden">
              <div 
                className="h-full bg-[#00F5D4] transition-all duration-500"
                style={{ width: `${(completedTasks / event.quests.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Quests */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-white mb-2">Event Quests</h3>
            {event.quests.map((quest, index) => {
              const currentCount = progress.questProgress[quest.id] || 0;
              const isQuestComplete = currentCount >= quest.requiredCount;
              
              return (
                <div key={quest.id} className={`p-4 border ${isQuestComplete ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-surface-alt bg-surface-alt/5'} transition-all`}>
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {isQuestComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-dashed" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${isQuestComplete ? 'text-emerald-400' : 'text-slate-200'} mb-1`}>{quest.title}</h4>
                      <p className="text-xs text-slate-400 mb-2">{quest.description}</p>
                      
                      <div className="flex items-center gap-2">
                         <div className="h-1 flex-1 bg-black overflow-hidden">
                           <div 
                             className={`h-full ${isQuestComplete ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                             style={{ width: `${Math.min((currentCount / quest.requiredCount) * 100, 100)}%` }}
                           />
                         </div>
                         <span className="text-[9px] font-mono text-slate-500">{currentCount} / {quest.requiredCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rewards */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-white mb-3">Rewards</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background-main/50 border border-surface-alt flex items-center gap-2 text-xs">
                 <Trophy className="w-4 h-4 text-amber-400" />
                 <span className="text-slate-300 font-mono">+{event.rewardXP} XP</span>
              </div>
              <div className="p-3 bg-background-main/50 border border-surface-alt flex items-center gap-2 text-xs">
                 <Star className="w-4 h-4 text-emerald-400" />
                 <span className="text-slate-300 font-mono">+{event.rewardCoins} Coins</span>
              </div>
              <div className="p-3 bg-background-main/50 border border-surface-alt flex items-center gap-2 text-xs col-span-2">
                 <Gift className="w-4 h-4 text-cyan-400" />
                 <span className="text-slate-300 font-mono">{event.rewardDecorationId.replace('_', ' ').toUpperCase()} DECORATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-surface-alt bg-background-main">
          {isAllComplete && !progress.rewardClaimed ? (
             <Button className="w-full" onClick={onClaimReward}>
               Claim Reward
             </Button>
          ) : progress.rewardClaimed ? (
             <Button className="w-full" variant="secondary" disabled>
               Reward Claimed
             </Button>
          ) : (
            <div className="text-center text-xs font-mono tracking-widest uppercase text-slate-500 py-2">
              Complete all tasks to claim
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
