import { describe, it, expect } from 'vitest';
import { generateSyntheticDataset, validateSingleRecord } from './datasetGenerator';

describe('datasetGenerator', () => {
  it('generates correct count', () => {
    const data = generateSyntheticDataset({ count: 100, strictRanges: true });
    expect(data).toHaveLength(100);
  });

  it('each record has required fields and claim_cost', () => {
    const data = generateSyntheticDataset({ count: 5, strictRanges: true });
    for (const row of data) {
      expect(row).toHaveProperty('age');
      expect(row).toHaveProperty('gender');
      expect(row).toHaveProperty('bmi');
      expect(row).toHaveProperty('smoker');
      expect(row).toHaveProperty('region');
      expect(row).toHaveProperty('children');
      expect(row).toHaveProperty('pre_existing_disease');
      expect(row).toHaveProperty('hospitalization_days');
      expect(row).toHaveProperty('annual_income');
      expect(row).toHaveProperty('policy_type');
      expect(row).toHaveProperty('claim_cost');
      expect(typeof row.claim_cost).toBe('number');
      expect(row.claim_cost).toBeGreaterThanOrEqual(0);
    }
  });

  it('strictRanges keeps age in 18-85, bmi in 15-45', () => {
    const data = generateSyntheticDataset({ count: 200, strictRanges: true });
    for (const row of data) {
      expect(row.age).toBeGreaterThanOrEqual(18);
      expect(row.age).toBeLessThanOrEqual(85);
      expect(row.bmi).toBeGreaterThanOrEqual(15);
      expect(row.bmi).toBeLessThanOrEqual(45);
    }
  });

  it('validateSingleRecord rejects invalid record', () => {
    const result = validateSingleRecord({
      age: 10,
      gender: 'Male',
      bmi: 22,
      smoker: 'No',
      region: 'North',
      children: 1,
      pre_existing_disease: 'No',
      hospitalization_days: 2,
      annual_income: 5_00_000,
      policy_type: 'Basic',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('validateSingleRecord accepts valid record', () => {
    const result = validateSingleRecord({
      age: 35,
      gender: 'Male',
      bmi: 22,
      smoker: 'No',
      region: 'North',
      children: 1,
      pre_existing_disease: 'No',
      hospitalization_days: 2,
      annual_income: 8_00_000,
      policy_type: 'Premium',
    });
    expect(result.valid).toBe(true);
  });
});
