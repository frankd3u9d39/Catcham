'use client';

import React, { useState, Suspense } from 'react';
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
  FilePlus,
  FileSearch,
  FileStack,
  FileText,
  GitBranch,
  Home,
  Laptop,
  LayoutDashboard,
  LogOut,
  MapPin,
  Radio,
  Settings,
  Shield,
  ShieldCheck,
  Sliders,
  User,
  Users,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  tabId?: string;
  icon: React.ReactNode;
  /** Hidden unless the caller holds this permission. */
  permission?: string;
  badge?: string;
}

const ICON = 'w-5 h-5 shrink-0';

const OFFICER_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
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

const CITIZEN_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'My Cases & Reports',
    items: [
      {
        label: 'Dashboard Overview',
        href: '/dashboard',
        icon: <Home className={ICON} />,
      },
      {
        label: 'My Complaints',
        href: '/complaints',
        icon: <FileText className={ICON} />,
      },
      {
        label: 'Track Complaint',
        href: '/track',
        icon: <FileSearch className={ICON} />,
      },
      {
        label: 'Submit New Report',
        href: '/report',
        icon: <FilePlus className={ICON} />,
      },
    ],
  },
  {
    title: 'Public Safety & Privacy',
    items: [
      {
        label: 'Safety Bulletins',
        href: '/alerts',
        icon: <Radio className={ICON} />,
      },
      {
        label: 'Whistleblower Vault',
        href: '/privacy',
        icon: <Shield className={ICON} />,
      },
    ],
  },
  {
    title: 'Subscriber Benefits',
    items: [
      {
        label: 'CREDICORP C.L.I.C.K.D',
        href: '/credicorp',
        badge: 'FG PARTNER',
        icon: <Laptop className={ICON} />,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Complainant Profile',
        href: '/profile',
        icon: <User className={ICON} />,
      },
      {
        label: 'Notifications',
        href: '/notifications',
        icon: <Bell className={ICON} />,
      },
      {
        label: 'Settings',
        href: '/settings',
        icon: <Settings className={ICON} />,
      },
    ],
  },
];

function isOfficerUser(user: any, can: (perm: string) => boolean): boolean {
  if (!user) return false;
  if (
    can('report:read') ||
    can('investigation:read') ||
    can('analytics:read') ||
    can('audit:read') ||
    can('user:read')
  ) {
    return true;
  }
  const officerRoles = ['ADMIN', 'SUPERVISOR', 'INVESTIGATOR', 'INTAKE_OFFICER', 'COMMANDER'];
  return Boolean(user.roleCodes?.some((r: string) => officerRoles.includes(r.toUpperCase())));
}

export const Sidebar: React.FC = () => {
  return (
    <Suspense fallback={<SidebarShell />}>
      <SidebarNavContent />
    </Suspense>
  );
};

function SidebarShell() {
  return (
    <aside className="bg-neutral-950 text-neutral-white flex flex-col border-r border-neutral-800 z-50 fixed inset-y-0 left-0 w-64 lg:sticky lg:top-0 lg:h-screen">
      <div className="h-16 flex items-center px-4 border-b border-neutral-800">
        <Image
          src="/logo.png"
          alt=""
          width={32}
          height={32}
          className="rounded-full bg-white p-0.5 border border-neutral-700 shrink-0"
        />
        <span className="font-bold tracking-tight text-neutral-white text-base ml-2.5 truncate">
          CATCHAM
        </span>
      </div>
    </aside>
  );
}

function SidebarNavContent() {
  const pathname = usePathname();
  const { user, can, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOfficer = isOfficerUser(user, can);

  const sections = isOfficer
    ? OFFICER_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.permission || can(item.permission)),
      })).filter((section) => section.items.length > 0)
    : CITIZEN_SECTIONS;

  const isItemActive = (item: NavItem) => {
    if (item.href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
  };

  const nav = (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full bg-white p-0.5 border border-neutral-700 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-bold tracking-tight text-neutral-white text-base block truncate">
                CATCHAM
              </span>
              {!isOfficer && (
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 block -mt-0.5">
                  CITIZEN PORTAL
                </span>
              )}
            </div>
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
          className="hidden lg:block p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-md text-neutral-400 hover:text-neutral-200 cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Security Status Ribbon for Citizens */}
      {!collapsed && !isOfficer && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          {/* <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-emerald-300 truncate">
                Encrypted Session
              </p>
              <p className="text-[9px] text-emerald-500/80 uppercase font-mono">
                Anonymity Shield Active
              </p>
            </div>
          </div> */}
        </div>
      )}

      <nav className="p-3 space-y-5 overflow-y-auto flex-1">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = isItemActive(item);

              return (
                <Link
                  key={item.href + (item.tabId ?? '')}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative',
                    isActive
                      ? 'bg-brand-600/15 text-neutral-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-white',
                    collapsed && 'justify-center px-2',
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
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider shrink-0',
                            isActive
                              ? 'bg-white text-emerald-900'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30',
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 shrink-0">
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <div className="min-w-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-200 shrink-0">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.fullName?.split(' ')[0] ?? (isOfficer ? 'Officer' : 'Citizen')}
                </p>
                <p className="text-[10px] text-neutral-400 truncate font-mono">
                  {user?.email ?? 'Verified Account'}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className={cn(
              'flex items-center gap-2 p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer',
              collapsed && 'p-2',
            )}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-xs text-neutral-400 hover:text-red-400">Sign out</span>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Off-canvas trigger, shown only below the lg breakpoint. */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-neutral-900 text-neutral-white shadow-lg flex items-center justify-center cursor-pointer border border-neutral-700"
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
}

