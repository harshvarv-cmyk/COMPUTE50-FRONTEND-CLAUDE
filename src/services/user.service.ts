import { UserProfile, HackathonTeam } from '../types/user';
import { User } from '../types/auth';

const MOCK_PROFILE: UserProfile = {
  user: {
    id: 'usr_mock_123',
    name: 'Alex Rivera',
    email: 'alex.rivera@psgtech.ac.in',
    phone: '+91 9876543210',
    college: 'PSG College of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    role: 'leader',
    teamId: 'team_c50_001',
  },
  registrationStatus: 'Confirmed',
  paymentStatus: 'Paid',
  accommodationStatus: 'Confirmed',
  receiptUrl: '#',
  team: {
    id: 'team_c50_001',
    name: 'CyberPunks 50',
    code: 'C50-TEAM-8942',
    leaderId: 'usr_mock_123',
    trackId: 'track-1',
    maxMembers: 4,
    members: [
      {
        id: 'usr_mock_123',
        name: 'Alex Rivera',
        email: 'alex.rivera@psgtech.ac.in',
        role: 'Leader',
        college: 'PSG College of Technology',
      },
      {
        id: 'usr_mock_124',
        name: 'Samantha Lee',
        email: 'sam.lee@psgtech.ac.in',
        role: 'Member',
        college: 'PSG College of Technology',
      },
      {
        id: 'usr_mock_125',
        name: 'Rohan Sharma',
        email: 'rohan.s@psgtech.ac.in',
        role: 'Member',
        college: 'PSG College of Technology',
      },
    ],
  },
};

export const userService = {
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_PROFILE;
  },

  updateUserProfile: async (updatedData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const current = MOCK_PROFILE.user;
    const newUser = { ...current, ...updatedData };
    localStorage.setItem('compute50_user', JSON.stringify(newUser));
    return newUser;
  },

  createTeam: async (teamName: string): Promise<HackathonTeam> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTeam: HackathonTeam = {
      id: 'team_' + Date.now(),
      name: teamName,
      code: 'C50-' + Math.floor(1000 + Math.random() * 9000),
      leaderId: MOCK_PROFILE.user.id,
      maxMembers: 4,
      members: [
        {
          id: MOCK_PROFILE.user.id,
          name: MOCK_PROFILE.user.name,
          email: MOCK_PROFILE.user.email,
          role: 'Leader',
          college: MOCK_PROFILE.user.college,
        },
      ],
    };
    return newTeam;
  },
};
