import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  Zap,
  Tag,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  Target,
  Trophy,
  History,
  ClipboardList,
  Flame,
  Brain,
} from 'lucide-react';
import {
  Challenge,
  ExecutionResult,
  UserProfile,
  Language,
  SuspiciousLineAnalysis,
  InvestigationEvent,
  EvidenceItem,
  EdgeCaseTest,
} from '../types';
import { CodeEditor } from '../components/CodeEditor';
import { TestResultsPanel } from '../components/TestResultsPanel';
import { ProgressiveHintsPanel } from '../components/ProgressiveHintsPanel';
import { VictoryModal } from '../components/VictoryModal';
import { AICaseGeneratorModal } from '../components/AICaseGeneratorModal';
import { SuspiciousLinePanel } from '../components/SuspiciousLinePanel';
import { PredictionCard } from '../components/PredictionCard';
import { EvidenceBoard } from '../components/EvidenceBoard';
import { InvestigationReplay } from '../components/InvestigationReplay';
import { EdgeCaseChallengeModal } from '../components/EdgeCaseChallengeModal';
import { AIVsHumanSpeedModal } from '../components/AIVsHumanSpeedModal';
import { CodeExecutionService } from '../services/codeExecutionService';
import { StorageService } from '../services/storageService';
import { CURATED_CHALLENGES, ChallengeService } from '../services/challengeService';

interface HuntPageProps {
  initialChallengeId?: string;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBackToMissions: () => void;
}

