import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading Compute 50...',
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-200'
    : 'py-12 flex flex-col items-center justify-center text-slate-300';

  return (
    <div className={containerClasses}>
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
};
