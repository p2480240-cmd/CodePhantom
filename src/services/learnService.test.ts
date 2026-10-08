import { describe, it, expect } from 'vitest';
import { LEARN_CHAPTERS, LEARN_LESSONS } from './learnService';

describe('LearnService', () => {
  it('should have 6 structured curriculum chapters', () => {
    expect(LEARN_CHAPTERS).toHaveLength(6);
    const chapterNumbers = LEARN_CHAPTERS.map((c) => c.chapterNumber);
    expect(chapterNumbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should contain 18 micro-lessons with complete metadata', () => {
    expect(LEARN_LESSONS.length).toBeGreaterThanOrEqual(18);
    for (const lesson of LEARN_LESSONS) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.concept).toBeTruthy();
      expect(lesson.brokenCode).toBeTruthy();
      expect(lesson.entryFunction).toBeTruthy();
      expect(lesson.testCases.length).toBeGreaterThanOrEqual(1);
      expect(lesson.predictions?.length).toBeGreaterThanOrEqual(2);
      expect(lesson.xp).toBeGreaterThan(0);
    }
  });

  it('should have valid prediction options with exactly one correct answer', () => {
    for (const lesson of LEARN_LESSONS) {
      const correctOptions = lesson.predictions?.filter((p) => p.isCorrect) || [];
      expect(correctOptions.length).toBeGreaterThanOrEqual(1);
    }
  });
});