export const HuntPage: React.FC<HuntPageProps> = ({
  initialChallengeId,
  profile,
  onUpdateProfile,
  onBackToMissions,
}) => {
  // Initialize challenge strictly matching user's selected language
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(() => {
    if (initialChallengeId) {
      const match = CURATED_CHALLENGES.find((c) => c.id === initialChallengeId);
      if (match) {
        return ChallengeService.getChallengeForLanguage(match, profile.selectedLanguage);
      }
    }
    return ChallengeService.getNextRecommendedChallenge(
      profile.solvedChallengeIds,
      profile.selectedLanguage
    );
  });

  // Initialize code: check if user already has saved code for this challenge in localStorage
  const [code, setCode] = useState<string>(() => {
    const saved = StorageService.getUserCode(currentChallenge.id);
    return saved || currentChallenge.brokenCode;
  });

  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  // Advanced Forensic Systems State
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [suspiciousAnalysis, setSuspiciousAnalysis] = useState<SuspiciousLineAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'tests' | 'predict' | 'evidence' | 'replay'>('tests');
  const [showSpeedModal, setShowSpeedModal] = useState<boolean>(false);
  const [showEdgeCaseModal, setShowEdgeCaseModal] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Investigation Events Replay Log
  const [events, setEvents] = useState<InvestigationEvent[]>([
    {
      id: 'evt_start_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'opened',
      description: `Case file opened: ${currentChallenge.title}`,
    },
  ]);

  // Evidence Checklist Items
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    { id: 'ev_1', label: 'Inspect suspicious code logic in editor', completed: false },
    { id: 'ev_2', label: 'Submit pre-execution prediction hypothesis', completed: false },
    { id: 'ev_3', label: 'Execute preliminary sandbox diagnostic', completed: false },
    { id: 'ev_4', label: 'Banish the anomaly & pass 100% test cases', completed: false },
  ]);

  // Timer counter for speed comparison
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addEvent = (
    type: InvestigationEvent['type'],
    description: string,
    status?: 'success' | 'failure' | 'neutral'
  ) => {
    setEvents((prev) => [
      ...prev,
      {
        id: 'evt_' + Date.now() + Math.random().toString(36).substring(2, 6),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
        description,
        status,
      },
    ]);
  };

  const markEvidence = (id: string) => {
    setEvidenceItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: true } : item))
    );
  };

  // If the user changes language in the top navbar, automatically adapt the challenge to that language!
  useEffect(() => {
    if (currentChallenge.language !== profile.selectedLanguage) {
      const adapted = ChallengeService.getChallengeForLanguage(
        currentChallenge,
        profile.selectedLanguage
      );
      setCurrentChallenge(adapted);
      const saved = StorageService.getUserCode(adapted.id);
      setCode(saved || adapted.brokenCode);
      setExecution(null);
      setRevealedHintLevel(0);
      setShowVictory(false);
      setSelectedLine(null);
      setSuspiciousAnalysis(null);
      addEvent('opened', `Switched environment to ${profile.selectedLanguage.toUpperCase()}`);
    }
  }, [profile.selectedLanguage]);

  // Sync state if initialChallengeId changes
  useEffect(() => {
    if (initialChallengeId) {
      const match = CURATED_CHALLENGES.find((c) => c.id === initialChallengeId);
      if (match) {
        const adapted = ChallengeService.getChallengeForLanguage(
          match,
          profile.selectedLanguage
        );
        setCurrentChallenge(adapted);
        const saved = StorageService.getUserCode(adapted.id);
        setCode(saved || adapted.brokenCode);
        setExecution(null);
        setRevealedHintLevel(0);
        setShowVictory(false);
        setSelectedLine(null);
        setSuspiciousAnalysis(null);
        addEvent('opened', `Opened case file: ${adapted.title}`);
      }
    }
  }, [initialChallengeId]);

  // Handle user typing code in editor: save to state and persist to localStorage
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    StorageService.saveUserCode(currentChallenge.id, newCode);
    markEvidence('ev_1');
  };

  // Click on a line in the gutter to inspect why that line is suspicious
  const handleSelectLine = (lineNumber: number, lineText: string) => {
    setSelectedLine(lineNumber);
    markEvidence('ev_1');

    // Deterministic forensic diagnosis for clicked line
    const isArithmeticOrReturn =
      lineText.includes('return') ||
      lineText.includes('/') ||
      lineText.includes('*') ||
      lineText.includes('+') ||
      lineText.includes('<=');

    const analysis: SuspiciousLineAnalysis = {
      lineNumber,
      codeSnippet: lineText.trim(),
      potentialIssue: isArithmeticOrReturn
        ? `Suspicious mathematical operator or boundary modifier found in line ${lineNumber}.`
        : `Statement inspected. Check if variable state flows into faulty operations downflow.`,
      whySuspicious: isArithmeticOrReturn
        ? `In ${currentChallenge.title}, logic discrepancies often stem from this calculation or loop boundary.`
        : `Verify data types and scope initialization at this point of execution.`,
      relatedConcept: currentChallenge.concept,
      possibleConsequence: isArithmeticOrReturn
        ? `Can halve output, cause off-by-one indexing errors, or fail edge cases.`
        : `May produce subtle state distortions in subsequent blocks.`,
      detectiveAdvice: 'Refactor operands and boundary guards to preserve mathematical consistency.',
    };

    setSuspiciousAnalysis(analysis);
    addEvent('inspected', `Forensic scan of Line ${lineNumber}: "${lineText.trim().slice(0, 30)}..."`);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    addEvent('executed', `Triggered sandbox verification run...`);
    markEvidence('ev_3');

    const previousPassed = execution ? execution.passedCount : undefined;
    const result = await CodeExecutionService.execute(
      code,
      currentChallenge.language,
      currentChallenge.entryFunction,
      currentChallenge.testCases,
      previousPassed
    );

    setExecution(result);
    setIsRunning(false);

    if (result.success) {
      addEvent('executed', `Verification successful! Passed ${result.passedCount}/${result.totalCount} tests.`, 'success');
    } else {
      addEvent('executed', `Verification failed (${result.passedCount}/${result.totalCount} passed).`, 'failure');
      // Record failure to Error Revision Window / Archive
      StorageService.recordErrorRevision({
        challengeId: currentChallenge.id,
        challengeTitle: currentChallenge.title,
        language: currentChallenge.language,
        concept: currentChallenge.concept,
        buggyCode: currentChallenge.brokenCode,
        attemptedCode: code,
        failureReason: result.syntaxError || `Failed tests (${result.passedCount}/${result.totalCount}). ${result.dynamicFeedback || ''}`,
        passedTests: result.passedCount,
        totalTests: result.totalCount,
      });
    }
  };

  const handleSubmitFix = async () => {
    setIsSubmitting(true);
    addEvent('executed', `Submitting final solution to the Phantom Core...`);
    markEvidence('ev_3');

    const previousPassed = execution ? execution.passedCount : undefined;
    const result = await CodeExecutionService.execute(
      code,
      currentChallenge.language,
      currentChallenge.entryFunction,
      currentChallenge.testCases,
      previousPassed
    );

    setExecution(result);
    setIsSubmitting(false);

    if (result.success) {
      addEvent('solved', `Bug eliminated! Case closed in ${elapsedSeconds} seconds.`, 'success');
      markEvidence('ev_4');

      // Calculate XP bonus
      const bonus = revealedHintLevel === 0 ? 50 : revealedHintLevel === 1 ? 25 : 0;
      const totalXP = currentChallenge.xpReward + bonus;

      // Save user's successful code
      StorageService.saveUserCode(currentChallenge.id, code);

      // Record activity and update streak + XP
      StorageService.recordActivity(currentChallenge.id, totalXP, currentChallenge.concept, 5, revealedHintLevel > 0);

      // If challenge has counterparts in other languages, mark all solved
      if (currentChallenge.slug) {
        const counterparts = CURATED_CHALLENGES.filter(
          (c) => c.slug === currentChallenge.slug
        );
        const prof = StorageService.getProfile();
        let updatedProf = false;
        for (const cp of counterparts) {
          if (!prof.solvedChallengeIds.includes(cp.id)) {
            prof.solvedChallengeIds.push(cp.id);
            updatedProf = true;
          }
        }
        if (updatedProf) {
          StorageService.saveProfile(prof);
        }
      }

      const updated = StorageService.getProfile();
      onUpdateProfile(updated);

      setShowVictory(true);
    } else {
      addEvent('executed', `Submission failed. Case remains unsolved.`, 'failure');
      // Record failure to Error Revision Window / Archive
      StorageService.recordErrorRevision({
        challengeId: currentChallenge.id,
        challengeTitle: currentChallenge.title,
        language: currentChallenge.language,
        concept: currentChallenge.concept,
        buggyCode: currentChallenge.brokenCode,
        attemptedCode: code,
        failureReason: result.syntaxError || `Failed tests (${result.passedCount}/${result.totalCount}). ${result.dynamicFeedback || ''}`,
        passedTests: result.passedCount,
        totalTests: result.totalCount,
      });
    }
  };

  const handleResetCode = () => {
    setCode(currentChallenge.brokenCode);
    StorageService.saveUserCode(currentChallenge.id, currentChallenge.brokenCode);
    setExecution(null);
    setSelectedLine(null);
    setSuspiciousAnalysis(null);
    addEvent('edited', 'Reset code back to original broken state.');
  };

  const handleNextChallenge = () => {
    setShowVictory(false);
    // Filter strictly by the user's selected language
    const langChallenges = CURATED_CHALLENGES.filter(
      (c) => c.language === profile.selectedLanguage
    );

    // Pick next unsolved challenge in this language
    const unsolved = langChallenges.filter((c) => !profile.solvedChallengeIds.includes(c.id));
    let nextCase: Challenge;

    if (unsolved.length > 0) {
      nextCase = unsolved[0];
    } else {
      const curIdx = langChallenges.findIndex((c) => c.id === currentChallenge.id);
      const nextIdx = (curIdx + 1) % langChallenges.length;
      nextCase = langChallenges[nextIdx];
    }

    setCurrentChallenge(nextCase);
    const saved = StorageService.getUserCode(nextCase.id);
    setCode(saved || nextCase.brokenCode);
    setExecution(null);
    setRevealedHintLevel(0);
    setSelectedLine(null);
    setSuspiciousAnalysis(null);
    setElapsedSeconds(0);
    addEvent('opened', `Loaded next case: ${nextCase.title}`);
  };

  const isCurrentSolved = profile.solvedChallengeIds.includes(currentChallenge.id);

  // Dynamic edge case generator based on challenge type
  const getEdgeCaseForChallenge = (ch: Challenge): EdgeCaseTest => {
    if (ch.slug === 'verify_vault_access') {
      return {
        id: `ec_${ch.id}`,
        name: 'Unauthorized Impersonation Boundary',
        description: 'Verifies that unauthorized non-admin requests without tokens are strictly rejected.',
        inputDescription: 'verifyVaultAccess("Intruder", false, false)',
        inputs: ['Intruder', false, false],
        expectedOutput: false,
        explanation: 'Ensures security bounds cannot be bypassed by unknown credentials.',
        trapExplanation: 'Permissive logic conditions may inadvertently leak elevated access.',
      };
    }
    if (ch.slug === 'compute_temporal_drift') {
      return {
        id: `ec_${ch.id}`,
        name: 'Single Reading Minimum Boundary',
        description: 'Verifies behavior when only a single temporal timestamp is recorded.',
        inputDescription: 'Single reading ([42])',
        inputs: [[42]],
        expectedOutput: 0,
        explanation: 'A single element series has zero drift.',
        trapExplanation: 'Loop bounds expecting at least two elements crash or compute NaN.',
      };
    }
    return {
      id: `ec_${ch.id}`,
      name: 'Zero / Empty Array Extreme Boundary',
      description: 'Verifies whether the corrected logic gracefully handles zero or empty input structures.',
      inputDescription: 'Empty input ([])',
      inputs: [[]],
      expectedOutput: 0,
      explanation: 'Boundary verification tests edge case behavior against empty inputs.',
      trapExplanation: 'Flawed implementations frequently crash with ZeroDivisionError or IndexError when inputs are empty.',
    };
  };

  const currentEdgeCase = getEdgeCaseForChallenge(currentChallenge);

  const handleVerifyEdgeCase = async (currentCode: string): Promise<boolean> => {
    const res = await CodeExecutionService.execute(
      currentCode,
      currentChallenge.language,
      currentChallenge.entryFunction,
      [
        {
          id: 'tc_edge_live',
          inputDescription: currentEdgeCase.inputDescription || 'Edge Case Verification',
          inputs: currentEdgeCase.inputs,
          expectedOutput: currentEdgeCase.expectedOutput,
        },
      ]
    );
    return res.success;
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* =========================================================================
          MISSION HEADER BAR
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToMissions}
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-slate-300 dark:text-white/20">•</span>

            {/* Source Label */}
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                currentChallenge.source === 'ai-generated'
                  ? 'bg-cyan-50 dark:bg-phantom-cyan/15 text-cyan-700 dark:text-phantom-cyan border-cyan-300 dark:border-phantom-cyan/40 shadow-sm dark:shadow-glow-cyan'
                  : 'bg-purple-50 dark:bg-phantom-purple/15 text-purple-700 dark:text-phantom-violet border-purple-200 dark:border-phantom-purple/30'
              }`}
            >
              {currentChallenge.source === 'ai-generated' ? '✨ Gemini AI Synthesized' : 'Curated Case File'}
            </span>

            {/* Language & Difficulty Tags */}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-purple-100/70 dark:bg-phantom-purple/20 text-purple-800 dark:text-phantom-cyan border border-purple-200 dark:border-phantom-cyan/30 font-bold">
              {currentChallenge.language}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase border ${
                currentChallenge.difficulty === 'easy'
                  ? 'bg-teal-50 dark:bg-phantom-teal/10 text-teal-700 dark:text-phantom-teal border-teal-200 dark:border-phantom-teal/30'
                  : currentChallenge.difficulty === 'medium'
                  ? 'bg-amber-50 dark:bg-phantom-amber/10 text-amber-700 dark:text-phantom-amber border-amber-200 dark:border-phantom-amber/30'
                  : 'bg-rose-50 dark:bg-phantom-crimson/10 text-rose-700 dark:text-phantom-crimson border-rose-200 dark:border-phantom-crimson/30'
              }`}
            >
              {currentChallenge.difficulty}
            </span>

            {/* Reward */}
            <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-phantom-amber font-bold">
              <Zap className="w-3 h-3 fill-current" />
              <span>+{currentChallenge.xpReward} XP</span>
            </span>

            {/* Stopwatch Timer */}
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-white/50 bg-slate-100 dark:bg-black/40 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
              <Clock className="w-3 h-3 text-cyan-600 dark:text-phantom-cyan" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </span>

            {/* Solved Status Indicator */}
            {isCurrentSolved && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-phantom-teal/20 text-teal-800 dark:text-phantom-teal border border-teal-300 dark:border-phantom-teal/40 text-[11px] font-mono font-bold shadow-sm">
                <Check className="w-3 h-3" />
                <span>Solved</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{currentChallenge.title}</span>
            {isCurrentSolved && (
              <span title="Solved">
                <CheckCircle className="w-5 h-5 text-teal-600 dark:text-phantom-teal shrink-0" />
              </span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed max-w-3xl">
            {currentChallenge.storyContext}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-white/50 font-mono">
            <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-violet" />
            <span>Target Concept: </span>
            <span className="text-purple-700 dark:text-phantom-cyan font-semibold">{currentChallenge.concept}</span>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <span className="text-slate-400 dark:text-white/40 italic">Click any line number in gutter to inspect suspicious logic</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* AI vs Human Speed Benchmark */}
          <button
            onClick={() => setShowSpeedModal(true)}
            title="Compare your debugging time vs AI benchmark"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-phantom-amber/10 hover:bg-amber-100 dark:hover:bg-phantom-amber/20 text-amber-700 dark:text-phantom-amber border border-amber-200 dark:border-phantom-amber/30 text-xs font-semibold transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Benchmark</span>
          </button>

          {/* Edge Case Hunter */}
          <button
            onClick={() => setShowEdgeCaseModal(true)}
            title="Test adversarial boundary cases"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-phantom-crimson/10 hover:bg-rose-100 dark:hover:bg-phantom-crimson/20 text-rose-700 dark:text-phantom-crimson border border-rose-200 dark:border-phantom-crimson/30 text-xs font-semibold transition-all"
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edge Cases</span>
          </button>

          <button
            onClick={handleNextChallenge}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all"
            title="Next challenge in this language"
          >
            <span>Next Case</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-phantom-purple/20 dark:hover:bg-phantom-purple/30 text-purple-900 dark:text-phantom-cyan border border-purple-300 dark:border-phantom-purple/40 text-xs font-semibold shadow-sm dark:shadow-glow-purple transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>Generate AI Case</span>
          </button>
        </div>
      </div>

      {/* Persistent Solved Banner if already completed */}
      {isCurrentSolved && (
        <div className="p-3 rounded-xl bg-phantom-teal/10 border border-phantom-teal/30 text-xs text-phantom-teal flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-phantom-teal" />
            <span>
              <strong>Case Solved:</strong> You have previously banished this bug! Your latest code is saved.
            </span>
          </div>
          <button
            onClick={handleNextChallenge}
            className="px-2.5 py-1 rounded bg-phantom-teal text-black font-bold text-[11px] hover:brightness-110 transition-all"
          >
            Go to Next Unsolved Case &rarr;
          </button>
        </div>
      )}

      {/* Suspicious Line Forensic Drawer (reveals when user clicks line gutter) */}
      {suspiciousAnalysis && (
        <SuspiciousLinePanel
          analysis={suspiciousAnalysis}
          onClose={() => {
            setSuspiciousAnalysis(null);
            setSelectedLine(null);
          }}
        />
      )}

      {/* =========================================================================
          MAIN DEBUGGING WORKSPACE GRID (2-Columns on Desktop)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
        {/* Left Column: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[600px]">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language={currentChallenge.language}
            onReset={handleResetCode}
            onRun={handleRunTests}
            onSubmit={handleSubmitFix}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            onSelectLine={handleSelectLine}
            selectedLine={selectedLine}
          />
        </div>

        {/* Right Column: Split Panels (Output & Progressive Hints) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[600px] overflow-y-auto pr-1">
          {/* Progressive Hints Card */}
          <div className="shrink-0 max-h-[300px]">
            <ProgressiveHintsPanel
              hints={currentChallenge.hints}
              revealedLevel={revealedHintLevel}
              onRevealNext={() => {
                const nextLvl = Math.min(3, revealedHintLevel + 1);
                setRevealedHintLevel(nextLvl);
                addEvent('hint', `Requested Detective Clue Level ${nextLvl}`);
              }}
              onRevealSolution={() => {
                setRevealedHintLevel(4);
                addEvent('hint', 'Revealed complete verified solution.');
              }}
              onApplySolution={(sol) => {
                handleCodeChange(sol);
                addEvent('edited', 'Applied solution directly to editor.');
              }}
            />
          </div>

          {/* Forensic Tabs Strip: Tests, Predict, Evidence, Replay */}
          <div className="flex-1 flex flex-col rounded-xl bg-white dark:bg-phantom-deep border border-slate-200 dark:border-phantom-border/60 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
            <div className="flex items-center border-b border-slate-200 dark:border-phantom-border/60 bg-slate-50 dark:bg-[#070b18] px-2 pt-2 gap-1 select-none overflow-x-auto">
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono font-medium transition-colors border-t border-x ${
                  activeTab === 'tests'
                    ? 'bg-white dark:bg-phantom-deep border-slate-200 dark:border-phantom-border text-cyan-600 dark:text-phantom-cyan font-bold'
                    : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Suite</span>
              </button>

              <button
                onClick={() => setActiveTab('predict')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono font-medium transition-colors border-t border-x ${
                  activeTab === 'predict'
                    ? 'bg-white dark:bg-phantom-deep border-slate-200 dark:border-phantom-border text-purple-600 dark:text-phantom-violet font-bold'
                    : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Predict</span>
              </button>

              <button
                onClick={() => setActiveTab('evidence')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono font-medium transition-colors border-t border-x ${
                  activeTab === 'evidence'
                    ? 'bg-white dark:bg-phantom-deep border-slate-200 dark:border-phantom-border text-teal-600 dark:text-phantom-teal font-bold'
                    : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Evidence</span>
              </button>

              <button
                onClick={() => setActiveTab('replay')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono font-medium transition-colors border-t border-x ${
                  activeTab === 'replay'
                    ? 'bg-white dark:bg-phantom-deep border-slate-200 dark:border-phantom-border text-amber-600 dark:text-phantom-amber font-bold'
                    : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-3 flex-1 overflow-y-auto">
              {activeTab === 'tests' && (
                <TestResultsPanel execution={execution} isRunning={isRunning || isSubmitting} />
              )}

              {activeTab === 'predict' && (
                <PredictionCard
                  predictions={currentChallenge.predictions}
                  onPredicted={(isCorrect) => {
                    markEvidence('ev_2');
                    addEvent(
                      'predicted',
                      `Submitted prediction hypothesis: ${isCorrect ? 'Correct!' : 'Incorrect'}`,
                      isCorrect ? 'success' : 'failure'
                    );
                  }}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceBoard evidence={evidenceItems} caseId={currentChallenge.id} />
              )}

              {activeTab === 'replay' && <InvestigationReplay events={events} />}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={showVictory}
        challenge={currentChallenge}
        hintsUsedCount={revealedHintLevel}
        onNext={handleNextChallenge}
        onClose={() => setShowVictory(false)}
      />

      {/* AI On-Demand Generator Modal */}
      <AICaseGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onChallengeLoaded={(newCh) => {
          setCurrentChallenge(newCh);
          setCode(newCh.brokenCode);
          StorageService.saveUserCode(newCh.id, newCh.brokenCode);
          setExecution(null);
          setRevealedHintLevel(0);
          setSelectedLine(null);
          setSuspiciousAnalysis(null);
          addEvent('opened', `Generated AI challenge: ${newCh.title}`);
        }}
        currentLanguage={currentChallenge.language}
      />

      {/* AI vs Human Speed Modal */}
      <AIVsHumanSpeedModal
        isOpen={showSpeedModal}
        onClose={() => setShowSpeedModal(false)}
        aiBenchmarkSeconds={currentChallenge.estimatedMinutes ? currentChallenge.estimatedMinutes * 45 : 120}
        playerSeconds={elapsedSeconds}
        solved={isCurrentSolved}
        onContinue={() => setShowSpeedModal(false)}
      />

      {/* Edge Case Hunter Modal */}
      <EdgeCaseChallengeModal
        isOpen={showEdgeCaseModal}
        onClose={() => setShowEdgeCaseModal(false)}
        edgeCase={currentEdgeCase}
        onVerifyEdgeCase={handleVerifyEdgeCase}
        currentCode={code}
        onSuccess={() => {
          addEvent('edge_case', 'Passed Adversarial Edge Case Hunter test!', 'success');
        }}
      />
    </div>
  );
};
