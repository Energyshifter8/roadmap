'use server';
import { ROADMAP_URLS, RoadmapType } from '@/lib/roadmapSources';
import { Node, Edge } from '@xyflow/react';

export type RoadmapNode = Node<{ label: string; level: string; description?: string }>;

export async function fetchRoadmapData(type: RoadmapType): Promise<{ nodes: RoadmapNode[]; edges: Edge[] }> {
  const url = ROADMAP_URLS[type];
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch roadmap');
  const raw = await res.json();

  // roadmap.sh JSON structure: nodes array with id, position, data
  // Transform to ReactFlow-compatible format
  const nodes: RoadmapNode[] = (raw.nodes ?? []).map((n: any) => ({
    id: n.id,
    position: n.position ?? { x: 0, y: 0 },
    type: 'roadmapNode',
    data: {
      label: n.data?.label ?? n.id,
      level: n.data?.style ?? 'topic',
      description: n.data?.description ?? '',
    },
  }));

  const edges: Edge[] = (raw.edges ?? []).map((e: any) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    style: { stroke: '#52525b', strokeWidth: 1.5 },
  }));

  return { nodes, edges };
}
