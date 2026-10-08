import { CheckCircle, XCircle, Terminal, AlertTriangle, ShieldCheck, AlertOctagon, Sparkles } from 'lucide-react';
import { ExecutionResult } from '../types';

interface TestResultsPanelProps {
  execution: ExecutionResult | null;
  isRunning?: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  execution,
  isRunning = false,
}) => {
  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-phantom-deep rounded-xl border border-slate-200 dark:border-phantom-border/60 text-slate-600 dark:text-white/60">
        <div className="w-8 h-8 border-2 border-cyan-500 dark:border-phantom-cyan border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-mono text-cyan-700 dark:text-phantom-cyan">Executing test suite in secure sandbox...</p>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-phantom-deep/60 rounded-xl border border-slate-200 dark:border-phantom-border/40 text-center">
        <Terminal className="w-8 h-8 text-slate-400 dark:text-white/30 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-white/50">Run or Submit code to execute tests and inspect program output.</p>
      </div>
    );
  }

  const allPassed = execution.success;

  return (
    <div className="flex flex-col gap-3">
      {/* Overall Status Banner matching the Mockup Card style */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between ${
          allPassed
            ? 'bg-teal-50 dark:bg-phantom-teal/10 border-teal-300 dark:border-phantom-teal/40 text-teal-800 dark:text-phantom-teal'
            : 'bg-rose-50 dark:bg-phantom-crimson/10 border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {allPassed ? (
            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-phantom-teal" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 dark:text-phantom-crimson" />
          )}
          <div>
            <div className="font-semibold text-sm">
              {allPassed ? 'All Tests Passed! Case Solved.' : 'Tests Failed'}
            </div>
            <div className="text-xs opacity-80 font-mono">
              {execution.passedCount} / {execution.totalCount} tests passed
            </div>
          </div>
        </div>

        {/* Execution Mode Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70">
          <ShieldCheck className="w-3 h-3 text-cyan-600 dark:text-phantom-cyan" />
          <span>{execution.executionMode}</span>
        </div>
      </div>

      {/* "Make It Worse" Regression Warning */}
      {execution.madeItWorse && !allPassed && (
        <div className="p-3 bg-red-50 dark:bg-red-950/70 border border-red-300 dark:border-red-500/70 rounded-lg text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 animate-pulse shadow-sm dark:shadow-lg">
          <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-700 dark:text-red-300 font-mono text-[11.5px] uppercase">
              ⚠️ Phantom Warning: Regression Detected ("Make It Worse")
            </div>
            <p className="text-[11px] text-red-800 dark:text-red-200/90 mt-0.5 leading-relaxed">
              {execution.regressionMessage || 'Your recent modification broke tests that were previously working or introduced a new runtime exception. Step back and reconsider your logic!'}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Detective Diagnostic Suggestion for this specific failure */}
      {(execution.dynamicFeedback || execution.diagnosticMessage) && !allPassed && (
        <div className="p-3 bg-purple-50 dark:bg-phantom-purple/20 border border-purple-200 dark:border-phantom-violet/50 rounded-lg text-xs text-slate-900 dark:text-white/90 flex items-start gap-2.5 shadow-sm dark:shadow-md">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-phantom-cyan shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <div className="font-bold text-purple-700 dark:text-phantom-cyan text-[11px] uppercase tracking-wider font-mono">
              🔍 Phantom Detective Clue:
            </div>
            <p className="text-slate-700 dark:text-white/80 text-xs leading-relaxed">
              {execution.dynamicFeedback || execution.diagnosticMessage}
            </p>
          </div>
        </div>
      )}

      {/* Syntax Error if present */}
      {execution.syntaxError && (
        <div className="p-3 bg-rose-50 dark:bg-phantom-crimson/15 border border-rose-200 dark:border-phantom-crimson/50 rounded-lg text-xs font-mono text-rose-800 dark:text-phantom-crimson flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">Execution / Syntax Error:</div>
            <div className="whitespace-pre-wrap">{execution.syntaxError}</div>
          </div>
        </div>
      )}

      {/* Individual Test Cases Grid */}
      <div className="space-y-2">
        {execution.results.map((res, idx) => (
          <div
            key={res.testId}
            className={`p-3 rounded-lg border font-mono text-xs transition-colors ${
              res.passed
                ? 'bg-teal-50/70 dark:bg-[#09151e]/80 border-teal-200 dark:border-phantom-teal/30 text-slate-800 dark:text-white/90'
                : 'bg-rose-50/70 dark:bg-[#1a0f1c]/90 border-rose-200 dark:border-phantom-crimson/40 text-slate-800 dark:text-white/90'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    res.passed ? 'bg-teal-500 dark:bg-phantom-teal' : 'bg-rose-500 dark:bg-phantom-crimson'
                  }`}
                />
                <span className="font-bold text-slate-700 dark:text-white/70">Test #{idx + 1}:</span>
                <span className="text-cyan-700 dark:text-phantom-cyan font-semibold">{res.inputDescription}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-white/40">
                {res.executionTimeMs !== undefined ? `${res.executionTimeMs}ms` : ''}
              </div>
            </div>

            {/* Expected vs Actual breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-white/5 text-[11.5px]">
              <div>
                <span className="text-slate-600 dark:text-white/50 font-medium">Expected: </span>
                <span className="text-teal-700 dark:text-phantom-teal font-semibold">
                  {JSON.stringify(res.expected)}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-white/50 font-medium">Got: </span>
                <span
                  className={
                    res.passed
                      ? 'text-teal-700 dark:text-phantom-teal font-semibold'
                      : 'text-rose-700 dark:text-phantom-crimson font-semibold'
                  }
                >
                  {JSON.stringify(res.actual)}
                </span>
              </div>
            </div>

            {res.error && (
              <div className="mt-1.5 text-rose-600 dark:text-phantom-crimson/90 text-[11px]">
                Error: {res.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Captured Console Logs if any */}
      {execution.logs && execution.logs.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-[#060814] border border-slate-200 dark:border-white/10 rounded-lg text-xs font-mono text-slate-700 dark:text-white/70">
          <div className="text-[11px] text-slate-600 dark:text-white/50 mb-1 flex items-center gap-1.5 font-medium">
            <Terminal className="w-3 h-3 text-cyan-600 dark:text-phantom-cyan" />
            <span>Captured Standard Output:</span>
          </div>
          {execution.logs.map((log, i) => (
            <div key={i} className="text-slate-800 dark:text-phantom-white/80 whitespace-pre-wrap">
              &gt; {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
