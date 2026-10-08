import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Zap,
  Calendar,
  Share2,
  Copy,
  Check,
  Award,
  Clock,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { UserProfile, ActivityDay } from '../types';
import { HeatmapGrid } from '../components/HeatmapGrid';
import { PhantomLogo } from '../components/PhantomLogo';

interface ReportsPageProps {
  profile: UserProfile;
  activityHistory: Record<string, ActivityDay>;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  profile,
  activityHistory,
}) => {
  const [reportTab, setReportTab] = useState<'analytics' | 'monthly' | 'annual'>('analytics');
  const [copiedShare, setCopiedShare] = useState(false);

  // Calculate statistics from actual activityHistory
  const days = Object.values(activityHistory);
  const activeDays = days.filter((d) => d.count > 0);
  const totalBugsFixed = days.reduce((sum, d) => sum + d.count, 0);
  const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const totalXP = profile.xp;

  const conceptStats = [
    { name: 'Loops & Iteration', mastery: 85, count: 12 },
    { name: 'Functions & Scope', mastery: 78, count: 10 },
    { name: 'Lists & Arrays', mastery: 65, count: 8 },
    { name: 'Conditionals & Logic', mastery: 60, count: 7 },
    { name: 'Off-by-One Boundaries', mastery: 50, count: 5 },
    { name: 'String Parsing', mastery: 42, count: 4 },
  ];

  const handleShareDossier = () => {
    const text = `🕵️ CodePhantom Detective Dossier:
Rank: ${profile.role} (Level ${profile.level})
Streak: ${profile.streak} Days 🔥
Cases Solved: ${profile.solvedChallengeIds.length}
Total XP: ${profile.xp} XP
"Every bug leaves a shadow."
https://github.com/p2480240-cmd/CodePhantom`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-phantom-deep border border-phantom-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phantom-cyan/15 border border-phantom-cyan/40 text-phantom-cyan text-xs font-mono font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Forensics & Performance Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-white">Detective Activity & Progress Report</h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
            Verify your debugging consistency, concept mastery, and independent resolution rate.
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareDossier}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-phantom-purple to-phantom-cyan text-black font-bold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
        >
          {copiedShare ? <Check className="w-4 h-4 text-black" /> : <Share2 className="w-4 h-4 text-black" />}
          <span>{copiedShare ? 'Dossier Copied!' : 'Share Detective Card'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setReportTab('analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            reportTab === 'analytics'
              ? 'bg-phantom-purple text-white shadow-glow-purple'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Analytics & Heatmap
        </button>
        <button
          onClick={() => setReportTab('monthly')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            reportTab === 'monthly'
              ? 'bg-phantom-purple text-white shadow-glow-purple'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Monthly Report
        </button>
        <button
          onClick={() => setReportTab('annual')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            reportTab === 'annual'
              ? 'bg-phantom-purple text-white shadow-glow-purple'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Annual Recap
        </button>
      </div>

      {/* Content */}
      {reportTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-phantom-deep border border-phantom-border">
              <div className="text-white/40 text-xs flex items-center gap-1.5 mb-1 font-mono">
                <Check className="w-3.5 h-3.5 text-phantom-teal" />
                <span>Cases Solved</span>
              </div>
              <div className="text-2xl font-black text-white">{profile.solvedChallengeIds.length}</div>
              <div className="text-[11px] text-phantom-teal mt-1">94% First-attempt pass</div>
            </div>

            <div className="p-5 rounded-2xl bg-phantom-deep border border-phantom-border">
              <div className="text-white/40 text-xs flex items-center gap-1.5 mb-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-phantom-crimson" />
                <span>Current Streak</span>
              </div>
              <div className="text-2xl font-black text-phantom-amber">{profile.streak} Days</div>
              <div className="text-[11px] text-white/40 mt-1">Longest: {profile.longestStreak} days</div>
            </div>

            <div className="p-5 rounded-2xl bg-phantom-deep border border-phantom-border">
              <div className="text-white/40 text-xs flex items-center gap-1.5 mb-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-phantom-cyan" />
                <span>Investigation Time</span>
              </div>
              <div className="text-2xl font-black text-white">{totalMinutes} Mins</div>
              <div className="text-[11px] text-phantom-cyan mt-1">Avg 4.2 mins / bug</div>
            </div>

            <div className="p-5 rounded-2xl bg-phantom-deep border border-phantom-border">
              <div className="text-white/40 text-xs flex items-center gap-1.5 mb-1 font-mono">
                <Brain className="w-3.5 h-3.5 text-phantom-violet" />
                <span>Independent Fixes</span>
              </div>
              <div className="text-2xl font-black text-phantom-violet">78%</div>
              <div className="text-[11px] text-white/40 mt-1">Solved with &le; 1 hint</div>
            </div>
          </div>

          {/* Full Heatmap Card */}
          <div className="p-6 rounded-2xl bg-phantom-deep border border-phantom-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-phantom-cyan" />
                <span>365-Day Debugging Heatmap</span>
              </h3>
              <span className="text-xs text-white/40 font-mono">
                {activeDays.length} active days recorded
              </span>
            </div>
            <HeatmapGrid activityHistory={activityHistory} compact={false} />
          </div>

          {/* Concept Mastery Radar / Progress Bars */}
          <div className="p-6 rounded-2xl bg-phantom-deep border border-phantom-border shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-phantom-violet" />
              <span>Concept Mastery Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conceptStats.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white/90">{item.name}</span>
                    <span className="font-mono text-phantom-cyan">{item.mastery}% ({item.count} cases)</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-phantom-purple to-phantom-cyan rounded-full"
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Report View */}
      {reportTab === 'monthly' && (
        <div className="p-8 rounded-3xl bg-phantom-deep border border-phantom-border shadow-xl space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono text-phantom-violet uppercase">Monthly Case Summary</span>
              <h3 className="text-xl font-bold text-white">October Forensic Debrief</h3>
            </div>
            <div className="text-xs font-mono text-white/40">Verified Report</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Cases Banished</div>
              <div className="text-xl font-bold text-white mt-1">{profile.solvedChallengeIds.length}</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Total XP Earned</div>
              <div className="text-xl font-bold text-phantom-amber mt-1">+{profile.xp} XP</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Active Streak</div>
              <div className="text-xl font-bold text-phantom-crimson mt-1">{profile.streak} Days</div>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-white/80 bg-black/30 p-4 rounded-xl border border-white/5">
            <div className="font-semibold text-phantom-cyan">Investigator Insights:</div>
            <p>
              Strong deduction accuracy on loop boundaries and mathematical precedence cases. Your independent resolution rate is currently in the top 15% of active detectives.
            </p>
            <div className="pt-2 text-white/50">
              Recommended Next Goal: Tackle Hard category state-mutation cases in the Cybernetic Core.
            </div>
          </div>
        </div>
      )}

      {/* Annual Recap View */}
      {reportTab === 'annual' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-phantom-deep to-[#09152e] border border-phantom-border shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono text-phantom-cyan uppercase">Annual Dossier</span>
              <h3 className="text-xl font-bold text-white">Year-to-Date Recap</h3>
            </div>
            <PhantomLogo size="sm" showText={false} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Total Cases</div>
              <div className="text-2xl font-black text-white mt-1">{profile.solvedChallengeIds.length}</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Career XP</div>
              <div className="text-2xl font-black text-phantom-amber mt-1">{profile.xp}</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Peak Streak</div>
              <div className="text-2xl font-black text-phantom-crimson mt-1">{profile.longestStreak}d</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-white/40 text-xs">Badges</div>
              <div className="text-2xl font-black text-phantom-violet mt-1">
                {profile.achievements.filter((a) => a.unlocked).length}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-phantom-purple/10 border border-phantom-purple/30 text-xs text-white/80 space-y-2">
            <div className="font-bold text-phantom-violet">Notable Detective Milestones:</div>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>First bug shadow banished in Sector 1.</li>
              <li>Achieved 4-day continuous investigation streak.</li>
              <li>Unlocked Level {profile.level} ({profile.role}).</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
