import { jsPDF } from 'jspdf';
import type { ClaimRecord } from '../models/claim';
import { getRiskCategory } from '../models/claim';
import type { LinearRegressionResult } from './linearRegression';
import type { FeatureImportanceItem } from './featureImportance';

export function downloadPredictionReport(options: {
  record: ClaimRecord;
  predictedCost: number;
  modelMetrics?: { mse: number; rmse: number; r2: number };
  featureImportance?: FeatureImportanceItem[];
}): void {
  const doc = new jsPDF();
  const { record, predictedCost, modelMetrics, featureImportance } = options;
  const risk = getRiskCategory(predictedCost);
  let y = 20;

  doc.setFontSize(18);
  doc.text('Health Claim Cost Prediction Report', 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.text(`Claim ID: ${record.id}`, 20, y);
  y += 8;
  doc.text(`Predicted Cost: ₹${predictedCost.toLocaleString('en-IN')}`, 20, y);
  y += 8;
  doc.text(`Risk Category: ${risk}`, 20, y);
  y += 15;

  doc.setFontSize(14);
  doc.text('Input Summary', 20, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Age: ${record.age} | BMI: ${record.bmi} | Children: ${record.children}`, 20, y);
  y += 6;
  doc.text(`Smoker: ${record.smoker} | Pre-existing: ${record.pre_existing_disease}`, 20, y);
  y += 6;
  doc.text(`Hospitalization days: ${record.hospitalization_days}`, 20, y);
  y += 6;
  doc.text(`Annual income: ₹${record.annual_income.toLocaleString('en-IN')}`, 20, y);
  y += 6;
  doc.text(`Policy: ${record.policy_type} | Region: ${record.region}`, 20, y);
  y += 12;

  if (modelMetrics) {
    doc.setFontSize(14);
    doc.text('Model Performance', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`MSE: ${modelMetrics.mse.toFixed(2)} | RMSE: ${modelMetrics.rmse.toFixed(2)} | R²: ${modelMetrics.r2.toFixed(4)}`, 20, y);
    y += 12;
  }

  if (featureImportance && featureImportance.length > 0) {
    doc.setFontSize(14);
    doc.text('Top Cost Drivers', 20, y);
    y += 8;
    doc.setFontSize(10);
    featureImportance.slice(0, 5).forEach((f) => {
      doc.text(`${f.feature}: ${f.importance.toFixed(2)} (corr: ${f.correlationWithTarget.toFixed(3)})`, 20, y);
      y += 6;
    });
  }

  doc.save('claim_prediction_report.pdf');
}

export function downloadEvaluationReport(options: {
  metrics: LinearRegressionResult;
  riskBreakdown: { low: number; medium: number; high: number };
  featureImportance: FeatureImportanceItem[];
}): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('Model Evaluation Report', 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.text(`MSE: ${options.metrics.mse.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`RMSE: ${options.metrics.rmse.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`R²: ${options.metrics.r2.toFixed(4)}`, 20, y);
  y += 12;

  doc.text('Risk distribution:', 20, y);
  y += 7;
  doc.text(`Low: ${options.riskBreakdown.low} | Medium: ${options.riskBreakdown.medium} | High: ${options.riskBreakdown.high}`, 20, y);
  y += 15;

  doc.setFontSize(14);
  doc.text('Feature Importance', 20, y);
  y += 8;
  doc.setFontSize(10);
  options.featureImportance.forEach((f) => {
    doc.text(`${f.feature}: ${f.importance.toFixed(2)}`, 20, y);
    y += 6;
  });

  doc.save('evaluation_report.pdf');
}
