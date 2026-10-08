import React from 'react';
import { Clock, Play, AlertCircle, CheckCircle, Lightbulb, Edit3, ShieldAlert } from 'lucide-react';
import { InvestigationEvent } from '../types';

interface InvestigationReplayProps {
  events: InvestigationEvent[];
}

export const InvestigationReplay: React.FC<InvestigationReplayProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 text-center text-xs text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/5">
        Investigation in progress... Replay timeline recording actions.
      </div>
    );
  }

  const getIcon = (type: InvestigationEvent['type']) => {
    switch (type) {
      case 'opened':
        return <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-phantom-cyan" />;
      case 'predicted':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-violet" />;
      case 'executed':
        return <Play className="w-3.5 h-3.5 text-amber-600 dark:text-phantom-amber" />;
      case 'inspected':
        return <AlertCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-phantom-cyan" />;
      case 'hint':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-phantom-amber" />;
      case 'edited':
        return <Edit3 className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-purple" />;
      case 'solved':
        return <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-phantom-teal" />;
      case 'edge_case':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-phantom-crimson" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#060a1a] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg space-y-3 font-sans transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white font-mono">
          <Clock className="w-4 h-4 text-cyan-600 dark:text-phantom-cyan" />
          <span>Investigation Replay Log</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">
          {events.length} chronological actions
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`p-2 rounded-lg border font-mono flex items-center justify-between gap-3 text-[11px] ${
              ev.status === 'success'
                ? 'bg-teal-50 dark:bg-phantom-teal/10 border-teal-200 dark:border-phantom-teal/30 text-teal-900 dark:text-white'
                : ev.status === 'failure'
                ? 'bg-rose-50 dark:bg-phantom-crimson/10 border-rose-200 dark:border-phantom-crimson/30 text-rose-900 dark:text-white'
                : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              {getIcon(ev.type)}
              <span>{ev.description}</span>
            </div>
            <span className="text-slate-500 dark:text-white/40 text-[10px] shrink-0 font-medium">{ev.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
