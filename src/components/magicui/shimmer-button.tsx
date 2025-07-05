import React, { CSSProperties, ComponentPropsWithoutRef } from &ldquo;react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<&ldquo;button&rdquo;> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = &ldquo;#ffffff&rdquo;,
      shimmerSize = &ldquo;0.05em&rdquo;,
      shimmerDuration = &ldquo;3s&rdquo;,
      borderRadius = &ldquo;100px&rdquo;,
      background = &ldquo;rgba(0, 0, 0, 1)&rdquo;,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            &ldquo;--spread&rdquo;: &ldquo;90deg&rdquo;,
            &ldquo;--shimmer-color&rdquo;: shimmerColor,
            &ldquo;--radius&rdquo;: borderRadius,
            &ldquo;--speed&rdquo;: shimmerDuration,
            &ldquo;--cut&rdquo;: shimmerSize,
            &ldquo;--bg&rdquo;: background,
          } as CSSProperties
        }
        className={cn(
          &ldquo;group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black&rdquo;,
          &ldquo;transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px&rdquo;,
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            &ldquo;-z-30 blur-[2px]&rdquo;,
            &ldquo;absolute inset-0 overflow-visible [container-type:size]&rdquo;,
          )}
        >
          {/* spark */}
          <div className=&ldquo;absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]&rdquo;>
            {/* spark before */}
            <div className=&ldquo;absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]&rdquo; />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            &ldquo;insert-0 absolute size-full&rdquo;,

            &ldquo;rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]&rdquo;,

            // transition
            &ldquo;transform-gpu transition-all duration-300 ease-in-out&rdquo;,

            // on hover
            &ldquo;group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]&rdquo;,

            // on click
            &ldquo;group-active:shadow-[inset_0_-10px_10px_#ffffff3f]&rdquo;,
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            &ldquo;absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]&rdquo;,
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = &ldquo;ShimmerButton&rdquo;;
