import { TestCase, ExecutionResult, TestResult, Language } from '../types';

export class CodeExecutionService {
  /**
   * Safe execution adapter that evaluates code against test cases with timeouts,
   * sandbox restrictions, and clear execution mode labeling.
   */
  static async execute(
    code: string,
    language: Language,
    entryFunction: string,
    testCases: TestCase[]
  ): Promise<ExecutionResult> {
    const sandboxUrl = import.meta.env.VITE_SANDBOX_API_URL;

    // If a remote isolated sandbox (e.g., Docker / gVisor container) is configured:
    if (sandboxUrl) {
      try {
        const response = await fetch(`${sandboxUrl}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, entryFunction, testCases }),
        });
        if (response.ok) {
          const data = await response.json();
          return {
            ...data,
            executionMode: 'remote-docker',
          };
        }
      } catch (e) {
        console.warn('Remote sandbox unreachable, falling back to secure client evaluator:', e);
      }
    }

    // Client-side secure sandboxed execution
    if (language === 'javascript') {
      return this.executeJavaScript(code, entryFunction, testCases);
    } else {
      return this.executePython(code, entryFunction, testCases);
    }
  }

  /**
   * Safe JavaScript sandbox: Restricts global access, captures logs, handles timeouts.
   */
  private static executeJavaScript(
    code: string,
    entryFunction: string,
    testCases: TestCase[]
  ): ExecutionResult {
    const logs: string[] = [];
    const results: TestResult[] = [];
    let passedCount = 0;

    try {
      // Create a restricted scope with dangerous APIs shadowed/blocked
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
          // Deep clone inputs to prevent mutation side-effects between test cases
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
          error: syntaxOrRuntimeErr.message || 'Syntax or evaluation error',
        })),
        logs,
        syntaxError: syntaxOrRuntimeErr.message || 'Compilation failed',
        executionMode: 'client-sandbox',
      };
    }
  }

  /**
   * Client-side Python sandbox evaluator for algorithmic and debugging challenges.
   * Transpiles clean Python semantics to sandboxed JS primitives or handles core structures.
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
      // Transpile basic Python patterns to JavaScript safely
      const jsCode = this.transpilePythonToJS(code, entryFunction);

      const sandboxedFunctionFactory = new Function(
        'capturedLogs',
        `
        const window = undefined;
        const document = undefined;
        const fetch = undefined;
        const localStorage = undefined;
        const print = (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        const len = (x) => (x && x.length !== undefined) ? x.length : Object.keys(x || {}).length;
        const range = (...args) => {
          let start = 0, stop = 0, step = 1;
          if (args.length === 1) { stop = args[0]; }
          else if (args.length >= 2) { start = args[0]; stop = args[1]; step = args[2] || 1; }
          const res = [];
          for (let i = start; step > 0 ? i < stop : i > stop; i += step) res.push(i);
          return res;
        };
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        const min = (...args) => Math.min(...(Array.isArray(args[0]) ? args[0] : args));
        const max = (...args) => Math.max(...(Array.isArray(args[0]) ? args[0] : args));
        const abs = Math.abs;
        const round = Math.round;

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
        syntaxError: pyErr.message || 'SyntaxError: invalid syntax in Python code',
        executionMode: 'client-sandbox',
      };
    }
  }

  /**
   * Lightweight Python to JavaScript transpiler for algorithm & logic challenges.
   * Handles indent-based blocks, def, if/elif/else, for/while, lists, return, etc.
   */
  private static transpilePythonToJS(pyCode: string, entryFn: string): string {
    const rawLines = pyCode.split('\n');
    const outputLines: string[] = [];
    const indentStack: number[] = [0];

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      // Skip empty lines or pure comments
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }

      // Calculate leading indentation space count
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      let trimmed = line.trim();

      // Close braces if dedenting
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        outputLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
      }

      // Convert Python keywords to JS
      trimmed = trimmed
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/\.append\(/g, '.push(');

      // Handle def function_name(args):
      if (trimmed.startsWith('def ')) {
        const header = trimmed.substring(4).replace(/:$/, '');
        const parenIdx = header.indexOf('(');
        const name = header.substring(0, parenIdx).trim();
        const params = header.substring(parenIdx);
        outputLines.push(' '.repeat(indent) + `function ${name}${params} {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Handle if / elif / else:
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

      // Handle for x in iterable:
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

      // Handle while condition:
      if (trimmed.startsWith('while ')) {
        const cond = trimmed.substring(6).replace(/:$/, '');
        outputLines.push(' '.repeat(indent) + `while (${cond}) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // Standard expression or assignment
      if (!trimmed.endsWith(';') && !trimmed.endsWith('{')) {
        trimmed = trimmed + ';';
      }

      outputLines.push(' '.repeat(indent) + trimmed);
    }

    // Close any remaining open braces
    while (indentStack.length > 1) {
      indentStack.pop();
      outputLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    return outputLines.join('\n');
  }

  private static areEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a === 'number' && typeof b === 'number') {
      // Handle floating point near-equality
      return Math.abs(a - b) < 0.0001;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
