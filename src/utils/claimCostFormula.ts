import type { ClaimRecord } from '../models/claim';

const BASE_COST = 5000;
const RANDOM_NOISE_RANGE = 5000;

function randomNoise(): number {
  return (Math.random() - 0.5) * 2 * RANDOM_NOISE_RANGE;
}

/** Deterministic regression-style formula for claim_cost */
export function calculateClaimCost(record: {
  age: number;
  bmi: number;
  smoker: 'Yes' | 'No';
  pre_existing_disease: 'Yes' | 'No';
  hospitalization_days: number;
  annual_income: number;
  children: number;
}): number {
  const age_factor = record.age * 200;
  const bmi_factor = record.bmi * 150;
  const smoker_factor = record.smoker === 'Yes' ? 20000 : 0;
  const disease_factor = record.pre_existing_disease === 'Yes' ? 15000 : 0;
  const hospital_factor = record.hospitalization_days * 3000;
  const income_factor = record.annual_income * 0.02;
  const children_factor = record.children * 2000;

  const sum =
    BASE_COST +
    age_factor +
    bmi_factor +
    smoker_factor +
    disease_factor +
    hospital_factor +
    income_factor +
    children_factor;

  return Math.max(0, Math.round(sum + randomNoise()));
}

export function calculateClaimCostDeterministic(record: {
  age: number;
  bmi: number;
  smoker: 'Yes' | 'No';
  pre_existing_disease: 'Yes' | 'No';
  hospitalization_days: number;
  annual_income: number;
  children: number;
}): number {
  const age_factor = record.age * 200;
  const bmi_factor = record.bmi * 150;
  const smoker_factor = record.smoker === 'Yes' ? 20000 : 0;
  const disease_factor = record.pre_existing_disease === 'Yes' ? 15000 : 0;
  const hospital_factor = record.hospitalization_days * 3000;
  const income_factor = record.annual_income * 0.02;
  const children_factor = record.children * 2000;

  const sum =
    BASE_COST +
    age_factor +
    bmi_factor +
    smoker_factor +
    disease_factor +
    hospital_factor +
    income_factor +
    children_factor;

  return Math.max(0, Math.round(sum));
}

export function addClaimCostToRecord<T extends Partial<ClaimRecord>>(
  record: T
): T & { claim_cost: number } {
  const cost = calculateClaimCost({
    age: record.age ?? 0,
    bmi: record.bmi ?? 0,
    smoker: (record.smoker as 'Yes' | 'No') ?? 'No',
    pre_existing_disease: (record.pre_existing_disease as 'Yes' | 'No') ?? 'No',
    hospitalization_days: record.hospitalization_days ?? 0,
    annual_income: record.annual_income ?? 0,
    children: record.children ?? 0,
  });
  return { ...record, claim_cost: cost } as T & { claim_cost: number };
}
