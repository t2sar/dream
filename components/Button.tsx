import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-none font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-[#00F5D4] text-zinc-950 hover:bg-[#00d8b9] shadow-[0_0_15px_rgba(0,245,212,0.25)] hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] border border-transparent hover:-translate-y-0.5",
    secondary: "glass hover:bg-zinc-900/60 text-slate-200 border border-white/10 hover:border-[#00F5D4]/30",
    danger: "bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 border border-rose-500/20 hover:border-rose-500/40",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-[#00F5D4]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
      ) : children}
    </button>
  );
};
