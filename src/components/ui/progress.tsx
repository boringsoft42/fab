&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import * as ProgressPrimitive from &ldquo;@radix-ui/react-progress&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      &ldquo;relative h-2 w-full overflow-hidden rounded-full bg-primary/20&rdquo;,
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className=&ldquo;h-full w-full flex-1 bg-primary transition-all&rdquo;
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
