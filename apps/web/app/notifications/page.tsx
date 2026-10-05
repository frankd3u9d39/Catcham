'use client';

import React, { useState } from 'react';
import { Bell, Mail, Monitor } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useMarkAllRead, useNotifications, useUnreadCount } from '@/hooks/use-platform';
import { api } from '@/lib/api-client';
import { formatRelative } from '@/lib/format';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Notifications' }]}>
        <Inbox />
      </AppShell>
    </RequireAuth>
  );
}

function Inbox() {
  const queryClient = useQueryClient();
  const [unreadOnly, setUnreadOnly] = useState(false);

  const query = useNotifications(unreadOnly);
  const { data: unread } = useUnreadCount();
  const markAllRead = useMarkAllRead();

  async function markRead(id: string) {
    await api.post(`/notifications/${id}/read`);
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Notifications</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {unread?.count ? `${unread.count} unread` : 'Everything has been read'}
          </p>
        </div>
        {(unread?.count ?? 0) > 0 && (
          <Button
            variant="outline"
            size="sm"
            isLoading={markAllRead.isPending}
            onClick={() => void markAllRead.mutateAsync()}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <FilterTab active={!unreadOnly} onClick={() => setUnreadOnly(false)}>
          All
        </FilterTab>
        <FilterTab active={unreadOnly} onClick={() => setUnreadOnly(true)}>
          Unread
        </FilterTab>
      </div>

      {query.isLoading ? (
        <LoadingState message="Loading notifications" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.items.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-neutral-400" />}
          title={unreadOnly ? 'Nothing unread' : 'No notifications'}
          description="You are notified when a case you are on changes state, when you are assigned, and when something is escalated to you."
        />
      ) : (
        <ul className="space-y-2.5">
          {query.data?.items.map((notification) => {
            const isUnread = notification.readAt === null;

            return (
              <li key={notification.id}>
                <Card className={isUnread ? 'border-brand-200 bg-brand-50/30' : undefined}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="p-1.5 rounded-lg bg-neutral-100 text-neutral-500 shrink-0 mt-0.5">
                          {notification.channel === 'EMAIL' ? (
                            <Mail className="w-3.5 h-3.5" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">
                            {notification.subject}
                          </p>
                          <p className="mt-1 text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
                            {notification.body}
                          </p>
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            {formatRelative(notification.createdAt)}
                          </p>
                        </div>
                      </div>

                      {isUnread && (
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge status="info" showIcon={false}>
                            New
                          </Badge>
                          <button
                            type="button"
                            onClick={() => void markRead(notification.id)}
                            className="text-[11px] text-brand-600 hover:underline"
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
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-neutral-900 text-neutral-white'
          : 'bg-neutral-white border border-neutral-200 text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {children}
    </button>
  );
}
