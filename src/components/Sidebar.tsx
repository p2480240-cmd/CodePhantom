import React, { useEffect } from 'react';
import {
  X,
  Home,
  Compass,
  BookOpen,
  RotateCcw,
  Bug,
  Dna,
  Trophy,
  BarChart3,
  Award,
  Shield,
  Flame,
  Settings,
  Sparkles,
  Zap,
  Terminal,
} from 'lucide-react';
import { PhantomLogo } from './PhantomLogo';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile, Language } from '../types';
import { getRankTitle } from '../services/storageService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onChangeLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  profile,
  theme,
  onToggleTheme,
  onChangeLanguage,
  onOpenSettings,
}) => {
  const isDark = theme === 'dark';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const unreviewedCount = (profile.errorRevisions || []).filter((r) => !r.reviewed).length;
  const rankTitle = profile.rankTitle || getRankTitle(profile.level);

  const navSections = [
    {
      category: 'MAIN DISPATCH',
      items: [
        { id: 'home', label: 'Home Arena', icon: Home, badge: undefined },
        { id: 'missions', label: 'Mission Map', icon: Compass, badge: undefined },
        { id: 'learn', label: 'Learn Mode', icon: BookOpen, badge: undefined },
      ],
    },
    {
      category: 'INVESTIGATION SUITE',
      items: [
        {
          id: 'revisions',
          label: 'Error Revisions',
          icon: RotateCcw,
          badge: unreviewedCount > 0 ? `${unreviewedCount} New` : undefined,
          badgeColor: 'bg-phantom-crimson text-white',
        },
        { id: 'encyclopedia', label: 'Bug Encyclopedia', icon: Bug, badge: '10 Types' },
        { id: 'dna', label: 'Bug DNA & Weakness', icon: Dna, badge: undefined },
      ],
    },
    {
      category: 'ARENA STATS & REWARDS',
      items: [
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: undefined },
        { id: 'reports', label: 'Forensic Reports', icon: BarChart3, badge: undefined },
        { id: 'achievements', label: 'Badges & Quests', icon: Award, badge: undefined },
      ],
    },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Sliding Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] border-r z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isDark
            ? 'bg-[#080D1B] border-phantom-border/60 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-label="Navigation Sidebar"
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-phantom-deep/60 border-phantom-border/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label="CodePhantom Home Arena"
            onClick={() => handleNavClick('home')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('home'); }}
            className="cursor-pointer"
          >
            <PhantomLogo size="md" />
          </div>
          <button
            onClick={onClose}
            title="Close Sidebar (Esc)"
            aria-label="Close Sidebar"
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-white/50 hover:text-white hover:bg-white/5'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile Card */}
        <div
          className={`p-4 mx-3 my-3 rounded-2xl border space-y-3 ${
            isDark
              ? 'bg-phantom-deep border-phantom-border/60 text-white'
              : 'bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-phantom-purple to-phantom-cyan flex items-center justify-center font-bold text-black text-sm shadow-glow-purple">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <span>{profile.username}</span>
                  <span className="text-[10px] text-phantom-cyan font-mono font-bold">
                    Lv. {profile.level}
                  </span>
                </div>
                <div className="text-[11px] text-phantom-violet font-mono flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>{rankTitle}</span>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isDark
                  ? 'bg-phantom-amber/10 border-phantom-amber/30 text-phantom-amber'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{profile.streak}d</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div
              className={`flex justify-between text-[10px] font-mono ${
                isDark ? 'text-white/40' : 'text-slate-400'
              }`}
            >
              <span>{profile.xp} XP</span>
              <span>Next Lv: {profile.xpToNextLevel} XP</span>
            </div>
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden ${
                isDark ? 'bg-black/40' : 'bg-slate-200'
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-phantom-purple to-phantom-cyan rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((profile.xp / (profile.xpToNextLevel || 1000)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {navSections.map((sec) => (
            <div key={sec.category} className="space-y-1">
              <div
                className={`px-3 text-[10px] font-mono uppercase tracking-wider font-bold mb-1.5 ${
                  isDark ? 'text-white/40' : 'text-slate-400'
                }`}
              >
                {sec.category}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-phantom-purple/20 text-white border border-phantom-purple/50 shadow-glow-purple font-bold'
                            : 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm font-bold'
                          : isDark
                          ? 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive
                              ? 'text-phantom-cyan'
                              : isDark
                              ? 'text-white/50'
                              : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            item.badgeColor ||
                            (isDark ? 'bg-white/10 text-white/60' : 'bg-slate-200 text-slate-700')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls: Theme Toggle & Language */}
        <div
          className={`p-4 border-t space-y-3 ${
            isDark ? 'bg-phantom-deep/60 border-phantom-border/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Theme Switch Row */}
          <div className="flex items-center justify-between px-2">
            <span
              className={`text-xs font-mono flex items-center gap-1.5 ${
                isDark ? 'text-white/60' : 'text-slate-600'
              }`}
            >
              <span>Theme:</span>
              <span className="text-phantom-cyan capitalize font-bold">{theme}</span>
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Language Selector Row */}
          <div className="flex items-center justify-between px-2">
            <label htmlFor="sidebar-language-select" className={`text-xs font-mono ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Language:
            </label>
            <select
              id="sidebar-language-select"
              aria-label="Sidebar Language Preference"
              value={profile.selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className={`border font-mono font-bold text-xs rounded-lg px-2 py-1 outline-none cursor-pointer ${
                isDark
                  ? 'bg-phantom-midnight border-phantom-border/80 text-phantom-cyan'
                  : 'bg-white border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <option value="python">🐍 Python</option>
              <option value="javascript">⚡ JavaScript</option>
              <option value="typescript">🔷 TypeScript</option>
              <option value="cpp">⚙️ C++</option>
              <option value="java">☕ Java</option>
            </select>
          </div>

          {/* Settings Shortcut */}
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings & Gemini AI Key</span>
          </button>
        </div>
      </aside>
    </>
  );
};
