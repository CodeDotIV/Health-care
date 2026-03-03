import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const DatasetGenerator = lazy(() => import('./pages/DatasetGenerator').then((m) => ({ default: m.DatasetGenerator })));
const DataCleaning = lazy(() => import('./pages/DataCleaning').then((m) => ({ default: m.DataCleaning })));
const ModelTraining = lazy(() => import('./pages/ModelTraining').then((m) => ({ default: m.ModelTraining })));
const FeatureAnalysis = lazy(() => import('./pages/FeatureAnalysis').then((m) => ({ default: m.FeatureAnalysis })));
const Evaluation = lazy(() => import('./pages/Evaluation').then((m) => ({ default: m.Evaluation })));
const IndividualClaim = lazy(() => import('./pages/IndividualClaim').then((m) => ({ default: m.IndividualClaim })));

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppStateProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Starting page: landing at root */}
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="generate" element={<DatasetGenerator />} />
                  <Route path="cleaning" element={<DataCleaning />} />
                  <Route path="training" element={<ModelTraining />} />
                  <Route path="features" element={<FeatureAnalysis />} />
                  <Route path="evaluation" element={<Evaluation />} />
                  <Route path="predict" element={<IndividualClaim />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AppStateProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
