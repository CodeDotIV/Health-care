import { useCallback, useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export function ModelTraining() {
  const { state, runTraining } = useAppState();
  const [loading, setLoading] = useState(false);
  const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
  const result = state.modelResult;

  const handleTrain = useCallback(() => {
    if (data.length < 2) return;
    setLoading(true);
    state.error && (state as { error?: string }).error;
    setTimeout(() => {
      runTraining();
      setLoading(false);
    }, 100);
  }, [data.length, runTraining]);

  if (data.length === 0) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Model Training
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Train a linear regression model (80/20 train/test). MSE, RMSE, R².
        </p>
        <EmptyState
          title="No data to train"
          description="Generate and optionally clean your dataset first."
        />
      </div>
    );
  }

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Model Training
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Linear regression on numeric + encoded categorical features. 80% train / 20% test.
      </p>

      <div className="card-surface p-6 mb-6">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Records: <strong>{data.length}</strong> (need at least 2)
        </p>
        {state.error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">{state.error}</p>
        )}
        <button
          type="button"
          onClick={handleTrain}
          disabled={loading || data.length < 2}
          className="btn-primary flex items-center gap-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          Train model
        </button>
      </div>

      {result && (
        <div className="card-surface p-6">
          <h2 className="font-display text-xl font-semibold mb-4">Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">MSE</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {result.result.mse.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">RMSE</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {result.result.rmse.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">R²</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {result.result.r2.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Train / Test</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {result.trainSize} / {result.testSize}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Features: {result.featureNames.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
