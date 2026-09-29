'use client';
import React from 'react';
import Link from 'next/link';
import { Search, Bell, Shield, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-neutral-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Organization Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
          <Shield className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Agency Scope:</span>
          <strong className="text-neutral-900 font-semibold">EFCC Headquarters (Abuja)</strong>
        </div>
        <Badge status="success">Operational</Badge>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Search trigger */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-colors"
          onClick={() => {}}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search cases or references...</span>
          <kbd className="font-mono text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">⌘K</kbd>
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard"
          className="relative p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-neutral-white" />
        </Link>

        {/* User Avatar & Context */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-semibold text-xs">
            OA
          </div>
          <div className="text-left text-xs hidden sm:block">
            <p className="font-semibold text-neutral-900 leading-tight">Oladipo Adeleke</p>
            <p className="text-[11px] text-neutral-500">Lead Investigator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
