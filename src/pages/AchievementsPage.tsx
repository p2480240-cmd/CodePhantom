import React from 'react';
import { Trophy, Award, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { BadgeIcon } from '../components/BadgeIcon';

interface AchievementsPageProps {
  profile: UserProfile;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ profile }) => {
  const unlockedCount = profile.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-phantom-amber/20 border border-amber-300 dark:border-phantom-amber/40 text-amber-800 dark:text-phantom-amber text-xs font-mono font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Distinctions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Detective Trophy Case</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Badges awarded exclusively for verified debugging feats, streak mastery, and independent deductions.
          </p>
        </div>

        <div className="text-xs font-mono text-purple-700 dark:text-phantom-cyan bg-slate-50 dark:bg-black/40 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 font-semibold">
          Unlocked: {unlockedCount} / {profile.achievements.length} Badges
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {profile.achievements.map((ach) => {
          const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                ach.unlocked
                  ? 'bg-white dark:bg-phantom-deep border-purple-300 dark:border-phantom-violet/50 shadow-md dark:shadow-glow-purple'
                  : 'bg-slate-100/70 dark:bg-black/30 border-slate-200 dark:border-white/5 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <BadgeIcon icon={ach.icon} unlocked={ach.unlocked} className="w-7 h-7" />
                  {ach.unlocked ? (
                    <span className="text-[11px] font-mono text-teal-700 dark:text-phantom-teal flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 dark:text-white/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{ach.title}</h3>
                <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">{ach.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/5 mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-white/50">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-black/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ach.unlocked ? 'bg-phantom-cyan' : 'bg-slate-300 dark:bg-white/20'} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
