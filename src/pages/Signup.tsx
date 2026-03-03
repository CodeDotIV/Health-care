import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
  sanitizeInput,
} from '../utils/validators';
import { signup } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const initialErrors = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
  submit: '',
};

export function Signup() {
  const navigate = useNavigate();
  const { loginSuccess, token, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, token, navigate]);

  const validate = useCallback(() => {
    const next = { ...initialErrors };
    const vName = validateFullName(fullName);
    if (!vName.valid) next.fullName = vName.message ?? '';
    const vEmail = validateEmail(email);
    if (!vEmail.valid) next.email = vEmail.message ?? '';
    const vPass = validatePassword(password);
    if (!vPass.valid) next.password = vPass.message ?? '';
    const vConfirm = validateConfirmPassword(password, confirmPassword);
    if (!vConfirm.valid) next.confirmPassword = vConfirm.message ?? '';
    if (!agreeTerms) next.terms = 'You must agree to the terms.';
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }, [fullName, email, password, confirmPassword, agreeTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(initialErrors);
    if (!validate()) return;
    setLoading(true);
    try {
      const safeName = sanitizeInput(fullName);
      const safeEmail = sanitizeInput(email).toLowerCase();
      const { user, token } = signup({
        fullName: safeName,
        email: safeEmail,
        password,
        companyName: companyName.trim() || undefined,
      });
      loginSuccess(user, token);
      // Defer redirect so React commits auth state before ProtectedRoute runs
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Signup failed.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean, touched?: boolean) =>
    `input-field w-full rounded-lg border px-3 py-2 ${
      hasError
        ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
        : touched
          ? 'border-green-500 dark:border-green-400 focus:ring-green-500'
          : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500'
    } focus:ring-2 focus:border-transparent bg-white dark:bg-slate-800`;

  if (!isLoading && token) {
    return <Navigate to="/dashboard" replace />;
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
            Create account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {errors.submit}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    fullName: validateFullName(fullName).valid ? '' : (validateFullName(fullName).message ?? ''),
                  }))
                }
                className={inputClass(!!errors.fullName, fullName.length >= 3)}
                placeholder="Min 3 characters"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
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
                className={inputClass(!!errors.email, !!email && validateEmail(email).valid)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    password: validatePassword(password).valid ? '' : (validatePassword(password).message ?? ''),
                  }))
                }
                className={inputClass(!!errors.password, !!password && validatePassword(password).valid)}
                placeholder="Min 8 chars, 1 upper, 1 lower, 1 number, 1 special"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    confirmPassword: validateConfirmPassword(password, confirmPassword).valid
                      ? ''
                      : (validateConfirmPassword(password, confirmPassword).message ?? ''),
                  }))
                }
                className={inputClass(
                  !!errors.confirmPassword,
                  !!confirmPassword && validateConfirmPassword(password, confirmPassword).valid
                )}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Name (optional)
              </label>
              <input
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass(false)}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    setErrors((e2) => ({ ...e2, terms: '' }));
                  }}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  I agree to the terms and conditions *
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden
                  />
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
