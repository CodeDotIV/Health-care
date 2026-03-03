import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { validateEmail, sanitizeInput } from '../utils/validators';
import { login, checkLoginLockout } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const initialErrors = { email: '', password: '', submit: '' };

const PROTECTED_PATHS = ['/dashboard', '/generate', '/cleaning', '/training', '/features', '/evaluation', '/predict'];

function getRedirectFrom(location: ReturnType<typeof useLocation>): string {
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/dashboard';
  return PROTECTED_PATHS.includes(from) ? from : '/dashboard';
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginSuccess, token, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const from = getRedirectFrom(location);

  const updateLockout = useCallback(() => {
    const { locked, remainingMs } = checkLoginLockout();
    if (locked) setLockoutRemaining(remainingMs);
    else setLockoutRemaining(0);
  }, []);

  useEffect(() => {
    if (!isLoading && token) {
      navigate(from, { replace: true });
    }
  }, [isLoading, token, from, navigate]);

  useEffect(() => {
    updateLockout();
    const id = setInterval(() => {
      const { locked, remainingMs } = checkLoginLockout();
      if (locked) setLockoutRemaining(remainingMs);
      else setLockoutRemaining(0);
    }, 1000);
    return () => clearInterval(id);
  }, [updateLockout]);

  const validate = useCallback(() => {
    const next = { ...initialErrors };
    const vEmail = validateEmail(email);
    if (!vEmail.valid) next.email = vEmail.message ?? '';
    if (!password.trim()) next.password = 'Password is required';
    setErrors(next);
    return !next.email && !next.password;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(initialErrors);
    if (lockoutRemaining > 0) return;
    if (!validate()) return;
    setLoading(true);
    try {
      const safeEmail = sanitizeInput(email).toLowerCase();
      const { user, token } = login(safeEmail, password, rememberMe);
      loginSuccess(user, token);
      // Defer redirect so React commits auth state before ProtectedRoute runs
      setTimeout(() => navigate(from, { replace: true }), 0);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Login failed.',
      }));
      updateLockout();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `input-field w-full rounded-lg border px-3 py-2 ${
      hasError
        ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
        : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500'
    } focus:ring-2 focus:border-transparent bg-white dark:bg-slate-800`;

  const locked = lockoutRemaining > 0;

  if (!isLoading && token) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-display font-bold text-xl text-sky-600 dark:text-sky-400 transition-opacity hover:opacity-90 duration-200"
          >
            Health Claim Predictor
          </Link>
        </div>
        <div className="card-surface p-6 rounded-xl shadow-sm opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Log in
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {errors.submit}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    email: validateEmail(email).valid ? '' : (validateEmail(email).message ?? ''),
                  }))
                }
                disabled={locked}
                className={inputClass(!!errors.email)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={locked}
                className={inputClass(!!errors.password)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-sky-600 dark:text-sky-400 hover:underline transition-opacity duration-200"
              >
                Forgot password?
              </Link>
            </div>
            {locked && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Too many attempts. Try again in {Math.ceil(lockoutRemaining / 1000)} seconds.
              </p>
            )}
            <button
              type="submit"
              disabled={loading || locked}
              className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden
                  />
                  Signing in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
