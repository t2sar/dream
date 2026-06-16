import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-full font-sans text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm";

  const variants = {
    primary:
      "bg-primary-anchor text-surface-soft hover:bg-primary-anchor/90 border border-transparent hover:-translate-y-0.5",
    secondary:
      "bg-surface-soft text-primary-anchor border border-surface-alt hover:bg-surface-alt/50 hover:-translate-y-0.5",
    danger:
      "bg-status-critical/10 hover:bg-status-critical/20 text-status-critical border border-status-critical/20 hover:border-status-critical/40 hover:-translate-y-0.5",
    ghost:
      "bg-transparent hover:bg-surface-alt/50 text-secondary-text shadow-none hover:shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
      ) : (
        children
      )}
    </button>
  );
};
