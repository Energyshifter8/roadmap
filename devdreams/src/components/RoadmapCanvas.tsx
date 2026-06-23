'use client';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { frontendNodes, frontendEdges } from '@/data/frontendRoadmap';
import RoadmapNode from './RoadmapNode';

const nodeTypes = { roadmapNode: RoadmapNode };

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { strokeWidth: 2, stroke: '#52525b' },
};

export default function RoadmapCanvas() {
  const [nodes, , onNodesChange] = useNodesState(frontendNodes);
  const [edges, , onEdgesChange] = useEdgesState(frontendEdges);

  return (
    <div style={{ width: '100%', height: '100vh' }} className="bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode="loose"
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!bg-zinc-900 !border-zinc-700 !text-white" />
        <MiniMap nodeColor="#52525b" maskColor="rgba(0,0,0,0.7)" className="!bg-zinc-900 !border-zinc-700" />
      </ReactFlow>
    </div>
  );
}
