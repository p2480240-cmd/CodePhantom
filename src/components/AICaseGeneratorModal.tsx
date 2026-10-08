import React, { useState } from 'react';
import { X, Sparkles, Terminal, Code, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language, Difficulty, Challenge } from '../types';
import { AIChallengeService } from '../services/aiChallengeService';

interface AICaseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeLoaded: (challenge: Challenge) => void;
  currentLanguage: Language;
}

export const AICaseGeneratorModal: React.FC<AICaseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onChallengeLoaded,
  currentLanguage,
}) => {
  const [lang, setLang] = useState<Language>(currentLanguage);
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('Consulting Gemini AI & verifying test suite reproducibility...');

    try {
      const res = await AIChallengeService.generateChallenge(lang, diff, topic.trim());
      setStatusMessage(res.message);
      setTimeout(() => {
        onChallengeLoaded(res.challenge);
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMessage('Error synthesizing case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-purple/50 shadow-2xl text-slate-900 dark:text-white space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-phantom-cyan" />
            <h3 className="text-lg font-bold">Synthesize AI Case File</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-white/50 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/80 block mb-1">
              Programming Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang('python')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  lang === 'python'
                    ? 'bg-purple-100 dark:bg-phantom-purple/30 border-purple-400 dark:border-phantom-cyan text-purple-950 dark:text-white font-bold'
                    : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-black/40'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Python</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('javascript')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  lang === 'javascript'
                    ? 'bg-purple-100 dark:bg-phantom-purple/30 border-purple-400 dark:border-phantom-cyan text-purple-950 dark:text-white font-bold'
                    : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-black/40'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>JavaScript</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/80 block mb-1">
              Target Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiff(d)}
                  className={`py-1.5 text-xs capitalize rounded-lg border transition-all ${
                    diff === d
                      ? 'bg-purple-100 dark:bg-phantom-purple/30 border-purple-400 dark:border-phantom-violet text-purple-950 dark:text-white font-bold'
                      : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-white/80 block mb-1">
              Mystery Scenario / Concept (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Rogue AI drone, off-by-one matrix slice, corrupted inventory"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-lg text-slate-900 dark:text-white font-mono focus:border-cyan-500 dark:focus:border-phantom-cyan outline-none"
            />
          </div>

          {statusMessage && (
            <div className="p-3 bg-cyan-50 dark:bg-black/40 rounded-lg border border-cyan-200 dark:border-phantom-cyan/30 text-xs font-mono text-cyan-800 dark:text-phantom-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-cyan-600 dark:text-phantom-cyan" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-cyan text-black shadow-glow-cyan hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{loading ? 'Synthesizing...' : 'Generate AI Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
