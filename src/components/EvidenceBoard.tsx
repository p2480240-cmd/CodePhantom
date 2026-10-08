import React from 'react';
import { CheckSquare, Square, FolderCheck, Pin, ShieldCheck } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceBoardProps {
  evidence: EvidenceItem[];
  caseId: string;
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  evidence,
  caseId,
}) => {
  const completedCount = evidence.filter((e) => e.completed).length;

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#070d1e] border border-slate-200 dark:border-phantom-teal/40 shadow-sm dark:shadow-xl space-y-3 font-sans transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
            Case Evidence Board
          </h4>
        </div>
        <span className="text-[11px] font-mono text-teal-700 dark:text-phantom-teal font-semibold">
          {completedCount} / {evidence.length} Cleared
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {evidence.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded-lg border flex items-center gap-2.5 transition-all ${
              item.completed
                ? 'bg-teal-50 dark:bg-phantom-teal/10 border-teal-200 dark:border-phantom-teal/40 text-teal-950 dark:text-white'
                : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-400 dark:text-white/40'
            }`}
          >
            {item.completed ? (
              <CheckSquare className="w-4 h-4 text-teal-600 dark:text-phantom-teal shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 dark:text-white/20 shrink-0" />
            )}
            <span
              className={`text-[11.5px] leading-tight ${
                item.completed ? 'text-slate-800 dark:text-white/90 font-medium' : 'line-through text-slate-400 dark:text-white/40 opacity-70'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
