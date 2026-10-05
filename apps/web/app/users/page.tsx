'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState, InlineError } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import {
  useAgencies,
  useCreateUser,
  useGrantMembership,
  useRoles,
  useUsers,
} from '@/hooks/use-platform';
import { useAuth } from '@/providers/auth-provider';
import { formatDate, formatRelative, humanise } from '@/lib/format';
import type { UserSummary } from '@/lib/types';

export default function UsersPage() {
  return (
    <RequireAuth permissions={['user:read']}>
      <AppShell breadcrumbs={[{ label: 'Personnel' }]}>
        <Personnel />
      </AppShell>
    </RequireAuth>
  );
}

function Personnel() {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [grantFor, setGrantFor] = useState<UserSummary | null>(null);

  const query = useUsers({ page, pageSize: 20, search: search || undefined });

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Personnel</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {query.data
              ? `${query.data.total} account${query.data.total === 1 ? '' : 's'}`
              : 'Accounts and their agency role grants'}
          </p>
        </div>
        {can('user:manage') && <CreateUserAction />}
      </div>

      <Card className="mb-5">
        <CardContent className="p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchDraft.trim());
              setPage(1);
            }}
          >
            <label className="sr-only" htmlFor="user-search">
              Search personnel
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-md border border-neutral-200 bg-neutral-white focus-within:ring-2 focus-within:ring-brand-600">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                id="user-search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Name or email address"
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {query.isLoading ? (
        <LoadingState message="Loading accounts" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.data?.items.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-neutral-400" />}
          title="No accounts match"
          description="Clear the search to see every account."
        />
      ) : (
        <>
          <ul className="space-y-2.5">
            {query.data?.items.map((person) => (
              <li key={person.id}>
                <Card>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-900">
                          {person.fullName}
                        </p>
                        <Badge
                          status={person.status === 'ACTIVE' ? 'success' : 'warning'}
                          showIcon={false}
                        >
                          {humanise(person.status)}
                        </Badge>
                        {person.isMfaEnabled && (
                          <Badge status="info">
                            <ShieldCheck className="w-3 h-3" />
                            MFA
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 break-all">{person.email}</p>

                      {person.memberships.length === 0 ? (
                        <p className="mt-2 text-xs text-amber-700">
                          No agency role granted — this account cannot see any case data.
                        </p>
                      ) : (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {person.memberships.map((membership) => (
                            <li
                              key={`${membership.agencyId}-${membership.roleCode}`}
                              className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-[11px] text-neutral-600"
                            >
                              {membership.roleName} · {membership.agencyName}
                            </li>
                          ))}
                        </ul>
                      )}

                      <p className="mt-2 text-[11px] text-neutral-400">
                        Created {formatDate(person.createdAt)}
                        {person.lastLoginAt
                          ? ` · last signed in ${formatRelative(person.lastLoginAt)}`
                          : ' · never signed in'}
                      </p>
                    </div>

                    {can('user:manage') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setGrantFor(person)}
                      >
                        Grant role
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          {query.data && (
            <Pagination
              page={query.data.page}
              totalPages={query.data.totalPages}
              total={query.data.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <GrantRoleDialog person={grantFor} onClose={() => setGrantFor(null)} />
    </>
  );
}

function CreateUserAction() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const create = useCreateUser();

  async function submit() {
    await create.mutateAsync({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim() || undefined,
    });
    setOpen(false);
    setForm({ fullName: '', email: '', password: '', phoneNumber: '' });
  }

  const passwordValid =
    form.password.length >= 12 &&
    /[a-z]/.test(form.password) &&
    /[A-Z]/.test(form.password) &&
    /\d/.test(form.password);

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="w-3.5 h-3.5" />
        New account
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create a personnel account"
        description="The account has no access until you grant it an agency role."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={create.isPending}
              disabled={form.fullName.trim().length < 2 || !form.email.includes('@') || !passwordValid}
              onClick={() => void submit()}
            >
              Create account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            required
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
          <Input
            label="Work email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <Input
            label="Initial password"
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            helperText="At least 12 characters with an uppercase letter, a lowercase letter and a digit. Ask the holder to change it after first sign-in."
            error={
              form.password.length > 0 && !passwordValid
                ? 'Does not meet the minimum requirements'
                : undefined
            }
          />
          <Input
            label="Phone number"
            value={form.phoneNumber}
            onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
            placeholder="+2348012345678"
          />
          <InlineError error={create.error} />
        </div>
      </Dialog>
    </>
  );
}

function GrantRoleDialog({
  person,
  onClose,
}: {
  person: UserSummary | null;
  onClose: () => void;
}) {
  const [agencyId, setAgencyId] = useState('');
  const [roleId, setRoleId] = useState('');

  const { data: agencies = [] } = useAgencies();
  const { data: roles = [] } = useRoles();
  const grant = useGrantMembership();

  async function submit() {
    if (!person) {
      return;
    }
    await grant.mutateAsync({ userId: person.id, agencyId, roleId });
    onClose();
    setAgencyId('');
    setRoleId('');
  }

  const selectedRole = roles.find((role) => role.id === roleId);

  return (
    <Dialog
      open={person !== null}
      onClose={onClose}
      title="Grant an agency role"
      description={person ? `For ${person.fullName}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            isLoading={grant.isPending}
            disabled={agencyId.length === 0 || roleId.length === 0}
            onClick={() => void submit()}
          >
            Grant role
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Agency"
          required
          value={agencyId}
          onChange={(event) => setAgencyId(event.target.value)}
          options={[
            { value: '', label: 'Select an agency' },
            ...agencies.map((agency) => ({
              value: agency.id,
              label: `${agency.acronym} — ${agency.name}`,
            })),
          ]}
        />
        <Select
          label="Role"
          required
          value={roleId}
          onChange={(event) => setRoleId(event.target.value)}
          options={[
            { value: '', label: 'Select a role' },
            ...roles.map((role) => ({ value: role.id, label: role.name })),
          ]}
        />

        {selectedRole && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              This role grants {selectedRole.permissions.length} permission
              {selectedRole.permissions.length === 1 ? '' : 's'}
            </p>
            {selectedRole.description && (
              <p className="mt-1 text-xs text-neutral-600">{selectedRole.description}</p>
            )}
            <ul className="mt-2 flex flex-wrap gap-1">
              {selectedRole.permissions.map((link) => (
                <li
                  key={link.permission.slug}
                  className="px-1.5 py-0.5 rounded bg-neutral-white border border-neutral-200 font-mono text-[10px] text-neutral-600"
                >
                  {link.permission.slug}
                </li>
              ))}
            </ul>
          </div>
        )}

        <InlineError error={grant.error} />
      </div>
    </Dialog>
  );
}
