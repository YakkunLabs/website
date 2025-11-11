import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  tooltip?: string;
};

interface SegmentedProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function Segmented({ value, onChange, options }: SegmentedProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="inline-flex items-center rounded-full border border-border bg-surface p-1 text-sm">
        {options.map((option) => {
          const segment = (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) onChange(option.value);
              }}
              className={cn(
                'relative rounded-full px-4 py-2 transition',
                option.disabled
                  ? 'cursor-not-allowed text-muted-foreground'
                  : 'hover:text-white',
                option.value === value
                  ? 'bg-primary-gradient text-white shadow-glow'
                  : 'bg-transparent',
              )}
            >
              {option.label}
            </button>
          );

          if (option.disabled && option.tooltip) {
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>{segment}</TooltipTrigger>
                <TooltipContent>{option.tooltip}</TooltipContent>
              </Tooltip>
            );
          }

          return segment;
        })}
      </div>
    </TooltipProvider>
  );
}

