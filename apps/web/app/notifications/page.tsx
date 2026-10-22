'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Mail, Monitor, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useMarkAllRead, useNotifications, useUnreadCount } from '@/hooks/use-platform';
import {
  getStoredNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationRecord,
} from '@/lib/notifications';
import { api } from '@/lib/api-client';
import { formatRelative } from '@/lib/format';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'Notifications' }]}>
        <Inbox />
      </AppShell>
    </RequireAuth>
  );
}

function Inbox() {
  const queryClient = useQueryClient();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const query = useNotifications(unreadOnly);
  const { data: unread } = useUnreadCount();
  const markAllRead = useMarkAllRead();

  // Listen to cross-component notification updates
  useEffect(() => {
    function handleUpdate() {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    window.addEventListener('catcham:notifications:updated', handleUpdate);
    return () => window.removeEventListener('catcham:notifications:updated', handleUpdate);
  }, [queryClient]);

  const items: NotificationRecord[] =
    query.data?.items !== undefined
      ? query.data.items
      : mounted
        ? getStoredNotifications(unreadOnly)
        : [];

  const unreadCount = unread?.count ?? (mounted ? getUnreadNotificationCount() : 0);

  async function markRead(id: string) {
    try {
      await api.post(`/notifications/${id}/read`);
    } catch {
      // Local fallback handled below
    }
    markNotificationAsRead(id);
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }

  async function handleMarkAll() {
    try {
      await markAllRead.mutateAsync();
    } catch {
      markAllNotificationsAsRead();
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  }

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Notifications</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'Everything has been read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            isLoading={markAllRead.isPending}
            onClick={() => void handleMarkAll()}
            className="gap-2 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-neutral-500" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <FilterTab active={!unreadOnly} onClick={() => setUnreadOnly(false)}>
          All
        </FilterTab>
        <FilterTab active={unreadOnly} onClick={() => setUnreadOnly(true)}>
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </FilterTab>
      </div>

      {query.isLoading && items.length === 0 ? (
        <LoadingState message="Loading notifications" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-neutral-400" />}
          title={unreadOnly ? 'Nothing unread' : 'No notifications'}
          description={
            unreadOnly
              ? 'All of your notifications have been marked as read. Switch to "All" to review past advisories and logs.'
              : 'You will receive notifications when case status changes, security advisories are issued, or your CREDICORP benefit application updates.'
          }
        />
      ) : (
        <ul className="space-y-3">
          {items.map((notification) => {
            const isUnread = notification.readAt === null;

            return (
              <li key={notification.id}>
                <Card
                  className={`transition-all duration-200 ${
                    isUnread
                      ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isUnread
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {notification.channel === 'EMAIL' ? (
                            <Mail className="w-4 h-4" />
                          ) : notification.channel === 'MONITOR' ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Monitor className="w-4 h-4" />
                          )}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-neutral-900">
                              {notification.subject}
                            </p>
                            {isUnread && (
                              <Badge status="info" showIcon={false}>
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
                            {notification.body}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono">
                            {mounted ? formatRelative(notification.createdAt) : ''}
                          </p>
                        </div>
                      </div>

                      {isUnread && (
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => void markRead(notification.id)}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                          >
                            Mark read
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        active
          ? 'bg-neutral-900 text-neutral-white shadow-xs'
          : 'bg-neutral-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
      }`}
    >
      {children}
    </button>
  );
}
