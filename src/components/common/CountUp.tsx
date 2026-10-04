import React, { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // duration in seconds
  className?: string;
  formatNumber?: (val: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 1.5,
  className = '',
  formatNumber,
}) => {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const shouldReduceMotion = useReducedMotion();
  const hasCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isInView || hasCompletedRef.current) return;

    if (shouldReduceMotion) {
      setCount(end);
      hasCompletedRef.current = true;
      return;
    }

    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * end);

      setCount(currentVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(end);
        hasCompletedRef.current = true;
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      // Guarantee exact final value on unmount/cleanup
      setCount(end);
      hasCompletedRef.current = true;
    };
  }, [isInView, end, duration, shouldReduceMotion]);

  const defaultFormat = (val: number) => {
    return val.toLocaleString('en-IN');
  };

  const formatted = formatNumber ? formatNumber(count) : defaultFormat(count);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
