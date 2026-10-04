import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, Code2, Sun, Moon, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { EVENT_CONFIG } from '../../config/event';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Hackathon', path: '/hackathon' },
    ...(isAuthenticated ? [{ label: 'Profile', path: '/profile' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-main)]/95 shadow-md backdrop-blur-md border-b border-[var(--border-color)]'
          : 'bg-[var(--bg-main)]/80 backdrop-blur-xs border-b border-[var(--border-color)]/60'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] origin-left z-50"
        style={{ scaleX }}
      />

      <Container size="lg">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl p-1"
            aria-label="Compute 50 Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl text-[var(--text-primary)] tracking-tight block font-mono">
                COMPUTE <span className="text-[var(--gold)]">50</span>
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] block -mt-1 tracking-wider uppercase font-semibold">
                CSEA, PSG Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-xs">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    active
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-[var(--accent-muted)] border border-[var(--accent)]/30 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions & Theme Switch */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--accent)]" /> : <Moon className="w-4 h-4 text-[var(--text-primary)]" />}
              </motion.div>
            </button>

            {isAuthenticated ? (
              <Link to="/profile">
                <Button
                  variant={isActive('/profile') ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={<UserIcon className="w-4 h-4" />}
                >
                  {user?.name || 'Profile'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isActive('/login') ? 'primary' : 'ghost'} size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant={isActive('/register') ? 'primary' : 'outline'} size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions & Drawer Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-surface)] cursor-pointer flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-[var(--accent)]" /> : <Moon className="w-5 h-5 text-[var(--text-primary)]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-color)] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Slide-In Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-In Drawer Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 350, damping: 35 }
              }
              className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-[var(--bg-surface)] border-l border-[var(--border-color)] z-50 flex flex-col justify-between p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Drawer Top / Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-mono font-bold text-sm">
                      C50
                    </div>
                    <span className="font-bold text-base text-[var(--text-primary)] font-mono">
                      COMPUTE <span className="text-[var(--gold)]">50</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <nav aria-label="Mobile drawer navigation" className="space-y-2">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.path);
                    return (
                      <motion.div
                        key={link.path}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 + 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                            active
                              ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-bold border border-[var(--accent)]/40 shadow-xs'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <span>{link.label}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${active ? 'translate-x-1 text-[var(--accent)]' : 'opacity-40'}`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom / Auth Buttons */}
              <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth leftIcon={<UserIcon className="w-4 h-4" />}>
                      Profile ({user?.name || 'Account'})
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" fullWidth leftIcon={<UserPlus className="w-4 h-4" />}>
                        Register
                      </Button>
                    </Link>
                  </>
                )}
                <p className="text-[11px] text-[var(--text-secondary)] text-center font-mono pt-2">
                  {EVENT_CONFIG.organizerShort} · {EVENT_CONFIG.collegeShort}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
