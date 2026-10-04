import React from 'react';
import { Hero } from '../components/home/Hero';
import { PoweredBy } from '../components/home/PoweredBy';
import { PrizePool } from '../components/home/PrizePool';
import { AboutSection } from '../components/home/AboutSection';
import { KeyFacts } from '../components/home/KeyFacts';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { TracksSection } from '../components/home/TracksSection';
import { SpeakersSection } from '../components/home/SpeakersSection';
import { SponsorsSection } from '../components/home/SponsorsSection';
import { EventsSection } from '../components/home/EventsSection';
import { FaqSection } from '../components/home/FaqSection';
import { ContactSection } from '../components/home/ContactSection';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <PoweredBy />
      <PrizePool />
      <AboutSection />
      <KeyFacts />
      <ScheduleSection />
      <TracksSection />
      <SpeakersSection />
      <SponsorsSection />
      <EventsSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
};

export default Home;
