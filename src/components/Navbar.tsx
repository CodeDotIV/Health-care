import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineBreakLabel } from './LineBreakLabel';

const NAV_LINKS = [
  { to: '#features', label: 'Features' },
  { to: '#pricing', label: 'Pricing' },
  { to: '#about', label: 'About' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display font-bold text-xl text-sky-600 dark:text-sky-400 transition-opacity hover:opacity-90 duration-200 leading-tight"
          >
            <LineBreakLabel text="Health Claim Predictor" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <a
                key={to}
                href={to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200 leading-tight"
              >
                <LineBreakLabel text={label} />
              </a>
            ))}
            <Link
              to="/login"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 leading-tight"
            >
              <LineBreakLabel text="Login" />
            </Link>
            <Link
              to="/signup"
              className="ml-2 btn-primary inline-block px-4 py-2 rounded-lg text-sm transition-transform duration-200 hover:scale-[1.02] leading-tight"
            >
              <LineBreakLabel text="Get Started" />
            </Link>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/signup"
              className="btn-primary px-3 py-2 rounded-lg text-sm transition-transform duration-200 active:scale-[0.98] leading-tight"
            >
              <LineBreakLabel text="Get Started" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Menu"
            >
              {open ? (
                <span className="text-xl inline-block transition-transform duration-200">✕</span>
              ) : (
                <span className="text-xl inline-block transition-transform duration-200">☰</span>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700 animate-slide-down origin-top">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }, i) => (
                <a
                  key={to}
                  href={to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 animate-fade-in leading-tight"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <LineBreakLabel text={label} />
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 animate-fade-in leading-tight"
                style={{ animationDelay: `${NAV_LINKS.length * 0.04}s` }}
              >
                <LineBreakLabel text="Login" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
