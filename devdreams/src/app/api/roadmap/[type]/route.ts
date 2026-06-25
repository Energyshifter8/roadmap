import { type NextRequest, NextResponse } from "next/server";
import { frontendSections } from "@/data/frontendRoadmap";
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

function fallbackResult(type: string) {
  if (type === "frontend") {
    return { sections: frontendSections, labelMap: {} };
  }
  return { sections: [], labelMap: {} };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const url = URLS[type];

    if (!url) {
      return NextResponse.json(fallbackResult(type));
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(fallbackResult(type));
    }

    const data: unknown = await res.json();

    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).nodes)
    ) {
      return NextResponse.json(fallbackResult(type));
    }

    const result = transformGithubJSON(data as Record<string, unknown>);

    if (result.sections.length === 0) {
      return NextResponse.json(fallbackResult(type));
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
