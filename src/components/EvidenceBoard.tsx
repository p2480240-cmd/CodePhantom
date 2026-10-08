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
    <div className="p-4 rounded-xl bg-[#070d1e] border border-phantom-teal/40 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-phantom-teal" />
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Case Evidence Board
          </h4>
        </div>
        <span className="text-[11px] font-mono text-phantom-teal font-semibold">
          {completedCount} / {evidence.length} Cleared
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {evidence.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded-lg border flex items-center gap-2.5 transition-all ${
              item.completed
                ? 'bg-phantom-teal/10 border-phantom-teal/40 text-white'
                : 'bg-black/30 border-white/5 text-white/40'
            }`}
          >
            {item.completed ? (
              <CheckSquare className="w-4 h-4 text-phantom-teal shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-white/20 shrink-0" />
            )}
            <span
              className={`text-[11.5px] leading-tight ${
                item.completed ? 'text-white/90 font-medium' : 'line-through opacity-50'
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
