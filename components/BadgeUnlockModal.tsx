import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '../types';
import { Sprout, Droplet, Trophy, ArrowUpRight, Leaf, Trees, Apple, Grape, Cherry, HeartHandshake, ShieldPlus, Sun, Flag, Star, Award, Crown, ShoppingCart, X } from 'lucide-react';
import { AnimatedModal } from './AnimatedModal';
import confetti from 'canvas-confetti';

const BADGE_ICONS: Record<string, React.FC<any>> = {
  Sprout, Droplet, Trophy, ArrowUpRight, Leaf, Trees, Apple, Grape, Cherry, HeartHandshake, ShieldPlus, Sun, Flag, Star, Award, Crown, ShoppingCart
};

interface BadgeUnlockModalProps {
  badges: AchievementBadge[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badges, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Specialized high-density garden-themed confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.3) },
        colors: ['#00F5D4', '#2ecc71', '#27ae60', '#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#ea8685', '#f8a5c2']
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < badges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const badge = badges[currentIndex];
  if (!badge) return null;

  const Icon = BADGE_ICONS[badge.iconName] || Award;

  return (
    <AnimatedModal isOpen={true} onClose={onClose} className="!max-w-sm !p-0 bg-[#000428] border border-[#00F5D4]/50 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,245,212,0.15)]">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-surface-alt relative bg-gradient-to-r from-emerald-900/50 to-transparent">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold font-display text-white">Badge Unlocked!</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
             <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse" />
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-500/20 flex items-center justify-center border-2 border-emerald-400/50 relative z-10 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <Icon className="w-12 h-12 text-emerald-400 drop-shadow-lg" />
             </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2 px-3 py-1 bg-[#00F5D4]/10 rounded-full">
            {badge.category} Badge
          </span>
          
          <h2 className="text-3xl font-display font-bold text-white mb-3">{badge.title}</h2>
          <p className="text-slate-300 text-sm mb-6 max-w-[250px] leading-relaxed">
            {badge.description}
          </p>

          <div className="flex gap-4">
             {badge.rewardXP > 0 && (
               <div className="flex items-col text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded">
                 +{badge.rewardXP} XP
               </div>
             )}
             {badge.rewardCoins > 0 && (
               <div className="flex items-col text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded">
                 +{badge.rewardCoins} Coins
               </div>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-alt/5 border-t border-surface-alt flex gap-2">
           <button
             onClick={handleNext}
             className="w-full py-3 bg-[#00F5D4] hover:bg-[#00d8b9] text-black font-mono font-bold text-xs uppercase tracking-widest transition-colors rounded-sm"
           >
             {currentIndex < badges.length - 1 ? `Next Badge (${badges.length - currentIndex - 1} more)` : 'Awesome'}
           </button>
        </div>
    </AnimatedModal>
  );
};
