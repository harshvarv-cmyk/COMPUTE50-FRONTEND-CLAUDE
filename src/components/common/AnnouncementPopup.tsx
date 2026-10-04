import React, { useState } from 'react';
import { Bell, X, MessageCircle } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event';

export interface AnnouncementPopupProps {
  message?: string;
  badge?: string;
}

export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  message = 'Registrations for Compute 50 Hackathon are now officially open!',
  badge = 'ANNOUNCEMENT',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    return sessionStorage.getItem('announcement_dismissed') !== 'true';
  });

  const handleDismiss = () => {
    sessionStorage.setItem('announcement_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[var(--accent-muted)] border-b border-[var(--border-color)] text-[var(--text-primary)] px-4 py-2.5 text-xs sm:text-sm transition-colors">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <Bell className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span className="bg-[var(--accent)] text-[var(--accent-text)] px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider shrink-0 uppercase font-mono">
            {badge}
          </span>
          <span className="truncate text-xs sm:text-sm font-medium">{message}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={EVENT_CONFIG.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Join WhatsApp group</span>
          </a>
          <button
            onClick={handleDismiss}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded transition-colors cursor-pointer"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
