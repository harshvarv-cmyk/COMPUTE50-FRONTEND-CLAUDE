import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, Globe, Shield, Terminal } from 'lucide-react';
import { Badge } from '../common/Badge';
import { home } from '../../data/content';

export const EventTheme: React.FC = () => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[var(--accent)]">
          <Sparkles className="w-7 h-7" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Theme: "{home.headline}"</h3>
        </div>
        <Badge variant="primary">2026 EDITION</Badge>
      </div>

      <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
        {home.tagline} Commemorating 50 years of M.E. Computer Science and Engineering at PSG College of Technology, Compute 50 brings together students to engineer impactful solutions addressing real-world problem statements.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-center">
          <Globe className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
          <h4 className="text-[13px] font-bold text-[var(--text-primary)] uppercase font-mono mb-1">Global Impact</h4>
          <p className="text-[13px] text-[var(--text-secondary)]">Solutions designed for real scale and practical application.</p>
        </div>

        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-center">
          <Shield className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
          <h4 className="text-[13px] font-bold text-[var(--text-primary)] uppercase font-mono mb-1">Ethical & Secure</h4>
          <p className="text-[13px] text-[var(--text-secondary)]">Focus on data privacy, safety, and responsible engineering.</p>
        </div>

        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-center">
          <Terminal className="w-6 h-6 text-[var(--gold)] mx-auto mb-2" />
          <h4 className="text-[13px] font-bold text-[var(--text-primary)] uppercase font-mono mb-1">Working MVP</h4>
          <p className="text-[13px] text-[var(--text-secondary)]">Functional prototypes demonstrating engineering excellence.</p>
        </div>
      </div>
    </Card>
  );
};
