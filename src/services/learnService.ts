import { LearnLesson } from '../types';

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'lesson_vars',
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
    id: 'lesson_functions',
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
    id: 'lesson_ts_types',
    concept: 'TypeScript Type Narrowing',
    title: 'The Unchecked Optional Parameter',
    scenario: 'A discount calculator attempts to call methods on an optional voucher code without checking if it exists.',
    language: 'typescript',
    brokenCode: `function applyDiscount(price: number, discountPct?: number): number {
    // Bug: discountPct could be undefined!
    // Subtracting undefined produces NaN:
    return price - (price * (discountPct / 100));
}`,
    expectedBehavior: 'Checks if discountPct is defined before computing discount: default to 0 if undefined.',
    bugExplanation: 'Optional parameters in TypeScript can be undefined at runtime. Arithmetic with undefined results in NaN.',
    keyTakeaway: 'Always use nullish coalescing `discountPct ?? 0` or guard clauses to protect optional numbers.',
    entryFunction: 'applyDiscount',
    predictions: [
      { id: 'p1', text: 'Produces NaN when discountPct is omitted', isCorrect: true, explanation: 'price * (undefined / 100) resolves to NaN.' },
      { id: 'p2', text: 'Defaults to 0% discount automatically', isCorrect: false, explanation: 'TypeScript compiles to JS where undefined is not automatically converted to 0.' },
    ],
    stepByStepHint: 'Use default value `discountPct = 0` or `const pct = discountPct ?? 0;`.',
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
  {
    id: 'lesson_cpp_vec',
    concept: 'C++ Boundary Bounds',
    title: 'The Phantom Segment Fault',
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
  {
    id: 'lesson_java_null',
    concept: 'Java Exception Guarding',
    title: 'The Ghost Null Pointer Guard',
    scenario: 'A text analyzer checks length without verifying if the incoming string reference is null.',
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
];
