import React, { useState, useMemo } from "react";
import { Plus, X, Search } from "lucide-react";
import { Button } from "./Button";
import { Habit, PlantType } from "../types";
import { CATEGORIES, suggestCategory } from "../categories";
import { PLANTS } from "../plants";
import { PlantIcon } from "./PlantIcon";

interface HabitFormProps {
  userMaxStreak: number;
  onAdd: (
    habit: Omit<
      Habit,
      | "id"
      | "streak"
      | "createdAt"
      | "bestStreak"
      | "totalCompletions"
      | "xp"
      | "plantStage"
      | "plantHealth"
      | "plantStatus"
      | "lastMissCheckedDate"
      | "graceDays"
    >,
  ) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ userMaxStreak, onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Habit["category"]>("health");
  const [icon, setIcon] = useState("Activity");
  const [plantType, setPlantType] = useState<PlantType>("Mango / Aam");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [type, setType] = useState<"build" | "avoid">("build");
  const [replacementAction, setReplacementAction] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [scheduleType, setScheduleType] = useState<Habit['scheduleType']>('daily');
  const [scheduleDays, setScheduleDays] = useState<number[]>([]);
  const [targetCount, setTargetCount] = useState<number>(3);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [intervalValue, setIntervalValue] = useState<number>(2);
  const [intervalUnit, setIntervalUnit] = useState<Habit['intervalUnit']>('days');
  const [quantityTarget, setQuantityTarget] = useState<number>(8);
  const [quantityUnit, setQuantityUnit] = useState<string>('glasses');
  const [plantSearch, setPlantSearch] = useState("");

  const filteredPlants = useMemo(() => {
    if (!plantSearch.trim()) return PLANTS;
    const query = plantSearch.toLowerCase();
    return PLANTS.filter(
      p => p.englishName.toLowerCase().includes(query) || 
           p.banglaName.toLowerCase().includes(query) ||
           p.type.toLowerCase().includes(query)
    );
  }, [plantSearch]);

  React.useEffect(() => {
    if (name.trim() === '') return;
    const lName = name.toLowerCase();
    if (/(water|medicine|fruit|make bed|stretch|1 page)/.test(lName)) {
      setDifficulty("easy");
    } else if (/(gym|workout|no sugar|quit smoking|wake up early|deep work|no social media)/.test(lName)) {
      setDifficulty("hard");
    } else if (/(study|walk|read|journal|clean|prayer|sleep)/.test(lName)) {
      setDifficulty("medium");
    }
    
    // Suggest category
    const suggested = suggestCategory(name);
    if (suggested) {
      setCategory(suggested);
      // set the icon to be empty string so we don't duplicate (legacy icon field)
      setIcon(CATEGORIES[suggested].iconName);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      category,
      icon,
      plantType,
      difficulty,
      type,
      replacementAction: type === 'avoid' ? replacementAction : undefined,
      isPrivate: type === 'avoid' ? isPrivate : undefined,
      color: "bg-gradient-to-r from-[#00F5D4] to-[#3A0CA3]",
      scheduleType,
      scheduleDays: scheduleType === 'specific_days' ? scheduleDays : undefined,
      targetCount: (scheduleType === 'times_per_week' || scheduleType === 'anytime') ? targetCount : undefined,
      monthlyDay: scheduleType === 'monthly' ? monthlyDay : undefined,
      intervalValue: scheduleType === 'custom_interval' ? intervalValue : undefined,
      intervalUnit: scheduleType === 'custom_interval' ? intervalUnit : undefined,
      quantityTarget: scheduleType === 'quantity' ? quantityTarget : undefined,
      quantityUnit: scheduleType === 'quantity' ? quantityUnit : undefined,
    });
  };

