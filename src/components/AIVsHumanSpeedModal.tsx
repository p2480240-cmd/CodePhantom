import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Trophy, Clock, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AIVsHumanSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiBenchmarkSeconds: number; // e.g. 135 (2m 15s)
  playerSeconds: number;
  solved: boolean;
  onContinue: () => void;
}

export const AIVsHumanSpeedModal: React.FC<AIVsHumanSpeedModalProps> = ({
  isOpen,
  onClose,
  aiBenchmarkSeconds,
  playerSeconds,
  solved,
  onContinue,
}) => {
  if (!isOpen) return null;

  const playerWon = playerSeconds < aiBenchmarkSeconds;

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn font-sans">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="speed-challenge-title"
        className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-cyan/50 shadow-2xl text-slate-900 dark:text-white space-y-4 transition-colors"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-phantom-cyan" />
            <h3 id="speed-challenge-title" className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
              🤖 Speed Challenge: AI vs Human
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Speed Challenge modal"
            className="text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score comparison banner */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-white/40 block">
              Gemini AI Benchmark
            </span>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-white/80 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-slate-400 dark:text-white/40" />
              <span>{formatSec(aiBenchmarkSeconds)}</span>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              playerWon
                ? 'bg-teal-50 dark:bg-phantom-teal/20 border-teal-300 dark:border-phantom-teal text-teal-800 dark:text-phantom-teal'
                : 'bg-amber-50 dark:bg-phantom-amber/20 border-amber-300 dark:border-phantom-amber text-amber-800 dark:text-phantom-amber'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block opacity-80">
              Your Solving Time
            </span>
            <div className="text-xl font-bold font-mono flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-current" />
              <span>{formatSec(playerSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Verdict Callout */}
        <div
          className={`p-4 rounded-xl border text-center space-y-1 ${
            playerWon
              ? 'bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-phantom-purple/30 dark:to-phantom-cyan/30 border-cyan-300 dark:border-phantom-cyan shadow-sm dark:shadow-glow-cyan text-slate-900 dark:text-white'
              : 'bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70'
          }`}
        >
          <div className="text-base font-black font-mono">
            {playerWon ? '🕵️ YOU BEAT THE PHANTOM!' : '🤖 The Phantom Outpaced You!'}
          </div>
          <p className="text-xs text-slate-600 dark:text-white/80">
            {playerWon
              ? `You cracked the case ${aiBenchmarkSeconds - playerSeconds}s faster than the Gemini benchmark speed!`
              : 'The AI solved it slightly faster. Keep sharpening your pattern recognition to claim the Speed Crown!'}
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onContinue}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-phantom-purple to-phantom-cyan text-black font-extrabold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Proceed with Honor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
