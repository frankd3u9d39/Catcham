import React from 'react';
import './globals.css';

export const metadata = {
  title: 'CATCHAM | Sovereign Whistleblowing & Case Management',
  description: 'Nigerian Multi-Agency Incident Reporting & Investigation Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-neutral-50 text-neutral-950 font-sans min-h-screen antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
