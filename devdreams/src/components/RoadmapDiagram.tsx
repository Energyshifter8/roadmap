"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import RoadmapNode from "./RoadmapNode";

const nodeTypes = { stage: RoadmapNode };

type Props = {
  nodes: Node[];
  edges: Edge[];
};

export default function RoadmapDiagram({ nodes, edges }: Props) {
  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
