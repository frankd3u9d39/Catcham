'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ShieldOff } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  /** Every listed permission must be held, matching the API's own check. */
  permissions?: string[];
}

/**
 * Client-side gate. It keeps unauthorised screens out of view, but it is not the
 * security boundary: the API enforces the same permissions on every request, so a
 * caller who bypasses this still gets a 403.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children, permissions = [] }) => {
  const { isAuthenticated, isLoading, can } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return <LoadingState message="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <LoadingState message="Redirecting to sign in" />;
  }

  if (permissions.length > 0 && !can(...permissions)) {
    return (
      <EmptyState
        icon={<ShieldOff className="w-8 h-8 text-neutral-400" />}
        title="You do not have access to this screen"
        description={`It requires the ${permissions.join(' and ')} permission. Ask your agency administrator if you need it.`}
      />
    );
  }

  return <>{children}</>;
};
