'use client';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { RoadmapType, TABS } from '@/lib/roadmapSources';

type Props = {
  activeTab: RoadmapType;
  onTabChange: (t: RoadmapType) => void;
  locale: string;
};

export default function Navbar({ activeTab, onTabChange, locale }: Props) {
  const t = useTranslations('tabs');
  const tLang = useTranslations('lang');
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const next = locale === 'mn' ? 'en' : 'mn';
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <nav className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-black sticky top-0 z-10">
      <div className="flex gap-1">
        {TABS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === key
                ? 'bg-white text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <span>{icon}</span>
            <span>{t(key)}</span>
          </button>
        ))}
      </div>
      <button
        onClick={switchLocale}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <span>{locale === 'mn' ? '🇲🇳' : '🇬🇧'}</span>
        <span>{locale === 'mn' ? tLang('en') : tLang('mn')}</span>
      </button>
    </nav>
  );
}
