import React from 'react';
import { Container } from '../common/Container';
import { Card } from '../common/Card';
import { ShieldCheck, Award, Users } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { EVENT_CONFIG } from '../../config/event';

export const PoweredBy: React.FC = () => {
  return (
    <section className="py-12 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Reveal delay={0.1}>
            <Card hoverable className="flex flex-col items-center h-full">
              <ShieldCheck className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">{EVENT_CONFIG.college}</h4>
              <p className="text-[13px] text-[var(--text-secondary)]">Leading autonomous institute committed to engineering and research perfection.</p>
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card hoverable className="flex flex-col items-center h-full">
              <Award className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">{EVENT_CONFIG.organizerFull}</h4>
              <p className="text-[13px] text-[var(--text-secondary)]">Organizing premier technical symposiums and national engineering challenges.</p>
            </Card>
          </Reveal>
          <Reveal delay={0.3}>
            <Card hoverable className="flex flex-col items-center h-full">
              <Users className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">National Innovation Hub</h4>
              <p className="text-[13px] text-[var(--text-secondary)]">Welcoming participant teams from top engineering institutions across India.</p>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
