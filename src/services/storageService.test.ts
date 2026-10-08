import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, getRankTitle } from './storageService';

describe('StorageService', () => {
  beforeEach(() => {
    StorageService.resetProfile();
  });

  it('should initialize profile with sensible default values', () => {
    const profile = StorageService.getProfile();
    expect(profile.username).toBeTruthy();
    expect(profile.level).toBeGreaterThanOrEqual(1);
    expect(profile.xp).toBeGreaterThanOrEqual(0);
    expect(profile.streak).toBeGreaterThanOrEqual(0);
  });

  it('should calculate rank titles correctly across levels', () => {
    expect(getRankTitle(1)).toBe('Rookie');
    expect(getRankTitle(4)).toBe('Logic Detective');
    expect(getRankTitle(10)).toBe('Phantom Master');
  });

  it('should save and retrieve profile correctly', () => {
    const profile = StorageService.getProfile();
    profile.xp += 150;
    StorageService.saveProfile(profile);

    const updated = StorageService.getProfile();
    expect(updated.xp).toBe(profile.xp);
  });

  it('should record activity and award XP on solving challenges', () => {
    const initialProfile = StorageService.getProfile();
    const initialXp = initialProfile.xp;

    StorageService.recordActivity('test_challenge_1', 100, 'Loops', 2);
    const updated = StorageService.getProfile();

    expect(updated.xp).toBeGreaterThan(initialXp);
    expect(updated.solvedChallengeIds).toContain('test_challenge_1');
  });

  it('should update user language preference', () => {
    StorageService.updateSelectedLanguage('cpp');
    const profile = StorageService.getProfile();
    expect(profile.selectedLanguage).toBe('cpp');
  });
});
