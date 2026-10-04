import React from 'react';

export interface SectionHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const labelText = eyebrow || badge;
  const formattedEyebrow = labelText
    ? labelText.startsWith('//')
      ? labelText
      : `// ${labelText.toUpperCase()}`
    : null;

  return (
    <div className={`max-w-3xl mb-12 sm:mb-16 ${alignmentClasses[align]} ${className}`}>
      {formattedEyebrow && (
        <div className="mb-2.5">
          <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-widest uppercase inline-block py-0.5 px-2 bg-[var(--accent-muted)] rounded border border-[var(--accent)]/30">
            {formattedEyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15] [text-wrap:balance]">
        {title}
      </h2>
      <span aria-hidden="true" className={`block h-[3px] w-12 rounded-full bg-[var(--gold)] mt-4 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`} />
      {subtitle && (
        <p className="mt-3.5 text-[15px] sm:text-base text-[var(--text-secondary)] font-normal leading-[1.7] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
