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
    <div className="bg-[var(--surface-alt)]/50 p-6 rounded-[32px] border-0 mb-8 flex flex-col gap-4 shadow-sm hover:bg-[var(--surface-alt)] transition-colors">
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-[var(--primary-anchor)] font-bold text-base text-balance">Cloud-Synced Motivations</h3>
            <p className="text-[var(--text-muted)] font-medium text-xs mt-1 max-w-[200px] leading-relaxed">Personalize your daily popup quotes</p>
         </div>
         <div className="flex gap-2">
           <button 
             onClick={onPreview}
             className="px-4 py-2 bg-[var(--surface)] text-[var(--text-secondary)] border-0 rounded-full font-bold text-[10px] uppercase tracking-widest hover:text-[var(--primary-anchor)] hover:border-[var(--text-muted)] transition-colors active:scale-95"
           >
              Preview
           </button>
           <button 
             onClick={() => setShowManageModal(true)}
             className="px-4 py-2 bg-[var(--accent-seafoam)]/10 text-[var(--accent-seafoam)] border-2 border-[var(--accent-seafoam)]/30 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[var(--accent-seafoam)]/20 transition-colors active:scale-95"
           >
              Manage ({motivations.length})
           </button>
         </div>
      </div>
      
      <div className="flex items-center justify-between border-t-2 border-[var(--surface-alt)] pt-4 mt-2">
         <div>
            <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-wider">Motivation Frequency</p>
         </div>
         <select 
            value={limit.toString()}
            onChange={(e) => onUpdate({ ...stats, motivationFrequencyLimit: parseInt(e.target.value) })}
            className="bg-[var(--surface)] border-0 text-[var(--primary-anchor)] font-bold text-sm px-4 py-2 rounded-full outline-none focus:border-[var(--accent-seafoam)] transition-colors cursor-pointer shadow-inner"
         >
            <option value="1">1 time/day</option>
            <option value="3">3 times/day</option>
            <option value="5">5 times/day</option>
            <option value="-1">Unlimited</option>
            <option value="0">Disabled</option>
         </select>
      </div>

      <AnimatedModal isOpen={showManageModal} onClose={() => setShowManageModal(false)} alignment="bottom" className="!p-0 !max-w-md mx-auto !rounded-t-[40px] overflow-hidden bg-[var(--surface)] border-0 md:h-[85vh] h-[95vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-[var(--surface-alt)]">
         <div className="p-8 border-b-2 border-[var(--surface-alt)] bg-[var(--surface-alt)] shrink-0 sticky top-0 z-10 hidden-scrollbar max-h-full w-full">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-extrabold font-display text-2xl text-[var(--primary-anchor)] flex items-center gap-3">
                 <Quote className="w-6 h-6 text-[var(--accent-seafoam)]" /> My Motivations
               </h3>
               <div className="flex gap-2 items-center text-[var(--text-secondary)]">
                 <button onClick={handleExport} className="p-2 hover:bg-[var(--surface)] rounded-full hover:text-[var(--primary-anchor)] transition-transform hover:scale-110" title="Export JSON">
                   <Download className="w-5 h-5" />
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-[var(--surface)] rounded-full hover:text-[var(--primary-anchor)] transition-transform hover:scale-110" title="Import JSON">
                   <Upload className="w-5 h-5" />
                 </button>
                 <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                 <button onClick={() => setShowManageModal(false)} className="p-2 hover:bg-[var(--surface)] rounded-full hover:text-[var(--primary-anchor)] transition-transform hover:scale-110 ml-2">
                   <X className="w-6 h-6" />
                 </button>
               </div>
            </div>
            
            <form onSubmit={handleSaveQuote} className="flex flex-col gap-4">
               <div className="relative">
                 <textarea 
                    value={quoteText}
                    onChange={e => setQuoteText(e.target.value)}
                    placeholder="Enter your quote"
                    className="w-full bg-[var(--surface)] border-0 rounded-[24px] p-5 text-[var(--primary-anchor)] font-medium text-sm outline-none focus:border-[var(--accent-seafoam)] transition-colors min-h-[100px] resize-none pb-10 shadow-sm"
                 />
                 <div className={`absolute bottom-4 right-5 text-[10px] font-bold tracking-widest uppercase ${quoteText.length > 200 ? 'text-[var(--accent-coral)]' : quoteText.length > 150 ? 'text-[var(--accent-mustard)]' : 'text-[var(--text-muted)]'}`}>
                   {quoteText.length} / 200 {quoteText.length > 200 && ' (Too long)'}
                 </div>
               </div>
               <div className="flex gap-3">
                 <input 
                    type="text" 
                    value={quoteAuthor}
                    onChange={e => setQuoteAuthor(e.target.value)}
                    placeholder="Author (Optional)"
                    className="flex-1 bg-[var(--surface)] border-0 rounded-[20px] px-5 py-3 text-[var(--primary-anchor)] font-medium text-sm outline-none focus:border-[var(--accent-seafoam)] transition-colors shadow-sm"
                 />
                 {editingId ? (
                   <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={cancelEdit} className="bg-[var(--surface-alt)] text-[var(--text-muted)] border-0 px-5 py-3 rounded-[20px] font-bold text-xs uppercase hover:text-[var(--primary-anchor)] hover:border-[var(--text-muted)] transition-all active:scale-95">
                        Cancel
                      </button>
                      <button type="submit" disabled={!quoteText.trim()} className="bg-[var(--accent-seafoam)] text-white px-5 py-3 rounded-[20px] font-bold text-xs uppercase hover:opacity-90 transition-all disabled:opacity-50 active:scale-95 shadow-md">
                        Save
                      </button>
                   </div>
                 ) : (
                   <button type="submit" disabled={!quoteText.trim()} className="bg-[var(--primary-anchor)] text-[var(--bg-base)] shrink-0 px-6 py-3 rounded-[20px] font-bold text-xs uppercase flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 active:scale-95 shadow-md">
                      <Plus className="w-4 h-4" /> Add
                   </button>
                 )}
               </div>
            </form>
         </div>

         <div className="p-8 overflow-y-auto flex-1 bg-[var(--bg-base)] pb-16">
            {motivations.length === 0 ? (
               <div className="text-center py-12 opacity-60">
                  <Quote className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                  <p className="text-base font-medium text-[var(--text-muted)]">No custom quotes yet.</p>
               </div>
            ) : (
               <div className="space-y-4 pb-8 flex flex-col gap-2">
                 {motivations.map(m => (
                    <div key={m.id} className="p-6 bg-[var(--surface)] border-0 rounded-[28px] group relative pr-14 transition-all hover:border-[var(--text-muted)] hover:shadow-md">
                       <p className="text-sm font-medium leading-relaxed text-[var(--primary-anchor)]">{m.quote_text}</p>
                       {m.author && <p className="text-[11px] font-bold text-[var(--accent-seafoam)] mt-3 tracking-widest uppercase">— {m.author}</p>}
                       
                       <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(m)} className="p-2 bg-[var(--surface-alt)] border-2 border-transparent rounded-[16px] text-[var(--text-muted)] hover:text-[var(--accent-seafoam)] hover:border-[var(--accent-seafoam)]/30 transition-all active:scale-95">
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-2 bg-[var(--surface-alt)] border-2 border-transparent rounded-[16px] text-[var(--text-muted)] hover:text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10 hover:border-[var(--accent-coral)]/30 transition-all active:scale-95">
                             <Trash2 className="w-4 h-4" />
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
