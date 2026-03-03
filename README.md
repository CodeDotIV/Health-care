# Health Claim Cost Prediction

A frontend-only web application for predicting health insurance claim costs using synthetic data, in-browser regression modeling, and risk categorization. Built for insurers, analysts, and educators — no backend or API keys required.

## Features

- **Landing & auth** — Public landing page, signup, login, logout, protected routes, mock JWT-style auth (localStorage/sessionStorage)
- **Synthetic dataset generator** — Generate configurable health claim records (age, BMI, smoker, region, income, policy type) with auto-calculated claim cost
- **Data cleaning & validation** — Deduplicate, remove invalid rows, outlier detection (e.g. claim cost > 5 crore), optional normalization
- **Model training** — Linear regression (normal equation) in-browser, 80/20 train–test split, MSE, RMSE, R²
- **Feature analysis** — Correlation matrix and feature importance
- **Evaluation dashboard** — Actual vs predicted charts, residuals, metrics; PDF report export
- **Individual claim prediction** — Enter claim attributes, get predicted cost and risk category (low/medium/high); PDF report
- **UI** — Dark/light mode, responsive layout, transitions and animations, route-based code splitting

## Tech Stack

| Area        | Technology                    |
|------------|-------------------------------|
| Framework  | React 19, TypeScript          |
| Build      | Vite 7                        |
| Styling    | Tailwind CSS v4              |
| Routing    | React Router v7              |
| Charts     | Recharts                     |
| Export     | jsPDF, html2canvas (PDF)      |
| Storage    | localStorage, sessionStorage |
| Tests      | Vitest, Testing Library      |

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` (or the next free port). Landing page is the default; use **Get Started** / **Login** to access the dashboard.

### Build

```bash
npm run build
```

Output is in `dist/`. Use `npm run preview` to serve the production build locally.

### Test

```bash
npm test
```

Runs Vitest once. Use `npm run test:watch` for watch mode.

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx                 # Routes, lazy-loaded pages, Suspense
├── main.tsx                # Entry, React root
├── index.css               # Global styles, Tailwind, animation keyframes
├── components/             # Reusable UI (Layout, Navbar, ProtectedRoute, etc.)
├── context/                # AuthContext (auth state)
├── hooks/                   # useAppState (app data, model, dark mode)
├── models/                  # Claim types, risk categories
├── pages/                   # Route pages (Landing, Login, Dashboard, …)
├── services/                # datasetGenerator, modelService, authService
├── utils/                   # validation, dataCleaning, linearRegression, csvExport, pdfReport, etc.
└── test/                    # Vitest setup
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architectural design and data flow.

## Scripts Summary

| Script         | Command           | Description                |
|----------------|-------------------|----------------------------|
| `npm run dev`  | `vite`            | Start dev server           |
| `npm run build`| `tsc -b && vite build` | Type-check and build  |
| `npm run preview` | `vite preview`  | Preview production build   |
| `npm test`     | `vitest run`      | Run tests                  |
| `npm run test:watch` | `vitest`   | Run tests in watch mode    |
| `npm run lint` | `eslint .`        | Lint source                |

## License

Private / All rights reserved.
