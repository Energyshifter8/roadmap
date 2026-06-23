"use client";
import { Handle, Position, NodeProps } from "@xyflow/react";

const styles: Record<string, string> = {
  root: "bg-amber-300 text-black font-bold text-sm px-6 py-2.5 rounded border-2 border-amber-400 shadow-lg min-w-[180px] text-center",
  section:
    "bg-amber-300 text-black font-semibold text-sm px-5 py-2 rounded border border-amber-400 min-w-[160px] text-center",
  topic:
    "bg-amber-100 text-zinc-800 text-xs px-4 py-2 rounded border border-amber-300 cursor-pointer hover:border-amber-500 transition-colors min-w-[140px] text-center",
  recommended:
    "bg-amber-100 text-zinc-800 text-xs px-4 py-2 rounded border border-amber-300 cursor-pointer hover:border-amber-500 transition-colors min-w-[140px] text-center",
  optional:
    "bg-zinc-100 text-zinc-600 text-xs px-4 py-2 rounded border border-dashed border-zinc-400 cursor-pointer hover:border-zinc-600 transition-colors min-w-[140px] text-center",
  note: "bg-zinc-100 text-zinc-600 text-xs px-4 py-2 rounded border border-zinc-300 min-w-[160px] text-center italic",
};

export default function RoadmapNode({ data }: NodeProps) {
  const d = data as { label: string; level: string };
  return (
    <div className={styles[d.level] ?? styles.topic}>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <span>{d.label}</span>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}
