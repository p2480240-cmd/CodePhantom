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
} from 'lucide-react';
import { Challenge, ExecutionResult, UserProfile, Language } from '../types';
import { CodeEditor } from '../components/CodeEditor';
import { TestResultsPanel } from '../components/TestResultsPanel';
import { ProgressiveHintsPanel } from '../components/ProgressiveHintsPanel';
import { VictoryModal } from '../components/VictoryModal';
import { AICaseGeneratorModal } from '../components/AICaseGeneratorModal';
import { CodeExecutionService } from '../services/codeExecutionService';
import { StorageService } from '../services/storageService';
import { CURATED_CHALLENGES } from '../services/challengeService';

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
  // Locate or default current challenge
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(() => {
    if (initialChallengeId) {
      const match = CURATED_CHALLENGES.find((c) => c.id === initialChallengeId);
      if (match) return match;
    }
    return CURATED_CHALLENGES[0];
  });

  const [code, setCode] = useState<string>(currentChallenge.brokenCode);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  // Sync state if initial challenge changes
  useEffect(() => {
    if (initialChallengeId) {
      const match = CURATED_CHALLENGES.find((c) => c.id === initialChallengeId);
      if (match) {
        setCurrentChallenge(match);
        setCode(match.brokenCode);
        setExecution(null);
        setRevealedHintLevel(0);
        setShowVictory(false);
      }
    }
  }, [initialChallengeId]);

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

      // Update storage and streak
      StorageService.recordActivity(currentChallenge.id, totalXP, currentChallenge.concept, 5);

      const updated = StorageService.getProfile();
      onUpdateProfile(updated);

      setShowVictory(true);
    }
  };

  const handleResetCode = () => {
    setCode(currentChallenge.brokenCode);
    setExecution(null);
  };

  const handleNextChallenge = () => {
    setShowVictory(false);
    const currentIndex = CURATED_CHALLENGES.findIndex((c) => c.id === currentChallenge.id);
    const nextIndex = (currentIndex + 1) % CURATED_CHALLENGES.length;
    const nextCase = CURATED_CHALLENGES[nextIndex];
    setCurrentChallenge(nextCase);
    setCode(nextCase.brokenCode);
    setExecution(null);
    setRevealedHintLevel(0);
  };

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
            <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-black/40 text-white/70 border border-white/10">
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
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{currentChallenge.title}</span>
            {profile.solvedChallengeIds.includes(currentChallenge.id) && (
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

        {/* Action button to generate a new AI challenge */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-phantom-purple/20 hover:bg-phantom-purple/30 text-phantom-cyan border border-phantom-purple/40 text-xs font-semibold shadow-glow-purple transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>Generate AI Case</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN DEBUGGING WORKSPACE GRID (2-Columns on Desktop)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
        {/* Left Column: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[580px]">
          <CodeEditor
            code={code}
            onChange={setCode}
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
              onApplySolution={(sol) => setCode(sol)}
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
          setExecution(null);
          setRevealedHintLevel(0);
        }}
        currentLanguage={currentChallenge.language}
      />
    </div>
  );
};
