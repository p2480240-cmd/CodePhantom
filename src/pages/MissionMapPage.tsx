import React from 'react';
import {
  Compass,
  CheckCircle,
  Lock,
  ArrowRight,
  Zap,
  Terminal,
  Code,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { UserProfile, Challenge } from '../types';
import { CURATED_CHALLENGES } from '../services/challengeService';

interface MissionMapPageProps {
  profile: UserProfile;
  onSelectChallenge: (challengeId: string) => void;
}

export const MissionMapPage: React.FC<MissionMapPageProps> = ({
  profile,
  onSelectChallenge,
}) => {
  // Filter challenges matching user's selected language
  const userLangChallenges = CURATED_CHALLENGES.filter(
    (c) => c.language === profile.selectedLanguage
  );

  const zones = [
    {
      id: 'z1',
      name: 'Sector 1: The Neon Outskirts',
      desc: 'Introductory anomalies and glitched street terminals.',
      minLevel: 1,
      color: 'from-phantom-purple to-phantom-violet',
      cases: userLangChallenges.filter((c) => c.zone === 'The Neon Outskirts' || c.difficulty === 'easy').slice(0, 3),
    },
    {
      id: 'z2',
      name: 'Sector 2: The Phantom Vault',
      desc: 'Cryptographic data structures, lists, and keycard scanners.',
      minLevel: 2,
      color: 'from-phantom-violet to-phantom-cyan',
      cases: userLangChallenges.filter((c) => c.difficulty === 'easy').slice(1, 4),
    },
    {
      id: 'z3',
      name: 'Sector 3: Cybernetic Core',
      desc: 'High-speed algorithmic loops, off-by-one boundary leaks, and robot navigation.',
      minLevel: 3,
      color: 'from-phantom-cyan to-phantom-teal',
      cases: userLangChallenges.filter((c) => c.zone === 'Cybernetic Core' || c.difficulty === 'medium').slice(0, 3),
    },
    {
      id: 'z4',
      name: 'Sector 4: Deep Shadow Matrix',
      desc: 'Corrupted telemetry filters, falsy value traps, and type coercions.',
      minLevel: 5,
      color: 'from-phantom-teal to-phantom-amber',
      cases: userLangChallenges.filter((c) => c.zone === 'Deep Shadow Matrix' || c.difficulty === 'medium').slice(1, 4),
    },
    {
      id: 'z5',
      name: 'Sector 5: The Master Citadel',
      desc: 'Advanced recursive distortions and system-level anomaly banishment.',
      minLevel: 7,
      color: 'from-phantom-amber to-phantom-crimson',
      cases: userLangChallenges.filter((c) => c.difficulty === 'hard').slice(0, 3),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phantom-purple/15 border border-phantom-purple/30 text-phantom-violet text-xs font-mono font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Story Campaign World</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Detective Mission Map</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Travel through the corrupt sectors of the digital metropolis. Unravel the bug cases in each zone to clear the shadow fog.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-700 dark:text-phantom-cyan bg-cyan-50 dark:bg-black/40 px-4 py-2 rounded-xl border border-cyan-200 dark:border-white/5 font-bold">
          Solved: {profile.solvedChallengeIds.length} / {CURATED_CHALLENGES.length} Cases
        </div>
      </div>

      {/* Sector Timeline Progression */}
      <div className="space-y-8">
        {zones.map((zone, zIdx) => {
          const isUnlocked = profile.level >= zone.minLevel;

          return (
            <div
              key={zone.id}
              className={`p-6 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-white dark:bg-phantom-deep border-slate-200 dark:border-phantom-border/80 shadow-sm dark:shadow-xl'
                  : 'bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/5 opacity-60'
              }`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br ${zone.color} text-black shadow-md`}
                  >
                    0{zIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{zone.name}</span>
                      {!isUnlocked && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/50 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Unlocks at Lv. {zone.minLevel}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/60">{zone.desc}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 dark:text-white/40">
                  Sector {zIdx + 1} of 5
                </div>
              </div>

              {/* Case Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zone.cases.map((ch) => {
                  const isSolved = profile.solvedChallengeIds.includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isSolved
                          ? 'bg-teal-50/90 dark:bg-[#0b1724] border-teal-300 dark:border-phantom-teal/40 shadow-sm'
                          : isUnlocked
                          ? 'bg-slate-50/80 dark:bg-black/30 border-slate-200 dark:border-white/10 hover:border-cyan-400 dark:hover:border-phantom-cyan/50 shadow-sm dark:shadow-none'
                          : 'bg-slate-100 dark:bg-black/50 border-slate-200 dark:border-white/5'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px] font-mono uppercase text-slate-500 dark:text-white/50">
                            {ch.language === 'python' ? (
                              <Terminal className="w-3 h-3 text-phantom-cyan" />
                            ) : (
                              <Code className="w-3 h-3 text-phantom-violet" />
                            )}
                            <span>{ch.language}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              ch.difficulty === 'easy'
                                ? 'text-teal-700 dark:text-phantom-teal bg-teal-100 dark:bg-phantom-teal/10'
                                : ch.difficulty === 'medium'
                                ? 'text-amber-700 dark:text-phantom-amber bg-amber-100 dark:bg-phantom-amber/10'
                                : 'text-rose-700 dark:text-phantom-crimson bg-rose-100 dark:bg-phantom-crimson/10'
                            }`}
                          >
                            {ch.difficulty}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{ch.title}</span>
                          {isSolved && <CheckCircle className="w-4 h-4 text-phantom-teal" />}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-white/60 line-clamp-2 leading-relaxed">
                          {ch.storyContext}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/5 mt-3">
                        <span className="text-[11px] font-mono text-amber-600 dark:text-phantom-amber flex items-center gap-1 font-bold">
                          <Zap className="w-3 h-3 fill-current" />
                          <span>+{ch.xpReward} XP</span>
                        </span>

                        <button
                          onClick={() => onSelectChallenge(ch.id)}
                          disabled={!isUnlocked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isSolved
                              ? 'bg-teal-600 dark:bg-phantom-teal/20 text-white dark:text-phantom-teal hover:bg-teal-700 dark:hover:bg-phantom-teal/30'
                              : isUnlocked
                              ? 'bg-phantom-purple hover:bg-phantom-violet text-white shadow-glow-purple'
                              : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/30 cursor-not-allowed'
                          }`}
                        >
                          <span>{isSolved ? 'Replay' : 'Investigate'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
