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
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Filter,
  Search,
  Terminal,
  Award,
  Circle,
  FolderOpen,
  Folder,
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

const LANGUAGE_BADGES: Record<Language, { label: string; text: string; bg: string }> = {
  python: { label: 'PY', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/40' },
  javascript: { label: 'JS', text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-950/40' },
  typescript: { label: 'TS', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/40' },
  cpp: { label: 'C++', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-950/40' },
  java: { label: 'JAVA', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/40' },
};

export const LearnPage: React.FC<LearnPageProps> = ({
  profile,
  onUpdateProfile,
  onSwitchToHunt,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language | 'all'>(profile.selectedLanguage || 'all');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Accordion open/close state for chapters (default: open the active chapter)
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const toggleChapter = (chapterNum: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterNum]: !prev[chapterNum],
    }));
  };

  const expandAllChapters = () => {
    setExpandedChapters({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
  };

  const collapseAllChapters = () => {
    setExpandedChapters({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
  };

  // Filter lessons based on language, chapter, and search
  const filteredLessons = useMemo(() => {
    return LEARN_LESSONS.filter((l) => {
      const matchLang = selectedLang === 'all' || l.language === selectedLang;
      const matchChapter = selectedChapter === 'all' || l.chapterNumber === selectedChapter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.concept.toLowerCase().includes(q) ||
        l.scenario.toLowerCase().includes(q) ||
        l.language.toLowerCase().includes(q);
      return matchLang && matchChapter && matchSearch;
    });
  }, [selectedLang, selectedChapter, searchQuery]);

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
        if (matching.chapterNumber) {
          setExpandedChapters((prev) => ({ ...prev, [matching.chapterNumber!]: true }));
        }
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
    if (lesson.chapterNumber) {
      setExpandedChapters((prev) => ({ ...prev, [lesson.chapterNumber!]: true }));
    }
  };

  // Next / Previous navigation within filtered list
  const currentIndex = filteredLessons.findIndex((l) => l.id === selectedLesson.id);
  const hasNext = currentIndex !== -1 && currentIndex < filteredLessons.length - 1;
  const hasPrev = currentIndex !== -1 && currentIndex > 0;

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
  const totalMasteredCount = profile.completedLessons.length;
  const totalLessonsCount = LEARN_LESSONS.length;
  const masteryPercent = Math.min(100, Math.round((totalMasteredCount / totalLessonsCount) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* =========================================================================
          1. HEADER & PROGRESS BANNER
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-phantom-purple/20 border border-purple-300 dark:border-phantom-purple/40 text-purple-800 dark:text-phantom-violet text-xs font-mono font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Code Forensics Academy</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Curriculum Lab: Learn by Breaking & Fixing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
            Predict edge-case failures, repair broken snippets in an isolated live sandbox, and lock in core software patterns without passive 40-minute theory videos.
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="w-full md:w-auto shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 min-w-[240px]">
          <div className="flex items-center justify-between gap-3 text-xs font-mono mb-2">
            <span className="text-slate-600 dark:text-white/60 font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600 dark:text-phantom-cyan" />
              Mastery Progress
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {totalMasteredCount} / {totalLessonsCount} ({masteryPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-phantom-purple to-phantom-cyan transition-all duration-500 rounded-full"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono text-slate-500 dark:text-white/40">
            <span>{LEARN_CHAPTERS.length} Chapters Available</span>
            <span className="text-teal-600 dark:text-phantom-teal font-semibold">
              {totalMasteredCount * 60} XP Earned
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. UNIFIED TOOLBAR: LANGUAGE TABS + CHAPTER SELECTOR + SEARCH
          ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <span className="text-xs font-mono text-slate-500 dark:text-white/40 font-semibold shrink-0 mr-1 hidden sm:inline flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Language:
          </span>
          {(['all', 'python', 'javascript', 'typescript', 'cpp', 'java'] as const).map((lang) => {
            const count = lang === 'all'
              ? LEARN_LESSONS.length
              : LEARN_LESSONS.filter((l) => l.language === lang).length;
            const active = selectedLang === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  const matching = LEARN_LESSONS.filter(
                    (l) => (lang === 'all' || l.language === lang) && (selectedChapter === 'all' || l.chapterNumber === selectedChapter)
                  );
                  if (matching.length > 0 && !matching.some((m) => m.id === selectedLesson.id)) {
                    handleSelectLesson(matching[0]);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-purple-600 dark:bg-phantom-purple text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-white/70 dark:hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                <span className="uppercase">{lang}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/50'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Chapter Dropdown & Search Bar */}
        <div className="flex items-center gap-2.5">
          {/* Chapter Quick Filter */}
          <div className="relative shrink-0 flex-1 sm:flex-none">
            <select
              value={selectedChapter}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedChapter(val);
                if (val !== 'all') {
                  setExpandedChapters((prev) => ({ ...prev, [val]: true }));
                }
              }}
              className="w-full sm:w-auto pl-3 pr-8 py-1.5 text-xs font-mono font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 outline-none focus:border-purple-500 cursor-pointer transition-colors"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                All Chapters (6)
              </option>
              {LEARN_CHAPTERS.map((ch) => (
                <option
                  key={ch.id}
                  value={ch.chapterNumber}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  Ch. {ch.chapterNumber}: {ch.title.replace(/^Chapter \d+:\s*/, '')}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs font-sans rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MOBILE COMPACT DRAWER SELECTOR (< lg)
          ========================================================================= */}
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
              <span>{mobileMenuOpen ? 'Close' : 'Browse All'}</span>
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
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#070c1d] border border-purple-200 dark:border-phantom-purple/30 shadow-xl space-y-3 max-h-96 overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-600 dark:text-white/60 pb-1 border-b border-slate-100 dark:border-white/5">
              <span>Curriculum ({filteredLessons.length} available)</span>
              <span className="text-[11px] text-purple-600 dark:text-phantom-violet">
                {selectedChapter === 'all' ? 'All Chapters' : `Chapter ${selectedChapter}`}
              </span>
            </div>
            {filteredLessons.map((lesson) => {
              const active = selectedLesson.id === lesson.id;
              const done = profile.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                    active
                      ? 'bg-purple-50 dark:bg-phantom-purple/25 border-purple-400 dark:border-phantom-cyan font-bold text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-purple-700 dark:text-phantom-violet font-semibold">
                      Ch. {lesson.chapterNumber} • {lesson.concept}
                    </div>
                    <div className="truncate font-bold text-xs mt-0.5">{lesson.title}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-black/50 text-slate-600 dark:text-white/60">
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
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. MAIN GRID: LEFT STRUCTURED CHAPTER ACCORDIONS (4 cols) / RIGHT WORKSPACE (8 cols)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            LEFT: STRUCTURED CHAPTER MODULES (Desktop Only)
            ===================================================================== */}
        <div className="hidden lg:block lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-white/60 font-bold">
              <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-violet" />
              <span>Curriculum Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAllChapters}
                className="text-[11px] font-mono text-slate-500 hover:text-purple-600 dark:text-white/40 dark:hover:text-phantom-violet transition-colors"
                title="Expand all chapters"
              >
                Expand
              </button>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <button
                onClick={collapseAllChapters}
                className="text-[11px] font-mono text-slate-500 hover:text-purple-600 dark:text-white/40 dark:hover:text-phantom-violet transition-colors"
                title="Collapse all chapters"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* Grouped Chapter Accordions Container */}
          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {LEARN_CHAPTERS.map((ch) => {
              // Lessons matching the current chapter & active filters
              const chapterLessons = filteredLessons.filter((l) => l.chapterNumber === ch.chapterNumber);
              const allLessonsInCh = LEARN_LESSONS.filter((l) => l.chapterNumber === ch.chapterNumber);
              const completedInCh = allLessonsInCh.filter((l) => profile.completedLessons.includes(l.id)).length;
              const isAllDone = completedInCh === allLessonsInCh.length && allLessonsInCh.length > 0;
              const isExpanded = !!expandedChapters[ch.chapterNumber];
              const isCurrentChapter = selectedLesson.chapterNumber === ch.chapterNumber;

              // Hide chapter if filters active and has 0 matching lessons
              if (chapterLessons.length === 0 && (selectedLang !== 'all' || selectedChapter !== 'all' || searchQuery)) {
                return null;
              }

              return (
                <div
                  key={ch.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isCurrentChapter
                      ? 'border-purple-300 dark:border-phantom-purple/50 bg-white dark:bg-phantom-deep shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-phantom-deep hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {/* Chapter Accordion Header */}
                  <button
                    onClick={() => toggleChapter(ch.chapterNumber)}
                    className="w-full text-left p-3.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isAllDone
                          ? 'bg-teal-100 text-teal-800 dark:bg-phantom-teal/20 dark:text-phantom-teal'
                          : isCurrentChapter
                          ? 'bg-purple-600 text-white dark:bg-phantom-purple'
                          : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70'
                      }`}>
                        {ch.chapterNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {ch.title.replace(/^Chapter \d+:\s*/, '')}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-white/40 truncate">
                          {ch.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        isAllDone
                          ? 'bg-teal-100 text-teal-700 dark:bg-phantom-teal/20 dark:text-phantom-teal'
                          : completedInCh > 0
                          ? 'bg-purple-100 text-purple-700 dark:bg-phantom-purple/20 dark:text-phantom-violet'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/40'
                      }`}>
                        {completedInCh}/{allLessonsInCh.length} {isAllDone ? '✓' : ''}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Chapter Lessons List (Expanded View) */}
                  {isExpanded && (
                    <div className="p-2 pt-0 space-y-1.5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                      {chapterLessons.map((lesson) => {
                        const active = selectedLesson.id === lesson.id;
                        const done = profile.completedLessons.includes(lesson.id);
                        const badge = LANGUAGE_BADGES[lesson.language];

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                              active
                                ? 'bg-purple-100/90 dark:bg-phantom-purple/25 border-purple-400 dark:border-phantom-cyan font-bold text-slate-900 dark:text-white shadow-sm'
                                : 'bg-white dark:bg-phantom-deep/60 hover:bg-slate-100/90 dark:hover:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80'
                            }`}
                          >
                            {/* Left: Status Icon */}
                            <div className="shrink-0">
                              {done ? (
                                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-phantom-teal" />
                              ) : active ? (
                                <div className="w-4 h-4 rounded-full bg-purple-600 dark:bg-phantom-cyan flex items-center justify-center text-white">
                                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                </div>
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 dark:text-white/20" />
                              )}
                            </div>

                            {/* Middle: Lesson Details */}
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-slate-500 dark:text-white/40">
                                <span>{lesson.concept}</span>
                                <span>•</span>
                                <span className={`font-bold px-1 rounded ${badge.bg} ${badge.text}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>

                            {/* Right: XP / Mastered */}
                            <div className="shrink-0 text-right">
                              {done ? (
                                <span className="text-[10px] font-mono text-teal-600 dark:text-phantom-teal font-semibold">
                                  Mastered
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-amber-600 dark:text-phantom-amber font-bold">
                                  +{lesson.xp} XP
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {chapterLessons.length === 0 && (
                        <div className="p-3 text-center text-xs font-mono text-slate-400 dark:text-white/40">
                          No matching lessons for active filters.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            RIGHT: INTERACTIVE FORENSIC WORKSPACE (8 cols)
            ===================================================================== */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-md dark:shadow-xl space-y-6 transition-colors">
            {/* Top Workspace Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2.5 pb-2.5 border-b border-slate-100 dark:border-white/5">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet font-semibold text-[11px] border border-purple-200 dark:border-phantom-purple/30">
                    Chapter {selectedLesson.chapterNumber || 1}
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="font-bold text-slate-700 dark:text-white/90">
                    {selectedLesson.concept}
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="uppercase text-purple-700 dark:text-phantom-cyan font-bold">
                    {selectedLesson.language}
                  </span>
                </div>

                {/* Stepper info & Mastered status */}
                <div className="flex items-center gap-3">
                  {isCompleted && (
                    <span className="text-teal-600 dark:text-phantom-teal flex items-center gap-1 font-bold text-xs">
                      <Check className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-white/40 font-mono">
                    <button
                      onClick={handlePrevLesson}
                      disabled={!hasPrev}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Previous"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span>
                      {currentIndex !== -1 ? `${currentIndex + 1} of ${filteredLessons.length}` : ''}
                    </span>
                    <button
                      onClick={handleNextLesson}
                      disabled={!hasNext}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Next"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">
                {selectedLesson.title}
              </h2>

              {/* Incident Scenario Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-start gap-3">
                <Terminal className="w-4 h-4 text-purple-600 dark:text-phantom-cyan mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-slate-700 dark:text-white/80 leading-relaxed font-sans">
                  <strong className="text-slate-900 dark:text-white font-semibold">Incident Scenario: </strong>
                  {selectedLesson.scenario}
                </div>
              </div>
            </div>

            {/* STEP 1: Broken Code Preview & Diagnostic Hypothesis */}
            <div className="space-y-3">
              {/* Code preview banner */}
              <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-[#060a18] shadow-sm">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-[#040711] border-b border-slate-200 dark:border-white/10 text-xs">
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
                      Broken Snippet
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">
                    Function: {selectedLesson.entryFunction}(...)
                  </span>
                </div>
                <pre className="p-3.5 sm:p-4 text-xs font-mono text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-pre leading-relaxed select-text font-medium">
                  {selectedLesson.brokenCode}
                </pre>
              </div>

              {/* Step 1: Hypothesis Quiz */}
              {selectedLesson.predictions && selectedLesson.predictions.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-[#090e24] border border-purple-200 dark:border-phantom-purple/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-800 dark:text-phantom-violet">
                    <Brain className="w-4 h-4 shrink-0" />
                    <span>STEP 1: PREDICT THE BEHAVIOR BEFORE EDITING</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-white/80 font-medium">
                    What will happen if we execute this broken function with external inputs right now?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedLesson.predictions.map((p, idx) => {
                      const isSelected = selectedPrediction === p.id;
                      const letter = String.fromCharCode(65 + idx);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePredictionAnswer(p.id, p.isCorrect)}
                          disabled={showPredictionResult}
                          className={`text-left p-2.5 sm:p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-2 ${
                            showPredictionResult
                              ? p.isCorrect
                                ? 'bg-teal-100 dark:bg-phantom-teal/20 border-teal-300 dark:border-phantom-teal text-teal-900 dark:text-phantom-teal font-semibold'
                                : isSelected
                                ? 'bg-rose-100 dark:bg-phantom-crimson/20 border-rose-300 dark:border-phantom-crimson text-rose-900 dark:text-phantom-crimson'
                                : 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/5 text-slate-400 dark:text-white/40'
                              : 'bg-white dark:bg-black/40 hover:bg-slate-100 dark:hover:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/80 shadow-sm active:scale-[0.98]'
                          }`}
                        >
                          <span className="font-bold opacity-70 shrink-0">{letter}.</span>
                          <span className="flex-1">{p.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showPredictionResult && (
                    <div className="p-3 rounded-lg bg-white/95 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white/80 space-y-1 animate-fadeIn">
                      <span className="font-mono text-purple-700 dark:text-phantom-cyan font-bold block">
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
            </div>

            {/* STEP 2: Live In-Place Code Sandbox */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-700 dark:text-phantom-cyan font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>STEP 2: FIX THE DEFECT IN THE LIVE SANDBOX</span>
                </span>
                <button
                  onClick={() => setShowStepHint((prev) => !prev)}
                  className="text-amber-600 dark:text-phantom-amber hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showStepHint ? 'Hide Clue' : 'Need a Clue?'}</span>
                </button>
              </div>

              {showStepHint && selectedLesson.stepByStepHint && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-phantom-amber/10 border border-amber-300 dark:border-phantom-amber/40 text-xs text-amber-800 dark:text-phantom-amber font-mono animate-fadeIn">
                  💡 <strong>Clue:</strong> {selectedLesson.stepByStepHint}
                </div>
              )}

              {/* Code Editor Surface */}
              <div className="rounded-xl border border-slate-200 dark:border-phantom-border/80 overflow-hidden bg-white dark:bg-[#070c1d] shadow-sm">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-[#050813] border-b border-slate-200 dark:border-white/10 text-xs">
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
                  className="w-full h-44 sm:h-48 p-3.5 sm:p-4 bg-white dark:bg-[#070c1d] text-slate-900 dark:text-phantom-white font-mono text-xs leading-5 resize-none outline-none whitespace-pre selection:bg-purple-200 dark:selection:bg-phantom-purple/40"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-slate-100 dark:bg-[#050813] border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] text-slate-600 dark:text-white/60 font-mono font-medium">
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
                className={`p-4 rounded-xl border text-xs font-mono flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
                  evalResult.success
                    ? 'bg-teal-50 dark:bg-phantom-teal/15 border-teal-300 dark:border-phantom-teal/40 text-teal-800 dark:text-phantom-teal'
                    : 'bg-rose-50 dark:bg-phantom-crimson/15 border-rose-300 dark:border-phantom-crimson/40 text-rose-800 dark:text-phantom-crimson'
                }`}
              >
                <div className="flex items-center gap-2">
                  {evalResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-phantom-teal shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-phantom-crimson shrink-0" />
                  )}
                  <span className="font-semibold">{evalResult.message}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] opacity-90">
                    {evalResult.passedCount} / {evalResult.total} passed
                  </span>
                  {evalResult.success && hasNext && (
                    <button
                      onClick={handleNextLesson}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white dark:bg-phantom-teal dark:text-black font-bold text-xs flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Detective Takeaway Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-purple-700 dark:text-phantom-cyan flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Detective Key Takeaway:</span>
              </div>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed font-sans text-xs sm:text-sm">
                {selectedLesson.keyTakeaway}
              </p>
              <div className="pt-1.5 text-[11px] text-slate-500 dark:text-white/50 border-t border-slate-200/50 dark:border-white/5">
                <span className="text-amber-700 dark:text-phantom-amber font-semibold">The Anatomy of the Bug: </span>
                {selectedLesson.bugExplanation}
              </div>
            </div>

            {/* Bottom Actions: Previous, Next & Arena Switcher */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLesson}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Concept</span>
                </button>
                <button
                  onClick={handleNextLesson}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Concept</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onSwitchToHunt()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-phantom-cyan border border-purple-200 dark:border-phantom-cyan/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
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
