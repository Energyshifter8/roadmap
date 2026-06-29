"use client";
import { doc, getDoc } from "firebase/firestore";

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
          color: done ? "#FFD000" : "#a1a1aa",
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
        padding: 10,
        minWidth: 0,
        width: "100%",
        maxWidth: 260,
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

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-6 sm:gap-x-16 md:gap-x-24">
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
              color: done ? "#0f0f0f" : "#d4d4d8",
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


function MilestoneHeader({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div className="flex justify-center mb-12 mt-8 relative z-10">
      <div
        className="flex items-center gap-3"
        style={{
          background: "rgba(255,208,0,0.06)",
          border: "1px solid rgba(255,208,0,0.15)",
          borderRadius: 8,
          padding: "8px 20px",
        }}
      >
        <span
          className="font-bold shrink-0"
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            color: "#FFD000",
            letterSpacing: "0.12em",
          }}
        >
          MILESTONE {number}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#e4e4e7",
          }}
        >
          {title}
        </span>
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
  const [milestoneTitles, setMilestoneTitles] = useState<
    Record<number, string> | undefined
  >(undefined);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const labelMapRef = useRef(labelMap);
  const roadmapRef = useRef<HTMLDivElement>(null);
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
          milestoneTitles?: Record<number, string>;
        }>;
      })
      .then((data) => {
        if (cancelled) return;
        const secs: RoadmapSection[] = data.sections ?? [];
        const lm: Record<string, string> = data.labelMap ?? {};
        setSections(secs);
        setLabelMap(lm);
        setMilestoneTitles(data.milestoneTitles as Record<number, string> | undefined);
        setLoadingData(false);
      })
      .catch(() => {
        if (!cancelled) setLoadingData(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  useEffect(() => {
    if (loadingData || sections.length === 0 || !roadmapRef.current) return;
    const el = roadmapRef.current;
    const scrollContainer = el.closest<HTMLElement>('[data-roadmap-scroll]');
    if (!scrollContainer) return;
    const spineLine = scrollContainer.querySelector<HTMLElement>(
      '[data-roadmap-spine]',
    );
    if (spineLine) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const spineRect = spineLine.getBoundingClientRect();
      scrollContainer.scrollLeft =
        spineRect.left -
        containerRect.left -
        containerRect.width / 2 +
        spineRect.width / 2;
    }
  }, [loadingData, sections]);

  if (loadingData)
    return (
      <div
        className="flex-1 flex items-center justify-center"
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
    <div className="flex-1 pt-[52px] min-w-0" style={{ background: "#0f0f0f" }}>
      <div
        data-roadmap-scroll
        className="w-full overflow-x-auto overflow-y-hidden scrollbar-thin"
      >
      <div className="max-w-5xl mx-auto relative px-3 sm:px-6 min-[320px]:min-w-[800px]">
        <div
          data-roadmap-spine
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

        {sections.reduce<React.ReactNode[]>(
          (acc, sec, idx) => {
            const prev = idx > 0 ? sections[idx - 1] : undefined;
            const ms = sec.milestone;
            const prevMs = prev?.milestone;
            if (
              ms !== undefined &&
              milestoneTitles?.[ms] &&
              ms !== prevMs
            ) {
              acc.push(
                <MilestoneHeader
                  key={`ms-${ms}`}
                  number={ms}
                  title={milestoneTitles[ms]}
                />,
              );
            }
            acc.push(
              <SectionRow
                key={sec.node.id}
                section={sec}
                completed={completed}
                onToggle={toggle}
                onSelect={onSelect}
                labelMap={labelMap}
              />,
            );
            return acc;
          },
          [],
        )}
      </div>
      </div>

      <Drawer
        open={selectedTopic !== null}
        onOpenChange={(open) => !open && setSelectedTopic(null)}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent
          className={
            isMobile ? "h-[70vh] rounded-t-2xl border-t" : ""
          }
          style={{
            background: "#141414",
            borderLeft: isMobile ? "none" : "1px solid rgba(255,208,0,0.2)",
            display: "flex",
            flexDirection: "column",
            maxWidth: isMobile ? "100vw" : "min(400px, 100vw)",
            height: isMobile ? "70vh" : "100dvh",
            top: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <DrawerTitle
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#f4f4f5",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {selectedTopic?.title}
              </DrawerTitle>
              <DrawerClose
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  color: "#71717a",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ✕
              </DrawerClose>
            </div>
          </div>

          {/* Scrollable body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Description */}
            {selectedTopic?.description ? (
              <div>
                <p
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#3f3f46",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Тайлбар
                </p>
                <DrawerDescription
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#a1a1aa",
                    lineHeight: 1.75,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTopic.description}
                </DrawerDescription>
              </div>
            ) : (
              !detailLoading && (
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#52525b",
                    fontStyle: "italic",
                  }}
                >
                  Энэ сэдвийн тайлбар удахгүй нэмэгдэнэ.
                </p>
              )
            )}

            {/* Resources */}
            {selectedTopic?.links && selectedTopic.links.length > 0 && (
              <div>
                <p
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#3f3f46",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Эх сурвалж
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {selectedTopic.links.map((link, i) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 14px",
                        borderRadius: 8,
                        background: "rgba(255,208,0,0.04)",
                        border: "1px solid rgba(255,208,0,0.12)",
                        color: "#e4c200",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.15s",
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,208,0,0.08)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,208,0,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,208,0,0.04)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,208,0,0.12)";
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,208,0,0.1)",
                          borderRadius: 4,
                          fontSize: 10,
                          color: "#FFD000",
                          fontFamily: "'Geist Mono', monospace",
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ flex: 1 }}>{link.title}</span>
                      <span
                        style={{
                          flexShrink: 0,
                          color: "#52525b",
                          fontSize: 12,
                        }}
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {detailLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#52525b",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#FFD000",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                Ачааллаж байна...
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <a
              href="https://roadmap.sh"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10,
                color: "#3f3f46",
                textDecoration: "none",
                letterSpacing: "0.05em",
              }}
            >
              powered by roadmap.sh →
            </a>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface RoadmapCanvasProps {
  activeTab: RoadmapTabId;
}

export default function RoadmapCanvas({ activeTab }: RoadmapCanvasProps) {
  return <RoadmapContent type={activeTab} />;
}
