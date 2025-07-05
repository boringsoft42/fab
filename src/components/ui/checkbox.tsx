&ldquo;use client&rdquo;;

import * as React from &ldquo;react&rdquo;;
import * as CheckboxPrimitive from &ldquo;@radix-ui/react-checkbox&rdquo;;
import { Check } from &ldquo;lucide-react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      &ldquo;peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground&rdquo;,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(&ldquo;flex items-center justify-center text-current&rdquo;)}
    >
      <Check className=&ldquo;h-4 w-4&rdquo; />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
