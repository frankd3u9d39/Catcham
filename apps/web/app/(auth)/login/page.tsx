'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineError } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/providers/auth-provider';

/**
 * useSearchParams opts the subtree out of prerendering, so the form sits behind
 * a Suspense boundary. Without it the build fails trying to statically render
 * this route.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading sign in" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Honour ?next= so a deep link survives the sign-in redirect.
  const next = searchParams.get('next') ?? '/dashboard';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(next);
    }
  }, [isLoading, isAuthenticated, router, next]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      router.replace(next);
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      id="main-content"
      className="min-h-screen grid lg:grid-cols-2 bg-neutral-50"
    >
      {/* Left: the form. First in the DOM so it is reached first on mobile. */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded" />
            <div className="leading-tight">
              <p className="text-base font-bold text-neutral-950">CATCHAM</p>
              <p className="text-[11px] text-neutral-500">Agency portal</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-neutral-950">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Use the account issued by your agency administrator.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            <Input
              label="Work email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="officer@agency.gov.ng"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <InlineError error={error} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              disabled={email.length === 0 || password.length === 0}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-xs text-neutral-500 space-y-2">
            <p>
              Not an officer?{' '}
              <Link href="/report" className="text-brand-600 font-medium hover:underline">
                Submit a report
              </Link>{' '}
              or{' '}
              <Link href="/track" className="text-brand-600 font-medium hover:underline">
                track an existing one
              </Link>
              .
            </p>
            <p>
              Signing in creates an audit record that includes your address and
              browser.
            </p>
          </div>
        </div>
      </div>

      {/* Right: context panel, hidden on small screens where it would just push
          the form down. */}
      <div className="hidden lg:flex flex-col justify-center bg-neutral-900 text-neutral-200 px-14 py-16">
        <ShieldCheck className="w-10 h-10 text-brand-400 mb-7" />
        <h2 className="text-2xl font-semibold text-neutral-white leading-snug max-w-md">
          Reports, cases and evidence, with the trail intact.
        </h2>
        <ul className="mt-8 space-y-4 text-sm text-neutral-400 max-w-md">
          <li className="flex gap-3">
            <span className="text-brand-400 font-mono text-xs pt-0.5 shrink-0">01</span>
            <span>
              Reports route to the owning agency by category and jurisdiction, and the
              routing decision is recorded on the report timeline.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand-400 font-mono text-xs pt-0.5 shrink-0">02</span>
            <span>
              Case progression follows a workflow definition held in the database, with
              each transition gated on a permission.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand-400 font-mono text-xs pt-0.5 shrink-0">03</span>
            <span>
              Every evidence file is hashed at intake and its custody entries are
              hash-chained, so an altered record fails verification.
            </span>
          </li>
        </ul>
      </div>
    </main>
  );
}
