import { UserProfile, ActivityDay, Achievement, DailyQuest, Language, ErrorRevisionEntry } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'codephantom_user_profile',
  ACTIVITY_HISTORY: 'codephantom_activity_history',
  CUSTOM_CHALLENGES: 'codephantom_custom_challenges',
  SAVED_CODE_PREFIX: 'codephantom_code_',
  ERROR_REVISIONS: 'codephantom_error_revisions',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_fix',
    title: 'First Shadow Banished',
    description: 'Solve your very first broken code case.',
    icon: 'sparkles',
    unlocked: false,
    category: 'fixes',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ten_cases',
    title: 'Code Sleuth',
    description: 'Successfully fix 10 debugging missions.',
    icon: 'search',
    unlocked: false,
    category: 'fixes',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'fifty_cases',
    title: 'Master Investigator',
    description: 'Solve 50 debugging cases.',
    icon: 'shield',
    unlocked: false,
    category: 'fixes',
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'no_hint_detective',
    title: 'Pure Deduction',
    description: 'Solve a Medium or Hard case without using any clues.',
    icon: 'eye-off',
    unlocked: false,
    category: 'skills',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'three_no_hint_solves',
    title: 'Shadow Stalker: Unassisted',
    description: 'Solve 3 cases in a row with zero clues requested.',
    icon: 'zap',
    unlocked: false,
    category: 'streaks',
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'seven_day_streak',
    title: 'Relentless Investigator',
    description: 'Maintain a 7-day debugging streak.',
    icon: 'flame',
    unlocked: false,
    category: 'streaks',
    progress: 1,
    maxProgress: 7,
  },
  {
    id: 'edge_case_hunter',
    title: 'Edge-Case Exorcist',
    description: 'Successfully expose and banish an Edge Case shadow.',
    icon: 'target',
    unlocked: false,
    category: 'skills',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ai_outsmart',
    title: 'Beat the Phantom',
    description: 'Outpace the AI benchmark estimation in Speed Challenge mode.',
    icon: 'cpu',
    unlocked: false,
    category: 'special',
    progress: 0,
    maxProgress: 1,
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest_1',
    title: 'Daily Investigation',
    description: 'Complete 1 Hunt Mode debugging challenge.',
    xp: 50,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_2',
    title: 'Stealth Detective',
    description: 'Solve any challenge without requesting Hint 3 or Solution.',
    xp: 75,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_3',
    title: 'Concept Mastery',
    description: 'Complete 1 interactive lesson in Learn Mode.',
    xp: 60,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
  },
];

export function getRankTitle(level: number): string {
  if (level >= 8) return 'Phantom Master';
  if (level === 7) return 'Code Investigator';
  if (level === 6) return 'Debugging Agent';
  if (level === 5) return 'Phantom Hunter';
  if (level === 4) return 'Logic Detective';
  if (level === 3) return 'Bug Tracker';
  if (level === 2) return 'Code Scout';
  return 'Rookie';
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function generateInitialActivityHistory(): Record<string, ActivityDay> {
  const history: Record<string, ActivityDay> = {};
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    history[dateStr] = {
      date: dateStr,
      count: 0,
      xp: 0,
      minutes: 0,
      challengesSolved: [],
      conceptsPracticed: [],
    };
  }

  // Pre-seed realistic days
  const seededOffsets = [
    { offset: 0, count: 2, xp: 200, mins: 15, concepts: ['Loops', 'Boundary Errors'] },
    { offset: 1, count: 3, xp: 280, mins: 22, concepts: ['Off-By-One', 'Lists'] },
    { offset: 2, count: 1, xp: 100, mins: 8, concepts: ['Conditionals'] },
    { offset: 3, count: 4, xp: 350, mins: 30, concepts: ['Functions', 'Objects'] },
    { offset: 5, count: 2, xp: 180, mins: 14, concepts: ['Strings'] },
    { offset: 6, count: 1, xp: 90, mins: 10, concepts: ['Math Logic'] },
    { offset: 9, count: 3, xp: 250, mins: 25, concepts: ['Recursion'] },
    { offset: 14, count: 2, xp: 160, mins: 18, concepts: ['Loops'] },
    { offset: 20, count: 5, xp: 480, mins: 45, concepts: ['Data Structures'] },
  ];

  seededOffsets.forEach(({ offset, count, xp, mins, concepts }) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    const dateStr = d.toISOString().split('T')[0];
    if (history[dateStr]) {
      history[dateStr] = {
        date: dateStr,
        count,
        xp,
        minutes: mins,
        challengesSolved: [`seed_case_${offset}`],
        conceptsPracticed: concepts,
      };
    }
  });

  return history;
}

