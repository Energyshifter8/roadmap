'use client';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const styleMap: Record<string, React.CSSProperties> = {
  section: {
    background: '#f5a623',
    color: '#000',
    fontWeight: 700,
    fontSize: 13,
    padding: '8px 18px',
    borderRadius: 6,
    border: '2px solid #d4861a',
    minWidth: 180,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    cursor: 'default',
  },
  topic: {
    background: '#fef3c7',
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: 500,
    padding: '7px 14px',
    borderRadius: 5,
    border: '1.5px solid #f5a623',
    minWidth: 160,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  recommended: {
    background: '#fef3c7',
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: 500,
    padding: '7px 14px',
    borderRadius: 5,
    border: '1.5px solid #f5a623',
    minWidth: 160,
    textAlign: 'center',
    cursor: 'pointer',
  },
  optional: {
    background: '#f5f5f5',
    color: '#555',
    fontSize: 11,
    padding: '6px 12px',
    borderRadius: 5,
    border: '1.5px dashed #aaa',
    minWidth: 140,
    textAlign: 'center',
    cursor: 'pointer',
  },
  root: {
    background: '#f5a623',
    color: '#000',
    fontWeight: 800,
    fontSize: 16,
    padding: '10px 28px',
    borderRadius: 8,
    border: '2px solid #d4861a',
    minWidth: 200,
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  note: {
    background: '#f9f9f9',
    color: '#888',
    fontSize: 11,
    padding: '6px 14px',
    borderRadius: 5,
    border: '1px solid #ddd',
    minWidth: 160,
    textAlign: 'center',
    fontStyle: 'italic',
  },
};

export default function RoadmapNode({ data }: NodeProps) {
  const d = data as { label: string; level: string };
  const style = styleMap[d.level] ?? styleMap.topic;

  return (
    <div style={style}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />
      {d.label}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />
    </div>
  );
}
