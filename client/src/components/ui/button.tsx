import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:
    'bg-primary-gradient text-white shadow-glow transition hover:shadow-[0_0_28px_rgba(59,130,246,0.55)] hover:brightness-110',
  outline:
    'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/30',
  ghost: 'text-white hover:bg-white/10',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-11 px-5 py-2',
  sm: 'h-9 px-4',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };

