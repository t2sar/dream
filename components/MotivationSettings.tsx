import React, { useState, useRef } from 'react';
import { UserStats, UserMotivation } from '../types';
import { Settings, Quote, Plus, Trash2, Edit2, X, Download, Upload } from 'lucide-react';
import { AnimatedModal } from './AnimatedModal';

interface MotivationSettingsProps {
  stats: Partial<UserStats>;
  onUpdate: (newStats: Partial<UserStats>) => void;
  onPreview?: () => void;
}

export const MotivationSettings: React.FC<MotivationSettingsProps> = ({ stats, onUpdate, onPreview }) => {
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const motivations = stats.motivations || [];
  const limit = stats.motivationFrequencyLimit ?? 1; // Default 1

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;
    
    let newMotivations = [...motivations];
    
    if (editingId) {
      newMotivations = newMotivations.map(m => 
        m.id === editingId ? { ...m, quote_text: quoteText.trim(), author: quoteAuthor.trim() || undefined } : m
      );
    } else {
      const newQuote: UserMotivation = {
        id: Date.now().toString(),
        quote_text: quoteText.trim(),
        author: quoteAuthor.trim() || undefined,
        created_at: new Date().toISOString()
      };
      newMotivations.push(newQuote);
    }
    
    onUpdate({ ...stats, motivations: newMotivations });
    setQuoteText("");
    setQuoteAuthor("");
    setEditingId(null);
  };
  
  const handleDelete = (id: string) => {
    onUpdate({ ...stats, motivations: motivations.filter(m => m.id !== id) });
  };
  
  const handleEdit = (m: UserMotivation) => {
    setEditingId(m.id);
    setQuoteText(m.quote_text);
    setQuoteAuthor(m.author || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setQuoteText("");
    setQuoteAuthor("");
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(motivations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "motivations_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Keep existing and append imported (deduplicate by id if needed, or simply let user delete)
          onUpdate({ ...stats, motivations: parsed });
        }
      } catch (err) {
        console.error("Invalid JSON file", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-surface-alt/5 p-4 rounded-none border border-surface-alt mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-white font-bold text-sm text-balance">Cloud-Synced Motivations</h3>
            <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-wider uppercase leading-relaxed">Personalize your daily popup quotes</p>
         </div>
         <div className="flex gap-2">
           <button 
             onClick={onPreview}
             className="px-4 py-2 bg-surface-alt/50 text-white border border-surface-alt rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest hover:bg-surface-alt transition-colors"
           >
              Preview
           </button>
           <button 
             onClick={() => setShowManageModal(true)}
             className="px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 text-[#00F5D4] border border-[#00F5D4]/30 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest hover:bg-[#00F5D4]/10 transition-colors"
           >
              Manage ({motivations.length})
           </button>
         </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-surface-alt pt-4 mt-2">
         <div>
            <p className="text-slate-400 font-mono text-[10px] tracking-wider uppercase">Motivation Frequency</p>
         </div>
         <select 
            value={limit.toString()}
            onChange={(e) => onUpdate({ ...stats, motivationFrequencyLimit: parseInt(e.target.value) })}
            className="bg-[#0d1017] border border-surface-alt text-white font-mono text-xs px-3 py-2 rounded outline-none focus:border-cyan-500 transition-colors cursor-pointer"
         >
            <option value="1">1 time/day</option>
            <option value="3">3 times/day</option>
            <option value="5">5 times/day</option>
            <option value="-1">Unlimited</option>
            <option value="0">Disabled</option>
         </select>
      </div>

      <AnimatedModal isOpen={showManageModal} onClose={() => setShowManageModal(false)} alignment="bottom" className="!p-0 !max-w-md mx-auto !rounded-t-[32px] !rounded-b-none overflow-hidden bg-surface-card border border-surface-alt h-[85vh] flex flex-col">
         <div className="p-6 border-b border-surface-alt bg-[#0d1017] shrink-0 sticky top-0 z-10 hidden-scrollbar max-h-full overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold font-display text-lg text-primary-text flex items-center gap-2">
                 <Quote className="w-5 h-5 text-[#00F5D4]" /> My Motivations
               </h3>
               <div className="flex gap-2 items-center">
                 <button onClick={handleExport} className="p-2 text-muted-text hover:text-white transition-colors" title="Export JSON">
                   <Download className="w-4 h-4" />
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 text-muted-text hover:text-white transition-colors" title="Import JSON">
                   <Upload className="w-4 h-4" />
                 </button>
                 <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                 <button onClick={() => setShowManageModal(false)} className="p-2 -mr-2 text-muted-text hover:text-white transition-colors ml-2">
                   <X className="w-5 h-5" />
                 </button>
               </div>
            </div>
            
            <form onSubmit={handleSaveQuote} className="flex flex-col gap-3">
               <div className="relative">
                 <textarea 
                    value={quoteText}
                    onChange={e => setQuoteText(e.target.value)}
                    placeholder="Enter your quote (Supports Bangla)"
                    className="w-full bg-surface-soft border border-surface-alt rounded-xl p-3 text-white font-sans text-sm outline-none focus:border-[#00F5D4] transition-colors min-h-[80px] resize-none pb-8"
                 />
                 <div className={`absolute bottom-2 right-3 text-[10px] font-mono tracking-wider ${quoteText.length > 200 ? 'text-red-400 font-bold' : quoteText.length > 150 ? 'text-amber-400' : 'text-slate-500'}`}>
                   {quoteText.length} / 200 {quoteText.length > 200 && ' (Too long)'}
                 </div>
               </div>
               <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={quoteAuthor}
                    onChange={e => setQuoteAuthor(e.target.value)}
                    placeholder="Author (Optional)"
                    className="flex-1 bg-surface-soft border border-surface-alt rounded-xl px-3 py-2 text-white font-mono text-xs outline-none focus:border-[#00F5D4] transition-colors"
                 />
                 {editingId ? (
                   <div className="flex gap-2">
                      <button type="button" onClick={cancelEdit} className="bg-surface-alt text-white px-4 py-2 rounded-xl font-bold font-mono tracking-widest text-[10px] uppercase hover:bg-zinc-700 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" disabled={!quoteText.trim()} className="bg-[#00F5D4] text-black px-4 py-2 rounded-xl font-bold font-mono tracking-widest text-[10px] uppercase hover:bg-[#00d8b9] transition-colors disabled:opacity-50">
                        Save
                      </button>
                   </div>
                 ) : (
                   <button type="submit" disabled={!quoteText.trim()} className="bg-[#00F5D4] text-black px-4 py-2 rounded-xl font-bold font-mono tracking-widest text-[10px] uppercase flex items-center gap-1 hover:bg-[#00d8b9] transition-colors disabled:opacity-50">
                      <Plus className="w-3 h-3" /> Add
                   </button>
                 )}
               </div>
            </form>
         </div>

         <div className="p-6 overflow-y-auto flex-1 bg-surface-card">
            {motivations.length === 0 ? (
               <div className="text-center py-10 opacity-50">
                  <Quote className="w-8 h-8 mx-auto mb-3 text-slate-500" />
                  <p className="text-sm">No custom quotes yet.</p>
                  <p className="text-xs font-mono mt-1 text-slate-400">Add some wisdom above.</p>
               </div>
            ) : (
               <div className="space-y-3 pb-8">
                 {motivations.map(m => (
                    <div key={m.id} className="p-4 bg-surface-soft border border-surface-alt rounded-xl group relative pr-12 transition-colors hover:border-surface-alt/80">
                       <p className="text-sm font-medium leading-relaxed font-sans">{m.quote_text}</p>
                       {m.author && <p className="text-[10px] font-mono text-[#00F5D4] mt-2 tracking-wide uppercase">— {m.author}</p>}
                       
                       <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(m)} className="p-1.5 bg-surface-card border border-surface-alt rounded-lg text-slate-400 hover:text-white hover:border-[#00F5D4] transition-all">
                             <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-surface-card border border-surface-alt rounded-lg text-slate-400 hover:text-red-400 hover:border-red-400/50 transition-all">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </div>
                 ))}
               </div>
            )}
         </div>
      </AnimatedModal>
    </div>
  );
};
