import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { EVENT_CONFIG } from '../../config/event';

export const StickyMobileRegister: React.FC = () => {
  const location = useLocation();

  // Hide sticky CTA on auth & profile pages
  if (location.pathname === '/register' || location.pathname === '/profile') {
    return null;
  }

  return (
    <div className="block md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 py-2.5 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] shadow-xl transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="pl-1">
          <span className="block text-xs font-bold font-mono text-[var(--accent)]">{EVENT_CONFIG.name}</span>
          <span className="block text-[11px] text-[var(--text-secondary)]">Registration Open</span>
        </div>
        <Link to="/register" className="shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Register Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
