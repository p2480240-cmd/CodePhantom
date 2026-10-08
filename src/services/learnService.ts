import { LearnLesson } from '../types';

export interface LearnChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  icon: string;
}

export const LEARN_CHAPTERS: LearnChapter[] = [
  {
    id: 'ch_1',
    chapterNumber: 1,
    title: 'Chapter 1: Types, Coercion & Narrowing',
    description: 'Master dynamic casting, numeric string traps, and optional nullish defenses.',
    icon: 'Layers',
  },
  {
    id: 'ch_2',
    chapterNumber: 2,
    title: 'Chapter 2: Boolean Logic & Truthiness',
    description: 'Avoid inverted logic gates, falsy zeros, and memory reference identity flaws.',
    icon: 'ShieldCheck',
  },
  {
    id: 'ch_3',
    chapterNumber: 3,
    title: 'Chapter 3: Loop Invariants & Boundary Guards',
    description: 'Defeat infinite termination traps and off-by-one fencepost buffer reads.',
    icon: 'Repeat',
  },
  {
    id: 'ch_4',
    chapterNumber: 4,
    title: 'Chapter 4: Scope, Accumulators & State Mutation',
    description: 'Protect running sums from loop shadowing, accumulator resets, and missing returns.',
    icon: 'Variable',
  },
  {
    id: 'ch_5',
    chapterNumber: 5,
    title: 'Chapter 5: Collections, Slicing & Symmetry',
    description: 'Diagnose indexing bugs, palindrome reversions, and destructive in-place mutations.',
    icon: 'Database',
  },
  {
    id: 'ch_6',
    chapterNumber: 6,
    title: 'Chapter 6: Exception Defense & Null Safety',
    description: 'Guard optional arrays, missing dictionary keys, and Java null pointers defensively.',
    icon: 'AlertTriangle',
  },
];

