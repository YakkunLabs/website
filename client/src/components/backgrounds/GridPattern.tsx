import { cn } from '@/lib/utils';

interface GridPatternProps {
  className?: string;
  fade?: 'top' | 'bottom' | 'both';
  density?: 'loose' | 'normal' | 'tight';
}

export function GridPattern({
  className,
  fade = 'both',
  density = 'normal',
}: GridPatternProps) {
  const size =
    density === 'tight' ? '60px_60px' : density === 'loose' ? '120px_120px' : '90px_90px';

  const mask =
    fade === 'top'
      ? 'linear-gradient(to bottom, transparent, black 30%)'
      : fade === 'bottom'
        ? 'linear-gradient(to top, transparent, black 40%)'
        : 'radial-gradient(circle at center, black, transparent 70%)';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-60',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(109,40,217,0.18),transparent_60%)]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]"
        style={{
          backgroundSize: size,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  );
}

