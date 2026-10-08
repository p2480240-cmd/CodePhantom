import { Challenge, Language, Difficulty } from '../types';

export const CURATED_CHALLENGES: Challenge[] = [
  // 1. Calculate Average (The Hero Mockup Challenge) - Python
  {
    id: 'calculate_average',
    title: 'The Glitched Scorekeeper',
    storyContext:
      'The neon arcade terminal in Sector 7 is giving players corrupted averages! The high scores keep halving unexpectedly.',
    language: 'python',
    difficulty: 'easy',
    concept: 'Operator Precedence & Loop Variables',
    brokenCode: `def calculate_average(numbers):
    if len(numbers) == 0:
        return 0
    total = 0
    for n in numbers:
        total += n
    # The phantom corrupted the division line
    return total / (len(numbers) * 2)`,
    expectedBehavior: 'Returns the exact arithmetic mean (sum / count) for a list of numbers.',
    actualBehavior: 'Returns half of the actual average because of accidental multiplication by 2.',
    entryFunction: 'calculate_average',
    testCases: [
      {
        id: 'tc_1',
        inputDescription: 'calculate_average([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_2',
        inputDescription: 'calculate_average([5, 15])',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_3',
        inputDescription: 'calculate_average([100])',
        inputs: [[100]],
        expectedOutput: 100.0,
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at the return statement on the final line.',
      hint2_clue: 'The average is sum divided by count: sum / len(numbers). Notice what extra factor is in the denominator.',
      hint3_narrow: 'Remove the "* 2" multiplier from the denominator so it divides simply by len(numbers).',
      solution: `def calculate_average(numbers):
    if len(numbers) == 0:
        return 0
    total = 0
    for n in numbers:
        total += n
    return total / len(numbers)`,
      solutionExplanation: 'Dividing total by len(numbers) without multiplying by 2 yields the correct arithmetic average.',
    },
    explanationOfBug: 'An erroneous multiplier `* 2` in the divisor caused the result to be halved on every calculation.',
    explanationOfCorrection: 'Removing the factor of 2 restores the true mathematical definition of an arithmetic average.',
    estimatedMinutes: 3,
    xpReward: 100,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },

  // 2. The Lost Robot - JavaScript
  {
    id: 'the_lost_robot',
    title: 'The Lost Robot',
    storyContext:
      'A patrol droid in the Cybernetic Core is wandering off the grid because its route boundary check is leaking.',
    language: 'javascript',
    difficulty: 'easy',
    concept: 'Array Indexing & Boundary Errors',
    brokenCode: `function getNextWaypoints(waypoints) {
    let activePath = [];
    // The phantom loop walks past the array boundary!
    for (let i = 0; i <= waypoints.length; i++) {
        if (waypoints[i]) {
            activePath.push(waypoints[i]);
        }
    }
    return activePath.length;
}`,
    expectedBehavior: 'Returns exactly the count of valid waypoints without checking undefined out-of-bounds indices.',
    actualBehavior: 'Loops up to i <= waypoints.length, triggering an out-of-bounds check and potential undefined faults.',
    entryFunction: 'getNextWaypoints',
    testCases: [
      {
        id: 'tc_rb_1',
        inputDescription: 'getNextWaypoints(["Alpha", "Bravo", "Charlie"])',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_2',
        inputDescription: 'getNextWaypoints(["Base"])',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
      {
        id: 'tc_rb_3',
        inputDescription: 'getNextWaypoints([])',
        inputs: [[]],
        expectedOutput: 0,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the loop termination condition in the for statement.',
      hint2_clue: 'Arrays are 0-indexed. The last valid element is at index length - 1.',
      hint3_narrow: 'Change "i <= waypoints.length" to "i < waypoints.length".',
      solution: `function getNextWaypoints(waypoints) {
    let activePath = [];
    for (let i = 0; i < waypoints.length; i++) {
        if (waypoints[i]) {
            activePath.push(waypoints[i]);
        }
    }
    return activePath.length;
}`,
      solutionExplanation: 'Using strict inequality (i < waypoints.length) prevents off-by-one errors.',
    },
    explanationOfBug: 'A classic off-by-one error using `<=` instead of `<` caused the loop to attempt accessing the index equal to array length.',
    explanationOfCorrection: 'Switching to `< waypoints.length` ensures only existing indices are visited.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },

  // 3. The Phantom Vault - Python
  {
    id: 'phantom_vault',
    title: 'The Phantom Vault',
    storyContext:
      'The security gatekeeper in the Dark Core is granting access to unauthorized intruders due to inverted boolean logic!',
    language: 'python',
    difficulty: 'medium',
    concept: 'Boolean Logic & Compound Conditions',
    brokenCode: `def verify_vault_access(user_role, has_keycard, emergency_override):
    # Phantom logic flaw: grants access if keycard is False instead of True!
    if emergency_override:
        return True
    if user_role == "Admin" or not has_keycard:
        return True
    return False`,
    expectedBehavior: 'Admins require a keycard unless emergency override is active; non-admins are denied.',
    actualBehavior: 'Grants access to anyone who does NOT possess a keycard!',
    entryFunction: 'verify_vault_access',
    testCases: [
      {
        id: 'tc_pv_1',
        inputDescription: 'verify_vault_access("Admin", True, False)',
        inputs: ['Admin', true, false],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_2',
        inputDescription: 'verify_vault_access("Guest", False, False)',
        inputs: ['Guest', false, false],
        expectedOutput: false,
      },
      {
        id: 'tc_pv_3',
        inputDescription: 'verify_vault_access("Guest", False, True)',
        inputs: ['Guest', false, true],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_4',
        inputDescription: 'verify_vault_access("Admin", False, False)',
        inputs: ['Admin', false, false],
        expectedOutput: false,
      },
    ],
    hints: {
      hint1_shadow: 'Inspect the condition `user_role == "Admin" or not has_keycard`.',
      hint2_clue: 'Why would someone get access when they DO NOT have a keycard (`not has_keycard`)?',
      hint3_narrow: 'Change the condition to `user_role == "Admin" and has_keycard`.',
      solution: `def verify_vault_access(user_role, has_keycard, emergency_override):
    if emergency_override:
        return True
    if user_role == "Admin" and has_keycard:
        return True
    return False`,
      solutionExplanation: 'Using `and has_keycard` verifies both administrative credentials and physical access token.',
    },
    explanationOfBug: 'Using `or not has_keycard` mistakenly admitted any user without a keycard.',
    explanationOfCorrection: 'Replaced with `and has_keycard` to require both Admin role and a valid keycard.',
    estimatedMinutes: 5,
    xpReward: 160,
    source: 'curated-fallback',
    zone: 'The Phantom Vault',
  },

  // 4. Space Station Emergency - JavaScript
  {
    id: 'space_station_emergency',
    title: 'Space Station Emergency',
    storyContext:
      'Orbital Sensor Station Kepler is reporting dangerous oxygen pressure spikes due to an accumulator reset mistake in telemetry batching.',
    language: 'javascript',
    difficulty: 'medium',
    concept: 'Accumulator Scope & State Mutation',
    brokenCode: `function calculateOxygenLevels(readings) {
    let result = [];
    let currentOxygen = 100;
    
    for (let i = 0; i < readings.length; i++) {
        // Phantom error: subtracting from 100 every time instead of compounding
        let diff = readings[i];
        let currentOxygen = 100 - diff;
        result.push(currentOxygen);
    }
    return result;
}`,
    expectedBehavior: 'Oxygen levels should compound over time (previous level minus current consumption reading).',
    actualBehavior: 'Re-declares currentOxygen with `let` inside the loop, shadowing outer state and resetting base to 100 every iteration.',
    entryFunction: 'calculateOxygenLevels',
    testCases: [
      {
        id: 'tc_ss_1',
        inputDescription: 'calculateOxygenLevels([10, 5, 15])',
        inputs: [[10, 5, 15]],
        expectedOutput: [90, 85, 70],
      },
      {
        id: 'tc_ss_2',
        inputDescription: 'calculateOxygenLevels([20, 30])',
        inputs: [[20, 30]],
        expectedOutput: [80, 50],
      },
    ],
    hints: {
      hint1_shadow: 'Look at the declaration of `currentOxygen` inside the for-loop.',
      hint2_clue: 'When you write `let currentOxygen` inside the loop, you create a new variable that shadows the outer accumulator.',
      hint3_narrow: 'Remove `let` inside the loop and mutate the accumulator: `currentOxygen = currentOxygen - diff;`.',
      solution: `function calculateOxygenLevels(readings) {
    let result = [];
    let currentOxygen = 100;
    
    for (let i = 0; i < readings.length; i++) {
        let diff = readings[i];
        currentOxygen = currentOxygen - diff;
        result.push(currentOxygen);
    }
    return result;
}`,
      solutionExplanation: 'Updating the outer currentOxygen variable correctly accumulates changes across readings.',
    },
    explanationOfBug: 'Variable shadowing caused currentOxygen to reset to 100 every iteration.',
    explanationOfCorrection: 'Removed `let` inside loop to update the outer accumulator properly.',
    estimatedMinutes: 6,
    xpReward: 180,
    source: 'curated-fallback',
    zone: 'Cybernetic Core',
  },

  // 5. The Time Machine - Python
  {
    id: 'the_time_machine',
    title: 'The Time Machine',
    storyContext:
      'The Chrono-Displacement Engine fails to calculate temporal jump offsets because of an off-by-one slice.',
    language: 'python',
    difficulty: 'hard',
    concept: 'Slice Boundaries & Reversal Logic',
    brokenCode: `def compute_temporal_drift(timestamps):
    if len(timestamps) < 2:
        return 0
    # Phantom altered the slice indices!
    # Expected: difference between last and first
    first_stamp = timestamps[1]
    last_stamp = timestamps[-1]
    return last_stamp - first_stamp`,
    expectedBehavior: 'Calculates the drift between the very first timestamp (index 0) and the final timestamp.',
    actualBehavior: 'Reads timestamps[1] instead of timestamps[0], ignoring the true starting anchor.',
    entryFunction: 'compute_temporal_drift',
    testCases: [
      {
        id: 'tc_tm_1',
        inputDescription: 'compute_temporal_drift([100, 150, 220, 310])',
        inputs: [[100, 150, 220, 310]],
        expectedOutput: 210,
      },
      {
        id: 'tc_tm_2',
        inputDescription: 'compute_temporal_drift([50, 120])',
        inputs: [[50, 120]],
        expectedOutput: 70,
      },
      {
        id: 'tc_tm_3',
        inputDescription: 'compute_temporal_drift([99])',
        inputs: [[99]],
        expectedOutput: 0,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the index used to fetch `first_stamp`.',
      hint2_clue: 'In zero-indexed languages, the very first element is at index 0, not 1.',
      hint3_narrow: 'Change `timestamps[1]` to `timestamps[0]`.',
      solution: `def compute_temporal_drift(timestamps):
    if len(timestamps) < 2:
        return 0
    first_stamp = timestamps[0]
    last_stamp = timestamps[-1]
    return last_stamp - first_stamp`,
      solutionExplanation: 'Using `timestamps[0]` accurately references the starting timestamp.',
    },
    explanationOfBug: 'Index 1 was used instead of 0, dropping the initial measurement.',
    explanationOfCorrection: 'Accessing index 0 measures total duration correctly from start to finish.',
    estimatedMinutes: 5,
    xpReward: 200,
    source: 'curated-fallback',
    zone: 'Temporal Nexus',
  },

  // 6. The Final Signal - JavaScript
  {
    id: 'the_final_signal',
    title: 'The Final Signal',
    storyContext:
      'The central beacon signal decoder in the Deep Shadow Matrix is corrupting transmission packets containing duplicate noise markers.',
    language: 'javascript',
    difficulty: 'hard',
    concept: 'Deduplication & Truthy Evaluation',
    brokenCode: `function decodeSignalPackets(packets) {
    let cleanPackets = [];
    for (let i = 0; i < packets.length; i++) {
        let item = packets[i];
        // Phantom bug: filtering out valid 0 packets because of truthiness check
        if (item && !cleanPackets.includes(item)) {
            cleanPackets.push(item);
        }
    }
    return cleanPackets;
}`,
    expectedBehavior: 'Deduplicates numbers and strings in packets, preserving 0 as a valid numeric packet.',
    actualBehavior: 'Drops `0` because `if (item)` evaluates `0` as falsy!',
    entryFunction: 'decodeSignalPackets',
    testCases: [
      {
        id: 'tc_fs_1',
        inputDescription: 'decodeSignalPackets([0, 1, 2, 0, 3, 1])',
        inputs: [[0, 1, 2, 0, 3, 1]],
        expectedOutput: [0, 1, 2, 3],
      },
      {
        id: 'tc_fs_2',
        inputDescription: 'decodeSignalPackets([5, 5, 5])',
        inputs: [[5, 5, 5]],
        expectedOutput: [5],
      },
      {
        id: 'tc_fs_3',
        inputDescription: 'decodeSignalPackets([0, 0])',
        inputs: [[0, 0]],
        expectedOutput: [0],
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at `if (item && ...)`. What happens when item is the number 0?',
      hint2_clue: 'In JavaScript, the number 0 is falsy, so `if (0)` fails even though 0 is a valid packet value.',
      hint3_narrow: 'Check `item !== null && item !== undefined` instead of relying on `if (item)`.',
      solution: `function decodeSignalPackets(packets) {
    let cleanPackets = [];
    for (let i = 0; i < packets.length; i++) {
        let item = packets[i];
        if (item !== null && item !== undefined && !cleanPackets.includes(item)) {
            cleanPackets.push(item);
        }
    }
    return cleanPackets;
}`,
      solutionExplanation: 'Explicit null/undefined checking ensures valid 0 integers are retained.',
    },
    explanationOfBug: 'Coercing item to a boolean caused valid zero (0) packets to be discarded as falsy.',
    explanationOfCorrection: 'Using strict checks `item !== null && item !== undefined` allows 0 to be processed.',
    estimatedMinutes: 8,
    xpReward: 250,
    source: 'curated-fallback',
    zone: 'Deep Shadow Matrix',
  },
];

export class ChallengeService {
  static getAllChallenges(): Challenge[] {
    return CURATED_CHALLENGES;
  }

  static getChallengeById(id: string): Challenge | undefined {
    return CURATED_CHALLENGES.find((c) => c.id === id);
  }

  static getChallengesByLanguage(lang: Language): Challenge[] {
    return CURATED_CHALLENGES.filter((c) => c.language === lang);
  }

  static getChallengesByDifficulty(difficulty: Difficulty): Challenge[] {
    return CURATED_CHALLENGES.filter((c) => c.difficulty === difficulty);
  }

  static getNextRecommendedChallenge(solvedIds: string[], preferredLang: Language): Challenge {
    // Find first unsolved challenge matching preferred language
    const unsolved = CURATED_CHALLENGES.filter(
      (c) => !solvedIds.includes(c.id) && c.language === preferredLang
    );
    if (unsolved.length > 0) return unsolved[0];

    // Otherwise any unsolved challenge
    const anyUnsolved = CURATED_CHALLENGES.filter((c) => !solvedIds.includes(c.id));
    if (anyUnsolved.length > 0) return anyUnsolved[0];

    // Default to the first challenge
    return CURATED_CHALLENGES[0];
  }
}
