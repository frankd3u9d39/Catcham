'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Lock, Shield, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineError } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/providers/auth-provider';

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading registration..." />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login, register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When registration completes, redirect to the user dashboard's report submission page
  const next = searchParams.get('next') ?? '/dashboard?tab=submit';

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
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: phoneNumber.trim() || undefined,
      });

      router.replace(next);
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Quick 1-click test with pre-seeded citizen account
  async function useQuickCitizenAccount() {
    setIsSubmitting(true);
    try {
      await login('citizen@catcham.local', 'ChangeMe123!');
      router.replace(next);
    } catch (caught) {
      setError(caught);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
      {/* Left Column: Registration Form */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Brand Emblem */}
          <div className="flex items-center gap-2.5 mb-6">
            <Image src="/logo.png" alt="CATCHAM" width={36} height={36} className="rounded" />
            <div className="leading-tight">
              <p className="text-base font-bold text-neutral-950 font-serif">CATCH-AM</p>
              <p className="text-[11px] text-emerald-700 font-semibold font-mono">
                Citizen Complainant Registration
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-neutral-950">Create Citizen Account</h1>
          <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
            Register to submit encrypted incident reports, track investigative progress in real-time, and protect national public safety.
          </p>

          {/* 1-Click Demo Shortcut */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instant Demo Citizen Account</span>
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Pre-configured with sample complaints and tracking tokens.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={useQuickCitizenAccount}
                isLoading={isSubmitting}
                className="text-xs font-bold shrink-0 bg-emerald-700 hover:bg-emerald-800"
              >
                1-Click Sign In
              </Button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
            <Input
              label="Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tariq Mohammed"
            />

            <Input
              label="Email Address"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. tariq@example.com"
            />

            <Input
              label="Password (min 12 chars: uppercase, lowercase, digit)"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 800 000 0000"
            />

            <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Whistleblower Privacy Standard:</strong> You can choose to file reports anonymously at any time. Your personal account metadata is never disclosed to external parties.
              </span>
            </div>

            <InlineError error={error} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={isSubmitting}
              disabled={fullName.length === 0 || email.length === 0 || password.length === 0}
            >
              Complete Registration & Go to Dashboard
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-neutral-200 text-xs text-neutral-500 text-center">
            <span>Already have an account? </span>
            <Link href="/login" className="text-emerald-700 font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Information Panel */}
      <div className="hidden lg:flex flex-col justify-center bg-neutral-900 text-neutral-200 px-14 py-16 border-l border-neutral-800">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mb-6" />
        <h2 className="text-2xl font-bold font-serif text-white leading-snug max-w-md">
          Sovereign Citizen Protection & Real-Time Tracking.
        </h2>
        <p className="mt-3 text-sm text-neutral-400 max-w-md leading-relaxed">
          The CATCH-AM platform gives citizens a secure, accountable window into multi-agency investigations.
        </p>

        <ul className="mt-8 space-y-5 text-sm text-neutral-300 max-w-md">
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">01</span>
            <div>
              <p className="font-semibold text-white">Direct Complaint Tracking</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Watch your complaint progress through the 8-stage intelligence lifecycle from intake to resolution.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">02</span>
            <div>
              <p className="font-semibold text-white">Multi-Agency Accountability</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Reports are routed to verified enforcement authorities (EFCC, NOSDRA, Police, Customs) with an immutable audit trail.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-mono text-xs pt-0.5 shrink-0 font-bold">03</span>
            <div>
              <p className="font-semibold text-white">Cryptographic Whistleblower Security</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every attached image, video, and document is hashed with SHA-256 at ingest to protect evidence integrity.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
