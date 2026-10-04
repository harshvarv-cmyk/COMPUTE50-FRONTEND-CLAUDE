import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Rocket, Target, HeartHandshake, ArrowRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';

export const AboutSection: React.FC = () => {
  const shortSummary =
    "COMPUTE 50 HACKATHON is a two-day technical innovation event organised by CSEA as part of the celebrations commemorating 50 years of the M.E. CSE programme at PSG College of Technology. The hackathon brings together students from diverse academic backgrounds to identify real-world problems and build technology-driven solutions.";

  return (
    <section id="about" className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              badge="ABOUT THE HACKATHON"
              title="Empowering Next-Gen Innovators"
              subtitle={shortSummary}
              className="mb-6"
            />
            <div className="mb-12">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] rounded-xl transition-all shadow-xs"
              >
                <span>Read more about Compute 50</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal delay={0.1}>
            <Card hoverable className="h-full">
              <Rocket className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Rapid Prototyping</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Transform raw problem statements into working prototypes with technical mentor guidance during the two-day event.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.2}>
            <Card hoverable className="h-full">
              <Target className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Real Industry Challenges</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Tackle tracks focusing on AI, software engineering, web/mobile, cybersecurity, IoT, and emerging technologies.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.3}>
            <Card hoverable className="h-full">
              <HeartHandshake className="w-8 h-8 text-[var(--accent)] mb-3" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Collaborative Ecosystem</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Connect with student innovators, tech mentors, and academic leaders in an encouraging community.
              </p>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
