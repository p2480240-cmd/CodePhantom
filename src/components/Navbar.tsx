import React, { useState } from 'react';
import { PhantomLogo } from './PhantomLogo';
import { UserProfile, Language } from '../types';
import { Flame, Sparkles, Terminal, Code, Settings, Menu, X, User } from 'lucide-react';

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

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'missions', label: 'Missions' },
    { id: 'learn', label: 'Learn' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-phantom-midnight/80 border-b border-phantom-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PhantomLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-phantom-purple/20 border border-phantom-purple/40 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-phantom-deep border border-phantom-border/60 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onChangeLanguage('python')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                profile.selectedLanguage === 'python'
                  ? 'bg-phantom-purple text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Python</span>
            </button>
            <button
              onClick={() => onChangeLanguage('javascript')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                profile.selectedLanguage === 'javascript'
                  ? 'bg-phantom-purple text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>JS</span>
            </button>
          </div>

          {/* Daily Streak Indicator */}
          <div
            title={`Current Daily Streak: ${profile.streak} days`}
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
            <span className="text-white/40 font-mono">({profile.xp} XP)</span>
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
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white rounded-lg bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-phantom-deep border-b border-phantom-border px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg font-medium"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-phantom-cyan font-semibold"
            >
              Profile / Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
