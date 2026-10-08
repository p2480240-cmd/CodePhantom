import React from 'react';
import {
  Compass,
  Lock,
  CheckCircle,
  Play,
  Zap,
  MapPin,
  Sparkles,
  ArrowRight,
  Terminal,
  Code,
} from 'lucide-react';
import { Challenge, UserProfile } from '../types';
import { CURATED_CHALLENGES } from '../services/challengeService';

interface MissionMapPageProps {
  profile: UserProfile;
  onSelectChallenge: (challengeId: string) => void;
}

export const MissionMapPage: React.FC<MissionMapPageProps> = ({
  profile,
  onSelectChallenge,
}) => {
  const zones = [
    {
      id: 'z1',
      name: 'Sector 1: The Neon Outskirts',
      desc: 'Introductory anomalies and glitched street terminals.',
      minLevel: 1,
      color: 'from-phantom-purple to-phantom-violet',
      cases: CURATED_CHALLENGES.filter((c) => c.zone === 'The Neon Outskirts'),
    },
    {
      id: 'z2',
      name: 'Sector 2: The Phantom Vault',
      desc: 'Inverted boolean locks guarding sensitive digital treasuries.',
      minLevel: 2,
      color: 'from-phantom-violet to-phantom-cyan',
      cases: CURATED_CHALLENGES.filter((c) => c.zone === 'The Phantom Vault'),
    },
    {
      id: 'z3',
      name: 'Sector 3: Cybernetic Core',
      desc: 'Orbital sensor drift and state-mutation telemetry hazards.',
      minLevel: 3,
      color: 'from-phantom-cyan to-phantom-teal',
      cases: CURATED_CHALLENGES.filter((c) => c.zone === 'Cybernetic Core'),
    },
    {
      id: 'z4',
      name: 'Sector 4: Temporal Nexus',
      desc: 'Chronological off-by-one errors warping timestamp records.',
      minLevel: 4,
      color: 'from-phantom-teal to-phantom-amber',
      cases: CURATED_CHALLENGES.filter((c) => c.zone === 'Temporal Nexus'),
    },
    {
      id: 'z5',
      name: 'Sector 5: Deep Shadow Matrix',
      desc: 'High-order edge cases and packet deduplication corruption.',
      minLevel: 5,
      color: 'from-phantom-amber to-phantom-crimson',
      cases: CURATED_CHALLENGES.filter((c) => c.zone === 'Deep Shadow Matrix'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-phantom-deep border border-phantom-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phantom-purple/20 border border-phantom-purple/40 text-phantom-violet text-xs font-mono font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Story Campaign World</span>
          </div>
          <h2 className="text-2xl font-black text-white">Detective Mission Map</h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
            Travel through the corrupt sectors of the digital metropolis. Unravel the bug cases in each zone to clear the shadow fog.
          </p>
        </div>

        <div className="text-xs font-mono text-phantom-cyan bg-black/40 px-4 py-2 rounded-xl border border-white/5">
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
                  ? 'bg-phantom-deep border-phantom-border/80 shadow-xl'
                  : 'bg-black/40 border-white/5 opacity-60'
              }`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br ${zone.color} text-black shadow-md`}
                  >
                    0{zIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{zone.name}</span>
                      {!isUnlocked && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/50 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Unlocks at Lv. {zone.minLevel}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-white/60">{zone.desc}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-white/40">
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
                          ? 'bg-[#0b1724] border-phantom-teal/40 shadow-sm'
                          : isUnlocked
                          ? 'bg-black/30 border-white/10 hover:border-phantom-cyan/50'
                          : 'bg-black/50 border-white/5'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px] font-mono uppercase text-white/50">
                            {ch.language === 'python' ? (
                              <Terminal className="w-3 h-3 text-phantom-cyan" />
                            ) : (
                              <Code className="w-3 h-3 text-phantom-violet" />
                            )}
                            <span>{ch.language}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ch.difficulty === 'easy'
                                ? 'text-phantom-teal bg-phantom-teal/10'
                                : ch.difficulty === 'medium'
                                ? 'text-phantom-amber bg-phantom-amber/10'
                                : 'text-phantom-crimson bg-phantom-crimson/10'
                            }`}
                          >
                            {ch.difficulty}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{ch.title}</span>
                          {isSolved && <CheckCircle className="w-4 h-4 text-phantom-teal" />}
                        </h4>

                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {ch.storyContext}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-3">
                        <span className="text-[11px] font-mono text-phantom-amber flex items-center gap-1 font-semibold">
                          <Zap className="w-3 h-3 fill-current" />
                          <span>+{ch.xpReward} XP</span>
                        </span>

                        <button
                          onClick={() => onSelectChallenge(ch.id)}
                          disabled={!isUnlocked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isSolved
                              ? 'bg-phantom-teal/20 text-phantom-teal hover:bg-phantom-teal/30'
                              : isUnlocked
                              ? 'bg-phantom-purple hover:bg-phantom-violet text-white shadow-glow-purple'
                              : 'bg-white/5 text-white/30 cursor-not-allowed'
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
