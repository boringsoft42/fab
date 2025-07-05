import * as React from &ldquo;react&rdquo;;
import { cva, type VariantProps } from &ldquo;class-variance-authority&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const badgeVariants = cva(
  &ldquo;inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2&rdquo;,
  {
    variants: {
      variant: {
        default:
          &ldquo;border-transparent bg-primary text-primary-foreground hover:bg-primary/80&rdquo;,
        secondary:
          &ldquo;border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80&rdquo;,
        destructive:
          &ldquo;border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80&rdquo;,
        outline: &ldquo;text-foreground&rdquo;,
      },
    },
    defaultVariants: {
      variant: &ldquo;default&rdquo;,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
