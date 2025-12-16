import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'mercury';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-4 px-4 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-[0.15em] relative overflow-hidden group";
  
  const variants = {
    // Primary: Emerald Metal - Deep and Rich
    primary: `bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30`,
    
    // Mercury: Polished Silver (Smoother, less "game boy")
    mercury: `
      bg-gradient-to-b from-slate-100 to-slate-300
      text-slate-900
      border border-white/50
      shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)]
      hover:brightness-105
    `,

    // Secondary: Dark Aluminium
    secondary: `bg-zinc-900 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white shadow-lg`,
    
    // Danger: Subtle Red
    danger: "bg-red-950/30 text-red-500 hover:bg-red-900/50 border border-red-900/30",
    
    // Ghost: Transparent
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine effect for Mercury */}
      {variant === 'mercury' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">{children}</span>
      )}
    </button>
  );
};