&ldquo;use client&rdquo;;

import * as React from &ldquo;react&rdquo;;
import * as SliderPrimitive from &ldquo;@radix-ui/react-slider&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      &ldquo;relative flex w-full touch-none select-none items-center&rdquo;,
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className=&ldquo;relative h-2 w-full grow overflow-hidden rounded-full bg-secondary&rdquo;>
      <SliderPrimitive.Range className=&ldquo;absolute h-full bg-primary&rdquo; />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className=&ldquo;block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50&rdquo; />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
