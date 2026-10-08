import React, { useRef, useEffect } from 'react';
import { RotateCcw, Play, CheckCircle2, Copy, Check } from 'lucide-react';
import { Language } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: Language;
  onReset?: () => void;
  onRun?: () => void;
  onSubmit?: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onReset,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Handle Tab key for clean code indentation (4 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const updated = code.substring(0, start) + spaces + code.substring(end);
      onChange(updated);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + spaces.length;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full rounded-xl border border-phantom-border bg-phantom-deep shadow-2xl overflow-hidden">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#070b18] border-b border-phantom-border/60 select-none">
        <div className="flex items-center gap-3">
          {/* Mac-style editor dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-phantom-crimson/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-phantom-amber/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-phantom-teal/80" />
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Active File / Language Tag */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-phantom-violet">
            <span className="px-2 py-0.5 rounded bg-phantom-purple/20 border border-phantom-purple/30">
              {language === 'python' ? 'main.py' : 'solution.js'}
            </span>
            <span className="text-white/40 text-[11px]">
              {language.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              title="Reset code to original broken state"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-phantom-teal" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Editing Area */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-sm bg-phantom-deep">
        {/* Line Numbers Gutter */}
        <div className="w-12 py-3 bg-[#080d1e] text-white/30 text-right pr-3 select-none border-r border-white/5 font-mono text-xs leading-6">
          {lines.map((_, i) => (
            <div key={i} className="hover:text-phantom-cyan transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Surface */}
        <div className="relative flex-1 h-full overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full p-3 font-mono text-[13.5px] leading-6 bg-transparent text-phantom-white resize-none outline-none focus:ring-0 selection:bg-phantom-purple/40 whitespace-pre"
            placeholder="Type your code here..."
          />
        </div>
      </div>

      {/* Editor Footer / Run & Submit Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#060914] border-t border-phantom-border/60">
        <div className="text-xs text-white/40 flex items-center gap-2">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span className="text-phantom-cyan font-mono text-[11px]">Tab = 4 spaces</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onRun && (
            <button
              onClick={onRun}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-phantom-deep border border-phantom-cyan/40 text-phantom-cyan hover:bg-phantom-cyan/10 transition-all font-medium text-xs shadow-sm hover:shadow-glow-cyan active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </button>
          )}

          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-violet text-white font-semibold text-xs transition-all shadow-glow-purple hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Fix'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
