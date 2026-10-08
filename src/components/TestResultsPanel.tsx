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
      <div className="flex flex-col items-center justify-center p-8 bg-phantom-deep rounded-xl border border-phantom-border/60 text-white/60">
        <div className="w-8 h-8 border-2 border-phantom-cyan border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-mono text-phantom-cyan">Executing test suite in secure sandbox...</p>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="p-6 bg-phantom-deep/60 rounded-xl border border-phantom-border/40 text-center">
        <Terminal className="w-8 h-8 text-white/30 mx-auto mb-2" />
        <p className="text-sm text-white/50">Run or Submit code to execute tests and inspect program output.</p>
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
            ? 'bg-phantom-teal/10 border-phantom-teal/40 text-phantom-teal'
            : 'bg-phantom-crimson/10 border-phantom-crimson/40 text-phantom-crimson'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {allPassed ? (
            <CheckCircle className="w-5 h-5 text-phantom-teal" />
          ) : (
            <XCircle className="w-5 h-5 text-phantom-crimson" />
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
        <div className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-black/30 border border-white/10 text-white/70">
          <ShieldCheck className="w-3 h-3 text-phantom-cyan" />
          <span>{execution.executionMode}</span>
        </div>
      </div>

      {/* "Make It Worse" Regression Warning */}
      {execution.madeItWorse && !allPassed && (
        <div className="p-3 bg-red-950/70 border border-red-500/70 rounded-lg text-xs text-red-200 flex items-start gap-2.5 animate-pulse shadow-lg">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-300 font-mono text-[11.5px] uppercase">
              ⚠️ Phantom Warning: Regression Detected ("Make It Worse")
            </div>
            <p className="text-[11px] text-red-200/90 mt-0.5 leading-relaxed">
              {execution.regressionMessage || 'Your recent modification broke tests that were previously working or introduced a new runtime exception. Step back and reconsider your logic!'}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Detective Diagnostic Suggestion for this specific failure */}
      {(execution.dynamicFeedback || execution.diagnosticMessage) && !allPassed && (
        <div className="p-3 bg-phantom-purple/20 border border-phantom-violet/50 rounded-lg text-xs text-white/90 flex items-start gap-2.5 shadow-md">
          <Sparkles className="w-4 h-4 text-phantom-cyan shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <div className="font-bold text-phantom-cyan text-[11px] uppercase tracking-wider font-mono">
              🔍 Phantom Detective Clue:
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              {execution.dynamicFeedback || execution.diagnosticMessage}
            </p>
          </div>
        </div>
      )}

      {/* Syntax Error if present */}
      {execution.syntaxError && (
        <div className="p-3 bg-phantom-crimson/15 border border-phantom-crimson/50 rounded-lg text-xs font-mono text-phantom-crimson flex items-start gap-2">
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
                ? 'bg-[#09151e]/80 border-phantom-teal/30 text-white/90'
                : 'bg-[#1a0f1c]/90 border-phantom-crimson/40 text-white/90'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    res.passed ? 'bg-phantom-teal' : 'bg-phantom-crimson'
                  }`}
                />
                <span className="font-bold text-white/70">Test #{idx + 1}:</span>
                <span className="text-phantom-cyan">{res.inputDescription}</span>
              </div>
              <div className="text-[10px] text-white/40">
                {res.executionTimeMs !== undefined ? `${res.executionTimeMs}ms` : ''}
              </div>
            </div>

            {/* Expected vs Actual breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11.5px]">
              <div>
                <span className="text-white/40">Expected: </span>
                <span className="text-phantom-teal font-semibold">
                  {JSON.stringify(res.expected)}
                </span>
              </div>
              <div>
                <span className="text-white/40">Got: </span>
                <span
                  className={
                    res.passed
                      ? 'text-phantom-teal font-semibold'
                      : 'text-phantom-crimson font-semibold'
                  }
                >
                  {JSON.stringify(res.actual)}
                </span>
              </div>
            </div>

            {res.error && (
              <div className="mt-1.5 text-phantom-crimson/90 text-[11px]">
                Error: {res.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Captured Console Logs if any */}
      {execution.logs && execution.logs.length > 0 && (
        <div className="p-3 bg-[#060814] border border-white/10 rounded-lg text-xs font-mono text-white/70">
          <div className="text-[11px] text-white/40 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-phantom-cyan" />
            <span>Captured Standard Output:</span>
          </div>
          {execution.logs.map((log, i) => (
            <div key={i} className="text-phantom-white/80 whitespace-pre-wrap">
              &gt; {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
