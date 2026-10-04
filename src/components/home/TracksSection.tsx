import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockTracks } from '../../data/tracks';
import { Cpu, Shield, Activity, Zap, Lightbulb, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Reveal } from '../common/Reveal';
import { motion } from 'framer-motion';

export const TracksSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-[var(--accent)]" />;
      case 'Shield':
        return <Shield className="w-7 h-7 text-[var(--accent)]" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-[var(--accent)]" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-[var(--accent)]" />;
      default:
        return <Lightbulb className="w-7 h-7 text-[var(--accent)]" />;
    }
  };

  return (
    <section id="tracks" className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="HACKATHON TRACKS"
            title="Choose Your Challenge Area"
            subtitle="Diverse technical tracks catered to AI, blockchain, medical engineering, clean energy, and open innovation."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTracks.map((track, idx) => (
            <Reveal key={track.id} delay={idx * 0.08}>
              <Card hoverable className="group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]"
                    >
                      {getIcon(track.iconName)}
                    </motion.div>
                    <Badge variant="outline">{track.problemCount} Problem Statements</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-4">{track.description}</p>
                </div>
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[13px] font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  <span>Explore track details</span>
                  <motion.div initial={{ x: 0 }} whileHover={{ x: 4 }} className="inline-flex items-center text-[var(--accent)]">
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
