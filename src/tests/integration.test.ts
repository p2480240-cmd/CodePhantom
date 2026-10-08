import { describe, it, expect, beforeEach } from 'vitest';
import { ChallengeService } from '../services/challengeService';
import { LearnService } from '../services/learnService';
import { StorageService } from '../services/storageService';
import { CodeExecutionService } from '../services/codeExecutionService';
import { Language } from '../types';

describe('Integration & End-to-End Workflows', () => {
  beforeEach(() => {
    StorageService.resetAllData();
  });

  describe('1. Challenge Selection and Querying', () => {
    it('retrieves all challenges for all supported languages', () => {
      const languages: Language[] = ['javascript', 'typescript', 'python', 'cpp', 'java'];
      for (const lang of languages) {
        const challenges = ChallengeService.getChallengesByLanguage(lang);
        expect(challenges.length).toBeGreaterThan(0);
        challenges.forEach(c => {
          expect(c.id).toBeDefined();
          expect(c.title).toBeTruthy();
          expect(c.brokenCode).toBeTruthy();
          expect(c.testCases.length).toBeGreaterThan(0);
          expect(c.entryFunction).toBeTruthy();
        });
      }
    });

    it('filters challenges by difficulty level', () => {
      const easy = ChallengeService.getChallengesByDifficulty('easy');
      const medium = ChallengeService.getChallengesByDifficulty('medium');
      const hard = ChallengeService.getChallengesByDifficulty('hard');

      expect(easy.length).toBeGreaterThan(0);
      expect(medium.length).toBeGreaterThan(0);
      expect(hard.length).toBeGreaterThan(0);

      expect(easy.every(c => c.difficulty === 'easy')).toBe(true);
      expect(medium.every(c => c.difficulty === 'medium')).toBe(true);
      expect(hard.every(c => c.difficulty === 'hard')).toBe(true);
    });

    it('gracefully handles non-existent challenge ID lookup', () => {
      const result = ChallengeService.getChallengeById('non-existent-challenge-id-999');
      expect(result).toBeUndefined();
    });

    it('switches challenge language cleanly while matching concept slug', () => {
      const pyChallenge = ChallengeService.getChallengeById('calculate_average');
      expect(pyChallenge).toBeDefined();
      if (pyChallenge) {
        const jsCounterpart = ChallengeService.getChallengeForLanguage(pyChallenge, 'javascript');
        expect(jsCounterpart).toBeDefined();
        expect(jsCounterpart.language).toBe('javascript');
      }
    });
  });

  describe('2. End-to-End Code Execution & Reverse Debugging', () => {
    it('evaluates broken code and reports test failures accurately', async () => {
      const challenge = ChallengeService.getChallengeById('calculate_average');
      expect(challenge).toBeDefined();

      if (challenge) {
        const result = await CodeExecutionService.execute(
          challenge.brokenCode,
          challenge.language,
          challenge.entryFunction,
          challenge.testCases
        );

        expect(result.totalCount).toBe(challenge.testCases.length);
        expect(result.passedCount).toBeLessThan(result.totalCount);
        expect(result.success).toBe(false);
      }
    });

    it('evaluates repaired code and confirms full suite pass', async () => {
      const challenge = ChallengeService.getChallengeById('calculate_average');
      expect(challenge).toBeDefined();

      if (challenge) {
        const fixedCode = challenge.hints.solution;
        const result = await CodeExecutionService.execute(
          fixedCode,
          challenge.language,
          challenge.entryFunction,
          challenge.testCases
        );

        expect(result.totalCount).toBe(challenge.testCases.length);
        expect(result.passedCount).toBe(result.totalCount);
        expect(result.success).toBe(true);
      }
    });

    it('evaluates JavaScript challenge repair and test cases', async () => {
      const jsChallenge = ChallengeService.getChallengesByLanguage('javascript')[0];
      expect(jsChallenge).toBeDefined();

      if (jsChallenge) {
        // Run broken code
        const brokenResult = await CodeExecutionService.execute(
          jsChallenge.brokenCode,
          jsChallenge.language,
          jsChallenge.entryFunction,
          jsChallenge.testCases
        );
        expect(brokenResult.totalCount).toBe(jsChallenge.testCases.length);

        // Run fixed code
        const fixedResult = await CodeExecutionService.execute(
          jsChallenge.hints.solution,
          jsChallenge.language,
          jsChallenge.entryFunction,
          jsChallenge.testCases
        );
        expect(fixedResult.passedCount).toBe(jsChallenge.testCases.length);
        expect(fixedResult.success).toBe(true);
      }
    });

    it('handles empty code input without crashing', async () => {
      const result = await CodeExecutionService.execute(
        '',
        'javascript',
        'testFunc',
        [{ id: 't1', inputDescription: 'empty', inputs: [1], expectedOutput: 1 }]
      );

      expect(result.success).toBe(false);
      expect(result.passedCount).toBe(0);
    });

    it('handles syntax errors with clear feedback', async () => {
      const result = await CodeExecutionService.execute(
        'function bad(x { return x;',
        'javascript',
        'bad',
        [{ id: 't1', inputDescription: 'syntax error', inputs: [1], expectedOutput: 1 }]
      );

      expect(result.success).toBe(false);
      expect(result.syntaxError).toBeDefined();
    });

    it('rejects unsafe prototype pollution code', async () => {
      const maliciousCode = `
        function exploit(x) {
          return Object.__proto__;
        }
      `;
      const result = await CodeExecutionService.execute(
        maliciousCode,
        'javascript',
        'exploit',
        [{ id: 't1', inputDescription: 'exploit', inputs: [1], expectedOutput: 1 }]
      );

      expect(result.success).toBe(false);
      expect(result.results[0].error).toContain('Security Exception');
    });
  });

  describe('3. Learn Mode Navigation & Lesson Categorization', () => {
    it('provides structured chapters and lessons across multiple languages', () => {
      const chapters = LearnService.getChapters();
      expect(chapters.length).toBeGreaterThanOrEqual(6);

      const allLessons = LearnService.getAllLessons();
      expect(allLessons.length).toBeGreaterThan(0);

      const jsLessons = LearnService.getLessonsByLanguage('javascript');
      const pyLessons = LearnService.getLessonsByLanguage('python');
      expect(jsLessons.length).toBeGreaterThan(0);
      expect(pyLessons.length).toBeGreaterThan(0);

      allLessons.forEach(lesson => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.concept).toBeTruthy();
        expect(lesson.brokenCode).toBeTruthy();
        expect(lesson.entryFunction).toBeTruthy();
        expect(lesson.testCases.length).toBeGreaterThan(0);
      });
    });

    it('filters lessons accurately by chapter number', () => {
      const ch1Lessons = LearnService.getLessonsByChapter(1);
      const ch2Lessons = LearnService.getLessonsByChapter(2);

      expect(ch1Lessons.length).toBeGreaterThan(0);
      expect(ch2Lessons.length).toBeGreaterThan(0);
      expect(ch1Lessons.every(l => l.chapterNumber === 1)).toBe(true);
      expect(ch2Lessons.every(l => l.chapterNumber === 2)).toBe(true);
    });
  });

  describe('4. Storage, User Profile, XP & Activity Streaks', () => {
    it('creates default profile and records XP, levels and streaks on activity', () => {
      const profile = StorageService.getProfile();
      expect(profile.username).toBeDefined();
      expect(profile.level).toBeGreaterThanOrEqual(1);

      const initialXp = profile.xp;

      // Record activity
      const activityResult = StorageService.recordActivity('calc_avg', 100, 'Loops', 5, false);
      expect(activityResult).toBeDefined();

      const updatedProfile = StorageService.getProfile();
      expect(updatedProfile.xp).toBe(initialXp + 100);
      expect(updatedProfile.solvedChallengeIds).toContain('calc_avg');
    });

    it('records error revisions when bugs are encountered and persists them', () => {
      StorageService.recordErrorRevision({
        challengeId: 'calculate_average',
        challengeTitle: 'The Glitched Scorekeeper',
        language: 'python',
        concept: 'Operator Precedence',
        buggyCode: 'return total / (len(numbers) * 2)',
        attemptedCode: 'return total / len(numbers)',
        failureReason: 'Division multiplier bug',
        passedTests: 2,
        totalTests: 3,
      });

      const revisions = StorageService.getErrorRevisions();
      expect(revisions.length).toBeGreaterThanOrEqual(1);
      const entry = revisions.find(r => r.challengeId === 'calculate_average');
      expect(entry).toBeDefined();
      expect(entry?.challengeTitle).toBe('The Glitched Scorekeeper');
      expect(entry?.reviewed).toBe(false);

      if (entry) {
        StorageService.markErrorReviewed(entry.id);
        const refreshed = StorageService.getErrorRevisions();
        const reviewedEntry = refreshed.find(r => r.id === entry.id);
        expect(reviewedEntry?.reviewed).toBe(true);
      }
    });

    it('saves and retrieves user draft code per challenge', () => {
      const testCode = 'def calculate_average(nums): return sum(nums)/len(nums)';
      StorageService.saveUserCode('calculate_average', testCode);

      const retrieved = StorageService.getUserCode('calculate_average');
      expect(retrieved).toBe(testCode);

      StorageService.clearUserCode('calculate_average');
      const cleared = StorageService.getUserCode('calculate_average');
      expect(cleared).toBeNull();
    });

    it('toggles and persists dark and light theme preference', () => {
      StorageService.setTheme('light');
      expect(StorageService.getTheme()).toBe('light');

      StorageService.setTheme('dark');
      expect(StorageService.getTheme()).toBe('dark');
    });
  });
});
