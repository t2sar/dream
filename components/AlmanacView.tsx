import React, { useState, useEffect } from 'react';
import { AlmanacData } from '../types';
import { ChevronRight, ChevronLeft, Share2, X, Leaf, Activity } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AlmanacViewProps {
  almanac: AlmanacData;
  onClose: () => void;
  userName?: string;
  userRank?: string;
}

export const AlmanacView: React.FC<AlmanacViewProps> = ({ almanac, onClose, userName = "Gardener", userRank = "Novice" }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const totalCards = almanac.comebacks > 0 ? 8 : 7;

  useEffect(() => {
    // Prevent scrolling behind
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleNext = () => {
    if (transitioning) return;
    if (currentCard < totalCards - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentCard(prev => prev + 1);
        setTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (transitioning) return;
    if (currentCard > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentCard(prev => prev - 1);
        setTransitioning(false);
      }, 300);
    }
  };

  const handleShare = async () => {
    const text = `My ${almanac.year} Garden Almanac 🌱\n${almanac.totalCheckins} check-ins · ${almanac.bestStreak.days}-day best streak · ${almanac.harvest.harvests} fruits harvested.\nGrown with Living Garden.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${almanac.year} Garden Almanac`,
          text: text,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  // Maps card index (handling skipped comeback card)
  const getCardType = (index: number) => {
    if (index === 0) return 'cover';
    if (index === 1) return 'big_number';
    if (index === 2) return 'streak';
    if (index === 3) return 'loyal_habit';
    if (index === 4) return 'rhythm';
    if (index === 5) return 'harvest';
    if (index === 6 && almanac.comebacks > 0) return 'comeback';
    return 'closing';
  };

  const cardType = getCardType(currentCard);

  const TopHabitIcon = (LucideIcons as any)[almanac.topHabit.icon] || Leaf;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden">
      <div 
        className={`w-full h-full max-w-md mx-auto relative flex flex-col items-center justify-center p-8 transition-opacity duration-300 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{
           // Background matching garden phase presets
           background: cardType === 'cover' ? 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' :
                       cardType === 'big_number' ? 'linear-gradient(to bottom, #11998e, #38ef7d)' :
                       cardType === 'streak' ? 'linear-gradient(to bottom, #f7b733, #fc4a1a)' :
                       cardType === 'loyal_habit' ? 'linear-gradient(to bottom, #8A2387, #E94057, #F27121)' :
                       cardType === 'rhythm' ? 'linear-gradient(to bottom, #141e30, #243b55)' :
                       cardType === 'harvest' ? 'linear-gradient(to bottom, #56ab2f, #a8e063)' :
                       cardType === 'comeback' ? 'linear-gradient(to bottom, #3a1c71, #d76d77, #ffaf7b)' :
                       'linear-gradient(to bottom, #000428, #004e92)'
        }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors bg-black/20 rounded-full p-2">
          <X className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 w-full h-full" onClick={handleNext} />
        <div className="absolute top-0 left-0 w-1/3 h-full z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute top-0 right-0 w-2/3 h-full z-10 cursor-pointer" onClick={handleNext} />

        {/* Progress Bar */}
        <div className="absolute top-6 left-6 right-20 flex gap-1 z-20">
           {Array.from({length: totalCards}).map((_, i) => (
             <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentCard ? 'bg-surface-card' : 'bg-surface-alt/20'}`} />
           ))}
        </div>

        <div className="relative z-20 w-full text-center pointer-events-none">
          {cardType === 'cover' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Leaf className="w-16 h-16 text-emerald-400 mb-8" />
                <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">Your {almanac.year}<br/>in the Garden 🌱</h1>
                <p className="text-emerald-200 text-lg font-mono uppercase tracking-widest">{userName}</p>
                <p className="text-white/60 text-sm mt-2">{userRank}</p>
             </div>
          )}

          {cardType === 'big_number' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-6xl font-display font-bold text-white mb-6 drop-shadow-lg">{almanac.totalCheckins}</h2>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">You watered your plants<br/>{almanac.totalCheckins} times this year.</h3>
                <p className="text-white/80 text-lg font-mono">That's ≈ {Math.round(almanac.totalCheckins / 52)} check-ins a week.</p>
             </div>
          )}

          {cardType === 'streak' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-6 bg-surface-alt/10 rounded-full mb-8 backdrop-blur-sm border border-surface-alt shadow-xl">
                   <Activity className="w-12 h-12 text-orange-200" />
                </div>
                <h2 className="text-5xl font-display font-bold text-white mb-4 drop-shadow-lg">{almanac.bestStreak.days} <span className="text-2xl">Days</span></h2>
                <h3 className="text-2xl font-bold text-white mb-4">Your longest streak:<br/>{almanac.bestStreak.habitName}</h3>
                {almanac.bestStreak.days >= 30 && (
                  <p className="text-orange-100 text-lg font-mono mt-4 tracking-widest uppercase">The doel was proud. 🐦</p>
                )}
             </div>
          )}

          {cardType === 'loyal_habit' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-6 bg-surface-alt/20 rounded-full mb-8 backdrop-blur-sm shadow-xl">
                   <TopHabitIcon className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your most-watered plant</h3>
                <h2 className="text-4xl font-display font-bold text-white mb-4 drop-shadow-md">{almanac.topHabit.name}</h2>
                <p className="text-pink-100 font-mono tracking-widest uppercase">{almanac.topHabit.fruit} · {almanac.topHabit.count} waterings</p>
             </div>
          )}

          {cardType === 'rhythm' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl font-display font-bold text-blue-200 mb-8">{almanac.rhythm.label}</h2>
                <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                   {almanac.rhythm.percent}% of your check-ins<br/>came in the {almanac.rhythm.label === 'Nishachor' ? 'evening/night' : 'morning/afternoon'}.
                </h3>
                <div className="w-full max-w-xs h-2 bg-surface-alt/10 rounded-full overflow-hidden mb-6">
                   <div className="h-full bg-blue-400 rounded-full" style={{width: `${almanac.rhythm.percent}%`}} />
                </div>
                <p className="text-blue-100/70 font-mono uppercase tracking-widest text-sm">Busiest month: {almanac.rhythm.busiestMonth}</p>
             </div>
          )}

          {cardType === 'harvest' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-display font-bold text-white mb-10">The Harvest</h1>
                <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
                   <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white mb-1">{almanac.harvest.plantsGrown}</span>
                      <span className="text-[10px] text-green-100 font-mono uppercase tracking-widest text-center">Plants<br/>Grown</span>
                   </div>
                   <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white mb-1">{almanac.harvest.harvests}</span>
                      <span className="text-[10px] text-green-100 font-mono uppercase tracking-widest text-center">Fruits<br/>Harvested</span>
                   </div>
                   <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white mb-1">{almanac.harvest.badges}</span>
                      <span className="text-[10px] text-green-100 font-mono uppercase tracking-widest text-center">Badges<br/>Earned</span>
                   </div>
                   <div className="glass p-4 border border-surface-alt flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white mb-1">{almanac.harvest.companions}</span>
                      <span className="text-[10px] text-green-100 font-mono uppercase tracking-widest text-center">Companions<br/>Arrived</span>
                   </div>
                </div>
             </div>
          )}

          {cardType === 'comeback' && (
             <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-6xl font-display font-bold text-white mb-6 drop-shadow-md">{almanac.comebacks}</h2>
                <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">times you came back<br/>after a slip.</h3>
                <p className="text-white/80 text-lg font-mono leading-relaxed">Every gardener replants.<br/>That's what makes you one. 🌱</p>
             </div>
          )}

          {cardType === 'closing' && (
             <div className="flex flex-col items-center pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TopHabitIcon className="w-16 h-16 text-cyan-200 mb-8 opacity-80" />
                <h2 className="text-3xl font-display font-bold text-white mb-12 drop-shadow-lg">See you in {parseInt(almanac.year) + 1},<br/>gardener 🌙</h2>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-3 px-8 py-4 bg-surface-card text-blue-900 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
                >
                  <Share2 className="w-5 h-5" />
                  Share your Almanac
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
