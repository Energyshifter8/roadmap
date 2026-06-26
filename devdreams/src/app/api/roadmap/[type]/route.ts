import { type NextRequest, NextResponse } from "next/server";
import { transformGithubJSON } from "@/lib/transformToSections";

const URLS: Record<string, string> = {
  frontend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json",
  backend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/backend/backend.json",
  devops:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/devops/devops.json",
  mobile:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/android/android.json",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const url = URLS[type];
  if (!url) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const raw = await res.json();
    const { sections, labelMap } = transformGithubJSON(raw);
    return NextResponse.json({ sections, labelMap });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
