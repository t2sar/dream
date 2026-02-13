import React, { useState } from 'react';
import { loginWithGoogle } from '../services/firebase';
import { Button } from './Button';
import { Sparkles, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30" />

      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] relative z-10 border border-white/10 shadow-2xl shadow-black">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.3)] rotate-3 hover:rotate-6 transition-transform duration-500">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">t2sar dream</h1>
          <p className="text-slate-400 font-light text-lg">Focus. Growth. Ethereal.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 mb-8">
            <FeatureRow icon={Smartphone} text="Sync seamlessly across Web & Android" />
            <FeatureRow icon={ShieldCheck} text="Secure cloud backup & encryption" />
            <FeatureRow icon={Sparkles} text="AI-powered habit coaching" />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            onClick={handleLogin} 
            isLoading={isLoading}
            className="w-full py-4 text-lg bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] border-0"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-6 h-6 mr-2" />
            Continue with Google
          </Button>
          
          <p className="text-center text-xs text-slate-600 mt-6">
            By continuing, you agree to build a better version of yourself.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-4 text-slate-300">
    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
      <Icon className="w-5 h-5 text-sky-400" />
    </div>
    <span className="font-medium text-sm">{text}</span>
  </div>
);