&ldquo;use client&rdquo;;

import * as React from &ldquo;react&rdquo;;
import * as RadioGroupPrimitive from &ldquo;@radix-ui/react-radio-group&rdquo;;
import { Circle } from &ldquo;lucide-react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(&ldquo;grid gap-2&rdquo;, className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        &ldquo;aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50&rdquo;,
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className=&ldquo;flex items-center justify-center&rdquo;>
        <Circle className=&ldquo;h-2.5 w-2.5 fill-current text-current&rdquo; />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
