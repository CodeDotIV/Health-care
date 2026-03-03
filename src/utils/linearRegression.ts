/**
 * Simple linear regression: y = b0 + b1*x1 + b2*x2 + ...
 * Uses normal equation (closed-form) for stability.
 */

export interface LinearRegressionResult {
  coefficients: number[];
  intercept: number;
  mse: number;
  rmse: number;
  r2: number;
  predictions: number[];
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Add intercept column (1s) to X
 */
function addIntercept(X: number[][]): number[][] {
  return X.map((row) => [1, ...row]);
}

/**
 * Matrix transpose
 */
function transpose(M: number[][]): number[][] {
  if (M.length === 0) return [];
  const cols = M[0].length;
  const result: number[][] = [];
  for (let j = 0; j < cols; j++) {
    result[j] = M.map((row) => row[j]);
  }
  return result;
}

/**
 * Matrix multiplication A * B
 */
function matMul(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const result: number[][] = Array(rowsA)
    .fill(0)
    .map(() => Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) sum += A[i][k] * B[k][j];
      result[i][j] = sum;
    }
  }
  return result;
}

/**
 * Invert 2x2 or small matrix via adjugate (for demo; for larger use LU or SVD).
 * For (X'X)^-1 we need a proper inverse. Using a simple approach.
 */
function invertMatrix(M: number[][]): number[][] {
  const n = M.length;
  if (n === 0) return [];
  if (n === 1) return [[1 / (M[0][0] || 1e-10)]];
  // Use identity + iterative refinement or simple Gaussian elimination for n<=10
  const augmented = M.map((row, i) => [
    ...row,
    ...Array(n)
      .fill(0)
      .map((_, j) => (i === j ? 1 : 0)),
  ]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(augmented[r][col]) > Math.abs(augmented[pivot][col]))
        pivot = r;
    }
    [augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];
    const div = augmented[col][col];
    if (Math.abs(div) < 1e-12) continue;
    for (let j = 0; j < 2 * n; j++) augmented[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = augmented[r][col];
      for (let j = 0; j < 2 * n; j++)
        augmented[r][j] -= factor * augmented[col][j];
    }
  }
  return augmented.map((row) => row.slice(n));
}

/**
 * Fit linear regression: X is n x p (no intercept), y is n x 1.
 * Returns coefficients [intercept, coef1, coef2, ...] and metrics.
 */
export function fitLinearRegression(
  X: number[][],
  y: number[]
): LinearRegressionResult {
  const n = X.length;
  if (n === 0) {
    return {
      coefficients: [],
      intercept: 0,
      mse: 0,
      rmse: 0,
      r2: 0,
      predictions: [],
    };
  }

  const X1 = addIntercept(X);
  const Xt = transpose(X1);
  const XtX = matMul(Xt, X1);
  const Xty = matMul(Xt, y.map((v) => [v]));
  let XtXinv: number[][];
  try {
    XtXinv = invertMatrix(XtX);
  } catch {
    XtXinv = XtX.map((_, i) => XtX[i].map((__, j) => (i === j ? 1 : 0)));
  }
  const beta = matMul(XtXinv, Xty).map((row) => row[0]);

  const intercept = beta[0];
  const coefficients = beta.slice(1);
  const predictions = X1.map((row) =>
    row.reduce((s, x, i) => s + x * beta[i], 0)
  );

  const ssRes = y.reduce(
    (s, yi, i) => s + (yi - predictions[i]) ** 2,
    0
  );
  const mse = n > 0 ? ssRes / n : 0;
  const rmse = Math.sqrt(mse);
  const meanY = mean(y);
  const ssTot = y.reduce((s, yi) => s + (yi - meanY) ** 2, 0);
  const r2 = ssTot > 1e-12 ? 1 - ssRes / ssTot : 0;

  return {
    coefficients,
    intercept,
    mse,
    rmse,
    r2,
    predictions,
  };
}

/**
 * Predict for new X using fitted coefficients (intercept, coef1, coef2, ...).
 */
export function predictLinearRegression(
  X: number[][],
  intercept: number,
  coefficients: number[]
): number[] {
  return X.map((row) =>
    intercept + row.reduce((s, x, i) => s + x * (coefficients[i] ?? 0), 0)
  );
}
