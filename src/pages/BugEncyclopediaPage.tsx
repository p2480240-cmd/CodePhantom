import React, { useState } from 'react';
import { BookOpen, Bug, CheckCircle2, Play, AlertTriangle, ShieldCheck, Search, Filter } from 'lucide-react';
import { BugEncyclopediaEntry, Language } from '../types';

export const BUG_DATABASE: BugEncyclopediaEntry[] = [
  {
    id: 'bug_off_by_one',
    name: 'Off-by-One Error',
    icon: '📐',
    severity: 'High',
    concept: 'Array & Loop Boundaries',
    whatItIs: 'A boundary condition error where an iteration or slice runs one step too few or one step too far.',
    typicalSymptoms: [
      'IndexError or out-of-bounds exception on the last iteration',
      'The final item in a list or sequence is mysteriously skipped',
      'Calculated lengths or offsets differ from expected by exactly 1',
    ],
    codeExample: `// BUG: Loop iterates <= length instead of < length
for (let i = 0; i <= arr.length; i++) {
    console.log(arr[i]); // Throws undefined / crash on last step!
}`,
    howToDetect: 'Check loop operators: use `< length` for 0-indexed arrays, or check slice start/end indices.',
    commonMistakes: [
      'Using <= instead of < with 0-indexed arrays',
      'Forgetting that slice(start, end) stops BEFORE the end index',
      'Assuming range(1, 10) in Python includes 10',
    ],
    miniChallenge: {
      broken: 'function getLast(arr) { return arr[arr.length]; }',
      fixed: 'function getLast(arr) { return arr[arr.length - 1]; }',
      language: 'javascript',
      task: 'Fix the index accessor so it returns the last element instead of undefined.',
      entryFn: 'getLast',
      testInput: [[10, 20, 30]],
      expected: 30,
    },
  },
  {
    id: 'bug_logic_inversion',
    name: 'Boolean Logic Inversion',
    icon: '🔄',
    severity: 'Critical',
    concept: 'Conditional Operators',
    whatItIs: 'An error where boolean conditions (AND/OR, ==/!=) are accidentally inverted, allowing unauthorized or incorrect branches to execute.',
    typicalSymptoms: [
      'Access granted to invalid users or denied to authorized users',
      'Code branch runs only when condition is supposedly false',
    ],
    codeExample: `// BUG: Admits user if NOT having keycard!
if (isAdmin || !hasKeycard) { grantAccess(); }`,
    howToDetect: 'Trace truth tables: verify whether both conditions must hold simultaneously (&&) or either (||).',
    commonMistakes: [
      'Confusing || (logical OR) with && (logical AND)',
      'Mixing up negative conditions like != and !hasPermission',
    ],
    miniChallenge: {
      broken: 'function checkVote(age) { return age < 18; }',
      fixed: 'function checkVote(age) { return age >= 18; }',
      language: 'javascript',
      task: 'Fix condition so users aged 18 and older are eligible to vote.',
      entryFn: 'checkVote',
      testInput: [20],
      expected: true,
    },
  },
  {
    id: 'bug_variable_shadowing',
    name: 'Variable Shadowing & Scope Leak',
    icon: '👤',
    severity: 'High',
    concept: 'Scope & Mutation',
    whatItIs: 'Re-declaring an existing variable inside an inner block, unintentionally masking the outer variable.',
    typicalSymptoms: [
      'Accumulator variables reset to initial value on each iteration',
      'Changes made inside loops or functions disappear after exit',
    ],
    codeExample: `let total = 100;
for (let num of items) {
    let total = 100 - num; // Re-declares inner total!
}
return total; // Remains 100!`,
    howToDetect: 'Look for `let`, `const`, or `var` keywords inside loop blocks with identical names to outer variables.',
    commonMistakes: [
      'Re-declaring accumulators with `let` inside loop bodies',
      'Shadowing parameter names with local helper variables',
    ],
    miniChallenge: {
      broken: 'function subAll(start, nums) { for (let n of nums) { let start = start - n; } return start; }',
      fixed: 'function subAll(start, nums) { for (let n of nums) { start = start - n; } return start; }',
      language: 'javascript',
      task: 'Remove the let inside the loop so start accumulates mutations properly.',
      entryFn: 'subAll',
      testInput: [100, [10, 20]],
      expected: 70,
    },
  },
  {
    id: 'bug_type_coercion',
    name: 'Type Coercion & Concatenation Trap',
    icon: '🧬',
    severity: 'Medium',
    concept: 'Types & Conversions',
    whatItIs: 'Mixing numeric and string data types in addition operations, resulting in string concatenation instead of addition.',
    typicalSymptoms: [
      '"10" + 20 produces "1020" instead of 30',
      'Subtle string comparisons like "10" < "2" evaluating to true alphabetically',
    ],
    codeExample: `def add_bonus(score_str, bonus):
    return score_str + bonus # Concatenates '100' + 25 -> Error in Python!`,
    howToDetect: 'Log `typeof` or `type(x)` for inputs fetched from URLs, text fields, or user requests.',
    commonMistakes: [
      'Assuming API or prompt inputs are numbers when they are strings',
      'Forgetting to parse before math operations',
    ],
    miniChallenge: {
      broken: 'def parse_add(a_str, b): return int(a_str) + b',
      fixed: 'def parse_add(a_str, b): return int(a_str) + b',
      language: 'python',
      task: 'Cast string to integer before adding.',
      entryFn: 'parse_add',
      testInput: ['40', 2],
      expected: 42,
    },
  },
  {
    id: 'bug_silent_return',
    name: 'Missing Return / Silent Void',
    icon: '🕳️',
    severity: 'Medium',
    concept: 'Function Contracts',
    whatItIs: 'Calculating the solution inside a function but omitting the `return` statement, causing calling code to receive undefined or None.',
    typicalSymptoms: [
      'Function completes without errors but downstream code fails with null/undefined errors',
      'Return value is always None',
    ],
    codeExample: `function compute(a, b) {
    let result = a * b;
    // Forgets to return result!
}`,
    howToDetect: 'Verify all execution paths in the function culminate in an explicit `return` statement.',
    commonMistakes: [
      'Assuming the last expression in JavaScript auto-returns (like Ruby/Rust)',
      'Returning inside an if branch but forgetting the else path',
    ],
    miniChallenge: {
      broken: 'function square(n) { let res = n * n; }',
      fixed: 'function square(n) { return n * n; }',
      language: 'javascript',
      task: 'Add return statement to yield product.',
      entryFn: 'square',
      testInput: [5],
      expected: 25,
    },
  },
  {
    id: 'bug_falsy_zero',
    name: 'Truthy/Falsy Evaluation Trap (0 is Falsy)',
    icon: '0️⃣',
    severity: 'High',
    concept: 'Truthy & Falsy Logic',
    whatItIs: 'Checking `if (x)` to see if a variable exists, inadvertently treating valid numbers like 0 or empty strings as missing/false.',
    typicalSymptoms: [
      'Zero-value inputs or index 0 elements are dropped from processed lists',
      'Default fallbacks override legitimate 0 values',
    ],
    codeExample: `// BUG: Drops 0 packets because 0 is falsy!
if (packet && !list.includes(packet)) {
    list.push(packet);
}`,
    howToDetect: 'Use strict checks: `x !== null && x !== undefined` instead of relying on `if (x)`.',
    commonMistakes: [
      'Using `if (value)` when value can legitimately be 0 or false',
      'Using `value || defaultValue` instead of nullish coalescing `value ?? defaultValue`',
    ],
    miniChallenge: {
      broken: 'function isDefined(n) { return n ? true : false; }',
      fixed: 'function isDefined(n) { return n !== null && n !== undefined; }',
      language: 'javascript',
      task: 'Fix function so that isDefined(0) returns true.',
      entryFn: 'isDefined',
      testInput: [0],
      expected: true,
    },
  },
];

