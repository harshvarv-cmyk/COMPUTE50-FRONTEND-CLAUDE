import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { mockSponsors } from '../../data/sponsors';
import { EVENT_CONFIG } from '../../config/event';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const SponsorsSection: React.FC = () => {
  return (
    <section id="sponsors" className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="SPONSORS & PARTNERS"
            title="Backing Technical Excellence"
            subtitle="Compute 50 is generously supported by leading global tech brands and ecosystem partners."
          />
        </Reveal>

        {mockSponsors.length === 0 ? (
          <Reveal>
            <EmptyState
              category="SPONSORS & PARTNERS"
              title="Sponsors & Partners Announcing Soon"
              subtitle={`We are actively onboarding sponsors for Compute 50. Interested in partnering? Reach out at ${EVENT_CONFIG.contactEmail}`}
              icon={<Sparkles className="w-7 h-7" />}
            />
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockSponsors.map((sponsor, idx) => (
              <Reveal key={sponsor.id} delay={idx * 0.06}>
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ duration: 0.2 }}
                  href={sponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center text-center hover:border-[var(--accent)] transition-colors group focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label={`Visit ${sponsor.name} website`}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-12 w-auto object-contain mb-3 grayscale group-hover:grayscale-0 opacity-75 group-hover:opacity-100 transition-all"
                  />
                  <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {sponsor.name}
                  </span>
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    {sponsor.category}
                  </Badge>
                </motion.a>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
