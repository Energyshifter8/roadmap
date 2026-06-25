"use client";
import { doc, getDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { RoadmapNode, RoadmapSection } from "@/data/frontendRoadmap";
import { db } from "@/lib/firebase";
import type { RoadmapTabId } from "./RoadmapTabs";

interface BranchPath {
  id: string;
  d: string;
}

interface TopicDetail {
  id: string;
  title: string;
  description?: string;
  links: Array<{ title: string; url: string }>;
}

const STORAGE_KEY = "devdreams-completed";

interface TopicTagProps {
  node: RoadmapNode;
  done: boolean;
  onToggle: (id: string) => void;
  onSelect: (node: RoadmapNode) => void;
  labelMap: Record<string, string>;
}

const TopicTag = memo(function TopicTag({
  node,
  done,
  onToggle,
  onSelect,
  labelMap,
}: TopicTagProps) {
  const t = (key: string) => labelMap?.[key] ?? key.replace(/-/g, " ");

  return (
    <div className="relative group">
      <button
        data-node-id={node.id}
        onClick={() => {
          onSelect(node);
          onToggle(node.id);
        }}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-bold border-2 border-black
          rounded-md w-full text-left whitespace-normal break-words transition-all cursor-pointer
          ${
            done
              ? "bg-[#f3e8ff] text-black"
              : "bg-[#f1f3f5] text-zinc-700 hover:bg-[#e9ecef]"
          }
        `}
      >
        {done ? (
          <span className="text-purple-600 font-bold text-sm leading-none shrink-0">
            ✓
          </span>
        ) : node.level === "recommended" ? (
          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
        ) : node.level === "optional" ? (
          <span className="w-2 h-2 rounded-full border-2 border-zinc-400 shrink-0" />
        ) : null}
        <span className="whitespace-normal break-words">
          {t(node.titleKey)}
        </span>
      </button>

      {node.description && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
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

interface GroupBoxProps {
  items: RoadmapNode[];
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (node: RoadmapNode) => void;
  labelMap: Record<string, string>;
}

const GroupBox = memo(function GroupBox({
  items,
  completed,
  onToggle,
  onSelect,
  labelMap,
}: GroupBoxProps) {
  return (
    <div
      className="bg-white border-2 border-zinc-900 rounded-xl p-3 w-full
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
            onSelect={onSelect}
            labelMap={labelMap}
          />
        ))}
      </div>
    </div>
  );
});

interface SectionRowProps {
  section: RoadmapSection;
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (node: RoadmapNode) => void;
  labelMap: Record<string, string>;
}

function SectionRow({
  section,
  completed,
  onToggle,
  onSelect,
  labelMap,
}: SectionRowProps) {
  const t = (key: string) => labelMap?.[key] ?? key.replace(/-/g, " ");
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

    c.querySelectorAll<HTMLElement>("[data-node-id]").forEach((el) => {
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
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  if (section.node.level === "note") {
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
        style={{ overflow: "visible" }}
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
            <GroupBox
              items={section.left}
              completed={completed}
              onToggle={onToggle}
              onSelect={onSelect}
              labelMap={labelMap}
            />
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
              ${
                done
                  ? "bg-[#ffd000] border-zinc-900 text-zinc-900"
                  : "bg-white border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
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
            <GroupBox
              items={section.right}
              completed={completed}
              onToggle={onToggle}
              onSelect={onSelect}
              labelMap={labelMap}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ComingSoonPlaceholder({ tab }: { tab: RoadmapTabId }) {
  const tRoadmap = useTranslations("roadmap");
  const tTabs = useTranslations("tabs");

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <div className="max-w-5xl mx-auto relative px-4">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900
          -translate-x-1/2 pointer-events-none"
        />

        <div className="flex justify-center mb-24 relative z-10">
          <div
            className="bg-[#ffd000] border-2 border-zinc-900 px-10 py-3.5
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h1 className="font-extrabold text-lg uppercase tracking-wide text-zinc-900">
              {tTabs(tab)}
            </h1>
          </div>
        </div>

        <div className="flex justify-center relative z-10">
          <div
            className="bg-white border-2 border-zinc-900 rounded-xl px-10 py-6
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center max-w-md"
          >
            <p className="text-zinc-500 text-sm italic">
              {tRoadmap("coming-soon")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapContent({ type }: { type: RoadmapTabId }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
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
    } catch {
      /* quota exceeded */
    }
  }, [completed]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const [sections, setSections] = useState<RoadmapSection[]>([]);
  const [labelMap, setLabelMap] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const labelMapRef = useRef(labelMap);
  useEffect(() => {
    labelMapRef.current = labelMap;
  }, [labelMap]);

  const onSelect = useCallback((node: RoadmapNode) => {
    const title =
      labelMapRef.current[node.titleKey] ?? node.titleKey.replace(/-/g, " ");
    setSelectedTopic({
      id: node.id,
      title,
      description: node.description,
      links: node.links ?? [],
    });
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    setDetailLoading(true);
    const ref = doc(db, "roadmap_details", selectedTopic.id.toLowerCase());
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSelectedTopic((prev) =>
            prev
              ? {
                  ...prev,
                  description: data.description ?? prev.description,
                  links:
                    data.resources?.map(
                      (r: { title: string; url: string }) => ({
                        title: r.title,
                        url: r.url,
                      }),
                    ) ?? prev.links,
                }
              : prev,
          );
        }
      })
      .catch((err) => console.error("Failed to fetch roadmap details:", err))
      .finally(() => setDetailLoading(false));
  }, [selectedTopic?.id, selectedTopic]);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/roadmap/${type}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<{
          sections: RoadmapSection[];
          labelMap: Record<string, string>;
        }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.sections.length > 0) {
          setSections(data.sections);
          setLabelMap(data.labelMap);
        }
        setLoadingData(false);
      })
      .catch(() => {
        if (!cancelled) setLoadingData(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  if (loadingData)
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-zinc-400 font-mono text-sm animate-pulse">
          Loading roadmap...
        </div>
      </div>
    );

  const headerTitle =
    labelMap[type] ??
    `${type.charAt(0).toUpperCase() + type.slice(1)} Developer`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <div className="max-w-5xl mx-auto relative px-4">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-900
          -translate-x-1/2 pointer-events-none"
        />

        <div className="flex justify-center mb-24 relative z-10">
          <div
            className="bg-[#ffd000] border-2 border-zinc-900 px-10 py-3.5
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
            onSelect={onSelect}
            labelMap={labelMap}
          />
        ))}
      </div>

      <Drawer
        open={selectedTopic !== null}
        onOpenChange={(open) => !open && setSelectedTopic(null)}
      >
        <DrawerContent className="border-t-4 border-black bg-white shadow-[0_-8px_0_0_rgba(0,0,0,1)]">
          <DrawerHeader>
            <DrawerTitle className="font-extrabold text-xl uppercase tracking-wide">
              {selectedTopic?.title}
            </DrawerTitle>
            {selectedTopic?.description && (
              <DrawerDescription className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedTopic.description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          {selectedTopic?.links && selectedTopic.links.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="font-bold text-sm uppercase tracking-wide text-zinc-500 mb-3">
                Resources
              </h3>
              <ul className="space-y-2">
                {selectedTopic.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 border-2 border-black bg-[#ffd000] font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all break-words"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailLoading ? (
            <div className="px-4 pb-4">
              <p className="text-zinc-400 italic text-sm">Loading details...</p>
            </div>
          ) : (
            !selectedTopic?.description &&
            (!selectedTopic?.links || selectedTopic.links.length === 0) && (
              <div className="px-4 pb-4">
                <p className="text-zinc-400 italic text-sm">
                  No additional details available for this topic.
                </p>
              </div>
            )
          )}

          <DrawerFooter>
            <DrawerClose className="w-full border-2 border-black bg-white font-bold text-sm py-2.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface RoadmapCanvasProps {
  activeTab: RoadmapTabId;
}

export default function RoadmapCanvas({ activeTab }: RoadmapCanvasProps) {
  if (activeTab !== "frontend") {
    return <ComingSoonPlaceholder tab={activeTab} />;
  }

  return <RoadmapContent type={activeTab} />;
}
