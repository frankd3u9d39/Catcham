import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center text-xs text-neutral-500 mb-4 select-none">
    <Link href="/dashboard" className="text-neutral-400 hover:text-neutral-700 transition-colors">
      <Home className="w-3.5 h-3.5" />
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ChevronRight className="w-3 h-3 text-neutral-300 mx-2 shrink-0" />
        {item.href ? (
          <Link href={item.href} className="hover:text-neutral-900 transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-neutral-900 font-medium">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
