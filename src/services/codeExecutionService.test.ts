import { describe, it, expect } from 'vitest';
import { CodeExecutionService } from './codeExecutionService';
import { TestCase } from '../types';

describe('CodeExecutionService', () => {
  it('should correctly execute valid JavaScript code against test cases', async () => {
    const code = `
      function add(a, b) {
        return a + b;
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'add(2, 3)', inputs: [2, 3], expectedOutput: 5 },
      { id: '2', inputDescription: 'add(-1, 1)', inputs: [-1, 1], expectedOutput: 0 },
    ];

    const result = await CodeExecutionService.execute(code, 'javascript', 'add', testCases);
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(2);
    expect(result.totalCount).toBe(2);
    expect(result.results[0].passed).toBe(true);
    expect(result.results[1].passed).toBe(true);
  });

  it('should catch runtime errors and return failure without crashing', async () => {
    const brokenCode = `
      function divide(a, b) {
        throw new Error('Boom');
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'divide(10, 2)', inputs: [10, 2], expectedOutput: 5 },
    ];

    const result = await CodeExecutionService.execute(brokenCode, 'javascript', 'divide', testCases);
    expect(result.success).toBe(false);
    expect(result.passedCount).toBe(0);
    expect(result.results[0].error).toContain('Boom');
  });

  it('should detect off-by-one boundary discrepancy and provide tailored detective clue', async () => {
    const code = `
      function countItems(n) {
        return n - 1; // Off by one error
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'countItems(5)', inputs: [5], expectedOutput: 5 },
    ];

    const result = await CodeExecutionService.execute(code, 'javascript', 'countItems', testCases);
    expect(result.success).toBe(false);
    expect(result.dynamicFeedback).toContain('Boundary Deviation (Off-by-One)');
  });

  it('should detect logic inversion errors', async () => {
    const code = `
      function isEven(n) {
        return n % 2 !== 0; // Inverted logic
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'isEven(4)', inputs: [4], expectedOutput: true },
    ];

    const result = await CodeExecutionService.execute(code, 'javascript', 'isEven', testCases);
    expect(result.success).toBe(false);
    expect(result.dynamicFeedback).toContain('Logic Inversion');
  });

  it('should prevent access to restricted browser globals in sandbox', async () => {
    const maliciousCode = `
      function hack() {
        return typeof window === 'undefined' && typeof document === 'undefined' && typeof fetch === 'undefined';
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'hack()', inputs: [], expectedOutput: true },
    ];

    const result = await CodeExecutionService.execute(maliciousCode, 'javascript', 'hack', testCases);
    expect(result.success).toBe(true);
    expect(result.results[0].actual).toBe(true);
  });

  it('should handle Python emulation code successfully', async () => {
    const pythonCode = `
def double_val(x):
    return x * 2
`;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'double_val(7)', inputs: [7], expectedOutput: 14 },
    ];

    const result = await CodeExecutionService.execute(pythonCode, 'python', 'double_val', testCases);
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(1);
  });

  it('should block malicious prototype tampering attempts', async () => {
    const maliciousCode = `
      function exploit() {
        return Object.__proto__;
      }
    `;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'exploit()', inputs: [], expectedOutput: null },
    ];

    const result = await CodeExecutionService.execute(maliciousCode, 'javascript', 'exploit', testCases);
    expect(result.success).toBe(false);
    expect(result.results[0].error).toContain('Security Exception');
  });

  it('should reject invalid entryFunction identifier syntax', async () => {
    const code = `function valid() { return 1; }`;
    const testCases: TestCase[] = [
      { id: '1', inputDescription: 'valid()', inputs: [], expectedOutput: 1 },
    ];

    const result = await CodeExecutionService.execute(code, 'javascript', 'valid; alert(1)', testCases);
    expect(result.success).toBe(false);
    expect(result.results[0].error).toContain('Security Exception');
  });
});
