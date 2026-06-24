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
        { id: 'seed_lychee', name: 'Lychee Seed', type: 'seed', price: 8000, requiredLevel: 5, description: 'Exclusive night market item. Grows into a rare Lychee tree.', iconName: 'plant' },
        { id: 'seed_papaya', name: 'Papaya Seed', type: 'seed', price: 6000, requiredLevel: 3, description: 'Exclusive night market item. Grows into a fast Papaya tree.', iconName: 'plant' }
     );
  }

  return (
    <div className={`space-y-6 pb-20 fade-in animate-in duration-500 ${isNightMarket ? 'bg-indigo-950/20 p-4 rounded-3xl' : ''}`}>
      
      {/* Coin Balance Header */}
      <div className={`rounded-[32px] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm border-2 ${isNightMarket ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-surface border-surface-alt'}`}>
        <div className="flex items-center gap-4">
           <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner border-4 ${isNightMarket ? 'bg-indigo-500 border-indigo-400' : 'bg-accent-mustard border-white text-white'}`}>
             <Coins className="w-7 h-7" />
           </div>
           <div>
              <div className={`text-xs font-extrabold tracking-widest uppercase ${isNightMarket ? 'text-indigo-300' : 'text-text-muted'}`}>
                {isNightMarket ? 'Jochona Night Market' : 'Your Pouch'}
              </div>
              <h2 className="text-3xl font-extrabold font-display text-primary-anchor mt-1">
                 {Math.floor(currentCoins)}
              </h2>
           </div>
        </div>
        <button 
           onClick={() => {
               if(confirm('Reset garden? This will remove all equipped decorations.')) {
                   onEquipItem({ id: 'reset', type: 'boost', price: 0, name: '', description: '', iconName: '' } as ShopItem);
               }
           }}
           className="px-4 py-3 bg-surface-alt text-text-secondary rounded-full text-xs font-bold border-2 border-transparent hover:border-text-muted transition-all active:scale-95 whitespace-nowrap"
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
             className={`px-5 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
               activeTab === tab ? 'bg-primary-anchor text-bg-base border-primary-anchor shadow-md' : 'bg-surface text-text-muted hover:text-primary-anchor border-surface-alt hover:border-text-muted focus:outline-none flex-shrink-0'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Item Grid */}
      {activeTab === 'companions' ? (
        <div className="bg-surface p-8 rounded-[40px] border-2 border-surface-alt relative mt-8 shadow-sm">
          <p className="text-sm font-extrabold tracking-wide text-accent-seafoam uppercase mb-8">
            {stats.companions?.length || 0} / {COMPANIONS.length} Discovered
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {COMPANIONS.map((comp, index) => {
              const isUnlocked = stats.companions?.some(c => c.id === comp.id);
              const showDetails = true;
              const isEquipped = stats.activeCompanionId === comp.id;
              
              const isHoverAnimatedCompanion = ['moumachhi', 'ladybug', 'chorui', 'phoring', 'pecha', 'shalik', 'jonaki'].includes(comp.id);
              return (
                <div key={comp.id} className={`p-4 rounded-[32px] border-2 ${isUnlocked ? 'border-accent-seafoam/30 bg-surface-alt/30' : 'border-transparent bg-surface-alt opacity-60'} flex flex-col items-center text-center transition-all group`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 ${isUnlocked ? 'bg-surface shadow-sm' : 'bg-surface text-xl'} relative`}>
                    {CompanionAssetsDictionary[comp.id] ? (
                      React.createElement(CompanionAssetsDictionary[comp.id], { 
                        className: `w-8 h-8 ${showDetails ? 'drop-shadow-sm' : 'brightness-0 opacity-20 grayscale'} ${isHoverAnimatedCompanion ? 'transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110' : ''}` 
                      })
                    ) : (
                      <span className={`text-2xl ${!showDetails && 'grayscale opacity-50'} ${isHoverAnimatedCompanion ? 'transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110' : ''}`}>{showDetails ? '🐦‍⬛' : '❓'}</span>
                    )}
                  </div>
                  <h4 className="font-extrabold font-display text-primary-anchor text-sm mb-0.5">{showDetails ? comp.name : '???'}</h4>
                  <h5 className="font-bold text-[10px] text-accent-seafoam mb-2 uppercase tracking-wide">{showDetails ? comp.banglaName : 'Unknown'}</h5>
                  <p className="text-[11px] text-text-muted font-medium leading-tight md:block hidden mb-3">
                    {isUnlocked ? `Unlocked: ${comp.unlockConditionStr}` : (showDetails ? `Locked (${comp.unlockConditionStr})` : 'Condition locked')}
                  </p>
                  
                  {isUnlocked && onEquipCompanion && (
                    <button
                      onClick={() => onEquipCompanion(isEquipped ? null : comp.id)}
                      className={`mt-auto px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isEquipped 
                          ? 'bg-accent-seafoam text-white shadow-md' 
                          : 'bg-surface border-2 border-surface-alt text-text-secondary hover:border-text-muted'
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
              buttonStyle = "bg-accent-coral/10 text-accent-coral border-2 border-accent-coral/30 opacity-50 cursor-not-allowed";
              isDisabled = true;
          } else if (isEquipped) {
              statusText = item.type === 'seed' ? "Unlocked" : "Equipped";
              buttonStyle = "bg-surface-alt text-text-muted border-2 border-surface-alt";
              isDisabled = true;
          } else if (isOwned) {
              statusText = "Equip";
              buttonAction = () => onEquipItem(item);
              buttonStyle = "bg-accent-periwinkle/10 text-accent-periwinkle border-2 border-accent-periwinkle/30 hover:bg-accent-periwinkle/20";
          } else {
              statusText = `${item.price} coins`;
              buttonAction = () => onBuyItem(item);
              buttonStyle = canAfford 
                 ? "bg-accent-coral/10 text-accent-coral border-2 border-accent-coral/30 hover:bg-accent-coral/20" 
                 : "bg-surface-alt/50 text-text-muted border-2 border-surface-alt opacity-50 cursor-not-allowed";
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
                 buttonStyle = "bg-orange-500/10 text-orange-500 border-2 border-orange-500/30 opacity-60 cursor-not-allowed";
                 isDisabled = true;
              } else if (isOnCooldown) {
                 statusText = "Cooldown";
                 buttonStyle = "bg-surface-alt text-text-muted border-2 border-surface-alt opacity-50 cursor-not-allowed";
                 isDisabled = true;
              } else {
                 statusText = `${item.price} coins`;
                 buttonAction = () => onBuyItem(item);
                 buttonStyle = canAfford 
                    ? "bg-accent-coral/10 text-accent-coral border-2 border-accent-coral/30 hover:bg-accent-coral/20" 
                    : "bg-surface-alt/50 text-text-muted border-2 border-surface-alt opacity-50 cursor-not-allowed";
                 isDisabled = !canAfford;
              }
          }
          
          return (
            <div key={item.id} className="rounded-[32px] p-4 grid grid-rows-[auto,auto,1fr,auto,auto] gap-2 pt-6 relative overflow-visible group bg-surface shadow-[0_8px_32px_rgba(28,27,31,0.08)] border-0">
               {/* Background Hint */}
               {item.type === 'background' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-surface-alt opacity-50 pointer-events-none rounded-[32px]" />
               )}
               
               <div className="w-20 h-28 mb-3 mx-auto flex flex-col items-center justify-end relative group-hover:scale-105 transition-transform duration-300">
                  <React.Suspense fallback={<div className="w-4 h-4 rounded-full border border-surface-alt border-t-accent-seafoam animate-spin mx-auto" />}>
                     {item.type === 'seed' ? (
                        <PlantIcon plantType={item.id.replace('seed_', '') as any} stage="Fruiting Plant" className="w-20 h-24 absolute bottom-[5%] z-10" />
                     ) : (
                        <ShopItemSvg itemId={item.id} className="w-20 h-24 absolute bottom-[5%] z-10" />
                     )}
                  </React.Suspense>
               </div>
               <h3 className="text-sm font-extrabold text-primary-anchor text-center line-clamp-1 leading-tight font-display">{item.name}</h3>
               <p className="text-[10px] text-text-muted font-medium text-center leading-tight line-clamp-3">{item.description}</p>
               
               {item.isConsumable && (
                   <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest text-center mt-1">Owned: {item.id === 'item_streak_freeze' ? (stats.streakFreezes || 0) : (stats.boostItemCounts?.[item.id] || 0)} {item.maxCapacity ? `/ ${item.maxCapacity}` : ''}</div>
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
                  className={`w-full py-3 mt-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${buttonStyle}`}
               >
                  {statusText}
               </button>
            </div>
          )
        })}
        </div>
      )}

      <AnimatedModal isOpen={!!confirmPurchaseItem} onClose={() => setConfirmPurchaseItem(null)} alignment="center" className="!p-0 !max-w-md mx-auto !rounded-[40px] overflow-hidden bg-surface border-2 border-surface-alt shadow-xl">
        {confirmPurchaseItem && (
           <div className="p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold font-display text-xl text-primary-anchor uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-6 h-6 text-accent-coral" /> Confirm Purchase
                </h3>
                <button onClick={() => setConfirmPurchaseItem(null)} className="p-2 -mr-2 text-text-muted hover:text-primary-anchor bg-surface-alt rounded-full transition-transform hover:scale-105">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="flex items-start gap-4 mb-8 bg-accent-mustard/10 p-6 rounded-[32px] border-2 border-accent-mustard/20">
               <div className="w-24 h-32 shrink-0 relative flex flex-col items-center justify-end">
                  {confirmPurchaseItem.type === 'seed' ? (
                      <PlantIcon plantType={confirmPurchaseItem.id.replace('seed_', '') as any} stage="Fruiting Plant" className="w-20 h-28 absolute bottom-[5%] z-10" />
                   ) : (
                      <ShopItemSvg itemId={confirmPurchaseItem.id} className="w-20 h-28 absolute bottom-[5%] z-10 drop-shadow-sm" />
                   )}
               </div>
               <div>
                  <h4 className="font-extrabold text-primary-anchor text-lg mb-1">{confirmPurchaseItem.name}</h4>
                  <p className="text-sm font-medium text-text-muted leading-tight">{confirmPurchaseItem.description}</p>
               </div>
             </div>
             
             <button
               onClick={() => {
                  onBuyItem(confirmPurchaseItem);
                  setConfirmPurchaseItem(null);
               }}
               className="w-full py-5 bg-accent-coral text-[var(--bg-base)] font-extrabold tracking-widest uppercase rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md hover:opacity-90"
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
