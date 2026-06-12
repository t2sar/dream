import React, { useState } from 'react';
import { UserStats, ShopItem } from '../types';
import { SHOP_ITEMS } from '../shopData';
import { Button } from './Button';
import { Package, PackageOpen, Feather, ShoppingBasket, Building, Home, Sprout, Sun, CloudRain, Droplets, AlignJustify } from 'lucide-react';

interface GardenShopProps {
  stats: UserStats;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (item: ShopItem) => void;
}

const getIcon = (name: string, className: string = "w-6 h-6") => {
  switch (name) {
    case 'PackageOpen': return <PackageOpen className={className} />;
    case 'Package': return <Package className={className} />;
    case 'AlignJustify': return <AlignJustify className={className} />;
    case 'ShoppingBasket': return <ShoppingBasket className={className} />;
    case 'Feather': return <Feather className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    default: return <Package className={className} />;
  }
};

export function GardenShop({ stats, onBuyItem, onEquipItem }: GardenShopProps) {
  const [activeTab, setActiveTab] = useState<'pots' | 'decorations' | 'fences' | 'seasonal' | 'backgrounds' | 'boosts'>('pots');
  
  const currentCoins = stats.coins || 0;
  const ownedItemIds = stats.ownedItemIds || [];
  
  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeTab === 'pots') return item.type === 'pot';
    if (activeTab === 'decorations') return item.type === 'decoration';
    if (activeTab === 'fences') return item.type === 'fence';
    if (activeTab === 'seasonal') return item.type === 'seasonal';
    if (activeTab === 'backgrounds') return item.type === 'background';
    if (activeTab === 'boosts') return item.type === 'boost';
    return true;
  });

  return (
    <div className="space-y-6 pb-20 fade-in animate-in duration-500">
      
      {/* Coin Balance Header */}
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 flex items-center justify-between">
        <div>
           <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase italic">Your Pouch</div>
           <h2 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] text-yellow-900 font-bold border border-yellow-500 shadow-sm shadow-yellow-500/50">C</span>
              {currentCoins}
           </h2>
        </div>
        <button 
           onClick={() => {
               if(confirm('Reset garden? This will remove all equipped decorations.')) {
                   onEquipItem({ id: 'reset', type: 'boost', price: 0, name: '', description: '', iconName: '' } as ShopItem);
               }
           }}
           className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs font-mono border border-slate-700 hover:text-white"
        >
           Reset Garden
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 no-scrollbar">
        {['pots', 'decorations', 'fences', 'seasonal', 'backgrounds', 'boosts'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
               activeTab === tab ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/50' : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = !item.isConsumable && ownedItemIds.includes(item.id);
          const canAfford = currentCoins >= item.price;
          
          let statusText = "";
          let buttonAction = () => {};
          let buttonStyle = "";
          let isEquipped = false;
          
          if (item.type === 'background' && stats.equippedBackgroundId === item.id) isEquipped = true;
          if (item.type === 'pot' && stats.equippedPotId === item.id) isEquipped = true;
          if (item.type === 'fence' && stats.equippedFenceId === item.id) isEquipped = true;
          if (item.type === 'seasonal' && stats.equippedSeasonalDecorId === item.id) isEquipped = true;
          if (item.type === 'decoration' && (stats.equippedLeftDecorId === item.id || stats.equippedRightDecorId === item.id)) isEquipped = true;
          
          if (isEquipped) {
              statusText = "Equipped";
              buttonStyle = "bg-slate-700 text-slate-400 border border-slate-600";
          } else if (isOwned) {
              statusText = "Equip";
              buttonAction = () => onEquipItem(item);
              buttonStyle = "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30";
          } else {
              statusText = `${item.price} coins`;
              buttonAction = () => onBuyItem(item);
              buttonStyle = canAfford 
                 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
                 : "bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed";
          }
          
          if (item.isConsumable) {
              const ownedCount = stats.boostItemCounts?.[item.id] || 0;
              statusText = `${item.price} coins`;
              buttonAction = () => onBuyItem(item);
              buttonStyle = canAfford 
                 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
                 : "bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed";
          }
          
          return (
            <div key={item.id} className="bg-[#0A0D14] border border-surface-alt rounded-2xl p-4 flex flex-col pt-6 relative overflow-hidden group">
               {/* Background Hint */}
               {item.type === 'background' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-50 pointer-events-none" />
               )}
               
               <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-surface-alt mb-3 flex items-center justify-center text-slate-400 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {getIcon(item.iconName, 'w-6 h-6')}
               </div>
               <h3 className="text-sm font-bold text-white text-center mb-1 line-clamp-1 leading-tight">{item.name}</h3>
               <p className="text-[10px] text-slate-500 font-mono text-center flex-1 leading-tight line-clamp-3 mb-4">{item.description}</p>
               
               {item.isConsumable && (
                   <div className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest text-center mb-2">Owned: {stats.boostItemCounts?.[item.id] || 0}</div>
               )}
               
               <button
                  onClick={() => {
                     if (!isEquipped && (isOwned || canAfford || item.isConsumable)) {
                       if (isOwned && !item.isConsumable) {
                           buttonAction();
                       } else {
                           if(canAfford) {
                             if(confirm(`Buy ${item.name} for ${item.price} coins?`)) {
                                buttonAction();
                             }
                           }
                       }
                     }
                  }}
                  disabled={isEquipped || (!isOwned && !canAfford && !item.isConsumable) || (item.isConsumable && !canAfford)}
                  className={`w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${buttonStyle}`}
               >
                  {statusText}
               </button>
            </div>
          )
        })}
      </div>

    </div>
  );
}
