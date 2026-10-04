import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Code2, AlertTriangle } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-[var(--bg-main)] py-16">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Glitch-style 404 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-[var(--text-primary)] select-none">
              <span className="relative inline-block">
                4
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 text-[var(--accent)] blur-[2px]"
                  aria-hidden
                >
                  4
                </motion.span>
              </span>
              <span className="text-[var(--accent)] relative inline-block">
                <Code2 className="w-20 h-20 sm:w-28 sm:h-28 inline-block" />
              </span>
              <span className="relative inline-block">
                4
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 text-[var(--accent)] blur-[2px]"
                  aria-hidden
                >
                  4
                </motion.span>
              </span>
            </div>
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Page Not Found
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Looks like this route doesn't exist in the Compute 50 codebase.
              The page may have been moved, deleted, or you might have a typo in the URL.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link to="/">
              <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>

          {/* Easter egg terminal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl font-mono text-xs text-left max-w-sm mx-auto"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-color)]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[var(--text-secondary)] ml-2">terminal</span>
            </div>
            <div className="space-y-1 text-[var(--text-secondary)]">
              <p>
                <span className="text-[var(--accent)]">$</span> curl compute50.psgtech.ac.in{window.location.pathname}
              </p>
              <p className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 inline" />
                Error 404: Route not mapped
              </p>
              <p>
                <span className="text-[var(--accent)]">$</span>{' '}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  █
                </motion.span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFound;
