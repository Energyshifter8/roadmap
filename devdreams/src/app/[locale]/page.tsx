'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const RoadmapCanvas = dynamic(() => import('@/components/RoadmapCanvas'), { ssr: false });

const TABS = ['frontend', 'backend', 'devops', 'mobile'] as const;
type Tab = typeof TABS[number];

export default function Home() {
  const t = useTranslations('tabs');
  const [activeTab, setActiveTab] = useState<Tab>('frontend');

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex gap-1 p-3 border-b border-zinc-800 bg-black sticky top-0 z-10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'bg-white text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </nav>
      <div className="flex-1">
        {activeTab === 'frontend' && <RoadmapCanvas />}
        {activeTab !== 'frontend' && (
          <div className="flex items-center justify-center h-[80vh] text-zinc-600 font-mono text-sm">
            {t(activeTab)} — coming soon
          </div>
        )}
      </div>
    </main>
  );
}
