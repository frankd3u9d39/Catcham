'use client';
import React from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Breadcrumbs, BreadcrumbItem } from './breadcrumbs';

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const AppShell: React.FC<AppShellProps> = ({ children, breadcrumbs }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sovereign Left Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main id="main-content" className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {children}
        </main>
      </div>
    </div>
  );
};
