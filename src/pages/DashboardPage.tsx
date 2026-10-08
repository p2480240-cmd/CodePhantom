import React from 'react';
import {
  Flame,
  Zap,
  Crosshair,
  BookOpen,
  ArrowRight,
  Shield,
  Trophy,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Target,
} from 'lucide-react';
import { UserProfile, Challenge, ActivityDay } from '../types';
import { HeatmapGrid } from '../components/HeatmapGrid';
import { BadgeIcon } from '../components/BadgeIcon';
import { PhantomMascot } from '../components/PhantomMascot';

interface DashboardPageProps {
  profile: UserProfile;
  recommendedChallenge: Challenge;
  activityHistory: Record<string, ActivityDay>;
  onStartHunt: (challengeId?: string) => void;
  onStartLearn: (lessonId?: string) => void;
  onOpenMissions: () => void;
  onOpenAchievements: () => void;
  onClaimQuest: (questId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  recommendedChallenge,
  activityHistory,
  onStartHunt,
  onStartLearn,
  onOpenMissions,
  onOpenAchievements,
  onClaimQuest,
}) => {
  const xpCurrent = profile.xp % 500;
  const xpPercent = Math.min(100, Math.round((xpCurrent / 500) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* =========================================================================
          WELCOME HERO & STATUS BANNER
          ========================================================================= */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-cyan-50/50 dark:from-phantom-deep dark:via-[#0d1633] dark:to-phantom-deep border border-purple-200 dark:border-phantom-border/80 shadow-md dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-phantom-purple/20 border border-purple-300 dark:border-phantom-purple/40 text-purple-800 dark:text-phantom-violet text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-phantom-cyan animate-pulse" />
            <span>Detective Rank: {profile.role}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Welcome back, {profile.username}.
          </h2>
          <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed">
            The city of code is full of anomalies today. The AI has planted new suspicious logic blocks across the network.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onStartHunt(recommendedChallenge.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-phantom-purple to-phantom-cyan text-white font-bold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
            >
              <Crosshair className="w-4 h-4" />
              <span>Enter Arena</span>
            </button>
            <button
              onClick={() => onStartLearn()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-phantom-card hover:bg-slate-100 dark:hover:bg-phantom-hover border border-slate-200 dark:border-phantom-border text-slate-800 dark:text-white font-semibold text-xs transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-phantom-violet" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>

        {/* Mascot Mini View */}
        <div className="hidden md:flex items-center justify-center shrink-0 w-48 h-48 relative z-10">
          <PhantomMascot size="sm" />
        </div>
      </div>

      {/* =========================================================================
          CORE THREE QUESTIONS ROW
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: What Should I Do Next? */}
        <div className="p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-600 dark:text-phantom-cyan font-bold">
                1. What To Do Next
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet border border-purple-300 dark:border-phantom-purple/30 font-semibold">
                {recommendedChallenge.difficulty}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {recommendedChallenge.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/60 line-clamp-2 leading-relaxed">
                {recommendedChallenge.storyContext}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-white/50">
                <span>Concept:</span>
                <span className="text-cyan-700 dark:text-phantom-cyan font-semibold">{recommendedChallenge.concept}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-white/50">
                <span>Reward:</span>
                <span className="text-amber-600 dark:text-phantom-amber font-mono font-semibold">+{recommendedChallenge.xpReward} XP</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onStartHunt(recommendedChallenge.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-phantom-purple hover:bg-phantom-violet text-white font-semibold text-xs shadow-glow-purple transition-all"
            >
              <span>Investigate Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: How Am I Improving? */}
        <div className="p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-phantom-amber font-bold">
                2. How Am I Improving
              </span>
              <span className="text-xs text-amber-600 dark:text-phantom-amber font-mono flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{profile.streak} Day Streak</span>
              </span>
            </div>

            {/* Level & XP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Level {profile.level}</span>
                <span className="font-mono text-slate-500 dark:text-white/50">{xpCurrent} / 500 XP</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-phantom-purple to-phantom-cyan rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-white/40">
                {500 - xpCurrent} XP needed to reach Detective Level {profile.level + 1}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5">
                <div className="text-slate-500 dark:text-white/40 text-[10px]">Cases Solved</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{profile.solvedChallengeIds.length}</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5">
                <div className="text-slate-500 dark:text-white/40 text-[10px]">Longest Streak</div>
                <div className="text-base font-bold text-amber-600 dark:text-phantom-amber">{profile.longestStreak} days</div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onOpenMissions}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium text-xs border border-slate-200 dark:border-white/10 transition-colors"
            >
              <span>Explore Campaign Sectors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: What Can I Unlock Next? */}
        <div className="p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-phantom-teal font-bold">
                3. What To Unlock Next
              </span>
              <button
                onClick={onOpenAchievements}
                className="text-[11px] text-purple-600 dark:text-phantom-cyan hover:underline font-medium"
              >
                All Badges &rarr;
              </button>
            </div>

            {/* Badges Preview */}
            <div className="space-y-3">
              {profile.achievements.slice(0, 2).map((ach) => (
                <div
                  key={ach.id}
                  className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3"
                >
                  <BadgeIcon icon={ach.icon} unlocked={ach.unlocked} className="w-5 h-5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center justify-between">
                      <span>{ach.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">
                        {ach.progress}/{ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-phantom-cyan"
                        style={{ width: `${Math.round((ach.progress / ach.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onOpenAchievements}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-100 dark:bg-phantom-teal/15 hover:bg-teal-200 dark:hover:bg-phantom-teal/25 text-teal-800 dark:text-phantom-teal border border-teal-300 dark:border-phantom-teal/30 font-semibold text-xs transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View Badge Trophy Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DAILY QUESTS & ACTIVITY SECTION
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Quests */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-600 dark:text-phantom-cyan" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Detective Quests</h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-white/40 font-mono">Resets in 14h</span>
          </div>

          <div className="space-y-3">
            {profile.dailyQuests.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{q.title}</span>
                    <span className="text-amber-600 dark:text-phantom-amber font-mono text-[10px]">+{q.xp} XP</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-white/50">{q.description}</div>
                </div>

                <div>
                  {q.completed ? (
                    q.claimed ? (
                      <span className="text-teal-600 dark:text-phantom-teal font-mono text-[11px] flex items-center gap-1 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimQuest(q.id)}
                        className="px-3 py-1 bg-phantom-teal text-black font-bold text-[11px] rounded-lg shadow-glow-teal hover:brightness-110 transition-all"
                      >
                        Claim XP
                      </button>
                    )
                  ) : (
                    <span className="text-slate-400 dark:text-white/40 font-mono text-[11px]">
                      {q.progress}/{q.target}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Full 365-Day Activity Heatmap */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 dark:text-phantom-crimson" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Annual Activity Heatmap</h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-white/40 font-mono">365-Day Timeline</span>
          </div>

          <HeatmapGrid activityHistory={activityHistory} compact={false} />
        </div>
      </div>
    </div>
  );
};
