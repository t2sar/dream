import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Moon, AlertTriangle, ShieldCheck, Calendar, Clock, Sparkles } from "lucide-react";
import { Habit, RestScopeType } from "../types";
import { Button } from "./Button";

interface SmartPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
  onConfirm: (scope: RestScopeType, duration: "3days" | "1week" | "2weeks") => void;
}

export const SmartPauseModal: React.FC<SmartPauseModalProps> = ({
  isOpen,
  onClose,
  habit,
  onConfirm,
}) => {
  const [scope, setScope] = useState<RestScopeType>(RestScopeType.ONE_HABIT);
  const [duration, setDuration] = useState<"3days" | "1week" | "2weeks">("1week");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Header background decoration */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 relative z-10">
            {/* Header / Intro */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 animate-pulse">
                <Moon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  Smart Pause Suggestion
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-3 tracking-tight">
                  Take a Breath, Protect Your Garden
                </h3>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                We noticed you've slipped <span className="text-indigo-300 font-semibold">{habit.icon} {habit.name}</span> for <span className="text-indigo-300 font-semibold">5 consecutive days</span>.
                Life happens! Whether it's exams, travel, or illness, pausing keeps your streak frozen and protects your plant's health.
              </p>
            </div>

            {/* Selector Option Cards (Scope) */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                1. Select Pause Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Just this habit */}
                <button
                  type="button"
                  onClick={() => setScope(RestScopeType.ONE_HABIT)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 ${
                    scope === RestScopeType.ONE_HABIT
                      ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-slate-800/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="font-semibold text-sm text-slate-100">Pause Only This Habit</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Only <span className="font-semibold text-slate-300">{habit.name}</span> will be paused. Other habits in your garden remain active.
                  </p>
                </button>

                {/* Option 2: All habits */}
                <button
                  type="button"
                  onClick={() => setScope(RestScopeType.ALL_HABITS)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 ${
                    scope === RestScopeType.ALL_HABITS
                      ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-slate-800/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-slate-100">Pause Entire Garden</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Puts your whole garden on hold. Absolutely zero plants will lose health, and all streaks freeze!
                  </p>
                </button>
              </div>
            </div>

            {/* Duration Pills */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                2. Choose Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "3days", label: "3 Days", desc: "Short recharge" },
                  { value: "1week", label: "1 Week", desc: "Standard break" },
                  { value: "2weeks", label: "2 Weeks", desc: "Deep rest" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDuration(item.value as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      duration === item.value
                        ? "bg-indigo-500/20 border-indigo-500 text-white"
                        : "bg-slate-800/40 border-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Highlighted Warning/Benefit banner */}
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Streak freeze enabled</span>: 
                Your streaks are safely locked in place. When you return from Rest Mode, you can pick up exactly where you left off without starting from scratch.
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full sm:order-1 text-xs text-slate-400 hover:text-slate-200"
            >
              No thanks, I will keep trying
            </Button>
            <Button
              variant="primary"
              onClick={() => onConfirm(scope, duration)}
              className="w-full sm:order-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4" /> Activate Smart Pause
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
