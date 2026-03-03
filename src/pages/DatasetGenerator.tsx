import { useState, useCallback } from 'react';
import { generateSyntheticDataset } from '../services/datasetGenerator';
import { useAppState } from '../hooks/useAppState';
import { exportToCSV } from '../utils/csvExport';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { LineBreakLabel } from '../components/LineBreakLabel';

const MAX_GENERATE = 10_000;

export function DatasetGenerator() {
  const { state, setRawData } = useAppState();
  const [count, setCount] = useState(500);
  const [strictRanges, setStrictRanges] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (count < 1 || count > MAX_GENERATE) {
      setMessage(`Count must be between 1 and ${MAX_GENERATE.toLocaleString()}`);
      return;
    }
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      try {
        const data = generateSyntheticDataset({ count, strictRanges });
        setRawData(data);
        setMessage(`Generated ${data.length} records.`);
      } catch (e) {
        setMessage(e instanceof Error ? e.message : 'Generation failed');
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [count, strictRanges, setRawData]);

  const handleExport = useCallback(() => {
    const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
    if (data.length === 0) {
      setMessage('No data to export.');
      return;
    }
    exportToCSV(data);
    setMessage('CSV downloaded.');
  }, [state.rawData, state.cleanedData]);

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        <LineBreakLabel text="Dataset Generator" />
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Generate synthetic health insurance claim data (age, BMI, smoker, region, etc.) with auto-calculated claim cost.
      </p>

      <div className="card-surface p-6 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Number of records (1 – {MAX_GENERATE.toLocaleString()})
            </label>
            <input
              type="number"
              min={1}
              max={MAX_GENERATE}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={strictRanges}
              onChange={(e) => setStrictRanges(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Strict ranges (age 18–85, BMI 15–45, income 1L–50L)
            </span>
          </label>
          {message && (
            <p className="text-sm text-sky-600 dark:text-sky-400">{message}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              Generate
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={state.rawData.length === 0 && state.cleanedData.length === 0}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {state.rawData.length === 0 && !loading && (
        <div className="mt-6">
          <EmptyState
            title="No dataset yet"
            description="Generate synthetic claims above. Fields: age, gender, BMI, smoker, region, children, pre-existing disease, hospitalization days, annual income, policy type; claim_cost is auto-calculated."
            action={
              <button type="button" onClick={handleGenerate} className="btn-primary">
                Generate dataset
              </button>
            }
          />
        </div>
      )}

      {state.rawData.length > 0 && (
        <div className="card-surface p-6 mt-6">
          <h2 className="font-display text-xl font-semibold mb-4">
            Preview ({state.rawData.length} rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-2">Age</th>
                  <th className="text-left py-2">Gender</th>
                  <th className="text-left py-2">BMI</th>
                  <th className="text-left py-2">Smoker</th>
                  <th className="text-left py-2">Region</th>
                  <th className="text-left py-2">Children</th>
                  <th className="text-left py-2">Pre-existing</th>
                  <th className="text-left py-2">Hosp. days</th>
                  <th className="text-left py-2">Income</th>
                  <th className="text-left py-2">Policy</th>
                  <th className="text-left py-2">Claim cost</th>
                </tr>
              </thead>
              <tbody>
                {state.rawData.slice(0, 10).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2">{row.age}</td>
                    <td className="py-2">{row.gender}</td>
                    <td className="py-2">{row.bmi}</td>
                    <td className="py-2">{row.smoker}</td>
                    <td className="py-2">{row.region}</td>
                    <td className="py-2">{row.children}</td>
                    <td className="py-2">{row.pre_existing_disease}</td>
                    <td className="py-2">{row.hospitalization_days}</td>
                    <td className="py-2">₹{(row.annual_income / 1e5).toFixed(1)}L</td>
                    <td className="py-2">{row.policy_type}</td>
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
