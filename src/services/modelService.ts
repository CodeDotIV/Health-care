import type { ClaimRecord } from '../models/claim';
import {
  fitLinearRegression,
  predictLinearRegression,
  type LinearRegressionResult,
} from '../utils/linearRegression';

const NUMERIC_FEATURES = [
  'age',
  'bmi',
  'children',
  'hospitalization_days',
  'annual_income',
] as const;
const CATEGORICAL_FEATURES = [
  'gender',
  'smoker',
  'region',
  'pre_existing_disease',
  'policy_type',
] as const;

export const FEATURE_NAMES = [
  ...NUMERIC_FEATURES,
  ...CATEGORICAL_FEATURES,
] as const;

function encodeRecord(record: ClaimRecord): number[] {
  const numeric = NUMERIC_FEATURES.map(
    (k) => (record as unknown as Record<string, unknown>)[k] as number
  );
  const genderEnc =
    record.gender === 'Female' ? 1 : record.gender === 'Male' ? 0 : 0.5;
  const smokerEnc = record.smoker === 'Yes' ? 1 : 0;
  const regionEnc = ['North', 'South', 'East', 'West'].indexOf(record.region) / 4;
  const diseaseEnc = record.pre_existing_disease === 'Yes' ? 1 : 0;
  const policyEnc =
    ['Basic', 'Premium', 'Gold'].indexOf(record.policy_type) / 3;
  return [
    ...numeric,
    genderEnc,
    smokerEnc,
    regionEnc,
    diseaseEnc,
    policyEnc,
  ];
}

export interface TrainTestSplit {
  trainX: number[][];
  trainY: number[];
  testX: number[][];
  testY: number[];
  trainIndices: number[];
  testIndices: number[];
}

export function trainTestSplit(
  data: ClaimRecord[],
  testRatio = 0.2,
  shuffle = true
): TrainTestSplit {
  const n = data.length;
  let indices = Array.from({ length: n }, (_, i) => i);
  if (shuffle) {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  const testSize = Math.max(0, Math.min(n - 1, Math.floor(n * testRatio)));
  const testIndices = indices.slice(0, testSize);
  const trainIndices = indices.slice(testSize);

  const trainX = trainIndices.map((i) => encodeRecord(data[i]));
  const trainY = trainIndices.map((i) => data[i].claim_cost);
  const testX = testIndices.map((i) => encodeRecord(data[i]));
  const testY = testIndices.map((i) => data[i].claim_cost);

  return {
    trainX,
    trainY,
    testX,
    testY,
    trainIndices,
    testIndices,
  };
}

export interface ModelTrainResult {
  result: LinearRegressionResult;
  testPredictions: number[];
  testY: number[];
  trainSize: number;
  testSize: number;
  featureNames: string[];
}

export function trainModel(data: ClaimRecord[]): ModelTrainResult | null {
  if (data.length < 2) return null;
  const split = trainTestSplit(data, 0.2);
  if (split.trainX.length === 0) return null;

  const result = fitLinearRegression(split.trainX, split.trainY);
  const testPredictions = predictLinearRegression(
    split.testX,
    result.intercept,
    result.coefficients
  );

  return {
    result,
    testPredictions,
    testY: split.testY,
    trainSize: split.trainX.length,
    testSize: split.testX.length,
    featureNames: [...FEATURE_NAMES],
  };
}

export function predictSingle(
  record: ClaimRecord,
  intercept: number,
  coefficients: number[]
): number {
  const x = encodeRecord(record);
  return predictLinearRegression([x], intercept, coefficients)[0];
}
