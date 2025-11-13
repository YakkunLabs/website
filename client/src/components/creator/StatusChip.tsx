interface StatusChipProps {
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'STARTING' | 'STOPPING';
}

export function StatusChip({ status }: StatusChipProps) {
  const styles: Record<StatusChipProps['status'], string> = {
    RUNNING: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
    STOPPED: 'bg-slate-500/20 text-slate-200 border-slate-400/50',
    ERROR: 'bg-rose-500/20 text-rose-300 border-rose-400/60',
    STARTING: 'bg-amber-500/20 text-amber-200 border-amber-400/60',
    STOPPING: 'bg-amber-500/20 text-amber-200 border-amber-400/60',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}


