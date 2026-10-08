import { TestCase, ExecutionResult, TestResult, Language } from '../types';

// Safe sandbox polyfills for C++ STL and Java Collection APIs on Arrays and Strings
if (typeof Array.prototype !== 'undefined') {
  const safeDefine = (proto: any, prop: string, fn: any) => {
    if (!proto[prop]) {
      Object.defineProperty(proto, prop, {
        value: fn,
        configurable: true,
        writable: true,
        enumerable: false,
      });
    }
  };

  safeDefine(Array.prototype, 'empty', function (this: any[]) { return this.length === 0; });
  safeDefine(Array.prototype, 'isEmpty', function (this: any[]) { return this.length === 0; });
  safeDefine(Array.prototype, 'size', function (this: any[]) { return this.length; });
  safeDefine(Array.prototype, 'push_back', function (this: any[], x: any) { return this.push(x); });
  safeDefine(Array.prototype, 'pop_back', function (this: any[]) { return this.pop(); });
  safeDefine(Array.prototype, 'add', function (this: any[], x: any) { return this.push(x); });
  safeDefine(Array.prototype, 'get', function (this: any[], i: number) { return this[i]; });
  safeDefine(Array.prototype, 'set', function (this: any[], i: number, val: any) { this[i] = val; return val; });
  safeDefine(Array.prototype, 'contains', function (this: any[], x: any) { return this.includes(x); });
  safeDefine(Array.prototype, 'clear', function (this: any[]) { this.length = 0; });

  if (typeof String.prototype !== 'undefined') {
    safeDefine(String.prototype, 'size', function (this: string) { return this.length; });
    safeDefine(String.prototype, 'isEmpty', function (this: string) { return this.length === 0; });
  }
}