export const BugEncyclopediaPage: React.FC = () => {
  const [selectedBug, setSelectedBug] = useState<BugEncyclopediaEntry>(BUG_DATABASE[0]);
  const [search, setSearch] = useState('');
  const [miniSolved, setMiniSolved] = useState(false);

  const filtered = BUG_DATABASE.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.concept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-phantom-deep border border-phantom-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phantom-purple/20 border border-phantom-purple/40 text-phantom-violet text-xs font-mono font-semibold mb-2">
            <Bug className="w-3.5 h-3.5" />
            <span>Digital Detective Bestiary</span>
          </div>
          <h2 className="text-2xl font-black text-white">The Bug Encyclopedia</h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
            Detailed anatomy, symptoms, detection tactics, and mini debugging experiments for common programming shadows.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bug categories..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:border-phantom-cyan outline-none"
          />
        </div>
      </div>

      {/* Grid: Left List / Right Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {filtered.map((bug) => {
            const active = selectedBug.id === bug.id;
            return (
              <div
                key={bug.id}
                onClick={() => {
                  setSelectedBug(bug);
                  setMiniSolved(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  active
                    ? 'bg-phantom-purple/20 border-phantom-cyan shadow-glow-cyan'
                    : 'bg-phantom-deep hover:bg-phantom-hover border-phantom-border/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{bug.icon}</span>
                    <h4 className="text-sm font-bold text-white">{bug.name}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      bug.severity === 'Critical'
                        ? 'bg-phantom-crimson/20 text-phantom-crimson'
                        : 'bg-phantom-amber/20 text-phantom-amber'
                    }`}
                  >
                    {bug.severity}
                  </span>
                </div>
                <div className="text-[11px] text-white/50 font-mono ml-7">
                  {bug.concept}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-phantom-deep border border-phantom-border shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedBug.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedBug.name}</h3>
                <span className="text-xs text-phantom-cyan font-mono">{selectedBug.concept}</span>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-phantom-purple/20 text-phantom-violet border border-phantom-purple/40">
              Severity: {selectedBug.severity}
            </span>
          </div>

          {/* What it is */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-phantom-violet uppercase tracking-wider font-mono">
              Anatomy & Definition
            </span>
            <p className="text-xs text-white/80 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
              {selectedBug.whatItIs}
            </p>
          </div>

          {/* Typical symptoms */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-phantom-amber uppercase tracking-wider font-mono">
              Observable Symptoms
            </span>
            <ul className="space-y-1.5 text-xs text-white/80">
              {selectedBug.typicalSymptoms.map((sym, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-phantom-amber font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code example */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-phantom-cyan uppercase tracking-wider font-mono">
              Suspicious Code Signature
            </span>
            <pre className="p-3 bg-[#050813] border border-white/10 rounded-xl font-mono text-xs text-phantom-white overflow-x-auto whitespace-pre">
              {selectedBug.codeExample}
            </pre>
          </div>

          {/* Detection & Common Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-black/40 border border-phantom-teal/30 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-phantom-teal font-mono uppercase block">
                How to Detect
              </span>
              <p className="text-white/80 leading-relaxed text-[11px]">
                {selectedBug.howToDetect}
              </p>
            </div>

            <div className="p-3.5 bg-black/40 border border-phantom-crimson/30 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-phantom-crimson font-mono uppercase block">
                Common Traps
              </span>
              <ul className="space-y-1 text-white/80 text-[11px]">
                {selectedBug.commonMistakes.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Mini Challenge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1633] to-[#080d1e] border border-phantom-cyan/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-phantom-cyan" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">
                  Mini Diagnostic Challenge
                </h4>
              </div>
              <span className="text-[10px] font-mono text-phantom-amber">+25 XP</span>
            </div>

            <p className="text-xs text-white/80">{selectedBug.miniChallenge.task}</p>

            <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-lg border border-white/10 font-mono text-xs">
              <span className={miniSolved ? 'text-phantom-teal font-bold' : 'text-white/70'}>
                {miniSolved ? selectedBug.miniChallenge.fixed : selectedBug.miniChallenge.broken}
              </span>
              <button
                onClick={() => setMiniSolved(!miniSolved)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  miniSolved
                    ? 'bg-phantom-teal text-black shadow-glow-teal'
                    : 'bg-phantom-purple text-white hover:bg-phantom-violet'
                }`}
              >
                {miniSolved ? '✓ Verified!' : 'Apply Detective Fix'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
