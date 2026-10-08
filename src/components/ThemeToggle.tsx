import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative inline-flex items-center h-8 w-14 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-phantom-cyan/50 ${
        isDark ? 'bg-[#0f172a] border border-phantom-purple/40' : 'bg-slate-200 border border-slate-300'
      } ${className}`}
    >
      {/* Background Icons */}
      <span className="absolute left-1.5 text-phantom-violet transition-opacity">
        <Moon className="w-3.5 h-3.5 fill-current opacity-80" />
      </span>
      <span className="absolute right-1.5 text-amber-500 transition-opacity">
        <Sun className="w-3.5 h-3.5 fill-current opacity-90" />
      </span>

      {/* Slider Knob */}
      <span
        className={`pointer-events-none inline-block w-6 h-6 rounded-full transform transition-transform duration-300 ease-in-out shadow-md flex items-center justify-center ${
          isDark
            ? 'translate-x-0 bg-gradient-to-tr from-phantom-purple to-phantom-cyan text-white shadow-glow-purple'
            : 'translate-x-6 bg-white text-amber-500 shadow-sm'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 fill-current" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-current text-amber-500" />
        )}
      </span>
    </button>
  );
};
