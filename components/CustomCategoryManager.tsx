import React, { useState } from 'react';
import { CustomCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, Tag } from 'lucide-react';
import { Button } from './Button';

interface CustomCategoryManagerProps {
  categories: CustomCategory[];
  onChange: (categories: CustomCategory[]) => void;
}

export const CustomCategoryManager: React.FC<CustomCategoryManagerProps> = ({ categories, onChange }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8FCFAD');

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    const newCategory: CustomCategory = {
      id: uuidv4(),
      name: newCatName.trim(),
      color: newCatColor,
      icon: 'Tag'
    };
    onChange([...categories, newCategory]);
    setNewCatName('');
  };

  const handleRemove = (id: string) => {
    onChange(categories.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 bg-surface-alt/5 p-4 border border-surface-alt mb-6">
      <div>
        <h3 className="text-white font-bold text-sm">Custom Categories</h3>
        <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase max-w-xs">Manage unique habit categories</p>
      </div>
      
      <div className="flex items-center gap-3 mt-2">
         <input
           type="text"
           value={newCatName}
           onChange={(e) => setNewCatName(e.target.value)}
           placeholder="New category name"
           className="bg-black/20 border border-surface-alt rounded p-2 text-sm text-white flex-1"
           maxLength={25}
         />
         <input 
           type="color"
           value={newCatColor}
           onChange={(e) => setNewCatColor(e.target.value)}
           className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
         />
         <Button onClick={handleAdd} disabled={!newCatName.trim()} className="py-2">
            Add
         </Button>
      </div>

      {categories.length > 0 && (
         <div className="flex flex-col gap-2 mt-2">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded bg-surface-card border border-surface-alt">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium text-white">{c.name}</span>
                 </div>
                 <button onClick={() => handleRemove(c.id)} className="text-red-400 hover:text-red-300 transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>
            ))}
         </div>
      )}
    </div>
  );
};
