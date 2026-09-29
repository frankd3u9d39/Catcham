import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading CATCHAM data...' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-neutral-500 space-y-3">
    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);
