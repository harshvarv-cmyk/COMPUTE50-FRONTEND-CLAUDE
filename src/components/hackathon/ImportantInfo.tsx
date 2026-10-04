import React from 'react';
import { Card } from '../common/Card';
import { Info, Wifi, Coffee, Key, ShieldCheck } from 'lucide-react';

export const ImportantInfo: React.FC = () => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <Info className="w-6 h-6 text-[var(--accent)]" />
        <h3 className="text-xl font-bold">Important Participant Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[var(--text-secondary)]">
        <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <Wifi className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span>High-speed campus Wi-Fi credentials provided upon arrival.</span>
        </div>
        <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <Coffee className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span>Complimentary meals, refreshments, and midnight snacks provided.</span>
        </div>
        <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <Key className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span>College ID card or government photo ID mandatory for entry.</span>
        </div>
        <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <span>24/7 security and medical assistance team on campus standby.</span>
        </div>
      </div>
    </Card>
  );
};
