export type Language = 'python' | 'javascript';

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

export interface Challenge {
  id: string;
  title: string;
  storyContext: string;
  language: Language;
  difficulty: Difficulty;
  concept: string;            // e.g. "Array Indexing / Boundary", "Calculation Precedence"
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
  slug?: string;              // Cross-language identifier (e.g. "the_lost_robot")
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
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;     // YYYY-MM-DD
  selectedLanguage: Language;
  selectedMode: 'learn' | 'hunt';
  solvedChallengeIds: string[];
  revealedHints: Record<string, number>; // challengeId -> highest hint level unlocked (1, 2, 3, 4=solution)
  completedLessons: string[];
  achievements: Achievement[];
  dailyQuests: DailyQuest[];
  savedCode?: Record<string, string>; // challengeId -> latest edited code
  lastActiveChallengeId?: string;
  isGuest: boolean;
  apiKeyConfigured: boolean;
  customApiKey?: string;
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
}
