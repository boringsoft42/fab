import { Loader } from &ldquo;./loader&rdquo;;

interface LoadingScreenProps {
  message?: string;
  variant?: &ldquo;default&rdquo; | &ldquo;overlay&rdquo;;
  className?: string;
}

export function LoadingScreen({
  message = &ldquo;Cargando...&rdquo;,
  variant = &ldquo;default&rdquo;,
  className,
}: LoadingScreenProps) {
  if (variant === &ldquo;overlay&rdquo;) {
    return (
      <div className=&ldquo;fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm&rdquo;>
        <div className=&ldquo;flex flex-col items-center gap-4&rdquo;>
          <Loader size=&ldquo;lg&rdquo; />
          {message && (
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className=&ldquo;flex flex-col items-center justify-center gap-4 py-8&rdquo;>
        <Loader size=&ldquo;lg&rdquo; />
        {message && <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{message}</p>}
      </div>
    </div>
  );
}
