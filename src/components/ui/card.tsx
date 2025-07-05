import * as React from &ldquo;react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      &ldquo;rounded-lg border bg-card text-card-foreground shadow-sm&rdquo;,
      className
    )}
    {...props}
  />
));
Card.displayName = &ldquo;Card&rdquo;;

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(&ldquo;flex flex-col space-y-1.5 p-6&rdquo;, className)}
    {...props}
  />
));
CardHeader.displayName = &ldquo;CardHeader&rdquo;;

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      &ldquo;text-2xl font-semibold leading-none tracking-tight&rdquo;,
      className
    )}
    {...props}
  />
));
CardTitle.displayName = &ldquo;CardTitle&rdquo;;

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(&ldquo;text-sm text-muted-foreground&rdquo;, className)}
    {...props}
  />
));
CardDescription.displayName = &ldquo;CardDescription&rdquo;;

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(&ldquo;p-6 pt-0&rdquo;, className)} {...props} />
));
CardContent.displayName = &ldquo;CardContent&rdquo;;

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(&ldquo;flex items-center p-6 pt-0&rdquo;, className)}
    {...props}
  />
));
CardFooter.displayName = &ldquo;CardFooter&rdquo;;

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
