import { describe, it, expect } from 'vitest';
import { ChallengeService, CURATED_CHALLENGES } from './challengeService';

describe('ChallengeService', () => {
  it('should contain a curated list of challenges with complete properties', () => {
    expect(CURATED_CHALLENGES.length).toBeGreaterThan(0);
    for (const c of CURATED_CHALLENGES) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.storyContext).toBeTruthy();
      expect(c.brokenCode).toBeTruthy();
      expect(c.entryFunction).toBeTruthy();
      expect(c.testCases.length).toBeGreaterThan(0);
      expect(c.hints.solution).toBeTruthy();
      expect(c.hints.solutionExplanation).toBeTruthy();
    }
  });

  it('should find challenge by id', () => {
    const first = CURATED_CHALLENGES[0];
    const found = ChallengeService.getChallengeById(first.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe(first.title);
  });

  it('should return challenges filtered by language', () => {
    const pyChallenges = ChallengeService.getChallengesByLanguage('python');
    expect(pyChallenges.length).toBeGreaterThan(0);
    expect(pyChallenges.every((c) => c.language === 'python')).toBe(true);

    const jsChallenges = ChallengeService.getChallengesByLanguage('javascript');
    expect(jsChallenges.length).toBeGreaterThan(0);
    expect(jsChallenges.every((c) => c.language === 'javascript')).toBe(true);
  });

  it('should recommend next unsolved challenge', () => {
    const recommended = ChallengeService.getNextRecommendedChallenge([], 'python');
    expect(recommended).toBeDefined();
    expect(recommended.language).toBe('python');
  });
});
