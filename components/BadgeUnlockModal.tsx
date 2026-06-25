import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '../types';
import { Sprout, Droplet, Trophy, ArrowUpRight, Leaf, Trees, Apple, Grape, Cherry, HeartHandshake, ShieldPlus, Sun, Flag, Star, Award, Crown, ShoppingCart, X } from 'lucide-react';
import { AnimatedModal } from './AnimatedModal';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatedModal isOpen={true} onClose={onClose} className="!max-w-sm !p-0 bg-surface-card border-0 rounded-large-card w-full max-w-sm overflow-visible md:overflow-visible shadow-xl mt-16 pb-4">
        
        {/* Header - Hidden to let avatar offset take the stage, just keep close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-text hover:text-primary-anchor transition-colors z-20 hover:bg-surface-alt rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={badge.badgeId}
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 380, 
              damping: 16,
              mass: 0.8
            }}
            className="pt-16 pb-6 px-8 flex flex-col items-center text-center relative"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
               <motion.div 
                 initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
                 animate={{ scale: 1, rotate: 0, opacity: 1 }}
                 transition={{ 
                   type: "spring", 
                   stiffness: 450, 
                   damping: 12, 
                   delay: 0.15 
                 }}
                 className="w-24 h-24 rounded-full bg-accent-mustard flex items-center justify-center border-[6px] border-surface-card shadow-md relative z-10 animate-companion-float"
               >
                  <Icon className="w-10 h-10 text-primary-anchor" />
               </motion.div>
            </div>

            <span className="text-[10px] font-bold tracking-widest text-accent-seafoam uppercase mb-2 px-3 py-1 bg-accent-seafoam/10 rounded-full mt-2">
              {badge.category} Badge
            </span>
            
            <h2 className="text-2xl font-display font-extrabold text-primary-anchor mb-2">{badge.title}</h2>
            <p className="text-secondary-text text-sm mb-6 max-w-[250px] leading-relaxed font-semibold">
              {badge.description}
            </p>

            <div className="flex gap-4 mb-4">
               {badge.rewardXP > 0 && (
                 <div className="flex items-center text-xs font-bold text-primary-anchor bg-accent-periwinkle/30 px-4 py-2 rounded-full">
                   +{badge.rewardXP} XP
                 </div>
               )}
               {badge.rewardCoins > 0 && (
                 <div className="flex items-center text-xs font-bold text-primary-anchor bg-accent-mustard/30 px-4 py-2 rounded-full">
                   +{badge.rewardCoins} Coins
                 </div>
               )}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full mt-2 py-4 bg-primary-anchor hover:opacity-90 text-surface-soft font-bold text-sm tracking-wide transition-all rounded-button shadow-sm active:scale-95"
            >
              {currentIndex < badges.length - 1 ? `Next Badge (${badges.length - currentIndex - 1} more)` : 'Awesome'}
            </button>
          </motion.div>
        </AnimatePresence>
    </AnimatedModal>
  );
};
