&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import * as ScrollAreaPrimitive from &ldquo;@radix-ui/react-scroll-area&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(&ldquo;relative overflow-hidden&rdquo;, className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className=&ldquo;h-full w-full rounded-[inherit]&rdquo;>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = &ldquo;vertical&rdquo;, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      &ldquo;flex touch-none select-none transition-colors&rdquo;,
      orientation === &ldquo;vertical&rdquo; &&
        &ldquo;h-full w-2.5 border-l border-l-transparent p-[1px]&rdquo;,
      orientation === &ldquo;horizontal&rdquo; &&
        &ldquo;h-2.5 flex-col border-t border-t-transparent p-[1px]&rdquo;,
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className=&ldquo;relative flex-1 rounded-full bg-border&rdquo; />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
