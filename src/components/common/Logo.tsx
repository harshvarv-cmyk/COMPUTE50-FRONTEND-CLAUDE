import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface LogoProps {
  /** "full" = emblem + COMPUTE 50 wordmark, "emblem" = just the 50 and the building */
  variant?: 'full' | 'emblem';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  const { theme } = useTheme();
  const name = variant === 'emblem' ? 'emblem' : 'logo';
  const src = theme === 'dark' ? `/${name}-dark.png` : `/${name}.png`;
  return (
    <img
      src={src}
      alt="Compute 50 logo: the PSG Tech building inside a 50 emblem"
      className={className}
      draggable={false}
      style={theme === 'dark' ? { filter: 'drop-shadow(0 0 22px rgba(90,149,232,0.35))' } : undefined}
    />
  );
};
