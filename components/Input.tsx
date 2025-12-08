import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">{label}</label>}
      
      {/* Chrome Gradient Wrapper for Input - High Gloss Silver - Reduced to 2px */}
      <div className="relative p-[2px] rounded-xl bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        <div className="relative bg-black rounded-[10px] w-full">
            {/* Reduced vertical padding to py-3.5 */}
            <input
                className={`w-full bg-transparent text-white placeholder-slate-600 rounded-[10px] px-4 py-3.5 outline-none focus:bg-zinc-900/50 transition-all font-light tracking-wide ${className}`}
                {...props}
            />
        </div>
      </div>
      
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};