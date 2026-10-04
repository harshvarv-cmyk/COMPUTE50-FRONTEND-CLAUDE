import React from 'react';
import { Users, Monitor, MapPin, GraduationCap } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Reveal } from '../common/Reveal';

export const KeyFacts: React.FC = () => {
  const facts = [
    {
      icon: <Users className="w-8 h-8 text-[var(--accent)]" />,
      label: 'Team Size',
      value: '2 - 4 Members',
      description: 'Form a cross-disciplinary team with your peers.',
    },
    {
      icon: <Monitor className="w-8 h-8 text-[var(--accent)]" />,
      label: 'Event Format',
      value: 'Round 1 Online · Finals at PSG Tech',
      description: 'First round online, shortlisted teams invited to PSG Tech campus.',
    },
    {
      icon: <MapPin className="w-8 h-8 text-[var(--accent)]" />,
      label: 'Venue',
      value: 'PSG College of Technology',
      description: 'Peelamedu, Coimbatore, Tamil Nadu.',
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-[var(--accent)]" />,
      label: 'Eligibility',
      value: 'UG / PG Students',
      description: 'Open to all recognized engineering & degree colleges.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="KEY FACTS"
            title="Everything You Need To Know"
            subtitle="Quick guidelines regarding event format, eligibility, and venue structure."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facts.map((fact, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <Card hoverable className="text-center flex flex-col items-center h-full">
                <div className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] mb-4">
                  {fact.icon}
                </div>
                <span className="text-[13px] font-semibold text-[var(--text-secondary)] uppercase font-mono tracking-wider mb-1">
                  {fact.label}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{fact.value}</h3>
                <p className="text-[13px] text-[var(--text-secondary)]">{fact.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
