import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, EyeOff, FileSearch, Lock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Report an incident',
  description:
    'Report corruption, financial crime, pipeline offences, environmental harm and public safety threats to the responsible Nigerian agency.',
};

const CHANNELS = [
  {
    href: '/report',
    icon: EyeOff,
    title: 'Report anonymously',
    body: 'No account and no contact details. You receive a reference number and a one-time tracking code.',
    cta: 'Start a report',
    primary: true,
  },
  {
    href: '/track',
    icon: FileSearch,
    title: 'Track a report',
    body: 'Enter your reference number and tracking code to see what has happened since you submitted it.',
    cta: 'Check status',
    primary: false,
  },
];

const ASSURANCES = [
  {
    icon: Lock,
    title: 'Anonymous means anonymous',
    body: 'An anonymous report stores no name, email or phone number. The tracking code is hashed, so not even an administrator can read it back — keep your copy.',
  },
  {
    icon: MapPin,
    title: 'Routed to the right agency',
    body: 'The category and location you give determine which agency receives the report. You can see which one on the tracking page.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-neutral-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image src="/logo.png" alt="" width={30} height={30} className="rounded shrink-0" />
            <span className="font-bold text-neutral-950 truncate">CATCHAM</span>
          </div>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors shrink-0"
          >
            Agency sign in
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 pb-10 sm:pt-20">
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-950 leading-tight max-w-2xl">
            Report an incident to the agency responsible for it.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Corruption, financial crime, narcotics, pipeline and power offences,
            environmental harm, unsafe products and public safety threats. Submitting
            takes a few minutes and you do not need an account.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((channel) => (
              <Link
                key={channel.href}
                href={channel.href}
                className={`group rounded-xl border p-5 sm:p-6 transition-colors ${
                  channel.primary
                    ? 'border-brand-200 bg-brand-50/60 hover:border-brand-400'
                    : 'border-neutral-200 bg-neutral-white hover:border-neutral-300'
                }`}
              >
                <channel.icon
                  className={`w-6 h-6 mb-4 ${channel.primary ? 'text-brand-600' : 'text-neutral-500'}`}
                />
                <h2 className="text-base font-semibold text-neutral-950">{channel.title}</h2>
                <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{channel.body}</p>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
                    channel.primary ? 'text-brand-700' : 'text-neutral-700'
                  }`}
                >
                  {channel.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-white">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-2">
            {ASSURANCES.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-500 h-fit shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-500">
          <p>
            In immediate danger? Contact the emergency services directly rather than
            filing a report here.
          </p>
          <Link href="/login" className="hover:text-neutral-800 transition-colors">
            Agency sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
