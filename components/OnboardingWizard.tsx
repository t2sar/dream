import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlantIcon } from './PlantIcon';
import { PlantType } from '../types';
import { ArrowRight, Leaf, Sparkles, Sprout } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (firstHabitName: string, category: string, plantType: PlantType) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [habitName, setHabitName] = useState('');
  const [category, setCategory] = useState('Growth');
  const [plantType, setPlantType] = useState<PlantType>('Mango / Aam');

  const categories = ['Growth', 'Health', 'Mind', 'Work', 'Custom'];
  const plantTypes: { type: PlantType; desc: string }[] = [
    { type: 'Mango / Aam', desc: 'Grows steady and strong' },
    { type: 'Lemon / Lebu', desc: 'Requires patience' },
    { type: 'Coconut / Narikel', desc: 'Resilient and hardy' },
    { type: 'Banana / Kola', desc: 'Grows fast and tall' }
  ];

  const handleNext = () => {
    if (step === 2 && !habitName.trim()) return;
    if (step < 3) setStep(step + 1);
    else onComplete(habitName.trim() || 'My First Habit', category, plantType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md w-full glass p-8 rounded-3xl border border-surface-alt relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-surface-alt">
            <motion.div 
              className="h-full bg-primary-mint"
              initial={{ width: `${((step - 1) / 3) * 100}%` }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-primary-mint/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-10 h-10 text-primary-mint" />
              </div>
              <h1 className="text-2xl font-bold text-primary-text mb-4">Welcome to Habit Garden</h1>
              <p className="text-muted-text leading-relaxed mb-8">
                Here, your habits are plants. Complete them daily to help them grow from tiny seeds into magnificent flora. Skip a day, and they might wilt.
              </p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl bg-primary-mint text-white font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
              >
                Let's Plant a Seed <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-mint/10 rounded-full flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-primary-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary-text">What do you want to grow?</h2>
                  <p className="text-xs text-muted-text">Choose a habit to start tracking</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-primary-text mb-2 uppercase tracking-wider">Habit Name</label>
                  <input
                    type="text"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="e.g. Drink Water, Read 10 pages"
                    className="w-full bg-surface-soft border border-surface-alt rounded-xl px-4 py-3 text-sm text-primary-text focus:border-primary-mint focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-text mb-2 uppercase tracking-wider">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          category === c ? 'bg-primary-mint text-white' : 'bg-surface-soft text-muted-text hover:bg-surface-alt'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!habitName.trim()}
                className="w-full py-4 rounded-2xl bg-primary-text text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-mint/10 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Choose your seed</h2>
                  <p className="text-xs text-muted-text">This will be the form your habit takes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {plantTypes.map(p => (
                  <button
                    key={p.type}
                    onClick={() => setPlantType(p.type)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      plantType === p.type ? 'border-primary-mint bg-primary-mint/5 ring-2 ring-primary-mint/20' : 'border-surface-alt bg-surface-soft hover:bg-surface-alt'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 opacity-80">
                      <PlantIcon plantType={p.type} stage="Sprout" health={100} isArchived={false} />
                    </div>
                    <div className="text-sm font-bold text-primary-text">{p.type}</div>
                    <div className="text-[10px] text-muted-text mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl bg-primary-mint text-white font-bold flex items-center justify-center transition hover:bg-opacity-90 shadow-lg shadow-primary-mint/20"
              >
                Start Growing
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
