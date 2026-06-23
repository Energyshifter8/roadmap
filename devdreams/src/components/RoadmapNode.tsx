'use client';
import { Handle, Position } from '@xyflow/react';

const levelStyles: Record<string, string> = {
  root: 'bg-white text-black font-bold text-sm px-4 py-2 rounded border-2 border-white',
  section: 'bg-zinc-800 text-white font-semibold text-xs px-3 py-1.5 rounded border border-zinc-500',
  topic: 'bg-zinc-900 text-zinc-300 text-xs px-3 py-1.5 rounded border border-zinc-700',
  recommended: 'bg-zinc-900 text-green-400 text-xs px-3 py-1.5 rounded border border-green-500',
};

export default function RoadmapNode({ data }: { data: { label: string; level: string } }) {
  return (
    <div className={levelStyles[data.level] ?? levelStyles.topic}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-1.5 !h-1.5" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-1.5 !h-1.5" />
    </div>
  );
}
