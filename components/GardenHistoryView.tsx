import React, { useState } from 'react';
import { Archive, Leaf, Trophy, ArrowLeft, RefreshCw, Trash2, CalendarDays, Edit3, Star, CloudRain, Droplets, BookOpen } from 'lucide-react';
import { Habit, ArchiveType } from '../types';
import { PlantIcon } from './PlantIcon';

interface GardenHistoryViewProps {
  archivedHabits: Habit[];
  onRestore: (habitId: string, asNewSeed: boolean) => void;
  onDeletePermanently: (habitId: string) => void;
  onUpdateNote: (habitId: string, note: string) => void;
}

export const GardenHistoryView: React.FC<GardenHistoryViewProps> = ({ 
  archivedHabits, 
  onRestore, 
  onDeletePermanently,
  onUpdateNote
}) => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activeSection, setActiveSection] = useState<'completed' | 'archived' | 'revived' | 'fresh_start' | 'legendary'>('completed');

  const formatArchiveType = (type?: ArchiveType) => {
    if (!type) return "Archived";
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const isHabitLegendary = (h: Habit) => 
    h.isLegendary || h.archiveType === 'legendary_plant' || (h.bestStreak && h.bestStreak >= 30) || (h.totalCompletions && h.totalCompletions >= 50);

  const getCalculatedArchiveType = (h: Habit): ArchiveType | 'legendary_plant' | 'completed_plant' | 'fresh_start_plant' | 'archived_plant' | 'revived_plant' => {
    if (h.archiveType) return h.archiveType;
    if (isHabitLegendary(h)) return 'legendary_plant';
    if (h.plantStage === 'Fruiting Plant') return 'completed_plant';
    if (h.plantHealth !== undefined && h.plantHealth <= 0) return 'fresh_start_plant';
    if (h.isRevived || (h.revivalCount && h.revivalCount > 0)) return 'revived_plant';
    return 'archived_plant';
  };

  const getArchiveTypeColor = (type?: string) => {
    switch (type) {
      case 'completed_goal':
      case 'completed_challenge':
      case 'completed_plant': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'retired_habit': 
      case 'fresh_start_plant': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'restarted_as_new_seed': 
      case 'revived_plant': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'legendary_plant': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'manual_archive': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      default: return 'text-[#00F5D4] bg-[#00F5D4]/10 border-[#00F5D4]/20';
    }
  };

  const getSupportiveMessage = (habit: Habit) => {
    if (isHabitLegendary(habit)) return "This plant shows long-term care.";
    if (habit.isFreshStart || habit.archiveType === 'fresh_start_plant' || habit.archiveType === 'retired_habit') return "This journey is saved. A new seed can begin.";
    if (habit.isRevived || habit.archiveType === 'revived_plant') return "This plant recovered through small steps.";
    if (habit.archiveType?.includes('completed') || habit.plantStage === 'Fruiting Plant') return "Your plant completed a meaningful journey.";
    return "This plant is resting in your garden history.";
  };

  if (selectedHabit) {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500">
        <button 
          onClick={() => { setSelectedHabit(null); setIsEditingNote(false); }}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-mono tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Garden History
        </button>

        <div className="glass p-8 rounded-none border border-surface-alt relative mb-6 overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full" />
           <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-shrink-0 flex items-center justify-center bg-surface-alt/5 w-40 h-40 rounded-2xl border border-surface-alt relative">
                 {(isHabitLegendary(selectedHabit)) && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 z-20">
                       <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                 )}
                 <PlantIcon 
                    plantType={selectedHabit.plantType} 
                    stage={selectedHabit.plantStage} 
                    status={selectedHabit.plantStatus} 
                    className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                 />
              </div>
              <div className="flex-1">
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-3 border ${getArchiveTypeColor(getCalculatedArchiveType(selectedHabit))}`}>
                    <BookOpen className="w-3 h-3" />
                    {formatArchiveType(getCalculatedArchiveType(selectedHabit))}
                 </div>
                 <h2 className="text-3xl font-display font-bold text-white mb-1">
                    {selectedHabit.isPrivate ? "Private Plant" : (selectedHabit.plantType?.split(' / ')[0] || "Plant")}
                 </h2>
                 <p className="text-slate-400 text-sm mb-2">
                    {selectedHabit.isPrivate ? "Protection Journey" : selectedHabit.name}
                 </p>
                 <p className="text-[#00F5D4] text-xs font-mono italic mb-4">
                    "{getSupportiveMessage(selectedHabit)}"
                 </p>
                 
                 <div className="grid grid-cols-2 gap-4 max-w-xs">
                    <div className="bg-surface-alt/5 p-3 rounded-lg border border-surface-alt">
                       <p className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase mb-1">Best Streak</p>
                       <p className="font-bold text-white text-lg">{selectedHabit.bestStreak || selectedHabit.streak || 0} days</p>
                    </div>
                    <div className="bg-surface-alt/5 p-3 rounded-lg border border-surface-alt">
                       <p className="text-[10px] font-mono tracking-widest text-amber-400 uppercase mb-1">Total XP</p>
                       <p className="font-bold text-white text-lg">{selectedHabit.xp || 0}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="glass p-6 rounded-none border border-surface-alt">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2">
                 <CalendarDays className="w-4 h-4" /> Journey Log
              </h3>
              <div className="space-y-3 font-mono text-sm text-slate-300">
                 <div className="flex justify-between border-b border-surface-alt pb-2">
                    <span className="text-slate-500">Created:</span>
                    <span>{new Date(selectedHabit.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between border-b border-surface-alt pb-2">
                    <span className="text-slate-500">Memory Saved:</span>
                    <span>{selectedHabit.archivedAt ? new Date(selectedHabit.archivedAt).toLocaleDateString() : 'Unknown'}</span>
                 </div>
                 <div className="flex justify-between border-b border-surface-alt pb-2">
                    <span className="text-slate-500">Completions:</span>
                    <span>{selectedHabit.totalCompletions || 0}</span>
                 </div>
                 <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Final Stage:</span>
                    <span>{selectedHabit.plantStage || 'Seed'}</span>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-none border border-surface-alt flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Memory Note
                 </h3>
                 {!isEditingNote && (
                    <button onClick={() => { setIsEditingNote(true); setNoteText(selectedHabit.archiveNote || ""); }} className="text-cyan-500 hover:text-cyan-400">
                       <Edit3 className="w-4 h-4" />
                    </button>
                 )}
              </div>
              
              {isEditingNote ? (
                 <div className="flex-1 flex flex-col gap-3">
                    <textarea 
                       value={noteText}
                       onChange={e => setNoteText(e.target.value)}
                       maxLength={200}
                       placeholder="Memory note... (e.g., 'This habit helped me before exams.')"
                       className="w-full bg-[#07080A] border border-surface-alt p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none h-24"
                    />
                    <div className="flex justify-end gap-2 mt-auto">
                       <button onClick={() => setIsEditingNote(false)} className="text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-slate-300 px-3 py-1">Cancel</button>
                       <button onClick={() => { onUpdateNote(selectedHabit.id, noteText); setIsEditingNote(false); setSelectedHabit({...selectedHabit, archiveNote: noteText}); }} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-1 text-xs font-mono uppercase tracking-widest hover:bg-cyan-500/30">Save</button>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 text-sm text-slate-300 italic p-3 bg-surface-alt/5 border border-surface-alt rounded-lg min-h-[6rem]">
                    {selectedHabit.archiveNote ? `"${selectedHabit.archiveNote}"` : "No note added."}
                 </div>
              )}
           </div>
        </div>

        <div className="glass p-6 rounded-none border border-rose-500/20 bg-rose-500/5 mt-8">
           <h3 className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-4 flex items-center gap-2">
              Memory Actions
           </h3>
           <div className="flex flex-wrap gap-4">
              <button 
                 onClick={() => {
                    if (confirm("Keep this memory but start a new active seed for this habit?")) {
                       onRestore(selectedHabit.id, true);
                       setSelectedHabit(null);
                    }
                 }}
                 className="px-4 py-2 border border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors font-mono uppercase tracking-widest text-xs flex items-center gap-2"
              >
                 <RefreshCw className="w-4 h-4" /> Restart with New Seed
              </button>
              <button 
                 onClick={() => {
                    if (confirm("Restore this plant to your active garden?")) {
                       onRestore(selectedHabit.id, false);
                       setSelectedHabit(null);
                    }
                 }}
                 className="px-4 py-2 border border-slate-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono uppercase tracking-widest text-xs flex items-center gap-2"
              >
                 <Leaf className="w-4 h-4" /> Restore Plant
              </button>
              <button 
                 onClick={() => {
                    if (confirm("Permanently delete this memory? This cannot be undone.")) {
                       onDeletePermanently(selectedHabit.id);
                       setSelectedHabit(null);
                    }
                 }}
                 className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors font-mono uppercase tracking-widest text-xs flex items-center gap-2 ml-auto"
              >
                 <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>
           </div>
        </div>

      </div>
    );
  }

  const completed = archivedHabits.filter(h => getCalculatedArchiveType(h) === 'completed_plant' || getCalculatedArchiveType(h) === 'completed_goal' || getCalculatedArchiveType(h) === 'completed_challenge');
  const legendary = archivedHabits.filter(h => isHabitLegendary(h));
  const freshStart = archivedHabits.filter(h => getCalculatedArchiveType(h) === 'fresh_start_plant' || getCalculatedArchiveType(h) === 'retired_habit' || getCalculatedArchiveType(h) === 'restarted_as_new_seed');
  const revived = archivedHabits.filter(h => getCalculatedArchiveType(h) === 'revived_plant');
  
  // Anything not in above categories falls into archived
  const archived = archivedHabits.filter(h => 
    !completed.includes(h) && 
    !legendary.includes(h) && 
    !freshStart.includes(h) && 
    !revived.includes(h)
  );
  
  const bestLifetimeStreak = archivedHabits.reduce((acc, h) => Math.max(acc, h.bestStreak || h.streak || 0), 0);
  const totalSavedCompletions = archivedHabits.reduce((acc, h) => acc + (h.totalCompletions || 0), 0);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col items-center justify-center text-center py-10 mb-8 border-b border-surface-alt relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <BookOpen className="w-12 h-12 text-emerald-500 mb-4 opacity-80" />
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-2">
          Garden History
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto font-mono text-xs uppercase tracking-widest leading-relaxed mb-6">
          Your plants, memories, and habit journey
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono tracking-widest text-slate-300 uppercase">
           <div className="bg-surface-alt/5 px-4 py-2 rounded-lg border border-surface-alt">{archivedHabits.length} Memories Saved</div>
           <div className="bg-surface-alt/5 px-4 py-2 rounded-lg border border-surface-alt">{completed.length} Completed</div>
           <div className="bg-surface-alt/5 px-4 py-2 rounded-lg border border-surface-alt">{legendary.length} Legendary</div>
           <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-lg">Best Streak: {bestLifetimeStreak} Days</div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hidden-scrollbar w-full border-b border-surface-alt">
        <button onClick={() => setActiveSection('completed')} className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeSection === 'completed' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Completed Plants</button>
        <button onClick={() => setActiveSection('legendary')} className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeSection === 'legendary' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Legendary Plants</button>
        <button onClick={() => setActiveSection('archived')} className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeSection === 'archived' ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Archived Plants</button>
        <button onClick={() => setActiveSection('revived')} className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeSection === 'revived' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Revived Plants</button>
        <button onClick={() => setActiveSection('fresh_start')} className={`px-4 py-2 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeSection === 'fresh_start' ? 'border-slate-400 text-slate-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Fresh Start Plants</button>
      </div>

      {archivedHabits.length === 0 ? (
        <div className="glass p-12 text-center rounded-none border border-surface-alt flex flex-col items-center justify-center">
           <Archive className="w-12 h-12 text-slate-600 mb-6" />
           <h3 className="text-xl font-display font-bold text-white mb-2">No plant memories yet</h3>
           <p className="text-slate-500 text-sm max-w-sm mx-auto">
             Complete, archive, revive, or grow plants to save their stories here.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
           {archivedHabits
              .filter(h => {
                 if (activeSection === 'completed') return completed.includes(h);
                 if (activeSection === 'legendary') return legendary.includes(h);
                 if (activeSection === 'archived') return archived.includes(h);
                 if (activeSection === 'revived') return revived.includes(h);
                 if (activeSection === 'fresh_start') return freshStart.includes(h);
                 return true;
              })
              .sort((a,b) => (b.archivedAt ? new Date(b.archivedAt).getTime() : 0) - (a.archivedAt ? new Date(a.archivedAt).getTime() : 0))
              .map(habit => (
              <button 
                 key={habit.id}
                 onClick={() => setSelectedHabit(habit)}
                 className="glass p-4 rounded-xl border border-surface-alt hover:border-emerald-500/30 hover:bg-surface-alt/10 transition-all group flex flex-col h-full text-left relative"
              >
                 {(isHabitLegendary(habit)) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20 z-10">
                       <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                 )}
                 <div className="flex items-start justify-between mb-4 w-full">
                    <div className="bg-[#07080A]/50 p-2 rounded-lg border border-surface-alt">
                       <PlantIcon plantType={habit.plantType} stage={habit.plantStage} status={habit.plantStatus} isPrivate={habit.isPrivate} isLegendary={habit.isLegendary} isArchived={habit.isArchived} className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest border ${getArchiveTypeColor(getCalculatedArchiveType(habit))}`}>
                       {formatArchiveType(getCalculatedArchiveType(habit))}
                    </div>
                 </div>
                 
                 <h4 className="font-bold text-white mb-1 line-clamp-1">{habit.isPrivate ? "Private Plant" : (habit.plantType?.split(' / ')[0] || "Plant")}</h4>
                 <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-3 line-clamp-1">{habit.isPrivate ? "Hidden Details" : habit.name}</p>
                 
                 <div className="mt-auto pt-3 border-t border-surface-alt flex gap-4 w-full">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-slate-600 uppercase">Streak</span>
                       <span className="font-bold text-amber-500/80 text-xs">{habit.bestStreak || habit.streak || 0}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-slate-600 uppercase">XP</span>
                       <span className="font-bold text-cyan-500/80 text-xs">{habit.xp || 0}</span>
                    </div>
                 </div>
              </button>
           ))}
        </div>
      )}
    </div>
  );
};
