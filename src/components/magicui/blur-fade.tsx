&ldquo;use client&rdquo;;

import {
  AnimatePresence,
  motion,
  useInView,
  UseInViewOptions,
  Variants,
  MotionProps,
} from &ldquo;motion/react&rdquo;;
import { useRef } from &ldquo;react&rdquo;;

type MarginType = UseInViewOptions[&ldquo;margin&rdquo;];

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: &ldquo;up&rdquo; | &ldquo;down&rdquo; | &ldquo;left&rdquo; | &ldquo;right&rdquo;;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = &ldquo;down&rdquo;,
  inView = false,
  inViewMargin = &ldquo;-50px&rdquo;,
  blur = &ldquo;6px&rdquo;,
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: {
      [direction === &ldquo;left&rdquo; || direction === &ldquo;right&rdquo; ? &ldquo;x&rdquo; : &ldquo;y&rdquo;]:
        direction === &ldquo;right&rdquo; || direction === &ldquo;down&rdquo; ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === &ldquo;left&rdquo; || direction === &ldquo;right&rdquo; ? &ldquo;x&rdquo; : &ldquo;y&rdquo;]: 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial=&ldquo;hidden&rdquo;
        animate={isInView ? &ldquo;visible&rdquo; : &ldquo;hidden&rdquo;}
        exit=&ldquo;hidden&rdquo;
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: &ldquo;easeOut&rdquo;,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
