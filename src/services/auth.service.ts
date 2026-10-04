import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

const MOCK_USER: User = {
  id: 'usr_mock_123',
  name: 'Alex Rivera',
  email: 'alex.rivera@psgtech.ac.in',
  phone: '+91 9876543210',
  college: 'PSG College of Technology',
  department: 'Computer Science and Engineering',
  year: '3rd Year',
  role: 'leader',
  teamId: 'team_c50_001',
};

// Frontend Mock Authentication Service (easily replaceable with real API)
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockToken = 'mock_jwt_token_compute_50_' + Date.now();
    const user: User = {
      ...MOCK_USER,
      email: credentials.email || MOCK_USER.email,
    };

    localStorage.setItem('compute50_auth_token', mockToken);
    localStorage.setItem('compute50_user', JSON.stringify(user));

    return { user, token: mockToken };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockToken = 'mock_jwt_token_compute_50_' + Date.now();
    const user: User = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      college: data.college,
      department: data.department,
      year: data.year,
      role: 'user',
    };

    localStorage.setItem('compute50_auth_token', mockToken);
    localStorage.setItem('compute50_user', JSON.stringify(user));

    return { user, token: mockToken };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('compute50_auth_token');
    const storedUser = localStorage.getItem('compute50_user');

    if (!token || !storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('compute50_auth_token');
    localStorage.removeItem('compute50_user');
  },
};
