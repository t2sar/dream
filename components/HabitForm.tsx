import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './Button';
import { Habit } from '../types';

interface HabitFormProps {
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Habit['category']>('health');
  const [icon, setIcon] = useState('Activity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      category,
      icon,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500' // Orange-amber theme
    });
  };

  return (
    <div className="p-8 glass-card rounded-3xl mb-8 animate-in slide-in-from-top-4 fade-in duration-300 ring-1 ring-white/10">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">New Habit</h2>
           <p className="text-slate-400 text-sm">Design your next step</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Habit Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none transition-all"
            placeholder="Read 10 pages"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Category</label>
             <select 
               value={category}
               onChange={(e) => setCategory(e.target.value as any)}
               className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-amber-500/50 focus:outline-none appearance-none"
             >
               <option value="health">Health</option>
               <option value="productivity">Productivity</option>
               <option value="learning">Learning</option>
               <option value="mindfulness">Mindfulness</option>
               <option value="other">Other</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Icon (Lucide Name)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-amber-500/50 focus:outline-none"
              placeholder="e.g. Book, Sun, Moon"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onCancel} className="px-6">Cancel</Button>
          <Button type="submit" className="px-8 shadow-amber-500/20">Create</Button>
        </div>
      </form>
    </div>
  );
};