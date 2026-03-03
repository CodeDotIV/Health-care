import { describe, it, expect } from 'vitest';
import { cleanDataset } from './dataCleaning';
import type { ClaimRecord } from '../models/claim';

function makeRecord(overrides: Partial<ClaimRecord> = {}): ClaimRecord {
  return {
    id: '1',
    age: 30,
    gender: 'Male',
    bmi: 22,
    smoker: 'No',
    region: 'North',
    children: 1,
    pre_existing_disease: 'No',
    hospitalization_days: 2,
    annual_income: 5_00_000,
    policy_type: 'Basic',
    claim_cost: 50000,
    ...overrides,
  };
}

describe('dataCleaning', () => {
  it('removes duplicates', () => {
    const r1 = makeRecord({ id: '1' });
    const r2 = makeRecord({ id: '2', age: 40 });
    const data = [r1, r2, { ...r1, id: '3' }];
    const result = cleanDataset(data, { removeDuplicates: true, removeInvalid: false });
    expect(result.cleanedData.length).toBe(2);
    expect(result.removedDuplicates).toBe(1);
  });

  it('removes invalid rows', () => {
    const valid = makeRecord();
    const invalidAge = makeRecord({ id: '2', age: 10 });
    const result = cleanDataset([valid, invalidAge], {
      removeDuplicates: false,
      removeInvalid: true,
    });
    expect(result.cleanedData.length).toBe(1);
    expect(result.cleanedData[0].age).toBe(30);
  });

  it('returns empty cleanedData when all rows invalid', () => {
    const invalid1 = makeRecord({ age: 0 });
    const invalid2 = makeRecord({ id: '2', bmi: 100 });
    const result = cleanDataset([invalid1, invalid2], {
      removeDuplicates: false,
      removeInvalid: true,
    });
    expect(result.cleanedData.length).toBe(0);
  });

  it('caps at maxRows', () => {
    const data = Array.from({ length: 100 }, (_, i) =>
      makeRecord({ id: String(i) })
    );
    const result = cleanDataset(data, {
      removeDuplicates: false,
      removeInvalid: false,
      maxRows: 50,
    });
    expect(result.cleanedData.length).toBe(50);
  });
});
