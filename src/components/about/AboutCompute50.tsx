import React from 'react';
import { Logo } from '../common/Logo';
import { Card } from '../common/Card';
import { Cpu, Award, Globe } from 'lucide-react';
import { aboutCompute50 } from '../../data/content';

export const AboutCompute50: React.FC = () => {
  return (
    <Card className="space-y-4">
      <div className="flex justify-center pb-2">
        <Logo className="h-36 sm:h-44 w-auto" />
      </div>
      <div className="flex items-center gap-3 text-[var(--accent)]">
        <Cpu className="w-7 h-7 shrink-0" />
        <h3 className="text-xl font-bold text-[var(--text-primary)]">About Compute 50</h3>
      </div>
      <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
        {aboutCompute50}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <Award className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span className="text-[13px] text-[var(--text-secondary)] font-medium">50 Years of M.E. CSE Programme</span>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <Globe className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span className="text-[13px] text-[var(--text-secondary)] font-medium">Round 1 Online · Finals at PSG Tech</span>
        </div>
      </div>
    </Card>
  );
};