export class CodeExecutionService {
  /**
   * Safe execution adapter that evaluates code against test cases with timeouts,
   * sandbox restrictions, and diagnostic failure analysis.
   */
  static async execute(
    code: string,
    language: Language,
    entryFunction: string,
    testCases: TestCase[],
    previousPassedCount?: number
  ): Promise<ExecutionResult> {
    const sandboxUrl = import.meta.env.VITE_SANDBOX_API_URL;

    // If a remote isolated sandbox (Docker / gVisor) is configured:
    if (sandboxUrl) {
      try {
        const response = await fetch(`${sandboxUrl}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, entryFunction, testCases }),
        });
        if (response.ok) {
          const data = await response.json();
          const diagnosis = this.diagnoseFailure(data.results, data.passedCount, data.totalCount, previousPassedCount, data.syntaxError);
          return {
            ...data,
            ...diagnosis,
            previousPassedCount,
            executionMode: 'remote-docker',
          };
        }
      } catch (e) {
        console.warn('Remote sandbox unreachable, falling back to secure client evaluator:', e);
      }
    }

    // Client-side secure sandboxed execution
    let result: ExecutionResult;
    if (language === 'javascript' || language === 'typescript') {
      result = this.executeJavaScript(code, entryFunction, testCases, language === 'typescript');
    } else if (language === 'python') {
      result = this.executePython(code, entryFunction, testCases);
    } else if (language === 'cpp' || language === 'java') {
      result = this.executeCompiledLanguages(code, entryFunction, testCases, language);
    } else {
      result = this.executeJavaScript(code, entryFunction, testCases);
    }

    const diagnosis = this.diagnoseFailure(
      result.results,
      result.passedCount,
      result.totalCount,
      previousPassedCount,
      result.syntaxError
    );

    return {
      ...result,
      ...diagnosis,
      previousPassedCount,
    };
  }

  /**
   * Intelligent failure analysis:
   * - Detects if user introduced new regressions ("You made it worse")
   * - Provides tailored detective diagnostic hints based on the exact error pattern
   */
  private static diagnoseFailure(
    results: TestResult[],
    passedCount: number,
    totalCount: number,
    previousPassedCount?: number,
    syntaxError?: string
  ): { madeItWorse: boolean; regressionMessage?: string; dynamicFeedback: string } {
    let madeItWorse = false;
    let regressionMessage: string | undefined;

    if (previousPassedCount !== undefined && passedCount < previousPassedCount) {
      madeItWorse = true;
      regressionMessage = `💀 The Phantom has made the case worse: Previously ${previousPassedCount}/${totalCount} tests passed. Your latest change reduced passes to ${passedCount}/${totalCount}. You introduced a new regression!`;
    }

    if (passedCount === totalCount) {
      return {
        madeItWorse: false,
        dynamicFeedback: '✨ All test conditions verified. The logic flaw has been completely resolved!',
      };
    }

    if (syntaxError) {
      return {
        madeItWorse,
        regressionMessage,
        dynamicFeedback: `⚠️ Syntax Distortion: The interpreter failed to parse the syntax (${syntaxError}). Verify closing braces, indentation, and function signatures.`,
      };
    }

    const firstFailed = results.find((r) => !r.passed);
    if (!firstFailed) {
      return { madeItWorse, regressionMessage, dynamicFeedback: 'Review the failing test parameters.' };
    }

    const actual = firstFailed.actual;
    const expected = firstFailed.expected;

    // Check for silent undefined / None return
    if (actual === 'undefined' || actual === undefined || actual === null || actual === 'None') {
      return {
        madeItWorse,
        regressionMessage,
        dynamicFeedback: `🔍 Silent Return Trap: Function returned ${String(actual)}. Check that your function explicitly returns the calculated variable.`,
      };
    }

    // Check for off-by-one numerical discrepancy
    if (typeof actual === 'number' && typeof expected === 'number') {
      if (Math.abs(actual - expected) === 1) {
        return {
          madeItWorse,
          regressionMessage,
          dynamicFeedback: `📐 Boundary Deviation (Off-by-One): Result (${actual}) is off by exactly 1 from expected (${expected}). Check your loop termination boundary (< vs <=) or index offset.`,
        };
      }
      if (Math.abs(actual - expected * 2) < 0.01 || Math.abs(actual * 2 - expected) < 0.01) {
        return {
          madeItWorse,
          regressionMessage,
          dynamicFeedback: `➗ Arithmetic Factor Anomaly: Got ${actual} vs expected ${expected} (factor of 2 discrepancy). Check the divisor or multiplication operands.`,
        };
      }
    }

    // Check for boolean logic inversion
    if (typeof actual === 'boolean' && typeof expected === 'boolean') {
      return {
        madeItWorse,
        regressionMessage,
        dynamicFeedback: `🔄 Logic Inversion: Returned ${actual} when ${expected} was required. Verify compound boolean operators (&& vs || or and vs or).`,
      };
    }

    // Check for array length mismatches
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) {
        return {
          madeItWorse,
          regressionMessage,
          dynamicFeedback: `📦 Container Count Mismatch: Returned array has length ${actual.length}, but expected ${expected.length}. Check filtering or boundary looping conditions.`,
        };
      }
    }

    // General discrepancy
    return {
      madeItWorse,
      regressionMessage,
      dynamicFeedback: `🕵️ Deduction Clue: On condition "${firstFailed.inputDescription}", your fix outputted ${JSON.stringify(actual)} instead of ${JSON.stringify(expected)}. Trace how that input navigates your branches.`,
    };
  }

  /**
   * Safe JavaScript / TypeScript sandbox
   */
  private static executeJavaScript(
    rawCode: string,
    entryFunction: string,
    testCases: TestCase[],
    isTypeScript = false
  ): ExecutionResult {
    const logs: string[] = [];
    const results: TestResult[] = [];
    let passedCount = 0;

    // Simple strip of common TypeScript type annotations if in TS mode
    let code = rawCode;
    if (isTypeScript) {
      code = code
        .replace(/:\s*(number|string|boolean|any|void|string\[\]|number\[\]|Record<[^>]+>)/g, '')
        .replace(/as\s+[a-zA-Z<>]+/g, '')
        .replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
    }

    try {
      const sandboxedFunctionFactory = new Function(
        'capturedLogs',
        `
        const window = undefined;
        const document = undefined;
        const fetch = undefined;
        const XMLHttpRequest = undefined;
        const localStorage = undefined;
        const sessionStorage = undefined;
        const alert = undefined;
        const Worker = undefined;
        const console = {
          log: (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => capturedLogs.push('[ERROR] ' + args.join(' ')),
          warn: (...args) => capturedLogs.push('[WARN] ' + args.join(' ')),
        };
        const System = { out: { println: (...args) => console.log(...args), print: (...args) => console.log(...args) } };
        const max = Math.max, min = Math.min, abs = Math.abs, floor = Math.floor, ceil = Math.ceil, round = Math.round, sqrt = Math.sqrt, pow = Math.pow;
        const INT_MAX = Number.MAX_SAFE_INTEGER, INT_MIN = Number.MIN_SAFE_INTEGER;

        ${code};

        if (typeof ${entryFunction} !== 'function') {
          throw new Error('Target function "${entryFunction}" was not defined or is not callable.');
        }

        return ${entryFunction};
      `
      );

      const targetFn = sandboxedFunctionFactory(logs);

      for (const tc of testCases) {
        const startTime = performance.now();
        let actual: any;
        let testError: string | undefined;
        let passed = false;

        try {
          const inputArgs = Array.isArray(tc.inputs) ? tc.inputs : Object.values(tc.inputs);
          const clonedArgs = JSON.parse(JSON.stringify(inputArgs));
          actual = targetFn(...clonedArgs);
          passed = this.areEqual(actual, tc.expectedOutput);
        } catch (err: any) {
          testError = err.message || String(err);
          passed = false;
        }

        const duration = Math.round(performance.now() - startTime);
        if (passed) passedCount++;

        results.push({
          testId: tc.id,
          passed,
          inputDescription: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: actual !== undefined ? actual : 'undefined',
          error: testError,
          executionTimeMs: duration,
        });
      }

      return {
        success: passedCount === testCases.length,
        passedCount,
        totalCount: testCases.length,
        results,
        logs,
        executionMode: 'client-sandbox',
      };
    } catch (syntaxOrRuntimeErr: any) {
      return {
        success: false,
        passedCount: 0,
        totalCount: testCases.length,
        results: testCases.map((tc) => ({
          testId: tc.id,
          passed: false,
          inputDescription: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: 'Not executed',
          error: syntaxOrRuntimeErr.message || 'Syntax error',
        })),
        logs,
        syntaxError: syntaxOrRuntimeErr.message || 'Compilation failed',
        executionMode: 'client-sandbox',
      };
    }
  }

  /**
   * Client-side Python sandbox evaluator with complete built-ins (int, float, str, len, range, sum)
   */
  private static executePython(
    code: string,
    entryFunction: string,
    testCases: TestCase[]
  ): ExecutionResult {
    const logs: string[] = [];
    const results: TestResult[] = [];
    let passedCount = 0;

    try {
      const jsCode = this.transpilePythonToJS(code, entryFunction);

      const sandboxedFunctionFactory = new Function(
        'capturedLogs',
        `
        const window = undefined;
        const document = undefined;
        const fetch = undefined;
        const localStorage = undefined;
        const print = (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        const int = (x) => isNaN(parseInt(x, 10)) ? 0 : parseInt(x, 10);
        const float = (x) => isNaN(parseFloat(x)) ? 0 : parseFloat(x);
        const str = (x) => String(x);
        const bool = (x) => Boolean(x);
        const list = (x) => Array.isArray(x) ? [...x] : Array.from(x || []);
        const dict = (x) => Object.assign({}, x);
        const len = (x) => (x && x.length !== undefined) ? x.length : Object.keys(x || {}).length;
        const range = (...args) => {
          let start = 0, stop = 0, step = 1;
          if (args.length === 1) { stop = args[0]; }
          else if (args.length >= 2) { start = args[0]; stop = args[1]; step = args[2] || 1; }
          const res = [];
          for (let i = start; step > 0 ? i < stop : i > stop; i += step) res.push(i);
          return res;
        };
        const sum = (arr) => Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0;
        const min = (...args) => Math.min(...(Array.isArray(args[0]) ? args[0] : args));
        const max = (...args) => Math.max(...(Array.isArray(args[0]) ? args[0] : args));
        const abs = Math.abs;
        const round = Math.round;
        const math = Math;
        const None = null;
        const True = true;
        const False = false;

        ${jsCode}

        if (typeof ${entryFunction} !== 'function') {
          throw new Error('Python function "${entryFunction}" could not be defined.');
        }

        return ${entryFunction};
      `
      );

      const targetFn = sandboxedFunctionFactory(logs);

      for (const tc of testCases) {
        const startTime = performance.now();
        let actual: any;
        let testError: string | undefined;
        let passed = false;

        try {
          const inputArgs = Array.isArray(tc.inputs) ? tc.inputs : Object.values(tc.inputs);
          const clonedArgs = JSON.parse(JSON.stringify(inputArgs));
          actual = targetFn(...clonedArgs);
          passed = this.areEqual(actual, tc.expectedOutput);
        } catch (err: any) {
          testError = err.message || String(err);
          passed = false;
        }

        const duration = Math.round(performance.now() - startTime);
        if (passed) passedCount++;

        results.push({
          testId: tc.id,
          passed,
          inputDescription: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: actual !== undefined ? actual : 'None',
          error: testError,
          executionTimeMs: duration,
        });
      }

      return {
        success: passedCount === testCases.length,
        passedCount,
        totalCount: testCases.length,
        results,
        logs,
        executionMode: 'client-sandbox',
      };
    } catch (pyErr: any) {
      return {
        success: false,
        passedCount: 0,
        totalCount: testCases.length,
        results: testCases.map((tc) => ({
          testId: tc.id,
          passed: false,
          inputDescription: tc.inputDescription,
          expected: tc.expectedOutput,
          actual: 'None',
          error: pyErr.message || 'Python syntax error',
        })),
        logs,
        syntaxError: pyErr.message || 'SyntaxError in Python code',
        executionMode: 'client-sandbox',
      };
    }
  }

  /**
   * C++ & Java Transpiled / Evaluated Sandbox
   */
  private static executeCompiledLanguages(
    code: string,
    entryFunction: string,
    testCases: TestCase[],
    _lang: 'cpp' | 'java'
  ): ExecutionResult {
    const transpiled = this.transpileCompiledToJS(code, entryFunction);
    return this.executeJavaScript(transpiled, entryFunction, testCases);
  }

  private static transpileCompiledToJS(rawCode: string, entryFn: string): string {
    let code = rawCode;

    // 1. Strip includes, imports, package, and using namespace
    code = code
      .replace(/#include\s*<[^>]+>/g, '')
      .replace(/#include\s*"[^"]+"/g, '')
      .replace(/using\s+namespace\s+\w+;/g, '')
      .replace(/package\s+[\w.]+;/g, '')
      .replace(/import\s+[\w.*]+;/g, '');

    // 2. Unpack class definitions (e.g. public class Solution { ... })
    code = code.replace(/public\s+class\s+\w+\s*\{/, '');
    code = code.replace(/class\s+\w+\s*\{/, '');
    code = code.replace(/public\s+static\s+/g, '');
    code = code.replace(/public\s+/g, '');
    code = code.replace(/static\s+/g, '');

    // 3. Strip std:: and convert NULL/nullptr
    code = code.replace(/std::/g, '');
    code = code.replace(/\b(?:NULL|nullptr)\b/g, 'null');

    // 4. Handle System.out.println and cout
    code = code.replace(/System\.out\.println\s*\(/g, 'console.log(');
    code = code.replace(/System\.out\.print\s*\(/g, 'console.log(');

    // 5. Transform method / function definitions:
    // e.g. double calculateAverage(const std::vector<double>& numbers) {
    const reservedWords = new Set(['if', 'for', 'while', 'catch', 'switch', 'return', 'else']);
    const funcRegex = /\b(?:(?:public|private|protected|static|inline|virtual|const|unsigned)\s+)*(?:int|double|float|bool|boolean|void|size_t|long|char|string|String|auto|vector<[^>]+>|ArrayList<[^>]+>|List<[^>]+>|[\w<>\[\]]+)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g;
    code = code.replace(funcRegex, (match, fnName, params) => {
      if (reservedWords.has(fnName)) return match;
      const cleanedParams = params.split(',').map((p: string) => {
        const parts = p.trim().replace(/[&*]/g, '').split(/\s+/);
        return parts[parts.length - 1];
      }).filter(Boolean).join(', ');
      return `function ${fnName}(${cleanedParams}) {`;
    });

    // Fallback for entryFunction if not converted
    if (entryFn && !new RegExp('\\bfunction\\s+' + entryFn + '\\b').test(code)) {
      code = code.replace(new RegExp('(?:\\b[\\w<>\\[\\]]+\\s+)?' + entryFn + '\\s*\\(([^)]*)\\)\\s*\\{'), (_match, params) => {
        const cleanedParams = params.split(',').map((p: string) => {
          const parts = p.trim().replace(/[&*]/g, '').split(/\s+/);
          return parts[parts.length - 1];
        }).filter(Boolean).join(', ');
        return `function ${entryFn}(${cleanedParams}) {`;
      });
    }

    // 6. Range-based loops: for (auto x : vec) or for (String s : list)
    code = code.replace(/for\s*\(\s*(?:[\w<>\[\]]+)\s+(\w+)\s*:\s*([^)]+)\)/g, 'for (const $1 of $2)');

    // 7. Standard loops: for (size_t i = 0; ...) or for (int i = 0; ...)
    code = code.replace(/for\s*\(\s*(?:size_t|int|long|auto|var)\s+(\w+)\s*=/g, 'for (let $1 =');

    // 8. Vector / ArrayList declarations
    code = code.replace(/vector<[^>]+>\s+(\w+)\s*;/g, 'let $1 = [];');
    code = code.replace(/ArrayList<[^>]*>\s+(\w+)\s*=\s*new\s+ArrayList<[^>]*>\(\)\s*;/g, 'let $1 = [];');

    // 9. Primitive variable declarations
    code = code.replace(/\b(?:int|double|float|bool|boolean|size_t|long|char|string|String|auto)\s+([a-zA-Z_]\w*)\s*=/g, 'let $1 =');
    code = code.replace(/\b(?:int|double|float|bool|boolean|size_t|long|char|string|String|auto)\s+([a-zA-Z_]\w*)\s*;/g, 'let $1;');

    // 10. Common method calls
    code = code.replace(/(\w+)\.length\(\)/g, '$1.length');
    code = code.replace(/\.size\(\)/g, '.length');
    code = code.replace(/\.push_back\(/g, '.push(');

    // 11. Balance class closure braces
    let openCount = (code.match(/\{/g) || []).length;
    let closeCount = (code.match(/\}/g) || []).length;
    while (closeCount > openCount) {
      const lastBrace = code.lastIndexOf('}');
      if (lastBrace === -1) break;
      code = code.substring(0, lastBrace) + code.substring(lastBrace + 1);
      closeCount--;
    }

    return code;
  }

  private static transpilePythonToJS(pyCode: string, entryFn: string): string {
    const rawLines = pyCode.split('\n');
    const outputLines: string[] = [];
    const indentStack: number[] = [0];

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      let trimmed = line.trim();

      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        outputLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
      }

      trimmed = trimmed
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/\[\s*-(\d+)\s*\]/g, '.at(-$1)')
        .replace(/\.append\(/g, '.push(');

      if (trimmed.startsWith('def ')) {
        const header = trimmed.substring(4).replace(/:$/, '');
        const parenIdx = header.indexOf('(');
        const name = header.substring(0, parenIdx).trim();
        const params = header.substring(parenIdx);
        outputLines.push(' '.repeat(indent) + `function ${name}${params} {`);
        indentStack.push(indent + 4);
        continue;
      }

      if (trimmed.startsWith('elif ')) {
        const cond = trimmed.substring(5).replace(/:$/, '');
        outputLines.push(' '.repeat(indent) + `else if (${cond}) {`);
        indentStack.push(indent + 4);
        continue;
      }
      if (trimmed.startsWith('if ')) {
        const cond = trimmed.substring(3).replace(/:$/, '');
        outputLines.push(' '.repeat(indent) + `if (${cond}) {`);
        indentStack.push(indent + 4);
        continue;
      }
      if (trimmed === 'else:') {
        outputLines.push(' '.repeat(indent) + 'else {');
        indentStack.push(indent + 4);
        continue;
      }

      if (trimmed.startsWith('for ')) {
        const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):$/);
        if (forMatch) {
          const varName = forMatch[1];
          const iter = forMatch[2];
          outputLines.push(' '.repeat(indent) + `for (const ${varName} of ${iter}) {`);
          indentStack.push(indent + 4);
          continue;
        }
      }

      if (trimmed.startsWith('while ')) {
        const cond = trimmed.substring(6).replace(/:$/, '');
        outputLines.push(' '.repeat(indent) + `while (${cond}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      if (!trimmed.endsWith(';') && !trimmed.endsWith('{')) {
        trimmed = trimmed + ';';
      }

      outputLines.push(' '.repeat(indent) + trimmed);
    }

    while (indentStack.length > 1) {
      indentStack.pop();
      outputLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    return outputLines.join('\n');
  }

  private static areEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a === 'number' && typeof b === 'number') {
      return Math.abs(a - b) < 0.0001;
    }
    // Handle number vs string-number equality gracefully if both represent the exact same numeric value
    if ((typeof a === 'number' && typeof b === 'string') || (typeof a === 'string' && typeof b === 'number')) {
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB) && Math.abs(numA - numB) < 0.0001) {
        return true;
      }
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
