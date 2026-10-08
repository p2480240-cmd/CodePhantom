import React, { useState } from 'react';
import { Trophy, Medal, Flame, Zap, Shield, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { UserProfile, LeaderboardUser } from '../types';

interface LeaderboardPageProps {
  profile: UserProfile;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ profile }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  const baseUsers: LeaderboardUser[] = [
    { rank: 1, id: 'u1', username: 'NovaCoder', avatar: '⚡', level: 12, xp: 12450, solvedCount: 42, streak: 14, badge: 'Grand Detective' },
    { rank: 2, id: 'u2', username: 'ByteDreamer', avatar: '🌙', level: 11, xp: 10320, solvedCount: 36, streak: 12, badge: 'Cipher Master' },
    { rank: 3, id: 'current', username: profile.username, avatar: '👁️', level: profile.level, xp: profile.xp, solvedCount: profile.solvedChallengeIds.length, streak: profile.streak, isCurrentUser: true, badge: profile.role },
    { rank: 4, id: 'u3', username: 'LogicLover', avatar: '🔮', level: 7, xp: 6910, solvedCount: 24, streak: 6, badge: 'Logic Hunter' },
    { rank: 5, id: 'u4', username: 'PixelPioneer', avatar: '🎮', level: 6, xp: 5420, solvedCount: 19, streak: 8, badge: 'Shadow Sleuth' },
    { rank: 6, id: 'u5', username: 'CyberHawk', avatar: '🦅', level: 5, xp: 4890, solvedCount: 16, streak: 4, badge: 'Shadow Sleuth' },
    { rank: 7, id: 'u6', username: 'BugBusterX', avatar: '🛡️', level: 4, xp: 3950, solvedCount: 14, streak: 5, badge: 'Novice Sleuth' },
    { rank: 8, id: 'u7', username: 'SyntaxSentinel', avatar: '👾', level: 3, xp: 2840, solvedCount: 9, streak: 3, badge: 'Novice Sleuth' },
  ];

  // Adjust rankings based on user's live XP
  const sortedUsers = [...baseUsers].sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-phantom-amber/20 border border-amber-300 dark:border-phantom-amber/40 text-amber-800 dark:text-phantom-amber text-xs font-mono font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Detective Hall of Fame</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Global Arena Leaderboard</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Detectives ranked by bugs banished, streak endurance, and total deduction experience.
          </p>
        </div>

        {/* Demo Mode Notice Requirement */}
        <div className="text-xs font-mono text-slate-600 dark:text-white/50 bg-slate-50 dark:bg-black/40 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-2 font-medium">
          <Shield className="w-4 h-4 text-purple-600 dark:text-phantom-cyan" />
          <span>Demo Mode Sample Arena Rankings</span>
        </div>
      </div>

      {/* Timeframe Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-phantom-deep p-1 rounded-xl border border-slate-200 dark:border-phantom-border">
          {(['weekly', 'monthly', 'all-time'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeframe === t
                  ? 'bg-phantom-purple text-white shadow-glow-purple'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-white/50 font-mono hidden sm:block">
          Your Position: Rank #{sortedUsers.find((u) => u.isCurrentUser)?.rank || 3}
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060a17] text-slate-500 dark:text-white/50 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Rank</th>
                <th className="py-3.5 px-4 sm:px-6">Detective</th>
                <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Title</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Streak</th>
                <th className="py-3.5 px-4 sm:px-6 text-center hidden md:table-cell">Cases</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {sortedUsers.map((u) => {
                const isTop3 = u.rank <= 3;
                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      u.isCurrentUser
                        ? 'bg-purple-100/80 dark:bg-phantom-purple/20 font-semibold text-purple-950 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white/80'
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono">
                      <div className="flex items-center gap-1.5">
                        {u.rank === 1 && <span className="text-amber-500 font-bold text-sm">🥇</span>}
                        {u.rank === 2 && <span className="text-slate-400 font-bold text-sm">🥈</span>}
                        {u.rank === 3 && <span className="text-amber-700 font-bold text-sm">🥉</span>}
                        <span className={isTop3 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/40'}>
                          #{u.rank}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-center text-base">
                          {u.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {u.isCurrentUser && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-200 dark:bg-phantom-cyan/20 text-purple-900 dark:text-phantom-cyan border border-purple-300 dark:border-phantom-cyan/40 font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-white/40 font-mono">
                            Level {u.level}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                      <span className="text-xs text-purple-700 dark:text-phantom-violet font-semibold">
                        {u.badge}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-phantom-amber font-semibold">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{u.streak}d</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center font-mono hidden md:table-cell text-slate-600 dark:text-white/70">
                      {u.solvedCount}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right font-mono font-bold text-amber-600 dark:text-phantom-amber">
                      {u.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
