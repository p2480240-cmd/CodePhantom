import { Challenge, Language, Difficulty } from '../types';
import { CURATED_CHALLENGES } from './challengeService';
import { CodeExecutionService } from './codeExecutionService';
import { StorageService } from './storageService';

export class AIChallengeService {
  /**
   * Generates a new story-driven debugging challenge using Google Gemini API.
   * Validates both broken code (must fail) and reference solution (must pass).
   * Gracefully falls back to curated verified challenges if API key is absent or generation fails.
   */
  static async generateChallenge(
    language: Language,
    difficulty: Difficulty,
    topic?: string
  ): Promise<{ challenge: Challenge; message: string }> {
    const profile = StorageService.getProfile();
    const apiKey = profile.customApiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Offline / Demo mode with curated fallback
      const fallback = this.selectCuratedFallback(language, difficulty);
      return {
        challenge: fallback,
        message: 'No Gemini API key detected. Loaded verified Curated Case File.',
      };
    }

    try {
      const prompt = `You are the core challenge generator for CodePhantom, a cyber-detective programming arena.
Create a deliberate, educational broken code debugging challenge in ${language} with ${difficulty} difficulty.
${topic ? `Focus on this topic or theme: ${topic}` : ''}

CRITICAL RULES:
1. The bug must be realistic and educational (e.g. off-by-one, inverted conditional, operator precedence, accumulator reset, boundary error).
2. The broken code must have an intentional error that causes at least one test case to FAIL.
3. The reference solution MUST be 100% correct and PASS ALL test cases.
4. Keep the function concise (under 25 lines).
5. Output ONLY valid raw JSON with NO markdown code fences, NO introductory text.

JSON Schema to follow strictly:
{
  "id": "ai_${Date.now()}",
  "title": "Short Mysterious Mission Title",
  "storyContext": "2-3 sentences of cyber-detective narrative.",
  "language": "${language}",
  "difficulty": "${difficulty}",
  "concept": "Specific concept name",
  "brokenCode": "Code snippet as string with escaped newlines",
  "expectedBehavior": "What it should do",
  "actualBehavior": "What it currently does wrong",
  "entryFunction": "functionName",
  "testCases": [
    {
      "id": "tc_1",
      "inputDescription": "functionName(input)",
      "inputs": ["array or argument list"],
      "expectedOutput": "expected return value"
    },
    {
      "id": "tc_2",
      "inputDescription": "functionName(input2)",
      "inputs": ["second argument test"],
      "expectedOutput": "expected return value"
    }
  ],
  "hints": {
    "hint1_shadow": "Spot the Shadow: Point to suspicious code area.",
    "hint2_clue": "Follow the Clue: Explain the conceptual mistake.",
    "hint3_narrow": "Narrow the Search: Give specific actionable fix advice.",
    "solution": "Corrected code string",
    "solutionExplanation": "Why the fix works"
  },
  "explanationOfBug": "Clear explanation of the error",
  "explanationOfCorrection": "Clear explanation of the fix",
  "estimatedMinutes": 5,
  "xpReward": ${difficulty === 'easy' ? 100 : difficulty === 'medium' ? 175 : 250}
}`;

      const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP ${response.status}: ${await response.text()}`);
      }

      const responseData = await response.json();
      const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Gemini returned an empty response.');
      }

      // Parse JSON (clean any accidental markdown wrap)
      const cleanedJson = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed: Challenge = JSON.parse(cleanedJson);

      // Validate required fields
      if (!parsed.brokenCode || !parsed.entryFunction || !parsed.testCases?.length || !parsed.hints?.solution) {
        throw new Error('Generated challenge missing critical fields.');
      }

      parsed.source = 'ai-generated';
      parsed.language = language;
      parsed.difficulty = difficulty;
      if (!parsed.id) parsed.id = `ai_${Date.now()}`;

      // Validation step: Verify that reference solution actually PASSES test cases
      const solutionValidation = await CodeExecutionService.execute(
        parsed.hints.solution,
        parsed.language,
        parsed.entryFunction,
        parsed.testCases
      );

      // Verification step: Verify that broken code actually FAILS
      const brokenValidation = await CodeExecutionService.execute(
        parsed.brokenCode,
        parsed.language,
        parsed.entryFunction,
        parsed.testCases
      );

      if (!solutionValidation.success) {
        console.warn('AI reference solution failed test cases. Reverting to fallback.', solutionValidation);
        throw new Error('Generated reference solution failed validation tests.');
      }

      if (brokenValidation.success) {
        console.warn('AI broken code accidentally passed tests. Reverting to fallback.');
        throw new Error('Generated broken code did not trigger test failures.');
      }

      return {
        challenge: parsed,
        message: `Case file successfully synthesized by Gemini (${model}).`,
      };
    } catch (err: any) {
      console.warn('AI Challenge generation failed or rejected:', err);
      const fallback = this.selectCuratedFallback(language, difficulty);
      return {
        challenge: fallback,
        message: `AI generation unavailable (${err.message || 'unknown error'}). Switched to verified Curated Case File.`,
      };
    }
  }

  private static selectCuratedFallback(language: Language, difficulty: Difficulty): Challenge {
    const candidates = CURATED_CHALLENGES.filter(
      (c) => c.language === language && c.difficulty === difficulty
    );
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    const langCandidates = CURATED_CHALLENGES.filter((c) => c.language === language);
    if (langCandidates.length > 0) {
      return langCandidates[0];
    }
    return CURATED_CHALLENGES[0];
  }
}
