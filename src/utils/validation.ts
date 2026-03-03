import type { ClaimRecordRaw, Gender, PolicyType, Region } from '../models/claim';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const VALID_GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const VALID_REGIONS: Region[] = ['North', 'South', 'East', 'West'];
const VALID_POLICY_TYPES: PolicyType[] = ['Basic', 'Premium', 'Gold'];

const AGE_MIN = 18;
const AGE_MAX = 85;
const BMI_MIN = 10;
const BMI_MAX = 60;
const CHILDREN_MIN = 0;
const CHILDREN_MAX = 5;
const HOSPITAL_DAYS_MIN = 0;
const HOSPITAL_DAYS_MAX = 60;
const INCOME_MIN = 1_00_000; // 1L
const INCOME_MAX = 50_00_000; // 50L
const OUTLIER_CLAIM_COST = 5_00_00_000; // 5 crore

export function validateClaimRecord(record: ClaimRecordRaw): ValidationResult {
  const errors: ValidationError[] = [];

  if (record.age == null || record.age === undefined) {
    errors.push({ field: 'age', message: 'Age is required' });
  } else {
    if (record.age < AGE_MIN)
      errors.push({ field: 'age', message: `Age must be at least ${AGE_MIN}` });
    if (record.age > AGE_MAX)
      errors.push({ field: 'age', message: `Age must be at most ${AGE_MAX}` });
  }

  if (record.gender == null || record.gender === '') {
    errors.push({ field: 'gender', message: 'Gender is required' });
  } else if (!VALID_GENDERS.includes(record.gender as Gender)) {
    errors.push({ field: 'gender', message: 'Invalid gender' });
  }

  if (record.bmi == null || record.bmi === undefined) {
    errors.push({ field: 'bmi', message: 'BMI is required' });
  } else {
    if (record.bmi < BMI_MIN)
      errors.push({ field: 'bmi', message: `BMI must be at least ${BMI_MIN}` });
    if (record.bmi > BMI_MAX)
      errors.push({ field: 'bmi', message: `BMI must be at most ${BMI_MAX}` });
  }

  if (record.smoker == null || record.smoker === '') {
    errors.push({ field: 'smoker', message: 'Smoker is required' });
  } else if (record.smoker !== 'Yes' && record.smoker !== 'No') {
    errors.push({ field: 'smoker', message: 'Smoker must be Yes or No' });
  }

  if (record.region == null || record.region === '') {
    errors.push({ field: 'region', message: 'Region is required' });
  } else if (!VALID_REGIONS.includes(record.region as Region)) {
    errors.push({ field: 'region', message: 'Invalid region' });
  }

  if (record.children == null || record.children === undefined) {
    errors.push({ field: 'children', message: 'Children is required' });
  } else if (record.children < CHILDREN_MIN) {
    errors.push({
      field: 'children',
      message: `Children must be at least ${CHILDREN_MIN}`,
    });
  } else if (record.children > CHILDREN_MAX) {
    errors.push({
      field: 'children',
      message: `Children must be at most ${CHILDREN_MAX}`,
    });
  }

  if (record.pre_existing_disease == null || record.pre_existing_disease === '') {
    errors.push({ field: 'pre_existing_disease', message: 'Pre-existing disease is required' });
  } else if (
    record.pre_existing_disease !== 'Yes' &&
    record.pre_existing_disease !== 'No'
  ) {
    errors.push({
      field: 'pre_existing_disease',
      message: 'Pre-existing disease must be Yes or No',
    });
  }

  if (
    record.hospitalization_days == null ||
    record.hospitalization_days === undefined
  ) {
    errors.push({
      field: 'hospitalization_days',
      message: 'Hospitalization days is required',
    });
  } else if (record.hospitalization_days < HOSPITAL_DAYS_MIN) {
    errors.push({
      field: 'hospitalization_days',
      message: `Hospitalization days must be at least ${HOSPITAL_DAYS_MIN}`,
    });
  }

  if (record.annual_income == null || record.annual_income === undefined) {
    errors.push({ field: 'annual_income', message: 'Annual income is required' });
  } else if (record.annual_income <= 0) {
    errors.push({
      field: 'annual_income',
      message: 'Annual income must be greater than 0',
    });
  }

  if (record.policy_type == null || record.policy_type === '') {
    errors.push({ field: 'policy_type', message: 'Policy type is required' });
  } else if (!VALID_POLICY_TYPES.includes(record.policy_type as PolicyType)) {
    errors.push({ field: 'policy_type', message: 'Invalid policy type' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isOutlierClaimCost(cost: number): boolean {
  return cost > OUTLIER_CLAIM_COST;
}

export const LIMITS = {
  AGE_MIN,
  AGE_MAX,
  BMI_MIN,
  BMI_MAX,
  CHILDREN_MIN,
  CHILDREN_MAX,
  HOSPITAL_DAYS_MIN,
  HOSPITAL_DAYS_MAX,
  INCOME_MIN,
  INCOME_MAX,
  OUTLIER_CLAIM_COST,
};
