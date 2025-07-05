import { cn } from &ldquo;@/lib/utils&rdquo;

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(&ldquo;animate-pulse rounded-md bg-primary/10&rdquo;, className)}
      {...props}
    />
  )
}

export { Skeleton }
