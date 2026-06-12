import React, { useState } from 'react';
import { Habit, UserStats, ChallengeTemplate, ActiveChallenge, HabitCategory } from '../types';
import { CHALLENGE_TEMPLATES, getChallengeTemplate } from '../challengesData';
import { Target, CheckCircle2, ChevronRight, X, Clock, Play, Droplet, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { format, addDays, isPast, parseISO, isSameDay } from 'date-fns';

interface ChallengesViewProps {
  habits: Habit[];
  stats: UserStats;
  onJoinChallenge: (templateId: string, habitId?: string) => void;
  onQuitChallenge: (challengeId: string) => void;
  onClaimChallengeReward: (challengeId: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ habits, stats, onJoinChallenge, onQuitChallenge, onClaimChallengeReward }) => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);

  const activeChallenge = stats.activeChallenge;
  const activeTemplate = activeChallenge ? getChallengeTemplate(activeChallenge.templateId) : null;

  const categories = ['all', 'beginner', 'health', 'study', 'fitness', 'sleep'];

  const filteredTemplates = CHALLENGE_TEMPLATES.filter(c => {
     if (filter === 'all') return true;
     if (filter === 'beginner') return c.difficulty === 'easy' && c.category === 'all';
     return c.category === filter;
  });

  const handleStart = (templateId: string) => {
     onJoinChallenge(templateId);
     setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Active Challenge Banner */}
      {activeChallenge && activeTemplate && activeChallenge.status === 'active' && (
        <div className="bg-[#0A0D14] border border-[#00F5D4]/20 rounded-3xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5D4]/10 blur-3xl rounded-full" />
           <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                 <div className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase italic mb-1 flex items-center gap-1">
                   <Target className="w-3 h-3" /> Active Challenge
                 </div>
                 <h2 className="text-xl font-bold text-white font-display">{activeTemplate.title}</h2>
                 <p className="text-xs text-slate-400 mt-1">{activeChallenge.completedDates.length} / {activeTemplate.requiredCompletionDays} days completed</p>
                 <div className="mt-4 flex gap-1">
                    {Array.from({ length: activeTemplate.durationDays }).map((_, i) => {
                       const d = addDays(parseISO(activeChallenge.startDate), i);
                       const isToday = isSameDay(d, new Date());
                       const isPastDay = isPast(d) && !isToday;
                       const isCompleted = activeChallenge.completedDates.some((cd: string) => isSameDay(parseISO(cd), d));
                       
                       let bgColor = 'bg-slate-800 border-surface-alt';
                       if (isCompleted) bgColor = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
                       else if (isToday) bgColor = 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
                       else if (isPastDay) bgColor = 'bg-rose-500/10 border-rose-500/30 text-rose-500/50';

                       return (
                          <div key={i} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono transition-colors ${bgColor}`}>
                             {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : (i + 1)}
                          </div>
                       );
                    })}
                 </div>
              </div>
              <div className="pl-6 flex flex-col gap-2">
                 <Button onClick={() => setSelectedTemplate(activeTemplate)} variant="primary" className="text-xs py-2 px-4 h-auto uppercase tracking-widest whitespace-nowrap">View</Button>
              </div>
           </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
         {categories.map(cat => (
           <button
             key={cat}
             onClick={() => setFilter(cat)}
             className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors border ${filter === cat ? 'bg-[#00F5D4]/10 text-[#00F5D4] border-[#00F5D4]/30' : 'bg-transparent text-slate-400 border-surface-alt hover:border-surface-alt'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTemplates.map(template => (
            <div key={template.id} className="bg-[#0d1017] border border-surface-alt rounded-2xl p-5 hover:border-[#00F5D4]/30 transition-colors cursor-pointer group flex flex-col justify-between" onClick={() => setSelectedTemplate(template)}>
               <div>
                  <div className="flex justify-between items-start mb-3">
                     <div className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-bold ${template.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' : template.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {template.difficulty}
                     </div>
                     <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1"><Clock className="w-3 h-3"/> {template.durationDays}D</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-display mb-2 group-hover:text-[#00F5D4] transition-colors">{template.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-surface-alt flex items-center justify-between">
                  <div className="text-[10px] font-mono text-cyan-400 tracking-widest">+ {template.rewardXP} XP</div>
                  <div className="text-[10px] font-mono text-amber-400 tracking-widest">{template.rewardCoins} COINS</div>
               </div>
            </div>
         ))}
      </div>

      {/* Modal */}
      {selectedTemplate && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0d1017] border border-surface-alt shadow-2xl relative flex flex-col max-h-[85vh]">
               <div className="p-6 border-b border-surface-alt relative bg-gradient-to-b from-[#00F5D4]/10 to-transparent">
                  <button onClick={() => setSelectedTemplate(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-16 h-16 bg-[#00F5D4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00F5D4]/30 shadow-[0_0_15px_rgba(0,245,212,0.15)]">
                     <Target className="w-8 h-8 text-[#00F5D4]" />
                  </div>
                  <h2 className="text-xl font-bold text-center text-white font-display mb-2">{selectedTemplate.title}</h2>
                  <div className="flex justify-center gap-3">
                     <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{selectedTemplate.durationDays} Days</span>
                     <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{selectedTemplate.category}</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <p className="text-sm text-slate-300 text-center leading-relaxed">
                     {selectedTemplate.description}
                  </p>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                     <h4 className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">Rewards</h4>
                     <ul className="space-y-2 text-sm text-slate-300 font-mono tracking-wide">
                        <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400"/> +{selectedTemplate.rewardXP} XP</li>
                        <li className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-amber-400"/> +{selectedTemplate.rewardCoins} Coins</li>
                        {selectedTemplate.rewardBadgeId && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> {selectedTemplate.rewardBadgeId.replace('_', ' ').toUpperCase()} BADGE</li>}
                     </ul>
                  </div>

                  {activeChallenge?.templateId === selectedTemplate.id && (
                     <div className="border border-surface-alt bg-surface-alt/5 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Progress</span>
                          <span className="text-xs font-bold text-[#00F5D4]">{activeChallenge.completedDates.length} / {selectedTemplate.requiredCompletionDays}</span>
                        </div>
                        <div className="h-2 w-full bg-black/50 overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 transition-all duration-500"
                            style={{ width: `${Math.min((activeChallenge.completedDates.length / selectedTemplate.requiredCompletionDays) * 100, 100)}%` }}
                          />
                        </div>
                     </div>
                  )}

                  {!activeChallenge && (
                     <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-center">
                        <p className="text-xs text-blue-300/80">
                           You can only have 1 active challenge at a time in MVP.
                        </p>
                     </div>
                  )}
               </div>

               <div className="p-6 border-t border-surface-alt bg-[#0d1017]">
                  {activeChallenge?.templateId === selectedTemplate.id ? (
                      activeChallenge.completedDates.length >= selectedTemplate.requiredCompletionDays && activeChallenge.status !== 'completed' ? (
                        <Button className="w-full" onClick={() => onClaimChallengeReward(activeChallenge.id)}>Claim Reward</Button>
                      ) : activeChallenge.status === 'completed' ? (
                        <Button className="w-full" variant="secondary" disabled>Challenge Completed</Button>
                      ) : (
                        <div className="flex flex-col gap-3">
                           <Button className="w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10" variant="secondary" onClick={() => { onQuitChallenge(activeChallenge.id); setSelectedTemplate(null); }}>Quit Challenge</Button>
                        </div>
                      )
                  ) : (
                      <Button 
                         className="w-full flex items-center justify-center gap-2" 
                         disabled={!!activeChallenge}
                         onClick={() => handleStart(selectedTemplate.id)}
                      >
                         <Play className="w-4 h-4" /> Start Challenge
                      </Button>
                  )}
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
