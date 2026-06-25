'use client';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { frontendSections, type RoadmapNode, type RoadmapSection } from '@/data/frontendRoadmap';
import LocaleSwitcher from './LocaleSwitcher';
import { useActiveTab } from './AppShell';
import type { RoadmapTabId } from './RoadmapTabs';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface BranchPath {
  id: string;
  d: string;
}

/* ------------------------------------------------------------------ */
/*  Stub data for non-frontend roadmaps                                */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'devdreams-completed';

function stubSection(id: string, titleKey: string, parentId: string, level: 'section' | 'note' = 'section'): RoadmapSection {
  return {
    node: { id, titleKey, level, parentId },
    left: [],
    right: [],
  };
}

const backendSections: RoadmapSection[] = [
  stubSection('backend-root', 'backend', 'root'),
  stubSection('backend-note', 'coming-soon', 'backend-root', 'note'),
];

const devopsSections: RoadmapSection[] = [
  stubSection('devops-root', 'devops', 'root'),
  stubSection('devops-note', 'coming-soon', 'devops-root', 'note'),
];

const mobileSections: RoadmapSection[] = [
  stubSection('mobile-root', 'mobile', 'root'),
  stubSection('mobile-note', 'coming-soon', 'mobile-root', 'note'),
];

const sectionsByTab: Record<RoadmapTabId, RoadmapSection[]> = {
  frontend: frontendSections,
  backend: backendSections,
  devops: devopsSections,
  mobile: mobileSections,
};

/* ------------------------------------------------------------------ */
/*  TopicTag — single clickable topic                                 */
/* ------------------------------------------------------------------ */

interface TopicTagProps {
  node: RoadmapNode;
  done: boolean;
  onToggle: (id: string) => void;
}

