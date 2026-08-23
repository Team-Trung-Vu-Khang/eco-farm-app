interface CodeBadgeProps {
  value: unknown;
}

export function CodeBadge({ value }: CodeBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-slate-700">
      {String(value || "—")}
    </span>
  );
}
