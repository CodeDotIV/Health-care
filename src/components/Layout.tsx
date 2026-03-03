import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../context/AuthContext';
import { LineBreakLabel } from './LineBreakLabel';

const NAV = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/generate', label: 'Dataset Generator' },
  { path: '/cleaning', label: 'Data Cleaning' },
  { path: '/training', label: 'Model Training' },
  { path: '/features', label: 'Feature Analysis' },
  { path: '/evaluation', label: 'Evaluation' },
  { path: '/predict', label: 'Individual Claim' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleDarkMode } = useAppState();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return (
    <div className={state.darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 gap-2 min-w-0">
              <Link to="/dashboard" className="font-display font-bold text-sm sm:text-base lg:text-xl text-sky-600 dark:text-sky-400 transition-opacity hover:opacity-90 duration-200 leading-tight min-w-0 max-w-[65%] sm:max-w-none truncate lg:overflow-visible lg:whitespace-normal">
                <span className="lg:hidden">Health Claim Predictor</span>
                <span className="hidden lg:inline"><LineBreakLabel text="Health Claim Predictor" /></span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1 shrink-0">
                {NAV.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 leading-tight ${
                      location.pathname === path
                        ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <LineBreakLabel text={label} />
                  </Link>
                ))}
                <div className="ml-2 flex items-center gap-2">
                  {user && (
                    <span className="text-sm text-slate-600 dark:text-slate-400 max-w-[120px] truncate" title={user.fullName}>
                      {user.fullName}
                    </span>
                  )}
<button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  Logout
                </button>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Toggle dark mode"
                  >
                    {state.darkMode ? '☀️' : '🌙'}
                  </button>
                </div>
              </nav>
              <div className="flex lg:hidden items-center gap-2">
                {user && (
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[80px]">
                    {user.fullName}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  aria-label="Menu"
                >
                  {menuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>
            {menuOpen && (
              <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1 animate-slide-down origin-top">
                {NAV.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 leading-tight"
                  >
                    <LineBreakLabel text={label} />
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
