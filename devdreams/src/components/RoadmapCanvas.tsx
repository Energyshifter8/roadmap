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

function mapLevel(type: string): string {
  const t = (type ?? '').toLowerCase();
  if (t === 'section' || t === 'group') return 'section';
  if (t === 'subtopic') return 'topic';
  return 'topic';
}

function transformRoadmapData(raw: any): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: any[] = raw?.nodes ?? [];
  const rawEdges: any[] = raw?.edges ?? [];

  const nodes: Node[] = rawNodes
    .filter((n: any) => n?.id && n?.position)
    .map((n: any) => ({
      id: String(n.id),
      type: 'roadmapNode',
      position: {
        x: Number(n.position?.x ?? 0) * 1.4,
        y: Number(n.position?.y ?? 0) * 1.4,
      },
      data: {
        label: n.data?.label ?? n.data?.text ?? String(n.id),
        level: mapLevel(n.type ?? ''),
        description: n.data?.description ?? '',
        nodeType: n.type ?? 'topic',
      },
    }));

  const edges: Edge[] = rawEdges
    .filter((e: any) => e?.id && e?.source && e?.target)
    .map((e: any) => ({
      id: String(e.id),
      source: String(e.source),
      target: String(e.target),
      type: 'smoothstep',
      style: {
        stroke: e.data?.isExternal ? '#6366f1' : '#3b82f6',
        strokeWidth: 2,
        strokeDasharray: e.data?.isExternal ? '6,4' : undefined,
      },
    }));

  return { nodes, edges };
}

type Props = { type: RoadmapType };

export default function RoadmapCanvas({ type }: Props) {
  const t = useTranslations('ui');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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
      <div style={{ width: '100%', height: 'calc(100vh - 52px)', background: '#0a0a0a' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.05}
          maxZoom={3}
          defaultEdgeOptions={{
            style: { stroke: '#3b82f6', strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#222" gap={32} size={1} />
          <Controls
            style={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
            }}
          />
          <MiniMap
            nodeColor={(n) => {
              const level = (n.data as any)?.level;
              if (level === 'section') return '#f5a623';
              return '#52525b';
            }}
            maskColor="rgba(0,0,0,0.88)"
            style={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
            }}
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
