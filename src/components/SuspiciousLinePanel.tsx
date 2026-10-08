import React from 'react';
import { AlertCircle, HelpCircle, Lightbulb, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SuspiciousLineAnalysis } from '../types';

interface SuspiciousLinePanelProps {
  analysis: SuspiciousLineAnalysis | null;
  onClose: () => void;
}

export const SuspiciousLinePanel: React.FC<SuspiciousLinePanelProps> = ({
  analysis,
  onClose,
}) => {
  if (!analysis) return null;

  return (
    <div className="p-4 rounded-xl bg-[#090f23] border border-phantom-cyan/40 shadow-xl space-y-3 font-sans animate-fadeIn">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-phantom-cyan/20 border border-phantom-cyan/40 flex items-center justify-center text-phantom-cyan">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <span>🔍 Phantom Forensic Analysis</span>
              <span className="text-phantom-cyan text-[11px]">(Line {analysis.lineNumber})</span>
            </h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Code Snippet */}
      <div className="p-2 rounded bg-black/60 border border-white/10 font-mono text-xs text-phantom-violet whitespace-pre overflow-x-auto">
        Line {analysis.lineNumber}: {analysis.codeSnippet}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-phantom-amber font-semibold block">
            Potential Anomaly
          </span>
          <p className="text-white/80 leading-relaxed text-[11px]">
            {analysis.potentialIssue}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-phantom-cyan font-semibold block">
            Why Suspicious
          </span>
          <p className="text-white/80 leading-relaxed text-[11px]">
            {analysis.whySuspicious}
          </p>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-phantom-purple/10 border border-phantom-purple/20 text-xs flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-phantom-violet shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-[11px]">
          <span className="font-semibold text-phantom-violet">Detective Advice: </span>
          <span className="text-white/80">{analysis.detectiveAdvice}</span>
        </div>
      </div>
    </div>
  );
};
