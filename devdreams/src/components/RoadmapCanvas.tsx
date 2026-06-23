'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  type NodeMouseHandler,
  type Node, type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import RoadmapNode from './RoadmapNode';
import SidePanel from './SidePanel';
import { RoadmapType } from '@/lib/roadmapSources';
import { useTranslations } from 'next-intl';

const nodeTypes = { roadmapNode: RoadmapNode };

// Map roadmap.sh node types → our level styles
function mapLevel(type: string, _style?: Record<string, string>): string {
  const t = type?.toLowerCase() ?? '';
  if (t === 'title') return 'root';
  if (t === 'topic') return 'section';
  if (t === 'subtopic') return 'topic';
  if (t === 'button') return 'recommended';
  if (t === 'label') return 'optional';
  if (t === 'paragraph' || t === 'legend') return 'note';
  return 'topic';
}

function transformRoadmapData(raw: any): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: any[] = raw?.nodes ?? [];
  const rawEdges: any[] = raw?.edges ?? [];

  const nodes: Node[] = rawNodes
    .filter((n: any) => {
      if (!n?.id || !n?.position) return false;
      // skip decorative / non-visual nodes
      const t = n.type ?? '';
      if (t === 'vertical') return false;
      if (t === 'legend') return false;
      if (t === 'paragraph' && !(n.data?.label ?? '').trim()) return false;
      return true;
    })
    .map((n: any) => ({
      id: String(n.id),
      type: 'roadmapNode',
      position: {
        x: Number(n.position?.x ?? 0),
        y: Number(n.position?.y ?? 0),
      },
      data: {
        label: n.data?.label ?? n.data?.text ?? String(n.id),
        level: mapLevel(n.type ?? '', n.style ?? {}),
        description: n.data?.description ?? '',
        nodeType: n.type ?? 'topic',
      },
      width: n.width,
      height: n.height,
    }));

  const edges: Edge[] = rawEdges
    .filter((e: any) => e?.id && e?.source && e?.target)
    .map((e: any) => {
      const s = e.style ?? {};
      return {
        id: String(e.id),
        source: String(e.source),
        target: String(e.target),
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        type: 'smoothstep',
        style: {
          stroke: s.stroke ?? '#3b82f6',
          strokeWidth: s.strokeWidth ?? 1.5,
          strokeDasharray: s.strokeDasharray,
          strokeLinecap: s.strokeLinecap,
        },
      };
    });

  return { nodes, edges };
}

type Props = { type: RoadmapType };

export default function RoadmapCanvas({ type }: Props) {
  const t = useTranslations('ui');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<{
    label: string; level: string; description?: string;
  } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['roadmap', type],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap/${type}`);
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!data) return;
    const { nodes: n, edges: e } = transformRoadmapData(data);
    setNodes(n);
    setEdges(e);
  }, [data, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    const d = node.data as { label: string; level: string; description?: string };
    if (!d.label) return;
    setSelectedNode(d);
    setPanelOpen(true);
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm animate-pulse">
      {t('loading')}
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-full text-red-500 font-mono text-sm">
      {t('error')}
    </div>
  );

  return (
    <>
      <div style={{ width: '100%', height: 'calc(100vh - 52px)' }} className="bg-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { stroke: '#3b82f6', strokeWidth: 1.5 },
          }}
        >
          <Background color="#27272a" gap={24} size={1} />
          <Controls className="!bg-zinc-900 !border-zinc-700 !text-white" />
          <MiniMap
            nodeColor={(n) => {
              const level = (n.data as any)?.level;
              if (level === 'section') return '#fbbf24';
              if (level === 'recommended') return '#4ade80';
              return '#52525b';
            }}
            maskColor="rgba(0,0,0,0.85)"
            className="!bg-zinc-900 !border-zinc-700"
          />
        </ReactFlow>
      </div>
      <SidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        node={selectedNode}
      />
    </>
  );
}
