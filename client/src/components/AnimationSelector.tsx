interface AnimationSelectorProps {
  animations: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export function AnimationSelector({
  animations,
  value,
  onChange,
  label = 'Animation',
}: AnimationSelectorProps) {
  if (!animations.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(event) =>
            onChange(event.target.value ? event.target.value : null)
          }
          className="w-full appearance-none rounded-lg border border-border bg-background/80 px-4 py-2 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        >
          <option value="">Default</option>
          {animations.map((animation) => (
            <option key={animation} value={animation}>
              {animation}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          ▾
        </span>
      </div>
    </div>
  );
}