  return (
    <div className="p-8 bg-surface-soft border border-surface-alt rounded-card mb-8 animate-in slide-in-from-top-4 fade-in duration-300 relative shadow-sm">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold font-display text-primary-text tracking-wide uppercase">
            Plant New Seed
          </h2>
          <p className="text-secondary-text font-bold text-[11px] uppercase tracking-wide mt-1">
            Configure habit details
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-muted-text hover:text-status-healthy transition-colors border border-transparent rounded-full hover:shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
            Habit Type
          </label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div 
               onClick={() => setType('build')}
               className={`p-3 border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                 type === 'build' ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/15 bg-[#07080A] hover:border-surface-alt'
               }`}
            >
               <span className="text-xl">🌱</span>
               <span className="text-xs font-bold text-white uppercase tracking-wider">Build Habit</span>
               <span className="text-[9px] text-slate-500 text-center uppercase">I want to do this</span>
            </div>
            <div 
               onClick={() => setType('avoid')}
               className={`p-3 border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                 type === 'avoid' ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 bg-[#07080A] hover:border-surface-alt'
               }`}
            >
               <span className="text-xl">🛡️</span>
               <span className="text-xs font-bold text-white uppercase tracking-wider">Avoid Habit</span>
               <span className="text-[9px] text-slate-500 text-center uppercase">I want to stop this</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
            {type === 'build' ? 'Habit Name' : 'Bad Habit Name'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none transition-all placeholder:text-slate-700"
            placeholder={type === 'build' ? "e.g. Daily Meditation" : "e.g. No Sugar"}
          />
          {type === 'avoid' && (
             <div className="flex flex-wrap gap-2 mt-3">
               {["No Smoking", "No Sugar", "No Junk Food", "No Late-night Scrolling", "No Overspending", "No Soft Drinks"].map(template => (
                  <button 
                     key={template}
                     type="button"
                     onClick={() => setName(template)}
                     className="px-2.5 py-1 bg-surface-alt/5 hover:bg-amber-400/10 border border-surface-alt hover:border-amber-400/30 text-[9px] font-mono tracking-widest uppercase text-slate-400 hover:text-amber-400 transition-colors"
                  >
                     {template}
                  </button>
               ))}
             </div>
          )}
        </div>

        {type === 'avoid' && (
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
              Replacement Action (Optional)
            </label>
            <input
              type="text"
              value={replacementAction}
              onChange={(e) => setReplacementAction(e.target.value)}
              className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-amber-400/65 focus:outline-none transition-all placeholder:text-slate-700"
              placeholder="e.g. Drink water or eat fruit"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
              Schedule / How often?
            </label>
            <select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value as Habit['scheduleType'])}
              className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="daily">Every day</option>
              <option value="specific_days">Specific days</option>
              <option value="times_per_week">X times per week</option>
              <option value="weekly">Once every week</option>
              <option value="monthly">Once each month</option>
              <option value="custom_interval">Custom interval</option>
              <option value="anytime">Anytime during period</option>
              <option value="quantity">Track an amount</option>
            </select>
            
            {scheduleType === 'specific_days' && (
               <div className="flex flex-wrap gap-2 mt-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                     <button
                        key={day}
                        type="button"
                        onClick={() => {
                           if (scheduleDays.includes(idx)) {
                              setScheduleDays(scheduleDays.filter(d => d !== idx));
                           } else {
                              setScheduleDays([...scheduleDays, idx]);
                           }
                        }}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors border ${scheduleDays.includes(idx) ? 'bg-[#00F5D4]/20 border-[#00F5D4]/50 text-[#00F5D4]' : 'bg-surface-alt/5 border-surface-alt text-slate-400'}`}
                     >
                        {day}
                     </button>
                  ))}
               </div>
            )}
            
            {(scheduleType === 'times_per_week' || scheduleType === 'anytime') && (
               <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-mono">Target:</span>
                  <input 
                     type="number" min="1" max="99" 
                     value={targetCount} onChange={(e) => setTargetCount(Number(e.target.value) || 1)}
                     className="w-20 bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-sm text-slate-400 font-mono">times</span>
               </div>
            )}
            
            {scheduleType === 'monthly' && (
               <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-mono">Day of month:</span>
                  <input 
                     type="number" min="1" max="31" 
                     value={monthlyDay} onChange={(e) => setMonthlyDay(Number(e.target.value) || 1)}
                     className="w-20 bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono"
                  />
               </div>
            )}
            
            {scheduleType === 'custom_interval' && (
               <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-mono">Every:</span>
                  <input 
                     type="number" min="1" max="999" 
                     value={intervalValue} onChange={(e) => setIntervalValue(Number(e.target.value) || 1)}
                     className="w-20 bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono"
                  />
                  <select
                     value={intervalUnit}
                     onChange={(e) => setIntervalUnit(e.target.value as any)}
                     className="bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono"
                  >
                     <option value="days">Days</option>
                     <option value="weeks">Weeks</option>
                     <option value="months">Months</option>
                  </select>
               </div>
            )}
            
            {scheduleType === 'quantity' && (
               <div className="mt-3 flex gap-3 h-auto">
                  <div className="flex flex-col gap-1 w-24">
                     <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Target</span>
                     <input 
                        type="number" min="1" max="99999" 
                        value={quantityTarget} onChange={(e) => setQuantityTarget(Number(e.target.value) || 1)}
                        className="bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono"
                     />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                     <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Unit (e.g. glasses, minutes)</span>
                     <input 
                        type="text" 
                        value={quantityUnit} onChange={(e) => setQuantityUnit(e.target.value)}
                        className="bg-[#07080A] border border-white/15 px-3 py-2 text-sm text-white font-mono placeholder:text-slate-700"
                        placeholder="glasses"
                     />
                  </div>
               </div>
            )}
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div 
                onClick={() => setDifficulty('easy')}
                className={`p-3 border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  difficulty === 'easy' ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/15 bg-[#07080A] hover:border-surface-alt'
                }`}
              >
                 <span className="text-xl">🍃</span>
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Easy</span>
                 <span className="text-[9px] text-slate-500 text-center uppercase">Small Effort</span>
              </div>
              <div 
                onClick={() => setDifficulty('medium')}
                className={`p-3 border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  difficulty === 'medium' ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 bg-[#07080A] hover:border-surface-alt'
                }`}
              >
                 <span className="text-xl">💧</span>
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Medium</span>
                 <span className="text-[9px] text-slate-500 text-center uppercase">Daily Routine</span>
              </div>
              <div 
                onClick={() => setDifficulty('hard')}
                className={`p-3 border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  difficulty === 'hard' ? 'border-rose-400 bg-rose-400/10' : 'border-white/15 bg-[#07080A] hover:border-surface-alt'
                }`}
              >
                 <span className="text-xl">🔥</span>
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Hard</span>
                 <span className="text-[9px] text-slate-500 text-center uppercase">Discipline</span>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
              Life Area Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="health">Physical Health & Fitness</option>
              <option value="mind">Mental Rest & Focus</option>
              <option value="learning">Continuous Learning</option>
              <option value="spirituality">Spiritual Routine</option>
              {type === 'avoid' && <option value="bad_habit_control">Bad Habit Control</option>}
            </select>
          </div>

          {type === 'avoid' && (
            <div className="col-span-2 mb-2">
               <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                     <input 
                        type="checkbox" 
                        checked={isPrivate} 
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="sr-only" 
                     />
                     <div className={`block w-10 h-6 rounded-full transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                     <div className={`dot absolute left-1 top-1 bg-surface-card w-4 h-4 rounded-full transition-transform ${isPrivate ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div>
                     <span className="text-sm text-white font-bold block">Private Habit</span>
                     <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">Hide details from notifications</span>
                  </div>
               </label>
            </div>
          )}

          <div className="col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-0 uppercase font-semibold">
                Select a Fruit Plant
              </label>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search mango, dalim..."
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  className="w-full bg-[#07080A] border border-white/15 rounded-full pl-9 pr-4 py-2 text-xs text-white font-mono focus:border-primary-mint focus:outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPlants.map((plant) => {
                const isLocked = userMaxStreak < plant.unlockStreak;
                const isSelected = plantType === plant.type;
                
                return (
                  <div 
                    key={plant.type}
                    onClick={() => !isLocked && setPlantType(plant.type)}
                    className={`p-3 border rounded-card flex items-start gap-3 transition-colors ${
                      isLocked ? 'border-surface-alt opacity-50 cursor-not-allowed bg-surface-alt' :
                      isSelected ? 'border-primary-mint bg-primary-mint/10 cursor-pointer shadow-sm' :
                      'border-surface-alt hover:border-primary-mint/50 cursor-pointer bg-surface-card'
                    }`}
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-surface-soft rounded-lg">
                       <PlantIcon plantType={plant.type} stage="Mature Plant" status="Healthy" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-primary-text leading-tight truncate">
                          {plant.englishName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-status-healthy font-bold uppercase tracking-wide mt-0.5">
                        {plant.banglaName}
                      </p>
                      <p className="text-[11px] text-secondary-text mt-1.5 leading-snug line-clamp-2">
                        {plant.description}
                      </p>
                      <div className="mt-2 text-[9px] font-mono uppercase tracking-widest">
                        {isLocked ? (
                          <span className="text-rose-400 flex items-center gap-1">
                            🔒 Locked until {plant.unlockStreak}-day streak
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            Good for: <span className="text-emerald-500/70">{plant.categorySuggestion.split(',')[0]}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">
              Lucide Icon ID
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none placeholder:text-slate-700"
              placeholder="e.g. Book, Sun, Sparkles"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-surface-alt">
          <Button
            variant="ghost"
            type="button"
            onClick={onCancel}
            className="px-6 rounded-button text-[11px] font-bold tracking-wide uppercase py-3 border border-surface-alt text-secondary-text hover:bg-surface-alt transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8 rounded-button text-[11px] font-bold tracking-wide uppercase py-3 bg-primary-mint text-primary-text hover:bg-[#a5d8bd] transition-all border-0 shadow-sm"
          >
            Plant Seed
          </Button>
        </div>
      </form>
    </div>
  );
};