export const LEARN_LESSONS: LearnLesson[] = [
  // =========================================================================
  // CHAPTER 1: TYPES, COERCION & NARROWING
  // =========================================================================
  {
    id: 'lesson_vars',
    chapter: 'Chapter 1: Types, Coercion & Narrowing',
    chapterNumber: 1,
    concept: 'Variables & Data Types',
    title: 'The Type Trap in Currency Exchange',
    scenario: 'The cyber bazaar exchange kiosk received a string instead of a float, causing numeric addition to concatenate text or crash!',
    language: 'python',
    brokenCode: `def convert_credits(raw_amount, bonus):
    # Bug: raw_amount is passed as a string like "50"!
    # String concatenation or type error occurs when adding a string and integer:
    return raw_amount + bonus`,
    expectedBehavior: 'Converts raw string input into an integer or float before adding the bonus: int(raw_amount) + bonus.',
    bugExplanation: 'Adding numbers and strings in Python causes TypeErrors. Explicitly cast `int(raw_amount)` or `float(raw_amount)`.',
    keyTakeaway: 'Always validate or cast external inputs into numeric types before performing arithmetic.',
    entryFunction: 'convert_credits',
    predictions: [
      { id: 'p1', text: 'Output = 125 (numbers add normally)', isCorrect: false, explanation: 'Python does not auto-convert strings to numbers during addition.' },
      { id: 'p2', text: 'TypeError or string mismatch', isCorrect: true, explanation: 'In Python, str + int produces a TypeError: can only concatenate str to str.' },
      { id: 'p3', text: 'Output = 0', isCorrect: false, explanation: 'Python will not return 0 on type mismatches.' },
      { id: 'p4', text: 'Output = 25', isCorrect: false, explanation: 'The first operand is not ignored.' },
    ],
    stepByStepHint: 'Wrap `raw_amount` in `int()`: change `raw_amount + bonus` to `int(raw_amount) + bonus`.',
    testCases: [
      {
        id: 'tc_lv_1',
        inputDescription: 'convert_credits("100", 25)',
        inputs: ['100', 25],
        expectedOutput: 125,
      },
      {
        id: 'tc_lv_2',
        inputDescription: 'convert_credits("0", 50)',
        inputs: ['0', 50],
        expectedOutput: 50,
      },
    ],
    xp: 60,
  },
  {
    id: 'lesson_js_coercion',
    chapter: 'Chapter 1: Types, Coercion & Narrowing',
    chapterNumber: 1,
    concept: 'Implicit Coercion & Concatenation',
    title: 'The Invoice Total Phantom Concatenation',
    scenario: 'The automated terminal calculates shipping balance, but the shipping fee arrives as string "10", turning 40 + "10" into "4010"!',
    language: 'javascript',
    brokenCode: `function calculateTotalCost(basePrice, shippingFee) {
    // Bug: shippingFee comes from input as a string like "10"
    // In JavaScript, number + string coerces to string concatenation:
    return basePrice + shippingFee;
}`,
    expectedBehavior: 'Converts arguments to numbers so arithmetic addition occurs: Number(basePrice) + Number(shippingFee).',
    bugExplanation: 'The + operator in JavaScript acts as string concatenation if either operand is a string. Use Number() or unary + to force numeric addition.',
    keyTakeaway: 'Whenever reading form or API data in JavaScript, explicitly parse numeric inputs using Number() or parseInt().',
    entryFunction: 'calculateTotalCost',
    predictions: [
      { id: 'p1', text: 'Returns "4010" string instead of 50', isCorrect: true, explanation: 'JavaScript coerces the number 40 to a string and concatenates with "10".' },
      { id: 'p2', text: 'Throws a TypeError', isCorrect: false, explanation: 'JavaScript permits + between numbers and strings via implicit coercion.' },
      { id: 'p3', text: 'Returns 50', isCorrect: false, explanation: 'The operands are not cast to numbers automatically.' },
    ],
    stepByStepHint: 'Wrap both operands in `Number()`: `return Number(basePrice) + Number(shippingFee);`.',
    testCases: [
      {
        id: 'tc_jc_1',
        inputDescription: 'calculateTotalCost(40, "10")',
        inputs: [40, '10'],
        expectedOutput: 50,
      },
      {
        id: 'tc_jc_2',
        inputDescription: 'calculateTotalCost(100, "25")',
        inputs: [100, '25'],
        expectedOutput: 125,
      },
    ],
    xp: 65,
  },
  {
    id: 'lesson_ts_types',
    chapter: 'Chapter 1: Types, Coercion & Narrowing',
    chapterNumber: 1,
    concept: 'TypeScript Type Narrowing',
    title: 'The Unchecked Optional Parameter',
    scenario: 'A discount calculator attempts to call methods on an optional voucher percentage without checking if it exists, yielding NaN.',
    language: 'typescript',
    brokenCode: `function applyDiscount(price: number, discountPct?: number): number {
    // Bug: discountPct could be undefined!
    // Subtracting undefined produces NaN:
    return price - (price * (discountPct / 100));
}`,
    expectedBehavior: 'Checks if discountPct is defined before computing discount: defaults to 0 if undefined.',
    bugExplanation: 'Optional parameters in TypeScript can be undefined at runtime. Arithmetic with undefined results in NaN.',
    keyTakeaway: 'Always use nullish coalescing `discountPct ?? 0` or guard clauses to protect optional numbers.',
    entryFunction: 'applyDiscount',
    predictions: [
      { id: 'p1', text: 'Produces NaN when discountPct is omitted', isCorrect: true, explanation: 'price * (undefined / 100) resolves to NaN.' },
      { id: 'p2', text: 'Defaults to 0% discount automatically', isCorrect: false, explanation: 'TypeScript compiles to JS where undefined is not automatically converted to 0.' },
    ],
    stepByStepHint: 'Use default value `const pct = discountPct ?? 0;` and compute with `pct`.',
    testCases: [
      {
        id: 'tc_ts_1',
        inputDescription: 'applyDiscount(100, 20)',
        inputs: [100, 20],
        expectedOutput: 80,
      },
      {
        id: 'tc_ts_2',
        inputDescription: 'applyDiscount(50, 0)',
        inputs: [50, 0],
        expectedOutput: 50,
      },
    ],
    xp: 70,
  },

  // =========================================================================
  // CHAPTER 2: BOOLEAN LOGIC & TRUTHINESS
  // =========================================================================
  {
    id: 'lesson_cond',
    chapter: 'Chapter 2: Boolean Logic & Truthiness',
    chapterNumber: 2,
    concept: 'Conditions & Logic',
    title: 'The Over-Generous Security Gate',
    scenario: 'The perimeter gate uses an OR check where both credentials should be strictly required.',
    language: 'javascript',
    brokenCode: `function checkAccess(hasBadge, isStaff) {
    // Bug: allows anyone who has a badge OR is staff!
    // Rule: Must be staff AND possess a badge.
    return hasBadge || isStaff;
}`,
    expectedBehavior: 'Returns true only if the user is staff AND has a badge: hasBadge && isStaff.',
    bugExplanation: 'Using `||` (logical OR) passes if either condition is true. `&&` (logical AND) ensures both are satisfied.',
    keyTakeaway: 'Logical OR (`||`) permits alternatives; logical AND (`&&`) enforces strict prerequisites.',
    entryFunction: 'checkAccess',
    predictions: [
      { id: 'p1', text: 'Access is denied to all visitors', isCorrect: false, explanation: 'Because || is used, almost anyone gets through!' },
      { id: 'p2', text: 'Non-staff with badges are erroneously admitted', isCorrect: true, explanation: 'The OR operator makes badge possession alone sufficient for entry.' },
      { id: 'p3', text: 'Syntax error occurs', isCorrect: false, explanation: 'Syntax is valid JavaScript boolean logic.' },
    ],
    stepByStepHint: 'Replace the `||` operator with `&&` so both criteria must be satisfied.',
    testCases: [
      {
        id: 'tc_lc_1',
        inputDescription: 'checkAccess(true, false)',
        inputs: [true, false],
        expectedOutput: false,
      },
      {
        id: 'tc_lc_2',
        inputDescription: 'checkAccess(true, true)',
        inputs: [true, true],
        expectedOutput: true,
      },
    ],
    xp: 60,
  },
  {
    id: 'lesson_py_truthy_zero',
    chapter: 'Chapter 2: Boolean Logic & Truthiness',
    chapterNumber: 2,
    concept: 'Falsy Zero & Explicit Checks',
    title: 'The Zero-Degree Sub-Zero Telemetry Filter',
    scenario: 'The cryo-freezer station filters out corrupted empty readings, but drops valid 0-degree readings because `if r:` treats 0 as False!',
    language: 'python',
    brokenCode: `def filter_valid_readings(readings):
    valid = []
    for r in readings:
        # Bug: "if r" evaluates to False when r == 0!
        # Valid temperature of 0 degrees is discarded!
        if r:
            valid.append(r)
    return valid`,
    expectedBehavior: 'Keeps valid numeric readings including 0: check `if r is not None:`.',
    bugExplanation: 'In Python, the number 0 is falsy. Checking `if x:` discards 0 along with None and empty values.',
    keyTakeaway: 'When filtering numeric datasets, always check `if val is not None:` instead of implicit truthiness.',
    entryFunction: 'filter_valid_readings',
    predictions: [
      { id: 'p1', text: 'Drops all 0 values from the result list', isCorrect: true, explanation: '0 evaluates to False in Python boolean context.' },
      { id: 'p2', text: 'Includes 0 values normally', isCorrect: false, explanation: 'if 0 evaluates as False.' },
    ],
    stepByStepHint: 'Replace `if r:` with `if r is not None:`.',
    testCases: [
      {
        id: 'tc_fz_1',
        inputDescription: 'filter_valid_readings([10, 0, 25, 0])',
        inputs: [[10, 0, 25, 0]],
        expectedOutput: [10, 0, 25, 0],
      },
      {
        id: 'tc_fz_2',
        inputDescription: 'filter_valid_readings([0, 5])',
        inputs: [[0, 5]],
        expectedOutput: [0, 5],
      },
    ],
    xp: 70,
  },
  {
    id: 'lesson_java_string_equals',
    chapter: 'Chapter 2: Boolean Logic & Truthiness',
    chapterNumber: 2,
    concept: 'Object Reference vs Value Equality',
    title: 'The Inverted String Equality Trap',
    scenario: 'The enterprise portal compares authorization tokens using == instead of .equals(), failing user verification due to memory reference inequality.',
    language: 'java',
    brokenCode: `public class Solution {
    public static boolean verifyUserAccess(String role, String requiredRole) {
        // Bug: == checks memory reference identity, not string content!
        return role == requiredRole;
    }
}`,
    expectedBehavior: 'Compares string value contents using role.equals(requiredRole).',
    bugExplanation: 'In Java, `==` tests object reference identity. Different String instances containing identical characters will evaluate to false.',
    keyTakeaway: 'In Java, always compare Strings and Objects using `.equals()`, never `==`.',
    entryFunction: 'verifyUserAccess',
    predictions: [
      { id: 'p1', text: 'May return false even if strings have identical text', isCorrect: true, explanation: '== compares memory memory addresses, not string characters.' },
      { id: 'p2', text: 'Always compares string character values', isCorrect: false, explanation: 'Java does not overload == for String contents.' },
    ],
    stepByStepHint: 'Change `role == requiredRole` to `role.equals(requiredRole)`.',
    testCases: [
      {
        id: 'tc_je_1',
        inputDescription: 'verifyUserAccess("Admin", "Admin")',
        inputs: ['Admin', 'Admin'],
        expectedOutput: true,
      },
      {
        id: 'tc_je_2',
        inputDescription: 'verifyUserAccess("Guest", "Admin")',
        inputs: ['Guest', 'Admin'],
        expectedOutput: false,
      },
    ],
    xp: 75,
  },

  // =========================================================================
  // CHAPTER 3: LOOP INVARIANTS & BOUNDARY GUARDS
  // =========================================================================
  {
    id: 'lesson_loops',
    chapter: 'Chapter 3: Loop Invariants & Boundary Guards',
    chapterNumber: 3,
    concept: 'Loops & Iteration',
    title: 'The Eternal Loop of Sector 9',
    scenario: 'A maintenance patrol loop never advances its index pointer, freezing the drone control system.',
    language: 'javascript',
    brokenCode: `function countDrones(limit) {
    let count = 0;
    let i = 0;
    while (i < limit) {
        count++;
        // Bug: missing index increment! i stays 0 forever!
    }
    return count;
}`,
    expectedBehavior: 'Increments i on every iteration and returns count: i++ inside while loop.',
    bugExplanation: 'While loops without condition mutations become infinite loops, hanging threads or freezing browsers.',
    keyTakeaway: 'Always ensure while loops have an increment or condition variable that advances toward the termination boundary.',
    entryFunction: 'countDrones',
    predictions: [
      { id: 'p1', text: 'Returns 0 immediately', isCorrect: false, explanation: 'Since i is 0 and limit is 5, 0 < 5 is true so loop executes.' },
      { id: 'p2', text: 'Infinite loop / freeze because i never changes', isCorrect: true, explanation: 'i remains 0 indefinitely, causing 0 < limit to stay true forever.' },
      { id: 'p3', text: 'Returns limit', isCorrect: false, explanation: 'The loop never terminates without i changing.' },
    ],
    stepByStepHint: 'Add `i++;` inside the while loop block right after `count++;`.',
    testCases: [
      {
        id: 'tc_ll_1',
        inputDescription: 'countDrones(5)',
        inputs: [5],
        expectedOutput: 5,
      },
      {
        id: 'tc_ll_2',
        inputDescription: 'countDrones(0)',
        inputs: [0],
        expectedOutput: 0,
      },
    ],
    xp: 70,
  },
  {
    id: 'lesson_boundary',
    chapter: 'Chapter 3: Loop Invariants & Boundary Guards',
    chapterNumber: 3,
    concept: 'Indexing & Boundary Errors',
    title: 'The Edge of the World (Off-by-One)',
    scenario: 'A scanner checks coordinates in an array using index len(items), reading out of bounds and crashing telemetry.',
    language: 'python',
    brokenCode: `def get_first_and_last(items):
    if len(items) == 0:
        return []
    # Bug: accessing index len(items) throws IndexError!
    # Valid last item is at index len(items) - 1 or items[-1]
    return [items[0], items[len(items)]]`,
    expectedBehavior: 'Returns a list containing the first and the last element: [items[0], items[-1]].',
    bugExplanation: 'Zero-indexed lists of length N have indices 0 to N-1. Index N is out of bounds.',
    keyTakeaway: 'Remember that indices range from 0 to length - 1. In Python, `items[-1]` is the cleanest way to access the last element.',
    entryFunction: 'get_first_and_last',
    predictions: [
      { id: 'p1', text: 'Returns first and last item successfully', isCorrect: false, explanation: 'List length equals 3, but highest index is 2.' },
      { id: 'p2', text: 'IndexError: list index out of range', isCorrect: true, explanation: 'Accessing index equal to length exceeds array bounds.' },
      { id: 'p3', text: 'Returns None', isCorrect: false, explanation: 'Python raises an IndexError rather than returning None.' },
    ],
    stepByStepHint: 'Replace `items[len(items)]` with `items[len(items) - 1]` or Pythonic `items[-1]`.',
    testCases: [
      {
        id: 'tc_lb_1',
        inputDescription: 'get_first_and_last([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: [10, 30],
      },
      {
        id: 'tc_lb_2',
        inputDescription: 'get_first_and_last(["alpha"])',
        inputs: [["alpha"]],
        expectedOutput: ['alpha', 'alpha'],
      },
    ],
    xp: 75,
  },
  {
    id: 'lesson_cpp_bounds',
    chapter: 'Chapter 3: Loop Invariants & Boundary Guards',
    chapterNumber: 3,
    concept: 'Vector Boundary Off-by-One',
    title: 'The Waypoint Buffer Over-read',
    scenario: 'A navigation drone loops past the vector bounds using i <= waypoints.size(), attempting to inspect non-existent memory.',
    language: 'cpp',
    brokenCode: `int countValidWaypoints(std::vector<std::string> waypoints) {
    int validCount = 0;
    // Bug: i <= waypoints.size() causes an off-by-one buffer read!
    for (size_t i = 0; i <= waypoints.size(); i++) {
        validCount++;
    }
    return validCount;
}`,
    expectedBehavior: 'Counts strictly up to i < waypoints.size() to avoid overcounting or out-of-bounds reads.',
    bugExplanation: 'In zero-indexed vectors, iterating up to i <= size() executes size() + 1 times, causing off-by-one errors and segmentation faults.',
    keyTakeaway: 'Always use strict less-than `i < vec.size()` for vector iteration loops.',
    entryFunction: 'countValidWaypoints',
    predictions: [
      { id: 'p1', text: 'Counts 1 extra non-existent element', isCorrect: true, explanation: 'Condition <= runs for indices 0, 1, 2... up to size(), totaling size() + 1.' },
      { id: 'p2', text: 'Counts exactly the elements in the vector', isCorrect: false, explanation: '<= exceeds the array length.' },
    ],
    stepByStepHint: 'Change `i <= waypoints.size()` to `i < waypoints.size()`.',
    testCases: [
      {
        id: 'tc_cb_1',
        inputDescription: 'countValidWaypoints({"Alpha", "Bravo", "Charlie"})',
        inputs: [["Alpha", "Bravo", "Charlie"]],
        expectedOutput: 3,
      },
      {
        id: 'tc_cb_2',
        inputDescription: 'countValidWaypoints({"Home"})',
        inputs: [["Home"]],
        expectedOutput: 1,
      },
    ],
    xp: 75,
  },

  // =========================================================================
  // CHAPTER 4: SCOPE, ACCUMULATORS & STATE MUTATION
  // =========================================================================
  {
    id: 'lesson_functions',
    chapter: 'Chapter 4: Scope, Accumulators & State Mutation',
    chapterNumber: 4,
    concept: 'Functions & Return Values',
    title: 'The Silent Void Return',
    scenario: 'A mathematical multiplier computes the answer but forgets to return it, giving undefined to calling routines.',
    language: 'javascript',
    brokenCode: `function multiplyEnergy(base, multiplier) {
    let total = base * multiplier;
    // Bug: forgets to return total!
}`,
    expectedBehavior: 'Returns the computed product: return total.',
    bugExplanation: 'Functions without an explicit return statement evaluate to undefined in JavaScript and None in Python.',
    keyTakeaway: 'Always verify your functions explicitly return their intended calculation results.',
    entryFunction: 'multiplyEnergy',
    predictions: [
      { id: 'p1', text: 'Evaluates to undefined', isCorrect: true, explanation: 'Without a return keyword, JS functions default to undefined.' },
      { id: 'p2', text: 'Evaluates to the computed product', isCorrect: false, explanation: 'Local variables are discarded upon exit unless returned.' },
    ],
    stepByStepHint: 'Add `return total;` at the end of the function.',
    testCases: [
      {
        id: 'tc_lf_1',
        inputDescription: 'multiplyEnergy(4, 5)',
        inputs: [4, 5],
        expectedOutput: 20,
      },
      {
        id: 'tc_lf_2',
        inputDescription: 'multiplyEnergy(10, 0)',
        inputs: [10, 0],
        expectedOutput: 0,
      },
    ],
    xp: 65,
  },
  {
    id: 'lesson_py_accumulator',
    chapter: 'Chapter 4: Scope, Accumulators & State Mutation',
    chapterNumber: 4,
    concept: 'Scope & Accumulator Reset',
    title: 'The Resetting Total Scorekeeper',
    scenario: 'An energy tally system intends to accumulate the sum of battery charges, but re-initializes total = 0 inside the loop, only returning the final element!',
    language: 'python',
    brokenCode: `def calculate_running_total(charges):
    # Bug: total = 0 inside loop wipes out previous accumulation!
    for c in charges:
        total = 0
        total += c
    return total`,
    expectedBehavior: 'Initializes total = 0 outside the loop so all values accumulate.',
    bugExplanation: 'Placing initialization inside loop body resets accumulator on every iteration, leaving only the last value.',
    keyTakeaway: 'Accumulators must be declared and initialized in the enclosing scope before loop execution begins.',
    entryFunction: 'calculate_running_total',
    predictions: [
      { id: 'p1', text: 'Returns only the last charge in the list', isCorrect: true, explanation: 'total resets to 0 on every iteration, discarding all previous sums.' },
      { id: 'p2', text: 'Returns the correct sum', isCorrect: false, explanation: 'Repeated initialization overwrites prior additions.' },
    ],
    stepByStepHint: 'Move `total = 0` above the `for c in charges:` loop.',
    testCases: [
      {
        id: 'tc_pa_1',
        inputDescription: 'calculate_running_total([10, 20, 30])',
        inputs: [[10, 20, 30]],
        expectedOutput: 60,
      },
      {
        id: 'tc_pa_2',
        inputDescription: 'calculate_running_total([5, 15])',
        inputs: [[5, 15]],
        expectedOutput: 20,
      },
    ],
    xp: 70,
  },
  {
    id: 'lesson_java_shadowing',
    chapter: 'Chapter 4: Scope, Accumulators & State Mutation',
    chapterNumber: 4,
    concept: 'Parameter Shadowing & Mutation',
    title: 'The Shadowed Variable Ghost',
    scenario: 'An account deposit handler declares a local variable inside the loop that shadows the running accumulator.',
    language: 'java',
    brokenCode: `public class Solution {
    public static int calculateBalance(int[] deposits) {
        int balance = 100;
        for (int i = 0; i < deposits.length; i++) {
            // Bug: re-declaring int balance shadows the outer balance!
            int balance = deposits[i];
        }
        return balance;
    }
}`,
    expectedBehavior: 'Mutates the outer balance accumulator: balance += deposits[i];',
    bugExplanation: 'Re-declaring a variable within a nested block shadows the outer variable, preventing accumulated state updates.',
    keyTakeaway: 'Do not re-declare variable types when you intend to update an existing outer variable.',
    entryFunction: 'calculateBalance',
    predictions: [
      { id: 'p1', text: 'Does not accumulate deposits into base balance', isCorrect: true, explanation: 'Local declaration shadows outer accumulator.' },
      { id: 'p2', text: 'Sums all deposits successfully', isCorrect: false, explanation: 'Shadowing prevents outer balance mutation.' },
    ],
    stepByStepHint: 'Remove `int` inside the loop and write `balance += deposits[i];`.',
    testCases: [
      {
        id: 'tc_js_1',
        inputDescription: 'calculateBalance(new int[]{10, 20, 30})',
        inputs: [[10, 20, 30]],
        expectedOutput: 160,
      },
      {
        id: 'tc_js_2',
        inputDescription: 'calculateBalance(new int[]{50})',
        inputs: [[50]],
        expectedOutput: 150,
      },
    ],
    xp: 75,
  },

  // =========================================================================
  // CHAPTER 5: COLLECTIONS, SLICING & SYMMETRY
  // =========================================================================
  {
    id: 'lesson_js_mutation',
    chapter: 'Chapter 5: Collections, Slicing & Symmetry',
    chapterNumber: 5,
    concept: 'Array Reverse & Off-by-One',
    title: 'The Destructive Path Inversion',
    scenario: 'The navigation autopilot reverses the emergency exit path, but drops the starting origin due to index boundary i > 0.',
    language: 'javascript',
    brokenCode: `function reverseCoordinatePath(path) {
    let reversed = [];
    // Bug: loop condition i > 0 stops before index 0!
    for (let i = path.length - 1; i > 0; i--) {
        reversed.push(path[i]);
    }
    return reversed;
}`,
    expectedBehavior: 'Reverses the array down to index 0: i >= 0.',
    bugExplanation: 'Zero-indexed arrays have their first element at index 0. Condition `i > 0` prematurely exits before pushing index 0.',
    keyTakeaway: 'When reversing backwards to the start of an array, always check `i >= 0`.',
    entryFunction: 'reverseCoordinatePath',
    predictions: [
      { id: 'p1', text: 'Missing the first element of original array', isCorrect: true, explanation: 'i stops at 1 and skips index 0.' },
      { id: 'p2', text: 'Reverses entire array correctly', isCorrect: false, explanation: 'The condition i > 0 excludes the 0th item.' },
    ],
    stepByStepHint: 'Change `i > 0` to `i >= 0` in the loop condition.',
    testCases: [
      {
        id: 'tc_jm_1',
        inputDescription: 'reverseCoordinatePath(["A", "B", "C"])',
        inputs: [["A", "B", "C"]],
        expectedOutput: ["C", "B", "A"],
      },
      {
        id: 'tc_jm_2',
        inputDescription: 'reverseCoordinatePath(["Start", "End"])',
        inputs: [["Start", "End"]],
        expectedOutput: ["End", "Start"],
      },
    ],
    xp: 70,
  },
  {
    id: 'lesson_py_palindrome',
    chapter: 'Chapter 5: Collections, Slicing & Symmetry',
    chapterNumber: 5,
    concept: 'String Slicing & Symmetry',
    title: 'The Flawed Cipher Symmetry Check',
    scenario: 'A cryptographic gate tests whether an activation code is a palindrome, but drops the first character due to an incorrect slice step code[1::-1].',
    language: 'python',
    brokenCode: `def is_palindrome_key(code):
    if len(code) == 0:
        return True
    # Bug: slice code[1::-1] starts at index 1 instead of full reversal code[::-1]
    reversed_code = code[1::-1]
    return code == reversed_code`,
    expectedBehavior: 'Reverses the full string using code[::-1] to verify true palindrome symmetry.',
    bugExplanation: 'Python slicing syntax is [start:stop:step]. Specifying start 1 reverses only from index 1 downwards.',
    keyTakeaway: 'Use `[::-1]` with omitted start and stop to cleanly invert entire Python sequences.',
    entryFunction: 'is_palindrome_key',
    predictions: [
      { id: 'p1', text: 'Fails to verify valid palindromes like "radar"', isCorrect: true, explanation: 'code[1::-1] produces "ar" instead of "radar".' },
      { id: 'p2', text: 'Checks palindrome accurately', isCorrect: false, explanation: 'Starting slice at index 1 chops off the string tail.' },
    ],
    stepByStepHint: 'Replace `code[1::-1]` with `code[::-1]`.',
    testCases: [
      {
        id: 'tc_pp_1',
        inputDescription: 'is_palindrome_key("radar")',
        inputs: ['radar'],
        expectedOutput: true,
      },
      {
        id: 'tc_pp_2',
        inputDescription: 'is_palindrome_key("phantom")',
        inputs: ['phantom'],
        expectedOutput: false,
      },
    ],
    xp: 75,
  },
  {
    id: 'lesson_cpp_vec',
    chapter: 'Chapter 5: Collections, Slicing & Symmetry',
    chapterNumber: 5,
    concept: 'C++ Boundary Bounds',
    title: 'The Phantom Segment Fault (Halved Average)',
    scenario: 'An energy sensor accesses index nums.size() instead of checking vector boundaries.',
    language: 'cpp',
    brokenCode: `double getAverage(std::vector<double> nums) {
    if (nums.empty()) return 0.0;
    double sum = 0.0;
    for (size_t i = 0; i < nums.size(); i++) {
        sum += nums[i];
    }
    // Bug: divided by double the count!
    return sum / (nums.size() * 2);
}`,
    expectedBehavior: 'Computes arithmetic mean by dividing sum by nums.size().',
    bugExplanation: 'Multiplying the divisor by 2 halves the true average output.',
    keyTakeaway: 'In C++, std::vector::size() returns the exact element count. Divide sum directly by nums.size().',
    entryFunction: 'getAverage',
    predictions: [
      { id: 'p1', text: 'Halves the actual average', isCorrect: true, explanation: 'The divisor is multiplied by 2.' },
      { id: 'p2', text: 'Memory leak occurs', isCorrect: false, explanation: 'Stack variables are automatically cleaned up in C++.' },
    ],
    stepByStepHint: 'Remove `* 2` so the return statement divides by `nums.size()`.',
    testCases: [
      {
        id: 'tc_cpp_1',
        inputDescription: 'getAverage({10, 20, 30})',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
      {
        id: 'tc_cpp_2',
        inputDescription: 'getAverage({5, 15})',
        inputs: [[5, 15]],
        expectedOutput: 10.0,
      },
    ],
    xp: 75,
  },

  // =========================================================================
  // CHAPTER 6: EXCEPTION DEFENSE & NULL SAFETY
  // =========================================================================
  {
    id: 'lesson_java_null',
    chapter: 'Chapter 6: Exception Defense & Null Safety',
    chapterNumber: 6,
    concept: 'Java Exception Guarding',
    title: 'The Ghost Null Pointer Guard',
    scenario: 'A telemetry average calculator multiplies the array length by 2, returning distorted averages.',
    language: 'java',
    brokenCode: `public class Solution {
    public static double calculateAverage(double[] numbers) {
        if (numbers.length == 0) return 0.0;
        double sum = 0.0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        // Bug: divisor factor 2
        return sum / (numbers.length * 2);
    }
}`,
    expectedBehavior: 'Computes arithmetic mean by dividing sum cleanly by numbers.length.',
    bugExplanation: 'The erroneous factor 2 in the denominator causes distorted calculations.',
    keyTakeaway: 'In Java arrays, .length is a field. Compute true arithmetic mean with sum / numbers.length.',
    entryFunction: 'calculateAverage',
    predictions: [
      { id: 'p1', text: 'Returns half of the average', isCorrect: true, explanation: 'Multiplying numbers.length by 2 divides by twice the element count.' },
      { id: 'p2', text: 'Throws NullPointerException', isCorrect: false, explanation: 'The array exists, but the calculation logic is flawed.' },
    ],
    stepByStepHint: 'Change `numbers.length * 2` to `numbers.length`.',
    testCases: [
      {
        id: 'tc_java_1',
        inputDescription: 'calculateAverage(new double[]{10, 20, 30})',
        inputs: [[10, 20, 30]],
        expectedOutput: 20.0,
      },
    ],
    xp: 70,
  },
  {
    id: 'lesson_ts_lookup',
    chapter: 'Chapter 6: Exception Defense & Null Safety',
    chapterNumber: 6,
    concept: 'Optional Property & Index Defense',
    title: 'The Missing Array Element Crash',
    scenario: 'A user badge lookup accesses badges[0] without verifying if the user has unlocked any badges yet, causing runtime undefined errors.',
    language: 'typescript',
    brokenCode: `function getUserFirstBadge(badges: string[]): string {
    // Bug: if badges is empty, badges[0] is undefined
    // Calling .toUpperCase() on undefined crashes!
    return badges[0].toUpperCase();
}`,
    expectedBehavior: 'Guards against empty arrays, returning "NO_BADGE" if badges is empty.',
    bugExplanation: 'Accessing index [0] on an empty array produces undefined. Method calls on undefined raise runtime TypeErrors.',
    keyTakeaway: 'Always verify array length before accessing elements by index in TypeScript/JavaScript.',
    entryFunction: 'getUserFirstBadge',
    predictions: [
      { id: 'p1', text: 'Crashes with TypeError when badges is empty', isCorrect: true, explanation: 'Cannot read properties of undefined (reading "toUpperCase").' },
      { id: 'p2', text: 'Returns empty string', isCorrect: false, explanation: 'undefined does not automatically become an empty string.' },
    ],
    stepByStepHint: 'Add guard check `if (!badges || badges.length === 0) return "NO_BADGE";`.',
    testCases: [
      {
        id: 'tc_tl_1',
        inputDescription: 'getUserFirstBadge(["rookie", "master"])',
        inputs: [["rookie", "master"]],
        expectedOutput: 'ROOKIE',
      },
      {
        id: 'tc_tl_2',
        inputDescription: 'getUserFirstBadge([])',
        inputs: [[]],
        expectedOutput: 'NO_BADGE',
      },
    ],
    xp: 75,
  },
  {
    id: 'lesson_py_keyerror',
    chapter: 'Chapter 6: Exception Defense & Null Safety',
    chapterNumber: 6,
    concept: 'Dictionary Key Safety',
    title: 'The Unsafe Dictionary Key Lookup',
    scenario: 'The security gateway queries user session metadata for an auth token, but raises a fatal KeyError when guest sessions lack the token field.',
    language: 'python',
    brokenCode: `def get_auth_token(session_data):
    # Bug: session_data['token'] raises KeyError if 'token' is missing!
    return session_data['token']`,
    expectedBehavior: 'Safely retrieves token with fallback: session_data.get("token", "ANONYMOUS").',
    bugExplanation: 'Bracket notation dict[key] raises KeyError if the key does not exist. dict.get(key, default) safely returns a fallback value.',
    keyTakeaway: 'Always use .get(key, default) when accessing optional or external dictionary keys in Python.',
    entryFunction: 'get_auth_token',
    predictions: [
      { id: 'p1', text: 'Raises KeyError when "token" key is absent', isCorrect: true, explanation: 'Direct dict indexing raises KeyError for missing keys.' },
      { id: 'p2', text: 'Returns None safely', isCorrect: false, explanation: 'Bracket notation does not return None by default.' },
    ],
    stepByStepHint: 'Use `return session_data.get("token", "ANONYMOUS")`.',
    testCases: [
      {
        id: 'tc_pk_1',
        inputDescription: 'get_auth_token({"user": "agent", "token": "XYZ123"})',
        inputs: [{ user: 'agent', token: 'XYZ123' }],
        expectedOutput: 'XYZ123',
      },
      {
        id: 'tc_pk_2',
        inputDescription: 'get_auth_token({"user": "guest"})',
        inputs: [{ user: 'guest' }],
        expectedOutput: 'ANONYMOUS',
      },
    ],
    xp: 75,
  },
];

export class LearnService {
  static getAllLessons(): LearnLesson[] {
    return LEARN_LESSONS;
  }

  static getChapters(): LearnChapter[] {
    return LEARN_CHAPTERS;
  }

  static getLessonsByChapter(chapterNumber: number): LearnLesson[] {
    return LEARN_LESSONS.filter((l) => l.chapterNumber === chapterNumber);
  }

  static getLessonsByLanguage(lang: string): LearnLesson[] {
    if (lang === 'all') return LEARN_LESSONS;
    return LEARN_LESSONS.filter((l) => l.language === lang);
  }
}
