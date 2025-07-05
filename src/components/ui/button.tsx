import * as React from &ldquo;react&rdquo;;
import { Slot } from &ldquo;@radix-ui/react-slot&rdquo;;
import { cva, type VariantProps } from &ldquo;class-variance-authority&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const buttonVariants = cva(
  &ldquo;inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50&rdquo;,
  {
    variants: {
      variant: {
        default: &ldquo;bg-primary text-primary-foreground hover:bg-primary/90&rdquo;,
        destructive:
          &ldquo;bg-destructive text-destructive-foreground hover:bg-destructive/90&rdquo;,
        outline:
          &ldquo;border border-input bg-background hover:bg-accent hover:text-accent-foreground&rdquo;,
        secondary:
          &ldquo;bg-secondary text-secondary-foreground hover:bg-secondary/80&rdquo;,
        ghost: &ldquo;hover:bg-accent hover:text-accent-foreground&rdquo;,
        link: &ldquo;text-primary underline-offset-4 hover:underline&rdquo;,
      },
      size: {
        default: &ldquo;h-10 px-4 py-2&rdquo;,
        sm: &ldquo;h-9 rounded-md px-3&rdquo;,
        lg: &ldquo;h-11 rounded-md px-8&rdquo;,
        icon: &ldquo;h-10 w-10&rdquo;,
      },
    },
    defaultVariants: {
      variant: &ldquo;default&rdquo;,
      size: &ldquo;default&rdquo;,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : &ldquo;button&rdquo;;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = &ldquo;Button&rdquo;;

export { Button, buttonVariants };
