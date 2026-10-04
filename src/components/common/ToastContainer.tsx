import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { ToastType } from '../../context/ToastContext';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-sky-400" />,
};

const borderColorMap: Record<ToastType, string> = {
  success: 'border-l-emerald-400',
  error: 'border-l-red-400',
  warning: 'border-l-amber-400',
  info: 'border-l-sky-400',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] border-l-4 ${borderColorMap[toast.type]} shadow-xl backdrop-blur-md`}
          >
            <div className="mt-0.5 shrink-0">{iconMap[toast.type]}</div>
            <p className="text-sm text-[var(--text-primary)] font-medium flex-1 leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 mt-0.5 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
