import { describe, it, expect } from 'vitest';
import type { ClaimRecord } from '../models/claim';
import {
  calculateClaimCostDeterministic,
  calculateClaimCost,
  addClaimCostToRecord,
} from './claimCostFormula';

describe('claimCostFormula', () => {
  const baseRecord = {
    age: 30,
    bmi: 22,
    smoker: 'No' as const,
    pre_existing_disease: 'No' as const,
    hospitalization_days: 2,
    annual_income: 5_00_000,
    children: 1,
  };

  it('computes deterministic cost with formula', () => {
    const cost = calculateClaimCostDeterministic(baseRecord);
    // base 5000 + age*200 + bmi*150 + hospital*3000 + income*0.02 + children*2000
    const expected =
      5000 + 30 * 200 + 22 * 150 + 2 * 3000 + 5_00_000 * 0.02 + 1 * 2000;
    expect(cost).toBe(Math.round(expected));
  });

  it('smoker = Yes increases cost by 20000', () => {
    const noSmoker = calculateClaimCostDeterministic({
      ...baseRecord,
      smoker: 'No',
    });
    const smoker = calculateClaimCostDeterministic({
      ...baseRecord,
      smoker: 'Yes',
    });
    expect(smoker - noSmoker).toBe(20000);
  });

  it('age increase increases cost', () => {
    const young = calculateClaimCostDeterministic({ ...baseRecord, age: 18 });
    const old = calculateClaimCostDeterministic({ ...baseRecord, age: 85 });
    expect(old).toBeGreaterThan(young);
  });

  it('hospitalization_days increase increases cost', () => {
    const low = calculateClaimCostDeterministic({
      ...baseRecord,
      hospitalization_days: 0,
    });
    const high = calculateClaimCostDeterministic({
      ...baseRecord,
      hospitalization_days: 10,
    });
    expect(high).toBeGreaterThan(low);
  });

  it('calculateClaimCost returns non-negative with noise', () => {
    for (let i = 0; i < 20; i++) {
      const cost = calculateClaimCost(baseRecord);
      expect(cost).toBeGreaterThanOrEqual(0);
    }
  });

  it('addClaimCostToRecord adds claim_cost to record', () => {
    const record: Partial<ClaimRecord> = {
      ...baseRecord,
      id: 'x',
      gender: 'Male',
      region: 'North',
      policy_type: 'Basic',
    };
    const withCost = addClaimCostToRecord(record);
    expect(withCost).toHaveProperty('claim_cost');
    expect(typeof withCost.claim_cost).toBe('number');
    expect(withCost.claim_cost).toBeGreaterThanOrEqual(0);
  });
});
