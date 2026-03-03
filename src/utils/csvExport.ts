import type { ClaimRecord } from '../models/claim';

const HEADERS = [
  'id',
  'age',
  'gender',
  'bmi',
  'smoker',
  'region',
  'children',
  'pre_existing_disease',
  'hospitalization_days',
  'annual_income',
  'policy_type',
  'claim_cost',
] as const;

export function exportToCSV(data: ClaimRecord[], filename = 'health_claims.csv'): void {
  const rows = [HEADERS.join(',')];
  for (const row of data) {
    const values = HEADERS.map((h) => {
      const v = (row as unknown as Record<string, unknown>)[h];
      if (typeof v === 'string' && (v.includes(',') || v.includes('"'))) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return String(v ?? '');
    });
    rows.push(values.join(','));
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
