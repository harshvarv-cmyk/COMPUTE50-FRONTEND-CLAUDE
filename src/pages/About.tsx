import React from 'react';
import { Container } from '../components/common/Container';
import { SectionHeading } from '../components/common/SectionHeading';
import { AboutPsgTech } from '../components/about/AboutPsgTech';
import { AboutCsea } from '../components/about/AboutCsea';
import { AboutCompute50 } from '../components/about/AboutCompute50';
import { EventTheme } from '../components/about/EventTheme';
import { AffiliatedClubs } from '../components/about/AffiliatedClubs';

export const About: React.FC = () => {
  return (
    <div className="py-16 bg-[var(--bg-main)] min-h-screen transition-colors">
      <Container size="lg">
        <SectionHeading
          badge="ABOUT THE EVENT"
          title="Legacy of Engineering & Innovation"
          subtitle="Learn more about PSG College of Technology, CSEA, and the ethos behind Compute 50."
        />

        <div className="space-y-10">
          <EventTheme />
          <AboutCompute50 />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <AboutPsgTech />
            <AboutCsea />
          </div>
          <AffiliatedClubs />
        </div>
      </Container>
    </div>
  );
};

export default About;
