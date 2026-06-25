import type { RoadmapNode, RoadmapSection, NodeLevel } from '@/data/frontendRoadmap';

type JsonNode = Record<string, unknown>;

const NIL = '';

function toKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function mapLevel(type: string): NodeLevel {
  switch (type?.toLowerCase()) {
    case 'subtopic': return 'topic';
    case 'link':     return 'optional';
    default:         return 'topic';
  }
}

export type TransformResult = {
  sections: RoadmapSection[];
  labelMap: Record<string, string>;
};

// ── helpers ──────────────────────────────────────────────────────────

function getLabel(n: JsonNode): string {
  const data = n.data as JsonNode | undefined;
  return String(data?.label ?? data?.text ?? n.id ?? NIL);
}

function getType(n: JsonNode): string {
  return String(n.type ?? NIL).toLowerCase();
}

function getPos(n: JsonNode): { x: number; y: number } {
  const p = n.position as JsonNode | undefined;
  return {
    x: typeof p?.x === 'number' ? (p.x as number) : 0,
    y: typeof p?.y === 'number' ? (p.y as number) : 0,
  };
}

function strId(n: JsonNode): string {
  return String(n.id ?? NIL);
}

function extractDescription(n: JsonNode): string | undefined {
  const candidates: unknown[] = [];

  const data = n.data as JsonNode | undefined;
  if (data) {
    candidates.push(data.description, data.content);
  }
  // Some roadmap schemas store description at the top-level node
  candidates.push(n.description, n.content);

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) {
      return c.trim();
    }
  }
  return undefined;
}

function extractLinks(n: JsonNode): Array<{ title: string; url: string }> {
  const candidates: unknown[] = [];

  const data = n.data as JsonNode | undefined;
  if (data) {
    candidates.push(data.resources, data.links);
  }
  candidates.push(n.links);

  const out: Array<{ title: string; url: string }> = [];

  for (const raw of candidates) {
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      if (!item || typeof item !== 'object') continue;
      const obj = item as Record<string, unknown>;
      const title = String(obj.title ?? obj.label ?? '');
      const url = String(obj.url ?? '');
      if (title && url) {
        out.push({ title, url });
      }
    }
  }

  return out;
}

function makeRoadmapNode(
  n: JsonNode,
  parentId: string,
  side: 'left' | 'right' | undefined,
  labelMap: Record<string, string>,
): RoadmapNode {
  const label = getLabel(n);
  const key = toKey(label);
  labelMap[key] = label;
  return {
    id: strId(n),
    titleKey: key,
    level: mapLevel(getType(n)),
    parentId,
    side,
    description: extractDescription(n),
    links: extractLinks(n),
  };
}

function buildChildrenOf(edges: JsonNode[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const e of edges) {
    const src = String(e.source ?? NIL);
    const tgt = String(e.target ?? NIL);
    if (!src || !tgt) continue;
    if (!m.has(src)) m.set(src, []);
    m.get(src)!.push(tgt);
  }
  return m;
}

// ── main ─────────────────────────────────────────────────────────────

