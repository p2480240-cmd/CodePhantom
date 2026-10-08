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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-phantom-midnight/85 border-b border-phantom-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle Button + Logo + Current Location */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Trigger Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Open Navigation Sidebar"
            aria-label="Open Navigation Sidebar"
            className="p-2 rounded-xl bg-phantom-deep hover:bg-phantom-hover text-white/80 hover:text-white border border-phantom-border/70 hover:border-phantom-cyan transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Menu className="w-5 h-5 text-phantom-cyan" />
            <span className="hidden md:inline text-xs font-mono font-semibold text-white/70">
              Menu
            </span>
            {unreviewedCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-phantom-crimson animate-pulse" />
            )}
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => onSelectTab('home')}
            className="cursor-pointer hover:opacity-95 transition-opacity shrink-0"
          >
            <PhantomLogo size="md" />
          </div>

          {/* Current Location Breadcrumb (visible on tablet/desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10 text-xs font-mono text-white/50">
            <span>/</span>
            <span className="text-phantom-violet font-semibold">{getTabLabel(currentTab)}</span>
          </div>
        </div>

        {/* Right Side: Clean Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Language Dropdown */}
          <div className="flex items-center bg-phantom-deep border border-phantom-border/80 rounded-lg px-2 py-1 text-xs font-mono">
            <span className="text-white/40 mr-1 hidden lg:inline">Lang:</span>
            <select
              value={profile.selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent text-phantom-cyan font-bold outline-none cursor-pointer"
            >
              <option value="python" className="bg-[#090e24] text-white">🐍 Python</option>
              <option value="javascript" className="bg-[#090e24] text-white">⚡ JS</option>
              <option value="typescript" className="bg-[#090e24] text-white">🔷 TS</option>
              <option value="cpp" className="bg-[#090e24] text-white">⚙️ C++</option>
              <option value="java" className="bg-[#090e24] text-white">☕ Java</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle Switch */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* Daily Streak Indicator */}
          <div
            title={`Daily Streak: ${profile.streak} days`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-phantom-amber/10 border border-phantom-amber/30 text-phantom-amber text-xs font-mono font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{profile.streak}d</span>
          </div>

          {/* Level / XP Pill */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="cursor-pointer flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-lg bg-phantom-card border border-phantom-border hover:border-phantom-cyan/50 text-xs transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-phantom-cyan animate-pulse" />
            <span className="font-semibold text-white">Lv. {profile.level}</span>
            <span className="text-white/40 font-mono hidden md:inline">({profile.xp} XP)</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Settings & API Key"
            className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User / Auth Pill */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-violet text-white text-xs font-semibold hover:brightness-110 shadow-glow-purple transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[80px] truncate">{profile.isGuest ? 'Demo Mode' : profile.username}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
