import { Track } from '../types/hackathon';

export const mockTracks: Track[] = [
  {
    id: 'track-1',
    title: 'AI & Machine Learning',
    description: 'Build intelligent applications leveraging NLP, computer vision, generative AI, or predictive modeling.',
    iconName: 'Cpu',
    problemCount: 4,
  },
  {
    id: 'track-2',
    title: 'Web3 & Decentralized Tech',
    description: 'Explore smart contracts, decentralized finance, zero-knowledge proofs, and sovereign identity solutions.',
    iconName: 'Shield',
    problemCount: 3,
  },
  {
    id: 'track-3',
    title: 'HealthTech & BioInformatics',
    description: 'Solve real-world healthcare challenges using data-driven insights and patient care innovations.',
    iconName: 'Activity',
    problemCount: 3,
  },
  {
    id: 'track-4',
    title: 'Smart Cities & Sustainability',
    description: 'Develop green tech, energy management, smart mobility, and eco-friendly urban solutions.',
    iconName: 'Zap',
    problemCount: 4,
  },
  {
    id: 'track-5',
    title: 'Open Innovation',
    description: 'Have a unique idea that crosses domain boundaries? Pitch your novel solution in open innovation.',
    iconName: 'Lightbulb',
    problemCount: 2,
  },
];
