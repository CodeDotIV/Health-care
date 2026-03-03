import { useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAppState } from '../hooks/useAppState';
import {
  getHighestCostDriver,
  getLowestImpactVariable,
} from '../utils/featureImportance';
import { EmptyState } from '../components/EmptyState';
import { LineBreakLabel } from '../components/LineBreakLabel';

export function FeatureAnalysis() {
  const { state, runFeatureAnalysis } = useAppState();
  const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
  const importance = state.featureImportance;
  const correlation = state.correlationMatrix;

  const handleAnalyze = useCallback(() => {
    runFeatureAnalysis();
  }, [runFeatureAnalysis]);

  if (data.length === 0) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          <LineBreakLabel text="Feature Analysis" />
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Correlation matrix and feature importance (cost drivers).
        </p>
        <EmptyState
          title="No data"
          description="Generate data and train a model first for feature importance."
        />
      </div>
    );
  }

  const highest = importance.length > 0 ? getHighestCostDriver(importance) : null;
  const lowest = importance.length > 0 ? getLowestImpactVariable(importance) : null;

  const barData = importance.map((f) => ({
    name: f.feature,
    importance: Math.round(f.importance * 100) / 100,
    corr: Math.round(f.correlationWithTarget * 1000) / 1000,
  }));

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        <LineBreakLabel text="Feature Analysis" />
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Correlation matrix, feature importance bar chart, highest cost driver, lowest impact.
      </p>

      <div className="mb-6">
        <button type="button" onClick={handleAnalyze} className="btn-primary">
          {importance.length > 0 ? 'Refresh analysis' : 'Run feature analysis'}
        </button>
      </div>

      {state.modelResult && importance.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Click &quot;Run feature analysis&quot; after training the model.
        </p>
      )}

      {highest && (
        <div className="card-surface p-4 mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Highest cost driver</p>
          <p className="text-lg font-semibold text-sky-600 dark:text-sky-400">
            {highest.feature} (importance: {highest.importance.toFixed(2)}, corr: {highest.correlationWithTarget.toFixed(3)})
          </p>
        </div>
      )}
      {lowest && lowest.feature !== highest?.feature && (
        <div className="card-surface p-4 mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Lowest impact variable</p>
          <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
            {lowest.feature} (importance: {lowest.importance.toFixed(2)})
          </p>
        </div>
      )}

      {barData.length > 0 && (
        <div className="card-surface p-6 mb-6">
          <h2 className="font-display text-xl font-semibold mb-4">Feature importance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(value, _name, props) =>
                    [`${Number(value)} (corr: ${(props?.payload as { corr?: number })?.corr ?? 0})`, 'Importance']
                  }
                />
                <Bar dataKey="importance" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                  {barData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === 0
                          ? '#0ea5e9'
                          : i === barData.length - 1
                            ? '#94a3b8'
                            : '#38bdf8'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {correlation && correlation.keys.length > 0 && (
        <div className="card-surface p-6 overflow-x-auto">
          <h2 className="font-display text-xl font-semibold mb-4">Correlation matrix (heatmap)</h2>
          <div className="inline-block min-w-full">
            <table className="text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-300 dark:border-slate-600 p-1 bg-slate-100 dark:bg-slate-700 w-24" />
                  {correlation.keys.map((k) => (
                    <th
                      key={k}
                      className="border border-slate-300 dark:border-slate-600 p-1 bg-slate-100 dark:bg-slate-700 truncate max-w-[80px]"
                      title={k}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlation.matrix.map((row, i) => (
                  <tr key={i}>
                    <td
                      className="border border-slate-300 dark:border-slate-600 p-1 bg-slate-100 dark:bg-slate-700 font-medium truncate max-w-[80px]"
                      title={correlation.keys[i]}
                    >
                      {correlation.keys[i]}
                    </td>
                    {row.map((val, j) => {
                      const v = Math.round(val * 100) / 100;
                      const intensity = Math.min(1, Math.abs(v));
                      const r = 255 - Math.round(intensity * 150);
                      const g = 255 - Math.round(intensity * 100);
                      const b = 255;
                      const bg = v >= 0
                        ? `rgb(${r},${g},${b})`
                        : `rgb(255,${255 - Math.round(intensity * 100)},${255 - Math.round(intensity * 50)})`;
                      return (
                        <td
                          key={j}
                          className="border border-slate-300 dark:border-slate-600 p-1 text-center"
                          style={{ backgroundColor: bg }}
                        >
                          {v}
                        </td>
                      );
                    })}
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
