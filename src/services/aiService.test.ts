import { describe, it, expect } from 'vitest';
import { AIChallengeService } from './aiChallengeService';

describe('AIChallengeService', () => {
  it('should fall back gracefully to curated challenges when API key is not configured', async () => {
    const result = await AIChallengeService.generateChallenge(
      'python',
      'easy',
      'Variables & Data Types'
    );

    expect(result).toBeDefined();
    expect(result.challenge).toBeDefined();
    expect(result.challenge.id).toBeTruthy();
    expect(result.challenge.title).toBeTruthy();
    expect(result.challenge.brokenCode).toBeTruthy();
    expect(result.challenge.testCases.length).toBeGreaterThan(0);
    expect(result.challenge.language).toBe('python');
  });

  it('should support multiple languages during challenge generation fallback', async () => {
    const result = await AIChallengeService.generateChallenge('javascript', 'medium');
    expect(result.challenge.language).toBe('javascript');
  });
});
