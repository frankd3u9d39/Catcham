/**
 * CATCH-AM Resilient Client Notification Service
 * Manages official inter-agency bulletins, case status updates, and subscriber alerts.
 * Operates offline-first with Cloud Firestore / local persistence.
 */

export interface NotificationRecord {
  id: string;
  channel: 'PORTAL' | 'EMAIL' | 'MONITOR' | string;
  subject: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

const STORAGE_KEY = 'catcham.notifications.v1';

const SEED_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-portal-welcome',
    channel: 'PORTAL',
    subject: 'Secure Complainant Account Partitioned & Active',
    body: 'Welcome to CATCH-AM. Your citizen account is initialized with end-to-end anonymity protocols. Disclosures filed through this console are immutably logged and routed to designated inter-agency oversight units.',
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'notif-credicorp-benefit',
    channel: 'PORTAL',
    subject: 'FG CREDICORP C.L.I.C.K.D Hardware Allocation Active',
    body: 'Under the DICON/CATCH-AM & CREDICORP strategic alliance, verified users qualify for subsidized digital equipment (laptops, tablets, smartphones) with flexible 6–18 month repayment tenures. Visit the CREDICORP section in your sidebar to apply.',
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'notif-whistleblower-act',
    channel: 'MONITOR',
    subject: 'Statutory Whistleblower Protection Directives Enforced',
    body: 'Submissions involving public sector corruption, petroleum theft, or security misconduct are strictly safeguarded under federal anti-retaliation directives. Keep your private tracking tokens confidential.',
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getAllStoredNotifications(): NotificationRecord[] {
  if (!isBrowser()) {
    return SEED_NOTIFICATIONS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      return SEED_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as NotificationRecord[];
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
    return SEED_NOTIFICATIONS;
  } catch {
    return SEED_NOTIFICATIONS;
  }
}

export function getStoredNotifications(unreadOnly = false): NotificationRecord[] {
  const all = getAllStoredNotifications();
  if (unreadOnly) {
    return all.filter((item) => item.readAt === null);
  }
  return all;
}

export function getUnreadNotificationCount(): number {
  const all = getAllStoredNotifications();
  return all.filter((item) => item.readAt === null).length;
}

export function markNotificationAsRead(id: string): void {
  if (!isBrowser()) return;

  try {
    const all = getAllStoredNotifications();
    const updated = all.map((item) => {
      if (item.id === id && item.readAt === null) {
        return { ...item, readAt: new Date().toISOString() };
      }
      return item;
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('catcham:notifications:updated'));
  } catch (err) {
    console.warn('Failed to mark notification as read:', err);
  }
}

export function markAllNotificationsAsRead(): void {
  if (!isBrowser()) return;

  try {
    const all = getAllStoredNotifications();
    const now = new Date().toISOString();
    const updated = all.map((item) => ({
      ...item,
      readAt: item.readAt ?? now,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('catcham:notifications:updated'));
  } catch (err) {
    console.warn('Failed to mark all notifications as read:', err);
  }
}

export function addNotification(notification: Omit<NotificationRecord, 'createdAt'> & { createdAt?: string }): void {
  if (!isBrowser()) return;

  try {
    const all = getAllStoredNotifications();
    const newRecord: NotificationRecord = {
      ...notification,
      createdAt: notification.createdAt || new Date().toISOString(),
    };
    // Prepend to top
    const updated = [newRecord, ...all.filter((item) => item.id !== newRecord.id)];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('catcham:notifications:updated'));
  } catch (err) {
    console.warn('Failed to add notification:', err);
  }
}
