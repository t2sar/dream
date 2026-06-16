import React, { useState } from "react";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
} from "../services/firebase";
import { Button } from "./Button";
import { Capacitor } from "@capacitor/core";
import {
  Sparkles,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Mail,
  Key,
  User,
  Info,
  X,
} from "lucide-react";
import { AnimatedModal } from "./AnimatedModal";

type ActivePopup = null | "login" | "register";

export const Login: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleClosePopup = () => {
    setActivePopup(null);
    setError(null);
    setResetSent(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish Google sync link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      handleClosePopup();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Email authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setError("All credentials must be initialized.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await registerWithEmail(email, password, displayName);
      handleClosePopup();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Identity initialization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-main text-primary-anchor flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-seafoam/10 rounded-full blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-periwinkle/10 rounded-full blur-[140px] opacity-30 pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-md w-full bg-surface-card p-8 md:p-10 rounded-large-card relative z-10 shadow-lg flex flex-col items-center">
        {/* Top Section: Logo & Welcome */}
        <div className="text-center mb-10 w-full">
          <div className="w-20 h-20 bg-gradient-to-tr from-accent-periwinkle via-accent-blush to-accent-seafoam rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md rotate-45 hover:rotate-90 transition-transform duration-700">
            <Sparkles className="w-10 h-10 text-white -rotate-45" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight font-display text-primary-anchor">
            T2SAR DREAM
          </h1>
          <p className="text-slate-400 font-medium text-sm tracking-wide">
            Cultivate your habits. Grow your life.
          </p>
        </div>

        {/* Middle Section: Feature List */}
        <div className="w-full space-y-6 mb-12">
          <FeatureRow icon={Smartphone} text="Cross Platform Sync" />
          <FeatureRow icon={ShieldCheck} text="Cloud Backup" />
          <FeatureRow icon={Sparkles} text="Track Your Streaks" />
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="w-full flex flex-col gap-4">
          {error && !activePopup && (
            <div className="p-3 mb-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-mono uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
              <span>{error}</span>
            </div>
          )}

          {isNative && (
            <div className="p-4 mb-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-300">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
              <div className="text-xs font-mono uppercase leading-relaxed tracking-wider text-left">
                <span className="text-white font-bold">Mobile App Notice:</span>{" "}
                Google login popups are not supported inside Android webviews. Please use Email login instead.
              </div>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            isLoading={isLoading && !activePopup}
            className="w-full py-4 text-sm font-bold tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] shadow-[0_0_25px_rgba(0,245,212,0.3)] border-0 rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          <Button
            onClick={() => {
              setError(null);
              setActivePopup("login");
            }}
            variant="ghost"
            className="w-full py-4 text-sm font-bold tracking-widest uppercase bg-transparent text-white border-2 border-white/10 hover:bg-white/5 rounded-2xl transition-all"
          >
            Login with Email
          </Button>

          <button
            onClick={() => {
              setError(null);
              setActivePopup("register");
            }}
            className="w-full py-3 mt-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
          >
            Create a New Account
          </button>
        </div>
      </div>

      {/* Popups */}
      <AnimatedModal
        isOpen={activePopup === "login"}
        onClose={handleClosePopup}
        alignment="bottom"
        className="!max-w-md mx-auto !p-0"
      >
        <div className="relative p-6 sm:p-8 bg-zinc-950 border-t border-white/10 sm:border sm:rounded-[32px]">
          <button
            onClick={handleClosePopup}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to sync your garden.</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-mono uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-sm font-bold tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] border-0 rounded-2xl transition-all"
            >
              Sign In
            </Button>

            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError("Enter your email address first, then tap Forgot Password.");
                  return;
                }
                setError(null);
                setResetSent(false);
                try {
                  await resetPassword(email);
                  setResetSent(true);
                } catch (err: any) {
                  setError(err.message || "Failed to send reset email.");
                }
              }}
              className="w-full text-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#00F5D4] transition-colors py-2"
            >
              Forgot Password?
            </button>
            
            {resetSent && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-mono uppercase tracking-widest">
                <Mail className="w-4 h-4 shrink-0" />
                <span>Reset email sent! Check your inbox.</span>
              </div>
            )}
          </form>
        </div>
      </AnimatedModal>

      <AnimatedModal
        isOpen={activePopup === "register"}
        onClose={handleClosePopup}
        alignment="bottom"
        className="!max-w-md mx-auto !p-0"
      >
        <div className="relative p-6 sm:p-8 bg-zinc-950 border-t border-white/10 sm:border sm:rounded-[32px]">
          <button
            onClick={handleClosePopup}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-sm text-slate-400">Join and start growing today.</p>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="e.g. your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-600"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-mono uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-sm font-bold tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] border-0 rounded-2xl transition-all"
            >
              Create Account
            </Button>

            <div className="p-4 bg-zinc-900 border border-cyan-500/10 rounded-2xl flex gap-3 text-slate-500 mt-4">
              <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <span className="text-white font-bold">Note:</span>{" "}
                Ensure Email/Password provider is active inside your Cloud Console for the registration module to sync correctly.
              </div>
            </div>
          </form>
        </div>
      </AnimatedModal>
    </div>
  );
};

const FeatureRow = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-5 w-full max-w-[280px] mx-auto group">
    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#00F5D4]/30 transition-all duration-300 shadow-inner">
      <Icon className="w-5 h-5 text-[#00F5D4]" strokeWidth={1.5} />
    </div>
    <span className="font-semibold text-sm text-slate-300 tracking-wide">
      {text}
    </span>
  </div>
);
