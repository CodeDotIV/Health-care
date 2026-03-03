import { Navbar } from '../components/Navbar';
import { LineBreakLabel } from '../components/LineBreakLabel';

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-10 sm:pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="opacity-0 animate-slide-up order-1">
            <h1 className="font-display text-xl sm:text-3xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-3 sm:mb-4 leading-snug sm:leading-tight">
              <span className="lg:hidden">Predict Health Insurance Claim Costs with AI Precision</span>
              <span className="hidden lg:inline"><LineBreakLabel text="Predict Health Insurance Claim Costs with AI Precision" /></span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">
              Data-driven insights for insurers and analysts — simulate, clean, and model claim risk in one place.
            </p>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-sky-500 mt-0.5">•</span>
                <span>Generate and validate synthetic health claim datasets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 mt-0.5">•</span>
                <span>Train regression models and view feature importance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 mt-0.5">•</span>
                <span>Predict costs and categorize risk — all in your browser</span>
              </li>
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl opacity-0 animate-scale-in order-2 lg:order-none max-h-[220px] sm:max-h-[280px] lg:max-h-none" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
            <img
              src={`${import.meta.env.BASE_URL}hero-dashboard.png`}
              alt="Healthcare analytics dashboard with charts and metrics"
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-700 bg-sky-50/50 dark:bg-sky-900/10 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-600 dark:text-sky-400">10K+</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-tight"><span className="sm:hidden">Records per dataset</span><span className="hidden sm:inline"><LineBreakLabel text="Records per dataset" /></span></p>
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-600 dark:text-sky-400">100%</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">In-browser</p>
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-600 dark:text-sky-400">Free</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-tight"><span className="sm:hidden">To use</span><span className="hidden sm:inline"><LineBreakLabel text="To use" /></span></p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-10 sm:py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
            <LineBreakLabel text="Features" />
          </h2>
          <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-1">
            Everything you need to go from raw data to actionable claim predictions — no servers, no setup.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                <LineBreakLabel text="Synthetic Data Generator" />
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Generate realistic health insurance datasets with configurable size and strict validation.
              </p>
              <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                <li>• Age, BMI, smoker, region, income, policy type</li>
                <li>• Auto-calculated claim cost with configurable noise</li>
                <li>• Export to CSV</li>
              </ul>
            </div>
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🧹</div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                <LineBreakLabel text="Clean & Validate" />
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Remove duplicates, handle outliers, and enforce business rules — no backend required.
              </p>
              <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                <li>• Deduplicate and drop invalid rows</li>
                <li>• Outlier detection (e.g. claim cost &gt; 5 crore)</li>
                <li>• Optional normalization</li>
              </ul>
            </div>
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: '0.19s', animationFillMode: 'forwards' }}>
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📈</div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                <LineBreakLabel text="Regression & Insights" />
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                Train a linear model, view feature importance, and predict claim costs with risk categories.
              </p>
              <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                <li>• MSE, RMSE, R² and train/test split</li>
                <li>• Correlation matrix and feature importance</li>
                <li>• Low / medium / high risk buckets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg opacity-0 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <img
                src={`${import.meta.env.BASE_URL}health-analytics.png`}
                alt="Data-driven healthcare analytics and metrics"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
                <LineBreakLabel text="Built for" />
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">
                From underwriting to research — one platform for data, models, and predictions.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                <li className="card-surface p-3 sm:p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-tight"><LineBreakLabel text="Insurers & underwriters" /></h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Simulate claim costs and risk segments without sending data outside your environment.</p>
                  <ul className="text-slate-500 dark:text-slate-500 text-sm space-y-0.5">
                    <li>• Risk segmentation (low / medium / high)</li>
                    <li>• Policy and scenario exploration</li>
                  </ul>
                </li>
                <li className="card-surface p-3 sm:p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-tight"><LineBreakLabel text="Data analysts" /></h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Explore regression, feature importance, and evaluation metrics in a single workflow.</p>
                  <ul className="text-slate-500 dark:text-slate-500 text-sm space-y-0.5">
                    <li>• Correlation matrix and feature importance</li>
                    <li>• Actual vs predicted and residual plots</li>
                  </ul>
                </li>
                <li className="card-surface p-3 sm:p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-tight"><LineBreakLabel text="Students & educators" /></h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Learn ML concepts end-to-end with synthetic data and no setup.</p>
                  <ul className="text-slate-500 dark:text-slate-500 text-sm space-y-0.5">
                    <li>• End-to-end pipeline in the browser</li>
                    <li>• No API keys or deployment</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
                <LineBreakLabel text="AI-powered, data-secure" />
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">
                Regression and analytics run locally — your data never leaves your device.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-sky-500">•</span>
                  <span>Model training and feature importance in the browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500">•</span>
                  <span>No cloud uploads — privacy by design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500">•</span>
                  <span>Export to CSV and PDF for reports</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg opacity-0 animate-scale-in transition-transform duration-500 hover:scale-[1.01]" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <img
                src={`${import.meta.env.BASE_URL}ai-health.png`}
                alt="AI and secure healthcare data visualization"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
            <LineBreakLabel text="Pricing" />
          </h2>
          <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-xl mx-auto px-1">
            No tiers, no credit card. Full access to the pipeline from day one.
          </p>
          <div className="max-w-lg mx-auto card-surface p-6 sm:p-8 rounded-2xl opacity-0 animate-scale-in transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
            <p className="text-sky-600 dark:text-sky-400 font-semibold text-lg mb-3 text-center leading-tight"><LineBreakLabel text="Free to use" /></p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 text-center">
              Full access to dataset generation, cleaning, model training, and prediction — 100% in-browser.
            </p>
            <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-2">
              <li>• Unlimited datasets and model runs</li>
              <li>• CSV export and PDF reports</li>
              <li>• No backend or installation required</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
            <LineBreakLabel text="What people say" />
          </h2>
          <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-xl mx-auto px-1">
            Teams use the platform for demos, teaching, and quick claim-cost experiments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <blockquote className="card-surface p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">
                &ldquo;Finally a way to demo claim prediction without touching production data.&rdquo;
              </p>
              <footer className="text-sm font-medium text-slate-700 dark:text-slate-300">— Risk analyst</footer>
            </blockquote>
            <blockquote className="card-surface p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">
                &ldquo;Clean UI and the full pipeline in one place. Great for teaching regression.&rdquo;
              </p>
              <footer className="text-sm font-medium text-slate-700 dark:text-slate-300">— Instructor</footer>
            </blockquote>
            <blockquote className="card-surface p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '0.19s', animationFillMode: 'forwards' }}>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">
                &ldquo;Feature importance and risk buckets made it easy to explain to stakeholders.&rdquo;
              </p>
              <footer className="text-sm font-medium text-slate-700 dark:text-slate-300">— Product lead</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-10 sm:py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg order-2 lg:order-1 opacity-0 animate-scale-in transition-transform duration-500 hover:scale-[1.01]" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <img
                src={`${import.meta.env.BASE_URL}dashboard-workspace.png`}
                alt="Analytics workspace with health data dashboards"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
                <LineBreakLabel text="How It Works" />
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">
                Five steps from signup to prediction — no DevOps, no data pipeline setup.
              </p>
              <ol className="space-y-4 list-decimal list-inside text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-800 dark:text-slate-200">Create an account</strong> and sign in.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Generate or upload</strong> synthetic health claim data.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Clean and validate</strong> the dataset (dedupe, outliers, rules).</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Train a regression model</strong> and explore feature importance.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Evaluate performance</strong> and predict individual claim costs.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight">
            <LineBreakLabel text="Frequently asked questions" />
          </h2>
          <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-xl mx-auto px-1">
            Common questions about data, privacy, and how the app works.
          </p>
          <dl className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm sm:text-base">Is my data sent to a server?</dt>
              <dd className="text-slate-600 dark:text-slate-400 text-sm">
                No. Everything runs in your browser. Data stays on your device; we don&apos;t store or transmit it.
              </dd>
            </div>
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.12s', animationFillMode: 'forwards' }}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm sm:text-base">Do I need to install anything?</dt>
              <dd className="text-slate-600 dark:text-slate-400 text-sm">
                No installation. Sign up, log in, and start generating data and training the model in the app.
              </dd>
            </div>
            <div className="card-surface p-4 sm:p-6 rounded-xl opacity-0 animate-slide-up transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.19s', animationFillMode: 'forwards' }}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm sm:text-base">Can I export my results?</dt>
              <dd className="text-slate-600 dark:text-slate-400 text-sm">
                Yes. Export datasets to CSV and download prediction or evaluation reports as PDF.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-700 py-6 sm:py-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-tight px-1">
            © {new Date().getFullYear()} <LineBreakLabel text="Health Claim Predictor" />. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
