import * as React from "react";
import { cn } from "@/lib/utils";
import { useHydrationSafe } from "@/hooks/use-hydration-safe";

interface HydrationSafeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fallback?: React.ReactNode;
}

const HydrationSafeInput = React.forwardRef<HTMLInputElement, HydrationSafeInputProps>(
  ({ className, type, fallback, ...props }, ref) => {
    const { isHydrated } = useHydrationSafe();

    // If not hydrated, show a fallback or disabled input
    if (!isHydrated) {
      if (fallback) {
        return <>{fallback}</>;
      }
      
      return (
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          disabled={true}
          suppressHydrationWarning={true}
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        suppressHydrationWarning={true}
        {...props}
      />
    );
  }
);

HydrationSafeInput.displayName = "HydrationSafeInput";

export { HydrationSafeInput };
