import React from 'react';
import { PhantomLogo } from './PhantomLogo';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile, Language } from '../types';
import {
  Menu,
  Flame,
  Settings,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import { getRankTitle } from '../services/storageService';

interface NavbarProps {
  onToggleSidebar: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onChangeLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  currentTab,
  onSelectTab,
  profile,
  theme,
  onToggleTheme,
  onChangeLanguage,
  onOpenSettings,
  onOpenAuth,
}) => {
  const isDark = theme === 'dark';
  const rankTitle = profile.rankTitle || getRankTitle(profile.level);
  const unreviewedCount = (profile.errorRevisions || []).filter((r) => !r.reviewed).length;

  const getTabLabel = (id: string) => {
    switch (id) {
      case 'home':
        return 'Home Arena';
      case 'missions':
        return 'Mission Map';
      case 'learn':
        return 'Learn Mode';
      case 'hunt':
        return 'Active Mystery Case';
      case 'revisions':
        return 'Error Revisions';
      case 'encyclopedia':
        return 'Bug Encyclopedia';
      case 'dna':
        return 'Bug DNA & Weakness';
      case 'leaderboard':
        return 'Leaderboard';
      case 'reports':
        return 'Forensic Reports';
      case 'achievements':
        return 'Badges & Quests';
      case 'dashboard':
        return 'Detective Dashboard';
      default:
        return 'Investigation';
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 overflow-x-hidden ${
        isDark
          ? 'bg-[#080D1B]/95 border-phantom-border/60 text-white'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left Side: Sidebar Toggle Button + Logo + Current Location */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sidebar Toggle Trigger Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Open Navigation Sidebar"
            aria-label="Open Navigation Sidebar"
            className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
              isDark
                ? 'bg-phantom-deep hover:bg-phantom-hover text-white/80 hover:text-white border-phantom-border/70 hover:border-phantom-cyan'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-phantom-cyan" />
            <span
              className={`hidden md:inline text-xs font-mono font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}
            >
              Menu
            </span>
            {unreviewedCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-phantom-crimson animate-pulse" />
            )}
          </button>

          {/* Brand Logo */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Go to Home Arena"
            onClick={() => onSelectTab('home')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('home'); }}
            className="cursor-pointer hover:opacity-95 transition-opacity shrink-0 flex items-center"
          >
            <PhantomLogo size="md" />
          </div>

          {/* Current Location Breadcrumb (visible on tablet/desktop) */}
          <div
            className={`hidden md:flex items-center gap-1.5 pl-2 border-l text-xs font-mono ${
              isDark ? 'border-white/10 text-white/50' : 'border-slate-200 text-slate-400'
            }`}
          >
            <span>/</span>
            <span className="text-phantom-violet font-semibold">{getTabLabel(currentTab)}</span>
          </div>
        </div>

        {/* Right Side: Clean Utility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Multi-Language Dropdown */}
          <div
            className={`flex items-center border rounded-lg px-1.5 sm:px-2 py-1 text-xs font-mono shrink-0 ${
              isDark
                ? 'bg-phantom-deep border-phantom-border/80'
                : 'bg-slate-100 border-slate-200 shadow-sm'
            }`}
          >
            <label htmlFor="navbar-language-select" className={`mr-1 hidden lg:inline ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Lang:
            </label>
            <select
              id="navbar-language-select"
              aria-label="Programming Language Selection"
              value={profile.selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className={`bg-transparent font-bold outline-none cursor-pointer text-xs ${
                isDark ? 'text-phantom-cyan' : 'text-slate-800'
              }`}
            >
              <option value="python" className={isDark ? 'bg-[#090e24] text-white' : 'bg-white text-slate-800'}>
                🐍 Python
              </option>
              <option value="javascript" className={isDark ? 'bg-[#090e24] text-white' : 'bg-white text-slate-800'}>
                ⚡ JS
              </option>
              <option value="typescript" className={isDark ? 'bg-[#090e24] text-white' : 'bg-white text-slate-800'}>
                🔷 TS
              </option>
              <option value="cpp" className={isDark ? 'bg-[#090e24] text-white' : 'bg-white text-slate-800'}>
                ⚙️ C++
              </option>
              <option value="java" className={isDark ? 'bg-[#090e24] text-white' : 'bg-white text-slate-800'}>
                ☕ Java
              </option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle Switch */}
          <div className="shrink-0 scale-90 sm:scale-100 origin-center">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Daily Streak Indicator */}
          <div
            title={`Daily Streak: ${profile.streak} days`}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold shrink-0 ${
              isDark
                ? 'bg-phantom-amber/10 border-phantom-amber/30 text-phantom-amber'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{profile.streak}d</span>
          </div>

          {/* Level / XP Pill */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Open Detective Dashboard. Level ${profile.level}, ${profile.xp} XP`}
            onClick={() => onSelectTab('dashboard')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('dashboard'); }}
            className={`cursor-pointer flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg border text-xs transition-colors shrink-0 ${
              isDark
                ? 'bg-phantom-card border-phantom-border hover:border-phantom-cyan/50 text-white'
                : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-phantom-cyan animate-pulse" />
            <span className="font-semibold text-xs whitespace-nowrap">Lv. {profile.level}</span>
            <span
              className={`font-mono hidden md:inline ${
                isDark ? 'text-white/40' : 'text-slate-400'
              }`}
            >
              ({profile.xp} XP)
            </span>
          </div>

          {/* Settings Button (Desktop & Tablet only - available via Menu drawer on mobile) */}
          <button
            onClick={onOpenSettings}
            title="Settings & API Key"
            aria-label="Settings and API Key configuration"
            className={`hidden sm:flex p-2 rounded-lg border transition-colors shrink-0 ${
              isDark
                ? 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User / Auth Pill */}
          <button
            onClick={onOpenAuth}
            aria-label={`Detective profile: ${profile.isGuest ? 'Demo Mode' : profile.username}`}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-violet text-white text-xs font-semibold hover:brightness-110 shadow-glow-purple transition-all shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[80px] truncate">{profile.isGuest ? 'Demo Mode' : profile.username}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
