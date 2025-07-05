&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import * as LabelPrimitive from &ldquo;@radix-ui/react-label&rdquo;
import { cva, type VariantProps } from &ldquo;class-variance-authority&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;

const labelVariants = cva(
  &ldquo;text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70&rdquo;
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
