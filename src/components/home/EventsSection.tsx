import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { mockEvents } from '../../data/events';
import { Calendar, Code, MapPin, UserPlus } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="COMPUTE 50 EVENTS"
            title="Parallel Tracks & Workshops"
            subtitle="Discover co-located competitive coding, hands-on masterclasses, and tech showcases."
          />
        </Reveal>

        {mockEvents.length === 0 ? (
          <Reveal>
            <EmptyState
              category="COMPUTE 50 EVENTS"
              title="Event Schedule & Workshops Announcing Soon"
              subtitle="Detailed timings for workshops, coding challenges, and keynotes will be updated shortly."
              icon={<Calendar className="w-7 h-7" />}
            />
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockEvents.map((evt, idx) => (
              <Reveal key={evt.id} delay={idx * 0.1}>
                <Card hoverable className="flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-[var(--accent)]" />
                        <span className="font-bold text-[var(--text-primary)] text-base">{evt.title}</span>
                      </div>
                      <Badge variant="primary" className="text-[11px] uppercase">{evt.type}</Badge>
                    </div>

                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{evt.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary)] pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{evt.mode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                    <Badge variant={evt.status === 'Ongoing' ? 'success' : 'outline'} className="text-[11px]">
                      {evt.status}
                    </Badge>

                    <Link to="/register">
                      <Button size="sm" variant="outline" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                        Participate
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
