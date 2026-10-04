import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { FileText, Lock, ArrowRight } from 'lucide-react';

export const ProblemStatements: React.FC = () => {
  const problems = [
    {
      id: 'PS-01',
      track: 'AI & Machine Learning',
      title: 'Real-Time Edge AI for Disaster Management',
      difficulty: 'Hard',
    },
    {
      id: 'PS-02',
      track: 'Web3 & Decentralized Tech',
      title: 'Decentralized Academic Credential Verification System',
      difficulty: 'Medium',
    },
    {
      id: 'PS-03',
      track: 'HealthTech & BioInformatics',
      title: 'Predictive Patient Triage Platform for Emergency Rooms',
      difficulty: 'Hard',
    },
    {
      id: 'PS-04',
      track: 'Smart Cities & Sustainability',
      title: 'Intelligent Micro-Grid Energy Distribution Optimizer',
      difficulty: 'Medium',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--accent)]" />
          Problem Statements Preview
        </h3>
        <Badge variant="outline">RELEASED ON DAY 1</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((ps) => (
          <Link key={ps.id} to="/hackathon#tracks" className="block">
            <Card hoverable className="space-y-3 h-full group">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-mono text-[var(--accent)] font-bold">{ps.id}</span>
                <Badge variant="secondary">{ps.track}</Badge>
              </div>
              <h4 className="font-semibold text-[var(--text-primary)] text-[15px] group-hover:text-[var(--accent)] transition-colors">
                {ps.title}
              </h4>
              <div className="flex items-center justify-between text-[13px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Detailed spec unlocks on Day 1
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--accent)] font-semibold group-hover:translate-x-1 transition-transform">
                  View Track <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
