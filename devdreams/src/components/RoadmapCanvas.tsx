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
        type="button"
        data-node-id={node.id}
        onClick={() => {
          onSelect(node);
          onToggle(node.id);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          background: done ? "rgba(255,208,0,0.1)" : "transparent",
          color: done ? "#FFD000" : "#71717a",
          border: done
            ? "1px solid rgba(255,208,0,0.2)"
            : "1px solid rgba(255,255,255,0.04)",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          transition: "all 0.15s",
        }}
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
      style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: 12,
        minWidth: 200,
      }}
    >
      <div className="flex flex-col gap-2">
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
          // biome-ignore lint/style/noNonNullAssertion: safe
          id: el.dataset.nodeId!,
          d: `M ${centerRight} ${centerY} C ${cp1x} ${centerY}, ${cp2x} ${topicY}, ${topicLeft} ${topicY}`,
        });
      } else if (topicRight < btnRect.left - cRect.left) {
        const dx = topicRight - centerLeft;
        const cp1x = centerLeft + dx * 0.4;
        const cp2x = centerLeft + dx * 0.6;
        branches.push({
          // biome-ignore lint/style/noNonNullAssertion: safe
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
        <div
          className="italic text-sm px-4 py-2 border border-dashed rounded-lg whitespace-normal break-words"
          style={{ color: "#52525b", borderColor: "rgba(255,255,255,0.08)" }}
        >
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
        role="img"
        aria-label="Roadmap Connections"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: "visible" }}
      >
        {paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke="rgba(255,208,0,0.3)"
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
            type="button"
            onClick={() => onToggle(section.node.id)}
            style={{
              padding: "8px 22px",
              borderRadius: 6,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              background: done ? "#FFD000" : "#18181b",
              color: done ? "#0f0f0f" : "#71717a",
              border: done ? "none" : "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              boxShadow: done ? "0 0 24px rgba(255,208,0,0.2)" : "none",
              transition: "all 0.15s",
            }}
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
    <div
      className="min-h-screen"
      style={{ background: "#0f0f0f", paddingTop: 52 }}
    >
      <div className="max-w-5xl mx-auto relative px-4">
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
          style={{ background: "#27272a", width: 1 }}
        />

        <div className="flex justify-center mb-24 relative z-10">
          <div
            style={{
              background: "#FFD000",
              border: "none",
              padding: "10px 32px",
              boxShadow: "0 0 60px rgba(255,208,0,0.2)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: "#0f0f0f",
              }}
            >
              {tTabs(tab)}
            </h1>
          </div>
        </div>

        <div className="flex justify-center relative z-10">
          <div
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "20px 32px",
              textAlign: "center",
              maxWidth: 400,
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#71717a",
                fontStyle: "italic",
              }}
            >
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
    console.log("[onSelect] node.id:", node.id, "| titleKey:", node.titleKey);
    setSelectedTopic({
      id: node.titleKey,
      title,
      description: node.description,
      links: node.links ?? [],
    });
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    const docId = selectedTopic.id;
    console.log("[RoadmapDetails] Fetching doc:", docId);
    setDetailLoading(true);
    const ref = doc(db, "roadmap_details", docId);
    getDoc(ref)
      .then((snap) => {
        console.log("[RoadmapDetails] snap.exists():", snap.exists());
        if (snap.exists()) {
          const data = snap.data();
          console.log(
            "[RoadmapDetails] raw doc data:",
            JSON.stringify(data, null, 2),
          );
          console.log("[RoadmapDetails] description:", data.description);
          console.log("[RoadmapDetails] resources:", data.resources);
          setSelectedTopic((prev) => {
            console.log(
              "[RoadmapDetails] prev state:",
              prev?.id,
              prev?.description?.slice(0, 50),
            );
            if (!prev) return prev;
            const next = {
              ...prev,
              description: data.description ?? prev.description,
              links:
                data.resources?.map((r: { title: string; url: string }) => ({
                  title: r.title,
                  url: r.url,
                })) ?? prev.links,
            };
            console.log(
              "[RoadmapDetails] next description:",
              next.description?.slice(0, 50),
            );
            return next;
          });
        }
      })
      .catch((err) => console.error("[RoadmapDetails] fetch error:", err))
      .finally(() => {
        console.log("[RoadmapDetails] done loading");
        setDetailLoading(false);
      });
  }, [selectedTopic]);

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
        const secs: RoadmapSection[] = data.sections ?? [];
        const lm: Record<string, string> = data.labelMap ?? {};
        setSections(secs);
        setLabelMap(lm);
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0f0f0f" }}
      >
        <div className="text-zinc-400 font-mono text-sm animate-pulse">
          Loading roadmap...
        </div>
      </div>
    );

  const headerTitle =
    labelMap[type] ??
    `${type.charAt(0).toUpperCase() + type.slice(1)} Developer`;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0f0f0f", paddingTop: 52 }}
    >
      <div className="max-w-5xl mx-auto relative px-4">
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
          style={{ background: "#27272a", width: 1 }}
        />

        <div className="flex justify-center mb-24 relative z-10">
          <div
            style={{
              background: "#FFD000",
              border: "none",
              padding: "10px 32px",
              boxShadow: "0 0 60px rgba(255,208,0,0.2)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.1em",
                color: "#0f0f0f",
              }}
            >
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
        direction="right"
      >
        <DrawerContent
          className="bg-[#141414]"
          style={{ borderLeft: "1px solid rgba(255,208,0,0.3)" }}
        >
          <DrawerHeader>
            <DrawerTitle
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#f4f4f5",
              }}
            >
              {selectedTopic?.title}
            </DrawerTitle>
            {selectedTopic?.description && (
              <DrawerDescription
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#71717a",
                  lineHeight: 1.7,
                }}
              >
                {selectedTopic.description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          {selectedTopic?.links && selectedTopic.links.length > 0 && (
            <div className="px-4 pb-4">
              <h3
                className="font-bold text-sm uppercase tracking-wide mb-3"
                style={{ color: "#52525b" }}
              >
                Resources
              </h3>
              <ul className="space-y-2">
                {selectedTopic.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        borderRadius: 8,
                        background: "rgba(255,208,0,0.06)",
                        border: "1px solid rgba(255,208,0,0.15)",
                        color: "#FFD000",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
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
              <p className="italic text-sm" style={{ color: "#52525b" }}>
                Loading details...
              </p>
            </div>
          ) : (
            !selectedTopic?.description &&
            (!selectedTopic?.links || selectedTopic.links.length === 0) && (
              <div className="px-4 pb-4">
                <p className="italic text-sm" style={{ color: "#52525b" }}>
                  No additional details available for this topic.
                </p>
              </div>
            )
          )}

          <DrawerFooter>
            <DrawerClose
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#71717a",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
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
