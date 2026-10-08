import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Challenge, ExecutionResult, UserProfile, Language } from '../types';
import { CodeEditor } from '../components/CodeEditor';
import { TestResultsPanel } from '../components/TestResultsPanel';
import { ProgressiveHintsPanel } from '../components/ProgressiveHintsPanel';
import { VictoryModal } from '../components/VictoryModal';
import { AICaseGeneratorModal } from '../components/AICaseGeneratorModal';
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
      }
    }
  }, [initialChallengeId]);

  // Handle user typing code in editor: save to state and persist to localStorage
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    StorageService.saveUserCode(currentChallenge.id, newCode);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    const result = await CodeExecutionService.execute(
      code,
      currentChallenge.language,
      currentChallenge.entryFunction,
      currentChallenge.testCases
    );
    setExecution(result);
    setIsRunning(false);
  };

  const handleSubmitFix = async () => {
    setIsSubmitting(true);
    const result = await CodeExecutionService.execute(
      code,
      currentChallenge.language,
      currentChallenge.entryFunction,
      currentChallenge.testCases
    );
    setExecution(result);
    setIsSubmitting(false);

    if (result.success) {
      // Calculate XP bonus
      const bonus = revealedHintLevel === 0 ? 50 : revealedHintLevel === 1 ? 25 : 0;
      const totalXP = currentChallenge.xpReward + bonus;

      // Save user's successful code
      StorageService.saveUserCode(currentChallenge.id, code);

      // Record activity and update streak + XP
      StorageService.recordActivity(currentChallenge.id, totalXP, currentChallenge.concept, 5);

      // If challenge has a counterpart in another language, also mark it solved
      if (currentChallenge.slug) {
        const counterpart = CURATED_CHALLENGES.find(
          (c) => c.slug === currentChallenge.slug && c.id !== currentChallenge.id
        );
        if (counterpart) {
          const prof = StorageService.getProfile();
          if (!prof.solvedChallengeIds.includes(counterpart.id)) {
            prof.solvedChallengeIds.push(counterpart.id);
            StorageService.saveProfile(prof);
          }
        }
      }

      const updated = StorageService.getProfile();
      onUpdateProfile(updated);

      setShowVictory(true);
    }
  };

  const handleResetCode = () => {
    setCode(currentChallenge.brokenCode);
    StorageService.saveUserCode(currentChallenge.id, currentChallenge.brokenCode);
    setExecution(null);
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
  };

  const isCurrentSolved = profile.solvedChallengeIds.includes(currentChallenge.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* =========================================================================
          MISSION HEADER BAR
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-phantom-deep border border-phantom-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToMissions}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-white/20">•</span>

            {/* Source Label */}
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                currentChallenge.source === 'ai-generated'
                  ? 'bg-phantom-cyan/15 text-phantom-cyan border-phantom-cyan/40 shadow-glow-cyan'
                  : 'bg-phantom-purple/15 text-phantom-violet border-phantom-purple/30'
              }`}
            >
              {currentChallenge.source === 'ai-generated' ? '✨ Gemini AI Synthesized' : 'Curated Case File'}
            </span>

            {/* Language & Difficulty Tags */}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-phantom-purple/20 text-phantom-cyan border border-phantom-cyan/30 font-bold">
              {currentChallenge.language}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase border ${
                currentChallenge.difficulty === 'easy'
                  ? 'bg-phantom-teal/10 text-phantom-teal border-phantom-teal/30'
                  : currentChallenge.difficulty === 'medium'
                  ? 'bg-phantom-amber/10 text-phantom-amber border-phantom-amber/30'
                  : 'bg-phantom-crimson/10 text-phantom-crimson border-phantom-crimson/30'
              }`}
            >
              {currentChallenge.difficulty}
            </span>

            {/* Reward */}
            <span className="flex items-center gap-1 text-[11px] font-mono text-phantom-amber font-bold">
              <Zap className="w-3 h-3 fill-current" />
              <span>+{currentChallenge.xpReward} XP</span>
            </span>

            {/* Solved Status Indicator */}
            {isCurrentSolved && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-phantom-teal/20 text-phantom-teal border border-phantom-teal/40 text-[11px] font-mono font-bold shadow-sm">
                <Check className="w-3 h-3" />
                <span>Solved</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{currentChallenge.title}</span>
            {isCurrentSolved && (
              <span title="Solved">
                <CheckCircle className="w-5 h-5 text-phantom-teal shrink-0" />
              </span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-3xl">
            {currentChallenge.storyContext}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-white/50 font-mono">
            <Tag className="w-3.5 h-3.5 text-phantom-violet" />
            <span>Target Concept: </span>
            <span className="text-phantom-cyan font-semibold">{currentChallenge.concept}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNextChallenge}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            title="Next challenge in this language"
          >
            <span>Next Case</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-phantom-purple/20 hover:bg-phantom-purple/30 text-phantom-cyan border border-phantom-purple/40 text-xs font-semibold shadow-glow-purple transition-all active:scale-95"
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

      {/* =========================================================================
          MAIN DEBUGGING WORKSPACE GRID (2-Columns on Desktop)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
        {/* Left Column: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[580px]">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language={currentChallenge.language}
            onReset={handleResetCode}
            onRun={handleRunTests}
            onSubmit={handleSubmitFix}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column: Split Panels (Output & Progressive Hints) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[580px] overflow-y-auto pr-1">
          {/* Progressive Hints Card */}
          <div className="shrink-0 max-h-[310px]">
            <ProgressiveHintsPanel
              hints={currentChallenge.hints}
              revealedLevel={revealedHintLevel}
              onRevealNext={() => setRevealedHintLevel((prev) => Math.min(3, prev + 1))}
              onRevealSolution={() => setRevealedHintLevel(4)}
              onApplySolution={(sol) => handleCodeChange(sol)}
            />
          </div>

          {/* Test Results Diagnostics Card */}
          <div className="flex-1">
            <TestResultsPanel execution={execution} isRunning={isRunning || isSubmitting} />
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
        }}
        currentLanguage={currentChallenge.language}
      />
    </div>
  );
};
