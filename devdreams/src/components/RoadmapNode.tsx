import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type RoadmapNodeData = {
  label: string;
  description: string;
};

export type RoadmapNodeType = Node<RoadmapNodeData, "stage">;

export default function RoadmapNode({ data }: NodeProps<RoadmapNodeType>) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white px-6 py-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <Handle type="target" position={Position.Top} />
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {data.label}
      </span>
      <span className="mt-1 max-w-48 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {data.description}
      </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
