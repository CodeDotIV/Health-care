export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass =
    size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div
      className={`${sizeClass} border-2 border-sky-200 dark:border-sky-800 border-t-sky-600 dark:border-t-sky-400 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
