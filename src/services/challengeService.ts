import { Challenge, Language, Difficulty } from '../types';

export const CURATED_CHALLENGES: Challenge[] = [
  // =========================================================================
  // SECTOR 1: THE NEON OUTSKIRTS
  // =========================================================================

  // 1A. Calculate Average - PYTHON
  {
    id: 'calculate_average',
    slug: 'calculate_average',
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
        id: 'tc_ca_py_1',
        inputDescription: 'calculate_average([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_ca_py_2',
        inputDescription: 'calculate_average([5, 15])',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_ca_py_3',
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

  // 1B. Calculate Average - JAVASCRIPT
  {
    id: 'calculate_average_js',
    slug: 'calculate_average',
    title: 'The Glitched Scorekeeper',
    storyContext:
      'The neon arcade terminal in Sector 7 is giving players corrupted averages! The high scores keep halving unexpectedly.',
    language: 'javascript',
    difficulty: 'easy',
    concept: 'Operator Precedence & Loop Variables',
    brokenCode: `function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    // The phantom corrupted the division line
    return total / (numbers.length * 2);
}`,
    expectedBehavior: 'Returns the exact arithmetic mean (sum / count) for an array of numbers.',
    actualBehavior: 'Returns half of the actual average because of accidental multiplication by 2.',
    entryFunction: 'calculateAverage',
    testCases: [
      {
        id: 'tc_ca_js_1',
        inputDescription: 'calculateAverage([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_ca_js_2',
        inputDescription: 'calculateAverage([5, 15])',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_ca_js_3',
        inputDescription: 'calculateAverage([100])',
        inputs: [[100]],
        expectedOutput: 100.0,
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at the return statement on the final line.',
      hint2_clue: 'The average is sum divided by count: sum / numbers.length. Notice what extra factor is in the denominator.',
      hint3_narrow: 'Remove the "* 2" multiplier from the denominator so it divides simply by numbers.length.',
      solution: `function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total / numbers.length;
}`,
      solutionExplanation: 'Dividing total by numbers.length without multiplying by 2 yields the correct arithmetic average.',
    },
    explanationOfBug: 'An erroneous multiplier `* 2` in the divisor caused the result to be halved on every calculation.',
    explanationOfCorrection: 'Removing the factor of 2 restores the true mathematical definition of an arithmetic average.',
    estimatedMinutes: 3,
    xpReward: 100,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },

  // 2A. The Lost Robot - PYTHON
  {
    id: 'the_lost_robot_py',
    slug: 'the_lost_robot',
    title: 'The Lost Robot',
    storyContext:
      'A patrol droid in the Cybernetic Core is wandering off the grid because its route boundary check is leaking.',
    language: 'python',
    difficulty: 'easy',
    concept: 'Array Indexing & Boundary Errors',
    brokenCode: `def get_next_waypoints(waypoints):
    active_path = []
    # The phantom loop runs one extra iteration past the list length!
    for i in range(len(waypoints) + 1):
        if i < len(waypoints):
            active_path.append(waypoints[i])
        else:
            # Bug: adds None into the active path
            active_path.append("CORRUPTED")
    return len(active_path)`,
    expectedBehavior: 'Returns exactly the count of valid waypoints without appending out-of-bounds corruption.',
    actualBehavior: 'Loops past len(waypoints) and appends a corrupted node, returning length + 1.',
    entryFunction: 'get_next_waypoints',
    testCases: [
      {
        id: 'tc_rb_py_1',
        inputDescription: 'get_next_waypoints(["Alpha", "Bravo", "Charlie"])',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_py_2',
        inputDescription: 'get_next_waypoints(["Base"])',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
      {
        id: 'tc_rb_py_3',
        inputDescription: 'get_next_waypoints([])',
        inputs: [[]],
        expectedOutput: 0,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the range in the for loop: range(len(waypoints) + 1).',
      hint2_clue: 'In Python, range(N) iterates from 0 up to N-1. If you specify len(waypoints) + 1, it runs an extra step.',
      hint3_narrow: 'Change "range(len(waypoints) + 1)" to "range(len(waypoints))" and remove the corrupted branch.',
      solution: `def get_next_waypoints(waypoints):
    active_path = []
    for i in range(len(waypoints)):
        active_path.append(waypoints[i])
    return len(active_path)`,
      solutionExplanation: 'Iterating strictly within range(len(waypoints)) processes only valid waypoints.',
    },
    explanationOfBug: 'A boundary off-by-one error using `len(waypoints) + 1` caused an extra corrupted entry to be appended.',
    explanationOfCorrection: 'Iterating up to `len(waypoints)` preserves exact waypoint count.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },

  // 2B. The Lost Robot - JAVASCRIPT
  {
    id: 'the_lost_robot',
    slug: 'the_lost_robot',
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
    actualBehavior: 'Loops up to i <= waypoints.length, triggering an out-of-bounds check.',
    entryFunction: 'getNextWaypoints',
    testCases: [
      {
        id: 'tc_rb_js_1',
        inputDescription: 'getNextWaypoints(["Alpha", "Bravo", "Charlie"])',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_js_2',
        inputDescription: 'getNextWaypoints(["Base"])',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
      {
        id: 'tc_rb_js_3',
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
    explanationOfBug: 'A classic off-by-one error using `<=` instead of `<` caused the loop to attempt accessing out-of-bounds indices.',
    explanationOfCorrection: 'Switching to `< waypoints.length` ensures only existing indices are visited.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },

  // =========================================================================
  // SECTOR 2: THE PHANTOM VAULT
  // =========================================================================

  // 3A. The Phantom Vault - PYTHON
  {
    id: 'phantom_vault',
    slug: 'phantom_vault',
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
        id: 'tc_pv_py_1',
        inputDescription: 'verify_vault_access("Admin", True, False)',
        inputs: ['Admin', true, false],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_py_2',
        inputDescription: 'verify_vault_access("Guest", False, False)',
        inputs: ['Guest', false, false],
        expectedOutput: false,
      },
      {
        id: 'tc_pv_py_3',
        inputDescription: 'verify_vault_access("Guest", False, True)',
        inputs: ['Guest', false, true],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_py_4',
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

  // 3B. The Phantom Vault - JAVASCRIPT
  {
    id: 'phantom_vault_js',
    slug: 'phantom_vault',
    title: 'The Phantom Vault',
    storyContext:
      'The security gatekeeper in the Dark Core is granting access to unauthorized intruders due to inverted boolean logic!',
    language: 'javascript',
    difficulty: 'medium',
    concept: 'Boolean Logic & Compound Conditions',
    brokenCode: `function verifyVaultAccess(userRole, hasKeycard, emergencyOverride) {
    if (emergencyOverride) {
        return true;
    }
    // Phantom logic flaw: grants access if keycard is false!
    if (userRole === "Admin" || !hasKeycard) {
        return true;
    }
    return false;
}`,
    expectedBehavior: 'Admins require a keycard unless emergency override is active; non-admins are denied.',
    actualBehavior: 'Grants access to anyone who does NOT possess a keycard!',
    entryFunction: 'verifyVaultAccess',
    testCases: [
      {
        id: 'tc_pv_js_1',
        inputDescription: 'verifyVaultAccess("Admin", true, false)',
        inputs: ['Admin', true, false],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_js_2',
        inputDescription: 'verifyVaultAccess("Guest", false, false)',
        inputs: ['Guest', false, false],
        expectedOutput: false,
      },
      {
        id: 'tc_pv_js_3',
        inputDescription: 'verifyVaultAccess("Guest", false, true)',
        inputs: ['Guest', false, true],
        expectedOutput: true,
      },
      {
        id: 'tc_pv_js_4',
        inputDescription: 'verifyVaultAccess("Admin", false, false)',
        inputs: ['Admin', false, false],
        expectedOutput: false,
      },
    ],
    hints: {
      hint1_shadow: 'Inspect the condition `userRole === "Admin" || !hasKeycard`.',
      hint2_clue: 'Why would someone get access when they DO NOT have a keycard (`!hasKeycard`)?',
      hint3_narrow: 'Change the condition to `userRole === "Admin" && hasKeycard`.',
      solution: `function verifyVaultAccess(userRole, hasKeycard, emergencyOverride) {
    if (emergencyOverride) {
        return true;
    }
    if (userRole === "Admin" && hasKeycard) {
        return true;
    }
    return false;
}`,
      solutionExplanation: 'Using `&& hasKeycard` verifies both administrative credentials and physical access token.',
    },
    explanationOfBug: 'Using `|| !hasKeycard` mistakenly admitted any user without a keycard.',
    explanationOfCorrection: 'Replaced with `&& hasKeycard` to require both Admin role and a valid keycard.',
    estimatedMinutes: 5,
    xpReward: 160,
    source: 'curated-fallback',
    zone: 'The Phantom Vault',
  },

  // =========================================================================
  // SECTOR 3: CYBERNETIC CORE
  // =========================================================================

  // 4A. Space Station Emergency - PYTHON
  {
    id: 'space_station_emergency_py',
    slug: 'space_station_emergency',
    title: 'Space Station Emergency',
    storyContext:
      'Orbital Sensor Station Kepler is reporting dangerous oxygen pressure spikes due to an accumulator reset mistake in telemetry batching.',
    language: 'python',
    difficulty: 'medium',
    concept: 'Accumulator Scope & State Mutation',
    brokenCode: `def calculate_oxygen_levels(readings):
    result = []
    current_oxygen = 100
    for diff in readings:
        # Phantom error: resetting oxygen to 100 on every reading instead of compounding!
        current_oxygen = 100 - diff
        result.append(current_oxygen)
    return result`,
    expectedBehavior: 'Oxygen levels should compound over time (previous level minus current consumption reading).',
    actualBehavior: 'Resets to 100 - diff on every reading instead of subtracting from the running level.',
    entryFunction: 'calculate_oxygen_levels',
    testCases: [
      {
        id: 'tc_ss_py_1',
        inputDescription: 'calculate_oxygen_levels([10, 5, 15])',
        inputs: [[10, 5, 15]],
        expectedOutput: [90, 85, 70],
      },
      {
        id: 'tc_ss_py_2',
        inputDescription: 'calculate_oxygen_levels([20, 30])',
        inputs: [[20, 30]],
        expectedOutput: [80, 50],
      },
    ],
    hints: {
      hint1_shadow: 'Look at how `current_oxygen` is recalculated inside the loop.',
      hint2_clue: 'You want consumption to subtract from the CURRENT remaining oxygen, not always from 100.',
      hint3_narrow: 'Change `current_oxygen = 100 - diff` to `current_oxygen = current_oxygen - diff`.',
      solution: `def calculate_oxygen_levels(readings):
    result = []
    current_oxygen = 100
    for diff in readings:
        current_oxygen = current_oxygen - diff
        result.append(current_oxygen)
    return result`,
      solutionExplanation: 'Subtracting diff from current_oxygen maintains correct state across sensor readings.',
    },
    explanationOfBug: 'Subtracting from static 100 caused oxygen levels to reset on every reading.',
    explanationOfCorrection: 'Subtracting from the accumulated `current_oxygen` variable computes remaining oxygen accurately.',
    estimatedMinutes: 6,
    xpReward: 180,
    source: 'curated-fallback',
    zone: 'Cybernetic Core',
  },

  // 4B. Space Station Emergency - JAVASCRIPT
  {
    id: 'space_station_emergency',
    slug: 'space_station_emergency',
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
    actualBehavior: 'Re-declares currentOxygen with let inside loop, shadowing outer state and resetting base to 100.',
    entryFunction: 'calculateOxygenLevels',
    testCases: [
      {
        id: 'tc_ss_js_1',
        inputDescription: 'calculateOxygenLevels([10, 5, 15])',
        inputs: [[10, 5, 15]],
        expectedOutput: [90, 85, 70],
      },
      {
        id: 'tc_ss_js_2',
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

  // =========================================================================
  // SECTOR 4: TEMPORAL NEXUS
  // =========================================================================

  // 5A. The Time Machine - PYTHON
  {
    id: 'the_time_machine',
    slug: 'the_time_machine',
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
        id: 'tc_tm_py_1',
        inputDescription: 'compute_temporal_drift([100, 150, 220, 310])',
        inputs: [[100, 150, 220, 310]],
        expectedOutput: 210,
      },
      {
        id: 'tc_tm_py_2',
        inputDescription: 'compute_temporal_drift([50, 120])',
        inputs: [[50, 120]],
        expectedOutput: 70,
      },
      {
        id: 'tc_tm_py_3',
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

  // 5B. The Time Machine - JAVASCRIPT
  {
    id: 'the_time_machine_js',
    slug: 'the_time_machine',
    title: 'The Time Machine',
    storyContext:
      'The Chrono-Displacement Engine fails to calculate temporal jump offsets because of an off-by-one slice.',
    language: 'javascript',
    difficulty: 'hard',
    concept: 'Slice Boundaries & Reversal Logic',
    brokenCode: `function computeTemporalDrift(timestamps) {
    if (timestamps.length < 2) {
        return 0;
    }
    // Phantom altered the slice indices!
    let firstStamp = timestamps[1];
    let lastStamp = timestamps[timestamps.length - 1];
    return lastStamp - firstStamp;
}`,
    expectedBehavior: 'Calculates the drift between the very first timestamp (index 0) and the final timestamp.',
    actualBehavior: 'Reads timestamps[1] instead of timestamps[0], ignoring the true starting anchor.',
    entryFunction: 'computeTemporalDrift',
    testCases: [
      {
        id: 'tc_tm_js_1',
        inputDescription: 'computeTemporalDrift([100, 150, 220, 310])',
        inputs: [[100, 150, 220, 310]],
        expectedOutput: 210,
      },
      {
        id: 'tc_tm_js_2',
        inputDescription: 'computeTemporalDrift([50, 120])',
        inputs: [[50, 120]],
        expectedOutput: 70,
      },
      {
        id: 'tc_tm_js_3',
        inputDescription: 'computeTemporalDrift([99])',
        inputs: [[99]],
        expectedOutput: 0,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the index used to fetch `firstStamp`.',
      hint2_clue: 'In zero-indexed languages, the very first element is at index 0, not 1.',
      hint3_narrow: 'Change `timestamps[1]` to `timestamps[0]`.',
      solution: `function computeTemporalDrift(timestamps) {
    if (timestamps.length < 2) {
        return 0;
    }
    let firstStamp = timestamps[0];
    let lastStamp = timestamps[timestamps.length - 1];
    return lastStamp - firstStamp;
}`,
      solutionExplanation: 'Using `timestamps[0]` accurately references the starting timestamp.',
    },
    explanationOfBug: 'Index 1 was used instead of 0, dropping the initial measurement.',
    explanationOfCorrection: 'Accessing index 0 measures total duration correctly from start to finish.',
    estimatedMinutes: 5,
    xpReward: 200,
    source: 'curated-fallback',
    zone: 'Temporal Nexus',
  },

  // =========================================================================
  // SECTOR 5: DEEP SHADOW MATRIX
  // =========================================================================

  // 6A. The Final Signal - PYTHON
  {
    id: 'the_final_signal_py',
    slug: 'the_final_signal',
    title: 'The Final Signal',
    storyContext:
      'The central beacon signal decoder in the Deep Shadow Matrix is corrupting transmission packets containing duplicate noise markers.',
    language: 'python',
    difficulty: 'hard',
    concept: 'Deduplication & Truthy Evaluation',
    brokenCode: `def decode_signal_packets(packets):
    clean_packets = []
    for item in packets:
        # Phantom bug: filtering out valid 0 packets because of truthiness check
        if item and item not in clean_packets:
            clean_packets.append(item)
    return clean_packets`,
    expectedBehavior: 'Deduplicates numbers and strings in packets, preserving 0 as a valid numeric packet.',
    actualBehavior: 'Drops `0` because `if item` evaluates `0` as falsy in Python!',
    entryFunction: 'decode_signal_packets',
    testCases: [
      {
        id: 'tc_fs_py_1',
        inputDescription: 'decode_signal_packets([0, 1, 2, 0, 3, 1])',
        inputs: [[0, 1, 2, 0, 3, 1]],
        expectedOutput: [0, 1, 2, 3],
      },
      {
        id: 'tc_fs_py_2',
        inputDescription: 'decode_signal_packets([5, 5, 5])',
        inputs: [[5, 5, 5]],
        expectedOutput: [5],
      },
      {
        id: 'tc_fs_py_3',
        inputDescription: 'decode_signal_packets([0, 0])',
        inputs: [[0, 0]],
        expectedOutput: [0],
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at `if item and ...`. What happens when item is the number 0?',
      hint2_clue: 'In Python, the number 0 is falsy, so `if 0` is False even though 0 is a valid packet value.',
      hint3_narrow: 'Check `item is not None` instead of relying on `if item`.',
      solution: `def decode_signal_packets(packets):
    clean_packets = []
    for item in packets:
        if item is not None and item not in clean_packets:
            clean_packets.append(item)
    return clean_packets`,
      solutionExplanation: 'Explicit None checking ensures valid 0 integers are preserved.',
    },
    explanationOfBug: 'Truthy condition evaluated the number 0 as falsy, discarding valid packet data.',
    explanationOfCorrection: 'Checking `item is not None` safely permits 0 values.',
    estimatedMinutes: 8,
    xpReward: 250,
    source: 'curated-fallback',
    zone: 'Deep Shadow Matrix',
  },

  // 6B. The Final Signal - JAVASCRIPT
  {
    id: 'the_final_signal',
    slug: 'the_final_signal',
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
        id: 'tc_fs_js_1',
        inputDescription: 'decodeSignalPackets([0, 1, 2, 0, 3, 1])',
        inputs: [[0, 1, 2, 0, 3, 1]],
        expectedOutput: [0, 1, 2, 3],
      },
      {
        id: 'tc_fs_js_2',
        inputDescription: 'decodeSignalPackets([5, 5, 5])',
        inputs: [[5, 5, 5]],
        expectedOutput: [5],
      },
      {
        id: 'tc_fs_js_3',
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

  // =========================================================================
  // TYPESCRIPT CASES
  // =========================================================================
  {
    id: 'calculate_average_ts',
    slug: 'calculate_average',
    title: 'The Glitched Scorekeeper (TS)',
    storyContext:
      'The neon arcade terminal in Sector 7 is giving players corrupted averages! The TypeScript sensor halving multiplier has gone rogue.',
    language: 'typescript',
    difficulty: 'easy',
    concept: 'Operator Precedence & Type Coercion',
    brokenCode: `function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) {
        return 0;
    }
    let total: number = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    // The phantom corrupted the division line
    return total / (numbers.length * 2);
}`,
    expectedBehavior: 'Returns the exact arithmetic mean (sum / count) for a number array.',
    actualBehavior: 'Returns half of the actual average because of accidental multiplication by 2.',
    entryFunction: 'calculateAverage',
    testCases: [
      {
        id: 'tc_ca_ts_1',
        inputDescription: 'calculateAverage([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_ca_ts_2',
        inputDescription: 'calculateAverage([5, 15])',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_ca_ts_3',
        inputDescription: 'calculateAverage([100])',
        inputs: [[100]],
        expectedOutput: 100.0,
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at the return statement on the final line.',
      hint2_clue: 'The average is sum divided by count: sum / numbers.length.',
      hint3_narrow: 'Remove the "* 2" multiplier from the denominator.',
      solution: `function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) {
        return 0;
    }
    let total: number = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total / numbers.length;
}`,
      solutionExplanation: 'Dividing total by numbers.length without multiplying by 2 yields the correct average.',
    },
    explanationOfBug: 'An erroneous multiplier `* 2` in the divisor caused the result to be halved.',
    explanationOfCorrection: 'Removing the factor of 2 restores the true mathematical arithmetic average.',
    estimatedMinutes: 3,
    xpReward: 100,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },
  {
    id: 'the_lost_robot_ts',
    slug: 'the_lost_robot',
    title: 'The Lost Robot (TS)',
    storyContext:
      'A patrol droid in the Cybernetic Core is wandering off the grid because its route boundary check is leaking.',
    language: 'typescript',
    difficulty: 'easy',
    concept: 'Array Indexing & Boundary Errors',
    brokenCode: `function getNextWaypoints(waypoints: string[]): number {
    const activePath: string[] = [];
    for (let i = 0; i <= waypoints.length; i++) {
        if (i < waypoints.length) {
            activePath.push(waypoints[i]);
        } else {
            activePath.push("CORRUPTED");
        }
    }
    return activePath.length;
}`,
    expectedBehavior: 'Returns exactly the count of valid waypoints without appending out-of-bounds corruption.',
    actualBehavior: 'Loops past waypoints.length and appends corrupted node.',
    entryFunction: 'getNextWaypoints',
    testCases: [
      {
        id: 'tc_rb_ts_1',
        inputDescription: 'getNextWaypoints(["Alpha", "Bravo", "Charlie"])',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_ts_2',
        inputDescription: 'getNextWaypoints(["Base"])',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
    ],
    hints: {
      hint1_shadow: 'Inspect the condition in the for-loop.',
      hint2_clue: 'The loop uses <= waypoints.length instead of < waypoints.length.',
      hint3_narrow: 'Change i <= waypoints.length to i < waypoints.length and remove the CORRUPTED push.',
      solution: `function getNextWaypoints(waypoints: string[]): number {
    const activePath: string[] = [];
    for (let i = 0; i < waypoints.length; i++) {
        activePath.push(waypoints[i]);
    }
    return activePath.length;
}`,
      solutionExplanation: 'Standard boundary checking ensures exactly the valid waypoints are counted.',
    },
    explanationOfBug: 'Off-by-one boundary comparison appended an extra element.',
    explanationOfCorrection: 'Using strict < condition keeps indexing within bounds.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'Cybernetic Core',
  },

  // =========================================================================
  // C++ CASES
  // =========================================================================
  {
    id: 'calculate_average_cpp',
    slug: 'calculate_average',
    title: 'The Glitched Scorekeeper (C++)',
    storyContext:
      'The high-performance mainframe scorekeeper in Sector 7 is computing half-precision scores due to a phantom factor in C++.',
    language: 'cpp',
    difficulty: 'easy',
    concept: 'Operator Precedence & Vector Iteration',
    brokenCode: `double calculateAverage(std::vector<double> numbers) {
    if (numbers.empty()) {
        return 0.0;
    }
    double total = 0.0;
    for (size_t i = 0; i < numbers.size(); i++) {
        total += numbers[i];
    }
    // The phantom corrupted the division line
    return total / (numbers.size() * 2);
}`,
    expectedBehavior: 'Returns arithmetic mean of double vector elements.',
    actualBehavior: 'Returns half the true average due to multiplier * 2.',
    entryFunction: 'calculateAverage',
    testCases: [
      {
        id: 'tc_ca_cpp_1',
        inputDescription: 'calculateAverage({10, 20, 30})',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_ca_cpp_2',
        inputDescription: 'calculateAverage({5, 15})',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_ca_cpp_3',
        inputDescription: 'calculateAverage({100})',
        inputs: [[100]],
        expectedOutput: 100.0,
      },
    ],
    hints: {
      hint1_shadow: 'Look closely at the return statement denominator.',
      hint2_clue: 'Divide by numbers.size(), not numbers.size() * 2.',
      hint3_narrow: 'Change return total / (numbers.size() * 2) to return total / numbers.size();',
      solution: `double calculateAverage(std::vector<double> numbers) {
    if (numbers.empty()) {
        return 0.0;
    }
    double total = 0.0;
    for (size_t i = 0; i < numbers.size(); i++) {
        total += numbers[i];
    }
    return total / numbers.size();
}`,
      solutionExplanation: 'Dividing total by numbers.size() restores standard arithmetic mean.',
    },
    explanationOfBug: 'Multiplying the divisor by 2 caused half values.',
    explanationOfCorrection: 'Removing the factor of 2 calculates the correct average.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },
  {
    id: 'the_lost_robot_cpp',
    slug: 'the_lost_robot',
    title: 'The Lost Robot (C++)',
    storyContext:
      'A patrol droid in the Cybernetic Core is wandering off the grid because its route boundary check is leaking.',
    language: 'cpp',
    difficulty: 'easy',
    concept: 'Vector Bounds & Off-by-one',
    brokenCode: `int getNextWaypoints(std::vector<std::string> waypoints) {
    std::vector<std::string> activePath;
    for (size_t i = 0; i <= waypoints.size(); i++) {
        if (i < waypoints.size()) {
            activePath.push_back(waypoints[i]);
        } else {
            activePath.push_back("CORRUPTED");
        }
    }
    return activePath.size();
}`,
    expectedBehavior: 'Returns true count of valid waypoints without extra corrupted nodes.',
    actualBehavior: 'Loops past size() and pushes CORRUPTED.',
    entryFunction: 'getNextWaypoints',
    testCases: [
      {
        id: 'tc_rb_cpp_1',
        inputDescription: 'getNextWaypoints({"Alpha", "Bravo", "Charlie"})',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_cpp_2',
        inputDescription: 'getNextWaypoints({"Base"})',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
    ],
    hints: {
      hint1_shadow: 'Examine the loop limit: i <= waypoints.size().',
      hint2_clue: 'In zero-indexed vectors, the last index is size() - 1.',
      hint3_narrow: 'Change condition to i < waypoints.size() and remove corrupted push.',
      solution: `int getNextWaypoints(std::vector<std::string> waypoints) {
    std::vector<std::string> activePath;
    for (size_t i = 0; i < waypoints.size(); i++) {
        activePath.push_back(waypoints[i]);
    }
    return activePath.size();
}`,
      solutionExplanation: 'Bound condition i < waypoints.size() prevents buffer over-read.',
    },
    explanationOfBug: 'Loop ran to i <= size(), pushing out-of-bounds artifact.',
    explanationOfCorrection: 'Setting upper bound to i < waypoints.size() guarantees clean paths.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'Cybernetic Core',
  },

  // =========================================================================
  // JAVA CASES
  // =========================================================================
  {
    id: 'calculate_average_java',
    slug: 'calculate_average',
    title: 'The Glitched Scorekeeper (Java)',
    storyContext:
      'The enterprise server in Sector 7 is recording distorted telemetry averages. Solve the Java class bug.',
    language: 'java',
    difficulty: 'easy',
    concept: 'Array Iteration & Operator Precedence',
    brokenCode: `public class Solution {
    public static double calculateAverage(double[] numbers) {
        if (numbers.length == 0) {
            return 0.0;
        }
        double total = 0.0;
        for (int i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        // The phantom corrupted the division line
        return total / (numbers.length * 2);
    }
}`,
    expectedBehavior: 'Returns true arithmetic average of double array.',
    actualBehavior: 'Divides by double length and returns half average.',
    entryFunction: 'calculateAverage',
    testCases: [
      {
        id: 'tc_ca_jv_1',
        inputDescription: 'calculateAverage(new double[]{10, 20, 30})',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_ca_jv_2',
        inputDescription: 'calculateAverage(new double[]{5, 15})',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
      {
        id: 'tc_ca_jv_3',
        inputDescription: 'calculateAverage(new double[]{100})',
        inputs: [[100]],
        expectedOutput: 100.0,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the denominator in the return statement.',
      hint2_clue: 'Divide total by numbers.length, without * 2.',
      hint3_narrow: 'Replace return total / (numbers.length * 2) with return total / numbers.length;',
      solution: `public class Solution {
    public static double calculateAverage(double[] numbers) {
        if (numbers.length == 0) {
            return 0.0;
        }
        double total = 0.0;
        for (int i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        return total / numbers.length;
    }
}`,
      solutionExplanation: 'Dividing total by numbers.length computes the accurate average.',
    },
    explanationOfBug: 'Multiplier * 2 in divisor halved the returned value.',
    explanationOfCorrection: 'Dividing cleanly by numbers.length produces correct results.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'The Neon Outskirts',
  },
  {
    id: 'the_lost_robot_java',
    slug: 'the_lost_robot',
    title: 'The Lost Robot (Java)',
    storyContext:
      'A patrol droid in the Cybernetic Core is wandering off the grid because its route boundary check is leaking.',
    language: 'java',
    difficulty: 'easy',
    concept: 'Array Bounds & ArrayList',
    brokenCode: `import java.util.ArrayList;

public class Solution {
    public static int getNextWaypoints(String[] waypoints) {
        ArrayList<String> activePath = new ArrayList<>();
        for (int i = 0; i <= waypoints.length; i++) {
            if (i < waypoints.length) {
                activePath.add(waypoints[i]);
            } else {
                activePath.add("CORRUPTED");
            }
        }
        return activePath.size();
    }
}`,
    expectedBehavior: 'Returns true count of valid waypoints without extra corrupted nodes.',
    actualBehavior: 'Loops past array length and adds corrupted node.',
    entryFunction: 'getNextWaypoints',
    testCases: [
      {
        id: 'tc_rb_jv_1',
        inputDescription: 'getNextWaypoints(new String[]{"Alpha", "Bravo", "Charlie"})',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_rb_jv_2',
        inputDescription: 'getNextWaypoints(new String[]{"Base"})',
        inputs: [["Base"]],
        expectedOutput: 1,
      },
    ],
    hints: {
      hint1_shadow: 'Look at the loop counter condition: i <= waypoints.length.',
      hint2_clue: 'An array with length N has elements from index 0 to N-1.',
      hint3_narrow: 'Change condition to i < waypoints.length.',
      solution: `import java.util.ArrayList;

public class Solution {
    public static int getNextWaypoints(String[] waypoints) {
        ArrayList<String> activePath = new ArrayList<>();
        for (int i = 0; i < waypoints.length; i++) {
            activePath.add(waypoints[i]);
        }
        return activePath.size();
    }
}`,
      solutionExplanation: 'Looping strictly up to i < waypoints.length prevents indexing errors.',
    },
    explanationOfBug: 'Loop went up to i <= waypoints.length, causing spurious insertion.',
    explanationOfCorrection: 'Using strict < operator prevents insertion of corrupted data.',
    estimatedMinutes: 4,
    xpReward: 120,
    source: 'curated-fallback',
    zone: 'Cybernetic Core',
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

  /**
   * Finds the counterpart challenge in the desired language for the same story/slug.
   * If not found, falls back to the first challenge in that language.
   */
  static getChallengeForLanguage(currentChallenge: Challenge, targetLang: Language): Challenge {
    if (currentChallenge.language === targetLang) {
      return currentChallenge;
    }
    if (currentChallenge.slug) {
      const match = CURATED_CHALLENGES.find(
        (c) => c.slug === currentChallenge.slug && c.language === targetLang
      );
      if (match) return match;
    }
    const fallback = CURATED_CHALLENGES.find((c) => c.language === targetLang);
    return fallback || currentChallenge;
  }

  static getNextRecommendedChallenge(solvedIds: string[], preferredLang: Language): Challenge {
    const langChallenges = CURATED_CHALLENGES.filter((c) => c.language === preferredLang);
    
    // Find first unsolved challenge matching preferred language
    const unsolved = langChallenges.filter((c) => !solvedIds.includes(c.id));
    if (unsolved.length > 0) return unsolved[0];

    // If all solved in this language, return first in this language
    if (langChallenges.length > 0) return langChallenges[0];

    return CURATED_CHALLENGES[0];
  }
}
