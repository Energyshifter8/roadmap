'use client';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const styles: Record<string, string> = {
  root:
    'bg-amber-300 text-black font-bold text-base px-6 py-3 rounded-lg border-2 border-amber-400 ' +
    'shadow-[0_0_16px_rgba(234,179,8,0.18)] text-center',
  section:
    'bg-amber-300 text-black font-semibold text-sm px-5 py-2 rounded-lg border border-amber-400 ' +
    'shadow-[0_0_10px_rgba(234,179,8,0.1)] text-center',
  topic:
    'bg-zinc-900/80 text-zinc-200 text-xs px-3.5 py-2 rounded-lg border border-zinc-700/80 ' +
    'hover:border-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer select-none text-center',
  recommended:
    'bg-zinc-900/80 text-amber-300 text-xs px-3.5 py-2 rounded-lg border border-amber-600/50 font-medium ' +
    'hover:border-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer select-none text-center',
  optional:
    'bg-zinc-900/40 text-zinc-500 text-xs px-3.5 py-2 rounded-lg border border-dashed border-zinc-700 ' +
    'hover:border-zinc-500 hover:text-zinc-400 transition-colors cursor-pointer select-none text-center',
  note:
    'bg-zinc-900/30 text-zinc-500 text-xs px-4 py-2 rounded-lg border border-zinc-800 italic select-none text-center',
};

export default function RoadmapNode({ data }: NodeProps) {
  const d = data as { label: string; level: string };
  const style = styles[d.level] ?? styles.topic;

  return (
    <div className={style} style={{ minWidth: 120, maxWidth: 260 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <span className="leading-tight block">{d.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  );
}
