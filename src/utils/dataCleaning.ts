import type { ClaimRecord } from '../models/claim';
import { validateClaimRecord, isOutlierClaimCost, LIMITS } from './validation';

export interface CleaningResult {
  cleanedData: ClaimRecord[];
  removedDuplicates: number;
  removedInvalid: number;
  removedOutliers: number;
  filledMissing: number;
  totalRemoved: number;
  report: string[];
}

/**
 * Clean and validate dataset: remove duplicates, invalid rows, optional outlier removal.
 */
export function cleanDataset(
  data: ClaimRecord[],
  options: {
    removeDuplicates?: boolean;
    removeInvalid?: boolean;
    removeOutliers?: boolean;
    normalizeNumericFields?: boolean;
    maxRows?: number;
  } = {}
): CleaningResult {
  const {
    removeDuplicates = true,
    removeInvalid = true,
    removeOutliers = false,
    normalizeNumericFields = false,
    maxRows = 10_000,
  } = options;

  const report: string[] = [];
  let cleaned: ClaimRecord[] = [...data];
  let removedDuplicates = 0;
  let removedInvalid = 0;
  let removedOutliers = 0;
  let filledMissing = 0;

  if (cleaned.length > maxRows) {
    cleaned = cleaned.slice(0, maxRows);
    report.push(`Dataset capped at ${maxRows} rows.`);
  }

  if (removeDuplicates) {
    const seen = new Set<string>();
    const before = cleaned.length;
    cleaned = cleaned.filter((row) => {
      const key = JSON.stringify({
        age: row.age,
        gender: row.gender,
        bmi: row.bmi,
        smoker: row.smoker,
        region: row.region,
        children: row.children,
        pre_existing_disease: row.pre_existing_disease,
        hospitalization_days: row.hospitalization_days,
        annual_income: row.annual_income,
        policy_type: row.policy_type,
      });
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    removedDuplicates = before - cleaned.length;
    if (removedDuplicates > 0)
      report.push(`Removed ${removedDuplicates} duplicate rows.`);
  }

  if (removeInvalid) {
    const before = cleaned.length;
    cleaned = cleaned.filter((row) => {
      const result = validateClaimRecord(row);
      return result.valid;
    });
    removedInvalid = before - cleaned.length;
    if (removedInvalid > 0)
      report.push(`Removed ${removedInvalid} invalid rows.`);
  }

  if (removeOutliers) {
    const before = cleaned.length;
    cleaned = cleaned.filter((row) => !isOutlierClaimCost(row.claim_cost));
    removedOutliers = before - cleaned.length;
    if (removedOutliers > 0)
      report.push(`Removed ${removedOutliers} outlier rows (claim_cost > 5 crore).`);
  }

  if (normalizeNumericFields && cleaned.length > 0) {
    const keys: (keyof ClaimRecord)[] = [
      'age',
      'bmi',
      'children',
      'hospitalization_days',
      'annual_income',
      'claim_cost',
    ];
    for (const key of keys) {
      const values = cleaned.map((r) => r[key] as number);
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (max > min) {
        cleaned = cleaned.map((r) => ({
          ...r,
          [key]: (r[key] as number - min) / (max - min),
        }));
      }
    }
    report.push('Numeric fields normalized to [0,1].');
  }

  if (report.length === 0) report.push('No cleaning actions applied.');

  return {
    cleanedData: cleaned,
    removedDuplicates,
    removedInvalid,
    removedOutliers,
    filledMissing,
    totalRemoved: data.length - cleaned.length,
    report,
  };
}

export { LIMITS };
