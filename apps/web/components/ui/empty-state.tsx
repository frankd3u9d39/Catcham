import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50', className)}>
    <div className="p-3 bg-neutral-white rounded-full shadow-xs border border-neutral-200 text-neutral-400 mb-4">
      {icon || <Inbox className="w-8 h-8 text-neutral-400" />}
    </div>
    <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
    <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
