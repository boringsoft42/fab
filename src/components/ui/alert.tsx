import * as React from &ldquo;react&rdquo;;
import { cva, type VariantProps } from &ldquo;class-variance-authority&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;

const alertVariants = cva(
  &ldquo;relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7&rdquo;,
  {
    variants: {
      variant: {
        default: &ldquo;bg-background text-foreground&rdquo;,
        destructive:
          &ldquo;border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive&rdquo;,
      },
    },
    defaultVariants: {
      variant: &ldquo;default&rdquo;,
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role=&ldquo;alert&rdquo;
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = &ldquo;Alert&rdquo;;

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(&ldquo;mb-1 font-medium leading-none tracking-tight&rdquo;, className)}
    {...props}
  />
));
AlertTitle.displayName = &ldquo;AlertTitle&rdquo;;

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(&ldquo;text-sm [&_p]:leading-relaxed&rdquo;, className)}
    {...props}
  />
));
AlertDescription.displayName = &ldquo;AlertDescription&rdquo;;

export { Alert, AlertTitle, AlertDescription };
