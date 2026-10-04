import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PULL_THRESHOLD = 80;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const pullDistance = useMotionValue(0);

  const indicatorOpacity = useTransform(pullDistance, [0, 40, PULL_THRESHOLD], [0, 0.5, 1]);
  const indicatorScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const indicatorRotate = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 180]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return;
      const scrollTop = containerRef.current?.scrollTop ?? window.scrollY;
      if (scrollTop <= 0) {
        touchStartY.current = e.touches[0].clientY;
        isDragging.current = true;
      }
    },
    [isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = Math.max(0, currentY - touchStartY.current);
      // Apply resistance
      const dampened = Math.min(diff * 0.5, PULL_THRESHOLD * 1.5);
      pullDistance.set(dampened);
    },
    [isRefreshing, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (pullDistance.get() >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      animate(pullDistance, PULL_THRESHOLD * 0.6, { duration: 0.2 });

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        animate(pullDistance, 0, { duration: 0.3 });
      }
    } else {
      animate(pullDistance, 0, { duration: 0.25 });
    }
  }, [onRefresh, isRefreshing, pullDistance]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative md:hidden"
    >
      {/* Pull indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute top-0 left-0 right-0 flex justify-center z-10 pt-2 pointer-events-none"
      >
        <motion.div
          style={{ scale: indicatorScale }}
          className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shadow-lg"
        >
          <motion.div
            style={{ rotate: isRefreshing ? undefined : indicatorRotate }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              }`}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div style={{ y: pullDistance }}>{children}</motion.div>
    </div>
  );
};
