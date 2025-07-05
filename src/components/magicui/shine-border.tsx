&ldquo;use client&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children?: React.ReactNode;
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = &ldquo;#000000&rdquo;,
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          &ldquo;--border-radius&rdquo;: `${borderRadius}px`,
        } as React.CSSProperties
      }
      className={cn(
        &ldquo;relative min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] p-3 bg-background border&rdquo;,
        className,
      )}
    >
      <div
        style={
          {
            &ldquo;--border-width&rdquo;: `${borderWidth}px`,
            &ldquo;--border-radius&rdquo;: `${borderRadius}px`,
            &ldquo;--duration&rdquo;: `${duration}s`,
            &ldquo;--mask-linear-gradient&rdquo;: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            &ldquo;--background-radial-gradient&rdquo;: `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(&ldquo;,&rdquo;) : color},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={`before:bg-shine-size pointer-events-none before:absolute before:inset-0 before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[&ldquo;&rdquo;] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine`}
      ></div>
      {children}
    </div>
  );
}
