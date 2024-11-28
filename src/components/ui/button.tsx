import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold border border-input'
   + 'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-primary-foreground hover:bg-gradient-to-b hover:from-blue-600 hover:to-blue-600',
        destructive:
          'bg-gradient-to-b from-red-500 to-red-600 text-destructive-foreground hover:bg-gradient-to-b hover:from-red-600 hover:to-red-600',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-white text-black hover:bg-neutral-100',
        ghost: 'border-transparent hover:bg-accent hover:text-accent-foreground',
        ternary: 'bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className, variant, size, asChild = false, children, disabled, icon = null, loading, ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return (
          <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              disabled={disabled}
              {...props}
          >
              {children}
          </Comp>
      );
    }

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? <Loader className="animate-spin" /> : icon}
            {children}
        </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
