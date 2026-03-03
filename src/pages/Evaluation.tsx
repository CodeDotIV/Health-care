import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';
import { useAppState } from '../hooks/useAppState';
import { getRiskCategory } from '../models/claim';
import { downloadEvaluationReport } from '../utils/pdfReport';
import { EmptyState } from '../components/EmptyState';

export function Evaluation() {
  const { state } = useAppState();
  const result = state.modelResult;
  const importance = state.featureImportance;

  if (!result) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Model Evaluation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Actual vs predicted, residuals, error distribution, risk buckets.
        </p>
        <EmptyState
          title="No model trained"
          description="Train a model on the Model Training page first."
        />
      </div>
    );
  }

  const { testY, testPredictions, result: metrics } = result;
  const scatterData = testY.map((actual, i) => ({
    actual,
    predicted: Math.max(0, Math.round(testPredictions[i])),
  }));
  const residuals = testY.map((actual, i) => actual - (testPredictions[i] ?? 0));
  const residualData = residuals.map((r, i) => ({ index: i + 1, residual: Math.round(r) }));

  const riskBuckets = { low: 0, medium: 0, high: 0 };
  testPredictions.forEach((p) => {
    const risk = getRiskCategory(Math.max(0, p));
    if (risk === 'Low Risk') riskBuckets.low++;
    else if (risk === 'Medium Risk') riskBuckets.medium++;
    else riskBuckets.high++;
  });
  const riskChartData = [
    { name: 'Low (<50K)', count: riskBuckets.low, fill: '#22c55e' },
    { name: 'Medium (50K–2L)', count: riskBuckets.medium, fill: '#eab308' },
    { name: 'High (>2L)', count: riskBuckets.high, fill: '#ef4444' },
  ];

  const r2Percent = (metrics.r2 * 100).toFixed(2);
  const accuracyBadge =
    metrics.r2 >= 0.9
      ? 'Excellent'
      : metrics.r2 >= 0.7
        ? 'Good'
        : metrics.r2 >= 0.5
          ? 'Moderate'
          : 'Poor';

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Model Evaluation
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Actual vs predicted, residuals, error distribution, risk categorization.
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="card-surface px-4 py-2 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Model accuracy</span>
          <span
            className={`font-semibold ${
              accuracyBadge === 'Excellent'
                ? 'text-green-600'
                : accuracyBadge === 'Good'
                  ? 'text-sky-600'
                  : accuracyBadge === 'Moderate'
                    ? 'text-amber-600'
                    : 'text-red-600'
            }`}
          >
            {accuracyBadge} (R² = {r2Percent}%)
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadEvaluationReport({
              metrics,
              riskBreakdown: riskBuckets,
              featureImportance: importance,
            })
          }
          className="btn-primary"
        >
          Download evaluation report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Actual vs Predicted</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Actual"
                  unit="₹"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted"
                  unit="₹"
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip
                  formatter={(value: number | undefined) => (value != null ? `₹${value.toLocaleString('en-IN')}` : '')}
                  labelFormatter={(_, payload) =>
                    payload?.[0] ? `Actual: ₹${(payload[0].payload?.actual ?? 0).toLocaleString('en-IN')}` : ''
                  }
                />
                <Scatter data={scatterData} fill="#0ea5e9" name="Claims" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Residuals</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={residualData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="index" />
                <YAxis dataKey="residual" />
                <Tooltip />
                <Bar dataKey="residual" fill="#94a3b8" radius={[2, 2, 0, 0]}>
                  {residualData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.residual >= 0 ? '#0ea5e9' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4">Risk categorization</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Low: &lt;₹50K · Medium: ₹50K–2L · High: &gt;₹2L
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskChartData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={90} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                {riskChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Metrics summary</h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li>MSE: {metrics.mse.toFixed(2)}</li>
          <li>RMSE: {metrics.rmse.toFixed(2)}</li>
          <li>R²: {metrics.r2.toFixed(4)}</li>
        </ul>
      </div>
    </div>
  );
}
