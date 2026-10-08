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
    <div className="p-4 rounded-xl bg-[#080e22] border border-phantom-purple/40 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-phantom-violet" />
          <h4 className="text-xs font-bold text-white font-mono">
            🔮 Detective Deduction: Predict the Output
          </h4>
        </div>
        <span className="text-[10px] font-mono text-phantom-cyan">Before Running Tests</span>
      </div>

      <p className="text-xs text-white/70">
        Before you hit Run, what do you hypothesize will happen with this broken program?
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let btnStyle = 'bg-black/40 border-white/10 hover:border-phantom-purple/50 text-white/80';

          if (submitted) {
            if (opt.isCorrect) {
              btnStyle = 'bg-phantom-teal/20 border-phantom-teal/60 text-phantom-teal font-semibold';
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = 'bg-phantom-crimson/20 border-phantom-crimson/60 text-phantom-crimson';
            } else {
              btnStyle = 'bg-black/30 border-white/5 text-white/30';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={submitted}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
            >
              <div className="mt-0.5">
                {submitted ? (
                  opt.isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-phantom-teal shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-3.5 h-3.5 text-phantom-crimson shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" />
                  )
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center text-[9px] font-mono">
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
              ? 'bg-phantom-teal/10 border-phantom-teal/30 text-phantom-teal'
              : 'bg-phantom-amber/10 border-phantom-amber/30 text-phantom-amber'
          }`}
        >
          <div className="space-y-0.5 text-[11px]">
            <span className="font-bold">
              {selectedOption.isCorrect ? '🟢 Deduction Verified!' : '🟡 Hypothesis Subverted:'}
            </span>
            <p className="font-sans text-white/80">{selectedOption.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
