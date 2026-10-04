import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockSpeakers } from '../../data/speakers';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { EmptyState } from '../common/EmptyState';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const getInitials = (name: string) => {
  const parts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/, '').trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const SpeakerAvatar: React.FC<{ name: string; image?: string }> = ({ name, image }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!image || imgError) {
    return (
      <div className="w-24 h-24 rounded-full bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-mono font-bold text-2xl mb-4 shadow-xs">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-full mb-4 border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] transition-colors">
      <motion.img
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
        src={image}
        alt={name}
        onError={() => setImgError(true)}
        className="w-24 h-24 rounded-full object-cover bg-[var(--bg-secondary)]"
      />
    </div>
  );
};

export const SpeakersSection: React.FC = () => {
  return (
    <section id="speakers" className="py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="SPEAKERS & JUDGES"
            title="Learn From Industry Pioneers"
            subtitle="Experienced tech leaders, startup founders, and engineering veterans guiding Compute 50."
          />
        </Reveal>

        {mockSpeakers.length === 0 ? (
          <Reveal>
            <EmptyState
              category="SPEAKERS & JUDGES"
              title="Speakers & Judges Announcing Soon"
              subtitle="We are finalizing our panel of industry leaders and expert mentors."
              icon={<Users className="w-7 h-7" />}
            />
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSpeakers.map((speaker, idx) => (
              <Reveal key={speaker.id} delay={idx * 0.08}>
                <Card hoverable className="group text-center flex flex-col items-center overflow-hidden h-full">
                  <SpeakerAvatar name={speaker.name} image={speaker.image} />
                  <Badge variant={speaker.type === 'judge' ? 'warning' : speaker.type === 'mentor' ? 'outline' : 'primary'} className="mb-2 uppercase text-[10px]">
                    {speaker.type}
                  </Badge>
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-[13px] text-[var(--accent)] font-semibold mb-1">{speaker.role}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mb-3">{speaker.organization}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
                    {speaker.bio}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
