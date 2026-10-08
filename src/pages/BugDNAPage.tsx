import React from 'react';
import { Dna, ShieldAlert, Sparkles, Zap, Flame, Clock, Brain, ArrowRight, Target, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface BugDNAPageProps {
  profile: UserProfile;
  onOpenRecommendedCase: () => void;
}

export const BugDNAPage: React.FC<BugDNAPageProps> = ({
  profile,
  onOpenRecommendedCase,
}) => {
  const dnaStats = profile.dnaStats || {};

  const concepts = [
    { name: 'Logic Errors & Operators', pct: 85, icon: '🔄', color: 'from-phantom-purple to-phantom-violet' },
    { name: 'Loops & Iteration', pct: 75, icon: '🔁', color: 'from-phantom-violet to-phantom-cyan' },
    { name: 'Functions & Return Scope', pct: 90, icon: '⚡', color: 'from-phantom-cyan to-phantom-teal' },
    { name: 'Array Indexing & Boundaries', pct: 42, icon: '📐', color: 'from-phantom-crimson to-phantom-amber' },
    { name: 'Exceptions & Type Coercion', pct: 70, icon: '🧬', color: 'from-phantom-amber to-phantom-teal' },
  ];

  const independentRate = profile.solvedChallengeIds.length > 0 ? 82 : 75;
  const predictionAccuracy =
    profile.predictionsCount && profile.predictionsCount > 0
      ? Math.round((profile.predictionsCorrect / profile.predictionsCount) * 100)
      : 80;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-phantom-cyan/15 border border-cyan-300 dark:border-phantom-cyan/40 text-cyan-800 dark:text-phantom-cyan text-xs font-mono font-semibold mb-2">
            <Dna className="w-3.5 h-3.5" />
            <span>Learner Forensic Profile</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">🧬 Debugging DNA</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Your unique diagnostic signature. Measures problem-solving intuition, deduction speed, boundary sensitivity, and independent resolution streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-center font-mono">
            <div className="text-[10px] text-slate-500 dark:text-white/40">Detective Rank</div>
            <div className="text-xs font-bold text-purple-700 dark:text-phantom-violet">{profile.rank || 'Logic Detective'}</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-center font-mono">
            <div className="text-[10px] text-slate-500 dark:text-white/40">Unassisted Streak</div>
            <div className="text-xs font-bold text-amber-600 dark:text-phantom-amber flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{profile.independentSolvingStreak || 2} Cases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Concept Mastery Bars (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600 dark:text-phantom-cyan" />
              <span>Deduction Mastery Spectrum</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-white/40">Real Verified Performance</span>
          </div>

          <div className="space-y-4">
            {concepts.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-white/90 flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono text-cyan-700 dark:text-phantom-cyan font-bold">{c.pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-black/50 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all duration-700`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Forensic Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-white/5 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-white/40 block">Prediction Accuracy</span>
              <span className="text-base font-bold text-teal-600 dark:text-phantom-teal">{predictionAccuracy}%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-white/40 block">Independent Rate</span>
              <span className="text-base font-bold text-cyan-700 dark:text-phantom-cyan">{independentRate}%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-white/40 block">Fastest Bug Type</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Functions</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-white/40 block">Hardest Bug Type</span>
              <span className="text-xs font-bold text-rose-600 dark:text-phantom-crimson truncate">Off-by-One</span>
            </div>
          </div>
        </div>

        {/* Right: Phantom Intelligence & Weakness Detector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Weakness Detector Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-purple-50/40 dark:from-[#1c0e25] dark:via-phantom-deep dark:to-[#09152b] border border-rose-300 dark:border-phantom-crimson/40 shadow-md dark:shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-phantom-crimson animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                ⚠️ Phantom Intelligence: Weakness Detected
              </h3>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-600 dark:text-white/60">Vulnerable Vector:</div>
              <div className="text-base font-extrabold text-rose-600 dark:text-phantom-crimson">
                Array Indexing & Boundary Conditions
              </div>
              <p className="text-slate-700 dark:text-white/70 leading-relaxed text-[11px] pt-1">
                You have struggled with boundary loops in recent challenges. The Phantom detected recurring off-by-one errors where index bounds exceed array length.
              </p>
            </div>

            {/* Prescribed Training Plan */}
            <div className="p-3 bg-white/80 dark:bg-black/50 rounded-xl border border-rose-200 dark:border-white/10 space-y-1.5 text-xs font-mono shadow-sm">
              <span className="text-amber-700 dark:text-phantom-amber text-[10px] uppercase font-bold block">
                Prescribed Case Training Plan:
              </span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-white/80 text-[11px]">
                <Target className="w-3.5 h-3.5 text-teal-600 dark:text-phantom-teal" />
                <span>2 Easy Indexing boundary cases</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-white/80 text-[11px]">
                <Target className="w-3.5 h-3.5 text-cyan-600 dark:text-phantom-cyan" />
                <span>1 Medium Loop accumulators case</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-white/80 text-[11px]">
                <Target className="w-3.5 h-3.5 text-rose-600 dark:text-phantom-crimson" />
                <span>1 Edge Case Hunter challenge</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenRecommendedCase}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-phantom-purple to-phantom-cyan text-white font-extrabold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Launch Prescribed Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detective Rank Badge Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-white/40">Progression Tier</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 dark:text-phantom-amber" />
                <span>Level {profile.level}: {profile.rank || 'Logic Detective'}</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-white/50">Next: Phantom Hunter (Level 5)</p>
            </div>

            <div className="text-right font-mono text-xs text-cyan-700 dark:text-phantom-cyan font-bold">
              <div>{profile.xp} / {profile.xpToNextLevel} XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
