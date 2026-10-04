import { ClubItem } from '../types/hackathon';
import { clubs as rawClubs, cseaStats as rawCseaStats } from './content';

const clubMeta: Record<string, { logo: string; accent: string; abbreviation: string; index: string }> = {
  ghcc: { logo: '/clubs/ghcc.png', accent: '#22c55e', abbreviation: 'GHCC', index: '01' },
  'the-eye': { logo: '/clubs/the-eye.png', accent: '#e5e7eb', abbreviation: 'THE EYE', index: '02' },
  dt: { logo: '/clubs/dt.png', accent: '#a78bfa', abbreviation: 'DT', index: '03' },
  ecell: { logo: '/clubs/ecell.png', accent: '#f59e0b', abbreviation: 'E-CELL', index: '04' },
};

export const clubs: ClubItem[] = rawClubs.map((club) => {
  const meta = clubMeta[club.id] || { logo: '', accent: '#3b82f6', abbreviation: club.name, index: '00' };
  return {
    ...club,
    abbreviation: meta.abbreviation,
    logo: meta.logo,
    accent: meta.accent,
    index: meta.index,
    tagline: club.description,
  };
});

export const mockClubs: ClubItem[] = clubs;
export const cseaStats = rawCseaStats;
