import { describe, it, expect } from 'vitest';
import { validateClaimRecord, LIMITS } from './validation';

describe('validation', () => {
  const validRecord = {
    age: 35,
    gender: 'Male' as const,
    bmi: 22,
    smoker: 'No' as const,
    region: 'North' as const,
    children: 1,
    pre_existing_disease: 'No' as const,
    hospitalization_days: 2,
    annual_income: 8_00_000,
    policy_type: 'Premium' as const,
  };

  it('accepts valid input', () => {
    const result = validateClaimRecord(validRecord);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects age = -5', () => {
    const result = validateClaimRecord({ ...validRecord, age: -5 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('rejects age = 86', () => {
    const result = validateClaimRecord({ ...validRecord, age: 86 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('accepts age = 18', () => {
    const result = validateClaimRecord({ ...validRecord, age: 18 });
    expect(result.valid).toBe(true);
  });

  it('accepts age = 85', () => {
    const result = validateClaimRecord({ ...validRecord, age: 85 });
    expect(result.valid).toBe(true);
  });

  it('rejects BMI = 200', () => {
    const result = validateClaimRecord({ ...validRecord, bmi: 200 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'bmi')).toBe(true);
  });

  it('accepts BMI = 10 and BMI = 60', () => {
    expect(validateClaimRecord({ ...validRecord, bmi: 10 }).valid).toBe(true);
    expect(validateClaimRecord({ ...validRecord, bmi: 60 }).valid).toBe(true);
  });

  it('rejects income = 0', () => {
    const result = validateClaimRecord({ ...validRecord, annual_income: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'annual_income')).toBe(true);
  });

  it('rejects missing gender', () => {
    const result = validateClaimRecord({ ...validRecord, gender: '' as never });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'gender')).toBe(true);
  });

  it('rejects missing policy_type', () => {
    const result = validateClaimRecord({
      ...validRecord,
      policy_type: '' as never,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'policy_type')).toBe(true);
  });

  it('rejects negative hospitalization_days', () => {
    const result = validateClaimRecord({
      ...validRecord,
      hospitalization_days: -1,
    });
    expect(result.valid).toBe(false);
  });

  it('exports LIMITS', () => {
    expect(LIMITS.AGE_MIN).toBe(18);
    expect(LIMITS.AGE_MAX).toBe(85);
    expect(LIMITS.BMI_MIN).toBe(10);
    expect(LIMITS.BMI_MAX).toBe(60);
  });
});
