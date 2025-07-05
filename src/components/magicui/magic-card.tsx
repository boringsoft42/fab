&ldquo;use client&rdquo;;

import { motion, useMotionTemplate, useMotionValue } from &ldquo;motion/react&rdquo;;
import React, { useCallback, useEffect, useRef } from &ldquo;react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = &ldquo;#262626&rdquo;,
  gradientOpacity = 0.8,
  gradientFrom = &ldquo;#9E7AFF&rdquo;,
  gradientTo = &ldquo;#FE8BBB&rdquo;,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!e.relatedTarget) {
        document.removeEventListener(&ldquo;mousemove&rdquo;, handleMouseMove);
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
      }
    },
    [handleMouseMove, mouseX, gradientSize, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    document.addEventListener(&ldquo;mousemove&rdquo;, handleMouseMove);
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [handleMouseMove, mouseX, gradientSize, mouseY]);

  useEffect(() => {
    document.addEventListener(&ldquo;mousemove&rdquo;, handleMouseMove);
    document.addEventListener(&ldquo;mouseout&rdquo;, handleMouseOut);
    document.addEventListener(&ldquo;mouseenter&rdquo;, handleMouseEnter);

    return () => {
      document.removeEventListener(&ldquo;mousemove&rdquo;, handleMouseMove);
      document.removeEventListener(&ldquo;mouseout&rdquo;, handleMouseOut);
      document.removeEventListener(&ldquo;mouseenter&rdquo;, handleMouseEnter);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseOut]);

  useEffect(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className={cn(&ldquo;group relative flex size-full rounded-xl&rdquo;, className)}
    >
      <div className=&ldquo;absolute inset-px z-10 rounded-xl bg-background&rdquo; />
      <div className=&ldquo;relative z-30&rdquo;>{children}</div>
      <motion.div
        className=&ldquo;pointer-events-none absolute inset-px z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100&rdquo;
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className=&ldquo;pointer-events-none absolute inset-0 rounded-xl bg-border duration-300 group-hover:opacity-100&rdquo;
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom}, 
              ${gradientTo}, 
              hsl(var(--border)) 100%
            )
          `,
        }}
      />
    </div>
  );
}
