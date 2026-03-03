import type { ClaimRecord, Gender, PolicyType, Region } from '../models/claim';
import { calculateClaimCost } from '../utils/claimCostFormula';
import { validateClaimRecord } from '../utils/validation';

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const REGIONS: Region[] = ['North', 'South', 'East', 'West'];
const POLICY_TYPES: PolicyType[] = ['Basic', 'Premium', 'Gold'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return `claim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface GenerateOptions {
  count: number;
  /** Clamp values to valid ranges; if false, may generate edge-case invalid data */
  strictRanges?: boolean;
}

/**
 * Generate synthetic health insurance claim records.
 * strictRanges: true = all within spec (age 18-85, bmi 15-45, etc.); false = may include edge cases.
 */
export function generateSyntheticDataset(options: GenerateOptions): ClaimRecord[] {
  const { count, strictRanges = true } = options;
  const records: ClaimRecord[] = [];

  const ageMin = strictRanges ? 18 : 0;
  const ageMax = strictRanges ? 85 : 100;
  const bmiMin = strictRanges ? 15 : 5;
  const bmiMax = strictRanges ? 45 : 70;
  const incomeMin = strictRanges ? 1_00_000 : 0;
  const incomeMax = strictRanges ? 50_00_000 : 1_00_00_000;
  const hospitalMax = strictRanges ? 60 : 100;

  for (let i = 0; i < count; i++) {
    const age = randomInt(ageMin, ageMax);
    const bmi = strictRanges
      ? randomInt(bmiMin * 10, bmiMax * 10) / 10
      : Math.round((Math.random() * (bmiMax - bmiMin) + bmiMin) * 10) / 10;
    const children = randomInt(0, 5);
    const hospitalization_days = randomInt(0, hospitalMax);
    const annual_income =
      strictRanges && incomeMin > 0
        ? randomInt(incomeMin / 10000, incomeMax / 10000) * 10000
        : randomInt(incomeMin, Math.min(incomeMax, 100_00_000));

    const record: ClaimRecord = {
      id: generateId(),
      age,
      gender: pick(GENDERS),
      bmi,
      smoker: pick(['Yes', 'No'] as const),
      region: pick(REGIONS),
      children,
      pre_existing_disease: pick(['Yes', 'No'] as const),
      hospitalization_days,
      annual_income: annual_income || 50000,
      policy_type: pick(POLICY_TYPES),
      claim_cost: 0,
    };

    record.claim_cost = calculateClaimCost({
      age: record.age,
      bmi: record.bmi,
      smoker: record.smoker,
      pre_existing_disease: record.pre_existing_disease,
      hospitalization_days: record.hospitalization_days,
      annual_income: record.annual_income,
      children: record.children,
    });

    records.push(record);
  }

  return records;
}

/** Validate a single record (e.g. for manual entry). Returns errors or null if valid. */
export function validateSingleRecord(
  record: Partial<ClaimRecord>
): ReturnType<typeof validateClaimRecord> {
  return validateClaimRecord(record as Parameters<typeof validateClaimRecord>[0]);
}
