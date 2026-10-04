import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

const getStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score, label: 'Fair', color: '#eab308' };
  if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Excellent', color: '#5A95E8' };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = useMemo(() => getStrength(password), [password]);

  const requirements: Requirement[] = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter', met: /[a-z]/.test(password) },
      { label: 'One number', met: /[0-9]/.test(password) },
      { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Password Strength
          </span>
          <motion.span
            key={strength.label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: strength.color }}
          >
            {strength.label}
          </motion.span>
        </div>
        <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 5) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: strength.color }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {requirements.map((req) => (
          <motion.div
            key={req.label}
            initial={false}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-[11px]"
          >
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 opacity-40" />
            )}
            <span
              className={`${
                req.met
                  ? 'text-[var(--accent)] font-medium'
                  : 'text-[var(--text-secondary)] opacity-70'
              } transition-colors`}
            >
              {req.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
