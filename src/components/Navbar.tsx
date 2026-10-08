import React, { useState } from 'react';
import { PhantomLogo } from './PhantomLogo';
import { UserProfile, Language } from '../types';
import {
  Flame,
  Sparkles,
  Terminal,
  Code,
  Settings,
  Menu,
  X,
  User,
  AlertTriangle,
  BookOpen,
  Dna,
  Shield,
  Award,
} from 'lucide-react';
import { getRankTitle } from '../services/storageService';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onChangeLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onChangeLanguage,
  onOpenSettings,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreviewedCount = (profile.errorRevisions || []).filter((r) => !r.reviewed).length;
  const rankTitle = profile.rankTitle || getRankTitle(profile.level);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'missions', label: 'Missions' },
    { id: 'learn', label: 'Learn' },
    { id: 'revisions', label: 'Revisions', badge: unreviewedCount },
    { id: 'encyclopedia', label: 'Encyclopedia' },
    { id: 'dna', label: 'Bug DNA' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-phantom-midnight/85 border-b border-phantom-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="cursor-pointer hover:opacity-95 transition-opacity shrink-0"
        >
          <PhantomLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-phantom-purple/20 border border-phantom-purple/40 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-phantom-crimson text-white text-[10px] font-mono font-bold animate-pulse">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Multi-Language Selector Dropdown */}
          <div className="flex items-center bg-phantom-deep border border-phantom-border/80 rounded-lg px-2 py-1 text-xs font-mono">
            <span className="text-white/40 mr-1.5 hidden sm:inline">Lang:</span>
            <select
              value={profile.selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent text-phantom-cyan font-bold outline-none cursor-pointer"
            >
              <option value="python" className="bg-[#090e24] text-white">🐍 Python</option>
              <option value="javascript" className="bg-[#090e24] text-white">⚡ JavaScript</option>
              <option value="typescript" className="bg-[#090e24] text-white">🔷 TypeScript</option>
              <option value="cpp" className="bg-[#090e24] text-white">⚙️ C++</option>
              <option value="java" className="bg-[#090e24] text-white">☕ Java</option>
            </select>
          </div>

          {/* Detective Rank Pill */}
          <div
            title={`Detective Rank: ${rankTitle}`}
            onClick={() => onSelectTab('dna')}
            className="cursor-pointer hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-phantom-purple/15 border border-phantom-purple/40 text-phantom-violet text-xs font-mono font-semibold"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{rankTitle}</span>
          </div>

          {/* Daily Streak Indicator */}
          <div
            title={`Current Daily Streak: ${profile.streak} days (No-Hint Streak: ${profile.streakWithoutHints || 0})`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-phantom-amber/10 border border-phantom-amber/30 text-phantom-amber text-xs font-mono font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{profile.streak}d</span>
          </div>

          {/* Level / XP Pill */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-lg bg-phantom-card border border-phantom-border hover:border-phantom-cyan/50 text-xs transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-phantom-cyan animate-pulse" />
            <span className="font-semibold text-white">Lv. {profile.level}</span>
            <span className="text-white/40 font-mono hidden sm:inline">({profile.xp} XP)</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Configure Gemini API and Preferences"
            className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-violet text-white text-xs font-semibold hover:brightness-110 shadow-glow-purple transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>{profile.isGuest ? 'Demo Mode' : profile.username}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          {/* Quick Language on Mobile */}
          <select
            value={profile.selectedLanguage}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="bg-phantom-deep border border-phantom-border text-phantom-cyan text-xs rounded px-2 py-1 outline-none font-mono"
          >
            <option value="python">PY</option>
            <option value="javascript">JS</option>
            <option value="typescript">TS</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white rounded-lg bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-phantom-deep border-b border-phantom-border px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-phantom-purple/20 text-white font-bold border border-phantom-purple/40'
                      : 'bg-white/5 text-white/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-phantom-crimson text-white text-[10px]">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-phantom-amber">
              <Flame className="w-4 h-4 fill-current" />
              <span>Streak: {profile.streak} days</span>
            </div>
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="text-white/60 hover:text-white flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
