import type { ClaimRecord } from '../models/claim';

export interface CorrelationMatrix {
  keys: string[];
  matrix: number[][];
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  correlationWithTarget: number;
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[], m?: number): number {
  if (arr.length === 0) return 0;
  const avg = m ?? mean(arr);
  const variance =
    arr.reduce((s, x) => s + (x - avg) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function correlation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  const mx = mean(x);
  const my = mean(y);
  const sx = std(x, mx);
  const sy = std(y, my);
  if (sx < 1e-12 || sy < 1e-12) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += (x[i] - mx) * (y[i] - my);
  return sum / (n * sx * sy);
}

const NUMERIC_KEYS = [
  'age',
  'bmi',
  'children',
  'hospitalization_days',
  'annual_income',
] as const;

const CATEGORICAL_KEYS = [
  'gender',
  'smoker',
  'region',
  'pre_existing_disease',
  'policy_type',
] as const;

function encodeCategorical(
  data: ClaimRecord[],
  key: (typeof CATEGORICAL_KEYS)[number]
): number[] {
  const uniq = [...new Set(data.map((r) => (r as unknown as Record<string, unknown>)[key]))];
  const map = new Map(uniq.map((v, i) => [String(v), i]));
  return data.map((r) => map.get(String((r as unknown as Record<string, unknown>)[key])) ?? 0);
}

/**
 * Build numeric matrix for correlation: numeric columns + encoded categorical.
 */
function getNumericMatrix(data: ClaimRecord[]): { matrix: number[][]; keys: string[] } {
  const keys: string[] = [...NUMERIC_KEYS];
  const matrix: number[][] = data.map((r) => [...NUMERIC_KEYS.map((k) => (r as unknown as Record<string, unknown>)[k] as number)]);

  for (const key of CATEGORICAL_KEYS) {
    keys.push(key);
    const col = encodeCategorical(data, key);
    col.forEach((v, i) => matrix[i].push(v));
  }

  keys.push('claim_cost');
  data.forEach((r, i) => matrix[i].push(r.claim_cost));

  return { matrix, keys };
}

export function getCorrelationMatrix(data: ClaimRecord[]): CorrelationMatrix {
  if (data.length === 0) {
    return { keys: [], matrix: [] };
  }
  const { matrix, keys } = getNumericMatrix(data);
  const n = keys.length;
  const corr: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    corr[i][i] = 1;
    const colI = matrix.map((row) => row[i]);
    for (let j = i + 1; j < n; j++) {
      const colJ = matrix.map((row) => row[j]);
      const c = correlation(colI, colJ);
      corr[i][j] = c;
      corr[j][i] = c;
    }
  }

  return { keys, matrix: corr };
}

export function getFeatureImportance(
  data: ClaimRecord[],
  coefficients: number[],
  featureNames: string[]
): FeatureImportanceItem[] {
  if (data.length === 0 || coefficients.length !== featureNames.length) {
    return featureNames.map((f) => ({
      feature: f,
      importance: 0,
      correlationWithTarget: 0,
    }));
  }

  const { matrix, keys } = getNumericMatrix(data);
  const targetIdx = keys.indexOf('claim_cost');
  const targetCol = matrix.map((row) => row[targetIdx]);

  const items: FeatureImportanceItem[] = [];
  const numericAndEncoded = keys.filter((k) => k !== 'claim_cost');
  for (let i = 0; i < numericAndEncoded.length; i++) {
    const col = matrix.map((row) => row[i]);
    const corr = correlation(col, targetCol);
    const importance = Math.abs((coefficients[i] ?? 0) * (std(col) || 1));
    items.push({
      feature: featureNames[i] ?? numericAndEncoded[i],
      importance,
      correlationWithTarget: corr,
    });
  }
  items.sort((a, b) => b.importance - a.importance);
  return items;
}

export function getHighestCostDriver(
  items: FeatureImportanceItem[]
): FeatureImportanceItem | null {
  return items.length > 0 ? items[0] : null;
}

export function getLowestImpactVariable(
  items: FeatureImportanceItem[]
): FeatureImportanceItem | null {
  return items.length > 0 ? items[items.length - 1] : null;
}
