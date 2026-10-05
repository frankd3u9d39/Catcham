'use client';

import React, { useState } from 'react';
import { Check, KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineError } from '@/components/ui/error-state';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { humanise } from '@/lib/format';

export default function SettingsPage() {
  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Settings' }]}>
        <Settings />
      </AppShell>
    </RequireAuth>
  );
}

function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Your account</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Agency roles are granted by an administrator and cannot be changed here.
        </p>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <Field label="Name" value={user?.fullName ?? '—'} />
            <Field label="Email" value={user?.email ?? '—'} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Roles
              </p>
              {user && user.roleCodes.length > 0 ? (
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {user.roleCodes.map((code) => (
                    <li key={code}>
                      <Badge status="info" showIcon={false}>
                        {humanise(code)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-amber-700">
                  No role granted. Ask your agency administrator for access.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <ChangePasswordCard />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Permissions you hold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-neutral-500 mb-3">
              These are enforced on every API request, not only in this interface.
            </p>
            {user && user.permissions.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {[...user.permissions].sort().map((permission) => (
                  <li
                    key={permission}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50 font-mono text-[10px] text-neutral-600"
                  >
                    <ShieldCheck className="w-2.5 h-2.5 text-brand-600" />
                    {permission}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">None.</p>
            )}
          </CardContent>
        </Card>

        <RevokeSessionsCard />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-neutral-800 break-all">{value}</p>
    </div>
  );
}

function ChangePasswordCard() {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const valid =
    newPassword.length >= 12 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    newPassword === confirm;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setDone(true);
      // The API revokes every session on a password change, so the current
      // tokens are already dead; sign out rather than leave a broken session.
      setTimeout(() => void logout(), 2500);
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card className="border-brand-200 bg-brand-50/50">
        <CardContent className="p-5 flex items-start gap-3">
          <Check className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">Password changed</p>
            <p className="mt-1 text-xs text-neutral-600">
              Every session was revoked. Signing you out so you can sign in again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-neutral-400" />
          Change your password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => void submit(event)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            helperText="At least 12 characters with an uppercase letter, a lowercase letter and a digit."
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            error={
              confirm.length > 0 && confirm !== newPassword ? 'Passwords do not match' : undefined
            }
          />

          <p className="text-xs text-neutral-500">
            Changing your password signs you out everywhere.
          </p>

          <InlineError error={error} />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={currentPassword.length === 0 || !valid}
          >
            Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RevokeSessionsCard() {
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function revoke() {
    setIsSubmitting(true);
    try {
      await api.post('/auth/revoke-sessions');
      await logout();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600">
          Revoke every signed-in session, including this one. Use this if you signed in on a
          device you no longer control.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          isLoading={isSubmitting}
          onClick={() => void revoke()}
        >
          <LogOut className="w-4 h-4" />
          Sign out everywhere
        </Button>
      </CardContent>
    </Card>
  );
}
