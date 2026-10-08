import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Brain, ArrowRight } from 'lucide-react';
import { PredictionOption } from '../types';
import { StorageService } from '../services/storageService';

interface PredictionCardProps {
  predictions?: PredictionOption[];
  onPredicted?: (isCorrect: boolean) => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  predictions,
  onPredicted,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Fallback prediction options if challenge doesn't specify custom ones
  const defaultPredictions: PredictionOption[] = [
    {
      id: 'opt_fail',
      text: 'The function fails at least one boundary test case.',
      isCorrect: true,
      explanation: 'The broken logic contains an off-by-one or condition flaw that fails verification.',
    },
    {
      id: 'opt_pass',
      text: 'The code runs cleanly and passes all test cases.',
      isCorrect: false,
      explanation: 'Incorrect: The code currently has an intentional bug planted by the AI.',
    },
    {
      id: 'opt_syntax',
      text: 'A syntax error crashes the interpreter immediately.',
      isCorrect: false,
      explanation: 'Incorrect: The syntax is valid, but the runtime logic produces incorrect values.',
    },
    {
      id: 'opt_infinite',
      text: 'The program enters an infinite loop and hangs.',
      isCorrect: false,
      explanation: 'Incorrect: The function completes execution, but calculates an invalid output.',
    },
  ];

  const options = predictions && predictions.length > 0 ? predictions : defaultPredictions;

  const handleSelect = (option: PredictionOption) => {
    if (submitted) return;
    setSelectedId(option.id);
    setSubmitted(true);
    StorageService.recordPrediction(option.isCorrect);
    if (onPredicted) {
      onPredicted(option.isCorrect);
    }
  };

  const selectedOption = options.find((o) => o.id === selectedId);

  return (
    <div role="region" aria-label="Detective Deduction: Predict the Output" className="p-4 rounded-xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-phantom-purple/40 shadow-sm dark:shadow-xl space-y-3 font-sans transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600 dark:text-phantom-violet" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">
            🔮 Detective Deduction: Predict the Output
          </h4>
        </div>
        <span className="text-[10px] font-mono text-cyan-700 dark:text-phantom-cyan font-semibold">Before Running Tests</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-white/70">
        Before you hit Run, what do you hypothesize will happen with this broken program?
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let btnStyle = 'bg-slate-50 hover:bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-phantom-purple/50 text-slate-800 dark:text-white/80';

          if (submitted) {
            if (opt.isCorrect) {
              btnStyle = 'bg-teal-50 dark:bg-phantom-teal/20 border-teal-300 dark:border-phantom-teal/60 text-teal-800 dark:text-phantom-teal font-semibold';
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = 'bg-rose-50 dark:bg-phantom-crimson/20 border-rose-300 dark:border-phantom-crimson/60 text-rose-800 dark:text-phantom-crimson';
            } else {
              btnStyle = 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/40';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={submitted}
              aria-pressed={isSelected}
              aria-label={`Hypothesis: ${opt.text}`}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
            >
              <div className="mt-0.5">
                {submitted ? (
                  opt.isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-phantom-teal shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-phantom-crimson shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20" />
                  )
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-400 dark:border-white/30 flex items-center justify-center text-[9px] font-mono text-slate-600 dark:text-white/60">
                    ?
                  </div>
                )}
              </div>
              <span className="leading-snug text-[11.5px]">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {submitted && selectedOption && (
        <div
          className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2 border ${
            selectedOption.isCorrect
              ? 'bg-teal-50 dark:bg-phantom-teal/10 border-teal-300 dark:border-phantom-teal/30 text-teal-800 dark:text-phantom-teal'
              : 'bg-amber-50 dark:bg-phantom-amber/10 border-amber-300 dark:border-phantom-amber/30 text-amber-800 dark:text-phantom-amber'
          }`}
        >
          <div className="space-y-0.5 text-[11px]">
            <span className="font-bold">
              {selectedOption.isCorrect ? '🟢 Deduction Verified!' : '🟡 Hypothesis Subverted:'}
            </span>
            <p className="font-sans text-slate-700 dark:text-white/80">{selectedOption.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
