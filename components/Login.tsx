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
    <div className="app-background-reset flex flex-col min-h-screen relative overflow-hidden font-sans">
      {/* Vibrant Playful Top Background Overlay */}
      <div className="absolute top-0 inset-x-0 h-[45%] bg-accent-coral rounded-b-[48px] shadow-sm z-0">
        {/* Soft decorative blob 1 */}
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[2px]" />
        {/* Soft decorative blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-white/10 rounded-full blur-[2px]" />
      </div>

      <div className="relative z-10 flex-col flex flex-1 items-center justify-center p-6 mt-16 sm:mt-24 w-full max-w-md mx-auto">
        {/* Top Header Floating Element */}
        <div className="absolute top-[-40px] flex items-center justify-between w-full px-4 mb-4">
          <div className="text-white">
            <h2 className="text-2xl font-display font-extrabold tracking-tight">Hi, Gardener ✨</h2>
            <p className="text-white/80 font-medium text-sm">Let's grow today.</p>
          </div>
          <div className="w-14 h-14 bg-accent-mustard rounded-full border-4 border-white shadow-sm flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
        </div>

        {/* Main Central Card container - Floating Depth */}
        <div className="w-full bg-surface p-8 rounded-[40px] shadow-lg flex flex-col items-center mt-12 mb-8 relative">
          
          <div className="w-full text-center mb-8 mt-2">
            <h1 className="text-3xl font-extrabold text-primary-anchor font-display tracking-tight mb-2">
              Habit Garden
            </h1>
            <p className="text-text-muted font-medium text-sm">
              Cultivate your daily habits.
            </p>
          </div>

          {/* Quick stats / Features visual mockup (pill shaped UI) */}
          <div className="flex gap-4 w-full mb-10">
            <div className="flex-1 bg-accent-seafoam/10 rounded-[28px] p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-10 h-10 bg-accent-seafoam text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-primary-anchor text-xl">Sync</span>
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Cloud</span>
            </div>
            
            <div className="flex-1 bg-accent-mustard/10 rounded-[28px] p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-10 h-10 bg-accent-mustard text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="font-bold text-primary-anchor text-xl">Any</span>
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Device</span>
            </div>

            <div className="flex-1 bg-accent-periwinkle/10 rounded-[28px] p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-10 h-10 bg-accent-periwinkle text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-primary-anchor text-xl">Safe</span>
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Secure</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            {error && !activePopup && (
              <div className="p-4 bg-accent-coral text-white rounded-[24px] flex items-center gap-3 text-sm font-bold shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isNative && (
              <div className="p-4 bg-accent-mustard/20 border border-accent-mustard/30 text-primary-anchor rounded-[24px] flex gap-3 text-xs font-bold leading-relaxed mb-4">
                <AlertTriangle className="w-5 h-5 shrink-0 text-accent-mustard" />
                <div>
                  Google login popups are not supported inside Android webviews. Please use Email login instead.
                </div>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 text-sm font-extrabold whitespace-nowrap bg-primary-anchor text-bg-base shadow-sm hover:opacity-90 rounded-full transition-all flex items-center justify-center gap-3"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <button
              onClick={() => {
                setError(null);
                setActivePopup("login");
              }}
              className="w-full py-4 text-sm font-extrabold whitespace-nowrap bg-surface-alt text-primary-anchor hover:bg-surface-alt/80 rounded-full transition-all flex items-center justify-center"
            >
              Login with Email
            </button>

            <button
              onClick={() => {
                setError(null);
                setActivePopup("register");
              }}
              className="w-full py-4 mt-2 text-sm font-bold text-text-muted hover:text-primary-anchor transition-colors"
            >
              Create a New Account
            </button>
          </div>
        </div>

      </div>

      {/* Popups */}
      <AnimatedModal
        isOpen={activePopup === "login"}
        onClose={handleClosePopup}
        alignment="bottom"
        className="!max-w-md mx-auto !p-0 !bg-transparent !shadow-none"
      >
        <div className="relative p-8 pb-12 bg-surface shadow-xl rounded-t-[40px] sm:rounded-[40px] w-full">
          <button
            onClick={handleClosePopup}
            className="absolute top-6 right-6 p-3 bg-surface-alt text-primary-anchor transition-transform hover:scale-105 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8 mt-2">
            <h2 className="text-3xl font-extrabold font-display text-primary-anchor mb-2">
              Welcome Back
            </h2>
            <p className="text-base font-medium text-text-muted">
              Sign in to sync your garden.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 pl-4">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-full pl-14 pr-6 py-4 text-base font-medium text-primary-anchor focus:ring-4 focus:ring-accent-seafoam/30 focus:outline-none transition-all placeholder:text-text-muted/60"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 pl-4">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-full pl-14 pr-6 py-4 text-base font-medium text-primary-anchor focus:ring-4 focus:ring-accent-seafoam/30 focus:outline-none transition-all placeholder:text-text-muted/60"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-accent-coral/20 text-accent-coral rounded-[24px] flex items-center gap-3 text-sm font-bold mt-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-4 text-base font-extrabold bg-accent-seafoam text-white hover:opacity-90 shadow-sm border-0 rounded-full transition-transform active:scale-95"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError(
                    "Enter your email address first, then tap Forgot Password.",
                  );
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
              className="w-full text-center text-sm font-bold text-text-muted hover:text-accent-seafoam transition-colors py-4 rounded-full"
            >
              Forgot Password?
            </button>

            {resetSent && (
              <div className="p-4 bg-accent-seafoam/20 text-accent-seafoam rounded-[24px] flex items-center gap-3 text-sm font-bold mt-2">
                <Mail className="w-5 h-5 shrink-0" />
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
        className="!max-w-md mx-auto !p-0 !bg-transparent !shadow-none"
      >
        <div className="relative p-8 pb-12 bg-surface shadow-xl rounded-t-[40px] sm:rounded-[40px] w-full">
          <button
            onClick={handleClosePopup}
            className="absolute top-6 right-6 p-3 bg-surface-alt text-primary-anchor transition-transform hover:scale-105 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8 mt-2">
            <h2 className="text-3xl font-extrabold font-display text-primary-anchor mb-2">
              Create Account
            </h2>
            <p className="text-base font-medium text-text-muted">
              Join and start growing today.
            </p>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 pl-4">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-full pl-14 pr-6 py-4 text-base font-medium text-primary-anchor focus:ring-4 focus:ring-accent-periwinkle/30 focus:outline-none transition-all placeholder:text-text-muted/60"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 pl-4">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-full pl-14 pr-6 py-4 text-base font-medium text-primary-anchor focus:ring-4 focus:ring-accent-periwinkle/30 focus:outline-none transition-all placeholder:text-text-muted/60"
                  placeholder="e.g. your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 pl-4">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-full pl-14 pr-6 py-4 text-base font-medium text-primary-anchor focus:ring-4 focus:ring-accent-periwinkle/30 focus:outline-none transition-all placeholder:text-text-muted/60"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {error && (
               <div className="p-4 bg-accent-coral/20 text-accent-coral rounded-[24px] flex items-center gap-3 text-sm font-bold mt-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-4 text-base font-extrabold bg-primary-anchor text-bg-base hover:opacity-90 shadow-sm border-0 rounded-full transition-transform active:scale-95"
            >
              Create Account
            </button>

            <div className="p-4 bg-surface-alt/50 rounded-[24px] flex gap-3 text-text-secondary mt-4">
              <Info className="w-5 h-5 shrink-0 text-accent-periwinkle" />
              <div className="text-xs font-medium leading-relaxed">
                Ensure Email/Password provider is active inside your Cloud Console.
              </div>
            </div>
          </form>
        </div>
      </AnimatedModal>
    </div>
  );
};
