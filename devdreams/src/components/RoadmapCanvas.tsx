'use client';
import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import RoadmapNode from './RoadmapNode';
import SidePanel from './SidePanel';
import { RoadmapType } from '@/lib/roadmapSources';
import { useTranslations } from 'next-intl';

const nodeTypes = { roadmapNode: RoadmapNode };

type Props = { type: RoadmapType };

export default function RoadmapCanvas({ type }: Props) {
  const t = useTranslations('ui');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<{ label: string; level: string; description?: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { isLoading, isError } = useQuery({
    queryKey: ['roadmap', type],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap/${type}`);
      if (!res.ok) throw new Error('fetch failed');
      const raw = await res.json();

      const mapped = (raw.nodes ?? []).map((n: any) => ({
        id: n.id,
        position: n.position ?? { x: 0, y: 0 },
        type: 'roadmapNode',
        data: {
          label: n.data?.label ?? n.id,
          level: n.data?.style ?? 'topic',
          description: n.data?.description ?? '',
        },
      }));

      const mappedEdges = (raw.edges ?? []).map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        style: { stroke: '#52525b', strokeWidth: 1.5 },
      }));

      setNodes(mapped);
      setEdges(mappedEdges);
      return { nodes: mapped, edges: mappedEdges };
    },
  });

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node.data as { label: string; level: string; description?: string });
    setPanelOpen(true);
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
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
          fitViewOptions={{ padding: 0.15 }}
          defaultEdgeOptions={{ style: { stroke: '#52525b', strokeWidth: 1.5 } }}
        >
          <Background color="#27272a" gap={24} />
          <Controls className="!bg-zinc-900 !border-zinc-700" />
          <MiniMap nodeColor="#3f3f46" maskColor="rgba(0,0,0,0.8)" className="!bg-zinc-900 !border-zinc-700" />
        </ReactFlow>
      </div>
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} node={selectedNode} />
    </>
  );
}
