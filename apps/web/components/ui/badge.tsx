import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Lock } from 'lucide-react';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'confidential' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  status = 'neutral',
  showIcon = true,
  children,
  ...props
}) => {
  const styles: Record<BadgeStatus, { container: string; icon: React.ReactNode }> = {
    success: {
      container: 'bg-brand-50 text-status-success border-brand-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    error: {
      container: 'bg-red-50 text-red-900 border-red-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
    info: {
      container: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />,
    },
    confidential: {
      container: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      icon: <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
    },
    neutral: {
      container: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      icon: null,
    },
  };

  const selected = styles[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none',
        selected.container,
        className
      )}
      {...props}
    >
      {showIcon && selected.icon}
      <span>{children}</span>
    </span>
  );
};
