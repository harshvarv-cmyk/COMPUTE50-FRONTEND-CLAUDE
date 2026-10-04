import React from 'react';
import { Trophy, Medal, Award, Gift } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Reveal } from '../common/Reveal';
import { CountUp } from '../common/CountUp';
import { EVENT_CONFIG } from '../../config/event';

export const PrizePool: React.FC = () => {
  const prizes = [
    {
      place: '1st Place',
      title: 'Grand Winner',
      amountVal: EVENT_CONFIG.prizes.first,
      icon: <Trophy className="w-10 h-10 text-[var(--gold)]" />,
      perks: ['Cash Prize', 'Winner Trophy', 'Direct Internship Interviews', 'Swag Kits'],
      highlight: true,
    },
    {
      place: '2nd Place',
      title: 'Runner Up',
      amountVal: EVENT_CONFIG.prizes.second,
      icon: <Medal className="w-10 h-10 text-[var(--text-secondary)]" />,
      perks: ['Cash Prize', 'Runner Up Trophy', 'Mentorship Sessions', 'Swag Kits'],
      highlight: false,
    },
    {
      place: '3rd Place',
      title: 'Second Runner Up',
      amountVal: EVENT_CONFIG.prizes.third,
      icon: <Award className="w-10 h-10 text-[var(--text-secondary)]" />,
      perks: ['Cash Prize', 'Third Place Trophy', 'Swag Kits'],
      highlight: false,
    },
    {
      place: 'Category Prizes',
      title: 'Track Best Hacks',
      amountVal: EVENT_CONFIG.prizes.categories,
      suffix: ' Total',
      icon: <Gift className="w-10 h-10 text-[var(--accent)]" />,
      perks: ['Best Women Team', 'Best Hardware Innovation', 'Best Web3 Build'],
      highlight: false,
    },
  ];

  return (
    <section id="prizes" className="py-16 md:py-24 bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="PRIZE POOL"
            title={`${EVENT_CONFIG.prizes.totalFormatted} in Total Rewards`}
            subtitle="Compete for substantial cash prizes, trophies, sponsor bounties, and career opportunities."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((p, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Card
                hoverable
                className={`flex flex-col justify-between text-center relative h-full ${
                  p.highlight ? 'border-[var(--accent)] bg-[var(--bg-surface)] ring-1 ring-[var(--accent)]/40' : ''
                }`}
              >
                <div>
                  <div className="mb-4 inline-flex p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    {p.icon}
                  </div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
                    {p.place}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{p.title}</h3>
                  <p className="text-3xl font-extrabold text-[var(--text-primary)] mb-6 font-mono">
                    <CountUp end={p.amountVal} prefix="₹" suffix={p.suffix || ''} />
                  </p>

                  <ul className="text-[13px] text-[var(--text-secondary)] space-y-2.5 text-left border-t border-[var(--border-color)] pt-4">
                    {p.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
