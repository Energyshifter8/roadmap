'use client';
import { useState } from 'react';
import SidePanel from './SidePanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoadmapType } from '@/lib/roadmapSources';
import { frontendSections, type RoadmapNode, type NodeLevel } from '@/data/frontendRoadmap';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Props = { type: RoadmapType };

const levelStyles: Record<NodeLevel, string> = {
  root: 'bg-amber-300 text-black font-bold text-sm px-6 py-2.5 rounded-lg border-2 border-amber-400 shadow-lg',
  section: 'bg-amber-300 text-black font-semibold text-sm px-5 py-2 rounded-lg border border-amber-400',
  topic: 'bg-amber-100 text-zinc-800 text-xs px-4 py-2 rounded-md border border-amber-300 hover:border-amber-500 transition-colors cursor-pointer',
  recommended: 'bg-amber-100 text-zinc-800 text-xs px-4 py-2 rounded-md border border-amber-300 hover:border-amber-500 transition-colors cursor-pointer font-medium',
  optional: 'bg-zinc-100 text-zinc-600 text-xs px-4 py-2 rounded-md border border-dashed border-zinc-400 hover:border-zinc-600 transition-colors cursor-pointer',
  note: 'bg-zinc-100 text-zinc-600 text-xs px-4 py-2 rounded-md border border-zinc-300 italic select-none',
};

const badgeVariants: Record<NodeLevel, 'default' | 'secondary' | 'outline' | 'ghost'> = {
  root: 'default',
  section: 'default',
  topic: 'secondary',
  recommended: 'default',
  optional: 'outline',
  note: 'ghost',
};

function NodeCard({
  node,
  onClick,
}: {
  node: RoadmapNode;
  onClick: (n: RoadmapNode) => void;
}) {
  if (node.level === 'note') {
    return (
      <div className={levelStyles.note}>
        <span>{node.label}</span>
      </div>
    );
  }
  if (node.level === 'topic' || node.level === 'recommended' || node.level === 'optional') {
    return (
      <Badge
        variant={badgeVariants[node.level]}
        className={cn(
          'cursor-pointer whitespace-nowrap h-auto px-3 py-1.5 text-xs leading-tight',
          node.level === 'recommended' && 'border-amber-500 bg-amber-100 text-zinc-800 hover:bg-amber-200',
          node.level === 'optional' && 'border-dashed border-zinc-400 text-zinc-600',
          node.level === 'topic' && 'bg-amber-50 text-zinc-700 border-amber-200 hover:border-amber-400',
        )}
        onClick={() => onClick(node)}
      >
        {node.label}
      </Badge>
    );
  }
  return (
    <Button
      variant="default"
      className={cn(
        'pointer-events-none font-semibold text-sm',
        node.level === 'root' && 'bg-amber-300 text-black hover:bg-amber-300 border-2 border-amber-400 shadow-lg text-base px-6 py-5',
        node.level === 'section' && 'bg-amber-300 text-black hover:bg-amber-300 border border-amber-400 px-5',
      )}
    >
      {node.label}
    </Button>
  );
}

export default function RoadmapCanvas({ type }: Props) {
  const t = useTranslations('ui');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
    setPanelOpen(true);
  };

  if (type !== 'frontend') {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
        {t('comingSoon')}
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[calc(100vh-52px)] overflow-y-auto bg-black">
        <div className="relative mx-auto max-w-5xl px-4 py-8">
          {/* vertical spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-zinc-800" />

          {/* root node */}
          <div className="relative flex justify-center mb-6">
            <div className={levelStyles.root}>
              Front-end
            </div>
          </div>

          {/* sections */}
          <div className="relative space-y-3">
            {frontendSections.map((section, idx) => (
              <TimelineSection
                key={section.node.id}
                section={section}
                isLast={idx === frontendSections.length - 1}
                onNodeClick={handleNodeClick}
              />
            ))}
          </div>
        </div>
      </div>
      <SidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        node={selectedNode ? {
          label: selectedNode.label,
          level: selectedNode.level,
          description: selectedNode.description,
        } : null}
      />
    </>
  );
}

function TimelineSection({
  section,
  isLast,
  onNodeClick,
}: {
  section: { node: RoadmapNode; left: RoadmapNode[]; right: RoadmapNode[] };
  isLast: boolean;
  onNodeClick: (n: RoadmapNode) => void;
}) {
  const hasLeft = section.left.length > 0;
  const hasRight = section.right.length > 0;
  const maxChildren = Math.max(section.left.length, section.right.length);
  const rowCount = Math.max(1, maxChildren);
  const isNote = section.node.level === 'note';

  if (rowCount === 1 && !hasLeft && !hasRight) {
    return (
      <div className="relative flex justify-center py-2">
        {/* connector dot */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-700 -mt-1" />
        <div className={cn(isNote ? '' : '')}>
          <NodeCard node={section.node} onClick={onNodeClick} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-2">
      {/* connector dot */}
      {!isLast && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-700" />
      )}

      <div
        className="grid gap-x-6 gap-y-2"
        style={{
          gridTemplateColumns: hasLeft ? '1fr auto 1fr' : '1fr auto',
          justifyItems: hasLeft ? 'end' : 'center',
        }}
      >
        {/* left side topics */}
        {hasLeft && (
          <div className="flex flex-col items-end gap-2 self-center">
            {section.left.map((child) => (
              <div key={child.id} className="relative">
                {/* horizontal connector line */}
                <div className="absolute right-full top-1/2 w-4 h-px -translate-y-1/2 bg-zinc-700" />
                <NodeCard node={child} onClick={onNodeClick} />
              </div>
            ))}
          </div>
        )}

        {/* center: section node */}
        <div className="relative z-10 self-center">
          <NodeCard node={section.node} onClick={onNodeClick} />
        </div>

        {/* right side topics */}
        {hasRight && (
          <div className="flex flex-col items-start gap-2 self-center">
            {section.right.map((child) => (
              <div key={child.id} className="relative">
                {/* horizontal connector line */}
                <div className="absolute left-full top-1/2 w-4 h-px -translate-y-1/2 bg-zinc-700" />
                <NodeCard node={child} onClick={onNodeClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
