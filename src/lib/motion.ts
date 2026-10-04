import { Variants } from 'framer-motion';

// Reusable motion constants for consistent technical animation feel
export const MOTION_EASE = [0.25, 0.1, 0.25, 1.0] as const;

export const MOTION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.4,
  SLOW: 0.6,
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.NORMAL,
      ease: MOTION_EASE,
    },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.NORMAL,
      ease: MOTION_EASE,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};