const TopicTag = memo(function TopicTag({ node, done, onToggle }: TopicTagProps) {
  const t = useTranslations('roadmap');

  return (
    <div className="relative group">
      <button
        data-node-id={node.id}
        onClick={() => onToggle(node.id)}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-bold border-2 border-black
          rounded-md w-full text-left whitespace-normal break-words transition-all cursor-pointer
          ${done
            ? 'bg-[#f3e8ff] text-black'
            : 'bg-[#f1f3f5] text-zinc-700 hover:bg-[#e9ecef]'
          }
        `}
      >
        {done ? (
          <span className="text-purple-600 font-bold text-sm leading-none shrink-0">✓</span>
        ) : node.level === 'recommended' ? (
          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
        ) : node.level === 'optional' ? (
          <span className="w-2 h-2 rounded-full border-2 border-zinc-400 shrink-0" />
        ) : null}
        <span className="whitespace-normal break-words">{t(node.titleKey)}</span>
      </button>

      {node.description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
          bg-zinc-900 text-white text-xs rounded-lg shadow-xl
          whitespace-pre-wrap max-w-[280px] leading-relaxed
          opacity-0 group-hover:opacity-100 transition-opacity
          pointer-events-none z-50 hidden lg:block"
        >
          {node.description}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  GroupBox — vertical list of topics with left accent               */
/* ------------------------------------------------------------------ */

interface GroupBoxProps {
  items: RoadmapNode[];
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
}

const GroupBox = memo(function GroupBox({ items, completed, onToggle }: GroupBoxProps) {
  return (
    <div className="bg-white border-2 border-zinc-900 rounded-xl p-3 w-full
      shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative min-w-[200px]"
    >
      <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-zinc-300" />
      <div className="flex flex-col gap-2 pl-8">
        {items.map((item) => (
          <TopicTag
            key={item.id}
            node={item}
            done={!!completed[item.id]}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  SectionRow — one row of the roadmap (center + optional left/right) */
/* ------------------------------------------------------------------ */

interface SectionRowProps {
  section: RoadmapSection;
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
}

function SectionRow({ section, completed, onToggle }: SectionRowProps) {
  const t = useTranslations('roadmap');
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<BranchPath[]>([]);

  const measure = useCallback(() => {
    const c = containerRef.current;
    const btn = centerRef.current;
    if (!c || !btn) return;

    const cRect = c.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const centerY = btnRect.top + btnRect.height / 2 - cRect.top;
    const centerLeft = btnRect.left - cRect.left;
    const centerRight = btnRect.right - cRect.left;

    const branches: BranchPath[] = [];

    c.querySelectorAll<HTMLElement>('[data-node-id]').forEach((el) => {
      const tRect = el.getBoundingClientRect();
      const topicLeft = tRect.left - cRect.left;
      const topicRight = tRect.right - cRect.left;
      const topicY = tRect.top + tRect.height / 2 - cRect.top;

      if (topicLeft > btnRect.right - cRect.left) {
        const dx = topicLeft - centerRight;
        const cp1x = centerRight + dx * 0.4;
        const cp2x = centerRight + dx * 0.6;
        branches.push({
          id: el.dataset.nodeId!,
          d: `M ${centerRight} ${centerY} C ${cp1x} ${centerY}, ${cp2x} ${topicY}, ${topicLeft} ${topicY}`,
        });
      } else if (topicRight < btnRect.left - cRect.left) {
        const dx = topicRight - centerLeft;
        const cp1x = centerLeft + dx * 0.4;
        const cp2x = centerLeft + dx * 0.6;
        branches.push({
          id: el.dataset.nodeId!,
          d: `M ${centerLeft} ${centerY} C ${cp1x} ${centerY}, ${cp2x} ${topicY}, ${topicRight} ${topicY}`,
        });
      }
    });

    setPaths(branches);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  if (section.node.level === 'note') {
    return (
      <div className="flex justify-center mb-16 relative z-10">
        <div className="text-zinc-400 italic text-sm px-4 py-2 border border-dashed border-zinc-300 rounded-lg whitespace-normal break-words">
          {t(section.node.titleKey)}
        </div>
      </div>
    );
  }

  const hasLeft = section.left.length > 0;
  const hasRight = section.right.length > 0;
  const done = !!completed[section.node.id];

  return (
    <div ref={containerRef} className="mb-24 relative">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: 'visible' }}
      >
        {paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6,4"
          />
        ))}
      </svg>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-24">
        <div className="flex justify-end">
          {hasLeft && (
            <GroupBox items={section.left} completed={completed} onToggle={onToggle} />
          )}
        </div>

        <div ref={centerRef} className="relative z-10 flex justify-center">
          <button
            onClick={() => onToggle(section.node.id)}
            className={`
              px-6 py-2.5
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              transition-all cursor-pointer text-center border-2
              ${done
                ? 'bg-[#ffd000] border-zinc-900 text-zinc-900'
                : 'bg-white border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
              }
            `}
          >
            <span className="font-bold text-sm whitespace-normal break-words">
              {t(section.node.titleKey)}
            </span>
          </button>
        </div>

        <div className="flex justify-start">
          {hasRight && (
            <GroupBox items={section.right} completed={completed} onToggle={onToggle} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RoadmapCanvas — top-level component                                */
/* ------------------------------------------------------------------ */

export default function RoadmapCanvas() {
  const { activeTab } = useActiveTab();
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch { /* quota exceeded, silently ignore */ }
  }, [completed]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const tRoadmap = useTranslations('roadmap');
  const tTabs = useTranslations('tabs');
  const sections = sectionsByTab[activeTab];

  const headerTitle = activeTab === 'frontend'
    ? tRoadmap('title')
    : `${tTabs(activeTab)} ${tRoadmap('title').split(' ').pop() ?? ''}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <div className="max-w-5xl mx-auto relative px-4">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900
          -translate-x-1/2 pointer-events-none"
        />

        <div className="flex justify-center mb-24 relative z-10">
          <div className="bg-[#ffd000] border-2 border-zinc-900 px-10 py-3.5
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h1 className="font-extrabold text-lg uppercase tracking-wide text-zinc-900">
              {headerTitle}
            </h1>
          </div>
        </div>

        {sections.map((sec) => (
          <SectionRow
            key={sec.node.id}
            section={sec}
            completed={completed}
            onToggle={toggle}
          />
        ))}
      </div>

      <LocaleSwitcher />
    </div>
  );
}