export class StorageService {
  static getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.solvedChallengeIds) parsed.solvedChallengeIds = [];
        if (!parsed.savedCode) parsed.savedCode = {};
        if (!parsed.errorRevisions) parsed.errorRevisions = StorageService.getErrorRevisions();
        if (parsed.independentSolvingStreak === undefined) parsed.independentSolvingStreak = 1;
        if (parsed.longestIndependentStreak === undefined) parsed.longestIndependentStreak = 2;
        if (!parsed.rank) parsed.rank = getRankTitle(parsed.level || 4);
        if (parsed.predictionsCount === undefined) parsed.predictionsCount = 6;
        if (parsed.predictionsCorrect === undefined) parsed.predictionsCorrect = 5;
        if (!parsed.dnaStats) {
          parsed.dnaStats = {
            'Logic Errors': { attempts: 8, successes: 7, avgTimeSec: 140 },
            'Loops & Iteration': { attempts: 10, successes: 8, avgTimeSec: 180 },
            'Functions & Scope': { attempts: 6, successes: 5, avgTimeSec: 120 },
            'Array Indexing & Boundaries': { attempts: 9, successes: 4, avgTimeSec: 230 },
            'Exception & Types': { attempts: 5, successes: 4, avgTimeSec: 150 },
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading user profile from localStorage:', e);
    }

    const defaultProfile: UserProfile = {
      id: 'usr_phantom_' + Math.random().toString(36).substring(2, 9),
      username: 'CodePhantom (You)',
      avatarSeed: 'detective_01',
      role: 'Logic Detective',
      rank: 'Logic Detective',
      level: 4,
      xp: 1420,
      xpToNextLevel: 2000,
      streak: 4,
      longestStreak: 7,
      independentSolvingStreak: 2,
      longestIndependentStreak: 3,
      lastActiveDate: getTodayDateString(),
      selectedLanguage: 'python',
      selectedMode: 'hunt',
      solvedChallengeIds: [],
      revealedHints: {},
      completedLessons: ['lesson_vars', 'lesson_loops'],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyQuests: INITIAL_DAILY_QUESTS,
      savedCode: {},
      errorRevisions: [],
      predictionsCount: 5,
      predictionsCorrect: 4,
      dnaStats: {
        'Logic Errors': { attempts: 8, successes: 7, avgTimeSec: 140 },
        'Loops & Iteration': { attempts: 10, successes: 8, avgTimeSec: 180 },
        'Functions & Scope': { attempts: 6, successes: 5, avgTimeSec: 120 },
        'Array Indexing & Boundaries': { attempts: 9, successes: 4, avgTimeSec: 230 },
        'Exception & Types': { attempts: 5, successes: 4, avgTimeSec: 150 },
      },
      isGuest: true,
      apiKeyConfigured: Boolean(import.meta.env.VITE_GEMINI_API_KEY),
      customApiKey: '',
    };

    StorageService.saveProfile(defaultProfile);
    return defaultProfile;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }

  static saveUserCode(challengeId: string, code: string): void {
    try {
      localStorage.setItem(`${STORAGE_KEYS.SAVED_CODE_PREFIX}${challengeId}`, code);
      const profile = StorageService.getProfile();
      if (!profile.savedCode) profile.savedCode = {};
      profile.savedCode[challengeId] = code;
      StorageService.saveProfile(profile);
    } catch (e) {
      console.warn('Failed to save user code to storage:', e);
    }
  }

  static getUserCode(challengeId: string): string | null {
    try {
      const direct = localStorage.getItem(`${STORAGE_KEYS.SAVED_CODE_PREFIX}${challengeId}`);
      if (direct) return direct;
      const profile = StorageService.getProfile();
      return profile.savedCode?.[challengeId] || null;
    } catch (e) {
      return null;
    }
  }

  static clearUserCode(challengeId: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.SAVED_CODE_PREFIX}${challengeId}`);
      const profile = StorageService.getProfile();
      if (profile.savedCode && profile.savedCode[challengeId]) {
        delete profile.savedCode[challengeId];
        StorageService.saveProfile(profile);
      }
    } catch (e) {}
  }

  // =========================================================================
  // ERROR REVISION NOTEBOOK ARCHIVE
  // =========================================================================
  static getErrorRevisions(): ErrorRevisionEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ERROR_REVISIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Seed sample illustrative revision so the window isn't empty on day 1
    const defaultRevisions: ErrorRevisionEntry[] = [
      {
        id: 'rev_seed_1',
        challengeId: 'the_lost_robot_py',
        challengeTitle: 'The Lost Robot',
        language: 'python',
        timestamp: 'Today, 10:24 AM',
        concept: 'Array Indexing & Boundary Errors',
        buggyCode: 'for i in range(len(waypoints) + 1):',
        attemptedCode: 'for i in range(len(waypoints) + 1):\n    active_path.append(waypoints[i])',
        failureReason: 'IndexError: list index out of range at len(waypoints)',
        passedTests: 1,
        totalTests: 3,
        reviewed: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ERROR_REVISIONS, JSON.stringify(defaultRevisions));
    return defaultRevisions;
  }

  static recordErrorRevision(entry: Omit<ErrorRevisionEntry, 'id' | 'timestamp' | 'reviewed'>): void {
    try {
      const existing = StorageService.getErrorRevisions();
      const newEntry: ErrorRevisionEntry = {
        ...entry,
        id: 'rev_' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reviewed: false,
      };
      // Keep up to 20 recent error revisions
      const updated = [newEntry, ...existing].slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.ERROR_REVISIONS, JSON.stringify(updated));

      const profile = StorageService.getProfile();
      profile.errorRevisions = updated;
      StorageService.saveProfile(profile);
    } catch (e) {
      console.warn('Failed to record error revision:', e);
    }
  }

  static markErrorReviewed(revisionId: string): void {
    try {
      const existing = StorageService.getErrorRevisions();
      const updated = existing.map((r) => (r.id === revisionId ? { ...r, reviewed: true } : r));
      localStorage.setItem(STORAGE_KEYS.ERROR_REVISIONS, JSON.stringify(updated));

      const profile = StorageService.getProfile();
      profile.errorRevisions = updated;
      StorageService.saveProfile(profile);
    } catch (e) {}
  }

  static recordPrediction(isCorrect: boolean): void {
    const profile = StorageService.getProfile();
    profile.predictionsCount = (profile.predictionsCount || 0) + 1;
    if (isCorrect) {
      profile.predictionsCorrect = (profile.predictionsCorrect || 0) + 1;
    }
    StorageService.saveProfile(profile);
  }

  static getActivityHistory(): Record<string, ActivityDay> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading activity history:', e);
    }

    const initial = generateInitialActivityHistory();
    StorageService.saveActivityHistory(initial);
    return initial;
  }

  static saveActivityHistory(history: Record<string, ActivityDay>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save activity history:', e);
    }
  }

  static recordActivity(
    challengeId: string,
    xpGained: number,
    concept: string,
    minutesSpent = 5,
    usedHints = false
  ): { streakUpdated: boolean; newStreak: number } {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const history = StorageService.getActivityHistory();
    const profile = StorageService.getProfile();

    if (!history[today]) {
      history[today] = {
        date: today,
        count: 0,
        xp: 0,
        minutes: 0,
        challengesSolved: [],
        conceptsPracticed: [],
      };
    }

    history[today].count += 1;
    history[today].xp += xpGained;
    history[today].minutes += minutesSpent;
    if (!history[today].challengesSolved.includes(challengeId)) {
      history[today].challengesSolved.push(challengeId);
    }
    if (!history[today].conceptsPracticed.includes(concept)) {
      history[today].conceptsPracticed.push(concept);
    }
    StorageService.saveActivityHistory(history);

    // Streak logic
    let streakUpdated = false;
    if (profile.lastActiveDate === today) {
      // already active today
    } else if (profile.lastActiveDate === yesterday) {
      profile.streak += 1;
      streakUpdated = true;
      if (profile.streak > profile.longestStreak) {
        profile.longestStreak = profile.streak;
      }
    } else {
      profile.streak = 1;
      streakUpdated = true;
    }
    profile.lastActiveDate = today;

    // Independent solving streak
    if (!usedHints) {
      profile.independentSolvingStreak = (profile.independentSolvingStreak || 0) + 1;
      if (profile.independentSolvingStreak > (profile.longestIndependentStreak || 0)) {
        profile.longestIndependentStreak = profile.independentSolvingStreak;
      }
    } else {
      profile.independentSolvingStreak = 0;
    }

    // Add XP and level calculation
    profile.xp += xpGained;
    if (!profile.solvedChallengeIds.includes(challengeId)) {
      profile.solvedChallengeIds.push(challengeId);
    }

    const newLevel = Math.max(1, Math.floor(profile.xp / 500) + 1);
    profile.level = newLevel;
    profile.xpToNextLevel = newLevel * 500;
    profile.rank = getRankTitle(newLevel);
    profile.role = profile.rank;

    // Update Bug DNA
    if (!profile.dnaStats) profile.dnaStats = {};
    if (!profile.dnaStats[concept]) {
      profile.dnaStats[concept] = { attempts: 0, successes: 0, avgTimeSec: 150 };
    }
    profile.dnaStats[concept].attempts += 1;
    profile.dnaStats[concept].successes += 1;

    // Daily Quests
    profile.dailyQuests = profile.dailyQuests.map((q) => {
      if (q.id === 'quest_1') {
        const p = Math.min(q.target, q.progress + 1);
        return { ...q, progress: p, completed: p >= q.target };
      }
      if (q.id === 'quest_2' && !usedHints) {
        return { ...q, progress: 1, completed: true };
      }
      return q;
    });

    // Check Achievements
    const totalSolved = profile.solvedChallengeIds.length;
    profile.achievements = profile.achievements.map((ach) => {
      if (ach.id === 'first_fix' && totalSolved >= 1) {
        return { ...ach, unlocked: true, unlockedAt: today, progress: 1 };
      }
      if (ach.id === 'ten_cases') {
        const p = Math.min(ach.maxProgress, totalSolved);
        return { ...ach, progress: p, unlocked: p >= ach.maxProgress || ach.unlocked };
      }
      if (ach.id === 'no_hint_detective' && !usedHints) {
        return { ...ach, unlocked: true, unlockedAt: today, progress: 1 };
      }
      if (ach.id === 'three_no_hint_solves' && (profile.independentSolvingStreak || 0) >= 3) {
        return { ...ach, unlocked: true, unlockedAt: today, progress: 3 };
      }
      return ach;
    });

    StorageService.saveProfile(profile);
    return { streakUpdated, newStreak: profile.streak };
  }

  static resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.ERROR_REVISIONS);
  }
}
