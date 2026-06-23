import { Handle, Position } from '@xyflow/react';

const levelStyles: Record<string, string> = {
  root: 'bg-zinc-800 text-white font-bold text-sm px-4 py-2 rounded shadow-lg border border-zinc-600',
  section: 'bg-zinc-700 text-zinc-100 font-semibold text-xs px-3 py-2 rounded shadow border border-zinc-500',
  topic: 'bg-zinc-900 text-zinc-300 text-xs px-3 py-1.5 rounded border border-zinc-700',
  recommended: 'bg-zinc-900 text-green-400 text-xs px-3 py-1.5 rounded border border-green-500',
};

export default function RoadmapNode({ data, xPos }: { data: { label: string; level: string }; xPos: number }) {
  const isCenter = xPos === 450 || data.level === 'root' || data.level === 'section';
  const isLeft = xPos === 150;
  const isRight = xPos === 750;

  return (
    <div className={levelStyles[data.level] ?? levelStyles.topic}>
      {isCenter && (
        <>
          <Handle type="target" position={Position.Top} id="top" className="!bg-zinc-500 !w-1.5 !h-1.5" />
          <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-zinc-500 !w-1.5 !h-1.5" />
          <Handle type="source" position={Position.Left} id="left" className="!bg-zinc-500 !w-1.5 !h-1.5" />
          <Handle type="source" position={Position.Right} id="right" className="!bg-zinc-500 !w-1.5 !h-1.5" />
        </>
      )}

      {isLeft && (
        <Handle type="target" position={Position.Right} id="left-target" className="!bg-zinc-500 !w-1.5 !h-1.5" />
      )}

      {isRight && (
        <Handle type="target" position={Position.Left} id="right-target" className="!bg-zinc-500 !w-1.5 !h-1.5" />
      )}

      <span>{data.label}</span>
    </div>
  );
}
