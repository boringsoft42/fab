&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import * as SeparatorPrimitive from &ldquo;@radix-ui/react-separator&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = &ldquo;horizontal&rdquo;, decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        &ldquo;shrink-0 bg-border&rdquo;,
        orientation === &ldquo;horizontal&rdquo; ? &ldquo;h-[1px] w-full&rdquo; : &ldquo;h-full w-[1px]&rdquo;,
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
