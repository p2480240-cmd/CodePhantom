import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Cpu,
  Lightbulb,
  Trophy,
  Flame,
  Play,
  RotateCcw,
  Check,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PhantomMascot } from '../components/PhantomMascot';
import { HeatmapGrid } from '../components/HeatmapGrid';
import { UserProfile } from '../types';
import { CodeExecutionService } from '../services/codeExecutionService';
import { CURATED_CHALLENGES, ChallengeService } from '../services/challengeService';

interface LandingPageProps {
  onEnterArena: (challengeId?: string) => void;
  onExploreMissions: () => void;
  onExploreLearn: () => void;
  onOpenLeaderboard: () => void;
  onOpenReports: () => void;
  profile: UserProfile;
  activityHistory: Record<string, any>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterArena,
  onExploreMissions,
  onExploreLearn,
  onOpenLeaderboard,
  onOpenReports,
  profile,
  activityHistory,
}) => {
  // Available challenges matching current profile language
  const availableChallenges = useMemo(() => {
    const list = ChallengeService.getChallengesByLanguage(profile.selectedLanguage);
    if (list.length > 0) return list;
    return [
      ChallengeService.getChallengeForLanguage(
        CURATED_CHALLENGES[0],
        profile.selectedLanguage
      ),
    ];
  }, [profile.selectedLanguage]);

  const [heroIndex, setHeroIndex] = useState(0);

  // Active challenge safely clamped to available index
  const heroChallenge = useMemo(() => {
    return (
      availableChallenges[heroIndex % availableChallenges.length] ||
      availableChallenges[0]
    );
  }, [availableChallenges, heroIndex]);

  const [heroCode, setHeroCode] = useState(heroChallenge.brokenCode);
  const [hintStep, setHintStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'hints' | 'explanation'>('hints');
  const [running, setRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    passedCount: number;
    total: number;
    expected: any;
    got: any;
  }>({
    passed: false,
    passedCount: 1,
    total: heroChallenge.testCases.length || 3,
    expected: heroChallenge.testCases[0]?.expectedOutput ?? 20.0,
    got: 10.0,
  });

  // When active heroChallenge changes, update code, test results, and reset hints
  useEffect(() => {
    setHeroCode(heroChallenge.brokenCode);
    setHintStep(1);
    setActiveTab('hints');
    setTestResult({
      passed: false,
      passedCount: 0,
      total: heroChallenge.testCases.length || 3,
      expected: heroChallenge.testCases[0]?.expectedOutput ?? 20.0,
      got: 'Not run yet',
    });
  }, [heroChallenge]);

  const handleHeroRun = async () => {
    setRunning(true);
    const exec = await CodeExecutionService.execute(
      heroCode,
      heroChallenge.language,
      heroChallenge.entryFunction,
      heroChallenge.testCases
    );
    setRunning(false);
    setTestResult({
      passed: exec.success,
      passedCount: exec.passedCount,
      total: exec.totalCount,
      expected: exec.results[0]?.expected ?? (heroChallenge.testCases[0]?.expectedOutput ?? 20.0),
      got: exec.results[0]?.actual ?? 'Error',
    });
  };

  const handleHeroReset = () => {
    setHeroCode(heroChallenge.brokenCode);
    setTestResult({
      passed: false,
      passedCount: 0,
      total: heroChallenge.testCases.length || 3,
      expected: heroChallenge.testCases[0]?.expectedOutput ?? 20.0,
      got: 'Reset',
    });
    setHintStep(1);
  };

  const handleNextQuestion = () => {
    setHeroIndex((prev) => (prev + 1) % availableChallenges.length);
  };

  const handlePrevQuestion = () => {
    setHeroIndex((prev) => (prev - 1 + availableChallenges.length) % availableChallenges.length);
  };

  return (
    <div className="w-full space-y-16 pb-16">
      {/* =========================================================================
          HERO SECTION (Matching Mockup Layout)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-8 overflow-hidden w-full max-w-full">
        {/* Subtle cyan and violet atmospheric background glows */}
        <div className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-phantom-purple/15 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-phantom-cyan/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6 w-full">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-phantom-purple/15 border border-phantom-purple/40 text-phantom-violet text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-phantom-cyan animate-pulse" />
                <span>AI-Powered Debugging Arena</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Every bug leaves <br />
                <span className="bg-gradient-to-r from-phantom-cyan via-phantom-violet to-phantom-purple bg-clip-text text-transparent">
                  a shadow.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed max-w-xl">
                CodePhantom is an AI-powered, gamified platform where you hunt down broken code, solve real problems, and level up your programming skills.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onEnterArena(heroChallenge.id)}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-phantom-purple via-phantom-violet to-phantom-cyan text-white font-bold text-xs sm:text-sm shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Enter the Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreMissions}
                  className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-white dark:bg-phantom-deep hover:bg-slate-100 dark:hover:bg-phantom-hover border border-slate-200 dark:border-phantom-border text-slate-800 dark:text-white font-semibold text-xs sm:text-sm transition-all shadow-sm dark:shadow-none"
                >
                  <Compass className="w-4 h-4 text-phantom-cyan" />
                  <span>Explore Missions</span>
                </button>
              </div>

              {/* Small Feature Indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2 sm:pt-3 text-xs text-slate-700 dark:text-white/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-phantom-teal shrink-0" />
                  <span>AI-Generated Challenges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-phantom-teal shrink-0" />
                  <span>Gamified Learning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-phantom-teal shrink-0" />
                  <span>Build Real Skills</span>
                </div>
              </div>
            </div>

            {/* Right Column: Phantom Mascot + Live Interactive Hero Code Panel */}
            <div className="lg:col-span-7 relative flex flex-col md:flex-row items-center gap-6 md:gap-4 w-full max-w-full">
              {/* Mascot Detective SVG */}
              <div className="w-full md:w-5/12 flex justify-center max-w-[260px] sm:max-w-[320px] md:max-w-none mx-auto">
                <PhantomMascot size="hero" />
              </div>

              {/* Interactive Coding Sandbox Preview (Matching Mockup Screen) */}
              <div className="w-full md:w-7/12 rounded-2xl bg-white dark:bg-[#090e1f] border border-slate-200 dark:border-phantom-border/80 shadow-2xl overflow-hidden flex flex-col font-sans transition-colors w-full max-w-full">
                {/* Header bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 dark:bg-[#050813] border-b border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet font-mono text-[11px] font-semibold border border-purple-200 dark:border-phantom-purple/30 uppercase">
                      {heroChallenge.language}
                    </span>
                    <span className="text-slate-600 dark:text-white/60 font-medium">
                      Level {heroChallenge.difficulty === 'hard' ? 3 : heroChallenge.difficulty === 'medium' ? 2 : 1}
                    </span>
                    <span className="text-slate-400 dark:text-white/30">•</span>
                    <span className="text-amber-600 dark:text-phantom-amber font-medium capitalize">
                      {heroChallenge.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Case Switcher Navigation */}
                    <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-white/5 rounded-md px-1.5 py-0.5 border border-slate-300/60 dark:border-white/10">
                      <button
                        onClick={handlePrevQuestion}
                        title="Previous Question"
                        aria-label="Previous Question"
                        className="p-0.5 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/10 rounded transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-white/80 px-1">
                        Case {heroIndex + 1}/{availableChallenges.length}
                      </span>
                      <button
                        onClick={handleNextQuestion}
                        title="Next Question"
                        aria-label="Next Question"
                        className="p-0.5 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-white/10 rounded transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-700 dark:text-phantom-cyan font-bold">
                      <span>XP {heroChallenge.xpReward || 100}</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Title & Concept Strip */}
                <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-white/90 truncate">
                    {heroChallenge.title}
                  </span>
                  <span className="text-slate-500 dark:text-white/40 text-[10px] font-mono shrink-0 ml-2">
                    {heroChallenge.concept}
                  </span>
                </div>

                {/* Editor Content Area */}
                <div className="p-3 bg-white dark:bg-[#080d1e] font-mono text-xs leading-5 relative">
                  <textarea
                    id="hero-code-editor"
                    aria-label="Interactive mystery code editor"
                    value={heroCode}
                    onChange={(e) => setHeroCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-32 bg-transparent text-slate-900 dark:text-phantom-white resize-none outline-none font-mono text-xs whitespace-pre selection:bg-purple-200 dark:selection:bg-phantom-purple/40"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-white/5">
                    <button
                      onClick={handleHeroReset}
                      aria-label="Reset hero challenge code"
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleHeroRun}
                        aria-label="Execute code and verify test fix"
                        disabled={running}
                        className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 dark:bg-phantom-purple dark:hover:bg-phantom-violet text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{running ? 'Running...' : 'Run Fix'}</span>
                      </button>
                      {testResult.passed && (
                        <button
                          onClick={handleNextQuestion}
                          aria-label="Load next mystery question"
                          className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 dark:bg-phantom-teal dark:text-black dark:hover:bg-teal-300 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm hover:scale-105"
                          title="Load next challenge"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tests Failed / Passed Box (Matching Mockup) */}
                <div
                  className={`mx-3 my-2 p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-mono transition-colors ${
                    testResult.passed
                      ? 'bg-teal-50 dark:bg-phantom-teal/15 border-teal-300 dark:border-phantom-teal/40 text-teal-800 dark:text-phantom-teal'
                      : 'bg-rose-50 dark:bg-phantom-crimson/15 border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.passed ? (
                      <Check className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-phantom-crimson" />
                    )}
                    <span className="font-bold">
                      {testResult.passed ? `Tests Passed! (${testResult.passedCount}/${testResult.total})` : 'Tests Failed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-[11px] opacity-90">
                      <span>Expected: {String(testResult.expected)}</span>
                      <span className="mx-1.5 opacity-40">|</span>
                      <span>Got: {String(testResult.got)}</span>
                    </div>
                    {testResult.passed && (
                      <button
                        onClick={handleNextQuestion}
                        aria-label="Proceed to the next question"
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-phantom-teal dark:text-black dark:hover:bg-teal-300 text-white font-sans font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 animate-pulse"
                        title="Proceed to the next question"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hints / Clues Interactive Card */}
                <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-100/90 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs transition-colors">
                  {testResult.passed && (
                    <div className="mb-2.5 p-2 rounded-lg bg-teal-100/80 dark:bg-phantom-teal/20 border border-teal-300 dark:border-phantom-teal/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-teal-900 dark:text-phantom-teal font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-phantom-teal shrink-0 animate-bounce" />
                        <span>Case solved! Ready for the next case?</span>
                      </div>
                      <button
                        onClick={handleNextQuestion}
                        aria-label="Load next challenge question"
                        className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-phantom-teal dark:text-black font-bold text-[11px] flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('hints')}
                        className={`text-[11px] font-semibold transition-colors ${
                          activeTab === 'hints'
                            ? 'text-cyan-700 dark:text-phantom-cyan font-bold'
                            : 'text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        Hints
                      </button>
                      <span className="text-slate-300 dark:text-white/20">|</span>
                      <button
                        onClick={() => setActiveTab('explanation')}
                        className={`text-[11px] font-semibold transition-colors ${
                          activeTab === 'explanation'
                            ? 'text-cyan-700 dark:text-phantom-cyan font-bold'
                            : 'text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        Explanation
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-white/40 font-mono">
                      Clue #{hintStep} of 3
                    </span>
                  </div>

                  {activeTab === 'hints' ? (
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-start gap-2 text-slate-800 dark:text-white/90">
                        <span className="w-4 h-4 rounded-full bg-cyan-600 dark:bg-phantom-cyan text-white dark:text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          1
                        </span>
                        <span className="leading-relaxed font-medium">{heroChallenge.hints.hint1_shadow}</span>
                      </div>
                      {hintStep >= 2 && (
                        <div className="flex items-start gap-2 text-slate-800 dark:text-white/90">
                          <span className="w-4 h-4 rounded-full bg-cyan-600 dark:bg-phantom-cyan text-white dark:text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            2
                          </span>
                          <span className="leading-relaxed font-medium">{heroChallenge.hints.hint2_clue}</span>
                        </div>
                      )}
                      {hintStep >= 3 && (
                        <div className="flex items-start gap-2 text-slate-800 dark:text-white/90">
                          <span className="w-4 h-4 rounded-full bg-cyan-600 dark:bg-phantom-cyan text-white dark:text-black font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            3
                          </span>
                          <span className="leading-relaxed font-medium">{heroChallenge.hints.hint3_narrow}</span>
                        </div>
                      )}

                      <div className="pt-2">
                        {hintStep < 3 ? (
                          <button
                            onClick={() => setHintStep(hintStep + 1)}
                            className="w-full py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 dark:bg-phantom-teal/90 text-white dark:text-black font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Get Next Hint</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setHeroCode(heroChallenge.hints.solution);
                              handleHeroRun();
                            }}
                            className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-phantom-purple text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto-Apply Fix & Verify</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-700 dark:text-white/80 leading-relaxed space-y-2 font-medium">
                      <p>{heroChallenge.hints.solutionExplanation || heroChallenge.explanationOfBug}</p>
                      <button
                        onClick={() => {
                          setHeroCode(heroChallenge.hints.solution);
                          handleHeroRun();
                        }}
                        className="w-full mt-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-phantom-purple text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply Solution Code</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUR INTERACTIVE FEATURE CARDS (Matching Mockup Feature Section)
          ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div
            onClick={() => onEnterArena()}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-phantom-deep hover:bg-slate-50 dark:hover:bg-[#0f1730] border border-slate-200 dark:border-phantom-border hover:border-phantom-purple transition-all duration-300 shadow-md dark:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-phantom-purple/20 border border-phantom-purple/40 text-phantom-violet flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">AI-Generated Cases</h3>
              <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                Fresh, creative challenges generated by AI — or hand-picked missions when AI isn't available.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-phantom-violet font-semibold group-hover:text-phantom-cyan transition-colors">
              <span>Enter Arena</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div
            onClick={onExploreLearn}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-phantom-deep hover:bg-slate-50 dark:hover:bg-[#0f1730] border border-slate-200 dark:border-phantom-border hover:border-phantom-cyan transition-all duration-300 shadow-md dark:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-phantom-cyan/20 border border-phantom-cyan/40 text-phantom-cyan flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Progressive Clues</h3>
              <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                Get helpful hints that guide your thinking without giving away the answer.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-phantom-cyan font-semibold group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div
            onClick={onOpenReports}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-phantom-deep hover:bg-slate-50 dark:hover:bg-[#0f1730] border border-slate-200 dark:border-phantom-border hover:border-phantom-amber transition-all duration-300 shadow-md dark:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-phantom-amber/20 border border-phantom-amber/40 text-phantom-amber flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Earn XP & Badges</h3>
              <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                Solve challenges, unlock achievements, level up and show off your progress.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-amber-600 dark:text-phantom-amber font-semibold group-hover:text-amber-700 dark:group-hover:text-white transition-colors">
              <span>View Badges</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div
            onClick={onOpenReports}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-phantom-deep hover:bg-slate-50 dark:hover:bg-[#0f1730] border border-slate-200 dark:border-phantom-border hover:border-phantom-crimson transition-all duration-300 shadow-md dark:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-phantom-crimson/20 border border-phantom-crimson/40 text-phantom-crimson flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Track Your Streak</h3>
              <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
                Build your daily streak, view your activity heatmap and watch your growth over time.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-rose-600 dark:text-phantom-crimson font-semibold group-hover:text-rose-700 dark:group-hover:text-white transition-colors">
              <span>Inspect Streak</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM SHOWCASE ROW (Matching Mockup: Leaderboard, Heatmap, Concepts, Quote)
          ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Top Learners This Week */}
          <div className="p-5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Top Learners This Week</h4>
                <button
                  onClick={onOpenLeaderboard}
                  className="text-[11px] text-purple-600 dark:text-phantom-cyan hover:underline font-medium"
                >
                  View Leaderboard &rarr;
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { rank: 1, name: 'NovaCoder', level: 12, xp: '12,450 XP', avatar: '⚡' },
                  { rank: 2, name: 'ByteDreamer', level: 11, xp: '10,320 XP', avatar: '🌙' },
                  { rank: 3, name: 'CodePhantom (You)', level: profile.level, xp: `${profile.xp.toLocaleString()} XP`, avatar: '👁️', active: true },
                  { rank: 4, name: 'LogicLover', level: 7, xp: '6,910 XP', avatar: '🔮' },
                  { rank: 5, name: 'PixelPioneer', level: 6, xp: '5,420 XP', avatar: '🎮' },
                ].map((u) => (
                  <div
                    key={u.rank}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
                      u.active
                        ? 'bg-purple-100/80 dark:bg-phantom-purple/20 border border-purple-300 dark:border-phantom-purple/40 text-purple-950 dark:text-white font-bold'
                        : 'text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 dark:text-white/40 text-[11px] w-3">{u.rank}</span>
                      <span className="text-sm">{u.avatar}</span>
                      <span className="truncate max-w-[85px] text-slate-900 dark:text-white/90">{u.name}</span>
                    </div>
                    <div className="text-right text-[11px] font-mono">
                      <span className="text-slate-500 dark:text-white/40 mr-1.5">Lv. {u.level}</span>
                      <span className="text-amber-600 dark:text-phantom-amber font-semibold">{u.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-white/40">Your Standing</span>
              <span className="text-amber-600 dark:text-phantom-amber font-bold">Rank #3</span>
            </div>
          </div>

          {/* 2. Activity Heatmap */}
          <div className="p-5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Activity Heatmap</h4>
                <button
                  onClick={onOpenReports}
                  className="text-[11px] text-purple-600 dark:text-phantom-cyan hover:underline font-medium"
                >
                  Full Report &rarr;
                </button>
              </div>
              <HeatmapGrid activityHistory={activityHistory} compact={true} />
            </div>

            <div className="pt-3 mt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-white/40">Total Solved</span>
              <span className="text-purple-700 dark:text-phantom-cyan font-bold">{profile.solvedChallengeIds.length} Cases</span>
            </div>
          </div>

          {/* 3. Popular Concepts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Popular Concepts</h4>
                <span className="text-[11px] text-slate-400 dark:text-white/40 font-mono">Mastery</span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Loops', pct: 82, color: 'bg-phantom-purple' },
                  { name: 'Functions', pct: 68, color: 'bg-phantom-violet' },
                  { name: 'Lists & Arrays', pct: 55, color: 'bg-phantom-cyan' },
                  { name: 'Conditions', pct: 47, color: 'bg-phantom-teal' },
                  { name: 'Strings', pct: 38, color: 'bg-phantom-amber' },
                ].map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-slate-800 dark:text-white/80 font-medium">
                      <span>{c.name}</span>
                      <span className="font-mono text-slate-500 dark:text-white/40">{c.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${c.color} rounded-full`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-white/40">Top Focus</span>
              <span className="text-cyan-700 dark:text-phantom-cyan font-bold">Loops (82%)</span>
            </div>
          </div>

          {/* 4. Atmospheric Quote Card with Powerful Code Matrix Background */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white dark:from-[#130b30] dark:via-[#0b122c] dark:to-[#050917] border border-purple-200 dark:border-phantom-purple/40 shadow-md dark:shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* High-Tech Code Circuit / Binary Matrix Background Art */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25 group-hover:opacity-30 dark:group-hover:opacity-35 transition-opacity duration-500 overflow-hidden select-none">
              <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="codeGradQuote" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                  <pattern id="matrixGridQuote" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-white/10" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#matrixGridQuote)" />
                {/* Code Traces & Circuit Lines */}
                <path d="M10 80 H 120 L 160 120 H 320" stroke="url(#codeGradQuote)" strokeWidth="1.5" strokeDasharray="6 4" />
                <path d="M40 220 H 180 L 220 180 H 380" stroke="url(#codeGradQuote)" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="160" cy="120" r="3.5" fill="#06b6d4" />
                <circle cx="220" cy="180" r="3.5" fill="#8b5cf6" />
                {/* Background Code Snippets & Symbols */}
                <text x="20" y="45" fill="#0891b2" fontSize="11" fontFamily="monospace" opacity="0.7">&lt;code&gt; while (bug.alive) &#123;</text>
                <text x="45" y="65" fill="#7c3aed" fontSize="10" fontFamily="monospace" opacity="0.6">hunt.revealShadow();</text>
                <text x="20" y="160" fill="#7c3aed" fontSize="10" fontFamily="monospace" opacity="0.5">const truth = solve();</text>
                <text x="230" y="240" fill="#059669" fontSize="10" fontFamily="monospace" opacity="0.6">&lt;/matrix&gt; 010110</text>
                <text x="260" y="70" fill="#0891b2" fontSize="20" fontFamily="monospace" opacity="0.4">&#123; ... &#125;</text>
                <text x="310" y="140" fill="#db2777" fontSize="14" fontFamily="monospace" opacity="0.4">λ =&gt; bug</text>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#060914] via-transparent to-transparent" />
            </div>

            {/* Subtle floating glow in card */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan-200/30 dark:bg-phantom-cyan/25 rounded-full filter blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-200/30 dark:bg-phantom-purple/20 rounded-full filter blur-2xl" />

            <div className="relative z-10 space-y-3">
              <span className="text-3xl text-purple-600 dark:text-phantom-violet font-serif block">“</span>
              <p className="text-base font-semibold text-slate-900 dark:text-white/95 leading-snug tracking-wide">
                Not just coding, but a journey of discovery.
              </p>
              <div className="text-xs text-purple-700 dark:text-phantom-cyan font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-phantom-cyan animate-pulse" />
                <span>— CodePhantom Arena</span>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-white/50 font-mono">Ready to investigate?</span>
              <button
                onClick={() => onEnterArena(heroChallenge.id)}
                className="px-3.5 py-1.5 rounded-lg bg-phantom-purple hover:bg-phantom-violet text-white text-xs font-semibold shadow-glow-purple transition-all active:scale-95"
              >
                Join Hunt
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-50 via-slate-50 to-cyan-50 dark:from-phantom-deep dark:via-[#111936] dark:to-phantom-deep border border-purple-200 dark:border-phantom-border/80 shadow-md dark:shadow-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            The next bug won't find itself.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-white/70 max-w-lg mx-auto">
            Choose your language, accept your first case file, and uncover the flaw hidden in the logic.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onEnterArena(heroChallenge.id)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-phantom-purple via-phantom-violet to-phantom-cyan text-white font-extrabold text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Start Your Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
