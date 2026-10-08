import React from 'react';
import { Clock, Play, AlertCircle, CheckCircle, Lightbulb, Edit3, ShieldAlert } from 'lucide-react';
import { InvestigationEvent } from '../types';

interface InvestigationReplayProps {
  events: InvestigationEvent[];
}

export const InvestigationReplay: React.FC<InvestigationReplayProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-black/40 text-center text-xs text-white/40">
        Investigation in progress... Replay timeline recording actions.
      </div>
    );
  }

  const getIcon = (type: InvestigationEvent['type']) => {
    switch (type) {
      case 'opened':
        return <Clock className="w-3.5 h-3.5 text-phantom-cyan" />;
      case 'predicted':
        return <ShieldAlert className="w-3.5 h-3.5 text-phantom-violet" />;
      case 'executed':
        return <Play className="w-3.5 h-3.5 text-phantom-amber" />;
      case 'inspected':
        return <AlertCircle className="w-3.5 h-3.5 text-phantom-cyan" />;
      case 'hint':
        return <Lightbulb className="w-3.5 h-3.5 text-phantom-amber" />;
      case 'edited':
        return <Edit3 className="w-3.5 h-3.5 text-phantom-purple" />;
      case 'solved':
        return <CheckCircle className="w-3.5 h-3.5 text-phantom-teal" />;
      case 'edge_case':
        return <ShieldAlert className="w-3.5 h-3.5 text-phantom-crimson" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#060a1a] border border-white/10 shadow-lg space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
          <Clock className="w-4 h-4 text-phantom-cyan" />
          <span>Investigation Replay Log</span>
        </div>
        <span className="text-[10px] font-mono text-white/40">
          {events.length} chronological actions
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`p-2 rounded-lg border font-mono flex items-center justify-between gap-3 text-[11px] ${
              ev.status === 'success'
                ? 'bg-phantom-teal/10 border-phantom-teal/30 text-white'
                : ev.status === 'failure'
                ? 'bg-phantom-crimson/10 border-phantom-crimson/30 text-white'
                : 'bg-black/30 border-white/5 text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              {getIcon(ev.type)}
              <span>{ev.description}</span>
            </div>
            <span className="text-white/40 text-[10px] shrink-0">{ev.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
