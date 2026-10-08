import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle, ShieldAlert, X, ArrowRight } from 'lucide-react';
import { EdgeCaseTest } from '../types';

interface EdgeCaseChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  edgeCase: EdgeCaseTest;
  onVerifyEdgeCase: (code: string) => Promise<boolean>;
  currentCode: string;
  onSuccess: () => void;
}

export const EdgeCaseChallengeModal: React.FC<EdgeCaseChallengeModalProps> = ({
  isOpen,
  onClose,
  edgeCase,
  onVerifyEdgeCase,
  currentCode,
  onSuccess,
}) => {
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);
  const [passed, setPassed] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    const ok = await onVerifyEdgeCase(currentCode);
    setTesting(false);
    setTested(true);
    setPassed(ok);
    if (ok) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-phantom-deep border border-phantom-crimson/50 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-phantom-crimson animate-pulse" />
            <h3 className="text-base font-bold text-white font-mono">
              ⚠️ Another Shadow Awakens...
            </h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          The main bug is banished, but a dormant edge case lurks in the shadows! Can your code survive boundary extremes?
        </p>

        {/* Edge Case Description */}
        <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-1.5 text-xs font-mono">
          <div className="text-phantom-amber font-semibold">
            Condition: {edgeCase.description}
          </div>
          <div className="text-white/60 text-[11px]">
            Input: <span className="text-phantom-cyan">{JSON.stringify(edgeCase.inputs)}</span>
          </div>
          <div className="text-white/60 text-[11px]">
            Expected Output: <span className="text-phantom-teal">{JSON.stringify(edgeCase.expectedOutput)}</span>
          </div>
        </div>

        {tested && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              passed
                ? 'bg-phantom-teal/15 border-phantom-teal/40 text-phantom-teal'
                : 'bg-phantom-crimson/15 border-phantom-crimson/40 text-phantom-crimson'
            }`}
          >
            {passed ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-phantom-teal" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0 text-phantom-crimson" />
            )}
            <div>
              <div className="font-bold">{passed ? 'Edge Case Banished!' : 'Edge Case Triggered!'}</div>
              <div className="text-[11px] opacity-90">{edgeCase.explanation}</div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs text-white/50 hover:text-white rounded-lg border border-white/10"
          >
            Skip for now
          </button>
          {!passed ? (
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-phantom-crimson hover:bg-phantom-crimson/80 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Target className="w-3.5 h-3.5" />
              <span>{testing ? 'Testing Edge Case...' : 'Test Edge Case'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-phantom-teal text-black font-bold text-xs shadow-glow-teal hover:brightness-110 transition-all"
            >
              <span>Claim +50 XP & Badge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
