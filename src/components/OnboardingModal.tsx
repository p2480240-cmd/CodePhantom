import React, { useState } from 'react';
import { Terminal, Code, BookOpen, Crosshair, ArrowRight, Check, Sparkles } from 'lucide-react';
import { UserProfile, Language, Difficulty } from '../types';
import { StorageService } from '../services/storageService';
import { PhantomLogo } from './PhantomLogo';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updated: UserProfile) => void;
  profile: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  profile,
}) => {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>(profile.selectedLanguage);
  const [mode, setMode] = useState<'learn' | 'hunt'>(profile.selectedMode);
  const [diff, setDiff] = useState<Difficulty>('easy');
  const [alias, setAlias] = useState(profile.username);

  if (!isOpen) return null;

  const handleFinish = () => {
    const updated: UserProfile = {
      ...profile,
      selectedLanguage: lang,
      selectedMode: mode,
      username: alias.trim() || 'CodePhantom Detective',
    };
    StorageService.saveProfile(updated);
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-8 rounded-2xl bg-phantom-deep border border-phantom-border/80 shadow-2xl text-white space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-phantom-cyan animate-ping" />
            <span className="text-phantom-cyan uppercase tracking-wider">Detective Induction Protocol</span>
          </div>
          <span>Step {step} of 4</span>
        </div>

        {/* Step 1: Welcome & Persona */}
        {step === 1 && (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center">
              <PhantomLogo size="lg" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              “Every bug leaves a shadow.”
            </h2>
            <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
              Welcome, investigator. In CodePhantom, the AI creates the mysteries, and you hunt them down. Choose your callsign to enter the arena.
            </p>
            <div className="max-w-xs mx-auto pt-2">
              <label className="text-xs text-white/60 block text-left mb-1 font-mono">
                Detective Callsign:
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black/40 border border-white/20 rounded-lg text-white font-mono focus:border-phantom-cyan outline-none text-center"
                placeholder="e.g. ShadowHunter"
              />
            </div>
          </div>
        )}

        {/* Step 2: Language Preference */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold">Choose Your Primary Language</h3>
              <p className="text-xs text-white/60 mt-1">
                You can change this at any time in the arena header.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setLang('python')}
                className={`p-5 rounded-xl border text-left transition-all ${
                  lang === 'python'
                    ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Terminal className="w-6 h-6 text-phantom-cyan" />
                  {lang === 'python' && <Check className="w-4 h-4 text-phantom-cyan" />}
                </div>
                <div className="font-bold text-white text-base">Python</div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Clean syntax, algorithmic deductions, lists, dictionaries, off-by-one loops.
                </p>
              </button>

              <button
                onClick={() => setLang('javascript')}
                className={`p-5 rounded-xl border text-left transition-all ${
                  lang === 'javascript'
                    ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Code className="w-6 h-6 text-phantom-violet" />
                  {lang === 'javascript' && <Check className="w-4 h-4 text-phantom-violet" />}
                </div>
                <div className="font-bold text-white text-base">JavaScript</div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Dynamic types, truthy/falsy evaluation, object mutations, scoping gotchas.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Learning Mode Preference */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold">Choose Your Learning Style</h3>
              <p className="text-xs text-white/60 mt-1">
                Both modes earn XP and build your streak.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setMode('hunt')}
                className={`p-5 rounded-xl border text-left transition-all ${
                  mode === 'hunt'
                    ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Crosshair className="w-6 h-6 text-phantom-cyan" />
                  {mode === 'hunt' && <Check className="w-4 h-4 text-phantom-cyan" />}
                </div>
                <div className="font-bold text-white text-base">Hunt Mode (Arena)</div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Direct mission workspace with code editor, test suites, progressive hints, and case files.
                </p>
              </button>

              <button
                onClick={() => setMode('learn')}
                className={`p-5 rounded-xl border text-left transition-all ${
                  mode === 'learn'
                    ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-6 h-6 text-phantom-violet" />
                  {mode === 'learn' && <Check className="w-4 h-4 text-phantom-violet" />}
                </div>
                <div className="font-bold text-white text-base">Learn Mode (Guided)</div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Interactive guided micro-lessons that explain why bugs happen step by step.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Starting Difficulty */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold">Select Starting Difficulty</h3>
              <p className="text-xs text-white/60 mt-1">
                The arena automatically adapts to your performance.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    diff === d
                      ? 'bg-phantom-purple/25 border-phantom-cyan shadow-glow-cyan'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold capitalize text-white text-sm mb-1">{d}</div>
                  <div className="text-[11px] text-white/50">
                    {d === 'easy' ? 'Clear logic bugs' : d === 'medium' ? 'Boundary & state errors' : 'Complex edge-cases'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg border border-white/10"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-phantom-purple hover:bg-phantom-violet text-white font-semibold text-xs transition-all shadow-glow-purple"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-phantom-cyan to-phantom-teal text-black font-bold text-xs transition-all shadow-glow-cyan hover:brightness-110"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter The Arena</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
