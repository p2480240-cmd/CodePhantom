import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, ArrowRight, RotateCcw, CheckCircle, ShieldAlert } from 'lucide-react';
import { Challenge } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  challenge: Challenge;
  hintsUsedCount: number;
  onNext: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  challenge,
  hintsUsedCount,
  onNext,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#22D3EE', '#14B8A6', '#FBBF24'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const baseXP = challenge.xpReward;
  const independentBonus = hintsUsedCount === 0 ? 50 : hintsUsedCount === 1 ? 25 : 0;
  const totalXP = baseXP + independentBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-modal-title"
        className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-teal/50 shadow-2xl text-slate-900 dark:text-white space-y-5 transition-colors"
      >
        {/* Glow Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-phantom-teal/20 border border-teal-300 dark:border-phantom-teal flex items-center justify-center text-teal-600 dark:text-phantom-teal shadow-sm dark:shadow-glow-teal">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-teal-700 dark:text-phantom-teal font-mono font-semibold">
              Mystery Solved
            </span>
            <h3 id="victory-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">Shadow Banished!</h3>
          </div>
        </div>

        {/* XP Gains Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-phantom-card border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-white/50">Experience Acquired</div>
            <div className="text-2xl font-black text-amber-600 dark:text-phantom-amber flex items-center gap-1.5 font-mono">
              <Zap className="w-6 h-6 fill-current text-amber-600 dark:text-phantom-amber" />
              <span>+{totalXP} XP</span>
            </div>
          </div>

          <div className="text-right text-xs space-y-1 font-mono text-slate-500 dark:text-white/60">
            <div>Base Reward: +{baseXP} XP</div>
            {independentBonus > 0 && (
              <div className="text-teal-700 dark:text-phantom-teal font-semibold">
                Independent Deduction: +{independentBonus} XP
              </div>
            )}
          </div>
        </div>

        {/* Concept Post-Mortem */}
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-purple-700 dark:text-phantom-violet flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            Case Debrief: {challenge.concept}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5 space-y-2">
            <div>
              <span className="text-rose-700 dark:text-phantom-crimson font-medium">The Fault: </span>
              <span className="text-slate-700 dark:text-white/80">{challenge.explanationOfBug}</span>
            </div>
            <div>
              <span className="text-teal-700 dark:text-phantom-teal font-medium">The Correction: </span>
              <span className="text-slate-700 dark:text-white/80">{challenge.explanationOfCorrection}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            aria-label="Review code without advancing"
            className="px-4 py-2 text-xs text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            Review Code
          </button>
          <button
            onClick={onNext}
            aria-label="Advance to next mystery mission"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-phantom-purple to-phantom-cyan text-black font-bold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Next Mission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
