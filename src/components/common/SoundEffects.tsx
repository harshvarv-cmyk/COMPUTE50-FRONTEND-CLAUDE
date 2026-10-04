import React, { useEffect } from 'react';
import { tone, unlockAudio } from '../../lib/sound';

const HOVER_TARGETS = 'button, a[href], [class*="hover:border-[var(--accent)]"]';

/** Global, very soft hover and click ticks. Muted with the speaker button next to the quick menu. */
export const SoundEffects: React.FC = () => {
  useEffect(() => {
    let last: Element | null = null;

    const over = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const el = (e.target as HTMLElement).closest?.(HOVER_TARGETS) ?? null;
      if (el && !el.closest('[data-nosound]')) {
        if (el !== last) {
          last = el;
          tone(900, 0.04, 0.018);
        }
      } else {
        last = null;
      }
    };

    const down = (e: PointerEvent) => {
      unlockAudio();
      const el = (e.target as HTMLElement).closest?.('button, a[href]') ?? null;
      if (el && !el.closest('[data-nosound]')) tone(600, 0.07, 0.035);
    };

    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    return () => {
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
    };
  }, []);

  return null;
};
