import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export const RulesGuidelines: React.FC = () => {
  const rules = [
    'All team members must be present on campus during check-in on Day 1.',
    'Code must be written from scratch during the 50-hour hackathon window. Open-source libraries and APIs are allowed.',
    'Plagiarism or using pre-existing full projects will result in immediate disqualification.',
    'Teams must commit code to the designated GitHub repository assigned during registration.',
    'Decision of the judging panel and organizing committee is final and binding.',
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <ShieldAlert className="w-6 h-6 text-[var(--accent)]" />
        <h3 className="text-xl font-bold">Hackathon Rules & Guidelines</h3>
      </div>
      <ul className="space-y-3 text-[15px] text-[var(--text-secondary)] leading-relaxed">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
