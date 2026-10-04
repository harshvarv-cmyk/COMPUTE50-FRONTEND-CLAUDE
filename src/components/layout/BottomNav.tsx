import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Code2, User as UserIcon, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'About', path: '/about', icon: <Info className="w-5 h-5" /> },
    { label: 'Hackathon', path: '/hackathon', icon: <Code2 className="w-5 h-5" /> },
    isAuthenticated
      ? { label: 'Profile', path: '/profile', icon: <UserIcon className="w-5 h-5" />, requiresAuth: true }
      : { label: 'Login', path: '/login', icon: <LogIn className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-color)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 group"
            >
              {active && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute -top-px left-3 right-3 h-[2px] bg-[var(--accent)] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`transition-colors ${
                  active
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                }`}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  active
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for phones with gesture bars */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};
