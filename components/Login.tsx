import React, { useState } from "react";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from "../services/firebase";
import { Button } from "./Button";
import {
  Sparkles,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Mail,
  Key,
  User,
  Info,
} from "lucide-react";

type AuthMethod = "google" | "login" | "register";

export const Login: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<AuthMethod>("google");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

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
      setError("Please fill out all deck fields.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Identity initialization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] bg-grain flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00F5D4]/5 rounded-full blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] opacity-30 pointer-events-none" />

      {/* Futuristic tech crosshairs framing the login card */}
      <div className="absolute top-12 left-12 font-mono text-[9px] text-[#00F5D4]/40 uppercase tracking-widest hidden md:block pointer-events-none select-none"></div>
      <div className="absolute bottom-12 right-12 font-mono text-[9px] text-slate-500 uppercase tracking-widest hidden md:block pointer-events-none select-none"></div>

      <div className="max-w-md w-full glass p-8 md:p-10 rounded-none relative z-10 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        {/* Decorative corner indicators */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00F5D4]/40" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#00F5D4]/40" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#00F5D4]/40" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00F5D4]/40" />

        <div className="text-center mb-8">
          {/* Abstract Low-Poly Monolithic Crown Logo */}
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 rounded-none flex items-center justify-center mx-auto mb-6 shadow-[0_0_35px_rgba(0,245,212,0.35)] rotate-45 hover:rotate-90 transition-transform duration-700 border border-white/10">
            <Sparkles className="w-7 h-7 text-white -rotate-45" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-300% animate-gradient">
            T2SAR DREAM
          </h1>
          <p className="text-slate-500 font-mono text-[10px] tracking-[0.2em] uppercase">
            Welcome Back
          </p>
        </div>

        {/* Segmented Control Header */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950/80 border border-white/5 mb-8">
          <button
            onClick={() => {
              setActiveMethod("google");
              setError(null);
            }}
            className={`py-2 px-1 text-[9px] font-mono font-bold tracking-[0.1em] uppercase transition-all ${
              activeMethod === "google"
                ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => {
              setActiveMethod("login");
              setError(null);
            }}
            className={`py-2 px-1 text-[9px] font-mono font-bold tracking-[0.1em] uppercase transition-all ${
              activeMethod === "login"
                ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveMethod("register");
              setError(null);
            }}
            className={`py-2 px-1 text-[9px] font-mono font-bold tracking-[0.1em] uppercase transition-all ${
              activeMethod === "register"
                ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            Register
          </button>
        </div>

        {activeMethod === "google" && (
          <div className="space-y-6">
            <div className="space-y-4 mb-8">
              <FeatureRow icon={Smartphone} text="Cross Platform Sync" />
              <FeatureRow icon={ShieldCheck} text="Cloud Backup" />
              <FeatureRow icon={Sparkles} text="Track Your Streaks" />
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-none flex items-center gap-3 text-rose-300 text-[10px] font-mono uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              isLoading={isLoading}
              className="w-full py-4 text-xs font-mono tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] shadow-[0_0_25px_rgba(0,245,212,0.3)] border-0 rounded-none transition-all animate-in fade-in duration-300"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-5 h-5 mr-3"
              />
              CONNECT WITH GOOGLE
            </Button>
          </div>
        )}

        {activeMethod === "login" && (
          <form
            onSubmit={handleEmailLogin}
            className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono tracking-[0.22em] text-slate-500 mb-2 uppercase font-bold">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white font-mono focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="ENTER REGISTERED EMAIL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-[0.22em] text-slate-500 mb-2 uppercase font-bold">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white font-mono focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="ENTER COMPLEX DECK PASS"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-none flex items-center gap-3 text-rose-300 text-[10px] font-mono uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-xs font-mono tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] shadow-[0_0_25px_rgba(0,245,212,0.3)] border-0 rounded-none transition-all"
            >
              Sign In
            </Button>

            {/* Config Reminder Box */}
            <div className="p-4 bg-zinc-950/80 border border-cyan-500/10 rounded-none flex gap-3 text-slate-500">
              <Info className="w-4 h-4 shrink-0 text-cyan-400" />
              <div className="text-[8px] font-mono uppercase leading-relaxed tracking-wider">
                <span className="text-white font-bold">
                  Firebase System Check:
                </span>{" "}
                If you experience credentials errors, ensure Email/Password
                providers are activated in your Google Firebase Auth interface.
              </div>
            </div>
          </form>
        )}

        {activeMethod === "register" && (
          <form
            onSubmit={handleEmailRegister}
            className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono tracking-[0.22em] text-slate-500 mb-2 uppercase font-bold">
                  Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white font-mono focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="e.g. CADET LEO CRIST"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-[0.22em] text-slate-500 mb-2 uppercase font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white font-mono focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="e.g. your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-[0.22em] text-slate-500 mb-2 uppercase font-bold">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white font-mono focus:border-[#00F5D4]/50 focus:outline-none transition-all placeholder:text-slate-700"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-none flex items-center gap-3 text-rose-300 text-[10px] font-mono uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-450" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-xs font-mono tracking-widest uppercase bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] shadow-[0_0_25px_rgba(0,245,212,0.3)] border-0 rounded-none transition-all"
            >
              Register
            </Button>

            {/* Config Reminder Box */}
            <div className="p-4 bg-zinc-950/80 border border-cyan-500/10 rounded-none flex gap-3 text-slate-500">
              <Info className="w-4 h-4 shrink-0 text-cyan-400" />
              <div className="text-[8px] font-mono uppercase leading-relaxed tracking-wider">
                <span className="text-white font-bold">
                  Firebase System Check:
                </span>{" "}
                Ensure Email/Password provider is active inside your Cloud
                Console for the registration module to sync correctly.
              </div>
            </div>
          </form>
        )}

        <p className="text-center text-[9px] font-mono tracking-widest text-slate-600 uppercase mt-8 select-none leading-relaxed"></p>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-4 text-slate-400">
    <div className="p-2 bg-zinc-950/60 border border-white/5 flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#00F5D4]" strokeWidth={2} />
    </div>
    <span className="font-mono text-[9px] tracking-widest font-semibold">
      {text}
    </span>
  </div>
);
