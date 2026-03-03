import { describe, it, expect } from 'vitest';
import {
  fitLinearRegression,
  predictLinearRegression,
} from './linearRegression';

describe('linearRegression', () => {
  it('fits and predicts simple line', () => {
    // y = 1 + 2*x
    const X = [[1], [2], [3], [4], [5]];
    const y = [3, 5, 7, 9, 11];
    const result = fitLinearRegression(X, y);
    expect(result.intercept).toBeCloseTo(1, 0);
    expect(result.coefficients[0]).toBeCloseTo(2, 0);
    expect(result.predictions.length).toBe(5);
    expect(result.r2).toBeGreaterThan(0.99);
  });

  it('handles empty X', () => {
    const result = fitLinearRegression([], []);
    expect(result.coefficients).toEqual([]);
    expect(result.intercept).toBe(0);
    expect(result.predictions).toEqual([]);
    expect(result.mse).toBe(0);
    expect(result.r2).toBe(0);
  });

  it('predict uses intercept and coefficients', () => {
    const X = [[10], [20]];
    const intercept = 5;
    const coefficients = [2];
    const pred = predictLinearRegression(X, intercept, coefficients);
    expect(pred[0]).toBe(5 + 10 * 2);
    expect(pred[1]).toBe(5 + 20 * 2);
  });
});
