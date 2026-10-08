import { UserProfile, ActivityDay, Achievement, DailyQuest, Language } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'codephantom_user_profile',
  ACTIVITY_HISTORY: 'codephantom_activity_history',
  CUSTOM_CHALLENGES: 'codephantom_custom_challenges',
  SAVED_CODE_PREFIX: 'codephantom_code_',
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
    id: 'seven_day_streak',
    title: 'Shadow Stalker',
    description: 'Maintain a 7-day debugging streak.',
    icon: 'flame',
    unlocked: false,
    category: 'streaks',
    progress: 1,
    maxProgress: 7,
  },
  {
    id: 'python_specialist',
    title: 'Serpent Charmer',
    description: 'Solve 5 Python debugging cases.',
    icon: 'terminal',
    unlocked: false,
    category: 'skills',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'js_specialist',
    title: 'Script Whisperer',
    description: 'Solve 5 JavaScript debugging cases.',
    icon: 'code',
    unlocked: false,
    category: 'skills',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'edge_case_hunter',
    title: 'Edge-Case Exorcist',
    description: 'Solve a Hard case with over 4 passing test conditions.',
    icon: 'target',
    unlocked: false,
    category: 'skills',
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

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// Generate realistic initial 365-day activity history
function generateInitialActivityHistory(): Record<string, ActivityDay> {
  const history: Record<string, ActivityDay> = {};
  const today = new Date();

  // Create empty history for last 365 days
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

  // Pre-seed some authentic recent days so user sees realistic heatmap
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
    { offset: 35, count: 3, xp: 220, mins: 20, concepts: ['Boundary Checks'] },
    { offset: 60, count: 4, xp: 340, mins: 32, concepts: ['Algorithms'] },
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
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading user profile from localStorage:', e);
    }

    const defaultProfile: UserProfile = {
      id: 'usr_phantom_' + Math.random().toString(36).substring(2, 9),
      username: 'CodePhantom (You)',
      avatarSeed: 'detective_01',
      role: 'Shadow Sleuth',
      level: 4,
      xp: 1420,
      xpToNextLevel: 2000,
      streak: 4,
      longestStreak: 7,
      lastActiveDate: getTodayDateString(),
      selectedLanguage: 'python',
      selectedMode: 'hunt',
      solvedChallengeIds: [],
      revealedHints: {},
      completedLessons: ['lesson_vars', 'lesson_loops'],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyQuests: INITIAL_DAILY_QUESTS,
      savedCode: {},
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
    minutesSpent = 5
  ): { streakUpdated: boolean; newStreak: number } {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const history = StorageService.getActivityHistory();
    const profile = StorageService.getProfile();

    // Update history day
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

    // Streak logic: calendar day based
    let streakUpdated = false;
    if (profile.lastActiveDate === today) {
      // already active today, streak stays intact
    } else if (profile.lastActiveDate === yesterday) {
      // active yesterday -> streak grows by 1
      profile.streak += 1;
      streakUpdated = true;
      if (profile.streak > profile.longestStreak) {
        profile.longestStreak = profile.streak;
      }
    } else {
      // missed one or more days -> streak restarts at 1
      profile.streak = 1;
      streakUpdated = true;
    }
    profile.lastActiveDate = today;

    // Add XP and check level
    profile.xp += xpGained;
    if (!profile.solvedChallengeIds.includes(challengeId)) {
      profile.solvedChallengeIds.push(challengeId);
    }

    // Level progression curve: 500 XP per level
    const newLevel = Math.max(1, Math.floor(profile.xp / 500) + 1);
    profile.level = newLevel;
    profile.xpToNextLevel = (newLevel * 500);

    // Update detective role title
    if (newLevel >= 10) profile.role = 'Grand Phantom Master';
    else if (newLevel >= 7) profile.role = 'Cipher Specialist';
    else if (newLevel >= 5) profile.role = 'Logic Hunter';
    else if (newLevel >= 3) profile.role = 'Shadow Sleuth';
    else profile.role = 'Novice Detective';

    // Update Daily Quests
    profile.dailyQuests = profile.dailyQuests.map((q) => {
      if (q.id === 'quest_1') {
        const p = Math.min(q.target, q.progress + 1);
        return { ...q, progress: p, completed: p >= q.target };
      }
      return q;
    });

    // Check Achievements
    const totalSolved = profile.solvedChallengeIds.length;
    profile.achievements = profile.achievements.map((ach) => {
      if (ach.id === 'first_fix' && totalSolved >= 1 && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: today, progress: 1 };
      }
      if (ach.id === 'ten_cases') {
        const prog = Math.min(ach.maxProgress, totalSolved);
        return { ...ach, progress: prog, unlocked: prog >= ach.maxProgress && !ach.unlocked ? true : ach.unlocked };
      }
      if (ach.id === 'seven_day_streak') {
        const prog = Math.min(ach.maxProgress, profile.streak);
        return { ...ach, progress: prog, unlocked: prog >= ach.maxProgress && !ach.unlocked ? true : ach.unlocked };
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
  }
}
