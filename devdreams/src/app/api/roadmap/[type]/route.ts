import { NextRequest, NextResponse } from 'next/server';
import { ROADMAP_GITHUB_URLS, RoadmapType } from '@/lib/roadmapSources';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  const url = ROADMAP_GITHUB_URLS[type as RoadmapType];
  if (!url) {
    return NextResponse.json({ error: 'Unknown roadmap type' }, { status: 404 });
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}