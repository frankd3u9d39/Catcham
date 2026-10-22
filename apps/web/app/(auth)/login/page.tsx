'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, UserCheck } from 'lucide-react';
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
          <div className="flex items-center gap-2.5 mb-6">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded" />
            <div className="leading-tight">
              <p className="text-base font-bold text-neutral-950 font-serif">CATCH-AM</p>
              <p className="text-[11px] text-emerald-700 font-semibold font-mono">Unified Access Portal</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-neutral-950">Sign In to Platform</h1>
          <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
            One secure login for both <strong>Citizen Complainants</strong> and <strong>Agency Law Enforcement Officers</strong>.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="citizen@catcham.local or officer@agency.gov.ng"
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
              className="w-full shadow-md"
              isLoading={isSubmitting}
              disabled={email.length === 0 || password.length === 0}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Citizen Access</span>
              </p>
              <p className="text-[11px] text-emerald-700">Explore citizen complainant portal</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  await login('citizen@catcham.local', 'ChangeMe123!');
                  router.replace(next);
                } catch (c) {
                  setError(c);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              isLoading={isSubmitting}
              className="text-xs font-bold shrink-0 bg-emerald-700 hover:bg-emerald-800"
            >
              1-Click Sign In
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-neutral-600">
            <span>New user? </span>
            <Link href="/register" className="text-emerald-700 font-bold hover:underline">
              Register Citizen Account
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-200 text-xs text-neutral-500 space-y-2">
            <p>
              Need to submit a quick report anonymously?{' '}
              <Link href="/report" className="text-emerald-700 font-semibold hover:underline">
                Submit a Report
              </Link>{' '}
              or{' '}
              <Link href="/track" className="text-emerald-700 font-semibold hover:underline">
                Track by Reference Code
              </Link>
              .
            </p>
            <p className="text-[11px] text-neutral-400">
              Authenticated sessions are cryptographically logged with tamper-evident audit hashing.
            </p>
          </div>
        </div>
      </div>

      {/* Right: context panel, hidden on small screens where it would just push
          the form down. */}
      <div className="hidden lg:flex flex-col justify-center bg-neutral-900 text-neutral-200 px-14 py-16">
        <ShieldCheck className="w-10 h-10 text-emerald-400 mb-7" />
        <h2 className="text-2xl font-bold font-serif text-white leading-snug max-w-md">
          One Platform. Unified Intelligence & Citizen Oversight.
        </h2>
        <ul className="mt-8 space-y-5 text-sm text-neutral-300 max-w-md">
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">01</span>
            <div>
              <p className="font-semibold text-white">For Citizens & Complainants</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Monitor your complaints from initial intake through multi-agency investigation to final resolution with real-time milestones.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">02</span>
            <div>
              <p className="font-semibold text-white">For Law Enforcement & Agencies</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Intake officers, investigators, and supervisors collaborate across EFCC, NOSDRA, Police, and Customs on linked intelligence.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">03</span>
            <div>
              <p className="font-semibold text-white">Cryptographic Whistleblower Protection</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Evidence custody records are hash-chained and submitter identities are protected under sovereign DICON/CATCH-AM authority.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
