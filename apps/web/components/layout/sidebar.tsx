'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ShieldCheck,
  Building2,
  MapPin,
  GitBranch,
  Sliders,
  BarChart3,
  FileStack,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainNav: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { label: 'Reports Ledger', href: '/reports', icon: <FileText className="w-5 h-5 shrink-0" />, badge: '12' },
    { label: 'Investigations', href: '/investigations', icon: <Briefcase className="w-5 h-5 shrink-0" /> },
    { label: 'Evidence Vault', href: '/evidence', icon: <ShieldCheck className="w-5 h-5 shrink-0" /> },
  ];

  const adminNav: NavItem[] = [
    { label: 'Organizations', href: '/organizations', icon: <Building2 className="w-5 h-5 shrink-0" /> },
    { label: 'Jurisdictions', href: '/jurisdictions', icon: <MapPin className="w-5 h-5 shrink-0" /> },
    { label: 'Workflows', href: '/workflows', icon: <GitBranch className="w-5 h-5 shrink-0" /> },
    { label: 'Business Rules', href: '/rules', icon: <Sliders className="w-5 h-5 shrink-0" /> },
  ];

  const oversightNav: NavItem[] = [
    { label: 'Analytics & SLAs', href: '/analytics', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
    { label: 'Audit Trail', href: '/audit', icon: <FileStack className="w-5 h-5 shrink-0" /> },
    { label: 'Personnel', href: '/users', icon: <Users className="w-5 h-5 shrink-0" /> },
    { label: 'System Settings', href: '/settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group select-none relative',
              isActive
                ? 'bg-brand-600/15 text-neutral-white font-semibold'
                : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-white'
            )}
            title={collapsed ? item.label : undefined}
          >
            {/* Active Left Indicator */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full" />
            )}
            <span className={cn(isActive ? 'text-brand-500' : 'text-neutral-400 group-hover:text-neutral-200')}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className="truncate flex-1">{item.label}</span>
            )}
            {!collapsed && item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-600 text-neutral-white">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-neutral-950 text-neutral-white flex flex-col justify-between border-r border-neutral-800 transition-all duration-200 z-40',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Header / Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
          {!collapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="DICON Logo"
                className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-neutral-700 shadow-xs"
              />
              <div>
                <span className="font-bold tracking-tight text-neutral-white text-base">CATCHAM</span>
                <span className="block text-[10px] text-brand-400 font-semibold tracking-wider uppercase">
                  Nigeria Sovereign
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="mx-auto">
              <img
                src="/logo.png"
                alt="DICON Logo"
                className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-neutral-700 shadow-xs"
              />
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {renderSection('Workspaces', mainNav)}
          {renderSection('Governance', adminNav)}
          {renderSection('Oversight', oversightNav)}
        </div>
      </div>

      {/* Footer Profile / Logout */}
      <div className="p-3 border-t border-neutral-800">
        <Link
          href="/login"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-white hover:bg-neutral-800/60 transition-colors',
            collapsed && 'justify-center'
          )}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 shrink-0 text-neutral-400" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
};
