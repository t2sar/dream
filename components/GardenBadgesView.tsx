import React, { useState } from 'react';
import { UserStats, AchievementBadge } from '../types';
import { ACHIEVEMENT_BADGES } from '../badgeConfig';
import * as LucideIcons from 'lucide-react';
import { Leaf, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface GardenBadgesViewProps {
  stats: Partial<UserStats>;
}

export const GardenBadgesView: React.FC<GardenBadgesViewProps> = ({ stats }) => {
  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'Locked' | string>('All');
  
  const unlockedBadges = stats.unlockedBadgeIds || {};
  const unlockedCount = Object.keys(unlockedBadges).length;
  const totalCount = ACHIEVEMENT_BADGES.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const getProgress = (badge: AchievementBadge) => {
    switch (badge.conditionType) {
      case 'habit_created_count': return stats.habitsCreatedCount || 0;
      case 'habit_completed_count': return stats.totalHabitsCompleted || 0;
      case 'streak_reached': return stats.bestDailyGardenStreak || 0; // Using daily garden streak as global proxy for now
      case 'perfect_garden_days': return stats.perfectGardenDays || 0;
      case 'plant_fruiting_count': return stats.plantsFruitedCount || 0;
      case 'plant_saved_count': return stats.plantsRevived || 0;
      case 'challenge_completed_count': return stats.challengesCompletedCount || 0;
      case 'quest_completed_count': return stats.questsCompletedCount || 0;
      case 'level_reached': return stats.level || 1;
      case 'shop_purchase_count': return stats.shopPurchasesCount || 0;
      default: return 0;
    }
  };

  const filteredBadges = ACHIEVEMENT_BADGES.filter(b => {
    const isUnlocked = !!unlockedBadges[b.badgeId];
    if (filter === 'Unlocked' && !isUnlocked) return false;
    if (filter === 'Locked' && isUnlocked) return false;
    if (filter !== 'All' && filter !== 'Unlocked' && filter !== 'Locked' && b.category !== filter) return false;
    return true;
  }).sort((a, b) => {
    const aUnlocked = !!unlockedBadges[a.badgeId];
    const bUnlocked = !!unlockedBadges[b.badgeId];
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    if (aUnlocked && bUnlocked) {
      return new Date(unlockedBadges[b.badgeId].unlockedAt).getTime() - new Date(unlockedBadges[a.badgeId].unlockedAt).getTime();
    }
    const aProg = Math.min(1, getProgress(a) / a.targetValue);
    const bProg = Math.min(1, getProgress(b) / b.targetValue);
    return bProg - aProg;
  });

  const categories = ['All', 'Unlocked', 'Locked', 'Starter', 'Streak', 'Plant', 'Recovery', 'Daily Garden', 'Challenge', 'Level'];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="glass p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-full">
            <LucideIcons.Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Garden Badges</h2>
            <p className="text-emerald-200 text-xs font-mono tracking-widest uppercase">
              Unlocked: {unlockedCount} / {totalCount}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-surface-alt">
          <div 
            className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-[10px] text-slate-400 font-mono mt-2">{progressPercent}% Complete</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border ${filter === cat ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-[#0d1017] text-slate-400 border-surface-alt hover:bg-surface-alt/5 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = !!unlockedBadges[badge.badgeId];
          const currentProgress = getProgress(badge);
          const progressValue = Math.min(badge.targetValue, currentProgress);
          const percent = Math.min(100, Math.round((progressValue / badge.targetValue) * 100));
          const Icon = (LucideIcons as any)[badge.iconName] || Leaf;

          return (
            <div 
              key={badge.badgeId} 
              className={`glass p-5 border flex gap-4 ${isUnlocked ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-surface-alt opacity-70 grayscale hover:grayscale-0 transition-all'}`}
            >
               <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                 {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-bold truncate">{badge.title}</h3>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 px-2 py-0.5 bg-surface-alt/5 rounded">
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{badge.description}</p>
                  
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">
                       <span>Unlocked: {format(new Date(unlockedBadges[badge.badgeId].unlockedAt), "MMM d, yyyy")}</span>
                       {badge.rewardXP > 0 && <span>+{badge.rewardXP} XP</span>}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                         <span>Progress</span>
                         <span>{progressValue} / {badge.targetValue}</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-slate-500 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
               </div>
            </div>
          );
        })}
        {filteredBadges.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
             No badges found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
