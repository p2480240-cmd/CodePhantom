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
} from 'lucide-react';
import { LearnLesson, UserProfile } from '../types';
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
  const [selectedLesson, setSelectedLesson] = useState<LearnLesson>(LEARN_LESSONS[0]);
  const [code, setCode] = useState<string>(selectedLesson.brokenCode);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<{
    success: boolean;
    passedCount: number;
    total: number;
    message: string;
  } | null>(null);

  const handleSelectLesson = (lesson: LearnLesson) => {
    setSelectedLesson(lesson);
    setCode(lesson.brokenCode);
    setEvalResult(null);
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
        message: exec.syntaxError || 'The logic still contains a bug. Inspect the takeaway below.',
      });
    }
  };

  const isCompleted = profile.completedLessons.includes(selectedLesson.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-phantom-deep border border-phantom-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phantom-purple/20 border border-phantom-purple/40 text-phantom-violet text-xs font-mono font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Micro-Lessons</span>
          </div>
          <h2 className="text-2xl font-black text-white">Learn Mode: No Boring Lectures</h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
            Inspect the broken scenario, predict the failure, edit the snippet in place, and understand the core programming principle in seconds.
          </p>
        </div>

        <div className="text-xs font-mono text-white/50 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
          Progress: {profile.completedLessons.length} / {LEARN_LESSONS.length} concepts mastered
        </div>
      </div>

      {/* Main Layout: Left Lessons List / Right Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 px-1 font-bold">
            Curriculum Concepts
          </h3>

          <div className="space-y-2">
            {LEARN_LESSONS.map((lesson) => {
              const active = selectedLesson.id === lesson.id;
              const done = profile.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    active
                      ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                      : 'bg-phantom-deep hover:bg-phantom-hover border-phantom-border/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono uppercase text-phantom-violet font-semibold">
                      {lesson.concept}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-phantom-teal" />
                    ) : (
                      <span className="text-[10px] text-phantom-amber font-mono font-bold">
                        +{lesson.xp} XP
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{lesson.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lesson Interactive Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-phantom-deep border border-phantom-border shadow-xl space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-phantom-cyan font-bold">{selectedLesson.concept}</span>
                <span className="uppercase text-white/50">{selectedLesson.language}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedLesson.title}</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="font-semibold text-white/90">Scenario: </span>
                {selectedLesson.scenario}
              </p>
            </div>

            {/* In-Place Code Editor */}
            <div className="rounded-xl border border-phantom-border/80 overflow-hidden bg-[#070c1d]">
              <div className="flex items-center justify-between px-3 py-2 bg-[#050813] border-b border-white/10 text-xs">
                <span className="font-mono text-phantom-violet text-[11px]">
                  {selectedLesson.language === 'python' ? 'lesson.py' : 'lesson.js'}
                </span>
                <button
                  onClick={() => setCode(selectedLesson.brokenCode)}
                  className="text-white/40 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-40 p-3 bg-transparent text-phantom-white font-mono text-xs leading-5 resize-none outline-none whitespace-pre selection:bg-phantom-purple/40"
              />

              <div className="flex items-center justify-between px-3 py-2 bg-[#050813] border-t border-white/10">
                <span className="text-[11px] text-white/40 font-mono">
                  Target: {selectedLesson.expectedBehavior}
                </span>

                <button
                  onClick={handleTestLessonCode}
                  disabled={evaluating}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-phantom-purple to-phantom-cyan text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{evaluating ? 'Testing...' : 'Verify Fix'}</span>
                </button>
              </div>
            </div>

            {/* Evaluation Result Banner */}
            {evalResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  evalResult.success
                    ? 'bg-phantom-teal/15 border-phantom-teal/40 text-phantom-teal'
                    : 'bg-phantom-crimson/15 border-phantom-crimson/40 text-phantom-crimson'
                }`}
              >
                <div className="flex items-center gap-2">
                  {evalResult.success ? (
                    <Check className="w-4 h-4 text-phantom-teal" />
                  ) : (
                    <XCircle className="w-4 h-4 text-phantom-crimson" />
                  )}
                  <span>{evalResult.message}</span>
                </div>
                <div className="text-[11px]">
                  {evalResult.passedCount} / {evalResult.total} passed
                </div>
              </div>
            )}

            {/* Concise Takeaway Box (No Boring Lectures!) */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-phantom-cyan flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Detective Key Takeaway:</span>
              </div>
              <p className="text-white/80 leading-relaxed font-sans">
                {selectedLesson.keyTakeaway}
              </p>
              <div className="pt-1 text-[11px] text-white/50">
                <span className="text-phantom-amber font-semibold">The Anatomy of the Bug: </span>
                {selectedLesson.bugExplanation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
