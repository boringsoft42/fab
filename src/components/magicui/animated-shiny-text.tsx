import { ComponentPropsWithoutRef, CSSProperties, FC } from &ldquo;react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<&ldquo;span&rdquo;> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          &ldquo;--shiny-width&rdquo;: `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        &ldquo;mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70&rdquo;,

        // Shine effect
        &ldquo;animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]&rdquo;,

        // Shine gradient
        &ldquo;bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80&rdquo;,

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
