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
    <div className="bg-[var(--surface-alt)]/50 p-6 rounded-[32px] border-0 mb-8 flex flex-col gap-4 shadow-sm hover:bg-[var(--surface-alt)] transition-colors">
      <div>
        <h3 className="text-[var(--primary-anchor)] font-bold text-base text-balance">Custom Categories</h3>
        <p className="text-[var(--text-muted)] font-medium text-xs mt-1 max-w-[200px] leading-relaxed">Manage unique habit categories</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
         <input
           type="text"
           value={newCatName}
           onChange={(e) => setNewCatName(e.target.value)}
           placeholder="New category name"
           className="bg-[var(--surface)] border-0 rounded-full px-5 py-3 text-sm text-[var(--primary-anchor)] font-medium font-sans w-full flex-1 outline-none focus:border-[var(--accent-seafoam)] transition-colors shadow-sm"
           maxLength={25}
         />
         <div className="flex items-center gap-3 w-full sm:w-auto">
             <input 
               type="color"
               value={newCatColor}
               onChange={(e) => setNewCatColor(e.target.value)}
               className="w-12 h-12 rounded-[16px] cursor-pointer bg-transparent border-0 shadow-sm shrink-0 outline-none"
             />
             <Button onClick={handleAdd} disabled={!newCatName.trim()} className="w-full sm:w-auto py-3 bg-[var(--primary-anchor)] text-[var(--bg-base)] rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 shadow-md border-0">
                Add
             </Button>
         </div>
      </div>

      {categories.length > 0 && (
         <div className="flex flex-wrap gap-3 mt-4">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2 pl-3 pr-2 rounded-full border-0 bg-[var(--surface)] shadow-sm">
                 <div className="w-4 h-4 rounded-full border-0 shadow-inner" style={{ backgroundColor: c.color }} />
                 <span className="text-sm font-bold text-[var(--primary-anchor)] tracking-wide">{c.name}</span>
                 <button onClick={() => handleRemove(c.id)} className="p-1.5 ml-1 bg-[var(--surface-alt)] rounded-full text-[var(--text-muted)] hover:text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10 transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>
            ))}
         </div>
      )}
    </div>
  );
};
