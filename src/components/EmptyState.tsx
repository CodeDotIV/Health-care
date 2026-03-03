interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="card-surface p-8 text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <p className="text-slate-500 dark:text-slate-400 text-4xl mb-4">📊</p>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
