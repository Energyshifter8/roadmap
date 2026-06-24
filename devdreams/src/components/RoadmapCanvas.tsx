'use client';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { frontendSections, type RoadmapNode } from '@/data/frontendRoadmap';
import LocaleSwitcher from './LocaleSwitcher';
import RoadmapTabs, { type RoadmapTabId } from './RoadmapTabs';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface BranchPath {
  id: string;
  d: string;
}

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
  const label = t.has(node.id) ? t(node.id) : node.label;

  return (
    <div className="relative group">
      <button
        data-node-id={node.id}
        onClick={() => onToggle(node.id)}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-bold border-2 border-black
          rounded-md w-full text-left transition-all cursor-pointer
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
        <span className="truncate">{label}</span>
      </button>

      {/* Description tooltip */}
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
/*  GroupBox — vertical list of topics with left accent                */
/* ------------------------------------------------------------------ */

interface GroupBoxProps {
  items: RoadmapNode[];
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
}

const GroupBox = memo(function GroupBox({ items, completed, onToggle }: GroupBoxProps) {
  return (
    <div className="bg-white border-2 border-zinc-900 rounded-xl p-3
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
  section: typeof frontendSections[number];
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
}

function SectionRow({ section, completed, onToggle }: SectionRowProps) {
  const t = useTranslations('roadmap');
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<BranchPath[]>([]);

  /* Measure every topic button and draw branching SVG paths */
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
        /* Topic is to the right of center — smooth S-curve */
        const dx = topicLeft - centerRight;
        const cp1x = centerRight + dx * 0.4;
        const cp2x = centerRight + dx * 0.6;
        branches.push({
          id: el.dataset.nodeId!,
          d: `M ${centerRight} ${centerY} C ${cp1x} ${centerY}, ${cp2x} ${topicY}, ${topicLeft} ${topicY}`,
        });
      } else if (topicRight < btnRect.left - cRect.left) {
        /* Topic is to the left of center — smooth S-curve */
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

  /* ---- Note row ---- */
  if (section.node.level === 'note') {
    return (
      <div className="flex justify-center mb-16 relative z-10">
        <div className="text-zinc-400 italic text-sm px-4 py-2 border border-dashed border-zinc-300 rounded-lg">
          {t.has(section.node.id) ? t(section.node.id) : section.node.label}
        </div>
      </div>
    );
  }

  const hasLeft = section.left.length > 0;
  const hasRight = section.right.length > 0;
  const done = !!completed[section.node.id];

  return (
    <div ref={containerRef} className="mb-24 relative">
      {/* SVG branching connector overlay */}
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

      {/* 3-column grid */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-24">
        {/* Left column */}
        <div className="flex justify-end">
          {hasLeft && (
            <GroupBox items={section.left} completed={completed} onToggle={onToggle} />
          )}
        </div>

        {/* Center column */}
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
            <span className="font-bold text-sm whitespace-nowrap">
              {t.has(section.node.id) ? t(section.node.id) : section.node.label}
            </span>
          </button>
        </div>

        {/* Right column */}
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

const STORAGE_KEY = 'devdreams-completed';

const ROADMAP_TABS: { id: RoadmapTabId; disabled?: boolean }[] = [
  { id: 'frontend' },
  { id: 'backend', disabled: true },
  { id: 'devops', disabled: true },
  { id: 'mobile', disabled: true },
];

export default function RoadmapCanvas() {
  const [activeTab, setActiveTab] = useState<RoadmapTabId>('frontend');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  /* Hydrate from localStorage after mount (client only) */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch { /* ignore corrupted data */ }
    setHydrated(true);
  }, []);

  /* Persist to localStorage on every change after hydration */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch { /* quota exceeded, silently ignore */ }
  }, [completed, hydrated]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const t = useTranslations('roadmap');
  const title = t.has('title') ? t('title') : 'Frontend Developer';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <div className="max-w-5xl mx-auto relative px-4">
        {/* Vertical spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900
          -translate-x-1/2 pointer-events-none"
        />

        {/* Roadmap tabs */}
        <RoadmapTabs
          tabs={ROADMAP_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Root header */}
        <div className="flex justify-center mb-24 relative z-10">
          <div className="bg-[#ffd000] border-2 border-zinc-900 px-10 py-3.5
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h1 className="font-extrabold text-lg uppercase tracking-wide text-zinc-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Sections */}
        {frontendSections.map((sec) => (
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
