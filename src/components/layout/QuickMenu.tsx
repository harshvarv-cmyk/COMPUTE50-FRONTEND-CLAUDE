import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Code2, Compass, Home, Info, LogIn, Mail, Trophy, User as UserIcon, Volume2, VolumeX } from 'lucide-react';
import { RadialMenu } from '../common/RadialMenu';
import type { WheelItem } from '../common/RadialMenu';
import { useAuth } from '../../hooks/useAuth';
import { isMuted, setMuted, tone } from '../../lib/sound';

interface Destination extends WheelItem {
  path: string;
  hash?: string;
}

/** Floating round-menu button + sound toggle. Opens the radial wheel for quick navigation. */
export const QuickMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const items: Destination[] = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'About', icon: Info, path: '/about' },
    { label: 'Hackathon', icon: Code2, path: '/hackathon' },
    { label: 'Prizes', icon: Trophy, path: '/', hash: '#prizes' },
    { label: 'Schedule', icon: Calendar, path: '/', hash: '#schedule' },
    { label: 'Contact', icon: Mail, path: '/', hash: '#contact' },
    isAuthenticated
      ? { label: 'Profile', icon: UserIcon, path: '/profile' }
      : { label: 'Login', icon: LogIn, path: '/login' },
  ];

  const toggle = (next: boolean) => {
    setOpen(next);
    tone(next ? 420 : 560, 0.16, 0.04, next ? 720 : 380);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        tone(560, 0.16, 0.04, 380);
      }
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const pick = (i: number) => {
    const dest = items[i];
    setOpen(false);
    tone(760, 0.09, 0.045);
    navigate({ pathname: dest.path, hash: dest.hash ?? '' });
  };

  return (
    <>
      <div className="fixed left-5 bottom-36 md:bottom-8 z-50 flex items-center gap-2" data-nosound="">
        <button type="button" aria-label="Open quick menu" aria-expanded={open} onClick={() => toggle(!open)} className="qm-fab">
          <Compass size={22} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
            if (!next) tone(600, 0.08, 0.045);
          }}
          className="qm-mini"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className={`qm-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="absolute inset-0" onClick={() => toggle(false)} />
        <div className="qm-wheel">
          <RadialMenu
            label="Quick menu"
            open={open}
            items={items}
            onPick={pick}
            hub={(i) => (
              <>
                <h3>{items[i].label}</h3>
                <p>Move around the ring, scroll, or use the arrow keys. Click to open.</p>
              </>
            )}
          />
        </div>
        <button type="button" className="qm-back" onClick={() => toggle(false)} data-nosound="">
          Close
        </button>
      </div>
    </>
  );
};
