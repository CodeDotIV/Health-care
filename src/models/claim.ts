export type Gender = 'Male' | 'Female' | 'Other';
export type Region = 'North' | 'South' | 'East' | 'West';
export type PolicyType = 'Basic' | 'Premium' | 'Gold';

export interface ClaimRecord {
  id: string;
  age: number;
  gender: Gender;
  bmi: number;
  smoker: 'Yes' | 'No';
  region: Region;
  children: number;
  pre_existing_disease: 'Yes' | 'No';
  hospitalization_days: number;
  annual_income: number;
  policy_type: PolicyType;
  claim_cost: number;
}

export interface ClaimRecordRaw {
  id?: string;
  age?: number;
  gender?: Gender | '';
  bmi?: number;
  smoker?: 'Yes' | 'No' | '';
  region?: Region | '';
  children?: number;
  pre_existing_disease?: 'Yes' | 'No' | '';
  hospitalization_days?: number;
  annual_income?: number;
  policy_type?: PolicyType | '';
  claim_cost?: number;
}

export type RiskCategory = 'Low Risk' | 'Medium Risk' | 'High Risk';

export const RISK_THRESHOLDS = {
  LOW: 50_000,
  MEDIUM: 200_000,
} as const;

export function getRiskCategory(cost: number): RiskCategory {
  if (cost < RISK_THRESHOLDS.LOW) return 'Low Risk';
  if (cost <= RISK_THRESHOLDS.MEDIUM) return 'Medium Risk';
  return 'High Risk';
}
