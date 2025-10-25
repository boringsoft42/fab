import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "secondary" | "muted"
  text?: string
}

export function LoadingSpinner({
  className,
  size = "md",
  variant = "default",
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  }

  const variantClasses = {
    default: "text-primary",
    secondary: "text-secondary-foreground",
    muted: "text-muted-foreground",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className={cn("text-sm", variantClasses[variant])}>
          {text}
        </p>
      )}
    </div>
  )
}

// Full-page loading spinner
export function LoadingSpinnerFullPage({ text }: { text?: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}
