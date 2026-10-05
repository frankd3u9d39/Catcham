'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Search, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/auth-provider';
import { useUnreadCount } from '@/hooks/use-platform';
import { humanise } from '@/lib/format';

export const Topbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: unread } = useUnreadCount();
  const [query, setQuery] = useState('');

  const unreadCount = unread?.count ?? 0;

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();

    if (term.length > 0) {
      // A reference number is unambiguous, so it jumps straight to the record;
      // anything else is treated as a free-text search of the report queue.
      router.push(`/reports?search=${encodeURIComponent(term)}`);
    }
  }

  return (
    <header className="h-16 bg-neutral-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
          <Shield className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="shrink-0">Role:</span>
          <strong className="text-neutral-900 font-semibold truncate">
            {user ? user.roleCodes.map(humanise).join(', ') || 'No role assigned' : '—'}
          </strong>
        </div>
        {user && user.agencyIds.length > 1 && (
          <Badge status="info">{user.agencyIds.length} agencies</Badge>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={onSearch} className="hidden sm:block">
          <label className="sr-only" htmlFor="global-search">
            Search reports
          </label>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-neutral-200 bg-neutral-50 focus-within:border-brand-600 focus-within:bg-neutral-white transition-colors">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              id="global-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reports or references"
              className="bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 outline-none w-48 lg:w-64"
            />
          </div>
        </form>

        <Link
          href="/notifications"
          className="relative p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label={
            unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'
          }
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-neutral-white ring-2 ring-neutral-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-brand-700" />
          </div>
          <div className="hidden lg:block leading-tight min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate max-w-[160px]">
              {user?.fullName ?? '—'}
            </p>
            <p className="text-[11px] text-neutral-500 truncate max-w-[160px]">
              {user?.email ?? ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
