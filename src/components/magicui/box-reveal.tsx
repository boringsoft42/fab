&ldquo;use client&rdquo;;

import type { ReactElement } from &ldquo;react&rdquo;;
import { motion, useAnimation, useInView } from &ldquo;motion/react&rdquo;;
import { useEffect, useRef } from &ldquo;react&rdquo;;

interface BoxRevealProps {
  children: ReactElement;
  width?: &ldquo;fit-content&rdquo; | &ldquo;100%&rdquo;;
  boxColor?: string;
  duration?: number;
}

export const BoxReveal = ({
  children,
  width = &ldquo;fit-content&rdquo;,
  boxColor = &ldquo;#5046e6&rdquo;,
  duration,
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start(&ldquo;visible&rdquo;);
      mainControls.start(&ldquo;visible&rdquo;);
    } else {
      slideControls.start(&ldquo;hidden&rdquo;);
      mainControls.start(&ldquo;hidden&rdquo;);
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} style={{ position: &ldquo;relative&rdquo;, width, overflow: &ldquo;hidden&rdquo; }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial=&ldquo;hidden&rdquo;
        animate={mainControls}
        transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: &ldquo;100%&rdquo; },
        }}
        initial=&ldquo;hidden&rdquo;
        animate={slideControls}
        transition={{ duration: duration ? duration : 0.5, ease: &ldquo;easeIn&rdquo; }}
        style={{
          position: &ldquo;absolute&rdquo;,
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
      />
    </div>
  );
};
