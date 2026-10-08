import React, { useState } from 'react';
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
} from 'lucide-react';
import { LearnLesson, UserProfile, Language } from '../types';
import { LEARN_LESSONS } from '../services/learnService';
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
  const [selectedLang, setSelectedLang] = useState<Language | 'all'>('all');
  const filteredLessons = selectedLang === 'all'
    ? LEARN_LESSONS
    : LEARN_LESSONS.filter((l) => l.language === selectedLang);

  const [selectedLesson, setSelectedLesson] = useState<LearnLesson>(filteredLessons[0] || LEARN_LESSONS[0]);
  const [code, setCode] = useState<string>(selectedLesson.brokenCode);
  const [evaluating, setEvaluating] = useState<boolean>(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-phantom-purple/20 border border-purple-300 dark:border-phantom-purple/40 text-purple-800 dark:text-phantom-violet text-xs font-mono font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Forensic Micro-Lessons</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Learn Mode: No Boring Lectures</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 max-w-2xl mt-1 leading-relaxed">
            Predict the failure hypothesis, edit the snippet directly in place, and master core programming principles without sitting through 40-minute theory videos.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 dark:text-white/50 bg-slate-50 dark:bg-black/40 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 font-medium">
          Progress: {profile.completedLessons.length} / {LEARN_LESSONS.length} concepts mastered
        </div>
      </div>

      {/* Language Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-white/40 font-mono">Filter Language:</span>
        {(['all', 'python', 'javascript', 'typescript', 'cpp', 'java'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setSelectedLang(lang);
              const list = lang === 'all' ? LEARN_LESSONS : LEARN_LESSONS.filter((l) => l.language === lang);
              if (list.length > 0) handleSelectLesson(list[0]);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
              selectedLang === lang
                ? 'bg-phantom-cyan text-black font-bold shadow-glow-cyan'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-white/60 dark:hover:text-white border border-slate-200 dark:border-white/10'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Main Layout: Left Lessons List / Right Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-white/40 px-1 font-bold">
            Curriculum Concepts ({filteredLessons.length})
          </h3>

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
                    <span className="text-[11px] font-mono uppercase text-purple-700 dark:text-phantom-violet font-semibold">
                      {lesson.concept}
                    </span>
                    <div className="flex items-center gap-2">
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

        {/* Lesson Interactive Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-700 dark:text-phantom-cyan font-bold">{selectedLesson.concept}</span>
                <div className="flex items-center gap-2">
                  <span className="uppercase text-slate-500 dark:text-white/50">{selectedLesson.language}</span>
                  {isCompleted && (
                    <span className="text-teal-600 dark:text-phantom-teal flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedLesson.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed bg-slate-50 dark:bg-black/30 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <span className="font-semibold text-slate-900 dark:text-white/90">Scenario: </span>
                {selectedLesson.scenario}
              </p>
            </div>

            {/* STEP 1: Interactive Predict the Output */}
            {selectedLesson.predictions && selectedLesson.predictions.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-[#090e24] border border-purple-200 dark:border-phantom-purple/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-800 dark:text-phantom-violet">
                  <Brain className="w-4 h-4" />
                  <span>STEP 1: PREDICT THE BEHAVIOR BEFORE EDITING</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-white/80">
                  What will happen if we run this broken code right now?
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
                        className={`text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
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
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white/80 space-y-1">
                    <span className="font-mono text-cyan-700 dark:text-phantom-cyan font-bold block">
                      Forensic Hypothesis Verdict:
                    </span>
                    <p>
                      {selectedLesson.predictions.find((p) => p.isCorrect)?.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: In-Place Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-700 dark:text-phantom-cyan font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
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

              <div className="rounded-xl border border-slate-300 dark:border-phantom-border/80 overflow-hidden bg-slate-900 dark:bg-[#070c1d]">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 dark:bg-[#050813] border-b border-white/10 text-xs">
                  <span className="font-mono text-purple-300 dark:text-phantom-violet text-[11px]">
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
                    className="text-slate-300 dark:text-white/40 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-40 p-3 bg-transparent text-slate-100 dark:text-phantom-white font-mono text-xs leading-5 resize-none outline-none whitespace-pre selection:bg-phantom-purple/40"
                />

                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 dark:bg-[#050813] border-t border-white/10">
                  <span className="text-[11px] text-slate-400 dark:text-white/40 font-mono">
                    Target: {selectedLesson.expectedBehavior}
                  </span>

                  <button
                    onClick={handleTestLessonCode}
                    disabled={evaluating}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-cyan text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{evaluating ? 'Testing...' : 'Verify Fix'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Result Banner */}
            {evalResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  evalResult.success
                    ? 'bg-teal-50 dark:bg-phantom-teal/15 border-teal-300 dark:border-phantom-teal/40 text-teal-800 dark:text-phantom-teal'
                    : 'bg-rose-50 dark:bg-phantom-crimson/15 border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson'
                }`}
              >
                <div className="flex items-center gap-2">
                  {evalResult.success ? (
                    <Check className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-phantom-crimson" />
                  )}
                  <span>{evalResult.message}</span>
                </div>
                <div className="text-[11px]">
                  {evalResult.passedCount} / {evalResult.total} passed
                </div>
              </div>
            )}

            {/* Concise Takeaway Box (No Boring Lectures!) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-purple-700 dark:text-phantom-cyan flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
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

            {/* Action footer: Jump to live case */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
              <span className="text-xs text-slate-500 dark:text-white/40 font-mono">
                Ready to solve full investigative crime scenes?
              </span>
              <button
                onClick={() => onSwitchToHunt()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-phantom-cyan border border-purple-200 dark:border-phantom-cyan/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
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
