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
      case 'streak_reached': return stats.bestDailyGardenStreak || 0;
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
    <div className="bg-gradient-to-br from-[#021b2b] via-[#051121] to-[#010810] min-h-[calc(100vh-6rem)] -mx-4 md:-mx-8 -mt-4 md:-mt-8 p-6 md:p-10 rounded-b-[40px] md:rounded-[40px] shadow-2xl animate-in fade-in duration-500 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00F5D4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Panel */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 rounded-[32px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#00F5D4]/20 rounded-2xl shadow-[0_0_25px_rgba(0,245,212,0.3)] border border-[#00F5D4]/30">
              <LucideIcons.Award className="w-8 h-8 text-[#00F5D4]" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Garden Badges</h2>
              <p className="text-[#00F5D4] text-xs font-mono tracking-widest uppercase mt-1">
                Unlocked: {unlockedCount} / {totalCount}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
             <p className="text-2xl font-display font-bold text-white">{progressPercent}%</p>
             <p className="text-xs font-mono text-emerald-100/50 tracking-widest uppercase">Completion</p>
          </div>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/5 shadow-inner">
          <div 
            className="bg-gradient-to-r from-[#00b8a3] to-[#00F5D4] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,245,212,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6 -mx-2 px-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-all duration-300 backdrop-blur-md border ${
              filter === cat 
                ? 'bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]/40 shadow-[0_0_15px_rgba(0,245,212,0.2)]' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {filteredBadges.map(badge => {
          const isUnlocked = !!unlockedBadges[badge.badgeId];
          const currentProgress = getProgress(badge);
          const progressValue = Math.min(badge.targetValue, currentProgress);
          const percent = Math.min(100, Math.round((progressValue / badge.targetValue) * 100));
          const Icon = (LucideIcons as any)[badge.iconName] || Leaf;

          return (
            <div 
              key={badge.badgeId} 
              className={`relative bg-white/10 backdrop-blur-xl p-6 rounded-[24px] border border-white/20 flex gap-5 overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] ${
                isUnlocked ? '' : 'opacity-80'
              }`}
            >
               {/* Internal gradient shine */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

               <div className={`shrink-0 w-14 h-14 flex items-center justify-center rounded-[18px] transition-all duration-500 z-10 ${
                 isUnlocked 
                   ? 'bg-[#00F5D4]/20 text-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.4)] border border-[#00F5D4]/30 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,245,212,0.6)]' 
                   : 'bg-white/5 text-white/50 border border-white/10 backdrop-blur-md'
               }`}>
                 {isUnlocked ? <Icon className="w-7 h-7 drop-shadow-md" /> : <Lock className="w-6 h-6" />}
               </div>
               
               <div className="flex-1 min-w-0 z-10 flex flex-col justify-center">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className={`font-bold text-lg truncate ${isUnlocked ? 'text-white drop-shadow-sm' : 'text-slate-200'}`}>
                      {badge.title}
                    </h3>
                    <span className={`shrink-0 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-lg ${
                      isUnlocked ? 'bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20' : 'bg-black/30 text-slate-400 border border-white/5'
                    }`}>
                      {badge.category}
                    </span>
                  </div>
                  
                  <p className="text-[13px] text-emerald-50/70 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                  
                  {isUnlocked ? (
                    <div className="mt-auto flex items-center justify-between text-[10px] font-mono text-[#00F5D4] uppercase tracking-widest pt-2 border-t border-white/10">
                       <span className="flex items-center gap-1.5"><LucideIcons.Sparkles className="w-3 h-3" /> Unlocked {format(new Date(unlockedBadges[badge.badgeId].unlockedAt), "MMM d, yyyy")}</span>
                       {badge.rewardXP > 0 && <span className="font-bold">+{badge.rewardXP} XP</span>}
                    </div>
                  ) : (
                    <div className="mt-auto pt-2 border-t border-white/5">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-100/50 uppercase tracking-widest mb-2">
                         <span>Progress</span>
                         <span>{progressValue} / {badge.targetValue}</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden shadow-inner border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-slate-600 to-slate-400 h-full rounded-full transition-all duration-500 relative"
                          style={{ width: `${percent}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full" />
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>
          );
        })}
        {filteredBadges.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-mono text-sm uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px]">
             No badges found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
