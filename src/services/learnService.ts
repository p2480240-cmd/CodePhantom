import { LearnLesson } from '../types';

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'lesson_vars',
    concept: 'Variables & Data Types',
    title: 'The Type Trap in Currency Exchange',
    scenario: 'The cyber bazaar exchange kiosk received a string instead of a float, causing numeric addition to concatenate text!',
    language: 'python',
    brokenCode: `def convert_credits(raw_amount, bonus):
    # Bug: raw_amount is passed as a string like "50"!
    # String concatenation results in "50" + 10 -> TypeError or "5010"
    return int(raw_amount) + bonus`,
    expectedBehavior: 'Converts raw string input into an integer or float before adding the bonus.',
    bugExplanation: 'Adding numbers and strings in Python causes TypeErrors. Explicitly cast `int(raw_amount)` or `float(raw_amount)`.',
    keyTakeaway: 'Always validate or cast external inputs into numeric types before performing arithmetic.',
    entryFunction: 'convert_credits',
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
    id: 'lesson_cond',
    concept: 'Conditions & Logic',
    title: 'The Over-Generous Security Gate',
    scenario: 'The perimeter gate uses an OR check where both credentials should be strictly required.',
    language: 'javascript',
    brokenCode: `function checkAccess(hasBadge, isStaff) {
    // Bug: allows anyone who has a badge OR is staff!
    // Rule: Must be staff AND possess a badge.
    return hasBadge || isStaff;
}`,
    expectedBehavior: 'Returns true only if the user is staff AND has a badge.',
    bugExplanation: 'Using `||` (logical OR) passes if either condition is true. `&&` (logical AND) ensures both are satisfied.',
    keyTakeaway: 'Logical OR (`||`) permits alternatives; logical AND (`&&`) enforces strict prerequisites.',
    entryFunction: 'checkAccess',
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
    id: 'lesson_loops',
    concept: 'Loops & Iteration',
    title: 'The Eternal Loop of Sector 9',
    scenario: 'A maintenance patrol loop never advances its index pointer, freezing the drone control system.',
    language: 'javascript',
    brokenCode: `function countDrones(limit) {
    let count = 0;
    let i = 0;
    while (i < limit) {
        count++;
        // Bug: missing i++ increment causes an infinite loop!
        i++;
    }
    return count;
}`,
    expectedBehavior: 'Iterates up to limit and returns the count without hanging.',
    bugExplanation: 'While loops without condition mutations become infinite loops, hanging threads or freezing browsers.',
    keyTakeaway: 'Always ensure while loops have an increment or condition variable that advances toward the termination boundary.',
    entryFunction: 'countDrones',
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
    concept: 'Indexing & Boundary Errors',
    title: 'The Edge of the World (Off-by-One)',
    scenario: 'A scanner checks coordinates in an array using `<= length`, reading undefined and crashing telemetry.',
    language: 'python',
    brokenCode: `def get_first_and_last(items):
    if len(items) == 0:
        return []
    # Bug: accessing index len(items) throws IndexError!
    # Valid last item is at len(items) - 1 or items[-1]
    return [items[0], items[len(items)]]`,
    expectedBehavior: 'Returns a list containing the first and the last element of items.',
    bugExplanation: 'Zero-indexed lists of length N have indices 0 to N-1. Index N is out of bounds.',
    keyTakeaway: 'Remember that indices range from 0 to length - 1. In Python, `items[-1]` is the cleanest way to access the last element.',
    entryFunction: 'get_first_and_last',
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
    id: 'lesson_functions',
    concept: 'Functions & Return Values',
    title: 'The Silent Void Return',
    scenario: 'A mathematical multiplier computes the answer but forgets to return it, giving `undefined` to calling routines.',
    language: 'javascript',
    brokenCode: `function multiplyEnergy(base, multiplier) {
    let total = base * multiplier;
    // Bug: forgets to return total!
}`,
    expectedBehavior: 'Returns the computed product: base * multiplier.',
    bugExplanation: 'Functions without an explicit `return` evaluate to `undefined` in JavaScript and `None` in Python.',
    keyTakeaway: 'Always verify your functions explicitly `return` their intended calculation results.',
    entryFunction: 'multiplyEnergy',
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
];
