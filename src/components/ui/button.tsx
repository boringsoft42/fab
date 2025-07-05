import * as React from &ldquo;react&rdquo;
import { Slot } from &ldquo;@radix-ui/react-slot&rdquo;
import { cva, type VariantProps } from &ldquo;class-variance-authority&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;

const buttonVariants = cva(
  &ldquo;inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0&rdquo;,
  {
    variants: {
      variant: {
        default:
          &ldquo;bg-primary text-primary-foreground shadow hover:bg-primary/90&rdquo;,
        destructive:
          &ldquo;bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90&rdquo;,
        outline:
          &ldquo;border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground&rdquo;,
        secondary:
          &ldquo;bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80&rdquo;,
        ghost: &ldquo;hover:bg-accent hover:text-accent-foreground&rdquo;,
        link: &ldquo;text-primary underline-offset-4 hover:underline&rdquo;,
      },
      size: {
        default: &ldquo;h-9 px-4 py-2&rdquo;,
        sm: &ldquo;h-8 rounded-md px-3 text-xs&rdquo;,
        lg: &ldquo;h-10 rounded-md px-8&rdquo;,
        icon: &ldquo;h-9 w-9&rdquo;,
      },
    },
    defaultVariants: {
      variant: &ldquo;default&rdquo;,
      size: &ldquo;default&rdquo;,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : &ldquo;button&rdquo;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = &ldquo;Button&rdquo;

export { Button, buttonVariants }
