import { mockTracks } from '../data/tracks';
import { mockSpeakers } from '../data/speakers';
import { mockSponsors } from '../data/sponsors';
import { mockEvents } from '../data/events';
import { mockFaqs } from '../data/faqs';
import { mockSchedule } from '../data/schedule';
import { mockClubs } from '../data/clubs';
import { Track, Speaker, Sponsor, EventItem, FAQItem, ScheduleItem, ClubItem } from '../types/hackathon';

export const hackathonService = {
  getTracks: async (): Promise<Track[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTracks;
  },

  getSpeakers: async (): Promise<Speaker[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSpeakers;
  },

  getSponsors: async (): Promise<Sponsor[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSponsors;
  },

  getEvents: async (): Promise<EventItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEvents;
  },

  getFaqs: async (): Promise<FAQItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockFaqs;
  },

  getSchedule: async (): Promise<ScheduleItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSchedule;
  },

  getClubs: async (): Promise<ClubItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockClubs;
  },
};
