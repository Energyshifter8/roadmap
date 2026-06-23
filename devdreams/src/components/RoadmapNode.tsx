'use client';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const styles: Record<string, string> = {
  root:         'bg-white text-black font-bold text-sm px-4 py-2 rounded-md border-2 border-white shadow-lg',
  section:      'bg-zinc-800 text-white font-semibold text-xs px-3 py-2 rounded border border-zinc-500',
  topic:        'bg-zinc-900 text-zinc-300 text-xs px-3 py-1.5 rounded border border-zinc-700 cursor-pointer hover:border-zinc-400 transition-colors',
  recommended:  'bg-zinc-900 text-green-400 text-xs px-3 py-1.5 rounded border border-green-600 cursor-pointer hover:border-green-400 transition-colors',
  optional:     'bg-zinc-900 text-zinc-500 text-xs px-3 py-1.5 rounded border border-dashed border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors',
};

export default function RoadmapNode({ data }: NodeProps) {
  const nodeData = data as { label: string; level: string };
  return (
    <div className={styles[nodeData.level] ?? styles.topic}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-600 !w-1.5 !h-1.5 !border-0" />
      <span>{nodeData.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-600 !w-1.5 !h-1.5 !border-0" />
    </div>
  );
}
