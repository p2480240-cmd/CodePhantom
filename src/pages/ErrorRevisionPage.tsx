import React, { useState } from 'react';
import { ShieldAlert, RotateCcw, CheckCircle, Trash2, ArrowRight, Terminal, Code, Filter, BookOpen } from 'lucide-react';
import { ErrorRevisionEntry, UserProfile } from '../types';
import { StorageService } from '../services/storageService';

interface ErrorRevisionPageProps {
  profile: UserProfile;
  onOpenCase: (challengeId: string) => void;
  onRefreshProfile: () => void;
}

export const ErrorRevisionPage: React.FC<ErrorRevisionPageProps> = ({
  profile,
  onOpenCase,
  onRefreshProfile,
}) => {
  const [filterUnresolved, setFilterUnresolved] = useState(false);
  const revisions = profile.errorRevisions || [];

  const filtered = filterUnresolved ? revisions.filter((r) => !r.reviewed) : revisions;

  const handleMarkReviewed = (id: string) => {
    StorageService.markErrorReviewed(id);
    onRefreshProfile();
  };

  const handleClearAll = () => {
    if (confirm('Clear all error revision records from your detective archive?')) {
      StorageService.clearErrorRevisions();
      const p = StorageService.getProfile();
      p.errorRevisions = [];
      StorageService.saveProfile(p);
      onRefreshProfile();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-phantom-crimson/15 border border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson text-xs font-mono font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Forensic Anomaly Log</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Error Revision Window</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Review past execution failures, diagnose the root cause of previous mistakes, and launch re-tests to cement mastery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUnresolved(!filterUnresolved)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              filterUnresolved
                ? 'bg-amber-100 dark:bg-phantom-amber/20 border-amber-300 dark:border-phantom-amber text-amber-900 dark:text-phantom-amber font-semibold'
                : 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterUnresolved ? 'Showing Unreviewed Only' : 'Show All Errors'}</span>
          </button>

          {revisions.length > 0 && (
            <button
              onClick={handleClearAll}
              aria-label="Clear all error revision records"
              className="p-2 text-slate-400 hover:text-rose-600 dark:text-white/40 dark:hover:text-phantom-crimson rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Clear error log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Revisions List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border/60 text-slate-500 dark:text-white/50 space-y-2 shadow-sm">
          <CheckCircle className="w-10 h-10 text-teal-600 dark:text-phantom-teal mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">No Unresolved Anomalies Found</h4>
          <p className="text-xs text-slate-500 dark:text-white/40 max-w-md mx-auto">
            You have either resolved all recent errors or haven't triggered any new test failures. Keep hunting in the Arena!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl border transition-all ${
                rev.reviewed
                  ? 'bg-slate-50/60 dark:bg-black/40 border-slate-200 dark:border-white/10 opacity-70'
                  : 'bg-white dark:bg-phantom-deep border-rose-300 dark:border-phantom-crimson/40 shadow-md dark:shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/5 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded uppercase bg-rose-100 dark:bg-phantom-crimson/15 text-rose-800 dark:text-phantom-crimson border border-rose-300 dark:border-phantom-crimson/30 font-bold">
                    {rev.language}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{rev.challengeTitle}</h3>
                  <span className="text-xs text-purple-700 dark:text-phantom-violet font-mono hidden sm:inline font-semibold">
                    • {rev.concept}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/40">
                  <span>{rev.timestamp}</span>
                  <span>•</span>
                  <span className="text-rose-600 dark:text-phantom-crimson font-semibold">
                    {rev.passedTests}/{rev.totalTests} tests passed
                  </span>
                </div>
              </div>

              {/* Error Explanation */}
              <div className="p-3 bg-rose-50 dark:bg-phantom-crimson/10 border border-rose-200 dark:border-phantom-crimson/25 rounded-xl text-xs font-mono text-rose-900 dark:text-phantom-crimson mb-3">
                <strong>Failure Reason: </strong> {rev.failureReason}
              </div>

              {/* Code comparison grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 dark:bg-[#050813] rounded-xl border border-slate-800 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-white/40 block mb-1">Original Buggy Fragment:</span>
                  <pre className="text-slate-300 dark:text-white/70 whitespace-pre overflow-x-auto text-[11px]">
                    {rev.buggyCode}
                  </pre>
                </div>
                <div className="p-3 bg-slate-900 dark:bg-[#0a0e22] rounded-xl border border-rose-800/40 dark:border-phantom-crimson/30">
                  <span className="text-[10px] text-rose-400 dark:text-phantom-crimson block mb-1 font-semibold">Your Attempted Fix:</span>
                  <pre className="text-slate-100 dark:text-white/90 whitespace-pre overflow-x-auto text-[11px]">
                    {rev.attemptedCode}
                  </pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-white/5 mt-3">
                <div>
                  {!rev.reviewed && (
                    <button
                      onClick={() => handleMarkReviewed(rev.id)}
                      className="text-xs text-slate-600 hover:text-teal-600 dark:text-white/50 dark:hover:text-phantom-teal flex items-center gap-1 transition-colors font-medium"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark as Understood</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onOpenCase(rev.challengeId)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-phantom-purple hover:bg-phantom-violet text-white font-bold text-xs shadow-glow-purple transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Investigate Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
