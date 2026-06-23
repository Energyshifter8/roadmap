import { NextRequest, NextResponse } from 'next/server';
import { ROADMAP_URLS, RoadmapType } from '@/lib/roadmapSources';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const url = ROADMAP_URLS[type as RoadmapType];
  if (!url) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return NextResponse.json({ error: 'Upstream failed' }, { status: 502 });
  const raw = await res.json();
  return NextResponse.json(raw);
}