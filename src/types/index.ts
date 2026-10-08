export type Language = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ChallengeSource = 'ai-generated' | 'curated-fallback';

export interface TestCase {
  id: string;
  inputDescription: string;
  inputs: Record<string, any> | any[];
  expectedOutput: any;
  explanation?: string;
  isHidden?: boolean;
}

export interface ProgressiveHints {
  hint1_shadow: string;       // Point toward suspicious section
  hint2_clue: string;         // Explain relevant concept
  hint3_narrow: string;       // Suggest specific debugging direction
  solution: string;           // Reference corrected code
  solutionExplanation: string;// Why this fix works
}

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SuspiciousLineAnalysis {
  lineNumber: number;
  codeSnippet: string;
  potentialIssue: string;
  whySuspicious: string;
  relatedConcept: string;
  possibleConsequence: string;
  detectiveAdvice?: string;
}

export interface EdgeCaseTest {
  id: string;
  name?: string;
  description: string;
  inputs: any[];
  expectedOutput: any;
  explanation?: string;
  inputDescription?: string;
  trapExplanation?: string;
}

export interface Challenge {
  id: string;
  slug?: string;              // Cross-language identifier (e.g. "the_lost_robot")
  title: string;
  storyContext: string;
  language: Language;
  difficulty: Difficulty;
  concept: string;            // e.g. "Array Indexing / Boundary", "Calculation Precedence"
  bugType?: string;           // e.g. "Off-by-One", "Logic Inversion", "Type Coercion"
  brokenCode: string;
  expectedBehavior: string;
  actualBehavior: string;
  testCases: TestCase[];
  hints: ProgressiveHints;
  explanationOfBug: string;
  explanationOfCorrection: string;
  estimatedMinutes: number;
  xpReward: number;
  source: ChallengeSource;
  zone?: string;
  entryFunction: string;      // Name of the function to test
  predictions?: PredictionOption[];
  suspiciousLines?: Record<number, SuspiciousLineAnalysis>;
  edgeCase?: EdgeCaseTest;
  aiBenchmarkTimeSeconds?: number;
}

export interface TestResult {
  testId: string;
  passed: boolean;
  inputDescription: string;
  expected: any;
  actual: any;
  error?: string;
  executionTimeMs?: number;
}

export interface ExecutionResult {
  success: boolean;
  passedCount: number;
  totalCount: number;
  results: TestResult[];
  logs: string[];
  syntaxError?: string;
  executionMode: 'client-sandbox' | 'remote-docker' | 'demo-evaluator';
  madeItWorse?: boolean;
  regressionMessage?: string;
  dynamicFeedback?: string;
  diagnosticMessage?: string;
  previousPassedCount?: number;
}

export interface EvidenceItem {
  id: string;
  label: string;
  completed: boolean;
  timestamp?: string;
}

export interface InvestigationEvent {
  id: string;
  timestamp: string;
  type: 'opened' | 'predicted' | 'executed' | 'inspected' | 'hint' | 'edited' | 'solved' | 'edge_case';
  description: string;
  status?: 'success' | 'failure' | 'neutral';
}

export interface ErrorRevisionEntry {
  id: string;
  challengeId: string;
  challengeTitle: string;
  language: Language;
  timestamp: string;
  concept: string;
  buggyCode: string;
  attemptedCode: string;
  failureReason: string;
  passedTests: number;
  totalTests: number;
  reviewed: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'fixes' | 'streaks' | 'skills' | 'special';
  progress: number;
  maxProgress: number;
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
  xp: number;
  minutes: number;
  challengesSolved: string[];
  conceptsPracticed: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  avatarSeed: string;
  role: string;               // e.g. "Phantom Detective"
  rank: string;               // Rookie -> Code Scout -> Bug Tracker -> Logic Detective -> Phantom Hunter -> Debugging Agent -> Code Investigator -> Phantom Master
  rankTitle?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  streakWithoutHints?: number;
  longestStreak: number;
  independentSolvingStreak: number;
  longestIndependentStreak: number;
  lastActiveDate: string;     // YYYY-MM-DD
  selectedLanguage: Language;
  selectedMode: 'learn' | 'hunt';
  solvedChallengeIds: string[];
  revealedHints: Record<string, number>;
  completedLessons: string[];
  achievements: Achievement[];
  dailyQuests: DailyQuest[];
  savedCode?: Record<string, string>;
  lastActiveChallengeId?: string;
  isGuest: boolean;
  apiKeyConfigured: boolean;
  customApiKey?: string;
  errorRevisions: ErrorRevisionEntry[];
  predictionsCount: number;
  predictionsCorrect: number;
  dnaStats: Record<string, { attempts: number; successes: number; avgTimeSec: number }>;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  solvedCount: number;
  streak: number;
  isCurrentUser?: boolean;
  badge?: string;
}

export interface LearnLesson {
  id: string;
  concept: string;
  title: string;
  scenario: string;
  brokenCode: string;
  language: Language;
  expectedBehavior: string;
  bugExplanation: string;
  keyTakeaway: string;
  entryFunction: string;
  testCases: TestCase[];
  xp: number;
  predictions?: PredictionOption[];
  stepByStepHint?: string;
  chapter?: string;
  chapterNumber?: number;
}

export interface BugEncyclopediaEntry {
  id: string;
  name: string;
  icon: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  concept: string;
  whatItIs: string;
  typicalSymptoms: string[];
  codeExample: string;
  howToDetect: string;
  commonMistakes: string[];
  miniChallenge: {
    broken: string;
    fixed: string;
    language: Language;
    task: string;
    entryFn: string;
    testInput: any[];
    expected: any;
  };
}
