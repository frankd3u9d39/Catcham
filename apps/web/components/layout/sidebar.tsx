'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileStack,
  FileText,
  GitBranch,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  Sliders,
  Users,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Hidden unless the caller holds this permission. */
  permission?: string;
}

const ICON = 'w-5 h-5 shrink-0';

const SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Casework',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className={ICON} /> },
      {
        label: 'Reports',
        href: '/reports',
        icon: <FileText className={ICON} />,
        permission: 'report:read',
      },
      {
        label: 'Investigations',
        href: '/investigations',
        icon: <Briefcase className={ICON} />,
        permission: 'investigation:read',
      },
      {
        label: 'Evidence vault',
        href: '/evidence',
        icon: <ShieldCheck className={ICON} />,
        permission: 'evidence:read',
      },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        label: 'Organizations',
        href: '/organizations',
        icon: <Building2 className={ICON} />,
        permission: 'organization:read',
      },
      {
        label: 'Jurisdictions',
        href: '/jurisdictions',
        icon: <MapPin className={ICON} />,
        permission: 'organization:read',
      },
      {
        label: 'Workflows',
        href: '/workflows',
        icon: <GitBranch className={ICON} />,
        permission: 'workflow:manage',
      },
      {
        label: 'Business rules',
        href: '/rules',
        icon: <Sliders className={ICON} />,
        permission: 'rule:manage',
      },
    ],
  },
  {
    title: 'Oversight',
    items: [
      {
        label: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className={ICON} />,
        permission: 'analytics:read',
      },
      {
        label: 'Activity log',
        href: '/audit',
        icon: <FileStack className={ICON} />,
        permission: 'audit:read',
      },
      {
        label: 'Personnel',
        href: '/users',
        icon: <Users className={ICON} />,
        permission: 'user:read',
      },
    ],
  },
  {
    title: 'You',
    items: [
      { label: 'Notifications', href: '/notifications', icon: <Bell className={ICON} /> },
      { label: 'Settings', href: '/settings', icon: <Settings className={ICON} /> },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { can, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // A link the caller cannot use is hidden rather than shown and then refused.
  // The API enforces the same permissions, so this is navigation, not security.
  const sections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((section) => section.items.length > 0);

  const nav = (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full bg-white p-0.5 border border-neutral-700 shrink-0"
            />
            <span className="font-bold tracking-tight text-neutral-white text-base truncate">
              CATCHAM
            </span>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <Image
              src="/logo.png"
              alt="CATCHAM"
              width={32}
              height={32}
              className="rounded-full bg-white p-0.5 border border-neutral-700"
            />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-md text-neutral-400 hover:text-neutral-200"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-3 space-y-5 overflow-y-auto flex-1">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative',
                    isActive
                      ? 'bg-brand-600/15 text-neutral-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-white',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full" />
                  )}
                  <span
                    className={cn(
                      isActive ? 'text-brand-500' : 'text-neutral-400 group-hover:text-neutral-200',
                    )}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-neutral-800">
        <button
          type="button"
          onClick={() => void logout()}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-white hover:bg-neutral-800/60 transition-colors',
            collapsed && 'justify-center',
          )}
          title="Sign out"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Off-canvas trigger, shown only below the lg breakpoint. */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-neutral-900 text-neutral-white shadow-lg flex items-center justify-center"
        aria-label="Open navigation"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-neutral-950/60"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'bg-neutral-950 text-neutral-white flex flex-col border-r border-neutral-800 z-50',
          'fixed inset-y-0 left-0 w-64 transition-transform lg:transition-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
        )}
      >
        {nav}
      </aside>
    </>
  );
};
