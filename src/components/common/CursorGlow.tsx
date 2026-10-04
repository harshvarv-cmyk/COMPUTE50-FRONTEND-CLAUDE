import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Check touch devices (ontouchstart, maxTouchPoints > 0, pointer: coarse)
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches);

    if (prefersReducedMotion || isTouchDevice) {
      setIsDisabled(true);
      return;
    }

    const glow = glowRef.current;
    if (!glow) return;

    let animFrame: number;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetX = -200;
      targetY = -200;
    };

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);

      glow.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;

      animFrame = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animFrame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  if (isDisabled) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-30 hidden md:block"
      aria-hidden="true"
    >
      <div className="w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.08] blur-[100px]" />
    </div>
  );
};
