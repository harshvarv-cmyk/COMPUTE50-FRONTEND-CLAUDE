import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, BookOpen, Calendar, Lock, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PasswordStrength } from './PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { GoogleIcon } from '../common/GoogleIcon';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.college.trim()) errors.college = 'College or Institution is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fireConfetti = () => {
    const defaults = {
      spread: 360,
      ticks: 80,
      gravity: 0.8,
      decay: 0.92,
      startVelocity: 25,
      colors: ['#5A95E8', '#1B4D9B', '#86B2F2', '#E0A82E', '#F2D58A', '#FFFFFF'],
    };

    confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 40, origin: { x: 0.7, y: 0.6 } });

    setTimeout(() => {
      confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.4 }, startVelocity: 35 });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      fireConfetti();
      addToast('🎉 Registration successful! Welcome to Compute 50.', 'success');
      setTimeout(() => navigate('/profile'), 1200);
    } catch {
      setError('Registration failed. Please check form fields.');
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await register({
        name: 'Google Participant',
        email: 'google.student@psgtech.ac.in',
        phone: '+91 9876543210',
        college: 'PSG College of Technology',
        department: 'CSE',
        year: '3rd Year',
      });
      fireConfetti();
      addToast('🎉 Registration successful via Google! Welcome to Compute 50.', 'success');
      setTimeout(() => navigate('/profile'), 1200);
    } catch {
      addToast('Google sign-up failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Participant Registration</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Register now to enter Compute 50 Hackathon</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Alex Rivera"
          value={formData.name}
          onChange={handleChange}
          error={fieldErrors.name}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        {/* Stack 1-column on mobile (<640px), 2-column on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="student@college.edu"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            error={fieldErrors.phone}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />
        </div>

        <Input
          label="College / Institution"
          name="college"
          placeholder="PSG College of Technology"
          value={formData.college}
          onChange={handleChange}
          error={fieldErrors.college}
          leftIcon={<Building className="w-4 h-4" />}
          required
        />

        {/* Stack 1-column on mobile (<640px), 2-column on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Department"
            name="department"
            placeholder="e.g. Computer Science"
            value={formData.department}
            onChange={handleChange}
            error={fieldErrors.department}
            leftIcon={<BookOpen className="w-4 h-4" />}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-medium text-[var(--text-primary)]">Year of Study</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-400">
                <Calendar className="w-4 h-4" />
              </div>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[var(--bg-surface)] border border-zinc-300 dark:border-[var(--border-color)] text-[var(--text-primary)] text-sm pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer transition-colors"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Participant Account
        </Button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-color)]" />
        </div>
        <span className="relative bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)]">OR</span>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogleSignup}
        disabled={loading}
        leftIcon={<GoogleIcon className="w-4 h-4" />}
      >
        Sign up with Google
      </Button>

      <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
        Already registered?{' '}
        <Link to="/login" className="text-[var(--accent)] hover:underline font-bold">
          Login here
        </Link>
      </p>
    </Card>
  );
};
