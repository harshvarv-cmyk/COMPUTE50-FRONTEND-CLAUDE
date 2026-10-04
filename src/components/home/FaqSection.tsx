import React, { useState } from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { mockFaqs } from '../../data/faqs';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { motion, AnimatePresence } from 'framer-motion';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(mockFaqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about team formation, travel, rules, and accommodation."
          />
        </Reveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {mockFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <Reveal key={faq.id} delay={idx * 0.08}>
                <Card className="p-0 overflow-hidden border border-[var(--border-color)]">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-sm sm:text-base font-bold">
                      <HelpCircle className="w-5 h-5 text-[var(--accent)] shrink-0" />
                      {faq.question}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[15px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
