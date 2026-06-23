'use client';
import { useState } from 'react';
import SidePanel from './SidePanel';
import { Badge } from '@/components/ui/badge';
import { RoadmapType } from '@/lib/roadmapSources';
import { frontendSections, type RoadmapNode, type NodeLevel } from '@/data/frontendRoadmap';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Props = { type: RoadmapType };

/* ── Node styling ──────────────────────────────────── */
const nodeStyles: Record<NodeLevel, string> = {
  root:
    'bg-amber-300 text-black font-bold text-base px-8 py-3 rounded-xl border-2 border-amber-400 ' +
    'shadow-[0_0_20px_rgba(234,179,8,0.15)]',
  section:
    'bg-gradient-to-b from-amber-300 to-amber-400 text-black font-semibold text-sm px-6 py-2.5 rounded-xl ' +
    'border border-amber-400/80 shadow-[0_0_14px_rgba(234,179,8,0.1)]',
  topic:
    'bg-zinc-900/80 text-zinc-200 text-xs px-3.5 py-2 rounded-lg border border-zinc-700/80 ' +
    'hover:border-zinc-400 hover:bg-zinc-800 transition-all duration-200 cursor-pointer select-none',
  recommended:
    'bg-zinc-900/80 text-amber-300 text-xs px-3.5 py-2 rounded-lg border border-amber-600/50 font-medium ' +
    'hover:border-amber-400 hover:bg-zinc-800 transition-all duration-200 cursor-pointer select-none',
  optional:
    'bg-zinc-900/40 text-zinc-500 text-xs px-3.5 py-2 rounded-lg border border-dashed border-zinc-700 ' +
    'hover:border-zinc-500 hover:text-zinc-400 transition-all duration-200 cursor-pointer select-none',
  note:
    'bg-zinc-900/30 text-zinc-500 text-xs px-4 py-2 rounded-lg border border-zinc-800 italic select-none',
};

/* ── NodeCard ──────────────────────────────────────── */
function NodeCard({ node, onClick }: { node: RoadmapNode; onClick: (n: RoadmapNode) => void }) {
  if (node.level === 'note') {
    return <div className={nodeStyles.note}>{node.label}</div>;
  }

  if (node.level === 'topic' || node.level === 'recommended' || node.level === 'optional') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'h-auto whitespace-nowrap leading-tight rounded-lg px-3.5 py-2 text-xs font-normal border ' +
          'transition-all duration-200 cursor-pointer',
          node.level === 'topic' && 'bg-zinc-900/80 text-zinc-200 border-zinc-700/80 hover:border-zinc-400 hover:bg-zinc-800',
          node.level === 'recommended' && 'bg-zinc-900/80 text-amber-300 border-amber-600/50 font-medium hover:border-amber-400 hover:bg-zinc-800',
          node.level === 'optional' && 'bg-zinc-900/40 text-zinc-500 border-dashed border-zinc-700 hover:border-zinc-500 hover:text-zinc-400',
        )}
        onClick={() => onClick(node)}
      >
        {node.label}
      </Badge>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none select-none rounded-xl',
        node.level === 'root' && nodeStyles.root,
        node.level === 'section' && nodeStyles.section,
      )}
    >
      {node.label}
    </div>
  );
}

/* ── Spine dot at each branch point ────────────────── */
function SpineDot() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-[5px] z-10">
      <div className="w-[11px] h-[11px] rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.55)]" />
      <div className="w-[19px] h-[19px] rounded-full bg-blue-500/20 absolute -inset-1 animate-pulse" />
    </div>
  );
}

/* ── Horizontal line from a child topic to the center ─ */
function ChildConnector({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 w-5 h-px bg-gradient-to-r',
        side === 'left'
          ? 'right-full from-transparent to-zinc-700/60'
          : 'left-full from-zinc-700/60 to-transparent',
      )}
    />
  );
}

/* ── Bracket line grouping multiple children ───────── */
function BracketLine({ side, count }: { side: 'left' | 'right'; count: number }) {
  return (
    <>
      {/* vertical bracket */}
      <div
        className={cn(
          'absolute top-2 bottom-2 w-px bg-zinc-700/40',
          side === 'left' ? 'right-0' : 'left-0',
        )}
      />
      {/* horizontal line from bracket midpoint to center */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 h-px bg-zinc-700/60',
          side === 'left' ? 'right-0 w-5' : 'left-0 w-5',
        )}
      />
      {/* small dot at bracket midpoint */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-600',
          side === 'left' ? 'right-0' : 'left-0',
        )}
      />
    </>
  );
}

/* ── Render side children ──────────────────────────── */
function SideChildren({
  children,
  side,
  onNodeClick,
}: {
  children: RoadmapNode[];
  side: 'left' | 'right';
  onNodeClick: (n: RoadmapNode) => void;
}) {
  if (children.length === 0) return null;

  return (
    <div className="relative flex flex-col justify-center gap-3">
      {children.length > 1 && <BracketLine side={side} count={children.length} />}

      <div className={cn(
        'flex flex-col gap-3',
        side === 'left' ? 'items-end pr-6' : 'items-start pl-6',
      )}>
        {children.map((child) => (
          <div key={child.id} className="relative">
            <ChildConnector side={side} />
            <NodeCard node={child} onClick={onNodeClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ───────────────────────────────────── */
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
      <div className="w-full h-[calc(100vh-52px)] overflow-y-auto bg-black [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800">
        <div className="relative mx-auto max-w-4xl px-4 py-10">
          {/* central spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-zinc-700 via-zinc-700/80 to-zinc-700/40" />

          {/* root */}
          <div className="relative flex justify-center mb-8">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-6 bg-gradient-to-b from-amber-400/40 to-zinc-700/60" />
            <div className={nodeStyles.root}>Front-end</div>
          </div>

          {/* sections */}
          <div className="relative space-y-2">
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

/* ── TimelineSection ───────────────────────────────── */
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
  const isNote = section.node.level === 'note';
  const isEmpty = !hasLeft && !hasRight;

  /* ── standalone section (no children) ── */
  if (isEmpty) {
    return (
      <div className="relative flex justify-center py-3">
        {!isLast && <SpineDot />}
        <div className={cn(isNote ? 'opacity-60' : '')}>
          <NodeCard node={section.node} onClick={onNodeClick} />
        </div>
      </div>
    );
  }

  /* ── section with children ── */
  const gridCols = hasLeft && hasRight
    ? 'grid-cols-[1fr_auto_1fr]'
    : hasLeft
      ? 'grid-cols-[1fr_auto]'
      : 'grid-cols-[auto_1fr]';

  return (
    <div className="relative py-3">
      <SpineDot />

      <div className={cn('grid items-start gap-x-4', gridCols)}>
        {/* ── left children ── */}
        {hasLeft && (
          <div className="flex justify-end">
            <SideChildren children={section.left} side="left" onNodeClick={onNodeClick} />
          </div>
        )}

        {/* ── center node ── */}
        <div className="relative z-10 flex justify-center pt-1">
          <NodeCard node={section.node} onClick={onNodeClick} />
        </div>

        {/* ── right children ── */}
        {hasRight && (
          <div className="flex justify-start">
            <SideChildren children={section.right} side="right" onNodeClick={onNodeClick} />
          </div>
        )}
      </div>
    </div>
  );
}
