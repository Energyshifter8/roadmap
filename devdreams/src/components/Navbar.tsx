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
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: 52,
      background: '#18181b',
      borderBottom: '1px solid #3f3f46',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{
          fontFamily: 'monospace',
          fontWeight: 800,
          fontSize: 15,
          color: '#f5a623',
          letterSpacing: 1,
        }}>
          devdreams
        </span>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: activeTab === key ? 700 : 400,
                background: activeTab === key ? '#f5a623' : 'transparent',
                color: activeTab === key ? '#000' : '#a1a1aa',
                border: activeTab === key ? '1px solid #d4861a' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <span>{icon}</span>
              <span>{t(key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lang switch */}
      <button
        onClick={switchLocale}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          background: 'transparent',
          color: '#a1a1aa',
          border: '1px solid #3f3f46',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        <span>{locale === 'mn' ? '🇲🇳' : '🇬🇧'}</span>
        <span>{locale === 'mn' ? tLang('en') : tLang('mn')}</span>
      </button>
    </nav>
  );
}
