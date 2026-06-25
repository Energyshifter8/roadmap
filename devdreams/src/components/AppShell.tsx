'use client';

import type { ReactNode } from 'react';
import Navbar from './Navbar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">{children}</main>
    </>
  );
}
