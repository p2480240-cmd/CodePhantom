import React from 'react';
import { PhantomLogo } from './PhantomLogo';
import { Github, Shield, Terminal, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer role="contentinfo" className="w-full bg-slate-100 dark:bg-[#050813] border-t border-slate-200 dark:border-phantom-border/40 py-10 text-slate-600 dark:text-white/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhantomLogo size="sm" />
            <span className="text-xs text-slate-400 dark:text-white/40 hidden sm:inline">•</span>
            <span className="text-xs text-phantom-violet font-mono hidden sm:inline">
              Hunt What Others Cannot See.
            </span>
          </div>

          {/* Links matching Mockup Image */}
          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-white/60">
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
            <a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
            <a
              href="https://github.com/p2480240-cmd/CodePhantom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CodePhantom GitHub Repository (opens in new tab)"
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-white/40 gap-2">
          <div>
            © {new Date().getFullYear()} CodePhantom. Built for Hackathon Excellence. All bugs leave a shadow.
          </div>
        </div>
      </div>
    </footer>
  );
};
