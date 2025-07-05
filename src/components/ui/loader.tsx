import { Loader2 } from &ldquo;lucide-react&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;

interface LoaderProps {
  className?: string;
  size?: &ldquo;sm&rdquo; | &ldquo;md&rdquo; | &ldquo;lg&rdquo;;
  variant?: &ldquo;default&rdquo; | &ldquo;secondary&rdquo;;
}

export function Loader({
  className,
  size = &ldquo;md&rdquo;,
  variant = &ldquo;default&rdquo;,
}: LoaderProps) {
  const sizeClasses = {
    sm: &ldquo;h-4 w-4&rdquo;,
    md: &ldquo;h-6 w-6&rdquo;,
    lg: &ldquo;h-8 w-8&rdquo;,
  };

  const variantClasses = {
    default: &ldquo;text-primary&rdquo;,
    secondary: &ldquo;text-muted-foreground&rdquo;,
  };

  return (
    <div className={cn(&ldquo;flex items-center justify-center&rdquo;, className)}>
      <Loader2
        className={cn(
          &ldquo;animate-spin&rdquo;,
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
    </div>
  );
}
