import React, { useState } from 'react';
import { X, User, Shield, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onStartOnboarding: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onStartOnboarding,
}) => {
  const [alias, setAlias] = useState(profile.username);
  const [isDemo, setIsDemo] = useState(profile.isGuest);

  if (!isOpen) return null;

  const handleSaveAlias = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      username: alias.trim() || 'Phantom Detective',
      isGuest: isDemo,
    };
    StorageService.saveProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  const handleSwitchToDemo = () => {
    const updated = {
      ...profile,
      username: 'CodePhantom (Judge Demo)',
      isGuest: true,
    };
    StorageService.saveProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-2xl text-slate-900 dark:text-white space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-600 dark:text-phantom-cyan" />
            <h3 className="text-lg font-bold">Detective Profile & Access</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-white/50 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Badge */}
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-phantom-purple/15 border border-purple-200 dark:border-phantom-purple/30 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-phantom-violet">
            <Shield className="w-4 h-4 text-cyan-600 dark:text-phantom-cyan" />
            <span>Hackathon Instant Demo Mode Active</span>
          </div>
          <p className="text-slate-600 dark:text-white/70 text-[11px] leading-relaxed">
            No signup, credit cards, or verification required. Judges and developers can immediately access all missions and features.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveAlias} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/80 block mb-1">
              Detective Call-Sign / Username
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-lg text-slate-900 dark:text-white font-mono focus:border-cyan-500 dark:focus:border-phantom-cyan outline-none"
              placeholder="e.g. CyberSherlock"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSwitchToDemo}
              className="text-xs text-cyan-700 dark:text-phantom-cyan hover:underline font-medium"
            >
              Reset to Judge Demo Alias
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartOnboarding();
              }}
              className="text-xs text-amber-600 dark:text-phantom-amber hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Rerun Onboarding Wizard</span>
            </button>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-violet text-white shadow-glow-purple hover:brightness-110 transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
