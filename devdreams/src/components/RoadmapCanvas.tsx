'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { frontendSections, type RoadmapNode } from '@/data/frontendRoadmap';
import LocaleSwitcher from './LocaleSwitcher';

function TopicTag({
  node,
  done,
  onToggle,
}: {
  node: RoadmapNode;
  done: boolean;
  onToggle: (id: string) => void;
}) {
  const t = useTranslations('roadmap');
  const label = t.has(node.id) ? t(node.id) : node.label;

  return (
    <button
      onClick={() => onToggle(node.id)}
      className={`
        flex items-center gap-2 px-3 py-1.5 text-xs font-bold border-2 border-black rounded-md w-full text-left
        transition-all cursor-pointer
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
      ) : null}
      <span className="truncate">{label}</span>
    </button>
  );
}

function GroupBox({
  items,
  completed,
  onToggle,
}: {
  items: RoadmapNode[];
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="bg-white border-2 border-zinc-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative min-w-[200px]">
      <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-zinc-300" />
      <div className="flex flex-col gap-2 pl-8">
        {items.map((item) => (
          <TopicTag key={item.id} node={item} done={completed.has(item.id)} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export default function RoadmapCanvas() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const t = useTranslations('roadmap');

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const title = t.has('title') ? t('title') : 'Frontend Developer';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <div className="max-w-5xl mx-auto relative px-4">
        {/* Vertical spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900 -translate-x-1/2 pointer-events-none" />

        {/* Root header */}
        <div className="flex justify-center mb-24 relative z-10">
          <div className="bg-[#ffd000] border-2 border-zinc-900 px-10 py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="font-extrabold text-lg uppercase tracking-wide text-zinc-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Sections */}
        {frontendSections.map((sec) => {
          const hasLeft = sec.left.length > 0;
          const hasRight = sec.right.length > 0;
          const completedMain = completed.has(sec.node.id);

          if (sec.node.level === 'note') {
            return (
              <div key={sec.node.id} className="flex justify-center mb-20 relative z-10">
                <div className="text-zinc-400 italic text-sm px-4 py-2 border border-dashed border-zinc-300 rounded-lg">
                  {t.has(sec.node.id) ? t(sec.node.id) : sec.node.label}
                </div>
              </div>
            );
          }

          return (
            <div key={sec.node.id} className="mb-20 relative">
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
                {/* Left column */}
                <div className="flex justify-end">
                  {hasLeft && (
                    <div className="flex items-center gap-3">
                      <GroupBox items={sec.left} completed={completed} onToggle={toggle} />
                      <div className="w-6 border-t-2 border-dashed border-blue-500 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Center column */}
                <div className="relative z-10 flex justify-center">
                  <button
                    onClick={() => toggle(sec.node.id)}
                    className={`
                      px-6 py-2.5
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                      hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      transition-all cursor-pointer text-center
                      border-2
                      ${completedMain
                        ? 'bg-[#ffd000] border-zinc-900 text-zinc-900'
                        : 'bg-white border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                      }
                    `}
                  >
                    <span className="font-bold text-sm whitespace-nowrap">
                      {t.has(sec.node.id) ? t(sec.node.id) : sec.node.label}
                    </span>
                  </button>
                </div>

                {/* Right column */}
                <div className="flex justify-start">
                  {hasRight && (
                    <div className="flex items-center gap-3">
                      <div className="w-6 border-t-2 border-dashed border-blue-500 shrink-0" />
                      <GroupBox items={sec.right} completed={completed} onToggle={toggle} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <LocaleSwitcher />
    </div>
  );
}
