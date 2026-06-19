import React, { useState } from 'react';
import { UserStats, ShopItem } from '../types';
import { SHOP_ITEMS } from '../shopData';
import { COMPANIONS, CompanionAssetsDictionary } from '../companionsData';
import { Button } from './Button';
import { AnimatedModal } from './AnimatedModal';
import { X, Coins, Package } from 'lucide-react';
import { PlantIcon } from './PlantIcon';

const ShopItemSvg = React.lazy(() => import('./ShopItemAssets').then(m => ({ default: m.ShopItemSvg })));

interface GardenShopProps {
  stats: UserStats;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (item: ShopItem) => void;
  onEquipCompanion?: (id: string | null) => void;
}

export function GardenShop({ stats, onBuyItem, onEquipItem, onEquipCompanion }: GardenShopProps) {
  const [activeTab, setActiveTab] = useState<'pots' | 'decorations' | 'fences' | 'seasonal' | 'backgrounds' | 'boosts' | 'seeds' | 'companions'>('seeds');
  const [confirmPurchaseItem, setConfirmPurchaseItem] = useState<ShopItem | null>(null);
  
  const currentCoins = stats.coins || 0;
  const ownedItemIds = stats.ownedItemIds || [];
  
  const hour = new Date().getHours();
  const isNightMarket = hour >= 22 || hour < 2;

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeTab === 'pots') return item.type === 'pot';
    if (activeTab === 'decorations') return item.type === 'decoration';
    if (activeTab === 'fences') return item.type === 'fence';
    if (activeTab === 'seasonal') return item.type === 'seasonal';
    if (activeTab === 'backgrounds') return item.type === 'background';
    if (activeTab === 'boosts') return item.type === 'boost';
    if (activeTab === 'seeds') return item.type === 'seed';
    return true;
  });

  if (isNightMarket && activeTab === 'seeds') {
     filteredItems.unshift(
        { id: 'seed_lychee', name: 'Lychee Seed', type: 'seed', price: 800, requiredLevel: 5, description: 'Exclusive night market item. Grows into a rare Lychee tree.', iconName: 'plant' },
        { id: 'seed_papaya', name: 'Papaya Seed', type: 'seed', price: 600, requiredLevel: 3, description: 'Exclusive night market item. Grows into a fast Papaya tree.', iconName: 'plant' }
     );
  }

  return (
    <div className={`space-y-6 pb-20 fade-in animate-in duration-500 ${isNightMarket ? 'bg-indigo-950/20 p-4 rounded-3xl' : ''}`}>
      
      {/* Coin Balance Header */}
      <div className={`border rounded-3xl p-6 flex items-center justify-between shadow-sm ${isNightMarket ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-surface-card border-surface-alt'}`}>
        <div>
           <div className={`text-[10px] font-bold tracking-widest uppercase italic ${isNightMarket ? 'text-indigo-300' : 'text-status-healthy'}`}>
             {isNightMarket ? 'Jochona Night Market' : 'Your Pouch'}
           </div>
           <h2 className="text-2xl font-bold font-display text-primary-text mt-1 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold border shadow-sm ${isNightMarket ? 'bg-indigo-500 border-indigo-400' : 'bg-status-needsCare border-surface-alt'}`}>C</span>
              {Math.floor(currentCoins)}
           </h2>
        </div>
        <button 
           onClick={() => {
               if(confirm('Reset garden? This will remove all equipped decorations.')) {
                   onEquipItem({ id: 'reset', type: 'boost', price: 0, name: '', description: '', iconName: '' } as ShopItem);
               }
           }}
           className="px-3 py-1 bg-surface-alt/50 text-secondary-text rounded-lg text-xs font-bold border border-surface-alt hover:text-primary-text transition-colors"
        >
           Reset Garden
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 no-scrollbar">
        {['seeds', 'pots', 'decorations', 'fences', 'seasonal', 'backgrounds', 'boosts', 'companions'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border ${
               activeTab === tab ? 'bg-primary-mint text-white border-transparent shadow-sm' : 'bg-surface-card text-secondary-text hover:text-primary-text border-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-mint/50 flex-shrink-0'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Item Grid */}
      {activeTab === 'companions' ? (
        <div className="bg-surface-soft p-8 rounded-[32px] border border-surface-alt relative mt-8 shadow-sm">
          <p className="text-sm font-bold tracking-wide text-status-healthy uppercase mb-8">
            {stats.companions?.length || 0} / {COMPANIONS.length} Discovered
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {COMPANIONS.map((comp, index) => {
              const isUnlocked = stats.companions?.some(c => c.id === comp.id);
              const showDetails = true;
              const isEquipped = stats.activeCompanionId === comp.id;
              
              const isHoverAnimatedCompanion = ['moumachhi', 'ladybug', 'chorui', 'phoring', 'pecha', 'shalik', 'jonaki'].includes(comp.id);
              return (
                <div key={comp.id} className={`p-4 rounded-xl border ${isUnlocked ? 'border-primary-mint/50 bg-primary-mint/10' : 'border-surface-alt bg-surface-alt/50 opacity-60'} flex flex-col items-center text-center transition-all group`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 ${isUnlocked ? 'bg-surface-card shadow-sm' : 'bg-surface-alt text-xl'} relative`}>
                    {CompanionAssetsDictionary[comp.id] ? (
                      React.createElement(CompanionAssetsDictionary[comp.id], { 
                        className: `w-8 h-8 ${showDetails ? 'drop-shadow-sm' : 'brightness-0 opacity-20 grayscale'} ${isHoverAnimatedCompanion ? 'transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110' : ''}` 
                      })
                    ) : (
                      <span className={`text-2xl ${!showDetails && 'grayscale opacity-50'} ${isHoverAnimatedCompanion ? 'transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110' : ''}`}>{showDetails ? '🐦‍⬛' : '❓'}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-primary-text text-sm mb-0.5">{showDetails ? comp.name : '???'}</h4>
                  <h5 className="font-bold text-[10px] text-status-healthy mb-2 uppercase">{showDetails ? comp.banglaName : 'Unknown'}</h5>
                  <p className="text-[11px] text-secondary-text leading-tight md:block hidden mb-3">
                    {isUnlocked ? `Unlocked: ${comp.unlockConditionStr}` : (showDetails ? `Locked (${comp.unlockConditionStr})` : 'Condition locked')}
                  </p>
                  
                  {isUnlocked && onEquipCompanion && (
                    <button
                      onClick={() => onEquipCompanion(isEquipped ? null : comp.id)}
                      className={`mt-auto px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isEquipped 
                          ? 'bg-status-healthy text-white shadow-md shadow-status-healthy/30' 
                          : 'bg-white shadow-[0_4px_0_#CBD5E1] text-secondary-text hover:-translate-y-0.5 hover:shadow-[0_6px_0_#CBD5E1] active:translate-y-1 active:shadow-[0_0_0_#CBD5E1]'
                      }`}
                    >
                      {isEquipped ? 'Active' : 'Equip'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map(item => {
          const isOwned = !item.isConsumable && ownedItemIds.includes(item.id);
          const canAfford = currentCoins >= item.price;
          const userLvl = stats.level || 1;
          const userMaxStreak = stats.bestDailyGardenStreak || 0;
          
          let isLevelLocked = false;
          let lockReason = "";
          if (item.type === 'seed') {
             // For seeds, we store the required streak in requiredLevel temporarily
             if (item.requiredLevel && userMaxStreak < item.requiredLevel) {
                 isLevelLocked = true;
                 lockReason = `Req ${item.requiredLevel}-Day Streak`;
             }
          } else {
             if (item.requiredLevel && userLvl < item.requiredLevel) {
                 isLevelLocked = true;
                 lockReason = `Req Lvl ${item.requiredLevel}`;
             }
          }
          
          let statusText = "";
          let buttonAction = () => {};
          let buttonStyle = "";
          let isDisabled = false;
          let isEquipped = false;
          
          if (item.type === 'background' && stats.equippedBackgroundId === item.id) isEquipped = true;
          if (item.type === 'pot' && stats.equippedPotId === item.id) isEquipped = true;
          if (item.type === 'fence' && stats.equippedFenceId === item.id) isEquipped = true;
          if (item.type === 'seasonal' && stats.equippedSeasonalDecorId === item.id) isEquipped = true;
          if (item.type === 'decoration' && (stats.equippedLeftDecorId === item.id || stats.equippedRightDecorId === item.id)) isEquipped = true;
          if (item.type === 'seed' && isOwned) isEquipped = true; // "Equipped" for seeds just means "Owned/Unlocked for planting"
          
          if (isLevelLocked) {
              statusText = lockReason;
              buttonStyle = "bg-status-critical/10 text-status-critical border border-status-critical/30 opacity-50 cursor-not-allowed";
              isDisabled = true;
          } else if (isEquipped) {
              statusText = item.type === 'seed' ? "Unlocked" : "Equipped";
              buttonStyle = "bg-surface-alt/50 text-muted-text border border-surface-alt";
              isDisabled = true;
          } else if (isOwned) {
              statusText = "Equip";
              buttonAction = () => onEquipItem(item);
              buttonStyle = "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/30 hover:bg-secondary-blue/20";
          } else {
              statusText = `${item.price} coins`;
              buttonAction = () => onBuyItem(item);
              buttonStyle = canAfford 
                 ? "bg-primary-mint/10 text-primary-mint border border-primary-mint/30 hover:bg-primary-mint/20" 
                 : "bg-surface-alt/30 text-muted-text border border-surface-alt opacity-50 cursor-not-allowed";
              isDisabled = !canAfford;
          }
          
          if (item.isConsumable && !isLevelLocked) {
              const ownedCount = item.id === 'item_streak_freeze' 
                  ? (stats.streakFreezes || 0) 
                  : (stats.boostItemCounts?.[item.id] || 0);
              const isCapped = item.maxCapacity ? ownedCount >= item.maxCapacity : false;
              let isOnCooldown = false;
              
              if (item.cooldownHours) {
                  const lastPurchases = stats.lastPurchaseDates || {};
                  const lastDateStr = lastPurchases[item.id];
                  if (lastDateStr) {
                      const diffHours = (new Date().getTime() - new Date(lastDateStr).getTime()) / (1000 * 60 * 60);
                      if (diffHours < item.cooldownHours) isOnCooldown = true;
                  }
              }

              if (isCapped) {
                 statusText = "Max Capacity";
                 buttonStyle = "bg-status-needsCare/10 text-status-needsCare border border-status-needsCare/30 opacity-60 cursor-not-allowed";
                 isDisabled = true;
              } else if (isOnCooldown) {
                 statusText = "Cooldown";
                 buttonStyle = "bg-surface-alt/30 text-muted-text border border-surface-alt opacity-50 cursor-not-allowed";
                 isDisabled = true;
              } else {
                 statusText = `${item.price} coins`;
                 buttonAction = () => onBuyItem(item);
                 buttonStyle = canAfford 
                    ? "bg-primary-mint/10 text-primary-mint border border-primary-mint/30 hover:bg-primary-mint/20" 
                    : "bg-surface-alt/30 text-muted-text border border-surface-alt opacity-50 cursor-not-allowed";
                 isDisabled = !canAfford;
              }
          }
          
          return (
            <div key={item.id} className="rounded-2xl p-4 grid grid-rows-[auto,auto,1fr,auto,auto] gap-2 pt-6 relative overflow-visible group">
               {/* Background Hint */}
               {item.type === 'background' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-50 pointer-events-none" />
               )}
               
               <div className="w-20 h-28 mb-3 mx-auto flex flex-col items-center justify-end relative group-hover:scale-105 transition-transform duration-300">
                  <React.Suspense fallback={<div className="w-4 h-4 rounded-full border border-surface-alt border-t-emerald-400 animate-spin mx-auto" />}>
                     {item.type === 'seed' ? (
                        <PlantIcon plantType={item.id.replace('seed_', '') as any} stage="Fruiting Plant" className="w-20 h-24 absolute bottom-[5%] z-10" />
                     ) : (
                        <ShopItemSvg itemId={item.id} className="w-20 h-24 absolute bottom-[5%] z-10" />
                     )}
                  </React.Suspense>
               </div>
               <h3 className="text-sm font-bold text-white text-center line-clamp-1 leading-tight">{item.name}</h3>
               <p className="text-[10px] text-slate-500 font-mono text-center leading-tight line-clamp-3">{item.description}</p>
               
               {item.isConsumable && (
                   <div className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest text-center">Owned: {item.id === 'item_streak_freeze' ? (stats.streakFreezes || 0) : (stats.boostItemCounts?.[item.id] || 0)} {item.maxCapacity ? `/ ${item.maxCapacity}` : ''}</div>
               )}
               
               <button
                  onClick={() => {
                     if (!isDisabled) {
                       if (isOwned && !item.isConsumable) {
                           buttonAction();
                       } else {
                           setConfirmPurchaseItem(item);
                       }
                     }
                  }}
                  disabled={isDisabled}
                  className={`w-full py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${buttonStyle}`}
               >
                  {statusText}
               </button>
            </div>
          )
        })}
        </div>
      )}

      <AnimatedModal isOpen={!!confirmPurchaseItem} onClose={() => setConfirmPurchaseItem(null)} alignment="bottom" className="!p-0 !max-w-md mx-auto !rounded-t-3xl !rounded-b-none overflow-hidden bg-surface-card border border-surface-alt">
        {confirmPurchaseItem && (
           <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold font-display text-lg text-primary-text uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" /> Confirm Purchase
                </h3>
                <button onClick={() => setConfirmPurchaseItem(null)} className="p-2 -mr-2 text-muted-text hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="flex items-start gap-4 mb-8 bg-surface-alt/10 p-4 rounded-xl border border-surface-alt/50">
               <div className="w-24 h-32 shrink-0 relative flex flex-col items-center justify-end">
                  {confirmPurchaseItem.type === 'seed' ? (
                      <PlantIcon plantType={confirmPurchaseItem.id.replace('seed_', '') as any} stage="Fruiting Plant" className="w-20 h-28 absolute bottom-[5%] z-10" />
                   ) : (
                      <ShopItemSvg itemId={confirmPurchaseItem.id} className="w-20 h-28 absolute bottom-[5%] z-10" />
                   )}
               </div>
               <div>
                  <h4 className="font-bold text-white mb-1">{confirmPurchaseItem.name}</h4>
                  <p className="text-xs font-mono text-slate-400">{confirmPurchaseItem.description}</p>
               </div>
             </div>
             
             <button
               onClick={() => {
                  onBuyItem(confirmPurchaseItem);
                  setConfirmPurchaseItem(null);
               }}
               className="w-full py-4 bg-primary-mint text-zinc-900 font-bold font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[#00d8b9] shadow-[0_0_20px_rgba(0,245,212,0.2)] active:scale-95"
             >
                <Coins className="w-5 h-5" />
                Purchase for {confirmPurchaseItem.price} Coins
             </button>
           </div>
        )}
      </AnimatedModal>

    </div>
  );
}
