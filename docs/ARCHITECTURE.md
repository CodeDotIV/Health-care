# Architectural Design — Health Claim Cost Prediction

This document describes the high-level architecture, data flow, and main design decisions for the Health Claim Cost Prediction frontend application.

---

## 1. High-Level Architecture

The application is **frontend-only**: all logic runs in the browser. There is no backend server; persistence uses `localStorage` (users, preferences, “remember me”) and `sessionStorage` (auth token, login lockout).

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Single-page app)                  │
├─────────────────────────────────────────────────────────────────┤
│  React 19 + TypeScript + Vite                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │ AuthContext │  │ AppState     │  │ React Router v7          │  │
│  │ (user/token)│  │ (data/model)│  │ (public + protected)     │  │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Pages: Landing, Auth, Dashboard, Generate, Clean, Train,      │ │
│  │       Features, Evaluation, Individual Claim                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Services    │  │ Utils       │  │ Models       │              │
│  │ (auth, data,│  │ (validation,│  │ (claim types,│              │
│  │  model)     │  │  regression,│  │  risk)       │              │
│  │             │  │  export)    │  │              │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  Storage: localStorage (users, darkMode, remember)               │
│           sessionStorage (token, lockout)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Routing

### 2.1 Auth Model

- **Signup / Login** use a mock auth service (`authService.ts`): users stored in `localStorage`, password “hash” is demo-only, JWT-like token is base64 payload in `sessionStorage` (or `localStorage` if “Remember me”).
- **Protected routes** require a valid token; otherwise the user is redirected to `/login`. After login/signup, redirect goes to the intended path or `/dashboard`.
- **Logout** clears token and user, then redirects to landing (`/`).
- **Inactivity** (configurable timeout in `AuthContext`) can trigger logout.

### 2.2 Route Layout

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login`, `/signup`, `/forgot-password` | Public | Auth pages |
| `/dashboard` … `/predict` | Protected | App pages (require login) |

Protected routes are wrapped in a single layout that renders `<Layout><Outlet /></Layout>`, so nav and shell are shared. Pages are lazy-loaded (`React.lazy`) with a common `<Suspense>` fallback.

---

## 3. State Management

### 3.1 Auth State (`AuthContext`)

- **State:** `user`, `token`, `isLoading`.
- **Actions:** `loginSuccess`, `logout`, `setUser`.
- **Initialization:** On mount, reads token and user from storage and sets `isLoading: false`.
- **Consumers:** `ProtectedRoute`, `Layout`, Login/Signup pages.

### 3.2 Application State (`useAppState`)

- **State:** `rawData`, `cleanedData`, `cleaningReport`, `modelResult`, `featureImportance`, `darkMode`, `loading`, `error`.
- **Actions:** `setRawData`, `runCleaning`, `runTraining`, `setFeatureImportance`, `toggleDarkMode`, etc.
- **Persistence:** `darkMode` synced to `localStorage` and applied to `document.documentElement` for Tailwind dark mode.
- **Consumers:** Dashboard, Dataset Generator, Data Cleaning, Model Training, Feature Analysis, Evaluation, Individual Claim.

Data and model state are in memory only; they are lost on refresh unless the user re-generates/re-trains.

---

## 4. Data & Model Pipeline

End-to-end flow:

```
Generate (synthetic) → Raw data
       ↓
Clean (dedupe, invalid, outliers) → Cleaned data (+ report)
       ↓
Train (linear regression) → Model result (intercept, coefficients, metrics)
       ↓
