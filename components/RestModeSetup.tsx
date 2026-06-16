import React, { useState } from 'react';
import { X, Moon, ShieldAlert, Book, BedDouble, HelpCircle } from 'lucide-react';
import { RestMode, RestModeType, RestScopeType, Habit } from '../types';
import { Button } from './Button';
import { format, addDays } from 'date-fns';

interface RestModeSetupProps {
  onClose: () => void;
  onSave: (mode: RestMode) => void;
  habits: Habit[];
  currentRestMode?: RestMode | null;
}

export function RestModeSetup({ onClose, onSave, habits, currentRestMode }: RestModeSetupProps) {
  const [type, setType] = useState<RestModeType>(currentRestMode?.modeType || RestModeType.REST_DAY);
  const [scope, setScope] = useState<RestScopeType>(currentRestMode?.scopeType || RestScopeType.ALL_HABITS);
  const [duration, setDuration] = useState<'today' | '3days' | '1week'>('today');
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>(currentRestMode?.habitIds || []);

  const handleSave = () => {
    let days = 0;
    if (duration === '3days') days = 2; // today + 2 = 3 days
    if (duration === '1week') days = 6;
    
    const startDate = new Date();
    const endDate = addDays(startDate, days);

    const mode: RestMode = {
      id: currentRestMode?.id || Date.now().toString(),
      modeType: type,
      scopeType: scope,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      isActive: true,
      createdAt: currentRestMode?.createdAt || new Date().toISOString(),
      habitIds: scope === RestScopeType.ALL_HABITS ? [] : selectedHabitIds,
      streakBehavior: 'freeze',
      reminderBehavior: 'pause'
    };

    onSave(mode);
  };

  const modeOptions = [
    { value: RestModeType.REST_DAY, label: 'Rest Day', icon: <Moon className="w-5 h-5 text-indigo-500" /> },
    { value: RestModeType.SICK, label: 'Sick Mode', icon: <ShieldAlert className="w-5 h-5 text-red-400" /> },
    { value: RestModeType.VACATION, label: 'Vacation', icon: <BedDouble className="w-5 h-5 text-emerald-500" /> },
    { value: RestModeType.EXAM, label: 'Exam Mode', icon: <Book className="w-5 h-5 text-blue-500" /> },
    { value: RestModeType.FAMILY_EMERGENCY, label: 'Emergency', icon: <HelpCircle className="w-5 h-5 text-orange-500" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background-main border border-surface-alt rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-surface-alt flex justify-between items-center bg-background-main/50">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            Garden Rest Mode
          </h2>
          <button onClick={onClose} className="p-2 text-secondary-text hover:text-primary-text rounded-lg hover:bg-surface-alt transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-indigo-200 text-sm flex gap-3">
            <Moon className="w-5 h-5 shrink-0 text-indigo-400" />
            <p>Your plants will not lose health during Rest Mode. It's a safe pause for travel, sickness, or a much-needed break.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Why are you resting?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {modeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`flex flex-col items-center gap-2 p-3 text-sm rounded-xl border transition-colors ${
                    type === opt.value
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-surface-alt border-surface-alt/50 text-secondary-text hover:bg-surface-alt'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">What do you want to pause?</label>
            <div className="flex gap-2 p-1 bg-surface-alt rounded-xl">
              {(['all_habits', 'selected_habits', 'one_habit'] as RestScopeType[]).map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setScope(s);
                    if (s === RestScopeType.ALL_HABITS) setSelectedHabitIds([]);
                  }}
                  className={`flex-1 py-1.5 px-3 text-sm rounded-lg capitalize transition-colors ${
                    scope === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            {scope !== RestScopeType.ALL_HABITS && (
              <div className="mt-3 space-y-2 border border-slate-800 rounded-xl p-3 bg-slate-800/50">
                <p className="text-xs text-slate-400 mb-2">Select habits to pause:</p>
                {habits.map(h => (
                  <label key={h.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-slate-900 text-indigo-500"
                      checked={selectedHabitIds.includes(h.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedHabitIds(prev => scope === RestScopeType.ONE_HABIT ? [h.id] : [...prev, h.id]);
                        else setSelectedHabitIds(prev => prev.filter(id => id !== h.id));
                      }}
                    />
                    <span className="text-sm text-slate-200">{h.icon} {h.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Duration</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="today">Today only</option>
              <option value="3days">3 Days</option>
              <option value="1week">1 Week</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-surface-alt bg-background-main/50 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={scope !== RestScopeType.ALL_HABITS && selectedHabitIds.length === 0}
            className="flex-1"
          >
            Start Rest
          </Button>
        </div>
      </div>
    </div>
  );
}
