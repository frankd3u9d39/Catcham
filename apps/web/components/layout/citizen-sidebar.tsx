'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileSearch,
  FileText,
  Home,
  Laptop,
  Lock,
  LogOut,
  Radio,
  RotateCcw,
  Shield,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

interface CitizenSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  complaintCount?: number;
  onToggleOfficerMode?: () => void;
  isOfficer?: boolean;
}

const ICON = 'w-5 h-5 shrink-0';

export const CitizenSidebar: React.FC<CitizenSidebarProps> = ({
  activeTab = 'overview',
  onTabChange,
  complaintCount = 3,
  onToggleOfficerMode,
  isOfficer = false,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      group: 'Overview',
      items: [
        {
          id: 'overview',
          label: 'Dashboard Overview',
          icon: <Home className={ICON} />,
          href: '/dashboard',
        },
      ],
    },
    {
      group: 'My Cases & Reports',
      items: [
        {
          id: 'complaints',
          label: 'My Complaints',
          icon: <FileText className={ICON} />,
          badge: complaintCount > 0 ? complaintCount.toString() : undefined,
          href: '/dashboard?tab=complaints',
        },
        {
          id: 'track',
          label: 'Track Complaint',
          icon: <FileSearch className={ICON} />,
          href: '/dashboard?tab=track',
        },
        {
          id: 'submit',
          label: 'Submit New Report',
          icon: <FilePlus className={ICON} />,
          href: '/dashboard?tab=submit',
          isExternal: false,
        },
      ],
    },
    {
      group: 'Public Safety & Privacy',
      items: [
        {
          id: 'alerts',
          label: 'Safety Bulletins',
          icon: <Radio className={ICON} />,
          href: '/dashboard?tab=alerts',
        },
        {
          id: 'privacy',
          label: 'Whistleblower Vault',
          icon: <Shield className={ICON} />,
          href: '/dashboard?tab=privacy',
        },
      ],
    },
    {
      group: 'Subscriber Benefits',
      items: [
        {
          id: 'credicorp',
          label: 'CREDICORP C.L.I.C.K.D',
          icon: <Laptop className={ICON} />,
          badge: 'FG PARTNER',
          href: '/dashboard?tab=credicorp',
        },
      ],
    },
    {
      group: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Complainant Profile',
          icon: <User className={ICON} />,
          href: '/dashboard?tab=profile',
        },
      ],
    },
  ];

  const handleItemClick = (item: { id: string; href: string; isExternal?: boolean }) => {
    setMobileOpen(false);
    if (!item.isExternal && onTabChange) {
      onTabChange(item.id);
    }
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt="CATCHAM"
              width={32}
              height={32}
              className="rounded-full bg-white p-0.5 border border-neutral-700 shrink-0"
            />
            <div className="min-w-0">
              <span className="font-bold tracking-tight text-white text-sm block truncate">
                CATCH-AM
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 block -mt-0.5">
                CITIZEN PORTAL
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <Image
              src="/logo.png"
              alt="CATCHAM"
              width={32}
              height={32}
              className="rounded-full bg-white p-0.5 border border-neutral-700 shrink-0"
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

      {/* Security Status Ribbon */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/20 px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-emerald-300 truncate">
                Encrypted Session
              </p>
              <p className="text-[9px] text-emerald-500/80 uppercase font-mono">
                Anonymity Shield Active
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="p-3 space-y-5 overflow-y-auto flex-1">
        {navItems.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = activeTab === item.id;

              if (item.isExternal) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-neutral-300 hover:bg-neutral-800 hover:text-white',
                      collapsed && 'justify-center px-2',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
                    collapsed && 'justify-center px-2',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono',
                            isActive ? 'bg-white text-emerald-800' : 'bg-neutral-800 text-neutral-300',
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Switch to Officer Mode (if user has permissions) */}
      {isOfficer && (
        <div className="p-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onToggleOfficerMode}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors',
              collapsed && 'justify-center px-2',
            )}
            title="Switch to Agency Command View"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span className="truncate">Switch to Officer View</span>}
          </button>
        </div>
      )}

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/60">
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed ? (
            <div className="min-w-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-200 shrink-0">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.fullName?.split(' ')[0] ?? 'Citizen'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate font-mono">
                  {user?.email ?? 'Verified Submitter'}
                </p>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void logout()}
            className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-30 lg:hidden p-3 bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center border border-emerald-500/40"
        aria-label="Open citizen navigation"
      >
        <Shield className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-neutral-900 border-r border-neutral-800 shrink-0 transition-[width] duration-200 relative z-20',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {navContent}
      </aside>
    </>
  );
};
