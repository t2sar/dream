import React from 'react';
import { SeasonalEvent, UserEventProgress } from '../types';
import { CheckCircle2, ChevronRight, Gift, Trophy, Star } from 'lucide-react';

interface EventBannerProps {
  event: SeasonalEvent;
  progress: UserEventProgress;
  onViewEvent: () => void;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event, progress, onViewEvent }) => {
  const completedTasks = Object.values(progress.questProgress).filter((count, index) => 
    count >= event.quests[index].requiredCount
  ).length;

  return (
    <div className="glass p-4 border border-[#00F5D4]/20 rounded-xl mb-6 relative overflow-hidden group cursor-pointer" onClick={onViewEvent}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5D4]/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-[#0d1017]/50 rounded-lg flex items-center justify-center border border-surface-alt">
            <Gift className="w-6 h-6 text-[#00F5D4]" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase italic mb-1">
              Active Seasonal Event
            </div>
            <h3 className="text-sm font-bold text-white font-display mb-1">{event.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{completedTasks} / {event.quests.length} tasks completed</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs text-white font-mono uppercase tracking-widest bg-surface-alt/5 hover:bg-surface-alt/10 px-3 py-2 transition-colors border border-surface-alt">
          View
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
