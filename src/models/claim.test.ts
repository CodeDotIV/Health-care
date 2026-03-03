import { describe, it, expect } from 'vitest';
import { getRiskCategory, RISK_THRESHOLDS } from './claim';

describe('claim model', () => {
  it('getRiskCategory returns Low Risk for cost < 50K', () => {
    expect(getRiskCategory(0)).toBe('Low Risk');
    expect(getRiskCategory(49_999)).toBe('Low Risk');
  });

  it('getRiskCategory returns Medium Risk for 50K–2L', () => {
    expect(getRiskCategory(50_000)).toBe('Medium Risk');
    expect(getRiskCategory(200_000)).toBe('Medium Risk');
  });

  it('getRiskCategory returns High Risk for > 2L', () => {
    expect(getRiskCategory(200_001)).toBe('High Risk');
    expect(getRiskCategory(1_00_00_000)).toBe('High Risk');
  });

  it('RISK_THRESHOLDS are defined', () => {
    expect(RISK_THRESHOLDS.LOW).toBe(50_000);
    expect(RISK_THRESHOLDS.MEDIUM).toBe(200_000);
  });
});
