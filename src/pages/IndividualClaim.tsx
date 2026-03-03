import { useState, useCallback } from 'react';
import type { ClaimRecord, Gender, PolicyType, Region } from '../models/claim';
import { getRiskCategory } from '../models/claim';
import { useAppState } from '../hooks/useAppState';
import { validateClaimRecord } from '../utils/validation';
import { calculateClaimCost } from '../utils/claimCostFormula';
import { predictSingle } from '../services/modelService';
import { downloadPredictionReport } from '../utils/pdfReport';
import { EmptyState } from '../components/EmptyState';
import { LineBreakLabel } from '../components/LineBreakLabel';

const defaultRecord: Partial<ClaimRecord> = {
  age: 35,
  gender: 'Male',
  bmi: 22,
  smoker: 'No',
  region: 'North',
  children: 1,
  pre_existing_disease: 'No',
  hospitalization_days: 2,
  annual_income: 8_00_000,
  policy_type: 'Premium',
};

export function IndividualClaim() {
  const { state } = useAppState();
  const [form, setForm] = useState<Partial<ClaimRecord>>(defaultRecord);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [predictedCost, setPredictedCost] = useState<number | null>(null);
  const [formulaCost, setFormulaCost] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const update = useCallback((field: keyof ClaimRecord, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setPredictedCost(null);
    setFormulaCost(null);
    setRiskScore(null);
    setValidationErrors([]);
  }, []);

  const handlePredict = useCallback(() => {
    const fullRecord: ClaimRecord = {
      id: 'single',
      age: Number(form.age) ?? 0,
      gender: (form.gender as Gender) ?? 'Male',
      bmi: Number(form.bmi) ?? 0,
      smoker: (form.smoker as 'Yes' | 'No') ?? 'No',
      region: (form.region as Region) ?? 'North',
      children: Number(form.children) ?? 0,
      pre_existing_disease: (form.pre_existing_disease as 'Yes' | 'No') ?? 'No',
      hospitalization_days: Number(form.hospitalization_days) ?? 0,
      annual_income: Number(form.annual_income) ?? 0,
      policy_type: (form.policy_type as PolicyType) ?? 'Basic',
      claim_cost: 0,
    };

    const validation = validateClaimRecord(fullRecord);
    if (!validation.valid) {
      setValidationErrors(validation.errors.map((e) => `${e.field}: ${e.message}`));
      setPredictedCost(null);
      setFormulaCost(null);
      setRiskScore(null);
      return;
    }
    setValidationErrors([]);

    const formula = calculateClaimCost({
      age: fullRecord.age,
      bmi: fullRecord.bmi,
      smoker: fullRecord.smoker,
      pre_existing_disease: fullRecord.pre_existing_disease,
      hospitalization_days: fullRecord.hospitalization_days,
      annual_income: fullRecord.annual_income,
      children: fullRecord.children,
    });
    setFormulaCost(formula);

    if (state.modelResult) {
      const pred = predictSingle(
        { ...fullRecord, claim_cost: formula },
        state.modelResult.result.intercept,
        state.modelResult.result.coefficients
      );
      setPredictedCost(Math.max(0, Math.round(pred)));
      const score = Math.min(100, Math.max(0, (pred / 500_000) * 100));
      setRiskScore(Math.round(score));
    } else {
      setPredictedCost(formula);
      const score = Math.min(100, Math.max(0, (formula / 500_000) * 100));
      setRiskScore(Math.round(score));
    }
  }, [form, state.modelResult]);

  const handleDownloadReport = useCallback(() => {
    if (predictedCost == null) return;
    const fullRecord: ClaimRecord = {
      id: 'single',
      age: Number(form.age) ?? 0,
      gender: (form.gender as Gender) ?? 'Male',
      bmi: Number(form.bmi) ?? 0,
      smoker: (form.smoker as 'Yes' | 'No') ?? 'No',
      region: (form.region as Region) ?? 'North',
      children: Number(form.children) ?? 0,
      pre_existing_disease: (form.pre_existing_disease as 'Yes' | 'No') ?? 'No',
      hospitalization_days: Number(form.hospitalization_days) ?? 0,
      annual_income: Number(form.annual_income) ?? 0,
      policy_type: (form.policy_type as PolicyType) ?? 'Basic',
      claim_cost: formulaCost ?? predictedCost,
    };
    downloadPredictionReport({
      record: fullRecord,
      predictedCost,
      modelMetrics: state.modelResult
        ? {
            mse: state.modelResult.result.mse,
            rmse: state.modelResult.result.rmse,
            r2: state.modelResult.result.r2,
          }
        : undefined,
      featureImportance: state.featureImportance.length > 0 ? state.featureImportance : undefined,
    });
  }, [form, predictedCost, formulaCost, state.modelResult, state.featureImportance]);

  const riskCategory = predictedCost != null ? getRiskCategory(predictedCost) : null;

  return (
    <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        <LineBreakLabel text="Individual Claim Prediction" />
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Enter claim details to get predicted cost and risk category. Optional: train a model for ML-based prediction.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Claim details</h2>
          {[
            { key: 'age', label: 'Age (18–85)', type: 'number', min: 18, max: 85 },
            { key: 'bmi', label: 'BMI (10–60)', type: 'number', min: 10, max: 60 },
            { key: 'children', label: 'Children (0–5)', type: 'number', min: 0, max: 5 },
            { key: 'hospitalization_days', label: 'Hospitalization days', type: 'number', min: 0, max: 60 },
            { key: 'annual_income', label: 'Annual income (₹)', type: 'number', min: 1 },
          ].map(({ key, label, type, min, max }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label}
              </label>
              <input
                type={type}
                min={min}
                max={max}
                value={String((form as Record<string, unknown>)[key] ?? '')}
                onChange={(e) =>
                  update(key as keyof ClaimRecord, type === 'number' ? Number(e.target.value) : e.target.value)
                }
                className="input-field"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              value={form.gender ?? ''}
              onChange={(e) => update('gender', e.target.value as Gender)}
              className="input-field"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Smoker
            </label>
            <select
              value={form.smoker ?? ''}
              onChange={(e) => update('smoker', e.target.value as 'Yes' | 'No')}
              className="input-field"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Region
            </label>
            <select
              value={form.region ?? ''}
              onChange={(e) => update('region', e.target.value as Region)}
              className="input-field"
            >
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pre-existing disease
            </label>
            <select
              value={form.pre_existing_disease ?? ''}
              onChange={(e) => update('pre_existing_disease', e.target.value as 'Yes' | 'No')}
              className="input-field"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Policy type
            </label>
            <select
              value={form.policy_type ?? ''}
              onChange={(e) => update('policy_type', e.target.value as PolicyType)}
              className="input-field"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Gold">Gold</option>
            </select>
          </div>
          {validationErrors.length > 0 && (
            <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside">
              {validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          <button type="button" onClick={handlePredict} className="btn-primary w-full">
            Predict claim cost
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Prediction result</h2>
          {predictedCost == null ? (
            <EmptyState
              title="No prediction yet"
              description="Fill the form and click Predict claim cost."
            />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Predicted cost</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  ₹{predictedCost.toLocaleString('en-IN')}
                </p>
              </div>
              {formulaCost != null && state.modelResult && formulaCost !== predictedCost && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Formula estimate: ₹{formulaCost.toLocaleString('en-IN')} (model adjusted)
                </p>
              )}
              {riskCategory && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Risk category</p>
                  <p
                    className={`text-lg font-semibold ${
                      riskCategory === 'Low Risk'
                        ? 'text-green-600'
                        : riskCategory === 'Medium Risk'
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}
                  >
                    {riskCategory}
                  </p>
                </div>
              )}
              {riskScore != null && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Risk score (0–100)</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${riskScore}%` }}
                      />
                    </div>
                    <span className="font-medium">{riskScore}</span>
                  </div>
                </div>
              )}
              {riskCategory && (
                <div className="rounded-lg bg-slate-100 dark:bg-slate-700 p-3 text-sm">
                  <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Policy recommendation</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {riskCategory === 'High Risk'
                      ? 'Consider Gold policy for maximum coverage and lower out-of-pocket costs.'
                      : riskCategory === 'Medium Risk'
                        ? 'Premium policy is a good balance of coverage and cost.'
                        : 'Basic or Premium policy may suit your risk profile.'}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={handleDownloadReport}
                className="btn-primary w-full"
              >
                Download prediction report (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
