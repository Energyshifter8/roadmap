'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BookOpen, Menu, X } from 'lucide-react';
import type { RoadmapTabId } from './RoadmapTabs';
import LocaleSwitcher from './LocaleSwitcher';

const TAB_IDS: RoadmapTabId[] = ['frontend', 'backend', 'devops', 'mobile'];

interface NavbarProps {
  activeTab: RoadmapTabId;
  onTabChange: (tab: RoadmapTabId) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const t = useTranslations('tabs');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
        {/* Left tabs */}
        <div className="hidden sm:flex items-center gap-2">
          {TAB_IDS.slice(0, 2).map((id) => {
            const isActive = id === activeTab;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`
                  border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  font-bold rounded-xl px-5 py-2 transition-all text-sm
                  active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  ${isActive
                    ? 'bg-[#ffd000] text-zinc-900'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                {t(id)}
              </button>
            );
          })}
        </div>

        {/* Centered logo */}
        <Link href="/" className="flex items-center justify-center gap-2 shrink-0">
          <BookOpen className="h-6 w-6 text-zinc-900" />
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            devdreams
          </span>
          </Link>

        {/* Right tabs */}
        <div className="hidden sm:flex items-center justify-end gap-2">
          {TAB_IDS.slice(2).map((id) => {
            const isActive = id === activeTab;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`
                  border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  font-bold rounded-xl px-5 py-2 transition-all text-sm
                  active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  ${isActive
                    ? 'bg-[#ffd000] text-zinc-900'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                {t(id)}
              </button>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto sm:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 pb-4 pt-2 sm:hidden">
          {TAB_IDS.map((id) => {
            const isActive = id === activeTab;
            return (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full text-left border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  font-bold rounded-xl px-5 py-2.5 transition-all text-sm mb-2
                  ${isActive
                    ? 'bg-[#ffd000] text-zinc-900'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                {t(id)}
              </button>
            );
          })}
        </div>
      )}

      <LocaleSwitcher />
    </nav>
  );
}
