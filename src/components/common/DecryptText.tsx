import React, { useState, useEffect } from 'react';

export interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number; // Speed per frame update in ms (default: 35ms)
  scrambleChars?: string;
  highlightText?: string;
  highlightClassName?: string;
  onComplete?: () => void;
}

const DEFAULT_HEX_SCRAMBLE = '0123456789ABCDEF#$@%&*<>[]{}';

export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  className = '',
  speed = 35,
  scrambleChars = DEFAULT_HEX_SCRAMBLE,
  highlightText,
  highlightClassName = 'text-[var(--accent)]',
  onComplete,
}) => {
  const hasRunInSession =
    typeof window !== 'undefined' &&
    sessionStorage.getItem('compute50_hero_scramble_ran') === 'true';

  const [displayText, setDisplayText] = useState<string[]>(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || hasRunInSession) {
      return text.split('');
    }
    return text.split('').map((char) => {
      if (char === ' ') return ' ';
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    });
  });

  const [settledIndices, setSettledIndices] = useState<Set<number>>(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || hasRunInSession) {
      return new Set(text.split('').map((_, i) => i));
    }
    const initial = new Set<number>();
    text.split('').forEach((char, i) => {
      if (char === ' ') initial.add(i);
    });
    return initial;
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || hasRunInSession) {
      setDisplayText(text.split(''));
      setSettledIndices(new Set(text.split('').map((_, i) => i)));
      onComplete?.();
      return;
    }

    let frameId: number;
    let iteration = 0;
    const totalChars = text.length;
    const baseStepsPerChar = 3;
    const initialDelaySteps = 5;

    let lastTime = performance.now();

    const updateFrame = (now: number) => {
      if (now - lastTime >= speed) {
        lastTime = now;
        iteration++;

        const nextDisplayText: string[] = [];
        const nextSettled = new Set<number>();
        let allSettled = true;

        for (let i = 0; i < totalChars; i++) {
          const targetChar = text[i];
          if (targetChar === ' ') {
            nextDisplayText.push(' ');
            nextSettled.add(i);
            continue;
          }

          const lockAtIteration = initialDelaySteps + i * baseStepsPerChar;

          if (iteration >= lockAtIteration) {
            nextDisplayText.push(targetChar);
            nextSettled.add(i);
          } else {
            allSettled = false;
            const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            nextDisplayText.push(randomChar);
          }
        }

        setDisplayText(nextDisplayText);
        setSettledIndices(nextSettled);

        if (allSettled) {
          try {
            sessionStorage.setItem('compute50_hero_scramble_ran', 'true');
          } catch {
            // ignore quota or security exceptions
          }
          onComplete?.();
          return;
        }
      }

      frameId = requestAnimationFrame(updateFrame);
    };

    frameId = requestAnimationFrame(updateFrame);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [text, speed, scrambleChars, onComplete, hasRunInSession]);

  const highlightStart = highlightText ? text.indexOf(highlightText) : -1;
  const highlightEnd =
    highlightStart !== -1 && highlightText ? highlightStart + highlightText.length : -1;

  // Group characters into word tokens so each word stays in inline-block whitespace-nowrap
  const wordTokens: { startIndex: number; chars: { char: string; index: number }[] }[] = [];
  let currentWord: { char: string; index: number }[] = [];
  let wordStart = 0;

  displayText.forEach((char, index) => {
    if (text[index] === ' ') {
      if (currentWord.length > 0) {
        wordTokens.push({ startIndex: wordStart, chars: currentWord });
        currentWord = [];
      }
    } else {
      if (currentWord.length === 0) wordStart = index;
      currentWord.push({ char, index });
    }
  });
  if (currentWord.length > 0) {
    wordTokens.push({ startIndex: wordStart, chars: currentWord });
  }

  return (
    <span className={`inline-block font-mono select-none ${className}`}>
      {wordTokens.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          {wIdx > 0 && <span>&nbsp;</span>}
          <span className="inline-block whitespace-nowrap">
            {word.chars.map(({ char, index }) => {
              const isHighlighted =
                highlightStart !== -1 && index >= highlightStart && index < highlightEnd;
              const isSettled = settledIndices.has(index);

              return (
                <span
                  key={index}
                  className={`inline-block transition-colors duration-100 ${
                    isHighlighted ? highlightClassName : ''
                  } ${!isSettled ? 'opacity-80 text-[var(--accent)] font-mono' : ''}`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};
