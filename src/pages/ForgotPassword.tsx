import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/validators';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const v = validateEmail(email);
    if (!v.valid) {
      setError(v.message ?? 'Invalid email');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

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
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Forgot password
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Enter your email and we&apos;ll send a reset link (demo: no email is sent).
          </p>
          {sent ? (
            <div className="rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 px-3 py-2 text-sm text-sky-700 dark:text-sky-300">
              If an account exists for {email}, you would receive a reset link. This is a demo — no email is sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                  className="input-field w-full"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                Send reset link
              </button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            <Link to="/login" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
