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
      color: 'bg-gradient-to-r from-[#00F5D4] to-[#3A0CA3]'
    });
  };

  return (
    <div className="p-8 bg-[#0d1017]/60 border border-white/10 rounded-none mb-8 animate-in slide-in-from-top-4 fade-in duration-300 relative">
      {/* Laser corners */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00F5D4]" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00F5D4]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00F5D4]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00F5D4]" />

      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-xl font-bold font-display text-white tracking-wide uppercase">INITIALIZE SECTOR CORE</h2>
           <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mt-1">Configure habit core values</p>
        </div>
        <button onClick={onCancel} className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-[#00F5D4] transition-colors border border-transparent hover:border-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">Habit Primary Label</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none transition-all placeholder:text-slate-700"
            placeholder="e.g. ULTRA MEDITATION BLOCKS"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
             <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">Aesthetic Category</label>
             <select 
               value={category}
               onChange={(e) => setCategory(e.target.value as any)}
               className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none appearance-none cursor-pointer"
             >
               <option value="health">KINETIC CORE</option>
               <option value="productivity">DEEP WORK CORE</option>
               <option value="learning">GOLDEN SAGE CORE</option>
               <option value="mindfulness">CYBER ORCHID CORE</option>
               <option value="other">RAW TITANIUM</option>
             </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-slate-400 mb-2 uppercase font-semibold">Lucide Icon ID</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-[#07080A] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white font-mono focus:border-[#00F5D4]/65 focus:outline-none placeholder:text-slate-700"
              placeholder="e.g. Book, Sun, Sparkles"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
          <Button variant="ghost" type="button" onClick={onCancel} className="px-6 rounded-none text-[11px] font-mono tracking-widest uppercase py-3 border border-white/10 text-slate-400 hover:text-white transition-all">
            ABORT
          </Button>
          <Button type="submit" className="px-8 rounded-none text-[11px] font-mono tracking-widest uppercase py-3 bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] transition-all border-0 shadow-[0_0_20px_rgba(0,245,212,0.25)]">
            COMPILE MODULE
          </Button>
        </div>
      </form>
    </div>
  );
};
