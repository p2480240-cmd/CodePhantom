import React, { useState } from 'react';
import { Lightbulb, Eye, Check, ChevronRight, Lock, HelpCircle } from 'lucide-react';
import { ProgressiveHints } from '../types';

interface ProgressiveHintsPanelProps {
  hints: ProgressiveHints;
  revealedLevel: number; // 0 = none, 1 = hint1, 2 = hint2, 3 = hint3, 4 = solution
  onRevealNext: () => void;
  onRevealSolution: () => void;
  onApplySolution?: (solutionCode: string) => void;
}

export const ProgressiveHintsPanel: React.FC<ProgressiveHintsPanelProps> = ({
  hints,
  revealedLevel,
  onRevealNext,
  onRevealSolution,
  onApplySolution,
}) => {
  const [activeTab, setActiveTab] = useState<'hints' | 'explanation'>('hints');

  const hintItems = [
    {
      level: 1,
      name: 'Spot the Shadow',
      text: hints.hint1_shadow,
    },
    {
      level: 2,
      name: 'Follow the Clue',
      text: hints.hint2_clue,
    },
    {
      level: 3,
      name: 'Narrow the Search',
      text: hints.hint3_narrow,
    },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl border border-phantom-border bg-phantom-deep shadow-xl overflow-hidden">
      {/* Tab Switcher matching the Mockup */}
      <div className="flex items-center justify-between border-b border-phantom-border/60 bg-[#070b18] px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hints')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'hints'
                ? 'bg-phantom-purple/20 text-phantom-violet border border-phantom-purple/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Hints ({Math.min(3, revealedLevel)}/3)
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'explanation'
                ? 'bg-phantom-cyan/20 text-phantom-cyan border border-phantom-cyan/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Solution & Post-Mortem
          </button>
        </div>

        <div className="text-[11px] text-phantom-amber flex items-center gap-1 font-mono">
          <span>+Bonus for 0 hints</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
        {activeTab === 'hints' ? (
          <>
            {hintItems.map((h) => {
              const isUnlocked = revealedLevel >= h.level;
              return (
                <div
                  key={h.level}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-phantom-card/90 border-phantom-cyan/30 text-phantom-white shadow-sm'
                      : 'bg-black/30 border-white/5 text-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Number Badge matching Mockup */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isUnlocked
                          ? 'bg-phantom-cyan text-black shadow-glow-cyan'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {h.level}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            isUnlocked ? 'text-phantom-cyan' : 'text-white/40'
                          }`}
                        >
                          {h.name}
                        </span>
                        {!isUnlocked && (
                          <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>

                      {isUnlocked ? (
                        <p className="text-xs text-white/90 leading-relaxed font-sans">
                          {h.text}
                        </p>
                      ) : (
                        <p className="text-xs text-white/25 italic">
                          Click below to investigate this clue...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hint Reveal Control */}
            <div className="pt-2 flex flex-col gap-2">
              {revealedLevel < 3 ? (
                <button
                  onClick={onRevealNext}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-phantom-teal/90 to-phantom-cyan/90 text-black font-semibold text-xs transition-all shadow-glow-teal hover:brightness-110 active:scale-98"
                >
                  <Lightbulb className="w-4 h-4 text-black fill-current" />
                  <span>Get Next Hint ({revealedLevel + 1}/3)</span>
                </button>
              ) : (
                <div className="text-center p-2 rounded-lg bg-phantom-teal/10 border border-phantom-teal/20 text-xs text-phantom-teal">
                  <Check className="w-3.5 h-3.5 inline mr-1" />
                  All 3 clues revealed! Still stuck? Check the Solution tab.
                </div>
              )}

              {/* Reveal Solution Button */}
              {revealedLevel < 4 && (
                <button
                  onClick={onRevealSolution}
                  className="w-full text-center py-1.5 text-xs text-white/40 hover:text-phantom-crimson transition-colors"
                >
                  Forfeit bonus and reveal verified solution
                </button>
              )}
            </div>
          </>
        ) : (
          /* Solution & Explanation Tab */
          <div className="space-y-4">
            {revealedLevel >= 4 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-phantom-purple/10 border border-phantom-purple/30 text-xs">
                  <div className="font-semibold text-phantom-violet mb-1 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Verified Reference Solution
                  </div>
                  <pre className="font-mono text-white/90 bg-black/40 p-2.5 rounded overflow-x-auto whitespace-pre my-2">
                    {hints.solution}
                  </pre>
                  {onApplySolution && (
                    <button
                      onClick={() => onApplySolution(hints.solution)}
                      className="px-3 py-1 rounded bg-phantom-purple text-white text-xs font-medium hover:bg-phantom-violet transition-colors mt-1"
                    >
                      Copy Solution to Editor
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-phantom-cyan/10 border border-phantom-cyan/30 text-xs">
                  <div className="font-semibold text-phantom-cyan mb-1">
                    Why This Fix Works:
                  </div>
                  <p className="text-white/80 leading-relaxed font-sans">
                    {hints.solutionExplanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-black/30 rounded-xl border border-white/10 space-y-3">
                <Eye className="w-8 h-8 text-white/30 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Solution is Hidden</h4>
                <p className="text-xs text-white/50 max-w-xs mx-auto">
                  Revealing the full solution forfeits the Independent Solver XP bonus for this case. Try using the clues first!
                </p>
                <button
                  onClick={onRevealSolution}
                  className="px-4 py-2 rounded-lg bg-phantom-crimson/20 border border-phantom-crimson/50 text-phantom-crimson hover:bg-phantom-crimson/30 text-xs font-semibold transition-colors"
                >
                  Reveal Solution Anyway
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
