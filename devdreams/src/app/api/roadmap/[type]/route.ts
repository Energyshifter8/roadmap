import { NextRequest, NextResponse } from 'next/server';

const URLS: Record<string, string> = {
  frontend: 'https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json',
  backend:  'https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/backend/backend.json',
  devops:   'https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/devops/devops.json',
  mobile:   'https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/android/android.json',
};

function fallbackJSON() {
  return {
    nodes: [
      { id: 'fb-1', type: 'topic', position: { x: 0, y: 0 }, data: { label: 'Roadmap Unavailable' } },
      { id: 'fb-2', type: 'subtopic', position: { x: -200, y: 150 }, data: { label: 'Could not load roadmap data from GitHub.' } },
      { id: 'fb-3', type: 'subtopic', position: { x: 200, y: 150 }, data: { label: 'Showing fallback — check your connection.' } },
    ],
    edges: [
      { source: 'fb-1', target: 'fb-2' },
      { source: 'fb-1', target: 'fb-3' },
    ],
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const url = URLS[type];

    if (!url) {
      return NextResponse.json(fallbackJSON());
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(fallbackJSON());
    }

    const data: unknown = await res.json();

    if (!data || typeof data !== 'object' || !Array.isArray((data as Record<string, unknown>).nodes)) {
      return NextResponse.json(fallbackJSON());
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(fallbackJSON());
  }
}
