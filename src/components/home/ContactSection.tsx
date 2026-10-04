import React, { useState } from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { EVENT_CONFIG } from '../../config/event';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[var(--bg-main)] transition-colors">
      <Container size="lg">
        <Reveal>
          <SectionHeading
            badge="CONTACT US"
            title="Have Questions? Reach Out"
            subtitle="Our student team and department coordinators are here to assist you."
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <Reveal delay={0.1}>
            <Card className="flex flex-col justify-between space-y-6 h-full">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Contact Information</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
                  Feel free to email or call our organizing team for sponsorship, travel, or registration inquiries.
                </p>

                <div className="space-y-4 text-[13px] text-[var(--text-secondary)]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)]">Venue & Address</strong>
                      <span>{EVENT_CONFIG.venueFull}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)]">Email Address</strong>
                      <span>{EVENT_CONFIG.contactEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)]">Student Coordinators</strong>
                      <span>{EVENT_CONFIG.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[13px] text-[var(--text-secondary)]">
                <span className="text-[var(--accent)] font-semibold block mb-1">Office Hours</span>
                <span>Monday – Saturday: 9:00 AM – 6:00 PM IST</span>
              </div>
            </Card>
          </Reveal>

          {/* Quick Query Form */}
          <Reveal delay={0.2}>
            <Card className="h-full">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Send a Message</h3>
              {submitted ? (
                <div className="py-12 text-center text-[var(--accent)] space-y-2">
                  <p className="text-base font-semibold">Thank you for getting in touch!</p>
                  <p className="text-[13px] text-[var(--text-secondary)]">We have received your message and will respond shortly.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', message: '' });
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Your Name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <div className="space-y-1.5 text-left">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">Message</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm p-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
                      placeholder="Write your inquiry here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" fullWidth rightIcon={<Send className="w-4 h-4" />}>
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
