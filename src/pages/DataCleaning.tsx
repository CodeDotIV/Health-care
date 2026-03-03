import { useCallback } from 'react';
import { useAppState } from '../hooks/useAppState';
import { exportToCSV } from '../utils/csvExport';
import { EmptyState } from '../components/EmptyState';
import { LineBreakLabel } from '../components/LineBreakLabel';

export function DataCleaning() {
  const { state, setRawData, runCleaning } = useAppState();
  const data = state.rawData;
  const cleaned = state.cleanedData;
  const report = state.cleaningReport;

  const handleClean = useCallback(() => {
    runCleaning({
      removeDuplicates: true,
      removeInvalid: true,
      removeOutliers: true,
      normalizeNumericFields: false,
      maxRows: 10_000,
    });
  }, [runCleaning]);

  const handleUseCleaned = useCallback(() => {
    if (state.cleaningReport) {
      setRawData(state.cleaningReport.cleanedData);
    }
  }, [state.cleaningReport, setRawData]);

  if (data.length === 0) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          <LineBreakLabel text="Data Cleaning" />
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Validation (age 18–85, BMI 10–60, no nulls), remove duplicates and outliers.
        </p>
        <EmptyState
          title="No data to clean"
          description="Generate a dataset first from the Dataset Generator page."
        />
      </div>
    );
  }

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        <LineBreakLabel text="Data Cleaning" />
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Remove duplicates, invalid rows, and outliers (claim_cost &gt; 5 crore). Max 10,000 rows.
      </p>

      <div className="card-surface p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <p className="text-slate-600 dark:text-slate-400">
            Raw: <strong>{data.length}</strong> rows
          </p>
          <button type="button" onClick={handleClean} className="btn-primary">
            Run cleaning
          </button>
          {report && (
            <button
              type="button"
              onClick={handleUseCleaned}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Use cleaned as main data
            </button>
          )}
          {cleaned.length > 0 && (
            <button
              type="button"
              onClick={() => exportToCSV(cleaned, 'cleaned_claims.csv')}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Export cleaned CSV
            </button>
          )}
        </div>
      </div>

      {report && (
        <div className="card-surface p-6 mb-6">
          <h2 className="font-display text-xl font-semibold mb-4">Cleaning report</h2>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
            {report.report.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            Cleaned: <strong>{report.cleanedData.length}</strong> rows (removed {report.totalRemoved})
          </p>
        </div>
      )}

      {cleaned.length > 0 && (
        <div className="card-surface p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Cleaned preview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-2">Age</th>
                  <th className="text-left py-2">BMI</th>
                  <th className="text-left py-2">Smoker</th>
                  <th className="text-left py-2">Claim cost</th>
                </tr>
              </thead>
              <tbody>
                {cleaned.slice(0, 10).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2">{row.age}</td>
                    <td className="py-2">{row.bmi}</td>
                    <td className="py-2">{row.smoker}</td>
                    <td className="py-2">₹{row.claim_cost.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
