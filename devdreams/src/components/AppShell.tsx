'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RoadmapTabId } from './RoadmapTabs';
import Navbar from './Navbar';

interface AppShellContextValue {
  activeTab: RoadmapTabId;
  setActiveTab: (tab: RoadmapTabId) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useActiveTab() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useActiveTab must be used within AppShell');
  return ctx;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<RoadmapTabId>('frontend');

  return (
    <AppShellContext.Provider value={{ activeTab, setActiveTab }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="min-h-screen bg-white">{children}</main>
    </AppShellContext.Provider>
  );
}
