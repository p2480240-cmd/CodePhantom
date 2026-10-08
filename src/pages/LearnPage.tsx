import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  XCircle,
  Brain,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Filter,
} from 'lucide-react';
import { LearnLesson, UserProfile, Language } from '../types';
import { LEARN_LESSONS, LEARN_CHAPTERS } from '../services/learnService';
import { CodeExecutionService } from '../services/codeExecutionService';
import { StorageService } from '../services/storageService';

interface LearnPageProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSwitchToHunt: (challengeId?: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  profile,
  onUpdateProfile,
  onSwitchToHunt,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language | 'all'>(profile.selectedLanguage || 'all');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Filter lessons based on active language and chapter selection
  const filteredLessons = useMemo(() => {
    return LEARN_LESSONS.filter((l) => {
      const matchLang = selectedLang === 'all' || l.language === selectedLang;
      const matchChapter = selectedChapter === 'all' || l.chapterNumber === selectedChapter;
      return matchLang && matchChapter;
    });
  }, [selectedLang, selectedChapter]);

  const [selectedLesson, setSelectedLesson] = useState<LearnLesson>(() => {
    const matching = LEARN_LESSONS.find((l) => l.language === profile.selectedLanguage);
    return matching || LEARN_LESSONS[0];
  });
  const [code, setCode] = useState<string>(selectedLesson.brokenCode);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // Synchronize when profile language updates
  useEffect(() => {
    if (profile.selectedLanguage) {
      setSelectedLang(profile.selectedLanguage);
      const matching = LEARN_LESSONS.find((l) => l.language === profile.selectedLanguage);
      if (matching) {
        setSelectedLesson(matching);
        setCode(matching.brokenCode);
        setEvalResult(null);
        setSelectedPrediction(null);
        setShowPredictionResult(false);
        setShowStepHint(false);
      }
    }
  }, [profile.selectedLanguage]);

  const [evalResult, setEvalResult] = useState<{
    success: boolean;
    passedCount: number;
    total: number;
    message: string;
  } | null>(null);

  // Interactive prediction state
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [showPredictionResult, setShowPredictionResult] = useState<boolean>(false);
  const [showStepHint, setShowStepHint] = useState<boolean>(false);

  const handleSelectLesson = (lesson: LearnLesson) => {
    setSelectedLesson(lesson);
    setCode(lesson.brokenCode);
    setEvalResult(null);
    setSelectedPrediction(null);
    setShowPredictionResult(false);
    setShowStepHint(false);
    setMobileMenuOpen(false);
  };

  // Next / Previous lesson navigation
  const currentIndex = filteredLessons.findIndex((l) => l.id === selectedLesson.id);
  const hasNext = currentIndex < filteredLessons.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNextLesson = () => {
    if (hasNext) {
      handleSelectLesson(filteredLessons[currentIndex + 1]);
    } else if (filteredLessons.length > 0) {
      handleSelectLesson(filteredLessons[0]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      handleSelectLesson(filteredLessons[currentIndex - 1]);
    } else if (filteredLessons.length > 0) {
      handleSelectLesson(filteredLessons[filteredLessons.length - 1]);
    }
  };

  const handlePredictionAnswer = (optionId: string, isCorrect: boolean) => {
    setSelectedPrediction(optionId);
    setShowPredictionResult(true);
    StorageService.recordPrediction(isCorrect);
  };

  const handleTestLessonCode = async () => {
    setEvaluating(true);
    const exec = await CodeExecutionService.execute(
      code,
      selectedLesson.language,
      selectedLesson.entryFunction,
      selectedLesson.testCases
    );
    setEvaluating(false);

    if (exec.success) {
      setEvalResult({
        success: true,
        passedCount: exec.passedCount,
        total: exec.totalCount,
        message: 'Flaw corrected! Concept mastered.',
      });

      // Record XP and completion
      StorageService.recordActivity(selectedLesson.id, selectedLesson.xp, selectedLesson.concept, 3);
      const updated = StorageService.getProfile();
      if (!updated.completedLessons.includes(selectedLesson.id)) {
        updated.completedLessons.push(selectedLesson.id);
        StorageService.saveProfile(updated);
      }
      onUpdateProfile(updated);
    } else {
      setEvalResult({
        success: false,
        passedCount: exec.passedCount,
        total: exec.totalCount,
        message: exec.syntaxError || 'The logic still contains a bug. Check the prediction clue or step-by-step hint!',
      });
    }
  };

  const isCompleted = profile.completedLessons.includes(selectedLesson.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-phantom-purple/20 border border-purple-300 dark:border-phantom-purple/40 text-purple-800 dark:text-phantom-violet text-xs font-mono font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Forensic Micro-Lessons</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Learn Mode: No Boring Lectures</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Predict the failure hypothesis, edit the snippet directly in place, and master core programming principles without sitting through 40-minute theory videos.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 dark:text-white/50 bg-slate-50 dark:bg-black/40 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 font-medium shrink-0">
          Progress: {profile.completedLessons.length} / {LEARN_LESSONS.length} concepts mastered
        </div>
      </div>

      {/* Chapters & Language Filter Chips */}
      <div className="space-y-3">
        {/* Chapters Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-xs text-slate-500 dark:text-white/40 font-mono shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Chapters:</span>
          </span>
          <button
            onClick={() => setSelectedChapter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              selectedChapter === 'all'
                ? 'bg-purple-600 dark:bg-phantom-purple text-white font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-white/60 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            All Chapters ({LEARN_CHAPTERS.length})
          </button>
          {LEARN_CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(ch.chapterNumber)}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedChapter === ch.chapterNumber
                  ? 'bg-purple-600 dark:bg-phantom-purple text-white font-bold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-white/60 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              Ch. {ch.chapterNumber}: {ch.title.split(':')[1]?.trim() || ch.title}
            </button>
          ))}
        </div>

        {/* Language Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-xs text-slate-500 dark:text-white/40 font-mono shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Language:</span>
          </span>
          {(['all', 'python', 'javascript', 'typescript', 'cpp', 'java'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLang(lang);
                const list = LEARN_LESSONS.filter(
                  (l) => (lang === 'all' || l.language === lang) && (selectedChapter === 'all' || l.chapterNumber === selectedChapter)
                );
                if (list.length > 0) handleSelectLesson(list[0]);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-all ${
                selectedLang === lang
                  ? 'bg-phantom-cyan text-black font-bold shadow-glow-cyan'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-white/60 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE-ONLY QUICK LESSON SELECTOR (< lg) */}
      <div className="lg:hidden space-y-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-sm flex items-center justify-between gap-2 transition-colors">
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-700 dark:text-phantom-violet font-semibold">
              <span>Ch. {selectedLesson.chapterNumber || 1}</span>
              <span>•</span>
              <span className="uppercase">{selectedLesson.language}</span>
              {isCompleted && (
                <span className="text-teal-600 dark:text-phantom-teal flex items-center gap-0.5 ml-1">
                  <Check className="w-3 h-3" /> Mastered
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {selectedLesson.title}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevLesson}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white active:scale-95 transition-all"
              title="Previous Lesson"
              aria-label="Previous Lesson"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet border border-purple-200 dark:border-phantom-purple/30 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>{mobileMenuOpen ? 'Hide' : 'All Lessons'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={handleNextLesson}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white active:scale-95 transition-all"
              title="Next Lesson"
              aria-label="Next Lesson"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Mobile Lessons Drawer */}
        {mobileMenuOpen && (
          <div className="p-3 rounded-2xl bg-white dark:bg-[#070c1d] border border-purple-200 dark:border-phantom-purple/30 shadow-lg space-y-2 max-h-72 overflow-y-auto animate-fadeIn">
            <div className="text-[11px] font-mono text-slate-500 dark:text-white/40 px-1 font-semibold">
              Select Lesson ({filteredLessons.length} in this filter):
            </div>
            {filteredLessons.map((lesson) => {
              const active = selectedLesson.id === lesson.id;
              const done = profile.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    active
                      ? 'bg-purple-50 dark:bg-phantom-purple/25 border-purple-400 dark:border-phantom-cyan font-bold text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-purple-700 dark:text-phantom-violet">
                      Ch. {lesson.chapterNumber} • {lesson.language.toUpperCase()}
                    </div>
                    <div className="truncate font-semibold text-xs mt-0.5">{lesson.title}</div>
                  </div>
                  <div className="shrink-0">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-phantom-amber font-mono font-bold">
                        +{lesson.xp} XP
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Layout: Left Lessons List / Right Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Nav (4 cols) - Desktop only (hidden on mobile, replaced by tap-friendly mobile switcher above) */}
        <div className="hidden lg:block lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-white/40 font-bold">
              Curriculum Lessons ({filteredLessons.length})
            </h3>
            <span className="text-[11px] font-mono text-purple-700 dark:text-phantom-violet font-semibold">
              {selectedChapter === 'all' ? '6 Chapters' : `Chapter ${selectedChapter}`}
            </span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredLessons.map((lesson) => {
              const active = selectedLesson.id === lesson.id;
              const done = profile.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    active
                      ? 'bg-purple-50 dark:bg-phantom-purple/20 border-purple-400 dark:border-phantom-cyan shadow-sm dark:shadow-glow-cyan'
                      : 'bg-white dark:bg-phantom-deep hover:bg-slate-50 dark:hover:bg-phantom-hover border border-slate-200 dark:border-phantom-border/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono uppercase text-purple-700 dark:text-phantom-violet font-semibold truncate max-w-[170px]">
                      Ch.{lesson.chapterNumber} • {lesson.concept}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-white/50">
                        {lesson.language}
                      </span>
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-phantom-amber font-mono font-bold">
                          +{lesson.xp} XP
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lesson.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lesson Interactive Workspace (8 cols on desktop, full width on mobile) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-5 transition-colors">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet font-semibold text-[11px] border border-purple-200 dark:border-phantom-purple/30">
                    Ch. {selectedLesson.chapterNumber || 1}
                  </span>
                  <span className="text-cyan-700 dark:text-phantom-cyan font-bold">{selectedLesson.concept}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="uppercase text-slate-500 dark:text-white/50">{selectedLesson.language}</span>
                  {isCompleted && (
                    <span className="text-teal-600 dark:text-phantom-teal flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedLesson.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed bg-slate-50 dark:bg-black/30 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <span className="font-semibold text-slate-900 dark:text-white/90">Scenario: </span>
                {selectedLesson.scenario}
              </p>
            </div>

            {/* BROKEN CODE PREVIEW: Inspect Before Predicting */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-[#060a18] shadow-sm">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/90 dark:bg-[#040711] border-b border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-purple-700 dark:text-phantom-violet font-semibold text-[11px]">
                    {selectedLesson.language === 'python'
                      ? 'lesson.py'
                      : selectedLesson.language === 'cpp'
                      ? 'lesson.cpp'
                      : selectedLesson.language === 'java'
                      ? 'Lesson.java'
                      : 'lesson.ts'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-mono text-[10px] font-bold border border-rose-200 dark:border-rose-900/50">
                    Broken Program
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-white/40 truncate max-w-[180px]">
                  Target: {selectedLesson.entryFunction}(...)
                </span>
              </div>
              <pre className="p-3 sm:p-3.5 text-xs font-mono text-slate-800 dark:text-slate-100 overflow-x-auto whitespace-pre leading-relaxed select-text font-medium">
                {selectedLesson.brokenCode}
              </pre>
            </div>

            {/* STEP 1: Interactive Predict the Output */}
            {selectedLesson.predictions && selectedLesson.predictions.length > 0 && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/70 dark:bg-[#090e24] border border-purple-200 dark:border-phantom-purple/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-800 dark:text-phantom-violet">
                  <Brain className="w-4 h-4 shrink-0" />
                  <span>STEP 1: PREDICT THE BEHAVIOR BEFORE EDITING</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-white/80 font-medium">
                  Looking at the broken program above, what will happen if we run it right now?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLesson.predictions.map((p) => {
                    const isSelected = selectedPrediction === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePredictionAnswer(p.id, p.isCorrect)}
                        disabled={showPredictionResult}
                        className={`text-left p-2.5 sm:p-3 rounded-lg border text-xs font-mono transition-all active:scale-[0.98] ${
                          showPredictionResult
                            ? p.isCorrect
                              ? 'bg-teal-100 dark:bg-phantom-teal/20 border-teal-300 dark:border-phantom-teal text-teal-800 dark:text-phantom-teal font-semibold'
                              : isSelected
                              ? 'bg-rose-100 dark:bg-phantom-crimson/20 border-rose-300 dark:border-phantom-crimson text-rose-800 dark:text-phantom-crimson'
                              : 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-400 dark:text-white/40'
                            : 'bg-white dark:bg-black/40 hover:bg-slate-100 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/80 hover:text-slate-900 dark:hover:text-white shadow-sm'
                        }`}
                      >
                        {p.text}
                      </button>
                    );
                  })}
                </div>

                {showPredictionResult && (
                  <div className="p-3 rounded-lg bg-white/90 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white/80 space-y-1 animate-fadeIn">
                    <span className="font-mono text-cyan-700 dark:text-phantom-cyan font-bold block">
                      Forensic Hypothesis Verdict:
                    </span>
                    <p className="font-sans font-medium text-slate-700 dark:text-white/90 leading-relaxed">
                      {selectedLesson.predictions.find((p) => p.id === selectedPrediction)?.explanation ||
                       selectedLesson.predictions.find((p) => p.isCorrect)?.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: In-Place Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-700 dark:text-phantom-cyan font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>STEP 2: FIX THE DEFECT IN THE LIVE SANDBOX</span>
                </span>
                <button
                  onClick={() => setShowStepHint((prev) => !prev)}
                  className="text-amber-600 dark:text-phantom-amber hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>{showStepHint ? 'Hide Clue' : 'Need a Clue?'}</span>
                </button>
              </div>

              {showStepHint && selectedLesson.stepByStepHint && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-phantom-amber/10 border border-amber-300 dark:border-phantom-amber/40 text-xs text-amber-800 dark:text-phantom-amber font-mono animate-fadeIn">
                  💡 <strong>Clue:</strong> {selectedLesson.stepByStepHint}
                </div>
              )}

              {/* DUAL MODE CODE EDITOR */}
              <div className="rounded-xl border border-slate-200 dark:border-phantom-border/80 overflow-hidden bg-white dark:bg-[#070c1d] shadow-sm">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/90 dark:bg-[#050813] border-b border-slate-200 dark:border-white/10 text-xs">
                  <span className="font-mono text-purple-700 dark:text-phantom-violet font-semibold text-[11px]">
                    {selectedLesson.language === 'python'
                      ? 'lesson.py'
                      : selectedLesson.language === 'cpp'
                      ? 'lesson.cpp'
                      : selectedLesson.language === 'java'
                      ? 'Lesson.java'
                      : 'lesson.ts'}
                  </span>
                  <button
                    onClick={() => setCode(selectedLesson.brokenCode)}
                    className="text-slate-500 hover:text-slate-800 dark:text-white/40 dark:hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Code
                  </button>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-44 sm:h-48 p-3 sm:p-3.5 bg-white dark:bg-[#070c1d] text-slate-900 dark:text-phantom-white font-mono text-xs leading-5 resize-none outline-none whitespace-pre selection:bg-purple-200 dark:selection:bg-phantom-purple/40"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-100/90 dark:bg-[#050813] border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] text-slate-600 dark:text-white/50 font-mono font-medium truncate">
                    Target: {selectedLesson.expectedBehavior}
                  </span>

                  <button
                    onClick={handleTestLessonCode}
                    disabled={evaluating}
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-cyan text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{evaluating ? 'Testing Fix...' : 'Verify Fix'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Result Banner */}
            {evalResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono flex flex-wrap items-center justify-between gap-2 animate-fadeIn ${
                  evalResult.success
                    ? 'bg-teal-50 dark:bg-phantom-teal/15 border-teal-300 dark:border-phantom-teal/40 text-teal-800 dark:text-phantom-teal'
                    : 'bg-rose-50 dark:bg-phantom-crimson/15 border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson'
                }`}
              >
                <div className="flex items-center gap-2">
                  {evalResult.success ? (
                    <Check className="w-4 h-4 text-teal-600 dark:text-phantom-teal shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-phantom-crimson shrink-0" />
                  )}
                  <span className="font-semibold">{evalResult.message}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] opacity-90">
                    {evalResult.passedCount} / {evalResult.total} passed
                  </span>
                  {evalResult.success && hasNext && (
                    <button
                      onClick={handleNextLesson}
                      className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 dark:bg-phantom-teal dark:text-black font-bold text-[11px] flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Concise Takeaway Box (No Boring Lectures!) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-purple-700 dark:text-phantom-cyan flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Detective Key Takeaway:</span>
              </div>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed font-sans">
                {selectedLesson.keyTakeaway}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 dark:text-white/50">
                <span className="text-amber-700 dark:text-phantom-amber font-semibold">The Anatomy of the Bug: </span>
                {selectedLesson.bugExplanation}
              </div>
            </div>

            {/* Action footer: Next/Prev Lesson navigation & Jump to live case */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLesson}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNextLesson}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onSwitchToHunt()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-phantom-cyan border border-purple-200 dark:border-phantom-cyan/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Enter Live Case Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
