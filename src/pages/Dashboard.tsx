import { Link } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

export function Dashboard() {
  const { state } = useAppState();
  const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
  const hasModel = state.modelResult != null;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
        Dashboard
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
        Health Claim Cost Prediction — generate data, clean, train, and evaluate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-surface p-4 opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.08s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Raw records</p>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {state.rawData.length}
          </p>
        </div>
        <div className="card-surface p-4 opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cleaned records</p>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {state.cleanedData.length || state.rawData.length}
          </p>
        </div>
        <div className="card-surface p-4 opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.16s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Model trained</p>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {hasModel ? 'Yes' : 'No'}
          </p>
        </div>
        <div className="card-surface p-4 opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-slate-500 dark:text-slate-400">R² (model)</p>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {hasModel ? state.modelResult!.result.r2.toFixed(4) : '—'}
          </p>
        </div>
      </div>

      <div className="card-surface p-6 opacity-0 animate-slide-up transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.24s', animationFillMode: 'forwards' }}>
        <h2 className="font-display text-xl font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/generate"
            className="btn-primary inline-block transition-transform duration-200 hover:scale-[1.02]"
          >
            Generate dataset
          </Link>
          <Link
            to="/cleaning"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02]"
          >
            Clean data
          </Link>
          <Link
            to="/training"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02]"
          >
            Train model
          </Link>
          <Link
            to="/features"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02]"
          >
            Feature analysis
          </Link>
          <Link
            to="/evaluation"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02]"
          >
            Evaluation
          </Link>
          <Link
            to="/predict"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02]"
          >
            Predict claim
          </Link>
        </div>
      </div>

      {data.length > 0 && (
        <div className="card-surface p-6 mt-6 opacity-0 animate-slide-up transition-shadow duration-300" style={{ animationDelay: '0.28s', animationFillMode: 'forwards' }}>
          <h2 className="font-display text-xl font-semibold mb-4">Data preview</h2>
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
                {data.slice(0, 5).map((row) => (
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