export function transformGithubJSON(raw: JsonNode): TransformResult {
  const rawNodes = (raw.nodes ?? []) as JsonNode[];
  const rawEdges = (raw.edges ?? []) as JsonNode[];

  if (rawNodes.length === 0) return { sections: [], labelMap: {} };

  // ── 1. Build lookup maps ──────────────────────────────────────────

  const nodeById = new Map<string, JsonNode>();
  for (const n of rawNodes) nodeById.set(strId(n), n);

  const childrenOf = buildChildrenOf(rawEdges);

  const labelMap: Record<string, string> = {};

  // ── 2. Detect data format ────────────────────────────────────────
  //     Some roadmaps (backend, devops, android) use `section` type
  //     as the spine. Frontend uses `topic` as the spine.
  //     `group` and `linksgroup` are edge‑case containers.

  const hasSection = rawNodes.some((n) => getType(n) === 'section');
  const hasGroup   = rawNodes.some((n) => getType(n) === 'group');
  const spineType  = hasSection || hasGroup ? 'section' : 'topic';

  const isSectionSpine = spineType === 'section';

  // ── 3. Order the spine ─────────────────────────────────────────────
  //     For section‑based data we sort by Y; for topic‑based we follow
  //     the topic→topic edge chain (DFS) to preserve pedagogy.

  let spineNodes: JsonNode[];

  if (isSectionSpine) {
    // Collect all section-like nodes; also include `group` & `linksgroup`
    const sectionLike = new Set(['section', 'group', 'linksgroup']);
    spineNodes = rawNodes
      .filter((n) => sectionLike.has(getType(n)))
      .sort((a, b) => getPos(a).y - getPos(b).y);
  } else {
    // Topic‑based spine — walk the topic→topic edge chain
    const topicIds = new Set(
      rawNodes.filter((n) => getType(n) === 'topic').map(strId),
    );
    const directParent = new Map<string, string>();
    for (const e of rawEdges) {
      const src = String(e.source ?? NIL);
      const tgt = String(e.target ?? NIL);
      if (src && tgt && !directParent.has(tgt)) directParent.set(tgt, src);
    }

    const spineRoots = rawNodes
      .filter((n) => {
        if (getType(n) !== 'topic') return false;
        const pid = directParent.get(strId(n));
        return !pid || !topicIds.has(pid);
      })
      .sort((a, b) => getPos(a).y - getPos(b).y);

    const visited = new Set<string>();
    const ordered: JsonNode[] = [];

    function walk(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      const n = nodeById.get(nodeId);
      if (n) ordered.push(n);
      const kids = (childrenOf.get(nodeId) ?? [])
        .map((id) => nodeById.get(id))
        .filter((k): k is JsonNode => k != null && getType(k) === 'topic')
        .sort((a, b) => getPos(a).y - getPos(b).y);
      for (const k of kids) walk(strId(k));
    }

    for (const r of spineRoots) walk(strId(r));
    spineNodes = ordered;
  }

  // ── 4. Determine child types ─────────────────────────────────────
  //     Section‑based: children are topic & subtopic nodes
  //     Topic‑based:   children are subtopic nodes only

  const childTypes = new Set(
    isSectionSpine ? ['topic', 'subtopic'] : ['subtopic'],
  );

  // ── 5. Build sections ─────────────────────────────────────────────

  const sections: RoadmapSection[] = spineNodes.map((sec) => {
    const secId  = strId(sec);
    const secX   = getPos(sec).x;
    const secLabel = getLabel(sec);
    const secKey   = toKey(secLabel);
    labelMap[secKey] = secLabel;

    const sectionNode: RoadmapNode = {
      id:           secId,
      titleKey:     secKey,
      level:        'section',
      parentId:     'root',
      description:  extractDescription(sec),
      links:        extractLinks(sec),
    };

    // Section-based roadmaps store children via edges TO the section
    // (not from it). Topic-based roadmaps use standard parent→child edges.
    let direct: JsonNode[];

    if (isSectionSpine) {
      // Incoming edges = sources pointing TO this section → those are children
      const incomingIds = rawEdges
        .filter((e) => String(e.target ?? NIL) === secId)
        .map((e) => String(e.source ?? NIL));
      direct = incomingIds
        .map((id) => nodeById.get(id))
        .filter((k): k is JsonNode => k != null && childTypes.has(getType(k)));
      // Also include any standard outgoing children
      const outgoing = (childrenOf.get(secId) ?? [])
        .map((id) => nodeById.get(id))
        .filter((k): k is JsonNode => k != null && childTypes.has(getType(k)));
      direct = [...direct, ...outgoing];
    } else {
      direct = (childrenOf.get(secId) ?? [])
        .map((id) => nodeById.get(id))
        .filter((k): k is JsonNode => k != null && childTypes.has(getType(k)));
    }

    // Deduplicate, sort by Y for pedagogical order, partition left/right
    const seen = new Set<string>();
    const unique = direct.filter((k) => {
      const id = strId(k);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    unique.sort((a, b) => {
      const dy = getPos(a).y - getPos(b).y;
      if (Math.abs(dy) > 10) return dy;
      return getPos(a).x - getPos(b).x;
    });

    const left: RoadmapNode[]  = [];
    const right: RoadmapNode[] = [];

    for (const k of unique) {
      const side: 'left' | 'right' = getPos(k).x < secX ? 'left' : 'right';
      const rn = makeRoadmapNode(k, secId, side, labelMap);
      (side === 'left' ? left : right).push(rn);
    }

    return { node: sectionNode, left, right };
  });

  // ── 6. Filter out empty sections ─────────────────────────────────
  const meaningful = sections.filter(
    (s) => s.left.length > 0 || s.right.length > 0 || spineNodes.length < 5,
  );

  return { sections: meaningful, labelMap };
}
