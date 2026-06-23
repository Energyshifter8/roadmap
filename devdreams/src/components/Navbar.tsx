'use client';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { RoadmapType, TABS } from '@/lib/roadmapSources';

type Props = {
  activeTab: RoadmapType;
  onTabChange: (t: RoadmapType) => void;
};

export default function Navbar({ activeTab, onTabChange }: Props) {
  const t = useTranslations('tabs');
  const params = useParams();
  const currentLocale = params?.locale as string;
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    window.location.href = segments.join('/');
  };

  return (
    <nav className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-black sticky top-0 z-10">
      <div className="flex gap-1">
        {TABS.map(({ key }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === key
                ? 'bg-white text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
      <button
        onClick={() => handleLanguageChange(currentLocale === 'mn' ? 'en' : 'mn')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        {currentLocale === 'mn' ? (
          <span>MN</span>
        ) : (
          <span>EN</span>
        )}
      </button>
    </nav>
  );
}