Feature importance + Evaluation + Individual prediction
```

### 4.1 Dataset Generator (`services/datasetGenerator.ts`)

- Produces synthetic `ClaimRecord[]` with configurable count and strict/ranged fields.
- Claim cost comes from a deterministic formula (`utils/claimCostFormula.ts`) plus optional noise.
- Output is set into app state as `rawData`.

### 4.2 Data Cleaning (`utils/dataCleaning.ts`)

- **Input:** `rawData` (and options: max rows, flags for dedupe, invalid, outliers, normalize).
- **Steps:** Deduplicate by key fields, drop rows failing validation (age/BMI/income/claim_cost rules), remove outliers (e.g. claim_cost > 5 crore), optionally normalize numerics.
- **Output:** Cleaned array and a report; app state can replace `rawData` with cleaned data or keep both for comparison.

### 4.3 Model Training (`services/modelService.ts`, `utils/linearRegression.ts`)

- **Input:** Cleaned (or raw) data.
- **Steps:** Encode categoricals, 80/20 train–test split, fit linear regression via normal equation (`utils/linearRegression.ts`), compute MSE, RMSE, R².
- **Output:** `modelResult` (intercept, coefficients, metrics) stored in app state.

### 4.4 Feature Importance (`utils/featureImportance.ts`)

- Correlation matrix and derived feature importance from the trained model.
- Stored in app state and used by Feature Analysis and Individual Claim (e.g. PDF report).

### 4.5 Evaluation & Individual Claim

- **Evaluation:** Uses `modelResult` and test data to show actual vs predicted, residuals, and metrics; can export a PDF report.
- **Individual Claim:** User fills a single claim form; cost is computed by the deterministic formula and optionally by the trained model; risk category (low/medium/high) is derived from thresholds; PDF report available.

---

## 5. Key Modules & Responsibilities

| Layer | Path | Responsibility |
|-------|------|-----------------|
| Entry | `main.tsx`, `App.tsx` | Bootstrap React, providers, router, lazy routes, Suspense |
| Pages | `src/pages/*` | Route-level UI; read from context/hooks, call services/actions |
| Components | `src/components/*` | Layout, Navbar, ProtectedRoute, EmptyState, ErrorBoundary, LoadingSpinner |
| Context | `src/context/AuthContext.tsx` | Auth state and actions |
| Hooks | `src/hooks/useAppState.tsx` | App data and model state, reducer, provider |
| Services | `src/services/*` | datasetGenerator, modelService, authService (orchestration, side effects) |
| Utils | `src/utils/*` | validation, dataCleaning, linearRegression, featureImportance, claimCostFormula, csvExport, pdfReport, validators (auth) |
| Models | `src/models/claim.ts` | ClaimRecord type, enums, risk categories and thresholds |

---

## 6. Build & Chunking

- **Vite** builds the app; TypeScript is type-checked via `tsc -b` before the build.
- **Code splitting:** Each main page is lazy-loaded; vendors are split via `manualChunks` (react, router, recharts, pdf). This keeps the initial bundle smaller and loads heavy features (e.g. PDF, charts) when needed.

---

## 7. Testing

- **Vitest** for unit tests; **Testing Library** for component tests; **jsdom** for DOM.
- Tests cover: claim cost formula, validation, data cleaning, linear regression, dataset generator, claim model (risk), auth validators, auth service (signup, login, logout, lockout, token).
- Setup: `src/test/setup.ts`; config in `vitest.config.ts`.

---

## 8. Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Frontend-only | Demo/teaching; no backend or API keys; data stays in browser. |
| Context for auth and app state | Simple, built-in state sharing across tree without a global store. |
| Single layout route for protected area | One shell (Layout + nav) and nested routes via `Outlet`. |
| Lazy pages + vendor chunks | Faster initial load; heavy libs (Recharts, PDF) load on demand. |
| Deterministic claim formula | Reproducible synthetic data and a baseline “formula” cost for comparison with model. |
| In-browser linear regression | Demonstrates ML pipeline without a server; normal equation is sufficient for the feature set. |
| localStorage/sessionStorage for auth | Simulates persistence and “remember me”; token in sessionStorage reduces exposure. |

For more detail on a specific flow (e.g. login, cleaning, or training), refer to the corresponding service and utils under `src/`.
